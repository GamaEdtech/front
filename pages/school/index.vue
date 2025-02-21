<template>
  <div id="school-list">
    <schoolListFilter
      ref="schoolFilter"
      @loadedStatus="updateFilterLoadedStatus"
      :sort-list="sortList"
      @requestUserLoaction="getUserLocation()"
      v-if="$vuetify.breakpoint.lgAndUp"
    />
    <div id="map-wrap">
      <client-only>
        <l-map
          ref="schoolMap"
          :zoom="map.zoom"
          :min-zoom="map.minZoom"
          :center="map.center"
          @moveend="onMoveEnd"
          @update:zoom="onZoomChange"
        >
          <l-tile-layer :url="map.url"></l-tile-layer>
          <l-marker
            v-for="(marker, index) in map.markers"
            :key="index"
            @click="$router.push(`/school/1`)"
            :lat-lng="marker.latLng"
            :icon="map.schoolIcon"
          ></l-marker>
        </l-map>
      </client-only>
      <v-container>
        <v-btn
          id="list-view-btn"
          x-large
          class="text-transform-none gtext-t4 font-weight-medium d-none d-lg-block"
          rounded
          color="scoundary"
          @click="isExpanded = true"
        >
          <v-icon>mdi-menu</v-icon>
          &nbsp; List view
        </v-btn>
      </v-container>

      <!-- Sm and md screen section -->
      <div
        id="mobile-school-list-container"
        v-if="$vuetify.breakpoint.mdAndDown"
        class="d-block d-lg-none"
        :style="`height:${mobileDataSheetConfig.sheetHeight}rem`"
      >
        <v-sheet id="school-list-sheet">
          <div
            id="mobile-school-handler-holder"
            @touchstart="startDrag"
            @touchend="endDrag"
            @touchmove="handleDrag"
          >
            <div id="mobile-school-handler"></div>
          </div>

          <v-card flat>
            <v-card flat>
              <div id="keyword-card">
                <v-row>
                  <v-col cols="12" class="pt-0">
                    <div id="mobile-search-result-container" class="px-2">
                      <schoolListFilter
                        ref="schoolFilter"
                        @loadedStatus="updateFilterLoadedStatus"
                        :sort-list="sortList"
                        :boarding-type-array="boardingTypeArray"
                        :coed-status-array="coedStatusArray"
                        @requestUserLoaction="getUserLocation()"
                      />
                      <!-- Chip section -->
                      <v-row v-if="mobileDataSheetConfig.sheetHeight >= 15">
                        <v-col cols="12" class="text-right">
                          <div id="result-stat " class="mr-4">
                            <span class="gama-text-overline">
                              Search result
                            </span>
                            <span class="gama-text-button">
                              {{ resultCount | numberFormat }}
                            </span>
                          </div>
                        </v-col>
                      </v-row>
                      <!-- end chip section -->
                      <div
                        v-if="mobileDataSheetConfig.sheetHeight >= 15"
                        id="search-result"
                        :style="`height:${
                          mobileDataSheetConfig.sheetHeight - 18
                        }rem`"
                        ref="mobileSchoolListSection"
                        @scroll="checkMobileSchoolScroll"
                      >
                        <!-- School list section -->
                        <schoolDataList
                          :schoolLoading="schoolLoading"
                          :schoolList="schoolList"
                          :resultCount="resultCount"
                          :allDataLoaded="allDataLoaded"
                        />
                        <!-- End school list section -->
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </v-card>
          </v-card>
        </v-sheet>
      </div>
      <!-- End sm and md screen section -->
    </div>

    <!-- Large screen section -->
    <div
      id="data-list-holder"
      class="d-none d-lg-block"
      :class="{ expanded: isExpanded }"
      ref="schoolListSection"
      @scroll="checkSchoolScroll"
    >
      <!-- Action section -->
      <v-container id="action-section">
        <v-row>
          <v-col cols="9" class="pt-9">
            <v-chip
              small
              close
              outlined
              v-if="$route.query.keyword"
              @click:close="closeFilter('keyword')"
              class="mb-1"
            >
              {{ $route.query.keyword }}
            </v-chip>
            <v-chip
              small
              close
              outlined
              v-if="$route.query.stage && filterLoadedStatus.stage"
              @click:close="closeFilter('stage')"
              class="mb-1"
            >
              {{ findTitle("stage", $route.query.stage) }}
            </v-chip>
            <v-chip
              small
              close
              outlined
              v-if="$route.query.tuition_fee"
              @click:close="closeFilter('tuition_fee')"
              class="mb-1"
            >
              Tuition fee above: ${{ $route.query.tuition_fee | numberFormat }}
            </v-chip>
            <v-chip
              small
              close
              outlined
              v-if="$route.query.country && filterLoadedStatus.country"
              @click:close="closeFilter('country')"
              class="mb-1"
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
            <v-chip
              small
              close
              outlined
              class="mr-1 mb-1"
              v-if="$route.query.school_type && filterLoadedStatus.school_type"
              v-for="(item, index) in $route.query.school_type"
              :key="index"
              @click:close="closeFilter('school_type', item)"
            >
              {{ findTitle("school_type", item) }}
            </v-chip>
            <v-chip
              small
              close
              outlined
              class="mr-1 mb-1"
              v-if="$route.query.religion && filterLoadedStatus.religion"
              v-for="(item, index) in $route.query.religion"
              :key="index"
              @click:close="closeFilter('religion', item)"
            >
              {{ findTitle("religion", item) }}
            </v-chip>
            <v-chip
              small
              close
              class="mr-1 mb-1"
              outlined
              v-if="
                $route.query.boarding_type && filterLoadedStatus.boarding_type
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
              class="mr-1 mb-1"
              v-if="$route.query.coed_status && filterLoadedStatus.coed_status"
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
              class="mr-1 mb-1"
              v-if="$route.query.sort"
              @click:close="closeFilter('sort')"
            >
              {{ findTitle("sort", $route.query.sort) }}
            </v-chip>
          </v-col>
          <v-col cols="3" class="text-right">
            <v-btn
              v-if="isExpanded"
              x-large
              rounded
              color="#12B76A"
              class="text-transform-none gtext-t4 font-weight-medium"
              dark
              @click="isExpanded = false"
            >
              <v-icon size="16">mdi-map-marker</v-icon>&nbsp; Map view
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
      <!-- Action section -->

      <!-- Data list -->
      <schoolDataList
        :schoolLoading="schoolLoading"
        :schoolList="schoolList"
        :resultCount="resultCount"
        :allDataLoaded="allDataLoaded"
      />
      <!-- End data list -->
    </div>
    <!-- End large screen section -->
  </div>
</template>

<script>
import schoolListFilter from "@/components/school-list/filter";
import schoolDataList from "@/components/school-list/data-list";
export default {
  auth: false,
  name: "school-list",
  head() {
    return {
      titleTemplate: "%s",
      title:
        "School Finder: Your Path to Ideal Education - Find Schools Near You - GamaTrain",

      meta: [
        {
          hid: "apple-mobile-web-app-title",
          name: "apple-mobile-web-app-title",
          content:
            "School Finder: Your Path to Ideal Education - Find Schools Near You - GamaTrain",
        },
        {
          hid: "og:title",
          name: "og:title",
          content:
            "School Finder: Your Path to Ideal Education - Find Schools Near You - GamaTrain",
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
    };
  },
  components: {
    schoolListFilter,
    schoolDataList,
  },
  data() {
    return {
      isExpanded: true,
      map: {
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        zoom: 4,
        minZoom: 2,
        center: [39.90063873634048, -83.44667778604482], // Initial map center coordinates
        markers: [],
        object: null,
        boundingBox: {},
        schoolIcon: null,
      },
      schoolLoading: true,
      pageNum: 1,
      perPage: 10,
      allDataLoaded: false,
      resultCount: "--",
      loadingData: false,
      timer: 0,
      gradeLevelList: [
        {
          title: "test",
        },
        {
          title: "test2",
        },
      ],
      filter: {
        keyword: "",
        stage: "",
        tuition_fee: "",
        country: "",
        state: "",
        city: "",
        school_type: "",
        religion: "",
        boarding_type: "",
        coed_status: "",
        distance: 15,
        center: [],
      },
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

      //Md, sm, xs config
      schoolSheet: false,
      mobileDataSheetConfig: {
        isDragging: false,
        startDragY: 0,
        sheetHeight: 20,
        expanded: true,
        dragSide: "top",
      },
      screenWidth: 0,

      schoolList: [],
      currentZoom: 5,
      geoSearch: false,

      sortList: [
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
      ],
    };
  },
  mounted() {
    document.body.classList.add("disable-scroll");

    if (process.client) {
      this.mobileDataSheetConfig.sheetHeight = window.innerHeight / 10 - 4.6; //4.6 is distance from top
    }

    this.map.schoolIcon = L.icon({
      iconUrl: "/images/school-marker.png", // Replace with school marker icon
      iconSize: [64, 64], // Adjust the size as needed
      iconAnchor: [16, 32], // Adjust the anchor point as needed
    });
    // this.$nextTick(() => {
    //   setTimeout(() => {
    //     this.map.center = [51.505, -0.09];
    //     this.getUserLocation();
    //   }, 1000);
    // });

    this.getSchoolList();

    //Handle show/hide mobile sheet base on size
    this.screenWidth = window.innerWidth;
    if (this.screenWidth < 1264) this.schoolSheet = true;
    window.addEventListener("resize", this.handleResize); //
    //End handle show/hide mobile sheet base on size

    // this.grabLocation("town", "semirom");
  },
  beforeDestroy() {
    document.body.classList.remove("disable-scroll");
    window.removeEventListener("resize", this.handleResize); //Remove listen resize
  },
  watch: {
    screenWidth(val) {
      if (this.screenWidth < 1264) this.schoolSheet = true;
      else this.schoolSheet = false;
    },
    "$route.query.keyword"(val) {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }

      this.timer = setTimeout(() => {
        this.filter.keyword = val;
        this.$refs.schoolFilter.searchLoading = true;
        this.pageNum = 1;
        this.schoolList = [];
        this.allDataLoaded = false;
        this.getSchoolList();
      }, 800);
    },
    "$route.query.stage"(val) {
      this.filter.stage = val;

      if (!this.schoolLoading) {
        this.pageNum = 1;
        this.schoolList = [];
        this.allDataLoaded = false;
        this.getSchoolList();
      }
    },

    "$route.query.tuition_fee"(val) {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }

      this.timer = setTimeout(() => {
        this.filter.tuition_fee = val;
        this.pageNum = 1;
        this.schoolList = [];
        this.allDataLoaded = false;
        this.getSchoolList();
      }, 800);
    },
    "$route.query.country"(val) {
      this.filter.country = val;

      if (!this.schoolLoading) {
        this.pageNum = 1;
        this.schoolList = [];
        this.allDataLoaded = false;
        this.getSchoolList();
      }
    },
    "$route.query.state"(val) {
      this.filter.state = val;

      if (!this.schoolLoading) {
        this.pageNum = 1;
        this.schoolList = [];
        this.allDataLoaded = false;
        this.getSchoolList();
      }
    },
    "$route.query.city"(val) {
      this.filter.city = val;

      if (!this.schoolLoading) {
        this.pageNum = 1;
        this.schoolList = [];
        this.allDataLoaded = false;
        this.getSchoolList();
      }
    },
    "$route.query.school_type"(val) {
      if (val) this.filter.school_type = val.toString();
      else this.filter.school_type = "";

      if (!this.schoolLoading) {
        this.pageNum = 1;
        this.schoolList = [];
        this.allDataLoaded = false;
        this.getSchoolList();
      }
    },
    "$route.query.religion"(val) {
      if (val) this.filter.religion = val.toString();
      else this.filter.religion = "";

      if (!this.schoolLoading) {
        this.pageNum = 1;
        this.schoolList = [];
        this.allDataLoaded = false;
        this.getSchoolList();
      }
    },
    "$route.query.boarding_type"(val) {
      if (val) this.filter.boarding_type = val.toString();
      else this.filter.boarding_type = "";

      if (!this.schoolLoading) {
        this.pageNum = 1;
        this.schoolList = [];
        this.allDataLoaded = false;
        this.getSchoolList();
      }
    },
    "$route.query.coed_status"(val) {
      if (val) this.filter.coed_status = val.toString();
      else this.filter.coed_status = "";

      if (!this.schoolLoading) {
        this.pageNum = 1;
        this.schoolList = [];
        this.allDataLoaded = false;
        this.getSchoolList();
      }
    },
    "$route.query.sort"(val) {
      this.filter.sort = val;

      if (!this.schoolLoading) {
        this.pageNum = 1;
        this.schoolList = [];
        this.allDataLoaded = false;
        this.getSchoolList();
      }
    },
    isExpanded(val) {
      if (val) {
        this.geoSearch = false;
        this.$refs.schoolFilter.filterForm.distance = "";
        this.$refs.schoolFilter.filterForm.center = [];
        this.$refs.schoolFilter.updateQueryParams();
      } else {
        this.geoSearch = true;
      }
      if (!this.schoolLoading) {
        this.allDataLoaded = false;
        this.pageNum = 1;
        this.schoolList = [];
        this.getSchoolList();
      }
    },
  },

  methods: {
    handleResize() {
      this.screenWidth = window.innerWidth;
    },
    onMoveEnd(event) {
      if (!this.isExpanded) {
        const bounds = event.target.getBounds();
        const center = event.target.getCenter(); //Center of map
        this.filter.center = [center.lat, center.lng]; //Update filter
        const ne = bounds.getNorthEast(); //Corner of map
        this.calcDistance(center, ne);
        this.$refs.schoolFilter.filterForm.center = this.filter.center;
        this.$refs.schoolFilter.filterForm.distance = this.filter.distance;
        this.$refs.schoolFilter.updateQueryParams();

        if (!this.schoolLoading) {
          this.allDataLoaded = false;
          this.pageNum = 1;
          this.schoolList = [];
          this.getSchoolList();
        }
      }
    },
    onZoomChange(newZoom) {
      // console.log(newZoom);
    },
    calcDistance(center, ne) {
      // Calculate the distance using Haversine formula
      const R = 6371; // Earth radius in kilometers
      const lat1 = center.lat * (Math.PI / 180);
      const lon1 = center.lng * (Math.PI / 180);
      const lat2 = ne.lat * (Math.PI / 180);
      const lon2 = ne.lng * (Math.PI / 180);

      const dlat = lat2 - lat1;
      const dlon = lon2 - lon1;

      const a =
        Math.sin(dlat / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      this.filter.distance = this.formatNumber(R * c); //retrun distance
    },
    formatNumber(number) {
      //Remove latest zero from number to avoid error from api side
      const roundedNumber = parseFloat(number.toFixed(6));
      const formattedString = roundedNumber.toString();
      const trimmedString = formattedString.replace(/\.?0+$/, ""); // Remove trailing zeros
      return parseFloat(trimmedString);
    },
    getUserLocation() {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // Get the user's coordinates
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;

            // Update the map's center with the user's location
            this.map.center = [userLat, userLng];
            this.isExpanded = false;
          },
          (error) => {
            console.error("Error getting user location:", error);
          }
        );
      } else {
        console.error("Geolocation is not supported in this browser.");
      }
    },

    async getSchoolList() {
      this.schoolLoading = true;
      if (this.allDataLoaded == false)
        this.$axios
          .$get("/api/v2/schools", {
            params: {
              page: this.pageNum,
              "PagingDto.PageFilter.Size": 20,
              "PagingDto.PageFilter.ReturnTotalRecordsCount": true,
              name: this.$route.query.keyword,
              section: this.$route.query.stage,
              tuition_fee: this.$route.query.tuition_fee,
              CountryIds: this.$route.query.country,
              StateIds: this.$route.query.state,
              CityIds: this.$route.query.city,
              school_type: this.$route.query.school_type,
              religion: this.$route.query.religion,
              boarding_type: this.$route.query.boarding_type,
              coed_status: this.$route.query.coed_status,
              sort: this.$route.query.sort,
              distance: this.isExpanded
                ? ""
                : this.$route.query.distance
                ? this.$route.query.distance
                : this.filter.distance,
              center: this.isExpanded
                ? []
                : this.$route.query.center
                ? this.$route.query.center
                : this.map.center.join(","),
            },
          })
          .then((response) => {
            this.resultCount = response.data.totalRecordsCount;
            this.$refs.schoolFilter.resultCount = this.resultCount;

            this.loadingData = false;

            if (this.geoSearch) {
              this.schoolList = response.data.list;
              var newPlaceData = response.data.list
                .filter((obj) => obj.lat !== undefined && obj.lng !== undefined) // Filter out objects with undefined lat or lng
                .map((obj) => ({
                  latLng: [obj.lat, obj.lng],
                }));
              if (newPlaceData.length) {
                this.map.markers.push(...newPlaceData);
              }

              this.allDataLoaded = true;
            } else {
              //If user not in geoloaction and now active geo mode. we set data on map for it and center for map
              var newPlaceData = response.data.list
                .filter((obj) => obj.lat !== undefined && obj.lng !== undefined) // Filter out objects with undefined lat or lng
                .map((obj) => ({
                  latLng: [obj.lat, obj.lng],
                }));
              this.schoolList.push(...response.data.list);
              if (newPlaceData.length) {
                this.map.markers.push(...newPlaceData);
              }
            }

            if (response.data.list.length < this.perPage)
              this.allDataLoaded = true;
          })
          .catch((err) => {
            console.error(err);
          })
          .finally(() => {
            this.schoolLoading = false;
            this.$refs.schoolFilter.searchLoading = false;
          });
    },
    async checkSchoolScroll() {
      if (!this.geoSearch) {
        const scrollableDiv = this.$refs.schoolListSection;
        if (
          this.isScrollAtBottom(scrollableDiv) &&
          this.allDataLoaded == false &&
          !this.loadingData
        ) {
          this.pageNum++;
          this.loadingData = true; // Set loading flag
          await this.getSchoolList();
        }
      }
    },
    async checkMobileSchoolScroll() {
      const scrollableDiv = this.$refs.mobileSchoolListSection;
      if (
        this.isScrollAtBottom(scrollableDiv) &&
        this.allDataLoaded == false &&
        !this.loadingData
      ) {
        this.pageNum++;
        this.loadingData = true; // Set loading flag
        await this.getSchoolList();
      }
    },
    isScrollAtBottom(element) {
      return (
        element.scrollHeight - element.scrollTop - 150 <= element.clientHeight
      );
    },
    closeFilter(filter_name, other_data = null) {
      if (filter_name == "keyword")
        this.$refs.schoolFilter.filterForm.keyword = "";
      else if (filter_name == "stage")
        this.$refs.schoolFilter.updateFilter("stage", "");
      else if (filter_name == "sort")
        this.$refs.schoolFilter.updateFilter("sort", "");
      else if (filter_name == "tuition_fee")
        this.$refs.schoolFilter.filterForm.tuition_fee = 0;
      else if (filter_name == "country") {
        this.$refs.schoolFilter.filterForm.country = 0;
        this.$refs.schoolFilter.filterForm.state = 0;
        this.$refs.schoolFilter.filterForm.city = 0;
        this.$refs.schoolFilter.filter.stateList = [];
        this.$refs.schoolFilter.filter.cityList = [];
        this.$refs.schoolFilter.updateQueryParams();
      } else if (filter_name == "state") {
        this.$refs.schoolFilter.filterForm.state = 0;
        this.$refs.schoolFilter.filterForm.city = 0;
        this.$refs.schoolFilter.filter.cityList = [];
        this.$refs.schoolFilter.updateQueryParams();
      } else if (filter_name == "city") {
        this.$refs.schoolFilter.filterForm.city = 0;
        this.$refs.schoolFilter.updateQueryParams();
      } else if (filter_name == "school_type") {
        var index = this.$refs.schoolFilter.filterForm.school_type.findIndex(
          (x) => x == other_data
        );
        this.$refs.schoolFilter.filterForm.school_type.splice(index, 1);
      } else if (filter_name == "religion") {
        var index = this.$refs.schoolFilter.filterForm.religion.findIndex(
          (x) => x == other_data
        );
        this.$refs.schoolFilter.filterForm.religion.splice(index, 1);
      } else if (filter_name == "boarding_type") {
        var index = this.$refs.schoolFilter.filterForm.boarding_type.findIndex(
          (x) => x == other_data
        );
        this.$refs.schoolFilter.filterForm.boarding_type.splice(index, 1);
      } else if (filter_name == "coed_status") {
        var index = this.$refs.schoolFilter.filterForm.coed_status.findIndex(
          (x) => x == other_data
        );
        this.$refs.schoolFilter.filterForm.coed_status.splice(index, 1);
      }
    },
    findTitle(type, id) {
      var title = "";
      if (type == "stage")
        title = this.$refs.schoolFilter.filter.stageList.find(
          (x) => x.id == id
        ).title;
      if (type == "sort") {
        title = this.sortList.find((x) => x.value == id).title;
      } else if (type == "country") {
        title = this.$refs.schoolFilter.filter.countryList.find(
          (x) => x.id == id
        ).title;
      } else if (type == "state")
        title = this.$refs.schoolFilter.filter.stateList.find(
          (x) => x.id == id
        ).title;
      else if (type == "city")
        title = this.$refs.schoolFilter.filter.cityList.find(
          (x) => x.id == id
        ).title;
      else if (type == "school_type")
        title = this.$refs.schoolFilter.filter.schoolTypeList.find(
          (x) => x.id == id
        ).title;
      else if (
        type == "religion" &&
        this.$refs.schoolFilter.filter.religionList
      )
        title = this.$refs.schoolFilter.filter.religionList.find(
          (x) => x.id == id
        ).title;
      else if (type == "boarding_type")
        title = this.$refs.schoolFilter.filter.boardingTypeList.find(
          (x) => x.id == id
        ).title;
      else if (type == "coed_status")
        title = this.$refs.schoolFilter.filter.coedStatusList.find(
          (x) => x.id == id
        ).title;

      return title;
    },
    startDrag(e) {
      e.preventDefault();
      this.mobileDataSheetConfig.isDragging = true;
      this.mobileDataSheetConfig.startDragY = e.touches[0].clientY;
    },
    handleDrag(e) {
      if (this.mobileDataSheetConfig.isDragging) {
        e.preventDefault();

        const currentY = e.touches[0].clientY;
        const dragDistance = this.mobileDataSheetConfig.startDragY - currentY;

        const currentHeight = this.mobileDataSheetConfig.sheetHeight;
        const newHeight = currentHeight + dragDistance / 10;

        if (newHeight > currentHeight)
          this.mobileDataSheetConfig.dragSide = "top";
        else this.mobileDataSheetConfig.dragSide = "bottom";

        this.mobileDataSheetConfig.sheetHeight = newHeight;
        this.mobileDataSheetConfig.startDragY = currentY;
      }
    },
    endDrag(e) {
      this.mobileDataSheetConfig.isDragging = false;
      if (this.mobileDataSheetConfig.dragSide == "bottom") {
        //10 is for rem and 4 is for divide 1
        this.mobileDataSheetConfig.sheetHeight = 15;
        this.isExpanded = false;
      } else if (this.mobileDataSheetConfig.dragSide == "top")
        this.mobileDataSheetConfig.sheetHeight = window.innerHeight / 10 - 4.6;
      this.isExpanded = true;
    },
    grabLocation(type, title) {
      this.$axios
        .$get("https://nominatim.openstreetmap.org/search", {
          params: {
            q: title,
            format: "json",
          },
        })
        .then((response) => {
          if (response) {
            var itm = response.find((x) => x.addresstype == type);
            console.log([itm.lat, itm.lon]);
          }
          console.log("-1");
        })
        .catch((err) => {
          console.error(err);
        });
    },
    updateFilterLoadedStatus(value) {
      this.filterLoadedStatus = value;
    },
  },
  computed: {
    boardingTypeArray() {
      const boardingType = this.$route.query.boarding_type;

      if (Array.isArray(boardingType)) {
        return boardingType; // If it's already an array, return it as is
      } else if (typeof boardingType === "string") {
        return [boardingType]; // If it's a string, convert it to an array
      } else {
        return []; // If it's neither a string nor an array, return an empty array
      }
    },
    coedStatusArray() {
      const coedStatus = this.$route.query.coed_status;

      if (Array.isArray(coedStatus)) {
        return coedStatus; // If it's already an array, return it as is
      } else if (typeof coedStatus === "string") {
        return [coedStatus]; // If it's a string, convert it to an array
      } else {
        return []; // If it's neither a string nor an array, return an empty array
      }
    },
  },
};
</script>

<style>
.leaflet-control-zoom {
  display: none !important; /* Hide the zoom control */
}
#school-list-sheet {
  border-radius: 3rem 3rem 0 0;
  justify-content: center;
  align-items: center;
  background: #ffffff;
  position: relative;
  padding-top: 5.6rem;
  #mobile-school-handler-holder {
    position: absolute;
    width: 100%;
    height: 6.4rem;
    border-radius: 10rem;
    opacity: 0.4;
    top: 0;
    left: 0;
    right: 0;
    background: #fff;
    margin: auto;
    #mobile-school-handler {
      position: absolute;
      width: 4.2rem;
      height: 0.4rem;
      border-radius: 4rem;
      opacity: 0.4;
      top: 1.6rem;
      left: 0;
      right: 0;
      background: var(--m-3-sys-light-outline, #79747e);
      margin: auto;
    }
  }
}

#school-list {
  position: relative;
  height: 100vh;
  overflow: hidden;

  #map-wrap {
    margin-top: 5.4rem;
    height: 98vh;
    position: relative;
  }

  .container {
    padding-bottom: 0;
    #list-view-btn {
      position: absolute;
      z-index: 400;
      top: 4rem;
      margin-left: 1.2rem;
    }
  }

  #mobile-school-list-container {
    z-index: 1000 !important;
    width: 100%;
    position: fixed;
    bottom: -4.6rem;
  }
}

#mobile-search-result-container {
  #search-result {
    overflow-x: hidden;
    overflow-y: scroll;
    position: relative;
    #data-list {
      #school-list-container {
        padding-bottom: 14rem;
        max-width: 100% !important;
        .list-item {
          display: flex;
          margin-bottom: 0.8rem;
          height: 14.9rem;

          .item-info {
            float: left;
            width: 100%;
            max-width: 100%;
            overflow: hidden;

            .main-data {
              min-height: 8rem;
              justify-content: space-between;

              .list-chip {
                background: var(--primary-warning-50, #fffaeb) !important;
                color: var(--primary-yellow-gama-500, #ffb600) !important;
              }
            }
            .main-data h2 {
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              max-width: 20.6rem;
            }

            .item-footer .v-icon {
              font-size: 2rem !important;
            }
          }

          .item-img {
            float: right;
            justify-content: flex-end;
            width: 10.7rem;
          }

          .item-img img {
            width: 10.7rem;
            height: 8.1rem;
            transition: width 0.5s, height 0.5s;
          }
        }
      }
    }
  }
}

.disable-scroll {
  overflow: hidden !important;
  height: 100vh;
}

.menuable__content__active {
  z-index: 1100 !important;
}

@media (min-width: 1264px) {
  .leaflet-control-zoom {
    display: block !important; /* Hide the zoom control */
  }
  #school-list {
    position: relative;
    height: 100vh;
    overflow: hidden;

    #map-wrap {
      margin-top: 0;
      height: 85vh;
    }

    .container {
      padding-bottom: 0;
      #list-view-btn {
        position: absolute;
        z-index: 400;
        top: 4rem;
        margin-left: 1.2rem;
      }
    }

    #data-list-holder {
      position: fixed;
      z-index: 1000;
      top: 13.88rem;
      right: 0;
      min-width: 40rem;
      width: 40rem;
      background: var(--primary-grey-100, #f2f4f7);
      box-shadow: 5px 9px 24px 0px rgba(16, 24, 40, 0.05);
      height: 86vh;
      transition: width 0.5s;
      overflow: auto;

      #action-section {
        max-width: 100% !important;
        position: sticky;
        top: 0;
        z-index: 402;
        margin-bottom: 2.4rem;
        background: var(--primary-grey-100, #f2f4f7);
      }

      #data-list {
        #school-list-container {
          padding-bottom: 14rem;
          max-width: 100% !important;
          .list-item {
            display: flex;
            margin-bottom: 0.8rem;
            height: 14.9rem;

            .item-info {
              float: left;
              width: 100%;
              max-width: 100%;
              overflow: hidden;

              .main-data {
                min-height: 8rem;
                justify-content: space-between;

                .list-chip {
                  background: var(--primary-warning-50, #fffaeb) !important;
                  color: var(--primary-yellow-gama-500, #ffb600) !important;
                }
              }
              .main-data h2 {
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                max-width: 22.6rem;
              }

              .item-footer .v-icon {
                font-size: 2rem !important;
              }
            }

            .item-img {
              float: right;
              justify-content: flex-end;
              width: 34.5%;
            }

            .item-img img {
              width: 10.7rem;
              height: 8.1rem;
              transition: width 0.5s, height 0.5s;
            }
          }
        }
      }
    }

    #data-list-holder.expanded {
      width: 100vw !important;
      transition: width 0.5s;

      #action-section {
        max-width: 80% !important;
      }

      #data-list {
        #school-list-container {
          max-width: 80% !important;
          .list-item {
            display: flex;
            margin-bottom: 0.8rem;
            height: 15rem;

            .item-info {
              float: left;
              width: 100%;
              min-width: 100%;

              .main-data {
                min-height: 8rem;
              }

              .main-data h2 {
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                max-width: 82.6rem;
              }

              .item-footer .v-icon {
                font-size: 2.4rem !important;
              }
            }

            .item-img {
              float: right;
              width: 14.5%;
              justify-content: flex-end;
            }

            .item-img img {
              width: 15.619rem;
              height: 11.961rem;
              transition: width 0.5s, height 0.5s;
            }
          }
        }
      }
    }

    #mobile-school-list-container {
      z-index: 900 !important;
    }
  }
}
</style>

<style scoped>
.v-footer {
  display: none;
}

#footer-copy-right {
  display: none;
}
</style>
