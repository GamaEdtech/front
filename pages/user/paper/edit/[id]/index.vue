<template>
  <div cols="12" class="px-2 px-sm-2 mt-8">
    <!-- Main loader overlay -->
    <template v-if="isLoading">
      <v-skeleton-loader
        type="article, article, table"
        class="my-4"
      ></v-skeleton-loader>
    </template>

    <template v-else>
      <v-row>
        <v-col cols="12" class="pl-5">
          <span class="text-h4 text-teal"> Past Papers Edit Form </span>
        </v-col>
      </v-row>
      <v-card class="mt-3">
        <v-card-text class="py-10 px-8">
          <VForm
            ref="form"
            v-model="isFormValid"
            @submit.prevent="updateQuestion"
            lazy-validation
          >
            <v-row>
              <v-col cols="12" md="4">
                <v-autocomplete
                  required
                  density="compact"
                  variant="outlined"
                  v-model="formData.section"
                  :items="section_list"
                  :rules="[(v) => !!v || 'Board is required']"
                  item-title="title"
                  item-value="id"
                  label="Board"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-autocomplete
                  required
                  density="compact"
                  variant="outlined"
                  v-model="formData.base"
                  :items="grade_list"
                  :rules="[(v) => !!v || 'Grade is required']"
                  item-value="id"
                  item-title="title"
                  label="Grade"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-autocomplete
                  required
                  density="compact"
                  variant="outlined"
                  :items="lesson_list"
                  :rules="[(v) => !!v || 'Subject is required']"
                  item-value="id"
                  item-title="title"
                  v-model="formData.lesson"
                  label="Subject"
                />
              </v-col>
              <v-col cols="12" md="12">
                <form-topic-selector
                  ref="topicSelectorRef"
                  :topic-list="topic_list"
                  :selectedTopics="formData.topics"
                  @selectTopic="selectTopic"
                  v-if="topic_list.length > 0"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-autocomplete
                  density="compact"
                  variant="outlined"
                  :items="test_type_list"
                  item-value="id"
                  item-title="title"
                  v-model="formData.test_type"
                  label="Test type"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-autocomplete
                  required
                  density="compact"
                  variant="outlined"
                  :items="answer_status_list"
                  :rules="[
                    (v) =>
                      (v !== null && v !== undefined && v !== '') ||
                      v === 0 ||
                      'Answer status is required',
                  ]"
                  item-value="id"
                  item-title="title"
                  v-model="formData.answer_type"
                  label="Answer status"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-autocomplete
                  density="compact"
                  variant="outlined"
                  :items="test_level_list"
                  item-value="id"
                  item-title="title"
                  v-model="formData.level"
                  label="Level"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-autocomplete
                  required
                  density="compact"
                  variant="outlined"
                  :items="year_list"
                  :rules="[(v) => !!v || 'Year is required']"
                  v-model="formData.edu_year"
                  label="Year"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-autocomplete
                  required
                  density="compact"
                  variant="outlined"
                  :items="month_list"
                  :rules="[(v) => !!v || 'Month is required']"
                  v-model="formData.edu_month"
                  item-title="title"
                  item-value="id"
                  label="Month"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-autocomplete
                  density="compact"
                  variant="outlined"
                  :items="holding_level_list"
                  v-model="formData.holding_level"
                  item-title="title"
                  item-value="id"
                  label="Holding level"
                />
              </v-col>

              <v-col cols="12" md="4" v-if="formData.holding_level < 4">
                <v-autocomplete
                  density="compact"
                  variant="outlined"
                  :items="state_list"
                  v-model="formData.state"
                  item-title="title"
                  item-value="id"
                  label="State"
                />
              </v-col>
              <v-col cols="12" md="4" v-if="formData.holding_level < 3">
                <v-autocomplete
                  density="compact"
                  variant="outlined"
                  :items="area_list"
                  v-model="formData.area"
                  item-title="title"
                  item-value="id"
                  label="Area"
                />
              </v-col>
              <v-col cols="12" md="4" v-if="formData.holding_level < 2">
                <v-autocomplete
                  density="compact"
                  variant="outlined"
                  :items="school_list"
                  v-model="formData.school"
                  item-title="title"
                  item-value="id"
                  label="School"
                />
              </v-col>

              <v-col cols="12" md="12">
                <v-text-field
                  required
                  density="compact"
                  variant="outlined"
                  v-model="formData.title"
                  :rules="[(v) => !!v || 'Title is required']"
                  label="Title"
                />
              </v-col>
              <v-col cols="12" md="12">
                <v-textarea
                  required
                  density="compact"
                  variant="outlined"
                  v-model="formData.description"
                  :rules="[
                    (v) => !!v || 'Description is required',
                    (v) =>
                      (v && v.length >= 70) ||
                      'Description must be at least 70 characters',
                  ]"
                  label="Describe"
                  hint="You must enter at least 70 characters."
                  persistent-hint
                  placeholder="Write a brief description about the files to help the user make an informed choice"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-file-input
                  density="compact"
                  variant="outlined"
                  v-model="file_pdf"
                  :prepend-icon="null"
                  accept="application/pdf"
                  label="Pdf question & answer file"
                  color="red"
                  :loading="file_pdf_loading"
                  @change="uploadFile('file_pdf', $event)"
                  prepend-inner-icon="mdi-file-pdf-box"
                  append-inner-icon="mdi-folder-open"
                >
                  <template #append>
                    <v-icon
                      @click="startDownload('q_pdf')"
                      v-show="paperData?.files?.pdf?.exist || formData.file_pdf"
                      color="red"
                      size="x-large"
                    >
                      mdi-download
                    </v-icon>
                  </template>
                </v-file-input>
              </v-col>
              <v-col cols="12" md="4">
                <v-file-input
                  density="compact"
                  variant="outlined"
                  v-model="file_word"
                  label="Word question & answer file"
                  :prepend-icon="null"
                  accept="application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  :loading="file_word_loading"
                  color="blue"
                  @change="uploadFile('file_word', $event)"
                  prepend-inner-icon="mdi-file-word-outline"
                  append-inner-icon="mdi-folder-open"
                >
                  <template #append>
                    <v-icon
                      color="teal"
                      @click="startDownload('q_word')"
                      v-show="
                        paperData?.files?.word?.exist || formData.file_word
                      "
                      size="x-large"
                    >
                      mdi-download
                    </v-icon>
                  </template>
                </v-file-input>
              </v-col>

              <v-col cols="12" md="4">
                <v-file-input
                  density="compact"
                  variant="outlined"
                  v-model="file_answer"
                  label="Answer file"
                  :prepend-icon="null"
                  accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  :loading="file_answer_loading"
                  color="default"
                  @change="uploadFile('file_answer', $event)"
                  prepend-inner-icon="mdi-file"
                  append-inner-icon="mdi-folder-open"
                >
                  <template #append>
                    <v-icon
                      color="blue"
                      @click="startDownload('a_file')"
                      v-show="
                        paperData?.files?.answer?.exist || formData.file_answer
                      "
                      size="x-large"
                    >
                      mdi-download
                    </v-icon>
                  </template>
                </v-file-input>
              </v-col>

              <v-col cols="12" v-if="extraAttr.length">
                <v-row v-for="(item, index) in extraAttr" :key="index">
                  <v-col cols="12" md="4">
                    <v-autocomplete
                      :items="extra_type_list"
                      variant="outlined"
                      density="compact"
                      v-model="item.type"
                      item-title="title"
                      item-value="id"
                      label="Select file type"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-file-input
                      density="compact"
                      variant="outlined"
                      label="Select file"
                      :prepend-icon="null"
                      :loading="file_extra_loading"
                      color="green"
                      v-model="item.file_extra"
                      @change="
                        (event) => uploadFile('file_extra', event, index)
                      "
                      prepend-inner-icon="mdi-plus"
                      append-inner-icon="mdi-folder-open"
                    >
                      <template #append>
                        <v-icon
                          v-show="item.id && item.file"
                          @click="startDownload('extra', item.id)"
                          size="x-large"
                        >
                          mdi-download
                        </v-icon>
                      </template>
                    </v-file-input>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12">
                <v-btn variant="outlined" color="success" @click="addExtraAttr">
                  <v-icon> mdi-plus </v-icon>
                  Add Solution video
                </v-btn>
              </v-col>
              <v-col cols="12" md="12">
                <v-checkbox
                  density="compact"
                  v-model="formData.free_agreement"
                  label="I would like the file to be freely available to others."
                />
              </v-col>

              <v-col cols="12" md="6" class="pb-0">
                <v-btn
                  color="primary"
                  type="submit"
                  block
                  :loading="loading.form"
                  :disabled="!isFormValid"
                >
                  Update
                </v-btn>
              </v-col>

              <v-col cols="12" md="6">
                <v-btn variant="outlined" color="error" to="/user/paper" block>
                  Discard
                </v-btn>
              </v-col>
            </v-row>
          </VForm>
        </v-card-text>
      </v-card>
    </template>
  </div>
</template>

<script setup>
const { $auth, $toast } = useNuxtApp();

// Define layout
definePageMeta({
  layout: "dashboard-layout",
});

// Page title
useHead({
  title: "Edit paper",
});

// Get services
const router = useRouter();
const route = useRoute();

// Form validation
const form = ref(null);
const isFormValid = ref(true);
const topicSelectorRef = ref(null);
const isLoading = ref(true); // Global loading state

// Reactive state
const formData = reactive({
  section: "",
  base: "",
  lesson: "",
  topics: "",
  test_type: "",
  answer_type: 0,
  level: "",
  edu_year: "",
  edu_month: "",
  holding_level: "",
  title: "",
  description: "",
  state: "",
  area: "",
  school: "",
  free_agreement: false,
  file_pdf: "",
  file_word: "",
  file_answer: "",
});

// File section
const file_pdf = ref(null);
const file_word = ref(null);
const file_answer = ref(null);

const file_pdf_loading = ref(false);
const file_word_loading = ref(false);
const file_answer_loading = ref(false);
const file_extra_loading = ref(false);

// Lists
const section_list = ref([]);
const grade_list = ref([]);
const field_list = ref([]);
const lesson_list = ref([]);
const topic_list = ref([]);
const test_type_list = ref([]);

const answer_status_list = [
  { id: 0, title: "No answer" },
  { id: 1, title: "Has key answer" },
  { id: 2, title: "Has descriptive answer" },
];

const test_level_list = [
  { id: "1", title: "Simple" },
  { id: "2", title: "Medium" },
  { id: "3", title: "Hard" },
];

const year_list = [
  2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013,
];

const month_list = [
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
];

const holding_level_list = [
  { id: 1, title: "School" },
  { id: 2, title: "District" },
  { id: 3, title: "State" },
  { id: 4, title: "Country" },
];

const state_list = ref([]);
const area_list = ref([]);
const school_list = ref([]);
const extraAttr = ref([]);
const extra_type_list = ref([]);

const download_loading = ref(false);
const loading = reactive({
  form: false,
});

// Fetch paper data
const { data: paperData } = await useAsyncData("paper-data", async () => {
  try {
    const content = await useFetch(`/api/v1/tests/${route.params.id}`, {
      headers: {
        Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiNDU5MSIsImlkZW50aXR5IjoiYWxiZXJkYXRydG9uZUBnbWFpbC5jb20iLCJncm91cF9pZCI6IjUiLCJzZXNzaW9uX2lkIjoiMGNjOGJhZDJkOGVjOWEyYTgxZmU5NzY0NDFjM2NiNGEzZjEwNmE3MSIsImNvdW50cnkiOiJERSIsImNpdHkiOiJGcmFua2Z1cnQgYW0gTWFpbiIsImlzcyI6Imh0dHBzOlwvXC9jb3JlLmdhbWF0cmFpbi5jb21cLyIsImF1ZCI6Imh0dHBzOlwvXC9jb3JlLmdhbWF0cmFpbi5jb21cLyIsImlhdCI6MTc0NDk5OTA5MiwiZXhwIjoxNzQ3NTkxMDkyfQ.6tycb6a9X1IxaZ9DiTDvO5zJC16Zeno8w6vpiXArvYY`,
      },
    });
    if (content.data.value.status === 1) {
      return content.data.value.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching paper data:", error);
    return null;
  }
});

// Methods
const changeOption = (optionName, optionVal) => {
  if (optionName === "section") {
    formData.base = "";
    formData.lesson = "";
    formData.topics = [];
    grade_list.value = [];
    lesson_list.value = [];
    topic_list.value = [];

    if (topicSelectorRef.value) {
      topicSelectorRef.value.lesson_selected = false;
    }

    getTypeList("base", optionVal);
    if (formData.area) getTypeList("school");

    if (topicSelectorRef.value) {
      topicSelectorRef.value.lesson_selected = false;
    }
  } else if (optionName === "base") {
    formData.lesson = "";
    if (optionVal) {
      getTypeList("lesson", optionVal);
    }
    if (topicSelectorRef.value) {
      topicSelectorRef.value.lesson_selected = false;
    }
  } else if (optionName === "lesson") {
    if (optionVal) {
      getTypeList("topic", optionVal);
      if (topicSelectorRef.value) {
        topicSelectorRef.value.lesson_selected = true;
      }
    } else {
      formData.topics = [];
      topic_list.value = [];
      if (topicSelectorRef.value) {
        topicSelectorRef.value.lesson_selected = false;
      }
    }
  } else if (optionName === "state") {
    getTypeList("area", optionVal);
  } else if (optionName === "area") {
    getTypeList("school");
  }
};

const getTypeList = async (type, parent = "") => {
  const params = { type };

  if (type === "base") params.section_id = parent;
  if (type === "lesson") params.base_id = parent;
  if (type === "topic") params.lesson_id = parent;
  if (type === "area") params.state_id = parent;

  if (type === "school") {
    params.section_id = formData.section;
    params.area_id = formData.area;
  }

  try {
    const response = await useFetch("/api/v1/types/list", {
      method: "GET",
      params,
      headers: {
        Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiNDU5MSIsImlkZW50aXR5IjoiYWxiZXJkYXRydG9uZUBnbWFpbC5jb20iLCJncm91cF9pZCI6IjUiLCJzZXNzaW9uX2lkIjoiMGNjOGJhZDJkOGVjOWEyYTgxZmU5NzY0NDFjM2NiNGEzZjEwNmE3MSIsImNvdW50cnkiOiJERSIsImNpdHkiOiJGcmFua2Z1cnQgYW0gTWFpbiIsImlzcyI6Imh0dHBzOlwvXC9jb3JlLmdhbWF0cmFpbi5jb21cLyIsImF1ZCI6Imh0dHBzOlwvXC9jb3JlLmdhbWF0cmFpbi5jb21cLyIsImlhdCI6MTc0NDk5OTA5MiwiZXhwIjoxNzQ3NTkxMDkyfQ.6tycb6a9X1IxaZ9DiTDvO5zJC16Zeno8w6vpiXArvYY`,
      },
    });

    if (type === "section") {
      section_list.value = response.data.value.data;
    } else if (type === "base") {
      grade_list.value = response.data.value.data;
    } else if (type === "lesson") {
      lesson_list.value = response.data.value.data;
    } else if (type === "topic") {
      topic_list.value = response.data.value.data;
    } else if (type === "test_type") {
      test_type_list.value = response.data.value.data;
    } else if (type === "state") {
      state_list.value = response.data.value.data;
    } else if (type === "area") {
      area_list.value = response.data.value.data;
    } else if (type === "school") {
      school_list.value = response.data.value.data;
    }

    return response.data.value.data;
  } catch (err) {
    $toast.error(err);
    return [];
  }
};

const getExtraFileType = async () => {
  try {
    const response = await useFetch("/api/v1/types/list", {
      method: "GET",
      params: {
        type: "test_extra_file",
      },
      headers: {
        Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiNDU5MSIsImlkZW50aXR5IjoiYWxiZXJkYXRydG9uZUBnbWFpbC5jb20iLCJncm91cF9pZCI6IjUiLCJzZXNzaW9uX2lkIjoiMGNjOGJhZDJkOGVjOWEyYTgxZmU5NzY0NDFjM2NiNGEzZjEwNmE3MSIsImNvdW50cnkiOiJERSIsImNpdHkiOiJGcmFua2Z1cnQgYW0gTWFpbiIsImlzcyI6Imh0dHBzOlwvXC9jb3JlLmdhbWF0cmFpbi5jb21cLyIsImF1ZCI6Imh0dHBzOlwvXC9jb3JlLmdhbWF0cmFpbi5jb21cLyIsImlhdCI6MTc0NDk5OTA5MiwiZXhwIjoxNzQ3NTkxMDkyfQ.6tycb6a9X1IxaZ9DiTDvO5zJC16Zeno8w6vpiXArvYY`,
      },
    });
    extra_type_list.value = response.data.value.data;
    return response.data.value.data;
  } catch (error) {
    console.error("Error fetching extra file types:", error);
    return [];
  }
};

const updateQuestion = async () => {
  loading.form = true;

  // Arrange to form data
  let formSubmitData = new FormData();
  for (let key in formData) {
    if (!(key === "topics" || key === "file_extra")) {
      formSubmitData.append(key, formData[key]);
    }
  }

  if (
    formData.topics &&
    Array.isArray(formData.topics) &&
    formData.topics.length
  ) {
    for (let key in formData.topics) {
      formSubmitData.append("topics[]", formData.topics[key]);
    }
  }

  if (extraAttr.value.length) {
    for (let key in extraAttr.value) {
      formSubmitData.append(
        "file_extra[]",
        JSON.stringify(extraAttr.value[key])
      );
    }
  }

  try {
    const response = await useFetch(`/api/v1/tests/${route.params.id}`, {
      method: "PUT",
      body: urlencodeFormData(formSubmitData),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiNDU5MSIsImlkZW50aXR5IjoiYWxiZXJkYXRydG9uZUBnbWFpbC5jb20iLCJncm91cF9pZCI6IjUiLCJzZXNzaW9uX2lkIjoiMGNjOGJhZDJkOGVjOWEyYTgxZmU5NzY0NDFjM2NiNGEzZjEwNmE3MSIsImNvdW50cnkiOiJERSIsImNpdHkiOiJGcmFua2Z1cnQgYW0gTWFpbiIsImlzcyI6Imh0dHBzOlwvXC9jb3JlLmdhbWF0cmFpbi5jb21cLyIsImF1ZCI6Imh0dHBzOlwvXC9jb3JlLmdhbWF0cmFpbi5jb21cLyIsImlhdCI6MTc0NDk5OTA5MiwiZXhwIjoxNzQ3NTkxMDkyfQ.6tycb6a9X1IxaZ9DiTDvO5zJC16Zeno8w6vpiXArvYY`,
      },
    });

    if (response.data.value.data.id == 0 && response.data.value.data.repeated) {
      $toast.info("The paper is duplicated");
    } else {
      $toast.success("Updated successfully");
      router.push({
        path: "/user/paper",
      });
    }
  } catch (err) {
    if (err.response?.status == 403) {
      router.push({ query: { auth_form: "login" } });
    } else if (err.response?.status == 400) {
      $toast.error(err.response.data.message);
    }
  } finally {
    loading.form = false;
  }
};

// Convert form data from multipart to urlencode
const urlencodeFormData = (fd) => {
  let s = "";
  for (let pair of fd.entries()) {
    if (typeof pair[1] == "string") {
      s += (s ? "&" : "") + encode(pair[0]) + "=" + encode(pair[1]);
    }
  }
  return s;
};

const encode = (s) => {
  return encodeURIComponent(s).replace(/%20/g, "+");
};

const selectTopic = (event) => {
  formData.topics = event;
};

const uploadFile = async (file_name, ev, index = "") => {
  let value;
  if (ev && ev.target && ev.target.files) {
    value = ev.target.files[0];
  } else if (ev instanceof File) {
    value = ev;
  } else if (Array.isArray(ev) && ev.length > 0) {
    value = ev[0];
  } else {
    return;
  }

  if (!value) {
    console.error("No valid file found");
    return;
  }

  let fileFormData = new FormData();

  try {
    if (file_name == "file_pdf") {
      if (
        !value.type.includes("pdf") &&
        !value.name.toLowerCase().endsWith(".pdf")
      ) {
        $toast.error("Please upload a valid PDF file");
        file_pdf.value = null;
        return;
      }

      const isPdf =
        value.type.includes("pdf") || value.name.toLowerCase().endsWith(".pdf");

      if (!isPdf) {
        $toast.error("Please upload a valid PDF file");
        file_pdf.value = null;
        return;
      }

      file_pdf_loading.value = true;
      loading.form = true;
      fileFormData.append("file", value);
    } else if (file_name == "file_word") {
      if (
        !value.type.includes("word") &&
        !value.name.toLowerCase().endsWith(".doc") &&
        !value.name.toLowerCase().endsWith(".docx")
      ) {
        $toast.error("Please upload a valid Word document");
        file_word.value = null;
        return;
      }

      const isWord =
        value.type.includes("word") ||
        value.name.toLowerCase().endsWith(".doc") ||
        value.name.toLowerCase().endsWith(".docx");

      if (!isWord) {
        $toast.error("Please upload a valid Word document");
        file_word.value = null;
        return;
      }

      file_word_loading.value = true;
      loading.form = true;
      fileFormData.append("file", value);
    } else if (file_name == "file_answer") {
      const isPdf =
        value.type.includes("pdf") || value.name.toLowerCase().endsWith(".pdf");
      const isWord =
        value.type.includes("word") ||
        value.name.toLowerCase().endsWith(".doc") ||
        value.name.toLowerCase().endsWith(".docx");

      if (!isPdf && !isWord) {
        file_answer.value = null;
        return;
      }

      file_answer_loading.value = true;
      loading.form = true;
      fileFormData.append("file", value);
    } else if (file_name == "file_extra") {
      file_extra_loading.value = true;
      fileFormData.append("file", value);
    }

    const response = await useFetch("/api/v1/upload", {
      method: "POST",
      body: fileFormData,
      headers: {
        Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiNDU5MSIsImlkZW50aXR5IjoiYWxiZXJkYXRydG9uZUBnbWFpbC5jb20iLCJncm91cF9pZCI6IjUiLCJzZXNzaW9uX2lkIjoiMGNjOGJhZDJkOGVjOWEyYTgxZmU5NzY0NDFjM2NiNGEzZjEwNmE3MSIsImNvdW50cnkiOiJERSIsImNpdHkiOiJGcmFua2Z1cnQgYW0gTWFpbiIsImlzcyI6Imh0dHBzOlwvXC9jb3JlLmdhbWF0cmFpbi5jb21cLyIsImF1ZCI6Imh0dHBzOlwvXC9jb3JlLmdhbWF0cmFpbi5jb21cLyIsImlhdCI6MTc0NDk5OTA5MiwiZXhwIjoxNzQ3NTkxMDkyfQ.6tycb6a9X1IxaZ9DiTDvO5zJC16Zeno8w6vpiXArvYY`,
      },
    });

    if (file_name == "file_pdf")
      formData.file_pdf = response.data.value.data[0].file.name;
    else if (file_name == "file_word")
      formData.file_word = response.data.value.data[0].file.name;
    else if (file_name == "file_answer")
      formData.file_answer = response.data.value.data[0].file.name;
    else if (file_name == "file_extra") {
      if (extraAttr.value[index]) {
        extraAttr.value[index].file = response.data.value.data[0].file.name;
      }
    }
  } catch (err) {
    if (err.response?.status == 403) {
      const auth = useAuth();
      auth.logout();
    } else $toast.error("Upload failed. Please try again.");
  } finally {
    file_pdf_loading.value = false;
    file_word_loading.value = false;
    file_answer_loading.value = false;
    file_extra_loading.value = false;
    loading.form = false;
  }
};

const addExtraAttr = () => {
  extraAttr.value.push({ type: "", file: null, file_extra: null });
};

const applyExtraType = (value, index) => {
  extraAttr.value[index].type = value;
};

const initData = async () => {
  if (!paperData.value) return;

  formData.section = paperData.value.section;
  if (formData.section) {
    // Load grade list
    await getTypeList("base", formData.section);

    // Only set base after grade list is loaded
    formData.base = paperData.value.base;

    if (formData.base) {
      // Load lesson list
      await getTypeList("lesson", formData.base);

      // Only set lesson after lesson list is loaded
      formData.lesson = paperData.value.lesson;

      if (formData.lesson) {
        await getTypeList("topic", formData.lesson);
      }
    }
  }

  if (paperData.value.topic) {
    formData.topics = paperData.value.topic.split("+");
  }

  formData.test_type = paperData.value.test_type;
  formData.answer_type = parseInt(paperData.value.answer_type || 0);
  formData.level = paperData.value.level;
  formData.edu_year = parseInt(paperData.value.edu_year);
  formData.edu_month = parseInt(paperData.value.edu_month);
  formData.holding_level = parseInt(paperData.value.holding_level || 4);
  formData.title = paperData.value.title;
  formData.description = paperData.value.description;

  // Set free agreement
  formData.free_agreement = paperData.value.free_agreement == 1;

  if (paperData.value.files?.extra) {
    for (let index in paperData.value.files.extra) {
      extraAttr.value.push({
        type: paperData.value.files.extra[index].type,
        id: paperData.value.files.extra[index].id,
      });
    }
  }
};

// Setup watchers
watch(
  () => formData.section,
  (val) => {
    formData.base = "";
    formData.lesson = "";
    formData.topics = [];
    grade_list.value = [];
    lesson_list.value = [];
    topic_list.value = [];

    getTypeList("base", val);
    if (formData.area) getTypeList("school");
  }
);

watch(
  () => formData.base,
  (val) => {
    formData.lesson = "";
    if (val) getTypeList("lesson", val);
  }
);

watch(
  () => formData.lesson,
  (val) => {
    if (val) {
      getTypeList("topic", val);
      if (topicSelectorRef.value) {
        topicSelectorRef.value.lesson_selected = true;
      }
    } else {
      formData.topics = [];
      topic_list.value = [];
      if (topicSelectorRef.value) {
        topicSelectorRef.value.lesson_selected = false;
      }
    }
  }
);

watch(
  () => formData.state,
  (val) => {
    getTypeList("area", val);
  }
);

watch(
  () => formData.area,
  () => {
    getTypeList("school");
  }
);

const startDownload = (type, extra_id = "") => {
  const auth = useAuth();
  if (auth.loggedIn) {
    download_loading.value = true;
    let apiUrl = "";

    if (type === "q_word") {
      apiUrl = `/api/v1/tests/download/${route.params.id}/word`;
    } else if (type === "q_pdf") {
      apiUrl = `/api/v1/tests/download/${route.params.id}/pdf`;
    } else if (type === "a_file") {
      apiUrl = `/api/v1/tests/download/${route.params.id}/answer`;
    } else if (type === "extra") {
      apiUrl = `/api/v1/tests/download/${route.params.id}/extra/${extra_id}`;
    }

    useFetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiNDU5MSIsImlkZW50aXR5IjoiYWxiZXJkYXRydG9uZUBnbWFpbC5jb20iLCJncm91cF9pZCI6IjUiLCJzZXNzaW9uX2lkIjoiMGNjOGJhZDJkOGVjOWEyYTgxZmU5NzY0NDFjM2NiNGEzZjEwNmE3MSIsImNvdW50cnkiOiJERSIsImNpdHkiOiJGcmFua2Z1cnQgYW0gTWFpbiIsImlzcyI6Imh0dHBzOlwvXC9jb3JlLmdhbWF0cmFpbi5jb21cLyIsImF1ZCI6Imh0dHBzOlwvXC9jb3JlLmdhbWF0cmFpbi5jb21cLyIsImlhdCI6MTc0NDk5OTA5MiwiZXhwIjoxNzQ3NTkxMDkyfQ.6tycb6a9X1IxaZ9DiTDvO5zJC16Zeno8w6vpiXArvYY`,
      },
    })
      .then((response) => {
        var FileSaver = require("file-saver");
        FileSaver.saveAs(
          response.data.value.data.url,
          response.data.value.data.name
        );
      })
      .catch((err) => {
        if (err.response?.status == 400) {
          if (
            err.response.data.status == 0 &&
            err.response.data.error == "creditNotEnough"
          ) {
            $toast.info("No enough credit");
          }
        } else if (err.response?.status == 403) {
          router.push({ query: { auth_form: "login" } });
        }
      })
      .finally(() => {
        download_loading.value = false;
      });
  } else {
    router.push({ query: { auth_form: "login" } });
  }
};

// Initialize on mount
onMounted(async () => {
  isLoading.value = true;
  try {
    await getTypeList("section");
    await getTypeList("test_type");
    await getTypeList("state");
    await getExtraFileType();
    await initData();
  } catch (error) {
    console.error("Error during initialization:", error);
    $toast.error("Error loading form data. Please try again.");
  } finally {
    // Hide the loading state whether successful or not
    isLoading.value = false;
  }
});
</script>

<style>
.submission-notice {
  line-height: 2rem;
  background-color: #ffefe5 !important;
}

.submission-notice .v-alert__icon.v-icon {
  color: white !important;
  padding: 2rem;
  border-radius: 0.5rem;
  background-color: #ff6600;
}

.notice_item {
  font-size: 1.4rem;
  line-height: 2.2rem;
  list-style-type: none;
  color: black;
  padding-left: 0 !important;
}

.notice_item li {
  margin-bottom: 1rem;
}

.notice_item li:before {
  font-family: "Font Awesome 5 Free";
  font-size: 2rem;
  color: #ffc700ff;
  content: "\f0a4";
  font-weight: 900;
}

.topic_season {
  font-weight: bolder !important;
  color: blue !important;
}

.loader-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
