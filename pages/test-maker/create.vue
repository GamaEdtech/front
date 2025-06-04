<template>
  <v-container class="create-test-container">
    <v-row class="mt-4">
      <v-col cols="6">
        <h1 class="text-h4 text-teal">New Exam</h1>
      </v-col>
      <v-col cols="6" id="tool-box" class="text-right">
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
        {
          title: 'Publish',
          value: 4,
          disabled: !isExamPublished || tests.length < 5,
        },
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
                  autocomplete="off"
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
                  autocomplete="off"
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
                  autocomplete="off"
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
                  autocomplete="off"
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
                  autocomplete="off"
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
                  autocomplete="off"
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
                  autocomplete="off"
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
                  autocomplete="off"
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
                  autocomplete="off"
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
                  autocomplete="off"
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
                      autocomplete="off"
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
                  <span v-if="tests.length > 5 && exam_id" class="ml-2 text-success"
                    >Ready to publish!</span
                  >
                  <span v-else class="ml-2 text-success"
                    >Please First Create an Exam</span
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
              <CreateTestForm
                ref="createForm"
                :goToPreviewStep="test_step"
                :updateTestList="lastCreatedTest"
                :examEditMode="true"
                @update:updateTestList="(val) => (lastCreatedTest = val)"
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
                autocomplete="off"
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
                autocomplete="off"
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
                autocomplete="off"
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
                autocomplete="off"
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
                autocomplete="off"
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
                autocomplete="off"
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
                  <span v-if="tests.length > 5" class="ml-2 text-success"
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
                  <v-row  ref="mathJaxStep2ListContainerRef">
                    <v-col
                      v-for="item in test_list"
                      :key="item.id"
                      cols="12"
                      v-show="test_list.length > 0"
                    >
                      <v-row class="mb-2" >
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
                            size="x-large"
                            density="compact"
                            style="
                              font-size: 13px !important;
                              margin-inline-start: 5px !important;
                            "
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
                        <div  v-html="item.answer_full"></div>
                        <img
                          v-show="item.answer_full_file"
                          :src="item.answer_full_file"
                        />
                      </div>
                      <div v-else>
                        <div class="answer">
                          <v-icon
                            v-show="item.true_answer == '1'"
                            class="true_answer"
                            size="large"
                          >
                            mdi-check
                          </v-icon>
                          <span>1)</span>
                          <span
                            v-show="item.answer_a"
                            v-html="item.answer_a"
                          ></span>
                          <img v-show="item.a_file" :src="item.a_file" />
                        </div>
                        <div class="answer">
                          <v-icon
                            v-show="item.true_answer == '2'"
                            class="true_answer"
                            size="large"
                          >
                            mdi-check
                          </v-icon>
                          <span>2)</span>
                          <span
                            v-show="item.answer_b"
                            v-html="item.answer_b"
                          ></span>
                          <img v-show="item.b_file" :src="item.b_file" />
                        </div>
                        <div class="answer">
                          <v-icon
                            v-show="item.true_answer == '3'"
                            class="true_answer"
                            size="large"
                          >
                            mdi-check
                          </v-icon>
                          <span>3)</span>
                          <span      
                            v-show="item.answer_c"
                            v-html="item.answer_c"
                          ></span>
                          <img v-show="item.c_file" :src="item.c_file" />
                        </div>
                        <div class="answer">
                          <v-icon
                            v-show="item.true_answer == '4'"
                            class="true_answer"
                            size="large"
                          >
                            mdi-check
                          </v-icon>
                          <span>4)</span>
                          <span       
                            v-show="item.answer_d"
                            v-html="item.answer_d"
                          ></span>
                          <img v-show="item.d_file" :src="item.d_file" />
                        </div>
                      </div>
                      <v-row>
                        <v-col cols="6">
                          <v-btn
                            icon
                            variant="text"
                            density="compact"
                            :to="`/test-maker/create-test/edit/${item.id}`"
                            v-if="item.owner == true"
                            style="text-transform: none; font-size: 13px"
                          >
                            <v-icon >mdi-pencil</v-icon>
                          </v-btn>
                          <v-btn
                            icon
                            variant="text"
                            density="compact"
                            v-if="item.owner == true"
                            @click="openTestDeleteConfirmDialog(item.id)"
                            style="text-transform: none; font-size: 13px"
                          >
                            <v-icon color="error"
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
                            density="compact"
                            size="large"
                            style="text-transform: none; font-size: 13px;"
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
                            density="compact"
                            size="large"
                            style="text-transform: none; font-size: 13px;"
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
                      v-show="!all_tests_loaded"
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

            <v-col cols="12" class="mb-6">
              <v-row>
                <v-col cols="12" md="6" class="pb-0">
                  <v-btn
                    @click="test_step = 3"
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
                    <span v-show="tests.length < 5"
                      >Add at least {{ 5 - tests.length }} more tests</span
                    >
                    <span v-show="tests.length >= 5">Next step</span>
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
        <v-card flat class="pb-10 test-list">
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
                  size="x-large"
                  label
                  variant="outlined"
                  rounded
                  density="compact"
                  class="text-white"
                  style="
                    background-color: #b30a29;
                    font-size: 15px;
                  "
                >
                  Topics:
                </v-chip>
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
            <v-row ref="mathJaxStep3ReviewContainerRef">
              <v-col cols="12" v-show="previewTestList.length">
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
                          v-html="item.question"
                        />
                        <img :src="item.q_file" />

                        <div
                          v-if="
                            item.type == 'blank' ||
                            item.type == 'shortanswer' ||
                            item.type == 'descriptive'
                          "
                        >
                          <div  v-html="item.answer_full" />
                          <img
                            v-show="item.answer_full_file"
                            :src="item.answer_full_file"
                          />
                        </div>
                        <div v-else>
                          <div class="answer">
                            <span>1)</span>
                            <span
                              
                              v-show="item.answer_a"
                              v-html="item.answer_a"
                            ></span>
                            <img v-show="item.a_file" :src="item.a_file" />
                          </div>
                          <div class="answer">
                            <span>2)</span>
                            <span
                              
                              v-show="item.answer_b"
                              v-html="item.answer_b"
                            ></span>
                            <img v-show="item.b_file" :src="item.b_file" />
                          </div>
                          <div class="answer">
                            <span>3)</span>
                            <span
                              
                              v-show="item.answer_c"
                              v-html="item.answer_c"
                            ></span>
                            <img v-show="item.c_file" :src="item.c_file" />
                          </div>
                          <p class="answer">
                            <span>4)</span>
                            <span
                              
                              v-show="item.answer_d"
                              v-html="item.answer_d"
                            />
                            <img v-show="item.d_file" :src="item.d_file" />
                          </p>
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
                              density="compact"
                              size="large"
                              v-show="item.owner == true"
                              :to="`/test-maker/create-test/edit/${item.id}`"
                              style="text-transform: none; font-size: 13px"
                            >
                              <v-icon size="small"> mdi-pencil </v-icon>
                              Edit
                            </v-btn>
                            <v-btn
                              color="blue"
                              density="compact"
                              size="large"
                              v-if="!tests.find((x) => x == item.id)"
                              @click="applyTest(item, 'add')"
                              style="text-transform: none; font-size: 13px"
                            >
                              <v-icon size="large"> mdi-plus </v-icon>
                              Add
                            </v-btn>
                            <v-btn
                              color="red"
                              density="compact"
                              size="large"
                              v-if="tests.find((x) => x == item.id)"
                              @click="applyTest(item, 'remove')"
                              style="text-transform: none; font-size: 13px; margin-inline: 5px"
                            >
                              <v-icon size="large"> mdi-minus </v-icon>
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

            <!--Publish button-->
            <v-row>
              <v-col cols="12">
                <v-row>
                  <v-col cols="12" md="6" class="pb-0">
                    <v-btn
                      @click="publishTest"
                      :disabled="tests.length < 5"
                      :loading="publish_loading"
                      size="large"
                      density="compact"
                      color="teal"
                      class="white--text"
                      block
                      style="text-transform: none; font-size: 13px !important"
                    >
                      <span v-show="tests.length < 5"
                        >Add at least {{ 5 - tests.length }} more tests</span
                      >
                      <span v-show="tests.length >= 5">Publish</span>
                    </v-btn>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-btn
                      size="large"
                      variant="outlined"
                      density="compact"
                      color="error"
                      to="/user/exam"
                      block
                      style="font-size: 13px !important; text-transform: none"
                    >
                      Discard
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <!--End publish button-->
          </v-card-text>
        </v-card>
      </template>

      <template #[`item.4`]>
        <v-card flat class="mt-3 pb-10">
          <v-card-text class="text-center">
            <p class="font-weight-bold text-teal mb-3">
              Your test is ready to use!
            </p>
            <p class="font-weight-normal text-grey font-size-16">
              Send below link to your students or friends.
            </p>

            <div class="d-flex justify-center my-4">
              <v-text-field
                v-model="test_share_link"
                variant="outlined"
                density="compact"
                readonly
                style="max-width: 350px"
                class="mx-auto textFiledLink"
                :rounded="false"
                autocomplete="off"
              >
                <template #append-inner>
                  <v-btn icon variant="plain" @click="copyUrl">
                    <v-icon>mdi-content-copy</v-icon>
                  </v-btn>
                </template>
              </v-text-field>
            </div>

            <p class="mt-2 font-weight-normal font-size-16 text-grey">
              To view the results of the participants, go to the following path:
            </p>

            <v-breadcrumbs
              :items="[
                { title: 'Dashboard', href: '/user' },
                { title: 'My online exam', href: '/exam/results' },
              ]"
              class="justify-center mt-2 mb-2 font-size-16"
              color="gray"
            >
              <template #divider>
                <v-icon> mdi-chevron-right </v-icon>
              </template>
            </v-breadcrumbs>
            <v-divider class="mt-2 mb-2" thickness="3" color="gray"></v-divider>
          </v-card-text>
        </v-card>
      </template>
    </v-stepper-vertical>

    <v-row justify="center">
      <v-dialog
        v-model="printPreviewDialog"
        fullscreen
        transition="dialog-bottom-transition"
      >
        <v-card class="test-list">
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
          <v-card-text ref="mathJaxPrintDialogContainerRef" id="preview-dialog">
            <v-row>
              <v-col cols="12">
                <p class="text-h4 font-weight-bold">{{ form.title }}</p>
              </v-col>
              <v-col cols="4">Question's num: {{ tests.length }}</v-col>
              <v-col cols="4">Duration: {{ form.duration }}</v-col>
              <v-col cols="4">Level: {{ calcLevel(form.level) }}</v-col>
              <v-col cols="12">
                <v-chip
                  size="x-large"
                  label
                  variant="outlined"
                  rounded
                  density="compact"
                  class="text-white"
                  style="
                    background-color: #b30a29;
                    font-size: 15px;
                  "
                >
                  Topics:
                </v-chip>
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
            <v-row ref="mathJaxPrintDialogContainerRef">
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
                          v-html="item.question"
                        />
                        <img :src="item.q_file" />

                        <div
                          v-if="
                            item.type == 'blank' ||
                            item.type == 'shortanswer' ||
                            item.type == 'descriptive'
                          "
                        >
                          <div  v-html="item.answer_full" />
                          <img
                            v-show="item.answer_full_file"
                            :src="item.answer_full_file"
                          />
                        </div>
                        <div v-else>
                          <div class="answer">
                            <span>1)</span>
                            <span
                              v-show="item.answer_a"
                              v-html="item.answer_a"
                            ></span>
                            <img v-show="item.a_file" :src="item.a_file" />
                          </div>
                          <div class="answer">
                            <span>2)</span>
                            <span
                              v-show="item.answer_b"
                              v-html="item.answer_b"
                            ></span>
                            <img v-show="item.b_file" :src="item.b_file" />
                          </div>
                          <div class="answer">
                            <span>3)</span>
                            <span    
                              v-show="item.answer_c"
                              v-html="item.answer_c"
                            ></span>
                            <img v-show="item.c_file" :src="item.c_file" />
                          </div>
                          <p class="answer">
                            <span>4)</span>
                            <span
                              v-show="item.answer_d"
                              v-html="item.answer_d"
                            />
                            <img v-show="item.d_file" :src="item.d_file" />
                          </p>
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
                              density="compact"
                              size="large"
                              v-show="item.owner == true"
                              :to="`/test-maker/create-test/edit/${item.id}`"
                              style="text-transform: none; font-size: 13px"
                            >
                              <v-icon size="large"> mdi-pencil </v-icon>
                              Edit
                            </v-btn>
                            <v-btn
                              color="blue"
                              density="compact"
                              size="large"
                              v-if="!tests.find((x) => x == item.id)"
                              @click="applyTest(item, 'add')"
                            >
                              <v-icon size="large"> mdi-plus </v-icon>
                              Add
                            </v-btn>
                            <v-btn
                              color="red"
                              density="compact"
                              size="large"
                              v-if="tests.find((x) => x == item.id)"
                              @click="applyTest(item, 'remove')"
                              style="text-transform: none; font-size: 13px; margin-inline: 5px"
                            >
                              <v-icon size="large"> mdi-minus </v-icon>
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
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>
    <v-row>
      <v-dialog v-model="confirmDeleteDialog" persistent max-width="290">
        <v-card class="px-5 py-3">
          <v-card-title class="text-h5 px-0" style="font-size: 13px; word-break: break-word; white-space: normal;">
            Are you sure of deleting the online exam?
          </v-card-title>
          <v-card-text class="px-0 py-1 " style="font-size: 11px; word-break: break-word; white-space: normal; color: rgba(0, 0, 0, 0.6);">
            If you are sure about the deletion, click Agree button.
          </v-card-text>
          <v-card-actions style="min-height: 35px !important; padding: 0px !important;">
            <v-btn text color="error" @click="confirmDeleteDialog = false" style="text-transform: none; font-size: 13px"> Disagree </v-btn>
            <v-btn
              color="green darken-1"
              text
              :loading="deleteLoading"
              @click="deleteOnlineExam"
              style="text-transform: none; font-size: 13px"
            >
              Agree
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <!--Delete exam test confirm dialog-->
    <v-dialog v-model="deleteTestConfirmDialog" max-width="290" persistent >
      <v-card class="pa-0">
        <v-card-title class="mt-2 text-h5" style="font-size: 13px">
          Are you sure?
        </v-card-title>

        <v-card-text>
          <p style="color: rgba(0, 0, 0, 0.6); font-size: 13px">
            If you are sure to delete, click Yes.
          </p>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            text
            @click="deleteTestConfirmDialog = false"
            style="text-transform: none; font-size: 13px"
          >
            No
          </v-btn>

          <v-btn
            color="green darken-1"
            text
            :loading="delete_exam_test_loading"
            @click="deleteExamTest()"
            style="text-transform: none; font-size: 13px"
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
import { useNuxtApp } from '#app'; 
import { defineRule } from "vee-validate";
import { required } from "@vee-validate/rules";
import draggable from "vuedraggable";
import FormTopicSelector from "~/components/form/topic-selector.vue";
import CreateTestForm from "~/components/test-maker/create-test-form.vue";

// Get Nuxt app instance for accessing plugins like toast
const config = useRuntimeConfig();
const nuxtApp = useNuxtApp();
const { $renderMathInElement, $ensureMathJaxReady } = useNuxtApp();

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
const isExamPublished = ref(false); // Track if the exam has been published

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

// MathJax refs
const mathJaxStep2ListContainerRef = ref()
const mathJaxStep3ReviewContainerRef = ref()
const mathJaxPrintDialogContainerRef = ref() 
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

const publishTest = async () => {
  publish_loading.value = true;

  try {
    const response = await $fetch(`/api/v1/exams/publish/${exam_id.value}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${userToken.value}`,
      },
    });

    if (response.status === 1) {
      // Store the published exam ID for share link
      const publishedExamId = response.data.id || exam_id.value;

      // Reset state
      exam_id.value = "";
      exam_code.value = "";

      // Update store
      const userState = useState("user");
      userState.value = {
        ...userState.value,
        currentExamId: "",
        currentExamCode: "",
      };

      // Update the test share link
      exam_id.value = publishedExamId;

      // Reset data
      previewTestList.value = [];
      tests.value = [];

      // Mark exam as published
      isExamPublished.value = true;

      // Clear form data
      resetForm();

      // Navigate to publish step
      test_step.value = 4;

      nuxtApp.$toast.success("Exam published successfully");
    }
  } catch (err) {
    nuxtApp.$toast.error(err.message || "Error publishing exam");
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
const submitTest = async (skipListRefresh = false) => {
  try {
    if (!tests.value.length) {
      return;
    }

    // Ensure we have a valid exam ID
    if (!exam_id.value) {
      console.error("No exam ID available, cannot submit tests");
      nuxtApp.$toast.error("No exam ID available");
      return;
    }

    const formData = new URLSearchParams();
    tests.value.forEach((id) => {
      formData.append("tests[]", String(id));
    });

    await $fetch(
      `/api/v1/exams/tests/${exam_id.value}`,
      {
        method: "PUT",
        body: formData.toString(),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          Authorization: `Bearer ${userToken.value}`,
        },
      }
    );
    await new Promise((resolve) => setTimeout(resolve, 300));
    await handleRefreshPreviewList();
    
    if (createForm.value && "examTestListLength" in createForm.value) {
      createForm.value.examTestListLength = tests.value.length;
    }
  } catch (err) {
    console.error("Failed to update tests:", err);
    nuxtApp.$toast.error("Failed to update tests");
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
    console.warn(`No data returned for test ${testId} from fetchTestDetails`);
    return null;
  } catch (err) {
    console.error(`Error fetching details for test ${testId}:`, err);
    return null;
  }
};

// New unified function to load and refresh the preview list
const handleRefreshPreviewList = async () => {
  if (!exam_id.value) {
    previewTestList.value = [];
    if (createForm.value && "examTestListLength" in createForm.value) {
        createForm.value.examTestListLength = 0;
    }
    return;
  }

  test_loading.value = true;
  try {
    const currentTestIds = tests.value.map(id => String(id));

    if (currentTestIds.length === 0) {
      previewTestList.value = [];
      if (createForm.value && "examTestListLength" in createForm.value) {
        createForm.value.examTestListLength = 0;
      }
      test_loading.value = false;
      return;
    }

    const response = await $fetch(`/api/v1/examTests`, {
      method: "GET",
      params: { exam_id: exam_id.value }, // This should fetch all tests linked to the exam
      headers: { Authorization: `Bearer ${userToken.value}` },
    });

    let fetchedApiTests = [];
    if (response && response.status === 1) {
      fetchedApiTests = Array.isArray(response.data) ? response.data : (response.data?.list || []);
    }

    const fetchedDetailsMap = new Map(
      fetchedApiTests.map(test => [String(test.id), test])
    );

    const newPreviewListConstructionPromises = currentTestIds.map(async (testId) => {
      if (fetchedDetailsMap.has(testId)) {
        return fetchedDetailsMap.get(testId);
      } else {
        // Test is in local `tests.value` but not in the bulk API response.
        // This could be a newly added test not yet fully reflected, or an orphaned ID.
        // Attempt to fetch its details directly.
        console.warn(`Test ${testId} was in local tests.value but not in bulk API response. Fetching individually.`);
        const individualDetails = await fetchTestDetails(testId);
        if (individualDetails) {
          return individualDetails;
        } else {
          // If even individual fetch fails, create a placeholder indicating an issue.
          console.error(`Failed to fetch details for ${testId} even individually. Creating placeholder.`);
          return { id: testId, question: `Issue loading test ${testId}`, type: 'error', isPlaceholder: true, owner: true }; // Assuming owner if it's in tests.value
        }
      }
    });

    const constructedList = (await Promise.all(newPreviewListConstructionPromises)).filter(Boolean);

    // Ensure the order of previewTestList matches tests.value
    previewTestList.value = currentTestIds.map(id => {
        return constructedList.find(test => String(test.id) === id);
    }).filter(Boolean); // Clean out any nulls if a test somehow failed all fetches

  } catch (err) {
    console.error("Error in handleRefreshPreviewList during API call:", err);
    nuxtApp.$toast.error("Error refreshing preview list.");
    // Fallback: If the main API call itself fails, try to build from tests.value with placeholders
    if (tests.value.length > 0 && previewTestList.value.length === 0) {
        const fallbackPromises = tests.value.map(async (id) => {
            const details = await fetchTestDetails(String(id));
            return details || { id: String(id), question: `Loading error for ${id}`, type: 'error', isPlaceholder: true, owner: true };
        });
        previewTestList.value = (await Promise.all(fallbackPromises)).filter(Boolean);
    }
  } finally {
    test_loading.value = false;
    if (createForm.value && "examTestListLength" in createForm.value) {
        createForm.value.examTestListLength = tests.value.length;
    }
  }
};

// Get current exam information
const getCurrentExamInfo = async () => {
  // Check if we have an exam ID in the user state
  const userState = useState("user");

  if (userState.value?.currentExamId) {
    exam_id.value = userState.value.currentExamId;
    exam_code.value = userState.value.currentExamCode;

    // Move to step 2 for tests
    test_step.value = 2;

    try {
      const response = await $fetch(`/api/v1/exams/info/${exam_id.value}`, {
        headers: {
          Authorization: `Bearer ${userToken.value}`,
        },
      });

      // Set tests array from response
      if (response.data?.tests?.length) {
        tests.value = response.data.tests.map(id => String(id)); // Ensure string IDs
      } else {
        tests.value = [];
      }

      // Set form data in sequence to trigger proper cascading updates
      if (response.data.section) {
        form.section = response.data.section;
        await getTypeList("base", response.data.section);

        if (response.data.base) {
          form.base = response.data.base;
          await getTypeList("lesson", response.data.base);

          if (response.data.lesson) {
            form.lesson = response.data.lesson;
            await getTypeList("topic", response.data.lesson);

            if (response.data.topics && response.data.topics.length) {
              form.topics = response.data.topics;
              await getTopicTitleList();
            }
          }
        }
      }

      if (response.data.file_original) {
        file_original_path.value = response.data.file_original;
      }
      
      // Other form fields from response.data if necessary
      form.exam_type = response.data.exam_type || "";
      form.level = response.data.level || "2";
      form.duration = response.data.duration || 3;
      form.title = response.data.title || "";
      form.paperID = response.data.paperID || "";
      form.edu_year = response.data.edu_year || "";
      form.edu_month = response.data.edu_month || "";
      // ... any other fields that should be populated from exam info

    } catch (err) {
      nuxtApp.$toast.error("Failed to load exam information");
      console.error("Error fetching exam info:", err);
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
const applyTest = async (item, type = null) => {

    if (tests.value.find((x) => x == item.id) && type === "remove") {
        tests.value.splice(tests.value.indexOf(item.id), 1);

        //Remove from preview
        // this.$store.commit('user/removePreviewTestList', item.id);

        submitTest();
      }
      if (!tests.value.find((x) => x == item.id) && type === "add") {
        tests.value.push(item.id);

        //Add to preview list
        // this.$store.commit('user/addPreviewTestList', item)

        // if (this.$store.getters["user/getPreviewTestListLength"]) {
        //   this.$nextTick(function () {
        //  this.$renderMathJax(this.$refs.mathJaxEl);
        //   });
        // }

        submitTest();
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

      // Always update the preview list when a new test is created
      // This ensures the Review section is always up to date
      await submitTest();
      
      // Show success message
      nuxtApp.$toast.success("Test added to exam");

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
  // Get user token
  const auth = useAuth();
  userToken.value = auth.getUserToken();

  // Ensure exam published state is reset
  isExamPublished.value = false;

  // Initialize data in the correct sequence
  await getCurrentExamInfo();

  // Load initial data - start with sections
  await getTypeList("section");

  // Conditionally load data based on URL parameters or existing form values
  if (form.section) {
    await getTypeList("base", form.section);

    if (form.base) {
      await getTypeList("lesson", form.base);

      if (form.lesson) {
        await getTypeList("topic", form.lesson);
      }
    }
  }

  // Get additional type lists
  await loadExamTypes(); // Use our specialized function for exam types
  await getTypeList("state");

  // Load tests if needed
  await getExamTests();

  // If we have an exam ID, get its tests
  if (exam_id.value) {
    await handleRefreshPreviewList();
    
    // Make sure the examTestListLength is properly initialized
    if (createForm.value && "examTestListLength" in createForm.value) {
      createForm.value.examTestListLength = tests.value.length;
    }
  }

  // Check active tab from route and enable it
  if (route.query?.active === "test_list") {
    test_step.value = 2;
    testListSwitch.value = true;
  } else if (route.query?.active === "add_test") {
    test_step.value = 2;
    testListSwitch.value = false;
  } else {
    test_step.value = 1;
    testListSwitch.value = false;
  }

  if (test_step.value === 2 && testListSwitch.value) {
    await typesetMathInSpecificContainer(mathJaxStep2ListContainerRef);
  }
  if (test_step.value === 3) {
    await typesetMathInSpecificContainer(mathJaxStep3ReviewContainerRef);
  }
});

onUpdated(async () => {
  if (test_step.value === 2 && testListSwitch.value) {
    await typesetMathInSpecificContainer(mathJaxStep2ListContainerRef);
  }
  if (test_step.value === 3) {
    await typesetMathInSpecificContainer(mathJaxStep3ReviewContainerRef);
  }
  if (printPreviewDialog.value) {
    await typesetMathInSpecificContainer(mathJaxPrintDialogContainerRef);
  }
});

watch(test_list, async () => {
  if (test_step.value === 2 && testListSwitch.value) {
    await typesetMathInSpecificContainer(mathJaxStep2ListContainerRef);
  }
}, { deep: true });

watch(previewTestList, async () => {
  if (test_step.value === 3) {
    await typesetMathInSpecificContainer(mathJaxStep3ReviewContainerRef);
  }
  if (printPreviewDialog.value) {
    await typesetMathInSpecificContainer(mathJaxPrintDialogContainerRef);
  }
}, { deep: true });

watch(printPreviewDialog, async (isDialogVisible) => {
  if (isDialogVisible) {
    await nextTick(); 
    await typesetMathInSpecificContainer(mathJaxPrintDialogContainerRef);
  }
});


watch(test_step, async (newStep, oldStep) => {
  await nextTick(); 
  if (newStep === 2 && testListSwitch.value) {
    await typesetMathInSpecificContainer(mathJaxStep2ListContainerRef);
  } else if (newStep === 3) {
    await typesetMathInSpecificContainer(mathJaxStep3ReviewContainerRef);
  }
});

watch(testListSwitch, async (isSwitchedOn) => {
  if (test_step.value === 2 && isSwitchedOn) {
    await nextTick(); 
    await typesetMathInSpecificContainer(mathJaxStep2ListContainerRef);
  }
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
      headers: {
        Authorization: `Bearer ${userToken.value}`,
      },
    });

    nuxtApp.$toast.success("Deleted successfully");

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
    nuxtApp.$toast.error(err.message || "Error deleting test");
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

const deleteOnlineExam = async () => {
  deleteLoading.value = true;

  try {
    const response =  await $fetch(`/api/v1/exams/${exam_id.value}`, {
      headers: {
        Authorization: `Bearer ${userToken.value}`,
      },
      method: "DELETE",
    });
    if(response.data.message === "done"){
    nuxtApp.$toast.success("Deleted successfully");

    // Reset all values
    exam_id.value = "";
    exam_code.value = "";
    isExamPublished.value = false;

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

    // Reset form and data
    resetForm();

    // Reset to first step
    test_step.value = 1;
    }
  } catch (err) {
    nuxtApp.$toast.error(err.message || "Error deleting exam");
    console.error("Error deleting exam:", err);
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

// Handle stepper navigation to validate steps
const handleStepChange = (newStep) => {
  // Don't allow changing to step 4 (Publish) if we don't have enough tests
  if (newStep === 4 && tests.value.length < 5) {
    nuxtApp.$toast.error(
      `You need at least 5 tests to publish the exam. Currently have ${tests.value.length}.`
    );

    // Revert to step 3 (Review)
    test_step.value = 3;
    return;
  }

  // Prevent access to step 4 if exam hasn't been published yet
  if (newStep === 4 && !isExamPublished.value) {
    nuxtApp.$toast.error("Please publish the exam from the Review step first");

    // Revert to step 3 (Review)
    test_step.value = 3;
    return;
  }

  // Prevent access to step 4 directly from step 1 or 2
  if (newStep === 4 && test_step.value < 3) {
    nuxtApp.$toast.error("Please review your exam before publishing");

    // Go to step 3 (Review) instead
    test_step.value = 3;
    return;
  }

  // If moving to Review step (3), make sure we load the test data
  if (newStep === 3 && exam_id.value) {
    test_step.value = newStep;
    nuxtApp.$toast.info("Loading test data...");
    handleRefreshPreviewList().then(() => {
      if (previewTestList.value.length === 0 && tests.value.length > 0) {
        nuxtApp.$toast.warning("Retrying test data load...");
        setTimeout(() => {
          handleRefreshPreviewList().then(() => {
            if (previewTestList.value.length > 0) {
              nuxtApp.$toast.success(`Loaded ${previewTestList.value.length} tests`);
            }
          });
        }, 1000);
      } else if (previewTestList.value.length > 0) {
        nuxtApp.$toast.success(`Loaded ${previewTestList.value.length} tests`);
      }
    }).catch(err => {
      console.error("Error loading test data:", err);
      nuxtApp.$toast.error("Error loading test data");
    });
    return;
  }

  // If all validations pass, update the step
  test_step.value = newStep;

  // Show step change notification
  if (newStep !== test_step.value) {
    const stepNames = {
      1: "Header",
      2: "Tests",
      3: "Review",
      4: "Publish",
    };
    nuxtApp.$toast.info(`Navigated to ${stepNames[newStep]} step`);
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
  form.topics = [];
  selected_topics.value = [];

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
  isExamPublished.value = false;

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

// Change from ref to computed
const test_share_link = computed(() => {
  if (process.server) {
    // Return a consistent value during SSR to avoid hydration mismatch
    return `https://gamatrain.com/exam/${exam_id.value || ""}`;
  }
  // Only use window.location on client side
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

// Handle test refresh events from CreateTestForm component
const handleTestRefresh = async () => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    tests.value = tests.value.map((id) => String(id));
    await handleRefreshPreviewList();

    if (createForm.value && "examTestListLength" in createForm.value) {
      createForm.value.examTestListLength = tests.value.length;
    }

    if (testListSwitch.value) {
      filter.page = 1;
      test_list.value = [];
      all_tests_loaded.value = false;
      await getExamTests();
    }
    nuxtApp.$toast.success(
      `Tests updated: ${tests.value.length} tests in exam`
    );
  } catch (err) {
    console.error("Error in handleTestRefresh:", err);
    nuxtApp.$toast.error("Error refreshing test list");
  }
};
const typesetMathInSpecificContainer = async (containerRef ) => {
  if (process.client && containerRef.value && window.MathJax) {
    let elementToProcess = null;

    if (containerRef.value.$el && containerRef.value.$el instanceof HTMLElement) {
      elementToProcess = containerRef.value.$el;
    } else if (containerRef.value instanceof HTMLElement) {
      elementToProcess = containerRef.value;
    }

    if (!elementToProcess) {
      return;
    }
    try {
      await $ensureMathJaxReady(); 
      await nextTick(); 
      if (containerRef.value) { 
        let currentElementForProcessing = null;
        if (containerRef.value.$el && containerRef.value.$el instanceof HTMLElement) {
          currentElementForProcessing = containerRef.value.$el;
        } else if (containerRef.value instanceof HTMLElement) {
          currentElementForProcessing = containerRef.value;
        }

        if (currentElementForProcessing) {
          $renderMathInElement(currentElementForProcessing);
        }
      }
    } catch (error) {
      console.error('MathJax Error:', error);
    }
  }
};

// Watch for changes in tests array to update the button number
watch(
  () => tests.value,
  (newTests, oldTests) => {
    if (createForm.value && "examTestListLength" in createForm.value) {
      createForm.value.examTestListLength = newTests.length;
    }
    if (exam_id.value && 
        (newTests.length !== oldTests?.length || 
         JSON.stringify(newTests) !== JSON.stringify(oldTests))) {
      setTimeout(() => {
        handleRefreshPreviewList();
      }, 300);
    }
  },
  { deep: true }
);
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
.textFiledLink .v-field--variant-outlined .v-field__outline {
  border-top-left-radius: 20px !important;
  border-top-right-radius: 20px !important;
  
}
.textFiledLink:deep(input){
  padding-left: 20px !important;
}
.v-btn {
  display: inline-grid !important;
}
</style>
