<template>
  <v-container class="test-maker">
    <v-row class="mt-4">
      <v-col cols="6">
        <span class="icon icong-azmoon text-h3 text-teal"></span>
        <span class="text-h4 text-teal"> Update online exam </span>
      </v-col>
      <v-col cols="6" id="tool-box" class="text-right">
        <v-btn
          variant="outlined"
          color="error"
          icon="mdi-delete"
          size="small"
          @click="confirmDeleteDialog = true"
        />
        <v-btn
          variant="outlined"
          icon="mdi-printer-eye"
          size="small"
          @click="printPreviewDialog = !printPreviewDialog"
        />
      </v-col>
    </v-row>

    <VStepper v-model="test_step" flat vertical class="mb-16">
      <VStepperStep
        :complete="test_step > 1"
        step="1"
        class="pointer"
        @click="test_step = 1"
        color="teal"
      >
        Header
      </VStepperStep>
      <VStepperContent step="1">
        <v-card flat class="mt-3 pb-10">
          <VForm ref="observer" @submit="submitQuestion" v-model="isFormValid">
            <v-row>
              <v-col cols="12" md="4">
                <v-autocomplete
                  density="compact"
                  v-model="form.section"
                  :items="level_list"
                  :error-messages="formErrors.section"
                  item-title="title"
                  item-value="id"
                  label="Curriculum"
                  variant="outlined"
                  :rules="[(v) => !!v || 'This field is required']"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-autocomplete
                  density="compact"
                  v-model="form.base"
                  :items="grade_list"
                  item-value="id"
                  item-title="title"
                  :error-messages="formErrors.base"
                  label="Grade"
                  variant="outlined"
                  :rules="[(v) => !!v || 'This field is required']"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-autocomplete
                  density="compact"
                  :items="lesson_list"
                  item-value="id"
                  item-title="title"
                  v-model="form.lesson"
                  :error-messages="formErrors.lesson"
                  label="Subject"
                  variant="outlined"
                  :rules="[(v) => !!v || 'This field is required']"
                />
              </v-col>

              <v-col cols="12" md="12">
                <FormTopicSelector
                  ref="topicSelector"
                  :selectedTopics="selected_topics"
                  :topic-list="topic_list"
                  @selectTopic="selectTopic"
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-autocomplete
                  density="compact"
                  :items="test_type_list"
                  item-value="id"
                  item-title="title"
                  v-model="form.exam_type"
                  :error-messages="formErrors.test_type"
                  label="Test type"
                  variant="outlined"
                  :rules="[(v) => !!v || 'This field is required']"
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  density="compact"
                  v-model="form.duration"
                  type="number"
                  min="1"
                  :error-messages="formErrors.test_duration"
                  label="Test duration"
                  variant="outlined"
                  :rules="[(v) => !!v || 'This field is required']"
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-autocomplete
                  density="compact"
                  v-model="form.edu_year"
                  :items="year_list"
                  label="Year"
                  variant="outlined"
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-autocomplete
                  density="compact"
                  v-model="form.edu_month"
                  :items="month_list"
                  item-value="id"
                  item-title="title"
                  label="Month"
                  variant="outlined"
                />
              </v-col>

              <v-col
                cols="12"
                md="4"
                v-if="
                  form.holding_level === 1 ||
                  form.holding_level === 2 ||
                  form.holding_level === 3
                "
              >
                <v-autocomplete
                  density="compact"
                  :items="state_list"
                  v-model="form.state"
                  item-title="title"
                  item-value="id"
                  label="State"
                  variant="outlined"
                />
              </v-col>

              <v-col
                cols="12"
                md="4"
                v-if="form.holding_level === 1 || form.holding_level === 2"
              >
                <v-autocomplete
                  density="compact"
                  :items="area_list"
                  v-model="form.area"
                  item-title="title"
                  item-value="id"
                  label="Area"
                  variant="outlined"
                />
              </v-col>
              <v-col
                cols="12"
                md="4"
                v-if="form.section && form.area && form.holding_level === 1"
              >
                <v-autocomplete
                  density="compact"
                  :items="school_list"
                  v-model="form.school"
                  item-title="title"
                  item-value="id"
                  label="School"
                  variant="outlined"
                />
              </v-col>

              <v-col cols="12" md="8">
                <v-text-field
                  density="compact"
                  v-model="form.title"
                  :error-messages="formErrors.title"
                  label="Title"
                  variant="outlined"
                  :rules="[(v) => !!v || 'This field is required']"
                />
                <div class="text-caption text-grey">
                  Ex: 9700/11 Biology Jun 2020 Online Test | Cambridge AS & A Level MSCO
                </div>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  density="compact"
                  label="Past Paper Id"
                  v-model="form.paperID"
                  variant="outlined"
                />
              </v-col>

              <v-col cols="12" md="12">
                <v-file-input
                  density="compact"
                  label="Source file"
                  variant="outlined"
                  prepend-icon="mdi-paperclip"
                  @change="uploadFile($event)"
                  accept="application/pdf,image/*"
                ></v-file-input>
              </v-col>

              <v-col cols="12">
                <v-row>
                  <v-col cols="12" md="6" class="pb-0">
                    <v-btn
                      type="submit"
                      :loading="submit_loading"
                      :disabled="!isFormValid"
                      size="large"
                      color="teal"
                      class="text-white"
                      block
                    >
                      Update & Next step
                    </v-btn>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-btn 
                      size="large" 
                      variant="outlined" 
                      color="error" 
                      to="/user/exam" 
                      block
                    >
                      Discard
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </VForm>
        </v-card>
      </VStepperContent>

      <VStepperStep
        :complete="test_step > 2"
        @click="test_step = 2"
        step="2"
        class="pointer"
        color="teal"
      >
        Tests
      </VStepperStep>
      <VStepperContent step="2">
        <v-card flat class="mt-3 pb-10">
          <v-row>
            <v-col cols="12">
              <v-switch
                color="teal"
                v-model="testListSwitch"
                label="I want to select from list"
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
                density="compact"
                v-model="filter.section"
                :items="filter_level_list"
                item-title="title"
                clearable
                item-value="id"
                label="Curriculum"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-autocomplete
                density="compact"
                v-model="filter.base"
                :items="filter_grade_list"
                item-value="id"
                clearable
                item-title="title"
                label="Grade"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-autocomplete
                density="compact"
                :items="filter_lesson_list"
                item-value="id"
                item-title="title"
                clearable
                v-model="filter.lesson"
                label="Subject"
                variant="outlined"
              />
            </v-col>

            <v-col cols="12" md="4">
              <v-autocomplete
                density="compact"
                :items="topic_list"
                item-value="id"
                item-title="title"
                v-model="filter.topic"
                label="Topic"
                variant="outlined"
              >
                <template #item="{ item, props }">
                  <v-list-item
                    v-bind="props"
                    :class="item.raw.season ? 'topic_season' : ''"
                    class="py-2"
                  >
                    {{ item.raw.title }}
                  </v-list-item>
                </template>
              </v-autocomplete>
            </v-col>

            <v-col cols="12" md="4">
              <v-autocomplete
                density="compact"
                :items="video_analysis_options"
                item-value="value"
                item-title="title"
                v-model="filter.testsHasVideo"
                label="Video analysis"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-checkbox
                density="compact"
                class="mt-1"
                v-model="filter.myTests"
                label="My own tests"
              />
            </v-col>

            <v-col cols="12">
              <v-card
                class="test-list overflow-y-auto"
                flat
                max-height="600"
                ref="testList"
                @scroll="onScroll"
              >
                <v-card-text>
                  <v-row ref="testListContent">
                    <v-col
                      v-show="test_list.length > 0"
                      v-for="item in test_list"
                      :key="item.id"
                      cols="12"
                    >
                      <v-row class="mb-2">
                        <v-col cols="12">
                          <v-chip v-show="item.lesson_title">
                            {{ item.lesson_title }}
                          </v-chip>
                          <v-chip v-show="item.topics_title">
                            {{ item.topics_title }}
                          </v-chip>
                          <v-chip
                            variant="outlined"
                            color="success"
                            v-show="item.level === '1'"
                          >
                            Simple
                          </v-chip>
                          <v-chip
                            variant="outlined"
                            color="primary"
                            v-show="item.level === '2'"
                          >
                            Middle
                          </v-chip>
                          <v-chip
                            variant="outlined"
                            color="error"
                            v-show="item.level === '3'"
                          >
                            Hard
                          </v-chip>
                        </v-col>
                      </v-row>
                      <div
                        id="test-question"
                        ref="mathJaxEl"
                        v-html="item.question"
                      />
                      <img :src="item.q_file" />

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
                          ref="mathJaxEl"
                          v-show="item.answer_a"
                          v-html="item.answer_a"
                        ></span>
                        <img v-show="item.a_file" :src="item.a_file" />
                      </div>
                      <div class="answer">
                        <v-icon
                          v-show="item.true_answer == '2'"
                          size="large"
                          class="true_answer"
                        >
                          mdi-check
                        </v-icon>

                        <span>2)</span>
                        <span
                          ref="mathJaxEl"
                          v-show="item.answer_b"
                          v-html="item.answer_b"
                        ></span>
                        <img v-show="item.b_file" :src="item.b_file" />
                      </div>
                      <div class="answer">
                        <v-icon
                          v-show="item.true_answer == '3'"
                          size="large"
                          class="true_answer"
                        >
                          mdi-check
                        </v-icon>

                        <span>3)</span>
                        <span
                          ref="mathJaxEl"
                          v-show="item.answer_c"
                          v-html="item.answer_c"
                        ></span>
                        <img v-show="item.c_file" :src="item.c_file" />
                      </div>
                      <div class="answer">
                        <v-icon
                          class="true_answer"
                          v-show="item.true_answer == '4'"
                          size="large"
                        >
                          mdi-check
                        </v-icon>
                        <span>4)</span>
                        <span
                          ref="mathJaxEl"
                          v-show="item.answer_d"
                          v-html="item.answer_d"
                        />
                        <img v-show="item.d_file" :src="item.d_file" />
                      </div>
                      <v-row>
                        <v-col cols="6">
                          <v-btn
                            icon
                            :to="`/test-maker/create-test/edit/${item.id}`"
                            v-show="item.owner == true"
                          >
                            <v-icon> mdi-pencil </v-icon>
                          </v-btn>
                          <v-btn
                            icon
                            v-show="item.owner == true"
                            @click="openTestDeleteConfirmDialog(item.id)"
                          >
                            <v-icon color="error"> mdi-delete </v-icon>
                          </v-btn>
                          <v-btn icon>
                            <v-icon color="blue"> mdi-bullhorn-outline </v-icon>
                          </v-btn>
                          <v-btn icon>
                            <v-icon color="green"> mdi-eye </v-icon>
                          </v-btn>
                          <v-btn icon>
                            <v-icon color="red"> mdi-video </v-icon>
                          </v-btn>
                        </v-col>
                        <v-col cols="6" class="text-right">
                          <v-btn
                            color="blue"
                            variant="flat"
                            size="small"
                            v-show="!tests.find((x) => x == item.id)"
                            @click="applyTest(item, 'add')"
                          >
                            <v-icon size="small"> mdi-plus </v-icon>
                            Add
                          </v-btn>
                          <v-btn
                            color="red"
                            variant="flat"
                            size="small"
                            v-show="tests.find((x) => x == item.id)"
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

            <v-col cols="12">
              <v-row>
                <v-col cols="12" md="6" class="pb-0">
                  <v-btn
                    @click="test_step = 3"
                    :disabled="tests.length < 5"
                    :loading="publish_loading"
                    size="large"
                    color="teal"
                    variant="flat"
                    class="text-white"
                    block
                  >
                    <span v-show="tests.length < 5"
                      >Add at least {{ 5 - tests.length }} more tests</span
                    >
                    <span v-show="tests.length >= 5">Next step</span>
                  </v-btn>
                </v-col>
                <v-col cols="12" md="6">
                  <v-btn size="large" variant="outlined" color="error" to="/user/exam" block>
                    Discard
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </VStepperContent>

      <VStepperStep
        :complete="test_step > 3"
        @click="test_step = 3"
        color="teal"
        class="pointer"
        step="3"
      >
        Review
      </VStepperStep>
      <VStepperContent step="3">
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
                <draggable v-model="previewTestList" @end="previewDragEnd">
                  <v-row v-for="(item, index) in previewTestList" :key="index">
                    <v-col cols="12">
                      <div
                        id="test-question"
                        ref="mathJaxEl"
                        v-html="item.question"
                      />
                      <img :src="item.q_file" />

                      <div class="answer">
                        <span>1)</span>
                        <span
                          ref="mathJaxEl"
                          v-show="item.answer_a"
                          v-html="item.answer_a"
                        ></span>
                        <img v-show="item.a_file" :src="item.a_file" />
                      </div>
                      <div class="answer">
                        <span>2)</span>
                        <span
                          ref="mathJaxEl"
                          v-show="item.answer_b"
                          v-html="item.answer_b"
                        ></span>
                        <img v-show="item.b_file" :src="item.b_file" />
                      </div>
                      <div class="answer">
                        <span>3)</span>
                        <span
                          ref="mathJaxEl"
                          v-show="item.answer_c"
                          v-html="item.answer_c"
                        ></span>
                        <img v-show="item.c_file" :src="item.c_file" />
                      </div>
                      <div class="answer">
                        <span>4)</span>
                        <span
                          ref="mathJaxEl"
                          v-show="item.answer_d"
                          v-html="item.answer_d"
                        />
                        <img v-show="item.d_file" :src="item.d_file" />
                      </div>
                      <v-row>
                        <v-col cols="6">
                          <v-btn icon="mdi-cursor-move" color="blue" />
                        </v-col>
                        <v-col cols="6" class="text-right">
                          <v-btn
                            color="blue"
                            variant="flat"
                            size="small"
                            v-show="!tests.find((x) => x == item.id)"
                            @click="applyTest(item, 'add')"
                          >
                            <v-icon size="small"> mdi-plus </v-icon>
                            Add
                          </v-btn>
                          <v-btn
                            color="red"
                            variant="flat"
                            size="small"
                            v-show="tests.find((x) => x == item.id)"
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
                </draggable>
              </v-col>
              <v-col v-else cols="12" class="text-center">
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
                      color="teal"
                      variant="flat"
                      class="text-white"
                      block
                    >
                      <span v-show="tests.length < 5"
                        >Add at least {{ 5 - tests.length }} more tests</span
                      >
                      <span v-show="tests.length >= 5">Publish</span>
                    </v-btn>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-btn size="large" variant="outlined" color="error" to="/user/exam" block>
                      Discard
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <!--End publish button-->
          </v-card-text>
        </v-card>
      </VStepperContent>

      <VStepperStep
        :complete="test_step > 4"
        color="teal"
        class="pointer"
        step="4"
      >
        Publish
      </VStepperStep>
      <VStepperContent step="4">
        <v-card class="mb-16">
          <v-card-text class="text-center">
            <v-row>
              <v-col cols="12">
                <p class="font-weight-bold text-teal mb-3">
                  Your test is ready to use!
                </p>
                <p>Send below link to your students or friends.</p>

                <div class="d-flex mt-4 align-center justify-center">
                  <v-text-field
                    variant="outlined"
                    id="share_link"
                    shaped
                    @click="copyUrl"
                    style="max-width: 320px"
                    density="compact"
                    v-model="test_share_link"
                  >
                    <template #append>
                      <v-btn icon @click="copyUrl" class="mb-1">
                        <v-icon>mdi-content-copy</v-icon>
                      </v-btn>
                    </template>
                  </v-text-field>
                </div>

                <p class="mt-3">
                  To view the results of the participants, go to the following
                  path:
                </p>

                <div class="d-flex mt-4 align-center justify-center">
                  <v-breadcrumbs
                    :items="[
                      { title: 'Dashboard', href: '/user' },
                      { title: 'My online exam', href: '/exam/results' },
                    ]"
                  >
                    <template #divider>
                      <v-icon>mdi-forward</v-icon>
                    </template>
                  </v-breadcrumbs>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </VStepperContent>
    </VStepper>

    <v-row justify="center">
      <v-dialog
        v-model="printPreviewDialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <v-card class="test-list">
          <v-toolbar color="teal">
            <v-btn icon="mdi-close" @click="printPreviewDialog = false" />
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn @click="printPreviewDialog = false">Ok</v-btn>
            </v-toolbar-items>
          </v-toolbar>

          <v-card-text id="preview-dialog">
            <v-row>
              <v-col cols="12">
                <p class="text-h4 font-weight-bold">{{ form.title }}</p>
              </v-col>
              <v-col cols="4">Duration: {{ form.duration }}</v-col>
              <v-col cols="4">Level: {{ calcLevel(form.level) }}</v-col>
              <v-col cols="12">
                <v-chip label color="error">Topics:</v-chip>
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
                <draggable v-model="previewTestList" @end="previewDragEnd">
                  <v-row v-for="(item, index) in previewTestList" :key="index">
                    <v-col cols="12">
                      <div
                        id="test-question"
                        ref="mathJaxEl"
                        v-html="item.question"
                      />
                      <img :src="item.q_file" />

                      <div class="answer">
                        <span>1)</span>
                        <span
                          ref="mathJaxEl"
                          v-show="item.answer_a"
                          v-html="item.answer_a"
                        ></span>
                        <img v-show="item.a_file" :src="item.a_file" />
                      </div>
                      <div class="answer">
                        <span>2)</span>
                        <span
                          ref="mathJaxEl"
                          v-show="item.answer_b"
                          v-html="item.answer_b"
                        ></span>
                        <img v-show="item.b_file" :src="item.b_file" />
                      </div>
                      <div class="answer">
                        <span>3)</span>
                        <span
                          ref="mathJaxEl"
                          v-show="item.answer_c"
                          v-html="item.answer_c"
                        ></span>
                        <img v-show="item.c_file" :src="item.c_file" />
                      </div>
                      <p class="answer">
                        <span>4)</span>
                        <span
                          ref="mathJaxEl"
                          v-show="item.answer_d"
                          v-html="item.answer_d"
                        />
                        <img v-show="item.d_file" :src="item.d_file" />
                      </p>
                      <v-row>
                        <v-col cols="6">
                          <v-btn icon="mdi-cursor-move" color="blue" />
                        </v-col>
                        <v-col cols="6" class="text-right">
                          <v-btn
                            color="blue"
                            variant="flat"
                            size="small"
                            v-show="!tests.find((x) => x == item.id)"
                            @click="applyTest(item, 'add')"
                          >
                            <v-icon size="small">mdi-plus</v-icon>
                            Add
                          </v-btn>
                          <v-btn
                            color="red"
                            variant="flat"
                            size="small"
                            v-show="tests.find((x) => x == item.id)"
                            @click="applyTest(item, 'remove')"
                          >
                            <v-icon size="small">mdi-minus</v-icon>
                            Delete
                          </v-btn>
                        </v-col>
                      </v-row>
                      <v-divider class="mt-3" />
                    </v-col>
                  </v-row>
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
    </v-row>

    <!--Delete exam test confirm dialog-->
    <v-dialog v-model="deleteTestConfirmDialog" max-width="290">
      <v-card>
        <v-card-title class="text-h5">Are you sure?</v-card-title>

        <v-card-text>
          <p>If you are sure to delete, click Yes.</p>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn variant="text" @click="deleteTestConfirmDialog = false">No</v-btn>

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
    <!--End delete exam test confirm dialog-->
  </v-container>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from "~/composables/useAuth";
import { defineRule } from 'vee-validate';
import { required } from '@vee-validate/rules';
import draggable from 'vuedraggable';
import FormTopicSelector from "~/components/form/topic-selector.vue";
import CreateTestForm from "~/components/test-maker/create-test-form.vue";

// Define validation rules
defineRule('required', required);

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
const test_step = ref(2);
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
  topics: "",
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
const lastCreatedTest = ref("");

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

// Generate title function - Moving this BEFORE getTypeList
const generateTitle = () => {
  let lesson_title = "";
  if (form.lesson && lesson_list.value.length > 0) {
    const lessonItem = lesson_list.value.find(x => x.id === form.lesson);
    lesson_title = lessonItem?.title || "";
  }
  
  let base_title = "";
  if (form.base && grade_list.value.length > 0) {
    const baseItem = grade_list.value.find(x => x.id === form.base);
    base_title = baseItem?.title || "";
  }
  
  form.title = `${lesson_title} Test ${base_title} Grade`;
};

// Methods
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
    title = topic_list.value.find(
      (x) => x.id == form.topics[index]
    ).title;
    topicTitleArr.value.push(title);
  }
};

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
        Authorization: `Bearer ${userToken.value}`,
      },
    });
    
    if (response && response.data && response.data.list) {
      test_list.value.push(...response.data.list);
      
      if (test_list.value.length) {
        await nextTick();
        renderMathJax();
      }
      
      if (createForm.value) {
        createForm.value.examTestListLenght = tests.value.length;
      }
      
      // For terminate auto load request
      all_tests_loaded.value = response.data.list.length === 0;
    }
  } catch (err) {
    console.error(err);
  } finally {
    test_loading.value = false;
  }
};

const renderMathJax = () => {
  if (window.MathJax) {
    window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
  }
};

const onScroll = () => {
  if (!testList.value) return;
  
  const scrollPosition = testList.value.$el.scrollTop;
  let contentHeight = 0;
  if (testListContent.value) {
    contentHeight = testListContent.value.clientHeight;
  }
  
  // Avoid the number of requests
  if (timer.value) {
    clearTimeout(timer.value);
    timer.value = null;
  }
  
  if (scrollPosition > contentHeight - 1000 && all_tests_loaded.value === false) {
    timer.value = setTimeout(() => {
      test_loading.value = true;
      filter.page++;
      getExamTests();
    }, 800);
  }
};

const applyTest = (item, type) => {
  if (tests.value.find(x => x == item.id) && type === "remove") {
    tests.value.splice(tests.value.indexOf(item.id), 1);
    submitTest();
  }
  
  if (!tests.value.find(x => x == item.id) && type === "add") {
    tests.value.push(item.id);
    submitTest();
  }
};

const submitTest = async () => {
  if (!tests.value.length) return;
  
  let formData = new FormData();
  for (let i = 0; i < tests.value.length; i++) {
    formData.append("tests[]", tests.value[i]);
  }
  
  try {
    await $fetch(`/api/v1/exams/tests/${exam_id.value}`, {
      method: "PUT",
      body: urlencodeFormData(formData),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        Authorization: `Bearer ${userToken.value}`,
      },
    });
    
    getExamCurrentTests();
  } catch (err) {
    console.error(err);
  }
};

const getExamCurrentTests = async () => {
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
        createForm.value.examTestListLenght = tests.value.length;
      }
      
      if (previewTestList.value.length) {
        await nextTick();
        renderMathJax();
      }
    }
  } catch (err) {
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
    
    if (response.data.message === "done") {
      test_share_link.value = `${process.client ? window.location.origin : ''}/exam/${exam_id.value}`;
      
      // Reset values
      exam_id.value = "";
      exam_code.value = "";
      
      // Set in store
      useState('user').value = {
        ...useState('user').value,
        currentExamId: "",
        currentExamCode: ""
      };
      
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
      
      test_step.value = 4;
    }
  } catch (err) {
    console.error(err);
  } finally {
    publish_loading.value = false;
  }
};

const getCurrentExamInfo = async () => {
  const userState = useState('user');
  
  if (userState.value?.examId) {
    exam_id.value = userState.value.examId;
    exam_code.value = userState.value.examCode;
    test_step.value = 2;
    
    try {
      const response = await $fetch(`/api/v1/exams/info/${exam_id.value}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken.value}`,
        },
      });
      
      if (response && response.data) {
        tests.value = response.data.tests.length ? response.data.tests : [];
        
        form.section = response.data.section;
        form.base = response.data.base;
        form.lesson = response.data.lesson;
        file_original_path.value = response.data.file_original;
      }
    } catch (err) {
      console.error(err);
    }
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

const previewDragEnd = () => {
  nextTick(() => {
    renderMathJax();
  });
  
  const new_list = [];
  for (const index in previewTestList.value) {
    new_list.push(previewTestList.value[index].id);
  }
  tests.value = new_list;
  submitTest();
};

// Return title of level for show in preview list
const calcLevel = (level) => {
  if (level) {
    const levelItem = test_level_list.find(x => x.id === level);
    return levelItem ? levelItem.title : '';
  }
  return '';
};

const deleteOnlineExam = async () => {
  deleteLoading.value = true;
  
  try {
    await $fetch(`/api/v1/exams/${exam_id.value}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${userToken.value}`,
      },
    });
    
    // Reset values
    exam_id.value = "";
    exam_code.value = "";
    
    // Set in store
    useState('user').value = {
      ...useState('user').value,
      currentExamId: "",
      currentExamCode: ""
    };
    
    previewTestList.value = [];
    
    if (createForm.value) {
      createForm.value.file_original_path = "";
    }
    
    tests.value = [];
    
    // Reset form
    form.section = "";
    grade_list.value = [];
    lesson_list.value = [];
    topic_list.value = [];
    
    form.exam_type = "";
    form.duration = 3;
    form.title = "";
    
    test_step.value = 1;
    
    const { $toast } = useNuxtApp();
    if ($toast) $toast.success("Deleted successfully");
    
  } catch (err) {
    const { $toast } = useNuxtApp();
    if ($toast) $toast.error("An error occurred");
  } finally {
    deleteLoading.value = false;
    confirmDeleteDialog.value = false;
  }
};

// Delete exam test
const openTestDeleteConfirmDialog = (item_id) => {
  delete_exam_test_id.value = item_id;
  deleteTestConfirmDialog.value = true;
};

const deleteExamTest = async () => {
  delete_exam_test_loading.value = true;
  
  try {
    await $fetch(`/api/v1/examTests/${delete_exam_test_id.value}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${userToken.value}`,
      },
    });
    
    const { $toast } = useNuxtApp();
    if ($toast) $toast.success("Deleted successfully");
    
    filter.page = 1;
    test_list.value = [];
    await getExamTests();
  } catch (err) {
    console.error(err);
  } finally {
    delete_exam_test_loading.value = false;
    delete_exam_test_id.value = null;
    deleteTestConfirmDialog.value = false;
  }
};

const uploadFile = async (file) => {
  if (!file) return;
  
  file_original.value = file;
  
  let formData = new FormData();
  formData.append("file", file_original.value);
  
  try {
    const response = await $fetch("/api/v1/upload", {
      method: "POST",
      body: formData,
      headers: {
        accept: "*/*",
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${userToken.value}`,
      },
    });
    
    if (response && response.data && response.data[0] && response.data[0].file) {
      form.file_original = response.data[0].file.name;
    }
  } catch (err) {
    console.error(err);
  }
};

// Set up watchers
watch(() => route.query, (val) => {
  if (val && val.active === "test_list") {
    test_step.value = 2;
    testListSwitch.value = true;
  } else if (val && val.active === "add_test") {
    test_step.value = 2;
    testListSwitch.value = false;
  } else {
    test_step.value = 1;
    testListSwitch.value = false;
  }
});

watch(() => form.section, async (val) => {
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
});

watch(() => filter.section, async (val) => {
  if (val) {
    await getTypeList("base", val, "filter");
  }
  
  all_tests_loaded.value = true;
  filter_grade_list.value = [];
  filter_lesson_list.value = [];
  filter.page = 1;
  test_list.value = [];
  
  filter.base = "";
  filter.lesson = "";
});

watch(() => form.base, async (val) => {
  if (val) {
    await getTypeList("lesson", val);
    filter.base = val; // Init second level filter
    
    if (createForm.value) {
      createForm.value.form.base = val;
    }
    
    generateTitle();
  }
});

watch(() => filter.base, async (val) => {
  if (val) {
    await getTypeList("lesson", val, "filter");
  }
  
  all_tests_loaded.value = true;
  filter_lesson_list.value = [];
  filter.lesson = "";
  filter.page = 1;
  test_list.value = [];
});

watch(() => form.lesson, async (val) => {
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
});

watch(() => filter.lesson, async (val) => {
  if (val) {
    await getTypeList("topic", val, "filter");
  }
  
  all_tests_loaded.value = false;
  filter.page = 1;
  test_list.value = [];
  await getExamTests();
});

watch(() => form.state, async (val) => {
  if (val) {
    await getTypeList("area", val);
  }
});

watch(() => form.area, async (val) => {
  if (form.section && val) {
    await getTypeList("school");
  }
});

watch(() => filter.topic, async () => {
  filter.page = 1;
  test_list.value = [];
  await getExamTests();
});

watch(() => filter.testsHasVideo, async () => {
  filter.page = 1;
  test_list.value = [];
  await getExamTests();
});

watch(() => filter.myTests, async () => {
  filter.page = 1;
  test_list.value = [];
  await getExamTests();
});

watch(() => lastCreatedTest.value, (val) => {
  if (val && !tests.value.find(x => x == val)) {
    tests.value.push(val);
    submitTest();
  }
});

// Initialize on mount
onMounted(async () => {
  userToken.value = auth.getUserToken();
  
  // Check if route has active query param
  if (route.query && route.query.active === "test_list") {
    test_step.value = 2;
    testListSwitch.value = true;
  } else if (route.query && route.query.active === "add_test") {
    test_step.value = 2;
    testListSwitch.value = false;
  } else {
    test_step.value = 1;
    testListSwitch.value = false;
  }
  
  await getCurrentExamInfo();
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
  
  renderMathJax();
  
  await getExamTests();
  
  if (exam_id.value) {
    await getExamCurrentTests();
  }
});
</script>

<style lang="scss">
.test-maker {
  .test-list {
    .answer {
      margin-bottom: 10px;
      .true_answer {
        color: green;
      }
    }
  }

  .topic_season {
    background-color: rgba(144, 202, 249, 0.2);
  }

  .pointer {
    cursor: pointer;
  }

  #test-question {
    margin-bottom: 20px;
  }

  #preview-dialog {
    img {
      max-width: 100%;
    }
  }
}
</style>
