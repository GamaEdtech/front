<template>
  <v-container id="content-stats-container">
    <v-card flat>
      <v-card-text>
        <v-row>
          <v-col cols="2" sm="2" class="px-0">
            <!-- Show loading spinner when grades are loading -->
            <v-sheet v-if="gradesLoading" class="text-center pa-3">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
              <div class="mt-2 caption">Loading grades...</div>
            </v-sheet>
            
            <!-- Show message if no grades are available -->
            <v-sheet v-else-if="localStats.length === 0" class="text-center pa-3">
              <v-icon color="warning">mdi-alert-circle-outline</v-icon>
              <div class="mt-2 caption">No grades available for this board.</div>
            </v-sheet>
            
            <!-- Show grades wheel if grades are available -->
            <v-sheet
              v-else-if="localStats.length <= 16"
              class="text-right"
              id="stats-handler"
              ref="statsHandler"
            >
              <div
                v-for="(item, index) in localStats"
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
              <!--Active Board Banner  -->
              <v-banner
                color="#e6f2fe"
                single-line
                height="40"
                max-height="40"
                style="
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  z-index: 100;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  margin-bottom: 16px;
                  border-bottom: 0px !important;
                "
                v-if="activeBoard"
              >
                <v-icon slot="icon" color="warning" size="20">
                  mdi-information-outline
                </v-icon>
                <div class="d-flex align-center">
                  <div class="gama-text-h6" style="color: #2e90fa">
                    {{ activeBoardName}}
                  </div>
                  <div class="gama-text-caption mx-2" style="color: #84caff; font-weight: 400;">
                    Board
                  </div>
                </div>
                <template v-slot:actions>
                  <v-btn color="primary" text @click="showBoardSelector">
                    <v-icon color="primary" size="20">mdi-chevron-down</v-icon>
                  </v-btn>
                </template>
              </v-banner>
              <!-- Active Board Banner End -->
              <div>
                <v-row class="stats-details d-none d-md-flex">
                  <v-col md="6" class="pb-0 pb-sm-6">
                    <nuxt-link
                      :to="generateCategoryLink('test')"
                      class="label"
                    >
                      <span class="stat-icon icon-paper"></span>
                      Past Papers
                      <v-icon class="stat-arrow" size="20" color="#D0D7DE">mdi-chevron-right</v-icon>
                    </nuxt-link>
                    <div class="stat" v-if="categoryCountsLoading">
                      <v-progress-circular size="16" width="2" indeterminate color="primary"></v-progress-circular>
                    </div>
                    <div class="stat" v-else>+{{ categoryCounts.tests | numberFormat }}</div>
                  </v-col>
                  <v-col md="6" class="pb-0 pb-sm-6">
                    <nuxt-link
                      :to="generateCategoryLink('learnfiles')"
                      class="label"
                    >
                      <span class="stat-icon icon-multimedia"></span>
                      Multimedia
                      <v-icon class="stat-arrow" size="20" color="#D0D7DE">mdi-chevron-right</v-icon>
                    </nuxt-link>
                    <div class="stat" v-if="categoryCountsLoading">
                      <v-progress-circular size="16" width="2" indeterminate color="primary"></v-progress-circular>
                    </div>
                    <div class="stat" v-else>+{{ categoryCounts.files | numberFormat }}</div>
                  </v-col>
                  <v-col md="6" class="pb-0 pb-sm-6">
                    <nuxt-link
                      :to="generateCategoryLink('azmoon')"
                      class="label"
                    >
                      <span class="stat-icon icon-exam"></span>
                      QuizHub
                      <v-icon class="stat-arrow" size="20" color="#D0D7DE">mdi-chevron-right</v-icon>
                    </nuxt-link>
                    <div class="stat" v-if="categoryCountsLoading">
                      <v-progress-circular size="16" width="2" indeterminate color="primary"></v-progress-circular>
                    </div>
                    <div class="stat" v-else>+{{ categoryCounts.exams | numberFormat }}</div>
                  </v-col>
                  <v-col md="6" class="pb-0 pb-sm-6">
                    <nuxt-link
                      :to="generateCategoryLink('question')"
                      class="label"
                    >
                      <span class="stat-icon icon-q-a"></span>
                      Forum
                      <v-icon class="stat-arrow" size="20" color="#D0D7DE">mdi-chevron-right</v-icon>
                    </nuxt-link>
                    <div class="stat" v-if="categoryCountsLoading">
                      <v-progress-circular size="16" width="2" indeterminate color="primary"></v-progress-circular>
                    </div>
                    <div class="stat" v-else>
                      +{{ categoryCounts.questions | numberFormat }}
                    </div>
                  </v-col>
                </v-row>

                <v-row class="stats-details d-flex d-md-none">
                  <v-col cols="12">
                    <v-row>
                      <v-col cols="7" class="py-0">
                        <nuxt-link
                          :to="generateCategoryLink('test')"
                          class="label"
                        >
                          <span class="stat-icon icon-paper"></span>
                          Past Papers
                        </nuxt-link>
                        <div class="date-holder">{{ showDate() }}</div>
                      </v-col>
                      <v-col cols="5" class="text-right pt-0">
                        <div class="stat" v-if="categoryCountsLoading">
                          <v-progress-circular size="16" width="2" indeterminate color="primary"></v-progress-circular>
                        </div>
                        <span class="stat" v-else>+{{ categoryCounts.tests | numberFormat }}</span>
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
                          :to="generateCategoryLink('learnfiles')"
                          class="label"
                        >
                          <span class="stat-icon icon-multimedia"></span>
                          Multimedia
                        </nuxt-link>
                        <div class="date-holder pb-0">{{ showDate() }}</div>
                      </v-col>
                      <v-col cols="5" class="text-right pt-0">
                        <div class="stat" v-if="categoryCountsLoading">
                          <v-progress-circular size="16" width="2" indeterminate color="primary"></v-progress-circular>
                        </div>
                        <span class="stat" v-else>+{{ categoryCounts.files | numberFormat }}</span>
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
                          :to="generateCategoryLink('azmoon')"
                          class="label"
                        >
                          <span class="stat-icon icon-exam"></span>
                          QuizHub
                        </nuxt-link>
                        <div class="date-holder pb-0">{{ showDate() }}</div>
                      </v-col>
                      <v-col cols="5" class="text-right pt-0">
                        <div class="stat" v-if="categoryCountsLoading">
                          <v-progress-circular size="16" width="2" indeterminate color="primary"></v-progress-circular>
                        </div>
                        <span class="stat" v-else>+{{ categoryCounts.exams | numberFormat }}</span>
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
                          :to="generateCategoryLink('question')"
                          class="label"
                        >
                          <span class="stat-icon icon-q-a"></span>
                          Forum
                        </nuxt-link>
                        <div class="date-holder">{{ showDate() }}</div>
                      </v-col>
                      <v-col cols="5" class="text-right pt-0">
                        <div class="stat" v-if="categoryCountsLoading">
                          <v-progress-circular size="16" width="2" indeterminate color="primary"></v-progress-circular>
                        </div>
                        <span class="stat" v-else>+{{ categoryCounts.questions | numberFormat }}</span>
                        <v-icon size="20" class="pl-sm-4" color="#D0D7DE"
                          >mdi-chevron-right</v-icon
                        >
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </div>
              <v-divider class="mt-12 mb-8" />

              <div class="d-none d-md-block">
                <v-row>
                  <v-col cols="6" md="6">
                    <h4 class="section-title gama-text-h5">Last questions</h4>
                    <div v-if="questionLoading">
                      <v-row class="latest-card" v-for="i in 3" :key="i">
                        <v-col cols="12">
                          <v-skeleton-loader
                            type="list-item-avatar"
                          ></v-skeleton-loader>
                        </v-col>
                      </v-row>
                    </div>
                    <template v-else>
                      <v-card
                        class="latest-card"
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
                    </template>
                  </v-col>
                  <v-col cols="6" md="6">
                    <h4 class="section-title gama-text-h5">
                      Last Uploaded File
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
                    <template v-else>
                      <v-card
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
                    </template>
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
      type: Array,
      default: () => [],
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
      activeBoard: null,
      activeBoardName: null,
      hasSelectedGrade: false,

      // Add new data properties for category counts
      categoryCounts: {
        tests: 0,
        files: 0,
        exams: 0,
        questions: 0
      },
      categoryCountsLoading: true,
      gradesLoading: false,
      // Local copy of stats for internal manipulation
      localStats: [],
    };
  },
  methods: {
    showDate() {
      try {
        if (
          this.localStats && 
          this.localStats.length > 7 && 
          this.localStats[7] && 
          this.localStats[7].last_update && 
          this.$moment(this.localStats[7].last_update).isValid() &&
          this.$moment(this.localStats[7].last_update).format("MMM,DD YYYY") !== "Invalid date"
        ) {
          return this.$moment(this.localStats[7].last_update).format("MMM,DD YYYY");
        } else {
          return "Recently updated";
        }
      } catch (error) {
        console.error('Error formatting date:', error);
        return "Recently updated";
      }
    },
    shouldDisplayButton(index) {
      // Determine whether to display the button based on screen size and specific indexes
      if (this.$vuetify.breakpoint.xs) return ![0, 1, 14, 15].includes(index);
      else if (this.$vuetify.breakpoint.sm) return ![0, 15].includes(index);
      else return true;
    },
    handleBtnClick(index) {
      this.stopInterval(); // Clear the interval using the interval ID

      // Mark that the user has explicitly selected a grade
      this.hasSelectedGrade = true;

      const deltaIndex = 7 - index;
      if (deltaIndex > 0) {
        for (let i = 0; i < deltaIndex; i++) {
          setTimeout(() => {
            this.currentIndex = index + i + 1;
            var pop_color = this.gradeColors.pop();
            var pop_data = this.localStats.pop();
            this.gradeColors.unshift(pop_color);
            this.localStats.unshift(pop_data);

            // Update URL after the last animation step
            if (i === deltaIndex - 1) {
              this.updateUrlWithSelectedGrade();
              // Ensure category counts are updated with the newly selected grade
              this.fetchCategoryCounts();
            }
          }, 200 * i + 1);
        }
      } else if (deltaIndex < 0) {
        for (let i = 0; i > deltaIndex; i--) {
          setTimeout(() => {
            this.currentIndex = index + i - 1;
            var splice_color = this.gradeColors.splice(0, 1);
            var splice_data = this.localStats.splice(0, 1);
            this.gradeColors.push(...splice_color);
            this.localStats.push(...splice_data);

            // Update URL after the last animation step
            if (i === deltaIndex + 1) {
              this.updateUrlWithSelectedGrade();
              // Ensure category counts are updated with the newly selected grade
              this.fetchCategoryCounts();
            }
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
        for (let index = 0; index < this.localStats.length; index++) {
          const buttonRef = this.$refs[`handler${index}`][0];
          const rect = buttonRef.getBoundingClientRect();

          if (
            touchX >= rect.left &&
            touchX <= rect.right &&
            touchY >= rect.top &&
            touchY <= rect.bottom
          ) {
            this.currentIndex = index;

            // Set hasSelectedGrade to true when the wheel is moved
            this.hasSelectedGrade = true;

            // Set the index of the touched button
            if (index > this.startIndex) {
              var pop_color = this.gradeColors.pop();
              var pop_data = this.localStats.pop();
              this.gradeColors.unshift(pop_color);
              this.localStats.unshift(pop_data);
            } else if (index < this.startIndex) {
              var splice_color = this.gradeColors.splice(0, 1);

              var splice_data = this.localStats.splice(0, 1);

              this.gradeColors.push(...splice_color);
              this.localStats.push(...splice_data);
            }

            this.startIndex = index;
            
            // Refresh category counts when the grade changes
            this.fetchCategoryCounts();
            
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
      for (let index = 0; index < this.localStats.length; index++) {
        const buttonRef = this.$refs[`handler${index}`][0];
        const rect = buttonRef.getBoundingClientRect();

        if (
          touchX >= rect.left &&
          touchX <= rect.right &&
          touchY >= rect.top &&
          touchY <= rect.bottom
        ) {
          this.currentIndex = index;

          // Set hasSelectedGrade to true when moving through touch
          this.hasSelectedGrade = true;

          // Set the index of the touched button
          if (index > this.startIndex) {
            var pop_color = this.gradeColors.pop();
            var pop_data = this.localStats.pop();
            this.gradeColors.unshift(pop_color);
            this.localStats.unshift(pop_data);
          } else if (index < this.startIndex) {
            console.log(index);
            var splice_color = this.gradeColors.splice(0, 1);

            var splice_data = this.localStats.splice(0, 1);

            this.gradeColors.push(...splice_color);
            this.localStats.push(...splice_data);
          }

          this.startIndex = index;
          
          // Refresh category counts when the grade changes
          this.fetchCategoryCounts();
          
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

    /**
     * Fetch accurate category counts from the API
     */
    async fetchCategoryCounts() {
      this.categoryCountsLoading = true;
      try {
        // Build the query parameters
        const params = new URLSearchParams();
        
        // Add required parameters for the search endpoint
        params.append('type', 'test'); // Any type works, we just need the types_stats
        params.append('page', '1');
        
        // Add section (board) parameter if available
        let hasSectionParam = false;
        
        if (this.activeBoard && this.activeBoard.id) {
          params.append('section', this.activeBoard.id);
          hasSectionParam = true;
          console.log(`Adding board section ${this.activeBoard.id} to query`);
        } else if (this.localStats && this.localStats.length > 7 && this.localStats[7].section) {
          // Fallback to section from localStats if no active board
          params.append('section', this.localStats[7].section);
          hasSectionParam = true;
          console.log(`Using section ${this.localStats[7].section} from localStats as fallback`);
        }
        
        // If we have no section parameter, we can't make a valid request
        if (!hasSectionParam) {
          console.warn('No section parameter available, skipping API call');
          return;
        }
        
        // Add base (grade) parameter if explicitly selected
        if (this.hasSelectedGrade && this.localStats && this.localStats.length > 7 && this.localStats[7].base) {
          params.append('base', this.localStats[7].base);
          console.log(`Adding grade base ${this.localStats[7].base} to query`);
        }
        
        const requestUrl = `/api/v1/search?${params.toString()}`;
        console.log('Fetching category counts from:', requestUrl);
        
        // Make the API call with appropriate parameters
        const response = await this.$axios.$get(requestUrl);
        
        // Check if we have valid types_stats in the response
        if (response && response.status === 1 && response.data && response.data.types_stats) {
          console.log('Category counts received:', response.data.types_stats);
          
          // Map the types_stats values to our categoryCounts object
          this.categoryCounts = {
            tests: parseInt(response.data.types_stats.test) || 0,
            files: parseInt(response.data.types_stats.learnfiles) || 0,
            exams: parseInt(response.data.types_stats.azmoon) || 0,
            questions: parseInt(response.data.types_stats.question) || 0
          };
          
          console.log('Updated category counts:', this.categoryCounts);
        } else {
          console.warn('Invalid response format:', response);
        }
      } catch (error) {
        console.error('Error fetching category counts:', error);
      } finally {
        // If no values were set (API failed or returned unusable data), fallback to stats array
        if ((this.categoryCounts.tests === 0 && 
            this.categoryCounts.files === 0 && 
            this.categoryCounts.exams === 0 && 
            this.categoryCounts.questions === 0) && 
            this.localStats && this.localStats.length > 7) {
          console.log('Falling back to stats array for counts');
          this.categoryCounts = {
            tests: parseInt(this.localStats[7].tests) || 0,
            files: parseInt(this.localStats[7].files) || 0,
            exams: parseInt(this.localStats[7].exams) || 0,
            questions: parseInt(this.localStats[7].questions) || 0
          };
        }
        
        // Delay setting loading to false to prevent UI flicker
        setTimeout(() => {
          this.categoryCountsLoading = false;
        }, 300);
      }
    },

    // Update the refreshData method to also refresh category counts
    async refreshData() {
      // Reset loading states
      this.questionLoading = true;
      this.paperLoading = true;
      this.categoryCountsLoading = true;

      // Reload questions, papers and category counts
      await Promise.all([
        this.getQuestions(), 
        this.getPapers(),
        this.fetchCategoryCounts()
      ]);
    },

    // Update URL with selected grade
    updateUrlWithSelectedGrade() {
      // The centered grade (at index 7) is the selected one
      const selectedGrade = this.localStats[7];
      
      if (!selectedGrade) return;
      
      // Create query with existing params
      const query = { ...this.$route.query };
      
      // Always update the section parameter if we have a valid board
      if (this.activeBoard && this.activeBoard.id) {
        query.section = this.activeBoard.id;
      } 
      // Fallback to using the section from localStats if needed
      else if (selectedGrade.section) {
        query.section = selectedGrade.section;
      }
      
      // Only include the base parameter if the user has explicitly selected a grade
      if (this.hasSelectedGrade && selectedGrade.base) {
        query.base = selectedGrade.base;
      } else {
        // If no explicit grade selection, remove base parameter
        delete query.base;
      }
      
      // Update the URL without reloading the page
      // Handle NavigationDuplicated error
      this.$router.replace({ query }).catch(err => {
        if (err && err.name === 'NavigationDuplicated') {
          // Ignore the NavigationDuplicated error
          console.log('Navigation to current location skipped');
        } else {
          // Otherwise rethrow the error
          throw err;
        }
      });
      
      // Refresh data based on the new grade/board
      this.refreshData();
      
      // Also fetch updated category counts
      this.fetchCategoryCounts();
    },

    showBoardSelector() {
      // Emit an event that can be caught by the default layout component
      this.$root.$emit('show-board-selector');
    },

    /**
     * Get active board data from local storage
     */
    getActiveBoard() {
      try {
        const storedBoard = localStorage.getItem("selectedBoard");
        if (storedBoard) {
          this.activeBoard = JSON.parse(storedBoard);
          
          // Use the board name or title from the stored object
          this.activeBoardName = this.activeBoard.title || 
                               this.activeBoard.name || 
                               this.activeBoard.id;
          
          console.log("Active board loaded:", this.activeBoard);
        } else {
          console.log("No active board found in localStorage");
        }
      } catch (error) {
        console.error("Error loading active board:", error);
      }
    },

    /**
     * Generates a search URL for a specific category type
     * @param {string} type - The type of content to search for
     * @returns {string} - The properly formatted search URL with appropriate query parameters
     */
    generateCategoryLink(type) {
      // Start with the base URL and type parameter
      let url = `/search?type=${type}`;
      
      // Add the section parameter from the active board if available
      if (this.activeBoard && this.activeBoard.id) {
        url += `&section=${this.activeBoard.id}`;
      }
      // If no active board, but we have localStats data with a section, use that
      else if (this.localStats && this.localStats.length > 7 && this.localStats[7].section) {
        url += `&section=${this.localStats[7].section}`;
      }
      
      // Only add the base parameter if:
      // 1. We've explicitly selected a grade (tracked via an explicit user action)
      // 2. And the grade has a valid base value
      
      // Check if we have a selected grade with a valid base
      const selectedGrade = this.localStats && this.localStats.length > 7 ? this.localStats[7] : null;
      
      // Check if we've explicitly selected a grade (indicated by user interaction)
      const hasUserSelectedGrade = this.hasSelectedGrade;
      
      if (hasUserSelectedGrade && selectedGrade && selectedGrade.base) {
        url += `&base=${selectedGrade.base}`;
      }
      
      return url;
    },

    /**
     * Update the URL with just the board's section parameter
     */
    updateUrlWithCurrentBoard() {
      if (!this.activeBoard || !this.activeBoard.id) return;
      
      // Create query with existing params
      const query = { ...this.$route.query };
      
      // Update the section parameter
      query.section = this.activeBoard.id;
      
      // Remove the base parameter
      delete query.base;
      
      // Update the URL without reloading the page
      // Handle NavigationDuplicated error
      this.$router.replace({ query }).catch(err => {
        if (err && err.name === 'NavigationDuplicated') {
          // Ignore the NavigationDuplicated error
          console.log('Navigation to current location skipped');
        } else {
          // Otherwise rethrow the error
          throw err;
        }
      });
    },

    /**
     * Fetch grades from the API based on selected board
     */
    async fetchGrades() {
      try {
        // Show loading state
        this.gradesLoading = true;
        
        // Get the section_id from active board
        let sectionId = null;
        if (this.activeBoard && this.activeBoard.id) {
          sectionId = this.activeBoard.id;
        } else if (this.localStats && this.localStats.length > 0 && this.localStats[0].section) {
          // Fallback to the first item from localStats if no active board
          sectionId = this.localStats[0].section;
        }
        
        if (!sectionId) {
          console.warn('No section ID available for fetching grades');
          return;
        }
        
        console.log(`Fetching grades for section ID: ${sectionId}`);
        
        // Make the API call to get grades for the selected board
        const response = await this.$axios.$get(`/api/v1/types/list?type=base&section_id=${sectionId}`);
        
        if (response && response.status && Array.isArray(response.data)) {
          console.log('Grades fetched successfully:', response.data);
          
          // Format the grades data to match the expected structure
          const formattedGrades = response.data.map(grade => ({
            id: grade.id,
            base: grade.id, // Use ID as base
            base_title: grade.title || grade.name, // Use title or name for display
            section: sectionId, // Set the section ID
            color: this.getGradeColor(grade.id), // Assign a color
          }));
          
          // Replace the localStats array with the new grades
          this.localStats = [...formattedGrades];
          
          // Make sure we have enough items for the wheel
          this.ensureMinimumGrades();
          
          // Re-center the grades wheel to show the middle grade
          this.centerGradesWheel();
        } else {
          console.error('Invalid API response format:', response);
        }
      } catch (error) {
        console.error('Error fetching grades:', error);
      } finally {
        this.gradesLoading = false;
      }
    },
    
    /**
     * Make sure we have at least 15 items for the grades wheel
     * This will duplicate existing grades if needed
     */
    ensureMinimumGrades() {
      const requiredLength = 15;
      
      // If we don't have enough grades, duplicate the existing ones
      if (this.localStats.length < requiredLength) {
        const originalStats = [...this.localStats];
        while (this.localStats.length < requiredLength) {
          this.localStats = [...this.localStats, ...originalStats];
        }
        
        // Trim to the exact required length
        this.localStats = this.localStats.slice(0, requiredLength);
      }
    },
    
    /**
     * Center the grades wheel to show a middle grade
     */
    centerGradesWheel() {
      // Move items to ensure the middle item is at index 7
      if (this.localStats.length > 0) {
        const midIndex = Math.floor(this.localStats.length / 2);
        if (midIndex !== 7) {
          const shift = 7 - midIndex;
          if (shift > 0) {
            // Shift right
            for (let i = 0; i < shift; i++) {
              const item = this.localStats.pop();
              this.localStats.unshift(item);
            }
          } else {
            // Shift left
            for (let i = 0; i < Math.abs(shift); i++) {
              const item = this.localStats.shift();
              this.localStats.push(item);
            }
          }
        }
      }
    },
    
    /**
     * Get a color for a grade based on its ID
     * @param {string} id - The grade ID
     * @returns {string} - A color hex code
     */
    getGradeColor(id) {
      // Array of colors for grades
      const colors = [
        "#FF6498", "#FD7DD2", "#FF4DFF", "#C24DFF", "#8649FF", 
        "#4C4AFF", "#4A87FF", "#49AEFF", "#4AC5FF", "#43D3FF",
        "#4AF7FF", "#55FFF6", "#5DFFAA", "#66FF5E", "#B1FF4F"
      ];
      
      // Convert ID to a number and use modulo to get an index
      const numId = parseInt(id) || 0;
      return colors[numId % colors.length];
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
    // Initialize localStats from props if provided
    if (this.stats && this.stats.length > 0) {
      this.localStats = [...this.stats];
    }
    
    // Get active board from localStorage
    this.getActiveBoard();
    
    // Fetch grades based on active board (only if not provided as props)
    if (this.localStats.length === 0) {
      this.fetchGrades();
    }
    
    // Fetch other data
    this.getQuestions();
    this.getPapers();
    
    // Fetch category counts
    this.fetchCategoryCounts();
    
    // Listen for board selection changes from localStorage
    window.addEventListener('storage', (event) => {
      if (event.key === 'selectedBoard') {
        this.getActiveBoard();
        // Reset grade selection flag when board changes through storage event
        this.hasSelectedGrade = false;
        
        // Fetch grades for the new board
        this.fetchGrades();
      }
    });
    
    // Listen for board changes from the boardSelector component
    this.$root.$on('board-changed', (board) => {
      console.log('Board changed event received:', board);
      this.activeBoard = board;
      this.activeBoardName = board.title || board.name || board.id;
      
      // Reset grade selection flag when board changes
      this.hasSelectedGrade = false;
      
      // Fetch grades for the new board
      this.fetchGrades();
      
      // After board change, we should refresh data
      this.refreshData();
      
      // Also update the URL to reflect the new board without a grade
      this.updateUrlWithCurrentBoard();
    });
  },
  beforeDestroy() {
    this.stopInterval(); // Stop the interval when the component is about to be unmounted
    
    // Clean up event listeners
    window.removeEventListener('storage', (event) => {
      if (event.key === 'selectedBoard') {
        this.getActiveBoard();
      }
    });
    
    // Clean up root event listeners
    this.$root.$off('board-changed');
  },
  watch: {
    activeBoard: {
      handler(newBoard) {
        if (newBoard) {
          console.log('Board changed, refreshing category counts');
          this.fetchCategoryCounts();
        }
      },
      deep: true
    }
  },
};
</script>

<style>
#content-stats-container .v-btn {
  text-transform: unset !important;
}

#content-stats-container .v-btn .v-btn__content {
  font-family: Inter !important;
  font-weight: 500 !important;
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
}

#content-stats-container #grade-details-card .stats-details .row {
  height: 7.6rem;
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

#content-stats-container
  #grade-details-card
  .latest-card
  .v-card__subtitle
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

#content-stats-container
  #grade-details-card
  .latest-card
  .v-card__subtitle
  .subdate-container {
  text-align: right !important;
  color: #6e7781;
  margin-bottom: 0;
  padding-bottom: 0;
  padding-top: 0.8rem;
}

#content-stats-container
  #grade-details-card
  .latest-card
  .v-skeleton-loader__list-item-avatar {
  padding-left: 0;
  padding-right: 0;
}

#content-stats-container
  #grade-details-card
  .latest-card
  .v-skeleton-loader__list-item-avatar
  .v-skeleton-loader__avatar {
  width: 3.2rem;
  height: 3.2rem;
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
  }

  #content-stats-container #grade-details-card .stats-details .row {
    height: 7.6rem;
  }

  #content-stats-container
    #grade-details-card
    .stats-details
    .row
    .v-icon.primary--text {
    font-size: 2rem !important;
  }

  #content-stats-container #grade-details-card .stats-details .row .label {
    color: #424a53;
    font-family: Inter;
    font-size: 1.4rem;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }

  #content-stats-container #grade-details-card .stats-details .row .stat {
    color: #6e7781;
    font-size: 1.4rem;
    font-style: normal;
    font-weight: 300;
    line-height: 4.4rem;
  }

  #content-stats-container
    #grade-details-card
    .stats-details
    .row
    .date-holder {
    margin-left: 3rem;
    color: #6e7781;
    font-size: 1.4rem;
    font-style: normal;
    font-weight: 300;
    line-height: 3.8rem;
  }

  #content-stats-container #grade-details-card .stats-details .row .stat-icon {
    font-size: 2.4rem;
    left: -3rem;
  }

  #content-stats-container #grade-details-card .section-title {
    color: #6e7781;
    line-height: 4.4rem;
  }

  #content-stats-container
    #grade-details-card
    .latest-card
    .v-card-title
    .title {
    color: #6e7781;
    text-decoration: none;
    font-size: 1.2rem;
    font-style: normal;
    font-weight: 500;
    line-height: 2rem;
  }

  #content-stats-container
    #grade-details-card
    .latest-card
    .v-card-subtitle
    .owner-container {
    text-align: left;
    color: #afb8c1;
  }

  #content-stats-container
    #grade-details-card
    .latest-card
    .v-card-subtitle
    .subdate-container {
    text-align: right !important;
    color: #6e7781;
  }
}

@media (min-width: 960px) {
  #content-stats-container #stats-handler {
    top: 0;
  }

  #content-stats-container #stats-handler .active {
    right: -2.6rem;
  }

  #content-stats-container #grade-details-card {
    height: 56.6rem;
    padding: 10rem 5rem;
    border-radius: 0rem 2rem 2rem 0rem;
  }

  #content-stats-container #grade-details-card .stats-details {
    height: 16rem;
  }

  #content-stats-container #grade-details-card .stats-details .label {
    color: #424a53;
    font-family: Inter;
    font-size: 1.8rem;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    position: relative;
    margin-left: 3.6rem;
  }

  #content-stats-container
    #grade-details-card
    .stats-details
    .label
    .stat-icon {
    position: absolute;
    left: -3.6rem;
    top: -0.5rem;
    font-size: 3.2rem;
  }

  #content-stats-container #grade-details-card .stats-details .date-holder {
    margin-left: 3rem;
    color: #6e7781;
    font-size: 1rem;
    font-style: normal;
    font-weight: 300;
    line-height: 4.4rem;
  }

  #content-stats-container #grade-details-card .stats-details .stat {
    color: #6e7781;
    font-size: 1.4rem;
    font-style: normal;
    font-weight: 300;
    line-height: 4.4rem;
    margin-left: 3rem;
  }
}
.theme--light.v-banner.v-sheet:not(.v-sheet--outlined):not(.v-sheet--shaped) .v-banner__wrapper {
    border-bottom: 0px !important;
}
.v-application--is-ltr .v-banner__icon {
    margin-right: 4px !important;
}
</style>
