<template>
  <v-container class="flex-column margin-top-handle">
    <v-row>
      <v-col cols="4" md="12" class="d-flex d-md-none justify-start">
        <v-badge
          class="mt-1 height-badge"
          offset-x="5"
          offset-y="-5"
          :color="countFilterSelect == 0 ? `#ffffff` : `#F04438`"
          :content="countFilterSelect == 0 ? `` : countFilterSelect"
        >
          <v-btn
            rounded="xl"
            prepend-icon="mdi-tune-vertical"
            variant="outlined"
            class="primary-gray-700"
            density="comfortable"
            @click="openFilterMobileModal = !openFilterMobileModal"
          >
            Filter
          </v-btn>
        </v-badge>
      </v-col>
      <v-col cols="8" md="12" class="d-flex justify-end justify-md-center">
        <v-text-field
          label="Search anything...."
          variant="outlined"
          color="#FFB600"
          max-width="330"
          density="compact"
          hide-details
          class="custom-search-text-field"
          v-model="textSearch"
          @update:modelValue="changeTextSearch"
        >
          <template v-slot:append>
            <v-btn
              icon
              varient="text"
              color="#FFB600"
              width="50"
              class="rounded-ts rounded-te-xl rounded-be-xl rounded-bs h-100 ml-n2"
              flat
            >
              <v-icon size="x-large" icon="mdi-magnify" color="#000000" />
            </v-btn>
          </template>
        </v-text-field>
      </v-col>
      <search-filter-option
        v-model:showDialogFilterMobile="openFilterMobileModal"
        :count-data-found="totalDataFind"
        @changeFilterQuery="changeFilterQuery"
      />
      <v-col cols="12" class="d-flex align-end justify-end ga-2">
        <span class="text-h5 primary-gray-400">Result</span>
        <span class="text-h4 primary-gray-700 font-weight-bold">{{
          $numberFormat(totalDataFind)
        }}</span>
      </v-col>
      <search-list
        :data-list="data"
        :is-initial-loading="isInitialDataLoading"
        :is-pagination-loading="isPaginationDataLoading"
        :is-all-data-loaded="isAllDataLoaded"
        @load-next-page="loadNextPageData"
      />
    </v-row>
  </v-container>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const openFilterMobileModal = ref(false);
const countFilterSelect = ref(0);
const querySearch = ref();
const textSearch = ref(route.query.keyword ? route.query.keyword : "");
const timer = ref(null);

const isInitialDataLoading = ref(false);
const isPaginationDataLoading = ref(false);
const data = ref([]);
const isAllDataLoaded = ref(false);
const totalDataFind = ref(0);
const pageNumber = ref(1);
const perPage = 10;

const pageTitle = ref("");
const pageDescribe = ref("");

const setMetaData = (type) => {
  if (type === "learnfiles") {
    pageTitle.value =
      "Multimedia Interactive Educational Content; PowerPoint, Video, Class Voice, GamaTrain";
    pageDescribe.value =
      "Elevate your learning experience with GamaTrain's captivating multimedia content, including PowerPoint presentations, informative videos, and diverse educational materials.";
  } else if (type === "test") {
    pageTitle.value =
      "Educational Resources | K12 Education Papers and Materials";
    pageDescribe.value =
      "Enhance your learning with GamaTrain's extensive collection of online documents and texts, carefully curated to enrich your academic journey.";
  } else if (type === "question") {
    pageTitle.value =
      "Seek Clarification, Expand Your Understanding: GamaTrain's Q&A Forum";
    pageDescribe.value =
      "Engage in active learning and gain deeper insights through GamaTrain's interactive Q&A platform, where you can pose questions and seek support from fellow learners and experts.";
  } else if (type === "azmoon") {
    pageTitle.value = "Online Exams , Free Exams for Improving Education";
    pageDescribe.value =
      "Hone your skills and assess your knowledge with GamaTrain's online exams, designed to enhance your exam preparation and boost your confidence.";
  } else if (type === "dars") {
    pageTitle.value =
      "Master Concepts, Enhance Learning: GamaTrain's Online Tutorials";
    pageDescribe.value =
      "Complement your studies with GamaTrain's comprehensive online tutorials, providing step-by-step guidance and practice opportunities to refine your understanding.";
  } else if (type === "tutor") {
    pageTitle.value = "Teacher";
    pageDescribe.value = "Teacher";
  } else {
    pageTitle.value =
      "Educational Resources | K12 Education Papers and Materials";
    pageDescribe.value =
      "Enhance your learning with GamaTrain's extensive collection of online documents and texts, carefully curated to enrich your academic journey.";
  }

  // Set page metadata
  useHead(() => ({
    title: pageTitle.value,
    meta: [
      {
        hid: "apple-mobile-web-app-title",
        name: "apple-mobile-web-app-title",
        content: pageTitle.value,
      },
      {
        hid: "og:title",
        name: "og:title",
        content: pageTitle.value,
      },
      {
        hid: "og:site_name",
        name: "og:site_name",
        content: "GamaTrain",
      },
      {
        hid: "description",
        name: "description",
        content: pageDescribe.value,
      },
      {
        hid: "og:description",
        name: "og:description",
        content: pageDescribe.value,
      },
    ],
  }));
};
setMetaData(route.query.type);

// Set page metadata
useHead(() => ({
  title: pageTitle.value,
  meta: [
    {
      hid: "apple-mobile-web-app-title",
      name: "apple-mobile-web-app-title",
      content: pageTitle.value,
    },
    {
      hid: "og:title",
      name: "og:title",
      content: pageTitle.value,
    },
    {
      hid: "og:site_name",
      name: "og:site_name",
      content: "GamaTrain",
    },
    {
      hid: "description",
      name: "description",
      content: pageDescribe.value,
    },
    {
      hid: "og:description",
      name: "og:description",
      content: pageDescribe.value,
    },
  ],
}));

const loadNextPageData = async () => {
  pageNumber.value += 1;
  isPaginationDataLoading.value = true;
  await getDataList(true);
};

const changeFilterQuery = async (query, skipFetch = false) => {
  countFilterSelect.value = Object.keys(query).length;
  querySearch.value = {
    ...query,
  };
  if (textSearch.value.length > 0) {
    querySearch.value.keyword = textSearch.value;
  }
  if (!skipFetch) {
    isAllDataLoaded.value = false;
    isInitialDataLoading.value = true;
    pageNumber.value = 1;
    await getDataList();
  }
};

const changeTextSearch = () => {
  isInitialDataLoading.value = true;

  const query = querySearch.value;
  if (textSearch.value.length == 0) {
    delete query.keyword;
  } else {
    query.keyword = textSearch.value;
  }
  router.replace({ query });
  debouncedSearchText();
};

const debouncedSearchText = () => {
  if (timer.value) {
    clearTimeout(timer.value);
    timer.value = null;
  }
  timer.value = setTimeout(() => {
    isAllDataLoaded.value = false;
    pageNumber.value = 1;
    getDataList();
  }, 800);
};

const { data: initialData, pending: loadingDataServer } = await useAsyncData(
  "dataSearchSSR",
  () => {
    const params = {
      page: pageNumber.value,
      keyword: route.query.keyword,
      section: route.query.section,
      base: route.query.base,
      lesson: route.query.lesson,
      topic: route.query.topic,
      type: route.query.type ? route.query.type : "test",
      edu_year: route.query.edu_year,
      edu_month: route.query.edu_month,
    };

    if (route.query.type && route.query.type == "learnfiles") {
      params.content_type = route.query.content_type;
    }
    if (route.query.type && route.query.type == "test") {
      params.test_type = route.query.test_type;
    }

    return $fetch("/api/v1/search", { params });
  }
);

if (initialData.value) {
  data.value = initialData.value.data.list;
  totalDataFind.value = initialData.value.data.num || 0;
  isInitialDataLoading.value = false;
  isPaginationDataLoading.value = false;
}

const getDataList = async (isLoadNextPage = false) => {
  if (isAllDataLoaded.value) return;
  try {
    const params = { ...querySearch.value };
    params.page = pageNumber.value;
    const response = await $fetch("/api/v1/search", { params });

    if (response.data.list.length < perPage) {
      isAllDataLoaded.value = true;
    }
    totalDataFind.value = response.data.num ? response.data.num : 0;
    if (isLoadNextPage) {
      data.value = [...data.value, ...response.data.list];
    } else {
      data.value = response.data.list;
    }
  } catch (err) {
    console.error(err);
  } finally {
    isPaginationDataLoading.value = false;
    isInitialDataLoading.value = false;
  }
};
</script>

<style scoped>
.margin-top-handle {
  margin-top: 64px;
  min-height: calc(100vh - 64px);
}

:deep(.custom-search-text-field .v-field__outline__start) {
  border-radius: 24px 0 0 24px !important;
  flex: 0 0 30px !important;
}
:deep(.custom-search-text-field .v-field__outline__end) {
  border-radius: 0 4px 4px 0 !important;
}

:deep(.height-badge .v-badge__wrapper .v-badge__badge) {
  height: 20px !important;
}

@media (min-width: 960px) {
  .margin-top-handle {
    margin-top: 6.4rem;
    min-height: calc(100vh - 6.4rem);
  }
}
</style>
