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
        <CardSchoolSkeleton v-if="isInitialLoading" v-for="item in 4" />

        <CardSchoolSkeleton v-if="isPaginationPreviousLoading" />

        <NuxtLink
          v-if="!isInitialLoading"
          class="card-school"
          v-for="(school, index) in schoolList"
          :to="`school/${school.id}/${$slugGenerator(school.name)}`"
        >
          <div class="name-address-image">
            <div class="name-div">
              <span class="name gtext-t4 font-weight-semibold">{{
                school.name
              }}</span>
              <div class="d-flex align-center justify-start flex-wrap ga-3">
                <v-chip
                  class="text-subtitle-1"
                  variant="elevated"
                  color="#546e7a"
                  v-if="school.countryTitle && school.countryTitle.length > 0"
                >
                  {{ school.countryTitle }}
                </v-chip>
                <v-chip
                  class="text-subtitle-1"
                  variant="elevated"
                  color="#546e7a"
                  v-if="school.stateTitle && school.stateTitle.length > 0"
                  >{{ school.stateTitle }}</v-chip
                >
                <v-chip
                  class="text-subtitle-1"
                  variant="elevated"
                  color="#546e7a"
                  v-if="school.cityTitle && school.cityTitle.length > 0"
                  >United {{ school.cityTitle }}</v-chip
                >
              </div>
            </div>
            <div
              class="img-div d-none d-md-block"
              v-if="school.defaultImageUri && isExpanded"
            >
              <NuxtImg
                alt="school.name"
                v-show="school.defaultImageUri"
                width="180px"
                :src="school.defaultImageUri?.replace(/^http:\/\//, 'https://')"
                placeholder
                class="h-100"
              />
            </div>
          </div>
          <div class="line-seperator"></div>
          <div
            class="w-100 d-flex align-center justify-space-between mt-3 flex-wrap ga-5"
          >
            <div class="d-flex align-center">
              <v-btn variant="text" icon :disabled="!school.hasLocation">
                <v-icon size="x-large"> mdi-map-marker </v-icon>
              </v-btn>
              <v-btn variant="text" icon :disabled="!school.hasPhon">
                <v-icon size="x-large"> mdi-phone </v-icon>
              </v-btn>
              <v-btn variant="text" icon :disabled="!school.hasEmail">
                <v-icon size="x-large"> mdi-email </v-icon>
              </v-btn>
              <v-btn variant="text" icon :disabled="!school.hasWebsite">
                <v-icon size="x-large"> mdi-web </v-icon>
              </v-btn>
            </div>
            <div class="d-flex align-center ga-2">
              <div
                class="d-flex align-center ga-2 gtext-t6 font-weight-semibold"
              >
                <v-icon size="x-large" color="primary"> mdi-star </v-icon>
                {{ school.score ? school.score.toFixed(1) : "New" }}
              </div>
              <div class="d-flex align-center ga-2 gtext-t6 primary-gray-300">
                <v-icon size="x-large">mdi-update</v-icon>
                <span class="primary-gray-600">
                  {{ $dayjs(school.lastModifyDate).format("YYYY-MM-DD") }}
                </span>
              </div>
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
  scrollDivRef.value.removeEventListener("scroll", handleScrollListener);
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
