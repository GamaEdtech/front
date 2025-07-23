<template>
  <div>
    <!--Start: menu button-->
    <v-btn
      class="d-block d-md-none px-5"
      style="
        z-index: 10;
        bottom: 16px;
        right: 16px;
        height: 52px;
        position: fixed;
        font-weight: 500;
      "
      min-width="40"
      x-large
      color="teal"
      dark
      rounded
      @click.stop="drawer = !drawer"
    >
      <v-icon style="font-size: 24px"> mdi-format-list-numbered </v-icon>
      <v-slide-x-reverse-transition>
        <span v-show="expandListMenu" style="font-size: 1.5rem" class="text-h6"
          >&nbsp;List</span
        >
      </v-slide-x-reverse-transition>
    </v-btn>
    <!--End: menu button-->

    <!-- Start : Category -->
    <common-category />
    <!-- End:Category -->

    <!-- Start:Lesson title -->
    <!-- Desktop -->
    <section class="lesson d-none d-md-block">
      <v-container class="lesson-section">
        <v-row>
          <v-col md="3" cols="12" class="lesson-details">
            <div class="d-flex flex-column details-content">
              <div class="last-update mb-3">
                <i class="fa-solid fa-calendar-days mr-2"></i>Last update:
                {{ tutorialInfo.up_date.split(" ")[0] }}
              </div>
              <div class="visit mb-3">
                <i class="fa-solid fa-eye mr-2"></i>Viewed:
                {{ tutorialInfo.views }}
              </div>
              <div class="error-report pointer" @click="openCrashReportDialog">
                <i class="fa-solid fa-circle-exclamation mr-2"></i>Crash report
              </div>
            </div>
          </v-col>
          <v-col md="9" cols="12" class="lessons-title">
            <div class="d-flex flex-column text-center lesson-content">
              <p class="lesson-title gama-text-h5 mb-4">{{ lesson.title }}</p>
              <p class="lesson-subtitle gama-text-h6">
                {{ lesson.topic_title }}
              </p>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Mobile -->
    <section class="lesson d-block d-md-none">
      <v-container class="lesson-section">
        <v-row>
          <v-col cols="12">
            <div class="d-flex flex-column text-center lesson-content">
              <p class="lesson-title gama-text-h5 mb-4">{{ lesson.title }}</p>
              <p class="lesson-subtitle gama-text-6">
                {{ lesson.topic_title }}
              </p>
            </div>
          </v-col>
          <v-col cols="12" class="lesson-details">
            <v-divider />
            <v-row>
              <v-col cols="5" class="last-update">
                <i class="fa-solid fa-calendar-days mr-2"></i>
                {{ tutorialInfo.up_date.split(" ")[0] }}
              </v-col>
              <v-col cols="3" class="visit">
                <i class="fa-solid fa-eye mr-2"></i>{{ tutorialInfo.views }}
              </v-col>
              <v-col cols="4" class="error-report">
                <div
                  class="error-report pointer"
                  @click="openCrashReportDialog"
                >
                  <i class="fa-solid fa-circle-exclamation mr-2"></i>Crash
                  report
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </section>
    <!-- End: Lesson title -->

    <!-- Start : Card -->
    <!--    <section class="cards">-->
    <!--      <v-container class="pa-0">-->
    <!--        <v-row>-->
    <!--          <v-col cols="12" md="6" class="pb-0">-->
    <!--            <v-card elevation="2" outlined class="pa-3 card-body">-->
    <!--              <v-row class="card">-->
    <!--                <v-col cols="4" md="3">-->
    <!--                  <div class="card-image">-->
    <!--                    <img :src="require('@/assets/images/' + card.img)" alt="" />-->
    <!--                  </div>-->
    <!--                </v-col>-->
    <!--                <v-col cols="8" md="9" class="d-flex align-center">-->
    <!--                  <div class="d-flex flex-column card-details">-->
    <!--                    <p class="card-title">{{ card.videoTitle }}</p>-->
    <!--                    <p class="video-teacher">-->
    <!--                      <i class="fa-solid fa-user mr-2"></i>{{ card.videoTeacher }}-->
    <!--                    </p>-->
    <!--                    <div class="d-flex justify-space-between">-->
    <!--                      <p class="durition">-->
    <!--                        <i class="fa-regular fa-clock mr-2"></i>Time:-->
    <!--                        {{ card.durition }}-->
    <!--                      </p>-->
    <!--                      <nuxt-link to="" class="more-link d-none d-md-block">More</nuxt-link>-->
    <!--                    </div>-->
    <!--                  </div>-->
    <!--                </v-col>-->
    <!--              </v-row>-->
    <!--            </v-card>-->
    <!--          </v-col>-->
    <!--          <v-col cols="12" md="6">-->
    <!--            <v-card elevation="2" outlined class="pa-3 card-body">-->
    <!--              <v-row class="card">-->
    <!--                <v-col cols="4" md="3">-->
    <!--                  <div class="card-image">-->
    <!--                    <img :src="require('@/assets/images/' + card.img2)" alt="" />-->
    <!--                  </div>-->
    <!--                </v-col>-->
    <!--                <v-col cols="8" md="9" class="d-flex align-center">-->
    <!--                  <div class="d-flex flex-column card-details">-->
    <!--                    <p class="card-title">{{ card.bookTitle }}</p>-->
    <!--                    <p class="test-number">-->
    <!--                      <i class="fa-solid fa-grip-lines mr-2"></i>Number of tests: {{-->
    <!--                          card.testNumber-->
    <!--                      }}-->
    <!--                    </p>-->
    <!--                    <div class="d-flex justify-space-between">-->
    <!--                      <p class="levels">-->
    <!--                        <i class="fa-solid fa-arrow-trend-up mr-2"></i>Difficulty-->
    <!--                        :{{ card.easy }} {{ card.medium }} {{ card.hard }}-->
    <!--                      </p>-->
    <!--                      <nuxt-link to="" class="more-link d-none d-md-block">More</nuxt-link>-->
    <!--                    </div>-->
    <!--                  </div>-->
    <!--                </v-col>-->
    <!--              </v-row>-->
    <!--            </v-card>-->
    <!--          </v-col>-->
    <!--        </v-row>-->
    <!--      </v-container>-->
    <!--    </section>-->
    <!-- End: Cart -->
    <!-- Start : Book -->
    <v-container>
      <section class="book">
        <v-row>
          <v-col md="3" class="d-none d-md-block">
            <div class="cataloge pa-2">
              <div class="cataloge-content">
                <common-TutorialTree
                  v-if="filteredTree.length"
                  :items="filteredTree"
                  :is-root-level="true"
                />
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="9" class="pa-0 pa-md-3">
            <div class="book-contents pa-3 pa-md-6">
              <v-navigation-drawer
                v-model="drawer"
                class="sidebar-nav pa-5"
                width="320"
              >
                <common-TutorialTree
                  v-if="filteredTree.length"
                  :items="filteredTree"
                  :is-root-level="true"
                />
              </v-navigation-drawer>
              <div class="book-content" ref="bookContentRef">
                <div class="bookText e-mathjax" v-html="tutorialInfo.content" />
              </div>
            </div>
          </v-col>
        </v-row>
      </section>
    </v-container>

    <!-- End: Book -->
    <!-- Start : Sample Test -->
    <!--    <related-content/>-->
    <!-- End : Sample test -->
    <!-- Start: Feed -->
    <!--    <section class="feed">-->
    <!--      <v-container class="pa-4 pa-md-12 pt-10">-->
    <!--        <v-row>-->
    <!--         <v-col cols="12" md="6">-->
    <!--           <latest-training-content/>-->
    <!--         </v-col>-->

    <!--          <v-col cols="12" md="6" class="related-ask-test py-0 d-flex flex-column justify-space-between">-->
    <!--              <related-qa/>-->

    <!--              <related-online-exam/>-->
    <!--          </v-col>-->

    <!--        </v-row>-->
    <!--      </v-container>-->
    <!--    </section>-->
    <!-- End: Feed -->

    <!-- Sidebar -->

    <common-crash-report ref="crashReportRef" />
  </div>
</template>
<script setup>
import { useRuntimeConfig } from "nuxt/app";
import { useNuxtApp } from "#app";
import {
  ref,
  watch,
  nextTick,
  onMounted,
  onBeforeUnmount,
  computed,
} from "vue";

const config = useRuntimeConfig();
const { $renderMathInElement, $ensureMathJaxReady } = useNuxtApp();
const bookContentRef = ref(null);

const route = useRoute();

// Fetch tutorial data
let { data: tutorialInfo, error: tutorialError } = await useAsyncData(
  `tutorialInfo-${route.params.id}`,
  async () => {
    try {
      const response = await useApiService.get(
        `/api/v1/tutorials/${route.params.id}`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  },
  {
    watch: [() => route.params.id]
  }
);

// Fetch lesson tree
const { data: lessonTree, error: lessonTreeError } = await useAsyncData(
  `lessonTree-${route.params.id}`,
  async () => {
    try {
      if (!tutorialInfo.value?.lesson) return null;
      const response = await useApiService.get(
        `/api/v1/tutorials/lessonTree/${tutorialInfo.value.lesson}`
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }
);

const filteredTree = computed(
  () =>
    lessonTree.value?.list?.filter(
      (x) => x.tutorials?.length > 0 || x.chapters?.length > 0
    ) || []
);

const lessonInfo = tutorialInfo.value?.title?.split("|") || [];
const lesson = {
  title: lessonInfo[0] || "",
  topic_title: lessonInfo[1] || "",
};

const typesetMathInSpecificContainer = async (containerRef) => {
  if (process.client && containerRef.value) {
    try {
      await $ensureMathJaxReady();

      if (!window.MathJax || !window.MathJax.Hub) {
        return;
      }

      let elementToProcess = null;
      if (
        containerRef.value.$el &&
        containerRef.value.$el instanceof HTMLElement
      ) {
        elementToProcess = containerRef.value.$el;
      } else if (containerRef.value instanceof HTMLElement) {
        elementToProcess = containerRef.value;
      }

      if (elementToProcess) {
        await nextTick();
        $renderMathInElement(elementToProcess);
      }
    } catch (error) {
      console.error("Error during MathJax typesetting:", error);
    }
  }
};
onMounted(() => {
  typesetMathInSpecificContainer(bookContentRef);
  activeMenu.value = route.params.id;
  if (process.client) {
    window.addEventListener("scroll", handleScroll);
  }
});

watch(
  () => tutorialInfo.value?.content,
  (newContent, oldContent) => {
    if (newContent && newContent !== oldContent) {
      nextTick(() => {
        typesetMathInSpecificContainer(bookContentRef);
      });
    }
  }
);

const expandListMenu = ref(true);
const drawer = ref(false);
const activeMenu = ref(null);
const requestURL = ref(useRequestURL().host);

onBeforeUnmount(() => {
  if (process.client) {
    window.removeEventListener("scroll", handleScroll);
  }
});

const handleScroll = () => {
  if (window.scrollY > 1000) expandListMenu.value = false;
  else expandListMenu.value = true;
};

const crashReportRef = ref(null);
const openCrashReportDialog = () => {
  crashReportRef.value.dialog = true;
  crashReportRef.value.form.type = "tutorial";
};

useHead({
  title: tutorialInfo.value?.title || "",
  link: [
    {
      rel: "canonical",
      href: `https://${requestURL.value}/tutorial/${tutorialInfo.value.id}/${tutorialInfo.value.title_url}`,
    },
  ],
});
</script>
<style>
.video-wrapper {
  width: 100%;
  margin: auto;
  max-width: 700px;
}

.panel-body {
  overflow-x: auto !important;
}

.book-content {
  overflow-x: auto !important;
}

.table-holder {
  overflow-x: auto !important;
}

.book-content img {
  max-width: 86vw !important;
  margin-right: 0.1rem !important;
  margin-left: 0.1rem !important;
}

/*Message style section*/
.bookText .message {
  padding: 15px !important;
  max-width: 100vw !important;
  border-radius: 5px;
  margin-bottom: 12px;
}

.bookText .segment {
  padding: 15px !important;
  border-radius: 5px;
  margin-bottom: 12px;
}

.bookText .ui.message.red {
  background-color: #fff !important;
  color: red;
  box-shadow: 0 0 0 1px red inset, 0 0 0 0 transparent;
}

.bookText .ui.message.blue {
  background-color: #fff !important;
  color: blue;
  box-shadow: 0 0 0 1px blue inset, 0 0 0 0 transparent;
}

.bookText .ui.message.green {
  background-color: #fff !important;
  color: green;
  box-shadow: 0 0 0 1px green inset, 0 0 0 0 transparent;
}

.bookText .ui.message.yellow {
  background-color: #fff !important;
  color: #b58105;
  box-shadow: 0 0 0 1px #b58105 inset, 0 0 0 0 transparent;
}

/*End message style section*/

/*Segment section*/
.bookText .ui.segment.red {
  background-color: #fff !important;
  color: #000000;
  border-top: 2px solid red;
}

.bookText .ui.segment.red h2 {
  color: red !important;
  background: transparent !important;
}

.bookText .ui.segment.blue {
  background-color: #fff !important;
  color: #000000;
  border-top: 2px solid blue;
}

.bookText .ui.segment.blue h2 {
  color: red !important;
  background: transparent !important;
}

.bookText .ui.segment.green {
  background-color: #fff !important;
  color: #000000;
  border-top: 2px solid green;
}

.bookText .ui.segment.green h2 {
  color: red !important;
  background: transparent !important;
}

.bookText .ui.segment.brown {
  background-color: #fff !important;
  color: #000000;
  border-top: 2px solid #795548;
}

.bookText .ui.segment.brown h2 {
  color: red !important;
  background: transparent !important;
}

/*End section section*/

.bookText .ui.table {
  width: 100%;
  background: #fff;
  margin: 1em 0;
  border: 1px solid rgba(34, 36, 38, 0.15);
  box-shadow: none;
  border-radius: 0.28571429rem;
  text-align: left;
  color: rgba(0, 0, 0, 0.87);
  border-collapse: separate;
  border-spacing: 0;
}

/*Tutorial details table style*/
.bookText .ui.table td {
  padding: 20px;
}

/*End tutorial details table style*/

/*Tutorial details image caption*/
.bookText figcaption {
  background-color: #efeeee;
  padding: 5px 5px 5px 5px;
  border-radius: 5px;
  font-size: 14px;
}

/*End tutorial details image caption*/

@media screen and (max-width: 600px) {
  .tables {
    display: inline;
    flex-direction: column;
  }
}
</style>
