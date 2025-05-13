<template>
  <v-container class="create-test-container">
    <v-row class="mt-4">
      <v-col cols="6">
        <h1 class="text-h4 text-teal">New Exam</h1>
      </v-col>
      <v-col cols="6" class="text-right">
        <v-btn
          variant="outlined"
          color="error"
          :disabled="!exam_id"
          icon="mdi-delete"
          @click="confirmDeleteDialog = true"
        />
        <v-btn
          variant="outlined"
          icon="mdi-printer-eye"
          @click="printPreviewDialog = !printPreviewDialog"
        />
      </v-col>
    </v-row>

    <v-stepper-vertical
      :items="[
        { title: 'Header', value: 1 },
        { title: 'Tests', value: 2 },
        { title: 'Review', value: 3 },
        { title: 'Publish', value: 4 },
      ]"
      v-model="test_step"
      editable
      color="teal"
      hide-actions
    >
      <template #[`item.1`]>
        <v-card flat class="mt-4 pb-10">
          <v-form
            ref="observer"
            @submit.prevent="submitQuestion"
            v-model="isFormValid"
            class="pa-2"
          >
            <v-row>
              <v-col cols="12" md="4">
                <v-autocomplete
                  v-model="form.section"
                  :items="level_list"
                  item-title="title"
                  item-value="id"
                  label="Board"
                  variant="outlined"
                  :rules="[(v) => !!v || 'This field is required']"
                  color="orange"
                  density="compact"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="4">
                <v-autocomplete
                  v-model="form.base"
                  :items="grade_list"
                  item-title="title"
                  item-value="id"
                  label="Grade"
                  variant="outlined"
                  :rules="[(v) => !!v || 'This field is required']"
                  color="orange"
                  density="compact"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="4">
                <v-autocomplete
                  v-model="form.lesson"
                  :items="lesson_list"
                  item-title="title"
                  item-value="id"
                  label="Subject"
                  variant="outlined"
                  :rules="[(v) => !!v || 'This field is required']"
                  color="orange"
                  density="compact"
                ></v-autocomplete>
              </v-col>

              <v-col cols="12">
                <FormTopicSelector
                  ref="topicSelector"
                  :selectedTopics="selected_topics"
                  :topic-list="topic_list"
                  @selectTopic="selectTopic"
                />
              </v-col>

              <v-col cols="12" md="2">
                <v-autocomplete
                  v-model="form.exam_type"
                  :items="test_type_list"
                  item-title="title"
                  item-value="id"
                  label="Exam type"
                  variant="outlined"
                  color="orange"
                  density="compact"
                ></v-autocomplete>
              </v-col>

              <v-col cols="12" md="2">
                <v-text-field
                  v-model="form.duration"
                  type="number"
                  label="Test duration"
                  variant="outlined"
                  color="orange"
                  density="compact"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="2">
                <v-autocomplete
                  v-model="form.edu_year"
                  :items="year_list"
                  label="Year"
                  variant="outlined"
                  color="orange"
                  density="compact"
                ></v-autocomplete>
              </v-col>

              <v-col cols="12" md="2">
                <v-autocomplete
                  v-model="form.edu_month"
                  :items="month_list"
                  item-title="title"
                  item-value="id"
                  label="Month"
                  variant="outlined"
                  color="orange"
                  density="compact"
                ></v-autocomplete>
              </v-col>

              <v-col cols="12" md="4">
                <v-file-input
                  v-model="file_original"
                  label="Source file"
                  variant="outlined"
                  prepend-icon="mdi-paperclip"
                  @update:model-value="uploadFile"
                  accept="application/pdf,image/*"
                  density="compact"
                ></v-file-input>
              </v-col>

              <v-col cols="12" md="8">
                <v-text-field
                  v-model="form.title"
                  label="Title"
                  variant="outlined"
                  :rules="[(v) => !!v || 'This field is required']"
                  density="compact"
                ></v-text-field>
                <div class="text-caption text-grey">
                  Ex: 9700/11 Biology Jun 2020 Online Test | Cambridge AS & A
                  Level MSCO
                </div>
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.paperID"
                  label="Past Paper Id"
                  variant="outlined"
                  density="compact"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-btn
                      type="submit"
                      block
                      color="teal"
                      class="text-white"
                      size="large"
                      :loading="submit_loading"
                      :disabled="!isFormValid"
                      style="
                        text-transform: none;
                        font-size: 13px;
                        font-weight: 500;
                      "
                      density="compact"
                    >
                      Next step
                    </v-btn>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-btn
                      block
                      variant="outlined"
                      color="red"
                      size="large"
                      to="/user/exam"
                      style="
                        text-transform: none;
                        font-size: 13px;
                        font-weight: 500;
                      "
                      density="compact"
                    >
                      Discard
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-form>
        </v-card>
      </template>

      <template #[`item.2`]>
        <v-card flat class="mt-3 pb-10">
          <v-row>
            <v-col cols="12">
              <v-switch
                color="teal"
                v-model="testListSwitch"
                label="I want to select from list"
                style="font-weight: 500; color: #009688"
              ></v-switch>
            </v-col>
          </v-row>

          <v-row v-show="!testListSwitch">
            <v-col cols="12">
              <CreateTestForm
                ref="createForm"
                v-model:goToPreviewStep="test_step"
                v-model:updateTestList="lastCreatedTest"
              />
            </v-col>
          </v-row>

          <v-row v-show="testListSwitch">
            <v-col cols="12" md="4">
              <v-autocomplete
                v-model="filter.section"
                :items="filter_level_list"
                item-title="title"
                item-value="id"
                clearable
                label="Board"
                variant="outlined"
                density="compact"
                color="orange"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="4">
              <v-autocomplete
                v-model="filter.base"
                :items="filter_grade_list"
                item-title="title"
                item-value="id"
                clearable
                label="Grade"
                variant="outlined"
                density="compact"
                color="orange"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="4">
              <v-autocomplete
                v-model="filter.lesson"
                :items="filter_lesson_list"
                item-title="title"
                item-value="id"
                clearable
                label="Subject"
                variant="outlined"
                density="compact"
                color="orange"
              ></v-autocomplete>
            </v-col>

            <v-col cols="12" md="4">
              <v-autocomplete
                v-model="filter.topic"
                :items="topic_list"
                item-title="title"
                item-value="id"
                clearable
                label="Topic"
                variant="outlined"
                density="compact"
                color="orange"
              >
                <template #item="{ item, props }">
                  <v-list-item
                    v-bind="props"
                    :title="item.raw.title"
                    :class="{ topic_season: item.raw.season }"
                  ></v-list-item>
                </template>
              </v-autocomplete>
            </v-col>

            <v-col cols="12" md="4">
              <v-autocomplete
                v-model="filter.testsHasVideo"
                :items="video_analysis_options"
                item-title="title"
                item-value="value"
                clearable
                label="Video analysis"
                variant="outlined"
                density="compact"
                color="orange"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="4">
              <v-checkbox
                v-model="filter.myTests"
                label="My own tests"
                density="compact"
                color="orange"
              ></v-checkbox>
            </v-col>

            <v-col cols="12">
              <v-card
                class="test-list"
                flat
                max-height="600"
                ref="testList"
                @scroll="onScroll"
              >
                <v-card-text>
                  <v-row ref="testListContent">
                    <v-col
                      v-for="item in test_list"
                      :key="item.id"
                      cols="12"
                      v-show="test_list.length > 0"
                    >
                      <v-row class="mb-2">
                        <v-col cols="12">
                          <v-chip v-if="item.lesson_title" size="small">
                            {{ item.lesson_title }}
                          </v-chip>
                          <v-chip
                            v-if="item.topics_title"
                            size="small"
                            class="ml-2"
                          >
                            {{ item.topics_title }}
                          </v-chip>
                          <v-chip
                            v-if="item.level === '1'"
                            variant="outlined"
                            color="success"
                            size="small"
                            class="ml-2"
                          >
                            Simple
                          </v-chip>
                          <v-chip
                            v-if="item.level === '2'"
                            variant="outlined"
                            color="primary"
                            size="small"
                            class="ml-2"
                          >
                            Middle
                          </v-chip>
                          <v-chip
                            v-if="item.level === '3'"
                            variant="outlined"
                            color="error"
                            size="small"
                            class="ml-2"
                          >
                            Hard
                          </v-chip>
                        </v-col>
                      </v-row>
                      <div
                        id="test-question"
                        ref="mathJaxEl"
                        v-html="item.question"
                      ></div>
                      <img :src="item.q_file" v-if="item.q_file" />

                      <div
                        v-if="
                          item.type == 'blank' ||
                          item.type == 'shortanswer' ||
                          item.type == 'descriptive'
                        "
                      >
                        <div ref="mathJaxEl" v-html="item.answer_full"></div>
                        <img
                          v-if="item.answer_full_file"
                          :src="item.answer_full_file"
                        />
                      </div>
                      <div v-else>
                        <div class="answer">
                          <v-icon
                            v-if="item.true_answer == '1'"
                            class="true_answer"
                            size="large"
                          >
                            mdi-check
                          </v-icon>
                          <span>1)</span>
                          <span
                            ref="mathJaxEl"
                            v-if="item.answer_a"
                            v-html="item.answer_a"
                          ></span>
                          <img v-if="item.a_file" :src="item.a_file" />
                        </div>
                        <div class="answer">
                          <v-icon
                            v-if="item.true_answer == '2'"
                            class="true_answer"
                            size="large"
                          >
                            mdi-check
                          </v-icon>
                          <span>2)</span>
                          <span
                            ref="mathJaxEl"
                            v-if="item.answer_b"
                            v-html="item.answer_b"
                          ></span>
                          <img v-if="item.b_file" :src="item.b_file" />
                        </div>
                        <div class="answer">
                          <v-icon
                            v-if="item.true_answer == '3'"
                            class="true_answer"
                            size="large"
                          >
                            mdi-check
                          </v-icon>
                          <span>3)</span>
                          <span
                            ref="mathJaxEl"
                            v-if="item.answer_c"
                            v-html="item.answer_c"
                          ></span>
                          <img v-if="item.c_file" :src="item.c_file" />
                        </div>
                        <div class="answer">
                          <v-icon
                            v-if="item.true_answer == '4'"
                            class="true_answer"
                            size="large"
                          >
                            mdi-check
                          </v-icon>
                          <span>4)</span>
                          <span
                            ref="mathJaxEl"
                            v-if="item.answer_d"
                            v-html="item.answer_d"
                          ></span>
                          <img v-if="item.d_file" :src="item.d_file" />
                        </div>
                      </div>
                      <v-row>
                        <v-col cols="6">
                          <v-btn
                            icon
                            variant="text"
                            :to="`/test-maker/create-test/edit/${item.id}`"
                            v-if="item.owner == true"
                          >
                            <v-icon>mdi-pencil</v-icon>
                          </v-btn>
                          <v-btn
                            icon
                            variant="text"
                            v-if="item.owner == true"
                            @click="openTestDeleteConfirmDialog(item.id)"
                          >
                            <v-icon color="error">mdi-delete</v-icon>
                          </v-btn>
                          <v-btn icon variant="text">
                            <v-icon color="blue">mdi-bullhorn-outline</v-icon>
                          </v-btn>
                          <v-btn icon variant="text">
                            <v-icon color="green">mdi-eye</v-icon>
                          </v-btn>
                          <v-btn icon variant="text">
                            <v-icon color="red">mdi-video</v-icon>
                          </v-btn>
                        </v-col>
                        <v-col cols="6" class="text-right">
                          <v-btn
                            color="blue"
                            variant="flat"
                            size="small"
                            v-if="!tests.find((x) => x == item.id)"
                            @click="applyTest(item, 'add')"
                          >
                            <v-icon size="small">mdi-plus</v-icon>
                            Add
                          </v-btn>
                          <v-btn
                            color="red"
                            variant="flat"
                            size="small"
                            v-if="tests.find((x) => x == item.id)"
                            @click="applyTest(item, 'remove')"
                          >
                            <v-icon size="small">mdi-minus</v-icon>
                            Delete
                          </v-btn>
                        </v-col>
                      </v-row>
                      <v-divider class="mt-3" />
                    </v-col>

                    <v-col
                      v-if="!all_tests_loaded"
                      cols="12"
                      class="text-center"
                    >
                      <v-progress-circular
                        :size="40"
                        :width="4"
                        class="mt-12 mb-12"
                        color="orange"
                        indeterminate
                      />
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Publish button -->
            <v-col cols="12">
              <v-row>
                <v-col cols="12" md="6" class="pb-0">
                  <v-btn
                    @click="tests.length >= 5 ? test_step = 3 : null"
                    :disabled="tests.length < 5"
                    :loading="test_loading"
                    block
                    color="teal"
                    class="text-white"
                    size="large"
                    style="text-transform: none; font-size: 13px; font-weight: 500;"
                  >
                    <span v-if="tests.length < 5">Add at least {{ 5 - tests.length }} more tests</span>
                    <span v-else>Next step</span>
                  </v-btn>
                </v-col>
                <v-col cols="12" md="6">
                  <v-btn
                    block
                    variant="outlined"
                    color="red"
                    size="large"
                    to="/user/exam"
                    style="text-transform: none; font-size: 13px; font-weight: 500;"
                  >
                    Discard
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </template>

      <template #[`item.3`]>
        <v-card flat class="mt-3 pb-10">
          <v-row>
            <v-col cols="12" class="ma-2">
              <h3 class="text-h5 font-weight-bold mb-2 text-grey-darken-2">
                {{ form.title }}
              </h3>
              <v-row
                class="gama-text-caption font-noraml text-grey-darken-2 mt-4"
                style="font-size: 16px"
              >
                <v-col cols="4">Question's num: {{ tests.length }}</v-col>
                <v-col cols="4">Duration: {{ form.duration }}</v-col>
                <v-col cols="4">Level: {{ calcLevel(form.level) }}</v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-chip
                    rounded="sm"
                    size="large"
                    density="compact"
                    variant="text"
                    style="
                      font-size: 13px;
                      font-weight: 500;
                      background-color: #b30a29;
                      color: white;
                      opacity: 1;
                    "
                    >Topics:</v-chip
                  >
                </v-col>
                <v-col
                  v-for="(item, index) in topicTitleArr"
                  :key="index"
                  cols="4"
                >
                  {{ item }}
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="12">
              <v-row>
                <v-col cols="12" md="6" class="pb-0">
                  <v-btn
                    @click="publishTest"
                    :disabled="tests.length < 5"
                    :loading="publish_loading"
                    size="large"
                    color="teal"
                    class="text-white"
                    block 
                    style="
                      text-transform: none;
                      font-size: 13px;
                      font-weight: 500;
                    "
                    density="compact"
                  >
                    <span v-show="tests.length < 5">Add at least {{ 5 - tests.length }} more tests</span>
                    <span v-show="tests.length >= 5">Publish</span>
                  </v-btn>
                </v-col>
                <v-col cols="12" md="6" class="pb-0">
                  <v-btn
                    block
                    variant="outlined"
                    color="red"
                    size="large"
                    to="/user/exam"
                    density="compact"
                    style="
                      text-transform: none;
                      font-size: 13px;
                      font-weight: 500;
                    "
                  >
                    Discard
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </template>

      <template #[`item.4`]>
        <v-card flat class="mt-3 pb-10">
          <v-card-text class="text-center">
            <p class="text-h5 mb-4">Your test is ready to use!</p>
            <p>Send below link to your students or friends.</p>

            <div class="d-flex justify-center my-4">
              <v-text-field
                v-model="test_share_link"
                variant="outlined"
                density="compact"
                readonly
                style="max-width: 400px"
                class="mx-auto"
              >
                <template #append>
                  <v-btn icon variant="text" @click="copyUrl">
                    <v-icon>mdi-content-copy</v-icon>
                  </v-btn>
                </template>
              </v-text-field>
            </div>

            <p class="mt-3">
              To view the results of the participants, go to the following path:
            </p>

            <v-breadcrumbs
              :items="[
                { title: 'Dashboard', href: '/user' },
                { title: 'My online exam', href: '/exam/results' },
              ]"
              class="justify-center"
            >
              <template #divider>
                <v-icon>mdi-chevron-right</v-icon>
              </template>
            </v-breadcrumbs>
          </v-card-text>
        </v-card>
      </template>
    </v-stepper-vertical>

    <v-dialog v-model="confirmDeleteDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h5">
          Are you sure of deleting the online exam?
        </v-card-title>
        <v-card-text>
          If you are sure about the deletion, click Agree button.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green-darken-1"
            variant="text"
            @click="confirmDeleteDialog = false"
          >
            Disagree
          </v-btn>
          <v-btn
            color="green-darken-1"
            variant="text"
            :loading="deleteLoading"
            @click="deleteOnlineExam"
          >
            Agree
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteTestConfirmDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h5">Are you sure?</v-card-title>
        <v-card-text>
          <p>If you are sure to delete, click Yes.</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="deleteTestConfirmDialog = false"
            >No</v-btn
          >
          <v-btn
            color="green-darken-1"
            variant="text"
            :loading="delete_exam_test_loading"
            @click="deleteExamTest()"
          >
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="printPreviewDialog"
      fullscreen
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar color="teal" dark>
          <v-btn icon @click="printPreviewDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Preview</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn text @click="printPreviewDialog = false"> Close </v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <v-card-text>
          <!-- Print preview content -->
          <v-row>
            <v-col cols="12">
              <p class="text-h4 font-weight-bold">{{ form.title }}</p>
            </v-col>
            <v-col cols="4">Question's num: {{ tests.length }}</v-col>
            <v-col cols="4">Duration: {{ form.duration }}</v-col>
            <v-col cols="4">Level: {{ calcLevel(form.level) }}</v-col>
            <v-col cols="12">
              <v-chip color="error" size="small">Topics:</v-chip>
            </v-col>
            <v-col cols="4" v-for="(item, index) in topicTitleArr" :key="index">
              {{ item }}
            </v-col>
            <v-col cols="12">
              <v-divider />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" v-if="previewTestList.length">
              <div v-for="(item, index) in previewTestList" :key="index">
                <v-row>
                  <v-col cols="12">
                    <div
                      id="test-question"
                      ref="mathJaxEl"
                      v-html="item.question"
                    ></div>
                    <img :src="item.q_file" v-if="item.q_file" />

                    <div
                      v-if="
                        item.type == 'blank' ||
                        item.type == 'shortanswer' ||
                        item.type == 'descriptive'
                      "
                    >
                      <div ref="mathJaxEl" v-html="item.answer_full"></div>
                      <img
                        v-if="item.answer_full_file"
                        :src="item.answer_full_file"
                      />
                    </div>
                    <div v-else>
                      <div class="answer">
                        <span>1)</span>
                        <span
                          ref="mathJaxEl"
                          v-if="item.answer_a"
                          v-html="item.answer_a"
                        ></span>
                        <img v-if="item.a_file" :src="item.a_file" />
                      </div>
                      <div class="answer">
                        <span>2)</span>
                        <span
                          ref="mathJaxEl"
                          v-if="item.answer_b"
                          v-html="item.answer_b"
                        ></span>
                        <img v-if="item.b_file" :src="item.b_file" />
                      </div>
                      <div class="answer">
                        <span>3)</span>
                        <span
                          ref="mathJaxEl"
                          v-if="item.answer_c"
                          v-html="item.answer_c"
                        ></span>
                        <img v-if="item.c_file" :src="item.c_file" />
                      </div>
                      <div class="answer">
                        <span>4)</span>
                        <span
                          ref="mathJaxEl"
                          v-if="item.answer_d"
                          v-html="item.answer_d"
                        ></span>
                        <img v-if="item.d_file" :src="item.d_file" />
                      </div>
                    </div>
                    <v-divider class="mt-3" />
                  </v-col>
                </v-row>
              </div>
            </v-col>
            <v-col v-else cols="12" class="text-center">
              <p>Oops! no data found</p>
            </v-col>
            
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, reactive, watch, nextTick, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuth } from "~/composables/useAuth";
import { defineRule } from "vee-validate";
import { required } from "@vee-validate/rules";
import draggable from "vuedraggable";
import FormTopicSelector from "~/components/form/topic-selector.vue";
import CreateTestForm from "~/components/test-maker/create-test-form.vue";

// Define validation rules
defineRule("required", required);

// Define layout and page metadata
definePageMeta({
  layout: "test-maker-layout",
});

useHead({
  title: "New Exam",
});

// Get services
const auth = useAuth();
const route = useRoute();
const router = useRouter();
const userToken = ref("");

// Core data
const test_step = ref(1); // Start at first step
const exam_id = ref("");
const exam_code = ref("");
const submit_loading = ref(false);
const publish_loading = ref(false);
const test_loading = ref(false);
const all_tests_loaded = ref(false);
const tests = ref([]);
const timer = ref(null);
const observer = ref(null);
const topicSelector = ref(null);
const createForm = ref(null);
const mathJaxEl = ref(null);
const testList = ref(null);
const testListContent = ref(null);
const isFormValid = ref(false);

// Form data
const form = reactive({
  section: route.query.board ? route.query.board : "",
  base: route.query.grade ? route.query.grade : "",
  lesson: route.query.subject ? route.query.subject : "",
  topics: [],
  exam_type: "",
  level: "2",
  holding_time: false,
  state: "",
  area: "",
  school: "",
  duration: 3,
  title: "",
  paperID: route.query.paperId ? route.query.paperId : "",
  negative_point: false,
  file_original: "",
  holding_level: 4,
  edu_year: "",
  edu_month: "",
});

// Form errors for validation
const formErrors = reactive({
  section: "",
  base: "",
  lesson: "",
  topic: "",
  test_type: "",
  test_duration: "",
  title: "",
});

const file_original = ref(null);
const file_original_path = ref("");

// Filter data
const filter = reactive({
  section: "",
  base: "",
  lesson: "",
  topic: "",
  page: 1,
  perpage: 40,
  testsHasVideo: "All",
  myTests: false,
});

// UI State
const printPreviewDialog = ref(false);
const confirmDeleteDialog = ref(false);
const deleteLoading = ref(false);
const previewTestList = ref([]);
const topicTitleArr = ref([]);
const testListSwitch = ref(false);
const lastCreatedTest = ref("");

// Delete exam test section
const deleteTestConfirmDialog = ref(false);
const delete_exam_test_id = ref(null);
const delete_exam_test_loading = ref(false);

// Data lists
const level_list = ref([]);
const filter_level_list = ref([]);
const grade_list = ref([]);
const filter_grade_list = ref([]);
const field_list = ref([]);
const lesson_list = ref([]);
const filter_lesson_list = ref([]);
const topic_list = ref([]);
const test_type_list = ref([]);
const test_list = ref([]);
const selected_topics = ref([]);

// Static data
const year_list = ref([
  2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013,
]);

const month_list = ref([
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
]);

const test_level_list = [
  { id: "1", title: "Simple" },
  { id: "2", title: "Medium" },
  { id: "3", title: "Hard" },
];

const video_analysis_options = [
  { value: 0, title: "All" },
  { value: 1, title: "Have" },
  { value: -1, title: "Do not have" },
];

const state_list = ref([]);
const area_list = ref([]);
const school_list = ref([]);

const holding_level_list = [
  { id: 1, title: "School" },
  { id: 2, title: "District" },
  { id: 3, title: "State" },
  { id: 4, title: "Country" },
];

// Compute the test share link based on the route params
const test_share_link = computed(() => {
  if (process.server) {
    // Return a consistent value during SSR to avoid hydration mismatch
    return `/exam/${exam_id.value || ""}`;
  }
  // Only use window.location on client side
  return `${window.location.origin}/exam/${exam_id.value || ""}`;
});

// Generate title function
const generateTitle = () => {
  let lesson_title = "";
  if (form.lesson && lesson_list.value.length > 0) {
    const lessonItem = lesson_list.value.find((x) => x.id === form.lesson);
    lesson_title = lessonItem?.title || "";
  }

  let base_title = "";
  if (form.base && grade_list.value.length > 0) {
    const baseItem = grade_list.value.find((x) => x.id === form.base);
    base_title = baseItem?.title || "";
  }

  form.title = `${lesson_title} Test ${base_title} Grade`;
};

// Return title of level for show in preview list
const calcLevel = (level) => {
  if (level) {
    const levelItem = test_level_list.find((x) => x.id === level);
    return levelItem ? levelItem.title : "";
  }
  return "";
};

// API methods
const getTypeList = async (type, parent = "", trigger = "") => {
  try {
    const params = {
      type: type,
    };

    if (type === "base") params.section_id = parent;
    if (type === "lesson") params.base_id = parent;
    if (type === "topic") params.lesson_id = parent;
    if (type === "area") params.state_id = parent;

    if (type === "school") {
      params.section_id = form.section;
      params.area_id = form.area;
    }

    const res = await $fetch("/api/v1/types/list", {
      method: "GET",
      params: params,
      headers: {
        Authorization: `Bearer ${userToken.value}`,
      },
    });

    if (res && res.data) {
      if (type === "section") {
        if (trigger === "filter") {
          filter_level_list.value = res.data;
        } else {
          level_list.value = res.data;
          filter_level_list.value = res.data;
        }
      } else if (type === "base") {
        if (trigger === "filter") {
          filter_grade_list.value = res.data;
        } else {
          grade_list.value = res.data;
          filter_grade_list.value = res.data;
        }
      } else if (type === "lesson") {
        if (trigger === "filter") {
          filter_lesson_list.value = res.data;
        } else {
          lesson_list.value = res.data;
          filter_lesson_list.value = res.data;
        }
      } else if (type === "topic") {
        topic_list.value = res.data;
      } else if (type === "exam_type") {
        test_type_list.value = res.data;
      } else if (type === "state") {
        state_list.value = res.data;
      } else if (type === "area") {
        area_list.value = res.data;
      } else if (type === "school") {
        school_list.value = res.data;
      }

      generateTitle();
    }
  } catch (err) {
    const { $toast } = useNuxtApp();
    if ($toast) $toast.error(err.message || "Error loading data");
    console.error(err);
  }
};

const selectTopic = (event) => {
  selected_topics.value = event;
  const numbers = [];
  for (let i = 0; i < event.length; i++) {
    numbers[i] = parseInt(event[i]);
  }
  form.topics = numbers;
  if (form.topics.length) getTopicTitleList();
};

const getTopicTitleList = () => {
  topicTitleArr.value = [];
  let title = "";
  for (const index in form.topics) {
    const topicItem = topic_list.value.find((x) => x.id == form.topics[index]);
    title = topicItem?.title || "";
    topicTitleArr.value.push(title);
  }
};

const submitQuestion = async () => {
  submit_loading.value = true;

  // Validate form fields
  if (!validateHeaderForm()) {
    submit_loading.value = false;
    return;
  }

  // Arrange to form data
  let formData = new FormData();
  for (let key in form) {
    if (key !== "topics") formData.append(key, form[key]);
  }

  if (form.topics.length) {
    for (let key in form.topics) {
      formData.append("topics[]", form.topics[key]);
    }
  }

  try {
    const response = await $fetch("/api/v1/exams", {
      method: "POST",
      body: urlencodeFormData(formData),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${userToken.value}`,
      },
    });

    const { $toast } = useNuxtApp();
    if ($toast) $toast.success("Exam created successfully");

    exam_id.value = response.data.id;
    exam_code.value = response.data.code;

    // Set in store
    const userState = useState("user");
    userState.value = {
      ...userState.value,
      currentExamId: exam_id.value,
      currentExamCode: exam_code.value,
    };

    // Update create form component with new exam info
    if (createForm.value) {
      createForm.value.getCurrentExamInfo();
    }
    
    // Advance to step 2 for adding tests
    test_step.value = 2;
  } catch (error) {
    const { $toast } = useNuxtApp();
    if ($toast)
      $toast.error(error.response?.data?.message || "Error creating exam");
  } finally {
    submit_loading.value = false;
  }
};

// Convert form data from multipart to urlencode
const urlencodeFormData = (fd) => {
  let s = "";

  for (const pair of fd.entries()) {
    if (typeof pair[1] == "string") {
      s += (s ? "&" : "") + encode(pair[0]) + "=" + encode(pair[1]);
    }
  }
  return s;
};

const encode = (s) => {
  return encodeURIComponent(s).replace(/%20/g, "+");
};

const copyUrl = () => {
  navigator.clipboard.writeText(test_share_link.value);
  const { $toast } = useNuxtApp();
  if ($toast) $toast.success("Copied");
};

const uploadFile = async (files) => {
  // For v-file-input in Vue 3, files can be an array or single file object
  // Get the actual file from either an array or direct file object
  const fileToUpload = Array.isArray(files) ? files[0] : files;

  if (!fileToUpload) {
    console.error("No file found to upload");
    return;
  }

  const { $toast } = useNuxtApp();

  // Create a FormData object for the file upload
  const formData = new FormData();
  formData.append("file", fileToUpload);

  try {
    // Using async/await with proper error handling
    const response = await $fetch("/api/v1/upload", {
      method: "POST",
      body: formData,
    });

    // Check if we have a valid response with file data
    if (response?.data?.[0]?.file?.name) {
      form.file_original = response.data[0].file.name;
      if ($toast) $toast.success("File uploaded successfully");
    } else {
      if ($toast) $toast.error("Invalid response from server");
      console.error("Invalid upload response:", response);
    }
  } catch (err) {
    if ($toast) $toast.error("Failed to upload file");
    console.error("File upload error:", err);
  }
};

const publishTest = async () => {
  publish_loading.value = true;

  try {
    const response = await $fetch(`/api/v1/exams/publish/${exam_id.value}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${userToken.value}`
      }
    });

    if (response.data.message === "done") {
      // Only use window.location on client side
      test_share_link.value = `${
        process.client ? window.location.origin : ""
      }/exam/${exam_id.value}`;

      // Reset values
      exam_id.value = "";
      exam_code.value = "";

      // Reset state in user state
      const userState = useState("user");
      userState.value = {
        ...userState.value,
        currentExamId: "",
        currentExamCode: "",
      };

      // Reset component data
      previewTestList.value = [];
      tests.value = [];

      // Reset form
      form.section = "";
      grade_list.value = [];
      lesson_list.value = [];
      topic_list.value = [];

      form.exam_type = "";
      form.duration = 3;
      form.title = "";
      form.file_original = "";

      // Advance to the publish completed step
      test_step.value = 4;

      const { $toast } = useNuxtApp();
      if ($toast) $toast.success("Exam published successfully");
    }
  } catch (err) {
    const { $toast } = useNuxtApp();
    if ($toast) $toast.error(err.message || "Error publishing exam");
    console.error("Error publishing exam:", err);
  } finally {
    publish_loading.value = false;
  }
};

// Helper functions for URL query handling
const checkActiveParam = () => {
  if (route.query.active) {
    if (route.query.active === "test_list") {
      testListSwitch.value = true;
      test_step.value = 2;
    } else if (route.query.active === "add_test") {
      testListSwitch.value = false;
      test_step.value = 2;
    }
  } else {
    // Reset to first step when no query parameters
    test_step.value = 1;
  }
};

// Submit tests to the exam
const submitTest = async () => {
  if (tests.value.length === 0) return;

  // Create FormData to send the list of test IDs
  const formData = new FormData();
  for (let i = 0; i < tests.value.length; i++) {
    formData.append("tests[]", tests.value[i]);
  }

  try {
    await $fetch(`/api/v1/exams/tests/${exam_id.value}`, {
      method: "PUT",
      body: urlencodeFormData(formData),
      headers: {
        Authorization: `Bearer ${userToken.value}`,
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
    });

    // Get current exam tests after submission to update the preview
    await getExamCurrentTests();
    
    // Update the test count in create-test-form component if it exists
    if (createForm.value) {
      createForm.value.examTestListLength = tests.value.length;
    }

    const { $toast } = useNuxtApp();
    if ($toast) $toast.success("Tests added to exam successfully");
  } catch (err) {
    console.error("Error submitting tests:", err);
    const { $toast } = useNuxtApp();
    if ($toast) $toast.error(err.message || "Error updating exam tests");
  }
};

// Get current tests for the exam
const getExamCurrentTests = async () => {
  try {
    const response = await $fetch("/api/v1/examTests", {
      method: "GET",
      params: {
        exam_id: exam_id.value,
      },
      headers: {
        Authorization: `Bearer ${userToken.value}`
      }
    });

    if (response && response.data && response.data.list) {
      previewTestList.value = response.data.list;
    }

    // Update the test count in create-test-form component if it exists
    if (createForm.value) {
      createForm.value.examTestListLength = tests.value.length;
    }
  } catch (err) {
    console.error("Error getting exam tests:", err);
    const { $toast } = useNuxtApp();
    if ($toast) $toast.error("Failed to load exam tests");
  }
};

// Get current exam information
const getCurrentExamInfo = async () => {
  // Get current exam ID from useState
  const userState = useState("user");
  const currentExamId = userState.value?.currentExamId;

  if (currentExamId) {
    exam_id.value = currentExamId;
    exam_code.value = userState.value?.currentExamCode || "";
    test_step.value = 2;

    try {
      const response = await $fetch(`/api/v1/exams/info/${exam_id.value}`, {
        headers: {
          Authorization: `Bearer ${userToken.value}`
        }
      });

      tests.value = response.data.tests.length ? response.data.tests : [];

      form.section = response.data.section;
      form.base = response.data.base;
      form.lesson = response.data.lesson;
      file_original_path.value = response.data.file_original;

      // If we have test data, get the tests
      if (tests.value.length) {
        getExamCurrentTests();
      }
    } catch (err) {
      console.error("Error getting exam info:", err);
      const { $toast } = useNuxtApp();
      if ($toast) $toast.error("Failed to load exam information");
    }
  }
};

// Handle scrolling for test list
const onScroll = () => {
  if (!testList.value || test_loading.value || all_tests_loaded.value) return;

  const scrollElement = testList.value.$el;
  const scrollPosition = scrollElement.scrollTop;
  const scrollHeight = scrollElement.scrollHeight;
  const clientHeight = scrollElement.clientHeight;

  // Check if we're near the bottom of the scroll container
  // Only trigger when we're within 200px of the bottom
  const isNearBottom = scrollPosition + clientHeight >= scrollHeight - 200;

  // Avoid multiple requests with debounce
  if (timer.value) {
    clearTimeout(timer.value);
    timer.value = null;
  }

  if (isNearBottom) {
    timer.value = setTimeout(() => {
      test_loading.value = true;
      filter.page++;
      getExamTests();
    }, 800);
  }
};

// Apply test to the exam (add or remove)
const applyTest = async (item, type) => {
  if (type === 'remove' && tests.value.find((x) => x == item.id)) {
    // Remove the test
    tests.value.splice(tests.value.indexOf(item.id), 1);
    
    // Notify user of removal
    const { $toast } = useNuxtApp();
    if ($toast) $toast.info("Test removed from exam");
    
    // Update in the backend
    await submitTest();
  } else if (type === 'add' && !tests.value.find((x) => x == item.id)) {
    // Add the test
    tests.value.push(item.id);
    
    // Notify user of addition
    const { $toast } = useNuxtApp();
    if ($toast) $toast.success("Test added to exam");
    
    // Update in the backend
    await submitTest();
  }
};

// Watchers
watch(
  () => lastCreatedTest.value,
  async (val) => {
    if (val && !tests.value.find((x) => x == val)) {
      // Add the newly created test to the tests array
      tests.value.push(val);
      
      // Reset the lastCreatedTest value
      setTimeout(() => {
        lastCreatedTest.value = "";
      }, 100);
      
      // Update in the backend
      await submitTest();
      
      // Notify user
      const { $toast } = useNuxtApp();
      if ($toast) $toast.success("New test added to exam");
    }
  }
);

watch(
  () => form.section,
  async (val) => {
    if (val) {
      await getTypeList("base", val);
      filter.section = val; // Init second level filter

      if (createForm.value) {
        createForm.value.form.section = val;
      }

      if (form.area) {
        await getTypeList("school");
      }
    }
  }
);

watch(
  () => form.base,
  async (val) => {
    if (val) {
      await getTypeList("lesson", val);
      filter.base = val; // Init second level filter

      if (createForm.value) {
        createForm.value.form.base = val;
      }

      generateTitle();
    }
  }
);

watch(
  () => form.lesson,
  async (val) => {
    if (val) {
      await getTypeList("topic", val);

      if (topicSelector.value) {
        topicSelector.value.lesson_selected = true;
      }
    } else {
      form.topic = [];
      topic_list.value = [];

      if (topicSelector.value) {
        topicSelector.value.lesson_selected = false;
      }
    }

    filter.lesson = val; // Init second level filter

    if (createForm.value) {
      createForm.value.form.lesson = val;
    }

    generateTitle();
  }
);

watch(
  () => filter.section,
  async (val) => {
    if (val) {
      test_loading.value = true;
      await getTypeList("base", val, "filter");
      test_loading.value = false;
    }

    all_tests_loaded.value = true;
    filter_grade_list.value = [];
    filter_lesson_list.value = [];
    filter.page = 1;
    test_list.value = [];
    filter.base = "";
    filter.lesson = "";
  }
);

watch(
  () => filter.base,
  async (val) => {
    if (val) {
      test_loading.value = true;
      await getTypeList("lesson", val, "filter");
      test_loading.value = false;
    }

    all_tests_loaded.value = true;
    filter_lesson_list.value = [];
    filter.lesson = "";
    filter.page = 1;
    test_list.value = [];
  }
);

watch(
  () => filter.lesson,
  async (val) => {
    if (val) {
      test_loading.value = true;
      await getTypeList("topic", val, "filter");
      test_loading.value = false;
    }

    // Reset pagination and test list before loading new data
    filter.page = 1;
    test_list.value = [];
    all_tests_loaded.value = false;

    if (val) {
      // Only fetch if we have a lesson selected
      getExamTests();
    }
  }
);

watch(
  () => filter.topic,
  () => {
    // Reset pagination and test list before loading new data
    filter.page = 1;
    test_list.value = [];
    all_tests_loaded.value = false;
    getExamTests();
  }
);

watch(
  () => filter.testsHasVideo,
  () => {
    // Reset pagination and test list before loading new data
    filter.page = 1;
    test_list.value = [];
    all_tests_loaded.value = false;
    getExamTests();
  }
);

watch(
  () => filter.myTests,
  () => {
    // Reset pagination and test list before loading new data
    filter.page = 1;
    test_list.value = [];
    all_tests_loaded.value = false;
    getExamTests();
  }
);

watch(
  () => form.state,
  (val) => {
    if (val) {
      getTypeList("area", val);
    }
  }
);

watch(
  () => form.area,
  (val) => {
    if (val && form.section) {
      getTypeList("school");
    }
  }
);

// Watch for changes in route query parameter
watch(
  () => route.query,
  () => {
    checkActiveParam();
  },
  { deep: true }
);

// Initialize on mount
onMounted(async () => {
  userToken.value = auth.getUserToken();

  await getCurrentExamInfo();
  await getExamTests();
  await getTypeList("section");

  if (form.base) {
    await getTypeList("base", form.section);
  }

  if (form.lesson) {
    await getTypeList("lesson", form.base);
    await getTypeList("topic", form.lesson);
  }

  await getTypeList("exam_type");
  await getTypeList("state");

  // Check active query parameter
  checkActiveParam();
});

// Open delete confirmation dialog
const openTestDeleteConfirmDialog = (item_id) => {
  delete_exam_test_id.value = item_id;
  deleteTestConfirmDialog.value = true;
};

// Delete exam test
const deleteExamTest = async () => {
  delete_exam_test_loading.value = true;

  try {
    await $fetch(`/api/v1/examTests/${delete_exam_test_id.value}`, {
      method: "DELETE",
    });

    const { $toast } = useNuxtApp();
    if ($toast) $toast.success("Deleted successfully");

    // Remove from tests array
    const index = tests.value.findIndex(
      (id) => id === delete_exam_test_id.value
    );
    if (index !== -1) {
      tests.value.splice(index, 1);
    }

    // Refresh test lists
    filter.page = 1;
    test_list.value = [];
    getExamTests();
  } catch (err) {
    const { $toast } = useNuxtApp();
    if ($toast) $toast.error(err.message || "Error deleting test");
    console.error("Error deleting exam test:", err);
  } finally {
    delete_exam_test_loading.value = false;
    delete_exam_test_id.value = null;
    deleteTestConfirmDialog.value = false;
  }
};

// Get exam tests
const getExamTests = async () => {
  if (all_tests_loaded.value || test_loading.value) return;

  test_loading.value = true;

  try {
    const response = await $fetch("/api/v1/examTests", {
      method: "GET",
      params: {
        lesson: filter.lesson,
        topic: filter.topic,
        myTests: filter.myTests,
        testsHasVideo: filter.testsHasVideo,
        page: filter.page,
        perpage: filter.perpage,
      },
    });

    const newTests = response?.data?.list || [];

    // Check if we received any tests
    if (newTests.length === 0) {
      // No more tests, mark as loaded
      all_tests_loaded.value = true;
    } else {
      // Add new tests to the list
      test_list.value.push(...newTests);

      // If we received fewer tests than requested per page,
      // we've likely reached the end
      if (newTests.length < filter.perpage) {
        all_tests_loaded.value = true;
      }
    }

    if (createForm.value) {
      createForm.value.examTestListLength = tests.value.length;
    }
  } catch (err) {
    console.error("Error getting exam tests:", err);
    all_tests_loaded.value = true; // Prevent further requests on error
  } finally {
    test_loading.value = false;
  }
};

// Delete entire exam handling
const openDeleteConfirmDialog = () => {
  confirmDeleteDialog.value = true;
};

const deleteOnlineExam = async () => {
  deleteLoading.value = true;

  try {
    await $fetch(`/api/v1/exams/${exam_id.value}`, {
      method: "DELETE",
    });

    // Reset all values
    exam_id.value = "";
    exam_code.value = "";

    // Update store
    useState("user").value = {
      ...useState("user").value,
      currentExamId: "",
      currentExamCode: "",
    };

    // Reset form and data
    previewTestList.value = [];
    tests.value = [];

    form.section = "";
    grade_list.value = [];
    lesson_list.value = [];
    topic_list.value = [];

    form.exam_type = "";
    form.duration = 3;
    form.title = "";
    form.file_original = "";

    // Reset to first step
    test_step.value = 1;

    const { $toast } = useNuxtApp();
    if ($toast) $toast.success("Deleted successfully");
  } catch (err) {
    const { $toast } = useNuxtApp();
    if ($toast) $toast.error(err.message || "Error deleting exam");
    console.error("Error deleting exam:", err);
  } finally {
    deleteLoading.value = false;
    confirmDeleteDialog.value = false;
  }
};

// Form validation helper
const validateHeaderForm = () => {
  // Check required fields
  const requiredFields = {
    section: "Board",
    base: "Grade",
    lesson: "Subject",
    title: "Title"
  };
  
  // Check each required field
  for (const [field, label] of Object.entries(requiredFields)) {
    if (!form[field]) {
      const { $toast } = useNuxtApp();
      if ($toast) $toast.error(`${label} is required`);
      return false;
    }
  }
  
  // Check topics
  if (!form.topics.length) {
    const { $toast } = useNuxtApp();
    if ($toast) $toast.error("Please select at least one topic");
    return false;
  }
  
  return true;
};
</script>

<style lang="scss">
.create-test-container {
  max-width: 1200px;
  margin: 5rem auto;
  padding-bottom: 80px; // Space for fixed bottom bar
}

.topics-container {
  border-radius: 4px;
  padding: 16px;
}

// Stepper styling
.v-stepper {
  box-shadow: none !important;
  background-color: #f9f9f9;
  display: contents;

  &__step {
    &--active {
      color: teal !important;
    }

    &--complete {
      color: teal !important;
    }
  }
}

.v-stepper-vertical-item__title {
  font-size: 1.5rem;
  font-weight: 500;
}

// Topic styling
.topic_season {
  font-weight: bold !important;
  color: blue !important;
}

// Answer styling
.answer {
  display: flex;
  align-items: flex-start;
  margin-bottom: 8px;

  .true_answer {
    color: green;
    margin-right: 8px;
  }

  span {
    margin-right: 8px;
  }

  img {
    max-width: 100%;
    margin-top: 4px;
  }
}

// Test list styling
.test-list {
  max-height: 600px;
  overflow-y: auto;

  #test-question {
    margin-bottom: 16px;
  }
}
</style>
