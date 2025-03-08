<template>
  <v-container>
    <div>
      <v-col cols="12" class="px-0 px-sm-2">
        <v-row>
          <v-col cols="12" class="pl-5">
            <span class="text-h4 teal--text">
              <v-icon color="teal" large> mdi-clipboard-list-outline </v-icon>
              My Exams
            </span>
          </v-col>
        </v-row>

        <!--Filter section-->
        <v-row class="d-none d-md-flex">
          <v-col cols="12" md="3">
            <v-autocomplete
              dense
              v-model="filter.level"
              clearable
              :items="level_list"
              item-text="title"
              item-value="id"
              label="Board"
              outlined
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
              dense
              v-model="filter.grade"
              clearable
              :items="grade_list"
              item-value="id"
              item-text="title"
              label="Grade"
              outlined
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
              dense
              :items="lesson_list"
              item-value="id"
              item-text="title"
              v-model="filter.lesson"
              clearable
              label="Subject"
              outlined
            />
          </v-col>
        </v-row>
        <!--End filter section-->

        <v-card class="mt-3">
          <v-card-text class="px-sm-8 px-md-4">
            <v-row>
              <v-col cols="12" class="px-0 px-sm-4 px-md-4">
                <v-simple-table class="exams_table">
                  <template v-slot:default>
                    <tbody>
                      <tr
                        v-show="exam_list.length > 0"
                        v-for="item in exam_list"
                        :key="item.id"
                      >
                        <td class="py-3">
                          <nuxt-link
                            :to="`/exam/${item.id}`"
                            class="font-weight-bold"
                            >{{ item.title }}</nuxt-link
                          >
                          <nuxt-link
                            :to="`/exam/participants/${item.id}`"
                            class="mt-2 d-block"
                          >
                            <span class="icong-student"></span>
                            Participants: {{ item.participants.total }}
                          </nuxt-link>
                        </td>
                        <td class="text-right">
                          <p>
                            {{ item.subdate }}
                          </p>
                          <div>
                            {{ showStatus(item.status) }}
                            <v-tooltip bottom>
                              <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                  icon
                                  color="error"
                                  @click="openDeleteConfirmDialog(item.id)"
                                  small
                                  v-bind="attrs"
                                  v-on="on"
                                >
                                  <v-icon small> mdi-delete </v-icon>
                                </v-btn>
                              </template>
                              <span>Delete</span>
                            </v-tooltip>
                            <v-tooltip bottom>
                              <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                  icon
                                  small
                                  v-bind="attrs"
                                  v-on="on"
                                  :to="`/test-maker/edit/${item.id}`"
                                >
                                  <v-icon small> mdi-note-edit-outline </v-icon>
                                </v-btn>
                              </template>
                              <span>Edit</span>
                            </v-tooltip>
                            <v-tooltip bottom>
                              <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                  icon
                                  small
                                  color="primary"
                                  v-bind="attrs"
                                  v-on="on"
                                >
                                  <v-icon small>
                                    mdi-share-variant-outline
                                  </v-icon>
                                </v-btn>
                              </template>
                              <span>Share</span>
                            </v-tooltip>
                          </div>
                        </td>
                      </tr>
                      <tr
                        v-show="
                          page_loading === false && exam_list.length === 0
                        "
                      >
                        <td colspan="2">
                          <p>Oops! no data found</p>
                        </td>
                      </tr>
                      <tr v-show="page_loading">
                        <td colspan="2" class="text-center">
                          <v-progress-circular
                            :size="40"
                            :width="4"
                            class="mt-12 mb-12"
                            color="orange"
                            indeterminate
                          />
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-dialog v-model="deleteConfirmDialog" max-width="290">
        <v-card>
          <v-card-title class="text-h5"> Are you sure? </v-card-title>

          <v-card-text>
            <p>If you are sure to delete, click Yes.</p>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn text @click="deleteConfirmDialog = false"> No </v-btn>

            <v-btn
              color="green darken-1"
              text
              :loading="delete_loading"
              @click="deleteExam()"
            >
              Yes
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-container>
</template>

<script>
export default {
  layout: "test-maker-layout",
  name: "exams-manage",
  // async asyncData({params,$axios}) {
  //   const examData=await $axios.$get('/api/v1/exams');
  //   return {examData};
  // },
  head() {
    return {
      title: "My Exams",
    };
  },
  data() {
    return {
      filter: {
        level: "",
        grade: "",
        lesson: "",
      },

      level_list: [],
      grade_list: [],
      field_list: [],
      lesson_list: [],
      exam_list: [],

      page_loading: false,
      page: 1,
      all_files_loaded: false,

      //Delete section
      deleteConfirmDialog: false,
      delete_loading: false,
      delete_exam_id: null,
      //End delete section
    };
  },
  mounted() {
    this.getTypeList("section");
    this.getExams();
    this.scroll();
  },
  watch: {
    "filter.level"(val) {
      this.filter.grade = "";
      this.filter.lesson = "";
      if (val) this.getTypeList("base", val);

      this.page = 1;
      this.all_files_loaded = false;
      this.exam_list = [];
      this.getExams();
    },
    "filter.grade"(val) {
      this.filter.lesson = "";
      if (val) this.getTypeList("lesson", val);

      this.page = 1;
      this.all_files_loaded = false;
      this.exam_list = [];
      this.getExams();
    },
    "filter.lesson"(val) {
      this.page = 1;
      this.all_files_loaded = false;
      this.exam_list = [];
      this.getExams();
    },
  },
  methods: {
    getTypeList(type, parent = "") {
      var params = {
        type: type,
      };
      if (type === "base") params.section_id = parent;
      if (type === "lesson") {
        params.base_id = parent;
      }

      this.$axios
        .$get("/api/v1/types/list", {
          params,
        })
        .then((res) => {
          var data = {};
          if (type === "section") {
            this.level_list = res.data;
          } else if (type === "base") {
            this.grade_list = res.data;
          } else if (type === "lesson") {
            this.lesson_list = res.data;
          }
        })
        .catch((err) => {
          this.$toast.error(err);
        });
    },
    getExams() {
      if (!this.all_files_loaded) {
        this.page_loading = true;
        this.$axios
          .$get("/api/v1/exams", {
            params: {
              perpage: 20,
              page: this.page,
              section: this.filter.level,
              base: this.filter.grade,
              lesson: this.filter.lesson,
            },
          })
          .then((response) => {
            this.exam_list.push(...response.data.list);

            if (response.data.list.length === 0)
              //For terminate auto load request
              this.all_files_loaded = true;
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            this.page_loading = false;
          });
      }
    },
    showStatus(id) {
      if (id === "6") return "Under construction";
      else if (id === "7") return "Published";
    },
    scroll() {
      //For infinite loading
      window.onscroll = () => {
        //Scroll position
        var scrollPosition =
          Math.max(
            window.pageYOffset,
            document.documentElement.scrollTop,
            document.body.scrollTop
          ) +
          window.innerHeight +
          50;
        let bottomOfWindow =
          scrollPosition >= document.documentElement.offsetHeight;

        //Avoid the number of requests
        if (this.timer) {
          clearTimeout(this.timer);
          this.timer = null;
        }

        //Load next page
        if (bottomOfWindow && this.all_files_loaded === false) {
          this.page_loading = true;
          this.timer = setTimeout(() => {
            this.page++;
            this.getExams();
          }, 800);
        }
      };
    },

    openDeleteConfirmDialog(item_id) {
      this.delete_exam_id = item_id;
      this.deleteConfirmDialog = true;
    },
    async deleteExam() {
      this.delete_loading = true;
      await this.$axios
        .$delete(`/api/v1/exams/${this.delete_exam_id}`, {
          headers: {
            Authorization: `${this.$auth.strategy.token.get()}`,
          },
        })
        .then((response) => {
          this.delete_exam_id = null;
          this.deleteConfirmDialog = false;

          //Clear Exams global variable
          this.$store.commit("user/setCurrentExamId", "");
          this.$store.commit("user/setCurrentExamCode", "");
          this.$store.commit("user/setCurrentExamId", "");
          this.$store.commit("user/setPreviewTestList", []);
          //End clear Exams global variable

          this.$toast.success("Deleted successfully");
          this.exam_list = [];
          this.getExams();
        })
        .catch((e) => {
          this.delete_exam_id = null;
          this.deleteConfirmDialog = false;
        })
        .finally(() => {
          this.delete_loading = false;
        });
    },
  },
};
</script>

<style scoped>
p {
  font-size: 1.4rem;
}
</style>
