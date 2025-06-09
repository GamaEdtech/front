<template>
  <v-container class="test-maker">
    <v-card id="participating-exam-header">
      <v-card-text>
        <v-row class="text-center">
          <v-col cols="4">
            <p>
              Remaining time:
              <ClientOnly>
                <v-chip label color="teal" variant="tonal">
                  {{ hhmmss(examStats.remainTime) }}
                </v-chip>
              </ClientOnly>
            </p>
          </v-col>
          <v-col cols="4">
            <a
              :href="
                examStats.nextNotAnswer
                  ? `#item-${examStats.nextNotAnswer}`
                  : ''
              "
              @click="updateNextNotAnswer()"
            >
              Unanswered questions:
              <ClientOnly>
                <v-chip label color="teal" variant="tonal">
                  {{
                    contentData?.tests?.length
                      ? contentData.tests.length -
                        Object.keys(examStats.answerData).length
                      : 0
                  }}
                </v-chip>
              </ClientOnly>
            </a>
          </v-col>
          <v-col cols="4">
            <a
              :href="examStats.nextPin ? `#item-${examStats.nextPin}` : '#'"
              @click="updateNextPin()"
            >
              Pined question:
              <ClientOnly>
                <v-chip label color="teal" variant="tonal">
                  {{ examStats.pinQuestionsArr.length }}
                </v-chip>
              </ClientOnly>
            </a>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <ClientOnly>
      <v-card class="test-list mb-4">
        <v-card-title class="text-h4 font-weight-bold py-6">
          {{ contentData?.exam?.title || '' }}
        </v-card-title>
        <v-card-text>
          <v-divider class="mb-4" />
          <v-row>
            <v-col
              :id="`item-${item.id}`"
              class="bookmark-target"
              cols="12"
              v-show="contentData?.tests?.length > 0"
              v-for="(item, key) in contentData?.tests || []"
              :key="item.id"
            >
              <div id="test-question">
                <div class="d-flex">
                  <div>{{ key + 1 }})&nbsp;</div>
                  <div class="math-content" v-html="item.question" />
                </div>
                <img v-if="item.q_file" :src="item.q_file" />
              </div>

              <v-radio-group
                @change="updateNotAnswerData(item.id)"
                v-model="examStats.answerData[item.id]"
              >
                <v-radio value="1">
                  <template #label>
                    <div class="answer">
                      <span>1)</span>
                      <span class="math-content" v-html="item.answer_a"></span>
                    </div>
                  </template>
                </v-radio>
                <v-radio value="2">
                  <template #label>
                    <div class="answer">
                      <span>2)</span>
                      <span class="math-content" v-html="item.answer_b"></span>
                    </div>
                  </template>
                </v-radio>
                <v-radio value="3">
                  <template #label>
                    <div class="answer">
                      <span>3)</span>
                      <span class="math-content" v-html="item.answer_c"></span>
                    </div>
                  </template>
                </v-radio>
                <v-radio value="4">
                  <template #label>
                    <div class="answer">
                      <span>4)</span>
                      <span class="math-content" v-html="item.answer_d"></span>
                    </div>
                  </template>
                </v-radio>
              </v-radio-group>
              <v-row>
                <v-col cols="6">
                  <v-btn icon="mdi-eraser" size="x-small" @click="eraseTest(item.id)"></v-btn>
                  <v-btn
                    icon="mdi-pin"
                    size="x-small"
                    :color="
                      examStats.pinQuestionsArr.find((x) => x === item.id)
                        ? 'teal'
                        : ''
                    "
                    @click="pinQuestion(item.id)"
                  ></v-btn>
                </v-col>
              </v-row>
              <v-divider class="mt-3" />
            </v-col>
            <v-col
              v-show="!contentData?.tests?.length"
              cols="12"
              class="text-center"
            >
              <p>Oops! no data found</p>
            </v-col>
          </v-row>
          <v-row class="mb-16">
            <v-col cols="12" md="6" class="pb-0">
              <v-btn
                @click="endExam()"
                :loading="submit_loading"
                size="large"
                color="teal"
                class="text-white"
                block
              >
                Send answers
              </v-btn>
            </v-col>
            <v-col cols="12" md="6">
              <v-btn size="large" variant="outlined" color="error" to="/search?type=azmoon" block>
                Discard
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </ClientOnly>
  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { definePageMeta, useAsyncData, useNuxtApp } from '#imports';

definePageMeta({
  title: 'Start online exam'
});

const route = useRoute();
const router = useRouter();
const { $renderMathInElement, $ensureMathJaxReady } = useNuxtApp();

// Reactive state
const contentData = ref({
  exam: { title: '', azmoon_time: 0 },
  tests: [],
  startID: ''
});
const submit_loading = ref(false);
const allExamStats = ref([]);
const examStats = reactive({
  id: '',
  remainTime: 0,
  pinQuestionsArr: [],
  notAnsweredArr: [],
  answerData: {},
  nextPin: '',
  nextNotAnswer: '',
});

// Fetch exam data
const { data } = await useAsyncData('examStart', async () => {
  try {
    const content = await $fetch(`/api/v1/exams/start/${route.params.id}`);
    if (content.status === 1) {
      return content.data;
    }
    return null;
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data) {
      await router.push(`/exam/result/${error.response.data.data.id}`);
    }
    return null;
  }
});

// Initialize exam stats
const initNotAnswered = () => {
  if (!contentData.value?.tests) return;
  
  examStats.notAnsweredArr = [];
  for (const test of contentData.value.tests) {
    examStats.notAnsweredArr.push(test.id);
  }
};

// Update local storage
const updateLocalStorage = () => {
  if (process.server) return;
  
  const index = allExamStats.value.findIndex(x => x.id === examStats.id);
  if (index === -1) {
    allExamStats.value.push(JSON.parse(JSON.stringify(examStats)));
  } else {
    allExamStats.value[index] = JSON.parse(JSON.stringify(examStats));
  }
  localStorage.setItem('allExamStats', JSON.stringify(allExamStats.value));
};

// Render MathJax in all elements with class math-content
const renderMathJax = async () => {
  if (process.server) return;
  
  await nextTick();
  await $ensureMathJaxReady();
  
  const mathElements = document.querySelectorAll('.math-content');
  if (mathElements && mathElements.length > 0) {
    mathElements.forEach(element => {
      $renderMathInElement(element);
    });
  }
};

// Timer functions
const countDownTimer = () => {
  if (process.server) return;
  
  if (examStats.remainTime > 0) {
    setTimeout(() => {
      examStats.remainTime -= 1;
      countDownTimer();
      updateLocalStorage();
    }, 1000);
  } else {
    endExam();
  }
};

const hhmmss = (secs) => {
  let minutes = Math.floor(secs / 60);
  secs = secs % 60;
  const hours = Math.floor(minutes / 60);
  minutes = minutes % 60;
  
  if (hours) {
    return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
  } else {
    return `${pad(minutes)}:${pad(secs)}`;
  }
};

const pad = (num) => {
  return ('0' + num).slice(-2);
};

// Question management
const pinQuestion = (question_id) => {
  const index = examStats.pinQuestionsArr.findIndex(val => val === question_id);
  if (index === -1) {
    examStats.pinQuestionsArr.push(question_id);
    // Init next pin for first time
    if (examStats.pinQuestionsArr.length === 1) {
      examStats.nextPin = question_id;
    }
  } else {
    examStats.pinQuestionsArr.splice(index, 1);
  }
  updateLocalStorage();
};

const updateNextPin = () => {
  if (examStats.pinQuestionsArr.length) {
    const index = examStats.pinQuestionsArr.findIndex(x => x === examStats.nextPin);
    if (index + 1 === examStats.pinQuestionsArr.length) {
      examStats.nextPin = examStats.pinQuestionsArr[0];
    } else {
      examStats.nextPin = examStats.pinQuestionsArr[index + 1];
    }
  }
  updateLocalStorage();
};

const updateNextNotAnswer = () => {
  if (examStats.notAnsweredArr.length) {
    const index = examStats.notAnsweredArr.findIndex(x => x === examStats.nextNotAnswer);
    if (index + 1 === examStats.notAnsweredArr.length) {
      examStats.nextNotAnswer = examStats.notAnsweredArr[0];
    } else {
      examStats.nextNotAnswer = examStats.notAnsweredArr[index + 1];
    }
  }
  updateLocalStorage();
};

const eraseTest = (question_id) => {
  delete examStats.answerData[question_id];
  examStats.notAnsweredArr.push(question_id);
  updateLocalStorage();
};

const updateNotAnswerData = (item_id) => {
  const index = examStats.notAnsweredArr.findIndex(x => x === item_id);
  if (index !== -1) {
    examStats.notAnsweredArr.splice(index, 1);
  }
};

// End exam and submit answers
const endExam = async () => {
  submit_loading.value = true;

  // Delete from local storage
  const index = allExamStats.value.findIndex(x => x.id === examStats.id);
  if (index !== -1) {
    allExamStats.value.splice(index, 1);
    if (process.client) {
      localStorage.setItem('allExamStats', JSON.stringify(allExamStats.value));
    }
  }

  try {
    const formData = new FormData();
    formData.append('startID', contentData.value.startID);
    formData.append('answers', JSON.stringify(examStats.answerData));

    const response = await $fetch(`/api/v1/exams/end/${contentData.value.exam.id}`, {
      method: 'POST',
      body: formData
    });

    await router.push(`/exam/result/${response.data.id}`);
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data) {
      await router.push(`/exam/result/${error.response.data.data.id}`);
    }
  } finally {
    submit_loading.value = false;
  }
};

// Watch for changes to answer data
watch(() => examStats.answerData, () => {
  updateLocalStorage();
}, { deep: true });

// Set content data when available and initialize
watch(data, (newData) => {
  if (newData) {
    contentData.value = newData;
    
    if (process.client && contentData.value?.exam?.id) {
      examStats.id = contentData.value.exam.id;
      setupExamStats();
    }
  }
}, { immediate: true });

// Setup exam stats from localStorage or initialize new
const setupExamStats = () => {
  if (process.server) return;
  
  if (localStorage.getItem('allExamStats')) {
    allExamStats.value = JSON.parse(localStorage.getItem('allExamStats'));
  }
  
  const index = allExamStats.value.findIndex(x => x.id === examStats.id);
  if (index !== -1) {
    examStats.remainTime = allExamStats.value[index].remainTime;
    examStats.answerData = allExamStats.value[index].answerData || {};
    examStats.nextNotAnswer = allExamStats.value[index].nextNotAnswer;
    
    if (!allExamStats.value[index].notAnsweredArr?.length) {
      initNotAnswered();
    } else {
      examStats.notAnsweredArr = allExamStats.value[index].notAnsweredArr;
    }

    examStats.pinQuestionsArr = allExamStats.value[index].pinQuestionsArr || [];
  } else {
    examStats.remainTime = contentData.value.exam.azmoon_time * 60;
    initNotAnswered();
  }

  countDownTimer();
};

// Setup on client only
onMounted(async () => {
  if (contentData.value?.exam?.id) {
    setupExamStats();
  }
  
  // Need a small delay to let the DOM fully render
  setTimeout(async () => {
    await renderMathJax();
  }, 100);
});
</script>

<style scoped>
#participating-exam-header {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 5;
}

.bookmark-target {
  padding-top: 80px;
  margin-top: -80px;
}
</style>
