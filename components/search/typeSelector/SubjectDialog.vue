<template>
  <div class="subject-selector">
    <v-dialog v-model="dialogVisible" :persistent="false" max-width="600px">
      <v-card>
        <div class="d-flex justify-space-between align-center">
          <v-card-title class="text-h5"> Subject </v-card-title>
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
            <div class="search-count">{{ filteredSubjects.length }}</div>
          </v-card-subtitle>
        </div>
        <v-card-text>
          <div class="search-container mb-4">
            <v-text-field
              v-model="searchTerm"
              label="Search Subject"
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
            v-if="searchTerm && filteredSubjects.length === 0 && !isLoading"
            type="info"
            dense
            class="mb-4"
          >
            No subjects found matching "{{ searchTerm }}". Try a different
            search term.
          </v-alert>

          <div class="subjects-list-container">
            <v-list v-if="filteredSubjects.length > 0">
              <v-list-item
                v-for="subject in filteredSubjects"
                :key="subject.id"
                @click="selectSubject(subject)"
                class="subject-item"
              >
                <v-list-item-avatar color="#F2F4F7">
                  <v-avatar color="#F2F4F7" size="40">
                    <span class="subject-circle-text">{{
                      getSubjectInitial(subject)
                    }}</span>
                  </v-avatar>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title v-if="!searchTerm">{{
                    subject.title
                  }}</v-list-item-title>
                  <div
                    v-else
                    class="v-list-item__title"
                    v-html="highlightMatch(subject.title)"
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
  name: "SubjectSelector",
  props: {
    gradeId: {
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
      selectedSubject: null,
    };
  },

  computed: {
    ...mapState({
      storeSubjects: (state) => state.common.subjects,
      isStoreLoading: (state) => state.common.isLoadingSubjects,
    }),
    ...mapGetters("common", ["getAllSubjects"]),

    subjects() {
      return this.storeSubjects;
    },

    isLoading() {
      return this.isStoreLoading;
    },

    filteredSubjects() {
      if (!this.searchTerm) return this.subjects;

      const searchLower = this.searchTerm.toLowerCase();
      return this.subjects.filter((subject) => {
        const subjectTitle = (subject.title || "").toLowerCase();
        return subjectTitle.includes(searchLower);
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
        this.$nextTick(() => {
          if (this.$refs.searchField) {
            this.$refs.searchField.focus();
          }
        });

        if (this.gradeId) {
          this.checkSubjectSelection(false);
        }
      }
    },

    gradeId: {
      //immediate: true,
      handler(newGradeId) {
        if (newGradeId) {
          this.fetchSubjectsData().then(() => {
            this.checkSubjectSelection(true);
          });
        } else {
          this.$emit("subject-selected", null);
        }
      },
    },
  },

  async mounted() {
    if (this.gradeId) {
      // this.checkSubjectSelection(true);
    } else {
      // this.$emit("subject-selected", null);
    }
  },

  methods: {
    ...mapActions("common", ["fetchSubjects"]),

    getSubjectInitial(subject) {
      const title = subject.title || "";
      if (!title) return "S";

      const match = title.match(/[A-Za-z0-9]/);
      return match ? match[0].toUpperCase() : "S";
    },

    async fetchSubjectsData() {
      if (this.gradeId) {
        await this.fetchSubjects(this.gradeId);
        return true;
      } else {
        this.selectedSubject = null;
        return false;
      }
    },

    checkSubjectSelection(shouldEmit = true) {
      if (!this.gradeId) {
        if (shouldEmit) {
          this.$emit("subject-selected", null);
        }
        return;
      }

      if (!this.subjects || this.subjects.length === 0) {
        if (shouldEmit) {
          this.$emit("subject-selected", null);
        }
        return;
      }

      this.setDefaultSubject(shouldEmit);
    },

    setDefaultSubject(shouldEmit = true) {
      if (this.subjects.length === 0) return;

      if (
        this.$route.query.board &&
        this.$route.query.grade &&
        this.$route.query.subject
      ) {
        const subjectExists = this.subjects.find(
          (b) => b.id === this.$route.query.subject
        );
        if (subjectExists) {
          this.selectedSubject = {
            id: subjectExists.id,
            title: subjectExists.title,
            name: subjectExists.title,
            lesson_id: subjectExists.id,
            base_id: subjectExists.gradeId,
            parent: subjectExists.parent || "",
            parent2: subjectExists.parent2 || "0",
            master_: subjectExists.master_ || "",
            list_order: subjectExists.list_order || "",
            test_link: subjectExists.test_link,
            book_link: subjectExists.book_link,
            metadata: subjectExists.metadata || "{}",
            bit_delete: subjectExists.bit_delete || "0",
          };
        }
      } else {
        // Select the first subject as default
        const firstSubject = this.subjects[0];

        this.selectedSubject = {
          id: firstSubject.id,
          title: firstSubject.title,
          name: firstSubject.title,
          lesson_id: firstSubject.id,
          base_id: this.gradeId,
          parent: firstSubject.parent || "",
          parent2: firstSubject.parent2 || "0",
          master_: firstSubject.master_ || "",
          list_order: firstSubject.list_order || "",
          test_link: firstSubject.test_link,
          book_link: firstSubject.book_link,
          metadata: firstSubject.metadata || "{}",
          bit_delete: firstSubject.bit_delete || "0",
          ...firstSubject,
        };
      }

      if (shouldEmit) {
        this.$emit("subject-selected", this.selectedSubject);
      }
    },

    showSubjectSelectionDialog() {
      this.dialogVisible = true;
    },

    selectSubject(subject) {
      const subjectId = subject.id !== undefined ? String(subject.id) : "";
      const subjectTitle = subject.title || "";

      this.selectedSubject = {
        id: subjectId,
        title: subjectTitle,
        name: subjectTitle,
        lesson_id: subjectId,
        base_id: this.gradeId,
        parent: subject.parent || "",
        parent2: subject.parent2 || "0",
        master_: subject.master_ || "",
        list_order: subject.list_order || "",
        test_link: subject.test_link,
        book_link: subject.book_link,
        metadata: subject.metadata || "{}",
        bit_delete: subject.bit_delete || "0",
        ...(typeof subject === "object" ? subject : {}),
      };
      this.dialogVisible = false;
      this.$emit("subject-selected", this.selectedSubject);
    },

    clearSubjectSelection() {
      localStorage.removeItem("selectedSubject");
      this.selectedSubject = null;
      this.showSubjectSelectionDialog();
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
.subject-selector {
  width: 100%;
}

.search-container {
  display: flex;
  align-items: center;
}

.search-field {
  flex-grow: 1;
}

.subjects-list-container {
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

.subject-item {
  transition: background-color 0.2s ease;
  border-radius: 4px;
  margin-bottom: 8px;
}

.subject-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.subject-circle-text {
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
