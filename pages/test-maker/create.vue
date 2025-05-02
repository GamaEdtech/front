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
          <VForm ref="observer" @submit.prevent="updateQuestion" v-model="isFormValid">
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
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  density="compact"
                  label="Past Paper Id"
                  v-model="form.paperID"
                  variant="outlined"
                />
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
                            size="small"
                            v-show="item.owner == true"
                            :to="`/test-maker/create-test/edit/${item.id}`"
                          >
                            <v-icon size="small"> mdi-pencil </v-icon>
                            Edit
                          </v-btn>
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
import { ref, reactive, watch, nextTick, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { defineRule } from 'vee-validate';
import { required } from '@vee-validate/rules';
import draggable from 'vuedraggable';
import FormTopicSelector from "~/components/form/topic-selector.vue";
import CreateTestForm from "~/components/test-maker/create-test-form.vue";

// Define validation rules
defineRule('required', required);

// Define layout and page metadata
definePageMeta({
  middleware: "auth",
  layout: "dashboard",
});

useHead({
  title: "Update online exam",
});

// Get services
const route = useRoute();
const router = useRouter();

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
  section: "",
  base: "",
  lesson: "",
  topics: "",
  exam_type: "",
  level: "2",
  holding_time: false,
  state: "",
  area: "",
  school: "",
  duration: 3,
  title: "",
  paperID: "",
  negative_point: false,
  file_original: "",
  holding_level: 4,
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

const file_original = ref("");

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
const testListSwitch = ref(true);
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
const test_share_link = computed(() => 
  `${window.location.origin}/exam/${route.params.id}`
);

// Get the user token for API requests
const userToken = computed(() => {
  return localStorage.getItem('auth._token.local');
});

// Methods
const getCurrentExamInfo = async () => {
  exam_id.value = route.params.id;
  
  try {
    const response = await fetch(`${process.env.apiBase}/api/v1/onlineexam/exams/${route.params.id}`, {
      headers: {
        Authorization: userToken.value
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch exam info');
    
    const data = await response.json();
    
    if (data && data.data) {
      tests.value = data.data.tests ? data.data.tests.map(test => test.id) : [];
      exam_code.value = data.data.code;
      form.section = data.data.section_id;
      form.base = data.data.grade_id;
      form.lesson = data.data.lesson_id;
      
      selected_topics.value = data.data.topics || []; 
      form.topics = data.data.topics ? data.data.topics.map(topic => topic.id) : [];
      
      form.exam_type = data.data.exam_type_id;
      form.paperID = data.data.paper_id || '';
      form.duration = data.data.duration || 3;
      form.title = data.data.title || '';
      form.level = data.data.level || '2';
      form.state = data.data.state_id;
      form.area = data.data.area_id;
      form.school = data.data.school_id;
      form.holding_level = data.data.holding_level || 4;
      
      getExamCurrentTests();
    }
  } catch (err) {
    showError('Failed to fetch exam information');
    console.error(err);
  }
};

const getTypeList = async (type, parent = "", trigger = "") => {
  try {
    let url = '';
    
    switch (type) {
      case 'section':
        url = `${process.env.apiBase}/api/v1/section/list`;
        break;
      case 'base':
        url = `${process.env.apiBase}/api/v1/grade/list/${parent}`;
        break;
      case 'lesson':
        url = `${process.env.apiBase}/api/v1/lesson/list/${form.section}/${parent}`;
        break;
      case 'topic':
        url = `${process.env.apiBase}/api/v1/topic/list/${form.section}/${form.base}/${parent}`;
        break;
      case 'exam_type':
        url = `${process.env.apiBase}/api/v1/onlineexam/exams/type-list`;
        break;
      case 'state':
        url = `${process.env.apiBase}/api/v1/state/list/${form.section}`;
        break;
      case 'area':
        url = `${process.env.apiBase}/api/v1/area/list/${form.section}/${parent}`;
        break;
      case 'school':
        url = `${process.env.apiBase}/api/v1/school/list/${form.section}/${form.state}/${form.area}`;
        break;
      default:
        return;
    }
    
    const response = await fetch(url, {
      headers: {
        Authorization: userToken.value
      }
    });
    
    if (!response.ok) throw new Error(`Failed to fetch ${type} list`);
    
    const data = await response.json();
    
    if (data && data.data) {
      switch (type) {
        case 'section':
          if (trigger === "filter") {
            filter_level_list.value = data.data;
          } else {
            level_list.value = data.data;
            filter_level_list.value = data.data;
          }
          break;
        case 'base':
          if (trigger === "filter") {
            filter_grade_list.value = data.data;
          } else {
            grade_list.value = data.data;
            filter_grade_list.value = data.data;
          }
          break;
        case 'lesson':
          if (trigger === "filter") {
            filter_lesson_list.value = data.data;
          } else {
            lesson_list.value = data.data;
            filter_lesson_list.value = data.data;
          }
          break;
        case 'topic':
          topic_list.value = data.data;
          break;
        case 'exam_type':
          test_type_list.value = data.data;
          break;
        case 'state':
          state_list.value = data.data;
          break;
        case 'area':
          area_list.value = data.data;
          break;
        case 'school':
          school_list.value = data.data;
          break;
      }
    }
  } catch (err) {
    showError(`Error loading ${type} data`);
    console.error(err);
  }
};

const selectTopic = (topics) => {
  selected_topics.value = topics;
  form.topics = topics.map(item => item.id);
  
  if (form.topics.length) {
    getTopicTitleList();
  }
};

const getTopicTitleList = () => {
  topicTitleArr.value = selected_topics.value.map(topic => topic.title);
};

const updateQuestion = async () => {
  submit_loading.value = true;
  
  if (!selected_topics.value.length) {
    submit_loading.value = false;
    showError('Please select at least one topic');
    return;
  }
  
  try {
    const formData = new FormData();
    
    formData.append('_method', 'PUT');
    formData.append('title', form.title);
    formData.append('section_id', form.section);
    formData.append('grade_id', form.base);
    formData.append('lesson_id', form.lesson);
    formData.append('exam_type_id', form.exam_type);
    formData.append('level', form.level);
    formData.append('duration', form.duration);
    formData.append('paper_id', form.paperID || '');
    formData.append('state_id', form.state || '');
    formData.append('area_id', form.area || '');
    formData.append('school_id', form.school || '');
    formData.append('holding_level', form.holding_level);
    
    for (const topicId of form.topics) {
      formData.append('topics[]', topicId);
    }
    
    const response = await fetch(`${process.env.apiBase}/api/v1/onlineexam/exams/${exam_id.value}`, {
      method: 'POST',
      headers: {
        Authorization: userToken.value
      },
      body: formData
    });
    
    if (!response.ok) throw new Error('Failed to update exam');
    
    const data = await response.json();
    
    if (data && data.success) {
      showSuccess('Exam updated successfully');
      test_step.value = 2;
    }
  } catch (err) {
    showError('Failed to update exam');
    console.error(err);
  } finally {
    submit_loading.value = false;
  }
};

const generateTitle = () => {
  if (!form.section || !form.base || !form.lesson) return;
  
  const section = level_list.value.find(x => x.id == form.section);
  const base = grade_list.value.find(x => x.id == form.base);
  const lesson = lesson_list.value.find(x => x.id == form.lesson);
  
  if (section && base && lesson) {
    form.title = `${section.title} ${base.title} ${lesson.title} Test`;
  }
};

const getExamTests = async () => {
  test_loading.value = true;
  
  try {
    const queryParams = new URLSearchParams();
    
    if (filter.section) queryParams.set('section', filter.section);
    if (filter.base) queryParams.set('base', filter.base);
    if (filter.lesson) queryParams.set('lesson', filter.lesson);
    if (filter.topic) queryParams.set('topic', filter.topic);
    if (filter.testsHasVideo) queryParams.set('hasVideo', filter.testsHasVideo);
    if (filter.myTests) queryParams.set('myTests', 'yes');
    
    queryParams.set('perpage', filter.perpage.toString());
    queryParams.set('page', filter.page.toString());
    
    const response = await fetch(
      `${process.env.apiBase}/api/v1/onlineexam/test/list?${queryParams.toString()}`,
      {
        headers: {
          Authorization: userToken.value
        }
      }
    );
    
    if (!response.ok) throw new Error('Failed to fetch test list');
    
    const data = await response.json();
    
    if (data && data.data) {
      if (filter.page === 1) {
        test_list.value = data.data.data || [];
      } else {
        test_list.value = [...test_list.value, ...(data.data.data || [])];
      }
      
      all_tests_loaded.value = !data.data.data || data.data.data.length === 0 || test_list.value.length >= data.data.total;
      
      await nextTick();
      renderMathJax();
    }
  } catch (err) {
    showError('Failed to load tests');
    console.error(err);
  } finally {
    test_loading.value = false;
  }
};

const getExamCurrentTests = async () => {
  if (!tests.value.length) {
    previewTestList.value = [];
    return;
  }
  
  try {
    const formData = new FormData();
    tests.value.forEach(id => {
      formData.append('test_ids[]', id);
    });
    
    const response = await fetch(
      `${process.env.apiBase}/api/v1/onlineexam/test/get-tests`,
      {
        method: 'POST',
        headers: {
          Authorization: userToken.value
        },
        body: formData
      }
    );
    
    if (!response.ok) throw new Error('Failed to fetch current tests');
    
    const data = await response.json();
    
    if (data && data.data) {
      previewTestList.value = data.data;
      
      await nextTick();
      renderMathJax();
    }
  } catch (err) {
    showError('Failed to load test preview');
    console.error(err);
  }
};

const renderMathJax = () => {
  if (window.MathJax) {
    nextTick(() => {
      window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
    });
  }
};

const onScroll = () => {
  if (!testList.value || all_tests_loaded.value) return;
  
  const { scrollTop, clientHeight, scrollHeight } = testList.value;
  
  if (scrollTop + clientHeight >= scrollHeight - 100) {
    filter.page++;
    getExamTests();
  }
};

const applyTest = (item, type) => {
  if (type === 'add' && !tests.value.includes(item.id)) {
    tests.value.push(item.id);
    submitTest();
  } else if (type === 'remove' && tests.value.includes(item.id)) {
    const index = tests.value.indexOf(item.id);
    if (index !== -1) {
      tests.value.splice(index, 1);
      submitTest();
    }
  }
};

const submitTest = async () => {
  if (!tests.value.length) return;
  
  try {
    const formData = new FormData();
    
    tests.value.forEach((id, index) => {
      formData.append(`test_ids[${index}]`, id);
    });
    
    const response = await fetch(
      `${process.env.apiBase}/api/v1/onlineexam/exams/tests/${exam_id.value}`,
      {
        method: 'POST',
        headers: {
          Authorization: userToken.value
        },
        body: formData
      }
    );
    
    if (!response.ok) throw new Error('Failed to update test list');
    
    getExamCurrentTests();
  } catch (err) {
    showError('Failed to update test list');
    console.error(err);
  }
};

const publishTest = async () => {
  if (tests.value.length < 5) {
    showError('Please select at least 5 tests');
    return;
  }
  
  publish_loading.value = true;
  
  try {
    const formData = new FormData();
    
    tests.value.forEach((id, index) => {
      formData.append(`test_ids[${index}]`, id);
    });
    
    const response = await fetch(
      `${process.env.apiBase}/api/v1/onlineexam/exams/publish/${exam_id.value}`,
      {
        method: 'POST',
        headers: {
          Authorization: userToken.value
        },
        body: formData
      }
    );
    
    if (!response.ok) throw new Error('Failed to publish test');
    
    const data = await response.json();
    
    if (data && data.success) {
      showSuccess('Test published successfully');
      test_step.value = 4;
    }
  } catch (err) {
    showError('Failed to publish test');
    console.error(err);
  } finally {
    publish_loading.value = false;
  }
};

const copyUrl = () => {
  const el = document.getElementById('share_link');
  if (el) {
    el.select();
    document.execCommand('copy');
    showSuccess('Link copied to clipboard');
  }
};

const previewDragEnd = () => {
  nextTick(() => {
    renderMathJax();
  });
  
  // Update test order
  tests.value = previewTestList.value.map(item => item.id);
  submitTest();
};

// Return title of level for show in preview list
const calcLevel = (level) => {
  if (!level) return '';
  
  const levelItem = test_level_list.find(x => x.id === level);
  return levelItem ? levelItem.title : '';
};

const deleteOnlineExam = async () => {
  deleteLoading.value = true;
  
  try {
    const response = await fetch(
      `${process.env.apiBase}/api/v1/onlineexam/exams/${exam_id.value}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: userToken.value
        }
      }
    );
    
    if (!response.ok) throw new Error('Failed to delete exam');
    
    showSuccess('Exam deleted successfully');
    router.push('/user/exam');
  } catch (err) {
    showError('Failed to delete exam');
    console.error(err);
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
  if (!delete_exam_test_id.value) return;
  
  delete_exam_test_loading.value = true;
  
  try {
    const response = await fetch(
      `${process.env.apiBase}/api/v1/onlineexam/test/${delete_exam_test_id.value}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: userToken.value
        }
      }
    );
    
    if (!response.ok) throw new Error('Failed to delete test');
    
    showSuccess('Test deleted successfully');
    
    // Remove from test list if it exists
    const index = test_list.value.findIndex(item => item.id === delete_exam_test_id.value);
    if (index !== -1) {
      test_list.value.splice(index, 1);
    }
    
    // Remove from tests array if it exists
    const testIndex = tests.value.indexOf(delete_exam_test_id.value);
    if (testIndex !== -1) {
      tests.value.splice(testIndex, 1);
      getExamCurrentTests();
    }
  } catch (err) {
    showError('Failed to delete test');
    console.error(err);
  } finally {
    delete_exam_test_loading.value = false;
    deleteTestConfirmDialog.value = false;
    delete_exam_test_id.value = null;
  }
};

const uploadFile = async () => {
  if (!file_original.value) return;
  
  const formData = new FormData();
  formData.append('file', file_original.value);
  
  try {
    const response = await fetch(
      `${process.env.apiBase}/api/v1/upload`,
      {
        method: 'POST',
        headers: {
          Authorization: userToken.value
        },
        body: formData
      }
    );
    
    if (!response.ok) throw new Error('Failed to upload file');
    
    const data = await response.json();
    
    if (data && data.data && data.data[0] && data.data[0].file) {
      form.file_original = data.data[0].file.name;
    }
  } catch (err) {
    showError('Failed to upload file');
    console.error(err);
  }
};

// Toast notifications
const showSuccess = (message) => {
  const { $toast } = useNuxtApp();
  if ($toast) {
    $toast.success(message);
  } else {
    console.log('Success:', message);
  }
};

const showError = (message) => {
  const { $toast } = useNuxtApp();
  if ($toast) {
    $toast.error(message);
  } else {
    console.error('Error:', message);
  }
};

// Watchers
watch(() => route.query, (val) => {
  if (val && val.active === "test_list") {
    test_step.value = 2;
    testListSwitch.value = true;
  }
});

watch(() => form.section, async (val) => {
  if (val) {
    await getTypeList("base", val);
    await getTypeList("state");
    filter.section = val;
    
    form.base = "";
    form.lesson = "";
    form.state = "";
    form.area = "";
    form.school = "";
    selected_topics.value = [];
    
    if (createForm.value) {
      createForm.value.form.section = val;
    }
  }
});

watch(() => filter.section, async (val) => {
  if (val) {
    await getTypeList("base", val, "filter");
  }
  
  filter_grade_list.value = [];
  filter_lesson_list.value = [];
  filter.base = "";
  filter.lesson = "";
  filter.page = 1;
  test_list.value = [];
  all_tests_loaded.value = false;
});

watch(() => form.base, async (val) => {
  if (val) {
    await getTypeList("lesson", val);
    filter.base = val;
    
    form.lesson = "";
    selected_topics.value = [];
    
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
  
  filter_lesson_list.value = [];
  filter.lesson = "";
  filter.page = 1;
  test_list.value = [];
  all_tests_loaded.value = false;
});

watch(() => form.lesson, async (val) => {
  if (val) {
    await getTypeList("topic", val);
    filter.lesson = val;
    
    selected_topics.value = [];
    
    if (createForm.value) {
      createForm.value.form.lesson = val;
    }
    
    if (topicSelector.value) {
      topicSelector.value.lesson_selected = true;
    }
    
    generateTitle();
  } else {
    if (topicSelector.value) {
      topicSelector.value.lesson_selected = false;
    }
  }
});

watch(() => filter.lesson, async (val) => {
  if (val) {
    await getTypeList("topic", val, "filter");
  }
  
  filter.page = 1;
  test_list.value = [];
  all_tests_loaded.value = false;
  await getExamTests();
});

watch(() => form.state, async (val) => {
  if (val) {
    await getTypeList("area", val);
    
    form.area = "";
    form.school = "";
  }
});

watch(() => form.area, async (val) => {
  if (val && form.section && form.state) {
    await getTypeList("school");
    
    form.school = "";
  }
});

watch([() => filter.topic, () => filter.testsHasVideo, () => filter.myTests], async () => {
  filter.page = 1;
  test_list.value = [];
  all_tests_loaded.value = false;
  await getExamTests();
});

watch(() => selected_topics.value, () => {
  getTopicTitleList();
});

watch(() => lastCreatedTest.value, (val) => {
  if (val && val.id && !tests.value.includes(val.id)) {
    tests.value.push(val.id);
    submitTest();
  }
});

// Initialize on mount
onMounted(async () => {
  if (!userToken.value) {
    showError('Authentication token not found. Please log in again.');
    router.push('/login?redirect=/test-maker/create');
    return;
  }
  
  await getTypeList("section");
  await getTypeList("exam_type");
  
  if (route.params.id) {
    exam_id.value = route.params.id;
    await getCurrentExamInfo();
  }
  
  await getExamTests();
  
  // Enable edit mode in create test form
  if (createForm.value) {
    createForm.value.examEditMode = true;
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
