<template>
  <v-container id="create-test" class="mb-16">
    <embed :src="file_original_path" width="100%" height="200px;" />
    <v-card flat class="mt-3">
      <validation-observer ref="observer" v-slot="{ invalid }">
        <form @submit.prevent="updateQuestion">
          <v-row>
            <v-col cols="12" md="2" v-show="path_panel_expand">
              <validation-provider
                v-slot="{ errors }"
                name="level"
                rules="required"
              >
                <v-autocomplete
                  dense
                  v-model="form.section"
                  :items="level_list"
                  :error-messages="errors"
                  item-text="title"
                  item-value="id"
                  label="Curriculum"
                  outlined
                />
              </validation-provider>
            </v-col>
            <v-col cols="12" md="2" v-show="path_panel_expand">
              <validation-provider
                v-slot="{ errors }"
                name="grade"
                rules="required"
              >
                <v-autocomplete
                  dense
                  v-model="form.base"
                  :items="grade_list"
                  item-value="id"
                  item-text="title"
                  :error-messages="errors"
                  label="Grade"
                  outlined
                />
              </validation-provider>
            </v-col>
            <v-col cols="12" md="2" v-show="path_panel_expand">
              <validation-provider
                v-slot="{ errors }"
                name="lesson"
                rules="required"
              >
                <v-autocomplete
                  dense
                  :items="lesson_list"
                  item-value="id"
                  item-text="title"
                  v-model="form.lesson"
                  :error-messages="errors"
                  label="Subject"
                  outlined
                />
              </validation-provider>
            </v-col>

            <v-col cols="2" md="1" class="pr-0" v-show="!path_panel_expand">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="teal"
                    class="white--text py-5"
                    v-bind="attrs"
                    v-on="on"
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
              :md="path_panel_expand ? 2 : 11"
            >
              <v-autocomplete
                dense
                :items="topic_list"
                item-value="id"
                item-text="title"
                v-model="form.topic"
                label="Topic"
                outlined
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

            <v-col cols="12" md="2">
              <validation-provider
                v-slot="{ errors }"
                name="lesson"
                rules="required"
              >
                <v-autocomplete
                  dense
                  :items="typeList"
                  item-value="value"
                  item-text="title"
                  v-model="form.type"
                  :error-messages="errors"
                  label="Type"
                  outlined
                />
              </validation-provider>
            </v-col>

            <v-col cols="12" md="6" id="test-maker-question">
              <p>Question:</p>
              <client-only placeholder="loading...">
                <validation-provider
                  name="question"
                  rules="required"
                >
                  <ckeditor-nuxt
                    v-model="form.question"
                    :config="editorConfig"
                  />
                </validation-provider>
              </client-only>
              <img
                width="72 "
                height="72"
                class="pointer image-input"
                v-if="form.q_file_base64"
                @click="selectFile('q_file')"
                :src="form.q_file_base64"
              />
              <v-btn
                v-else
                icon
                class="image-input"
                @click="selectFile('q_file')"
              >
                <v-icon> mdi-camera </v-icon>
              </v-btn>

              <v-btn
                v-show="form.q_file_base64"
                @click="deleteFile('q_file')"
                icon
                class="img-clear-btn"
              >
                <v-icon color="red" small> mdi-delete </v-icon>
              </v-btn>
            </v-col>
            <v-col
              cols="12"
              md="6"
              v-if="['tf', 'fourchoice', 'twochoice'].includes(form.type)"
            >
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
              <validation-provider
                name="true_answer"
                rules="required"
              >
                <v-radio-group
                  v-model="form.true_answer"
                  id="test-image-options"
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
                      v-show="form.testImgAnswers == false"
                    >
                      <client-only placeholder="loading...">
                        <ckeditor-nuxt
                          v-model="form.answer_a"
                          :config="editorConfig"
                        />
                      </client-only>
                    </v-col>
                    <v-col
                      class="pb-0"
                      cols="11"
                      v-show="form.testImgAnswers == true"
                    >
                      <div class="image-holder">
                        <img
                          width="72 "
                          height="72"
                          class="pointer image-input"
                          v-if="form.a_file_base64"
                          @click="selectFile('a_file')"
                          :src="form.a_file_base64"
                        />
                        <v-btn
                          v-else
                          icon
                          class="image-input"
                          @click="selectFile('a_file')"
                        >
                          <v-icon> mdi-camera </v-icon>
                        </v-btn>

                        <v-btn
                          v-show="form.a_file_base64"
                          @click="deleteFile('a_file')"
                          icon
                          class="img-clear-btn"
                        >
                          <v-icon color="red" small> mdi-delete </v-icon>
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
                      v-show="form.testImgAnswers == false"
                    >
                      <client-only placeholder="loading...">
                        <ckeditor-nuxt
                          v-model="form.answer_b"
                          :config="editorConfig"
                        />
                      </client-only>
                    </v-col>
                    <v-col
                      class="pb-0"
                      cols="11"
                      v-show="form.testImgAnswers == true"
                    >
                      <div class="image-holder">
                        <img
                          width="72 "
                          height="72"
                          class="pointer image-input"
                          v-if="form.b_file_base64"
                          @click="selectFile('b_file')"
                          :src="form.b_file_base64"
                        />
                        <v-btn
                          v-else
                          icon
                          class="image-input"
                          @click="selectFile('b_file')"
                        >
                          <v-icon> mdi-camera </v-icon>
                        </v-btn>

                        <v-btn
                          v-show="form.b_file_base64"
                          @click="deleteFile('b_file')"
                          icon
                          class="img-clear-btn"
                        >
                          <v-icon color="red" small> mdi-delete </v-icon>
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
                      v-show="form.testImgAnswers == false"
                    >
                      <client-only placeholder="loading...">
                        <ckeditor-nuxt
                          v-model="form.answer_c"
                          :config="editorConfig"
                        />
                      </client-only>
                    </v-col>
                    <v-col
                      class="pb-0"
                      cols="11"
                      v-show="form.testImgAnswers == true"
                    >
                      <div class="image-holder">
                        <img
                          width="72 "
                          height="72"
                          class="pointer image-input"
                          v-if="form.c_file_base64"
                          @click="selectFile('c_file')"
                          :src="form.c_file_base64"
                        />
                        <v-btn
                          v-else
                          icon
                          class="image-input"
                          @click="selectFile('c_file')"
                        >
                          <v-icon> mdi-camera </v-icon>
                        </v-btn>

                        <v-btn
                          v-show="form.c_file_base64"
                          @click="deleteFile('c_file')"
                          icon
                          class="img-clear-btn"
                        >
                          <v-icon color="red" small> mdi-delete </v-icon>
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
                      v-show="form.testImgAnswers == false"
                    >
                      <client-only placeholder="loading...">
                        <ckeditor-nuxt
                          v-model="form.answer_d"
                          :config="editorConfig"
                        />
                      </client-only>
                    </v-col>
                    <v-col
                      class="pb-0"
                      cols="11"
                      v-show="form.testImgAnswers == true"
                    >
                      <div class="image-holder">
                        <img
                          width="72 "
                          height="72"
                          class="pointer image-input"
                          v-if="form.d_file_base64"
                          @click="selectFile('d_file')"
                          :src="form.d_file_base64"
                        />
                        <v-btn
                          v-else
                          icon
                          class="image-input"
                          @click="selectFile('d_file')"
                        >
                          <v-icon> mdi-camera </v-icon>
                        </v-btn>

                        <v-btn
                          v-show="form.d_file_base64"
                          @click="deleteFile('d_file')"
                          icon
                          class="img-clear-btn"
                        >
                          <v-icon color="red" small> mdi-delete </v-icon>
                        </v-btn>
                      </div>
                      <v-divider />
                    </v-col>
                  </v-row>
                </v-radio-group>
              </validation-provider>
            </v-col>

            <!--Solution section-->
            <v-col
              :md="
                ['tf', 'fourchoice', 'twochoice'].includes(form.type) ? 12 : 6
              "
              :id="
                ['tf', 'fourchoice', 'twochoice'].includes(form.type)
                  ? 'test-maker-answer'
                  : 'test-maker-answer-alternative'
              "
              cols="12"
            >
              <p>Solution:</p>
              <client-only placeholder="loading...">
                <ckeditor-nuxt
                  v-model="form.answer_full"
                  :config="editorConfig"
                />
              </client-only>

              <img
                width="72 "
                height="72"
                class="pointer image-input"
                v-if="form.answer_full_file_base64"
                @click="selectFile('answer_full_file')"
                :src="form.answer_full_file_base64"
              />
              <v-btn
                v-else
                icon
                class="image-input"
                @click="selectFile('answer_full_file')"
              >
                <v-icon> mdi-camera </v-icon>
              </v-btn>

              <v-btn
                v-show="form.answer_full_file_base64"
                @click="deleteFile('answer_full_file')"
                icon
                class="img-clear-btn"
              >
                <v-icon color="red" small> mdi-delete </v-icon>
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
                    :disabled="invalid"
                    :loading="create_loading"
                    lg
                    color="teal"
                    class="white--text"
                    block
                  >
                    Update
                  </v-btn>
                </v-col>
                <v-col cols="12" md="6">
                  <v-btn lg outlined color="error" to="/test-maker" block>
                    Discard
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </form>
      </validation-observer>
    </v-card>

    <!--Hidden input section-->
    <div>
      <v-file-input
        class="d-none"
        accept="image/png,image/webp,image/jpeg,image/jpg"
        @change="uploadFile('q_file')"
        v-model="form_hidden_data.q_file"
        ref="questionInput"
      />

      <v-file-input
        class="d-none"
        accept="image/png,image/webp,image/jpeg,image/jpg"
        @change="uploadFile('answer_full_file')"
        v-model="form_hidden_data.answer_full_file"
        ref="answerFullInput"
      />
      <v-file-input
        class="d-none"
        accept="image/png,image/webp,image/jpeg,image/jpg"
        @change="uploadFile('a_file')"
        v-model="form_hidden_data.a_file"
        ref="aInput"
      />
      <v-file-input
        class="d-none"
        accept="image/png,image/webp,image/jpeg,image/jpg"
        @change="uploadFile('b_file')"
        v-model="form_hidden_data.b_file"
        ref="bInput"
      />
      <v-file-input
        class="d-none"
        accept="image/png,image/webp,image/jpeg,image/jpg"
        @change="uploadFile('c_file')"
        v-model="form_hidden_data.c_file"
        ref="cInput"
      />
      <v-file-input
        class="d-none"
        accept="image/png,image/webp,image/jpeg,image/jpg"
        @change="uploadFile('d_file')"
        v-model="form_hidden_data.d_file"
        ref="dInput"
      />
    </div>

    <!--Cropper dialog-->
    <v-col cols="auto">
      <v-dialog
        transition="dialog-bottom-transition"
        max-width="600"
        v-model="cropper_dialog"
      >
        <template v-slot:default>
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
                <cropper
                  :src="crop_file_url"
                  :stencil-props="stencil_props"
                  image-restriction="stencil"
                  @change="cropFile"
                />
              </div>
            </v-card-text>
            <v-card-actions
              style="position: sticky; bottom: 0; left: 0; right: 0"
              class="pa-0"
            >
              <v-btn
                dark
                class="teal text-center"
                x-large
                block
                :loading="update_file_loading"
                @click="updateFile"
              >
                Confirm
              </v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
    </v-col>
    <!--End cropper dialog-->
  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted, watch, defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '~/composables/auth'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import TopicSelector from "~/components/form/topic-selector.vue"
import Cropper from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

definePageMeta({
  layout: 'test-maker-layout',
  middleware: ['auth-admin']
})

// Define the component with client-only dependencies
defineComponent({
  components: {
    ValidationObserver,
    ValidationProvider,
    TopicSelector,
    Cropper,
    'ckeditor-nuxt': () => {
      if (process.client) {
        return import('@blowstack/ckeditor-nuxt')
      }
    }
  }
})

const route = useRoute()
const router = useRouter()
const { getAuthToken } = useAuth()

// Core data
const userToken = ref(getAuthToken())
const path_panel_expand = ref(false)
const create_loading = ref(false)
const text_answer = ref(true)
const photo_answer = ref(false)
const observer = ref(null)
const file_original_path = ref('')

// File upload refs
const questionInput = ref(null)
const answerFullInput = ref(null)
const aInput = ref(null)
const bInput = ref(null)
const cInput = ref(null)
const dInput = ref(null)

// Cropper related data
const crop_file_url = ref('')
const crop_file_type = ref('')
const cropper_dialog = ref(false)
const crop_file_loading = ref(false)
const update_file_loading = ref(false)
const cropped_image = ref(null)

const stencil_props = {
  aspectRatio: 1
}

// Editor config
const editorConfig = {
  toolbar: [
    'heading',
    '|',
    'bold',
    'italic',
    'link',
    '|',
    'bulletedList',
    'numberedList',
    '|',
    'outdent',
    'indent',
    '|',
    'insertTable',
    'mediaEmbed',
    'undo',
    'redo'
  ]
}

// Form data
const form = reactive({
  id: 0,
  section: null,
  base: null,
  lesson: null,
  topic: null,
  type: '',
  question: '',
  q_file: null,
  q_file_base64: '',
  true_answer: '1',
  answer_a: '',
  a_file: null,
  a_file_base64: '',
  answer_b: '',
  b_file: null,
  b_file_base64: '',
  answer_c: '',
  c_file: null,
  c_file_base64: '',
  answer_d: '',
  d_file: null,
  d_file_base64: '',
  answer_full: '',
  answer_full_file: null,
  answer_full_file_base64: '',
  testImgAnswers: false
})

const form_hidden_data = reactive({
  q_file: null,
  answer_full_file: null,
  a_file: null,
  b_file: null,
  c_file: null,
  d_file: null
})

// Data lists
const level_list = ref([])
const grade_list = ref([])
const lesson_list = ref([])
const topic_list = ref([])
const typeList = ref([
  { title: 'Fill in the Blanks', value: 'fillblanks' },
  { title: 'True or False', value: 'tf' },
  { title: 'Four choice', value: 'fourchoice' },
  { title: 'Two choice', value: 'twochoice' },
  { title: 'Short answer', value: 'shortanswer' },
  { title: 'Passage reading', value: 'passagereading' }
])

// Methods
const resetForm = () => {
  form.id = 0
  form.section = null
  form.base = null
  form.lesson = null
  form.topic = null
  form.type = ''
  form.question = ''
  form.q_file = null
  form.q_file_base64 = ''
  form.true_answer = '1'
  form.answer_a = ''
  form.a_file = null
  form.a_file_base64 = ''
  form.answer_b = ''
  form.b_file = null
  form.b_file_base64 = ''
  form.answer_c = ''
  form.c_file = null
  form.c_file_base64 = ''
  form.answer_d = ''
  form.d_file = null
  form.d_file_base64 = ''
  form.answer_full = ''
  form.answer_full_file = null
  form.answer_full_file_base64 = ''
  form.testImgAnswers = false
}

const fetchData = async () => {
  try {
    create_loading.value = true

    // Get all sections
    const sections = await $fetch('/api/sections', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${userToken.value}`
      }
    })
    level_list.value = sections

    // Get all bases
    const bases = await $fetch('/api/bases', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${userToken.value}`
      }
    })
    grade_list.value = bases

    // Get all lessons
    const lessons = await $fetch('/api/lessons', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${userToken.value}`
      }
    })
    lesson_list.value = lessons

    // Get topics
    const topics = await $fetch('/api/topics', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${userToken.value}`
      }
    })
    topic_list.value = topics

    // Get question data
    const questionId = route.params.id
    const questionData = await $fetch(`/api/questions/${questionId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${userToken.value}`
      }
    })

    if (questionData) {
      form.id = questionData.id
      form.section = questionData.section_id
      form.base = questionData.base_id
      form.lesson = questionData.lesson_id
      form.topic = questionData.topic_id
      form.type = questionData.type
      form.question = questionData.question
      form.true_answer = questionData.true_answer
      form.answer_a = questionData.answer_a
      form.answer_b = questionData.answer_b
      form.answer_c = questionData.answer_c
      form.answer_d = questionData.answer_d
      form.answer_full = questionData.answer_full
      form.testImgAnswers = questionData.testImgAnswers

      if (questionData.original_path) {
        file_original_path.value = process.env.BASE_URL + questionData.original_path
      }

      if (questionData.q_file) {
        form.q_file_base64 = process.env.BASE_URL + questionData.q_file
      }

      if (questionData.a_file) {
        form.a_file_base64 = process.env.BASE_URL + questionData.a_file
        form.testImgAnswers = true
        text_answer.value = false
        photo_answer.value = true
      }

      if (questionData.b_file) {
        form.b_file_base64 = process.env.BASE_URL + questionData.b_file
      }

      if (questionData.c_file) {
        form.c_file_base64 = process.env.BASE_URL + questionData.c_file
      }

      if (questionData.d_file) {
        form.d_file_base64 = process.env.BASE_URL + questionData.d_file
      }

      if (questionData.answer_full_file) {
        form.answer_full_file_base64 = process.env.BASE_URL + questionData.answer_full_file
      }
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    create_loading.value = false
  }
}

const updateQuestion = async () => {
  try {
    create_loading.value = true

    if (observer.value) {
      const isValid = await observer.value.validate()
      if (!isValid) {
        create_loading.value = false
        return
      }
    }

    const formData = new FormData()
    formData.append('id', form.id)
    formData.append('section_id', form.section)
    formData.append('base_id', form.base)
    formData.append('lesson_id', form.lesson)
    formData.append('topic_id', form.topic)
    formData.append('type', form.type)
    formData.append('question', form.question)
    formData.append('true_answer', form.true_answer)
    formData.append('answer_a', form.answer_a)
    formData.append('answer_b', form.answer_b)
    formData.append('answer_c', form.answer_c)
    formData.append('answer_d', form.answer_d)
    formData.append('answer_full', form.answer_full)
    formData.append('testImgAnswers', form.testImgAnswers)

    // Add files if they exist
    if (form.q_file_base64 && form.q_file_base64.includes('data:image')) {
      formData.append('q_file', form.q_file_base64)
    }

    if (form.a_file_base64 && form.a_file_base64.includes('data:image')) {
      formData.append('a_file', form.a_file_base64)
    }

    if (form.b_file_base64 && form.b_file_base64.includes('data:image')) {
      formData.append('b_file', form.b_file_base64)
    }

    if (form.c_file_base64 && form.c_file_base64.includes('data:image')) {
      formData.append('c_file', form.c_file_base64)
    }

    if (form.d_file_base64 && form.d_file_base64.includes('data:image')) {
      formData.append('d_file', form.d_file_base64)
    }

    if (form.answer_full_file_base64 && form.answer_full_file_base64.includes('data:image')) {
      formData.append('answer_full_file', form.answer_full_file_base64)
    }

    await $fetch(`/api/questions/${form.id}`, {
      method: 'PUT',
          headers: {
        Authorization: `Bearer ${userToken.value}`
      },
      body: formData
    })

    router.push('/test-maker')
  } catch (error) {
    console.error('Error updating question:', error)
  } finally {
    create_loading.value = false
  }
}

const selectFile = (fileType) => {
  switch (fileType) {
    case 'q_file':
      questionInput.value.click()
      break
    case 'answer_full_file':
      answerFullInput.value.click()
      break
    case 'a_file':
      aInput.value.click()
      break
    case 'b_file':
      bInput.value.click()
      break
    case 'c_file':
      cInput.value.click()
      break
    case 'd_file':
      dInput.value.click()
      break
  }
}

const uploadFile = (fileType) => {
  if (form_hidden_data[fileType]) {
    crop_file_loading.value = true
    cropper_dialog.value = true
    crop_file_type.value = fileType

    // Create a URL for the file
    const reader = new FileReader()
    reader.onload = (e) => {
      crop_file_url.value = e.target.result
      crop_file_loading.value = false
    }
    reader.readAsDataURL(form_hidden_data[fileType])
  }
}

const cropFile = (cropperData) => {
  cropped_image.value = cropperData
}

const updateFile = async () => {
  try {
    update_file_loading.value = true

    if (cropped_image.value && cropped_image.value.canvas) {
      const canvas = cropped_image.value.canvas
      const fileType = crop_file_type.value
      const base64Data = canvas.toDataURL('image/jpeg')

      // Update the appropriate file based on the selected type
      switch (fileType) {
        case 'q_file':
          form.q_file_base64 = base64Data
          break
        case 'answer_full_file':
          form.answer_full_file_base64 = base64Data
          break
        case 'a_file':
          form.a_file_base64 = base64Data
          break
        case 'b_file':
          form.b_file_base64 = base64Data
          break
        case 'c_file':
          form.c_file_base64 = base64Data
          break
        case 'd_file':
          form.d_file_base64 = base64Data
          break
      }

      // Reset form hidden data
      form_hidden_data[fileType] = null
      cropper_dialog.value = false
    }
  } catch (error) {
    console.error('Error updating file:', error)
  } finally {
    update_file_loading.value = false
  }
}

const deleteFile = (fileType) => {
  switch (fileType) {
    case 'q_file':
      form.q_file_base64 = ''
      break
    case 'answer_full_file':
      form.answer_full_file_base64 = ''
      break
    case 'a_file':
      form.a_file_base64 = ''
      break
    case 'b_file':
      form.b_file_base64 = ''
      break
    case 'c_file':
      form.c_file_base64 = ''
      break
    case 'd_file':
      form.d_file_base64 = ''
      break
  }
}

const answerTypeChanged = (type) => {
  if (type === 'txt') {
    text_answer.value = true
    photo_answer.value = false
    form.testImgAnswers = false
  } else {
    text_answer.value = false
    photo_answer.value = true
    form.testImgAnswers = true
  }
}

// Watchers
watch([() => form.section], () => {
  if (form.section) {
    // Filter grades based on section
    const filteredGrades = grade_list.value.filter(
      (grade) => grade.section_id === form.section
    )
    if (filteredGrades.length > 0) {
      form.base = filteredGrades[0].id
    }
  }
})

watch([() => form.base], () => {
  if (form.base) {
    // Filter lessons based on grade
    const filteredLessons = lesson_list.value.filter(
      (lesson) => lesson.base_id === form.base
    )
    if (filteredLessons.length > 0) {
      form.lesson = filteredLessons[0].id
    }
  }
})

watch([() => form.lesson], () => {
  if (form.lesson) {
    // Filter topics based on lesson
    const filteredTopics = topic_list.value.filter(
      (topic) => topic.lesson_id === form.lesson
    )
    if (filteredTopics.length > 0) {
      form.topic = filteredTopics[0].id
    }
  }
})

// Lifecycle hooks
onMounted(() => {
  resetForm()
  fetchData()
})
</script>

<style>
.pointer {
  cursor: pointer;
}

#test-image-options img {
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.18);
  border-radius: 4px;
  height: 150px;
  width: 150px;
  object-fit: contain;
}

.answer_label {
  position: absolute;
  bottom: 0;
  font-size: 18px;
  font-weight: bold;
  color: #26a69a;
}

.image-input {
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  border: 1px dashed #9e9e9e;
  overflow: hidden;
  height: 70px;
  width: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.img-clear-btn {
  position: absolute;
  margin-left: -20px;
  margin-top: -4px;
  background-color: white !important;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.18);
}

.topic_list_item {
  margin-bottom: 0;
}

.topic_season {
  font-weight: bold;
  color: teal;
}

#create-test .image-holder {
  display: inline-block;
  margin-bottom: 16px;
}

#test-maker-question,
#test-maker-answer,
#test-maker-answer-alternative {
  margin-top: 32px;
}

#test-maker-question p,
#test-maker-answer p,
#test-maker-answer-alternative p {
  font-size: 16px;
  font-weight: bold;
  color: teal;
  margin-bottom: 8px;
}

/* Cropper related styles */
#img-cropper-dialog .vue-advanced-cropper {
  height: 500px;
}

.vue-advanced-cropper {
  background-color: white;
  max-height: 100%;
  max-width: 100%;
  overflow: hidden;
  position: relative;
  user-select: none;
  -webkit-user-select: none;
  touch-action: none;
}
</style>
