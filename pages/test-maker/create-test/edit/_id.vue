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
                  label="Board"
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
                  v-slot="{ errors }"
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
                v-show="form.q_file"
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
              <validation-provider name="true_answer" rules="required">
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
                v-show="form.answer_full_file"
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
        v-model="form_hidden_data.q_file"
        ref="question-input"
        @change="uploadFile('q_file')"
      />

      <v-file-input
        class="d-none"
        @change="uploadFile('answer_full_file')"
        accept="image/png,image/webp,image/jpeg,image/jpg"
        v-model="form_hidden_data.answer_full_file"
        ref="answer-full-input"
      />
      <v-file-input
        class="d-none"
        accept="image/png,image/webp,image/jpeg,image/jpg"
        v-model="form_hidden_data.a_file"
        @change="uploadFile('a_file')"
        ref="a-input"
      />
      <v-file-input
        class="d-none"
        accept="image/png,image/webp,image/jpeg,image/jpg"
        v-model="form_hidden_data.b_file"
        @change="uploadFile('b_file')"
        ref="b-input"
      />
      <v-file-input
        class="d-none"
        accept="image/png,image/webp,image/jpeg,image/jpg"
        v-model="form_hidden_data.c_file"
        @change="uploadFile('c_file')"
        ref="c-input"
      />
      <v-file-input
        class="d-none"
        accept="image/png,image/webp,image/jpeg,image/jpg"
        v-model="form_hidden_data.d_file"
        @change="uploadFile('d_file')"
        ref="d-input"
      />
    </div>

    <!--Cropper dialog-->
    <v-col cols="auto">
      <v-dialog
        transition="dialog-bottom-transition"
        max-width="600"
        v-model="cropper_dialog"
      >
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
              :loading="crop_confirm_loading"
              @click="upload()"
            >
              Confirm
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
    <!--End cropper dialog-->
  </v-container>
</template>

<script>
import { ValidationObserver, ValidationProvider } from "vee-validate";
import TopicSelector from "@/components/form/topic-selector";
import "vue-advanced-cropper/dist/style.css";

export default {
  layout: "test-maker-layout",
  name: "edit-test-form",
  head() {
    return {
      title: "Edit test",
      script: [
        //MathType to Latex
        // {
        //   type: 'text/javascript',
        //   src: '/MathType.js'
        // },
        // {
        //   type: 'text/javascript',
        //   src: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js?config=MML_HTMLorMML',
        //   async: true,
        // }
        //End MathType to Latex
      ],
    };
  },

  components: {
    ValidationObserver,
    ValidationProvider,
    TopicSelector,
    "ckeditor-nuxt": () => {
      if (process.client) {
        return import("@blowstack/ckeditor-nuxt");
      }
    },

    cropper_dialog: false,
  },
  data() {
    return {
      path_panel_expand: true,
      create_loading: false,
      test_step: 1,
      editorConfig: {
        toolbar: [
          "bold",
          "underline",
          "alignment",
          // , 'mathType', 'chemType'
        ],
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
      },

      form: {
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
      },
      file_original_path: "",
      form_hidden_data: {
        q_file: "",
        answer_full_file: "",
        a_file: "",
        b_file: "",
        c_file: "",
        d_file: "",
      },
      timepicker_menu: false,

      level_list: [],
      grade_list: [],
      field_list: [],
      lesson_list: [],
      topic_list: [],
      txt_direction_list: [
        {
          value: "ltr",
          title: "LTR",
        },
        {
          value: "rtl",
          title: "RTL",
        },
      ],

      crop_file_url: "",
      crop_file_loading: false,
      cropper_dialog: false,
      current_crop_file: "",
      crop_confirm_loading: false,

      stencil_props: {
        width: 180,
        height: 180,
      },
      text_answer: true,
      photo_answer: false,
      update_file_loading: false,
      target_file: "", //Current file to crop, change and upload
      typeList: [
        { value: "fourchoice", title: "Multiple choice(4)" },
        { value: "twochoice", title: "Multiple choice(2)" },
        { value: "descriptive", title: "Open-Ended" },
        { value: "tf", title: "True/False" },
        { value: "blank", title: "Blank" },
        { value: "shortanswer", title: "Short answer" },
      ],
    };
  },
  mounted() {
    this.getCurrentExamTestsInfo();
    this.getTypeList("section");
    this.getTypeList("test_type");
    this.getTypeList("state");
  },
  watch: {
    "form.section"(val) {
      this.getTypeList("base", val);
    },
    "form.base"(val) {
      this.getTypeList("lesson", val);
    },
    "form.lesson"(val) {
      this.getTypeList("topic", val);
    },
  },
  methods: {
    getTypeList(type, parent = "") {
      var params = {
        type: type,
      };
      if (type === "base") params.section_id = parent;
      if (type === "lesson") {
        params.base_id = parent;
      }
      if (type === "topic") {
        params.lesson_id = parent;
      }
      if (type === "area") {
        params.state_id = parent;
      }

      if (type === "school") {
        params.section_id = this.form.level;
        params.area_id = this.form.area;
      }

      this.$axios
        .$get("/api/v1/types/list", {
          params,
        })
        .then((res) => {
          var data = {};
          if (type === "section") {
            this.level_list = res.data;
          } else if (type === "base") {
            this.grade_list = res.data;
          } else if (type === "lesson") {
            this.lesson_list = res.data;
          } else if (type === "topic") {
            this.topic_list = res.data;
          } else if (type === "test_type") {
            this.test_type_list = res.data;
          } else if (type === "state") {
            this.state_list = res.data;
          } else if (type === "area") {
            this.area_list = res.data;
          } else if (type === "school") {
            this.school_list = res.data;
          }
        })
        .catch((err) => {
          this.$toast.error(err);
        });
    },
    updateQuestion() {
      this.create_loading = true;
      const querystring = require("querystring");
      this.$axios
        .$put(
          `/api/v1/examTests/${this.$route.params.id}`,
          querystring.stringify(this.form)
        )
        .then((response) => {
          if (response.status == 1) {
            this.$toast.success("Updated successfully");
            this.$router.push({
              path: "/test-maker/create",
            });
          } else {
            this.$toast.error("An error occurred, try again");
          }
        })
        .catch((err) => {
          if (err.response.status === 400)
            this.$toast.error(err.response.data.message);
          console.log(err);
        })
        .finally(() => {
          this.create_loading = false;
        });
    },

    upload() {
      this.crop_confirm_loading = true;
      let file;
      if (this.current_crop_file === "q_file") file = this.form.q_file_base64;
      else if (this.current_crop_file === "answer_full_file")
        file = this.form.answer_full_file_base64;
      else if (this.current_crop_file === "a_file")
        file = this.form.a_file_base64;
      else if (this.current_crop_file === "b_file")
        file = this.form.b_file_base64;
      else if (this.current_crop_file === "c_file")
        file = this.form.c_file_base64;
      else if (this.current_crop_file === "d_file")
        file = this.form.d_file_base64;

      const querystring = require("querystring");

      this.$axios
        .$post("/api/v1/upload", querystring.stringify({ file_base64: file }))
        .then((response) => {
          let file = response.data[0].file.name;
          if (this.current_crop_file === "q_file") this.form.q_file = file;
          else if (this.current_crop_file === "answer_full_file")
            this.form.answer_full_file = file;
          else if (this.current_crop_file === "a_file") this.form.a_file = file;
          else if (this.current_crop_file === "b_file") this.form.b_file = file;
          else if (this.current_crop_file === "c_file") this.form.c_file = file;
          else if (this.current_crop_file === "d_file") this.form.d_file = file;

          //

          this.cropper_dialog = false;
        })
        .catch((err) => {
          if (err.response.status == 400)
            this.$toast.error(err.response.data.message);
          else if (err.response.status == 403) this.$auth.logout();
          this.$toast.error(err.response.data.message);
        })
        .finally(() => {
          this.crop_confirm_loading = false;
        });
    },

    selectFile(file_name) {
      if (file_name === "q_file") {
        this.$refs["question-input"].$refs.input.click();
        this.target_file = "q_file_base64";
      } else if (file_name === "answer_full_file") {
        this.$refs["answer-full-input"].$refs.input.click();
        this.target_file = "answer_full_file_base64";
      } else if (file_name === "a_file") {
        this.$refs["a-input"].$refs.input.click();
        this.target_file = "a_file_base64";
      } else if (file_name === "b_file") {
        this.$refs["b-input"].$refs.input.click();
        this.target_file = "b_file_base64";
      } else if (file_name === "c_file") {
        this.$refs["c-input"].$refs.input.click();
        this.target_file = "c_file_base64";
      } else if (file_name === "d_file") {
        this.$refs["d-input"].$refs.input.click();
        this.target_file = "d_file_base64";
      }
    },
    uploadFile(file_name) {
      var file = "";
      if (file_name === "q_file") {
        file = this.form_hidden_data.q_file;
        this.current_crop_file = "q_file";
      } else if (file_name === "answer_full_file") {
        file = this.form_hidden_data.answer_full_file;
        this.current_crop_file = "answer_full_file";
      } else if (file_name === "a_file") {
        file = this.form_hidden_data.a_file;
        this.current_crop_file = "a_file";
      } else if (file_name === "b_file") {
        file = this.form_hidden_data.b_file;
        this.current_crop_file = "b_file";
      } else if (file_name === "c_file") {
        file = this.form_hidden_data.c_file;
        this.current_crop_file = "c_file";
      } else if (file_name === "d_file") {
        file = this.form_hidden_data.d_file;
        this.current_crop_file = "d_file";
      }

      if (file) {
        if (file_name === "q_file")
          this.form.q_file_base64 = URL.createObjectURL(file);
        else if (file_name === "answer_full_file")
          this.form.answer_full_file_base64 = URL.createObjectURL(file);
        else if (file_name === "a_file")
          this.form.a_file_base64 = URL.createObjectURL(file);
        else if (file_name === "b_file")
          this.form.b_file_base64 = URL.createObjectURL(file);
        else if (file_name === "c_file")
          this.form.c_file_base64 = URL.createObjectURL(file);
        else if (file_name === "d_file")
          this.form.d_file_base64 = URL.createObjectURL(file);

        this.crop_file_url = URL.createObjectURL(file);
      }

      if (this.crop_file_url) this.cropper_dialog = true;
    },
    cropFile({ coordinates, canvas, image }) {
      if (this.current_crop_file === "q_file")
        this.form.q_file_base64 = canvas.toDataURL();
      else if (this.current_crop_file === "answer_full_file")
        this.form.answer_full_file_base64 = canvas.toDataURL();
      else if (this.current_crop_file === "a_file")
        this.form.a_file_base64 = canvas.toDataURL();
      else if (this.current_crop_file === "b_file")
        this.form.b_file_base64 = canvas.toDataURL();
      else if (this.current_crop_file === "c_file")
        this.form.c_file_base64 = canvas.toDataURL();
      else if (this.current_crop_file === "d_file")
        this.form.d_file_base64 = canvas.toDataURL();
    },
    deleteFile(file_name) {
      if (file_name === "q_file") {
        this.form.q_file_base64 = "";
        this.form.q_file = null;
        this.$refs["question-input"].$refs.input.value = null;
        this.current_crop_file = "";
      } else if (file_name === "answer_full_file") {
        this.form.answer_full_file_base64 = "";
        this.form.answer_full_file = null;
        this.$refs["answer-full-input"].$refs.input.value = null;
        this.current_crop_file = "";
      } else if (file_name === "a_file") {
        this.form.a_file_base64 = "";
        this.form.a_file = null;
        this.$refs["a-input"].$refs.input.value = null;
        this.current_crop_file = "";
      } else if (file_name === "b_file") {
        this.form.b_file_base64 = "";
        this.form.b_file = null;
        this.$refs["b-input"].$refs.input.value = null;
        this.current_crop_file = "";
      } else if (file_name === "c_file") {
        this.form.c_file_base64 = "";
        this.form.c_file = "";
        this.$refs["c-input"].$refs.input.value = null;
        this.current_crop_file = "";
      } else if (file_name === "d_file") {
        this.form.d_file_base64 = "";
        this.form.d_file = "";
        this.$refs["d-input"].$refs.input.value = null;
        this.current_crop_file = "";
      }

      this.$axios.$delete(
        `/api/v1/examTests/${this.$route.params.id}/files/${file_name}`
      );
    },

    answerTypeChanged(type) {
      if (type === "txt") {
        if (this.text_answer === true) {
          this.photo_answer = false;
          this.form.testImgAnswers = false;
        } else {
          this.photo_answer = true;
          this.form.testImgAnswers = true;
        }
      } else {
        if (this.photo_answer === true) {
          this.text_answer = false;
          this.form.testImgAnswers = true;
        } else {
          this.text_answer = true;
          this.form.testImgAnswers = false;
        }
      }
    },

    getCurrentExamTestsInfo() {
      this.$axios
        .$get(`/api/v1/examTests/${this.$route.params.id}`)
        .then((response) => {
          this.form.section = response.data.section;
          this.form.base = response.data.base;
          this.form.lesson = response.data.lesson;
          this.form.topic = response.data.topic;
          this.form.type = response.data.type;
          this.form.question = response.data.question;
          this.form.q_file = response.data.q_file;
          this.form.q_file_base64 = response.data.q_file;
          this.form.testImgAnswers = response.data.testImgAnswers;

          if (this.form.testImgAnswers == true) {
            this.photo_answer = true;
            this.text_answer = false;
          }

          this.form.true_answer = response.data.true_answer;
          this.form.answer_a = response.data.answer_a;
          this.form.answer_b = response.data.answer_b;
          this.form.answer_c = response.data.answer_c;
          this.form.answer_d = response.data.answer_d;
          this.form.a_file = response.data.a_file;
          this.form.a_file_base64 = response.data.a_file;
          this.form.b_file = response.data.b_file;
          this.form.b_file_base64 = response.data.b_file;
          this.form.c_file = response.data.c_file;
          this.form.c_file_base64 = response.data.c_file;
          this.form.d_file = response.data.d_file;
          this.form.d_file_base64 = response.data.d_file;
          this.form.answer_full = response.data.answer_full;
          this.form.answer_full_file = response.data.answer_full_file;
          this.form.answer_full_file_base64 = response.data.answer_full_file;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    //Convert form data from multipart to urlencode
    urlencodeFormData(fd) {
      var s = "";

      for (var pair of fd.entries()) {
        if (typeof pair[1] == "string") {
          s +=
            (s ? "&" : "") + this.encode(pair[0]) + "=" + this.encode(pair[1]);
        }
      }
      return s;
    },
    encode(s) {
      return encodeURIComponent(s).replace(/%20/g, "+");
    },
    //End convert form data from multipart to urlencode

    updateFile() {
      this.update_file_loading = true;
      let formData = new FormData();
      if (this.target_file == "a_file_base64")
        formData.append("a_file_base64", this.form.a_file_base64);
      else if (this.target_file == "b_file_base64")
        formData.append("b_file_base64", this.form.b_file_base64);
      else if (this.target_file == "c_file_base64")
        formData.append("c_file_base64", this.form.c_file_base64);
      else if (this.target_file == "d_file_base64")
        formData.append("d_file_base64", this.form.d_file_base64);
      else if (this.target_file == "q_file_base64")
        formData.append("q_file_base64", this.form.q_file_base64);
      else if (this.target_file == "answer_full_file_base64")
        formData.append(
          "answer_full_file_base64",
          this.form.answer_full_file_base64
        );

      this.$axios
        .$post(`/api/v1/examTests/${this.$route.params.id}/files`, formData, {
          headers: {
            accept: "*/*",
            "Content-Type": "multipart/form-data",
          },
        })
        .finally(() => {
          this.update_file_loading = false;
          this.cropper_dialog = false;
        });
    },
  },
};
</script>

<style scoped>
.topic_list_item {
  font-size: 1.4rem;
  line-height: 2rem;
}

.topic_season {
  font-weight: bolder !important;
  color: blue !important;
}
</style>
