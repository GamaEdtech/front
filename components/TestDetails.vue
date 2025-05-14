<template>
  <div id="test-details">
    <!-- Start : Flying Coin -->
    <div class="flying-coin-div" v-show="showingCoin" ref="coinElement">
      <div class="inner-coin-div">
        <span class="text-coin">1</span>
      </div>
    </div>
    <!-- End : Flying Coin -->


    <!--  Start: detail  -->
    <section>
      <v-container class="py-0 relation-position">
        <!-- Start : Box Showing Balance -->
        <div class="box-showing-balance" v-show="showBoxBalance" ref="boxShowingBalance">


          <span class="title-balance">$GEM : </span>
          <span class="amount-balance" ref="amountBalance">{{ Number(balance).toFixed(8) }}</span>
        </div>
        <!-- End : Box Showing Balance -->
        <div class="detail mt-md-4">
          <v-row>
            <v-col cols="12" md="12" class="pt-lg-0">
              <div class="label-holder" v-show="this.$route.name == 'test-id'">
                <v-chip v-if="contentData.topic"
                  :to="`/search?type=azmoon&section=${contentData.section}&base=${contentData.base}&lesson=${contentData.lesson}&topic=${contentData.topic}`"
                  class="ma-1 blue-grey darken-1 white--text" small>
                  {{ contentData.topic_title }}
                </v-chip>
                <v-chip
                  :to="`/search?type=azmoon&section=${contentData.section}&base=${contentData.base}&lesson=${contentData.lesson}`"
                  class="ma-1 blue-grey darken-1 white--text" small>
                  {{ contentData.lesson_title }}
                </v-chip>
                <v-chip :to="`/search?type=azmoon&section=${contentData.section}&base=${contentData.base}`" link
                  class="mr-1 blue-grey darken-1 white--text" small>
                  {{ contentData.base_title }}
                </v-chip>
                <v-chip :to="`/search?type=azmoon&section=${contentData.section}`" link
                  class="mr-1 blue-grey darken-1 white--text" small>
                  {{ contentData.section_title }}
                </v-chip>
                <v-chip v-if="contentData.tutorial_id" :to="`/tutorial/${contentData.tutorial_id}`" link outlined
                  class="mr-1 blue-grey darken-1" small>
                  Tutorial
                </v-chip>
              </div>
              <!--  Description   -->
              <div class="d-flex mb-4">
                <div class="w-100">
                  <div class="description-holder my-4">
                    <v-col class="test-list pt-0" cols="12">
                      <div id="test-question" class="text-h4" ref="test-question" v-html="contentData.question" />
                      <img v-show="contentData.q_file && contentData.q_file != '0'" class="answer-img"
                        :src="contentData.q_file" />

                      <v-radio-group v-model="selectedOption" @change="fireSelectedOption" hide-details v-if="
                        contentData.type == 'fourchoice' ||
                        contentData.type == 'twochoice' ||
                        contentData.type == 'tf'
                      ">
                        <v-radio value="1" class="answer" :class="{
                          'true-answer': isCorrectAnswer(1),
                          'false-answer': isIncorrectAnswer(1),
                        }">
                          <template slot="label">
                            <div ref="choise1" class="answer">
                              <p>
                                <v-icon v-show="isCorrectAnswer(1)" color="success"
                                  class="mr-2">mdi-check-circle</v-icon>
                                <v-btn icon v-show="!isCorrectAnswer(1)" class="option-icon subtitle-1 mr-2"
                                  small>A</v-btn>
                                <span ref="mathJaxEl" v-html="contentData.answer_a"></span>
                              </p>
                              <img v-show="contentData.a_file" class="answer-img" :src="contentData.a_file" />
                            </div>
                          </template>
                        </v-radio>
                        <v-radio value="2" class="answer" :class="{
                          'true-answer': isCorrectAnswer(2),
                          'false-answer': isIncorrectAnswer(2),
                        }">
                          <template slot="label">
                            <div ref="choise2" class="answer">
                              <v-icon v-show="isCorrectAnswer(2)" color="success" class="mr-2">mdi-check-circle</v-icon>
                              <v-btn v-show="!isCorrectAnswer(2)" icon class="option-icon subtitle-1 mr-2"
                                small>B</v-btn>
                              <span ref="mathJaxEl" v-html="contentData.answer_b"></span>
                              <img v-show="contentData.b_file" :src="contentData.b_file" class="answer-img" />
                            </div>
                          </template>
                        </v-radio>
                        <v-radio value="3" v-if="contentData.type == 'fourchoice'" class="answer" :class="{
                          'true-answer': isCorrectAnswer(3),
                          'false-answer': isIncorrectAnswer(3),
                        }">
                          <template slot="label">
                            <div ref="choise3" class="answer">
                              <v-icon v-show="isCorrectAnswer(3)" color="success" class="mr-2">mdi-check-circle</v-icon>
                              <v-btn icon v-show="!isCorrectAnswer(4)" class="option-icon subtitle-1 mr-2"
                                small>C</v-btn>
                              <span ref="mathJaxEl" v-html="contentData.answer_c"></span>
                              <img v-show="contentData.c_file" class="answer-img" :src="contentData.c_file" />
                            </div>
                          </template>
                        </v-radio>
                        <v-radio value="4" v-if="contentData.type == 'fourchoice'" class="answer" :class="{
                          'true-answer': isCorrectAnswer(4),
                          'false-answer': isIncorrectAnswer(4),
                        }">
                          <template slot="label">
                            <div ref="choise4" class="answer">
                              <v-icon v-show="isCorrectAnswer(4)" color="success" class="mr-2">mdi-check-circle</v-icon>
                              <v-btn icon v-show="!isCorrectAnswer(4)" class="option-icon subtitle-1 mr-2"
                                small>D</v-btn>
                              <span ref="mathJaxEl" v-html="contentData.answer_d" />

                              <img v-show="contentData.d_file" class="answer-img" :src="contentData.d_file" />
                            </div>
                          </template>
                        </v-radio>
                      </v-radio-group>

                      <!--Answer section-->
                      <!-- <v-expansion-panels
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
                      </v-expansion-panels> -->
                      <!--End answer section-->

                      <!-- <v-row class="mt-3">
                        <v-col cols="10">
                          <v-btn icon @click="openCrashReportDialog">
                            <v-icon color="blue"> mdi-bullhorn-outline </v-icon>
                          </v-btn>
                        </v-col>
                      </v-row> -->
                    </v-col>
                  </div>

                  <!--Helpful link-->
                  <div class="justify-center text-center">
                    <v-btn @click="loadNextTest()" :loading="nextTestLoading"
                      class="next-test mx-auto text-transform-none">
                      {{
                        this.$route.name == "test-id"
                          ? "Try the Next One"
                          : "Time to Test!"
                      }}
                      <v-icon>mdi-skip-next-outline</v-icon>
                    </v-btn>
                  </div>

                  <!-- @click="loadNext(/test/${Number($route.params.id) + 1})" -->
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
import CrashReport from "~/components/common/crash-report.vue";

export default {
  name: "test-details",
  props: {
    contentData: {
      type: Object,
      default: {},
    },
  },
  components: {
    CrashReport,
  },

  mounted() {
    document.title = this.$refs["test-question"].innerText;
    setTimeout(() => {
      this.renderMathJax();
    }, 2000);
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
    nextTestLoading: false,
    showingCoin: false,
    balance: "0.0000001",
    showBoxBalance: true,
    isAnswerToQuestion: false
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
    animationMovingCoin(selectedElement, coinElement, destinationElement) {
      const start = selectedElement.getBoundingClientRect();
      const end = destinationElement.getBoundingClientRect();

      coinElement.style.top = `${start.top}px`;
      coinElement.style.left = `${start.left}px`;

      const signDisplacementForSizeCoinElement = window.innerWidth < 1264 ? -1 : 1
      const dx = end.left - start.left - 5 * signDisplacementForSizeCoinElement;
      const dy = end.top - start.top - 5 * signDisplacementForSizeCoinElement;

      coinElement.style.setProperty('--dx', `${dx}px`);
      coinElement.style.setProperty('--dy', `${dy}px`);

      coinElement.classList.remove('animate', 'fade-out');
      coinElement.classList.add('animate');
    },
    animationFadeOutCoin(coinElement, destinationElement) {
      const end = destinationElement.getBoundingClientRect();
      const signDisplacementForSizeCoinElement = window.innerWidth < 1264 ? -1 : 1
      setTimeout(() => {
        coinElement.style.top = `${end.top - 5 * signDisplacementForSizeCoinElement}px`;
        coinElement.style.left = `${end.left - 5 * signDisplacementForSizeCoinElement}px`;
        coinElement.classList.remove('animate');
        coinElement.classList.add('fade-out');
      }, 3000);
    },
    animationFadeInBoxBalance(boxShowingBalanceElement, nameAnimation) {
      setTimeout(() => {
        this.showingCoin = false;
        this.showBoxBalance = true;
        boxShowingBalanceElement.classList.add(nameAnimation);
      }, 4000);
    },
    // incresing balanceChangeDirection  = 1, decreasing balanceChangeDirection  = -1
    animationCountingBalance(amountBalanceElement, balanceChangeDirection) {
      setTimeout(() => {
        const startValue = Number(this.balance);
        const displacementAmount = 0.0000004;
        const endValue = parseFloat((startValue + displacementAmount * balanceChangeDirection).toFixed(8));
        const duration = 1000;
        const stepTime = 30;
        let current = startValue;
        const steps = Math.ceil(duration / stepTime);
        const amountStep = Math.abs(endValue - startValue) / steps;
        amountBalanceElement.classList.add("pulsing", balanceChangeDirection == 1 ? "increasing" : "decreasing");


        const counter = setInterval(() => {
          current = current + balanceChangeDirection * amountStep;
          if (current >= endValue && balanceChangeDirection == 1) {
            current = endValue;
            clearInterval(counter);
          }

          if (current <= endValue && balanceChangeDirection == -1) {
            current = endValue;
            clearInterval(counter);
          }

          this.balance = parseFloat(current.toFixed(8));
        }, stepTime);
      }, 4600);
    },
    animationFadeOutBoxBalance(amountBalanceElement, boxShowingBalanceElement) {
      setTimeout(() => {
        amountBalanceElement.classList.remove("pulsing", "decreasing", "increasing");
        boxShowingBalanceElement.classList.remove("animate-in", "animate-in-error");
        boxShowingBalanceElement.classList.add("animate-out");
      }, 7000);

      setTimeout(() => {
        boxShowingBalanceElement.classList.remove("animate-out");
        this.showBoxBalance = false
      }, 7500);
    },


    fireSelectedOption() {

      const selectedElement = this.$refs[`choise${this.selectedOption}`];
      const coinElement = this.$refs.coinElement;
      const destinationElement = document.querySelector(window.innerWidth < 1264 ? ".wallet-mobile" : ".wallet-div");
      const boxShowingBalanceElement = this.$refs.boxShowingBalance
      const amountBalanceElement = this.$refs.amountBalance
      if (this.selectedOption === this.contentData.true_answer && !this.isAnswerToQuestion) {
        this.showingCoin = true
        this.animationMovingCoin(selectedElement, coinElement, destinationElement)
        this.animationFadeOutCoin(coinElement, destinationElement)
        this.animationFadeInBoxBalance(boxShowingBalanceElement, "animate-in")
        this.animationCountingBalance(amountBalanceElement, 1)
        this.animationFadeOutBoxBalance(amountBalanceElement, boxShowingBalanceElement)
      }
      if (this.selectedOption !== this.contentData.true_answer && !this.isAnswerToQuestion) {
        this.showingCoin = true
        this.animationMovingCoin(destinationElement, coinElement, selectedElement)
        this.animationFadeOutCoin(coinElement, selectedElement)
        this.animationFadeInBoxBalance(boxShowingBalanceElement, "animate-in-error")
        this.animationCountingBalance(amountBalanceElement, -1)
        this.animationFadeOutBoxBalance(amountBalanceElement, boxShowingBalanceElement)
      }


      this.isAnswerToQuestion = true
      this.fullAnswer = 0;
    },
    loadNextTest() {
      this.nextTestLoading = true;
      this.$axios
        .$get(
          `/api/v1/examTests/random?lesson=${this.contentData.lesson}&topic=${this.contentData.topic}`
        )
        .then((response) => {
          if (response.data.code)
            this.$router.push(`/test/${response.data.code}`);
        })
        .catch((err) => {
          // console.log(err);
          this.nextTestLoading = false;
        });
    },
  },
};
</script>

<style>
#test-details {
  .v-input--selection-controls__input {
    display: none;
  }

  .option-icon {
    border: 1px solid #e0e0e0;
  }

  .next-test.v-btn {
    height: 3.6rem;
    padding: 0rem 1.6rem;
    border-radius: 3rem;
    background: #ffb600;

    .v-btn__content {
      color: #24292f;
      font-size: 1.4rem;
      font-style: normal;
      font-weight: 600;
    }
  }
}

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

.answer {
  padding: 0.3rem 0.2rem 0.2rem 0.2rem;
}

.true-answer {
  border: 1px solid #4caf50;
  /* Green background color */
  color: white !important;
  /* White text color */
  border-radius: 10px;
}

.false-answer {
  border: 1px solid #f44336;
  /* Red background color */
  color: white !important;
  /* White text color */
  border-radius: 10px;
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



/* flying coin */
.flying-coin-div {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 4px solid #c99001;
  background-color: #fede2f;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1005;
}

.inner-coin-div {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #c48e00;
  background-color: #e2a900;
  display: flex;
  align-items: center;
  justify-content: center;
}

.text-coin {
  font-size: 36px;
  font-weight: bold;
  color: #fede2f;
  text-shadow: 3px 2px 0px #c99001;
}

@keyframes fly-to-wallet {
  0% {
    transform: translate(0, 0) scale(1) rotate(0deg);
  }

  100% {
    transform: translate(var(--dx), var(--dy)) scale(0.5) rotate(1440deg);
  }
}

@keyframes coin-glow {

  0%,
  100% {
    box-shadow: 0 0 0px #fede2f;
  }

  50% {
    box-shadow: 0 0 20px #fff94a, 0 0 30px #ffd700;
  }
}

@keyframes scale-and-fade-out {
  0% {
    transform: scale(0.5);
    opacity: 1;
  }

  100% {
    transform: scale(0);
    opacity: 0;
  }
}

.flying-coin-div.fade-out {
  animation: scale-and-fade-out 1s ease-out forwards;
}

.flying-coin-div.animate {
  animation: fly-to-wallet 3s ease-in-out forwards, coin-glow 0.5s ease-in-out infinite;
}


/* Box Showing Balance */
@keyframes show-balance-box {
  0% {
    transform: translateY(-20px);
    opacity: 0;
  }

  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes animateOut {
  0% {
    transform: translateY(0);
    opacity: 1;
  }

  100% {
    transform: translateY(-50px);
    opacity: 0;
  }
}


.box-showing-balance {
  padding: 10px 20px;
  border: 2px solid #ffb600;
  border-radius: 10px;
  position: absolute;
  right: 60px;
  top: -10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  column-gap: 20px;
  opacity: 0;
  transform: translateY(-20px);
  transition: border 0.5s ease;
  z-index: 3;
  max-width: 300px;
}

.box-showing-balance.animate-in {
  animation: show-balance-box 0.6s ease-out forwards;
  border: 2px solid green;
  background-color: rgb(197 248 197 / 76%);
}

.box-showing-balance.animate-out {
  animation: animateOut 0.5s ease forwards;
}

.box-showing-balance.animate-in-error {
  animation: show-balance-box 0.6s ease-out forwards;
  border: 2px solid red;
  background-color: rgba(255, 199, 199, 0.76);
}


.title-balance {
  font-size: 18px;
  font-weight: bold;
  color: black;
}

.amount-balance {
  font-size: 20px;
  font-weight: 700;
  color: black;
}

.amount-balance.increasing {
  color: green;
}

.amount-balance.decreasing {
  color: red;
}

@keyframes pulse-scale {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}

.amount-balance.pulsing {
  animation: pulse-scale 0.3s ease-in-out infinite;
}

.relation-position {
  position: relative;
}

@media (max-width: 1264px) {
  .flying-coin-div {
    width: 40px;
    height: 40px;
  }

  .inner-coin-div {
    width: 20px;
    height: 20px;
  }

  .text-coin {
    font-size: 18px;
  }

  .box-showing-balance {
    right: 20px;
    top: 20px;
  }
}
</style>
