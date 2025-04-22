<template>
  <div>
    <v-col cols="12" class="px-0 px-sm-2">
      <v-row>
        <v-col cols="12" class="pl-5">
          <!-- <span class="icon icong-test text-h3 teal--text"></span> -->
          <span class="text-h4 text-teal"> My Past Papers List </span>
        </v-col>
      </v-row>

      <!--Filter section-->
      <v-row class="d-none d-md-flex">
        <v-col cols="12" md="3">
          <v-autocomplete
            density="compact"
            variant="outlined"
            v-model="filter.level"
            clearable
            :items="level_list"
            item-title="title"
            item-value="id"
            label="Curriculum"
            @update:model-value="filterChanged('level')"
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-autocomplete
            density="compact"
            variant="outlined"
            v-model="filter.grade"
            clearable
            :items="grade_list"
            item-value="id"
            item-title="title"
            label="Grade"
            @update:model-value="filterChanged('grade')"
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-autocomplete
            density="compact"
            variant="outlined"
            :items="lesson_list"
            item-value="id"
            item-title="title"
            v-model="filter.lesson"
            clearable
            label="Subject"
            @update:model-value="filterChanged('lesson')"
          />
        </v-col>
      </v-row>
      <!--End filter section-->

      <v-card class="mt-3">
        <v-card-title class="text-h4">
          <v-row>
            <v-col cols="12" class="text-left">
              <v-btn
                to="/user/paper/create"
                color="teal"
                variant="flat"
                class="text-white"
              >
                New Paper
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text class="px-sm-8 px-md-4">
          <v-row>
            <v-col cols="12" class="px-0 px-sm-4 px-md-4">
              <v-table class="content_table">
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
                    v-for="(item, index) in paper_list"
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
                      <div class="d-flex justify-center">
                        <v-tooltip location="bottom">
                          <template v-slot:activator="{ props }">
                            <v-btn
                              icon
                              color="green"
                              :to="`/paper/${item.id}`"
                              target="_blank"
                              v-bind="props"
                              class="mx-1"
                              variant="plain"
                            >
                              <v-icon> mdi-eye </v-icon>
                            </v-btn>
                          </template>
                          <span>View</span>
                        </v-tooltip>
                        <v-tooltip location="bottom">
                          <template v-slot:activator="{ props }">
                            <v-btn
                              icon
                              v-bind="props"
                              :to="`/user/paper/edit/${item.id}`"
                              class="mx-1"
                              variant="plain"
                            >
                              <v-icon> mdi-note-edit-outline </v-icon>
                            </v-btn>
                          </template>
                          <span>Edit</span>
                        </v-tooltip>
                        <v-tooltip location="bottom">
                          <template v-slot:activator="{ props }">
                            <v-btn
                              icon
                              color="error"
                              @click="openDeleteConfirmDialog(item.id, index)"
                              v-bind="props"
                              class="mx-1"
                              variant="plain"
                            >
                              <v-icon> mdi-delete </v-icon>
                            </v-btn>
                          </template>
                          <span>Delete</span>
                        </v-tooltip>
                      </div>
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
                  <tr v-show="all_files_loaded && paper_list.length > 0">
                    <td colspan="7" class="text-center py-2">
                      <span class="text-caption text-grey"
                        >No more papers to load</span
                      >
                    </td>
                  </tr>
                </tbody>
              </v-table>
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

          <v-btn variant="text" @click="deleteConfirmDialog = false">
            No
          </v-btn>

          <v-btn
            color="green-darken-1"
            variant="text"
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

<script setup>
// Core imports
import { useAuth } from "#imports";

// Define layout and page metadata
definePageMeta({
  layout: "dashboard-layout",
});

// Use services
const router = useRouter();
const auth = useAuth();
const { $auth, $toast } = useNuxtApp();

// Page title
useHead({
  title: "Paper manage",
});

// Reactive state
const paper_list = ref([]);

// Filter section
const filter = reactive({
  level: "",
  grade: "",
  lesson: "",
});

const level_list = ref([]);
const grade_list = ref([]);
const field_list = ref([]);
const lesson_list = ref([]);

// Paginate section
const page_loading = ref(false);
const page = ref(1);
const all_files_loaded = ref(false);
const timer = ref(null);

// Delete section
const deleteConfirmDialog = ref(false);
const delete_paper_id = ref(null);
const delete_loading = ref(false);

// Methods
const getPaperList = () => {
  if (!all_files_loaded.value) {
    page_loading.value = true;

    // Direct token in the request headers
    $fetch("/api/v1/tests", {
      method: "GET",
      params: {
        perpage: 20,
        page: page.value,
        section: filter.level,
        base: filter.grade,
        lesson: filter.lesson,
      },
      headers: {
        Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiNDU5MSIsImlkZW50aXR5IjoiYWxiZXJkYXRydG9uZUBnbWFpbC5jb20iLCJncm91cF9pZCI6IjUiLCJzZXNzaW9uX2lkIjoiMGNjOGJhZDJkOGVjOWEyYTgxZmU5NzY0NDFjM2NiNGEzZjEwNmE3MSIsImNvdW50cnkiOiJERSIsImNpdHkiOiJGcmFua2Z1cnQgYW0gTWFpbiIsImlzcyI6Imh0dHBzOlwvXC9jb3JlLmdhbWF0cmFpbi5jb21cLyIsImF1ZCI6Imh0dHBzOlwvXC9jb3JlLmdhbWF0cmFpbi5jb21cLyIsImlhdCI6MTc0NDk5OTA5MiwiZXhwIjoxNzQ3NTkxMDkyfQ.6tycb6a9X1IxaZ9DiTDvO5zJC16Zeno8w6vpiXArvYY`,
      },
    })
      .then((response) => {
        paper_list.value.push(...response.data.list);

        if (
          response.data.num &&
          paper_list.value.length >= Number(response.data.num)
        ) {
          all_files_loaded.value = true;
        }

        // Handle case where no more items are returned
        if (response.data.list.length === 0) {
          all_files_loaded.value = true;
        }
      })
      .catch((err) => {
        // Handle the error directly from the catch block
        if (err.response?.status === 403) $auth.logout();
      })
      .finally(() => {
        page_loading.value = false;
      });
  }
};

const calcStatus = (val) => {
  let title = "";
  if (val == 0) title = "Unreviewed";
  else if (val == 1) title = "Confirmed";
  else if (val == 2) title = "Reference to type unit";
  else if (val == 3) title = "Has a message";
  else if (val == 4) title = "Inactive";
  else if (val == 5) title = "Edited";
  return title;
};

const getTypeList = (type, parent = "") => {
  const params = { type };

  if (type === "base") params.section_id = parent;
  if (type === "lesson") params.base_id = parent;

  $fetch("/api/v1/types/list", {
    method: "GET",
    params,
    headers: {
      Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiNDU5MSIsImlkZW50aXR5IjoiYWxiZXJkYXRydG9uZUBnbWFpbC5jb20iLCJncm91cF9pZCI6IjUiLCJzZXNzaW9uX2lkIjoiMGNjOGJhZDJkOGVjOWEyYTgxZmU5NzY0NDFjM2NiNGEzZjEwNmE3MSIsImNvdW50cnkiOiJERSIsImNpdHkiOiJGcmFua2Z1cnQgYW0gTWFpbiIsImlzcyI6Imh0dHBzOlwvXC9jb3JlLmdhbWF0cmFpbi5jb21cLyIsImF1ZCI6Imh0dHBzOlwvXC9jb3JlLmdhbWF0cmFpbi5jb21cLyIsImlhdCI6MTc0NDk5OTA5MiwiZXhwIjoxNzQ3NTkxMDkyfQ.6tycb6a9X1IxaZ9DiTDvO5zJC16Zeno8w6vpiXArvYY`,
    },
  })
    .then((response) => {
      // Process the direct response
      if (type === "section") {
        level_list.value = response.data;
      } else if (type === "base") {
        grade_list.value = response.data;
      } else if (type === "lesson") {
        lesson_list.value = response.data;
      }
    })
    .catch((err) => {
      $toast.error(err.message || "Error loading data");
    });
};

const scroll = () => {
  //For infinite loading
  window.onscroll = () => {
    // Don't proceed if all files are loaded
    if (all_files_loaded.value) {
      return;
    }

    //Scroll position
    const scrollPosition =
      Math.max(
        window.pageYOffset,
        document.documentElement.scrollTop,
        document.body.scrollTop
      ) +
      window.innerHeight +
      50;
    const bottomOfWindow =
      scrollPosition >= document.documentElement.offsetHeight;

    //Avoid the number of requests
    if (timer.value) {
      clearTimeout(timer.value);
      timer.value = null;
    }

    //Load next page
    if (bottomOfWindow && all_files_loaded.value === false) {
      page_loading.value = true;
      timer.value = setTimeout(() => {
        page.value++;
        getPaperList();
      }, 800);
    }
  };
};

const filterChanged = (type) => {
  if (type == "level") {
    filter.grade = "";
    filter.lesson = "";
    if (filter.level) getTypeList("base", filter.level);

    page.value = 1;
    all_files_loaded.value = false;

    grade_list.value = [];
    lesson_list.value = [];
    paper_list.value = [];

    getPaperList();
  } else if (type == "grade") {
    filter.lesson = "";
    if (filter.grade) getTypeList("lesson", filter.grade);

    page.value = 1;
    all_files_loaded.value = false;
    paper_list.value = [];
    lesson_list.value = [];
    getPaperList();
  } else if (type == "lesson") {
    page.value = 1;
    all_files_loaded.value = false;
    paper_list.value = [];
    getPaperList();
  }
};
const delete_paper_index = ref(null);
const openDeleteConfirmDialog = (item_id, index) => {
  delete_paper_id.value = item_id;
  delete_paper_index.value = index;
  deleteConfirmDialog.value = true;
};

const deletePaper = async () => {
  delete_loading.value = true;

  try {
    // Use $fetch instead of useFetch for consistency
    await $fetch(`/api/v1/tests/${delete_paper_id.value}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiNDU5MSIsImlkZW50aXR5IjoiYWxiZXJkYXRydG9uZUBnbWFpbC5jb20iLCJncm91cF9pZCI6IjUiLCJzZXNzaW9uX2lkIjoiMGNjOGJhZDJkOGVjOWEyYTgxZmU5NzY0NDFjM2NiNGEzZjEwNmE3MSIsImNvdW50cnkiOiJERSIsImNpdHkiOiJGcmFua2Z1cnQgYW0gTWFpbiIsImlzcyI6Imh0dHBzOlwvXC9jb3JlLmdhbWF0cmFpbi5jb21cLyIsImF1ZCI6Imh0dHBzOlwvXC9jb3JlLmdhbWF0cmFpbi5jb21cLyIsImlhdCI6MTc0NDk5OTA5MiwiZXhwIjoxNzQ3NTkxMDkyfQ.6tycb6a9X1IxaZ9DiTDvO5zJC16Zeno8w6vpiXArvYY`,
      },
    });
    paper_list.value.splice(delete_paper_index.value, 1);
    delete_paper_id.value = null;
    delete_paper_index.value = null;
    deleteConfirmDialog.value = false;
    $toast.success("Deleted successfully");
    // paper_list.value = [];
    // getPaperList();
  } catch (e) {
    if (e.response?.status == 400) {
      $toast.error(e.response.data.message || "Error deleting paper");
    }

    delete_paper_id.value = null;
    delete_paper_index.value = null;
    deleteConfirmDialog.value = false;
  } finally {
    delete_loading.value = false;
  }
};

// Initialize on mount
onMounted(() => {
  getPaperList();
  getTypeList("section");
  scroll();
});
</script>

<style scoped>
p {
  font-size: 1.4rem;
}
</style>
