<template>
  <div cols="12" class="px-0 px-sm-2 mt-4">
    <!-- <v-row>
        <v-col cols="12" class="pl-5">
          <span class="icon icong-test text-h3 teal--text"></span>
          <span class="text-h4 teal--text"> Paper submission form </span>
        </v-col>
      </v-row> -->
    <v-card class="mt-3">
      <v-card-text class="py-10 px-8">
        <Form @submit="onSubmit">
          <v-row>
            <v-col cols="12" md="4">
              <Field v-slot="{ errors }" name="section" rules="required">
                <v-autocomplete
                  density="compact"
                  variant="outlined"
                  v-model="form.section"
                  :items="section_list"
                  :error-messages="errors"
                  item-title="title"
                  item-value="id"
                  label="Board"
                />
              </Field>
            </v-col>
            <v-col cols="12" md="4">
              <Field v-slot="{ errors }" name="grade" rules="required">
                <v-autocomplete
                  density="compact"
                  variant="outlined"
                  v-model="form.base"
                  :items="grade_list"
                  item-value="id"
                  item-title="title"
                  :error-messages="errors"
                  label="Grade"
                />
              </Field>
            </v-col>
            <v-col cols="12" md="4">
              <Field v-slot="{ errors }" name="lesson" rules="required">
                <v-autocomplete
                  density="compact"
                  variant="outlined"
                  :items="lesson_list"
                  item-value="id"
                  item-title="title"
                  v-model="form.lesson"
                  :error-messages="errors"
                  label="Subject"
                />
              </Field>
            </v-col>
            <v-col cols="12" md="12">
              <topic-selector
                ref="topicSelectorRef"
                :topic-list="topic_list"
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
                v-model="form.test_type"
                label="Test type"
              />
            </v-col>
            <v-col cols="12" md="4">
              <Field v-slot="{ errors }" name="answer_type" rules="required">
                <v-autocomplete
                  density="compact"
                  variant="outlined"
                  :items="answer_status_list"
                  item-value="id"
                  item-title="title"
                  v-model="form.answer_type"
                  label="Answer status"
                  :error-messages="errors"
                />
              </Field>
            </v-col>
            <v-col cols="12" md="4">
              <v-autocomplete
                density="compact"
                variant="outlined"
                :items="test_level_list"
                item-value="id"
                item-title="title"
                v-model="form.level"
                label="Level"
              />
            </v-col>
            <v-col cols="12" md="4">
              <Field v-slot="{ errors }" name="edu_year" rules="required">
                <v-autocomplete
                  density="compact"
                  variant="outlined"
                  :items="year_list"
                  v-model="form.edu_year"
                  :error-messages="errors"
                  label="Year"
                />
              </Field>
            </v-col>
            <v-col cols="12" md="4">
              <Field v-slot="{ errors }" name="edu_month" rules="required">
                <v-autocomplete
                  density="compact"
                  variant="outlined"
                  :items="month_list"
                  v-model="form.edu_month"
                  item-title="title"
                  item-value="id"
                  :error-messages="errors"
                  label="Month"
                />
              </Field>
            </v-col>
            <v-col cols="12" md="4">
              <v-autocomplete
                density="compact"
                variant="outlined"
                :items="holding_level_list"
                v-model="form.holding_level"
                item-title="title"
                item-value="id"
                label="Holding level"
              />
            </v-col>

            <v-col cols="12" md="4" v-if="form.holding_level < 4">
              <v-autocomplete
                density="compact"
                variant="outlined"
                :items="state_list"
                v-model="form.state"
                item-title="title"
                item-value="id"
                label="State"
              />
            </v-col>
            <v-col cols="12" md="4" v-if="form.holding_level < 3">
              <v-autocomplete
                density="compact"
                variant="outlined"
                :items="area_list"
                v-model="form.area"
                item-title="title"
                item-value="id"
                label="Area"
              />
            </v-col>
            <v-col cols="12" md="4" v-if="form.holding_level < 2">
              <v-autocomplete
                density="compact"
                variant="outlined"
                :items="school_list"
                v-model="form.school"
                item-title="title"
                item-value="id"
                label="School"
              />
            </v-col>

            <v-col cols="12" md="12">
              <Field v-slot="{ errors }" name="title" rules="required">
                <v-text-field
                  density="compact"
                  variant="outlined"
                  v-model="form.title"
                  :error-messages="errors"
                  label="Title"
                />
              </Field>
            </v-col>
            <v-col cols="12" md="12">
              <Field
                v-slot="{ errors }"
                name="description"
                rules="required|min:70"
              >
                <v-textarea
                  density="compact"
                  variant="outlined"
                  v-model="form.description"
                  :error-messages="errors"
                  label="Describe"
                  hint="You must enter at least 70 characters."
                  persistent-hint
                  placeholder="Write a brief description about the files to help the user make an informed choice"
                />
              </Field>
            </v-col>
            <v-col cols="12" md="4">
              <Field
                v-slot="{ validate, errors }"
                ref="file_pdf_provider"
                name="pdf_question_answer_file"
                rules="required|mimes:application/pdf"
              >
                <v-file-input
                  density="compact"
                  variant="outlined"
                  v-model="file_pdf"
                  :error-messages="errors"
                  :prepend-icon="null"
                  accept="application/pdf"
                  ref="file_pdf_provider"
                  label="Pdf question & answer file"
                  color="red"
                  :loading="file_pdf_loading"
                  @change="uploadFile('file_pdf', $event), validate"
                  prepend-inner-icon="mdi-file-pdf-box"
                  append-icon="mdi-folder-open"
                />
              </Field>
            </v-col>
            <v-col cols="12" md="4">
              <Field
                v-slot="{ validate, errors }"
                name="file_word"
                ref="file_word_provider"
                rules="mimes:application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              >
                <v-file-input
                  density="compact"
                  variant="outlined"
                  v-model="file_word"
                  label="Word question & answer file"
                  :prepend-icon="null"
                  :error-messages="errors"
                  accept="application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  :loading="file_word_loading"
                  color="blue"
                  @change="uploadFile('file_word', $event), validate"
                  prepend-inner-icon="mdi-file-word-outline"
                  append-icon="mdi-folder-open"
                />
              </Field>
            </v-col>

            <v-col cols="12" md="4">
              <Field
                v-slot="{ validate, errors }"
                name="file_answer"
                ref="file_answer_provider"
                rules="mimes:application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              >
                <v-file-input
                  density="compact"
                  variant="outlined"
                  v-model="file_answer"
                  label="Answer file"
                  :prepend-icon="null"
                  :error-messages="errors"
                  accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  :loading="file_answer_loading"
                  color="default"
                  @change="uploadFile('file_answer', $event), validate"
                  prepend-inner-icon="mdi-file"
                  append-icon="mdi-folder-open"
                />
              </Field>
            </v-col>

            <v-col cols="12" v-if="extraAttr.length">
              <v-row v-for="(item, index) in extraAttr" :key="index">
                <v-col cols="12" md="4">
                  <v-autocomplete
                    :items="extra_type_list"
                    variant="outlined"
                    density="compact"
                    :value="item.type"
                    @input="applyExtraType($event, index)"
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
                    :value="item.file_extra"
                    @change="uploadFile('file_extra', $event, index)"
                    prepend-inner-icon="mdi-plus"
                    append-icon="mdi-folder-open"
                  />
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
              <Field v-slot="{ errors }" name="word_question_answer_file">
                <v-checkbox
                  density="compact"
                  v-model="form.free_agreement"
                  :error-messages="errors"
                  label="I would like the file to be freely available to others."
                />
              </Field>
            </v-col>

            <v-col cols="12" md="6" class="pb-0">
              <v-btn
                color="primary"
                type="submit"
                block
                :loading="loading.form"
                :disabled="false"
              >
                Submit
              </v-btn>
            </v-col>
            <v-col cols="12" md="6">
              <v-btn variant="outlined" color="error" to="/user/paper" block>
                Discard
              </v-btn>
            </v-col>
          </v-row>
        </Form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import {
  Form,
  Field,
  useForm,
  useFieldValue,
  useIsFieldValid,
  defineRule,
} from "vee-validate";
import TopicSelector from "@/components/form/topic-selector";
import { ref, reactive, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useState } from "#app";
import { useNuxtApp } from "#app";

// Define rules manually
defineRule("required", (value) => {
  if (!value || (Array.isArray(value) && !value.length)) {
    return "This field is required";
  }
  return true;
});

defineRule("min", (value, [limit]) => {
  if (!value || !value.length) {
    return true;
  }
  if (value.length < limit) {
    return `This field must be at least ${limit} characters`;
  }
  return true;
});

defineRule("mimes", (value, [expectedTypes]) => {
  if (!value) return true;

  const fileTypes = expectedTypes.split(",");
  const fileType = value.type;

  return fileTypes.includes(fileType) || "Invalid file type";
});

// Define page metadata
definePageMeta({
  layout: "dashboard-layout",
});

useHead({
  title: "Add paper",
});

// Get services
const router = useRouter();
const userState = useState("user", () => ({
  lastSelectedCurriculum: "",
  lastSelectedGrade: "",
  lastSelectedSubject: "",
  lastSelectedHoldingLevel: 4,
}));
const { $toast, $auth } = useNuxtApp();

// Setup form validation
const { handleSubmit, errors } = useForm({
  validationSchema: {
    section: "required",
    base: "required",
    lesson: "required",
    title: "required",
    description: "required|min:70",
    edu_year: "required",
    edu_month: "required",
    answer_type: "required",
    file_pdf: "required|mimes:application/pdf",
  },
});

const onSubmit = handleSubmit((values) => {
  submitQuestion();
});

// Refs for validation
const file_pdf_provider = ref(null);
const file_word_provider = ref(null);
const file_answer_provider = ref(null);
const topicSelectorRef = ref(null);

// Form data
const form = reactive({
  section: "",
  base: "",
  lesson: "",
  topics: "",
  test_type: "",
  answer_type: 0,
  level: 2,
  year: "",
  month: "",
  holding_level: userState.value.lastSelectedHoldingLevel
    ? userState.value.lastSelectedHoldingLevel
    : 4,
  state: "",
  area: "",
  school: "",
  file_pdf: "",
  file_word: "",
  file_answer: "",
  free_agreement: 0,
  edu_year: "",
  edu_month: "",
});

// File section
const file_pdf = ref(null);
const file_word = ref(null);
const file_answer = ref(null);

const file_pdf_loading = ref(false);
const file_word_loading = ref(false);
const file_answer_loading = ref(false);
const file_extra_loading = ref(false);

// Lists for dropdowns
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
  { id: 1, title: "Simple" },
  { id: 2, title: "Medium" },
  { id: 3, title: "Hard" },
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

const loading = reactive({
  form: false,
});

// Methods
const getTypeList = async (type, parent = "") => {
  const params = { type };

  if (type === "base") params.section_id = parent;
  if (type === "lesson") params.base_id = parent;
  if (type === "topic") params.lesson_id = parent;
  if (type === "area") params.state_id = parent;

  if (type === "school") {
    params.section_id = form.section;
    params.area_id = form.area;
  }

  try {
    const response = await $fetch("/api/v1/types/list", {
      method: "GET",
      params,
      headers: {
        Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiNDU5MSIsImlkZW50aXR5IjoiYWxiZXJkYXRydG9uZUBnbWFpbC5jb20iLCJncm91cF9pZCI6IjUiLCJzZXNzaW9uX2lkIjoiMGNjOGJhZDJkOGVjOWEyYTgxZmU5NzY0NDFjM2NiNGEzZjEwNmE3MSIsImNvdW50cnkiOiJERSIsImNpdHkiOiJGcmFua2Z1cnQgYW0gTWFpbiIsImlzcyI6Imh0dHBzOlwvXC9jb3JlLmdhbWF0cmFpbi5jb21cLyIsImF1ZCI6Imh0dHBzOlwvXC9jb3JlLmdhbWF0cmFpbi5jb21cLyIsImlhdCI6MTc0NDk5OTA5MiwiZXhwIjoxNzQ3NTkxMDkyfQ.6tycb6a9X1IxaZ9DiTDvO5zJC16Zeno8w6vpiXArvYY`,
      },
    });

    console.log("type", type);
    console.log("response", response);

    if (type === "section") {
      section_list.value = response.data;
      form.section = userState.value.lastSelectedCurriculum
        ? userState.value.lastSelectedCurriculum
        : "";
    } else if (type === "base") {
      grade_list.value = response.data;
      form.base = userState.value.lastSelectedGrade
        ? userState.value.lastSelectedGrade
        : "";
    } else if (type === "lesson") {
      lesson_list.value = response.data;
      form.lesson = userState.value.lastSelectedSubject
        ? userState.value.lastSelectedSubject
        : "";
    } else if (type === "topic") {
      topic_list.value = response.data;
    } else if (type === "test_type") {
      test_type_list.value = response.data;
    } else if (type === "state") {
      state_list.value = response.data;
    } else if (type === "area") {
      area_list.value = response.data;
    } else if (type === "school") {
      school_list.value = response.data;
    }
  } catch (err) {
    $toast.error(err);
  }
};

const getExtraFileType = async () => {
  try {
    const response = await $fetch("/api/v1/types/list", {
      method: "GET",
      params: {
        type: "test_extra_file",
      },
      headers: {
        Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiNDU5MSIsImlkZW50aXR5IjoiYWxiZXJkYXRydG9uZUBnbWFpbC5jb20iLCJncm91cF9pZCI6IjUiLCJzZXNzaW9uX2lkIjoiMGNjOGJhZDJkOGVjOWEyYTgxZmU5NzY0NDFjM2NiNGEzZjEwNmE3MSIsImNvdW50cnkiOiJERSIsImNpdHkiOiJGcmFua2Z1cnQgYW0gTWFpbiIsImlzcyI6Imh0dHBzOlwvXC9jb3JlLmdhbWF0cmFpbi5jb21cLyIsImF1ZCI6Imh0dHBzOlwvXC9jb3JlLmdhbWF0cmFpbi5jb21cLyIsImlhdCI6MTc0NDk5OTA5MiwiZXhwIjoxNzQ3NTkxMDkyfQ.6tycb6a9X1IxaZ9DiTDvO5zJC16Zeno8w6vpiXArvYY`,
      },
    });
    extra_type_list.value = response.data;
  } catch (error) {
    console.error(error);
  }
};

const submitQuestion = async () => {
  loading.form = true;
  //Arrange to form data
  let formData = new FormData();
  for (let key in form) {
    if (!(key == "topics" || key == "file_extra"))
      formData.append(key, form[key]);
  }

  if (form.topics.length)
    for (let key in form.topics) formData.append("topics[]", form.topics[key]);

  if (extraAttr.value.length)
    for (let key in extraAttr.value)
      formData.append("file_extra[]", JSON.stringify(extraAttr.value[key]));

  //End arrange to form data

  try {
    const response = await $fetch("/api/v1/tests", {
      method: "POST",
      body: urlencodeFormData(formData),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiNDU5MSIsImlkZW50aXR5IjoiYWxiZXJkYXRydG9uZUBnbWFpbC5jb20iLCJncm91cF9pZCI6IjUiLCJzZXNzaW9uX2lkIjoiMGNjOGJhZDJkOGVjOWEyYTgxZmU5NzY0NDFjM2NiNGEzZjEwNmE3MSIsImNvdW50cnkiOiJERSIsImNpdHkiOiJGcmFua2Z1cnQgYW0gTWFpbiIsImlzcyI6Imh0dHBzOlwvXC9jb3JlLmdhbWF0cmFpbi5jb21cLyIsImF1ZCI6Imh0dHBzOlwvXC9jb3JlLmdhbWF0cmFpbi5jb21cLyIsImlhdCI6MTc0NDk5OTA5MiwiZXhwIjoxNzQ3NTkxMDkyfQ.6tycb6a9X1IxaZ9DiTDvO5zJC16Zeno8w6vpiXArvYY`,
      },
    });

    if (response.data.id == 0 && response.data.repeated)
      $toast.info("The paper is duplicated");
    else {
      $toast.success("Submit successfully");
      router.push({
        path: "/user/paper",
      });
    }
  } catch (err) {
    if (err.response?.status == 403) $auth.logout();
    else if (err.response?.status == 400)
      $toast.error(err.response.data.message);
  } finally {
    loading.form = false;
  }
};

//Convert form data from multipart to urlencode
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
  form.topics = event;
};

const uploadFile = async (file_name, value, index = "") => {
  if (!value)
    //Check empty request
    return;

  let formData = new FormData();

  if (file_name == "file_pdf") {
    const { valid } = await file_pdf_provider.value.validate(value);
    if (!valid) return;

    formData.append("file", value);
    file_pdf_loading.value = true;
    loading.form = true;
  } else if (file_name == "file_word") {
    const { valid } = await file_word_provider.value.validate(value);
    if (!valid) return;

    formData.append("file", value);
    file_word_loading.value = true;
    loading.form = true;
  } else if (file_name == "file_answer") {
    const { valid } = await file_answer_provider.value.validate(value);
    if (!valid) return;

    formData.append("file", value);
    file_answer_loading.value = true;
    loading.form = true;
  } else if (file_name == "file_extra") {
    formData.append("file", value);
    // file_extra_loading.value = true;
  }

  try {
    const response = await $fetch("/api/v1/upload", {
      method: "POST",
      body: formData,
      headers: {
        accept: "*/*",
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiNDU5MSIsImlkZW50aXR5IjoiYWxiZXJkYXRydG9uZUBnbWFpbC5jb20iLCJncm91cF9pZCI6IjUiLCJzZXNzaW9uX2lkIjoiMGNjOGJhZDJkOGVjOWEyYTgxZmU5NzY0NDFjM2NiNGEzZjEwNmE3MSIsImNvdW50cnkiOiJERSIsImNpdHkiOiJGcmFua2Z1cnQgYW0gTWFpbiIsImlzcyI6Imh0dHBzOlwvXC9jb3JlLmdhbWF0cmFpbi5jb21cLyIsImF1ZCI6Imh0dHBzOlwvXC9jb3JlLmdhbWF0cmFpbi5jb21cLyIsImlhdCI6MTc0NDk5OTA5MiwiZXhwIjoxNzQ3NTkxMDkyfQ.6tycb6a9X1IxaZ9DiTDvO5zJC16Zeno8w6vpiXArvYY`,
      },
    });

    if (file_name == "file_pdf") form.file_pdf = response.data[0].file.name;
    else if (file_name == "file_word")
      form.file_word = response.data[0].file.name;
    else if (file_name == "file_answer")
      form.file_answer = response.data[0].file.name;
    else if (file_name == "file_extra")
      extraAttr.value[index].file = response.data[0].file.name;
  } catch (err) {
    if (err.response?.status == 403) $auth.logout();
  } finally {
    file_pdf_loading.value = false;
    file_word_loading.value = false;
    file_answer_loading.value = false;
    loading.form = false;
  }
};

const addExtraAttr = () => {
  extraAttr.value.push({ type: "", file: null });
};

const applyExtraType = (value, index) => {
  extraAttr.value[index].type = value;
};

// Watch for changes
watch(
  () => form.section,
  (val) => {
    userState.value.lastSelectedCurriculum = val;
    form.base = "";
    form.lesson = "";
    form.topics = [];
    grade_list.value = [];
    lesson_list.value = [];
    topic_list.value = [];

    getTypeList("base", val);
    if (form.area) getTypeList("school");
  }
);

watch(
  () => form.base,
  (val) => {
    userState.value.lastSelectedGrade = val;
    form.lesson = "";
    if (val) getTypeList("lesson", val);
  }
);

watch(
  () => form.lesson,
  (val) => {
    userState.value.lastSelectedSubject = val;
    if (val) {
      getTypeList("topic", val);
      if (topicSelectorRef.value) {
        topicSelectorRef.value.lesson_selected = true;
      }
    } else {
      form.topic = [];
      topic_list.value = [];
      if (topicSelectorRef.value) {
        topicSelectorRef.value.lesson_selected = false;
      }
    }
  }
);

watch(
  () => form.holding_level,
  (val) => {
    userState.value.lastSelectedHoldingLevel = val;
  }
);

watch(
  () => form.state,
  (val) => {
    getTypeList("area", val);
  }
);

watch(
  () => form.area,
  (val) => {
    getTypeList("school");
  }
);

watch(
  () => form.free_agreement,
  (val) => {
    form.free_agreement = val ? 1 : 0;
  }
);

// Initialize on mount
onMounted(() => {
  getTypeList("section");
  getTypeList("test_type");
  getTypeList("state");
  getExtraFileType();
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
</style>
