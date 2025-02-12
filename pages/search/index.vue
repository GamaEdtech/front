<template>
  <div>
    <!--Mobile filter-->
    <v-row justify="center" class="d-block d-md-none">
      <v-dialog
        v-model="dialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition "
      >
        <v-card>
          <div style="position: sticky; top: 0; left: 0; right: 0; z-index: 10">
            <v-toolbar class="filter-btn-header">
              <v-toolbar-items>
                <v-btn
                  class="text-h5 font-weight-bold"
                  text
                  @click="dialog = false"
                >
                  Search in content
                </v-btn>
              </v-toolbar-items>
              <v-spacer></v-spacer>
              <v-btn icon @click="dialog = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>
          </div>
          <v-card-text>
            <search-filter
              ref="side_filter"
              class="mx-3"
              :setBreadCrumbs.sync="breadcrumbs"
              @setPageTitle="setPageTitle()"
            />
          </v-card-text>
          <v-card-actions
            style="position: sticky; bottom: 0; left: 0; right: 0"
          >
            <v-btn
              medium
              block
              class="filter-show-result mr-4"
              @click="dialog = !dialog"
            >
              show result ({{ result_count }})
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-btn
        @click="openDialog()"
        class="d-block d-md-none"
        min-width="40"
        fixed
        bottom
        right
        style="z-index: 10"
        x-large
        color="teal"
        dark
        rounded
      >
        <v-icon> mdi-filter </v-icon>
        <v-slide-x-reverse-transition>
          <span v-show="expandFilterMenu" class="text-h6"> filter </span>
        </v-slide-x-reverse-transition>
      </v-btn>
    </v-row>

    <!-- Start  -->
    <section class="search-page mt-md-16 mt-lg-0">
      <v-container>
        <v-row>
          <v-col md="3" lg="3" class="d-none d-md-block">
            <v-card flat color="#f5f5f5" style="position: sticky; top: 1rem">
              <v-card-text>
                <search-filter
                  ref="side_filter"
                  :setBreadCrumbs.sync="breadcrumbs"
                  @setPageTitle="setPageTitle"
                />
              </v-card-text>
            </v-card>
          </v-col>

          <v-col lg="9" md="9" sm="12" class="search-contents px-0">
            <v-breadcrumbs
              :items="breadcrumbs"
              class="search-breadcrumb d-none d-md-block"
            >
              <template v-slot:divider>
                <v-icon>mdi-chevron-right</v-icon>
              </template>
            </v-breadcrumbs>

            <!-- Search tabs -->
            <Tabs
              style="position: sticky; top: 0; z-index: 5"
              ref="content_tabs"
            />
            <!-- End search tabs -->

            <div
              class="text-center"
              v-if="page_loading === false && items.length === 0"
            >
              Oops! no data found
            </div>
            <div v-else>
              <Paper v-if="$route.query.type === 'test'" :items="items" />
              <Multimedia
                v-else-if="$route.query.type === 'learnfiles'"
                :items="items"
              />
              <QuestionAnswer
                v-else-if="$route.query.type === 'question'"
                :items="items"
              />
              <Exam v-else-if="$route.query.type === 'azmoon'" :items="items" />
              <Tutorial
                v-else-if="$route.query.type === 'dars'"
                :items="items"
              />
              <Tutor v-else-if="$route.query.type === 'tutor'" :items="items" />
            </div>
            <v-row v-show="page_loading">
              <v-col cols="12" class="text-center">
                <v-progress-circular
                  :size="40"
                  :width="4"
                  class="mt-12 mb-12"
                  color="orange"
                  indeterminate
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </div>
</template>

<script>
import Tabs from "@/components/common/tabs.vue";
import searchFilter from "@/components/search/filter";
import FilterModal from "@/components/common/filter-modal";
import Exam from "@/components/search/type/exam.vue";
import QuestionAnswer from "~/components/search/type/q-a.vue";
import Multimedia from "~/components/search/type/multimedia.vue";
import Paper from "~/components/search/type/paper.vue";
import Tutorial from "@/components/search/type/tutorial.vue";
import Tutor from "~/components/search/type/tutor.vue";
import searchBox from "@/components/common/search-box";

export default {
  auth: false,
  name: "searchPage",
  layout: "search_layout",

  components: {
    Tutor,
    FilterModal,
    Tabs,
    searchFilter,
    Exam,
    QuestionAnswer,
    Multimedia,
    Paper,
    Tutorial,
    searchBox,
  },

  async asyncData({ query, $axios }) {
    var page_title = "";
    var page_describe = "";
    var params = {
      type: "section",
    };
    let boardTitle = "";
    let boardList = {};
    let gradeTitle = "";
    let gradeList = {};
    let subjectTitle = "";
    let subjectList = "";
    let paperTypeTitle = "";
    let paperTypeList = {};
    let topicList = {};
    let multimediaTypeTitle = "";
    let applied_filter = {
      select_section_title: "",
      select_base_title: "",
      select_lesson_title: "",
    };
    boardList = await $axios.$get(`/api/v1/types/list`, { params });
    if (query.section) {
      const boardIndex = boardList.data.findIndex(
        (x) => x.id === query.section
      );
      boardTitle = boardList.data[boardIndex].title;
      applied_filter.select_section_title = boardTitle;

      //Also list base list for filter
      params.type = "base";
      params.section_id = query.section;
      gradeList = await $axios.$get(`/api/v1/types/list`, { params });
    }

    if (query.base) {
      const gradeIndex = gradeList.data.findIndex((x) => x.id === query.base);
      gradeTitle = gradeList.data[gradeIndex].title;
      applied_filter.select_base_title = gradeTitle;

      //Also list subject list for filter
      params.type = "lesson";
      params.base_id = query.base;
      subjectList = await $axios.$get(`/api/v1/types/list`, { params });
    }

    if (query.lesson) {
      const subjectIndex = subjectList.data.findIndex(
        (x) => x.id === query.lesson
      );
      subjectTitle = subjectList.data[subjectIndex].title;
      applied_filter.select_lesson_title = subjectTitle;

      //Also list topic list for filter
      params.type = "topic";
      params.lesson_id = query.lesson;
      topicList = await $axios.$get(`/api/v1/types/list`, { params });
    }

    if (query.type == "test") {
      params.type = "test_type";
      paperTypeList = await $axios.$get(`/api/v1/types/list`, { params });

      if (query.test_type) {
        const paperTypeIndex = paperTypeList.data.findIndex(
          (x) => x.id == query.test_type
        );
        paperTypeTitle = paperTypeList.data[paperTypeIndex]?.title;
      }
    }

    if (query.type === "learnfiles" && query.file_type) {
      params.type = "file_type";
      const multimediaTypeList = await $axios.$get(`/api/v1/types/list`, {
        params,
      });
      const multimediaTypeIndex = multimediaTypeList.data.findIndex(
        (x) => x.id == query.file_type
      );
      multimediaTypeTitle = multimediaTypeList.data[multimediaTypeIndex].title;
    }

    if (query.type === "test") {
      page_title = boardTitle
        ? `${boardTitle} ${gradeTitle} ${subjectTitle} ${paperTypeTitle}`
        : "Educational Resources | K12 Education Papers and Materials";
      page_describe =
        "Enhance your learning with GamaTrain's extensive collection of online documents and texts, carefully curated to enrich your academic journey.";
    } else if (query.type === "learnfiles") {
      page_title = boardTitle
        ? `${boardTitle} ${gradeTitle} ${subjectTitle} ${multimediaTypeTitle}`
        : "Multimedia Interactive Educational Content; PowerPoint, Video, Class Voice, GamaTrain";
      page_describe =
        "Elevate your learning experience with GamaTrain's captivating multimedia content, including PowerPoint presentations, informative videos, and diverse educational materials.";
    } else if (query.type === "question") {
      page_title = `${boardTitle} ${gradeTitle} ${subjectTitle} Forum`;
      page_describe =
        "Engage in active learning and gain deeper insights through GamaTrain's interactive Q&A platform, where you can pose questions and seek support from fellow learners and experts.";
    } else if (query.type === "azmoon") {
      page_title = `${boardTitle} ${gradeTitle} ${subjectTitle} Online test`;
      page_describe =
        "Hone your skills and assess your knowledge with GamaTrain's online exams, designed to enhance your exam preparation and boost your confidence.";
    } else if (query.type === "dars") {
      page_title = `${boardTitle} ${gradeTitle} ${subjectTitle} Textbook`;
      page_describe =
        "Complement your studies with GamaTrain's comprehensive online tutorials, providing step-by-step guidance and practice opportunities to refine your understanding.";
    } else if (query.type === "tutor") {
      page_title = "Teacher";
      page_describe = "Teacher";
    }

    return {
      page_title,
      page_describe,
      boardList,
      gradeList,
      paperTypeList,
      subjectList,
      topicList,
      applied_filter,
    };
  },
  head() {
    return {
      title: this.page_title,

      meta: [
        {
          hid: "apple-mobile-web-app-title",
          name: "apple-mobile-web-app-title",
          content: this.page_title,
        },
        {
          hid: "og:title",
          name: "og:title",
          content: this.page_title,
        },
        {
          hid: "og:site_name",
          name: "og:site_name",
          content: "GamaTrain",
        },
        {
          hid: "description",
          name: "description",
          content: this.page_describe,
        },
        {
          hid: "og:description",
          name: "og:description",
          content: this.page_describe,
        },
      ],
    };
  },
  data() {
    return {
      breadcrumbs: [],
      page_loading: true,
      page: 1,

      items: [],

      // Mobile filter
      result_count: 0,
      dialog: false,

      all_files_loaded: false,

      expandFilterMenu: true,
    };
  },

  mounted() {
    if (this.$refs.side_filter) {
      this.$refs.side_filter.setFilter("board", this.boardList?.data);
      if (this.$route.query.section)
        this.$refs.side_filter.setFilter("grade", this.gradeList?.data);
      if (this.$route.query.base)
        this.$refs.side_filter.setFilter("subject", this.subjectList?.data);
      if (this.$route.query.lesson)
        this.$refs.side_filter.setFilter("topic", this.topicList?.data);
      if (this.$route.query.type == "test")
        this.$refs.side_filter.setFilter(
          "paper_type",
          this.paperTypeList?.data
        );
    }

    this.$refs.side_filter.setAppliedFilter(this.applied_filter);

    if (!this.$route.query.type) {
      const query = { type: "test" };
      this.page_title = "Papers";
      this.$router.replace({ query: query });
      this.getContentList();
    } else this.getContentList();
  },

  created() {
    if (process.client) {
      window.addEventListener("scroll", this.scroll);
    }
  },
  destroyed() {
    if (process.client) {
      window.removeEventListener("scroll", this.scroll);
    }
  },

  watch: {
    "$route.query.type"(val) {
      this.page = 1;
      this.items = [];
      this.all_files_loaded = false;

      if (this.$route.query.type === "learnfiles") {
        this.page_title =
          "Multimedia Interactive Educational Content; PowerPoint, Video, Class Voice, GamaTrain";
        this.page_describe =
          "Elevate your learning experience with GamaTrain's captivating multimedia content, including PowerPoint presentations, informative videos, and diverse educational materials.";
      } else if (this.$route.query.type === "test") {
        this.page_title =
          "Educational Resources | K12 Education Papers and Materials";
        this.page_describe =
          "Enhance your learning with GamaTrain's extensive collection of online documents and texts, carefully curated to enrich your academic journey.";
      } else if (this.$route.query.type === "question") {
        {
          this.page_title =
            "Seek Clarification, Expand Your Understanding: GamaTrain's Q&A Forum";
          this.page_describe =
            "Engage in active learning and gain deeper insights through GamaTrain's interactive Q&A platform, where you can pose questions and seek support from fellow learners and experts.";
        }
      } else if (this.$route.query.type === "azmoon") {
        this.page_title = "Online Exams , Free Exams for Improving Education";
        this.page_describe =
          "Hone your skills and assess your knowledge with GamaTrain's online exams, designed to enhance your exam preparation and boost your confidence.";
      } else if (this.$route.query.type === "dars") {
        this.page_title =
          "Master Concepts, Enhance Learning: GamaTrain's Online Tutorials";
        this.page_describe =
          "Complement your studies with GamaTrain's comprehensive online tutorials, providing step-by-step guidance and practice opportunities to refine your understanding.";
      } else if (this.$route.query.type === "tutor") {
        page_title = "Teacher";
        page_describe = "Teacher";
      }

      this.$refs.side_filter.setBreadcrumbInfo();

      this.getContentList();
    },
    "$route.query.section"(val) {
      this.page = 1;
      this.items = [];
      this.all_files_loaded = false;

      //Fire when click on tag in content card, set section value on side filter
      if (val > 0) this.$refs.side_filter.board_val = val;
      else this.$refs.side_filter.board_val = 0;
      //End fire when click on tag in content card, set section value on side filter

      this.$refs.side_filter.setBreadcrumbInfo();
      this.getContentList();
    },
    "$route.query.base"(val) {
      this.page = 1;
      this.items = [];
      this.all_files_loaded = false;

      //Fire when click on tag in content card, set base value on side filter
      if (val > 0) this.$refs.side_filter.base_val = val;
      else this.$refs.side_filter.base_val = 0;
      //Fire when click on tag in content card, set base value on side filter

      this.$refs.side_filter.setBreadcrumbInfo();

      this.getContentList();
    },
    "$route.query.lesson"(val) {
      this.page = 1;
      this.items = [];
      this.all_files_loaded = false;

      //Fire when click on tag in content card, set lesson value on side filter
      if (val > 0) this.$refs.side_filter.lesson_val = val;
      else this.$refs.side_filter.lesson_val = 0;
      //End click on tag in content card

      //Set breadcrumbs info
      this.$refs.side_filter.setBreadcrumbInfo();
      this.getContentList();
    },
    "$route.query.topic"(val) {
      this.page = 1;
      this.items = [];
      this.all_files_loaded = false;

      this.getContentList();
    },
    "$route.query.test_type"(val) {
      this.page = 1;
      this.items = [];
      this.all_files_loaded = false;

      this.getContentList();
    },
    "$route.query.level"(val) {
      this.page = 1;
      this.items = [];
      this.all_files_loaded = false;

      this.getContentList();
    },
    "$route.query.word"(val) {
      this.page = 1;
      this.items = [];
      this.all_files_loaded = false;

      this.getContentList();
    },
    "$route.query.pdf"(val) {
      this.page = 1;
      this.items = [];
      this.all_files_loaded = false;

      this.getContentList();
    },
    "$route.query.free"(val) {
      this.page = 1;
      this.items = [];
      this.all_files_loaded = false;

      this.getContentList();
    },
    "$route.query.a_file"(val) {
      this.page = 1;
      this.items = [];
      this.all_files_loaded = false;

      this.getContentList();
    },
    "$route.query.state"(val) {
      this.page = 1;
      this.items = [];
      this.all_files_loaded = false;

      //Fire when click on tag in content card, set state value on side filter
      if (val > 0) {
        this.$refs.side_filter.state_val = val;
      } else {
        this.$refs.side_filter.state_val = 0;
      }
      //End fire when click on tag in content card, set state value on side filter

      this.getContentList();
    },
    "$route.query.city"(val) {
      this.page = 1;
      this.items = [];
      this.all_files_loaded = false;

      //Fire when click on tag in content card, set city value on side filter
      if (val > 0) this.$refs.side_filter.city_val = val;
      else this.$refs.side_filter.city_val = 0;
      //End fire when click on tag in content card, set section value on side filter

      this.getContentList();
    },
  },
  methods: {
    setPageTitle(e) {
      this.page_title = e;
    },
    // Get content list
    async getContentList() {
      if (!this.all_files_loaded) {
        this.page_loading = true;
        let params = {
          type: this.$route.query.type,
          page: this.page,
          section: this.$route.query.section,
          base: this.$route.query.base,
          lesson: this.$route.query.lesson,
          topic: this.$route.query.topic,
          test_type: this.$route.query.test_type,
          level: this.$route.query.level,
          pdf: this.$route.query.pdf,
          word: this.$route.query.word,
          free: this.$route.query.free,
          a_file: this.$route.query.a_file,
        };

        if (this.$route.query.type == "tutor") {
          params.state = this.$route.query.state;
          params.city = this.$route.query.city;
        }
        await this.$axios
          .$get("/api/v1/search", {
            params: params,
          })
          .then((response) => {
            this.items.push(...response.data.list);
            this.result_count = response.data.num;
            this.$refs.content_tabs.content_statistics =
              response.data.types_stats;
            if (response.data.list.length === 0)
              //For terminate auto load request
              this.all_files_loaded = true;
          })
          .catch((err) => {})
          .finally(() => {
            this.page_loading = false;
          });
      }
    },
    openDialog() {
      this.dialog = true;
      setTimeout(() => {
        if (this.$refs.side_filter) {
          this.$refs.side_filter.setFilter("board", this.boardList?.data);
          if (this.$route.query.section)
            this.$refs.side_filter.setFilter("grade", this.gradeList?.data);
          if (this.$route.query.base)
            this.$refs.side_filter.setFilter("subject", this.subjectList?.data);
          if (this.$route.query.lesson)
            this.$refs.side_filter.setFilter("topic", this.topicList?.data);
          if (this.$route.query.type == "test")
            this.$refs.side_filter.setFilter(
              "paper_type",
              this.paperTypeList?.data
            );
        }
      }, 100);
    },
    scroll() {
      //For infinite loading

      //Section for control filter menu button on mobile device
      if (window.scrollY > 1000) this.expandFilterMenu = false;
      else this.expandFilterMenu = true;
      //End section for control filter menu button on mobile device

      window.onscroll = () => {
        //Scroll position
        var scrollPosition =
          Math.max(
            window.pageYOffset,
            document.documentElement.scrollTop,
            document.body.scrollTop
          ) +
          window.innerHeight +
          50;
        let bottomOfWindow =
          scrollPosition >= document.documentElement.offsetHeight;

        //Avoid the number of requests
        if (this.timer) {
          clearTimeout(this.timer);
          this.timer = null;
        }

        //Load next page
        if (bottomOfWindow && this.all_files_loaded === false) {
          this.page_loading = true;
          this.timer = setTimeout(() => {
            this.page++;
            this.getContentList();
          }, 800);
        }
      };
    },
  },
};
</script>

<style>
.content-items {
  .content-item {
    min-height: 23rem !important;
    .img-holder {
      min-width: 12rem;
      float: left;

      .book-no-img {
        padding-top: 3rem;
        min-height: 14rem !important;
      }
    }

    .content-holder {
      float: right;
    }

    .item-content-footer {
      padding-left: 1.5rem;
      padding-right: 1.5rem;
      .gama-text-overline {
        color: #afb8c1;
      }
    }
  }
}
@media (min-width: 600px) {
  .content-items {
    .content-item {
      min-height: 18.5rem !important;

      .item-content-title {
        color: #263238;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box !important;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
      .item-content-subtitle {
        overflow: hidden;
        line-height: 1.8rem;
        text-overflow: ellipsis;
        display: -webkit-box !important;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        min-height: 2.8rem;
      }

      .item-content-footer {
        .gama-text-overline {
          color: #afb8c1;
        }
      }
    }
  }
}
</style>
