<template>
  <div id="multimedia-submit-form" class="mt-4">
    <v-col cols="12" class="px-2 px-sm-2 px-md-0">
      <v-row>
        <v-col cols="12" class="pl-5">
          <span class="text-h4" style="color: #009688">
            Multimedia submission form
          </span>
        </v-col>
      </v-row>
      <v-card class="mt-3">
        <v-card-text class="px-0 px-sm-8 px-md-4">
          <v-card-text>
            <v-card flat class="mt-3">
              <VForm
                ref="form"
                v-model="isFormValid"
                @submit.prevent="submitContent"
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
                      :rules="[(v) => !!v || 'This field is required']"
                      item-title="title"
                      item-value="id"
                      label="Curriculum"
                      color="#FFB300"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
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
                      color="#FFB300"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
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
                      color="#FFB300"
                    />
                  </v-col>
                  <v-col cols="12" md="12">
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
                      multiple
                      color="#FFB300"
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
                      ]"
                      label="Title"
                      color="#FFB300"
                    />
                  </v-col>
                  <v-col cols="12" md="12">
                    <v-textarea
                      required
                      density="compact"
                      variant="outlined"
                      v-model="formData.description"
                      :rules="[
                        (v) => !!v || 'This field is required',
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
                    <v-autocomplete
                      required
                      density="compact"
                      variant="outlined"
                      :items="content_type_list"
                      :rules="[(v) => !!v || 'This field is required']"
                      item-value="id"
                      item-title="title"
                      v-model="formData.content_type"
                      label="Content type"
                      color="#FFB300"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-file-input
                      required
                      density="compact"
                      variant="outlined"
                      v-model="file"
                      label="Multimedia file"
                      accept=".mp4,.avi,.m4a,.mpg,.flv,.docx,.pptx,.pdf,.exe,.apk,.mp3,.wave,.acc,.swf,.gif,.zip"
                      @update:model-value="uploadFile($event)"
                      :rules="[
                        (v) => !!v || 'This field is required',
                        (v) =>
                          !v ||
                          v.size < 20000000 ||
                          'File size should be less than 20 MB!',
                      ]"
                      :loading="loading.file"
                      :prepend-icon="null"
                      color="red"
                      prepend-inner-icon="mdi-play-box"
                      append-icon="mdi-folder-open"
                    />
                  </v-col>

                  <v-col cols="12">
                    <v-divider class="my-3" />
                    <p class="text-h5">Content cover</p>
                    <p class="text-h6">
                      What pages of the book does this content cover?
                    </p>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      type="number"
                      min="1"
                      label="From page"
                      density="compact"
                      variant="outlined"
                      v-model="formData.from_page"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      type="number"
                      min="1"
                      label="To page"
                      density="compact"
                      variant="outlined"
                      v-model="formData.to_page"
                    />
                  </v-col>
                  <v-col cols="12" md="12">
                    <v-checkbox
                      density="compact"
                      v-model="formData.free_available"
                      label="I would like the file to be freely available to others."
                    />
                  </v-col>

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
                      to="/user/multimedia"
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
import { useAuth } from '~/composables/useAuth';

const auth = useAuth();

// Define layout and page metadata
definePageMeta({
  layout: "dashboard-layout",
});

useHead({
  title: "Multimedia submission form",
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
  submitContent();
};

const formData = reactive({
  section: "",
  base: "",
  lesson: "",
  topics: [],
  title: "",
  description: "",
  content_type: "",
  from_page: "",
  to_page: "",
  free_available: false,
  file: "",
});

const file = ref(null);
const section_list = ref([]);
const grade_list = ref([]);
const lesson_list = ref([]);
const topic_list = ref([]);
const content_type_list = ref([]);

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
        Authorization: `Bearer ${userToken.value}`,
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
    } else if (type === "content_type") {
      content_type_list.value = response.data;
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

const changeOption = (type, value) => {
  if (type === "topic") {
    formData.topics = value;
  }
};

const submitContent = async () => {
  loading.form = true;

  // Prepare form data
  let formSubmitData = new FormData();
  for (let key in formData) {
    if (!(key === "topics" || key === "file_extra")) {
      formSubmitData.append(key, formData[key]);
    }
  }

  if (formData.topics && Array.isArray(formData.topics) && formData.topics.length) {
    for (let key in formData.topics) {
      formSubmitData.append("topics[]", formData.topics[key]);
    }
  }

  // For free_available, ensure it's 1 or 0
  formSubmitData.set("free_available", formData.free_available ? 1 : 0);

  try {
    const response = await $fetch("/api/v1/files", {
      method: "POST",
      body: urlencodeFormData(formSubmitData),
      headers: {
        Authorization: `Bearer ${userToken.value}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (response.data.id === 0 && response.data.repeated) {
      $toast.info("The multimedia is duplicated");
    } else {
      $toast.success("Submitted successfully");
      router.push("/user/multimedia");
    }
  } catch (err) {
    if (err.response?.status === 403) {
      router.push({ query: { auth_form: "login" } });
    } else if (err.response?.status === 400) {
      $toast.error(err.response.data.message || "Error submitting multimedia");
    } else {
      $toast.error(err.message || "Error submitting multimedia");
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
        Authorization: `Bearer ${userToken.value}`,
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
    formData.topics = [];
    lesson_list.value = [];
    topic_list.value = [];

    if (val) {
      getTypeList("lesson", val);
    }
  }
);

watch(
  () => formData.lesson,
  (val) => {
    userState.value.lastSelectedSubject = val;
    formData.topics = [];
    topic_list.value = [];

    if (val) {
      getTypeList("topic", val);
    }
  }
);

// Initialize on mount
onMounted(() => {
  userToken.value = auth.getUserToken();
  getTypeList("section");
  getTypeList("content_type");
});
</script>

<style>
#multimedia-submit-form .text-h4 {
  line-height: 4rem;
}

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
</style>
