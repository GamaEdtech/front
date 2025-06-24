<template>
  <div class="test-details-content">
    <!--  Start: detail  -->
    <section>
      <v-container class="py-4">
        <div class="detail mt-8">
          <v-row>
            <v-col cols="12" md="12">
              <div class="d-flex mb-4">
                <div class="w-100">
                  <div class="description-holder my-4">
                    <ClientOnly>
                      <v-col
                        class="test-list"
                        cols="12"
                        ref="mathJaxContainerRef"
                      >
                        <div v-if="contentData">
                          <div
                            v-html="contentData.question"
                            class="question mb-2"
                          />
                          <img
                            class="answer-img"
                            :src="contentData.q_file"
                            v-if="contentData.q_file"
                          />

                          <v-radio-group
                            v-model="selectedOption"
                            @update:modelValue="fireSelectedOption"
                            v-if="isMultipleChoice"
                          >
                            <v-radio
                              value="1"
                              class="pl-2"
                              :class="{
                                'true-answer': isCorrectAnswer(1),
                                'false-answer': isIncorrectAnswer(1),
                              }"
                            >
                              <template #label>
                                <div class="answer">
                                  <span>1)&nbsp;</span>
                                  <span v-html="contentData.answer_a"></span>
                                  <img
                                    v-show="contentData.a_file"
                                    class="answer-img"
                                    :src="contentData.a_file"
                                  />
                                </div>
                              </template>
                            </v-radio>
                            <v-radio
                              value="2"
                              class="pl-2"
                              :class="{
                                'true-answer': isCorrectAnswer(2),
                                'false-answer': isIncorrectAnswer(2),
                              }"
                            >
                              <template #label>
                                <div class="answer">
                                  <span>2)&nbsp;</span>
                                  <span v-html="contentData.answer_b"></span>
                                  <img
                                    v-show="contentData.b_file"
                                    :src="contentData.b_file"
                                    class="answer-img"
                                  />
                                </div>
                              </template>
                            </v-radio>
                            <v-radio
                              value="3"
                              v-if="contentData.type === 'fourchoice'"
                              class="pl-2"
                              :class="{
                                'true-answer': isCorrectAnswer(3),
                                'false-answer': isIncorrectAnswer(3),
                              }"
                            >
                              <template #label>
                                <div class="answer">
                                  <span>3)&nbsp;</span>
                                  <span v-html="contentData.answer_c"></span>
                                  <img
                                    v-show="contentData.c_file"
                                    class="answer-img"
                                    :src="contentData.c_file"
                                  />
                                </div>
                              </template>
                            </v-radio>
                            <v-radio
                              value="4"
                              v-if="contentData.type === 'fourchoice'"
                              class="pl-2"
                              :class="{
                                'true-answer': isCorrectAnswer(4),
                                'false-answer': isIncorrectAnswer(4),
                              }"
                            >
                              <template #label>
                                <div class="answer">
                                  <span>4)&nbsp;</span>
                                  <span v-html="contentData.answer_d" />
                                  <img
                                    v-show="contentData.d_file"
                                    class="answer-img"
                                    :src="contentData.d_file"
                                  />
                                </div>
                              </template>
                            </v-radio>
                          </v-radio-group>

                          <v-expansion-panels
                            v-if="
                              contentData.answer_full ||
                              contentData.answer_full_file
                            "
                            class="mt-4"
                            v-model="fullAnswerPanel"
                          >
                            <v-expansion-panel class="light-green">
                              <v-expansion-panel-title
                                @click="showAnswer"
                                class="text-h5 font-weight-bold"
                              >
                                Show answer
                              </v-expansion-panel-title>
                              <v-expansion-panel-text class="light-green">
                                <div v-html="contentData.answer_full" />
                                <br />
                                <img
                                  v-show="contentData.answer_full_file"
                                  class="answer-img"
                                  :src="contentData.answer_full_file"
                                />
                              </v-expansion-panel-text>
                            </v-expansion-panel>
                          </v-expansion-panels>

                          <v-row class="mt-3">
                            <v-col cols="10">
                              <v-btn icon @click="openCrashReportDialog">
                                <v-icon color="blue"
                                  >mdi-bullhorn-outline</v-icon
                                >
                              </v-btn>
                            </v-col>
                          </v-row>
                        </div>
                      </v-col>
                      <template #fallback>
                        <div
                          style="
                            min-height: 200px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                          "
                        >
                          <v-progress-circular
                            indeterminate
                            color="teal"
                            size="50"
                          ></v-progress-circular>
                        </div>
                      </template>
                    </ClientOnly>
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-container>
    </section>
    <common-crash-report
      ref="crashReportRef"
      :report_type_list="report_type_list"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, type Ref } from "vue";
import { useAsyncData, useNuxtApp, useRoute, createError, useHead } from "#app";
import CommonCrashReport from "~/components/common/crash-report.vue";

const route = useRoute();
const { data: contentData } = await useAsyncData(
  `test-${route.params.id}`,
  async () => {
    try {
      const content = await useApiService.get(
        `/api/v1/examTests/${route.params.id}`,
        { full: true }
      );
      return content?.status === 1 ? content.data : null;
    } catch (e: any) {
      throw createError({
        statusCode: e?.response?.status || 500,
        message: "Error loading test",
        fatal: true,
      });
    }
  }
);

if (!contentData.value) {
  throw createError({
    statusCode: 404,
    message: "Test not found",
    fatal: true,
  });
}

useHead({
  title: computed(() => contentData.value?.title || "Online Test"),
});

const selectedOption = ref<string | null>(null);
const fullAnswerPanel = ref<number | undefined>(undefined);
const crashReportRef = ref<any>(null);
const report_type_list = ref([
  {
    value: 1,
    label: "The selected option in the answer sheet is not correct.",
  },
  {
    value: 2,
    label: "There is more than one correct option.",
  },
  {
    value: 3,
    label: "None of the options are correct.",
  },
  {
    value: 4,
    label: "There are typos in questions or options.",
  },
  {
    value: 5,
    label: "This test is similar to another test in the same test.",
  },
  {
    value: 6,
    label: "There are problems in the descriptive answer.",
  },
  {
    value: 7,
    label: "This test is out of budget or topic.",
  },
  {
    value: 8,
    label: "Other cases",
  },
]);

const mathJaxContainerRef = ref<HTMLElement | null>(null);
const { $renderMathInElement, $ensureMathJaxReady } = useNuxtApp();

const typesetMathInContainer = async () => {
  if (process.client && mathJaxContainerRef.value) {
    try {
      await $ensureMathJaxReady();
      if (!window.MathJax || !window.MathJax.Hub) return;

      const elementToProcess =
        (mathJaxContainerRef.value as any).$el ?? mathJaxContainerRef.value;

      if (elementToProcess instanceof HTMLElement) {
        await nextTick();
        $renderMathInElement(elementToProcess);
      }
    } catch (err) {
      console.error("Error during MathJax typesetting:", err);
    }
  }
};

watch(mathJaxContainerRef, (newEl) => {
  if (newEl) {
    console.log(
      "[Ref Watcher] MathJax container is now available in DOM. Typesetting..."
    );
    typesetMathInContainer();
  }
});

watch(fullAnswerPanel, (newValue) => {
  if (newValue !== undefined) {
    setTimeout(() => {
      typesetMathInContainer();
    }, 100);
  }
});

const isMultipleChoice = computed(() => {
  const type = contentData.value?.type;
  return type === "fourchoice" || type === "twochoice" || type === "tf";
});

const isCorrectAnswer = (option: number): boolean => {
  return !!(
    selectedOption.value &&
    Number(option) === Number(contentData.value?.true_answer)
  );
};

const isIncorrectAnswer = (option: number): boolean => {
  return !!(
    selectedOption.value &&
    Number(option) === Number(selectedOption.value) &&
    Number(option) !== Number(contentData.value?.true_answer)
  );
};

const showAnswer = () => {
  selectedOption.value = String(contentData.value?.true_answer);
};

const fireSelectedOption = () => {
  fullAnswerPanel.value = undefined;
};

const openCrashReportDialog = () => {
  if (crashReportRef.value) {
    crashReportRef.value.dialog = true;
    crashReportRef.value.form.id = route.params.id;
    crashReportRef.value.form.type = "examTest";
  }
};
</script>
<style>
.content_main_info {
  padding: 27px;
  background: #f5f5f5 !important;
  border-radius: 6px;
}

.content_main_info .creator_title {
  font-size: 18px;
}

.order-btn-holder {
  /*position: -webkit-sticky!important;*/
  position: fixed !important;
  bottom: 0 !important;
  right: 0 !important;
  left: 0 !important;
  z-index: 2 !important;
  border-top: 0.1rem solid #e1e2e3;
}

.order-btn-holder .v-btn {
  width: 40% !important;
}

.order-btn-holder span {
  font-size: 1.3rem;
}

p {
  font-size: 1.3rem !important;
}

.true-answer {
  background-color: #4caf50; /* Green background color */
  color: white !important; /* White text color */
  padding: 0.5rem 0.5rem 0.5rem 0;
  border-radius: 5px;
}

.false-answer {
  background-color: #f44336; /* Red background color */
  color: white !important; /* White text color */
  padding: 0.5rem 0.5rem 0.5rem 0;
  border-radius: 5px;
}

.answer {
  align-items: center;
  display: flex;
  height: auto;
  outline: none;
}

.answer-img {
  max-height: 15rem;
}
</style>
