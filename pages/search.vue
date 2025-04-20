<script setup>
definePageMeta({
  layout: "search",
});

const route = useRoute();
const router = useRouter();

// Reactive state for component
const breadcrumbs = ref([]);
const page_loading = ref(true);
const page = ref(1);
const items = ref([]);
const result_count = ref(0);
const dialog = ref(false);
const all_files_loaded = ref(false);
const expandFilterMenu = ref(true);
const timer = ref(null);

// Refs for components
const side_filter = ref(null);
const content_tabs = ref(null);

// Page metadata
const page_title = ref('');
const page_describe = ref('');

// Filter data
const boardList = ref({});
const gradeList = ref({});
const subjectList = ref({});
const paperTypeList = ref({});
const topicList = ref({});

// Fetch initial data
const fetchInitialData = async () => {
  let params = { type: "section" };
    let boardTitle = "";
    let gradeTitle = "";
    let subjectTitle = "";
    let paperTypeTitle = "";
    let multimediaTypeTitle = "";

  boardList.value = await $fetch(`/api/v1/types/list`, { params });

  if (route.query.section) {
    const boardIndex = boardList.value.data.findIndex(
      (x) => x.id === route.query.section
    );
    boardTitle = boardList.value.data[boardIndex].title;

    // Also list base list for filter
      params.type = "base";
    params.section_id = route.query.section;
    gradeList.value = await $fetch(`/api/v1/types/list`, { params });
  }

  if (route.query.base) {
    const gradeIndex = gradeList.value.data.findIndex((x) => x.id === route.query.base);
    gradeTitle = gradeList.value.data[gradeIndex].title;

    // Also list subject list for filter
      params.type = "lesson";
    params.base_id = route.query.base;
    subjectList.value = await $fetch(`/api/v1/types/list`, { params });
  }

  if (route.query.lesson) {
    const subjectIndex = subjectList.value.data.findIndex(
      (x) => x.id === route.query.lesson
    );
    subjectTitle = subjectList.value.data[subjectIndex].title;

    // Also list topic list for filter
      params.type = "topic";
    params.lesson_id = route.query.lesson;
    topicList.value = await $fetch(`/api/v1/types/list`, { params });
    }

  if (route.query.type == "test") {
      params.type = "test_type";
    paperTypeList.value = await $fetch(`/api/v1/types/list`, { params });

    if (route.query.test_type) {
      const paperTypeIndex = paperTypeList.value.data.findIndex(
        (x) => x.id == route.query.test_type
      );
      paperTypeTitle = paperTypeList.value.data[paperTypeIndex]?.title;
    }
  }

  if (route.query.type === "learnfiles" && route.query.file_type) {
      params.type = "file_type";
      const multimediaTypeList = await $fetch(`/api/v1/types/list`, {
        params,
      });
      const multimediaTypeIndex = multimediaTypeList.data.findIndex(
      (x) => x.id == route.query.file_type
      );
      multimediaTypeTitle = multimediaTypeList.data[multimediaTypeIndex].title;
    }

  if (route.query.type === "test") {
    page_title.value = boardTitle
        ? `${boardTitle} ${gradeTitle} ${subjectTitle} ${paperTypeTitle}`
        : "Educational Resources | K12 Education Papers and Materials";
    page_describe.value =
        "Enhance your learning with GamaTrain's extensive collection of online documents and texts, carefully curated to enrich your academic journey.";
  } else if (route.query.type === "learnfiles") {
    page_title.value = boardTitle
        ? `${boardTitle} ${gradeTitle} ${subjectTitle} ${multimediaTypeTitle}`
        : "Multimedia Interactive Educational Content; PowerPoint, Video, Class Voice, GamaTrain";
    page_describe.value =
        "Elevate your learning experience with GamaTrain's captivating multimedia content, including PowerPoint presentations, informative videos, and diverse educational materials.";
  } else if (route.query.type === "question") {
    page_title.value = `${boardTitle} ${gradeTitle} ${subjectTitle} Forum`;
    page_describe.value =
        "Engage in active learning and gain deeper insights through GamaTrain's interactive Q&A platform, where you can pose questions and seek support from fellow learners and experts.";
  } else if (route.query.type === "azmoon") {
    page_title.value = `${boardTitle} ${gradeTitle} ${subjectTitle} Online test`;
    page_describe.value =
        "Hone your skills and assess your knowledge with GamaTrain's online exams, designed to enhance your exam preparation and boost your confidence.";
  } else if (route.query.type === "dars") {
    page_title.value = `${boardTitle} ${gradeTitle} ${subjectTitle} Textbook`;
    page_describe.value =
        "Complement your studies with GamaTrain's comprehensive online tutorials, providing step-by-step guidance and practice opportunities to refine your understanding.";
  } else if (route.query.type === "tutor") {
    page_title.value = "Teacher";
    page_describe.value = "Teacher";
  }
};

// Call the initial data fetch
useAsyncData('search-initial-data', fetchInitialData);

// Set page metadata
useHead(() => ({
  title: page_title.value,
      meta: [
        {
          hid: "apple-mobile-web-app-title",
          name: "apple-mobile-web-app-title",
      content: page_title.value,
        },
        {
          hid: "og:title",
          name: "og:title",
      content: page_title.value,
        },
        {
          hid: "og:site_name",
          name: "og:site_name",
          content: "GamaTrain",
        },
        {
          hid: "description",
          name: "description",
      content: page_describe.value,
        },
        {
          hid: "og:description",
          name: "og:description",
      content: page_describe.value,
    },
  ],
}));

// Methods
const setPageTitle = (e) => {
  page_title.value = e;
};

// Get content list
const getContentList = async () => {
  if (!all_files_loaded.value) {
    page_loading.value = true;
    let params = {
      type: route.query.type,
      page: page.value,
      section: route.query.section,
      base: route.query.base,
      lesson: route.query.lesson,
      topic: route.query.topic,
      test_type: route.query.test_type,
      level: route.query.level,
      pdf: route.query.pdf,
      word: route.query.word,
      free: route.query.free,
      a_file: route.query.a_file,
      edu_year: route.query.edu_year,
      edu_month: route.query.edu_month,
    };

    if (route.query.type == "tutor") {
      params.state = route.query.state;
      params.city = route.query.city;
    }
    try {
      const response = await $fetch("/api/v1/search", { params });
      items.value.push(...response.data.list);
      result_count.value = response.data.num;
      content_tabs.value.content_statistics = response.data.types_stats;
      if (response.data.list.length === 0) {
        // For terminate auto load request
        all_files_loaded.value = true;
      }
    } catch (err) {
      console.error("Error fetching search results:", err);
    } finally {
      page_loading.value = false;
    }
  }
};

const openDialog = () => {
  dialog.value = true;
      setTimeout(() => {
    if (side_filter.value) {
      side_filter.value.setFilter("board", boardList.value?.data);
      if (route.query.section)
        side_filter.value.setFilter("grade", gradeList.value?.data);
      if (route.query.base)
        side_filter.value.setFilter("subject", subjectList.value?.data);
      if (route.query.lesson)
        side_filter.value.setFilter("topic", topicList.value?.data);
      if (route.query.type == "test")
        side_filter.value.setFilter(
              "paper_type",
          paperTypeList.value?.data
            );
        }
      }, 100);
};

const scroll = () => {
  // For infinite loading

  // Section for control filter menu button on mobile device
  if (window.scrollY > 1000) expandFilterMenu.value = false;
  else expandFilterMenu.value = true;
  // End section for control filter menu button on mobile device

      window.onscroll = () => {
    // Scroll position
        var scrollPosition =
          Math.max(
            window.pageYOffset,
            document.documentElement.scrollTop,
            document.body.scrollTop
          ) +
          window.innerHeight +
          50;
        let bottomOfWindow =
          scrollPosition >= document.documentElement.offsetHeight;

    // Avoid the number of requests
    if (timer.value) {
      clearTimeout(timer.value);
      timer.value = null;
    }

    // Load next page
    if (bottomOfWindow && all_files_loaded.value === false) {
      page_loading.value = true;
      timer.value = setTimeout(() => {
        page.value++;
        getContentList();
          }, 800);
        }
      };
};

// Component lifecycle
onMounted(() => {
  if (side_filter.value) {
    side_filter.value.setFilter("board", boardList.value?.data);
    if (route.query.section)
      side_filter.value.setFilter("grade", gradeList.value?.data);
    if (route.query.base)
      side_filter.value.setFilter("subject", subjectList.value?.data);
    if (route.query.lesson)
      side_filter.value.setFilter("topic", topicList.value?.data);
    if (route.query.type == "test")
      side_filter.value.setFilter(
        "paper_type",
        paperTypeList.value?.data
      );
  }

  if (!route.query.type) {
    const query = { type: "test" };
    page_title.value = "Papers";
    router.replace({ query });
    getContentList();
  } else {
    getContentList();
  }

  // Add scroll event listener
  if (process.client) {
    window.addEventListener("scroll", scroll);
  }
});

onBeforeUnmount(() => {
  // Remove scroll event listener
  if (process.client) {
    window.removeEventListener("scroll", scroll);
  }
});

// Watch for route query changes
watch(() => route.query.type, (val) => {
  page.value = 1;
  items.value = [];
  all_files_loaded.value = false;

  if (route.query.type === "learnfiles") {
    page_title.value =
      "Multimedia Interactive Educational Content; PowerPoint, Video, Class Voice, GamaTrain";
    page_describe.value =
      "Elevate your learning experience with GamaTrain's captivating multimedia content, including PowerPoint presentations, informative videos, and diverse educational materials.";
  } else if (route.query.type === "test") {
    page_title.value =
      "Educational Resources | K12 Education Papers and Materials";
    page_describe.value =
      "Enhance your learning with GamaTrain's extensive collection of online documents and texts, carefully curated to enrich your academic journey.";
  } else if (route.query.type === "question") {
    page_title.value =
      "Seek Clarification, Expand Your Understanding: GamaTrain's Q&A Forum";
    page_describe.value =
      "Engage in active learning and gain deeper insights through GamaTrain's interactive Q&A platform, where you can pose questions and seek support from fellow learners and experts.";
  } else if (route.query.type === "azmoon") {
    page_title.value = "Online Exams , Free Exams for Improving Education";
    page_describe.value =
      "Hone your skills and assess your knowledge with GamaTrain's online exams, designed to enhance your exam preparation and boost your confidence.";
  } else if (route.query.type === "dars") {
    page_title.value =
      "Master Concepts, Enhance Learning: GamaTrain's Online Tutorials";
    page_describe.value =
      "Complement your studies with GamaTrain's comprehensive online tutorials, providing step-by-step guidance and practice opportunities to refine your understanding.";
  } else if (route.query.type === "tutor") {
    page_title.value = "Teacher";
    page_describe.value = "Teacher";
  }

  side_filter.value.setBreadcrumbInfo();
  getContentList();
});

// Add watchers for year and month query params
watch(() => route.query.edu_year, (val) => {
  page.value = 1;
  items.value = [];
  all_files_loaded.value = false;
  getContentList();
});

watch(() => route.query.edu_month, (val) => {
  page.value = 1;
  items.value = [];
  all_files_loaded.value = false;
  getContentList();
});

watch(() => route.query.section, (val) => {
  page.value = 1;
  items.value = [];
  all_files_loaded.value = false;

  // Fire when click on tag in content card, set section value on side filter
  if (val > 0) side_filter.value.board_val = val;
  else side_filter.value.board_val = 0;
  // End fire when click on tag in content card, set section value on side filter

  side_filter.value.setBreadcrumbInfo();
  getContentList();
});

watch(() => route.query.base, (val) => {
  page.value = 1;
  items.value = [];
  all_files_loaded.value = false;

  // Fire when click on tag in content card, set base value on side filter
  if (val > 0) side_filter.value.base_val = val;
  else side_filter.value.base_val = 0;
  // Fire when click on tag in content card, set base value on side filter

  side_filter.value.setBreadcrumbInfo();
  getContentList();
});

watch(() => route.query.lesson, (val) => {
  page.value = 1;
  items.value = [];
  all_files_loaded.value = false;

  // Fire when click on tag in content card, set lesson value on side filter
  if (val > 0) side_filter.value.lesson_val = val;
  else side_filter.value.lesson_val = 0;
  // End click on tag in content card

  // Set breadcrumbs info
  side_filter.value.setBreadcrumbInfo();
  getContentList();
});

watch(() => route.query.topic, (val) => {
  page.value = 1;
  items.value = [];
  all_files_loaded.value = false;
  getContentList();
});

watch(() => route.query.test_type, (val) => {
  page.value = 1;
  items.value = [];
  all_files_loaded.value = false;
  getContentList();
});

watch(() => route.query.level, (val) => {
  page.value = 1;
  items.value = [];
  all_files_loaded.value = false;
  getContentList();
});

watch(() => route.query.word, (val) => {
  page.value = 1;
  items.value = [];
  all_files_loaded.value = false;
  getContentList();
});

watch(() => route.query.pdf, (val) => {
  page.value = 1;
  items.value = [];
  all_files_loaded.value = false;
  getContentList();
});

watch(() => route.query.free, (val) => {
  page.value = 1;
  items.value = [];
  all_files_loaded.value = false;
  getContentList();
});

watch(() => route.query.a_file, (val) => {
  page.value = 1;
  items.value = [];
  all_files_loaded.value = false;
  getContentList();
});

watch(() => route.query.state, (val) => {
  page.value = 1;
  items.value = [];
  all_files_loaded.value = false;

  // Fire when click on tag in content card, set state value on side filter
  if (val > 0) {
    side_filter.value.state_val = val;
  } else {
    side_filter.value.state_val = 0;
  }
  // End fire when click on tag in content card, set state value on side filter

  getContentList();
});

watch(() => route.query.city, (val) => {
  page.value = 1;
  items.value = [];
  all_files_loaded.value = false;

  // Fire when click on tag in content card, set city value on side filter
  if (val > 0) side_filter.value.city_val = val;
  else side_filter.value.city_val = 0;
  // End fire when click on tag in content card, set section value on side filter

  getContentList();
});
</script>

<template>
  <section class="search-page mt-md-16 mt-lg-0">
    <div class="container">
      <!--Mobile filter-->
      <v-row justify="center" class="d-block d-md-none">
        <v-dialog
          v-model="dialog"
          fullscreen
          hide-overlay
          transition="dialog-bottom-transition "
        >
          <v-card>
            <div style="position: sticky; top: 0; left: 0; right: 0; z-index: 10">
              <v-toolbar class="filter-btn-header">
                <v-toolbar-items>
                  <v-btn
                    class="text-h5 font-weight-bold"
                    variant="text"
                    @click="dialog = false"
                  >
                    Search in content
                  </v-btn>
                </v-toolbar-items>
                <v-spacer></v-spacer>
                <v-btn variant="icon" @click="dialog = false">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-toolbar>
            </div>
            <v-card-text>
              <search-filter
                ref="side_filter"
                class="mx-3"
                v-model="breadcrumbs"
                @setPageTitle="setPageTitle()"
              />
            </v-card-text>
            <v-card-actions
              style="position: sticky; bottom: 0; left: 0; right: 0"
            >
              <v-btn
                size="medium"
                block
                class="filter-show-result mr-4"
                @click="dialog = !dialog"
              >
                show result ({{ result_count }})
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-btn
          @click="openDialog()"
          class="d-block d-md-none"
          min-width="40"
          position="fixed"
          location="bottom right"
          style="z-index: 10"
          size="x-large"
          color="teal"
          variant="elevated"
          rounded="pill"
        >
          <v-icon> mdi-filter </v-icon>
          <v-slide-x-reverse-transition>
            <span v-show="expandFilterMenu" class="text-h6"> filter </span>
          </v-slide-x-reverse-transition>
        </v-btn>
      </v-row>
  
      <!-- Start  -->
      <section class="search-page mt-md-16 mt-lg-0">
        <v-container>
          <v-row>
            <v-col md="3" lg="3" class="d-none d-md-block">
              <v-card flat color="#f5f5f5" style="position: sticky; top: 1rem">
                <v-card-text>
                  <search-filter
                    ref="side_filter"
                    v-model="breadcrumbs"
                    @setPageTitle="setPageTitle"
                  />
                </v-card-text>
              </v-card>
            </v-col>
  
            <v-col lg="9" md="9" sm="12" class="search-contents px-0">
              <v-breadcrumbs
                :items="breadcrumbs"
                class="search-breadcrumb d-none d-md-block"
              >
                <template #divider>
                  <v-icon icon="mdi-chevron-right" />
                </template>
              </v-breadcrumbs>
  
              <!-- Search tabs -->
              <common-tabs
                ref="content_tabs"
              />
              <!-- End search tabs -->
  
              <div
                class="text-center"
                v-if="page_loading === false && items.length === 0"
              >
                Oops! no data found
              </div>
              <div v-else>
                <search-type-paper
                  v-if="$route.query.type === 'test'"
                  :items="items"
                />
                <search-type-multimedia
                  v-else-if="$route.query.type === 'learnfiles'"
                  :items="items"
                />
                <search-type-q-a
                  v-else-if="$route.query.type === 'question'"
                  :items="items"
                />
                <search-type-exam
                  v-else-if="$route.query.type === 'azmoon'"
                  :items="items"
                />
                <search-type-tutorial
                  v-else-if="$route.query.type === 'dars'"
                  :items="items"
                />
                <search-type-tutor
                  v-else-if="$route.query.type === 'tutor'"
                  :items="items"
                />
              </div>
              <v-row v-show="page_loading">
                <v-col cols="12" class="text-center">
                  <v-progress-circular
                    :size="40"
                    :width="4"
                    class="mt-12 mb-12"
                    color="orange"
                    indeterminate
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </section>
    </div>
  </section>
</template>

<style >
@media (min-width: 1264px) {
    .v-application .mt-lg-0 {
        margin-top: 0 !important;
    }
}
@media (min-width: 960px) {
    .v-application .mt-md-16 {
        margin-top: 64px !important;
    }
}
.search-page {
    border-top: 1px solid rgba(33, 33, 33, .08);
}

@media (min-width: 1264px) {
    .container {
        max-width: 1185px;
    }
}
@media (min-width: 960px) {
    .container {
        max-width: 900px;
    }
}
.container {
    margin-left: auto;
    margin-right: auto;
    padding: 12px;
    width: 100%;
}
@media only screen and (min-width: 1264px) {
    .container {
        max-width: 80% !important;
    }
}
@media only screen and (min-width: 600px) {
    .container {
        max-width: 100% !important;
    }
}
.content-items .content-item {
    min-height: 23rem !important;
}
.content-items .content-item .img-holder {
      min-width: 12rem;
      float: left;
}
.content-items .content-item .img-holder .book-no-img {
        padding-top: 3rem;
        min-height: 14rem !important;
      }
.content-items .content-item .content-holder {
      float: right;
    }
.content-items .content-item .item-content-footer {
      padding-left: 1.5rem;
      padding-right: 1.5rem;
}
.content-items .content-item .item-content-footer .gama-text-overline {
        color: #afb8c1;
      }

@media (min-width: 600px) {
  .content-items .content-item {
      min-height: 18.5rem !important;
  }
  .content-items .content-item .item-content-title {
        color: #263238;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box !important;
        -webkit-box-orient: vertical;
      }
  .content-items .content-item .item-content-subtitle {
        overflow: hidden;
        line-height: 1.8rem;
        text-overflow: ellipsis;
        display: -webkit-box !important;
        -webkit-box-orient: vertical;
        min-height: 2.8rem;
      }
  .content-items .content-item .item-content-footer .gama-text-overline {
          color: #afb8c1;
  }
}
</style>
