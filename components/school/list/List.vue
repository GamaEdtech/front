<template>
  <div :class="`main-list-school-div ${isExpanded ? `` : `closed-list`}`">
    <div
      class="container-button-load-previous-data"
      v-if="pageNumberForLoadPreviousData != 1 && !isInitialLoading"
    >
      <button @click="loadPreviousPage" class="load-previous-button">
        Load Previous Data
      </button>
    </div>
    <div
      :class="`container-list-div ${
        pageNumberForLoadPreviousData != 1 ? `adjust-height` : ``
      }`"
      ref="scrollDivRef"
    >
      <div class="container-scroll">
        <div
          v-if="isInitialLoading"
          class="skeleton-card-school"
          v-for="item in 4"
        >
          <div class="name-address-image">
            <div class="name-div">
              <span class="name skeleton-loader"></span>
              <div class="chips-address">
                <span class="chip-address skeleton-loader"></span>
                <span class="chip-address skeleton-loader"></span>
                <span class="chip-address skeleton-loader"></span>
              </div>
            </div>
            <div class="img-div skeleton-loader"></div>
          </div>
          <div class="line-seperator"></div>
          <div class="links-rate">
            <div class="link-icons">
              <div class="link skeleton-loader"></div>
              <div class="link skeleton-loader"></div>
              <div class="link skeleton-loader"></div>
            </div>
            <div class="rate-update skeleton-loader"></div>
          </div>
        </div>

        <div v-if="isPaginationPreviousLoading" class="skeleton-card-school">
          <div class="name-address-image">
            <div class="name-div">
              <span class="name skeleton-loader"></span>
              <div class="chips-address">
                <span class="chip-address skeleton-loader"></span>
                <span class="chip-address skeleton-loader"></span>
                <span class="chip-address skeleton-loader"></span>
              </div>
            </div>
            <div class="img-div skeleton-loader"></div>
          </div>
          <div class="line-seperator"></div>
          <div class="links-rate">
            <div class="link-icons">
              <div class="link skeleton-loader"></div>
              <div class="link skeleton-loader"></div>
              <div class="link skeleton-loader"></div>
            </div>
            <div class="rate-update skeleton-loader"></div>
          </div>
        </div>
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
              <div class="chips-address">
                <span
                  class="chip-address"
                  v-if="school.countryTitle && school.countryTitle.length > 0"
                  >{{ school.countryTitle }}</span
                >
                <span
                  class="chip-address"
                  v-if="school.stateTitle && school.stateTitle.length > 0"
                  >{{ school.stateTitle }}</span
                >
                <span
                  class="chip-address"
                  v-if="school.cityTitle && school.cityTitle.length > 0"
                  >United {{ school.cityTitle }}</span
                >
              </div>
            </div>
            <div class="img-div" v-if="school.defaultImageUri">
              <NuxtImg
                alt="school.name"
                v-if="school.defaultImageUri"
                width="180px"
                :src="school.defaultImageUri"
                placeholder
              />
            </div>
          </div>
          <div class="line-seperator"></div>
          <div class="links-rate">
            <div class="link-icons">
              <button class="button-link" :disabled="!school.hasLocation">
                <v-icon size="x-large"> mdi-map-marker </v-icon>
              </button>
              <button class="button-link" :disabled="!school.hasPhon">
                <v-icon size="x-large"> mdi-phone </v-icon>
              </button>
              <button class="button-link" :disabled="!school.hasEmail">
                <v-icon size="x-large"> mdi-email </v-icon>
              </button>
              <button class="button-link" :disabled="!school.hasWebsite">
                <v-icon size="x-large"> mdi-web </v-icon>
              </button>
            </div>
            <div class="rate-update">
              <div class="rate-section gtext-t6 font-weight-semibold">
                <v-icon size="x-large" color="primary"> mdi-star </v-icon>
                {{ school.score ? school.score.toFixed(1) : "New" }}
              </div>
              <div class="rate-section gtext-t6 primary-gray-300">
                <v-icon size="x-large">mdi-update</v-icon>
                <span class="primary-gray-600">
                  {{ moment(school.lastModifyDate).format("YYYY-MM-DD") }}
                </span>
              </div>
            </div>
          </div>
        </NuxtLink>

        <div
          class="line-specifier-load-more"
          ref="lineSpecifierLoadMoreRef"
        ></div>

        <div v-if="isPaginationLoading" class="skeleton-card-school">
          <div class="name-address-image">
            <div class="name-div">
              <span class="name skeleton-loader"></span>
              <div class="chips-address">
                <span class="chip-address skeleton-loader"></span>
                <span class="chip-address skeleton-loader"></span>
                <span class="chip-address skeleton-loader"></span>
              </div>
            </div>
            <div class="img-div skeleton-loader"></div>
          </div>
          <div class="line-seperator"></div>
          <div class="links-rate">
            <div class="link-icons">
              <div class="link skeleton-loader"></div>
              <div class="link skeleton-loader"></div>
              <div class="link skeleton-loader"></div>
            </div>
            <div class="rate-update skeleton-loader"></div>
          </div>
        </div>

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
import moment from "moment";
import { onMounted, onUnmounted } from "vue";

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
@import "./List.scss";
</style>
