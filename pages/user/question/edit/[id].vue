<template>
  <div class="mt-4">
    <v-col cols="12" class="px-0 px-sm-2">
      <v-row>
        <v-col cols="12" class="pl-5">
          <span class="icon icong-test text-h3 teal--text"></span>
          <span class="text-h4 teal--text"> Q & A edit </span>
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
                <v-row>
                  <v-col cols="12" md="3">
                    <v-autocomplete
                      required
                      density="compact"
                      variant="outlined"
                      v-model="formData.section"
                      @update:model-value="changeOption('section', $event)"
                      :items="section_list"
                      :rules="[(v) => !!v || 'Curriculum is required']"
                      item-title="title"
                      item-value="id"
                      label="Curriculum"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-autocomplete
                      required
                      density="compact"
                      variant="outlined"
                      v-model="formData.base"
                      :items="grade_list"
                      :rules="[(v) => !!v || 'Grade is required']"
                      item-value="id"
                      item-title="title"
                      @update:model-value="changeOption('base', $event)"
                      label="Grade"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-autocomplete
                      required
                      density="compact"
                      variant="outlined"
                      :items="lesson_list"
                      :rules="[(v) => !!v || 'Subject is required']"
                      item-value="id"
                      item-title="title"
                      v-model="formData.lesson"
                      @update:model-value="changeOption('lesson', $event)"
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

                  <v-col cols="12" md="12">
                    <v-text-field
                      required
                      density="compact"
                      variant="outlined"
                      v-model="formData.title"
                      :rules="[
                        (v) => !!v || 'Title is required',
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
                        (v) => !!v || 'Question is required',
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
                    >
                      <template v-slot:append>
                        <v-btn
                          icon
                          size="small"
                          :href="questionData.files?.url"
                          target="_blank"
                          v-if="questionData.files?.exist"
                        >
                          <v-icon>mdi-download</v-icon>
                        </v-btn>
                      </template>
                    </v-file-input>
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
                      Update
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
// Define layout and page metadata
definePageMeta({
  layout: "dashboard-layout",
});

// Get route params
const route = useRoute();
const router = useRouter();
const { $toast, $auth } = useNuxtApp();

// Page title
useHead({
  title: "Q & A edit form",
});

// Form validation
const form = ref(null);
const isFormValid = ref(false);

const onSubmit = () => {
  updateContent();
};

// Data fetching
const token = $auth.getUserToken();

const { data: questionData } = await useFetch(
  `/api/v1/questions/${route.params.id}`,
  {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
    transform: (response) => {
      return response.status === 1 ? response.data : {};
    },
  }
);

// Form data
const formData = reactive({
  id: route.params.id,
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
const topicSelectorRef = ref(null);

// Handle loading states
const loading = reactive({
  section: false,
  base: false,
  lesson: false,
  topic: false,
  file: false,
  form: false,
});

// Methods
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

  // Get the auth token
  const token = $auth.getUserToken();

  try {
    const response = await $fetch("/api/v1/types/list", {
      method: "GET",
      params,
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    if (type === "section") {
      section_list.value = response.data;
    } else if (type === "base") {
      grade_list.value = response.data;
    } else if (type === "lesson") {
      lesson_list.value = response.data;
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

const initData = () => {
  formData.section = questionData.value?.section || "";
  formData.base = questionData.value?.base || "";
  formData.lesson = questionData.value?.lesson || "";

  // Handle topic as array
  if (questionData.value?.topic) {
    const topics = questionData.value.topic.split
      ? questionData.value.topic.split("+")
      : [];
    formData.topics = topics.filter((t) => t);
  }

  formData.title = questionData.value?.title || "";
  formData.question = questionData.value?.question || "";
};

const selectTopic = (event) => {
  formData.topics = event;
};

const changeOption = async (optionName, optionVal) => {
  if (optionName === "section") {
    formData.base = "";
    formData.lesson = "";
    formData.topics = [];
    grade_list.value = [];
    lesson_list.value = [];
    topic_list.value = [];

    if (optionVal) {
      await getTypeList("base", optionVal);
    }

    if (topicSelectorRef.value) {
      topicSelectorRef.value.lesson_selected = false;
    }
  } else if (optionName === "base") {
    formData.lesson = "";
    if (optionVal) {
      await getTypeList("lesson", optionVal);
    }

    if (topicSelectorRef.value) {
      topicSelectorRef.value.lesson_selected = false;
    }
  } else if (optionName === "lesson") {
    if (optionVal) {
      await getTypeList("topic", optionVal);
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
};

const updateContent = async () => {
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

  // Get the auth token
  const token = $auth.getUserToken();

  try {
    const response = await $fetch(`/api/v1/questions/${formData.id}`, {
      method: "PUT",
      body: urlencodeFormData(formSubmitData),
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (response.data.id === 0 && response.data.repeated) {
      $toast.info("The question is duplicated");
    } else {
      $toast.success("Updated successfully");
      router.push("/user/question");
    }
  } catch (err) {
    if (err.response?.status === 403) {
      router.push({ query: { auth_form: "login" } });
    } else if (err.response?.status === 400) {
      $toast.error(err.response.data.message || "Error updating question");
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
  loading.form = true;

  // Get the auth token
  const token = $auth.getUserToken();

  let fileFormData = new FormData();
  fileFormData.append("file", value);

  try {
    const response = await $fetch("/api/v1/upload", {
      method: "POST",
      body: fileFormData,
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    formData.file = response.data[0].file.name;
    $toast.success("File uploaded successfully");
  } catch (err) {
    $toast.error("An error occurred during file upload");
  } finally {
    loading.file = false;
    loading.form = false;
  }
};

// Initialize data on load
onMounted(async () => {
  await getTypeList("section");
  initData();

  // Load dependent type lists
  if (formData.section) {
    await getTypeList("base", formData.section);
  }

  if (formData.base) {
    await getTypeList("lesson", formData.base);
  }

  if (formData.lesson) {
    await getTypeList("topic", formData.lesson);
    if (topicSelectorRef.value) {
      topicSelectorRef.value.lesson_selected = true;
    }
  }
});
</script>

<style>
.topic_season {
  font-weight: bolder !important;
  color: blue !important;
}
</style> 