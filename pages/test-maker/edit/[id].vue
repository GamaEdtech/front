<template>
  <v-container class="create-test-container">
    <v-row class="mt-4">
      <v-col cols="6">
        <span class="icon icong-azmoon text-h3 text-teal"></span>
        <span class="text-h4 text-teal"> Update online exam </span>
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
            @submit.prevent="updateQuestion"
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

              <v-col cols="12" md="4">
                <v-autocomplete
                  v-model="form.exam_type"
                  :items="test_type_list"
                  item-title="title"
                  item-value="id"
                  label="Test type"
                  variant="outlined"
                  color="orange"
                  density="compact"
                ></v-autocomplete>
              </v-col>

              <v-col cols="12" md="4">
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

              <!-- <v-col cols="12" md="4">
                <v-file-input
                  v-model="file_original"
                  label="Source file"
                  variant="outlined"
                  prepend-icon="mdi-paperclip"
                  @update:model-value="uploadFile"
                  accept="application/pdf,image/*"
                  density="compact"
                ></v-file-input>
              </v-col> -->

              <v-col cols="12" md="8">
                <v-text-field
                  v-model="form.title"
                  label="Title"
                  variant="outlined"
                  :rules="[(v) => !!v || 'This field is required']"
                  density="compact"
                ></v-text-field>
                <!-- <div class="text-caption text-grey">
                  Ex: 9700/11 Biology Jun 2020 Online Test | Cambridge AS & A
                  Level MSCO
                </div> -->
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
                      block
                      color="teal"
                      class="text-white"
                      size="large"
                      type="submit"
                      :loading="submit_loading"
                      style="
                        text-transform: none;
                        font-size: 13px;
                        font-weight: 500;
                      "
                      density="compact"
                    >
                      Update & Next step
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
                :examEditMode="true"
                :initialSection="form.section"
                :initialBase="form.base"
                :initialLesson="form.lesson"
                :initialTopics="form.topics"
                @update:updateTestList="val => lastCreatedTest = val"
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
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="4">
              <v-checkbox
                v-model="filter.myTests"
                label="My own tests"
                density="compact"
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

            <v-col cols="12">
              <v-row>
                <v-col cols="12" md="6" class="pb-0">
                  <v-btn
                    @click="test_step = 3"
                    :disabled="tests.length < 5"
                    block
                    color="teal"
                    class="text-white"
                    size="large"
                  >
                    <span v-if="tests.length < 5"
                      >Add at least {{ 5 - tests.length }} more tests</span
                    >
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
                <v-col cols="12" md="6">
                  <v-btn
                    block
                    color="teal"
                    class="text-white"
                    size="large"
                    :loading="publish_loading"
                    @click="publishTest"
                    style="
                      text-transform: none;
                      font-size: 13px;
                      font-weight: 500;
                    "
                    density="compact"
                  >
                    Publish
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

    <v-row justify="center">
      <v-dialog
        v-model="printPreviewDialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <v-card class="test-list">
          <v-toolbar dark color="teal">
            <v-btn icon dark @click="printPreviewDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark text @click="printPreviewDialog = false"> Ok </v-btn>
            </v-toolbar-items>
          </v-toolbar>

          <v-card-text id="preview-dialog">
            <v-row>
              <v-col cols="12">
                <p class="text-h4 font-weight-bold">{{ form.title }}</p>
              </v-col>
              <!--              <v-col cols="4">Question's num: {{ tests.length }}</v-col>-->
              <v-col cols="4">Duration: {{ form.duration }}</v-col>
              <v-col cols="4">Level: {{ calcLevel(form.level) }}</v-col>
              <v-col cols="12">
                <v-chip label color="error"> Topics: </v-chip>
              </v-col>
              <v-col
                cols="4"
                v-for="(item, index) in topicTitleArr"
                :key="index"
              >
                {{ item }}
              </v-col>
              <v-col cols="12">
                <v-divider />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" v-if="previewTestList.length">
                <draggable 
                  v-model="previewTestList" 
                  :item-key="'id'" 
                  @end="previewDragEnd"
                  handle=".drag-handle"
                >
                  <template #item="{element: item}">
                    <v-row :key="item.id">
                      <v-col cols="12">
                        <div
                          id="test-question"
                          ref="mathJaxEl"
                          v-html="item.question"
                        />
                        <img v-if="item.q_file" :src="item.q_file" />

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
                        <p class="answer">
                          <span>4)</span>
                          <span
                            ref="mathJaxEl"
                            v-if="item.answer_d"
                            v-html="item.answer_d"
                          />
                          <img v-if="item.d_file" :src="item.d_file" />
                        </p>
                        <v-row>
                          <v-col cols="6">
                            <v-btn icon color="blue" class="drag-handle">
                              <v-icon> mdi-cursor-move </v-icon>
                            </v-btn>
                          </v-col>
                          <v-col cols="6" class="text-right">
                            <v-btn
                              color="blue"
                              variant="flat"
                              size="small"
                              v-if="!tests.includes(item.id)"
                              @click="applyTest(item, 'add')"
                            >
                              <v-icon size="small"> mdi-plus </v-icon>
                              Add
                            </v-btn>
                            <v-btn
                              color="red"
                              variant="flat"
                              size="small"
                              v-if="tests.includes(item.id)"
                              @click="applyTest(item, 'remove')"
                            >
                              <v-icon size="small"> mdi-minus </v-icon>
                              Delete
                            </v-btn>
                          </v-col>
                        </v-row>
                        <v-divider class="mt-3" />
                      </v-col>
                    </v-row>
                  </template>
                </draggable>
              </v-col>
              <v-col v-else cols="12" class="text-center">
                <p>Oops! no data found</p>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>

    <v-row>
      <v-dialog v-model="confirmDeleteDialog" persistent max-width="290">
        <v-card class="pa-2">
          <v-card-title
            class="text-h5"
            style="text-overflow: clip; text-wrap: wrap"
          >
            Are you sure of deleting the online exam?
          </v-card-title>
          <v-card-text
            style="font-size: 10px; color: rgba(0, 0, 0, 0.5)"
            class="px-2"
          >
            If you are sure about the deletion, click Agree button.
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="green darken-1"
              text
              @click="confirmDeleteDialog = false"
              style="text-transform: none; font-size: 14px"
            >
              Disagree
            </v-btn>
            <v-btn
              color="green darken-1"
              text
              :loading="deleteLoading"
              @click="deleteOnlineExam"
              style="text-transform: none; font-size: 14px"
            >
              Agree
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <!--Delete exam test confirm dialog-->
    <v-dialog v-model="deleteTestConfirmDialog" max-width="290">
      <v-card>
        <v-card-title class="text-h5"> Are you sure? </v-card-title>

        <v-card-text>
          <p>If you are sure to delete, click Yes.</p>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text @click="deleteTestConfirmDialog = false"> No </v-btn>

          <v-btn
            color="green darken-1"
            text
            :loading="delete_exam_test_loading"
            @click="deleteExamTest()"
          >
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--End delete exam test confirm dialog-->
  </v-container>
</template>

<script setup>
/**
 * Test-maker Edit Page
 * 
 * API Endpoints:
 * - Create/Update exam: PUT /api/v1/exams/{id}
 * - Delete entire exam: DELETE /api/v1/exams/{id}
 * - Add a test: POST /api/v1/exams/{id}/tests/{test_id}
 * - Delete a test or update test order: PUT /api/v1/exams/tests/{id} with tests[] array
 * - Publish exam: PUT /api/v1/exams/publish/{id}
 */

import { ref, reactive, watch, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuth } from "~/composables/useAuth";
import draggable from "vuedraggable";
import TopicSelector from "~/components/form/topic-selector.vue";
import CreateTestForm from "~/components/test-maker/create-test-form.vue";

// Define layout and page metadata
definePageMeta({
  layout: "test-maker-layout",
});

useHead({
  title: "Update online exam",
});

// Get services
const auth = useAuth();
const route = useRoute();
const router = useRouter();
const userToken = ref("");

// Core data
const test_step = ref(1);
const exam_id = ref(route.params.id);
const exam_code = ref("");
const submit_loading = ref(false);
const update_loading = ref(false);
const publish_loading = ref(false);
const test_loading = ref(false);
const all_tests_loaded = ref(false);
const tests = ref([]);
const timer = ref(null);
const observer = ref(null);
const topicSelector = ref(null);
const mathJaxEl = ref(null);
const lastCreatedTest = ref(null);
const testList = ref(null);
const testListContent = ref(null);
const createForm = ref(null);

// Form data
const form = reactive({
  section: "",
  base: "",
  lesson: "",
  topics: [],
  exam_type: "",
  level: "2",
  holding_time: false,
  holding_level: 4,
  state: "",
  area: "",
  school: "",
  duration: 3,
  title: "",
  negative_point: false,
  file_original: "",
  question_num: 50,
  edu_year: "",
  edu_month: "",
});

const file_original = ref(null);
const file_original_path = ref("");

// Filter data for test search
const filter = reactive({
  section: "",
  base: "",
  lesson: "",
  topic: "",
  page: 1,
  perpage: 40,
  testsHasVideo: "",
  myTests: false,
});

// UI State
const printPreviewDialog = ref(false);
const confirmDeleteDialog = ref(false);
const deleteLoading = ref(false);
const previewTestList = ref([]);
const topicTitleArr = ref([]);
const testListSwitch = ref(false);
const isFormValid = ref(false);

// Delete exam test section
const deleteTestConfirmDialog = ref(false);
const delete_exam_test_id = ref("");
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
    params.section_id = form.section;
    params.area_id = form.area;
  }

  try {
    const res = await $fetch("/api/v1/types/list", {
      method: "GET",
      params,
      headers: {
        Authorization: `Bearer ${userToken.value}`,
      },
    });

    if (type === "section") {
      level_list.value = res.data;
      filter_level_list.value = res.data;
    } else if (type === "base") {
      grade_list.value = res.data;
      filter_grade_list.value = res.data;
    } else if (type === "lesson") {
      lesson_list.value = res.data;
      filter_lesson_list.value = res.data;
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
    
  } catch (err) {
    console.error(`Error loading ${type} data:`, err);
    const { $toast } = useNuxtApp();
    if ($toast) $toast.error(`Failed to load ${type} data`);
  }
};

/**
 * Get topic title list from the selected topics
 */
const getTopicTitleList = () => {
  topicTitleArr.value = [];
  
  if (!form.topics || !form.topics.length || !topic_list.value.length) {
    return;
  }
  
  for (const topicId of form.topics) {
    const topic = topic_list.value.find(t => t.id === topicId);
    if (topic && topic.title) {
      topicTitleArr.value.push(topic.title);
    }
  }
};

/**
 * Handle topic selection from topic selector
 */
const selectTopic = (topics) => {
  selected_topics.value = topics;
  
  // Convert strings to numbers if necessary
  const topicIds = topics.map(id => typeof id === 'string' ? parseInt(id) : id);
  form.topics = topicIds;
  
  if (form.topics.length) {
    getTopicTitleList();
  }
};

/**
 * Fetch current exam information
 */
const getCurrentExamInfo = async () => {
  try {
    const response = await $fetch(`/api/v1/exams/info/${exam_id.value}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userToken.value}`,
      },
    });

    if (response && response.data) {
      // Update form data
      form.section = response.data.section;
      form.base = response.data.base;
      form.lesson = response.data.lesson;
      form.exam_type = response.data.azmoon_type;
      form.level = response.data.level || "2";
      form.holding_level = response.data.holding_level || 4;
      form.holding_time = response.data.holding_time;
      form.state = response.data.state;
      form.area = response.data.area;
      form.school = response.data.school;
      form.duration = response.data.azmoon_time;
      form.title = response.data.title;
      form.negative_point = response.data.negative_point;
      form.file_original = response.data.file_original;
      form.edu_year = parseInt(response.data.edu_year);
      form.edu_month = parseInt(response.data.edu_month);
      file_original_path.value = response.data.file_original;
      exam_code.value = response.data.code;
      
      // Important - update the topics
      if (response.data.topics && Array.isArray(response.data.topics)) {

        // Ensure topics are numbers
        const topicsAsNumbers = response.data.topics.map(t => 
          typeof t === 'string' ? parseInt(t) : t
        );
        
        form.topics = topicsAsNumbers;
        selected_topics.value = topicsAsNumbers;
      }
      
      // Set tests
      if (response.data.tests && Array.isArray(response.data.tests)) {
        tests.value = response.data.tests;
      }
      
      // Load dependent dropdowns
      if (form.section) {
        await getTypeList("base", form.section);
      }
      
      if (form.base) {
        await getTypeList("lesson", form.base);
      }
      
      if (form.lesson) {
        await getTypeList("topic", form.lesson);
      }
      
      // Get topic names for display
      if (form.topics && form.topics.length) {
        getTopicTitleList();
      }
    }
  } catch (err) {
    console.error("Error fetching exam info:", err);
    const { $toast } = useNuxtApp();
    if ($toast) $toast.error("Failed to load exam information");
  }
};

/**
 * Get a list of tests for the current exam
 */
const getCurrentExamTestsInfo = async () => {
  test_loading.value = true;
  
  try {
    const response = await $fetch("/api/v1/examTests", {
      method: "GET",
      params: {
        exam_id: exam_id.value,
      },
      headers: {
        Authorization: `Bearer ${userToken.value}`,
      },
    });

    if (response && response.data) {
      previewTestList.value = response.data.list;
      
      if (createForm.value) {
        createForm.value.examTestListLength = tests.value.length;
      }
    }
  } catch (err) {
    console.error("Error fetching exam tests:", err);
  } finally {
    test_loading.value = false;
  }
};

/**
 * Update exam info
 */
const updateQuestion = async () => {
  submit_loading.value = true;

  // Create FormData object
  const formData = new FormData();
  
  // Add form fields
  for (const key in form) {
    if (key !== "topics") formData.append(key, form[key]);
  }
  
  // Add topics array
  if (form.topics && form.topics.length) {
    for (const topic of form.topics) {
      formData.append("topics[]", topic);
    }
  }

  try {
    const response = await $fetch(`/api/v1/exams/${exam_id.value}`, {
      method: "PUT",
      body: urlencodeFormData(formData),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${userToken.value}`,
      },
    });

    console.log("Update response:", response);
    
    const { $toast } = useNuxtApp();
    if ($toast) $toast.success("Exam updated successfully");
    
    // Move to the next step
    test_step.value = 2;
  } catch (error) {
    console.error("Error updating exam:", error);
    const { $toast } = useNuxtApp();
    if ($toast) $toast.error(error.response?.data?.message || "Error updating exam");
  } finally {
    submit_loading.value = false;
  }
};

/**
 * Handle adding or removing a test from the exam
 */
const applyTest = (item, type) => {
  if (type === "add" && !tests.value.includes(item.id)) {
    // Add the test to our state
    tests.value.push(item.id);
    
    // Update the backend using a POST request for individual test addition
    $fetch(`/api/v1/exams/${exam_id.value}/tests/${item.id}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${userToken.value}`,
      },
    }).then(response => {
      const { $toast } = useNuxtApp();
      if ($toast) $toast.success("Test added successfully");
      
      // Refresh the preview list
      getCurrentExamTestsInfo();
    }).catch(error => {
      console.error("Error adding test:", error);
      const { $toast } = useNuxtApp();
      if ($toast) $toast.error("Failed to add test");
      
      // Remove the test from our state if the API call failed
      tests.value = tests.value.filter(id => id !== item.id);
    });
  } else if (type === "remove" && tests.value.includes(item.id)) {
    // Store the original tests array before removing the item
    const originalTests = [...tests.value];
    
    // Remove the test from our state
    tests.value = tests.value.filter(id => id !== item.id);
    
    // Create FormData with the updated test list
    const formData = new FormData();
    
    // Add all remaining tests
    for (let i = 0; i < tests.value.length; i++) {
      formData.append("tests[]", tests.value[i]);
    }
    
    // Update the backend with PUT request
    $fetch(`/api/v1/exams/tests/${exam_id.value}`, {
      method: "PUT",
      body: urlencodeFormData(formData),
      headers: {
        "Authorization": `Bearer ${userToken.value}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }).then(response => {
      const { $toast } = useNuxtApp();
      if ($toast) $toast.success("Test removed successfully");
      
      // Refresh the preview list
      getCurrentExamTestsInfo();
    }).catch(error => {
      console.error("Error removing test:", error);
      const { $toast } = useNuxtApp();
      if ($toast) $toast.error("Failed to remove test");
      
      // Restore the original tests array if the API call failed
      tests.value = originalTests;
    });
  }
};

/**
 * URL encode form data
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
 */
const encode = (s) => {
  return encodeURIComponent(s).replace(/%20/g, "+");
};

/**
 * Publish exam
 */
const publishTest = async () => {
  publish_loading.value = true;
  
  try {
    const response = await $fetch(`/api/v1/exams/publish/${exam_id.value}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${userToken.value}`,
      },
    });
    
    if (response.data.message === "done") {
      test_step.value = 4;
      const { $toast } = useNuxtApp();
      if ($toast) $toast.success("Exam published successfully");
    } else {
      const { $toast } = useNuxtApp();
      if ($toast) $toast.error("Failed to publish exam");
    }
  } catch (error) {
    console.error("Error publishing exam:", error);
    const { $toast } = useNuxtApp();
    if ($toast) $toast.error("Failed to publish exam");
  } finally {
    publish_loading.value = false;
  }
};

/**
 * Handle scroll for infinite loading
 */
const onScroll = () => {
  if (test_loading.value || all_tests_loaded.value) return;
  
  const testListElement = testList.value?.$el;
  if (!testListElement) return;
  
  const scrollTop = testListElement.scrollTop;
  const scrollHeight = testListElement.scrollHeight;
  const clientHeight = testListElement.clientHeight;
  
  // Load more when scrolled near the bottom
  if (scrollHeight - scrollTop - clientHeight < 100) {
    filter.page++;
    getExamTests();
  }
};

/**
 * Get exams tests based on filters
 */
const getExamTests = async () => {
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
      headers: {
        "Authorization": `Bearer ${userToken.value}`,
      },
    });
    
    if (response && response.data) {
      test_list.value.push(...response.data.list);
      
      // Update exam test list length in the form
      if (createForm.value) {
        createForm.value.examTestListLength = tests.value.length;
      }
      
      // Check if we've loaded all tests
      if (response.data.list.length === 0) {
        all_tests_loaded.value = true;
      } else {
        all_tests_loaded.value = false;
      }
    }
  } catch (error) {
    console.error("Error fetching exam tests:", error);
  } finally {
    test_loading.value = false;
  }
};

/**
 * Copy share URL to clipboard
 */
const copyUrl = () => {
  navigator.clipboard.writeText(test_share_link.value);
  const { $toast } = useNuxtApp();
  if ($toast) $toast.success("Link copied to clipboard");
};

/**
 * Delete entire online exam
 */
const deleteOnlineExam = async () => {
  deleteLoading.value = true;

  try {
    // Send DELETE request to the API
    await $fetch(`/api/v1/exams/${exam_id.value}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${userToken.value}`,
      },
    });

    // Reset all values
    exam_id.value = "";
    exam_code.value = "";

    // Reset form and data
    previewTestList.value = [];
    tests.value = [];

    form.section = "";
    form.base = "";
    form.lesson = "";
    form.topics = [];
    form.title = "";
    form.file_original = "";

    // Show success message
    const { $toast } = useNuxtApp();
    if ($toast) $toast.success("Exam deleted successfully");

    // Navigate back to exams list
    router.push("/user/exam");
  } catch (err) {
    console.error("Error deleting exam:", err);
    const { $toast } = useNuxtApp();
    if ($toast) $toast.error(err.message || "Error deleting exam");
  } finally {
    deleteLoading.value = false;
    confirmDeleteDialog.value = false;
  }
};

/**
 * Open test delete confirmation dialog
 * @param {number|string} item_id - ID of the test to delete
 */
const openTestDeleteConfirmDialog = (item_id) => {
  delete_exam_test_id.value = item_id;
  deleteTestConfirmDialog.value = true;
};

/**
 * Delete an individual test from the exam
 */
const deleteExamTest = async () => {
  delete_exam_test_loading.value = true;

  try {
    // Store the original tests array
    const originalTests = [...tests.value];
    
    // Remove the test from our state
    const index = tests.value.findIndex(id => id === delete_exam_test_id.value);
    if (index !== -1) {
      tests.value.splice(index, 1);
    }
    
    // Create FormData with the updated test list
    const formData = new FormData();
    
    // Add all remaining tests
    for (let i = 0; i < tests.value.length; i++) {
      formData.append("tests[]", tests.value[i]);
    }
    
    // Update the backend with PUT request instead of DELETE
    await $fetch(`/api/v1/exams/tests/${exam_id.value}`, {
      method: "PUT",
      body: urlencodeFormData(formData),
      headers: {
        "Authorization": `Bearer ${userToken.value}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    // Show success message
    const { $toast } = useNuxtApp();
    if ($toast) $toast.success("Test deleted successfully");

    // Refresh test lists
    filter.page = 1;
    test_list.value = [];
    getExamTests();
    getCurrentExamTestsInfo();
  } catch (err) {
    console.error("Error deleting test:", err);
    
    // Restore the original tests array if the API call failed
    tests.value = originalTests || [];
    
    const { $toast } = useNuxtApp();
    if ($toast) $toast.error(err.message || "Error deleting test");
  } finally {
    delete_exam_test_loading.value = false;
    delete_exam_test_id.value = null;
    deleteTestConfirmDialog.value = false;
  }
};

/**
 * Handle drag end event for reordering preview items
 * This is called when the user finishes dragging/reordering tests in the preview dialog
 */
const previewDragEnd = async () => {
  try {
    // Create a FormData with the new test order
    const formData = new FormData();
    
    // Add all tests in their new order
    for (let i = 0; i < previewTestList.value.length; i++) {
      formData.append("tests[]", previewTestList.value[i].id);
    }
    
    // Update the backend with the new order
    await $fetch(`/api/v1/exams/tests/${exam_id.value}`, {
      method: "PUT",
      body: urlencodeFormData(formData),
      headers: {
        "Authorization": `Bearer ${userToken.value}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    
    // Update the tests array to match the new order
    tests.value = previewTestList.value.map(item => item.id);
    
    // Show success message
    const { $toast } = useNuxtApp();
    if ($toast) $toast.success("Test order updated successfully");
  } catch (err) {
    console.error("Error updating test order:", err);
    const { $toast } = useNuxtApp();
    if ($toast) $toast.error("Failed to update test order");
    
    // Refresh the preview list to restore previous order
    await getCurrentExamTestsInfo();
  }
};

/**
 * Calculate the display text for a level based on its ID
 * @param {string} level - The level ID
 * @returns {string} The display text for the level
 */
const calcLevel = (level) => {
  if (!level) return "";
  
  const levelItem = test_level_list.find(x => x.id === level);
  return levelItem ? levelItem.title : "";
};

/**
 * Initialize on mount
 */
onMounted(async () => {
  // Get the user token
  userToken.value = auth.getUserToken();
  
  // Load initial data
  await getTypeList("section");
  await getTypeList("exam_type");
  await getTypeList("state");
  
  // Fetch exam data
  await getCurrentExamInfo();
  
  // Get the tests
  await getCurrentExamTestsInfo();
  
  // Initialize the test step
  test_step.value = parseInt(route.query.step) || 2;
  
  // Initialize the test list switch based on the query
  if (route.query.active === "test_list") {
    testListSwitch.value = true;
  }
});
</script>
