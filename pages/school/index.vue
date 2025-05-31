<template>
  <div class="main-school-list-div">
    <!-- <button @click="openBottomNavFilterList = !openBottomNavFilterList">
      test
    </button> -->
    <div
      :class="`filter-list-div ${
        openBottomNavFilterList ? `open-bottom-nav` : ``
      }`"
    >
      <div class="grab-line-div">
        <div class="grab"></div>
      </div>
      <schoolFilter
        :sort-list="sortList"
        @update-filter="updateFilter"
        :total-school-find="totalSchoolFind"
      />
      <div class="container-div-button" v-if="!isExpandMapInDesktop">
        <button @click="changeStatusExpandMap" class="map-view-button">
          <v-icon size="16">mdi-map-marker</v-icon>
          Map view
        </button>
      </div>
      <schoolList
        :school-list="schools"
        :is-expanded="!isExpandMapInDesktop"
        :is-initial-loading="isInitialSchoolLoading"
        :is-pagination-loading="isPaginationSchoolLoading"
        :is-all-data-loaded="isAllSchoolLoaded"
        @load-next-page="loadNextPageSchool"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import schoolFilter from "~/components/school/filter/Filter.vue";
import schoolList from "~/components/school/list/List.vue";

const router = useRouter();
const route = useRoute();

const sortList = [
  {
    value: "scoreDesc",
    title: "Highest score",
  },
  {
    value: "viewsDesc",
    title: "Most active",
  },
  {
    value: "updateDesc",
    title: "Update date",
  },
  {
    value: "tuitionAsc",
    title: "Tuition Fee (Highest First)",
  },
  {
    value: "tuitionDesc",
    title: "Tuition Fee (Lowest First)",
  },
];

const openBottomNavFilterList = ref(true);

// Start Filter Section
const filterForm = ref({
  keyword: route.query.keyword || "",
  country: route.query.country || "",
  state: route.query.state || "",
  city: route.query.city || "",
  stage: route.query.stage || "",
  tuition_fee: Number(route.query.tuition_fee) || 0,
  sort: route.query.sort || "",
  school_type: Array.isArray(route.query.school_type)
    ? route.query.school_type
    : route.query.school_type
    ? [route.query.school_type]
    : [],
  boarding_type: Array.isArray(route.query.boarding_type)
    ? route.query.boarding_type
    : route.query.boarding_type
    ? [route.query.boarding_type]
    : [],
  coed_status: Array.isArray(route.query.coed_status)
    ? route.query.coed_status
    : route.query.coed_status
    ? [route.query.coed_status]
    : [],
  religion: Array.isArray(route.query.religion)
    ? route.query.religion
    : route.query.religion
    ? [route.query.religion]
    : [],
});
const timer = ref(null);
const isInitialSchoolLoading = ref(true);
const isPaginationSchoolLoading = ref(false);
const schools = ref([]);
const isAllSchoolLoaded = ref(false);
const pageNumber = ref(1);
const perPage = 10;
const totalSchoolFind = ref(0);

const updateFilter = (query) => {
  console.log("update query from component", query);
  filterForm.value = query;
  updateQueryParams();
};

const updateQueryParams = () => {
  const query = {};
  Object.entries(filterForm.value).forEach(([key, value]) => {
    if (
      value &&
      (typeof value === "string" ||
        (Array.isArray(value) && value.length) ||
        (typeof value === "number" && value > 0))
    ) {
      query[key] = value;
    }
  });
  router.replace({ query });
};

watch(
  () => route.query,
  () => {
    console.log("watch update query");
    applyFiltersFromQuery(route.query);
  }
);

const applyFiltersFromQuery = (query) => {
  debouncedGetSchoolList();
};
const debouncedGetSchoolList = () => {
  if (timer.value) {
    clearTimeout(timer.value);
    timer.value = null;
  }

  if (!isInitialSchoolLoading.value) {
    timer.value = setTimeout(() => {
      pageNumber.value = 1;
      isAllSchoolLoaded.value = false;
      isInitialSchoolLoading.value = true;
      schools.value = [];
      getSchoolList();
    }, 800);
  }
};

onMounted(() => {
  isInitialSchoolLoading.value = true;
  getSchoolList();
});
const getSchoolList = async () => {
  console.log("get school", filterForm.value);

  if (isAllSchoolLoaded.value) return;
  try {
    const response = await $fetch("/api/v2/schools", {
      params: {
        "PagingDto.PageFilter.Skip": (pageNumber.value - 1) * perPage,
        "PagingDto.PageFilter.Size": perPage,
        "PagingDto.PageFilter.ReturnTotalRecordsCount": true,
        Name: filterForm.value.keyword,
        section: filterForm.value.stage,
        tuition_fee: filterForm.value.tuition_fee,
        CountryId: filterForm.value.country,
        StateId: filterForm.value.state,
        CityId: filterForm.value.city,
        school_type: filterForm.value.school_type,
        religion: filterForm.value.religion,
        boarding_type: filterForm.value.boarding_type,
        coed_status: filterForm.value.coed_status,
        sort: filterForm.value.sort,
        // "Location.Radius": this.isExpanded
        //   ? null
        //   : route.query.distance
        //   ? route.query.distance
        //   : filter.value.distance,
        // "Location.Latitude": this.isExpanded
        //   ? null
        //   : route.query.lat
        //   ? route.query.lat
        //   : filter.value.lat,
        // "Location.Longitude": this.isExpanded
        //   ? null
        //   : route.query.lng
        //   ? route.query.lng
        //   : filter.value.lng,
      },
    });
    console.log("response school list", response);

    if (response.data.list.length < perPage) {
      isAllSchoolLoaded.value = true;
    }
    totalSchoolFind.value = response.data.totalRecordsCount;
    schools.value = [...schools.value, ...response.data.list];
  } catch (err) {
    console.error(err);
  } finally {
    isInitialSchoolLoading.value = false;
    isPaginationSchoolLoading.value = false;
  }
};

const loadNextPageSchool = () => {
  console.log("index file load next page");
  pageNumber.value += 1;
  isPaginationSchoolLoading.value = true;
  getSchoolList();
};
// End Filter Section

const isExpandMapInDesktop = ref(false);

const changeStatusExpandMap = () => {
  isExpandMapInDesktop.value = !isExpandMapInDesktop.value;
};
</script>

<style scoped>
@import "./index.scss";
</style>
