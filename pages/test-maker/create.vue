<template>
  <v-container class="create-test-container">
    <v-row class="mt-4">
      <v-col cols="6">
        <h1 class="text-h4 text-teal">New Exam</h1>
      </v-col>
      <v-col cols="6" class="text-right">
        <v-btn
          variant="text"
          icon="mdi-file-pdf-box"
          size="small"
          @click="printPreviewDialog = true"
        />
        <v-btn
          variant="text"
          icon="mdi-printer"
          size="small"
          @click="printPreviewDialog = true"
        />
      </v-col>
    </v-row>

    <v-stepper-vertical
      :items="[
        { title: 'Header', value: 1 },
        { title: 'Tests', value: 2 },
        { title: 'Review', value: 3 },
        { title: 'Publish', value: 4 },
      ]"
      editable
      color="teal"
      hide-actions
    >
      <template #[`item.1`]>
        <v-card flat class="mt-4 pb-10">
          <v-form
            ref="observer"
            @submit.prevent="submitQuestion"
            v-model="isFormValid"
            class="pa-2"
          >
            <v-row>
              <v-col cols="12" md="4">
                <v-autocomplete
                  v-model="form.section"
                  :items="level_list"
                  item-title="title"
                  item-value="id"
                  label="Board"
                  variant="outlined"
                  :rules="[(v) => !!v || 'This field is required']"
                  color="orange"
                  density="compact"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="4">
                <v-autocomplete
                  v-model="form.base"
                  :items="grade_list"
                  item-title="title"
                  item-value="id"
                  label="Grade"
                  variant="outlined"
                  :rules="[(v) => !!v || 'This field is required']"
                  color="orange"
                  density="compact"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="4">
                <v-autocomplete
                  v-model="form.lesson"
                  :items="lesson_list"
                  item-title="title"
                  item-value="id"
                  label="Subject"
                  variant="outlined"
                  :rules="[(v) => !!v || 'This field is required']"
                  color="orange"
                  density="compact"
                ></v-autocomplete>
              </v-col>

              <v-col cols="12">
                <FormTopicSelector
                  ref="topicSelector"
                  :selectedTopics="selected_topics"
                  :topic-list="topic_list"
                  @selectTopic="selectTopic"
                />
              </v-col>

              <v-col cols="12" md="2">
                <v-autocomplete
                  v-model="form.exam_type"
                  :items="test_type_list"
                  item-title="title"
                  item-value="id"
                  label="Exam type"
                  variant="outlined"
                  color="orange"
                  density="compact"
                ></v-autocomplete>
              </v-col>

              <v-col cols="12" md="2">
                <v-text-field
                  v-model="form.duration"
                  type="number"
                  label="Test duration"
                  variant="outlined"
                  color="orange"
                  density="compact"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="2">
                <v-autocomplete
                  v-model="form.edu_year"
                  :items="year_list"
                  label="Year"
                  variant="outlined"
                  color="orange"
                  density="compact"
                ></v-autocomplete>
              </v-col>

              <v-col cols="12" md="2">
                <v-autocomplete
                  v-model="form.edu_month"
                  :items="month_list"
                  item-title="title"
                  item-value="id"
                  label="Month"
                  variant="outlined"
                  color="orange"
                  density="compact"
                ></v-autocomplete>
              </v-col>

              <v-col cols="12" md="4">
                <v-file-input
                  v-model="file_original"
                  label="Source file"
                  variant="outlined"
                  prepend-icon="mdi-paperclip"
                  @update:model-value="uploadFile"
                  accept="application/pdf,image/*"
                  density="compact"
                ></v-file-input>
              </v-col>

              <v-col cols="12" md="8">
                <v-text-field
                  v-model="form.title"
                  label="Title"
                  variant="outlined"
                  :rules="[(v) => !!v || 'This field is required']"
                  density="compact"
                ></v-text-field>
                <div class="text-caption text-grey">
                  Ex: 9700/11 Biology Jun 2020 Online Test | Cambridge AS & A
                  Level MSCO
                </div>
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.paperID"
                  label="Past Paper Id"
                  variant="outlined"
                  density="compact"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-btn
                      block
                      color="teal"
                      class="text-white"
                      size="large"
                      type="submit"
                      :loading="submit_loading"
                      style="
                        text-transform: none;
                        font-size: 13px;
                        font-weight: 500;
                      "
                      density="compact"
                    >
                      Next step
                    </v-btn>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-btn
                      block
                      variant="outlined"
                      color="red"
                      size="large"
                      to="/user/exam"
                      style="
                        text-transform: none;
                        font-size: 13px;
                        font-weight: 500;
                      "
                      density="compact"
                    >
                      Discard
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-form>
        </v-card>
      </template>

      <template #[`item.2`]>
        <v-card flat class="mt-3 pb-10">
          <v-row>
            <v-col cols="12">
              <v-switch
                color="teal"
                v-model="testListSwitch"
                label="I want to select from list"
                style="font-weight: 500; color: #009688"
              ></v-switch>
            </v-col>
          </v-row>

          <v-row v-show="!testListSwitch">
            <v-col cols="12">
              <CreateTestForm
                ref="createForm"
                v-model:goToPreviewStep="test_step"
                v-model:updateTestList="lastCreatedTest"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="6">
              <v-btn
                block
                color="teal"
                class="text-white"
                size="large"
                :disabled="tests.length < 5"
                @click="test_step = 3"
              >
                <span v-if="tests.length < 5"
                  >Add at least {{ 5 - tests.length }} more tests</span
                >
                <span v-else>Next step</span>
              </v-btn>
            </v-col>
            <v-col cols="12" md="6">
              <v-btn
                block
                variant="outlined"
                color="red"
                size="large"
                to="/user/exam"
              >
                Discard
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </template>

      <template #[`item.3`]>
        <v-card flat class="mt-3 pb-10">
          <v-row>
            <v-col cols="12">
              <h3 class="text-h5">{{ form.title }}</h3>
              <v-row>
                <v-col cols="4">Question's num: {{ tests.length }}</v-col>
                <v-col cols="4">Duration: {{ form.duration }}</v-col>
                <v-col cols="4">Level: {{ calcLevel(form.level) }}</v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-chip color="red" class="white--text">Topics:</v-chip>
                </v-col>
                <v-col
                  v-for="(item, index) in topicTitleArr"
                  :key="index"
                  cols="4"
                >
                  {{ item }}
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="12">
              <v-row>
                <v-col cols="12" md="6">
                  <v-btn
                    block
                    color="teal"
                    class="text-white"
                    size="large"
                    :loading="publish_loading"
                    @click="publishTest"
                  >
                    Publish
                  </v-btn>
                </v-col>
                <v-col cols="12" md="6">
                  <v-btn
                    block
                    variant="outlined"
                    color="red"
                    size="large"
                    to="/user/exam"
                  >
                    Discard
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </template>

      <template #[`item.4`]>
        <v-card flat class="mt-3 pb-10">
          <v-card-text class="text-center">
            <p class="text-h5 mb-4">Your test is ready to use!</p>
            <p>Send below link to your students or friends.</p>

            <div class="d-flex justify-center my-4">
              <v-text-field
                v-model="test_share_link"
                variant="outlined"
                density="compact"
                readonly
                style="max-width: 400px"
                class="mx-auto"
              >
                <template #append>
                  <v-btn icon variant="text" @click="copyUrl">
                    <v-icon>mdi-content-copy</v-icon>
                  </v-btn>
                </template>
              </v-text-field>
            </div>

            <p class="mt-3">
              To view the results of the participants, go to the following path:
            </p>

            <v-breadcrumbs
              :items="[
                { title: 'Dashboard', href: '/user' },
                { title: 'My online exam', href: '/exam/results' },
              ]"
              class="justify-center"
            >
              <template #divider>
                <v-icon>mdi-chevron-right</v-icon>
              </template>
            </v-breadcrumbs>
          </v-card-text>
        </v-card>
      </template>
    </v-stepper-vertical>

    <v-dialog v-model="confirmDeleteDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h5">
          Are you sure of deleting the online exam?
        </v-card-title>
        <v-card-text>
          If you are sure about the deletion, click Agree button.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green-darken-1"
            variant="text"
            @click="confirmDeleteDialog = false"
          >
            Disagree
          </v-btn>
          <v-btn
            color="green-darken-1"
            variant="text"
            :loading="deleteLoading"
            @click="deleteOnlineExam"
          >
            Agree
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteTestConfirmDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h5">Are you sure?</v-card-title>
        <v-card-text>
          <p>If you are sure to delete, click Yes.</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="deleteTestConfirmDialog = false"
            >No</v-btn
          >
          <v-btn
            color="green-darken-1"
            variant="text"
            :loading="delete_exam_test_loading"
            @click="deleteExamTest()"
          >
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="printPreviewDialog"
      fullscreen
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar color="teal" dark>
          <v-btn icon @click="printPrevipreviousewDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Preview</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn text @click="printPreviewDialog = false"> Close </v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <v-card-text>
          <!-- Print preview content -->
          <!-- Add print preview content here -->
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, reactive, watch, nextTick, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuth } from "~/composables/useAuth";
import { defineRule } from "vee-validate";
import { required } from "@vee-validate/rules";
import draggable from "vuedraggable";
import FormTopicSelector from "~/components/form/topic-selector.vue";
import CreateTestForm from "~/components/test-maker/create-test-form.vue";

// Define validation rules
defineRule("required", required);

// Define layout and page metadata
definePageMeta({
  layout: "test-maker-layout",
});

useHead({
  title: "New Exam",
});

// Get services
const auth = useAuth();
const route = useRoute();
const router = useRouter();
const userToken = ref("");

// Core data
const test_step = ref(1); // Start at first step
const exam_id = ref("");
const exam_code = ref("");
const submit_loading = ref(false);
const publish_loading = ref(false);
const test_loading = ref(false);
const all_tests_loaded = ref(false);
const tests = ref([]);
const timer = ref(null);
const observer = ref(null);
const topicSelector = ref(null);
const createForm = ref(null);
const mathJaxEl = ref(null);
const testList = ref(null);
const testListContent = ref(null);
const isFormValid = ref(false);

// Form data
const form = reactive({
  section: route.query.board ? route.query.board : "",
  base: route.query.grade ? route.query.grade : "",
  lesson: route.query.subject ? route.query.subject : "",
  topics: "",
  exam_type: "",
  level: "2",
  holding_time: false,
  state: "",
  area: "",
  school: "",
  duration: 3,
  title: "",
  paperID: route.query.paperId ? route.query.paperId : "",
  negative_point: false,
  file_original: "",
  holding_level: 4,
  edu_year: "",
  edu_month: "",
});

// Form errors for validation
const formErrors = reactive({
  section: "",
  base: "",
  lesson: "",
  topic: "",
  test_type: "",
  test_duration: "",
  title: "",
});

const file_original = ref(null);
const file_original_path = ref("");

// Filter data
const filter = reactive({
  section: "",
  base: "",
  lesson: "",
  topic: "",
  page: 1,
  perpage: 40,
  testsHasVideo: "",
  myTests: false,
});

// UI State
const printPreviewDialog = ref(false);
const confirmDeleteDialog = ref(false);
const deleteLoading = ref(false);
const previewTestList = ref([]);
const topicTitleArr = ref([]);
const testListSwitch = ref(false);
const lastCreatedTest = ref("");

// Delete exam test section
const deleteTestConfirmDialog = ref(false);
const delete_exam_test_id = ref(null);
const delete_exam_test_loading = ref(false);

// Data lists
const level_list = ref([]);
const filter_level_list = ref([]);
const grade_list = ref([]);
const filter_grade_list = ref([]);
const field_list = ref([]);
const lesson_list = ref([]);
const filter_lesson_list = ref([]);
const topic_list = ref([]);
const test_type_list = ref([]);
const test_list = ref([]);
const selected_topics = ref([]);

// Static data
const year_list = ref([
  2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013,
]);

const month_list = ref([
  { id: 1, title: "January" },
  { id: 2, title: "February" },
  { id: 3, title: "March" },
  { id: 4, title: "April" },
  { id: 5, title: "May" },
  { id: 6, title: "June" },
  { id: 7, title: "July" },
  { id: 8, title: "August" },
  { id: 9, title: "September" },
  { id: 10, title: "October" },
  { id: 11, title: "November" },
  { id: 12, title: "December" },
]);

const test_level_list = [
  { id: "1", title: "Simple" },
  { id: "2", title: "Medium" },
  { id: "3", title: "Hard" },
];

const video_analysis_options = [
  { value: 0, title: "All" },
  { value: 1, title: "Have" },
  { value: -1, title: "Do not have" },
];

const state_list = ref([]);
const area_list = ref([]);
const school_list = ref([]);

const holding_level_list = [
  { id: 1, title: "School" },
  { id: 2, title: "District" },
  { id: 3, title: "State" },
  { id: 4, title: "Country" },
];

// Compute the test share link based on the route params
const test_share_link = computed(() => {
  if (process.server) {
    // Return a consistent value during SSR to avoid hydration mismatch
    return `/exam/${exam_id.value || ""}`;
  }
  // Only use window.location on client side
  return `${window.location.origin}/exam/${exam_id.value || ""}`;
});

// Generate title function
const generateTitle = () => {
  let lesson_title = "";
  if (form.lesson && lesson_list.value.length > 0) {
    const lessonItem = lesson_list.value.find((x) => x.id === form.lesson);
    lesson_title = lessonItem?.title || "";
  }

  let base_title = "";
  if (form.base && grade_list.value.length > 0) {
    const baseItem = grade_list.value.find((x) => x.id === form.base);
    base_title = baseItem?.title || "";
  }

  form.title = `${lesson_title} Test ${base_title} Grade`;
};

// Return title of level for show in preview list
const calcLevel = (level) => {
  if (level) {
    const levelItem = test_level_list.find((x) => x.id === level);
    return levelItem ? levelItem.title : "";
  }
  return "";
};

// API methods
const getTypeList = async (type, parent = "", trigger = "") => {
  try {
    const params = {
      type: type,
    };

    if (type === "base") params.section_id = parent;
    if (type === "lesson") params.base_id = parent;
    if (type === "topic") params.lesson_id = parent;
    if (type === "area") params.state_id = parent;

    if (type === "school") {
      params.section_id = form.section;
      params.area_id = form.area;
    }

    const res = await $fetch("/api/v1/types/list", {
      method: "GET",
      params: params,
      headers: {
        Authorization: `Bearer ${userToken.value}`,
      },
    });

    if (res && res.data) {
      if (type === "section") {
        if (trigger === "filter") {
          filter_level_list.value = res.data;
        } else {
          level_list.value = res.data;
          filter_level_list.value = res.data;
        }
      } else if (type === "base") {
        if (trigger === "filter") {
          filter_grade_list.value = res.data;
        } else {
          grade_list.value = res.data;
          filter_grade_list.value = res.data;
        }
      } else if (type === "lesson") {
        if (trigger === "filter") {
          filter_lesson_list.value = res.data;
        } else {
          lesson_list.value = res.data;
          filter_lesson_list.value = res.data;
        }
      } else if (type === "topic") {
        topic_list.value = res.data;
      } else if (type === "exam_type") {
        test_type_list.value = res.data;
      } else if (type === "state") {
        state_list.value = res.data;
      } else if (type === "area") {
        area_list.value = res.data;
      } else if (type === "school") {
        school_list.value = res.data;
      }

      generateTitle();
    }
  } catch (err) {
    const { $toast } = useNuxtApp();
    if ($toast) $toast.error(err.message || "Error loading data");
    console.error(err);
  }
};

const selectTopic = (event) => {
  selected_topics.value = event;
  const numbers = [];
  for (let i = 0; i < event.length; i++) {
    numbers[i] = parseInt(event[i]);
  }
  form.topics = numbers;
  if (form.topics.length) getTopicTitleList();
};

const getTopicTitleList = () => {
  topicTitleArr.value = [];
  let title = "";
  for (const index in form.topics) {
    title =
      topic_list.value.find((x) => x.id == form.topics[index])?.title || "";
    topicTitleArr.value.push(title);
  }
};

const submitQuestion = async () => {
  submit_loading.value = true;

  // Arrange to form data
  let formData = new FormData();
  for (let key in form) {
    if (key !== "topics") formData.append(key, form[key]);
  }

  if (form.topics.length) {
    for (let key in form.topics) {
      formData.append("topics[]", form.topics[key]);
    }
  }

  try {
    const response = await $fetch("/api/v1/exams", {
      method: "POST",
      body: urlencodeFormData(formData),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${userToken.value}`,
      },
    });

    const { $toast } = useNuxtApp();
    if ($toast) $toast.success("Created successfully");

    exam_id.value = response.data.id;
    exam_code.value = response.data.code;

    // Set in store
    useState("user").value = {
      ...useState("user").value,
      currentExamId: exam_id.value,
      currentExamCode: exam_code.value,
    };

    if (createForm.value) {
      createForm.value.getCurrentExamInfo();
    }
    test_step.value = 2;
  } catch (error) {
    const { $toast } = useNuxtApp();
    if ($toast)
      $toast.error(error.response?.data?.message || "Error creating exam");
  } finally {
    submit_loading.value = false;
  }
};

// Convert form data from multipart to urlencode
const urlencodeFormData = (fd) => {
  let s = "";

  for (const pair of fd.entries()) {
    if (typeof pair[1] == "string") {
      s += (s ? "&" : "") + encode(pair[0]) + "=" + encode(pair[1]);
    }
  }
  return s;
};

const encode = (s) => {
  return encodeURIComponent(s).replace(/%20/g, "+");
};

const copyUrl = () => {
  navigator.clipboard.writeText(test_share_link.value);
  const { $toast } = useNuxtApp();
  if ($toast) $toast.success("Copied");
};

const uploadFile = async (files) => {
  // For v-file-input in Vue 3, files can be an array or single file object
  // Get the actual file from either an array or direct file object
  const fileToUpload = Array.isArray(files) ? files[0] : files;

  if (!fileToUpload) {
    console.error("No file found to upload");
    return;
  }

  const { $toast } = useNuxtApp();

  // Create a FormData object for the file upload
  const formData = new FormData();
  formData.append("file", fileToUpload);

  try {
    // Using async/await with proper error handling
    const response = await $fetch("/api/v1/upload", {
      method: "POST",
      body: formData,
      headers: {
        // Don't set Content-Type manually for FormData - let the browser set it with boundary
        Authorization: `Bearer ${userToken.value}`,
      },
    });

    // Check if we have a valid response with file data
    if (response?.data?.[0]?.file?.name) {
      form.file_original = response.data[0].file.name;
      if ($toast) $toast.success("File uploaded successfully");
    } else {
      if ($toast) $toast.error("Invalid response from server");
      console.error("Invalid upload response:", response);
    }
  } catch (err) {
    if ($toast) $toast.error("Failed to upload file");
    console.error("File upload error:", err);
  }
};

const publishTest = async () => {
  publish_loading.value = true;

  try {
    const response = await $fetch(`/api/v1/exams/publish/${exam_id.value}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${userToken.value}`,
      },
    });

    if (response.data.message === "done") {
      // Only use window.location on client side
      test_share_link.value = `${
        process.client ? window.location.origin : ""
      }/exam/${exam_id.value}`;

      // Reset values
      exam_id.value = "";
      exam_code.value = "";

      // Set in store
      useState("user").value = {
        ...useState("user").value,
        currentExamId: "",
        currentExamCode: "",
      };

      previewTestList.value = [];
      tests.value = [];

      // Reset form
      form.section = "";
      grade_list.value = [];
      lesson_list.value = [];
      topic_list.value = [];

      form.exam_type = "";
      form.duration = 3;
      form.title = "";
      form.file_original = "";

      test_step.value = 4;

      const { $toast } = useNuxtApp();
      if ($toast) $toast.success("Exam published successfully");
    }
  } catch (err) {
    const { $toast } = useNuxtApp();
    if ($toast) $toast.error(err.message || "Error publishing exam");
    console.error(err);
  } finally {
    publish_loading.value = false;
  }
};

// Helper functions for URL query handling
const checkActiveParam = () => {
  if (route.query.active) {
    if (route.query.active === "test_list") {
      testListSwitch.value = true;
      test_step.value = 2;
    } else if (route.query.active === "add_test") {
      testListSwitch.value = false;
      test_step.value = 2;
    }
  }
};

// Submit tests to the exam
const submitTest = async () => {
  if (tests.value.length === 0) return;

  let formData = new FormData();
  for (let i = 0; i < tests.value.length; i++) {
    formData.append("tests[]", tests.value[i]);
  }

  try {
    await $fetch(`/api/v1/exams/tests/${exam_id.value}`, {
      method: "PUT",
      body: urlencodeFormData(formData),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        Authorization: `Bearer ${userToken.value}`,
      },
    });

    // Get current exam tests after submission
    getExamCurrentTests();
  } catch (err) {
    const { $toast } = useNuxtApp();
    if ($toast) $toast.error(err.message || "Error updating exam tests");
    console.error(err);
  }
};

// Get current tests for the exam
const getExamCurrentTests = async () => {
  try {
    const response = await $fetch("/api/v1/examTests", {
      method: "GET",
      params: {
        exam_id: exam_id.value,
      },
      headers: {
        Authorization: `Bearer ${userToken.value}`,
      },
    });

    previewTestList.value = response.data.list;

    if (createForm.value) {
      createForm.value.examTestListLength = tests.value.length;
    }
  } catch (err) {
    console.error("Error getting exam tests:", err);
  }
};

// Get current exam information
const getCurrentExamInfo = async () => {
  const currentExamId = useState("user").value?.currentExamId;

  if (currentExamId) {
    exam_id.value = currentExamId;
    exam_code.value = useState("user").value?.currentExamCode || "";
    test_step.value = 2;

    try {
      const response = await $fetch(`/api/v1/exams/info/${exam_id.value}`, {
        headers: {
          Authorization: `Bearer ${userToken.value}`,
        },
      });

      tests.value = response.data.tests.length ? response.data.tests : [];

      form.section = response.data.section;
      form.base = response.data.base;
      form.lesson = response.data.lesson;
      file_original_path.value = response.data.file_original;

      // If we have test data, get the tests
      if (tests.value.length) {
        getExamCurrentTests();
      }
    } catch (err) {
      console.error("Error getting exam info:", err);
    }
  }
};

// Watchers
watch(
  () => lastCreatedTest.value,
  (val) => {
    if (val && !tests.value.find((x) => x == val)) {
      tests.value.push(val);
      submitTest();
    }
  }
);

watch(
  () => form.section,
  async (val) => {
    if (val) {
      await getTypeList("base", val);
      filter.section = val; // Init second level filter

      if (createForm.value) {
        createForm.value.form.section = val;
      }

      if (form.area) {
        await getTypeList("school");
      }
    }
  }
);

watch(
  () => form.base,
  async (val) => {
    if (val) {
      await getTypeList("lesson", val);
      filter.base = val; // Init second level filter

      if (createForm.value) {
        createForm.value.form.base = val;
      }

      generateTitle();
    }
  }
);

watch(
  () => form.lesson,
  async (val) => {
    if (val) {
      await getTypeList("topic", val);

      if (topicSelector.value) {
        topicSelector.value.lesson_selected = true;
      }
    } else {
      form.topic = [];
      topic_list.value = [];

      if (topicSelector.value) {
        topicSelector.value.lesson_selected = false;
      }
    }

    filter.lesson = val; // Init second level filter

    if (createForm.value) {
      createForm.value.form.lesson = val;
    }

    generateTitle();
  }
);

// Initialize on mount
onMounted(async () => {
  userToken.value = auth.getUserToken();

  await getCurrentExamInfo();
  await getTypeList("section");

  if (form.base) {
    await getTypeList("base", form.section);
  }

  if (form.lesson) {
    await getTypeList("lesson", form.base);
    await getTypeList("topic", form.lesson);
  }

  await getTypeList("exam_type");
  await getTypeList("state");

  // Handle active query parameter for test list / add test
  checkActiveParam();
});

// Open delete confirmation dialog
const openTestDeleteConfirmDialog = (item_id) => {
  delete_exam_test_id.value = item_id;
  deleteTestConfirmDialog.value = true;
};

// Delete exam test
const deleteExamTest = async () => {
  delete_exam_test_loading.value = true;

  try {
    await $fetch(`/api/v1/examTests/${delete_exam_test_id.value}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${userToken.value}`,
      },
    });

    const { $toast } = useNuxtApp();
    if ($toast) $toast.success("Deleted successfully");

    // Remove from tests array
    const index = tests.value.findIndex(
      (id) => id === delete_exam_test_id.value
    );
    if (index !== -1) {
      tests.value.splice(index, 1);
    }

    // Refresh test lists
    filter.page = 1;
    test_list.value = [];
    getExamTests();
  } catch (err) {
    const { $toast } = useNuxtApp();
    if ($toast) $toast.error(err.message || "Error deleting test");
    console.error("Error deleting exam test:", err);
  } finally {
    delete_exam_test_loading.value = false;
    delete_exam_test_id.value = null;
    deleteTestConfirmDialog.value = false;
  }
};

// Get exam tests
const getExamTests = async () => {
  if (all_tests_loaded.value) return;

  test_loading.value = true;

  try {
    const response = await $fetch("/api/v1/examTests", {
      method: "GET",
      params: {
        lesson: filter.lesson,
        topic: filter.topic,
        myTests: filter.myTests,
        testsHasVideo: filter.testsHasVideo,
        page: filter.page,
        perpage: filter.perpage,
      },
      headers: {
        Authorization: `Bearer ${userToken.value}`,
      },
    });

    test_list.value.push(...response.data.list);

    if (createForm.value) {
      createForm.value.examTestListLength = tests.value.length;
    }

    // If no more tests, mark as loaded
    if (response.data.list.length === 0) {
      all_tests_loaded.value = true;
    } else {
      all_tests_loaded.value = false;
    }
  } catch (err) {
    console.error("Error getting exam tests:", err);
  } finally {
    test_loading.value = false;
  }
};

// Delete entire exam handling
const openDeleteConfirmDialog = () => {
  confirmDeleteDialog.value = true;
};

const deleteOnlineExam = async () => {
  deleteLoading.value = true;

  try {
    await $fetch(`/api/v1/exams/${exam_id.value}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${userToken.value}`,
      },
    });

    // Reset all values
    exam_id.value = "";
    exam_code.value = "";

    // Update store
    useState("user").value = {
      ...useState("user").value,
      currentExamId: "",
      currentExamCode: "",
    };

    // Reset form and data
    previewTestList.value = [];
    tests.value = [];

    form.section = "";
    grade_list.value = [];
    lesson_list.value = [];
    topic_list.value = [];

    form.exam_type = "";
    form.duration = 3;
    form.title = "";
    form.file_original = "";

    // Reset to first step
    test_step.value = 1;

    const { $toast } = useNuxtApp();
    if ($toast) $toast.success("Deleted successfully");
  } catch (err) {
    const { $toast } = useNuxtApp();
    if ($toast) $toast.error(err.message || "Error deleting exam");
    console.error("Error deleting exam:", err);
  } finally {
    deleteLoading.value = false;
    confirmDeleteDialog.value = false;
  }
};
</script>

<style lang="scss">
.create-test-container {
  max-width: 1200px;
  margin: 5rem auto;
  padding-bottom: 80px; // Space for fixed bottom bar
}

.topics-container {
  border-radius: 4px;
  padding: 16px;
}

// Make sure this matches the design in the image
.v-stepper {
  box-shadow: none !important;
  background-color: #f9f9f9;
  display: contents;

  &__step {
    &--active {
      color: teal !important;
    }

    &--complete {
      color: teal !important;
    }
  }
}
.v-stepper-vertical-item__title {
  font-size: 1.5rem;
  font-weight: 500;
}
</style>
