<template>
  <v-container class="flex-column margin-top-handle">
    <!-- Start BreadCrumb  -->
    <v-row>
      <breadcrumb :breads="breadsCrumb" backgroundColor="transparent" />
    </v-row>
    <!-- End BreadCrumb -->

    <v-row class="justify-space-between flex-wrap">
      <!-- Start Filter -->
      <v-col cols="8" sm="5" md="8">
        <filterPapers />
      </v-col>
      <!-- End Filter -->

      <!-- Start Image Lesson -->
      <v-col cols="12" sm="4" md="4" class="position-relative">
        <template v-if="isLoadingResources">
          <v-skeleton-loader type="image"></v-skeleton-loader>
        </template>
        <template v-else>
          <template v-if="imageLesson">
            <div
              :class="`d-flex justify-center w-100 h-100 mx-auto max-height-image ${positionClass}`"
            >
              <NuxtImg
                width="300px"
                :src="imageLesson"
                placeholder
                class="rounded-lg w-100 h-100"
              />
              <!-- <img :src="imageLesson" eager contain class="rounded-lg w-100" /> -->
            </div>
          </template>
        </template>
      </v-col>
      <!-- End Image Lesson -->
    </v-row>

    <v-row>
      <resources
        :topicalData="topicalData"
        :data="resourcesData"
        :isLoading="isLoadingResources"
      />
    </v-row>

    <v-row
      class="container-table-time-line d-flex flex-row justify-space-between justify-lg-space-between"
    >
      <v-col cols="10">
        <paperTable
          :desktopHeader="headerPapersTableDesktop"
          :mobileHeaders="headerPapersTableMobile"
          :isLoadingPapers="isLoadingPapers"
          :isLoadingInfiniteScroll="isLoadingInfiniteScroll"
          :isAllDataLoaded="isAllPapersLoaded"
          :data="papers"
          @loadNextPageData="fetchNextPagePapers"
        />
      </v-col>
      <v-col cols="2">
        <timeline :timeline="timelineData" :isLoading="loadingTimeline" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import moment from "moment";
import { useDisplay } from "vuetify";

import breadcrumb from "~/components/widgets/breadcrumb.vue";
import resources from "~/components/subject-directory/resources.vue";
import paperTable from "~/components/subject-directory/paper-table.vue";
import timeline from "~/components/subject-directory/timeline.vue";
import filterPapers from "~/components/subject-directory/filter-papers.vue";

const { sm, xs } = useDisplay();

const positionClass = computed(() =>
  sm.value || xs.value ? `position-relative` : `position-absolute`
);

// Initial State Bread Crumb
const breadsCrumb = [
  {
    text: "Subject Directory",
    disabled: true,
    href: "/search?type=test",
    name: "type",
  },
  {
    text: "CIE",
    disabled: false,
    href: "/search?type=test",
    name: "type",
  },
];

// Start Section Resources
const isLoadingResources = ref(false);

const titleLesson = ref("");
const resourcesData = ref([]);
const topicalData = ref({
  label: "Topical",
  icon: "Topical.svg",
  items: [],
});
const imageLesson = ref(null);
// End Section Resources

// Start Section Papers
const isLoadingPapers = ref(false);
const isLoadingInfiniteScroll = ref(false);
const isAllPapersLoaded = ref(false);
const pageNumber = ref(1);
const perPage = 20;
const papers = ref([]);
const headerPapersTableDesktop = [
  {
    title: "Classification",
    align: "start",
    value: "name",
    icon: "mdi-format-list-bulleted",
  },
  {
    title: "Year",
    align: "center",
    value: "year",
    icon: "mdi-format-list-bulleted",
  },
  {
    title: "Term",
    align: "center",
    value: "term",
    icon: "mdi-format-list-bulleted",
  },
  {
    title: "Download Files",
    align: "center",
    value: "downloadFilesContains",
  },
  {
    title: "ExamHub",
    align: "center",
    value: "examHubIcon",
  },
];
const headerPapersTableMobile = [
  { title: "Classification", value: "classification" },
  { title: "Year", value: "year" },
  { title: "Term", value: "term" },
];
const subjectId = "4190";

const fetchNextPagePapers = async () => {
  try {
    isLoadingInfiniteScroll.value = true;
    pageNumber.value += 1;
    let endpointPapers = `api/v1/tests/search?lesson=${subjectId}&page=${pageNumber.value}&perpage=20&is_paper=true&directory=true`;
    const responsePapers = await $fetch(endpointPapers);
    if (responsePapers) {
      if (responsePapers.data.list.length < perPage) {
        isAllPapersLoaded.value = true;
      }
      papers.value = [...papers.value, ...responsePapers.data.list];

      generateTimeLine();
    }
  } catch (error) {
    console.error("Error fetching search results:", error);
  } finally {
    isLoadingInfiniteScroll.value = false;
  }
};
// End Section Papers

// Start Section Timeline
const loadingTimeline = ref(true);
const timelineData = ref([]);
const generateTimeLine = () => {
  const sortedItems = [...papers.value].sort((a, b) => {
    const yearDiff = parseInt(b.edu_year) - parseInt(a.edu_year);
    if (yearDiff !== 0) return yearDiff;
    return parseInt(b.edu_month) - parseInt(a.edu_month);
  });

  const timelineMap = {};
  let positionCounter = 0;
  sortedItems.forEach((item) => {
    const year = parseInt(item.edu_year);
    const monthNumber = parseInt(item.edu_month);
    const month = moment()
      .month(monthNumber - 1)
      .format("MMM");

    if (!timelineMap[year]) {
      timelineMap[year] = { months: new Set(), positions: [] };
    }

    if (!timelineMap[year].months.has(month)) {
      timelineMap[year].positions.push(positionCounter);
    }

    timelineMap[year].months.add(month);
    positionCounter++;
  });

  timelineData.value = Object.keys(timelineMap)
    .sort((a, b) => b - a)
    .map((year) => ({
      year: parseInt(year),
      months: Array.from(timelineMap[year].months),
      positions: timelineMap[year].positions,
    }));
};

// End Section Timeline

onMounted(async () => {
  isLoadingResources.value = true;
  let endpointResources = `/api/v1/tests/search?is_paper=false&directory=true&lesson=${subjectId}`;
  const responseResource = await $fetch(endpointResources);
  if (responseResource.data) {
    titleLesson.value = responseResource.data.lesson_title;
    imageLesson.value = responseResource.data.lesson_pic;
    resourcesData.value = responseResource.data.list;
    const filterTopical = resourcesData.value.filter(
      (item) => item.title === "Topical"
    );
    if (filterTopical.length > 0) {
      topicalData.value.items = filterTopical[0].items;
    }
  }
  isLoadingResources.value = false;

  isLoadingPapers.value = true;
  let endpointPapers = `/api/v1/tests/search?lesson=${subjectId}&page=1&perpage=20&is_paper=true&directory=true`;
  const responsePapers = await $fetch(endpointPapers);
  if (responsePapers.data) {
    papers.value = responsePapers.data.list;
    generateTimeLine();
  }

  loadingTimeline.value = false;
  isLoadingPapers.value = false;
});
</script>

<style scoped>
.margin-top-handle {
  margin-top: 64px;
}
.max-height-image {
  max-width: 250px;
  max-height: 300px;
  min-height: 300px;
}
@media (min-width: 960px) {
  .margin-top-handle {
    margin-top: 6.4rem;
  }
}
</style>
