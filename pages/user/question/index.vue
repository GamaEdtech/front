<template>
  <div>
    <v-col cols="12" class="px-0 px-sm-2">
      <v-row>
        <v-col cols="12" class="pl-5">
          <span class="text-h4 teal--text">My Forum List</span>
        </v-col>
      </v-row>
      <v-card class="mt-3">
        <v-card-title class="text-h4">
          <v-row>
            <v-col cols="12" class="text-left">
              <v-btn
                to="/user/question/create"
                color="teal"
                class="white--text"
              >
                Add Forum
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text class="px-sm-8 px-md-4">
          <v-row>
            <v-col cols="12" class="px-0 px-sm-4 px-md-4">
              <v-simple-table class="exams_table">
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left text-h5">#</th>
                      <th class="text-center text-h5">Title</th>
                      <th class="text-center text-h5">Unread reply</th>
                      <th class="text-center text-h5">Status</th>
                      <th class="text-center text-h5">Date</th>
                      <th class="text-center text-h5">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-show="question_list.length > 0"
                      v-for="item in question_list"
                      :key="item.id"
                    >
                      <td>{{ item.id }}</td>
                      <td class="text-center" style="max-width: 20rem">
                        <a
                          :href="`/qa/${item.id}/${item.title}`"
                          target="_blank"
                        >
                          {{ item.title }}
                        </a>
                      </td>
                      <td class="text-center">
                        {{ item.unread_reply }}
                      </td>
                      <td class="text-center">
                        {{ calcStatus(item.status) }}
                      </td>
                      <td class="text-center">
                        {{ item.subdate }}
                      </td>
                      <td class="text-center">
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              icon
                              color="green"
                              :to="`/qa/${item.id}`"
                              target="_blank"
                              small
                              v-bind="attrs"
                              v-on="on"
                            >
                              <v-icon small> mdi-eye </v-icon>
                            </v-btn>
                          </template>
                          <span>View</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              icon
                              small
                              v-bind="attrs"
                              v-on="on"
                              :to="`/user/question/edit/${item.id}`"
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
                      </td>
                    </tr>
                    <tr
                      v-show="
                        page_loading === false && question_list.length === 0
                      "
                    >
                      <td colspan="7" class="text-center">
                        <p>Oops! no data found</p>
                      </td>
                    </tr>
                    <tr v-show="page_loading">
                      <td colspan="7" class="text-center">
                        <v-progress-circular
                          :size="30"
                          :width="3"
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
  </div>
</template>

<script>
export default {
  layout: "dashboard_layout",
  name: "qa-manage",
  auth: false,
  data() {
    return {
      question_list: [],

      //Filter section
      filter: {
        level: "",
        grade: "",
        lesson: "",
      },
      level_list: [],
      grade_list: [],
      field_list: [],
      lesson_list: [],
      //End filter section

      //Paginate section
      page_loading: false,
      page: 1,
      all_files_loaded: false,
      //End paginate section
    };
  },
  head() {
    return {
      title: "Q & A manage",
    };
  },
  mounted() {
    this.getQuestionList();
    this.getTypeList("section");
    this.scroll();
  },
  methods: {
    getQuestionList() {
      if (!this.all_files_loaded) {
        this.page_loading = true;
        this.$axios
          .$get("/api/v1/questions", {
            params: {
              perpage: 20,
              page: this.page,
              section: this.filter.level,
              base: this.filter.grade,
              lesson: this.filter.lesson,
            },
            headers: {
              Authorization: `${this.$auth.strategy.token.get()}`,
            },
          })
          .then((response) => {
            this.question_list.push(...response.data.list);

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
    calcStatus(val) {
      let title = "";
      if (val == 0) title = "Unreviewed";
      else if (val == 1) title = "Confirmed";
      else if (val == 2) title = "Reference to type unit";
      else if (val == 3) title = "Has a message";
      else if (val == 4) title = "Inactive";
      else if (val == 5) title = "Edited";
      return title;
    },
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
            this.getQuestionList();
          }, 800);
        }
      };
    },

    filterChanged(type) {
      if (type == "level") {
        this.filter.grade = "";
        this.filter.lesson = "";
        if (this.filter.level) this.getTypeList("base", this.filter.level);

        this.page = 1;
        this.all_files_loaded = false;

        this.grade_list = [];
        this.lesson_list = [];
        this.question_list = [];

        this.getQuestionList();
      } else if (type == "grade") {
        this.filter.lesson = "";
        if (this.filter.grade) this.getTypeList("lesson", this.filter.grade);

        this.page = 1;
        this.all_files_loaded = false;
        this.question_list = [];
        this.lesson_list = [];
        this.getQuestionList();
      } else if (type == "lesson") {
        this.page = 1;
        this.all_files_loaded = false;
        this.question_list = [];
        this.getQuestionList();
      }
    },
  },
};
</script>

<style scoped>
p {
  font-size: 1.4rem;
}
</style>
