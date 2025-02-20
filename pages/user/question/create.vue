<template>
  <v-row id="question-submit-form">
    <v-col cols="12" class="px-0 px-sm-2">
      <v-row>
        <v-col cols="12" class="pl-5">
          <span class="icon-q-a teal--text"></span>
          <span class="text-h4 teal--text"> Forum Submission Form </span>
        </v-col>
      </v-row>
      <v-card class="mt-3">
        <v-card-text class="px-0 px-sm-8 px-md-4">
          <v-card-text>
            <v-card flat class="mt-3">
              <validation-observer ref="observer" v-slot="{ invalid }">
                <form @submit.prevent="submitContent">
                  <v-row>
                    <v-col cols="12" md="3">
                      <validation-provider
                        v-slot="{ errors }"
                        name="level"
                        rules="required"
                      >
                        <v-autocomplete
                          dense
                          v-model="form.section"
                          :items="section_list"
                          :error-messages="errors"
                          item-text="title"
                          item-value="id"
                          label="Board"
                          outlined
                        />
                      </validation-provider>
                    </v-col>
                    <v-col cols="12" md="3">
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
                    <!--                    <v-col cols="12" md="4">-->
                    <!--                      <validation-provider v-slot="{errors}" name="field" rules="required">-->
                    <!--                        <v-autocomplete-->
                    <!--                          dense-->
                    <!--                          v-model="form.field"-->
                    <!--                          :error-messages="errors"-->
                    <!--                          label="Field"-->
                    <!--                          outlined-->
                    <!--                        />-->
                    <!--                      </validation-provider>-->
                    <!--                    </v-col>-->
                    <v-col cols="12" md="3">
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
                    <v-col cols="12" md="3">
                      <v-autocomplete
                        dense
                        :items="topic_list"
                        item-value="id"
                        item-text="title"
                        v-model="form.topics"
                        label="Topic"
                        outlined
                      >
                        <template v-slot:item="data">
                          <span
                            :class="data.item.season ? 'topic_season' : ''"
                            class="py-2"
                          >
                            {{ data.item.title }}
                          </span>
                        </template>
                      </v-autocomplete>
                    </v-col>

                    <v-col cols="12" md="12">
                      <validation-provider
                        v-slot="{ errors }"
                        name="title"
                        rules="required|min:20"
                      >
                        <v-text-field
                          dense
                          v-model="form.title"
                          :error-messages="errors"
                          label="Summary of the question"
                          outlined
                        />
                      </validation-provider>
                    </v-col>

                    <v-col cols="12" md="12">
                      <validation-provider
                        v-slot="{ errors }"
                        name="question"
                        rules="required|min:70"
                      >
                        <v-textarea
                          dense
                          v-model="form.question"
                          :error-messages="errors"
                          label="Question"
                          hint="You must enter at least 70 characters."
                          persistent-hint
                          placeholder="Enter your question"
                          outlined
                        />
                      </validation-provider>
                    </v-col>
                    <v-col cols="12" md="3">
                      <validation-provider
                        v-slot="{ validate, errors }"
                        rules="mimes:image/png,image/jpg,image/jpeg,image/gif,video/mp4,video/flv,application/zip,application/rar"
                        ref="file_provider"
                        name="file"
                      >
                        <v-file-input
                          dense
                          v-model="file"
                          :error-messages="errors"
                          label="Attach file"
                          accept=".png,.jpg,jpeg,.gif,.zip,.rar,.mp4,.flv"
                          @change="uploadFile('file', $event), validate"
                          :prepend-icon="null"
                          color="red"
                          prepend-inner-icon="mdi-file"
                          append-icon="mdi-folder-open"
                          outlined
                        />
                      </validation-provider>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" md="6" class="pb-0">
                      <v-btn
                        type="submit"
                        :loading="loading.form"
                        :disabled="invalid"
                        lg
                        color="success"
                        block
                      >
                        Submit
                      </v-btn>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-btn
                        lg
                        outlined
                        color="error"
                        to="/user/question"
                        block
                      >
                        Discard
                      </v-btn>
                    </v-col>
                  </v-row>
                </form>
              </validation-observer>
            </v-card>
          </v-card-text>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { ValidationObserver, ValidationProvider } from "vee-validate";

export default {
  layout: "dashboard_layout",
  name: "add-question",
  data() {
    return {
      form: {
        section: "",
        base: "",
        lesson: "",
        topics: "",
        title: "",
        question: "",
        file: "",
      },
      file: null,
      section_list: [],
      grade_list: [],
      lesson_list: [],
      topic_list: [],

      //Handle loading object
      loading: {
        section: false,
        base: false,
        lesson: false,
        topic: false,
        file: false, //Upload file
        form: false, //Submit multimedia form
      },
    };
  },
  head() {
    return {
      title: "Q & A submission form",
    };
  },
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  mounted() {
    this.getTypeList("section");
  },
  watch: {
    "form.section"(val) {
      this.$store.commit("user/setCurriculum", val);
      this.form.base = "";
      this.form.lesson = "";
      this.form.topics = [];
      this.grade_list = [];
      this.lesson_list = [];
      this.topic_list = [];

      this.getTypeList("base", val);
    },
    "form.base"(val) {
      this.$store.commit("user/setGrade", val);

      this.form.lesson = "";
      if (val) this.getTypeList("lesson", val);
    },
    "form.lesson"(val) {
      this.$store.commit("user/setSubject", val);

      if (val) this.getTypeList("topic", val);
      else {
        this.form.topics = [];
        this.topic_list = [];
      }
    },
  },
  methods: {
    getTypeList(type, parent = "") {
      var params = {
        type: type,
      };

      if (type === "section") {
        this.loading.section = true;
      }
      if (type === "base") {
        params.section_id = parent;
        this.loading.base = true;
      }
      if (type === "lesson") {
        params.base_id = parent;
        this.loading.lesson = true;
      }
      if (type === "topic") {
        params.lesson_id = parent;
        this.loading.topic = true;
      }

      this.$axios
        .$get("/api/v1/types/list", {
          params,
        })
        .then((res) => {
          var data = {};
          if (type === "section") {
            this.section_list = res.data;
            this.form.section = this.$store.state.user.lastSelectedCurriculum
              ? this.$store.state.user.lastSelectedCurriculum
              : "";
          } else if (type === "base") {
            this.grade_list = res.data;
            this.form.base = this.$store.state.user.lastSelectedGrade
              ? this.$store.state.user.lastSelectedGrade
              : "";
          } else if (type === "lesson") {
            this.lesson_list = res.data;
            this.form.lesson = this.$store.state.user.lastSelectedSubject
              ? this.$store.state.user.lastSelectedSubject
              : "";
          } else if (type === "topic") {
            this.topic_list = res.data;
          }
        })
        .catch((err) => {
          this.$toast.error(err);
        })
        .finally(() => {
          this.loading.section = false;
          this.loading.base = false;
          this.loading.lesson = false;
          this.loading.topic = false;
        });
    },

    submitContent() {
      this.loading.form = true;
      //Arrange to form data
      let formData = new FormData();
      for (let key in this.form) {
        formData.append(key, this.form[key]);
      }

      this.$axios
        .$post("/api/v1/questions", this.urlencodeFormData(formData), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
        .then((response) => {
          if (response.data.id == 0 && response.data.repeated)
            this.$toast.info("The question is duplicated");
          else {
            this.$toast.success("Submit successfully");
            this.$router.push({
              path: "/user/question",
            });
          }
        })
        .catch((err) => {
          if (err.response.status == 403)
            this.$router.push({ query: { auth_form: "login" } });
          else if (err.response.status == 400)
            this.$toast.error(err.response.data.message);
        })
        .finally(() => {
          this.loading.form = false;
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

    selectTopic(event) {
      this.form.topics = event;
    },

    async uploadFile(file_name, value) {
      if (!value) return;

      const { valid } = await this.$refs.file_provider.validate(value);

      if (valid) {
        this.loading.file = true;
        if (!value)
          //Check empty request
          return;
        let formData = new FormData();
        formData.append("file", value);

        this.$axios
          .$post("/api/v1/upload", formData, {
            headers: {
              accept: "*/*",
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            this.form.file = response.data[0].file.name;
          })
          .catch((err) => {
            this.$toast.error("An error occurred");
          })
          .finally(() => {
            this.loading.file = false;
          });
      }

      console.log("Pass4");

      // }
    },
  },
};
</script>

<style>
#question-submit-form {
  .icon-q-a {
    font-size: 4rem;
  }
  .text-h4 {
    line-height: 4rem;
  }
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

.topic_season {
  font-weight: bolder !important;
  color: blue !important;
}
</style>
