<template>
  <div id="search-page-filter">
    <div class="content-search">
      <!--Selected filter, user can disable any filter from here-->
      <div v-show="enabledAppliedFilter()" id="chip-container ">
        <p
          class="my-2 mb-md-2 gama-text-body2"
          style="font-weight: 700 !important"
        >
          Applied filter
        </p>
        <v-divider class="mb-1" />
        <v-chip
          v-if="applied_filter.select_section_title"
          class="ma-1"
          closable
          variant="outlined"
          tile
          style="
            border-radius: 5px !important;
            border: 1px solid #d7d7d7 !important;
          "
          @click:close="board_val = 0"
        >
          <span class="text-body- font-weight text-black">
            {{ applied_filter.select_section_title }}
          </span>
        </v-chip>
        <v-chip
          v-if="applied_filter.select_base_title"
          class="ma-1"
          closable
          variant="outlined"
          tile
          style="
            border-radius: 5px !important;
            border: 1px solid #d7d7d7 !important;
          "
          @click:close="base_val = 0"
        >
          <span>
            {{ applied_filter.select_base_title }}
          </span>
        </v-chip>
        <v-chip
          v-if="applied_filter.select_lesson_title"
          class="ma-1"
          closable
          variant="outlined"
          tile
          style="
            border-radius: 5px !important;
            border: 1px solid #d7d7d7 !important;
          "
          @click:close="lesson_val = 0"
        >
          <span>
            {{ applied_filter.select_lesson_title }}
          </span>
        </v-chip>
        <v-chip
          v-if="applied_filter.select_topic_title"
          class="mt-1"
          closable
          variant="outlined"
          tile
          style="
            border-radius: 5px !important;
            border: 1px solid #d7d7d7 !important;
          "
          @click:close="topic_val = 0"
        >
          <span>
            {{ applied_filter.select_topic_title }}
          </span>
        </v-chip>
        <v-chip
          v-if="applied_filter.select_file_type_title"
          class="mt-1"
          closable
          variant="outlined"
          tile
          style="
            border-radius: 5px !important;
            border: 1px solid #d7d7d7 !important;
          "
          @click:close="file_type_val = 0"
        >
          <span> {{ applied_filter.select_file_type_title }}</span>
        </v-chip>

        <!-- Year chip -->
        <v-chip
          v-if="applied_filter.select_year_title"
          class="mt-1"
          closable
          variant="outlined"
          tile
          style="
            border-radius: 5px !important;
            border: 1px solid #d7d7d7 !important;
          "
          @click:close="year_val = 0"
        >
          <span> {{ applied_filter.select_year_title }} </span>
        </v-chip>

        <!-- Month chip -->
        <v-chip
          v-if="applied_filter.select_month_title"
          class="mt-1"
          closable
          variant="outlined"
          tile
          style="
            border-radius: 5px !important;
            border: 1px solid #d7d7d7 !important;
          "
          @click:close="month_val = 0"
        >
          <span>
            {{ applied_filter.select_month_title }}
          </span>
        </v-chip>

        <v-divider class="my-3" />
      </div>
      <!--End select filter  -->

      <!-- Simple flat expansion panels to match design -->
      <v-expansion-panels
        v-model="panelModel"
        variant="accordion"
        flat
        bg-color="#f5f5f5"
        class="filter-panels"
      >
        <!-- Board panel -->
        <v-expansion-panel>
          <v-expansion-panel-title class="filter-title font-weight-bold">
            Board
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-radio-group v-model="board_val">
              <v-radio label="All" color="red" :value="0" />
              <v-radio
                v-for="item in filter.section_list"
                :key="item.id"
                :label="item.title"
                color="red"
                :value="item.id"
              ></v-radio>
            </v-radio-group>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- Grade panel -->
        <v-expansion-panel>
          <v-expansion-panel-title
            :style="{
              color:
                !filter.base_list || !filter.base_list.length
                  ? 'black'
                  : 'transparent',
              pointerEvents:
                !filter.base_list || !filter.base_list.length ? 'none' : 'auto',
            }"
            class="filter-title"
            :class="{
              'filter-inactive': !filter.base_list || !filter.base_list.length,
            }"
          >
            Grade
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-radio-group
              v-model="base_val"
              @change="changeBaseVal()"
              class="mt-0 content-search"
            >
              <v-radio label="All" color="red" :value="0"></v-radio>
              <v-radio
                v-for="item in filter.base_list"
                :key="item.id"
                :label="item.title"
                color="red"
                :value="item.id"
              ></v-radio>
            </v-radio-group>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- Subject panel -->
        <v-expansion-panel>
          <v-expansion-panel-title
            :style="{
              color:
                !filter.lesson_list || !filter.lesson_list.length
                  ? 'black'
                  : 'transparent',
              pointerEvents:
                !filter.lesson_list || !filter.lesson_list.length
                  ? 'none'
                  : 'auto',
            }"
            class="filter-title"
            :class="{
              'filter-inactive':
                !filter.lesson_list || !filter.lesson_list.length,
            }"
          >
            Subject
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-radio-group
              @change="changeLessonVal"
              v-model="lesson_val"
              class="mt-0 content-search"
            >
              <v-radio label="All" color="red" :value="0"></v-radio>
              <v-radio
                v-for="item in filter.lesson_list"
                :key="item.id"
                :label="item.title"
                color="red"
                :value="item.id"
              ></v-radio>
            </v-radio-group>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- Topic panel -->
        <v-expansion-panel>
          <v-expansion-panel-title
            :style="{
              color:
                !filter.topic_list || !filter.topic_list.length
                  ? 'black'
                  : 'transparent',
              pointerEvents:
                !filter.topic_list || !filter.topic_list.length
                  ? 'none'
                  : 'auto',
            }"
            class="filter-title"
            :class="{
              'filter-inactive':
                !filter.topic_list || !filter.topic_list.length,
            }"
          >
            Topic
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-radio-group
              @change="changeTopicVal"
              v-model="topic_val"
              class="mt-0 content-search"
            >
              <v-radio label="All" color="red" :value="0"></v-radio>
              <v-radio
                v-for="item in filter.topic_list"
                :key="item.id"
                :label="item.title"
                color="red"
                :value="item.id"
              ></v-radio>
            </v-radio-group>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- Classification panel -->
        <v-expansion-panel
          :disabled="!board_val && $route.query.type !== 'learnfiles'"
          v-show="
            $route.query.type === 'test' ||
            $route.query.type === 'learnfiles' ||
            $route.query.type === 'azmoon'
          "
        >
          <v-expansion-panel-title
            :style="{
              color:
                !filter.file_type_list || !filter.file_type_list.length
                  ? 'black'
                  : 'transparent',
              pointerEvents:
                !filter.file_type_list || !filter.file_type_list.length
                  ? 'none'
                  : 'auto',
            }"
            class="filter-title filter-inactive"
            :class="{
              'filter-inactive':
                !filter.file_type_list || !filter.file_type_list.length,
            }"
          >
            {{
              $route.query.type === "test" || $route.query.type === "azmoon"
                ? "Classification"
                : "Multimedia Type"
            }}
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-radio-group
              @change="changeFileTypeVal"
              v-model="file_type_val"
              class="mt-0 content-search"
            >
              <v-radio label="All" color="red" :value="0"></v-radio>
              <v-radio
                v-for="item in filter.file_type_list"
                :key="item.id"
                :label="item.title"
                color="red"
                :value="item.id"
              ></v-radio>
            </v-radio-group>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- Year panel -->
        <v-expansion-panel v-show="$route.query.type === 'test'">
          <v-expansion-panel-title class="filter-title font-weight-bold">
            Year
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-radio-group
              v-model="year_val"
              @change="changeYearVal()"
              class="mt-0 content-search"
            >
              <v-radio label="All" color="red" :value="0"></v-radio>
              <v-radio
                v-for="(item, key) in filter.year_list"
                :key="key"
                :label="item"
                color="red"
                :value="item"
              ></v-radio>
            </v-radio-group>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- Month panel -->
        <v-expansion-panel v-show="$route.query.type === 'test'">
          <v-expansion-panel-title class="filter-title font-weight-bold">
            Month
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-radio-group
              @change="changeMonthVal()"
              v-model="month_val"
              class="mt-0 content-search"
            >
              <v-radio label="All" color="red" :value="0"></v-radio>
              <v-radio
                v-for="item in filter.month_list"
                :key="item.id"
                :label="item.title"
                color="red"
                :value="item.id"
              ></v-radio>
            </v-radio-group>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </div>
</template>

<script>
import { title } from "process";
export default {
  name: "search-filter",
  props: {
    brandId: {
      default: 0,
      type: Number,
    },
    cateId: {
      default: 0,
      type: Number,
    },
    modelValue: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["update:modelValue", "setPageTitle"],
  data() {
    return {
      panelModel: [0], // Board panel (index 0) expanded by default
      checkbox: 1,
      scrollInvoked: 0,

      section_loading: false,
      board_val: this.$route.query.section ? this.$route.query.section : 0,

      base_val: this.$route.query.base ? this.$route.query.base : 0,
      lesson_val: this.$route.query.lesson ? this.$route.query.lesson : 0,
      topic_val: this.$route.query.topic ? this.$route.query.topic : 0,
      file_type_val:
        this.$route.query.type == "learnfiles"
          ? this.$route.query.file_type
            ? this.$route.query.file_type
            : 0
          : this.$route.query.test_type
          ? this.$route.query.test_type
          : 0,
      test_level_val: this.$route.query.test_level_val
        ? this.$route.query.test_level_val
        : 0,
      year_val: this.$route.query.edu_year ? this.$route.query.edu_year : 0,
      month_val: this.$route.query.edu_month
        ? Number(this.$route.query.edu_month)
        : 0,
      state_val: 0,
      city_val: 0,
      word_checkbox_val: this.$route.query.word === "1" ? 1 : 0,
      pdf_checkbox_val: this.$route.query.pdf === "1" ? 1 : 0,
      free_checkbox_val: this.$route.query.free === "1" ? 1 : 0,
      answer_checkbox_val: this.$route.query.a_file === "1" ? 1 : 0,
      loadtime: false,
      using_edu_year: !!this.$route.query.edu_year, // Track if we're using edu_year parameter

      applied_filter: {
        select_section_title: "",
        select_base_title: "",
        select_lesson_title: "",
        select_topic_title: "",
        select_file_type_title: "",
        select_test_level_title: "",
        select_state_title: "",
        select_city_title: "",
        select_year_title: "",
        select_month_title: "",
      },

      filter: {
        section_list: [],
        base_list: [],
        lesson_list: [],
        topic_list: [],
        file_type_list: [],
        year_list: [
          2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015,
          2014, 2013,
        ],
        session_list: {
          4161: [
            { id: 3, title: "March" },
            { id: 6, title: "May/Jun" },
            { id: 11, title: "Oct/Nov" },
          ],
          22: [
            { id: 3, title: "March" },
            { id: 6, title: "May/Jun" },
            { id: 11, title: "Oct/Nov" },
          ],
          6374: [
            { id: 6, title: "May/Jun" },
            { id: 11, title: "Oct/Nov" },
          ],
          23: [
            { id: 6, title: "May/Jun" },
            { id: 11, title: "Oct/Nov" },
          ],
          6533: [
            { id: 6, title: "May/Jun" },
            { id: 11, title: "Oct/Nov" },
          ],
          6635: [
            { id: 4, title: "April" },
            { id: 10, title: "October" },
          ],
          6639: [
            { id: 4, title: "April" },
            { id: 10, title: "October" },
          ],
          //AQA-GCSE
          6672: [
            { id: 6, title: "June" },
            { id: 11, title: "November" },
          ],
          //AQA-AS LEVEL
          6673: [{ id: 6, title: "June" }],
          //AQA-A LEVEL
          6674: [{ id: 6, title: "June" }],
          //OCR GCSE
          6676: [
            { id: 6, title: "June" },
            { id: 11, title: "November" },
          ],
          //OCR AS LEVEL
          6677: [
            { id: 6, title: "June" },
            { id: 11, title: "Oct/Nov" },
          ],
          //OCR A LEVEL
          6678: [
            { id: 6, title: "June" },
            { id: 11, title: "Oct/Nov" },
          ],
          //Edexcel A LEVEL
          6671: [
            { id: 6, title: "May/Jun" },
            { id: 11, title: "Oct/Nov" },
          ],
          //Edexcel AS LEVEL
          6675: [
            { id: 6, title: "May/Jun" },
            { id: 11, title: "Oct/Nov" },
          ],
          //Edexcel GCSE
          6669: [
            { id: 6, title: "May/Jun" },
            { id: 11, title: "Oct/Nov" },
          ],
          //Edexcel International A/AS LEVEL
          6670: [
            { id: 1, title: "January" },
            { id: 4, title: "April" },
            { id: 6, title: "June" },
            { id: 10, title: "October" },
            { id: 11, title: "November" },
          ],
          //Edexcel International GCSE
          6668: [
            { id: 1, title: "January" },
            { id: 4, title: "April" },
            { id: 6, title: "June" },
            { id: 10, title: "October" },
            { id: 11, title: "November" },
          ],
        },
        month_list: [
          { id: 1, title: "January" },
          { id: 2, title: "February" },
          { id: 3, title: "March" },
          { id: 4, title: "April" },
          { id: 5, title: "May" },
          { id: 6, title: "June" },
          { id: 7, title: "July" },
          { id: 8, title: "August" },
          { id: 9, title: "September" },
          { id: 10, title: "October" },
          { id: 11, title: "November" },
          { id: 12, title: "December" },
        ],
        state_list: [],
        city_list: [],
        test_level_list: [
          {
            id: "1",
            title: "Simple",
          },
          {
            id: "2",
            title: "Medium",
          },
          {
            id: "3",
            title: "Hard",
          },
        ],
        test_feature_filter: [
          {
            checkbox: this.$route.query.word === "1" ? true : false,
            label: "Word",
            value: "word",
          },
          {
            checkbox: this.$route.query.pdf === "1" ? true : false,
            label: "Pdf",
            value: "pdf",
          },
          {
            checkbox: this.$route.query.free === "1" ? true : false,
            label: "Free",
            value: "free",
          },
          {
            checkbox: this.$route.query.a_file === "1" ? true : false,
            label: "By answer",
            value: "a_file",
          },
        ],
        state_list: [],
        city_list: [],
      },

      breadcrumbs: [],
    };
  },
  created() {
    // In Nuxt 3, we use $fetch for API calls
    // Load the section list for the Board filter
    $fetch("/api/v1/types/list", {
      params: { type: "section" },
      method: "GET",
    })
      .then((res) => {
        if (res && res.data) {
          this.filter.section_list = res.data;

          // If section parameter exists in URL, load related data
          if (this.$route.query.section) {
            this.getFilterList(
              {
                type: "base",
                section_id: this.$route.query.section,
              },
              "base"
            );

            // Set section title in filters - use string comparison for consistent type handling
            const sectionItem = this.filter.section_list.find(
              (x) => String(x.id) === String(this.$route.query.section)
            );
            this.$nextTick(() => {
              if (this.month_val && this.filter.month_list)
                this.applied_filter.select_month_title =
                  this.filter.month_list.find(
                    (x) => x.id == this.month_val
                  ).title;
            });

            if (sectionItem) {
              this.applied_filter.select_section_title = sectionItem.title;
            }
          }
        }
      })
      .catch((err) => {
        console.error("Error loading board filter data:", err);
      });

    // Load state data for tutor page
    if (this.$route.query.type === "tutor") {
      this.getFilterList({ type: "state" }, "state");
    }

    // Set test level if in query params
    if (this.$route.query.level > 0) {
      this.test_level_val = this.$route.query.level;
    }

    // Get file type data for specific content types
    if (
      this.$route.query.type === "test" ||
      this.$route.query.type === "azmoon" ||
      this.$route.query.type == "learnfiles"
    ) {
      this.getFileType();
    }

    // Set year title if edu_year or year is present in URL
    if (this.$route.query.edu_year) {
      this.applied_filter.select_year_title = this.$route.query.edu_year;
      this.using_edu_year = true;
    } else if (this.$route.query.year) {
      this.applied_filter.select_year_title = this.$route.query.year;
      this.using_edu_year = false;
    }

    // Initialize filter with Board panel expanded by default
    this.panelModel = [0]; // Board panel
  },
  mounted() {
    console.log("Route query:", this.$route.query);
    console.log("Board value:", this.board_val, "type:", typeof this.board_val);
    console.log("Applied filters:", this.applied_filter);

    // Force expand Board panel after mounting to ensure it shows properly
    this.$nextTick(() => {
      // Set panelModel to force the Board panel (index 0) to be expanded
      this.panelModel = [0];
      this.setBreadcrumbInfo();
    });
  },
  watch: {
    "$route.query.type"(val) {
      this.filter.file_type_list = [];

      if (
        this.$route.query.type === "test" ||
        this.$route.query.type === "azmoon" ||
        this.$route.query.type == "learnfiles"
      ) {
        this.getFileType();
      }
      // Update breadcrumbs when type changes
      this.setBreadcrumbInfo();
    },
    board_val(val) {
      //Reset base filter
      this.base_val = 0;
      this.lesson_val = 0;
      this.topic_val = 0;

      if (val == "") this.panelModel = [0];
      else this.panelModel = [1];

      this.filter.base_list = [];
      this.filter.lesson_list = [];
      this.filter.topic_list = [];
      this.filter.city_list = [];

      //Reset related tags
      this.applied_filter.select_section_title = "";
      this.applied_filter.select_base_title = "";
      this.applied_filter.select_lesson_title = "";
      this.applied_filter.select_topic_title = "";
      //End reset related tags

      this.updateQueryParams();
      this.setBreadcrumbInfo();

      if (val > 0) {
        // Use string comparison for consistent handling of IDs
        const sectionItem = this.filter.section_list.find(
          (x) => String(x.id) === String(val)
        );

        if (sectionItem) {
          this.applied_filter.select_section_title = sectionItem.title;
        }

        //Load base list
        var params = {
          type: "base",
          section_id: val,
        };
        this.getFilterList(params, "base");
        if (
          this.$route.query.type === "test" ||
          this.$route.query.type == "azmoon"
        ) {
          this.filter.file_type_list = [];
          this.getFileType();
        }
      } else {
        this.applied_filter.select_section_title = "";
        this.loadtime = false;
        // Ensure breadcrumbs are updated when board filter is removed
        this.setBreadcrumbInfo();
      }
    },
    base_val(val) {
      if (val == 0) {
        this.changeBaseVal();
        // Ensure breadcrumbs are updated when base filter is removed via chip
        this.setBreadcrumbInfo();
      }
    },
    lesson_val(val) {
      if (val == 0) {
        this.changeLessonVal();
        // Ensure breadcrumbs are updated when lesson filter is removed via chip
        this.setBreadcrumbInfo();
      }
    },
    topic_val(val) {
      if (val == 0) {
        // Ensure breadcrumbs are updated when topic filter is removed via chip
        this.applied_filter.select_topic_title = "";
        this.setBreadcrumbInfo();
      }
    },
    file_type_val(val) {
      if (val == 0) {
        this.applied_filter.select_file_type_title = "";
        // Ensure breadcrumbs are updated when file type filter is removed
        this.setBreadcrumbInfo();
      }
      this.updateQueryParams();
    },
    test_level_val(val) {
      if (val > 0) {
        this.applied_filter.select_test_level_title =
          this.filter.test_level_list.find((x) => x.id === val).title;
        this.updateQueryParams();
      } else {
        this.applied_filter.select_test_level_title = "";
      }
    },
    state_val(val) {
      this.filter.city_list = [];

      this.updateQueryParams();
      // this.setBreadcrumbInfo();
      if (this.state_val > 0) {
        this.applied_filter.select_state_title = this.filter.state_list.find(
          (x) => x.id === this.state_val
        ).title;
        //Load city list
        var params = {
          type: "city",
          state_id: val,
        };
        this.getFilterList(params, "city");
      } else {
        this.applied_filter.select_state_title = "";
      }
    },
    city_val(val) {
      this.updateQueryParams();
      if (val > 0 && this.filter.city_list.length) {
        this.applied_filter.select_city_title = this.filter.city_list.find(
          (x) => x.id === val
        ).title;
      } else {
        this.applied_filter.select_city_title = "";
      }
    },
    year_val(val) {
      if (val == 0) {
        this.applied_filter.select_year_title = "";
      } else {
        this.applied_filter.select_year_title = val.toString();
      }
      this.updateQueryParams();
      this.setBreadcrumbInfo();
    },
  },

  methods: {
    onScroll() {
      this.scrollInvoked++;
    },
    getFilterList(params, type) {
      // Use Nuxt 3's $fetch API which is globally available
      $fetch("/api/v1/types/list", {
        params,
        method: "GET",
      })
        .then((res) => {
          this.handleFilterResponse(res, type);
        })
        .catch((err) => {
          console.error("Failed to fetch filter data:", err);
        });
    },

    // Separated response handling to its own method for clarity
    handleFilterResponse(res, type) {
      if (res && res.data) {
        if (type === "section") {
          this.filter.section_list = res.data;
          console.log(
            "Section list loaded in handleFilterResponse:",
            this.filter.section_list
          );

          if (this.board_val) {
            console.log(
              "Current board_val:",
              this.board_val,
              "type:",
              typeof this.board_val
            );

            // Use string comparison for reliable ID matching
            const sectionItem = this.filter.section_list.find(
              (x) => String(x.id) === String(this.board_val)
            );

            console.log(
              "Found section item in handleFilterResponse:",
              sectionItem
            );

            if (sectionItem) {
              this.applied_filter.select_section_title = sectionItem.title;
              console.log(
                "Set section title to:",
                this.applied_filter.select_section_title
              );
            } else {
              console.log(
                "Available section IDs:",
                this.filter.section_list.map((x) => ({
                  id: x.id,
                  type: typeof x.id,
                }))
              );
            }
          }
        } else if (type === "base") {
          this.filter.base_list = res.data;

          //Expand Grade panel when base list is received
          if (this.filter.base_list.length > 0) this.panelModel = [1];

          //Get lesson data
          if (this.$route.query.base > 0) {
            var data = {
              type: "lesson",
              base_id: this.$route.query.base,
            };
            this.getFilterList(data, "lesson");

            //Set lesson val
            this.lesson_val = this.$route.query.lesson
              ? this.$route.query.lesson
              : 0;

            //Enable tag
            this.applied_filter.select_base_title = this.filter.base_list.find(
              (x) => x.id === this.base_val
            ).title;

            //Set breadcrumbs info
            this.setBreadcrumbInfo();
          }
        } else if (type === "lesson") {
          this.filter.lesson_list = res.data;

          if (this.filter.lesson_list.length > 0) this.panelModel = [2];

          //Get lesson data
          if (this.$route.query.lesson > 0) {
            var data = {
              type: "topic",
              lesson_id: this.$route.query.lesson,
            };
            this.getFilterList(data, "topic");

            //Set topic val
            this.topic_val = this.$route.query.topic;

            //Enable tag
            this.applied_filter.select_lesson_title =
              this.filter.lesson_list.find(
                (x) => x.id === this.$route.query.lesson
              ).title;

            //Set breadcrumbs info
            this.setBreadcrumbInfo();
          }
        } else if (type === "topic") {
          this.filter.topic_list = res.data;

          if (this.filter.topic_list.length > 0) this.panelModel = [3];

          //Enable tag
          if (this.$route.query.topic > 0)
            this.applied_filter.select_topic_title =
              this.filter.topic_list.find((x) => x.id === this.topic_val).title;
        } else if (type === "state") {
          this.filter.state_list = res.data;

          //Enable tag
          if (this.$route.query.state > 0) {
            this.state_val = this.$route.query.state;
            this.applied_filter.select_state_title =
              this.filter.state_list.find((x) => x.id === this.state_val).title;
          }
          if (this.$route.query.city > 0)
            this.city_val = this.$route.query.city;
        } else if (type === "city") {
          this.filter.city_list = res.data;

          //Enable tag
          if (this.city_val > 0 && this.filter.city_list.length)
            this.applied_filter.select_city_title = this.filter.city_list.find(
              (x) => x.id === this.city_val
            ).title;
        }
      }
    },
    setAppliedFilter(filters) {
      this.applied_filter = filters;
      this.setBreadcrumbInfo(false);
    },

    //Fix the enabledAppliedFilter method to properly check for year and month values
    enabledAppliedFilter() {
      if (
        this.applied_filter.select_base_title ||
        this.applied_filter.select_section_title ||
        this.applied_filter.select_lesson_title ||
        this.applied_filter.select_topic_title ||
        this.applied_filter.select_file_type_title ||
        this.applied_filter.select_test_level_title ||
        this.applied_filter.select_year_title ||
        this.applied_filter.select_month_title
      )
        return true;
      else return false;
    },

    //Change base val option
    changeBaseVal() {
      this.lesson_val = 0;
      this.filter.lesson_list = [];

      //Reset related tags
      this.applied_filter.select_base_title = "";
      this.applied_filter.select_lesson_title = "";
      this.applied_filter.select_topic_title = "";
      //End reset related tags

      this.updateQueryParams();
      if (this.base_val > 0) {
        var params = {
          type: "lesson",
          base_id: this.base_val,
        };

        this.getFilterList(params, "lesson");

        //Enable base title tag
        if (this.filter.base_list.length > 0)
          this.applied_filter.select_base_title = this.filter.base_list.find(
            (x) => x.id === this.base_val
          ).title;

        // Update breadcrumbs immediately
        this.setBreadcrumbInfo();
      } else {
        this.applied_filter.select_base_title = "";
        this.loadtime = false;
        // Update breadcrumbs when filter is cleared
        this.setBreadcrumbInfo();
      }
    },

    //Change lesson val option
    changeLessonVal() {
      this.topic_val = 0;
      this.filter.topic_list = [];

      //Reset related tags
      this.applied_filter.select_lesson_title = "";
      this.applied_filter.select_topic_title = "";
      //End reset related tags

      this.updateQueryParams();
      if (this.lesson_val > 0) {
        var params = {
          type: "topic",
          lesson_id: this.lesson_val,
        };

        this.getFilterList(params, "topic");

        //Enable lesson title tag
        if (this.filter.lesson_list.length > 0)
          this.applied_filter.select_lesson_title =
            this.filter.lesson_list.find((x) => x.id == this.lesson_val).title;

        // Update breadcrumbs immediately
        this.setBreadcrumbInfo();
      } else {
        this.applied_filter.select_topic_title = "";
        this.loadtime = false;
        // Update breadcrumbs when filter is cleared
        this.setBreadcrumbInfo();
      }
    },

    //Change topic val option
    changeTopicVal() {
      //Reset related tags
      this.applied_filter.select_topic_title = "";
      //End reset related tags

      this.updateQueryParams();
      //Enable topic title tag

      if (this.topic_val > 0) {
        this.applied_filter.select_topic_title = this.filter.topic_list.find(
          (x) => x.id === this.topic_val
        ).title;
        // Update breadcrumbs immediately
        this.setBreadcrumbInfo();
      } else {
        this.applied_filter.select_topic_title = "";
        this.loadtime = false;
        // Update breadcrumbs when filter is cleared
        this.setBreadcrumbInfo();
      }
    },

    //Change year val option
    changeYearVal() {
      this.updateQueryParams();

      //Enable year title tag
      if (this.year_val > 0) {
        this.applied_filter.select_year_title = this.year_val.toString();
      } else {
        this.applied_filter.select_year_title = "";
      }

      this.setBreadcrumbInfo();
    },

    //Change month val option
    changeMonthVal() {
      this.updateQueryParams();

      //Enable month title tag
      if (this.month_val > 0) {
        this.applied_filter.select_month_title = this.filter.month_list.find(
          (x) => x.id === this.month_val
        ).title;
      } else {
        this.applied_filter.select_month_title = "";
      }

      this.setBreadcrumbInfo();
    },

    //Change file type option
    changeFileTypeVal() {
      this.updateQueryParams();

      //Enable topic title tag

      if (this.file_type_val > 0)
        this.applied_filter.select_file_type_title =
          this.filter.file_type_list.find(
            (x) => x.id === this.file_type_val
          ).title;
      else this.applied_filter.select_file_type_title = "";

      this.setBreadcrumbInfo();
    },

    changeStateVal() {
      this.city_val = 0;
      this.filter.city_list = [];

      this.updateQueryParams();
      // this.setBreadcrumbInfo();
      if (this.state_val > 0) {
        this.applied_filter.select_state_title = this.filter.state_list.find(
          (x) => x.id === this.state_val
        ).title;
        //Load city list
        var params = {
          type: "city",
          state_id: val,
        };
        this.getFilterList(params, "city");
      } else {
        this.applied_filter.select_state_title = "";
      }
    },

    //Test feature type
    changeTestFeature(type, val) {
      //Word option
      if (type === "word")
        if (val === true) this.word_checkbox_val = 1;
        else this.word_checkbox_val = 0;

      //Pdf option
      if (type === "pdf")
        if (val === true) this.pdf_checkbox_val = 1;
        else this.pdf_checkbox_val = 0;

      //Free option
      if (type === "free")
        if (val === true) this.free_checkbox_val = 1;
        else this.free_checkbox_val = 0;

      //By answer option
      if (type === "a_file")
        if (val === true) this.answer_checkbox_val = 1;
        else this.answer_checkbox_val = 0;

      this.updateQueryParams();
    },

    //set breadcrumbs
    setBreadcrumbInfo(setTitle = true) {
      this.breadcrumbs = [];

      // Type breadcrumb (main category)
      var active_tab = this.$route.query.type;
      var breadcrumb_item = {
        title: "",
        disabled: false,
        href: `/search?type=${active_tab}`,
      };

      if (active_tab === "test") breadcrumb_item.title = "Past Papers";
      else if (active_tab === "learnfiles") breadcrumb_item.title = "Multimedia";
      else if (active_tab === "question") breadcrumb_item.title = "Forum";
      else if (active_tab === "azmoon") breadcrumb_item.title = "QuizHub";
      else if (active_tab === "dars") breadcrumb_item.title = "Tutorial";
      else if (active_tab === "tutor") breadcrumb_item.title = "Tutor";

      this.breadcrumbs.push(breadcrumb_item);

      // Grade section
      if (this.applied_filter.select_section_title) {
        this.breadcrumbs.push({
          title: this.applied_filter.select_section_title,
          disabled: false,
          href: `/search?type=${active_tab}&section=${this.board_val}`,
        });
      }

      // Base filter
      if (this.applied_filter.select_base_title) {
        this.breadcrumbs.push({
          title: this.applied_filter.select_base_title,
          disabled: false,
          href: `/search?type=${active_tab}&section=${this.board_val}&base=${this.base_val}`,
        });
      }

      // Lesson filter
      if (this.applied_filter.select_lesson_title) {
        this.breadcrumbs.push({
          title: this.applied_filter.select_lesson_title,
          disabled: false,
          href: `/search?type=${active_tab}&section=${this.board_val}&base=${this.base_val}&lesson=${this.lesson_val}`,
        });
      }

      // Topic filter
      if (this.applied_filter.select_topic_title) {
        this.breadcrumbs.push({
          title: this.applied_filter.select_topic_title, // Changed from "text" to "title"
          disabled: false,
          href: `/search?type=${active_tab}&section=${this.board_val}&base=${this.base_val}&lesson=${this.lesson_val}&topic=${this.topic_val}`,
        });
      }

      // File type filter
      if (this.applied_filter.select_file_type_title) {
        this.breadcrumbs.push({
          title: this.applied_filter.select_file_type_title, // Changed from "text" to "title"
          disabled: false,
          href: `/search?type=${active_tab}&section=${this.board_val}&base=${
            this.base_val
          }&lesson=${this.lesson_val}&topic=${this.topic_val}&${
            active_tab === "test" ? "test_type" : "file_type"
          }=${this.file_type_val}`,
        });
      }

      // Update page title if needed
      if (setTitle) {
        let page_title = "";
        if (this.$route.query.type === "test") {
          page_title = this.applied_filter.select_section_title
            ? `${this.applied_filter.select_section_title ?? ""} ${
                this.applied_filter.select_base_title ?? ""
              } ${this.applied_filter?.select_lesson_title ?? ""}
                ${
                  this.applied_filter.select_file_type_title
                    ? this.applied_filter.select_file_type_title
                    : " Past Papers"
                }`
            : "Educational Resources | K12 Education Papers and Materials";
        } else if (this.$route.query.type === "learnfiles") {
          page_title = this.applied_filter.select_section_title
            ? `${this.applied_filter.select_section_title ?? ""} ${
                this.applied_filter.select_base_title ?? ""
              }
                ${this.applied_filter?.select_lesson_title ?? ""} ${
                this.applied_filter.select_file_type_title
                  ? this.applied_filter.select_file_type_title
                  : " Multimedia"
              }`
            : "Multimedia Interactive Educational Content; PowerPoint, Video, Class Voice, GamaTrain";
        } else if (this.$route.query.type === "question") {
          page_title = `${this.applied_filter.select_section_title ?? ""} ${
            this.applied_filter.select_base_title ?? ""
          } ${this.applied_filter.select_lesson_title ?? ""} Forum`;
        } else if (this.$route.query.type === "azmoon") {
          page_title = `${this.applied_filter.select_section_title ?? ""} ${
            this.applied_filter.select_base_title ?? ""
          } ${this.applied_filter.select_lesson_title ?? ""} Online test`;
        } else if (this.$route.query.type === "dars") {
          page_title = `${this.applied_filter.select_section_title ?? ""} ${
            this.applied_filter.select_base_title ?? ""
          } ${this.applied_filter.select_lesson_title ?? ""} Textbook`;
        }
        //Emit to parent
        this.$emit("setPageTitle", page_title);
      }
      //Emit to parent breadcrumbs    
      this.$emit("update:modelValue", [...this.breadcrumbs]);
    },
    setFilter(type, list) {
      if (type == "board") this.filter.section_list = list;
      if (type == "grade") this.filter.base_list = list;
      if (type == "subject") this.filter.lesson_list = list;
      if (type == "topic") this.filter.topic_list = list;
      if (type == "file_type") this.filter.file_type_list = list;
    },

    //Get file type
    async getFileType() {
      try {
        const params = {
          type:
            this.$route.query.type == "test" ||
            this.$route.query.type == "azmoon"
              ? "test_type"
              : "content_type",
          section_id:
            this.$route.query.type == "test" ||
            this.$route.query.type == "azmoon"
              ? this.board_val
              : "",
        };

        // Use Nuxt 3's built-in $fetch
        const response = await $fetch("/api/v1/types/list", {
          params,
          method: "GET",
        }).then((res) => {
          this.filter.file_type_list = res.data;

          if (this.$route.query.test_type > 0) {
            this.file_type_val = this.$route.query.test_type;
            this.applied_filter.select_file_type_title =
              this.filter.file_type_list.find(
                (x) => x.id === this.file_type_val
              )?.title;
          }
        });
      } catch (err) {
        console.error("Error fetching file type data:", err);
      }
    },

    //Update router query params
    updateQueryParams() {
      if (this.loadtime) return;

      const query = { type: this.$route.query.type };

      if (this.board_val !== 0) {
        query.section = this.board_val;
      }
      if (this.base_val !== 0) {
        query.base = this.base_val;
      }
      if (this.lesson_val !== 0) {
        query.lesson = this.lesson_val;
      }
      if (this.topic_val !== 0) {
        query.topic = this.topic_val;
      }
      if (this.file_type_val !== 0 && query.type === "test") {
        query.test_type = this.file_type_val;
      }
      if (this.file_type_val !== 0 && query.type === "learnfiles") {
        query.file_type = this.file_type_val;
      }
      if (this.test_level_val !== 0 && query.type === "test") {
        query.level = this.test_level_val;
      }
      if (this.year_val !== 0) {
        query.edu_year = this.year_val;
      }
      if (this.month_val !== 0 && query.type === "test") {
        query.month = this.month_val;
      }
      if (this.word_checkbox_val === 1 && query.type === "test") {
        query.word = 1;
      }
      if (this.pdf_checkbox_val === 1 && query.type === "test") {
        query.pdf = 1;
      }
      if (this.free_checkbox_val === 1 && query.type === "test") {
        query.free = 1;
      }
      if (this.answer_checkbox_val === 1 && query.type === "test") {
        query.a_file = 1;
      }
      if (this.state_val != 0 && query.type === "tutor") {
        query.state = this.state_val;
      }
      if (this.city_val !== 0 && query.type === "tutor") {
        query.city = this.city_val;
      }
      // Handle more query parameters here ...
      this.$router.replace({ query: query }).catch((err) => {
        //Do noting
      });
    },
  },
};
</script>

<style scoped>
@media screen and (max-width: 600px) {
}

/* Filter panels styles to exactly match the screenshot */
.filter-panels {
  border-radius: 0 !important;
  background-color: #f5f5f5 !important;
  box-shadow: none !important;
}

/* Panel title styling */
.filter-title {
  min-height: 48px !important;
  padding: 12px 16px !important;
  font-size: 16px !important;
  font-weight: 500;
  color: #000000 !important;
}
:deep(.v-expansion-panel-text__wrapper) {
  max-height: 20rem !important;
  overflow-y: auto !important;
  padding-inline: 0 !important;
  padding-top: 0 !important;
}

/* Style for expanded panel title icons */
.filter-title .v-expansion-panel-title__icon {
  margin-left: 8px;
}

/* Inactive filter styles */
.filter-inactive {
  color: rgba(0, 0, 0, 0.38) !important;
  font-size: 0.875rem;
  font-weight: 600 !important;
  letter-spacing: 0.0071428571em;
  line-height: 1.375rem;
}

/* Panel styling */
.v-expansion-panel {
  margin-bottom: 0 !important;
  border-radius: 0 !important;
  box-shadow: none !important;
}
/* Remove overlay on hover */
.v-expansion-panel-title:deep(.v-expansion-panel-title__overlay) {
  opacity: 0 !important;
}
/* Remove divider lines between panels */
.v-expansion-panel:not(:first-child)::after {
  border-top: none !important;
}

/* Remove border from the expanded panel */
.v-expansion-panel--active {
  border: none !important;
  box-shadow: none !important;
}

/* Radio group styling */
.v-radio-group {
  margin: 0;
}

.v-radio {
  margin-top: 4px;
}

/* Content box */
.content-box {
  max-height: 20rem;
  overflow-y: auto;
  margin: 0;
  padding: 1rem !important;
}

@media (min-width: 960px) {
  #search-page-filter #chip-container .v-chip .v-chip__content span {
    width: inherit;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}

.v-chip {
  border-radius: 16px !important;
  font-size: 14px !important;
  height: 32px !important;
  font-weight: 400 !important;
}

.v-chip.v-size--default .v-chip__content {
  padding: 0 12px;
}
.v-radio:not(:only-child) {
  margin-bottom: 8px !important;
  margin-top: 0px !important;
  max-height: 1.5rem !important;
  cursor: pointer !important;
}
:deep(.v-selection-control-group) {
  margin-top: 0.5rem !important;
  white-space: nowrap !important;
  word-break: revert-layer !important;
  height: auto !important;
  gap: 1rem !important;
  opacity: 1 !important;
}

:deep(.v-selection-control__input) {
  font-size: 16px !important;
}

:deep(.v-selection-control .v-label) {
  font-size: 16px !important;
  color: #0009 !important;
  height: auto !important;
  min-width: max-content !important;
}

/* Custom breadcrumbs styling to match the screenshot */
:deep(.v-breadcrumbs) {
  padding: 0;
  margin-bottom: 16px;
}

:deep(.v-breadcrumbs-item) {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.87);
}

:deep(.v-breadcrumbs-item--disabled) {
  font-weight: 500;
  color: rgba(0, 0, 0, 0.87);
}

:deep(.v-breadcrumbs-divider) {
  margin: 0 4px;
  color: rgba(0, 0, 0, 0.38);
}

#chip-container {
  padding: 8px;
  background-color: #f5f5f5;
  border-radius: 4px;
  margin-bottom: 16px;
}
</style>
