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
            @submit="handleSubmit"
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
                @handleTestRefresh="handleTestRefresh"
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
                            v-if="!tests.some(id => String(id) === String(item.id))"
                            @click="applyTest(item, 'add')"
                          >
                            <v-icon size="small"> mdi-plus </v-icon>
                            Add
                          </v-btn>
                          <v-btn
                            color="red"
                            variant="flat"
                            size="small"
                            v-if="tests.some(id => String(id) === String(item.id))"
                            @click="applyTest(item, 'remove')"
                          >
                            <v-icon size="small"> mdi-minus </v-icon>
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
              <v-col cols="4">Question's num: {{ tests.length }}</v-col>
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
                              v-if="!tests.some(id => String(id) === String(item.id))"
                              @click="applyTest(item, 'add')"
                            >
                              <v-icon size="small"> mdi-plus </v-icon>
                              Add
                            </v-btn>
                            <v-btn
                              color="red"
                              variant="flat"
                              size="small"
                              v-if="tests.some(id => String(id) === String(item.id))"
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
    console.log(`Fetching tests for exam ID: ${exam_id.value}`);
    
    // Clear the preview list before fetching to avoid display issues
    previewTestList.value = [];
    
    const response = await $fetch("/api/v1/examTests", {
      method: "GET",
      params: {
        exam_id: exam_id.value,
      },
      headers: {
        Authorization: `Bearer ${userToken.value}`,
      },
    });

    console.log(`API response status: ${response?.status}, found tests: ${response?.data?.list?.length || 0}`);

    if (response && response.status === 1) {
      // Process the response data based on its format
      let fetchedTests = [];
      
      if (Array.isArray(response.data)) {
        fetchedTests = response.data;
      } else if (response.data && Array.isArray(response.data.list)) {
        fetchedTests = response.data.list;
      } 
      
      // If we have tests, double check that all tests in our tests array are included
      if (fetchedTests.length > 0) {
        // Update previewTestList with the fetched data
        previewTestList.value = fetchedTests;
        
        // Validate that all tests we expect are in the preview list
        const previewIds = previewTestList.value.map(item => String(item.id));
        const missingIds = tests.value.filter(id => !previewIds.includes(String(id)));
        
        if (missingIds.length > 0) {
          console.warn(`Warning: ${missingIds.length} tests are in tests array but not in preview list:`, missingIds);
          
          // Create a map of existing items for easy lookup
          const existingItemsMap = new Map();
          previewTestList.value.forEach(item => {
            existingItemsMap.set(String(item.id), item);
          });
          
          // Create a new preview list with placeholders for missing items
          const completedList = [];
          
          // Add each test from tests array (in order) to the completed list
          for (const testId of tests.value) {
            const idStr = String(testId);
            if (existingItemsMap.has(idStr)) {
              // If we have the item details, add it to the list
              completedList.push(existingItemsMap.get(idStr));
            } else {
              // Otherwise, create a placeholder that will be updated
              // when the detailed information is fetched
              completedList.push({
                id: idStr,
                question: "Loading test details...",
                isPlaceholder: true
              });
              
              // Attempt to fetch this test's details
              fetchTestDetails(idStr);
            }
          }
          
          // Replace the preview list with our completed list
          previewTestList.value = completedList;
        }
      } else {
        console.warn("No tests returned from API - this might be unexpected if tests.value is not empty");
        
        // If no tests were returned but we have tests in our array, create placeholders
        if (tests.value.length > 0) {
          // Create placeholder items for each test ID
          const placeholders = tests.value.map(id => ({
            id: String(id),
            question: "Loading test details...",
            isPlaceholder: true
          }));
          
          previewTestList.value = placeholders;
          
          // Try to fetch details for each test
          for (const testId of tests.value) {
            fetchTestDetails(String(testId));
          }
        }
      }

      // Debug the preview test list
      if (previewTestList.value.length > 0) {
        console.log(`Preview list populated with ${previewTestList.value.length} tests`);
        console.log(`First item in preview list:`, previewTestList.value[0]);
      }

      // If we have a create form reference, update its exam test list length
      if (createForm.value && "examTestListLength" in createForm.value) {
        createForm.value.examTestListLength = tests.value.length;
      }
    }
  } catch (err) {
    console.error("Error loading tests:", err);
    const { $toast } = useNuxtApp();
    if ($toast) $toast.error("Error loading tests");
  } finally {
    test_loading.value = false;
  }
};

/**
 * Helper function to fetch details for a single test by its ID
 * @param {string} testId - The ID of the test to fetch details for
 */
const fetchTestDetails = async (testId) => {
  try {
    const response = await $fetch(`/api/v1/examTests/${testId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userToken.value}`,
      }
    });
    
    if (response && response.status === 1 && response.data) {
      // Find the placeholder and replace it with actual details
      const index = previewTestList.value.findIndex(item => 
        item.isPlaceholder && String(item.id) === String(testId));
      
      if (index >= 0) {
        // Vue's reactivity will update the UI when we modify the array
        previewTestList.value[index] = response.data;
      }
      return response.data;
    }
    
    console.warn(`No data returned for test ${testId}`);
    return null;
  } catch (err) {
    console.error(`Error fetching details for test ${testId}:`, err);
    return null;
  }
};

/**
 * Handle form submission with proper event handling
 * @param {Event} evt - Submit event
 */
const handleSubmit = (evt) => {
  // Properly handle the event to prevent form submission
  if (evt && typeof evt.preventDefault === 'function') {
    evt.preventDefault();
  }
  
  // Call our update function
  updateQuestion();
};

/**
 * Update exam info with improved error handling and validation
 */
const updateQuestion = async () => {
  try {
    submit_loading.value = true;
    
    console.log("Starting exam update for ID:", exam_id.value);
    
    // Validate form (basic validation before submission)
    if (!validateForm()) {
      submit_loading.value = false;
      return;
    }

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

    console.log("Form data prepared for update - topics:", form.topics);
    
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
    
    // Add a small delay before getting updated tests list
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Get updated tests list
    await getCurrentExamTestsInfo();
  } catch (error) {
    console.error("Error updating exam:", error);
    const { $toast } = useNuxtApp();
    if ($toast) $toast.error(error.response?.data?.message || "Error updating exam");
  } finally {
    submit_loading.value = false;
  }
};

/**
 * Basic form validation
 * @returns {boolean} True if form is valid
 */
const validateForm = () => {
  const { $toast } = useNuxtApp();
  
  // Check required fields
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

  if (!form.title) {
    if ($toast) $toast.error("Title is required");
    return false;
  }

  return true;
};

/**
 * Handle adding or removing a test from the exam with improved consistency
 */
const applyTest = async (item, type) => {
  try {
    // Ensure we have a valid exam ID
    if (!exam_id.value) {
      console.error('No exam ID available, cannot update tests');
      const { $toast } = useNuxtApp();
      if ($toast) $toast.error("No exam ID available");
      return;
    }

    // Convert item.id to string for consistent comparison
    const testId = String(item.id);
    
    // Check if the test ID exists in the array (using string comparison)
    const testExists = tests.value.some(id => String(id) === testId);
    
    // Check if we need to add or remove the test
    const shouldAdd = type === "add" || (!type && !testExists);
    const shouldRemove = type === "remove" || (!type && testExists);

    if (shouldAdd) {
      // Add the test to the tests array
      tests.value.push(testId);
      
      const { $toast } = useNuxtApp();
      if ($toast) $toast.success("Test added to exam");
    } else if (shouldRemove) {
      // Remove the test from the tests array (using string comparison)
      tests.value = tests.value.filter(id => String(id) !== testId);
      
      const { $toast } = useNuxtApp();
      if ($toast) $toast.success("Test removed from exam");
    }
    
    // Use the submitTest function to update the backend and refresh the UI
    await submitTest();
  } catch (err) {
    console.error('Failed to update tests:', err);
    const { $toast } = useNuxtApp();
    if ($toast) $toast.error("Failed to update tests");
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
    
    // Convert ID to string for consistent comparison
    const testIdToDelete = String(delete_exam_test_id.value);
    
    // Remove the test from our state using string comparison
    const index = tests.value.findIndex(id => String(id) === testIdToDelete);
    if (index !== -1) {
      tests.value.splice(index, 1);
    
    // Use the submitTest function to update the backend and refresh the UI
    await submitTest();

    // Show success message
    const { $toast } = useNuxtApp();
    if ($toast) $toast.success("Test deleted successfully");
    } else {
      console.warn(`Test ID ${testIdToDelete} not found in tests array`);
      const { $toast } = useNuxtApp();
      if ($toast) $toast.warning("Test was not in the exam");
    }
  } catch (err) {
    console.error("Error deleting test:", err);
    
    // Restore the original tests array if the API call failed
    if (originalTests) {
      tests.value = [...originalTests];
    }
    
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
 * Handle test refresh events from CreateTestForm component
 */
const handleTestRefresh = async () => {
  try {
    console.log('Handling test refresh event in edit page');
    console.log('Current tests array:', tests.value);

    // Add a delay to ensure backend operations have completed
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Ensure all tests are represented as strings for consistent comparison
    tests.value = tests.value.map(id => String(id));
    
    console.log('Getting updated tests list from API...');
    // Get the updated tests list
    await getCurrentExamTestsInfo();
    
    console.log('Current preview list after refresh:', previewTestList.value.length, 'items');
    console.log('Current tests array after refresh:', tests.value);
    
    // Update create form test count if available
    if (createForm.value && "examTestListLength" in createForm.value) {
      createForm.value.examTestListLength = tests.value.length;
      console.log('Updated examTestListLength to', tests.value.length);
    }
    
    // If test list is active, also refresh the main test list
    if (testListSwitch.value) {
      console.log('Test list is active, refreshing main test list');
      filter.page = 1;
      test_list.value = [];
      all_tests_loaded.value = false;
      await getExamTests();
    }
    
    // Show success message
    const { $toast } = useNuxtApp();
    if (previewTestList.value.length > 0) {
    if ($toast) $toast.success(`Tests updated: ${tests.value.length} tests in exam`);
    } else {
      console.warn('Preview list is empty after refresh - this may indicate an issue');
      if ($toast) $toast.info('Refreshing test list...');
      // Try one more time with a different approach
      await submitTest();
    }
  } catch (err) {
    console.error('Error in handleTestRefresh:', err);
    const { $toast } = useNuxtApp();
    if ($toast) $toast.error('Error refreshing test list');
  }
};

/**
 * Handle stepper navigation to validate steps
 */
const handleStepChange = (newStep) => {
  const { $toast } = useNuxtApp();
  
  // Don't allow changing to step 4 (Publish) if we don't have enough tests
  if (newStep === 4 && tests.value.length < 5) {
    if ($toast) $toast.error(
      `You need at least 5 tests to publish the exam. Currently have ${tests.value.length}.`
    );

    // Revert to step 3 (Review)
    test_step.value = 3;
    return;
  }

  // Prevent skipping to step 3 or 4 if exam hasn't been updated
  if ((newStep === 3 || newStep === 4) && test_step.value === 1) {
    if ($toast) $toast.info("Please update the exam information first");
    
    // Stay on step 1
    test_step.value = 1;
    return;
  }

  // If all validations pass, update the step
  test_step.value = newStep;
  
  // Show step change notification
  const stepNames = {
    1: "Header",
    2: "Tests",
    3: "Review",
    4: "Publish",
  };
  
  if ($toast) $toast.info(`Navigated to ${stepNames[newStep]} step`);
  
  // If moving to step 3 (Review), refresh the test list
  if (newStep === 3) {
    getCurrentExamTestsInfo();
  }
};

// Watch for newly created tests and add them to the current exam
watch(
  () => lastCreatedTest.value,
  async (newTest) => {
    if (newTest && exam_id.value) {
      console.log(`New test created with ID: ${newTest}`);
      
      // STEP 1: Convert to string for consistent comparison - IDs might be numbers or strings
      const newTestId = String(newTest);
      
      // STEP 2: First check if this test is already in our list to avoid duplicates
      // Make sure we're comparing strings to strings for consistency
      if (tests.value.some(id => String(id) === newTestId)) {
        console.log(`Test ID ${newTestId} already exists in our tests array - skipping`);
        lastCreatedTest.value = null;
        return;
      }

      console.log(`Adding test ID ${newTestId} to tests array`);
      
      // STEP 3: Add the new test to the tests array
      tests.value.push(newTestId);
      console.log(`Tests array after adding: ${tests.value.join(', ')}`);
      
      // STEP 4: Update the backend with the full tests array
      try {
        console.log(`Updating exam ${exam_id.value} with tests array via submitTest`);
        
        // Use the submitTest function to handle backend update
        await submitTest();
        
        console.log("Successfully updated backend with new test");
                
        // STEP 5: Reset the lastCreatedTest after processing
        lastCreatedTest.value = null;
      } catch (err) {
        console.error("Error in lastCreatedTest watcher:", err);
        // Don't reset lastCreatedTest here to allow for retry
      }
    }
  }
);

/**
 * Submit tests to the exam - updates the association between tests and exam
 */
const submitTest = async () => {
  try {
    if (!tests.value.length) {
      console.log('No tests to submit');
      return;
    }

    // Ensure we have a valid exam ID
    if (!exam_id.value) {
      console.error('No exam ID available, cannot submit tests');
      const { $toast } = useNuxtApp();
      if ($toast) $toast.error("No exam ID available");
      return;
    }

    console.log(`Submitting ${tests.value.length} tests to exam ${exam_id.value}`);
    
    // Create URLSearchParams directly instead of using FormData conversion
    const formData = new URLSearchParams();
    
    // Make sure all test IDs are properly converted to strings for consistency
    tests.value.forEach(id => {
      formData.append("tests[]", String(id));
    });

    console.log('Tests being submitted:', tests.value.map(id => String(id)));
    
    const updateResponse = await $fetch(`/api/v1/exams/tests/${exam_id.value}`, {
      method: "PUT",
      body: formData.toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        Authorization: `Bearer ${userToken.value}`,
      },
    });
    
    console.log('Tests submission response:', updateResponse);
    
    // Add a small delay to ensure the backend has processed the update
    await new Promise(resolve => setTimeout(resolve, 300));

    // Refresh the tests list
    await getCurrentExamTestsInfo();
    
    const { $toast } = useNuxtApp();
    if ($toast) $toast.success("Tests updated successfully");
  } catch (err) {
    console.error('Failed to update tests:', err);
    const { $toast } = useNuxtApp();
    if ($toast) $toast.error("Failed to update tests");
  }
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

<style lang="scss">
.create-test-container {
  max-width: 1200px;
  margin: 5rem auto;
  padding-bottom: 80px; // Space for fixed bottom bar
}
@media (max-width: 768px) {
  .create-test-container {
    margin: 0;
  }
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
.v-expansion-panel-title__overlay {
  background-color: unset !important;
  border-radius: inherit;
  opacity: 0;
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

.v-stepper-vertical-item:not(:last-child):before {
  border: unset !important;
  border-left: thin solid rgba(0, 0, 0, 0.019) !important;
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

  // Different answer option styles
  .answer {
    margin-bottom: 12px;
    display: flex;
    align-items: flex-start;

    span {
      display: inline-block;
      visibility: visible !important;
      margin-right: 8px;
    }
  }
}

.v-label--clickable {
  font-size: 16px !important;
  font-weight: 400 !important;
  color: rgba(0, 0, 0, 0.6) !important;
  margin-inline-start: 10px !important;
}
.v-expansion-panel-text__wrapper {
  padding: 8px 14px 16px !important;
}

.v-label--clickable {
  font-size: 16px !important;
  font-weight: 400 !important;
  color: rgba(0, 0, 0, 0.6) !important;
  margin-inline-start: 10px !important;
}

.option-text {
  display: inline-block !important;
  visibility: visible !important;
  min-height: 1.5em;
  min-width: 10px;
  background-color: rgba(230, 230, 230, 0.1); /* Light background */
  border: 1px dashed #ccc; /* Add a border to make the area visible */
  padding: 2px 4px;
}

/* Force all math content to be visible */
.answer span {
  visibility: visible !important;
  display: inline-block !important;
}
</style>

