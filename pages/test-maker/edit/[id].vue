<template>
  <v-container class="create-test-container">
    <v-row class="mt-4">
      <v-col cols="6">
        <h1 class="text-h4 text-teal">Update Exam</h1>
      </v-col>
      <v-col cols="6" class="text-right">
        <v-btn
          variant="outlined"
          color="error"
          :disabled="!exam_id"
          icon="mdi-delete"
          size="small"
          @click="confirmDeleteDialog = true"
          class="mr-1"
          style="font-size: 15px; font-weight: 500"
        />
        <v-btn
          variant="outlined"
          icon="mdi-printer-eye"
          size="small"
          @click="printPreviewDialog = !printPreviewDialog"
          style="font-size: 15px; font-weight: 500"
        />
      </v-col>
    </v-row>

    <v-stepper-vertical
      :items="[
        { title: 'Header', value: 1 },
        { title: 'Tests', value: 2 },
        { title: 'Review', value: 3 },
        { title: 'Publish', value: 4, disabled: tests.length < 5 },
      ]"
      v-model="test_step"
      editable
      color="teal"
      hide-actions
      @update:model-value="handleStepChange"
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

              <v-col cols="12" md="2">
                <v-autocomplete
                  v-model="form.exam_type"
                  :items="test_type_list"
                  item-title="title"
                  item-value="id"
                  :rules="[(v) => !!v || 'This field is required']"
                  label="Exam type"
                  variant="outlined"
                  color="orange"
                  density="compact"
                  :loading="!test_type_list || test_type_list.length === 0"
                  no-data-text="Loading exam types..."
                ></v-autocomplete>
              </v-col>

              <v-col cols="12" md="2">
                <v-text-field
                  v-model="form.duration"
                  type="number"
                  min="1"
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
                  :rules="[(v) => !!v || 'This field is required']"
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
                  :rules="[(v) => !!v || 'This field is required']"
                ></v-autocomplete>
              </v-col>

              <v-col cols="12" md="4">
                <v-file-input
                  v-model="file_original"
                  label="Source file"
                  variant="outlined"
                  prepend-icon="mdi-paperclip"
                  @update:model-value="uploadFile"
                  accept="application/pdf"
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
                  hide-details
                ></v-text-field>
                <div
                  style="
                    font-size: 11px;
                    color: rgba(0, 0, 0, 0.6);
                    margin-left: 15px;
                  "
                >
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
                style="
                  font-weight: 500;
                  color: #009688;
                  font-size: 16px !important;
                "
              ></v-switch>
            </v-col>
          </v-row>

          <v-row v-show="!testListSwitch">
            <v-col cols="12" v-if="tests.length > 0">
              <v-alert
                type="info"
                variant="tonal"
                color="teal"
                border="start"
                density="compact"
              >
                <div
                  class="d-flex align-center justify-space-between flex-wrap"
                >
                  <span
                    >{{ tests.length }}
                    {{ tests.length === 1 ? "test" : "tests" }} added to this
                    exam</span
                  >
                  <span v-if="tests.length < 5" class="ml-2"
                    >Need {{ 5 - tests.length }} more
                    {{ 5 - tests.length === 1 ? "test" : "tests" }} to
                    publish</span
                  >
                  <span v-else class="ml-2 text-success"
                    >Ready to publish!</span
                  >
                </div>
              </v-alert>
              <v-progress-linear
                v-model="testProgress"
                height="8"
                color="teal"
                rounded
                class="mt-2 mb-3"
              ></v-progress-linear>
            </v-col>
            <v-col cols="12" v-show="!testListSwitch">
              <CreateTestForm
                ref="createForm"
                :goToPreviewStep="test_step"
                v-model:updateTestList="lastCreatedTest"
                :examEditMode="true"
                @update:refreshTests="handleTestRefresh"
                @update:goToPreviewStep="(val) => (test_step = val)"
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
                @click:clear="handleClearSection"
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
                :disabled="!filter.section"
                :loading="test_loading && filter.section && !filter.base"
                no-data-text="Select a Board first"
                @click:clear="handleClearBase"
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
                :disabled="!filter.base"
                :loading="test_loading && filter.base && !filter.lesson"
                no-data-text="Select a Grade first"
                @click:clear="handleClearLesson"
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
                :disabled="!filter.lesson"
                :loading="test_loading && filter.lesson && !filter.topic"
                @click:clear="handleClearTopic"
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
                style="
                  font-size: 16px !important;
                  margin-inline-end: 10px !important;
                "
              ></v-checkbox>
            </v-col>

            <v-col cols="12" v-if="tests.length > 0">
              <v-alert
                type="info"
                variant="tonal"
                color="teal"
                border="start"
                density="compact"
              >
                <div
                  class="d-flex align-center justify-space-between flex-wrap"
                >
                  <span
                    >{{ tests.length }}
                    {{ tests.length === 1 ? "test" : "tests" }} added to this
                    exam</span
                  >
                  <span v-if="tests.length < 5" class="ml-2"
                    >Need {{ 5 - tests.length }} more
                    {{ 5 - tests.length === 1 ? "test" : "tests" }} to
                    publish</span
                  >
                  <span v-else class="ml-2 text-success"
                    >Ready to publish!</span
                  >
                </div>
              </v-alert>
              <v-progress-linear
                v-model="testProgress"
                height="8"
                color="teal"
                rounded
                class="mt-2 mb-3"
              ></v-progress-linear>
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
                          <v-chip
                            v-if="item.lesson_title"
                            size="x-large"
                            density="compact"
                            style="font-size: 13px !important"
                          >
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
                      <img :src="item.q_file" />

                      <div
                        v-if="
                          item.type == 'blank' ||
                          item.type == 'shortanswer' ||
                          item.type == 'descriptive'
                        "
                      >
                        <div ref="mathJaxEl" v-html="item.answer_full"></div>
                        <img
                          v-show="item.answer_full_file"
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
                            v-html="item.answer_a || '(Option A)'"
                            class="option-text"
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
                            v-html="item.answer_b || '(Option B)'"
                            class="option-text"
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
                            v-html="item.answer_c || '(Option C)'"
                            class="option-text"
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
                            v-html="item.answer_d || '(Option D)'"
                            class="option-text"
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
                            <v-icon color="error" size="small"
                              >mdi-delete</v-icon
                            >
                          </v-btn>
                          <v-btn icon variant="text" density="compact">
                            <v-icon color="blue" size="x-large"
                              >mdi-bullhorn-outline</v-icon
                            >
                          </v-btn>
                          <v-btn icon variant="text" density="compact">
                            <v-icon color="green" size="x-large"
                              >mdi-eye</v-icon
                            >
                          </v-btn>
                          <v-btn icon variant="text" density="compact">
                            <v-icon color="red" size="x-large"
                              >mdi-video</v-icon
                            >
                          </v-btn>
                        </v-col>
                        <v-col cols="6" class="text-right">
                          <v-btn
                            color="blue"
                            variant="flat"
                            size="small"
                            v-if="
                              !tests.some(
                                (id) => String(id) === String(item.id)
                              )
                            "
                            @click="applyTest(item, 'add')"
                          >
                            <v-icon size="small"> mdi-plus </v-icon>
                            Add
                          </v-btn>
                          <v-btn
                            color="red"
                            variant="flat"
                            size="small"
                            v-if="
                              tests.some((id) => String(id) === String(item.id))
                            "
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

            <!-- Publish button -->
            <v-col cols="12" class="mb-6">
              <v-row>
                <v-col cols="12" md="6" class="pb-0">
                  <v-btn
                    @click="handlePublish"
                    :disabled="tests.length < 5"
                    :loading="publish_loading"
                    block
                    color="teal"
                    class="text-white"
                    size="large"
                    style="
                      text-transform: none;
                      font-size: 13px;
                      font-weight: 500;
                    "
                  >
                    <span v-if="tests.length < 5"
                      >Need {{ 5 - tests.length }} more
                      {{ 5 - tests.length === 1 ? "test" : "tests" }}</span
                    >
                    <span v-else>Publish</span>
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
            <v-divider class="mt-3" />
            <v-row class="pa-0 ma-0">
              <v-col cols="12" v-if="previewTestList.length">
                <draggable
                  v-model="previewTestList"
                  @end="previewDragEnd"
                  item-key="id"
                  handle=".drag-handle"
                >
                  <template #item="{ element: item }">
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
                            v-html="item.answer_a || '(Option A)'"
                            class="option-text"
                          ></span>
                          <img v-if="item.a_file" :src="item.a_file" />
                        </div>
                        <div class="answer">
                          <span>2)</span>
                          <span
                            v-html="item.answer_b || '(Option B)'"
                            class="option-text"
                          ></span>
                          <img v-if="item.b_file" :src="item.b_file" />
                        </div>
                        <div class="answer">
                          <span>3)</span>
                          <span
                            v-html="item.answer_c || '(Option C)'"
                            class="option-text"
                          ></span>
                          <img v-if="item.c_file" :src="item.c_file" />
                        </div>
                        <div class="answer">
                          <span>4)</span>
                          <span
                            v-html="item.answer_d || '(Option D)'"
                            class="option-text"
                          ></span>
                          <img v-if="item.d_file" :src="item.d_file" />
                        </div>
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
                              v-if="
                                !tests.some(
                                  (id) => String(id) === String(item.id)
                                )
                              "
                              @click="applyTest(item, 'add')"
                            >
                              <v-icon size="small"> mdi-plus </v-icon>
                              Add
                            </v-btn>
                            <v-btn
                              color="red"
                              variant="flat"
                              size="small"
                              v-if="
                                tests.some(
                                  (id) => String(id) === String(item.id)
                                )
                              "
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
              <v-col
                v-show="!previewTestList.length"
                cols="12"
                class="text-center"
              >
                <p>Oops! no data found</p>
              </v-col>
            </v-row>

            <v-col cols="12" v-if="tests.length < 5">
              <v-alert
                type="warning"
                variant="tonal"
                color="amber-darken-2"
                border="start"
                density="compact"
                class="mb-4"
              >
                <div class="d-flex align-center">
                  <v-icon class="mr-2">mdi-alert-circle-outline</v-icon>
                  <span
                    >You need at least 5 tests to publish this exam. Currently
                    have {{ tests.length }}
                    {{ tests.length === 1 ? "test" : "tests" }}.</span
                  >
                </div>
              </v-alert>
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
                    <span v-if="tests.length < 5"
                      >Need {{ 5 - tests.length }} more
                      {{ 5 - tests.length === 1 ? "test" : "tests" }}</span
                    >
                    <span v-else>Publish</span>
                  </v-btn>
                </v-col>
                <v-col cols="12" md="6">
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
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              style="text-transform: none; font-size: 13px; font-weight: 500"
              variant="text"
              @click="printPreviewDialog = false"
            >
              Ok
            </v-btn>
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
              <v-chip
                size="large"
                density="compact"
                variant="text"
                label
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
            <v-col cols="4" v-for="(item, index) in topicTitleArr" :key="index">
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
                <template #item="{ element: item }">
                  <v-row :key="item.id">
                    <v-col cols="12">
                      <div
                        id="test-question"
                        ref="mathJaxEl"
                        v-html="item.question"
                      />
                      <img v-if="item.q_file" :src="item.q_file" />

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
                          v-html="item.answer_a || '(Option A)'"
                          class="option-text"
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
                          v-html="item.answer_b || '(Option B)'"
                          class="option-text"
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
                          v-html="item.answer_c || '(Option C)'"
                          class="option-text"
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
                          v-html="item.answer_d || '(Option D)'"
                          class="option-text"
                        ></span>
                        <img v-if="item.d_file" :src="item.d_file" />
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
                            <v-icon color="error" size="small"
                              >mdi-delete</v-icon
                            >
                          </v-btn>

                          <v-btn icon color="blue" class="drag-handle">
                            <v-icon> mdi-cursor-move </v-icon>
                          </v-btn>
                        </v-col>
                        <v-col cols="6" class="text-right">
                          <v-btn
                            color="blue"
                            variant="flat"
                            size="small"
                            v-if="
                              !tests.some(
                                (id) => String(id) === String(item.id)
                              )
                            "
                            @click="applyTest(item, 'add')"
                          >
                            <v-icon size="small"> mdi-plus </v-icon>
                            Add
                          </v-btn>
                          <v-btn
                            color="red"
                            variant="flat"
                            size="small"
                            v-if="
                              tests.some((id) => String(id) === String(item.id))
                            "
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
import { ref, reactive, watch, nextTick, onMounted, computed } from "vue";
import { useRuntimeConfig } from "nuxt/app";
import { useRoute, useRouter } from "vue-router";
import { useAuth } from "~/composables/useAuth";
import { useState } from "#app";
import { defineRule } from "vee-validate";
import { required } from "@vee-validate/rules";
import draggable from "vuedraggable";
import FormTopicSelector from "~/components/form/topic-selector.vue";
import CreateTestForm from "~/components/test-maker/create-test-form.vue";

// Get Nuxt app instance for accessing plugins like toast
const config = useRuntimeConfig();
const nuxtApp = useNuxtApp();

// Define validation rules
defineRule("required", required);

// Define layout and page metadata
definePageMeta({
  layout: "test-maker-layout",
});

useHead({
  title: "Update Exam",
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

// Default exam types in case API doesn't return any
const defaultExamTypes = [
  { id: "1", title: "Final Exam" },
  { id: "2", title: "Mid-term Exam" },
  { id: "3", title: "Quiz" },
  { id: "4", title: "Practice Test" },
  { id: "5", title: "Mock Exam" },
];

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

// Compute the progress percentage for tests added (0-100%)
const testProgress = computed(() => {
  const minRequired = 5;
  const currentCount = tests.value.length;

  // Calculate percentage, capped at 100%
  const percentage = Math.min((currentCount / minRequired) * 100, 100);

  return percentage;
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
    // If parent is empty and this is not the section type, return early
    // This prevents API calls with empty parent IDs which could return incorrect data
    if (!parent && type !== "section" && type !== "exam_type") {
      // Clear the appropriate list based on type and trigger
      if (type === "base") {
        if (trigger === "filter") filter_grade_list.value = [];
        else grade_list.value = [];
      } else if (type === "lesson") {
        if (trigger === "filter") filter_lesson_list.value = [];
        else lesson_list.value = [];
      } else if (type === "topic") {
        topic_list.value = [];
      }
      return;
    }

    const params = {
      type: type,
    };

    // Set up parameters based on type
    if (type === "base") params.section_id = parent;
    if (type === "lesson") params.base_id = parent;
    if (type === "topic") params.lesson_id = parent;
    if (type === "area") params.state_id = parent;

    if (type === "school") {
      params.section_id = form.section;
      params.area_id = form.area;
    }

    // Add loading state if needed
    const loadingTarget =
      type === "section"
        ? trigger === "filter"
          ? filter_level_list
          : level_list
        : type === "base"
        ? trigger === "filter"
          ? filter_grade_list
          : grade_list
        : type === "lesson"
        ? trigger === "filter"
          ? filter_lesson_list
          : lesson_list
        : type === "topic"
        ? topic_list
        : null;

    if (loadingTarget) {
      // Set a temporary loading item
      loadingTarget.value = [{ id: "", title: "Loading...", disabled: true }];
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
        // Make sure we're properly assigning the exam_type data
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
    console.error(`Error loading ${type} data:`, err);

    // Reset the target list to empty on error
    if (type === "section") {
      if (trigger === "filter") filter_level_list.value = [];
      else level_list.value = [];
    } else if (type === "base") {
      if (trigger === "filter") filter_grade_list.value = [];
      else grade_list.value = [];
    } else if (type === "lesson") {
      if (trigger === "filter") filter_lesson_list.value = [];
      else lesson_list.value = [];
    } else if (type === "topic") {
      topic_list.value = [];
    } else if (type === "exam_type") {
      test_type_list.value = [];
    }

    nuxtApp.$toast.error(
      `Failed to load ${type} data: ${err.message || "Unknown error"}`
    );
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

    nuxtApp.$toast.success("Exam created successfully");

    exam_id.value = response.data.id;
    exam_code.value = response.data.code;

    // Set in store
    const userState = useState("user");
    userState.value = {
      ...userState.value,
      currentExamId: exam_id.value,
      currentExamCode: exam_code.value,
    };

    // Update create form component with new exam info if it exists
    if (
      createForm.value &&
      typeof createForm.value.getCurrentExamInfo === "function"
    ) {
      createForm.value.getCurrentExamInfo();
    }

    // Move to the next step
    test_step.value = 2;
  } catch (error) {
    nuxtApp.$toast.error(
      error.response?.data?.message || "Error creating exam"
    );
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

const uploadFile = async (file_name) => {
  if (!file_original.value) return;

  let formData = new FormData();
  formData.append("file", file_original.value);

  try {
    const response = await $fetch("/api/v1/upload", {
      method: "POST",
      body: formData,
    });

    if (response.data?.[0]?.file?.name) {
      form.file_original = response.data[0].file.name;
      nuxtApp.$toast.success("File uploaded successfully");
    } else {
      nuxtApp.$toast.error("Invalid response from server");
    }
  } catch (err) {
    nuxtApp.$toast.error("Failed to upload file");
    console.error(err);
  }
};

/**
 * Publish the exam
 */
const publishTest = async () => {
  publish_loading.value = true;

  try {
    const response = await $fetch(`/api/v1/exams/publish/${exam_id.value}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${userToken.value}`,
      },
    });

    if (response.data?.message === "done") {
      // Update the test share link
      const publishedExamId = response.data.id || exam_id.value;
      
      // Navigate to publish step
      test_step.value = 4;
      
      const { $toast } = useNuxtApp();
      if ($toast) $toast.success("Exam published successfully");
    } else {
      const { $toast } = useNuxtApp();
      if ($toast) $toast.error("Failed to publish exam");
    }
  } catch (err) {
    console.error("Error publishing exam:", err);
    const { $toast } = useNuxtApp();
    if ($toast) $toast.error("Failed to publish exam");
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

/**
 * Submit test data to update the exam's tests
 * This is used after adding/removing tests
 */
const submitTest = async () => {
  if (!exam_id.value) {
    const { $toast } = useNuxtApp();
    if ($toast) $toast.error("No exam ID found");
    return;
  }

  loading.value = true;
  try {
    // Extract just the test IDs for submission
    const testIds = tests.value.map(test => test.id);
    
    // Update the tests associated with this exam
    const response = await $fetch(`/api/v1/exams/test/${exam_id.value}`, {
      method: "PUT",
      body: { tests: testIds },
      headers: {
        Authorization: `Bearer ${userToken.value}`,
      },
    });

    if (response.status === "success") {
      const { $toast } = useNuxtApp();
      if ($toast) $toast.success("Tests updated successfully");
      
      // Refresh the test list to ensure we have the latest data
      await getCurrentExamTestsInfo();
    }
  } catch (error) {
    console.error("Error updating tests:", error);
    const { $toast } = useNuxtApp();
    if ($toast) $toast.error("Failed to update tests");
  } finally {
    loading.value = false;
  }
};

// Load current tests for an exam
const getExamCurrentTests = async () => {
  if (!exam_id.value) {
    return;
  }

  test_loading.value = true;

  try {
    // Clear the preview list before fetching to avoid display issues
    previewTestList.value = [];

    const response = await $fetch(`/api/v1/examTests`, {
      method: "GET",
      params: {
        exam_id: exam_id.value,
      },
      headers: {
        Authorization: `Bearer ${userToken.value}`,
      },
    });

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
        const previewIds = previewTestList.value.map((item) => String(item.id));
        const missingIds = tests.value.filter(
          (id) => !previewIds.includes(String(id))
        );

        if (missingIds.length > 0) {
          // This is a fallback in case the API doesn't return all tests

          // Approach 1: If the preview list is empty or has fewer items than the tests array,
          // we'll construct a manual preview list from the tests array
          if (previewTestList.value.length < tests.value.length) {
            // Create a map of existing items for easy lookup
            const existingItemsMap = new Map();
            previewTestList.value.forEach((item) => {
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
                  isPlaceholder: true,
                });

                // Attempt to fetch this test's details
                fetchTestDetails(idStr)
                  .then((details) => {
                    // Find the placeholder and replace it with actual details
                    const index = previewTestList.value.findIndex(
                      (item) => item.isPlaceholder && String(item.id) === idStr
                    );

                    if (index >= 0 && details) {
                      // Vue's reactivity will update the UI when we modify the array
                      previewTestList.value[index] = details;
                    }
                  })
                  .catch((err) => {
                    console.error(
                      `Failed to fetch details for test ${idStr}:`,
                      err
                    );
                  });
              }
            }

            // Replace the preview list with our completed list
            previewTestList.value = completedList;
          }
        }
      } else {
        console.warn(
          "No tests returned from API - this might be unexpected if tests.value is not empty"
        );

        // If no tests were returned but we have tests in our array, create placeholders
        if (tests.value.length > 0) {
          // Create placeholder items for each test ID
          const placeholders = tests.value.map((id) => ({
            id: String(id),
            question: "Loading test details...",
            isPlaceholder: true,
          }));

          previewTestList.value = placeholders;

          // Try to fetch details for each test
          for (const testId of tests.value) {
            fetchTestDetails(String(testId))
              .then((details) => {
                if (details) {
                  const index = previewTestList.value.findIndex(
                    (item) => String(item.id) === String(testId)
                  );

                  if (index >= 0) {
                    previewTestList.value[index] = details;
                  }
                }
              })
              .catch((err) => {
                console.error(
                  `Failed to fetch details for test ${testId}:`,
                  err
                );
              });
          }
        } else {
          previewTestList.value = [];
        }
      }

      // Debug the preview test list
      if (previewTestList.value.length > 0) {
        const firstItem = previewTestList.value[0];
      }

      // If we have a create form reference, update its exam test list length
      if (createForm.value && "examTestListLength" in createForm.value) {
        createForm.value.examTestListLength = tests.value.length;
      }

      // Avoid chaining another API request immediately - wait a moment
      // to ensure GET request is completed separately in network tab
      if (testListSwitch.value) {
        setTimeout(() => {
          // Only refresh if not already in progress
          if (!test_loading.value) {
            filter.page = 1;
            test_list.value = [];
            all_tests_loaded.value = false;
            getExamTests();
          }
        }, 100);
      }
    }
  } catch (err) {
    console.error("Error loading tests:", err);
    nuxtApp.$toast.error("Error loading tests");
  } finally {
    test_loading.value = false;
  }
};

// Helper function to fetch details for a single test by its ID
const fetchTestDetails = async (testId) => {
  try {
    const response = await $fetch(`/api/v1/examTests/${testId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userToken.value}`,
      },
    });

    if (response && response.status === 1 && response.data) {
      return response.data;
    }

    console.warn(`No data returned for test ${testId}`);
    return null;
  } catch (err) {
    console.error(`Error fetching details for test ${testId}:`, err);
    return null;
  }
};

// Initialize flag
getExamCurrentTests.isRunning = false;

// Get current exam information
const getCurrentExamInfo = async () => {
  try {
    // Get the exam ID from the route
    exam_id.value = route.params.id;

    if (!exam_id.value) {
      console.error("No exam ID found in route parameters");
      const { $toast } = useNuxtApp();
      if ($toast) $toast.error("No exam ID found");
      return;
    }

    console.log(`Loading exam info for ID: ${exam_id.value}`);

    const response = await $fetch(`/api/v1/exams/info/${exam_id.value}`, {
      headers: {
        Authorization: `Bearer ${userToken.value}`,
      },
    });

    console.log("Exam info loaded:", response.data);

    // Set tests array from response
    if (response.data?.tests?.length) {
      tests.value = response.data.tests.map((id) => String(id));
    } else {
      tests.value = [];
    }

    // Store exam code
    exam_code.value = response.data.code;

    // Set form data in sequence to trigger proper cascading updates
    if (response.data.section) {
      form.section = response.data.section;
      // Wait for grade list to load before setting base
      await getTypeList("base", response.data.section);

      if (response.data.base) {
        form.base = response.data.base;
        // Wait for lesson list to load before setting lesson
        await getTypeList("lesson", response.data.base);

        if (response.data.lesson) {
          form.lesson = response.data.lesson;
          // Load topics based on lesson
          await getTypeList("topic", response.data.lesson);

          // Set topics if available
          if (response.data.topics && response.data.topics.length) {
            form.topics = response.data.topics;
            await getTopicTitleList();
          }
        }
      }
    }

    // Set other form fields from response
    form.title = response.data.title || "";
    form.exam_type = response.data.azmoon_type || response.data.exam_type || "";
    form.duration = response.data.azmoon_time || response.data.duration || 3;
    form.paperID = response.data.paperID || "";
    form.edu_year = parseInt(response.data.edu_year) || "";
    form.edu_month = parseInt(response.data.edu_month) || "";

    // Set file path if available
    if (response.data.file_original) {
      file_original_path.value = response.data.file_original;
    }
  } catch (err) {
    console.error("Error fetching exam info:", err);
    const { $toast } = useNuxtApp();
    if ($toast) $toast.error("Failed to load exam information");
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

/**
 * Apply or remove a test to/from the exam
 * @param {string|object} id - The test ID or test object
 * @param {string} type - 'add' or 'delete' to specify the action
 */
const applyTest = async (id, type) => {
  try {
    if (!exam_id.value) {
      const { $toast } = useNuxtApp();
      if ($toast) $toast.error("No exam ID found");
      return;
    }

    // Handle if id is an object (containing id property)
    const testId = typeof id === 'object' && id !== null ? id.id : id;
    
    // Convert ID to string for consistent comparison
    const idStr = String(testId);
    
    // Determine if we should add or remove based on type parameter or current state
    const testIndex = tests.value.findIndex(test => 
      (typeof test === 'object' ? String(test.id) : String(test)) === idStr
    );
    
    const shouldAdd = type === "add" || (type === undefined && testIndex === -1);
    
    // Store original tests for rollback if needed
    const originalTests = [...tests.value];
    
    if (shouldAdd) {
      // Add the test if it's not already in the array
      if (testIndex === -1) {
        if (typeof id === 'object') {
          tests.value.push(id);
        } else {
          tests.value.push({ id: idStr });
        }
        const { $toast } = useNuxtApp();
        if ($toast) $toast.success("Test added to exam");
      }
    } else {
      // Remove the test
      if (testIndex !== -1) {
        tests.value.splice(testIndex, 1);
        const { $toast } = useNuxtApp();
        if ($toast) $toast.success("Test removed from exam");
      }
    }
    
    // Send changes to backend
    await submitTest();
    
    // Update the test list display
    await getCurrentExamTestsInfo();
    
    // If test list is active, also refresh the main test list
    if (testListSwitch.value) {
      filter.page = 1;
      test_list.value = [];
      all_tests_loaded.value = false;
      await getExamTests();
    }
  } catch (error) {
    console.error("Error applying test:", error);
    const { $toast } = useNuxtApp();
    if ($toast) $toast.error("Failed to update test");
  }
};

// Watch for newly created tests and add them to the current exam
watch(
  () => lastCreatedTest.value,
  async (newTest) => {
    if (newTest && exam_id.value) {
      // Convert to string for consistent comparison - IDs might be numbers or strings
      const newTestId = String(newTest);

      // First check if this test is already in our list to avoid duplicates
      // Make sure we're comparing strings to strings for consistency
      if (tests.value.some((id) => String(id) === newTestId)) {
        lastCreatedTest.value = null;
        return;
      }

      // Add the new test to the tests array - association already done in child component
      tests.value.push(newTestId);

      // Reset the lastCreatedTest after processing
      lastCreatedTest.value = null;
    }
  },
  { immediate: true }
);

// Watch for changes in form.section (Board)
watch(
  () => form.section,
  async (val, oldVal) => {
    if (val) {
      // Reset dependent fields when section changes
      if (val !== oldVal) {
        form.base = "";
        form.lesson = "";
        form.topics = [];
        grade_list.value = [];
        lesson_list.value = [];
        topic_list.value = [];
        selected_topics.value = [];
      }

      // Fetch new grade list
      await getTypeList("base", val);

      // Update filter and createForm if available
      filter.section = val; // Init second level filter
      if (createForm.value && createForm.value.form) {
        createForm.value.form.section = val;
      }

      // Check if we need to fetch school list
      if (form.area) {
        await getTypeList("school");
      }
    }
  }
);

// Watch for changes in form.base (Grade)
watch(
  () => form.base,
  async (val, oldVal) => {
    if (val) {
      // Reset dependent fields when base changes
      if (val !== oldVal) {
        form.lesson = "";
        form.topics = [];
        lesson_list.value = [];
        topic_list.value = [];
        selected_topics.value = [];
      }

      // Fetch new lesson list
      await getTypeList("lesson", val);

      // Update filter and createForm if available
      filter.base = val; // Init second level filter
      if (createForm.value && createForm.value.form) {
        createForm.value.form.base = val;
      }

      // Generate title based on new base value
      generateTitle();
    }
  }
);

// Watch for changes in form.lesson (Subject)
watch(
  () => form.lesson,
  async (val, oldVal) => {
    if (val) {
      // Reset topic when lesson changes
      if (val !== oldVal) {
        form.topics = [];
        topic_list.value = [];
        selected_topics.value = [];
      }

      // Fetch new topic list
      await getTypeList("topic", val);

      // Update topic selector if available
      if (topicSelector.value) {
        topicSelector.value.lesson_selected = true;
      }
    } else {
      // Reset topics when lesson is cleared
      form.topics = [];
      topic_list.value = [];

      // Update topic selector if available
      if (topicSelector.value) {
        topicSelector.value.lesson_selected = false;
      }
    }

    // Update filter and createForm if available
    filter.lesson = val; // Init second level filter
    if (createForm.value && createForm.value.form) {
      createForm.value.form.lesson = val;
    }

    // Generate title based on new lesson value
    generateTitle();
  }
);

// Watch for changes in filter.section
watch(
  () => filter.section,
  async (val, oldVal) => {
    if (val) {
      test_loading.value = true;
      // Reset dependent filters
      filter.base = "";
      filter.lesson = "";
      filter_grade_list.value = [];
      filter_lesson_list.value = [];

      // Fetch new grade list for filter
      await getTypeList("base", val, "filter");
      test_loading.value = false;
    } else {
      // Clear grade and lesson lists when section is cleared
      filter_grade_list.value = [];
      filter_lesson_list.value = [];
    }

    // Reset pagination and test list
    all_tests_loaded.value = true;
    filter.page = 1;
    test_list.value = [];
  }
);

// Watch for changes in filter.base
watch(
  () => filter.base,
  async (val, oldVal) => {
    if (val) {
      test_loading.value = true;
      // Reset dependent filters
      filter.lesson = "";
      filter_lesson_list.value = [];

      // Fetch new lesson list for filter
      await getTypeList("lesson", val, "filter");
      test_loading.value = false;
    } else {
      // Clear lesson list when base is cleared
      filter_lesson_list.value = [];
    }

    // Reset pagination and test list
    all_tests_loaded.value = true;
    filter.page = 1;
    test_list.value = [];
  }
);

// Watch for changes in filter.lesson (Subject)
watch(
  () => filter.lesson,
  async (val) => {
    // Reset topic filter when lesson changes
    filter.topic = "";

    if (val) {
      test_loading.value = true;
      // Fetch topic list based on selected lesson
      await getTypeList("topic", val, "filter");
      test_loading.value = false;
    } else {
      // Clear topic list when lesson is cleared
      topic_list.value = [];
    }

    // Reset pagination and test list
    filter.page = 1;
    test_list.value = [];
    all_tests_loaded.value = false;

    // Load tests with new filter
    getExamTests();
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

// Initialize component on mount
onMounted(async () => {
  loading.value = true;
  try {
    await refreshPageData();
    await getCurrentExamInfo();
    await getCurrentExamTestsInfo();
    
    if (testListSwitch.value) {
      await getExamTests();
    }
    
    test_step.value = parseInt(route.query.step) || 2;
    if (route.query.active === "test_list") {
      testListSwitch.value = true;
    }
    
    if (createForm.value) {
      createForm.value.examEditMode = true;
      if (tests.value.length > 0 && "examTestListLength" in createForm.value) {
        createForm.value.examTestListLength = tests.value.length;
      }
    }
    
    updatedExam.value = false;
    
    const { $toast } = useNuxtApp();
    if ($toast) $toast.info("Editing the exam");
  } catch (error) {
    console.error("Error initializing page:", error);
    const { $toast } = useNuxtApp();
    if ($toast) $toast.error("Failed to load exam data");
  } finally {
    loading.value = false;
  }
});

/**
 * Refresh all page data
 */
const refreshPageData = async () => {
  // Clear existing data
  tests.value = [];
  previewTestList.value = [];
  test_list.value = [];
  
  // Get user token
  userToken.value = auth.getUserToken();
  
  // Reset pagination
  filter.page = 1;
  all_tests_loaded.value = false;
};

// Open delete confirmation dialog
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
      
      // Use the submitTest function to update the backend
      await submitTest();
      
      const { $toast } = useNuxtApp();
      if ($toast) $toast.success("Test deleted successfully");
      
      // Refresh test lists
      filter.page = 1;
      test_list.value = [];
      getExamTests();
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

    // Update createForm if it exists and has examTestListLength property
    if (createForm.value && "examTestListLength" in createForm.value) {
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

/**
 * Delete the entire exam
 */
const deleteOnlineExam = async () => {
  deleteLoading.value = true;
  
  try {
    await $fetch(`/api/v1/exams/${exam_id.value}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${userToken.value}`,
      },
    });
    
    const { $toast } = useNuxtApp();
    if ($toast) $toast.success("Exam deleted successfully");
    
    // Redirect to the exam list
    router.push("/user/exam");
  } catch (err) {
    console.error("Error deleting exam:", err);
    const { $toast } = useNuxtApp();
    if ($toast) $toast.error("Failed to delete exam");
  } finally {
    deleteLoading.value = false;
    confirmDeleteDialog.value = false;
  }
};

// Form validation helper
const validateHeaderForm = () => {
  // Check required fields
  if (!form.section) {
    nuxtApp.$toast.error("Board is required");
    return false;
  }

  if (!form.base) {
    nuxtApp.$toast.error("Grade is required");
    return false;
  }

  if (!form.lesson) {
    nuxtApp.$toast.error("Subject is required");
    return false;
  }

  if (!form.topics || form.topics.length === 0) {
    nuxtApp.$toast.error("Please select at least one topic");
    return false;
  }

  if (!form.title) {
    nuxtApp.$toast.error("Title is required");
    return false;
  }

  if (!form.duration) {
    nuxtApp.$toast.error("Test duration is required");
    return false;
  }

  return true;
};

/**
 * Handle stepper navigation with validation for different steps
 * @param {number} newStep - The step number to navigate to
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

/**
 * Reset form fields to initial state
 */
const resetForm = () => {
  // Reset all form fields
  form.section = "";
  form.base = "";
  form.lesson = "";
  form.topics = [];
  form.exam_type = "";
  form.level = "2";
  form.holding_time = false;
  form.state = "";
  form.area = "";
  form.school = "";
  form.duration = 3;
  form.title = "";
  form.negative_point = false;
  form.file_original = "";
  form.paperID = "";
  form.edu_year = "";
  form.edu_month = "";

  // Reset data lists that are dependent on form fields
  grade_list.value = [];
  lesson_list.value = [];
  topic_list.value = [];

  // Reset file inputs
  file_original.value = null;
  file_original_path.value = "";
};

/**
 * Reset all data (used after deletion)
 */
const resetAllData = () => {
  // Reset form
  resetForm();

  // Reset exam data
  exam_id.value = "";
  exam_code.value = "";

  // Reset tests
  tests.value = [];
  previewTestList.value = [];

  // Reset state in user store
  const userState = useState("user");
  userState.value = {
    ...userState.value,
    currentExamId: "",
    currentExamCode: "",
  };
};

// Add a new function to help users understand how many tests are needed
const goToNextStep = () => {
  if (tests.value.length < 5) {
    nuxtApp.$toast.warning(
      `You need at least 5 tests to proceed. Currently have ${
        tests.value.length
      }. Add ${5 - tests.value.length} more.`
    );
    return;
  }

  test_step.value = 3;
  nuxtApp.$toast.success("Moving to Review step");
};

/**
 * Check if exam is ready to be published
 */
const checkPublishReadiness = () => {
  if (tests.value.length < 5) {
    nuxtApp.$toast.error(
      `You need at least 5 tests to publish. Currently have ${tests.value.length}`
    );
    return false;
  }
  return true;
};

/**
 * Wrapper for publish function with validation
 */
const handlePublish = () => {
  if (checkPublishReadiness()) {
    publishTest();
  }
};

/**
 * Render MathJax on the page
 * This function processes math notation in elements with the mathJaxEl ref
 */
const renderMathJax = () => {
  // Disable MathJax rendering completely for now
  return;

  if (window.MathJax) {
    window.MathJax.Hub.Config({
      tex2jax: {
        inlineMath: [
          ["$", "$"],
          ["(", ")"],
        ],
        displayMath: [
          ["$$", "$$"],
          ["[", "]"],
        ],
        processEscapes: true,
        processEnvironments: true,
      },
      displayAlign: "center",
      "HTML-CSS": {
        styles: { ".MathJax_Display": { margin: 0 } },
        linebreaks: { automatic: true },
        availableFonts: ["Asana Math"],
        preferredFont: "Asana Math",
        webFont: "Asana Math-Web",
        imageFont: null,
      },
    });

    window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, mathJaxEl.value]);
  }
};

// Change from ref to computed
const test_share_link = computed(() => {
  if (process.server) {
    return `https://gamatrain.com/exam/${exam_id.value || ""}`;
  }
  return `${window.location.origin}/exam/${exam_id.value || ""}`;
});

// Add a watcher for the clear icon (X) clicks on filter.section (Board)
watch(
  () => filter.section,
  (val, oldVal) => {
    // If the value was cleared (X icon clicked)
    if (oldVal && !val) {
      // Clear dependent filters and their lists
      filter.base = "";
      filter.lesson = "";
      filter.topic = "";
      filter_grade_list.value = [];
      filter_lesson_list.value = [];
      topic_list.value = [];

      // Reset pagination and test list
      filter.page = 1;
      test_list.value = [];
      all_tests_loaded.value = true;
    }
  }
);

// Add a watcher for the clear icon (X) clicks on filter.base (Grade)
watch(
  () => filter.base,
  (val, oldVal) => {
    // If the value was cleared (X icon clicked)
    if (oldVal && !val) {
      // Clear dependent filters and their lists
      filter.lesson = "";
      filter.topic = "";
      filter_lesson_list.value = [];
      topic_list.value = [];

      // Reset pagination and test list
      filter.page = 1;
      test_list.value = [];
      all_tests_loaded.value = true;
    }
  }
);

// Handle clear icon click for Board filter
const handleClearSection = () => {
  filter.section = "";
  filter.base = "";
  filter.lesson = "";
  filter.topic = "";
  filter_grade_list.value = [];
  filter_lesson_list.value = [];
  topic_list.value = [];

  // Reset pagination and test list
  filter.page = 1;
  test_list.value = [];
  all_tests_loaded.value = true;
};

// Handle clear icon click for Grade filter
const handleClearBase = () => {
  filter.base = "";
  filter.lesson = "";
  filter.topic = "";
  filter_lesson_list.value = [];
  topic_list.value = [];

  // Reset pagination and test list
  filter.page = 1;
  test_list.value = [];
  all_tests_loaded.value = true;
};

// Handle clear icon click for Subject filter
const handleClearLesson = () => {
  filter.lesson = "";
  filter.topic = "";
  topic_list.value = [];

  // Reset pagination and test list
  filter.page = 1;
  test_list.value = [];
  all_tests_loaded.value = true;
};

// Handle clear icon click for Topic filter
const handleClearTopic = () => {
  filter.topic = "";

  // Reset pagination and test list
  filter.page = 1;
  test_list.value = [];
  all_tests_loaded.value = false;

  // Load tests with new filter
  getExamTests();
};

/**
 * Specifically load exam types with better error handling
 */
const loadExamTypes = async () => {
  try {
    // First try to get exam types from the API
    const res = await $fetch("/api/v1/types/list", {
      method: "GET",
      params: { type: "exam_type" },
      headers: {
        Authorization: `Bearer ${userToken.value}`,
      },
    });

    if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
      test_type_list.value = res.data;
    } else {
      // If API returned no data, use fallback
      test_type_list.value = defaultExamTypes;
    }
  } catch (err) {
    // Use fallback in case of error
    test_type_list.value = defaultExamTypes;
  }
};

/**
 * Handle drag end event for reordering preview items
 * This is called when the user finishes dragging/reordering tests in the preview dialog
 */
const previewDragEnd = async () => {
  // Extract IDs from the reordered preview list
  const new_list = [];
  for (const index in previewTestList.value) {
    new_list.push(previewTestList.value[index].id);
  }

  // Update the tests array with the new order
  tests.value = new_list;

  // Submit the reordered tests to the backend and refresh the preview list
  await submitTest();
};

/**
 * Refresh test list data
 */
const handleTestRefresh = async () => {
  try {
    // Clear all tests and show loading state
    test_list.value = [];
    all_tests_loaded.value = false;
    loading.value = true;

    // Reset pagination
    filter.page = 1;

    // Small delay to ensure UI updates
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Ensure all tests are represented as strings
    tests.value = tests.value.map((test) => 
      typeof test === 'object' ? test : { id: String(test) }
    );

    // Update exam tests information
    await getCurrentExamTestsInfo();

    // Update create form test count
    if (createForm.value && "examTestListLength" in createForm.value) {
      createForm.value.examTestListLength = tests.value.length;
    }

    // If test list is active, also refresh the main test list
    if (testListSwitch.value) {
      filter.page = 1;
      test_list.value = [];
      all_tests_loaded.value = false;
      await getExamTests();
    }

    // Show success message
    const { $toast } = useNuxtApp();
    if ($toast) $toast.success(`Tests updated: ${tests.value.length} tests in exam`);
  } catch (err) {
    console.error("Error in handleTestRefresh:", err);
    const { $toast } = useNuxtApp();
    if ($toast) $toast.error("Error refreshing test list");
  } finally {
    loading.value = false;
  }
};

const updateQuestion = async () => {
  try {
    submit_loading.value = true;

    console.log("Starting exam update for ID:", exam_id.value);

    // Validate form (basic validation before submission)
    if (!validateHeaderForm()) {
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
        Authorization: `Bearer ${userToken.value}`,
      },
    });

    console.log("Update response:", response);

    const { $toast } = useNuxtApp();
    if ($toast) $toast.success("Exam updated successfully");

    // Move to the next step
    test_step.value = 2;

    // Add a small delay before getting updated tests list
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Get updated tests list
    await getCurrentExamTestsInfo();
  } catch (error) {
    console.error("Error updating exam:", error);
    const { $toast } = useNuxtApp();
    if ($toast)
      $toast.error(error.response?.data?.message || "Error updating exam");
  } finally {
    submit_loading.value = false;
  }
};

/**
 * Fetch current exam's test information from the API
 */
const getCurrentExamTestsInfo = async () => {
  if (!exam_id.value) {
    const { $toast } = useNuxtApp();
    if ($toast) $toast.error("No exam ID found");
    return;
  }

  loading.value = true;
  try {
    const res = await $fetch(`/api/v1/exams/test/${exam_id.value}`, {
      headers: {
        Authorization: `Bearer ${userToken.value}`,
      },
    });

    if (res.data && Array.isArray(res.data)) {
      // Clear existing tests first
      tests.value = [];
      
      // Update the tests with the data from API
      tests.value = res.data.map(test => ({
        ...test,
        id: String(test.id) // Ensure ID is a string for consistent comparison
      }));
      
      // Update preview list
      previewTestList.value = [...tests.value];
      
      // If we have tests, we're ready to continue
      if (tests.value.length > 0) {
        const { $toast } = useNuxtApp();
        if ($toast) $toast.info(`Loaded ${tests.value.length} tests for this exam`);
      }
    }
  } catch (error) {
    console.error("Error fetching exam tests:", error);
    const { $toast } = useNuxtApp();
    if ($toast) $toast.error("Failed to load exam tests");
  } finally {
    loading.value = false;
  }
};

// Add this with your other refs
const loading = ref(false);
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
