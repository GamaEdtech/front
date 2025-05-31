<template>
  <div class="grade-selector">
    <!-- Grade Selection Modal/Dialog -->
    <v-dialog v-model="dialogVisible" :persistent="false" max-width="600px">
      <v-card>
        <div class="d-flex justify-space-between align-center">
          <v-card-title class="text-h5"> Grade </v-card-title>
          <v-card-subtitle
            style="
              margin-top: 0px;
              padding-top: 0px;
              padding: 16px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 11px;
            "
          >
            <div class="search-result">Search result</div>
            <div class="search-count">{{ filteredGrades.length }}</div>
          </v-card-subtitle>
        </div>
        <v-card-text>
          <div class="search-container mb-4">
            <v-text-field
              v-model="searchTerm"
              label="Search Grade"
              outlined
              dense
              prepend-inner-icon="mdi-magnify"
              append-icon="mdi-close"
              @click:append="searchTerm = ''"
              class="search-field"
              hide-details
              ref="searchField"
              @keyup.enter="handleSearch"
              :loading="isLoading"
            ></v-text-field>
            <v-btn
              style="background-color: #ffb600 !important; font-weight: 600"
              class="ml-2"
              rounded
              @click="handleSearch"
              :loading="isLoading"
            >
              Search
            </v-btn>
          </div>

          <v-alert
            v-if="searchTerm && filteredGrades.length === 0 && !isLoading"
            type="info"
            dense
            class="mb-4"
          >
            No grades found matching "{{ searchTerm }}". Try a different search
            term.
          </v-alert>

          <div class="grades-list-container">
            <v-list v-if="filteredGrades.length > 0">
              <v-list-item
                v-for="grade in filteredGrades"
                :key="grade.id"
                @click="selectGrade(grade)"
                class="grade-item"
              >
                <v-list-item-avatar color="#F2F4F7">
                  <v-avatar color="#F2F4F7" size="40">
                    <span class="grade-circle-text">{{
                      getGradeInitial(grade)
                    }}</span>
                  </v-avatar>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title v-if="!searchTerm">{{
                    grade.title
                  }}</v-list-item-title>
                  <div
                    v-else
                    class="v-list-item__title"
                    v-html="highlightMatch(grade.title)"
                  ></div>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  name: "GradeSelector",
  props: {
    boardId: {
      type: String,
      default: "",
    },
    showDialog: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      searchTerm: "",
      selectedGrade: null,
    };
  },

  computed: {
    ...mapState({
      storeGrades: (state) => state.common.grades,
      isStoreLoading: (state) => state.common.isLoadingGrades,
    }),
    ...mapGetters("common", ["getAllGrades"]),

    grades() {
      return this.storeGrades;
    },

    isLoading() {
      return this.isStoreLoading;
    },

    filteredGrades() {
      if (!this.searchTerm) return this.grades;

      const searchLower = this.searchTerm.toLowerCase();
      return this.grades.filter((grade) => {
        const gradeTitle = (grade.title || "").toLowerCase();
        return gradeTitle.includes(searchLower);
      });
    },

    dialogVisible: {
      get() {
        return this.showDialog;
      },
      set(value) {
        this.$emit("update:show-dialog", value);
      },
    },
  },

  watch: {
    dialogVisible(visible) {
      if (visible) {
        // Focus the search field when dialog opens
        this.$nextTick(() => {
          if (this.$refs.searchField) {
            this.$refs.searchField.focus();
          }
        });
      }
    },

    boardId: {
      immediate: true,
      handler(newBoardId) {
        if (newBoardId) {
          this.fetchGradesData().then(() => {
            this.checkGradeSelection();
          });
        }
      },
    },
  },

  async mounted() {
    if (this.boardId) {
      this.checkGradeSelection();
    }
  },

  methods: {
    ...mapActions("common", ["fetchGrades"]),

    getGradeInitial(grade) {
      const title = grade.title || "";
      if (!title) return "G";
      const match = title.match(/[A-Za-z0-9]/);
      return match ? match[0].toUpperCase() : "G";
    },

    async fetchGradesData() {
      if (this.boardId) {
        await this.fetchGrades(this.boardId);
      }
    },

    setDefaultGrade() {
      if (this.grades.length === 0) return;

      if (this.$route.query.board && this.$route.query.grade) {
        const gradeExists = this.grades.find(
          (b) => b.id === this.$route.query.grade
        );
        if (gradeExists) {
          this.selectedGrade = {
            id: gradeExists.id,
            title: gradeExists.title,
            name: gradeExists.title,
            parent: gradeExists.parent || "",
            master_: gradeExists.master_ || "",
            list_order: gradeExists.list_order || "",
            section_id: gradeExists.parent || "",
          };
        }
      } else {
        // Select the first grade as default
        const firstGrade = this.grades[0];
        this.selectedGrade = {
          id: firstGrade.id,
          title: firstGrade.title,
          name: firstGrade.title,
          parent: firstGrade.parent || this.boardId,
          master_: firstGrade.master_ || "",
          list_order: firstGrade.list_order || "",
          section_id: this.boardId,
          ...firstGrade,
        };
      }

      this.$emit("grade-selected", this.selectedGrade);
    },

    checkGradeSelection() {
      if (this.grades.length === 0) {
        return;
      }
      this.setDefaultGrade();
    },

    showGradeSelectionDialog() {
      this.dialogVisible = true;
    },

    selectGrade(grade) {
      const gradeId = grade.id !== undefined ? String(grade.id) : "";
      const gradeTitle = grade.title || "";
      this.selectedGrade = {
        id: gradeId,
        title: gradeTitle,
        name: gradeTitle,
        parent: grade.parent || this.boardId,
        master_: grade.master_ || "",
        list_order: grade.list_order || "",
        section_id: this.boardId,
        ...(typeof grade === "object" ? grade : {}),
      };
      this.dialogVisible = false;
      this.$emit("grade-selected", this.selectedGrade);
    },

    clearGradeSelection() {
      this.selectedGrade = null;
      this.showGradeSelectionDialog();
    },

    handleSearch() {},

    highlightMatch(text) {
      if (!this.searchTerm || !text) return text;
      const escapedSearchTerm = this.searchTerm.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );
      const regex = new RegExp(`(${escapedSearchTerm})`, "gi");
      return text.replace(regex, '<span class="highlighted-text">$1</span>');
    },
  },
};
</script>

<style scoped>
.grade-selector {
  width: 100%;
}

.search-container {
  display: flex;
  align-items: center;
}

.search-field {
  flex-grow: 1;
}

.grades-list-container {
  max-height: 400px;
  overflow-y: auto;
  margin-right: -16px;
  padding-right: 16px;
}

.search-result {
  font-family: Inter;
  font-weight: 500;
  font-size: 12px;
  line-height: 100%;
  letter-spacing: 0%;
  text-align: right;
  color: rgba(36, 41, 47, 0.3);
}

.search-count {
  color: #57b947;
  font-weight: 600;
  font-size: 18px;
}

.grade-item {
  transition: background-color 0.2s ease;
  border-radius: 4px;
  margin-bottom: 8px;
}

.grade-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.grade-circle-text {
  font-size: 16px;
  font-weight: 600;
  color: #344054;
}

/* Highlighted text styling */
.highlighted-text {
  background-color: rgba(255, 179, 0, 0.3);
  font-weight: bold;
  border-radius: 2px;
  padding: 0 2px;
}
</style>
