<template>
  <v-row>
    <v-col cols="12" class="px-0 px-sm-2">
      <v-row>
        <v-col cols="12" class="pl-5">
          <span class="text-h4 teal--text"> Past Papers Submission Form </span>
        </v-col>
      </v-row>
      <v-card class="mt-3">
        <v-card-text class="px-0 px-sm-8 px-md-4">
          <v-card-text>
            <v-card flat class="mt-3">
              <validation-observer ref="observer" v-slot="{ invalid }">
                <form @submit.prevent="submitQuestion">
                  <v-row>
                    <v-col cols="12" md="4">
                      <validation-provider
                        v-slot="{ errors }"
                        name="curriculum"
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
                    <v-col cols="12" md="12" v-show="topic_list.length">
                      <topic-selector
                        ref="topic-selector"
                        :topic-list="topic_list"
                        @selectTopic="selectTopic"
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-autocomplete
                        dense
                        :items="test_type_list"
                        item-value="id"
                        item-text="title"
                        v-model="form.test_type"
                        label="Classification"
                        outlined
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <validation-provider
                        v-slot="{ errors }"
                        name="answer_type"
                        rules="required"
                      >
                        <v-autocomplete
                          dense
                          :items="answer_status_list"
                          item-value="id"
                          item-text="title"
                          v-model="form.answer_type"
                          label="Solution Availability"
                          outlined
                        />
                      </validation-provider>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-autocomplete
                        dense
                        :items="test_level_list"
                        item-value="id"
                        item-text="title"
                        v-model="form.level"
                        label="Difficulty Level"
                        outlined
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <validation-provider
                        v-slot="{ errors }"
                        name="edu_year"
                        rules="required"
                      >
                        <v-autocomplete
                          dense
                          :items="year_list"
                          v-model="form.edu_year"
                          :error-messages="errors"
                          label="Year"
                          outlined
                        />
                      </validation-provider>
                    </v-col>
                    <v-col cols="12" md="4">
                      <validation-provider
                        v-slot="{ errors }"
                        name="edu_month"
                        rules="required"
                      >
                        <v-autocomplete
                          dense
                          :items="month_list"
                          v-model="form.edu_month"
                          item-text="title"
                          item-value="id"
                          :error-messages="errors"
                          label="Month"
                          outlined
                        />
                      </validation-provider>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-autocomplete
                        dense
                        :items="holding_level_list"
                        v-model="form.holding_level"
                        item-text="title"
                        item-value="id"
                        label="Testing Scope"
                        clearable
                        outlined
                      />
                    </v-col>

                    <v-col cols="12" md="4" v-if="form.holding_level < 4">
                      <v-autocomplete
                        dense
                        :items="state_list"
                        v-model="form.state"
                        item-text="title"
                        item-value="id"
                        label="State"
                        outlined
                      />
                    </v-col>
                    <v-col cols="12" md="4" v-if="form.holding_level < 3">
                      <v-autocomplete
                        dense
                        :items="area_list"
                        v-model="form.area"
                        item-text="title"
                        item-value="id"
                        label="Area"
                        outlined
                      />
                    </v-col>
                    <v-col cols="12" md="4" v-if="form.holding_level < 2">
                      <v-autocomplete
                        dense
                        :items="school_list"
                        v-model="form.school"
                        item-text="title"
                        item-value="id"
                        label="School"
                        outlined
                      />
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
                          placeholder="Write a concise, descriptive, and SEO-friendly title."
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
                          v-model="form.description"
                          @focus="increaseTextAreaHeight()"
                          :height="textAreaHeight"
                          :error-messages="errors"
                          auto-grow
                          label="Content outline"
                          hint="You must enter at least 70 characters."
                          persistent-hint
                          placeholder="A brief overview of the content, outlining sections, topics, and question formats."
                          outlined
                          :rows="1"
                        />
                      </validation-provider>
                    </v-col>
                    <v-col cols="12" md="4">
                      <validation-provider
                        v-slot="{ validate, errors }"
                        ref="file_pdf_provider"
                        name="pdf_question_answer_file"
                        rules="required|mimes:application/pdf"
                      >
                        <v-file-input
                          dense
                          v-model="file_pdf"
                          :error-messages="errors"
                          :prepend-icon="null"
                          accept="application/pdf"
                          ref="file_pdf_provider"
                          label="PDF Question"
                          color="red"
                          :loading="file_pdf_loading"
                          :disabled="input_stauts.file_pdf"
                          @change="uploadFile('file_pdf', $event), validate"
                          prepend-inner-icon="mdi-file-pdf-box"
                          append-icon="mdi-folder-open"
                          outlined
                        />
                      </validation-provider>
                    </v-col>
                    <v-col cols="12" md="4">
                      <validation-provider
                        v-slot="{ validate, errors }"
                        name="file_answer"
                        ref="file_answer_provider"
                        rules="mimes:application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      >
                        <v-file-input
                          dense
                          v-model="file_answer"
                          label="PDF Solution"
                          :prepend-icon="null"
                          :error-messages="errors"
                          accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          :loading="file_answer_loading"
                          color="teal accent-3"
                          @change="uploadFile('file_answer', $event), validate"
                          prepend-inner-icon="mdi-file"
                          :disabled="input_stauts.file_answer"
                          append-icon="mdi-folder-open"
                          outlined
                        />
                      </validation-provider>
                    </v-col>
                    <v-col cols="12" md="4">
                      <validation-provider
                        v-slot="{ validate, errors }"
                        name="file_word"
                        ref="file_word_provider"
                        rules="mimes:application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      >
                        <v-file-input
                          dense
                          v-model="file_word"
                          label="Word Q & S"
                          :prepend-icon="null"
                          :error-messages="errors"
                          accept="application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          :loading="file_word_loading"
                          color="blue"
                          @change="uploadFile('file_word', $event), validate"
                          prepend-inner-icon="mdi-file-word-outline"
                          :disabled="input_stauts.file_word"
                          append-icon="mdi-folder-open"
                          outlined
                        />
                      </validation-provider>
                    </v-col>

                    <v-col cols="12" v-if="extraAttr.length">
                      <v-row v-for="(item, index) in extraAttr" :key="index">
                        <v-col cols="12" md="4">
                          <v-autocomplete
                            :items="extra_type_list"
                            outlined
                            :value="item.type"
                            @input="applyExtraType($event, index)"
                            dense
                            item-text="title"
                            item-value="id"
                            label="Select file type"
                          />
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-file-input
                            dense
                            label="Select file"
                            :prepend-icon="null"
                            :loading="file_extra_loading"
                            color="green"
                            :value="item.file_extra"
                            @change="uploadFile('file_extra', $event, index)"
                            :disabled="input_stauts.file_extra"
                            prepend-inner-icon="mdi-plus"
                            append-icon="mdi-folder-open"
                            outlined
                          />
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="12">
                      <v-btn outlined color="success" @click="addExtraAttr">
                        <v-icon> mdi-plus </v-icon>
                        Add Solution video
                      </v-btn>
                    </v-col>

                    <v-col cols="12" md="6" class="pb-0">
                      <v-btn
                        type="submit"
                        lg
                        color="success"
                        :disabled="invalid"
                        :loading="loading.form"
                        block
                      >
                        Submit
                      </v-btn>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-btn lg outlined color="error" to="/user/paper" block>
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
import querystring from "querystring";

export default {
  layout: "dashboard_layout",
  name: "add-paper",
  data() {
    return {
      textAreaHeight: 40,
      form: {
        section: "",
        base: "",
        lesson: "",
        topics: "",
        test_type: "",
        answer_type: 2,
        level: 2,
        year: "",
        month: "",
        holding_level: this.$store.state.user.lastSelectedHoldingLevel
          ? this.$store.state.user.lastSelectedHoldingLevel
          : 4,
        state: "",
        area: "",
        school: "",
        file_pdf: "",
        file_word: "",
        file_answer: "",
        free_agreement: 1,
        edu_year: "",
        edu_month: "",
      },
      //File section
      file_pdf: null,
      file_word: null,
      file_answer: null,

      file_pdf_loading: false,
      file_word_loading: false,
      file_answer_loading: false,
      file_extra_loading: false,

      input_stauts: {
        file_pdf: false,
        file_word: false,
        file_answer: false,
        file_extra: false,
      },
      //End file section

      section_list: [],
      grade_list: [],
      field_list: [],
      lesson_list: [],
      topic_list: [],
      test_type_list: [],
      answer_status_list: [
        { id: 0, title: "No Solution" },
        { id: 1, title: "Answer Key" },
        { id: 2, title: "Complete Solution" },
      ],
      test_level_list: [
        {
          id: "1",
          title: "Easy",
        },
        {
          id: "2",
          title: "Moderate",
        },
        {
          id: "3",
          title: "Hard",
        },
      ],
      year_list: [
        2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014,
        2013,
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
      holding_level_list: [
        // { id: 1, title: "School" },
        // { id: 2, title: "District" },
        // { id: 3, title: "State" },
        { id: 4, title: "National" },
        { id: 5, title: "International" },
      ],
      state_list: [],
      area_list: [],
      school_list: [],
      extraAttr: [],
      extra_type_list: [],

      loading: {
        form: false,
      },
    };
  },
  head() {
    return {
      title: "Add paper",
    };
  },
  components: {
    TopicSelector,
    ValidationProvider,
    ValidationObserver,
  },
  mounted() {
    this.getTypeList("section");
    this.getTypeList("state");
    this.getExtraFileType();
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
      this.getTypeList("test_type", val);
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
    "form.holding_level"(val) {
      this.$store.commit("user/setHoldingLevel", val);
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
    increaseTextAreaHeight() {
      this.textAreaHeight = 240;
    },
    getTypeList(type, parent = "") {
      var params = {
        type: type,
      };

      if (type === "base") params.section_id = parent;
      if (type === "test_type") params.section_id = parent;
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
        params.section_id = this.form.section;
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

    async getExtraFileType() {
      await this.$axios
        .$get("/api/v1/types/list", {
          params: {
            type: "test_extra_file",
          },
        })
        .then((response) => {
          this.extra_type_list = response.data;
        })
        .catch((error) => {});
    },
    submitQuestion() {
      this.loading.form = true;
      //Arrange to form data
      let formData = new FormData();
      for (let key in this.form) {
        if (!(key == "topics" || key == "file_extra"))
          formData.append(key, this.form[key]);
      }

      if (this.form.topics.length)
        for (let key in this.form.topics)
          formData.append("topics[]", this.form.topics[key]);

      if (this.extraAttr.length)
        for (let key in this.extraAttr)
          formData.append("file_extra[]", JSON.stringify(this.extraAttr[key]));

      //End arrange to form data

      this.$axios
        .$post("/api/v1/tests", this.urlencodeFormData(formData), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
        .then((response) => {
          if (response.data.id == 0 && response.data.repeated)
            this.$toast.info("The paper is duplicated");
          else {
            this.$toast.success("Submit successfully");
            this.$router.push({
              path: "/user/paper",
            });
          }
        })
        .catch((err) => {
          if (err.response.status == 403) this.$auth.logout();
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

    async uploadFile(file_name, value, index = "") {
      if (!value) return; //Check empty request

      let formData = new FormData();
      if (file_name == "file_pdf") {
        const { valid } = await this.$refs.file_pdf_provider.validate(value);
        if (!valid) return;

        formData.append("file", value);
        this.file_pdf_loading = true;
        this.input_stauts.file_word = true;
        this.input_stauts.file_answer = true;
        this.input_stauts.file_extra = true;
        this.loading.form = true;
      } else if (file_name == "file_word") {
        const { valid } = await this.$refs.file_word_provider.validate(value);
        if (!valid) return;

        formData.append("file", value);
        this.file_word_loading = true;
        this.loading.form = true;
        this.input_stauts.file_pdf = true;
        this.input_stauts.file_answer = true;
        this.input_stauts.file_extra = true;
      } else if (file_name == "file_answer") {
        const { valid } = await this.$refs.file_answer_provider.validate(value);
        if (!valid) return;

        formData.append("file", value);
        this.file_answer_loading = true;
        this.loading.form = true;
        this.input_stauts.file_pdf = true;
        this.input_stauts.file_word = true;
        this.input_stauts.file_extra = true;
      } else if (file_name == "file_extra") {
        formData.append("file", value);
        // this.file_extra_loading = true;
        this.input_stauts.file_pdf = true;
        this.input_stauts.file_word = true;
        this.input_stauts.file_answer = true;
      }

      this.$axios
        .$post("/api/v1/upload", formData, {
          headers: {
            accept: "*/*",
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          if (file_name == "file_pdf")
            this.form.file_pdf = response.data[0].file.name;
          else if (file_name == "file_word")
            this.form.file_word = response.data[0].file.name;
          else if (file_name == "file_answer")
            this.form.file_answer = response.data[0].file.name;
          else if (file_name == "file_extra")
            this.extraAttr[index].file = response.data[0].file.name;
        })
        .catch((err) => {
          if (err.response.status == 403) this.$auth.logout();
          else this.$toast.error("Error uploading the file");
        })
        .finally(() => {
          this.file_pdf_loading = false;
          this.file_word_loading = false;
          this.file_answer_loading = false;
          this.loading.form = false;
          this.input_stauts.file_pdf = false;
          this.input_stauts.file_word = false;
          this.input_stauts.file_answer = false;
          this.input_stauts.file_extra = false;
        });
      // }
    },

    addExtraAttr() {
      this.extraAttr.push({ type: "", file: null });
    },
    applyExtraType(value, index) {
      this.extraAttr[index].type = value;
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

.topic_season {
  font-weight: bolder !important;
  color: blue !important;
}
</style>
