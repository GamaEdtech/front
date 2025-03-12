<template>
  <div>
    <!--Start: menu button-->
    <v-btn
      class="d-block d-md-none"
      fixed
      bottom
      right
      style="z-index: 10"
      min-width="40"
      x-large
      color="teal"
      dark
      rounded
      @click.stop="drawer = !drawer"
    >
      <v-icon> mdi-format-list-numbered </v-icon>
      <v-slide-x-reverse-transition>
        <span v-show="expandListMenu" class="text-h6">&nbsp;List</span>
      </v-slide-x-reverse-transition>
    </v-btn>
    <!--End: menu button-->

    <!-- Start : Category -->
    <category />
    <!-- End:Category -->

    <!-- Start:Lesson title -->
    <!-- Desktop -->
    <section class="lesson d-none d-md-block">
      <v-container class="lesson-section">
        <v-row>
          <v-col md="3" cols="12" class="lesson-details">
            <div class="d-flex flex-column details-content">
              <div class="last-update mb-3">
                <i class="fa-solid fa-calendar-days mr-2"></i>Last update:
                {{ tutorialInfo.up_date.split(" ")[0] }}
              </div>
              <div class="visit mb-3">
                <i class="fa-solid fa-eye mr-2"></i>Viewed:
                {{ tutorialInfo.views }}
              </div>
              <div class="error-report pointer" @click="openCrashReportDialog">
                <i class="fa-solid fa-circle-exclamation mr-2"></i>Crash report
              </div>
            </div>
          </v-col>
          <v-col md="9" cols="12" class="lessons-title">
            <div class="d-flex flex-column text-center lesson-content">
              <p class="lesson-title gama-text-h5 mb-4">{{ lesson.title }}</p>
              <p class="lesson-subtitle gama-text-h6">
                {{ lesson.topic_title }}
              </p>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Mobile -->
    <section class="lesson d-block d-md-none">
      <v-container class="lesson-section">
        <v-row>
          <v-col cols="12">
            <div class="d-flex flex-column text-center lesson-content">
              <p class="lesson-title gama-text-h5 mb-4">{{ lesson.title }}</p>
              <p class="lesson-subtitle gama-text-6">
                {{ lesson.topic_title }}
              </p>
            </div>
          </v-col>
          <v-col cols="12" class="lesson-details">
            <v-divider />
            <v-row>
              <v-col cols="5" class="last-update">
                <i class="fa-solid fa-calendar-days mr-2"></i>
                {{ tutorialInfo.up_date.split(" ")[0] }}
              </v-col>
              <v-col cols="3" class="visit">
                <i class="fa-solid fa-eye mr-2"></i>{{ tutorialInfo.views }}
              </v-col>
              <v-col cols="4" class="error-report">
                <div
                  class="error-report pointer"
                  @click="openCrashReportDialog"
                >
                  <i class="fa-solid fa-circle-exclamation mr-2"></i>Crash
                  report
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </section>
    <!-- End: Lesson title -->

    <!-- Start : Card -->
    <!--    <section class="cards">-->
    <!--      <v-container class="pa-0">-->
    <!--        <v-row>-->
    <!--          <v-col cols="12" md="6" class="pb-0">-->
    <!--            <v-card elevation="2" outlined class="pa-3 card-body">-->
    <!--              <v-row class="card">-->
    <!--                <v-col cols="4" md="3">-->
    <!--                  <div class="card-image">-->
    <!--                    <img :src="require('@/assets/images/' + card.img)" alt="" />-->
    <!--                  </div>-->
    <!--                </v-col>-->
    <!--                <v-col cols="8" md="9" class="d-flex align-center">-->
    <!--                  <div class="d-flex flex-column card-details">-->
    <!--                    <p class="card-title">{{ card.videoTitle }}</p>-->
    <!--                    <p class="video-teacher">-->
    <!--                      <i class="fa-solid fa-user mr-2"></i>{{ card.videoTeacher }}-->
    <!--                    </p>-->
    <!--                    <div class="d-flex justify-space-between">-->
    <!--                      <p class="durition">-->
    <!--                        <i class="fa-regular fa-clock mr-2"></i>Time:-->
    <!--                        {{ card.durition }}-->
    <!--                      </p>-->
    <!--                      <nuxt-link to="" class="more-link d-none d-md-block">More</nuxt-link>-->
    <!--                    </div>-->
    <!--                  </div>-->
    <!--                </v-col>-->
    <!--              </v-row>-->
    <!--            </v-card>-->
    <!--          </v-col>-->
    <!--          <v-col cols="12" md="6">-->
    <!--            <v-card elevation="2" outlined class="pa-3 card-body">-->
    <!--              <v-row class="card">-->
    <!--                <v-col cols="4" md="3">-->
    <!--                  <div class="card-image">-->
    <!--                    <img :src="require('@/assets/images/' + card.img2)" alt="" />-->
    <!--                  </div>-->
    <!--                </v-col>-->
    <!--                <v-col cols="8" md="9" class="d-flex align-center">-->
    <!--                  <div class="d-flex flex-column card-details">-->
    <!--                    <p class="card-title">{{ card.bookTitle }}</p>-->
    <!--                    <p class="test-number">-->
    <!--                      <i class="fa-solid fa-grip-lines mr-2"></i>Number of tests: {{-->
    <!--                          card.testNumber-->
    <!--                      }}-->
    <!--                    </p>-->
    <!--                    <div class="d-flex justify-space-between">-->
    <!--                      <p class="levels">-->
    <!--                        <i class="fa-solid fa-arrow-trend-up mr-2"></i>Difficulty-->
    <!--                        :{{ card.easy }} {{ card.medium }} {{ card.hard }}-->
    <!--                      </p>-->
    <!--                      <nuxt-link to="" class="more-link d-none d-md-block">More</nuxt-link>-->
    <!--                    </div>-->
    <!--                  </div>-->
    <!--                </v-col>-->
    <!--              </v-row>-->
    <!--            </v-card>-->
    <!--          </v-col>-->
    <!--        </v-row>-->
    <!--      </v-container>-->
    <!--    </section>-->
    <!-- End: Cart -->
    <!-- Start : Book -->
    <v-container>
      <section class="book">
        <v-row>
          <v-col md="3" class="d-none d-md-block">
            <div class="cataloge pa-2">
              <div class="cataloge-content">
                <TutorialMenu :lessonTree="lessonTree" />
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="9" class="pa-0 pa-md-3">
            <div class="book-contents pa-3 pa-md-6">
              <v-navigation-drawer
                v-model="drawer"
                style="z-index: 10"
                class="sidebar-nav pa-5"
                width="320"
              >
                <TutorialMenu :lessonTree="lessonTree" />
              </v-navigation-drawer>
              <div class="book-content">
                <div
                  class="bookText e-mathjax"
                  ref="mathJaxEl"
                  v-html="tutorialInfo.content"
                />
              </div>
            </div>
          </v-col>
        </v-row>
      </section>
    </v-container>

    <!-- End: Book -->
    <!-- Start : Sample Test -->
    <!--    <related-content/>-->
    <!-- End : Sample test -->
    <!-- Start: Feed -->
    <!--    <section class="feed">-->
    <!--      <v-container class="pa-4 pa-md-12 pt-10">-->
    <!--        <v-row>-->
    <!--         <v-col cols="12" md="6">-->
    <!--           <latest-training-content/>-->
    <!--         </v-col>-->

    <!--          <v-col cols="12" md="6" class="related-ask-test py-0 d-flex flex-column justify-space-between">-->
    <!--              <related-qa/>-->

    <!--              <related-online-exam/>-->
    <!--          </v-col>-->

    <!--        </v-row>-->
    <!--      </v-container>-->
    <!--    </section>-->
    <!-- End: Feed -->

    <!-- Sidebar -->

    <crash-report ref="crash_report" />
  </div>
</template>
<script>
import category from "@/components/common/category.vue";
import TutorialMenu from "@/components/common/tutorial-menu";
import RelatedContent from "@/components/details/related-content";
import LatestTrainingContent from "@/components/details/latest-training-content";
import RelatedQa from "@/components/details/related-qa";
import RelatedOnlineExam from "@/components/details/related-online-exam";
import CrashReport from "~/components/common/crash-report.vue";

export default {
  name: "tutorial-details",
  auth: false,
  components: {
    CrashReport,
    RelatedOnlineExam,
    RelatedQa,
    LatestTrainingContent,
    RelatedContent,
    category,
    TutorialMenu,
  },

  async asyncData({ params, $axios, redirect }) {
    try {
      // This could also be an action dispatch
      const tutorialData = await $axios.$get(`/api/v1/tutorials/${params.id}`);

      //Tutorial data
      var tutorialInfo = tutorialData.data;

      //Get lesson tree
      const tutorialLessonTree = await $axios.$get(
        `/api/v1/tutorials/lessonTree/${tutorialInfo.lesson}`
      );
      var lessonTree = tutorialLessonTree.data;

      //Get and order title to display
      var lessonInfo = tutorialInfo.title.split("|");
      var lesson = { title: lessonInfo[0], topic_title: lessonInfo[1] };

      return { tutorialInfo, lessonTree, lesson };
    } catch (e) {
      if (e.response && e.response.status === 404) {
        redirect("/search?type=dars");
      }
    }
  },

  head() {
    return {
      script: [
        {
          src: `${process.env.STORAGE_BASE_URL}/MathJax/MathJax.js?config=TeX-MML-AM_CHTML`,
        },
      ],
      title: this.tutorialInfo.title,
    };
  },

  data() {
    return {
      e6: 1,
      expandListMenu: true,
      timelines: [
        {
          lessonName: " Speech 1 :Nerve tissue cells",
        },
        {
          lessonName: "Speech 2 : Nervous system structure",
        },
      ],
      bookmark: "bookmark.png",
      drawer: false,
      // model: null,
      testNumber: "20 Test",
      askCard: {
        icon: "qa",
      },

      rating: 4,
      items1: ["All", "دبستان", "متوسطه"],
      items2: ["All", "دبستان", "متوسطه"],
      items3: ["All", "دبستان", "متوسطه"],
      values1: ["All"],
      values2: ["All"],
      values3: ["All"],
      value1: null,
      value2: null,
      value3: null,
      lastUpdate: "27 Jun",
      visit: "15383",

      card: {
        img: "dexter-morse1.png",
        img2: "book.png",
        videoTitle:
          "Video of the complete educational course, the seventh mathematics of the first year of high school",
        bookTitle: "Exam test bank album, Math 7th first period of high school",
        testNumber: "2717",
        videoTeacher: "Arian Etemdi",
        durition: " 8 Hour (26 File)",
        easy: "Easy",
        medium: "Medium",
        hard: "Difficult",
      },
      book: {
        catalogeTitle: "Biology (2)",
        learnmoreText:
          "Inflammation of the meninges is called meningitis and its symptoms are headache, fever and dry neck. Meningitis is caused by viral or bacterial infections.",
      },
      bookContent: [
        {
          bookText:
            "In the past, you learned that the nervous system has two central and peripheral parts (Figure 11). Why do you think this device is called central and peripheral?",
          bookPic: "9_1.png",
          picSub:
            "Figure 11- Central nervous system (yellow color) and peripheral (blue color)",
        },
        {
          bookTitle: "Central nervous system",
          bookText:
            "The central nervous system includes the brain and the spinal cord, which are the centers for monitoring the body's activities. This device interprets the information received from the environment and inside the body and responds to them. Brain and spinal cord from two parts ",
          bookPic: "9_2.png",
          picSub: "Figure 12- Transverse section of the brain and spinal cord",
        },
      ],
      model: null,

      events: [],
      input: null,
      nonce: 0,
    };
  },

  computed: {
    timeline() {
      return this.events.slice().reverse();
    },
  },
  mounted() {
    this.renderMathJax();
  },
  created() {
    if (process.client) {
      window.addEventListener("scroll", this.handleScroll);
    }
  },
  destroyed() {
    if (process.client) {
      window.removeEventListener("scroll", this.handleScroll);
    }
  },
  methods: {
    comment() {
      const time = new Date().toTimeString();
      this.events.push({
        id: this.nonce++,
        text: this.input,
        time: time.replace(
          /:\d{2}\sGMT-\d{4}\s\((.*)\)/,
          (match, contents, offset) => {
            return ` ${contents
              .split(" ")
              .map((v) => v.charAt(0))
              .join("")}`;
          }
        ),
      });

      this.input = null;
    },
    renderMathJax() {
      if (window.MathJax) {
        window.MathJax.Hub.Config({
          tex2jax: {
            inlineMath: [
              ["$", "$"],
              ["\(", "\)"],
            ],
            displayMath: [
              ["$$", "$$"],
              ["\[", "\]"],
            ],
            processEscapes: true,
            processEnvironments: true,
          },
          // Center justify equations in code and markdown cells. Elsewhere
          // we use CSS to left justify single line equations in code cells.
          displayAlign: "center",
          "HTML-CSS": {
            styles: { ".MathJax_Display": { margin: 0 } },
            linebreaks: { automatic: true },
            availableFonts: ["Asana Math"],
            preferredFont: "Asana Math",
            webFont: "Asana Math-Web",
            imageFont: null,
          },
        });
        window.MathJax.Hub.Queue([
          "Typeset",
          window.MathJax.Hub,
          this.$refs.mathJaxEl,
        ]);
      }
    },
    handleScroll() {
      if (window.scrollY > 1000) this.expandListMenu = false;
      else this.expandListMenu = true;
    },

    openCrashReportDialog() {
      this.$refs.crash_report.dialog = true;
      this.$refs.crash_report.form.type = "tutorial";
    },
  },
};
</script>

<style>
.video-wrapper {
  width: 100%;
  margin: auto;
  max-width: 700px;
}

.panel-body {
  overflow-x: auto !important;
}

.book-content {
  overflow-x: auto !important;
}

.table-holder {
  overflow-x: auto !important;
}

.book-content img {
  max-width: 86vw !important;
  margin-right: 0.1rem !important;
  margin-left: 0.1rem !important;
}

/*Message style section*/
.bookText .message {
  padding: 15px !important;
  max-width: 100vw !important;
  border-radius: 5px;
  margin-bottom: 12px;
}

.bookText .segment {
  padding: 15px !important;
  border-radius: 5px;
  margin-bottom: 12px;
}

.bookText .ui.message.red {
  background-color: #fff !important;
  color: red;
  box-shadow: 0 0 0 1px red inset, 0 0 0 0 transparent;
}

.bookText .ui.message.blue {
  background-color: #fff !important;
  color: blue;
  box-shadow: 0 0 0 1px blue inset, 0 0 0 0 transparent;
}

.bookText .ui.message.green {
  background-color: #fff !important;
  color: green;
  box-shadow: 0 0 0 1px green inset, 0 0 0 0 transparent;
}

.bookText .ui.message.yellow {
  background-color: #fff !important;
  color: #b58105;
  box-shadow: 0 0 0 1px #b58105 inset, 0 0 0 0 transparent;
}

/*End message style section*/

/*Segment section*/
.bookText .ui.segment.red {
  background-color: #fff !important;
  color: #000000;
  border-top: 2px solid red;
}

.bookText .ui.segment.red h2 {
  color: red !important;
  background: transparent !important;
}

.bookText .ui.segment.blue {
  background-color: #fff !important;
  color: #000000;
  border-top: 2px solid blue;
}

.bookText .ui.segment.blue h2 {
  color: red !important;
  background: transparent !important;
}

.bookText .ui.segment.green {
  background-color: #fff !important;
  color: #000000;
  border-top: 2px solid green;
}

.bookText .ui.segment.green h2 {
  color: red !important;
  background: transparent !important;
}

.bookText .ui.segment.brown {
  background-color: #fff !important;
  color: #000000;
  border-top: 2px solid #795548;
}

.bookText .ui.segment.brown h2 {
  color: red !important;
  background: transparent !important;
}

/*End section section*/

.bookText .ui.table {
  width: 100%;
  background: #fff;
  margin: 1em 0;
  border: 1px solid rgba(34, 36, 38, 0.15);
  box-shadow: none;
  border-radius: 0.28571429rem;
  text-align: left;
  color: rgba(0, 0, 0, 0.87);
  border-collapse: separate;
  border-spacing: 0;
}

/*Tutorial details table style*/
.bookText .ui.table td {
  padding: 20px;
}

/*End tutorial details table style*/

/*Tutorial details image caption*/
.bookText figcaption {
  background-color: #efeeee;
  padding: 5px 5px 5px 5px;
  border-radius: 5px;
  font-size: 14px;
}

/*End tutorial details image caption*/

@media screen and (max-width: 600px) {
  .tables {
    display: inline;
    flex-direction: column;
  }
}
</style>
