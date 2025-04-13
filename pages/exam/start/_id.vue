<template>
  <v-container v-if="contentData.startID" class="test-maker">
    <v-card id="participating-exam-header">
      <v-card-text>
        <v-row class="text-center">
          <v-col cols="4">
            <p>
              Remaining time:
              <v-chip label color="teal" dark>
                {{ this.hhmmss(examStats.remainTime) }}
              </v-chip>
            </p>
          </v-col>
          <v-col cols="4">
            <a
              :href="
                examStats.nextNotAnswer
                  ? `#item-${examStats.nextNotAnswer}`
                  : ''
              "
              @click="updateNextNotAnswer()"
              >Unanswered questions:
            </a>
          </v-col>
          <v-col cols="4">
            <a
              :href="examStats.nextPin ? `#item-${examStats.nextPin}` : '#'"
              @click="updateNextPin()"
              >Pined question:
              <v-chip label color="teal" dark v>
                {{ examStats.pinQuestionsArr.length }}
              </v-chip>
            </a>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card class="test-list mb-4">
      <v-card-title class="text-h4 font-weight-bold py-6">
        {{ contentData.exam?.title }}
      </v-card-title>
      <v-card-text>
        <v-divider class="mb-4" />
        <v-row>
          <v-col
            :id="`item-${item.id}`"
            class="bookmark-target"
            cols="12"
            v-show="contentData.tests.length > 0"
            v-for="(item, key) in contentData.tests"
            :key="item.id"
          >
            <div id="test-question">
              <div class="d-flex">
                <div>{{ key + 1 }})&nbsp;</div>
                <div ref="mathJaxEl" v-html="`${item.question}`" />
              </div>
              <img
                v-show="item.q_file & (item.q_file != 0)"
                :src="item.q_file"
              />
            </div>

            <v-radio-group
              @change="updateNotAnswerData(item.id)"
              v-model="examStats.answerData[item.id]"
            >
              <v-radio value="1">
                <template slot="label">
                  <div class="answer">
                    <span>1)</span>
                    <span
                      style="font-size: 14px"
                      ref="mathJaxEl"
                      v-html="item.answer_a"
                    ></span>
                    <img v-show="item.a_file" :src="item.a_file" />
                  </div>
                </template>
              </v-radio>
              <v-radio value="2">
                <template slot="label">
                  <div class="answer">
                    <span>2)</span>
                    <span ref="mathJaxEl" v-html="item.answer_b"></span>
                    <img v-show="item.b_file" :src="item.b_file" />
                  </div>
                </template>
              </v-radio>
              <v-radio value="3">
                <template slot="label">
                  <div class="answer">
                    <span>3)</span>
                    <span ref="mathJaxEl" v-html="item.answer_c"></span>
                    <img v-show="item.c_file" :src="item.c_file" />
                  </div>
                </template>
              </v-radio>
              <v-radio value="4">
                <template slot="label">
                  <div class="answer">
                    <span>4)</span>
                    <span ref="mathJaxEl" v-html="item.answer_d" />
                    <img v-show="item.d_file" :src="item.d_file" />
                  </div>
                </template>
              </v-radio>
            </v-radio-group>
            <v-row>
              <v-col cols="6">
                <v-btn icon fab x-small @click="eraseTest(item.id)">
                  <v-icon> mdi-eraser </v-icon>
                </v-btn>
                <v-btn
                  icon
                  fab
                  :color="
                    examStats.pinQuestionsArr.find((x) => x === item.id)
                      ? 'teal'
                      : ''
                  "
                  x-small
                  @click="pinQuestion(item.id)"
                >
                  <v-icon> mdi-pin </v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-divider class="mt-3" />
          </v-col>
          <v-col
            v-show="!contentData.exam.tests.length"
            cols="12"
            class="text-center"
          >
            <p>Oops! no data found</p>
          </v-col>
        </v-row>
        <v-row class="mb-16">
          <v-col cols="12" md="6" class="pb-0">
            <v-btn
              @click="endExam()"
              :loading="submit_loading"
              lg
              color="teal"
              class="white--text"
              block
            >
              Send answers
            </v-btn>
          </v-col>
          <v-col cols="12" md="6">
            <v-btn lg outlined color="error" to="/search?type=azmoon" block>
              Discard
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "exam-start",
  auth: false,
  head() {
    return {
      title: "Start online exam",
    };
  },
  async asyncData({ params, redirect, $axios }) {
    try {
      // This could also be an action dispatch
      const content = await $axios.$get(`/api/v1/exams/start/${params.id}`);
      var contentData = [];

      //Check data exist
      if (content.status === 1) {
        contentData = content.data;
      }

      return { contentData };
    } catch (error) {
      if (error.response.status == 400) {
        // if (error.response.data)
        //   redirect(`/exam/result/${error.response.data.data.id}`);
      } else if (error.response.status == 401 || error.response.status == 403)
        redirect(`/exam/${params.id}`);
      else console.log(error.response.data);
    }
  },
  data() {
    return {
      contentData: [],
      submit_loading: false,
      answerForm: [],

      allExamStats: [],
      examStats: {
        id: "",
        remainTime: 0,
        pinQuestionsArr: [],
        notAnsweredArr: [],
        answerData: {},
        nextPin: "",
        nextNotAnswer: "",
      },
    };
  },
  mounted() {
    if (localStorage.getItem("allExamStats"))
      this.allExamStats = JSON.parse(localStorage.getItem("allExamStats"));
    this.examStats.id = this.contentData.exam.id;

    var index = this.allExamStats.findIndex((x) => x.id == this.examStats.id);
    if (index !== -1) {
      this.examStats.remainTime = this.allExamStats[index].remainTime;
      this.examStats.answerData = this.allExamStats[index].answerData;
      this.examStats.nextNotAnswer = this.allExamStats[index].nextNotAnswer;
      if (
        this.allExamStats[index].notAnsweredArr.length == 0 ||
        this.allExamStats[index].notAnsweredArr == undefined
      )
        this.initNotAnswered();
      else
        this.examStats.notAnsweredArr = this.allExamStats[index].notAnsweredArr;

      this.examStats.pinQuestionsArr =
        this.allExamStats[index].pinQuestionsArr != undefined
          ? this.allExamStats[index].pinQuestionsArr
          : [];
    } else {
      this.examStats.remainTime = this.contentData.exam.azmoon_time * 60;
      this.initNotAnswered();
    }

    this.countDownTimer();
    this.loadMathJax();
  },
  watch: {
    "examStats.answerData"(val) {
      this.updateLocalStorage();
    },
  },
  methods: {
    updateLocalStorage() {
      var index = this.allExamStats.findIndex((x) => x.id == this.examStats.id);
      if (index === -1) this.allExamStats.push(this.examStats);
      else {
        this.allExamStats[index] = this.examStats;
      }
      localStorage.setItem("allExamStats", JSON.stringify(this.allExamStats));
    },

    initNotAnswered() {
      for (var i in this.contentData.tests) {
        this.examStats.notAnsweredArr.push(this.contentData.tests[i].id);
      }
    },

    loadMathJax() {
      this.$renderMathJax(this.$refs.mathJaxEl);
    },

    endExam() {
      this.submit_loading = true;

      //Delete from local storage
      var index = this.allExamStats.findIndex((x) => x.id == this.examStats.id);
      if (index !== -1) {
        this.$delete(this.allExamStats, index);
        localStorage.setItem("allExamStats", JSON.stringify(this.allExamStats));
      }
      //End delete from local storage

      const querystring = require("querystring");
      this.$axios
        .$post(
          `/api/v1/exams/end/${this.contentData.exam.id}`,
          querystring.stringify({
            startID: this.contentData.startID,
            answers: JSON.stringify(this.examStats.answerData),
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `${this.$auth.strategy.token.get()}`,
            },
          }
        )
        .then((response) => {
          this.$router.push(`/exam/result/${response.data.id}`);
        })
        .catch((error) => {
          if (error.response.status == 400)
            if (error.response.data)
              this.$router.push({
                path: `/exam/result/${error.response.data.data.id}`,
              });
        })
        .finally(() => {
          this.submit_loading = false;
        });
    },

    //Convert form data from multipart to urlencode
    urlencodeFormData(fd) {
      var s = "";

      for (var pair of fd.entries()) {
        if (typeof pair[1] == "string") {
          s +=
            (s ? "&" : "") + this.encode(pair[0]) + "=" + this.encode(pair[1]);
        }
      }
      return s;
    },

    encode(s) {
      return encodeURIComponent(s).replace(/%20/g, "+");
    },

    countDownTimer() {
      if (this.examStats.remainTime > 0) {
        setTimeout(() => {
          this.examStats.remainTime -= 1;
          // this.$store.commit('user/setExamParticipationData',this.examStats)
          this.countDownTimer();
          this.updateLocalStorage();
        }, 1000);
      } else {
        this.endExam();
      }
    },

    //Convert seconds to readable HH:ii:ss format
    hhmmss(secs) {
      var minutes = Math.floor(secs / 60);
      secs = secs % 60;
      var hours = Math.floor(minutes / 60);
      minutes = minutes % 60;
      if (hours)
        return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(secs)}`;
      else return `${this.pad(minutes)}:${this.pad(secs)}`;
    },

    pad(num) {
      return ("0" + num).slice(-2);
    },
    //End convert seconds to readable HH:ii:ss format

    pinQuestion(question_id) {
      var index = this.examStats.pinQuestionsArr.findIndex(
        (val) => val == question_id
      );
      if (index === -1) {
        this.examStats.pinQuestionsArr.push(question_id);
        //Init next pin for first time
        if (this.examStats.pinQuestionsArr.length === 1)
          this.examStats.nextPin = question_id;
      } else {
        this.examStats.pinQuestionsArr.splice(index, 1);
      }

      this.updateLocalStorage();
    },

    updateNextPin() {
      if (this.examStats.pinQuestionsArr.length) {
        var index = this.examStats.pinQuestionsArr.findIndex(
          (x) => x === this.examStats.nextPin
        );
        if (index + 1 === this.examStats.pinQuestionsArr.length)
          this.examStats.nextPin = this.examStats.pinQuestionsArr[0];
        else this.examStats.nextPin = this.examStats.pinQuestionsArr[index + 1];
      }
      this.updateLocalStorage();
    },

    updateNextNotAnswer() {
      if (this.examStats.notAnsweredArr.length) {
        var index = this.examStats.notAnsweredArr.findIndex(
          (x) => x === this.examStats.nextNotAnswer
        );
        if (index + 1 === this.examStats.notAnsweredArr.length)
          this.examStats.nextNotAnswer = this.examStats.notAnsweredArr[0];
        else
          this.examStats.nextNotAnswer =
            this.examStats.notAnsweredArr[index + 1];
      }
      this.updateLocalStorage();
    },

    eraseTest(question_id) {
      this.$delete(this.examStats.answerData, question_id);
      this.examStats.notAnsweredArr.push(question_id);
      this.updateLocalStorage();
    },
    //
    updateNotAnswerData(item_id) {
      var index = this.examStats.notAnsweredArr.findIndex((x) => x == item_id);
      if (index !== -1) this.examStats.notAnsweredArr.splice(index, 1);
    },
  },
};
</script>

<style scoped>
#participating-exam-header {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 5;
}

.bookmark-target {
  padding-top: 80px;
  margin-top: -80px;
}
</style>
