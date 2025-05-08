<template>
  <div id="create-test">
    <embed
      v-if="file_original_path"
      :src="file_original_path"
      width="100%"
      height="200px;"
    />
    <v-card flat class="mt-3">
      <!--Question section-->
      <v-card-text id="test-question">
        <VeeForm @submit="submitQuestion">
          <v-row>
            <v-col cols="12" md="2" class="mt-2" v-show="path_panel_expand">
              <v-autocomplete
                v-model="form.section"
                :items="level_list"
                label="Board"
                item-title="title"
                item-value="id"
                variant="outlined"
                density="compact"
                :rules="[(v) => !!v || 'Level is required']"
              ></v-autocomplete>
            </v-col>

            <v-col cols="12" md="2" class="mt-2" v-show="path_panel_expand">
              <v-autocomplete
                v-model="form.base"
                :items="grade_list"
                label="Grade"
                item-title="title"
                item-value="id"
                variant="outlined"
                density="compact"
                :rules="[(v) => !!v || 'Grade is required']"
              ></v-autocomplete>
            </v-col>

            <v-col cols="12" md="2" class="mt-2" v-show="path_panel_expand">
              <v-autocomplete
                v-model="form.lesson"
                :items="lesson_list"
                label="Subject"
                item-title="title"
                item-value="id"
                variant="outlined"
                density="compact"
                :rules="[(v) => !!v || 'Lesson is required']"
              ></v-autocomplete>
            </v-col>
            <v-col cols="2" md="1" class="pr-0" v-show="!path_panel_expand">
              <v-tooltip location="bottom">
                <template v-slot:activator="{ props }">
                  <v-btn
                    color="teal"
                    class="white--text py-5"
                    v-bind="props"
                    block
                    @click="path_panel_expand = !path_panel_expand"
                  >
                    <i class="fas fa-route mx-3 fa-xl"></i>
                  </v-btn>
                </template>
                <span> Change path </span>
              </v-tooltip>
            </v-col>
            <v-col
              :cols="path_panel_expand ? 12 : 10"
              :md="path_panel_expand ? 2 : 9"
              class="mt-2"
              v-show="path_panel_expand"
            >
              <v-autocomplete
                v-model="form.topic"
                :items="topic_list"
                label="Topic"
                item-title="title"
                item-value="id"
                variant="outlined"
                density="compact"
              >
                <template v-slot:item="data">
                  <p
                    :class="data.item.season ? 'topic_season' : ''"
                    class="topic_list_item py-2"
                  >
                    {{ data.item.title }}
                  </p>
                </template>
              </v-autocomplete>
            </v-col>

            <v-col cols="12" md="2" class="mt-2">
              <v-autocomplete
                v-model="form.type"
                :items="typeList"
                label="Type"
                item-title="title"
                item-value="value"
                variant="outlined"
                density="compact"
                :rules="[(v) => !!v || 'Question type is required']"
              ></v-autocomplete>
            </v-col>

            <!--Question section-->
            <v-col cols="12" md="6" id="test-maker-question">
              <p>Question:</p>
              <ClientOnly fallback-tag="span" fallback="Loading...">
                <Field name="question" rules="required" v-slot="{ errorMessage }">
                  <RickEditor
                    v-model:modelValue="form.question"
                    min-height="200px"
                    :features="['bold', 'italic', 'underline', 'alignment']"
                  >
                    <template #content>
                      <v-btn
                        variant="flat"
                        size="small"
                        color="teal"
                        icon
                        @click="selectFile('q_file')"
                      >
                        <v-icon>mdi-camera</v-icon>
                      </v-btn>
                      <v-btn
                        v-if="form.q_file_base64"
                        variant="flat"
                        size="small"
                        color="red"
                        icon
                        @click="deleteFile('q_file')"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </template>
                  </RickEditor>
                  <p v-if="errorMessage" class="text-error text-caption mt-1">{{ errorMessage }}</p>
                </Field>
              </ClientOnly>
              <img
                v-if="form.q_file_base64"
                width="200"
                height="200"
                class="pointer image-preview rounded mt-2"
                @click="selectFile('q_file')"
                :src="form.q_file_base64"
              />
            </v-col>
            <!--End question section-->

            <v-col
              cols="12"
              md="6"
              v-if="['tf', 'fourchoice', 'twochoice'].includes(form.type)"
            >
              <!--Answer type-->
              <v-row v-if="['fourchoice', 'twochoice'].includes(form.type)">
                <v-col cols="12" class="d-flex align-center justify-center">
                  <p class="mr-3 mt-5">Choices type:</p>
                  <v-checkbox
                    v-model="text_answer"
                    label="Text"
                    color="teal"
                    class="mr-10"
                    @click="answerTypeChanged('txt')"
                    hide-details
                  />
                  <v-checkbox
                    v-model="photo_answer"
                    label="Photo"
                    color="teal"
                    @click="answerTypeChanged('photo')"
                    hide-details
                  />
                </v-col>
              </v-row>
              <!--End answer type-->

              <!--Test answer options-->
              <Field name="true_answer" rules="required" v-slot="{ field, errorMessage }">
                <v-radio-group
                  v-model="form.true_answer"
                  id="test-image-options"
                  v-bind="field"
                  :error-messages="errorMessage"
                >
                  <v-row
                    v-if="['fourchoice', 'twochoice', 'tf'].includes(form.type)"
                  >
                    <v-col class="pb-0" cols="1">
                      <v-radio value="1"></v-radio>
                      <span class="answer_label">A</span>
                    </v-col>
                    <v-col
                      class="pb-0"
                      cols="11"
                      v-show="form.testImgAnswers === false"
                    >
                      <Field 
                        :name="'answer_a'" 
                        :rules="text_answer_rules ? 'required' : ''" 
                        v-slot="{ errorMessage }"
                      >
                        <ClientOnly fallback-tag="span" fallback="Loading...">
                          <RickEditor
                            v-model:modelValue="form.answer_a"
                             min-height="90px"
                            :features="['bold', 'italic', 'underline', 'alignment']"
                          >
                          </RickEditor>
                          <p v-if="errorMessage" class="text-error text-caption mt-1">{{ errorMessage }}</p>
                        </ClientOnly>
                      </Field>
                    </v-col>
                    <v-col
                      class="pb-0"
                      cols="11"
                      v-show="form.testImgAnswers === true"
                    >
                      <div class="image-holder">
                        <img
                          width="90"
                          height="90"
                          class="pointer image-input rounded"
                          v-if="form.a_file_base64"
                          @click="selectFile('a_file')"
                          :src="form.a_file_base64"
                        />
                        <v-btn
                          v-else
                          variant="flat"
                          class="image-input d-flex align-center justify-center"
                          style="width: 90px; height: 90px;"
                          @click="selectFile('a_file')"
                        >
                          <v-icon size="77" color="teal">mdi-camera</v-icon>
                        </v-btn>

                        <v-btn
                          v-show="form.a_file_base64"
                          @click="deleteFile('a_file')"
                          variant="flat"
                          color="red"
                          icon
                          class="img-clear-btn"
                        >
                          <v-icon small>mdi-delete</v-icon>
                        </v-btn>
                      </div>
                    </v-col>
                  </v-row>
                  
                  <v-row
                    v-if="['fourchoice', 'twochoice', 'tf'].includes(form.type)"
                  >
                    <v-col class="pb-0" cols="1">
                      <v-radio value="2"></v-radio>
                      <span class="answer_label">B</span>
                    </v-col>
                    <v-col
                      class="pb-0"
                      cols="11"
                      v-show="form.testImgAnswers === false"
                    >
                      <Field 
                        :name="'answer_b'" 
                        :rules="text_answer_rules ? 'required' : ''" 
                        v-slot="{ errorMessage }"
                      >
                        <ClientOnly fallback-tag="span" fallback="Loading...">
                          <RickEditor
                            v-model:modelValue="form.answer_b"
                            min-height="90px"
                            :features="['bold', 'italic', 'underline', 'alignment']"
                          >
                          </RickEditor>
                          <p v-if="errorMessage" class="text-error text-caption mt-1">{{ errorMessage }}</p>
                        </ClientOnly>
                      </Field>
                    </v-col>
                    <v-col
                      class="pb-0"
                      cols="11"
                      v-show="form.testImgAnswers === true"
                    >
                      <div class="image-holder">
                        <img
                          width="90"
                          height="90"
                          class="pointer image-input rounded"
                          v-if="form.b_file_base64"
                          @click="selectFile('b_file')"
                          :src="form.b_file_base64"
                        />
                        <v-btn
                          v-else
                          variant="flat"
                          class="image-input d-flex align-center justify-center"
                          style="width: 90px; height: 90px;"
                          @click="selectFile('b_file')"
                        >
                          <v-icon size="77" color="teal">mdi-camera</v-icon>
                        </v-btn>

                        <v-btn
                          v-show="form.b_file_base64"
                          @click="deleteFile('b_file')"
                          variant="flat"
                          color="red"
                          icon
                          class="img-clear-btn"
                        >
                          <v-icon small>mdi-delete</v-icon>
                        </v-btn>
                      </div>
                    </v-col>
                  </v-row>
                  
                  <v-row v-if="form.type == 'fourchoice'">
                    <v-col class="pb-0" cols="1">
                      <v-radio value="3"></v-radio>
                      <span class="answer_label">C</span>
                    </v-col>
                    <v-col
                      class="pb-0"
                      cols="11"
                      v-show="form.testImgAnswers === false"
                    >
                      <Field 
                        :name="'answer_c'" 
                        :rules="text_answer_rules ? 'required' : ''" 
                        v-slot="{ errorMessage }"
                      >
                        <ClientOnly fallback-tag="span" fallback="Loading...">
                          <RickEditor
                            v-model:modelValue="form.answer_c"
                            min-height="90px"
                            :features="['bold', 'italic', 'underline', 'alignment']"
                          >
                          </RickEditor>
                          <p v-if="errorMessage" class="text-error text-caption mt-1">{{ errorMessage }}</p>
                        </ClientOnly>
                      </Field>
                    </v-col>
                    <v-col
                      class="pb-0"
                      cols="11"
                      v-show="form.testImgAnswers === true"
                    >
                      <div class="image-holder">
                        <img
                          width="90"
                          height="90"
                          class="pointer image-input rounded"
                          v-if="form.c_file_base64"
                          @click="selectFile('c_file')"
                          :src="form.c_file_base64"
                        />
                        <v-btn
                          v-else
                          variant="flat"
                          class="image-input d-flex align-center justify-center"
                          style="width: 90px; height: 90px;"
                          @click="selectFile('c_file')"
                        >
                          <v-icon size="77" color="teal">mdi-camera</v-icon>
                        </v-btn>

                        <v-btn
                          v-show="form.c_file_base64"
                          @click="deleteFile('c_file')"
                          variant="flat"
                          color="red"
                          icon
                          class="img-clear-btn"
                        >
                          <v-icon small>mdi-delete</v-icon>
                        </v-btn>
                      </div>
                    </v-col>
                  </v-row>
                  
                  <v-row v-if="form.type == 'fourchoice'">
                    <v-col class="pb-0" cols="1">
                      <v-radio value="4"></v-radio>
                      <span class="answer_label">D</span>
                    </v-col>
                    <v-col
                      class="pb-0"
                      cols="11"
                      v-show="form.testImgAnswers === false"
                    >
                      <Field 
                        :name="'answer_d'" 
                        :rules="text_answer_rules ? 'required' : ''" 
                        v-slot="{ errorMessage }"
                      >
                        <ClientOnly fallback-tag="span" fallback="Loading...">
                          <RickEditor
                            v-model:modelValue="form.answer_d"
                            min-height="90px"
                            :features="['bold', 'italic', 'underline', 'alignment']"
                          >
                          </RickEditor>
                          <p v-if="errorMessage" class="text-error text-caption mt-1">{{ errorMessage }}</p>
                        </ClientOnly>
                      </Field>
                    </v-col>
                    <v-col
                      class="pb-0"
                      cols="11"
                      v-show="form.testImgAnswers === true"
                    >
                      <div class="image-holder">
                        <img
                          width="200"
                          height="200" 
                          class="pointer image-input rounded"
                          v-if="form.d_file_base64"
                          @click="selectFile('d_file')"
                          :src="form.d_file_base64"
                        />
                        <v-btn
                          v-else
                          variant="flat"
                          class="image-input d-flex align-center justify-center"
                          style="width: 90px; height: 90px;"
                          @click="selectFile('d_file')"
                        >
                          <v-icon size="77" color="teal">mdi-camera</v-icon>
                        </v-btn>

                        <v-btn
                          v-show="form.d_file_base64"
                          @click="deleteFile('d_file')"
                          variant="flat"
                          color="red"
                          icon
                          class="img-clear-btn"
                        >
                          <v-icon small>mdi-delete</v-icon>
                        </v-btn>
                      </div>
                    </v-col>
                  </v-row>
                </v-radio-group>
              </Field>
              <!--End test answer options-->
            </v-col>
          </v-row>
          <!-- 
          <v-row>
            <v-col cols="12">
              <v-btn
                color="teal"
                variant="flat"
                block
                type="submit"
                :loading="create_loading"
              >
                Create Test
              </v-btn>
            </v-col>
          </v-row> -->
        </VeeForm>
      </v-card-text>
    </v-card>

    <!--Cropper Dialog-->
    <v-dialog v-model="cropper_dialog" max-width="500">
      <v-card>
        <v-card-title>Crop image</v-card-title>
        <v-card-text>
          <!-- Replace with vue-advanced-cropper v3 component when updating -->
          <div v-if="cropper_dialog">
            <!-- Placeholder for cropper component -->
            <img :src="crop_file_url" style="max-width: 100%" />
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" variant="text" @click="cropper_dialog = false">
            Cancel
          </v-btn>
          <v-btn color="teal" variant="text" @click="cropper_dialog = false">
            Crop
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Form as VeeForm, Field, useForm } from "vee-validate";
import { required } from "@vee-validate/rules";
import { defineRule } from "vee-validate";
import TopicSelector from "~/components/form/topic-selector";
import { useNuxtApp } from "#app";
// import CkEditor from "./ckEditor.vue";";
import * as yup from "yup";

// Define validation rules
defineRule("required", required);

// Get services
const { $toast, $fetch } = useNuxtApp();
const router = useRouter();
const route = useRoute();

// Form validation
const { handleSubmit, resetForm } = useForm();
const observer = ref(null);
const isFormValid = ref(false);

// Refs for file inputs
const questionInput = ref(null);
const answerFullInput = ref(null);
const aInput = ref(null);
const bInput = ref(null);
const cInput = ref(null);
const dInput = ref(null);

// Component state
const props = defineProps({
  examEditMode: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:updateTestList", "update:goToPreviewStep"]);

// State variables
const path_panel_expand = ref(true);
const create_loading = ref(false);
const test_step = ref(1);
const text_answer = ref(true);
const text_answer_rules = ref("required");
const photo_answer = ref(false);
const photo_answer_rules = ref("");
const examTestListLength = ref(0);
const file_original_path = ref("");
const crop_file_url = ref("");
const crop_file_loading = ref(false);
const cropper_dialog = ref(false);
const current_crop_file = ref("");

// Form data
const form = reactive({
  section: "",
  base: "",
  level: "",
  grade: "",
  lesson: "",
  topic: "",
  type: "fourchoice",
  direction: "ltr",
  true_answer: "",
  question: "",
  q_file_base64: "",
  answer_full: "",
  answer_full_file_base64: "",
  a_file_base64: "",
  b_file_base64: "",
  c_file_base64: "",
  d_file_base64: "",
  testImgAnswers: false,
});

const form_hidden_data = reactive({
  q_file: null,
  answer_full_file: null,
  a_file: null,
  b_file: null,
  c_file: null,
  d_file: null,
});

// Data lists
const level_list = ref([]);
const grade_list = ref([]);
const field_list = ref([]);
const lesson_list = ref([]);
const topic_list = ref([]);

// Static data
const txt_direction_list = [
  { value: "ltr", title: "LTR" },
  { value: "rtl", title: "RTL" },
];

const stencil_props = {
  width: 180,
  height: 180,
};

const typeList = [
  { value: "fourchoice", title: "Multiple choice(4)" },
  { value: "twochoice", title: "Multiple choice(2)" },
  { value: "descriptive", title: "Open-Ended" },
  { value: "tf", title: "True/False" },
  { value: "blank", title: "Blank" },
  { value: "shortanswer", title: "Short answer" },
];

// Editor configuration
const editorConfig = {
  toolbar: ["bold", "underline", "alignment"],
  plugins: [
    "Autoformat",
    "Essentials",
    "MathType",
    "Alignment",
    "Bold",
    "Underline",
    "PasteFromOffice",
    "Paragraph",
    "WordCount",
  ],
  mathType: {
    wiriseditorparselatex: false,
  },
};

// Define validation rules
const validationSchema = yup.object({
  question: yup.string().required("Question is required"),
  true_answer: yup.string().when("type", {
    is: (val) => ["fourchoice", "twochoice", "tf"].includes(val),
    then: () => yup.string().required("Please select the correct answer"),
  }),
  // Additional validations based on answer type
  answer_a: yup.string().when(["type", "testImgAnswers"], {
    is: (type, testImgAnswers) =>
      ["fourchoice", "twochoice", "tf"].includes(type) && !testImgAnswers,
    then: () => yup.string().required("Answer A is required"),
  }),
  answer_b: yup.string().when(["type", "testImgAnswers"], {
    is: (type, testImgAnswers) =>
      ["fourchoice", "twochoice", "tf"].includes(type) && !testImgAnswers,
    then: () => yup.string().required("Answer B is required"),
  }),
  answer_c: yup.string().when(["type", "testImgAnswers"], {
    is: (type, testImgAnswers) => type === "fourchoice" && !testImgAnswers,
    then: () => yup.string().required("Answer C is required"),
  }),
  answer_d: yup.string().when(["type", "testImgAnswers"], {
    is: (type, testImgAnswers) => type === "fourchoice" && !testImgAnswers,
    then: () => yup.string().required("Answer D is required"),
  }),
  answer_full: yup.string().when(["type", "testImgAnswers"], {
    is: (type, testImgAnswers) => type === "descriptive" && !testImgAnswers,
    then: () => yup.string().required("Full answer is required"),
  }),
});

// Use VeeValidate form
const {
  handleSubmit: veeHandleSubmit,
  isSubmitting,
  validate,
} = useForm({
  validationSchema,
  initialValues: {
    section: "",
    base: "",
    level: "",
    grade: "",
    lesson: "",
    topic: "",
    type: "fourchoice",
    direction: "ltr",
    true_answer: "",
    question: "",
    q_file_base64: "",
    answer_full: "",
    answer_full_file_base64: "",
    answer_a: "",
    answer_b: "",
    answer_c: "",
    answer_d: "",
    a_file_base64: "",
    b_file_base64: "",
    c_file_base64: "",
    d_file_base64: "",
    testImgAnswers: false,
  },
});

// Methods
const getTypeList = async (type, parent = "") => {
  const params = { type };

  if (type === "base") params.section_id = parent;
  if (type === "lesson") params.base_id = parent;
  if (type === "topic") params.lesson_id = parent;
  if (type === "area") params.state_id = parent;

  if (type === "school") {
    params.section_id = form.level;
    params.area_id = form.area;
  }

  try {
    const res = await $fetch("/api/v1/types/list", {
      method: "GET",
      params,
    });

    if (type === "section") {
      level_list.value = res.data;
    } else if (type === "base") {
      grade_list.value = res.data;
    } else if (type === "lesson") {
      lesson_list.value = res.data;
    } else if (type === "topic") {
      topic_list.value = res.data;
    }
  } catch (err) {
    $toast.error(err.message || "Error loading data");
  }
};

const submitQuestion = veeHandleSubmit(async (values) => {
  create_loading.value = true;
  const querystring = require("querystring");

  try {
    const response = await $fetch("/api/v1/examTests", {
      method: "POST",
      body: querystring.stringify(values),
    });

    if (response.status == 1) {
      $toast.success("Created successfully");
      path_panel_expand.value = false;

      // Edit mode or create exam progress
      if (props.examEditMode === true)
        emit("update:updateTestList", response.data.id);
      // End edit mode or create exam progress

      // Reset form fields
      form.question = "";
      form.q_file_base64 = "";
      form.answer_full = "";
      form.answer_full_file_base64 = "";
      form.true_answer = "";
      form.testImgAnswers = false;
      text_answer.value = true;
      photo_answer.value = false;
      form.answer_a = "";
      form.answer_b = "";
      form.answer_c = "";
      form.answer_d = "";
      form.a_file_base64 = "";
      form.b_file_base64 = "";
      form.c_file_base64 = "";
      form.d_file_base64 = "";

      resetForm();
    } else {
      $toast.error("An error occurred, try again");
    }
  } catch (err) {
    if (err.response?.status == 400) $toast.error(err.response.data.message);
    else if (err.response?.status == 403) {
      // Handle authentication error
      $toast.error("Authentication error");
      router.push("/login");
    } else {
      $toast.error(err.message || "An error occurred");
    }
  } finally {
    create_loading.value = false;
  }
});

const selectFile = (file_name) => {
  if (file_name === "q_file") {
    questionInput.value?.click();
  } else if (file_name === "answer_full_file") {
    document.querySelector('input[ref="answerFullInput"]')?.click();
  } else if (file_name === "a_file") {
    document.querySelector('input[ref="aInput"]')?.click();
  } else if (file_name === "b_file") {
    document.querySelector('input[ref="bInput"]')?.click();
  } else if (file_name === "c_file") {
    document.querySelector('input[ref="cInput"]')?.click();
  } else if (file_name === "d_file") {
    document.querySelector('input[ref="dInput"]')?.click();
  }
};

const uploadFile = (file_name) => {
  let file = null;

  if (file_name === "q_file") {
    file = form_hidden_data.q_file;
  } else if (file_name === "answer_full_file") {
    file = form_hidden_data.answer_full_file;
  } else if (file_name === "a_file") {
    file = form_hidden_data.a_file;
  } else if (file_name === "b_file") {
    file = form_hidden_data.b_file;
  } else if (file_name === "c_file") {
    file = form_hidden_data.c_file;
  } else if (file_name === "d_file") {
    file = form_hidden_data.d_file;
  }

  if (file) {
    if (file_name === "q_file") {
      form.q_file_base64 = URL.createObjectURL(file);
    } else if (file_name === "answer_full_file") {
      form.answer_full_file_base64 = URL.createObjectURL(file);
    } else if (file_name === "a_file") {
      form.a_file_base64 = URL.createObjectURL(file);
    } else if (file_name === "b_file") {
      form.b_file_base64 = URL.createObjectURL(file);
    } else if (file_name === "c_file") {
      form.c_file_base64 = URL.createObjectURL(file);
    } else if (file_name === "d_file") {
      form.d_file_base64 = URL.createObjectURL(file);
    }

    // If using image cropper, handle here
    // For now, we're directly using the file
    uploadFileToServer(file, file_name);
  }
};

const uploadFileToServer = async (file, file_name) => {
  try {
    // Create a form data object
    const formData = new FormData();
    formData.append("file", file);

    const { $axios } = useNuxtApp();
    const response = await $axios.post("/api/v1/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data && response.data.data && response.data.data.length > 0) {
      const fileName = response.data.data[0].file.name;

      // Store the file name in the corresponding form field
      if (file_name === "q_file") {
        form.q_file = fileName;
      } else if (file_name === "answer_full_file") {
        form.answer_full_file = fileName;
      } else if (file_name === "a_file") {
        form.a_file = fileName;
      } else if (file_name === "b_file") {
        form.b_file = fileName;
      } else if (file_name === "c_file") {
        form.c_file = fileName;
      } else if (file_name === "d_file") {
        form.d_file = fileName;
      }
    }
  } catch (error) {
    const toast = useNuxtApp().$toast;
    if (toast) {
      toast.error("Failed to upload file");
    }
    console.error("File upload error:", error);
  }
};

const cropFile = ({ coordinates, canvas, image }) => {
  if (current_crop_file.value === "q_file")
    form.q_file_base64 = canvas.toDataURL();
  else if (current_crop_file.value === "answer_full_file")
    form.answer_full_file_base64 = canvas.toDataURL();
  else if (current_crop_file.value === "a_file")
    form.a_file_base64 = canvas.toDataURL();
  else if (current_crop_file.value === "b_file")
    form.b_file_base64 = canvas.toDataURL();
  else if (current_crop_file.value === "c_file")
    form.c_file_base64 = canvas.toDataURL();
  else if (current_crop_file.value === "d_file")
    form.d_file_base64 = canvas.toDataURL();
};

const deleteFile = (file_name) => {
  if (file_name === "q_file") {
    form.q_file_base64 = "";
    if (questionInput.value) questionInput.value.value = null;
    current_crop_file.value = "";
  } else if (file_name === "answer_full_file") {
    form.answer_full_file_base64 = "";
    if (answerFullInput.value) answerFullInput.value.value = null;
    current_crop_file.value = "";
  } else if (file_name === "a_file") {
    form.a_file_base64 = "";
    if (aInput.value) aInput.value.value = null;
    current_crop_file.value = "";
  } else if (file_name === "b_file") {
    form.b_file_base64 = "";
    if (bInput.value) bInput.value.value = null;
    current_crop_file.value = "";
  } else if (file_name === "c_file") {
    form.c_file_base64 = "";
    if (cInput.value) cInput.value.value = null;
    current_crop_file.value = "";
  } else if (file_name === "d_file") {
    form.d_file_base64 = "";
    if (dInput.value) dInput.value.value = null;
    current_crop_file.value = "";
  }
};

const answerTypeChanged = (type) => {
  if (type === "txt") {
    if (text_answer.value === true) {
      photo_answer.value = false;
      form.testImgAnswers = false;
      text_answer_rules.value = "required";
      photo_answer_rules.value = "";
    } else {
      photo_answer.value = true;
      form.testImgAnswers = true;
      text_answer_rules.value = "";
    }
  } else {
    if (photo_answer.value === true) {
      text_answer.value = false;
      form.testImgAnswers = true;
      text_answer_rules.value = "";
    } else {
      text_answer.value = true;
      form.testImgAnswers = false;
      text_answer_rules.value = "required";
      photo_answer_rules.value = "";
    }
  }
};

const getCurrentExamInfo = async () => {
  // Implementation for fetching exam info if needed
};

const getBase64FromUrl = async (url) => {
  try {
    const response = await $fetch(url.replace(process.env.FILE_BASE_URL, ""), {
      responseType: "blob",
    });
    file_original_path.value = URL.createObjectURL(response);
  } catch (err) {
    console.error(err);
  }
};

const urlencodeFormData = (fd) => {
  let s = "";
  for (const pair of fd.entries()) {
    if (typeof pair[1] === "string") {
      s += (s ? "&" : "") + encode(pair[0]) + "=" + encode(pair[1]);
    }
  }
  return s;
};

const encode = (s) => {
  return encodeURIComponent(s).replace(/%20/g, "+");
};

const goToPreviewStep = () => {
  emit("update:goToPreviewStep", 3);
};

// Watch form fields
watch(
  () => form.section,
  (val) => {
    if (val) getTypeList("base", val);
  }
);

watch(
  () => form.base,
  (val) => {
    if (val) getTypeList("lesson", val);
  }
);

watch(
  () => form.lesson,
  (val) => {
    if (val) getTypeList("topic", val);
  }
);

watch(
  () => form.type,
  (val) => {
    if (val == "tf") {
      form.answer_a = "True";
      form.answer_b = "False";
    } else {
      form.answer_a = "";
      form.answer_b = "";
    }
  }
);

// Initialize on mount
onMounted(() => {
  getTypeList("section");
  getCurrentExamInfo();
});
</script>

<style>
.pointer {
  cursor: pointer;
}

.image-input {
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  border: 1px dashed #9e9e9e;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.image-preview {
  display: block;
  object-fit: contain;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 8px;
}

.img-clear-btn {
  position: absolute;
  margin-left: -20px;
  margin-top: -4px;
  background-color: white !important;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.18);
}

.topic_season {
  background-color: rgba(144, 202, 249, 0.2);
}

#test-question {
  margin-bottom: 20px;
}

.test-maker .test-list {
  margin-bottom: 20px;
}

.test-maker .answer {
  margin-left: 10px;
}

.test-maker .true_answer {
  color: #4caf50;
}

.answer_label {
  position: absolute;
  font-size: 16px;
  font-weight: 600;
  color: #26a69a;
  bottom: 0;
  left: 8px;
}

/* For image previews */
.v-card img {
  max-width: 100%;
  height: auto;
}

.ckeditor-wrapper {
  width: 100%;
}

.image-holder {
  position: relative;
  display: inline-block;
  margin-bottom: 16px;
}

.image-holder .img-clear-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 5;
}

/* Ensure proper handling of radio buttons */
#test-image-options .v-radio {
  margin-bottom: 0;
}
</style>
