<template>
  <v-container class="flex-column margin-top-handle">
    <!-- Start BreadCrumb  -->
    <v-row>
      <breadcrumb :breads="breadsCrumb" backgroundColor="transparent" />
    </v-row>
    <!-- End BreadCrumb -->

    <v-row class="justify-space-between flex-wrap">
      <!-- Start Select Category -->
      <v-col cols="8" sm="5" md="8">
        <div class="mb-4 d-inline-flex align-center flex-wrap">
          <div>
            <template v-if="isLoadingBoard">
              <div class="d-inline-flex mt-2">
                <v-skeleton-loader
                  min-width="200"
                  type="heading"
                ></v-skeleton-loader>
              </div>
            </template>
            <template v-else>
              <div class="d-inline-flex flex-row align-center cursor-pointer">
                <span class="w-100 gama-text-h3 font-weight-semibold">
                  {{
                    selectedBoard?.name
                      ? selectedBoard?.name
                      : selectedBoard?.title
                  }}
                </span>
                <v-icon size="18" color="black" class="mx-2">
                  mdi-menu-down
                </v-icon>
              </div>
            </template>
          </div>
          <div>
            <template v-if="isLoadingGrades">
              <div class="d-inline-flex mt-2">
                <v-skeleton-loader
                  min-width="200"
                  type="heading"
                ></v-skeleton-loader>
              </div>
            </template>
            <template v-else>
              <div class="d-inline-flex flex-row align-center cursor-pointer">
                <span
                  v-if="selectedGrade"
                  class="w-100 gama-text-h3 font-weight-semibold"
                >
                  {{ selectedGrade?.name }}
                </span>
                <v-icon
                  v-if="selectedBoard"
                  size="18"
                  color="black"
                  class="mx-2"
                >
                  mdi-menu-down
                </v-icon>
              </div>
            </template>
          </div>
          <div>
            <template v-if="isLoadingSubjects">
              <div class="d-inline-flex mt-2">
                <v-skeleton-loader
                  type="heading"
                  min-width="200"
                ></v-skeleton-loader>
              </div>
            </template>
            <template v-else>
              <div
                class="d-inline-flex flex-row align-center mb-4 mb-md-0 cursor-pointer"
              >
                <span
                  v-if="selectedSubject"
                  class="w-100 gama-text-h3 font-weight-semibold"
                >
                  {{ selectedSubject?.name }}
                </span>
                <v-icon
                  v-if="selectedSubject"
                  size="18"
                  color="black"
                  class="mx-2"
                >
                  mdi-menu-down
                </v-icon>
              </div>
            </template>
          </div>
        </div>
      </v-col>
      <!-- End Select Category -->

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
  </v-container>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useDisplay } from "vuetify";

import breadcrumb from "~/components/widgets/breadcrumb.vue";
import resources from "~/components/subject-directory/resources.vue";

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

// Start Board Section
const selectedBoard = ref({
  name: "bboard",
});
const isLoadingBoard = ref(true);

// End Board Section

// Start Grade Section
const selectedGrade = ref({
  name: "gggrade",
});
const isLoadingGrades = ref(true);
// End Grade Section

// Start Subject Section
const selectedSubject = ref({
  name: "sssubject",
});
const isLoadingSubjects = ref(true);

// End Subject Section

// Start Section Resources
const isLoadingResources = ref(true);

const titleLesson = ref("");
const resourcesData = ref([]);
const topicalData = ref({
  label: "Topical",
  icon: "Topical.svg",
  items: [],
});
const imageLesson = ref(null);

onMounted(async () => {
  const subjectId = "4190";
  let endpointResources = `/api/v1/tests/search?is_paper=false&directory=true&lesson=${subjectId}`;
  const responseResource = await $fetch(endpointResources);
  console.log("responseResource", responseResource);
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
