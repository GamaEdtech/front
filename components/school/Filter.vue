<template>
  <div class="main-filter-school-div">
    <div class="box-filter-option">
      <div class="container-filter">
        <div class="search-input-contaier">
          <searchInput
            v-model="filterForm.keyword"
            @input="changeSearchValue"
            placeholder="Search anything..."
            icon="mdi-magnify"
            active-color="#ffb600"
            :disable="isExpandMap"
          />
        </div>
        <div class="button-sort-filter-mobile">
          <button class="btn-filter" @click="openFilterMobile">
            <v-icon x-large color="#000000">mdi-filter</v-icon>
          </button>

          <button disabled class="btn-filter" @click="openSortNav($event)">
            <v-icon x-large color="#000000">mdi-filter-variant</v-icon>
          </button>
        </div>
        <div class="filter-options-div">
          <div
            :class="`each-item-filter ${
              item.active && !isExpandMap ? `` : `deactive`
            }`"
            v-for="item in optionFilter"
            :key="item.name"
            @click="openFilterSection($event, item)"
          >
            {{ item.name }}
            <v-icon :color="item.active && !isExpandMap ? `#ffffff` : `#828385`"
              >mdi-chevron-down</v-icon
            >

            <div class="line-seperator"></div>
            <div
              class="main-box-board-option"
              ref="boxStageRef"
              v-if="item.name == `Board` && item.isShow"
            >
              <div
                class="item-board"
                v-for="stage in filter.stageList"
                :key="stage.id"
                @click="selectStage($event, stage)"
              >
                {{ stage.title }}
              </div>
            </div>

            <div
              class="main-box-Tuition"
              ref="boxTuitionRef"
              v-if="item.name == `Tuition fee` && item.isShow"
            >
              <span class="title-Tuition">Maximum Tuition fee</span>
              <span class="subtitle-Tuition">Move the handle</span>

              <input
                class="input-range"
                type="range"
                max="50000"
                min="0"
                step="1000"
                v-model="filterForm.tuition_fee"
                @click.stop=""
                @change="rangeInputChange"
                :style="{
                  background: `linear-gradient(to right, #ffb600 0%, #ffb600 ${
                    filterForm.tuition_fee / 500
                  }%, #ddd ${filterForm.tuition_fee / 500}%, #ddd 100%)`,
                }"
              />
            </div>

            <div
              class="main-box-sort-option"
              ref="boxSortRef"
              v-if="item.name == `Sort` && item.isShow"
            >
              <div
                class="item-sort"
                v-for="item in sortList"
                :key="item.value"
                @click="selectSort($event, item)"
              >
                {{ item.title }}
              </div>
            </div>
          </div>
          <div class="each-item-filter result-div">
            Results
            <span class="count-result" v-if="totalSchoolFind != 0">{{
              totalSchoolFind
            }}</span>
          </div>
        </div>

        <div class="result-div-mobile gama-text-overline">
          Results
          <span
            class="count-result gama-text-button"
            v-if="totalSchoolFind != 0"
            >{{ totalSchoolFind }}</span
          >
        </div>
      </div>
    </div>
    <div
      v-if="optionFilter[2].isShow"
      class="box-region-filter"
      ref="boxRegionRef"
    >
      <div class="cotainer-dropdown">
        <dropDownInput
          v-model="filterForm.country"
          :items="filter.countryList"
          placeholder="Country"
          active-color="#ffb600"
          @update:modelValue="countryChange"
          :is-loading-data="loadingCountry"
        />
      </div>
      <div class="cotainer-dropdown">
        <dropDownInput
          v-model="filterForm.state"
          :items="filter.stateList"
          placeholder="State"
          active-color="#ffb600"
          :disabled="!filterForm.country"
          @update:modelValue="stateChange"
          :is-loading-data="loadingState"
        />
      </div>
      <div class="cotainer-dropdown">
        <dropDownInput
          v-model="filterForm.city"
          :items="filter.cityList"
          placeholder="City"
          active-color="#ffb600"
          :disabled="!filterForm.state"
          @update:modelValue="cityChange"
          :is-loading-data="loadingCity"
        />
      </div>
    </div>

    <div class="overlay-bottom-nav" v-if="showSortNavMobile">
      <div class="sort-bottom-nav" ref="sortBottomNavRef">
        <span class="title">Sort by</span>
        <div
          class="item-sort"
          v-for="item in sortList"
          :key="item.value"
          @click="selectSort($event, item)"
        >
          {{ item.title }}
        </div>
      </div>
    </div>

    <div class="mobile-filter-div" v-if="showFilterMobile">
      <div class="container-scroll">
        <div class="contaier-region-country-filter">
          <div class="box-chips-query-mobile">
            <div class="container-chips">
              <div class="chip-div" v-if="filterForm.keyword.length > 0">
                {{ filterForm.keyword }}
                <v-icon
                  @click="clearFilter(`keyword`)"
                  size="small"
                  color="#252626"
                  >mdi-close-circle</v-icon
                >
              </div>

              <div
                class="chip-div"
                v-if="
                  filterForm.country.length > 0 &&
                  findTitle(`countryList`, filterForm.country)
                "
              >
                {{ findTitle("countryList", filterForm.country) }}
                <v-icon
                  @click="clearFilter(`country`)"
                  size="small"
                  color="#252626"
                  >mdi-close-circle</v-icon
                >
              </div>

              <div
                class="chip-div"
                v-if="
                  filterForm.state.length > 0 &&
                  findTitle(`stateList`, filterForm.state)
                "
              >
                {{ findTitle("stateList", filterForm.state) }}
                <v-icon
                  @click="clearFilter(`state`)"
                  size="small"
                  color="#252626"
                  >mdi-close-circle</v-icon
                >
              </div>

              <div
                class="chip-div"
                v-if="
                  filterForm.city.length > 0 &&
                  findTitle(`cityList`, filterForm.city)
                "
              >
                {{ findTitle("cityList", filterForm.city) }}
                <v-icon
                  @click="clearFilter(`city`)"
                  size="small"
                  color="#252626"
                  >mdi-close-circle</v-icon
                >
              </div>
            </div>
          </div>
          <div class="cotainer-dropdown">
            <gomboBox
              label="Country"
              :items="filter.countryList"
              v-model="filterForm.country"
              :data-loading="!loadingCountry"
              @update:modelValue="countryChange"
            />
          </div>
          <div class="cotainer-dropdown">
            <gomboBox
              label="State"
              :items="filter.stateList"
              v-model="filterForm.state"
              :data-loading="!loadingState"
              :disabled="!filterForm.country"
              @update:modelValue="stateChange"
            />
          </div>
          <div class="cotainer-dropdown">
            <gomboBox
              label="City"
              :items="filter.cityList"
              v-model="filterForm.city"
              :data-loading="!loadingCity"
              :disabled="!filterForm.state"
              @update:modelValue="cityChange"
            />
          </div>
        </div>
        <div class="container-checkbox-group" v-if="false">
          <div class="container-each-group">
            <span class="title-group">Board</span>
            <checkboxInput
              :options="filter.stageList"
              v-model="filterForm.stage"
              :multiple="false"
              @update:modelValue="stageChange"
            />
          </div>

          <div class="container-each-group">
            <span class="title-group">School Type</span>
            <checkboxInput
              :options="filter.schoolTypeList"
              v-model="filterForm.school_type"
              :multiple="true"
              @update:modelValue="schoolTypeChange"
            />
          </div>

          <div class="container-each-group">
            <span class="title-group">Religion</span>
            <checkboxInput
              :options="filter.religion"
              v-model="filterForm.religion"
              :multiple="true"
              @update:modelValue="religionChange"
            />
          </div>

          <div class="container-each-group">
            <span class="title-group">Boarding Type</span>
            <checkboxInput
              :options="filter.boarding_type"
              v-model="filterForm.boarding_type"
              :multiple="true"
              @update:modelValue="boardingTypeChange"
            />
          </div>

          <div class="container-each-group">
            <span class="title-group">Coed Status</span>
            <checkboxInput
              :options="filter.coed_status"
              v-model="filterForm.coed_status"
              :multiple="true"
              @update:modelValue="coedStatusChange"
            />
          </div>
        </div>
        <div class="container-tuition" v-if="false">
          <span class="title-group">Tition fee</span>
          <div class="container-input">
            <div
              class="show-number-fee"
              :style="{
                left: `calc(${filterForm.tuition_fee / 500}% - 40px)`,
              }"
            >
              ${{ filterForm.tuition_fee }}
            </div>
            <input
              class="input-range"
              type="range"
              max="50000"
              min="0"
              step="1000"
              v-model="filterForm.tuition_fee"
              @click.stop=""
              @change="rangeInputChange"
              :style="{
                background: `linear-gradient(to right, #ffb600 0%, #ffb600 ${
                  filterForm.tuition_fee / 500
                }%, #ddd ${filterForm.tuition_fee / 500}%, #ddd 100%)`,
              }"
            />
          </div>
        </div>
        <div class="button-apply-cancel">
          <button class="btn-cancel" @click="closeFilterMobile">Cancel</button>
          <button class="btn-apply" @click="applyFilterMobie">
            Apply filter
          </button>
        </div>
      </div>
    </div>

    <div class="box-chips-query-desktop" v-if="!isExpandMap">
      <div class="container-chips">
        <div class="chip-div" v-if="filterForm.keyword.length > 0">
          {{ filterForm.keyword }}
          <v-icon @click="clearFilter(`keyword`)" size="small" color="#252626"
            >mdi-close-circle</v-icon
          >
        </div>

        <div
          class="chip-div"
          v-if="
            filterForm.country.length > 0 &&
            findTitle(`countryList`, filterForm.country)
          "
        >
          {{ findTitle("countryList", filterForm.country) }}
          <v-icon @click="clearFilter(`country`)" size="small" color="#252626"
            >mdi-close-circle</v-icon
          >
        </div>

        <div
          class="chip-div"
          v-if="
            filterForm.state.length > 0 &&
            findTitle(`stateList`, filterForm.state)
          "
        >
          {{ findTitle("stateList", filterForm.state) }}
          <v-icon @click="clearFilter(`state`)" size="small" color="#252626"
            >mdi-close-circle</v-icon
          >
        </div>

        <div
          class="chip-div"
          v-if="
            filterForm.city.length > 0 && findTitle(`cityList`, filterForm.city)
          "
        >
          {{ findTitle("cityList", filterForm.city) }}
          <v-icon @click="clearFilter(`city`)" size="small" color="#252626"
            >mdi-close-circle</v-icon
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useClickOutside } from "~/composables/useClickOutside";

import searchInput from "~/components/common/search-input.vue";
import dropDownInput from "~/components/common/drop-down-input.vue";
import checkboxInput from "~/components/common/checkbox-input.vue";
import gomboBox from "~/components/common/gombo-box.vue";

const props = defineProps({
  sortList: {
    type: Array,
    required: true,
  },
  totalSchoolFind: {
    type: Number,
    required: true,
  },
  isExpandMap: {
    type: Boolean,
    required: true,
  },
});
const emit = defineEmits(["update-filter"]);
const router = useRouter();
const route = useRoute();

onMounted(() => {
  // Initial data fetch
  getFilterList({ "PagingDto.PageFilter.Size": 250 }, "countries");
  //getFilterList({ type: "section" }, "board");
  //getFilterList({ type: "school_type" }, "school_type");
  //getFilterList({ type: "boarding_type" }, "boarding_type");
  //getFilterList({ type: "coed_status" }, "coed_status");
  //getFilterList({ type: "religion" }, "religion");

  // Initialize from route
  if (route.query.country) {
    getFilterList({ "PagingDto.PageFilter.Size": 10000 }, "states");
  }
  if (route.query.state) {
    getFilterList({ "PagingDto.PageFilter.Size": 10000 }, "cities");
  }
});

// Start Global Function , Refs
const optionFilter = ref([
  {
    name: "Board",
    active: false,
    isShow: false,
  },
  {
    name: "Tuition fee",
    active: false,
    isShow: false,
  },
  {
    name: "Region",
    active: true,
    isShow: false,
  },
  {
    name: "Sort",
    active: false,
    isShow: false,
  },
]);
const filterForm = reactive({
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
const filter = reactive({
  countryList: [],
  stateList: [],
  cityList: [],
  stageList: [],
  schoolTypeList: [],
  boardingTypeList: [],
  coedStatusList: [],
  religionList: [],
});

const getFilterList = async (params, type) => {
  try {
    let endpoint = "/api/v1/types/list";
    if (type === "countries") {
      loadingCountry.value = true;
      endpoint = "/api/v2/locations/countries";
    }
    if (type === "states") {
      loadingState.value = true;
      endpoint = `/api/v2/locations/states/${filterForm.country}`;
    }
    if (type === "cities") {
      loadingCity.value = true;
      endpoint = `/api/v2/locations/cities/${filterForm.state}`;
    }

    const response = await $fetch(endpoint, { params });

    if (type === "countries") {
      loadingCountry.value = false;
      filter.countryList = response.data.list;
    }
    if (type === "states") {
      loadingState.value = false;
      filter.stateList = response.data.list;
    }
    if (type === "cities") {
      loadingCity.value = false;
      filter.cityList = response.data.list;
    }
    if (type === "board") filter.stageList = response.data;
    if (type === "school_type") filter.schoolTypeList = response.data;
    if (type === "boarding_type") filter.boarding_type = response.data;
    if (type === "coed_status") filter.coed_status = response.data;
    if (type === "religion") filter.religion = response.data;
  } catch (err) {
    console.error("Error fetching location data:", err);
  }
};

const updateQueryParams = () => {
  const query = {};

  if (filterForm.keyword) query.keyword = filterForm.keyword;
  if (filterForm.country) query.country = filterForm.country;
  if (filterForm.state) query.state = filterForm.state;
  if (filterForm.city) query.city = filterForm.city;
  if (filterForm.stage) query.stage = filterForm.stage;
  if (filterForm.tuition_fee > 0) query.tuition_fee = filterForm.tuition_fee;
  if (filterForm.sort) query.sort = filterForm.sort;
  if (filterForm.school_type.length > 0 && filterForm.school_type != undefined)
    query.school_type = filterForm.school_type;

  if (
    filterForm.boarding_type.length > 0 &&
    filterForm.boarding_type != undefined
  )
    query.boarding_type = filterForm.boarding_type;
  if (filterForm.coed_status.length > 0 && filterForm.coed_status != undefined)
    query.coed_status = filterForm.coed_status;
  if (filterForm.religion.length > 0 && filterForm.religion != undefined)
    query.religion = filterForm.religion;
  // router.replace({ query });
  emit("update-filter", query);
};

const openFilterSection = (event, filter) => {
  event.stopPropagation();
  if (filter.active && !props.isExpandMap) {
    const lastShowOption = optionFilter.value.filter((item) => item.isShow);
    if (lastShowOption.length > 0) {
      if (lastShowOption[0].name == filter.name) {
        filter.isShow = false;
      } else {
        lastShowOption[0].isShow = false;
        filter.isShow = true;
      }
    } else {
      filter.isShow = true;
    }
  }
};

const clearFilter = (key) => {
  filterForm[key] = "";
  if (key == "country") {
    filter.stateList = [];
    filterForm.state = "";
    filter.cityList = [];
    filterForm.city = "";
  }
  if (key == "state") {
    filter.cityList = [];
    filterForm.city = "";
  }
  if (key == "city") {
    filterForm.city = "";
  }
  updateQueryParams();
};

const findTitle = (list, id) => {
  const itemFounded = filter[list].filter((item) => item.id == id);
  if (itemFounded.length > 0) {
    return itemFounded[0].title;
  }
  return null;
};

// Start Section Filter Location
const boxRegionRef = ref(null);
const loadingCountry = ref(false);
const loadingState = ref(false);
const loadingCity = ref(false);

useClickOutside(boxRegionRef, () => {
  optionFilter.value.filter((item) => item.name == "Region")[0].isShow = false;
});

const countryChange = () => {
  filter.stateList = [];
  filterForm.state = "";
  filter.cityList = [];
  filterForm.city = "";
  if (filterForm.country) {
    getFilterList({ "PagingDto.PageFilter.Size": 10000 }, "states");
  }
  updateQueryParams();
};

const stateChange = () => {
  filter.cityList = [];
  filterForm.city = "";
  if (filterForm.state) {
    getFilterList({ "PagingDto.PageFilter.Size": 10000 }, "cities");
  }
  updateQueryParams();
};

const cityChange = () => {
  updateQueryParams();
};

// End Section Filter Location

// Start Section Filter Search
const changeSearchValue = () => {
  updateQueryParams();
};

// End Section Filter Search

// Start Section Stage
const boxStageRef = ref(null);
const selectStage = (event, stage) => {
  event.stopPropagation();
  filterForm.stage = stage.id;
  optionFilter.value.filter((item) => item.name == "Board")[0].isShow = false;
  updateQueryParams();
};

useClickOutside(boxStageRef, () => {
  optionFilter.value.filter((item) => item.name == "Board")[0].isShow = false;
});
const stageChange = () => {
  updateQueryParams();
};
// End Section Stage

// Start Section TuitionFee
const boxTuitionRef = ref(null);

useClickOutside(boxTuitionRef, () => {
  optionFilter.value.filter(
    (item) => item.name == "Tuition fee"
  )[0].isShow = false;
});

const rangeInputChange = (event) => {
  updateQueryParams();
};

// End Section TuitionFee

// Start Section Sort
const boxSortRef = ref(null);
const showSortNavMobile = ref(false);
const sortBottomNavRef = ref(null);

const selectSort = (event, sort) => {
  event.stopPropagation();
  filterForm.sort = sort.value;
  showSortNavMobile.value = false;
  optionFilter.value.filter((item) => item.name == "Sort")[0].isShow = false;
  updateQueryParams();
};

const openSortNav = (event) => {
  event.stopPropagation();
  showSortNavMobile.value = true;
};

useClickOutside(boxSortRef, () => {
  optionFilter.value.filter((item) => item.name == "Sort")[0].isShow = false;
});

useClickOutside(sortBottomNavRef, () => {
  showSortNavMobile.value = false;
});

// End Section Sort

// Start Section School type, Boarding Type, Religion , Ceod Stats
const schoolTypeChange = () => {
  updateQueryParams();
};

const coedStatusChange = () => {
  updateQueryParams();
};

const boardingTypeChange = () => {
  updateQueryParams();
};

const religionChange = () => {
  updateQueryParams();
};

const showFilterMobile = ref(false);

const openFilterMobile = () => {
  showFilterMobile.value = true;
};

const applyFilterMobie = () => {
  showFilterMobile.value = false;
};

const closeFilterMobile = () => {
  showFilterMobile.value = false;
};
// End Section School type
</script>

<style scoped>
@import "../../assets/scss/school/filter.scss";
</style>
