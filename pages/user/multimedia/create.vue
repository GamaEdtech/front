<template>
  <v-row>
    <v-col cols="12" class="px-0 px-sm-2">
      <v-row>
        <v-col cols="12" class="pl-5">
          <span class="text-h4 teal--text"> Multimedia Submission Form </span>
        </v-col>
      </v-row>
      <v-card class="mt-3">
        <v-card-text class="px-0 px-sm-8 px-md-4">
          <v-card-text>
            <v-card flat class="mt-3">
              <validation-observer ref="observer" v-slot="{ invalid }">
                <form @submit.prevent="submitContent">
                  <v-row>
                    <v-col cols="12" md="4">
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
                    <v-col cols="12" md="4">
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
                    <v-col cols="12" md="4">
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
                    <v-col cols="12" md="12">
                      <validation-provider
                        v-slot="{ errors }"
                        name="topic"
                        rules="required"
                      >
                        <topic-selector
                          ref="topic-selector"
                          :topic-list="topic_list"
                          @selectTopic="selectTopic"
                        />
                      </validation-provider>
                    </v-col>
                    <v-col cols="12" md="12">
                      <validation-provider
                        v-slot="{ errors }"
                        name="title"
                        rules="required"
                      >
                        <v-text-field
                          dense
                          v-model="form.title"
                          :error-messages="errors"
                          label="Title"
                          outlined
                        />
                      </validation-provider>
                    </v-col>
                    <v-col cols="12" md="12">
                      <validation-provider
                        v-slot="{ errors }"
                        name="description"
                        rules="required|min:70"
                      >
                        <v-textarea
                          dense
                          v-model="form.description"
                          :error-messages="errors"
                          label="Describe"
                          hint="You must enter at least 70 characters."
                          persistent-hint
                          placeholder="Write a brief description about the files to help the user make an informed choice"
                          outlined
                        />
                      </validation-provider>
                    </v-col>
                    <!--                    <v-col cols="12">-->
                    <!--                      <v-checkbox-->
                    <!--                        dense-->
                    <!--                        v-model="form.online_teaching"-->
                    <!--                        label="This is an online teaching session"-->
                    <!--                      />-->

                    <!--                    </v-col>-->
                    <!--                    <v-col cols="12" md="12" v-show="form.online_teaching">-->
                    <!--                      <v-date-picker-->
                    <!--                        v-model="form.date"-->
                    <!--                        full-width-->
                    <!--                      ></v-date-picker>-->
                    <!--                    </v-col>-->
                    <!--                    <v-col-->
                    <!--                      cols="12"-->
                    <!--                      md="4"-->
                    <!--                      v-show="form.online_teaching"-->
                    <!--                    >-->
                    <!--                      <v-menu-->
                    <!--                        ref="menu"-->
                    <!--                        v-model="timepicker_menu"-->
                    <!--                        :close-on-content-click="false"-->
                    <!--                        :nudge-right="40"-->
                    <!--                        :return-value.sync="form.teaching_time"-->
                    <!--                        transition="scale-transition"-->
                    <!--                        offset-y-->
                    <!--                      >-->
                    <!--                        <template v-slot:activator="{ on, attrs }">-->
                    <!--                          <v-text-field-->
                    <!--                            v-model="form.teaching_time"-->
                    <!--                            label="Start time"-->
                    <!--                            prepend-icon="mdi-clock-time-four-outline"-->
                    <!--                            readonly-->
                    <!--                            outlined-->
                    <!--                            dense-->
                    <!--                            v-bind="attrs"-->
                    <!--                            v-on="on"-->
                    <!--                          ></v-text-field>-->
                    <!--                        </template>-->
                    <!--                        <v-time-picker-->
                    <!--                          v-if="timepicker_menu"-->
                    <!--                          v-model="form.teaching_time"-->
                    <!--                          full-width-->
                    <!--                          @click:minute="$refs.menu.save(form.teaching_time)"-->
                    <!--                        ></v-time-picker>-->
                    <!--                      </v-menu>-->
                    <!--                    </v-col>-->
                    <!--                    <v-col cols="12" md="4" v-show="form.online_teaching">-->
                    <!--                      <v-text-field-->
                    <!--                        outlined-->
                    <!--                        dense-->
                    <!--                        v-model="form.duration"-->
                    <!--                        type="number"-->
                    <!--                        min="0"-->
                    <!--                        label="Duration(min)"/>-->
                    <!--                    </v-col>-->

                    <v-col cols="12" md="4">
                      <validation-provider
                        v-slot="{ errors }"
                        name="content_type"
                        rules="required"
                      >
                        <v-autocomplete
                          dense
                          :items="content_type_list"
                          item-value="id"
                          item-text="title"
                          v-model="form.content_type"
                          :error-messages="errors"
                          label="Content type"
                          outlined
                        />
                      </validation-provider>
                    </v-col>
                    <v-col cols="12" md="4">
                      <validation-provider
                        v-slot="{ validate, errors }"
                        name="multimedia_file"
                        rules="required|mimes:video/*,audio/*,application/exe,application/zip,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats,officedocument.presentationml.presentation"
                        ref="file_provider"
                      >
                        <v-file-input
                          dense
                          :error-messages="errors"
                          label="Multimedia file"
                          :prepend-icon="null"
                          color="red"
                          v-model="multimedia_file"
                          accept=".mp4,.avi,.m4a,.mpg,.flv,.docx,.pptx,.pdf,.exe,.apk,.mp3,.wave,.acc,.swf,.gif,.zip"
                          @change="uploadFile('file', $event)"
                          prepend-inner-icon="mdi-play-box"
                          append-icon="mdi-folder-open"
                          outlined
                        />
                      </validation-provider>
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
                        dense
                        outlined
                        v-model="form.from_page"
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        type="number"
                        min="1"
                        label="To page"
                        dense
                        outlined
                        v-model="form.to_page"
                      />
                    </v-col>
                    <v-col cols="12" md="12">
                      <validation-provider
                        v-slot="{ errors }"
                        name="word_question_answer_file"
                      >
                        <v-checkbox
                          dense
                          v-model="form.free_available"
                          :error-messages="errors"
                          label="I would like the file to be freely available to others."
                        />
                      </validation-provider>
                    </v-col>

                    <v-col cols="12" md="6" class="pb-0">
                      <v-btn
                        type="submit"
                        :disabled="invalid"
                        :loading="loading.form"
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
                        to="/user/multimedia"
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
import TopicSelector from "@/components/form/topic-selector";

export default {
  layout: "dashboard_layout",
  name: "add-multimedia",
  data() {
    return {
      form: {
        section: "",
        base: "",
        lesson: "",
        topics: [],
        content_type: "",
        // online_teaching:false,
        // date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        // teaching_time:null,
        from_page: "",
        to_page: "",
        free_agreement: 0,
        title: "",
        description: "",
        file: "",
      },

      multimedia_file: null,

      // timepicker_menu:false,
      section_list: [],
      grade_list: [],
      field_list: [],
      lesson_list: [],
      topic_list: [],
      content_type_list: [],
      answer_status_list: [
        { id: 0, title: "Has answer" },
        { id: 1, title: "Has key answer" },
        { id: 2, title: "Has descriptive answer" },
      ],
      test_level_list: [
        {
          id: "1",
          title: "Simple",
        },
        {
          id: "2",
          title: "Medium",
        },
        {
          id: "3",
          title: "Hard",
        },
      ],
      year_list: [
        2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013,
      ],
      month_list: [
        { id: 1, title: "January" },
        { id: 2, title: "February" },
        { id: 3, title: "March" },
        { id: 4, title: "April" },
        { id: 5, title: "May" },
        { id: 6, title: "June" },
        { id: 7, title: "July" },
        { id: 8, title: "August" },
        { id: 9, title: "September" },
        { id: 10, title: "October" },
        { id: 11, title: "November" },
        { id: 12, title: "December" },
      ],
      state_list: [],
      area_list: [],
      school_list: [],

      //Handle loading object
      loading: {
        file: false, //Upload file
        form: false, //Submit multimedia form
      },
    };
  },
  head() {
    return {
      title: "Multimedia submission",
    };
  },
  components: {
    TopicSelector,
    ValidationProvider,
    ValidationObserver,
  },
  mounted() {
    this.getTypeList("section");
    this.getTypeList("content_type");
    this.getTypeList("state");
  },
  watch: {
    "form.section"(val) {
      this.$store.commit("user/setCurriculum", val);

      this.form.grade = "";
      this.form.lesson = "";
      this.form.topics = [];
      this.grade_list = [];
      this.lesson_list = [];
      this.topic_list = [];

      this.getTypeList("base", val);
      if (this.form.area) this.getTypeList("school");
    },
    "form.base"(val) {
      this.$store.commit("user/setGrade", val);

      this.form.lesson = "";
      if (val) this.getTypeList("lesson", val);
    },
    "form.lesson"(val) {
      this.$store.commit("user/setSubject", val);

      if (val) {
        this.getTypeList("topic", val);
        this.$refs["topic-selector"].lesson_selected = true;
      } else {
        this.form.topic = [];
        this.topic_list = [];
        this.$refs["topic-selector"].lesson_selected = false;
      }
    },

    "form.state"(val) {
      this.getTypeList("area", val);
    },
    "form.area"(val) {
      this.getTypeList("school");
    },
    "form.free_agreement"(val) {
      if (val == true) this.form.free_agreement = 1;
      else this.form.free_agreement = 0;
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
          } else if (type === "content_type") {
            this.content_type_list = res.data;
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

    submitContent() {
      this.submit_loading = true;
      //Arrange to form data
      let formData = new FormData();
      for (let key in this.form) {
        if (!(key == "topics")) formData.append(key, this.form[key]);
      }

      if (this.form.topics.length)
        for (let key in this.form.topics)
          formData.append("topics[]", this.form.topics[key]);

      //End arrange to form data

      this.$axios
        .$post("/api/v1/files", this.urlencodeFormData(formData), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `${this.$auth.strategy.token.get()}`,
          },
        })
        .then((response) => {
          if (response.data.id == 0 && response.data.repeated)
            this.$toast.info("The multimedia is duplicated");
          else {
            this.$toast.success("Submit successfully");
            this.$router.push({
              path: "/user/multimedia",
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
          this.submit_loading = false;
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
              Authorization: `${this.$auth.strategy.token.get()}`,
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

      // }
    },
  },
};
</script>

<style>
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
