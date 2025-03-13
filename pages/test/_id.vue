<template>
  <div class="test-details-content">
    <!--  Start: detail  -->
    <section>
      <v-container class="py-0">
        <div class="detail mt-md-8">
          <v-row>
            <v-col cols="12" md="12">
              <!--  Description   -->
              <div class="d-flex mb-4">
                <div class="w-100">
                  <div class="description-holder my-4">
                    <v-col class="test-list" cols="12">
                      <div
                        id="test-question"
                        ref="test-question"
                        v-html="contentData.question"
                      />
                      <img class="answer-img" :src="contentData.q_file" />

                      <v-radio-group
                        v-model="selectedOption"
                        @change="fireSelectedOption"
                        v-if="
                          contentData.type == 'fourchoice' ||
                          contentData.type == 'twochoice' ||
                          contentData.type == 'tf'
                        "
                      >
                        <v-radio
                          value="1"
                          class="pl-2"
                          :class="{
                            'true-answer': isCorrectAnswer(1),
                            'false-answer': isIncorrectAnswer(1),
                          }"
                        >
                          <template slot="label">
                            <div class="answer">
                              <p>
                                <span>1)&nbsp;</span>
                                <span
                                  ref="mathJaxEl"
                                  v-html="contentData.answer_a"
                                ></span>
                              </p>
                              <img
                                v-show="contentData.a_file"
                                class="answer-img"
                                :src="contentData.a_file"
                              />
                            </div>
                          </template>
                        </v-radio>
                        <v-radio
                          value="2"
                          class="pl-2"
                          :class="{
                            'true-answer': isCorrectAnswer(2),
                            'false-answer': isIncorrectAnswer(2),
                          }"
                        >
                          <template slot="label">
                            <div class="answer">
                              <span>2)&nbsp;</span>
                              <span
                                ref="mathJaxEl"
                                v-html="contentData.answer_b"
                              ></span>
                              <img
                                v-show="contentData.b_file"
                                :src="contentData.b_file"
                                class="answer-img"
                              />
                            </div>
                          </template>
                        </v-radio>
                        <v-radio
                          value="3"
                          v-if="contentData.type == 'fourchoice'"
                          class="pl-2"
                          :class="{
                            'true-answer': isCorrectAnswer(3),
                            'false-answer': isIncorrectAnswer(3),
                          }"
                        >
                          <template slot="label">
                            <div class="answer">
                              <span>3)&nbsp;</span>
                              <span
                                ref="mathJaxEl"
                                v-html="contentData.answer_c"
                              ></span>
                              <img
                                v-show="contentData.c_file"
                                class="answer-img"
                                :src="contentData.c_file"
                              />
                            </div>
                          </template>
                        </v-radio>
                        <v-radio
                          value="4"
                          v-if="contentData.type == 'fourchoice'"
                          class="pl-2"
                          :class="{
                            'true-answer': isCorrectAnswer(4),
                            'false-answer': isIncorrectAnswer(4),
                          }"
                        >
                          <template slot="label">
                            <div class="answer">
                              <span>4)&nbsp;</span>
                              <span
                                ref="mathJaxEl"
                                v-html="contentData.answer_d"
                              />

                              <img
                                v-show="contentData.d_file"
                                class="answer-img"
                                :src="contentData.d_file"
                              />
                            </div>
                          </template>
                        </v-radio>
                      </v-radio-group>

                      <!--Answer section-->
                      <v-expansion-panels
                        v-if="
                          contentData.answer_full ||
                          contentData.answer_full_file
                        "
                        class="mt-4"
                        v-model="fullAnswer"
                      >
                        <v-expansion-panel class="light-green">
                          <v-expansion-panel-header
                            @click="showAnswer()"
                            class="text-h5 font-weight-bold"
                            >Show answer
                          </v-expansion-panel-header>
                          <v-expansion-panel-content class="light-green">
                            <div
                              v-html="contentData.answer_full"
                              ref="mathJaxEl"
                            />
                            <br />
                            <img
                              v-show="contentData.answer_full_file"
                              class="answer-img"
                              :src="contentData.answer_full_file"
                            />
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-expansion-panels>
                      <!--End answer section-->

                      <v-row class="mt-3">
                        <v-col cols="10">
                          <v-btn icon @click="openCrashReportDialog">
                            <v-icon color="blue"> mdi-bullhorn-outline </v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-col>
                  </div>

                  <!--Helpful link-->
                  <div class="label-holder">
                    <v-chip
                      v-if="contentData.topic"
                      :to="`/search?type=azmoon&section=${contentData.section}&base=${contentData.base}&lesson=${contentData.lesson}&topic=${contentData.topic}`"
                      class="ma-1"
                    >
                      {{ contentData.topic_title }}
                    </v-chip>
                    <v-chip
                      :to="`/search?type=azmoon&section=${contentData.section}&base=${contentData.base}&lesson=${contentData.lesson}`"
                      class="ma-1"
                    >
                      {{ contentData.lesson_title }}
                    </v-chip>
                    <v-chip
                      :to="`/search?type=azmoon&section=${contentData.section}&base=${contentData.base}`"
                      link
                      class="mr-1"
                    >
                      {{ contentData.base_title }}
                    </v-chip>
                    <v-chip
                      :to="`/search?type=azmoon&section=${contentData.section}`"
                      link
                      class="mr-1"
                    >
                      {{ contentData.section_title }}
                    </v-chip>
                    <v-chip
                      v-if="contentData.tutorial_id"
                      :to="`/tutorial/${contentData.tutorial_id}`"
                      link
                      class="mr-1 orange white--text"
                    >
                      Tutorial of this topic
                    </v-chip>
                  </div>
                  <!--End helpful link-->
                </div>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-container>
    </section>

    <!--  End: detail  -->

    <crash-report ref="crash_report" :report_type_list="report_type_list" />
  </div>
</template>
<script>
import Breadcrumb from "@/components/widgets/breadcrumb";
import LastViews from "@/components/common/last-views";
import Category from "@/components/common/category";
import PreviewGallery from "@/components/details/preview-gallery";
import RelatedContent from "@/components/details/related-content";
import LatestTrainingContent from "@/components/details/latest-training-content";
import RelatedQa from "@/components/details/related-qa";
import RelatedOnlineExam from "@/components/details/related-online-exam";
import CrashReport from "~/components/common/crash-report.vue";

export default {
  name: "test-details",
  auth: false,
  components: {
    CrashReport,
  },
  head() {
    return {
      // title: this.$refs["test-question"].innerText
    };
  },

  async asyncData({ params, $axios, error }) {
    try {
      const content = await $axios.$get(`/api/v1/examTests/${params.id}`, {
        params: {
          full: true,
        },
      });
      var contentData = [];

      //Check data exist
      if (content.status === 1) {
        contentData = content.data;
      }

      return { contentData };
    } catch (e) {
      if (e.response && e.response.status === 404) {
        // Redirect using the error function
        error({ statusCode: 404, message: "Page not found" });
      }
    }
  },

  mounted() {
    document.title = this.$refs["test-question"].innerText;
    this.renderMathJax();
  },

  data: () => ({
    sell_btn: true,
    rating: 4.5,
    breads: [
      {
        text: "Online exam",
        disabled: false,
        href: "/search?type=azmoon",
      },
    ],
    detail: {
      poster: "poster1.jpg",
      linkPoster: "",
      title:
        "A collection of 120 test questions for lessons 6 to 9 on (3) 12th",
      rate: 5,
      previewImage: "test1.png",
      labels: [
        "History (3)",
        "Twelfth",
        "Second Secondary",
        "Literature",
        "Kermanshah",
        "District 2",
        "Shohadai Parvin",
        "Farvardin",
        "2019",
      ],
    },
    model: null,
    fullAnswer: "",

    copy_btn: "Copy",
    download_loading: false,
    selectedOption: "",
    report_type_list: [
      {
        value: 1,
        label: "The selected option in the answer sheet is not correct.",
      },
      {
        value: 2,
        label: "There is more than one correct option.",
      },
      {
        value: 3,
        label: "None of the options are correct.",
      },
      {
        value: 4,
        label: "There are typos in questions or options.",
      },
      {
        value: 5,
        label: "This test is similar to another test in the same test.",
      },
      {
        value: 6,
        label: "There are problems in the descriptive answer.",
      },
      {
        value: 7,
        label: "This test is out of budget or topic.",
      },
      {
        value: 8,
        label: "Other cases",
      },
    ],
  }),

  watch: {},
  methods: {
    isCorrectAnswer(option) {
      // Check if the selected option is the correct answer
      return this.selectedOption && option == this.contentData.true_answer;
    },
    isIncorrectAnswer(option) {
      // Check if the selected option is incorrect
      return (
        this.selectedOption &&
        option == this.selectedOption &&
        option != this.contentData.true_answer
      );
    },
    openCrashReportDialog() {
      this.$refs.crash_report.dialog = true;
      this.$refs.crash_report.form.id = this.$route.params.id;
      this.$refs.crash_report.form.type = "examTest";
    },
    renderMathJax() {
      this.$renderMathJax(this.$refs.mathJaxEl);
    },
    showAnswer() {
      this.selectedOption = this.contentData.true_answer;

      setTimeout(() => {
        this.renderMathJax();
      }, 100);
    },
    fireSelectedOption() {
      this.fullAnswer = 0;
    },
  },
};
</script>

<style>
.content_main_info {
  padding: 27px;
  background: #f5f5f5 !important;
  border-radius: 6px;
}

.content_main_info .creator_title {
  font-size: 18px;
}

.order-btn-holder {
  /*position: -webkit-sticky!important;*/
  position: fixed !important;
  bottom: 0 !important;
  right: 0 !important;
  left: 0 !important;
  z-index: 2 !important;
  border-top: 0.1rem solid #e1e2e3;
}

.order-btn-holder .v-btn {
  width: 40% !important;
}

.order-btn-holder span {
  font-size: 1.3rem;
}

p {
  font-size: 1.3rem !important;
}

.true-answer {
  background-color: #4caf50; /* Green background color */
  color: white !important; /* White text color */
  padding: 0.5rem 0.5rem 0.5rem 0;
  border-radius: 5px;
}

.false-answer {
  background-color: #f44336; /* Red background color */
  color: white !important; /* White text color */
  padding: 0.5rem 0.5rem 0.5rem 0;
  border-radius: 5px;
}

.answer {
  align-items: center;
  display: flex;
  height: auto;
  outline: none;
}

.answer-img {
  max-height: 15rem;
}
</style>
