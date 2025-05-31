<template>
  <div>
    <!-- Breadcrumb -->
    <v-col cols="12" class="px-0">
      <div class="mt-8 px-0 header-path">
        <div style="overflow-x: auto !important">
          <div style="min-width: max-content">
            <div class="mt-0 py-0 header-path">
              <breadcrumb :breads="breads" class="transparent" />
            </div>
          </div>
        </div>
      </div>
    </v-col>

    <v-row class="justify-space-between flex-nowrap">
      <v-col cols="8" sm="5" md="8">
        <!-- Parent skeleton loader for the entire selection area -->
        <div v-if="loader" class="mb-4">
          <v-skeleton-loader
            type="card-heading"
            class="mt-1"
          ></v-skeleton-loader>
        </div>

        <!-- Actual content when not loading -->
        <div v-else class="mb-4 d-inline-flex align-center flex-wrap">
          <div>
            <div
              class="d-inline-flex flex-row align-center cursor-pointer"
              @click="toggleBoardDialog(true)"
            >
              <span class="w-100 gama-text-h3 font-weight-semibold">
                {{
                  selectedBoard?.name
                    ? selectedBoard?.name
                    : selectedBoard?.title
                }}
              </span>
              <v-icon size="18" color="black" class="mx-2">
                mdi-menu-down
              </v-icon>
            </div>
          </div>
          <div>
            <template v-if="isLoadingGrades">
              <v-skeleton-loader
                type="card-heading"
                class=""
              ></v-skeleton-loader>
            </template>
            <template v-else>
              <div
                class="d-inline-flex flex-row align-center cursor-pointer"
                @click="toggleGradeDialog(true)"
              >
                <span
                  v-if="selectedGrade"
                  class="w-100 gama-text-h3 font-weight-semibold"
                >
                  {{ selectedGrade?.name }}
                </span>
                <v-icon
                  v-if="selectedBoard"
                  size="18"
                  color="black"
                  class="mx-2"
                >
                  mdi-menu-down
                </v-icon>
              </div>
            </template>
          </div>
          <!-- Subject Selection -->
          <div>
            <template v-if="isLoadingSubjects">
              <div class="d-inline-flex mt-2">
                <v-skeleton-loader
                  type="card-heading"
                  class=""
                  min-width="200"
                ></v-skeleton-loader>
              </div>
            </template>
            <template v-else>
              <div
                class="d-inline-flex flex-row align-center mb-4 mb-md-0 cursor-pointer"
                @click="toggleSubjectDialog(true)"
              >
                <span
                  v-if="selectedSubject"
                  class="w-100 gama-text-h3 font-weight-semibold"
                >
                  {{ selectedSubject?.name }}
                </span>
                <v-icon
                  v-if="selectedSubject"
                  size="18"
                  color="black"
                  class="mx-2"
                >
                  mdi-menu-down
                </v-icon>
              </div>
            </template>
          </div>

          <!-- <div class="d-inline-flex d-md-none align-center gap-2">
            <v-icon color="#98A2B3">mdi-eye</v-icon>
            <span style="margin-inline: 8px; color: #98a2b3">View</span>
            <span class="gama-text-h6 font-weight-bold">
              {{ viewCount }}
            </span>
          </div> -->
        </div>

        <slot name="content"></slot>
      </v-col>
      <v-col cols="4" style="height: fit-content">
        <template v-if="searchLoader">
          <v-skeleton-loader type="image"></v-skeleton-loader>
        </template>
        <template v-else>
          <template v-if="bookImage">
            <div
              class="max-w-100 w-100 d-flex overflow-hideen relative w-60 mx-auto"
            >
              <img
                :src="bookImage"
                eager
                contain
                class="rounded-lg search-book-img w-100"
              />
            </div>
          </template>
        </template>
      </v-col>
    </v-row>

    <BoardDialog
      :show-dialog="showBoardDialog"
      @update:show-dialog="showBoardDialog = $event"
      @board-selected="handleBoardSelection"
    />
    <GradeDialog
      :show-dialog="showGradeDialog"
      @update:show-dialog="showGradeDialog = $event"
      :boardId="selectedBoard?.id"
      @grade-selected="handleGradeSelection"
    />
    <SubjectDialog
      :show-dialog="showSubjectDialog"
      @update:show-dialog="showSubjectDialog = $event"
      :gradeId="selectedGrade?.id"
      @subject-selected="handleSubjectSelection"
    />
  </div>
</template>

<script>
import breadcrumb from "~/components/widgets/breadcrumb.vue";
import BoardDialog from "@/components/search/typeSelector/BoardDialog.vue";
import GradeDialog from "@/components/search/typeSelector/GradeDialog.vue";
import SubjectDialog from "@/components/search/typeSelector/SubjectDialog.vue";
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  name: "PageHeader",
  components: {
    breadcrumb,
    BoardDialog,
    GradeDialog,
    SubjectDialog,
  },
  props: {
    breads: {
      type: Array,
      required: true,
    },
    viewCount: {
      type: [String, Number],
      default: "28k",
    },
  },

  data() {
    return {
      searchLoader: false,
      selectedBoard: null,
      selectedGrade: null,
      selectedSubject: null,
      isLoadingGrades: false,
      isLoadingSubjects: false,
      showBoardDialog: false,
      showGradeDialog: false,
      showSubjectDialog: false,
      loader: true,
      searchResults: null,
      bookImage: null,
      pageNumber: 1,
      isFirstTime: true,
    };
  },

  computed: {
    ...mapGetters({
      isStoreLoadingGrades: "common/isGradesLoading",
      isStoreLoadingSubjects: "common/isSubjectsLoading",
    }),
  },

  watch: {
    isStoreLoadingSubjects(newValue) {
      // this.isLoadingSubjects = newValue;
    },
  },

  async mounted() {},

  methods: {
    ...mapActions("common", ["fetchGrades", "fetchSubjects"]),

    /**
     * Toggle board dialog visibility
     */
    toggleBoardDialog(value) {
      this.showBoardDialog = value;
    },

    /**
     * Toggle grade dialog visibility
     */
    toggleGradeDialog(value) {
      this.showGradeDialog = value;
    },

    /**
     * Toggle subject dialog visibility
     */
    toggleSubjectDialog(value) {
      this.showSubjectDialog = value;
    },

    setQueryParam() {
      if (this.selectedBoard) {
        const query = {};
        query.board = this.selectedBoard.id;
        if (this.selectedGrade) {
          query.grade = this.selectedGrade.id;
          if (this.selectedSubject) {
            query.subject = this.selectedSubject.id;
          }
        }
        this.$router.replace({ query: query }).catch((err) => {
          //Do noting
        });
      }
    },
    /**
     * Handle board selection from BoardDialog component
     */
    handleBoardSelection(board) {
      if (!this.selectedBoard || this.selectedBoard.id !== board.id) {
        this.pageNumber = 1;
        this.$emit("board-change", board);
        this.selectedBoard = board;
        this.selectedGrade = null;
        this.selectedSubject = null;
        if (!this.isFirstTime) {
          this.setQueryParam();
        }
      }
    },

    /**
     * Handle grade selection from GradeDialog component
     */
    handleGradeSelection(grade) {
      if (!this.selectedGrade || this.selectedGrade.id !== grade.id) {
        this.pageNumber = 1;
        this.$emit("grade-change", grade);
        this.selectedGrade = grade;
        this.selectedSubject = null; // Clear subject when grade changes
        if (!this.isFirstTime) {
          this.setQueryParam();
        }
        if (grade) {
          this.isLoadingSubjects = true;
        }
      }
    },

    /**
     * Handle subject selection from SubjectDialog component
     */
    async handleSubjectSelection(subject) {
      this.pageNumber = 1;
      this.$emit("subject-change", subject);
      this.selectedSubject = subject;
      this.setQueryParam();
      this.isFirstTime = false;
      if (this.selectedBoard) {
        this.loader = false;
        this.isLoadingSubjects = false;
        // Call search API when subject is selected
        if (this.selectedBoard.id && subject?.id) {
          await this.fetchSearchResults();
        }
      }
    },

    /**
     * Fetch search results based on selected board, grade, and subject
     */
    async fetchSearchResults() {
      try {
        this.searchLoader = true;

        let endpointTopSectionData = `api/v1/tests/search?is_paper=false&directory=true&lesson=${this.selectedSubject.id}`;
        let endpointPapers = `api/v1/tests/search?lesson=${this.selectedSubject.id}&page=${this.pageNumber}&perpage=20`;

        this.$emit("changeLoadingTable", true);
        this.$emit("changeLoadingTopSection", true);

        const [response, responsePapers] = await Promise.all([
          this.$axios.get(endpointTopSectionData),
          this.$axios.get(endpointPapers),
        ]);

        this.searchResults = response.data;
        if (
          this.searchResults &&
          this.searchResults.data &&
          this.searchResults.data.list &&
          this.searchResults.data.list.length > 0 &&
          this.searchResults.data.lesson_pic
        ) {
          this.bookImage = this.searchResults.data.lesson_pic;
        } else {
          this.bookImage = null;
        }

        this.$emit("changeLoadingTable", false);
        this.$emit("changeLoadingTopSection", false);
        this.$emit("search-results", this.searchResults);
        this.$emit("result-papers", responsePapers.data);

        this.searchLoader = false;
      } catch (error) {
        console.error("Error fetching search results:", error);
        this.bookImage = null;
        this.searchLoader = false;
        this.$emit("changeLoadingTable", false);
        this.$emit("changeLoadingTopSection", false);
      }
    },

    async fetchPapersWithPaginate() {
      try {
        this.pageNumber += 1;
        let endpointPapers = `api/v1/tests/search?lesson=${this.selectedSubject.id}&page=${this.pageNumber}&perpage=20`;
        this.$emit("changeLoadingInfinitScroll", true);
        const responsePapers = await this.$axios.get(endpointPapers);

        this.$emit("result-papers", responsePapers.data, true);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        this.$emit("changeLoadingInfinitScroll", false);
      }
    },
  },
};
</script>

<style scoped>
.search-book-img {
  max-height: 300px;
}
/* Using global styles from styles.scss */
</style>
