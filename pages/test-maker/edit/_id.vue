<template>
  <v-container class="test-maker">
    <v-row class="mt-4">
      <v-col cols="6">
        <span class="icon icong-azmoon text-h3 teal--text"></span>
        <span class="text-h4 teal--text"> Update online exam </span>
      </v-col>
      <v-col cols="6" id="tool-box" class="text-right">
        <v-btn
          outlined
          color="error"
          fab
          small
          @click="confirmDeleteDialog = true"
        >
          <v-icon> mdi-delete </v-icon>
        </v-btn>
        <v-btn
          outlined
          fab
          small
          @click="printPreviewDialog = !printPreviewDialog"
        >
          <v-icon> mdi-printer-eye </v-icon>
        </v-btn>

        <!--        <v-btn fab small color="error">-->
        <!--          <v-icon>-->
        <!--            mdi-delete-->
        <!--          </v-icon>-->
        <!--        </v-btn>-->
      </v-col>
    </v-row>

    <v-stepper flat v-model="test_step" vertical class="mb-16">
      <v-stepper-step
        :complete="test_step > 1"
        step="1"
        class="pointer"
        @click="test_step = 1"
        color="teal"
      >
        <p>Header</p>
      </v-stepper-step>
      <v-stepper-content step="1">
        <v-card flat class="mt-3 pb-10">
          <validation-observer ref="observer" v-slot="{ invalid }">
            <form @submit.prevent="updateQuestion">
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
                      :items="level_list"
                      :error-messages="errors"
                      item-text="title"
                      item-value="id"
                      label="Curriculum"
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
                      :selectedTopics="selected_topics"
                      :topic-list="topic_list"
                      @selectTopic="selectTopic"
                    />
                  </validation-provider>
                </v-col>

                <v-col cols="12" md="4">
                  <validation-provider
                    v-slot="{ errors }"
                    name="test_type"
                    rules="required"
                  >
                    <v-autocomplete
                      dense
                      :items="test_type_list"
                      item-value="id"
                      item-text="title"
                      v-model="form.exam_type"
                      :error-messages="errors"
                      label="Test type"
                      outlined
                    />
                  </validation-provider>
                </v-col>

                <!--                <v-col cols="12" md="4">-->
                <!--                  <validation-provider v-slot="{errors}" name="test_level" rules="required">-->
                <!--                    <v-autocomplete-->
                <!--                      dense-->
                <!--                      :items="test_level_list"-->
                <!--                      item-value="id"-->
                <!--                      item-text="title"-->
                <!--                      v-model="form.level"-->
                <!--                      :error-messages="errors"-->
                <!--                      label="Level"-->
                <!--                      outlined-->
                <!--                    />-->
                <!--                  </validation-provider>-->
                <!--                </v-col>-->

                <!--                <v-col cols="12" md="4"-->
                <!--                >-->
                <!--                  <validation-provider v-slot="{errors}" name="holding_level" rules="required">-->
                <!--                    <v-autocomplete-->
                <!--                      dense-->
                <!--                      :items="holding_level_list"-->
                <!--                      v-model="form.holding_level"-->
                <!--                      item-text="title"-->
                <!--                      item-value="id"-->
                <!--                      :error-messages="errors"-->
                <!--                      label="Holding level"-->
                <!--                      outlined-->
                <!--                    />-->
                <!--                  </validation-provider>-->
                <!--                </v-col>-->

                <v-col cols="12" md="4">
                  <validation-provider
                    v-slot="{ errors }"
                    name="test_duration"
                    rules="required"
                  >
                    <v-text-field
                      dense
                      v-model="form.duration"
                      item-text="title"
                      type="number"
                      min="1"
                      item-value="id"
                      :error-messages="errors"
                      label="Test duration"
                      outlined
                    />
                  </validation-provider>
                </v-col>

                <!--                <v-col cols="12" md="4">-->
                <!--                  <v-file-input-->
                <!--                    dense-->
                <!--                    v-model="file_original"-->
                <!--                    @change="uploadFile('file_original')"-->
                <!--                    accept="application/pdf"-->
                <!--                    label="Source file"-->
                <!--                    outlined-->
                <!--                  />-->
                <!--                </v-col>-->

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
                    dense
                    :items="state_list"
                    v-model="form.state"
                    item-text="title"
                    item-value="id"
                    label="State"
                    outlined
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="4"
                  v-if="form.holding_level === 1 || form.holding_level === 2"
                >
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
                <v-col
                  cols="12"
                  md="4"
                  v-if="form.section && form.area && form.holding_level === 1"
                >
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

                <v-col cols="12" md="8">
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
                <v-col cols="12" md="4">
                  <v-text-field
                    dense
                    label="Past Paper Id"
                    v-model="form.paperID"
                    outlined
                  />
                </v-col>

                <!--                <v-col cols="12" md="4">-->
                <!--                  <v-checkbox-->
                <!--                    dense-->
                <!--                    v-model="form.negative_point"-->
                <!--                    label="Negative point"-->
                <!--                  />-->
                <!--                </v-col>-->

                <!--                <v-col cols="12" md="4">-->
                <!--                  <v-checkbox-->
                <!--                    dense-->
                <!--                    v-model="form.holding_time"-->
                <!--                    label="Time of holding"-->
                <!--                  />-->

                <!--                </v-col>-->

                <!--                <v-col cols="12" md="12" v-show="form.holding_time">-->
                <!--                  <v-date-picker-->
                <!--                    color="teal"-->
                <!--                    v-model="teaching_date"-->
                <!--                    full-width-->
                <!--                  ></v-date-picker>-->
                <!--                </v-col>-->

                <!--                <v-col-->
                <!--                  cols="12"-->
                <!--                  md="4"-->
                <!--                  v-show="form.holding_time"-->
                <!--                >-->
                <!--                  <v-menu-->
                <!--                    ref="menu"-->
                <!--                    v-model="timepicker_menu"-->
                <!--                    :close-on-content-click="false"-->
                <!--                    :nudge-right="40"-->
                <!--                    :return-value.sync="teaching_time"-->
                <!--                    transition="scale-transition"-->
                <!--                    offset-y-->
                <!--                  >-->
                <!--                    <template v-slot:activator="{ on, attrs }">-->
                <!--                      <v-text-field-->
                <!--                        v-model="teaching_time"-->
                <!--                        label="Start time"-->
                <!--                        prepend-icon="mdi-clock-time-four-outline"-->
                <!--                        readonly-->
                <!--                        outlined-->
                <!--                        dense-->
                <!--                        v-bind="attrs"-->
                <!--                        v-on="on"-->
                <!--                      ></v-text-field>-->
                <!--                    </template>-->
                <!--                    <v-time-picker-->
                <!--                      v-if="timepicker_menu"-->
                <!--                      v-model="teaching_time"-->
                <!--                      full-width-->
                <!--                      format="24hr"-->
                <!--                      @click:minute="$refs.menu.save(teaching_time)"-->
                <!--                    ></v-time-picker>-->
                <!--                  </v-menu>-->
                <!--                </v-col>-->

                <v-col cols="12">
                  <v-row>
                    <v-col cols="12" md="6" class="pb-0">
                      <v-btn
                        type="submit"
                        :loading="submit_loading"
                        :disabled="invalid"
                        lg
                        color="teal"
                        class="white--text"
                        block
                      >
                        Update & Next step
                      </v-btn>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-btn lg outlined color="error" to="/user/exam" block>
                        Discard
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </form>
          </validation-observer>
        </v-card>
      </v-stepper-content>

      <v-stepper-step
        :complete="test_step > 2"
        @click="test_step = 2"
        step="2"
        class="pointer"
        color="teal"
      >
        Tests
      </v-stepper-step>
      <v-stepper-content step="2">
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
              <create-test-form
                ref="create-form"
                :goToPreviewStep.sync="test_step"
                :updateTestList.sync="lastCreatedTest"
              />
            </v-col>
          </v-row>
          <v-row v-show="testListSwitch">
            <v-col cols="12" md="4">
              <v-autocomplete
                dense
                v-model="filter.section"
                :items="filter_level_list"
                item-text="title"
                clearable
                item-value="id"
                label="Curriculum"
                outlined
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-autocomplete
                dense
                v-model="filter.base"
                :items="filter_grade_list"
                item-value="id"
                clearable
                item-text="title"
                label="Grade"
                outlined
              />
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
            <v-col cols="12" md="4">
              <v-autocomplete
                dense
                :items="filter_lesson_list"
                item-value="id"
                item-text="title"
                clearable
                v-model="filter.lesson"
                label="Subject"
                outlined
              />
            </v-col>

            <v-col cols="12" md="4">
              <v-autocomplete
                dense
                :items="topic_list"
                item-value="id"
                item-text="title"
                v-model="filter.topic"
                label="Topic"
                outlined
              >
                <template v-slot:item="data">
                  <p
                    :class="data.item.season ? 'topic_season' : ''"
                    class="py-2"
                  >
                    {{ data.item.title }}
                  </p>
                </template>
              </v-autocomplete>
            </v-col>

            <v-col cols="12" md="4">
              <v-autocomplete
                dense
                :items="video_analysis_options"
                item-value="value"
                item-text="title"
                v-model="filter.testsHasVideo"
                label="Video analysis"
                outlined
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-checkbox
                class="mt-1"
                v-model="filter.myTests"
                label="My own tests"
                outlined
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
                            outlined
                            color="success"
                            v-show="item.level === '1'"
                          >
                            Simple
                          </v-chip>
                          <v-chip
                            outlined
                            color="primary"
                            v-show="item.level === '2'"
                          >
                            Middle
                          </v-chip>
                          <v-chip
                            outlined
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
                          large
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
                          large
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
                          large
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
                          large
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
                            dark
                            small
                            v-show="!tests.find((x) => x == item.id)"
                            @click="applyTest(item, 'add')"
                          >
                            <v-icon small dark> mdi-plus </v-icon>
                            Add
                          </v-btn>
                          <v-btn
                            color="red"
                            dark
                            small
                            v-show="tests.find((x) => x == item.id)"
                            @click="applyTest(item, 'remove')"
                          >
                            <v-icon small dark> mdi-minus </v-icon>
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
                    lg
                    color="teal"
                    class="white--text"
                    block
                  >
                    <span v-show="tests.length < 5"
                      >Add at least {{ 5 - tests.length }} more tests</span
                    >
                    <span v-show="tests.length >= 5">Next step</span>
                  </v-btn>
                </v-col>
                <v-col cols="12" md="6">
                  <v-btn lg outlined color="error" to="/user/exam" block>
                    Discard
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </v-stepper-content>

      <v-stepper-step
        :complete="test_step > 3"
        @click="test_step = 3"
        color="teal"
        class="pointer"
        step="3"
      >
        Review
      </v-stepper-step>
      <v-stepper-content step="3">
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
                          <v-btn icon fab color="blue">
                            <v-icon> mdi-cursor-move </v-icon>
                          </v-btn>
                        </v-col>
                        <v-col cols="6" class="text-right">
                          <v-btn
                            small
                            v-show="item.owner == true"
                            :to="`/test-maker/create-test/edit/${item.id}`"
                          >
                            <v-icon small dark> mdi-pencil </v-icon>
                            Edit
                          </v-btn>
                          <v-btn
                            color="blue"
                            dark
                            small
                            v-show="!tests.find((x) => x == item.id)"
                            @click="applyTest(item, 'add')"
                          >
                            <v-icon small dark> mdi-plus </v-icon>
                            Add
                          </v-btn>
                          <v-btn
                            color="red"
                            dark
                            small
                            v-show="tests.find((x) => x == item.id)"
                            @click="applyTest(item, 'remove')"
                          >
                            <v-icon small dark> mdi-minus </v-icon>
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
                      lg
                      color="teal"
                      class="white--text"
                      block
                    >
                      <span v-show="tests.length < 5"
                        >Add at least {{ 5 - tests.length }} more tests</span
                      >
                      <span v-show="tests.length >= 5">Publish</span>
                    </v-btn>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-btn lg outlined color="error" to="/user/exam" block>
                      Discard
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <!--End publish button-->
          </v-card-text>
        </v-card>
      </v-stepper-content>

      <v-stepper-step
        :complete="test_step > 4"
        color="teal"
        class="pointer"
        step="4"
      >
        Publish
      </v-stepper-step>
      <v-stepper-content step="4">
        <v-card class="mb-16">
          <v-card-text class="text-center">
            <v-row>
              <v-col cols="12">
                <p class="font-weight-bold teal--text mb-3">
                  Your test is ready to use!
                </p>
                <p>Send below link to your students or friends.</p>

                <div class="d-flex mt-4 align-center justify-center">
                  <v-text-field
                    outlined
                    id="share_link"
                    shaped
                    @click="copyUrl"
                    style="max-width: 320px"
                    dense
                    v-model="test_share_link"
                  >
                    <template slot="append">
                      <v-btn icon @click="copyUrl" class="mb-1">
                        <v-icon> mdi-content-copy </v-icon>
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
                      { text: 'Dashboard', href: '/user' },
                      { text: 'My online exam', href: '/exam/results' },
                    ]"
                  >
                    <template v-slot:divider>
                      <v-icon>mdi-forward</v-icon>
                    </template>
                  </v-breadcrumbs>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-stepper-content>
    </v-stepper>

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
                          <v-btn icon fab color="blue">
                            <v-icon> mdi-cursor-move </v-icon>
                          </v-btn>
                        </v-col>
                        <v-col cols="6" class="text-right">
                          <v-btn
                            color="blue"
                            dark
                            small
                            v-show="!tests.find((x) => x == item.id)"
                            @click="applyTest(item, 'add')"
                          >
                            <v-icon small dark> mdi-plus </v-icon>
                            Add
                          </v-btn>
                          <v-btn
                            color="red"
                            dark
                            small
                            v-show="tests.find((x) => x == item.id)"
                            @click="applyTest(item, 'remove')"
                          >
                            <v-icon small dark> mdi-minus </v-icon>
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
              color="green darken-1"
              text
              @click="confirmDeleteDialog = false"
            >
              Disagree
            </v-btn>
            <v-btn
              color="green darken-1"
              text
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
import { ref, reactive, watch, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '~/composables/useAuth';
import draggable from 'vuedraggable';
import TopicSelector from "~/components/form/topic-selector.vue";

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
    title =
      topic_list.value.find((x) => x.id == form.topics[index])?.title || "";
    topicTitleArr.value.push(title);
  }
};

// Update online exam info
const updateQuestion = async () => {
  update_loading.value = true;
  
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
    await $fetch(`/api/v1/exams/${exam_id.value}`, {
      method: "PUT",
      body: urlencodeFormData(formData),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${userToken.value}`,
      },
    });
    
    const { $toast } = useNuxtApp();
    if ($toast) $toast.success("Updated successfully");
    
    test_step.value = 2;
  } catch (error) {
    const { $toast } = useNuxtApp();
    if ($toast) $toast.error(error.response?.data?.message || "Error updating exam");
  } finally {
    update_loading.value = false;
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

const uploadFile = (file) => {
  if (!file) return;

  file_original.value = file;

  let formData = new FormData();
  formData.append("file", file_original.value);

  try {
    $fetch("/api/v1/upload", {
      method: "POST",
      body: formData,
      headers: {
        accept: "*/*",
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${userToken.value}`,
      },
    }).then((response) => {
      if (
        response &&
        response.data &&
        response.data[0] &&
        response.data[0].file
      ) {
        form.file_original = response.data[0].file.name;
      }
    });
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
      test_step.value = 4;
    }
  } catch (err) {
    console.error(err);
  } finally {
    publish_loading.value = false;
  }
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
    
    router.push('/test-maker');
  } catch (err) {
    console.error(err);
  } finally {
    deleteLoading.value = false;
    confirmDeleteDialog.value = false;
  }
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
    
    tests.value = tests.value.filter(item => item !== delete_exam_test_id.value);
    getCurrentExamTestsInfo();
    
    const { $toast } = useNuxtApp();
    if ($toast) $toast.success("Test removed successfully");
  } catch (err) {
    console.error(err);
  } finally {
    delete_exam_test_loading.value = false;
    deleteTestConfirmDialog.value = false;
  }
};

const getCurrentExamInfo = async () => {
  try {
    const response = await $fetch(`/api/v1/exams/${exam_id.value}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userToken.value}`,
      },
    });
    
    if (response && response.data) {
      form.section = response.data.section;
      form.base = response.data.base;
      form.lesson = response.data.lesson;
      form.exam_type = response.data.exam_type;
      form.level = response.data.level;
      form.holding_level = response.data.holding_level;
      form.holding_time = response.data.holding_time;
      form.state = response.data.state;
      form.area = response.data.area;
      form.school = response.data.school;
      form.duration = response.data.duration;
      form.title = response.data.title;
      form.negative_point = response.data.negative_point;
      form.file_original = response.data.file_original;
      form.edu_year = response.data.edu_year;
      form.edu_month = response.data.edu_month;
      file_original_path.value = response.data.file_original;
      exam_code.value = response.data.code;
      tests.value = response.data.tests;
    }
  } catch (err) {
    console.error(err);
  }
};

const getCurrentExamTestsInfo = async () => {
  try {
    await getCurrentExamInfo();
    
    if (form.topics && form.topics.length > 0) {
      selected_topics.value = form.topics;
      getTopicTitleList();
    }
  } catch (err) {
    console.error(err);
  }
};

const getTestPreview = async () => {
  test_loading.value = true;
  previewTestList.value = [];
  
  try {
    const response = await $fetch("/api/v1/tests", {
      method: "GET",
      params: {
        section: filter.section,
        base: filter.base,
        lesson: filter.lesson,
        topic: filter.topic,
        testsHasVideo: filter.testsHasVideo,
        page: filter.page,
        perpage: filter.perpage,
        my_tests: filter.myTests,
      },
      headers: {
        Authorization: `Bearer ${userToken.value}`,
      },
    });
    
    if (response && response.data) {
      let result = response.data.list;
      for (const item of result) {
        if (previewTestList.value.findIndex(x => x.id === item.id) === -1) {
          previewTestList.value.push(item);
        }
      }
      
      if (result.length === 0) {
        all_tests_loaded.value = true;
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    test_loading.value = false;
  }
};

const previewDragEnd = (event) => {
  // Handle test reordering if needed
};

const applyTest = (item, type) => {
  if (type === 'add') {
    // Add the test to the exam
    $fetch(`/api/v1/exams/${exam_id.value}/tests/${item.id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userToken.value}`,
      },
    }).then(() => {
      tests.value.push(item.id);
      const { $toast } = useNuxtApp();
      if ($toast) $toast.success("Test added successfully");
    });
  } else if (type === 'remove') {
    // Remove the test from the exam
    $fetch(`/api/v1/exams/${exam_id.value}/tests/${item.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${userToken.value}`,
      },
    }).then(() => {
      tests.value = tests.value.filter(id => id !== item.id);
      const { $toast } = useNuxtApp();
      if ($toast) $toast.success("Test removed successfully");
    });
  }
};

// Watchers
watch(
  () => form.section,
  async (val) => {
    if (val) {
      await getTypeList("base", val);
      filter.section = val;
      
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
      filter.base = val;
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
      form.topic = "";
      topic_list.value = [];
      
      if (topicSelector.value) {
        topicSelector.value.lesson_selected = false;
      }
    }
    
    filter.lesson = val;
    generateTitle();
  }
);

watch(
  () => filter.section,
  async (val) => {
    if (val) {
      await getTypeList("base", val, "filter");
      filter.base = "";
      filter.lesson = "";
      filter.topic = "";
      
      filter.page = 1;
      all_tests_loaded.value = false;
      
      getTestPreview();
    }
  }
);

watch(
  () => filter.base,
  async (val) => {
    if (val) {
      await getTypeList("lesson", val, "filter");
      filter.lesson = "";
      filter.topic = "";
      
      filter.page = 1;
      all_tests_loaded.value = false;
      
      getTestPreview();
    }
  }
);

watch(
  () => filter.lesson,
  async (val) => {
    if (val) {
      await getTypeList("topic", val, "filter");
      filter.topic = "";
      
      filter.page = 1;
      all_tests_loaded.value = false;
      
      getTestPreview();
    }
  }
);

watch(
  () => filter.topic,
  (val) => {
    if (val !== undefined) {
      filter.page = 1;
      all_tests_loaded.value = false;
      
      getTestPreview();
    }
  }
);

watch(
  () => filter.testsHasVideo,
  (val) => {
    filter.page = 1;
    all_tests_loaded.value = false;
    
    getTestPreview();
  }
);

// Initialize on mount
onMounted(async () => {
  userToken.value = auth.getUserToken();
  
  await getTypeList("section");
  await getTypeList("exam_type");
  await getTypeList("state");
  
  await getCurrentExamTestsInfo();
});
</script>

<style scoped></style>
