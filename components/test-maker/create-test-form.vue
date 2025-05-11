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
        <VeeForm ref="veeForm" @submit="submitQuestion">
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
              <FormTopicSelector
                ref="topicSelector"
                :selectedTopics="selected_topics"
                :topic-list="topic_list"
                @selectTopic="selectTopic"
              />
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
                <Field
                  name="question"
                  rules="required"
                  v-slot="{ errorMessage }"
                >
                    <RickEditor
                      v-model:modelValue="form.question"
                    min-height="200px"
                      :features="['bold', 'italic', 'underline', 'alignment']"
                  >
                    <template #content>
                  <v-btn
                        variant="text"
                        color="teal"
                        icon="mdi-camera"
                    size="small"
                        @click="selectFile('q_file')"
                      ></v-btn>
                      <v-btn
                        v-if="form.q_file_base64"
                        variant="text"
                        size="small"
                        color="error"
                        icon="mdi-delete"
                    @click="deleteFile('q_file')"
                  ></v-btn>
                    </template>
                  </RickEditor>
                  <p v-if="errorMessage" class="text-error text-caption mt-1">
                    {{ errorMessage }}
                  </p>
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
              <!--Answer type toggle-->
              <v-row v-if="['fourchoice', 'twochoice'].includes(form.type)">
                <v-col cols="12" class="d-flex align-center justify-center">
                  <p class="mr-3 mt-3">Choices type:</p>
                  <v-btn-toggle
                    v-model="answerType"
                            color="teal"
                    density="comfortable"
                    mandatory
                  >
                    <v-btn value="text" @click="answerTypeChanged('txt')">
                      <v-icon start>mdi-format-text</v-icon>
                      Text
                    </v-btn>
                    <v-btn value="photo" @click="answerTypeChanged('photo')">
                      <v-icon start>mdi-camera</v-icon>
                            Photo
                    </v-btn>
                  </v-btn-toggle>
                    </v-col>
                  </v-row>
              <!--End answer type-->

              <!--Test answer options-->
              <Field
                name="true_answer"
                rules="required"
                v-slot="{ field, errorMessage }"
              >
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
                            :features="[
                              'bold',
                              'italic',
                              'underline',
                              'alignment',
                            ]"
                          >
                          </RickEditor>
                          <p
                            v-if="errorMessage"
                            class="text-error text-caption mt-1"
                          >
                            {{ errorMessage }}
                          </p>
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
                          color="teal-lighten-5"
                          class="image-input d-flex align-center justify-center"
                          style="width: 90px; height: 90px"
                          @click="selectFile('a_file')"
                        >
                          <v-icon size="x-large" color="teal"
                            >mdi-camera</v-icon
                          >
                        </v-btn>

                          <v-btn
                          v-show="form.a_file_base64"
                          @click="deleteFile('a_file')"
                          variant="text"
                          color="error"
                          icon="mdi-delete"
                            size="small"
                          class="img-clear-btn"
                          ></v-btn>
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
                            :features="[
                              'bold',
                              'italic',
                              'underline',
                              'alignment',
                            ]"
                          >
                          </RickEditor>
                          <p
                            v-if="errorMessage"
                            class="text-error text-caption mt-1"
                          >
                            {{ errorMessage }}
                          </p>
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
                          color="teal-lighten-5"
                          class="image-input d-flex align-center justify-center"
                          style="width: 90px; height: 90px"
                              @click="selectFile('b_file')"
                            >
                          <v-icon size="x-large" color="teal"
                            >mdi-camera</v-icon
                          >
                        </v-btn>

                                <v-btn
                          v-show="form.b_file_base64"
                                  @click="deleteFile('b_file')"
                          variant="text"
                          color="error"
                          icon="mdi-delete"
                          size="small"
                          class="img-clear-btn"
                                ></v-btn>
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
                            :features="[
                              'bold',
                              'italic',
                              'underline',
                              'alignment',
                            ]"
                          >
                          </RickEditor>
                          <p
                            v-if="errorMessage"
                            class="text-error text-caption mt-1"
                          >
                            {{ errorMessage }}
                          </p>
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
                          color="teal-lighten-5"
                          class="image-input d-flex align-center justify-center"
                          style="width: 90px; height: 90px"
                          @click="selectFile('c_file')"
                        >
                          <v-icon size="x-large" color="teal"
                            >mdi-camera</v-icon
                          >
                        </v-btn>

                                <v-btn
                          v-show="form.c_file_base64"
                          @click="deleteFile('c_file')"
                          variant="text"
                          color="error"
                          icon="mdi-delete"
                                  size="small"
                          class="img-clear-btn"
                                ></v-btn>
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
                            :features="[
                              'bold',
                              'italic',
                              'underline',
                              'alignment',
                            ]"
                          >
                          </RickEditor>
                          <p
                            v-if="errorMessage"
                            class="text-error text-caption mt-1"
                          >
                            {{ errorMessage }}
                          </p>
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
                          color="teal-lighten-5"
                          class="image-input d-flex align-center justify-center"
                          style="width: 90px; height: 90px"
                          @click="selectFile('d_file')"
                        >
                          <v-icon size="x-large" color="teal"
                            >mdi-camera</v-icon
                          >
                        </v-btn>

                                  <v-btn
                          v-show="form.d_file_base64"
                          @click="deleteFile('d_file')"
                          variant="text"
                          color="error"
                          icon="mdi-delete"
                                    size="small"
                          class="img-clear-btn"
                                  ></v-btn>
                                </div>
                    </v-col>
                  </v-row>
                </v-radio-group>
                        </Field>
              <!--End test answer options-->
            </v-col>

            <!--Solution section-->
            <v-col
              cols="12"
              :md="
                ['tf', 'fourchoice', 'twochoice'].includes(form.type) ? 12 : 6
              "
              :id="
                ['tf', 'fourchoice', 'twochoice'].includes(form.type)
                  ? 'test-maker-answer'
                  : 'test-maker-answer-alternative'
              "
            >
              <p>Solution:</p>
              <ClientOnly fallback-tag="span" fallback="Loading...">
                <RickEditor
                  v-model:modelValue="form.answer_full"
                  min-height="90px"
                  :features="['bold', 'italic', 'underline', 'alignment']"
                >
                </RickEditor>
              </ClientOnly>
              <img
                width="90"
                height="90"
                class="pointer image-input rounded"
                v-if="form.answer_full_file_base64"
                @click="selectFile('answer_full_file')"
                :src="form.answer_full_file_base64"
              />
              <v-btn
                v-else
                variant="flat"
                color="teal-lighten-5"
                class="image-input d-flex align-center justify-center"
                style="width: 90px; height: 90px"
                @click="selectFile('answer_full_file')"
              >
                <v-icon size="x-large" color="teal">mdi-camera</v-icon>
              </v-btn>

                                  <v-btn
                v-show="form.answer_full_file_base64"
                @click="deleteFile('answer_full_file')"
                variant="text"
                color="error"
                icon="mdi-delete"
                                    size="small"
                class="img-clear-btn"
              >
                <v-icon small> mdi-delete </v-icon>
              </v-btn>
                    </v-col>
            <!--End solution section-->
                  </v-row>

                  <v-row>
                    <v-col cols="12">
                  <v-row>
                <v-col cols="12" md="6" class="pb-0">
                  <v-btn
                    type="submit"
                    :disabled="buttonDisabled"
                    :loading="create_loading"
                    size="large"
                     color="teal"
                    variant="flat"
                    class="white--text"
                    block
                  >
                    Create
                  </v-btn>
                </v-col>
                <v-col cols="12" md="6">
                  <v-btn
                    @click="goToPreviewStep"
                    :disabled="examTestListLength < 5"
                    size="large"
                            color="teal"
                    variant="flat"
                    class="white--text"
                    block
                  >
                    <span v-show="examTestListLength < 5"
                      >Add at least {{ 5 - examTestListLength }} more
                      tests</span
                    >
                    <span v-show="examTestListLength >= 5">Next step</span>
                  </v-btn>
                </v-col>
              </v-row>
                    </v-col>
                  </v-row>

          <!--Hidden input section-->
                      <div>
            <Field name="q_file" v-slot="{ errorMessage }">
              <v-file-input
                class="d-none"
                accept="image/png,image/webp,image/jpeg,image/jpg"
                @update:model-value="uploadFile('q_file', $event)"
                v-model="form_hidden_data.q_file"
                ref="questionInput"
                :error-messages="errorMessage"
              />
            </Field>

            <Field name="answer_full_file" v-slot="{ errorMessage }">
              <v-file-input
                class="d-none"
                accept="image/png,image/webp,image/jpeg,image/jpg"
                @update:model-value="uploadFile('answer_full_file', $event)"
                v-model="form_hidden_data.answer_full_file"
                            ref="answerFullInput"
                :error-messages="errorMessage"
              />
            </Field>

            <Field
              name="a_file"
              :rules="photo_answer_rules"
              v-slot="{ errorMessage }"
            >
              <v-file-input
                class="d-none"
                accept="image/png,image/webp,image/jpeg,image/jpg"
                @update:model-value="uploadFile('a_file', $event)"
                v-model="form_hidden_data.a_file"
                ref="aInput"
                :error-messages="errorMessage"
              />
            </Field>

            <Field
              name="b_file"
              :rules="photo_answer_rules"
              v-slot="{ errorMessage }"
            >
              <v-file-input
                class="d-none"
                accept="image/png,image/webp,image/jpeg,image/jpg"
                @update:model-value="uploadFile('b_file', $event)"
                v-model="form_hidden_data.b_file"
                ref="bInput"
                :error-messages="errorMessage"
              />
            </Field>

            <Field
              name="c_file"
              :rules="photo_answer_rules"
              v-slot="{ errorMessage }"
            >
              <v-file-input
                class="d-none"
                accept="image/png,image/webp,image/jpeg,image/jpg"
                @update:model-value="uploadFile('c_file', $event)"
                v-model="form_hidden_data.c_file"
                ref="cInput"
                :error-messages="errorMessage"
              />
            </Field>

            <Field
              name="d_file"
              :rules="photo_answer_rules"
              v-slot="{ errorMessage }"
            >
              <v-file-input
                class="d-none"
                accept="image/png,image/webp,image/jpeg,image/jpg"
                @update:model-value="uploadFile('d_file', $event)"
                v-model="form_hidden_data.d_file"
                ref="dInput"
                :error-messages="errorMessage"
              />
            </Field>
                            </div>
        </VeeForm>
      </v-card-text>
    </v-card>

    <!--Cropper Dialog-->
    <v-dialog v-model="cropper_dialog" max-width="500">
      <v-card>
        <v-card-title class="text-h5 bg-teal text-white">
          <v-icon start class="mr-2">mdi-crop</v-icon>
          Crop Image
        </v-card-title>
        <v-card-text class="pt-4">
          <v-progress-circular
            v-if="crop_file_loading"
            indeterminate
            color="teal"
            size="64"
            class="my-8 mx-auto d-block"
          ></v-progress-circular>
          
          <div v-else class="cropper-container">
            <!-- In production, you'd use a proper cropper component -->
            <img 
              :src="crop_file_url" 
              style="max-width: 100%; height: auto;" 
              class="rounded elevation-1"
            />
            
            <div class="text-caption text-center text-grey mt-2">
              Drag to adjust the crop area
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn 
            color="grey-darken-1" 
            variant="text" 
            @click="cropper_dialog = false"
          >
            Cancel
          </v-btn>
          <v-btn 
            color="teal" 
            variant="flat" 
            @click="submitCrop"
            :loading="crop_confirm_loading"
          >
            Crop & Upload
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { Form as VeeForm, Field, useForm } from "vee-validate";
import { required } from "@vee-validate/rules";
import { defineRule } from "vee-validate";
import FormTopicSelector from "~/components/form/topic-selector.vue";
import * as yup from "yup";
import { useAuth } from "~/composables/useAuth";

const auth = useAuth();

/**
 * Component props
 */
const props = defineProps({
  examEditMode: {
    type: Boolean,
    default: false,
  },
});

/**
 * Component emits
 */
const emit = defineEmits(["update:updateTestList", "update:goToPreviewStep"]);

/**
 * Get Nuxt app services and utilities
 */
const { $toast } = useNuxtApp();
const router = useRouter();
const route = useRoute();

/**
 * Define refs for HTML elements (file inputs)
 */
const veeForm = ref(null);
const questionInput = ref(null);
const answerFullInput = ref(null);
const aInput = ref(null);
const bInput = ref(null);
const cInput = ref(null);
const dInput = ref(null);

/**
 * User token
 */
const userToken = ref("");

/**
 * UI state management
 */
const path_panel_expand = ref(true);
const create_loading = ref(false);
const test_step = ref(1);
const text_answer = ref(true);
const text_answer_rules = ref("required");
const photo_answer = ref(false);
const photo_answer_rules = ref((value) => {
  if (!value) return true;

  if (form.testImgAnswers && form.true_answer) {
    const option = form.true_answer.toLowerCase();
    if (option === "a" || option === "b" || option === "c" || option === "d") {
      const optionFile = form_hidden_data[`${option}_file`];
      if (!optionFile) {
        return "Please upload an image for the correct answer";
      }
    }
  }
  return true;
});
const answerType = ref("text"); // Default to text answers
const examTestListLength = ref(0);
const file_original_path = ref("");

/**
 * Cropper related state
 */
const crop_file_url = ref("");
const crop_file_loading = ref(false);
const crop_confirm_loading = ref(false);
const cropper_dialog = ref(false);
const current_crop_file = ref("");

/**
 * Form data and hidden fields
 */
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
  q_file: null,
  q_file_base64: "",
  answer_full: "",
  answer_full_file: null,
  answer_full_file_base64: "",
  answer_a: "",
  answer_b: "",
  answer_c: "",
  answer_d: "",
  a_file: null,
  b_file: null,
  c_file: null,
  d_file: null,
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

/**
 * Data lists for selectors
 */
const level_list = ref([]);
const grade_list = ref([]);
const field_list = ref([]);
const lesson_list = ref([]);
const topic_list = ref([]);

/**
 * Selected topics state
 */
const selected_topics = ref([]);

/**
 * Handle topic selection from topic selector
 * @param {Array} topics - Array of selected topic IDs
 */
const selectTopic = (topics) => {
  selected_topics.value = topics;
  const topicIds = topics.map(id => parseInt(id));
  form.topic = topicIds.length > 0 ? topicIds[0] : null;
};

/**
 * Static data lists
 */
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

/**
 * Validation schema using Yup
 */
const validationSchema = yup.object({
  question: yup.string().test(
    'has-content',
    'Question is required',
    (value) => !!value && value.trim() !== ''
  ),
  true_answer: yup.string().when("type", {
    is: (val) => ["fourchoice", "twochoice", "tf"].includes(val),
    then: () => yup.string().test(
      'has-answer',
      'Please select the correct answer',
      (value) => !!value
    ),
  }),
  // Additional validations based on answer type
  answer_a: yup.string().when(["type", "testImgAnswers"], {
    is: (type, testImgAnswers) =>
      ["fourchoice", "twochoice", "tf"].includes(type) && !testImgAnswers,
    then: () => yup.string().test(
      'has-content',
      'Answer A is required',
      (value) => !!value && value.trim() !== ''
    ),
  }),
  answer_b: yup.string().when(["type", "testImgAnswers"], {
    is: (type, testImgAnswers) =>
      ["fourchoice", "twochoice", "tf"].includes(type) && !testImgAnswers,
    then: () => yup.string().test(
      'has-content',
      'Answer B is required',
      (value) => !!value && value.trim() !== ''
    ),
  }),
  answer_c: yup.string().when(["type", "testImgAnswers"], {
    is: (type, testImgAnswers) => type === "fourchoice" && !testImgAnswers,
    then: () => yup.string().test(
      'has-content',
      'Answer C is required',
      (value) => !!value && value.trim() !== ''
    ),
  }),
  answer_d: yup.string().when(["type", "testImgAnswers"], {
    is: (type, testImgAnswers) => type === "fourchoice" && !testImgAnswers,
    then: () => yup.string().test(
      'has-content',
      'Answer D is required',
      (value) => !!value && value.trim() !== ''
    ),
  }),
  answer_full: yup.string().when(["type", "testImgAnswers"], {
    is: (type, testImgAnswers) => type === "descriptive" && !testImgAnswers,
    then: () => yup.string().test(
      'has-content',
      'Full answer is required',
      (value) => !!value && value.trim() !== ''
    ),
  }),
});

/**
 * Initialize VeeValidate form
 */
const {
  handleSubmit: veeHandleSubmit,
  isSubmitting,
  validate,
  meta,
  resetForm,
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

/**
 * Fetch type list data from API
 * @param {string} type - The type of data to fetch (section, base, lesson, etc.)
 * @param {string} parent - The parent ID (optional)
 */
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

/**
 * Handle form submission
 */
const submitQuestion = veeHandleSubmit(async (values) => {
  console.log("Submit handler triggered with values:", values);
  create_loading.value = true;
  
  try {
    // Extract the required fields from the form
    const formData = {
      section: form.section,
      base: form.base,
      lesson: form.lesson,
      topic: form.topic,
      type: form.type,
      question: form.question,
      true_answer: form.true_answer,
      testImgAnswers: form.testImgAnswers,
      // Include other fields based on the question type
      ...(form.type === 'fourchoice' && {
        answer_a: form.answer_a,
        answer_b: form.answer_b,
        answer_c: form.answer_c,
        answer_d: form.answer_d,
      }),
      ...(form.type === 'twochoice' && {
        answer_a: form.answer_a,
        answer_b: form.answer_b,
      }),
      ...(form.testImgAnswers && {
        q_file: form.q_file,
        a_file: form.a_file,
        b_file: form.b_file,
        c_file: form.c_file,
        d_file: form.d_file,
      }),
      answer_full: form.answer_full,
      answer_full_file: form.answer_full_file,
    };
    
    console.log("Prepared form data to send:", formData);
    
    // Use proper querystring
    const querystring = require("querystring");
    const formDataString = querystring.stringify(formData);
    console.log("Stringified form data:", formDataString);
    
    console.log("Sending request to /api/v1/examTests");
    
    // Add a simulated delay for easier debugging in console
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const response = await $fetch("/api/v1/examTests", {
      method: "POST",
      body: formDataString,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }).catch(error => {
      console.error("Network error details:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });
      throw error;
    });

    console.log("API response received:", response);

    if (response.status == 1) {
      console.log("Test created successfully with ID:", response.data?.id);
      $toast.success("Created successfully");
      path_panel_expand.value = false;

      // Edit mode or create exam progress
      if (props.examEditMode === true) {
        console.log("Emitting update event with ID:", response.data.id);
        emit("update:updateTestList", response.data.id);
      }

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
      console.error("API returned error status:", response);
      $toast.error(response.message || "An error occurred, try again");
    }
  } catch (err) {
    console.error("Error submitting form:", err);
    if (err.response?.status == 400) {
      console.error("Bad request error:", err.response.data);
      $toast.error(err.response.data.message || "Bad request");
    } else if (err.response?.status == 403) {
      // Handle authentication error
      console.error("Authentication error:", err.response?.data);
      $toast.error("Authentication error");
      router.push("/login");
    } else {
      console.error("Unhandled error:", err);
      $toast.error(err.message || "An error occurred");
    }
  } finally {
    create_loading.value = false;
  }
});

/**
 * Select file for upload
 * @param {string} file_name - Name of the file field
 */
const selectFile = (file_name) => {
  if (file_name === "q_file" && questionInput.value) {
    questionInput.value.$el.querySelector('input[type="file"]').click();
  } else if (file_name === "answer_full_file" && answerFullInput.value) {
    answerFullInput.value.$el.querySelector('input[type="file"]').click();
  } else if (file_name === "a_file" && aInput.value) {
    aInput.value.$el.querySelector('input[type="file"]').click();
  } else if (file_name === "b_file" && bInput.value) {
    bInput.value.$el.querySelector('input[type="file"]').click();
  } else if (file_name === "c_file" && cInput.value) {
    cInput.value.$el.querySelector('input[type="file"]').click();
  } else if (file_name === "d_file" && dInput.value) {
    dInput.value.$el.querySelector('input[type="file"]').click();
  }
};

/**
 * Handle file upload
 * @param {string} file_name - Name of the file field
 * @param {File|File[]} fileEvent - The file(s) from the input event
 */
const uploadFile = (file_name, fileEvent) => {
  // v-file-input can return array or single file, handle both cases
  const file = Array.isArray(fileEvent) ? fileEvent[0] : fileEvent;
  
  if (!file) return;
  
  // Set current crop file name
  current_crop_file.value = file_name;

  // Update the preview image
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

  // Set crop file URL for cropper dialog
  crop_file_url.value = URL.createObjectURL(file);

  // If need to show cropper, uncomment this
  // cropper_dialog.value = true;

  // Upload directly without cropper for now
    uploadFileToServer(file, file_name);
};

/**
 * Upload file to server
 * @param {File} file - The file to upload
 * @param {string} file_name - The name of the file field
 */
const uploadFileToServer = async (file, file_name) => {
  const { $toast } = useNuxtApp();
  
  if (!file) {
    $toast.error("No file selected");
    return;
  }
  
  try {
    // Create a FormData object
    const formData = new FormData();
    formData.append("file", file);

    // Send API request
    const response = await $fetch("/api/v1/upload", {
      method: "POST",
      body: formData
    });

    if (response?.data?.[0]?.file?.name) {
      // Get the file name from the response
      const fileName = response.data[0].file.name;
      
      // Update the corresponding form field
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
      
      $toast.success("File uploaded successfully");
    } else {
      $toast.error("Invalid response from server");
    }
  } catch (error) {
    $toast.error("Failed to upload file");
    console.error("File upload error:", error);
  }
};

/**
 * Handle image cropping
 * @param {Object} param0 - Cropper data
 */
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

/**
 * Delete file
 * @param {string} file_name - Name of the file field
 */
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

/**
 * Handle answer type change
 * @param {string} type - The answer type (txt or photo)
 */
const answerTypeChanged = (type) => {
  if (type === "txt") {
    text_answer.value = true;
      photo_answer.value = false;
      form.testImgAnswers = false;
      text_answer_rules.value = "required";
    answerType.value = "text";
    } else {
    text_answer.value = false;
      photo_answer.value = true;
      form.testImgAnswers = true;
      text_answer_rules.value = "";
    answerType.value = "photo";
  }
};

/**
 * Fetch current exam information
 */
const getCurrentExamInfo = async () => {
  // Get current exam ID from router or state
  const currentExamId = useState("user").value?.currentExamId;
  
  if (currentExamId) {
    try {
      const response = await $fetch(`/api/v1/exams/info/${currentExamId}`);
      
      // Set form data from response
      form.section = response.data.section;
      form.base = response.data.base;
      form.lesson = response.data.lesson;
      
      // Set file path if available
      if (response.data.file_original) {
        file_original_path.value = response.data.file_original;
      }
      
      // Set exam test list length
      if (response.data.tests && Array.isArray(response.data.tests)) {
        examTestListLength.value = response.data.tests.length;
      }
    } catch (err) {
      console.error("Error fetching exam info:", err);
      const { $toast } = useNuxtApp();
      $toast.error("Failed to load exam information");
    }
  }
};

/**
 * Get base64 from URL
 * @param {string} url - The URL to fetch
 */
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

/**
 * URL encode form data
 * @param {FormData} fd - Form data object
 * @returns {string} URL encoded string
 */
const urlencodeFormData = (fd) => {
  let s = "";
  for (const pair of fd.entries()) {
    if (typeof pair[1] === "string") {
      s += (s ? "&" : "") + encode(pair[0]) + "=" + encode(pair[1]);
    }
  }
  return s;
};

/**
 * URL encode string
 * @param {string} s - String to encode
 * @returns {string} Encoded string
 */
const encode = (s) => {
  return encodeURIComponent(s).replace(/%20/g, "+");
};

/**
 * Go to preview step
 */
const goToPreviewStep = () => {
  emit("update:goToPreviewStep", 3);
};

/**
 * Set up watchers
 */
// Watch section change to update base list
watch(
  () => form.section,
  (val) => {
    if (val) getTypeList("base", val);
  }
);

// Watch base change to update lesson list
watch(
  () => form.base,
  (val) => {
    if (val) getTypeList("lesson", val);
  }
);

// Watch lesson change to update topic list
watch(
  () => form.lesson,
  (val) => {
    if (val) getTypeList("topic", val);
  }
);

// Watch type change to update answers for true/false
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

/**
 * Initialize on mount
 */
onMounted(() => {
  // Initialize data
  userToken.value = auth.getUserToken();
  getTypeList("section");
  getCurrentExamInfo();
});

/**
 * Submit cropped image for upload
 */
const submitCrop = async () => {
  crop_confirm_loading.value = true;
  
  try {
    // In a real implementation with a proper cropper component,
    // you would get the cropped canvas data here
    
    // For now, we'll just use the original file since we don't have
    // the actual cropping functionality implemented
    let file = null;
    
    if (current_crop_file.value === "q_file") {
      file = form_hidden_data.q_file;
    } else if (current_crop_file.value === "answer_full_file") {
      file = form_hidden_data.answer_full_file;
    } else if (current_crop_file.value === "a_file") {
      file = form_hidden_data.a_file;
    } else if (current_crop_file.value === "b_file") {
      file = form_hidden_data.b_file;
    } else if (current_crop_file.value === "c_file") {
      file = form_hidden_data.c_file;
    } else if (current_crop_file.value === "d_file") {
      file = form_hidden_data.d_file;
    }
    
    if (file) {
      // Upload the file directly
      await uploadFileToServer(file, current_crop_file.value);
      
      // Close the dialog after successful upload
      cropper_dialog.value = false;
    } else {
      const { $toast } = useNuxtApp();
      $toast.error("No file to upload");
    }
  } catch (error) {
    console.error("Error submitting cropped image:", error);
    const { $toast } = useNuxtApp();
    $toast.error("Failed to upload cropped image");
  } finally {
    crop_confirm_loading.value = false;
  }
};

/**
 * Create test handler (for backward compatibility)
 * This is a wrapper for submitQuestion
 */
const createTest = () => {
  console.log("Create button clicked! Triggering manual form submission...");
  
  // If the button is using @click.prevent instead of type="submit",
  // we can trigger submission via the VeeForm ref
  if (veeForm.value) {
    console.log("Submitting form via veeForm ref");
    veeForm.value.submitForm();
  } else {
    console.log("VeeForm ref not found, calling submitQuestion directly");
    submitQuestion();
  }
};

/**
 * Trigger form validation manually after user interacts with RichEditor
 * This ensures validation state is updated properly
 */
const validateForm = () => {
  // Only validate after a small delay to avoid performance issues
  setTimeout(() => {
    validate();
  }, 100);
};

/**
 * Watch for changes in rich editor content and validate the form
 */
watch(
  () => form.question,
  () => validateForm()
);

watch(
  () => [form.answer_a, form.answer_b, form.answer_c, form.answer_d, form.answer_full],
  () => validateForm()
);

/**
 * Determine if the create button should be disabled
 */
const buttonDisabled = computed(() => {
  // Check only basic mandatory fields
  const required = form.section && form.base && form.lesson && form.topic && form.question;
  
  // For multiple choice forms, also check true_answer
  if (['fourchoice', 'twochoice', 'tf'].includes(form.type)) {
    return !required || !form.true_answer;
  }
  
  return !required;
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
  transition: all 0.2s ease;
}

.image-input:hover {
  background-color: rgba(0, 150, 136, 0.05);
  border-color: #009688;
}

.image-preview {
  display: block;
  object-fit: contain;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 8px;
  max-width: 100%;
  height: auto;
}

.img-clear-btn {
  position: absolute;
  margin-left: -20px;
  margin-top: -4px;
  background-color: white !important;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.18);
  transition: all 0.2s ease;
}

.img-clear-btn:hover {
  transform: scale(1.05);
}

.topic_season {
  background-color: rgba(144, 202, 249, 0.2);
  font-weight: 600;
  color: #1565c0;
  border-radius: 4px;
  padding: 2px 6px;
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

/* Cropper container styles */
.cropper-container {
  position: relative;
  max-width: 100%;
  margin: 0 auto;
  border-radius: 4px;
  overflow: hidden;
}

.white--text {
  color: white !important;
}

/* For better form spacing */
.v-card-text {
  padding-bottom: 24px;
}
</style>
