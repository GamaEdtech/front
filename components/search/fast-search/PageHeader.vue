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

    <!-- Title -->
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
              class="d-inline-flex flex-row align-center"
              @click="toggleBoardDialog(true)"
            >
              <span class="w-100 gama-text-h3 font-weight-semibold">
                {{ selectedBoard?.name }}
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
                class="d-inline-flex flex-row align-center"
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
                class="d-inline-flex flex-row align-center mb-4 mb-md-0"
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

          <div class="d-inline-flex d-md-none align-center gap-2">
            <v-icon color="#98A2B3">mdi-eye</v-icon>
            <span style="margin-inline: 8px; color: #98a2b3">View</span>
            <span class="gama-text-h6 font-weight-bold">
              {{ viewCount }}
            </span>
          </div>
        </div>

        <slot name="content"></slot>
      </v-col>
      <v-col cols="4" style="height: fit-content">
        <v-img :src="bookImage" max-height="300px" eager contain class="" />
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
import BoardDialog from "@/components/search/fast-search/BoardDialog.vue";
import GradeDialog from "@/components/search/fast-search/GradeDialog.vue";
import SubjectDialog from "@/components/search/fast-search/SubjectDialog.vue";
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
    bookImage: {
      type: String,
      default: require("@/assets/images/BiologyBook.png"),
    },
    viewCount: {
      type: [String, Number],
      default: "28k",
    },
  },

  data() {
    return {
      selectedBoard: null,
      selectedGrade: null,
      selectedSubject: null,
      isLoadingGrades: false,
      isLoadingSubjects: false,
      showBoardDialog: false,
      showGradeDialog: false,
      showSubjectDialog: false,
      loader: true,
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

    /**
     * Handle board selection from BoardDialog component
     */
    handleBoardSelection(board) {
      this.selectedBoard = board;
      if (this.selectedBoard.id && this.selectedBoard.id !== board.id) {
        this.selectedGrade = null;
        this.selectedSubject = null;
      }
    },

    /**
     * Handle grade selection from GradeDialog component
     */
    handleGradeSelection(grade) {
      this.selectedGrade = grade;
      this.selectedSubject = null; // Clear subject when grade changes
      this.isLoadingSubjects = true;
    },

    /**
     * Handle subject selection from SubjectDialog component
     */
    handleSubjectSelection(subject) {
      this.selectedSubject = subject;
      this.loader = false;
      this.isLoadingSubjects = false;
    },
  },
};
</script>

<style scoped>
/* Using global styles from styles.scss */
</style>
