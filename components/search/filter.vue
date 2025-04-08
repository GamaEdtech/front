<template>
  <div id="search-page-filter">
    <div class="content-search">
      <!--Selected filter, user can disable any filter from here-->
      <div v-show="enabledAppliedFilter()" id="chip-container">
        <p class="my-2 mb-md-2 font-size-16 font-weight-bold black--text">
          Applied filter
        </p>
        <v-divider class="mb-1" />
        <v-chip
          v-if="applied_filter.select_section_title"
          class="mt-1"
          close
          label
          outlined
          @click:close="board_val = 0"
        >
          <span>
            {{ applied_filter.select_section_title }}
          </span>
        </v-chip>
        <v-chip
          v-if="applied_filter.select_base_title"
          class="mt-1"
          close
          label
          outlined
          @click:close="base_val = 0"
        >
          <span>
            {{ applied_filter.select_base_title }}
          </span>
        </v-chip>
        <v-chip
          v-if="applied_filter.select_lesson_title"
          class="mt-1"
          close
          label
          outlined
          @click:close="lesson_val = 0"
        >
          <span>
            {{ applied_filter.select_lesson_title }}
          </span>
        </v-chip>
        <v-chip
          v-if="applied_filter.select_topic_title"
          class="mt-1"
          close
          label
          outlined
          @click:close="topic_val = 0"
        >
          <span>
            {{ applied_filter.select_topic_title }}
          </span>
        </v-chip>
        <v-chip
          v-if="applied_filter.select_file_type_title"
          class="mt-1"
          close
          label
          outlined
          @click:close="file_type_val = 0"
        >
          <span> {{ applied_filter.select_file_type_title }}</span>
        </v-chip>
        <v-chip
          v-if="applied_filter.select_test_level_title"
          class="mt-1"
          close
          label
          outlined
          @click:close="test_level_val = 0"
        >
          <span>
            {{ applied_filter.select_test_level_title }}
          </span>
        </v-chip>
        <v-chip
          v-show="year_val"
          class="mt-1"
          close
          label
          outlined
          @click:close="year_val = 0"
        >
          {{ year_val }}
        </v-chip>

        <v-chip
          v-if="month_val"
          class="mt-1"
          close
          label
          outlined
          @click:close="month_val = 0"
        >
          <span>
            {{ applied_filter.select_month_title }}
          </span>
        </v-chip>

        <v-divider class="my-3" />
      </div>
      <!--End select filter  -->

      <v-expansion-panels flat v-model="panel">
        <v-expansion-panel>
          <v-expansion-panel-header
            color="#f5f5f5"
            class="px-0 font-size-16 font-weight-bold"
          >
            Board
          </v-expansion-panel-header>
          <v-expansion-panel-content color="#f5f5f5">
            <v-row>
              <v-col cols="12" class="content-box">
                <v-radio-group v-model="board_val" class="mt-0 pr-0" column>
                  <v-radio label="All" color="red" :value="0"> </v-radio>
                  <v-radio
                    v-for="item in filter.section_list"
                    :key="item.id"
                    :label="item.title"
                    color="red"
                    :value="item.id"
                  >
                  </v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <!--Grade filter-->
        <v-expansion-panel :disabled="!filter.base_list.length">
          <v-expansion-panel-header
            color="#f5f5f5"
            class="px-0 font-weight-bold font-size-16"
            >Grade</v-expansion-panel-header
          >
          <v-expansion-panel-content color="#f5f5f5">
            <v-row align="center" justify="center">
              <v-col cols="12" class="content-box">
                <v-radio-group
                  v-model="base_val"
                  @change="changeBaseVal()"
                  class="mt-0 pr-0"
                  column
                >
                  <v-radio label="All" color="red" :value="0"> </v-radio>
                  <v-radio
                    v-for="item in filter.base_list"
                    :key="item.id"
                    :label="item.title"
                    color="red"
                    :value="item.id"
                  >
                  </v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <!--Lesson filter-->
        <v-expansion-panel :disabled="!filter.lesson_list.length">
          <v-expansion-panel-header
            color="#f5f5f5"
            class="px-0 font-weight-bold font-size-16"
            >Subject</v-expansion-panel-header
          >
          <v-expansion-panel-content color="#f5f5f5">
            <v-row align="center" justify="center">
              <v-col cols="12" class="content-box">
                <v-radio-group
                  @change="changeLessonVal"
                  v-model="lesson_val"
                  class="mt-0 pr-0"
                  column
                >
                  <v-radio label="All" color="red" :value="0"> </v-radio>
                  <v-radio
                    v-for="item in filter.lesson_list"
                    :key="item.id"
                    :label="item.title"
                    color="red"
                    :value="item.id"
                  >
                  </v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <!--Topic filter-->
        <v-expansion-panel :disabled="!filter.topic_list.length">
          <v-expansion-panel-header
            color="#f5f5f5"
            class="px-0 font-weight-bold font-size-16"
            >Topic</v-expansion-panel-header
          >
          <v-expansion-panel-content color="#f5f5f5">
            <v-row align="center" justify="center">
              <v-col cols="12" class="content-box">
                <v-radio-group
                  @change="changeTopicVal"
                  v-model="topic_val"
                  class="mt-0 pr-0"
                  column
                >
                  <v-radio label="All" color="red" :value="0"> </v-radio>
                  <v-radio
                    v-for="item in filter.topic_list"
                    :key="item.id"
                    :label="item.title"
                    color="red"
                    :value="item.id"
                  >
                  </v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <!--File type filter-->
        <v-expansion-panel
          :disabled="!board_val && $route.query.type !== 'learnfiles'"
          v-show="
            $route.query.type === 'test' ||
            $route.query.type === 'learnfiles' ||
            $route.query.type === 'azmoon'
          "
        >
          <v-expansion-panel-header
            color="#f5f5f5"
            class="px-0 font-size-16 font-weight-bold"
          >
            {{
              $route.query.type === "test" || $route.query.type === "azmoon"
                ? "Classification"
                : "Multimedia Type"
            }}
          </v-expansion-panel-header>
          <v-expansion-panel-content color="#f5f5f5">
            <v-row align="center" justify="center">
              <v-col cols="12" class="content-box">
                <v-radio-group
                  @change="changeFileTypeVal"
                  v-model="file_type_val"
                  class="mt-0 pr-0"
                  column
                >
                  <v-radio label="All" color="red" :value="0"> </v-radio>
                  <v-radio
                    v-for="item in filter.file_type_list"
                    :key="item.id"
                    :label="item.title"
                    color="red"
                    :value="item.id"
                  >
                  </v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <!-- Edu year -->
        <!--Grade filter-->
        <v-expansion-panel v-show="$route.query.type === 'test'">
          <v-expansion-panel-header
            color="#f5f5f5"
            class="px-0 font-weight-bold font-size-16"
            >Year</v-expansion-panel-header
          >
          <v-expansion-panel-content color="#f5f5f5">
            <v-row align="center" justify="center">
              <v-col cols="12" class="content-box">
                <v-radio-group
                  v-model="year_val"
                  @change="changeYearVal()"
                  class="mt-0 pr-0"
                  column
                >
                  <v-radio label="All" color="red" :value="0"> </v-radio>
                  <v-radio
                    v-for="(item, key) in filter.year_list"
                    :key="key"
                    :label="item"
                    color="red"
                    :value="item"
                  >
                  </v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <!-- End edu year -->

        <!-- Edu month -->
        <v-expansion-panel v-show="$route.query.type === 'test'">
          <v-expansion-panel-header
            color="#f5f5f5"
            class="px-0 font-size-16 font-weight-bold"
          >
            Month
          </v-expansion-panel-header>
          <v-expansion-panel-content color="#f5f5f5">
            <v-row align="center" justify="center">
              <v-col cols="12" class="content-box">
                <v-radio-group
                  @change="changeMonthVal()"
                  v-model="month_val"
                  class="mt-0 pr-0"
                  column
                >
                  <v-radio label="All" color="red" :value="0"> </v-radio>
                  <v-radio
                    v-for="item in filter.month_list"
                    :key="item.id"
                    :label="item.title"
                    color="red"
                    :value="item.id"
                  >
                  </v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <!-- End edu month -->

        <!--Test level filter-->
        <!--      <v-expansion-panel v-show="filter.test_level_list.length>0 && $route.query.type==='test'">-->
        <!--        <v-expansion-panel-header-->
        <!--          color="#f5f5f5"-->
        <!--          class="font-weight-bold font-size-16">-->
        <!--          Difficulty level-->
        <!--        </v-expansion-panel-header>-->
        <!--        <v-expansion-panel-content-->
        <!--          color="#f5f5f5"-->
        <!--        >-->
        <!--          <v-row-->
        <!--            align="center"-->
        <!--            justify="center"-->
        <!--          >-->
        <!--            <v-col cols="12" class="pt-0 pr-0 m-0" style="height: 100%">-->
        <!--              <v-radio-group-->
        <!--                v-model="test_level_val"-->
        <!--                class="mt-0 pr-0"-->
        <!--                column-->
        <!--              >-->
        <!--                <v-radio-->
        <!--                  label="All"-->
        <!--                  color="red"-->
        <!--                  :value="0"-->
        <!--                >-->
        <!--                </v-radio>-->
        <!--                <v-radio-->
        <!--                  v-for="item in filter.test_level_list"-->
        <!--                  :label="item.title"-->
        <!--                  color="red"-->
        <!--                  :value="item.id"-->
        <!--                >-->
        <!--                </v-radio>-->

        <!--              </v-radio-group>-->
        <!--            </v-col>-->

        <!--          </v-row>-->
        <!--        </v-expansion-panel-content>-->
        <!--      </v-expansion-panel>-->

        <!--Test feature-->
        <!--      <v-expansion-panel  v-show="$route.query.type==='test'">-->
        <!--        <v-expansion-panel-header-->
        <!--          color="#f5f5f5"-->
        <!--          class="font-weight-bold font-size-16">-->
        <!--          Test features-->
        <!--        </v-expansion-panel-header>-->
        <!--        <v-expansion-panel-content color="#f5f5f5">-->
        <!--          <v-row-->
        <!--            align="center"-->
        <!--            justify="center"-->
        <!--          >-->
        <!--            <v-col cols="12" class="pt-0 pr-0 m-0" style="height: 100%">-->
        <!--              <v-checkbox v-for="item in filter.test_feature_filter"-->
        <!--                          class="my-0" style="height: 4rem"-->
        <!--                          @change="changeTestFeature(item.value,item.checkbox)"-->
        <!--                          :hide-details="true"-->
        <!--                          color="red"-->
        <!--                          v-model="item.checkbox"-->
        <!--                          :label="item.label"-->
        <!--              />-->
        <!--            </v-col>-->

        <!--          </v-row>-->
        <!--        </v-expansion-panel-content>-->
        <!--      </v-expansion-panel>-->

        <!--State-->
        <!--      <v-expansion-panel v-show="$route.query.type==='tutor'">-->
        <!--        <v-expansion-panel-header-->
        <!--          color="#f5f5f5"-->
        <!--          class="font-weight-bold font-size-16">-->
        <!--          State-->
        <!--        </v-expansion-panel-header>-->
        <!--        <v-expansion-panel-content-->
        <!--          color="#f5f5f5"-->
        <!--        >-->
        <!--          <v-row-->
        <!--            align="center"-->
        <!--            justify="center"-->
        <!--          >-->
        <!--            <v-col cols="12" class="pt-0 pr-0 m-0" style="height: 100%">-->
        <!--              <v-radio-group-->
        <!--                v-model="state_val"-->
        <!--                @change="changeStateVal"-->
        <!--                class="mt-0 pr-0"-->
        <!--                column-->
        <!--              >-->
        <!--                <v-radio-->
        <!--                  label="All"-->
        <!--                  color="red"-->
        <!--                  value="0"-->
        <!--                >-->
        <!--                </v-radio>-->
        <!--                <v-radio-->
        <!--                  v-for="item in filter.state_list"-->
        <!--                  :label="item.title"-->
        <!--                  color="red"-->
        <!--                  :value="item.id"-->
        <!--                >-->
        <!--                </v-radio>-->

        <!--              </v-radio-group>-->
        <!--            </v-col>-->

        <!--          </v-row>-->
        <!--        </v-expansion-panel-content>-->
        <!--      </v-expansion-panel>-->

        <!--City-->
        <!--      <v-expansion-panel v-show="filter.city_list.length>0 && $route.query.type==='tutor'">-->
        <!--        <v-expansion-panel-header-->
        <!--          color="#f5f5f5"-->
        <!--          class="font-size-16 font-weight-bold">-->
        <!--          City-->
        <!--        </v-expansion-panel-header>-->
        <!--        <v-expansion-panel-content-->
        <!--          color="#f5f5f5"-->
        <!--        >-->
        <!--          <v-row-->
        <!--            align="center"-->
        <!--            justify="center"-->
        <!--          >-->
        <!--            <v-col cols="12" class="pt-0 pr-0 m-0" >-->
        <!--              <v-radio-group-->
        <!--                v-model="city_val"-->
        <!--                class="mt-0 pr-0"-->
        <!--                column-->
        <!--              >-->
        <!--                <v-radio-->
        <!--                  label="All"-->
        <!--                  color="red"-->
        <!--                  :value="0"-->
        <!--                >-->
        <!--                </v-radio>-->
        <!--                <v-radio-->
        <!--                  v-for="item in filter.city_list"-->
        <!--                  :label="item.title"-->
        <!--                  color="red"-->
        <!--                  :value="item.id"-->
        <!--                >-->
        <!--                </v-radio>-->

        <!--              </v-radio-group>-->
        <!--            </v-col>-->

        <!--          </v-row>-->
        <!--        </v-expansion-panel-content>-->
        <!--      </v-expansion-panel>-->
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
  },
  data() {
    return {
      panel: 0,
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
      word_checkbox_val: false,
      pdf_checkbox_val: false,
      free_checkbox_val: false,
      answer_checkbox_val: false,
      loadtime: false,

      applied_filter: {
        select_section_title: "",
        select_base_title: "",
        select_lesson_title: "",
        select_topic_title: "",
        select_file_type_title: "",
        select_test_level_title: "",
        select_state_title: "",
        select_city_title: "",
        select_month_title: "",
      },

      filter: {
        section_list: [],
        base_list: [],
        lesson_list: [],
        topic_list: [],
        file_type_list: [],
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

        year_list: [
          2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015,
          2014, 2013,
        ],
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
      },

      breadcrumbs: [],
    };
  },
  created() {
    if (this.$route.query.type === "tutor")
      this.getFilterList({ type: "state" }, "state");

    this.$nextTick(() => {
      if (this.month_val && this.filter.month_list)
        this.applied_filter.select_month_title = this.filter.month_list.find(
          (x) => x.id == this.month_val
        ).title;
    });

    // this.setBreadcrumbInfo();

    if (this.$route.query.level > 0) {
      this.test_level_val = this.$route.query.level;
    }
  },
  watch: {
    "$route.query.type"(val) {
      this.filter.file_type_list = [];
      if (
        this.$route.query.type === "test" ||
        this.$route.query.type === "azmoon" ||
        this.$route.query.type == "learnfiles"
      )
        this.getFileType();
    },
    board_val(val) {
      //Reset base filter
      this.base_val = 0;
      this.lesson_val = 0;
      this.topic_val = 0;

      if (val == "") this.panel = 0;
      else this.panel = 1;

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
        this.applied_filter.select_section_title =
          this.filter.section_list.find((x) => x.id === val).title;
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
      }
    },
    base_val(val) {
      if (val == 0) this.changeBaseVal();
    },
    lesson_val(val) {
      if (val == 0) this.changeLessonVal();
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
    file_type_val(val) {
      if (val == 0) {
        this.applied_filter.select_file_type_title = "";
      }
      this.updateQueryParams();
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
  },

  methods: {
    onScroll() {
      this.scrollInvoked++;
    },
    getFilterList(params, type) {
      this.$axios
        .$get("/api/v1/types/list", {
          params,
        })
        .then((res) => {
          var data = {};
          if (type === "section") {
            this.filter.section_list = res.data;

            //Initiate loading filter
            if (this.$route.query.section > 0) {
              data = {
                type: "base",
                section_id: this.$route.query.section,
              };

              this.getFilterList(data, "base");
              this.base_val = this.$route.query.base;

              this.applied_filter.select_section_title =
                this.filter.section_list.find(
                  (x) => x.id === this.board_val
                ).title;

              //Set breadcrumbs info
              this.setBreadcrumbInfo();
            }
            //
          } else if (type === "base") {
            this.filter.base_list = res.data;

            //Get lesson data
            if (this.$route.query.base > 0) {
              data = {
                type: "lesson",
                base_id: this.$route.query.base,
              };
              this.getFilterList(data, "lesson");

              //Set lesson val
              this.lesson_val = this.$route.query.lesson;

              //Enable tag
              this.applied_filter.select_base_title =
                this.filter.base_list.find((x) => x.id === this.base_val).title;

              //Set breadcrumbs info
              this.setBreadcrumbInfo();
            }
          } else if (type === "lesson") {
            this.filter.lesson_list = res.data;

            if (this.filter.lesson_list.length > 0) this.panel = 2;

            //Get lesson data
            if (this.$route.query.lesson > 0) {
              data = {
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

            if (this.filter.topic_list.length > 0) this.panel = 3;

            //Enable tag
            if (this.$route.query.topic > 0)
              this.applied_filter.select_topic_title =
                this.filter.topic_list.find(
                  (x) => x.id === this.topic_val
                ).title;
          } else if (type === "state") {
            this.filter.state_list = res.data;

            //Enable tag
            if (this.$route.query.state > 0) {
              this.state_val = this.$route.query.state;
              this.applied_filter.select_state_title =
                this.filter.state_list.find(
                  (x) => x.id === this.state_val
                ).title;
            }
            if (this.$route.query.city > 0)
              this.city_val = this.$route.query.city;
          } else if (type === "city") {
            this.filter.city_list = res.data;

            //Enable tag
            if (this.city_val > 0 && this.filter.city_list.length)
              this.applied_filter.select_city_title =
                this.filter.city_list.find((x) => x.id === this.city_val).title;
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    setAppliedFilter(filters) {
      this.applied_filter = filters;
      this.setBreadcrumbInfo(false);
    },

    //Check user selected at least one filter
    enabledAppliedFilter() {
      if (
        this.applied_filter.select_base_title ||
        this.applied_filter.select_section_title ||
        this.applied_filter.select_lesson_title ||
        this.applied_filter.select_topic_title ||
        this.applied_filter.select_file_type_title ||
        this.applied_filter.select_test_level_title
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
      } else {
        this.applied_filter.select_base_title = "";
        this.loadtime = false;
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
      } else {
        this.applied_filter.select_topic_title = "";
        this.loadtime = false;
      }
    },

    //Change topic val option
    changeTopicVal() {
      //Reset related tags
      this.applied_filter.select_topic_title = "";
      //End reset related tags

      this.updateQueryParams();
      //Enable topic title tag

      if (this.topic_val > 0)
        this.applied_filter.select_topic_title = this.filter.topic_list.find(
          (x) => x.id === this.topic_val
        ).title;
      else {
        this.applied_filter.select_topic_title = "";
        this.loadtime = false;
      }
    },
    //Change topic val option

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
    changeYearVal() {
      this.updateQueryParams();
    },
    changeMonthVal() {
      this.updateQueryParams();

      //Enable topic title tag

      if (this.month_val > 0)
        this.applied_filter.select_month_title = this.filter.month_list.find(
          (x) => x.id === this.month_val
        ).title;
      else this.applied_filter.select_month_title = "";

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
      if (this.year_val !== 0) {
        query.edu_year = this.year_val;
      }
      if (this.month_val !== 0) {
        query.edu_month = this.month_val;
      }
      // Handle more query parameters here ...
      this.$router.replace({ query: query }).catch((err) => {
        //Do noting
      });
    },

    //set breadcrumbs
    setBreadcrumbInfo(setTitle = true) {
      this.breadcrumbs = [];

      //Type breadcrumb
      var active_tab = this.$route.query.type;
      var breadcrumb_item = {
        text: "",
        disabled: false,
        href: `/search?type=${active_tab}`,
      };
      if (active_tab === "test") breadcrumb_item.text = "Past Papers";
      else if (active_tab === "learnfiles") breadcrumb_item.text = "Multimedia";
      else if (active_tab === "question") breadcrumb_item.text = "Forum";
      else if (active_tab === "azmoon") breadcrumb_item.text = "QuizHub";
      else if (active_tab === "dars") breadcrumb_item.text = "Tutorial";
      else if (active_tab === "tutor") breadcrumb_item.text = "Tutor";

      this.breadcrumbs.push(breadcrumb_item);

      //Grade section
      if (this.applied_filter.select_section_title) {
        this.breadcrumbs.push({
          text: this.applied_filter.select_section_title,
          disabled: false,
          href: `/search?type=${active_tab}&section=${this.board_val}`,
        });
      }

      //Base section
      if (this.applied_filter.select_base_title) {
        this.breadcrumbs.push({
          text: this.applied_filter.select_base_title,
          disabled: false,
          href: `/search?type=${active_tab}&section=${this.board_val}&base=${this.base_val}`,
        });
      }

      //Lesson section
      if (this.applied_filter.select_lesson_title) {
        this.breadcrumbs.push({
          text: this.applied_filter.select_lesson_title,
          disabled: false,
          href: `/search?type=${active_tab}&section=${this.board_val}&base=${this.base_val}&lesson=${this.lesson_val}`,
        });
      }

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
      this.$emit("update:setBreadCrumbs", this.breadcrumbs);
    },
    setFilter(type, list) {
      if (type == "board") this.filter.section_list = list;
      if (type == "grade") this.filter.base_list = list;
      if (type == "subject") this.filter.lesson_list = list;
      if (type == "topic") this.filter.topic_list = list;
      if (type == "file_type") this.filter.file_type_list = list;
    },

    //Get file type
    getFileType() {
      this.$axios
        .$get("/api/v1/types/list", {
          params: {
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
          },
        })
        .then((res) => {
          this.filter.file_type_list = res.data;

          if (this.$route.query.test_type > 0) {
            this.file_type_val = this.$route.query.test_type;
            this.applied_filter.select_file_type_title =
              this.filter.file_type_list.find(
                (x) => x.id === this.file_type_val
              )?.title;
          }
        })
        .catch((err) => {
          console.error(err);
        });
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
  },
};
</script>

<style>
@media screen and (max-width: 600px) {
  .content-search .v-expansion-panel-header,
  .v-expansion-panel-content {
    background: #fff !important;
  }
}

.content-search .v-expansion-panel-content__wrap {
  padding: 0 0 0 0.6rem !important;
}
.content-search .v-expansion-panel-content__wrap .content-box {
  max-height: 20rem;
  overflow-y: auto;
  margin: 0;
  padding-top: 0;
  padding-right: 0;
}

@media (min-width: 960px) {
  #search-page-filter {
    #chip-container {
      .v-chip {
        .v-chip__content span {
          width: inherit;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
  }
}
</style>
