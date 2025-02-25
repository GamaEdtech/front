<template>
  <div>
    <!-- Desktop section -->
    <div class="d-none d-lg-block">
      <v-toolbar flat id="desktop-school-filter" class="d-none d-lg-block">
        <v-container class="py-0">
          <v-row>
            <v-col cols="5" md="4" lg="4" xl="4" class="pt-md-0">
              <div class="d-flex">
                <div class="px-1">
                  <v-text-field
                    prepend-inner-icon="mdi-magnify"
                    id="search-field"
                    hide-details
                    label="Search anything..."
                    filled
                    v-model="filterForm.keyword"
                    rounded
                    autocomplete="off"
                  >
                    <template v-slot:append>
                      <v-btn
                        large
                        class="primary"
                        :loading="searchLoading"
                        id="search-btn"
                        rounded
                      >
                        Search
                      </v-btn>
                    </template>
                  </v-text-field>
                </div>
              </div>
            </v-col>

            <v-col cols="7" md="8" class="pb-0" id="menu-section">
              <div class="d-flex">
                <v-menu offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      disabled
                      :class="{ 'menu-opened': menuOpened }"
                      class="text-capitalize gtext-t4 font-weight-medium menu-btn"
                      @click="desktopFilter = false"
                      v-bind="attrs"
                      v-on="on"
                    >
                      <span class="grey--text">Board</span>
                      <v-icon right dark color="primary" large>
                        mdi-chevron-down
                      </v-icon>
                    </v-btn>
                  </template>
                  <v-list class="school-filter-list">
                    <v-list-item
                      v-for="(item, index) in filter.stageList"
                      :key="index"
                      @click="updateFilter('stage', item.id)"
                    >
                      <v-list-item-title class="text-h5">{{
                        item.title
                      }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
                <div
                  :class="{ 'menu-opened': menuOpened }"
                  class="vertical-line"
                ></div>

                <v-menu offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      class="text-transform-none gtext-t4 font-weight-medium"
                      @click="desktopFilter = false"
                      v-bind="attrs"
                      disabled
                      v-on="on"
                    >
                      <span class="grey--text"> Tuition fee</span>

                      <!-- &nbsp;<span style="color: #667085; text-transform: none"
                        >to</span
                      >&nbsp;${{ filterForm.tuition_fee | numberFormat }} -->

                      <v-icon right dark color="primary" large>
                        mdi-chevron-down
                      </v-icon>
                    </v-btn>
                  </template>
                  <v-card class="school-filter-list" width="400">
                    <v-card-text class="pt-5 pb-0 pl-8 pr-8">
                      <p class="gtext-t4 font-weight-semibold primary-gray-700">
                        Maximum tuition fee
                      </p>
                      <p class="gtext-t6 primary-gray-700">Move the handle</p>
                      <v-slider
                        dense
                        v-model="filterForm.tuition_fee"
                        max="50000"
                        min="0"
                        step="1000"
                        thumb-size="20"
                        :thumb-label="true"
                      >
                        <template #thumb-label="{ value }">
                          ${{ value | numberFormat }}
                        </template>
                      </v-slider>
                    </v-card-text>
                  </v-card>
                </v-menu>
                <div class="vertical-line"></div>

                <v-btn
                  class="text-capitalize gtext-t4 font-weight-medium"
                  @click="openDesktopFilter"
                >
                  <v-icon right dark size="24"> mdi-filter </v-icon>
                  &nbsp;&nbsp;&nbsp; Region
                  <v-icon right dark color="primary" large>
                    mdi-chevron-down
                  </v-icon>
                </v-btn>
                <div class="vertical-line"></div>

                <v-menu offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      class="text-capitalize gtext-t4 font-weight-medium"
                      @click="desktopFilter = false"
                      v-bind="attrs"
                      disabled
                      v-on="on"
                    >
                      <v-icon right dark size="24"> mdi-filter-variant </v-icon>
                      &nbsp;&nbsp;&nbsp; <span class="grey--text">Sort</span>
                      <v-icon size="24" right dark color="primary">
                        mdi-chevron-down
                      </v-icon>
                    </v-btn>
                  </template>
                  <v-list class="school-filter-list">
                    <v-list-item
                      v-for="(item, index) in sortList"
                      :key="index"
                      @click="updateFilter('sort', item.value)"
                    >
                      <v-list-item-title class="text-h5">{{
                        item.title
                      }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
                <div class="vertical-line"></div>

                <v-btn class="gtext-t4 font-weight-regular text-capitalize">
                  <span class="gray--text">Search result</span> &nbsp;
                  <span class="white--text">
                    {{ resultCount | numberFormat }}
                  </span>
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-toolbar>

      <v-container
        ref="desktopFilter"
        fluid
        id="desktop-school-more-filter"
        v-if="desktopFilter"
      >
        <v-card width="100vw" class="pt-4">
          <v-container>
            <v-row>
              <v-col cols="4">
                <v-autocomplete
                  v-model="filterForm.country"
                  :items="filter.countryList"
                  item-text="title"
                  item-value="id"
                  label="Country"
                  outlined
                  clearable
                  autocomplete="new-password"
                  rounded
                  @change="countryChange()"
                />
              </v-col>
              <v-col cols="4">
                <v-autocomplete
                  v-model="filterForm.state"
                  :items="filter.stateList"
                  item-text="title"
                  item-value="id"
                  label="State"
                  outlined
                  autocomplete="new-password"
                  rounded
                  clearable
                  @change="stateChange()"
                ></v-autocomplete>
              </v-col>
              <v-col cols="4">
                <v-autocomplete
                  v-model="filterForm.city"
                  :items="filter.cityList"
                  item-text="title"
                  item-value="id"
                  label="City"
                  autocomplete="new-password"
                  outlined
                  rounded
                  clearable
                ></v-autocomplete>
              </v-col>
            </v-row>
            <!-- <v-row>
              <v-col cols="3">
                <p class="gtext-t4 font-weight-medium">School type</p>
                <div class="pl-8">
                  <v-checkbox
                    v-for="(item, index) in filter.schoolTypeList"
                    :key="index"
                    v-model="filterForm.school_type"
                    :label="item.title"
                    :value="item.id"
                  ></v-checkbox>
                </div>
              </v-col>
              <v-col cols="3">
                <p class="gtext-t4 font-weight-medium">Religion</p>
                <div class="pl-8">
                  <v-checkbox
                    v-for="(item, index) in filter.religionList"
                    :key="index"
                    v-model="filterForm.religion"
                    :label="item.title"
                    :value="item.id"
                  ></v-checkbox>
                </div>
              </v-col>
              <v-col cols="3">
                <p class="gtext-t4 font-weight-medium">Boarding types</p>
                <div class="pl-8">
                  <v-checkbox
                    v-for="(item, index) in filter.boardingTypeList"
                    :key="index"
                    v-model="filterForm.boarding_type"
                    :label="item.title"
                    :value="item.id"
                  ></v-checkbox>
                </div>
              </v-col>
              <v-col cols="3">
                <p class="gtext-t4 font-weight-medium">Coed status</p>
                <div class="pl-8">
                  <v-checkbox
                    v-for="(item, index) in filter.coedStatusList"
                    :key="index"
                    v-model="filterForm.coed_status"
                    :label="item.title"
                    :value="item.id"
                  ></v-checkbox>
                </div>
              </v-col>
            </v-row> -->
          </v-container>
        </v-card>
      </v-container>
    </div>
    <!-- End desktop section -->

    <!-- Mobile section -->
    <div class="d-block d-lg-none">
      <v-row>
        <v-col cols="12" class="px-4">
          <div id="mobile-school-filter">
            <div class="float-left w-70 mb-6">
              <v-text-field
                prepend-inner-icon="mdi-magnify"
                id="search-field"
                hide-details
                label="Search anything..."
                outlined
                v-model="filterForm.keyword"
                dense
                rounded
                autocomplete="off"
              >
                <template v-slot:append>
                  <v-btn
                    class="primary"
                    :loading="searchLoading"
                    id="search-btn"
                    rounded
                  >
                    Search
                  </v-btn>
                </template>
              </v-text-field>
            </div>

            <div class="float-right" id="filterSection">
              <!-- Filter section -->
              <v-btn
                @click="filterDialog = true"
                small
                fab
                color="#F2F4F7"
                elevation="0"
                class="mr-2"
              >
                <v-icon> mdi-filter </v-icon>
              </v-btn>
              <div v-if="filterDialog" id="filter-dialog">
                <v-card id="filter-card">
                  <v-toolbar color="#fff">
                    <v-toolbar-title class="gtext-h5 primary-gray-600"
                      >Region</v-toolbar-title
                    >
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                      <v-btn icon @click="filterDialog = false">
                        <v-icon color="#D0D5DD ">mdi-close-circle</v-icon>
                      </v-btn>
                    </v-toolbar-items>
                  </v-toolbar>
                  <v-card-text>
                    <v-row class="my-8">
                      <v-col cols="12">
                        <!-- Chip section -->
                        <v-chip
                          small
                          close
                          outlined
                          class="mb-1"
                          v-if="$route.query.keyword"
                          @click:close="closeFilter('keyword')"
                        >
                          {{ $route.query.keyword }}
                        </v-chip>
                        <v-chip
                          small
                          close
                          outlined
                          class="mb-1"
                          v-if="$route.query.stage && filterLoadedStatus.stage"
                          @click:close="closeFilter('stage')"
                        >
                          {{ findTitle("stage", $route.query.stage) }}
                        </v-chip>
                        <v-chip
                          small
                          close
                          outlined
                          class="mb-1"
                          v-if="$route.query.tuition_fee"
                          @click:close="closeFilter('tuition_fee')"
                        >
                          Tuition fee above: ${{
                            $route.query.tuition_fee | numberFormat
                          }}
                        </v-chip>
                        <v-chip
                          small
                          close
                          outlined
                          class="mb-1"
                          v-if="
                            $route.query.country && filterLoadedStatus.country
                          "
                          @click:close="closeFilter('country')"
                        >
                          {{ findTitle("country", $route.query.country) }}
                        </v-chip>
                        <v-chip
                          small
                          close
                          outlined
                          class="mb-1"
                          v-if="$route.query.state && filterLoadedStatus.state"
                          @click:close="closeFilter('state')"
                        >
                          {{ findTitle("state", $route.query.state) }}
                        </v-chip>
                        <v-chip
                          small
                          close
                          outlined
                          class="mb-1"
                          v-if="$route.query.city && filterLoadedStatus.city"
                          @click:close="closeFilter('city')"
                        >
                          {{ findTitle("city", $route.query.city) }}
                        </v-chip>
                        <div
                          v-if="
                            $route.query.school_type &&
                            filterLoadedStatus.school_type
                          "
                        >
                          <v-chip
                            small
                            close
                            outlined
                            class="mb-1"
                            v-for="(item, index) in $route.query.school_type"
                            :key="index"
                            @click:close="closeFilter('school_type', item)"
                          >
                            {{ findTitle("school_type", item) }}
                          </v-chip>
                        </div>

                        <div
                          v-if="
                            $route.query.religion && filterLoadedStatus.religion
                          "
                        >
                          <v-chip
                            small
                            close
                            outlined
                            class="mb-1 mr-1"
                            v-for="(item, index) in $route.query.religion"
                            :key="index"
                            @click:close="closeFilter('religion', item)"
                          >
                            {{ findTitle("religion", item) }}
                          </v-chip>
                        </div>
                        <v-chip
                          small
                          close
                          outlined
                          class="mb-1 mr-1"
                          v-show="
                            $route.query.boarding_type &&
                            filterLoadedStatus.boarding_type
                          "
                          v-for="(item, index) in boardingTypeArray"
                          :key="index"
                          @click:close="closeFilter('boarding_type', item)"
                        >
                          {{ findTitle("boarding_type", item) }}
                        </v-chip>
                        <v-chip
                          small
                          close
                          outlined
                          class="mb-1 mr-1"
                          v-show="
                            $route.query.coed_status &&
                            filterLoadedStatus.coed_status
                          "
                          v-for="(item, index) in coedStatusArray"
                          :key="index"
                          @click:close="closeFilter('coed_status', item)"
                        >
                          {{ findTitle("coed_status", item) }}
                        </v-chip>
                        <v-chip
                          small
                          close
                          outlined
                          class="mb-1 mr-1"
                          v-if="$route.query.sort"
                          @click:close="closeFilter('sort')"
                        >
                          {{ findTitle("sort", $route.query.sort) }}
                        </v-chip>

                        <!-- end chip section -->
                      </v-col>
                      <v-col cols="12" sm="4">
                        <gomboBox
                          label="Country"
                          @change="countryChange()"
                          :items="filter.countryList"
                          itemTitle="title"
                          v-model="filterForm.country"
                        />
                      </v-col>
                      <v-col cols="12" sm="4">
                        <gomboBox
                          label="State"
                          @change="stateChange()"
                          :items="filter.stateList"
                          v-model="filterForm.state"
                          :disabled="checkDisabledStatus('state')"
                        />
                      </v-col>
                      <v-col cols="12" sm="4">
                        <gomboBox
                          label="City"
                          :items="filter.cityList"
                          v-model="filterForm.city"
                          :disabled="checkDisabledStatus('city')"
                        />
                      </v-col>

                      <!-- <v-col cols="12" sm="4">
                        <p class="gtext-t4 font-weight-medium primary-gray-900">
                          Board
                        </p>
                        <div class="pl-8">
                          <v-radio-group v-model="filterForm.stage">
                            <v-radio
                              v-for="(item, index) in filter.stageList"
                              :value="item.id"
                              :key="index"
                              @click="updateFilter('stage', item.id)"
                            >
                              <template #label>
                                <span class="gtext-t4 primary-gray-900">{{
                                  item.title
                                }}</span>
                              </template>
                            </v-radio>
                          </v-radio-group>
                        </div>
                      </v-col>
                      <v-col cols="12" sm="4">
                        <p class="gtext-t4 font-weight-medium primary-gray-900">
                          School type
                        </p>
                        <div class="pl-8">
                          <v-checkbox
                            v-for="(item, index) in filter.schoolTypeList"
                            :key="index"
                            v-model="filterForm.school_type"
                            :value="item.id"
                          >
                            <template #label>
                              <span class="gtext-t4 primary-gray-900">{{
                                item.title
                              }}</span>
                            </template>
                          </v-checkbox>
                        </div>
                      </v-col>
                      <v-col cols="12" sm="4">
                        <p class="gtext-t4 font-weight-medium primary-gray-900">
                          Religion
                        </p>
                        <div class="pl-8">
                          <v-checkbox
                            v-for="(item, index) in filter.religionList"
                            :key="index"
                            v-model="filterForm.religion"
                            :value="item.id"
                          >
                            <template #label>
                              <span class="gtext-t4 primary-gray-900">{{
                                item.title
                              }}</span>
                            </template>
                          </v-checkbox>
                        </div>
                      </v-col>
                      <v-col cols="12" sm="4">
                        <p class="gtext-t4 font-weight-medium primary-gray-900">
                          Boarding types
                        </p>
                        <div class="pl-8">
                          <v-checkbox
                            v-for="(item, index) in filter.boardingTypeList"
                            :key="index"
                            v-model="filterForm.boarding_type"
                            :value="item.id"
                          >
                            <template #label>
                              <span class="gtext-t4 primary-gray-900">{{
                                item.title
                              }}</span>
                            </template>
                          </v-checkbox>
                        </div>
                      </v-col>
                      <v-col cols="12" sm="4">
                        <p class="gtext-t4 font-weight-medium primary-gray-900">
                          Coed status
                        </p>
                        <div class="pl-8">
                          <v-checkbox
                            v-for="(item, index) in filter.coedStatusList"
                            :key="index"
                            v-model="filterForm.coed_status"
                            :value="item.id"
                          >
                            <template #label>
                              <span class="gtext-t4 primary-gray-900">{{
                                item.title
                              }}</span>
                            </template>
                          </v-checkbox>
                        </div>
                      </v-col>
                      <v-col cols="12">
                        <div class="d-flex">
                          <p class="gtext-t4 primary-gray-900">Tuition fee</p>
                          <v-slider
                            dense
                            v-model="filterForm.tuition_fee"
                            max="50000"
                            min="0"
                            step="1000"
                            thumb-size="20"
                            thumb-label="always"
                          >
                            <template #thumb-label="{ value }">
                              ${{ value | numberFormat }}
                            </template>
                          </v-slider>
                        </div>
                      </v-col> -->
                    </v-row>
                  </v-card-text>

                  <v-card-actions id="filter-action">
                    <div class="mx-auto">
                      <v-btn
                        class="text-transform-none primary-gray-800 gtext-t4 cancel-btn"
                        text
                        @click="filterDialog = false"
                      >
                        Cancel
                      </v-btn>
                      <v-btn
                        class="primary text-transform-none apply-btn primary-gray-800 gtext-t4"
                        rounded
                        large
                        @click="filterDialog = false"
                      >
                        Apply filter
                      </v-btn>
                    </div>
                  </v-card-actions>
                </v-card>
              </div>

              <!-- Sort section -->
              <v-bottom-sheet
                v-model="sortSheet"
                style="border-radius: 0rem 3.2rem 3.2rem 0rem"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    small
                    fab
                    color="#F2F4F7"
                    elevation="0"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon> mdi-filter-variant </v-icon>
                  </v-btn>
                </template>

                <v-list id="sortSheetList">
                  <p class="primary-gray-600 gtext-h5 mt-2 mb-2 px-4">
                    Sort by
                  </p>
                  <v-list-item
                    v-for="item in sortList"
                    :key="item.value"
                    @click="updateFilter('sort', item.value)"
                  >
                    <v-list-item-title class="gtext-t4">{{
                      item.title
                    }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-bottom-sheet>
              <!-- End sort section -->
            </div>
          </div>
        </v-col>
      </v-row>
    </div>
    <!-- End mobile section -->

    <!-- Location picker dialog -->
    <v-row justify="center">
      <v-card
        v-if="locationPickerDialog"
        id="locationPickerDialog"
        class="text-center"
      >
        <img
          class="rotating-image"
          :src="require('@/assets/images/earth.png')"
        />

        <p class="gtext-t4">Select Your Location First</p>
        <p class="gtext-t6">
          A lot of schools from all over the world are here
        </p>

        <v-row class="w-md-30 w-sm-50 w-100 mx-auto mt-2 mt-md-10">
          <v-col cols="12">
            <gomboBox
              label="Country"
              @change="countryChange()"
              :items="filter.countryList"
              itemTitle="title"
              v-model="filterForm.country"
            />
          </v-col>
          <v-col cols="12">
            <gomboBox
              label="State"
              @change="stateChange()"
              :items="filter.stateList"
              v-model="filterForm.state"
            />
          </v-col>
          <v-col cols="12">
            <gomboBox
              label="City"
              :items="filter.cityList"
              v-model="filterForm.city"
            />
          </v-col>

          <v-col cols="12">
            <v-btn
              :disabled="!filterForm.city"
              @click="locationPickerDialog = false"
              class="primary text-transform-none gtext-t4 primary-gray-800"
              rounded
              block
              x-large
              >Show Schools</v-btn
            >
          </v-col>

          <v-col cols="12">
            <div class="seprator-section">
              <div class="seprator-word primary-gray-200 gtext-t4">Or</div>
            </div>
          </v-col>

          <v-col cols="12">
            <div
              class="d-flex justify-content-center pointer"
              @click="requestUserLoaction()"
            >
              <div class="my-location">
                <v-icon size="14.4">mdi-crosshairs-gps</v-icon>
              </div>
              <div class="gtext-t5 ml-2">Find Schools Near You</div>
            </div>
          </v-col>
        </v-row>
      </v-card>
    </v-row>
    <!-- End location picker dialog -->
  </div>
</template>

<script>
import gomboBox from "../common/gombo-box.vue";
export default {
  props: {
    sortList: [],
    boardingTypeArray: [],
    coedStatusArray: [],
  },
  name: "schoolListFilter",
  data() {
    return {
      locationPickerDialog: false,
      desktopFilter: false,
      resultCount: "--",
      filter: {
        stageList: [],
        countryList: [],
        stateList: [],
        cityList: [],
        schoolTypeList: [],
        boardingTypeList: [],
        coedStatusList: [],
        religionList: [],
        center: [],
        distance: 10,
      },

      filterForm: {
        keyword: "",
        stage: "",
        tuition_fee: 0,
        country: "",
        state: "",
        city: 0,
        school_type: [],
        religion: [],
        boarding_type: [],
        coed_status: [],
      },
      menuOpened: false,
      searchLoading: false,

      // Mobile section
      sortSheet: false,
      filterDialog: false,
      filterLoadedStatus: {
        stage: false,
        country: false,
        state: false,
        city: false,
        school_type: false,
        religion: false,
        boarding_type: false,
        coed_status: false,
        sort: false,
      },
    };
  },
  created() {
    var params = {
      type: "section",
    };

    this.getFilterList(
      {
        "PagingDto.PageFilter.Size": 250,
      },
      "countries"
    );
    this.getFilterList(params, "section");
    this.getFilterList({ type: "school_type" }, "school_type");
    this.getFilterList({ type: "boarding_type" }, "boarding_type");
    this.getFilterList({ type: "coed_status" }, "coed_status");
    this.getFilterList({ type: "religion" }, "religion");

    //Init filter value
    if (this.$route.query.keyword)
      this.filterForm.keyword = this.$route.query.keyword;
    if (this.$route.query.stage)
      this.filterForm.stage = this.$route.query.stage;
    if (this.$route.query.tuition_fee)
      this.filterForm.tuition_fee = this.$route.query.tuition_fee;
    if (this.$route.query.country) {
      this.filterForm.country = this.$route.query.country;
      this.getFilterList(
        {
          "PagingDto.PageFilter.Size": 1000,
        },
        "states"
      );
    }
    if (this.$route.query.state) {
      this.filterForm.state = this.$route.query.state;
      this.getFilterList(
        {
          "PagingDto.PageFilter.Size": 1000,
        },
        "cities"
      );
    }
    if (this.$route.query.city) this.filterForm.city = this.$route.query.city;

    if (this.$route.query.school_type)
      this.filterForm.school_type = Array.isArray(this.$route.query.school_type)
        ? this.$route.query.school_type
        : [this.$route.query.school_type];

    this.filterForm.city = this.$route.query.city;

    if (this.$route.query.religion)
      this.filterForm.religion = Array.isArray(this.$route.query.religion)
        ? this.$route.query.religion
        : [this.$route.query.religion];

    if (this.$route.query.boarding_type)
      this.filterForm.boarding_type = Array.isArray(
        this.$route.query.boarding_type
      )
        ? this.$route.query.boarding_type
        : [this.$route.query.boarding_type];
    if (this.$route.query.coed_status)
      this.filterForm.coed_status = Array.isArray(this.$route.query.coed_status)
        ? this.$route.query.coed_status
        : [this.$route.query.coed_status];

    if (this.$route.query.sort) this.filterForm.sort = this.$route.query.sort;
    //End init filter value
  },
  watch: {
    "filterForm.keyword"(val) {
      this.updateQueryParams();
    },
    "filterForm.tuition_fee"(val) {
      this.updateQueryParams();
    },
    "filterForm.city"(val) {
      document.removeEventListener("click", this.handleClickOutside);
      this.updateQueryParams();

      setTimeout(() => {
        if (this.desktopFilter) {
          // Add click event listener to close the div when clicking outside
          document.addEventListener("click", this.handleClickOutside);
        } else {
          // Remove click event listener when the div is closed
          document.removeEventListener("click", this.handleClickOutside);
        }
      }, 100);
    },
    "filterForm.school_type"(val) {
      this.updateQueryParams();
    },
    "filterForm.religion"(val) {
      this.updateQueryParams();
    },
    "filterForm.boarding_type"(val) {
      this.updateQueryParams();
    },
    "filterForm.coed_status"(val) {
      this.updateQueryParams();
    },
    "$route.query.distance"(val) {
      this.locationPickerDialog = false;
    },
  },
  components: {
    gomboBox,
  },
  methods: {
    getFilterList(params, type) {
      let endpoint = "/api/v1/types/list";
      if (type == "countries") endpoint = "/api/v2/locations/countries";
      if (type == "states")
        endpoint = `/api/v2/locations/states/${this.filterForm.country}`;
      if (type == "cities")
        endpoint = `/api/v2/locations/cities/${this.filterForm.state}`;
      this.$axios
        .$get(endpoint, {
          params,
        })
        .then((res) => {
          var data = {};
          if (type == "countries") {
            this.filter.countryList = res.data.list;
            this.filterLoadedStatus.country = true;
          } else if (type == "states") {
            this.filter.stateList = res.data.list;
            this.filterLoadedStatus.state = true;
          } else if (type == "cities") {
            this.filter.cityList = res.data.list;
            this.filterLoadedStatus.city = true;
          } else if (type == "school_type") {
            this.filter.schoolTypeList = res.data;
            this.filterLoadedStatus.school_type = true;
          } else if (type == "boarding_type") {
            this.filter.boardingTypeList = res.data;
            this.filterLoadedStatus.boarding_type = true;
          } else if (type == "coed_status") {
            this.filter.coedStatusList = res.data;
            this.filterLoadedStatus.coed_status = true;
          } else if (type == "religion") {
            this.filter.religionList = res.data;
            this.filterLoadedStatus.religion = true;
          } else if (type == "section") {
            this.filter.stageList = res.data;
            this.filterLoadedStatus.stage = true;
          }
          this.$emit("loadedStatus", this.filterLoadedStatus);
        })
        .catch((err) => {
          console.error(err);
        });
    },

    updateFilter(type, value) {
      if (type == "stage") this.filterForm.stage = value;
      if (type == "sort") {
        this.sortSheet = false;
        this.filterForm.sort = value;
      }

      this.updateQueryParams();
    },

    //Update router query params
    updateQueryParams() {
      const query = {};
      if (this.filterForm.keyword != "")
        query.keyword = this.filterForm.keyword;

      if (this.filterForm.stage != "") {
        query.stage = this.filterForm.stage;
      }

      if (this.filterForm.sort != "") {
        query.sort = this.filterForm.sort;
      }

      if (this.filterForm.tuition_fee > 0) {
        query.tuition_fee = this.filterForm.tuition_fee;
      }

      if (this.filterForm.country > 0) {
        query.country = this.filterForm.country;
      }

      if (this.filterForm.state > 0) {
        query.state = this.filterForm.state;
      }

      if (this.filterForm.city > 0) {
        query.city = this.filterForm.city;
      }

      if (
        this.filterForm.school_type &&
        this.filterForm.school_type.length > 0
      ) {
        query.school_type = this.filterForm.school_type;
      }

      if (this.filterForm.religion && this.filterForm.religion.length > 0) {
        query.religion = this.filterForm.religion;
      }

      if (
        this.filterForm.boarding_type &&
        this.filterForm.boarding_type.length > 0
      ) {
        query.boarding_type = this.filterForm.boarding_type;
      }

      if (
        this.filterForm.coed_status &&
        this.filterForm.coed_status.length > 0
      ) {
        query.coed_status = this.filterForm.coed_status;
      }

      if (this.filterForm.distance != "") {
        query.distance = this.filterForm.distance;
      }

      if (
        this.filterForm.center != undefined &&
        this.filterForm.center.length
      ) {
        query.center = this.filterForm.center.join(",");
      }
      if (this.filterForm.lat != "") {
        query.lat = this.filterForm.lat;
      }
      if (this.filterForm.lng != "") {
        query.lng = this.filterForm.lng;
      }

      // Handle more query parameters here ...
      this.$router.replace({ query: query }).catch((err) => {
        console.log(err);
      });
    },

    toggleActiveClass() {
      this.menuOpened = !this.menuOpened;
    },

    countryChange() {
      document.removeEventListener("click", this.handleClickOutside);

      this.filter.stateList = [];
      this.filter.cityList = [];
      this.filterForm.state = "";
      this.filterForm.city = "";
      this.updateQueryParams();
      if (this.filterForm.country) {
        this.getFilterList(
          {
            "PagingDto.PageFilter.Size": 10000,
          },
          "states"
        );
      }

      setTimeout(() => {
        if (this.desktopFilter) {
          // Add click event listener to close the div when clicking outside
          document.addEventListener("click", this.handleClickOutside);
        } else {
          // Remove click event listener when the div is closed
          document.removeEventListener("click", this.handleClickOutside);
        }
      }, 100);
    },
    findTitle(type, id) {
      var title = "";
      if (type == "stage")
        title = this.filter.stageList.find((x) => x.id == id).title;
      if (type == "sort") {
        title = this.sortList.find((x) => x.value == id).title;
      } else if (type == "country")
        title = this.filter.countryList.find((x) => x.id == id).name;
      else if (type == "state")
        title = this.filter.stateList.find((x) => x.id == id).title;
      else if (type == "city")
        title = this.filter.cityList.find((x) => x.id == id).title;
      else if (type == "school_type")
        title = this.filter.schoolTypeList.find((x) => x.id == id).title;
      else if (type == "religion" && this.filter.religionList)
        title = this.filter.religionList.find((x) => x.id == id).title;
      else if (type == "boarding_type")
        title = this.filter.boardingTypeList.find((x) => x.id == id).title;
      else if (type == "coed_status")
        title = this.filter.coedStatusList.find((x) => x.id == id).title;

      return title;
    },
    closeFilter(filter_name, other_data = null) {
      if (filter_name == "keyword") this.filterForm.keyword = "";
      else if (filter_name == "stage") this.updateFilter("stage", "");
      else if (filter_name == "sort") this.updateFilter("sort", "");
      else if (filter_name == "tuition_fee") this.filterForm.tuition_fee = 0;
      else if (filter_name == "country") {
        this.filterForm.country = 0;
        this.filterForm.state = 0;
        this.filterForm.city = 0;
        this.filter.stateList = [];
        this.filter.cityList = [];
        this.updateQueryParams();
      } else if (filter_name == "state") {
        this.filterForm.state = 0;
        this.filterForm.city = 0;
        this.filter.cityList = [];
        this.updateQueryParams();
      } else if (filter_name == "city") {
        this.filterForm.city = 0;
        this.updateQueryParams();
      } else if (filter_name == "school_type") {
        var index = this.school_type.findIndex((x) => x == other_data);
        this.filterForm.school_type.splice(index, 1);
      } else if (filter_name == "religion") {
        var index = this.filterForm.religion.findIndex((x) => x == other_data);
        this.filterForm.religion.splice(index, 1);
      } else if (filter_name == "boarding_type") {
        var index = this.filterForm.boarding_type.findIndex(
          (x) => x == other_data
        );
        this.filterForm.boarding_type.splice(index, 1);
      } else if (filter_name == "coed_status") {
        var index = this.filterForm.coed_status.findIndex(
          (x) => x == other_data
        );
        this.filterForm.coed_status.splice(index, 1);
      }
    },
    stateChange() {
      document.removeEventListener("click", this.handleClickOutside);

      this.filter.cityList = [];
      this.filterForm.city = "";
      this.updateQueryParams();
      if (this.filterForm.state) {
        this.getFilterList(
          {
            "PagingDto.PageFilter.Size": 10000,
          },
          "cities"
        );
      }

      setTimeout(() => {
        if (this.desktopFilter) {
          // Add click event listener to close the div when clicking outside
          document.addEventListener("click", this.handleClickOutside);
        } else {
          // Remove click event listener when the div is closed
          document.removeEventListener("click", this.handleClickOutside);
        }
      }, 100);
    },

    openDesktopFilter() {
      this.desktopFilter = !this.desktopFilter;

      setTimeout(() => {
        if (this.desktopFilter) {
          // Add click event listener to close the div when clicking outside
          document.addEventListener("click", this.handleClickOutside);
        } else {
          // Remove click event listener when the div is closed
          document.removeEventListener("click", this.handleClickOutside);
        }
      }, 100);
    },
    handleClickOutside(event) {
      // Close the div if the click is outside of the div
      const div = this.$refs.desktopFilter;
      if (div && !div.contains(event.target)) {
        this.desktopFilter = false;
        document.removeEventListener("click", this.handleClickOutside);
      }
    },
    requestUserLoaction() {
      this.$emit("requestUserLoaction");
    },
    checkDisabledStatus(field_name) {
      if (field_name == "state")
        if (this.filterForm.country == "") return true;
        else return false;
      else if (field_name == "city")
        if (this.filterForm.state == "") return true;
        else return false;
    },
  },
  beforeDestroy() {
    // Remove the click event listener when the component is destroyed
    document.removeEventListener("click", this.handleClickOutside);
  },
};
</script>

<style>
#mobile-school-filter {
  width: 100%;
  justify-content: space-between;

  .v-text-field--rounded {
    .v-input__control {
      .v-input__slot {
        padding: 0 10px 0 24px;
        background: var(--White, #fff) !important;

        .v-input__append-inner {
          margin-top: 0.4rem !important;

          #search-btn {
            height: 3rem !important;

            .v-btn__content {
              color: black;
              text-transform: none;
              font-family: Inter;
              font-size: 1.4rem;
              font-style: normal;
              font-weight: 500;
              line-height: 2.2rem;
            }
          }
        }
      }
    }
  }

  #filter-dialog {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 1200;
    overflow-y: scroll;
  }
}
#sortSheetList {
  border-radius: 3.2rem 3.2rem 0 0rem;
}

#locationPickerDialog {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1200;
  padding-top: 10rem;
  padding-bottom: 10rem;

  .seprator-section {
    margin-top: 3.2rem;
    width: 100%;
    height: 0.1rem;
    background: #e4e7ec;
    position: relative;

    .seprator-word {
      position: absolute;
      left: 0;
      right: 0;
      top: -1.5rem;
      margin: auto auto;
      background: #fff;
      width: 3rem;
    }
  }

  .my-location {
    width: 2.4rem;
    height: 2.4rem;
    border-radius: 50%;
    background: #ffb600;
  }
}

#filter-card {
  overflow-x: hidden;
  .v-card__actions {
    position: fixed;
    bottom: 0;
    text-align: center;
    background: #fff;
    width: 100%;
    height: 6rem;

    .cancel-btn {
      width: 8rem;
    }
    .apply-btn {
      width: 22rem;
    }
  }

  .v-slider--horizontal .v-slider__track-container {
    height: 6px;
    border-radius: 5px;

    .v-slider__track-background {
      background: #d0d5dd !important;
    }
  }

  .v-slider__thumb-label::before {
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid currentColor;
    bottom: -6px;
    content: "";
    width: 0;
    height: 0;
    position: absolute;
    color: #ffb600;
  }
  .v-slider__thumb-label {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    font-size: 0.75rem !important;
    min-width: 9.4rem !important;
    height: 3.4rem !important;
    border-radius: 4px !important;
    padding: 6px !important;
    position: absolute !important;
    user-select: none !important;
    transform: none !important;
    bottom: 1rem;
    left: -4.7rem;

    /* transition: 0.2s cubic-bezier(0.4, 0, 1, 1) !important; */
  }

  .v-slider__thumb-label div {
    transform: none !important;
    color: #000;
    font-family: Inter;
    font-size: 1.4rem;
    font-style: normal;
    font-weight: 500;
    line-height: 2.2rem;
  }
}

@media (min-width: 1264px) {
  .v-list-item__title {
    font-size: 1.6rem;
  }
  #desktop-school-filter {
    margin-top: 0.58rem;
    padding-top: 0.8rem;
    padding-bottom: 0.4rem;
    height: 9.4rem !important;
    background: var(--primary-grey-800, #1d2939);
    box-shadow: 5px 9px 24px 0px rgba(16, 24, 40, 0.05);
    .v-text-field--rounded {
      .v-input__control {
        .v-input__slot {
          padding: 0 10px 0 24px;
          background: var(--White, #fff) !important;

          .v-input__append-inner {
            margin-top: 0.4rem;

            #search-btn {
              height: 4.7rem;
              .v-btn__content {
                color: black;
                text-transform: none;
                font-family: Inter;
                font-size: 1.4rem;
                font-style: normal;
                font-weight: 500;
                line-height: 2.2rem;
              }
            }
          }
        }
      }
    }

    #menu-section {
      .v-btn--is-elevated {
        box-shadow: none !important;
      }
      .v-btn {
        background: transparent;

        .v-btn__content {
          color: #fff;
        }
      }

      .v-btn::before {
        background: none;
      }
    }
  }

  #desktop-school-more-filter {
    position: absolute;
    top: 7.4rem;
    z-index: 1100;
    padding: 0;
    background: var(--primary-grey-50, #f9fafb);
  }

  .school-filter-list {
    margin-top: 1.6rem;

    .v-slider--horizontal .v-slider__track-container {
      height: 6px;
      border-radius: 5px;

      .v-slider__track-background {
        background: #d0d5dd !important;
      }
    }

    .v-slider__thumb-label::before {
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-top: 6px solid currentColor;
      bottom: -6px;
      content: "";
      width: 0;
      height: 0;
      position: absolute;
      color: #ffb600;
    }
    .v-slider__thumb-label {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      font-size: 0.75rem !important;
      min-width: 9.4rem !important;
      height: 3.4rem !important;
      border-radius: 4px !important;
      padding: 6px !important;
      position: absolute !important;
      user-select: none !important;
      transform: none !important;
      bottom: 1rem;
      left: -4.7rem;

      /* transition: 0.2s cubic-bezier(0.4, 0, 1, 1) !important; */
    }

    .v-slider__thumb-label div {
      transform: none !important;
      color: #000;
      font-family: Inter;
      font-size: 1.4rem;
      font-style: normal;
      font-weight: 500;
      line-height: 2.2rem;
    }
  }

  .menu-btn {
    /* height: 5rem !important; */
    .v-btn__content {
      padding-right: 1.6rem;
    }
  }

  /* .menu-opened {
  border-radius: 10px 10px 0 0;
  background-color: #fff !important; /* Change color when opened */
  /* .v-btn__content { */
  /* color: #000; */
  /* } */
  /* } */

  /* .menu-opened.vertical-line {
  display: none;
} */

  .vertical-line {
    background: var(--primary-grey-400, #98a2b3);
    width: 0.05rem;
    height: 3.6rem;
    /* margin-left: 1.6rem; */
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.rotating-image {
  animation: rotate 50s linear infinite;
}
</style>
