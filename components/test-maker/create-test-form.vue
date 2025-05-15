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
        <VeeForm ref="veeForm" @submit.prevent>
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
                color="orange"
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
                color="orange"
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
                color="orange"
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
                density="compact"
                :items="topic_list"
                item-value="id"
                item-title="title"
                v-model="form.topic"
                label="Topics"
                variant="outlined"
                color="orange"
                :rules="[(v) => !!v || 'This field is required']"
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
                color="orange"
                :rules="[(v) => !!v || 'Question type is required']"
              ></v-autocomplete>
            </v-col>

            <!--Question section-->
            <v-col cols="12" md="6" id="test-maker-question">
              <p>Question:</p>
              <ClientOnly fallback-tag="span" fallback="Loading...">
                <Field
                  name="question"
                  :validate="validateQuestionField"
                  v-slot="{ errorMessage }"
                >
                  <RickEditor
                    v-model:modelValue="form.question"
                    min-height="200px"
                    :features="['bold', 'italic', 'underline', 'alignment']"
                  >
                    <template #content>
                      <v-btn
                        v-if="!form.q_file_base64"
                        variant="text"
                        icon="mdi-camera"
                        size="x-large"
                        @click="selectFile('q_file')"
                      >
                      <v-icon size="80" color="#A11333">mdi-camera</v-icon>
                    </v-btn>
                      <v-btn
                        v-if="form.q_file_base64"
                        variant="text"
                        color="error"
                        icon="mdi-delete"
                        @click="deleteFile('q_file')"
                      ></v-btn>
                      <img
                        v-if="form.q_file_base64"
                        width="200"
                        height="200"
                        class="pointer image-preview rounded mt-2"
                        @click="selectFile('q_file')"
                        :src="form.q_file_base64"
                      />
                    </template>
                  </RickEditor>
                  <p v-if="errorMessage" class="text-error text-caption mt-1">
                    {{ errorMessage }}
                  </p>
                </Field>
              </ClientOnly>
            
            </v-col>
            <!--End question section-->

            <v-col
              cols="12"
              md="6"
              v-if="['tf', 'fourchoice', 'twochoice'].includes(form.type)"
            >
              <!--Answer type toggle-->
              <v-row v-if="['fourchoice', 'twochoice'].includes(form.type)">
                <v-col cols="12" class="mb-2">
                  <div class="d-flex flex-row align-center justify-center">
                    <p class="mr-3" style="font-size: 14px">Choices type:</p>
                    <v-radio-group
                      inline
                      v-model="form.answer_type"
                      hide-details
                      style="max-width: fit-content !important"
                    >
                      <v-radio
                        label="Text"
                        color="teal"
                        value="text"
                        @click="answerTypeChanged('txt')"
                        style="font-size: 14px; margin-inline-end: 10px"
                      ></v-radio>
                      <v-radio
                        label="Photo"
                        color="teal"
                        value="photo"
                        @click="answerTypeChanged('photo')"
                        style="font-size: 14px"
                      ></v-radio>
                    </v-radio-group>
                  </div>
                </v-col>
              </v-row>
              <!--End answer type-->

              <!--Test answer options-->
              <Field
                name="true_answer"
                :validate="validateTrueAnswer"
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
                      <v-radio
                        color="orange"
                        value="1"
                        label="A"
                        density="compact"
                        style="display: contents; font-size: 14px;"
                      ></v-radio>
                    </v-col>
                    <v-col
                      class="pb-0"
                      cols="11"
                      v-show="form.testImgAnswers === false"
                    >
                      <Field
                        :name="'answer_a'"
                        :validate="validateAnswerField"
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
                            style="margin-inline-start: 10px;"
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
                          variant="text"
                          color="teal-lighten-5"
                          class="d-flex align-center justify-center"
                          style="width: 90px; height: 90px"
                          @click="selectFile('a_file')"
                        >
                          <v-icon size="80" color="#A11333">mdi-camera</v-icon>
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
                      <v-radio
                        color="orange"
                        value="2"
                        label="B"
                        density="compact"
                        style="display: contents; font-size: 14px;"
                      ></v-radio>
                    </v-col>
                    <v-col
                      class="pb-0"
                      cols="11"
                      v-show="form.testImgAnswers === false"
                    >
                      <Field
                        :name="'answer_b'"
                        :validate="validateAnswerField"
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
                            style="margin-inline-start: 10px;"
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
                          variant="text"
                          color="teal-lighten-5"
                          class="d-flex align-center justify-center"
                          style="width: 90px; height: 90px"
                          @click="selectFile('b_file')"
                        >
                          <v-icon size="80" color="#A11333">mdi-camera</v-icon>
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
                      <v-radio
                        color="orange"
                        value="3"
                        label="C"
                        density="compact"
                        style="display: contents; font-size: 14px;"
                      ></v-radio>
                    </v-col>
                    <v-col
                      class="pb-0"
                      cols="11"
                      v-show="form.testImgAnswers === false"
                    >
                      <Field
                        :name="'answer_c'"
                        :validate="validateAnswerField"
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
                            style="margin-inline-start: 10px;"
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
                          variant="text"
                          color="teal-lighten-5"
                          class="d-flex align-center justify-center"
                          style="width: 90px; height: 90px"
                          @click="selectFile('c_file')"
                        >
                          <v-icon size="80" color="#A11333">mdi-camera</v-icon>
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
                      <v-radio
                        color="orange"
                        value="4"
                        label="D"
                        density="compact"
                        style="display: contents; font-size: 14px;"
                      ></v-radio>
                    </v-col>
                    <v-col
                      class="pb-0"
                      cols="11"
                      v-show="form.testImgAnswers === false"
                    >
                      <Field
                        :name="'answer_d'"
                        :validate="validateAnswerField"
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
                            style="margin-inline-start: 10px;"
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
                          variant="text"
                          color="teal-lighten-5"
                          class="d-flex align-center justify-center"
                          style="width: 90px; height: 90px"
                          @click="selectFile('d_file')"
                        >
                          <v-icon size="80" color="#A11333">mdi-camera</v-icon>
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
                variant="text"
                color="teal-lighten-5"
                class=" d-flex align-center justify-center"
                style="width: 90px; height: 90px; position: absolute; bottom: 5px; right: 10px;"
                size="x-large"
                @click="selectFile('answer_full_file')"
              >
                <v-icon size="80" color="#A11333">mdi-camera</v-icon>
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
                    type="button"
                    :disabled="buttonDisabled"
                    :loading="create_loading"
                    size="large"
                    variant="flat"
                    class="primary-gray-400"
                    density="compact"
                    block
                    @click.prevent="manualSubmit"
                  >
                    Create
                  </v-btn>
                </v-col>
                <v-col cols="12" md="6">
                  <v-btn
                    @click="goToPreviewStep"
                    :disabled="examTestListLength < 5"
                    size="large"
                    variant="flat"
                    class="primary-gray-400"
                    density="compact"
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
    <v-dialog v-model="cropper_dialog" max-width="600" transition="dialog-bottom-transition">
      <v-card id="img-cropper-dialog">
        <v-card-text class="pa-0">
          <v-col v-if="crop_file_loading" cols="12" class="text-center">
          <v-progress-circular
              :size="40"
              :width="4"
              class="mt-12 mb-12"
              color="orange"
            indeterminate
            />
          </v-col>
          <div v-else>
            <Cropper
              :src="crop_file_url"
              :stencil-props="stencil_props"
              image-restriction="stencil"
              @change="cropFile"
            />
          </div>
        </v-card-text>
        <v-card-actions style="position: sticky; bottom: 0; left: 0; right: 0" class="pa-0">
          <v-btn
            color="teal"
            variant="flat"
            size="x-large"
            :loading="crop_confirm_loading"
            block
            @click="submitCrop"
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--End cropper Dialog-->
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
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css'; // Import cropper styles

const auth = useAuth();

/**
 * Component props
 */
const props = defineProps({
  examEditMode: {
    type: Boolean,
    default: false,
  },
  initialSection: {
    type: [String, Number],
    default: null
  },
  initialBase: {
    type: [String, Number],
    default: null
  },
  initialLesson: {
    type: [String, Number],
    default: null
  },
  initialTopics: {
    type: Array,
    default: () => []
  }
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
  answer_type: "text",
});

const form_hidden_data = reactive({
  q_file: null,
  answer_full_file: null,
  a_file: null,
  b_file: null,
  c_file: null,
  d_file: null,
  answer_type: "text",
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
  const topicIds = topics.map((id) => parseInt(id));
  form.topic = topicIds.length > 0 ? topicIds[0] : null;
};

/**
 * Static data lists
 */
const txt_direction_list = [
  { value: "ltr", title: "LTR" },
  { value: "rtl", title: "RTL" },
];

/**
 * Cropper stencil properties
 */
const stencil_props = reactive({
  width: 180,
  height: 180,
  aspectRatio: 1
});

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
  question: yup
    .string()
    .test(
      "has-content",
      "Question is required",
      (value) => !!value && value.trim() !== ""
    ),
  true_answer: yup.string().when("type", {
    is: (val) => ["fourchoice", "twochoice", "tf"].includes(val),
    then: () =>
      yup
        .string()
        .test(
          "has-answer",
          "Please select the correct answer",
          (value) => !!value
        ),
  }),
  // Additional validations based on answer type
  answer_a: yup.string().when(["type", "testImgAnswers"], {
    is: (type, testImgAnswers) =>
      ["fourchoice", "twochoice", "tf"].includes(type) && !testImgAnswers,
    then: () =>
      yup
        .string()
        .test(
          "has-content",
          "Answer A is required",
          (value) => !!value && value.trim() !== ""
        ),
  }),
  answer_b: yup.string().when(["type", "testImgAnswers"], {
    is: (type, testImgAnswers) =>
      ["fourchoice", "twochoice", "tf"].includes(type) && !testImgAnswers,
    then: () =>
      yup
        .string()
        .test(
          "has-content",
          "Answer B is required",
          (value) => !!value && value.trim() !== ""
        ),
  }),
  answer_c: yup.string().when(["type", "testImgAnswers"], {
    is: (type, testImgAnswers) => type === "fourchoice" && !testImgAnswers,
    then: () =>
      yup
        .string()
        .test(
          "has-content",
          "Answer C is required",
          (value) => !!value && value.trim() !== ""
        ),
  }),
  answer_d: yup.string().when(["type", "testImgAnswers"], {
    is: (type, testImgAnswers) => type === "fourchoice" && !testImgAnswers,
    then: () =>
      yup
        .string()
        .test(
          "has-content",
          "Answer D is required",
          (value) => !!value && value.trim() !== ""
        ),
  }),
  answer_full: yup.string().when(["type", "testImgAnswers"], {
    is: (type, testImgAnswers) => type === "descriptive" && !testImgAnswers,
    then: () =>
      yup
        .string()
        .test(
          "has-content",
          "Full answer is required",
          (value) => !!value && value.trim() !== ""
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
    answer_type: "text",
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
 * Reset the form to initial state
 */
const resetFormFields = () => {
  // First, clear all validation errors
  clearFieldValidationErrors();
  
  // If in edit mode and using props, we want to preserve certain fields
  const preserveLocation = props.examEditMode && (
    props.initialSection || 
    props.initialBase || 
    props.initialLesson || 
    props.initialTopics?.length
  );
  
  // Store current values of fields we may need to preserve
  const preservedValues = {
    section: form.section,
    base: form.base,
    lesson: form.lesson,
    topic: form.topic
  };
  
  // Reset form fields to default values
  form.question = "";
  form.q_file_base64 = "";
  form.q_file = null;
  form.answer_full = "";
  form.answer_full_file_base64 = "";
  form.answer_full_file = null;
  form.true_answer = "";
  form.testImgAnswers = false;
  form.answer_type = "text";
  
  // Reset answer text fields
  form.answer_a = "";
  form.answer_b = "";
  form.answer_c = "";
  form.answer_d = "";
  
  // Reset answer image fields
  form.a_file_base64 = "";
  form.b_file_base64 = "";
  form.c_file_base64 = "";
  form.d_file_base64 = "";
  form.a_file = null;
  form.b_file = null;
  form.c_file = null;
  form.d_file = null;
  
  // Reset hidden form data
  form_hidden_data.q_file = null;
  form_hidden_data.answer_full_file = null;
  form_hidden_data.a_file = null;
  form_hidden_data.b_file = null;
  form_hidden_data.c_file = null;
  form_hidden_data.d_file = null;
  
  // If in edit mode and using props, restore the preserved values
  if (preserveLocation) {
    form.section = preservedValues.section;
    form.base = preservedValues.base;
    form.lesson = preservedValues.lesson;
    form.topic = preservedValues.topic;
    
    console.log("Preserved form location fields:", {
      section: form.section,
      base: form.base,
      lesson: form.lesson,
      topic: form.topic
    });
  }
  
  // Reset file inputs if they exist
  if (questionInput.value && questionInput.value.$el) {
    const fileInput = questionInput.value.$el.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = null;
  }
  
  if (answerFullInput.value && answerFullInput.value.$el) {
    const fileInput = answerFullInput.value.$el.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = null;
  }
  
  if (aInput.value && aInput.value.$el) {
    const fileInput = aInput.value.$el.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = null;
  }
  
  if (bInput.value && bInput.value.$el) {
    const fileInput = bInput.value.$el.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = null;
  }
  
  if (cInput.value && cInput.value.$el) {
    const fileInput = cInput.value.$el.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = null;
  }
  
  if (dInput.value && dInput.value.$el) {
    const fileInput = dInput.value.$el.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = null;
  }
  
  // Reset VeeValidate form state
  if (veeForm.value) {
    resetForm();
    setTimeout(() => {
      // Validate after reset to make sure validation state is fresh
      validate();
      // Then clear any validation messages that might have been triggered
      clearFieldValidationErrors();
    }, 100);
  }
  
  // Reset UI state
  text_answer.value = true;
  photo_answer.value = false;
  
}

/**
 * Validate all required fields and show appropriate error messages
 * @returns {boolean} True if validation passes, false otherwise
 */
const validateForm = () => {
  const { $toast } = useNuxtApp();
  
  // Check basic required fields
  if (!form.section) {
    if ($toast) $toast.error("Please select a Board");
    return false;
  }
  
  if (!form.base) {
    if ($toast) $toast.error("Please select a Grade");
    return false;
  }
  
  if (!form.lesson) {
    if ($toast) $toast.error("Please select a Subject");
    return false;
  }
  
  if (!form.topic) {
    if ($toast) $toast.error("Please select a Topic");
    return false;
  }
  
  if (!form.question || form.question.trim() === "") {
    if ($toast) $toast.error("Please enter a question");
    return false;
  }
  
  // For multiple choice questions, check answers
  if (["fourchoice", "twochoice", "tf"].includes(form.type)) {
    if (!form.true_answer) {
      if ($toast) $toast.error("Please select the correct answer");
      return false;
    }
    
    // Check text answers if not using image answers
    if (!form.testImgAnswers) {
      if (form.type === "fourchoice" || form.type === "twochoice" || form.type === "tf") {
        if (!form.answer_a || form.answer_a.trim() === "") {
          if ($toast) $toast.error("Please enter text for Answer A");
          return false;
        }
        
        if (!form.answer_b || form.answer_b.trim() === "") {
          if ($toast) $toast.error("Please enter text for Answer B");
          return false;
        }
        
        if (form.type === "fourchoice") {
          if (!form.answer_c || form.answer_c.trim() === "") {
            if ($toast) $toast.error("Please enter text for Answer C");
            return false;
          }
          
          if (!form.answer_d || form.answer_d.trim() === "") {
            if ($toast) $toast.error("Please enter text for Answer D");
            return false;
          }
        }
      }
    } else {
      // Check image answers
      if (form.true_answer === "1" && !form.a_file_base64) {
        if ($toast) $toast.error("Please upload an image for Answer A (marked as correct)");
        return false;
      }
      
      if (form.true_answer === "2" && !form.b_file_base64) {
        if ($toast) $toast.error("Please upload an image for Answer B (marked as correct)");
        return false;
      }
      
      if (form.type === "fourchoice") {
        if (form.true_answer === "3" && !form.c_file_base64) {
          if ($toast) $toast.error("Please upload an image for Answer C (marked as correct)");
          return false;
        }
        
        if (form.true_answer === "4" && !form.d_file_base64) {
          if ($toast) $toast.error("Please upload an image for Answer D (marked as correct)");
          return false;
        }
      }
    }
  }
  
  return true;
};

/**
 * Handle form submission
 */
const submitQuestion = veeHandleSubmit(async (values, { setErrors }) => {
  console.log("Submit handler triggered with values:", values);

  // Additional debugging logs
  console.log("Form data state:", {
      section: form.section,
      base: form.base,
      lesson: form.lesson,
      topic: form.topic,
    questionLength: form.question ? form.question.length : 0,
    trueAnswer: form.true_answer,
    answerA: form.answer_a ? form.answer_a.length : 0,
    answerB: form.answer_b ? form.answer_b.length : 0
  });
  
  create_loading.value = true;
  
  // Force clear error messages again
  clearFieldValidationErrors();

  try {
    // Run our custom validation
    if (!validateForm()) {
      create_loading.value = false;
      return;
    }
    
    // Create a URLSearchParams object
    const formData = new URLSearchParams();
    
    // Add all required fields
    formData.append("section", form.section.toString());
    formData.append("base", form.base.toString());
    formData.append("lesson", form.lesson.toString());
    formData.append("topic", form.topic.toString());
    formData.append("type", form.type);
    formData.append("direction", form.direction || "ltr");
    formData.append("question", form.question);
    formData.append("true_answer", form.true_answer);
    formData.append("testImgAnswers", form.testImgAnswers ? "1" : "0");
    formData.append("testingAnswers", "0");
    formData.append("answer_full", form.answer_full || "");
    
    // Add answers based on question type
    if (["fourchoice", "twochoice", "tf"].includes(form.type)) {
      formData.append("answer_a", form.answer_a || "");
      formData.append("answer_b", form.answer_b || "");
      
      if (form.type === "fourchoice") {
        formData.append("answer_c", form.answer_c || "");
        formData.append("answer_d", form.answer_d || "");
      }
    }
    
    // Add file fields if they exist
    if (form.q_file) formData.append("q_file", form.q_file);
    if (form.answer_full_file) formData.append("answer_full_file", form.answer_full_file);
    if (form.a_file) formData.append("a_file", form.a_file);
    if (form.b_file) formData.append("b_file", form.b_file);
    if (form.c_file) formData.append("c_file", form.c_file);
    if (form.d_file) formData.append("d_file", form.d_file);

    console.log("Form data prepared:", formData.toString());
    console.log("Sending request to /api/v1/examTests");

    // Add a simulated delay for easier debugging in console
    await new Promise((resolve) => setTimeout(resolve, 500));

    const response = await $fetch("/api/v1/examTests", {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${userToken.value}`
      },
    }).catch((error) => {
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

      // Reset form fields using our improved function
      resetFormFields();
      console.log("Form reset after successful submission");
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
      console.error("Authentication error");
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
  // Trigger the appropriate file input click based on the file name
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

  // Set current crop file name for tracking which file we're working with
  current_crop_file.value = file_name;

  // Set crop file URL for cropper dialog
  crop_file_url.value = URL.createObjectURL(file);

  // Show the cropper dialog
  cropper_dialog.value = true;
};

/**
 * Handle image cropping
 * @param {Object} param0 - Cropper data
 */
const cropFile = ({ coordinates, canvas }) => {
  // Store the cropped image data
  const croppedBase64 = canvas.toDataURL();

      // Update the corresponding form field
  if (current_crop_file.value === "q_file") {
    form.q_file_base64 = croppedBase64;
  } else if (current_crop_file.value === "answer_full_file") {
    form.answer_full_file_base64 = croppedBase64;
  } else if (current_crop_file.value === "a_file") {
    form.a_file_base64 = croppedBase64;
  } else if (current_crop_file.value === "b_file") {
    form.b_file_base64 = croppedBase64;
  } else if (current_crop_file.value === "c_file") {
    form.c_file_base64 = croppedBase64;
  } else if (current_crop_file.value === "d_file") {
    form.d_file_base64 = croppedBase64;
  }
};

/**
 * Delete file
 * @param {string} file_name - Name of the file field
 */
const deleteFile = (file_name) => {
  if (file_name === "q_file") {
    form.q_file_base64 = "";
    form.q_file = null;
    if (questionInput.value) questionInput.value.value = null;
    form_hidden_data.q_file = null;
  } else if (file_name === "answer_full_file") {
    form.answer_full_file_base64 = "";
    form.answer_full_file = null;
    if (answerFullInput.value) answerFullInput.value.value = null;
    form_hidden_data.answer_full_file = null;
  } else if (file_name === "a_file") {
    form.a_file_base64 = "";
    form.a_file = null;
    if (aInput.value) aInput.value.value = null;
    form_hidden_data.a_file = null;
  } else if (file_name === "b_file") {
    form.b_file_base64 = "";
    form.b_file = null;
    if (bInput.value) bInput.value.value = null;
    form_hidden_data.b_file = null;
  } else if (file_name === "c_file") {
    form.c_file_base64 = "";
    form.c_file = null;
    if (cInput.value) cInput.value.value = null;
    form_hidden_data.c_file = null;
  } else if (file_name === "d_file") {
    form.d_file_base64 = "";
    form.d_file = null;
    if (dInput.value) dInput.value.value = null;
    form_hidden_data.d_file = null;
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
    form.answer_type = "text";
    text_answer_rules.value = "required";
    answerType.value = "text";
  } else {
    text_answer.value = false;
    photo_answer.value = true;
    form.testImgAnswers = true;
    form.answer_type = "photo";
    text_answer_rules.value = "";
    answerType.value = "photo";
  }
};

/**
 * Fetch current exam information
 */
const getCurrentExamInfo = async () => {
  // Get current exam ID from state or route
  const userState = useState("user").value;
  const currentExamId = userState?.currentExamId || route.params.id;

  if (currentExamId) {
    try {
      const response = await $fetch(`/api/v1/exams/info/${currentExamId}`, {
        headers: {
          Authorization: `Bearer ${userToken.value}`,
        },
      });

      // Set form data from response
      form.section = response.data.section;
      // Set form data from response
      form.section = response.data.section;
      form.base = response.data.base;
      form.lesson = response.data.lesson;
      
      // If in edit mode, we need to populate topics as well
      if (props.examEditMode && response.data.topics && response.data.topics.length) {
        form.topic = response.data.topics[0];
        await getTypeList("topic", form.lesson);
      }

      // Set file path if available
      if (response.data.file_original) {
        file_original_path.value = response.data.file_original;
      }

      // Set exam test list length
      if (response.data.tests && Array.isArray(response.data.tests)) {
        examTestListLength.value = response.data.tests.length;
      }
      
      // Fetch additional data lists based on the retrieved information
      if (form.section) {
        await getTypeList("base", form.section);
      }
      
      if (form.base) {
        await getTypeList("lesson", form.base);
      }
      
      if (form.lesson) {
        await getTypeList("topic", form.lesson);
      }
    } catch (err) {
      console.error("Error fetching exam info:", err);
      const { $toast } = useNuxtApp();
      if ($toast) $toast.error("Failed to load exam information");
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
    } else if (val !== "tf" && (form.answer_a === "True" && form.answer_b === "False")) {
      // Only reset if we're coming from a true/false type
      form.answer_a = "";
      form.answer_b = "";
    }
    
    // Reset true_answer when changing question type
    form.true_answer = "";
    
    // Re-validate with a delay
    debouncedValidate();
  }
);

// Add these utility variables for debounced validation
let validationTimer = null;

/**
 * Debounced validation to prevent flickering error messages
 */
const debouncedValidate = () => {
  if (validationTimer) {
    clearTimeout(validationTimer);
  }
  validationTimer = setTimeout(() => {
    // Clear any existing error messages first
    clearFieldValidationErrors();
    // Then run validation
    validate();
    validationTimer = null;
  }, 300);
};

// Update the watch handler for form.topic
watch(
  () => form.topic,
  (newVal) => {
    // Only run validation if we have a valid topic selected
    if (newVal) {
      debouncedValidate();
    }
  }
);

/**
 * Watch for changes in initial props
 */
watch(
  () => props.initialSection,
  (newVal) => {
    if (newVal && newVal !== form.section) {
      form.section = newVal;
      getTypeList("base", newVal);
    }
  }
);

watch(
  () => props.initialBase,
  (newVal) => {
    if (newVal && newVal !== form.base) {
      form.base = newVal;
      getTypeList("lesson", newVal);
    }
  }
);

watch(
  () => props.initialLesson,
  (newVal) => {
    if (newVal && newVal !== form.lesson) {
      form.lesson = newVal;
      getTypeList("topic", newVal);
    }
  }
);

watch(
  () => props.initialTopics,
  (newVal) => {
    if (newVal?.length && !form.topic) {
      form.topic = newVal[0];
      selected_topics.value = newVal;
    }
  },
  { deep: true }
);

/**
 * Initialize on mount
 */
onMounted(() => {
  // Initialize user token
  userToken.value = auth.getUserToken();
  
  // Set default values for answer type
  form.answer_type = "text";
  form.testImgAnswers = false;
  text_answer.value = true;
  photo_answer.value = false;
  
  // Load initial data
  getTypeList("section");
  
  // Initialize form with prop values if available
  if (props.initialSection) {
    form.section = props.initialSection;
    getTypeList("base", props.initialSection);
  }
  
  if (props.initialBase) {
    form.base = props.initialBase;
    getTypeList("lesson", props.initialBase);
  }
  
  if (props.initialLesson) {
    form.lesson = props.initialLesson;
    getTypeList("topic", props.initialLesson);
  }
  
  if (props.initialTopics && props.initialTopics.length) {
    form.topic = props.initialTopics[0];
    selected_topics.value = props.initialTopics;
  }
  
  // If in edit mode, we need to ensure we load the current exam's data
  if (props.examEditMode) {
    getCurrentExamInfo().then(() => {
      console.log("Exam data loaded in edit mode:", {
        section: form.section,
        base: form.base,
        lesson: form.lesson,
        topic: form.topic
      })
    });
  } else {
    // Reset form to clear any previous data if not in edit mode
    resetFormFields();
  }
  
  // Set up form validation event handling
  if (veeForm.value) {
    // Clear all validation errors on initial load
    setTimeout(() => {
      clearFieldValidationErrors();
    }, 500);
  }
});

/**
 * Submit cropped image for upload
 */
const submitCrop = async () => {
  crop_confirm_loading.value = true;

  try {
    // Get the current file based on the file name
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
      // Create a FormData object
      const formData = new FormData();
      formData.append("file", file);

      // Send API request
      const response = await $fetch("/api/v1/upload", {
        method: "POST",
        body: formData,
      });

      if (response?.data?.[0]?.file?.name) {
        // Get the file name from the response
        const fileName = response.data[0].file.name;

        // Update the corresponding form field
        if (current_crop_file.value === "q_file") {
          form.q_file = fileName;
        } else if (current_crop_file.value === "answer_full_file") {
          form.answer_full_file = fileName;
        } else if (current_crop_file.value === "a_file") {
          form.a_file = fileName;
        } else if (current_crop_file.value === "b_file") {
          form.b_file = fileName;
        } else if (current_crop_file.value === "c_file") {
          form.c_file = fileName;
        } else if (current_crop_file.value === "d_file") {
          form.d_file = fileName;
        }

        if ($toast) $toast.success("File uploaded successfully");

      // Close the dialog after successful upload
      cropper_dialog.value = false;
    } else {
        if ($toast) $toast.error("Invalid response from server");
      }
    } else {
      if ($toast) $toast.error("No file to upload");
    }
  } catch (error) {
    console.error("Error submitting cropped image:", error);
    if ($toast) $toast.error("Failed to upload cropped image");
  } finally {
    crop_confirm_loading.value = false;
  }
};

/**
 * Create test handler (for backward compatibility)
 * This is a wrapper for submitQuestion
 */
const createTest = () => {
  console.log("Create button clicked! Trying manual submission...");
  manualSubmit();
};

/**
 * Trigger form validation manually after user interacts with RichEditor
 * This ensures validation state is updated properly
 */
const refreshValidation = () => {
  // Clear errors first
  clearFieldValidationErrors();
  // Then validate after a delay
  debouncedValidate();
};

/**
 * Watch for changes in rich editor content and validate the form
 */
watch(
  () => form.question,
  () => refreshValidation()
);

watch(
  () => [
    form.answer_a,
    form.answer_b,
    form.answer_c,
    form.answer_d,
    form.answer_full,
  ],
  () => refreshValidation()
);

/**
 * Update the buttonDisabled computed property to accurately reflect required fields
 */
const buttonDisabled = computed(() => {
  // Check basic mandatory fields
  const requiredFields = 
    form.section && 
    form.base && 
    form.lesson && 
    form.topic && 
    form.question;

  // For multiple choice forms, also check true_answer
  if (["fourchoice", "twochoice", "tf"].includes(form.type)) {
    return !requiredFields || !form.true_answer;
  }

  return !requiredFields;
});

/**
 * Custom validation function for answer fields
 */
const validateAnswerField = (value) => {
  // If we are using image answers, then don't validate text fields
  if (form.testImgAnswers === true) {
    return true;
  }
  
  // Otherwise, check that we have content
  if (!value || value.trim() === '') {
    return 'This field is required';
  }
  
  return true;
};

/**
 * Custom validation for the true answer radio group
 */
const validateTrueAnswer = (value) => {
  // Only validate if this is a multiple choice question type
  if (["fourchoice", "twochoice", "tf"].includes(form.type)) {
    if (!value) {
      return "Please select the correct answer";
    }
  }
  return true;
};

// Add this to our validateForm function to ensure all "validation is not valid" messages are cleared
const clearFieldValidationErrors = () => {
  // First method: Hide error messages with inline style
  const errorMessages = document.querySelectorAll('.text-error');
  errorMessages.forEach(element => {
    element.style.display = 'none';
  });
  
  // Second method: Remove the "not valid" text directly
  const validationTexts = document.querySelectorAll('[class*="not valid"]');
  validationTexts.forEach(element => {
    element.style.display = 'none';
  });
  
  // Third method: Clear all form error messages
  setTimeout(() => {
    document.querySelectorAll('.error--text').forEach(el => {
      el.classList.remove('error--text');
    });
  }, 10);
};

/**
 * Validate question field
 */
const validateQuestionField = (value) => {
  if (!value || value.trim() === '') {
    return 'Please enter a question';
  }
  return true;
};

// Add a more direct click handler that bypasses VeeValidate
const manualSubmit = async () => {
  console.log("Manual submit triggered");
  
  // First clear any validation errors
  clearFieldValidationErrors();
  
  // Ensure the topic value is set correctly - this is critical
  console.log("Current topic value:", form.topic);
  
  if (!form.topic && selected_topics.value && selected_topics.value.length > 0) {
    form.topic = parseInt(selected_topics.value[0]);
    console.log("Updated topic from selected_topics:", form.topic);
  }
  
  // Run our direct validation
  if (!validateForm()) {
    console.log("Form validation failed");
    return;
  }
  
  console.log("Form validation passed, preparing to submit");
  create_loading.value = true;
  
  // Ensure required fields are present
  form.direction = form.direction || "ltr";
  form.testingAnswers = 0;
  
  // Log the actual form object we'll be submitting
  console.log("Submitting form object directly:", form);
  
  // Temporary hardcoded data structure to match exactly what the API expects
  const hardcodedSubmission = {
    section: form.section.toString(),
    base: form.base.toString(),
    lesson: form.lesson.toString(),
    topic: form.topic.toString(),
    type: form.type,
    question: form.question,
    true_answer: form.true_answer,
    testImgAnswers: form.testImgAnswers ? "1" : "0",
    answer_full: form.answer_full || "",
    testingAnswers: "0",
    direction: "ltr",
    answer_a: form.answer_a || "",
    answer_b: form.answer_b || "",
    answer_c: form.answer_c || "",
    answer_d: form.answer_d || ""
  };
  
  // Create URLSearchParams object instead of using require('querystring')
  const formData = new URLSearchParams();
  
  // Add all form fields to the URLSearchParams
  Object.keys(hardcodedSubmission).forEach(key => {
    formData.append(key, hardcodedSubmission[key]);
  });
  
  console.log("Stringified form data:", formData.toString());
  
  try {
    const response = await $fetch("/api/v1/examTests", {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${userToken.value}`
      }
    });
    
    console.log("API response received:", response);
    
    if (response.status == 1) {
      console.log("Test created successfully with ID:", response.data?.id);
      const { $toast } = useNuxtApp();
      if ($toast) $toast.success("Created successfully");
      
      path_panel_expand.value = false;
      
      // Edit mode or create exam progress
      if (props.examEditMode === true) {
        console.log("Emitting update event with ID:", response.data.id);
        emit("update:updateTestList", response.data.id);
      }
      
      // Reset form fields using our improved function
      resetFormFields();
      console.log("Form reset after successful submission");
    } else {
      console.error("API returned error status:", response);
      const { $toast } = useNuxtApp();
      if ($toast) $toast.error(response.message || "An error occurred, try again");
    }
  } catch (err) {
    console.error("Error submitting form:", err);
    
    // Log detailed error information
    if (err.response) {
      console.error("Error response status:", err.response.status);
      console.error("Error response data:", err.response.data);
      
      // If the API returned which fields are missing, log them specifically
      if (err.response.data?.data?.fields) {
        console.error("Missing fields:", err.response.data.data.fields);
        const missingFields = err.response.data.data.fields.join(", ");
        const { $toast } = useNuxtApp();
        if ($toast) $toast.error(`Required fields missing: ${missingFields}`);
        return;
      }
    }
    
    let errorMessage = "An error occurred";
    
    if (err.response?.status == 400) {
      errorMessage = err.response?.data?.message || "Bad request";
    } else if (err.response?.status == 403) {
      errorMessage = "Authentication error";
      router.push("/login");
    } else {
      errorMessage = err.message || "An error occurred";
    }
    
    const { $toast } = useNuxtApp();
    if ($toast) $toast.error(errorMessage);
  } finally {
    create_loading.value = false;
  }
};
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
  display: inline-block;
  object-fit: contain;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

.topic_list_item {
  font-size: 1.4rem;
  line-height: 2rem;
}

.topic_season {
  font-weight: bolder !important;
  color: blue !important;
}
.v-selection-control .v-label {
  height: auto !important;
}

/* Cropper-specific styles */
#img-cropper-dialog {
  overflow: hidden;
}

#img-cropper-dialog .v-card-text {
  padding: 0;
}

.cropper-container {
  width: 100%;
  min-height: 300px;
  position: relative;
}

/* Custom stencil style for the cropper */
.vue-advanced-cropper__stencil-wrapper {
  border: 2px solid #009688;
}

/* Make sure the cropper actions are always visible */
#img-cropper-dialog .v-card-actions {
  background-color: white;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  z-index: 5;
}
</style>
