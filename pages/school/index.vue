<template>
  <div class="main-school-list-div">
    <!-- <button @click="openBottomNavFilterList = !openBottomNavFilterList">
      test
    </button> -->
    <div class="map-div">
      <button @click="changeStatusExpandMap" class="list-view-button">
        <v-icon color="#000000" size="16">mdi-menu</v-icon>
        List view
      </button>

      <Map :items="schools" @map-moved="changeFilterWithMapMoved" />
    </div>
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
        :is-expand-map="isExpandMapInDesktop"
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
        :is-pagination-previous-loading="isPaginationPreviousSchoolLoading"
        :is-all-data-loaded="isAllSchoolLoaded"
        :page-number-for-load-previous-data="pageNumberForLoadPreviousSchool"
        @load-next-page="loadNextPageSchool"
        @load-previous-page="loadPreviousSchool"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import schoolFilter from "~/components/school/filter/Filter.vue";
import schoolList from "~/components/school/list/List.vue";
import Map from "~/components/school/map/Map.vue";

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
  distance: Number(route.query.distance) || null,
  lat: Number(route.query.lat) || null,
  lng: Number(route.query.lng) || null,
  page: Number(route.query.page) || 1,
});
const timer = ref(null);
const isInitialSchoolLoading = ref(true);
const isPaginationSchoolLoading = ref(false);
const isPaginationPreviousSchoolLoading = ref(false);
const schools = ref([]);
const isAllSchoolLoaded = ref(false);
const pageNumberForLoadPreviousSchool = ref(
  route.query.page ? Number(route.query.page) : 1
);
const pageNumberForLoadNextSchool = ref(
  route.query.page ? Number(route.query.page) : 1
);
const perPage = 10;
const totalSchoolFind = ref(0);

const resetParameter = () => {
  filterForm.value.page = 1;
  pageNumberForLoadNextSchool.value = 1;
  pageNumberForLoadPreviousSchool.value = 1;
  isAllSchoolLoaded.value = false;
  isInitialSchoolLoading.value = true;
  schools.value = [];
};

const updateFilter = (query) => {
  console.log("update query from component", query);
  filterForm.value = query;
  resetParameter();
  updateQueryParams();
};

const changeFilterWithMapMoved = (locationParam) => {
  console.log("location param", locationParam);
  filterForm.value.distance = locationParam.distance;
  filterForm.value.lat = locationParam.center[0];
  filterForm.value.lng = locationParam.center[1];
  resetParameter();
  updateQueryParams();
};

const updateQueryParams = () => {
  const query = {};
  Object.entries(filterForm.value).forEach(([key, value]) => {
    if (
      value &&
      (typeof value === "string" ||
        (Array.isArray(value) && value.length) ||
        (typeof value === "number" && value != 0))
    ) {
      query[key] = value;
    }
  });
  console.log("query made", query);
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

  // if (!isInitialSchoolLoading.value) {
  timer.value = setTimeout(() => {
    getSchoolList();
  }, 800);
  // }
};

onMounted(() => {
  isInitialSchoolLoading.value = true;
  getSchoolList();
});
const getSchoolList = async () => {
  console.log("get school", filterForm.value);

  if (isAllSchoolLoaded.value) return;
  try {
    const params = {
      "PagingDto.PageFilter.Skip": (filterForm.value.page - 1) * perPage,
      "PagingDto.PageFilter.Size": perPage,
      "PagingDto.PageFilter.ReturnTotalRecordsCount": true,
    };
    if (isExpandMapInDesktop.value) {
      params["Location.Radius"] = filterForm.value.distance;
      params["Location.Latitude"] = filterForm.value.lat;
      params["Location.Longitude"] = filterForm.value.lng;
    } else {
      params["Name"] = filterForm.value.keyword;
      params["section"] = filterForm.value.stage;
      params["tuition_fee"] = filterForm.value.tuition_fee;
      params["CountryId"] = filterForm.value.country;
      params["StateId"] = filterForm.value.state;
      params["CityId"] = filterForm.value.city;
      params["school_type"] = filterForm.value.school_type;
      params["religion"] = filterForm.value.religion;
      params["boarding_type"] = filterForm.value.boarding_type;
      params["coed_status"] = filterForm.value.coed_status;
      params["sort"] = filterForm.value.sort;
    }
    const response = await $fetch("/api/v2/schools", {
      params,
    });
    console.log("response school list", response);

    if (response.data.list.length < perPage) {
      isAllSchoolLoaded.value = true;
    }
    totalSchoolFind.value = response.data.totalRecordsCount
      ? response.data.totalRecordsCount
      : 0;

    if (isPaginationPreviousSchoolLoading.value) {
      schools.value = [...response.data.list, ...schools.value];
    } else {
      schools.value = [...schools.value, ...response.data.list];
    }
  } catch (err) {
    console.error(err);
  } finally {
    isInitialSchoolLoading.value = false;
    isPaginationSchoolLoading.value = false;
    isPaginationPreviousSchoolLoading.value = false;
  }
};

const loadNextPageSchool = () => {
  if (pageNumberForLoadNextSchool.value == 1) {
    filterForm.value.page += 1;
  } else {
    pageNumberForLoadNextSchool.value += 1;
    filterForm.value.page = pageNumberForLoadNextSchool.value;
  }
  console.log("index file load next page");
  isPaginationSchoolLoading.value = true;
  updateQueryParams();
};

const loadPreviousSchool = () => {
  if (filterForm.value.page > 1) {
    console.log("index file load prev page");
    pageNumberForLoadPreviousSchool.value -= 1;
    filterForm.value.page = pageNumberForLoadPreviousSchool.value;
    isPaginationPreviousSchoolLoading.value = true;
    updateQueryParams();
  }
};

// End Filter Section

// Start Open/Close bottom nav and Expand Map in Desktop
const openBottomNavFilterList = ref(true);

const isExpandMapInDesktop = ref(false);

const changeStatusExpandMap = () => {
  isExpandMapInDesktop.value = !isExpandMapInDesktop.value;
};

// End Open/Close bottom nav and Expand Map in Desktop
</script>

<style scoped>
@import "./index.scss";
</style>
