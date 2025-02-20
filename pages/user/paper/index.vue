<template>
  <div>
    <v-col cols="12" class="px-0 px-sm-2">
      <v-row>
        <v-col cols="12" class="pl-5">
          <span class="text-h4 teal--text">My Past Papers List </span>
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
            @change="filterChanged('level')"
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
            @change="filterChanged('grade')"
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
            @change="filterChanged('lesson')"
          />
        </v-col>
      </v-row>
      <!--End filter section-->

      <v-card class="mt-3">
        <v-card-title class="text-h4">
          <v-row>
            <v-col cols="12" class="text-left">
              <v-btn to="/user/paper/create" color="teal" class="white--text">
                Add Past Paper
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text class="px-sm-8 px-md-4">
          <v-row>
            <v-col cols="12" class="px-0 px-sm-4 px-md-4">
              <v-simple-table class="content_table">
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left text-h5">#</th>
                      <th class="text-center text-h5">Title</th>
                      <th class="text-center text-h5">Score</th>
                      <th class="text-center text-h5">Download</th>
                      <th class="text-center text-h5">Date</th>
                      <th class="text-center text-h5">Status</th>
                      <th class="text-center text-h5">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-show="paper_list.length > 0"
                      v-for="item in paper_list"
                      :key="item.id"
                    >
                      <td>{{ item.id }}</td>
                      <td class="text-center" style="max-width: 20rem">
                        <a
                          :href="`/paper/${item.id}/${item.title}`"
                          target="_blank"
                        >
                          {{ item.title }}
                        </a>
                      </td>
                      <td class="text-center">
                        {{ item.teacher_score }}
                      </td>
                      <td class="text-center">
                        {{ item.downloads }}
                      </td>
                      <td class="text-center">
                        {{ item.subdate }}
                      </td>
                      <td class="text-center">
                        {{ calcStatus(item.status) }}
                      </td>
                      <td class="text-center">
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              icon
                              color="green"
                              :to="`/paper/${item.id}`"
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
                              :to="`/user/paper/edit/${item.id}`"
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
                      v-show="page_loading === false && paper_list.length === 0"
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

    <!--Delete dialog-->
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
            @click="deletePaper()"
          >
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--End delete dialog-->
  </div>
</template>

<script>
export default {
  layout: "dashboard_layout",
  name: "paper-manage",
  data() {
    return {
      paper_list: [],

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

      //Delete section
      deleteConfirmDialog: false,
      delete_paper_id: null,
      delete_loading: false,
    };
  },
  head() {
    return {
      title: "Paper manage",
    };
  },
  mounted() {
    this.getPaperList();
    this.getTypeList("section");
    this.scroll();
  },
  methods: {
    getPaperList() {
      if (!this.all_files_loaded) {
        this.page_loading = true;
        this.$axios
          .$get("/api/v1/tests", {
            params: {
              perpage: 20,
              page: this.page,
              section: this.filter.level,
              base: this.filter.grade,
              lesson: this.filter.lesson,
            },
          })
          .then((response) => {
            this.paper_list.push(...response.data.list);

            if (response.data.list.length === 0)
              //For terminate auto load request
              this.all_files_loaded = true;
          })
          .catch((err) => {
            if (err.response.status == 403) this.$auth.logout();
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
            this.getPaperList();
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
        this.paper_list = [];

        this.getPaperList();
      } else if (type == "grade") {
        this.filter.lesson = "";
        if (this.filter.grade) this.getTypeList("lesson", this.filter.grade);

        this.page = 1;
        this.all_files_loaded = false;
        this.paper_list = [];
        this.lesson_list = [];
        this.getPaperList();
      } else if (type == "lesson") {
        this.page = 1;
        this.all_files_loaded = false;
        this.paper_list = [];
        this.getPaperList();
      }
    },

    openDeleteConfirmDialog(item_id) {
      this.delete_paper_id = item_id;
      this.deleteConfirmDialog = true;
    },

    async deletePaper() {
      this.delete_loading = true;
      await this.$axios
        .$delete(`/api/v1/tests/${this.delete_paper_id}`)
        .then((response) => {
          this.delete_paper_id = null;
          this.deleteConfirmDialog = false;

          this.$toast.success("Deleted successfully");
          this.paper_list = [];
          this.getPaperList();
        })
        .catch((e) => {
          if (e.response.status == 400)
            this.$toast.error(e.response.data.message);

          this.delete_paper_id = null;
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
