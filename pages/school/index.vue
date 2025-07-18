<template>
  <div class="main-school-list-div">
    <div class="map-div">
      <v-btn
        @click="changeStatusExpandMap"
        class="list-view-button mt-16 ml-12 position-absolute d-none d-lg-flex pa-6 text-h4"
        height="50"
        elevation="4"
        prepend-icon="mdi-menu"
        color="#ffffff"
        rounded="xl"
      >
        List view
      </v-btn>

      <Map
        :items="newSchoolForMarkersOnMap"
        @map-moved="changeFilterWithMapMoved"
        @user-location-found="userLocationFound"
      />
    </div>
    <div
      :class="`filter-list-div ${
        openBottomNavFilterList ? `open-bottom-nav` : ``
      }`"
      :style="{ bottom: `${currentBottom}%` }"
      @touchmove="handleDrag"
      @mousemove="handleDrag"
      @touchend="endDrag"
      @mouseup="endDrag"
      @mouseleave="endDrag"
    >
      <div class="grab-line-div" @touchstart="startDrag" @mousedown="startDrag">
        <div class="grab"></div>
      </div>
      <schoolFilter
        :sort-list="sortList"
        @update-filter="updateFilter"
        :total-school-find="totalSchoolFind"
        :is-expand-map="isExpandMapInDesktop"
      />
      <div class="container-div-button" v-if="!isExpandMapInDesktop">
        <v-btn
          @click="changeStatusExpandMap"
          class="text-h4"
          elevation="4"
          prepend-icon="mdi-map-marker"
          color="rgb(18, 183, 106)"
          rounded="xl"
          height="50"
        >
          Map view
        </v-btn>
      </div>
      <schoolListDesktop
        v-if="!isMobile"
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
      <schoolListMobile
        v-if="isMobile"
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
import { onUnmounted } from "vue";
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import schoolFilter from "~/components/school/Filter.vue";
import Map from "~/components/school/Map.vue";

const router = useRouter();
const route = useRoute();

const display = useGlobalDisplay();
const isMobile = ref(display.xs);

const sortList = [
  {
    value: "lastModifyDate",
    title: "Recently Updated",
  },
  {
    value: "score",
    title: "Highest score",
  },
];
const setDefaultSort = (selectedSorts) => {
  if (!selectedSorts.includes("lastModifyDate")) {
    return ["lastModifyDate", ...selectedSorts];
  }
  return selectedSorts;
};

const setDefaultSortToRoute = () => {
  const currentSort = route.query.sort;
  const hasLastModify =
    currentSort &&
    (Array.isArray(currentSort)
      ? currentSort.includes("lastModifyDate")
      : currentSort.split(",").includes("lastModifyDate"));

  if (!hasLastModify) {
    const newSort = currentSort
      ? `lastModifyDate,${currentSort}`
      : "lastModifyDate";

    router.replace({
      query: {
        ...route.query,
        sort: newSort,
      },
    });
  }
};

onMounted(() => {
  setDefaultSortToRoute();
  const footer = document.getElementById("footer-container");
  if (footer) {
    footer.style.display = "none";
  }
});

onUnmounted(() => {
  const footer = document.getElementById("footer-container");
  if (footer) {
    footer.style.display = "unset";
  }
});

// Start Filter Section
const filterForm = ref({
  keyword: route.query.keyword || "",
  country: route.query.country || "",
  state: route.query.state || "",
  city: route.query.city || "",
  stage: route.query.stage || "",
  tuition_fee: Number(route.query.tuition_fee) || 0,
  sort: setDefaultSort(
    Array.isArray(route.query.sort)
      ? route.query.sort
      : route.query.sort
      ? route.query.sort.split(",")
      : []
  ),
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

const defaultLatLongDistance = {
  lat: 39.90973623453719,
  lng: -81.12304687500001,
  distance: 5598568,
};

const userLocationFound = (data) => {
  defaultLatLongDistance.lat = data[0];
  defaultLatLongDistance.lng = data[1];
};

const timer = ref(null);
const isInitialSchoolLoading = ref(false);
const isPaginationSchoolLoading = ref(false);
const isPaginationPreviousSchoolLoading = ref(false);
const schools = ref([]);
const newSchoolForMarkersOnMap = ref([]);
const isAllSchoolLoaded = ref(false);
const pageNumberForLoadPreviousSchool = ref(
  route.query.page ? Number(route.query.page) : 1
);
const pageNumberForLoadNextSchool = ref(
  route.query.page ? Number(route.query.page) : 1
);
const perPage = 20;
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
  filterForm.value = query;
  resetParameter();
  updateQueryParams();
};

const changeFilterWithMapMoved = (locationParam) => {
  if (
    (isExpandMapInDesktop.value && window.innerWidth > 1260) ||
    (!openBottomNavFilterList.value && window.innerWidth < 1260)
  ) {
    filterForm.value.distance = locationParam.distance;
    filterForm.value.lat = locationParam.center[0];
    filterForm.value.lng = locationParam.center[1];
    resetParameter();
    updateQueryParams();
  }
};

const updateQueryParams = () => {
  const query = {};
  Object.entries(filterForm.value).forEach(([key, value]) => {
    if (value) {
      if (
        typeof value === "string" ||
        (typeof value === "number" && value != 0)
      ) {
        query[key] = value;
      } else if (Array.isArray(value) && value.length) {
        const joinText = value.join(",");
        query[key] = joinText;
      }
    }
  });
  router.replace({ query });

  applyFiltersFromQuery(query);
};

const applyFiltersFromQuery = (query) => {
  debouncedGetSchoolList();
};
const debouncedGetSchoolList = () => {
  if (timer.value) {
    clearTimeout(timer.value);
    timer.value = null;
  }

  timer.value = setTimeout(() => {
    getSchoolList();
  }, 800);
};

const metaTitle = ref(
  "School Finder: Your Path to Ideal Education - Find Schools Near You"
);
const setMetaData = (informationResponse) => {
  if (informationResponse.filters && informationResponse.filters.length > 0) {
    let titles = {};
    titles["country-title"] = "";
    titles["state-title"] = "";
    titles["city-title"] = "";
    informationResponse.filters.forEach((item) => {
      titles[item.key] = item.value ? item.value : "";
    });

    if (titles["country-title"].length > 0) {
      metaTitle.value =
        titles["city-title"] +
        " " +
        titles["state-title"] +
        " " +
        titles["country-title"] +
        " Schools";
    } else {
      metaTitle.value =
        "School Finder: Your Path to Ideal Education - Find Schools Near You";
    }
  }

  useHead({
    title: metaTitle.value,

    meta: [
      {
        hid: "apple-mobile-web-app-title",
        name: "apple-mobile-web-app-title",
        content: metaTitle.value,
      },
      {
        hid: "og:title",
        name: "og:title",
        content: metaTitle.value,
      },
      {
        hid: "og:site_name",
        name: "og:site_name",
        content: "GamaTrain",
      },
      {
        hid: "description",
        name: "description",
        content:
          "Explore tailored K12 schools effortlessly with GamaTrain's School Finder. Find the perfect school for your unique needs and set the course for academic success.",
      },
      {
        hid: "og:description",
        name: "og:description",
        content:
          "Explore tailored K12 schools effortlessly with GamaTrain's School Finder. Find the perfect school for your unique needs and set the course for academic success.",
      },
    ],
  });
};

const { data: initialSchools, pending: loadingSchoolsServer } =
  await useAsyncData("schoolListSSR", () => {
    const params = {
      "PagingDto.PageFilter.Skip": (filterForm.value.page - 1) * perPage,
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
    };
    if (filterForm.value.sort && filterForm.value.sort.length > 0) {
      filterForm.value.sort.forEach((sortOption, index) => {
        params[`PagingDto.SortFilter[${index}].sortType`] = "Desc";
        params[`PagingDto.SortFilter[${index}].column`] = sortOption;
      });
    }

    return $fetch("/api/v2/schools", { params });
  });

if (initialSchools.value) {
  setMetaData(initialSchools.value);
  schools.value = initialSchools.value?.data?.list || [];
  totalSchoolFind.value = initialSchools.value?.data?.totalRecordsCount || 0;
  isInitialSchoolLoading.value = false;
  isPaginationSchoolLoading.value = false;
  isPaginationPreviousSchoolLoading.value = false;
}

const getSchoolList = async () => {
  if (isAllSchoolLoaded.value) return;
  try {
    const params = {
      "PagingDto.PageFilter.Skip": (filterForm.value.page - 1) * perPage,
      "PagingDto.PageFilter.Size": perPage,
      "PagingDto.PageFilter.ReturnTotalRecordsCount": true,
    };
    if (filterForm.value.sort && filterForm.value.sort.length > 0) {
      filterForm.value.sort.forEach((sortOption, index) => {
        params[`PagingDto.SortFilter[${index}].sortType`] = "Desc";
        params[`PagingDto.SortFilter[${index}].column`] = sortOption;
      });
    }
    if (isExpandMapInDesktop.value || !openBottomNavFilterList.value) {
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
    setMetaData(response);

    if (response?.data?.list.length < perPage) {
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
    if (isExpandMapInDesktop.value || !openBottomNavFilterList.value) {
      newSchoolForMarkersOnMap.value = response.data.list;
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
  isPaginationSchoolLoading.value = true;
  updateQueryParams();
};

const loadPreviousSchool = () => {
  if (filterForm.value.page > 1) {
    pageNumberForLoadPreviousSchool.value -= 1;
    filterForm.value.page = pageNumberForLoadPreviousSchool.value;
    isPaginationPreviousSchoolLoading.value = true;
    updateQueryParams();
  }
};

// End Filter Section

// Start Open/Close bottom nav and Expand Map in Desktop
const isExpandMapInDesktop = ref(false);

const changeStatusExpandMap = () => {
  isExpandMapInDesktop.value = !isExpandMapInDesktop.value;
  if (isExpandMapInDesktop.value) {
    filterForm.value.lat = defaultLatLongDistance.lat;
    filterForm.value.lng = defaultLatLongDistance.lng;
    filterForm.value.distance = defaultLatLongDistance.distance;
  } else {
    filterForm.value.lat = null;
    filterForm.value.lng = null;
    filterForm.value.distance = null;
  }
  resetParameter();
  updateQueryParams();
};

// End Open/Close bottom nav and Expand Map in Desktop

// Start Handle Drag To Open/Close Bottom Nav
const openBottomNavFilterList = ref(true);

const isDragging = ref(false);
const startY = ref(0);
const startBottom = ref(0);
const CLOSED_BOTTOM = -85;
const OPEN_BOTTOM = 0;
const currentBottom = ref(
  openBottomNavFilterList.value ? OPEN_BOTTOM : CLOSED_BOTTOM
);

const startDrag = (e) => {
  isDragging.value = true;
  startBottom.value = openBottomNavFilterList.value
    ? OPEN_BOTTOM
    : CLOSED_BOTTOM;
  currentBottom.value = startBottom.value;

  startY.value = e.type.includes("touch") ? e.touches[0].clientY : e.clientY;
  document.body.style.overflow = "hidden";
};

const handleDrag = (e) => {
  if (!isDragging.value) return;

  e.preventDefault();
  const currentY = e.type.includes("touch") ? e.touches[0].clientY : e.clientY;
  const deltaY = currentY - startY.value;

  let newBottom =
    (openBottomNavFilterList.value ? -1 : 1) *
    (deltaY / window.innerHeight) *
    100;

  currentBottom.value = newBottom;
};

const endDrag = () => {
  if (!isDragging.value) return;

  isDragging.value = false;
  document.body.style.overflow = "";

  openBottomNavFilterList.value =
    currentBottom.value < -20
      ? !openBottomNavFilterList.value
      : openBottomNavFilterList.value;
  currentBottom.value = openBottomNavFilterList.value
    ? OPEN_BOTTOM
    : CLOSED_BOTTOM;
  if (openBottomNavFilterList.value) {
    filterForm.value.lat = null;
    filterForm.value.lng = null;
    filterForm.value.distance = null;
  } else {
    filterForm.value.lat = defaultLatLongDistance.lat;
    filterForm.value.lng = defaultLatLongDistance.lng;
    filterForm.value.distance = defaultLatLongDistance.distance;
  }
  resetParameter();
  updateQueryParams();
};
// End Handle Drag To Open/Close Bottom Nav
</script>

<style scoped>
@import "../../assets/scss/school/index.scss";
</style>
