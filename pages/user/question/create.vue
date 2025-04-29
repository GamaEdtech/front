<template>
  <div id="question-submit-form" class="mt-4">
    <v-col cols="12" class="px-0 px-sm-2">
      <v-row>
        <v-col cols="12" class="pl-5">
          <span class="text-h4" style="color: #009688">
            Forum Submission Form</span
          >
        </v-col>
      </v-row>
      <v-card class="mt-3">
        <v-card-text class="px-0 px-sm-8 px-md-4">
          <v-card-text>
            <v-card flat class="mt-3">
              <VForm
                ref="form"
                v-model="isFormValid"
                @submit.prevent="onSubmit"
                lazy-validation
              >
                <v-row class="py-1">
                  <v-col cols="12" md="3">
                    <v-autocomplete
                      required
                      density="compact"
                      variant="outlined"
                      v-model="formData.section"
                      :items="section_list"
                      :rules="[(v) => !!v || 'This field is required']"
                      item-title="title"
                      item-value="id"
                      label="Board"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-autocomplete
                      required
                      density="compact"
                      variant="outlined"
                      v-model="formData.base"
                      :items="grade_list"
                      :rules="[(v) => !!v || 'This field is required']"
                      item-value="id"
                      item-title="title"
                      label="Grade"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-autocomplete
                      required
                      density="compact"
                      variant="outlined"
                      :items="lesson_list"
                      :rules="[(v) => !!v || 'This field is required']"
                      item-value="id"
                      item-title="title"
                      v-model="formData.lesson"
                      label="Subject"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-autocomplete
                      required
                      density="compact"
                      variant="outlined"
                      :items="topic_list"
                      :rules="[(v) => !!v || 'This field is required']"
                      item-value="id"
                      item-title="title"
                      v-model="formData.topics"
                      @update:model-value="changeOption('topic', $event)"
                      label="Topics"
                    />
                  </v-col>

                  <v-col cols="12" md="12">
                    <v-text-field
                      required
                      density="compact"
                      variant="outlined"
                      v-model="formData.title"
                      :rules="[
                        (v) => !!v || 'This field is required',
                        (v) =>
                          (v && v.length >= 20) ||
                          'Title must be at least 20 characters',
                      ]"
                      label="Summary of the question"
                    />
                  </v-col>

                  <v-col cols="12" md="12">
                    <v-textarea
                      required
                      density="compact"
                      variant="outlined"
                      v-model="formData.question"
                      :rules="[
                        (v) => !!v || 'This field is required',
                        (v) =>
                          (v && v.length >= 70) ||
                          'Question must be at least 70 characters',
                      ]"
                      label="Question"
                      hint="You must enter at least 70 characters."
                      persistent-hint
                      placeholder="Enter your question"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-file-input
                      density="compact"
                      variant="outlined"
                      v-model="file"
                      label="Attach file"
                      accept=".png,.jpg,jpeg,.gif,.zip,.rar,.mp4,.flv"
                      @update:model-value="uploadFile($event)"
                      :rules="[
                        (v) =>
                          !v ||
                          v.size < 20000000 ||
                          'File size should be less than 20 MB!',
                      ]"
                      :loading="loading.file"
                      :prepend-icon="null"
                      color="red"
                      prepend-inner-icon="mdi-file"
                      append-icon="mdi-folder-open"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="6" class="pb-0">
                    <v-btn
                      type="submit"
                      :loading="loading.form"
                      :disabled="!isFormValid"
                      color="success"
                      block
                    >
                      Submit
                    </v-btn>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-btn
                      variant="outlined"
                      color="error"
                      to="/user/question"
                      block
                    >
                      Discard
                    </v-btn>
                  </v-col>
                </v-row>
              </VForm>
            </v-card>
          </v-card-text>
        </v-card-text>
      </v-card>
    </v-col>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "dashboard-layout",
});

useHead({
  title: "Q & A submission form",
});

// Get services
const router = useRouter();
const userState = useState("user", () => ({
  lastSelectedCurriculum: "",
  lastSelectedGrade: "",
  lastSelectedSubject: "",
  lastSelectedHoldingLevel: 4,
}));
const { $toast } = useNuxtApp();

// User token
const userToken = ref("");

// Form validation
const form = ref(null);
const isFormValid = ref(false);

const onSubmit = () => {
  submitQuestion();
};

const topicSelectorRef = ref(null);

const formData = reactive({
  section: "",
  base: "",
  lesson: "",
  topics: [],
  title: "",
  question: "",
  file: "",
});

const file = ref(null);
const section_list = ref([]);
const grade_list = ref([]);
const lesson_list = ref([]);
const topic_list = ref([]);

// Handle loading states
const loading = reactive({
  section: false,
  base: false,
  lesson: false,
  topic: false,
  file: false, // Upload file
  form: false, // Submit form
});

const getTypeList = async (type, parent = "") => {
  const params = { type };

  if (type === "section") {
    loading.section = true;
  }
  if (type === "base") {
    params.section_id = parent;
    loading.base = true;
  }
  if (type === "lesson") {
    params.base_id = parent;
    loading.lesson = true;
  }
  if (type === "topic") {
    params.lesson_id = parent;
    loading.topic = true;
  }

  try {
    const response = await $fetch("/api/v1/types/list", {
      method: "GET",
      params,
      headers: {
        Authorization: userToken.value,
      },
    });

    if (type === "section") {
      section_list.value = response.data;
      formData.section = userState.value.lastSelectedCurriculum || "";
    } else if (type === "base") {
      grade_list.value = response.data;
      formData.base = userState.value.lastSelectedGrade || "";
    } else if (type === "lesson") {
      lesson_list.value = response.data;
      formData.lesson = userState.value.lastSelectedSubject || "";
    } else if (type === "topic") {
      topic_list.value = response.data;

      if (topicSelectorRef.value) {
        topicSelectorRef.value.lesson_selected = true;
      }
    }
  } catch (err) {
    $toast.error(err.message || "Error loading data");
  } finally {
    loading.section = false;
    loading.base = false;
    loading.lesson = false;
    loading.topic = false;
  }
};

const selectTopic = (event) => {
  formData.topics = event;
};

const submitQuestion = async () => {
  loading.form = true;

  // Prepare form data
  let formSubmitData = new FormData();
  for (let key in formData) {
    if (!(key == "topics" || key == "file_extra"))
      formSubmitData.append(key, formData[key]);
  }

  if (
    formData.topics &&
    Array.isArray(formData.topics) &&
    formData.topics.length
  )
    for (let key in formData.topics)
      formSubmitData.append("topics[]", formData.topics[key]);

  try {
    const response = await $fetch("/api/v1/questions", {
      method: "POST",
      body: urlencodeFormData(formSubmitData),
      headers: {
        Authorization: userToken.value,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (response.data.id === 0 && response.data.repeated) {
      $toast.info("The question is duplicated");
    } else {
      $toast.success("Submitted successfully");
      router.push("/user/question");
    }
  } catch (err) {
    if (err.response?.status === 403) {
      router.push({ query: { auth_form: "login" } });
    } else if (err.response?.status === 400) {
      $toast.error(err.response.data.message || "Error submitting question");
    }
  } finally {
    loading.form = false;
  }
};

// Convert form data to URL encoded format
const urlencodeFormData = (fd) => {
  let s = "";
  for (let pair of fd.entries()) {
    if (typeof pair[1] === "string") {
      s += (s ? "&" : "") + encode(pair[0]) + "=" + encode(pair[1]);
    }
  }
  return s;
};

const encode = (s) => {
  return encodeURIComponent(s).replace(/%20/g, "+");
};

const uploadFile = async (value) => {
  if (!value) return;

  loading.file = true;

  let fileFormData = new FormData();
  fileFormData.append("file", value);

  try {
    const response = await $fetch("/api/v1/upload", {
      method: "POST",
      body: fileFormData,
      headers: {
        Authorization: userToken.value,
      },
    });

    formData.file = response.data[0].file.name;
    $toast.success("File uploaded successfully");
  } catch (err) {
    $toast.error("An error occurred during file upload");
  } finally {
    loading.file = false;
  }
};

// Set up watchers
watch(
  () => formData.section,
  (val) => {
    userState.value.lastSelectedCurriculum = val;
    formData.base = "";
    formData.lesson = "";
    formData.topics = [];
    grade_list.value = [];
    lesson_list.value = [];
    topic_list.value = [];

    if (val) {
      getTypeList("base", val);
    }
  }
);

watch(
  () => formData.base,
  (val) => {
    userState.value.lastSelectedGrade = val;
    formData.lesson = "";

    if (val) {
      getTypeList("lesson", val);
    }
  }
);

watch(
  () => formData.lesson,
  (val) => {
    userState.value.lastSelectedSubject = val;

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

// Initialize on mount
onMounted(() => {
  userToken.value = localStorage.getItem("auth._token.local");
  getTypeList("section");
});
</script>

<style>
#question-submit-form .text-h4 {
  line-height: 4rem;
}

.topic_season {
  font-weight: bolder !important;
  color: blue !important;
}
</style>
