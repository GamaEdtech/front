<template>
  <div class="mt-4">
    <v-col cols="12" class="px-2 px-sm-2 px-md-0">
      <v-row>
        <v-col cols="12" class="pl-5">
          <span class="text-h4" style="color: #009688"> Forum Edit Form </span>
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
                      @update:model-value="changeOption('section', $event)"
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
                      :rules="[(v) => !!v || 'This field is required']"
                      item-value="id"
                      item-title="title"
                      v-model="formData.lesson"
                      @update:model-value="changeOption('lesson', $event)"
                      label="Subject"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-autocomplete
                      required
                      density="compact"
                      variant="outlined"
                      :items="topic_list"
                      :rules="[
                        (v) =>
                          topic_list.length === 0 ||
                          !!v ||
                          'This field is required',
                      ]"
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
                          'This field must be at least 20 characters',
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
                          'This field must be at least 70 characters',
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
const { $toast } = useNuxtApp();
const userToken = ref("");

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

const { data: questionData } = await useFetch(
  `/api/v1/questions/${route.params.id}`,
  {
    headers: {
      Authorization: userToken.value,
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
  topics: "",
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
    } else if (type === "base") {
      grade_list.value = response.data;
    } else if (type === "lesson") {
      lesson_list.value = response.data;
    } else if (type === "topic") {
      topic_list.value = response.data;
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

  // Set topic directly (not as array)
  formData.topics = questionData.value?.topic || "";

  formData.title = questionData.value?.title || "";
  formData.question = questionData.value?.question || "";
};

const changeOption = async (optionName, optionVal) => {
  if (optionName === "section") {
    formData.base = "";
    formData.lesson = "";
    formData.topics = ""; // Reset as string, not array
    grade_list.value = [];
    lesson_list.value = [];
    topic_list.value = [];

    if (optionVal) {
      await getTypeList("base", optionVal);
    }
  } else if (optionName === "base") {
    formData.lesson = "";
    if (optionVal) {
      await getTypeList("lesson", optionVal);
    }
  } else if (optionName === "lesson") {
    if (optionVal) {
      await getTypeList("topic", optionVal);
    } else {
      formData.topics = ""; // Reset as string, not array
      topic_list.value = [];
    }
  } else if (optionName === "topic") {
    // When topic is directly selected
    formData.topics = optionVal;
  }
};

const updateContent = async () => {
  loading.form = true;

  // Prepare form data
  let formSubmitData = new FormData();

  // Directly append all form fields - no special handling for topics
  for (let key in formData) {
    formSubmitData.append(key, formData[key]);
  }

  try {
    const response = await $fetch(`/api/v1/questions/${route.params.id}`, {
      method: "PUT",
      body: urlencodeFormData(formSubmitData),
      headers: {
        Authorization: userToken.value,
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
    console.error("Update error:", err);
    if (err.response?.status === 403) {
      router.push({ query: { auth_form: "login" } });
    } else if (err.response?.status === 400) {
      $toast.error(err.response.data.message || "Error updating question");
    } else {
      $toast.error("An error occurred while updating the question");
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

// Initialize data on load
onMounted(async () => {
  userToken.value = localStorage.getItem("auth._token.local");
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
  }
});
</script>

<style>
.topic_season {
  font-weight: bolder !important;
  color: blue !important;
}
</style> 