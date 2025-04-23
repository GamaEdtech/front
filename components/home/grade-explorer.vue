<template>
  <v-container id="content-stats-container">
    <v-card flat>
      <v-card-text>
        <v-row>
          <v-col cols="2" sm="2" class="px-0">
            <v-sheet
              v-if="stats.length <= 16"
              class="text-right"
              id="stats-handler"
              ref="statsHandler"
            >
              <div
                v-for="(item, index) in stats"
                :key="index"
                @touchstart="handleTouchStart(index)"
                @touchend="handleTouchEnd(index)"
                @touchmove="handleTouchMove"
                @mousemove="handleMouseMove"
                @mousedown="handleMouseDown(index)"
                @mouseup="handleMouseUp(index)"
                :ref="`handler${index}`"
              >
                <v-btn
                  @click="handleBtnClick(index)"
                  class="my-0 white--text grade-btn"
                  :class="[
                    index == 7 ? 'rounded-pill active' : 'rounded-s-xl',
                    currentIndex == index ? 'handlerShadow' : '',
                  ]"
                  v-if="shouldDisplayButton(index)"
                  :color="gradeColors[index]"
                  :style="`font-weight:600;font-size:${gradeSizes[index].fontSize}px;width:${gradeSizes[index].width}px!important;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             min-width:${gradeSizes[index].width}px!important;height:${gradeSizes[index].height}px`"
                >
                  {{
                    truncateGradeTitle(
                      gradeHandlerTitle(item.base_title),
                      index
                    )
                  }}
                </v-btn>
                <div
                  v-if="index == 7"
                  :style="`font-size:${gradeSizes[index].fontSize}px;height:${gradeSizes[index].height}px;width:${gradeSizes[index].width}px`"
                />
              </div>
            </v-sheet>
          </v-col>
          <v-col cols="10" sm="10" class="pl-0">
            <v-card id="grade-details-card">
              <div>
                <v-row class="stats-details d-none d-md-flex">
                  <v-col md="6" class="pb-0 pb-sm-6">
                    <nuxt-link
                      :to="`/search?type=test&section=${stats[7].section}&base=${stats[7].base}`"
                      class="label"
                    >
                      <span class="stat-icon icon-paper"></span>
                      Past Papers

                      <v-icon class="stat-arrow" size="20" color="#D0D7DE"
                        >mdi-chevron-right</v-icon
                      >
                    </nuxt-link>
                    <div class="stat">+{{ stats[7].tests | numberFormat }}</div>
                  </v-col>
                  <v-col md="6" class="pb-0 pb-sm-6">
                    <nuxt-link
                      :to="`/search?type=learnfiles&section=${stats[7].section}&base=${stats[7].base}`"
                      class="label"
                    >
                      <span class="stat-icon icon-multimedia"></span>
                      Multimedia
                      <v-icon class="stat-arrow" size="20" color="#D0D7DE"
                        >mdi-chevron-right</v-icon
                      >
                    </nuxt-link>
                    <div class="stat">+{{ stats[7].files | numberFormat }}</div>
                  </v-col>
                  <v-col md="6" class="pb-0 pb-sm-6">
                    <nuxt-link
                      :to="`/search?type=azmoon&section=${stats[7].section}&base=${stats[7].base}`"
                      class="label"
                    >
                      <span class="stat-icon icon-exam"></span>
                      QuizHub
                      <v-icon class="stat-arrow" size="20" color="#D0D7DE"
                        >mdi-chevron-right</v-icon
                      >
                    </nuxt-link>
                    <div class="stat">+{{ stats[7].exams | numberFormat }}</div>
                  </v-col>
                  <v-col md="6" class="pb-0 pb-sm-6">
                    <nuxt-link
                      :to="`/search?type=question&section=${stats[7].section}&base=${stats[7].base}`"
                      class="label"
                    >
                      <span class="stat-icon icon-q-a"></span>
                      Forum
                      <v-icon class="stat-arrow" size="20" color="#D0D7DE"
                        >mdi-chevron-right</v-icon
                      >
                    </nuxt-link>
                    <div class="stat">
                      +{{ stats[7].questions | numberFormat }}
                    </div>
                  </v-col>
                </v-row>

                <v-row class="stats-details d-flex d-md-none">
                  <v-col cols="12">
                    <v-row>
                      <v-col cols="7" class="py-0">
                        <nuxt-link
                          :to="`/search?type=test&section=${stats[7].section}&base=${stats[7].base}`"
                          class="label"
                        >
                          <span class="stat-icon icon-paper"></span>
                          Past Papers
                        </nuxt-link>
                        <div class="date-holder">{{ showDate() }}</div>
                      </v-col>
                      <v-col cols="5" class="text-right pt-0">
                        <span class="stat"
                          >+{{ stats[7].tests | numberFormat }}</span
                        >
                        <v-icon size="20" class="pl-sm-4" color="#D0D7DE"
                          >mdi-chevron-right</v-icon
                        >
                      </v-col>
                      <v-col cols="12" class="pt-0">
                        <v-divider />
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="7" class="py-0">
                        <nuxt-link
                          :to="`/search?type=learnfiles&section=${stats[7].section}&base=${stats[7].base}`"
                          class="label"
                        >
                          <span class="stat-icon icon-multimedia"></span>
                          Multimedia
                        </nuxt-link>
                        <div class="date-holder pb-0">{{ showDate() }}</div>
                      </v-col>
                      <v-col cols="5" class="text-right pt-0">
                        <span class="stat"
                          >+{{ stats[7].files | numberFormat }}</span
                        >
                        <v-icon size="20" class="pl-sm-4" color="#D0D7DE"
                          >mdi-chevron-right</v-icon
                        >
                      </v-col>
                      <v-col cols="12" class="pt-0">
                        <v-divider />
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="7" class="py-0">
                        <nuxt-link
                          :to="`/search?type=azmoon&section=${stats[7].section}&base=${stats[7].base}`"
                          class="label"
                        >
                          <span class="stat-icon icon-exam"></span>
                          QuizHub
                        </nuxt-link>
                        <div class="date-holder pb-0">{{ showDate() }}</div>
                      </v-col>
                      <v-col cols="5" class="text-right pt-0">
                        <span class="stat"
                          >+{{ stats[7].exams | numberFormat }}</span
                        >
                        <v-icon size="20" class="pl-sm-4" color="#D0D7DE"
                          >mdi-chevron-right</v-icon
                        >
                      </v-col>
                      <v-col cols="12" class="pt-0">
                        <v-divider />
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col cols="7" class="py-0">
                        <nuxt-link
                          :to="`/search?type=question&section=${stats[7].section}&base=${stats[7].base}`"
                          class="label"
                        >
                          <span class="stat-icon icon-q-a"></span>
                          Forum
                        </nuxt-link>
                        <div class="date-holder">{{ showDate() }}</div>
                      </v-col>
                      <v-col cols="5" class="text-right pt-0">
                        <span class="stat"
                          >+{{ stats[7].questions | numberFormat }}</span
                        >
                        <v-icon size="20" class="pl-sm-4" color="#D0D7DE"
                          >mdi-chevron-right</v-icon
                        >
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </div>

              <v-divider
                class="d-none d-md-block"
                style="margin-top: 94px; margin-bottom: 1.2rem"
              />

              <div class="d-none d-md-block">
                <v-row>
                  <v-col cols="6" md="6">
                    <h4 class="section-title gama-text-h5">Newest Questions</h4>
                    <div v-if="questionLoading">
                      <v-row class="latest-card" v-for="i in 3" :key="i">
                        <v-col cols="12">
                          <v-skeleton-loader
                            type="list-item-avatar"
                          ></v-skeleton-loader>
                        </v-col>
                      </v-row>
                    </div>
                    <v-card
                      class="latest-card"
                      v-else
                      flat
                      v-for="item in questions.slice(0, 3)"
                      :key="item.id"
                    >
                      <v-row>
                        <v-col cols="1">
                          <v-avatar class="my-3" size="32" rounded="0">
                            <v-img :src="item.avatar"></v-img>
                          </v-avatar>
                        </v-col>
                        <v-col cols="11">
                          <v-card-title>
                            <nuxt-link
                              class="gama-text-caption"
                              :to="`/qa/${item.id}`"
                            >
                              <span v-html="item.title"></span>
                            </nuxt-link>
                          </v-card-title>

                          <v-card-subtitle>
                            <v-row>
                              <v-col
                                cols="8"
                                class="owner-container gama-text-overline"
                              >
                                By:
                                {{
                                  getFullName(item.first_name, item.last_name)
                                }}
                              </v-col>
                              <v-col
                                cols="4"
                                class="subdate-container gama-text-overline"
                              >
                                <v-icon size="12">mdi-calendar</v-icon>
                                {{ $moment(item.subdate).format("MMM DD") }}
                              </v-col>
                            </v-row>
                          </v-card-subtitle>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-col>
                  <v-col cols="6" md="6">
                    <h4 class="section-title gama-text-h5">
                      Newest Past Papers & Resources
                    </h4>
                    <div v-if="paperLoading">
                      <v-row class="latest-card" v-for="i in 3" :key="i">
                        <v-col cols="12">
                          <v-skeleton-loader
                            type="list-item-avatar"
                          ></v-skeleton-loader>
                        </v-col>
                      </v-row>
                    </div>
                    <v-card
                      v-else
                      class="latest-card"
                      flat
                      v-for="item in papers.slice(0, 3)"
                      :key="item.id"
                    >
                      <v-row>
                        <v-col cols="1">
                          <v-avatar class="my-3" size="32" rounded="0">
                            <v-img :src="item.avatar"></v-img>
                          </v-avatar>
                        </v-col>
                        <v-col cols="11">
                          <v-card-title>
                            <nuxt-link
                              class="gama-text-caption"
                              :to="`paper/${item.id}`"
                            >
                              <span v-html="item.title"></span>
                            </nuxt-link>
                          </v-card-title>

                          <v-card-subtitle>
                            <v-row>
                              <v-col
                                cols="8"
                                class="owner-container gama-text-overline"
                              >
                                By:
                                {{
                                  getFullName(item.first_name, item.last_name)
                                }}
                              </v-col>
                              <v-col
                                cols="4"
                                class="subdate-container gama-text-overline"
                              >
                                <v-icon size="12">mdi-calendar</v-icon>
                                {{ $moment(item.subdate).format("MMM DD") }}
                              </v-col>
                            </v-row>
                          </v-card-subtitle>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-col>
                </v-row>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "grade-explorer-component",
  props: {
    stats: {
      default: [],
    },
  },
  data() {
    return {
      statsSlideVal: 6,
      gradeColors: [
        "#FF6498",
        "#FD7DD2",
        "#FF4DFF",
        "#C24DFF",
        "#8649FF",
        "#4C4AFF",
        "#4A87FF",
        "#4AC2FF",
        "#42EDEE",
        "#49F182",
        "#43E343",
        "#76E43D",
        "#E9E90A",
        "#EEB23A",
        "#F8864B",
        "#FC4F4E",
      ],

      gradeSizesXs: [
        {
          width: 32,
          height: 32,
          fontSize: 10,
        },
        {
          width: 32,
          height: 32,
          fontSize: 10,
        },
        {
          width: 41,
          height: 20,
          fontSize: 10,
        },
        {
          width: 46,
          height: 23,
          fontSize: 12,
        },

        {
          width: 50,
          height: 25,
          fontSize: 14,
        },
        {
          width: 55,
          height: 31,
          fontSize: 16,
        },
        {
          width: 60,
          height: 34,
          fontSize: 22,
        },
        {
          width: 101,
          height: 46,
          fontSize: 22,
        },
        {
          width: 64,
          height: 38,
          fontSize: 20,
        },
        {
          width: 60,
          height: 34,
          fontSize: 18,
        },
        {
          width: 55,
          height: 32,
          fontSize: 16,
        },
        {
          width: 50,
          height: 25,
          fontSize: 14,
        },
        {
          width: 46,
          height: 23,
          fontSize: 12,
        },
        {
          width: 41,
          height: 19,
          fontSize: 10,
        },
        {
          width: 52,
          height: 18,
          fontSize: 8,
        },
        {
          width: 52,
          height: 18,
          fontSize: 8,
        },
      ],
      gradeSizesSm: [
        {
          width: 35,
          height: 17,
          fontSize: 8,
        },
        {
          width: 35,
          height: 17,
          fontSize: 8,
        },
        {
          width: 40,
          height: 19,
          fontSize: 10,
        },
        {
          width: 44,
          height: 22,
          fontSize: 12,
        },
        {
          width: 49,
          height: 26,
          fontSize: 14,
        },
        {
          width: 54,
          height: 30,
          fontSize: 16,
        },
        {
          width: 59,
          height: 33,
          fontSize: 18,
        },
        {
          width: 107,
          height: 46,
          fontSize: 22,
        },
        {
          width: 62,
          height: 37,
          fontSize: 20,
        },
        {
          width: 59,
          height: 33,
          fontSize: 18,
        },
        {
          width: 54,
          height: 31,
          fontSize: 16,
        },
        {
          width: 49,
          height: 26,
          fontSize: 14,
        },
        {
          width: 44,
          height: 22,
          fontSize: 12,
        },
        {
          width: 40,
          height: 18,
          fontSize: 10,
        },
        {
          width: 35,
          height: 17,
          fontSize: 8,
        },
        {
          width: 52,
          height: 18,
          fontSize: 8,
        },
      ],
      gradeSizesMd: [
        {
          width: 70,
          height: 18.04,
          fontSize: 8,
        },
        {
          width: 80,
          height: 22.55,
          fontSize: 10,
        },
        {
          width: 90,
          height: 27.06,
          fontSize: 12,
        },
        {
          width: 100,
          height: 31.57,
          fontSize: 14,
        },
        {
          width: 110,
          height: 36.08,
          fontSize: 16,
        },
        {
          width: 120,
          height: 42.845,
          fontSize: 18,
        },
        {
          width: 130,
          height: 47.355,
          fontSize: 20,
        },
        {
          width: 180,
          height: 64,
          fontSize: 24,
        },
        {
          width: 140,
          height: 51.865,
          fontSize: 22,
        },
        {
          width: 130,
          height: 47.355,
          fontSize: 20,
        },
        {
          width: 120,
          height: 42.845,
          fontSize: 18,
        },
        {
          width: 110,
          height: 36.08,
          fontSize: 16,
        },
        {
          width: 100,
          height: 31.57,
          fontSize: 16,
        },
        {
          width: 90,
          height: 27.06,
          fontSize: 12,
        },
        {
          width: 80,
          height: 22.55,
          fontSize: 10,
        },
        {
          width: 70,
          height: 18.04,
          fontSize: 8,
        },
      ],
      gradeSizesLg: [
        {
          width: 60,
          height: 28,
          fontSize: 10,
        },
        {
          width: 68,
          height: 38,
          fontSize: 12,
        },
        {
          width: 76,
          height: 48,
          fontSize: 14,
        },
        {
          width: 84,
          height: 56.6,
          fontSize: 16,
        },
        {
          width: 92,
          height: 66,
          fontSize: 18,
        },
        {
          width: 161,
          height: 75,
          fontSize: 28,
        },
        {
          width: 92,
          height: 66,
          fontSize: 18,
        },
        {
          width: 84,
          height: 56.6,
          fontSize: 16,
        },
        {
          width: 76,
          height: 48,
          fontSize: 14,
        },
        {
          width: 68,
          height: 38,
          fontSize: 12,
        },
        {
          width: 60,
          height: 28,
          fontSize: 10,
        },
        {
          width: 52,
          height: 18,
          fontSize: 8,
        },
        {
          width: 52,
          height: 18,
          fontSize: 8,
        },
        {
          width: 52,
          height: 18,
          fontSize: 8,
        },
        {
          width: 52,
          height: 18,
          fontSize: 8,
        },
        {
          width: 52,
          height: 18,
          fontSize: 8,
        },
        {
          width: 52,
          height: 18,
          fontSize: 8,
        },
      ],
      gradeSizesXl: [
        {
          width: 60,
          height: 28,
          fontSize: 10,
        },
        {
          width: 68,
          height: 38,
          fontSize: 12,
        },
        {
          width: 76,
          height: 48,
          fontSize: 14,
        },
        {
          width: 84,
          height: 56.6,
          fontSize: 16,
        },
        {
          width: 92,
          height: 66,
          fontSize: 18,
        },
        {
          width: 161,
          height: 75,
          fontSize: 28,
        },
        {
          width: 92,
          height: 66,
          fontSize: 18,
        },
        {
          width: 84,
          height: 56.6,
          fontSize: 16,
        },
        {
          width: 76,
          height: 48,
          fontSize: 14,
        },
        {
          width: 68,
          height: 38,
          fontSize: 12,
        },
        {
          width: 60,
          height: 28,
          fontSize: 10,
        },
        {
          width: 52,
          height: 18,
          fontSize: 8,
        },
        {
          width: 52,
          height: 18,
          fontSize: 8,
        },
        {
          width: 52,
          height: 18,
          fontSize: 8,
        },
        {
          width: 52,
          height: 18,
          fontSize: 8,
        },
        {
          width: 52,
          height: 18,
          fontSize: 8,
        },
        {
          width: 52,
          height: 18,
          fontSize: 8,
        },
      ],
      questions: [],
      questionLoading: true,
      papers: [],
      paperLoading: true,
      intervalId: null,

      startIndex: -1,
      currentIndex: -1,
      isMouseDown: false,
      easeSlide: "",
    };
  },
  methods: {
    showDate() {
      if (
        this.$moment(this.stats[7].last_update).format("MMM,DD YYYY") !==
        "Invalid date"
      )
        return this.$moment(this.stats[7].last_update).format("MMM,DD YYYY");
    },
    shouldDisplayButton(index) {
      // Determine whether to display the button based on screen size and specific indexes
      if (this.$vuetify.breakpoint.xs) return ![0, 1, 14, 15].includes(index);
      else if (this.$vuetify.breakpoint.sm) return ![0, 15].includes(index);
      else return true;
    },
    handleBtnClick(index) {
      this.stopInterval(); // Clear the interval using the interval ID

      const deltaIndex = 7 - index;
      if (deltaIndex > 0) {
        for (let i = 0; i < deltaIndex; i++) {
          setTimeout(() => {
            this.currentIndex = index + i + 1;
            var pop_color = this.gradeColors.pop();
            var pop_data = this.stats.pop();
            this.gradeColors.unshift(pop_color);
            this.stats.unshift(pop_data);
          }, 200 * i + 1);
        }
      } else if (deltaIndex < 0) {
        for (let i = 0; i > deltaIndex; i--) {
          setTimeout(() => {
            this.currentIndex = index + i - 1;
            var splice_color = this.gradeColors.splice(0, 1);

            var splice_data = this.stats.splice(0, 1);

            this.gradeColors.push(...splice_color);
            this.stats.push(...splice_data);
          }, 200 * Math.abs(i) + 1);
        }
      }
    },

    handleMouseDown(index) {
      this.isMouseDown = true;
      this.startIndex = index;
      // event.preventDefault();
      // this.stopInterval(); // Clear the interval using the interval ID
    },
    handleMouseUp(event) {
      this.isMouseDown = false;
      this.startIndex = -1;
      this.currentIndex = -1;
    },
    handleMouseMove(event) {
      if (this.isMouseDown) {
        this.stopInterval();
        event.preventDefault();

        // Get the touch coordinates
        const touchX = event.clientX;
        const touchY = event.clientY;

        // Loop through the buttons and check if the touch is over a button
        for (let index = 0; index < this.stats.length; index++) {
          const buttonRef = this.$refs[`handler${index}`][0];
          const rect = buttonRef.getBoundingClientRect();

          if (
            touchX >= rect.left &&
            touchX <= rect.right &&
            touchY >= rect.top &&
            touchY <= rect.bottom
          ) {
            this.currentIndex = index;

            // Set the index of the touched button
            if (index > this.startIndex) {
              var pop_color = this.gradeColors.pop();
              var pop_data = this.stats.pop();
              this.gradeColors.unshift(pop_color);
              this.stats.unshift(pop_data);
            } else if (index < this.startIndex) {
              var splice_color = this.gradeColors.splice(0, 1);

              var splice_data = this.stats.splice(0, 1);

              this.gradeColors.push(...splice_color);
              this.stats.push(...splice_data);
            }

            this.startIndex = index;
            return; // Stop checking once a button is found
          }
        }

        // Reset the touchIndex if the touch is not over any button
        this.startIndex = -1;
      }
    },

    handleTouchStart(index) {
      this.startIndex = index;
      // this.stopInterval(); // Clear the interval using the interval ID
      // this.touchStartY = event.touches[0].clientY;
    },

    handleTouchEnd(event) {
      this.startIndex = -1;
      this.currentIndex = -1;
      // this.touchStartY = 0;
    },

    handleTouchMove(event) {
      this.stopInterval();
      event.preventDefault();

      // Get the touch coordinates
      const touchX = event.touches[0].clientX;
      const touchY = event.touches[0].clientY;

      // Loop through the buttons and check if the touch is over a button
      for (let index = 0; index < this.stats.length; index++) {
        const buttonRef = this.$refs[`handler${index}`][0];
        const rect = buttonRef.getBoundingClientRect();

        if (
          touchX >= rect.left &&
          touchX <= rect.right &&
          touchY >= rect.top &&
          touchY <= rect.bottom
        ) {
          this.currentIndex = index;

          // Set the index of the touched button
          if (index > this.startIndex) {
            var pop_color = this.gradeColors.pop();
            var pop_data = this.stats.pop();
            this.gradeColors.unshift(pop_color);
            this.stats.unshift(pop_data);
          } else if (index < this.startIndex) {
            console.log(index);
            var splice_color = this.gradeColors.splice(0, 1);

            var splice_data = this.stats.splice(0, 1);

            this.gradeColors.push(...splice_color);
            this.stats.push(...splice_data);
          }

          this.startIndex = index;
          return; // Stop checking once a button is found
        }
      }

      // Reset the touchIndex if the touch is not over any button
      this.startIndex = -1;
    },

    handleAutoCycle() {
      this.intervalId = setInterval(() => {
        var splice_color = this.gradeColors.splice(0, 1);

        var splice_data = this.stats.splice(0, 1);

        this.gradeColors.push(...splice_color);
        this.stats.push(...splice_data);
      }, 6000);
    },

    stopInterval() {
      clearInterval(this.intervalId); // Clear the interval using the interval ID
    },

    async getQuestions() {
      await this.$axios
        .$get("/api/v1/home/questions")
        .then((res) => {
          this.questions = res.data;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.questionLoading = false;
        });
    },

    async getPapers() {
      await this.$axios
        .$get("/api/v1/home/tests")
        .then((res) => {
          this.papers = res.data;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.paperLoading = false;
        });
    },

    truncateGradeTitle(title, index) {
      var cutLength = 3;
      if (this.$vuetify.breakpoint.xs) cutLength = 3;
      else if (this.$vuetify.breakpoint.sm) cutLength = 3;
      else if (this.$vuetify.breakpoint.md) cutLength = 3;
      else cutLength = 9;
      if (index == 7) cutLength = cutLength + 2;
      return title.length > cutLength
        ? title.slice(0, cutLength) + "..."
        : title;
    },
    getFullName(firstName, lastName) {
      return `${firstName} ${lastName}`;
    },
    gradeHandlerTitle(title) {
      if (
        this.$vuetify.breakpoint.xs ||
        this.$vuetify.breakpoint.sm ||
        this.$vuetify.breakpoint.md
      )
        return title.replace(" Grade", "");
      else return title;
    },
  },
  computed: {
    gradeSizes() {
      if (this.$vuetify.breakpoint.xs) return this.gradeSizesXs;
      else if (this.$vuetify.breakpoint.sm) return this.gradeSizesSm;
      else return this.gradeSizesMd;
    },
  },

  mounted() {
    //this.handleAutoCycle();

    //tmp to shift until any group have content
    var splice_data = this.stats.splice(0, 5);
    this.stats.push(...splice_data);
    //end tmp

    this.getQuestions();
    this.getPapers();
  },
  beforeDestroy() {
    this.stopInterval(); // Stop the interval when the component is about to be unmounted
  },
};
</script>

<style>
#content-stats-container .v-btn {
  text-transform: unset !important;

  .v-btn__content {
    font-family: Inter !important;
    font-weight: 500 !important;
  }
}

#content-stats-container #stats-handler {
  position: relative;
}

#content-stats-container #stats-handler .active {
  position: absolute;
  right: -1.6rem;
  font-weight: 750;
  z-index: 2;
}

#content-stats-container #stats-handler .rounded-pill {
  border-radius: 10rem;
}

#content-stats-container #stats-handler .rounded-s-xl {
  border-radius: 10rem 0 0rem 10rem;
}

#content-stats-container #grade-details-card {
  height: 35rem;
  padding: 1.6rem;
  border-radius: 0rem 2rem 2rem 0rem;
}

#content-stats-container #grade-details-card .v-card__text {
  padding: 3rem !important;
}

#content-stats-container #grade-details-card .stats-details {
  height: 28.4rem;

  .row {
    height: 7.6rem;
  }
}

#content-stats-container #grade-details-card .label {
  text-decoration: none;
  color: #424a53;
  text-align: center;
  font-family: Inter;
  font-size: 1.4rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  position: relative;
  margin-left: 3.2rem;
}

#content-stats-container #grade-details-card .date-holder {
  margin-left: 2.4rem;
  color: #6e7781;
  font-size: 1.2rem;
  font-style: normal;
  font-weight: 300;
  line-height: 3.8rem;
}

#content-stats-container #grade-details-card .stat {
  color: #6e7781;
  font-size: 1.2rem;
  font-style: normal;
  font-weight: 300;
  line-height: 4.4rem;
}

#content-stats-container #grade-details-card .label .stat-icon {
  position: absolute;
  color: #ffb300 !important;
  left: -2.5rem;
  top: -0.2rem;
  font-size: 2rem;
}

#content-stats-container #grade-details-card .section-title {
  color: #6e7781;
  margin-bottom: 0.5rem;
  opacity: 0.5;
}

#content-stats-container #grade-details-card .latest-card .col {
  padding-top: 0.3rem;
}

#content-stats-container #grade-details-card .latest-card .gama-text-caption {
  color: #6e7781;
  text-decoration: none;
  overflow: hidden;
  white-space: nowrap;
  width: inherit;
  text-overflow: ellipsis;
}

#content-stats-container #grade-details-card .latest-card .v-img__img {
  border-radius: 10rem;
}

#content-stats-container {
  #grade-details-card {
    .latest-card {
      .v-card__subtitle {
        .owner-container {
          text-align: left;
          color: #afb8c1;
          padding-bottom: 0rem;
          padding-top: 0.8rem;
          width: inherit;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .subdate-container {
          text-align: right !important;
          color: #6e7781;
          margin-bottom: 0;
          padding-bottom: 0;
          padding-top: 0.8rem;
        }
      }

      .v-skeleton-loader__list-item-avatar {
        padding-left: 0;
        padding-right: 0;

        .v-skeleton-loader__avatar {
          width: 3.2rem;
          height: 3.2rem;
        }
      }
    }
  }
}

#content-stats-container .handlerShadow {
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px,
    rgba(0, 0, 0, 0.15) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px;
}

@media (min-width: 600px) {
  #content-stats-container {
    max-width: 90%;
  }

  #content-stats-container .v-btn {
    color: #fff;
    font-family: "Inter";
    font-size: 1.6rem;
    font-style: normal;
    font-weight: 500;
    line-height: 4.4rem;
  }

  #content-stats-container #stats-handler {
    top: 0;
  }

  #content-stats-container #stats-handler .active {
    right: -2rem;
  }

  #content-stats-container #grade-details-card {
    height: 37.6rem;
    width: 88.8%;
    padding: 2.5rem 3rem 3rem 3rem;
    border-radius: 0rem 2rem 2rem 0rem;
  }

  #content-stats-container #grade-details-card .stats-details {
    height: 28.4rem;

    .row {
      height: 7.6rem;

      .v-icon.primary--text {
        font-size: 2rem !important;
      }

      .label {
        color: #424a53;
        font-family: Inter;
        font-size: 1.4rem;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
      }

      .stat {
        color: #6e7781;
        font-size: 1.4rem;
        font-style: normal;
        font-weight: 300;
        line-height: 4.4rem;
      }

      .date-holder {
        margin-left: 3rem;
        color: #6e7781;
        font-size: 1.4rem;
        font-style: normal;
        font-weight: 300;
        line-height: 3.8rem;
      }

      .stat-icon {
        font-size: 2.4rem;
        left: -3rem;
      }
    }
  }

  #content-stats-container #grade-details-card .section-title {
    color: #6e7781;

    line-height: 4.4rem;
  }

  #content-stats-container #grade-details-card .latest-card {
    .v-card-title {
      .title {
        color: #6e7781;
        text-decoration: none;
        font-size: 1.2rem;
        font-style: normal;
        font-weight: 500;
        line-height: 2rem;
      }
    }

    .v-img__img {
      border-radius: 10rem;
    }

    .v-card-subtitle {
      .owner-container {
        text-align: left;
        color: #afb8c1;
      }

      .subdate-container {
        text-align: right !important;
        color: #6e7781;
      }
    }
  }
}

@media (min-width: 960px) {
  #content-stats-container {
    #stats-handler {
      top: 0;

      .active {
        right: -2.6rem;
      }
    }

    #grade-details-card {
      height: 56.6rem;
      padding: 5rem;
      border-radius: 0rem 2rem 2rem 0rem;

      .stats-details {
        height: 16rem;

        .label {
          color: #424a53;
          font-family: Inter;
          font-size: 1.8rem;
          font-style: normal;
          font-weight: 600;
          line-height: normal;
          position: relative;
          margin-left: 3.6rem;

          .stat-icon {
            position: absolute;
            left: -3.6rem;
            top: -0.5rem;
            font-size: 3.2rem;
          }
        }

        .date-holder {
          margin-left: 3rem;
          color: #6e7781;
          font-size: 1rem;
          font-style: normal;
          font-weight: 300;
          line-height: 4.4rem;
        }

        .stat {
          color: #6e7781;
          font-size: 1.4rem;
          font-style: normal;
          font-weight: 300;
          line-height: 4.4rem;
          margin-left: 3rem;
        }
      }
    }
  }
}
</style>
