<template>
  <v-container class="flex-column margin-top-handle">
    <v-row>
      <v-col cols="4" md="12" class="d-flex d-md-none justify-start">
        <v-badge
          class="mt-1"
          offset-x="-10"
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
        @changeFilterQuery="changeFilterQuery"
      />
      <v-col cols="12" class="d-flex align-end justify-end ga-2">
        <span class="text-h5 primary-gray-400">Result</span>
        <span class="text-h4 primary-gray-700 font-weight-bold">24</span>
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
const pageNumber = ref(1);

const loadNextPageData = () => {};

const changeFilterQuery = (query) => {
  console.log(query);
  countFilterSelect.value = Object.keys(query).length;
  querySearch.value = {
    ...query,
    keyword: textSearch.value,
  };
};

const changeTextSearch = () => {
  const query = querySearch.value;
  query.keyword = textSearch.value;
  router.replace({ query });
  // debouncedSearchText();
};

// const debouncedSearchText = () => {
//   if (timer.value) {
//     clearTimeout(timer.value);
//     timer.value = null;
//   }
//   timer.value = setTimeout(() => {
//     // get data
//   }, 800);
// };
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

@media (min-width: 960px) {
  .margin-top-handle {
    margin-top: 6.4rem;
    min-height: calc(100vh - 6.4rem);
  }
}
</style>
