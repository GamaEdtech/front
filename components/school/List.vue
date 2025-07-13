<template>
  <div :class="`main-list-school-div ${isExpanded ? `` : `closed-list`}`">
    <div
      class="container-button-load-previous-data"
      v-if="pageNumberForLoadPreviousData != 1 && !isInitialLoading"
    >
      <v-btn
        @click="loadPreviousPage"
        class="text-h5 text-md-h4"
        height="50"
        variant="outlined"
        color="#ffb300"
        rounded="xl"
      >
        Load Previous Data
      </v-btn>
    </div>
    <div
      :class="`container-list-div ${
        pageNumberForLoadPreviousData != 1 ? `adjust-height` : ``
      }`"
      ref="scrollDivRef"
    >
      <div class="container-scroll">
        <CardSchoolSkeleton
          v-if="isInitialLoading"
          v-for="item in 4"
          :key="item"
        />

        <CardSchoolSkeleton v-if="isPaginationPreviousLoading" />

        <NuxtLink
          v-else-if="!isInitialLoading"
          class="card-school"
          v-for="(school, index) in schoolList"
          :key="index"
          :to="`school/${school.id}/${$slugGenerator(school.name)}`"
        >
          <div
            v-if="school.defaultImageUri"
            class="school-card-bg"
            :style="{ backgroundImage: `url(${school.defaultImageUri})` }"
            style="border-top: 0px !important"
          >
            <div class="school-card-overlay">
              <div class="school-card-header">
                <ClientOnly>
                  <div class="school-name">{{ school.name }}</div>
                </ClientOnly>
              </div>

              <div class="d-flex-col">
                <div
                  class="d-flex align-center ga-2 flex-wrap my-4 justify-space-start"
                >
                  <v-chip
                    class="text-subtitle-1"
                    variant="flat"
                    density="comfortable"
                    color="rgba(52, 64, 84, 1)"
                    v-if="school.countryTitle && school.countryTitle.length > 0"
                  >
                    {{ school.countryTitle }}
                  </v-chip>
                  <v-chip
                    class="text-subtitle-1"
                    variant="flat"
                    density="comfortable"
                    color="rgba(52, 64, 84, 1)"
                    v-if="school.stateTitle && school.stateTitle.length > 0"
                    >{{ school.stateTitle }}</v-chip
                  >
                  <v-chip
                    class="text-subtitle-1"
                    variant="flat"
                    density="comfortable"
                    color="rgba(52, 64, 84, 1)"
                    v-if="school.cityTitle && school.cityTitle.length > 0"
                    >United {{ school.cityTitle }}</v-chip
                  >
                </div>
                <div class="d-flex align-strach justify-space-between pt-2">
                  <div
                    class="d-flex align-center w-100 gtext-t6 font-weight-semibold ga-1 primary-gray-500"
                  >
                    Score:
                    <v-icon color="primary"> mdi-star </v-icon>
                    {{ school.score ? school.score.toFixed(1) : "N/A" }}
                  </div>
                  <v-divider
                    :thickness="1"
                    class="border-opacity-100 primary-gray-300 w-100"
                    vertical
                  ></v-divider>
                  <div
                    class="d-flex align-center justify-end ga-2 gtext-t6 primary-gray-300 w-100"
                  >
                    <v-icon color="rgba(52, 64, 84, 1)">mdi-update</v-icon>
                    <span class="primary-gray-600">
                      {{ $dayjs(school.lastModifyDate).format("YYYY-MM-DD") }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="card-school">
            <div class="school-card-overlay">
              <div class="school-card-header">
                <div class="school-name">{{ school.name }}</div>
              </div>

              <div class="d-flex-col">
                <div
                  class="d-flex align-center ga-2 flex-wrap my-6 justify-space-start"
                >
                  <v-chip
                    class="text-subtitle-1"
                    variant="flat"
                    density="comfortable"
                    color="rgba(52, 64, 84, 1)"
                    v-if="school.countryTitle && school.countryTitle.length > 0"
                  >
                    {{ school.countryTitle }}
                  </v-chip>
                  <v-chip
                    class="text-subtitle-1"
                    variant="flat"
                    density="comfortable"
                    color="rgba(52, 64, 84, 1)"
                    v-if="school.stateTitle && school.stateTitle.length > 0"
                    >{{ school.stateTitle }}</v-chip
                  >
                  <v-chip
                    class="text-subtitle-1"
                    variant="flat"
                    density="comfortable"
                    color="rgba(52, 64, 84, 1)"
                    v-if="school.cityTitle && school.cityTitle.length > 0"
                    >United {{ school.cityTitle }}</v-chip
                  >
                </div>
                <div
                  class="w-100 d-flex align-strach justify-space-between pt-2"
                >
                  <div
                    class="d-flex align-center w-100 gtext-t6 font-weight-semibold ga-1 primary-gray-500"
                  >
                    Score:
                    <v-icon color="primary"> mdi-star </v-icon>
                    {{ school.score ? school.score.toFixed(1) : "N/A" }}
                  </div>
                  <v-divider
                    :thickness="1"
                    class="border-opacity-100 primary-gray-300 w-100"
                    vertical
                  ></v-divider>
                  <div
                    class="d-flex align-center justify-end ga-2 gtext-t6 primary-gray-300 w-100"
                  >
                    <v-icon color="rgba(52, 64, 84, 1)">mdi-update</v-icon>
                    <span class="primary-gray-600">
                      {{ $dayjs(school.lastModifyDate).format("YYYY-MM-DD") }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="line-seperator"></div>
          <div
            class="w-100 d-flex justify-space-between align-center px-1"
            style="background: rgba(249, 250, 251, 0.7)"
          >
            <div class="d-flex align-center">
              <v-btn variant="text" icon :disabled="!school.hasLocation">
                <v-icon size="large" color="rgba(52, 64, 84, 1)">
                  mdi-map-marker
                </v-icon>
              </v-btn>
              <v-btn variant="text" icon :disabled="!school.hasPhone">
                <v-icon size="large" color="rgba(52, 64, 84, 1)">
                  mdi-phone
                </v-icon>
              </v-btn>
              <v-btn variant="text" icon :disabled="!school.hasEmail">
                <v-icon size="large" color="rgba(52, 64, 84, 1)">
                  mdi-email
                </v-icon>
              </v-btn>
              <v-btn variant="text" icon :disabled="!school.hasWebsite">
                <v-icon size="large" color="rgba(52, 64, 84, 1)">
                  mdi-web
                </v-icon>
              </v-btn>
            </div>
            <div
              class="d-flex align-center px-1 h-100"
              style="color: rgba(52, 64, 84, 1)"
            >
              <div class="font-size-12">Details</div>
              <v-icon
                color="rgba(52, 64, 84, 1)"
                style="line-height: unset; margin-inline-start: 4px"
              >
                mdi-chevron-right
              </v-icon>
            </div>
          </div>
        </NuxtLink>

        <div
          class="line-specifier-load-more"
          ref="lineSpecifierLoadMoreRef"
        ></div>

        <CardSchoolSkeleton v-if="isPaginationLoading" />
        <div
          class="not-found-div"
          v-if="!isInitialLoading && schoolList.length == 0"
        >
          Opps! no data found
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from "vue";

import CardSchoolSkeleton from "./CardSchoolSkeleton.vue";

const props = defineProps({
  schoolList: {
    type: Array,
    required: true,
  },
  isInitialLoading: {
    type: Boolean,
    required: true,
  },
  isPaginationLoading: {
    type: Boolean,
    required: true,
  },
  isPaginationPreviousLoading: {
    type: Boolean,
    required: true,
  },
  isAllDataLoaded: {
    type: Boolean,
    required: true,
  },
  isExpanded: {
    type: Boolean,
    required: true,
  },
  pageNumberForLoadPreviousData: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["loadNextPage", "loadPreviousPage"]);

const { $slugGenerator } = useNuxtApp();

const lineSpecifierLoadMoreRef = ref(null);
const scrollDivRef = ref(null);

onMounted(() => {
  setupScrollListener();
});

onUnmounted(() => {
  if (scrollDivRef.value) {
    scrollDivRef.value.removeEventListener("scroll", handleScrollListener);
  }
});

const setupScrollListener = () => {
  scrollDivRef.value.addEventListener("scroll", handleScrollListener);
};

const handleScrollListener = () => {
  const targetDiv = lineSpecifierLoadMoreRef.value;
  const rect = targetDiv.getBoundingClientRect();
  const isDivInView = rect.top >= 0 && rect.bottom <= window.innerHeight;

  if (
    isDivInView &&
    !props.isInitialLoading &&
    !props.isPaginationLoading &&
    !props.isAllDataLoaded
  ) {
    emit("loadNextPage");
  }
};

const loadPreviousPage = () => {
  emit("loadPreviousPage");
};
</script>

<style scoped>
@import "../../assets/scss/school/list.scss";
</style>
