<template>
  <v-container class="test-maker">
    <v-container>
      <v-row class="mt-4">
        <v-col cols="12" md="12">
          <span class="text-h4 teal--text">
            <span class="fa-solid fa-file" style="font-size: 2rem !important" />
            {{ contentData.exam.title }} Report card
          </span>
        </v-col>
      </v-row>
    </v-container>
    <v-card class="mb-16">
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" md="12">
              <v-simple-table class="exams_table">
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left text-h5">Participant</th>
                      <th class="text-center text-h5">
                        <i
                          class="fa-regular fa-circle-play fa-xl d-block d-md-none"
                        ></i>
                        <span class="d-none d-md-block"> Start time </span>
                      </th>
                      <th class="text-center text-h5">
                        <i
                          class="fa-regular fa-clock fa-xl d-block d-md-none"
                        ></i>
                        <span class="d-none d-md-block"> Test duration </span>
                      </th>
                      <th class="text-center text-h5">
                        <i
                          class="fa-regular fa-circle-stop fa-xl d-block d-md-none"
                        ></i>
                        <span class="d-none d-md-block"> Response time </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {{ contentData.user.first_name }}
                        {{ contentData.user.last_name }}
                      </td>
                      <td class="text-center">
                        {{ contentData.userData.subdate }}
                      </td>
                      <td class="text-center">
                        {{ contentData.exam.azmoon_time }} min
                      </td>
                      <td class="text-center">
                        {{ contentData.userData.submit_time }} Seconds
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-col>
          </v-row>

          <v-row class="mt-8">
            <v-col class="d-none d-md-block" md="12">
              <span class="mr-2">
                <i class="fa-solid fa-circle-check fa-lg green--text"></i>
                : Correct answers
              </span>
              <span class="mr-2 my-1">
                <i class="fa-regular fa-times-circle fa-lg red--text"></i>
                : Wrong answer
              </span>
              <span class="mr-2 my-1">
                <i class="fa-regular fa-circle-check fa-lg green--text"></i>
                : Correct option
              </span>
              <span class="mr-2 my-1">
                <i class="fa-regular fa-circle fa-lg"></i>
                : No answer
              </span>
            </v-col>
            <v-col cols="6" class="d-block d-md-none">
              <span class="mr-2">
                <i class="fa-solid fa-circle-check fa-lg green--text"></i>
                : Correct answers
              </span>
            </v-col>
            <v-col cols="6" class="d-block d-md-none">
              <span class="mr-2 my-1">
                <i class="fa-regular fa-times-circle fa-lg red--text"></i>
                : Wrong answer
              </span>
            </v-col>
            <v-col cols="6" class="d-block d-md-none">
              <span class="mr-2 my-1">
                <i class="fa-regular fa-circle-check fa-lg green--text"></i>
                : Correct option
              </span>
            </v-col>
            <v-col cols="6" class="d-block d-md-none">
              <span class="mr-2 my-1">
                <i class="fa-regular fa-circle fa-lg"></i>
                : No answer
              </span>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="4">
              <v-simple-table class="exams_table">
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left text-h5">#</th>
                      <th class="text-center text-h5">1</th>
                      <th class="text-center text-h5">2</th>
                      <th class="text-center text-h5">3</th>
                      <th class="text-center text-h5">4</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      class="pointer"
                      v-for="(item, key) in contentData.result"
                      @click="questionDetails(item)"
                    >
                      <td>{{ key + 1 }}</td>
                      <td class="text-center">
                        <i
                          v-if="item.true_answer == 1 && item.user_answer == 1"
                          class="fa-solid fa-circle-check fa-lg green--text"
                        ></i>
                        <i
                          v-else-if="
                            item.true_answer != 1 && item.user_answer == 1
                          "
                          class="fa-regular fa-times-circle fa-lg red--text"
                        ></i>
                        <i
                          v-else-if="
                            item.true_answer == 1 &&
                            (!item.user_answer || item.user_answer != 1)
                          "
                          class="fa-regular fa-circle-check fa-lg green--text"
                        ></i>
                        <i v-else class="fa-regular fa-circle fa-lg"></i>
                      </td>
                      <td class="text-center">
                        <i
                          v-if="item.true_answer == 2 && item.user_answer == 2"
                          class="fa-solid fa-circle-check fa-lg green--text"
                        ></i>
                        <i
                          v-else-if="
                            item.true_answer != 2 && item.user_answer == 2
                          "
                          class="fa-regular fa-times-circle fa-lg red--text"
                        ></i>
                        <i
                          v-else-if="
                            item.true_answer == 2 &&
                            (!item.user_answer || item.user_answer != 2)
                          "
                          class="fa-regular fa-circle-check fa-lg green--text"
                        ></i>
                        <i v-else class="fa-regular fa-circle fa-lg"></i>
                      </td>
                      <td class="text-center">
                        <i
                          v-if="item.true_answer == 3 && item.user_answer == 3"
                          class="fa-solid fa-circle-check fa-lg green--text"
                        ></i>
                        <i
                          v-else-if="
                            item.true_answer != 3 && item.user_answer == 3
                          "
                          class="fa-regular fa-times-circle fa-lg red--text"
                        ></i>
                        <i
                          v-else-if="
                            item.true_answer == 3 &&
                            (!item.user_answer || item.user_answer != 3)
                          "
                          class="fa-regular fa-circle-check fa-lg green--text"
                        ></i>
                        <i v-else class="fa-regular fa-circle fa-lg"></i>
                      </td>
                      <td class="text-center">
                        <i
                          v-if="item.true_answer == 4 && item.user_answer == 4"
                          class="fa-solid fa-circle-check fa-lg green--text"
                        ></i>
                        <i
                          v-else-if="
                            item.true_answer != 2 && item.user_answer == 4
                          "
                          class="fa-regular fa-times-circle fa-lg red--text"
                        ></i>
                        <i
                          v-else-if="
                            item.true_answer == 4 &&
                            (!item.user_answer || item.user_answer != 4)
                          "
                          class="fa-regular fa-circle-check fa-lg green--text"
                        ></i>
                        <i v-else class="fa-regular fa-circle fa-lg"></i>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-col>
            <v-col cols="12" md="8">
              <v-row>
                <v-col cols="12">
                  <v-simple-table class="exams_table">
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th class="text-left text-h5">Lesson</th>
                          <th class="text-center text-h5">Count</th>
                          <th class="text-center text-h5">
                            <i class="fa-solid fa-circle-check green--text"></i>
                          </th>
                          <th class="text-center text-h5">
                            <i class="fa-solid fa-times-circle red--text"></i>
                          </th>
                          <th class="text-center text-h5">
                            <i class="fa-regular fa-circle"></i>
                          </th>
                          <th class="text-center text-h5">%</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in contentData.answerStats.lessons">
                          <td>{{ item.title }}</td>
                          <td class="text-center">{{ item.num }}</td>
                          <td class="text-center">{{ item.true }}</td>
                          <td class="text-center">{{ item.false }}</td>
                          <td class="text-center">{{ item.noanswer }}</td>
                          <td class="text-center">{{ item.percent }}</td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr bgcolor="#E5FBF7">
                          <td>Total</td>
                          <td class="text-center">
                            {{ contentData.answerStats.total.num }}
                          </td>
                          <td class="text-center">
                            {{ contentData.answerStats.total.true }}
                          </td>
                          <td class="text-center">
                            {{ contentData.answerStats.total.false }}
                          </td>
                          <td class="text-center">
                            {{ contentData.answerStats.total.noAnswer }}
                          </td>
                          <td class="text-center">
                            {{ contentData.answerStats.total.percent }}
                          </td>
                        </tr>
                      </tfoot>
                    </template>
                  </v-simple-table>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="6">
                  <v-simple-table class="exams_table">
                    <template v-slot:default>
                      <tbody>
                        <tr>
                          <td>
                            <i
                              class="fa-solid fa-circle-check fa-lg green--text"
                            ></i
                            >&nbsp; Correct answers:
                          </td>
                          <td class="text-center">
                            {{ contentData.answerStats.total.true }}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <i
                              class="fa-regular fa-times-circle fa-lg red--text"
                            ></i
                            >&nbsp; Wrong answers:
                          </td>
                          <td class="text-center">
                            {{ contentData.answerStats.total.false }}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <i class="fa-regular fa-circle fa-lg"></i>&nbsp; No
                            answer:
                          </td>
                          <td class="text-center">
                            {{ contentData.answerStats.total.noAnswer }}
                          </td>
                        </tr>
                        <tr>
                          <td>Rank in country:</td>
                          <td
                            class="text-center"
                            v-if="contentData.rank && contentData.rank.total"
                          >
                            <strong>
                              {{ contentData.rank.total.user }}
                            </strong>
                            of {{ contentData.rank.total.total }} participants
                          </td>
                          <td v-else class="text-center">-</td>
                        </tr>
                        <tr>
                          <td>Rank in state:</td>
                          <td
                            class="text-center"
                            v-if="contentData.rank && contentData.rank.state"
                          >
                            <strong>{{ contentData.rank.state.user }}</strong>
                            of {{ contentData.rank.state.total }} participants
                          </td>
                          <td class="text-center" v-else>-</td>
                        </tr>
                        <tr>
                          <td>Rank in area:</td>
                          <td
                            class="text-center"
                            v-if="contentData.rank && contentData.rank.area"
                          >
                            <strong> {{ contentData.rank.area.user }}</strong>
                            of {{ contentData.rank.area.total }} participants
                          </td>
                          <td v-else class="text-center">-</td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>

                  <v-btn
                    block
                    color="error"
                    @click="startDownload"
                    :loading="download_loading"
                    class="mt-6"
                  >
                    Download PDF file with key |
                    {{
                      contentData.price.price > 0
                        ? "$" + contentData.price.price
                        : "Free"
                    }}
                  </v-btn>
                </v-col>
                <v-col cols="12" md="6">
                  <pie-chart :chart-data="chartData" />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>

    <!--Show test details-->
    <v-dialog v-model="dialog.questionDetails.status" max-width="700">
      <v-card>
        <v-card-text class="py-4" ref="mathJaxEl">
          <v-col class="test-list" cols="12">
            <div id="test-question" v-html="dialog.questionDetails.question" />
            <img :src="dialog.questionDetails.q_file" />

            <div class="answer">
              <v-icon
                v-show="dialog.questionDetails.true_answer == '1'"
                class="true_answer"
                large
              >
                mdi-check
              </v-icon>
              <v-icon
                v-show="
                  dialog.questionDetails.user_answer == '1' &&
                  dialog.questionDetails.true_answer != '1'
                "
                class="false_answer"
                large
              >
                mdi-close
              </v-icon>
              <span>1)</span>
              <span
                v-show="dialog.questionDetails.answer_a"
                v-html="dialog.questionDetails.answer_a"
              ></span>
              <img
                v-show="dialog.questionDetails.a_file"
                :src="dialog.questionDetails.a_file"
              />
            </div>
            <div class="answer">
              <v-icon
                v-show="dialog.questionDetails.true_answer == '2'"
                large
                class="true_answer"
              >
                mdi-check
              </v-icon>
              <v-icon
                v-show="
                  dialog.questionDetails.user_answer == '2' &&
                  dialog.questionDetails.true_answer != '2'
                "
                class="false_answer"
                large
              >
                mdi-close
              </v-icon>

              <span>2)</span>
              <span
                v-show="dialog.questionDetails.answer_b"
                v-html="dialog.questionDetails.answer_b"
              ></span>
              <img
                v-show="dialog.questionDetails.b_file"
                :src="dialog.questionDetails.b_file"
              />
            </div>
            <div class="answer">
              <v-icon
                v-show="dialog.questionDetails.true_answer == '3'"
                large
                class="true_answer"
              >
                mdi-check
              </v-icon>

              <span>3)</span>
              <span
                v-show="dialog.questionDetails.answer_c"
                v-html="dialog.questionDetails.answer_c"
              ></span>
              <img
                v-show="dialog.questionDetails.c_file"
                :src="dialog.questionDetails.c_file"
              />
            </div>
            <div class="answer">
              <v-icon
                class="true_answer"
                v-show="dialog.questionDetails.true_answer == '4'"
                large
              >
                mdi-check
              </v-icon>
              <span>4)</span>
              <span
                v-show="dialog.questionDetails.answer_d"
                v-html="dialog.questionDetails.answer_d"
              />
              <img
                v-show="dialog.questionDetails.d_file"
                :src="dialog.questionDetails.d_file"
              />
            </div>
            <v-row class="mt-3">
              <v-col cols="10">
                <v-btn icon @click="openCrashReportDialog">
                  <v-icon color="blue"> mdi-bullhorn-outline </v-icon>
                </v-btn>
                <v-btn icon :to="`/test/${dialog.questionDetails.id}`">
                  <v-icon color="green"> mdi-eye </v-icon>
                </v-btn>
              </v-col>
              <v-col cols="2" class="text-right">
                <v-btn
                  outlined
                  color="red"
                  @click="dialog.questionDetails.status = false"
                >
                  Close
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!--End show test details-->

    <crash-report ref="crash_report" :report_type_list="report_type_list" />
  </v-container>
</template>

<script>
import PieChart from "@/components/chart/PieChart";
import CrashReport from "~/components/common/crash-report.vue";

export default {
  name: "exam-result",
  components: { CrashReport, PieChart },
  head() {
    return {
      title: "Online exam result",
      script: [
        {
          src: `${process.env.STORAGE_BASE_URL}/static/MathJax/MathJax.js?config=TeX-MML-AM_CHTML`,
        },
      ],
    };
  },
  async asyncData({ params, $axios }) {
    // This could also be an action dispatch
    const content = await $axios.$get(`/api/v1/exams/result/${params.id}`);
    var contentData = [];

    //Check data exist
    if (content.status === 1) {
      contentData = content.data;
    }

    let chartData = {
      labels: [" Correct answers", " Wrong answers", " No answer"],
      datasets: [
        {
          borderColor: "#e1e2e3",
          backgroundColor: ["#4CAF50", "#F44336", "#FFFFFF"],
          data: [
            contentData.answerStats.total.true,
            contentData.answerStats.total.false,
            contentData.answerStats.total.noAnswer,
          ],
        },
      ],
    };

    return { contentData, chartData };
  },
  data() {
    return {
      contentData: [],
      chartData: {},
      download_loading: false,
      dialog: {
        questionDetails: {
          status: false,
        },
      },
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
    };
  },
  mounted() {
    //Delete current exam from local storage
    const allExamStats = JSON.parse(localStorage.getItem("allExamStats"));
    var index = allExamStats.findIndex((x) => x.id == this.contentData.exam.id);
    if (index !== -1) {
      this.$delete(allExamStats, index);
      localStorage.setItem("allExamStats", JSON.stringify(allExamStats));
    }
    //End delete current exam from local storage
  },
  methods: {
    //Download file
    startDownload() {
      this.download_loading = true;
      this.$axios
        .$get(`/api/v1/exams/download/${this.contentData.exam.id}`)
        .then((response) => {
          var FileSaver = require("file-saver");
          FileSaver.saveAs(response.data.url, response.data.name);
        })
        .catch((err) => {
          if (err.response.status == 400) {
            if (
              err.response.data.status == 0 &&
              err.response.data.error == "creditNotEnough"
            ) {
              this.$toast.info("No enough credit");
            }
          } else if (err.response.status == 403) {
            this.$router.push({ query: { auth_form: "login" } });
          }
          console.log(err);
        })
        .finally(() => {
          this.download_loading = false;
        });
    },
    //End download file

    //Show question details
    questionDetails(item) {
      this.dialog.questionDetails.question = item.question;
      this.dialog.questionDetails.q_file = item.q_file;
      this.dialog.questionDetails.true_answer = item.true_answer;
      this.dialog.questionDetails.user_answer = item.user_answer;
      this.dialog.questionDetails.id = item.id;

      this.dialog.questionDetails.answer_a = item.answer_a;
      this.dialog.questionDetails.a_file = item.a_file;

      this.dialog.questionDetails.answer_b = item.answer_b;
      this.dialog.questionDetails.b_file = item.b_file;

      this.dialog.questionDetails.answer_c = item.answer_c;
      this.dialog.questionDetails.c_file = item.c_file;

      this.dialog.questionDetails.answer_d = item.answer_d;
      this.dialog.questionDetails.d_file = item.d_file;

      setTimeout(() => {
        this.renderMathJax();
      }, 1);

      this.dialog.questionDetails.status = true;
    },
    //End show question details

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
          },
        });
        MathJax.Hub.Queue([
          "Typeset",
          window.MathJax.Hub,
          this.$refs.mathJaxEl,
        ]);
      }
    },

    openCrashReportDialog() {
      this.dialog.questionDetails.status = false;
      this.$refs.crash_report.dialog = true;
      this.$refs.crash_report.form.id = this.dialog.questionDetails.id;
      this.$refs.crash_report.form.type = "examTest";
    },
  },
};
</script>

<style scoped></style>
