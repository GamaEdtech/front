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
        <p>Tests</p>
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

<script>
import { ValidationObserver, ValidationProvider } from "vee-validate";
import TopicSelector from "@/components/form/topic-selector";
import { min } from "vee-validate/dist/rules";
import CreateTestForm from "@/components/test-maker/create-test-form";

export default {
  layout: "test-maker-layout",
  name: "test-maker-edit",
  head() {
    return {
      title: "Update online exam",
      script: [
        {
          src: `${process.env.API_BASE_URL}/assets/packages/MathJax/MathJax.js?config=TeX-MML-AM_CHTML`,
          defer: true,
        },
      ],
    };
  },
  components: {
    CreateTestForm,
    ValidationObserver,
    ValidationProvider,
    TopicSelector,
  },
  data() {
    return {
      test_step: 2,
      exam_id: "",
      exam_code: "",
      form: {
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
        // start_date: parseInt(this.$moment().format('x') / 1000),
        title: "",
        paperID: "",
        negative_point: false,
        file_original: "",
      },
      file_original: "",
      filter: {
        section: "",
        base: "",
        lesson: "",
        topic: "",
        page: 1,
        perpage: 40,
      },
      // teaching_time: '',
      // teaching_time_seconds: 0,
      // teaching_date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      // teaching_date_time: '',

      // timepicker_menu: false,

      level_list: [],
      filter_level_list: [],

      grade_list: [],
      filter_grade_list: [],

      field_list: [],

      lesson_list: [],
      filter_lesson_list: [],

      topic_list: [],
      test_type_list: [],
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
      video_analysis_options: [
        {
          value: 0,
          title: "All",
        },
        {
          value: 1,
          title: "Have",
        },
        {
          value: -1,
          title: "Do not have",
        },
      ],
      state_list: [],
      area_list: [],
      school_list: [],
      holding_level_list: [
        { id: 1, title: "School" },
        { id: 2, title: "District" },
        { id: 3, title: "State" },
        { id: 4, title: "Country" },
      ],
      submit_loading: false,
      publish_loading: false,
      test_list: [],
      test_loading: false,
      all_tests_loaded: false,
      tests: [],
      test_share_link: `https://gamatrain.com/exam/${this.$route.params.id}`,
      printPreviewDialog: false,
      confirmDeleteDialog: false,
      deleteLoading: false,
      previewTestList: [],
      topicTitleArr: [],

      testListSwitch: true,
      lastCreatedTest: "",

      //Delete exam test section
      deleteTestConfirmDialog: false,
      delete_exam_test_id: "",
      delete_exam_test_loading: false,
      //End Delete exam test section

      selected_topics: [],
    };
  },
  mounted() {
    this.getTypeList("section");
    this.getTypeList("exam_type");
    this.getTypeList("state");

    this.getCurrentExamInfo();

    this.getExamTests();

    this.getExamCurrentTests();

    this.renderMathJax();

    this.$refs["create-form"].examEditMode = true; //Enable edit mode in create test form
  },

  watch: {
    "$route.query"(val) {
      if (val && val.active === "test_list") {
        this.test_step = 2;
        this.testListSwitch = true;
      }
    },

    // "teaching_date"(val) {//Convert date to secounds
    //   this.form.start_date = this.teaching_time_seconds;
    //   this.teaching_date_time = (this.$moment(val).format('x') / 1000);
    //   this.form.start_date = parseInt(this.teaching_date_time + this.teaching_time_seconds);
    // },
    // "teaching_time"(val) {//Convert hour and minute to seconds
    //   var val_split = val.split(':');
    //   var hour = val_split[0] * 3600;
    //   var minute = val_split[1] * 60;
    //   var final_time = (hour + minute);
    //
    //   this.teaching_time_seconds = final_time;
    //   this.form.start_date = parseInt(this.teaching_date_time + this.teaching_time_seconds);
    // },

    "form.section"(val) {
      if (val) {
        this.getTypeList("base", val);
        this.filter.section = val; //Init second level filter
        this.$refs["create-form"].form.section = val;

        if (this.form.area) this.getTypeList("school");
      }
    },

    "filter.section"(val) {
      if (val) {
        this.getTypeList("base", val, "filter");
      }
      this.all_tests_loaded = true;
      this.filter_grade_list = [];
      this.filter_lesson_list = [];
      this.filter.page = 1;
      this.test_list = [];

      this.filter.base = "";
      this.filter.lesson = "";
    },

    "form.base"(val) {
      this.getTypeList("lesson", val);
      this.filter.base = val; //Init second level filter
      this.$refs["create-form"].form.base = val;

      this.generateTitle();
    },
    "filter.base"(val) {
      if (val) {
        this.getTypeList("lesson", val, "filter");
      }
      this.all_tests_loaded = true;

      this.filter_lesson_list = [];

      this.filter.lesson = "";
      this.filter.page = 1;
      this.test_list = [];
    },

    "form.lesson"(val) {
      if (val) {
        this.getTypeList("topic", val);
        this.$refs["topic-selector"].lesson_selected = true;
      } else {
        this.$refs["topic-selector"].lesson_selected = false;
      }

      this.filter.lesson = val; //Init second level filter
      this.$refs["create-form"].form.lesson = val;

      this.generateTitle();
    },

    "filter.lesson"(val) {
      if (val) {
        this.getTypeList("topic", val, "filter");
      }
      this.all_tests_loaded = false;

      this.filter.page = 1;
      this.test_list = [];
      this.getExamTests();
    },

    "form.state"(val) {
      this.getTypeList("area", val);
    },
    "form.area"(val) {
      if (this.form.section) this.getTypeList("school");
    },

    "filter.topic"(val) {
      this.filter.page = 1;
      this.test_list = [];
      this.getExamTests();
    },

    "filter.testsHasVideo"(val) {
      this.filter.page = 1;
      this.test_list = [];
      this.getExamTests();
    },

    "filter.myTests"(val) {
      this.filter.page = 1;
      this.test_list = [];
      this.getExamTests();
    },
    lastCreatedTest(val) {
      if (val && !this.tests.find((x) => x == val)) {
        this.tests.push(val);
        this.submitTest();
      }
    },
  },
  methods: {
    //Load exam info for edit
    getCurrentExamInfo() {
      this.exam_id = this.$route.params.id;
      this.$axios
        .$get(`/api/v1/exams/info/${this.$route.params.id}`)
        .then((response) => {
          console.log(response);
          this.tests = response.data.tests.length ? response.data.tests : [];
          this.exam_code = response.data.code;
          this.test_share_link = `https://gamatrain.com/exam/${this.$route.params.id}`;
          this.form.section = response.data.section;
          this.form.base = response.data.base;
          this.form.lesson = response.data.lesson;

          this.selected_topics = response.data.topics; //Pass to topic selector when form load
          this.form.topics = response.data.topics;

          this.form.exam_type = response.data.azmoon_type;
          this.form.paperID = response.data.paperID;
          this.form.duration = response.data.azmoon_time;
          this.form.file_original = response.data.file_original;
          setTimeout(() => {
            this.form.title = response.data.title;
          }, 2000);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getTypeList(type, parent = "", trigger = "") {
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
            if (trigger === "filter") {
              this.filter_level_list = res.data;
            } else {
              this.level_list = res.data;
              this.filter_level_list = res.data;
            }
          } else if (type === "base") {
            if (trigger === "filter") {
              this.filter_grade_list = res.data;
            } else {
              this.grade_list = res.data;
              this.filter_grade_list = res.data;
            }
          } else if (type === "lesson") {
            if (trigger === "filter") {
              this.filter_lesson_list = res.data;
            } else {
              this.lesson_list = res.data;
              this.filter_lesson_list = res.data;
            }
          } else if (type === "topic") {
            this.topic_list = res.data;
          } else if (type === "exam_type") {
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

    selectTopic(event) {
      var numbers = [];
      for (var i = 0; i < event.length; i++) {
        numbers[i] = parseInt(event[i]);
      }
      this.form.topics = numbers;
      if (this.form.topics.length) this.getTopicTitleList();
    },

    getTopicTitleList() {
      this.topicTitleArr = [];
      var title = "";
      for (var index in this.form.topics) {
        title = this.topic_list.find(
          (x) => x.id == this.form.topics[index]
        ).title;
        this.topicTitleArr.push(title);
      }
    },

    updateQuestion() {
      this.submit_loading = true;

      //Arrange to form data
      let formData = new FormData();
      for (let key in this.form) {
        if (key != "topics") formData.append(key, this.form[key]);
      }

      if (this.form.topics.length)
        for (let key in this.form.topics)
          formData.append("topics[]", this.form.topics[key]);

      //End arrange to form data

      this.$axios
        .$put(
          `/api/v1/exams/${this.$route.params.id}`,
          this.urlencodeFormData(formData),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        )
        .then((response) => {
          this.$toast.success("Updated successfully");
          this.test_step = 2;
        })
        .catch((error) => {
          this.$toast.error(error.response.data.message);
        })
        .finally(() => {
          this.submit_loading = false;
        });
    },

    generateTitle() {
      var lesson_title = "";
      if (this.form.lesson && this.lesson_list.length > 0) {
        lesson_title = this.lesson_list.find(
          (x) => x.id === this.form.lesson
        ).title;
      }

      var base_title = "";
      if (this.form.base && this.grade_list.length > 0)
        base_title = this.grade_list.find((x) => x.id === this.form.base).title;

      this.form.title = `${lesson_title} Test ${base_title} Grade`;
    },

    getExamTests() {
      this.test_loading = true;
      this.$axios
        .$get("/api/v1/examTests", {
          params: {
            lesson: this.filter.lesson,
            topic: this.filter.topic,
            myTests: this.filter.myTests,
            testsHasVideo: this.filter.testsHasVideo,
            page: this.filter.page,
            perpage: this.filter.perpage,
          },
        })
        .then((response) => {
          this.test_list.push(...response.data.list);

          if (this.test_list.length) {
            this.$nextTick(function () {
              MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
            });
          }
          this.$refs["create-form"].examTestListLenght = this.tests.length;

          if (response.data.list.length === 0)
            //For terminate auto load request
            this.all_tests_loaded = true;
          else this.all_tests_loaded = false;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.test_loading = false;
        });
    },
    getExamCurrentTests() {
      this.test_loading = true;
      this.$axios
        .$get("/api/v1/examTests", {
          params: {
            exam_id: this.$route.params.id,
          },
        })
        .then((response) => {
          this.previewTestList = response.data.list;
          this.$refs["create-form"].examTestListLenght = this.tests.length;

          if (this.previewTestList.length) {
            this.$nextTick(function () {
              MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
            });
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {});
    },

    renderMathJax() {
      if (window.MathJax) {
        window.MathJax.Hub.Config({
          tex2jax: {
            inlineMath: [
              ["$", "$"],
              ["\(", "\)"],
            ],
            displayMath: [
              ["$$", "$$"],
              ["\[", "\]"],
            ],
            processEscapes: true,
            processEnvironments: true,
          },
          // Center justify equations in code and markdown cells. Elsewhere
          // we use CSS to left justify single line equations in code cells.
          displayAlign: "center",
          "HTML-CSS": {
            styles: { ".MathJax_Display": { margin: 0 } },
            linebreaks: { automatic: true },
          },
        });
        MathJax.Hub.Queue([
          "Typeset",
          window.MathJax.Hub,
          this.$refs.mathJaxEl,
        ]);
      }
    },

    onScroll() {
      var scrollPosition = this.$refs.testList.$el.scrollTop;
      let contentHeight = this.$refs.testListContent.clientHeight;

      //Avoid the number of requests
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }

      if (
        scrollPosition > contentHeight - 1000 &&
        this.all_tests_loaded === false
      )
        this.timer = setTimeout(() => {
          this.test_loading = true;
          this.filter.page++;
          // this.getExamTests();
        }, 800);
    },

    applyTest(item, type) {
      if (this.tests.find((x) => x == item.id) && type === "remove") {
        this.tests.splice(this.tests.indexOf(item.id), 1);

        this.submitTest();
      }

      if (!this.tests.find((x) => x == item.id) && type === "add") {
        this.tests.push(item.id);

        this.submitTest();
      }
    },

    submitTest() {
      let formData = new FormData();
      for (var i = 0; i < this.tests.length; i++) {
        formData.append("tests[]", this.tests[i]);
      }

      if (this.tests.length) {
        this.$axios
          .$put(
            `/api/v1/exams/tests/${this.$route.params.id}`,
            this.urlencodeFormData(formData),
            {
              headers: {
                "Content-Type":
                  "application/x-www-form-urlencoded; charset=UTF-8",
              },
            }
          )
          .then((response) => {
            this.getExamCurrentTests();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },

    /**
     * @brief publish test
     */
    publishTest() {
      this.publish_loading = true;
      this.$axios
        .$put(`/api/v1/exams/publish/${this.$route.params.id}`)
        .then((response) => {
          if (response.data.message === "done") {
            this.test_step = 4;
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.publish_loading = false;
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

    copyUrl() {
      navigator.clipboard.writeText(this.test_share_link);
      this.$toast.success("Copied");
    },

    previewDragEnd() {
      this.$nextTick(function () {
        MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
      });

      var new_list = [];
      for (var index in this.previewTestList) {
        new_list.push(this.previewTestList[index].id);
      }
      this.tests = new_list;
      this.submitTest();
    },

    //Return title of level for show in preview list
    calcLevel(level) {
      if (level) return this.test_level_list.find((x) => x.id === level).title;
    },

    deleteOnlineExam() {
      this.deleteLoading = true;
      this.$axios
        .$delete(`/api/v1/exams/${this.exam_id}`)
        .then((response) => {
          this.$toast.success("Deleted successfully");
          this.$router.push({
            path: "/user/exam",
          });
        })
        .catch((err) => {
          this.$toast.error("An error occurred");
        })
        .finally(() => {
          this.deleteLoading = false;
          this.confirmDeleteDialog = false;
        });
    },

    //Delete exam test
    openTestDeleteConfirmDialog(item_id) {
      this.delete_exam_test_id = item_id;
      this.deleteTestConfirmDialog = true;
    },
    async deleteExamTest() {
      this.delete_exam_test_loading = true;
      await this.$axios
        .$delete(`/api/v1/examTests/${this.delete_exam_test_id}`)
        .then((response) => {
          this.$toast.success("Deleted successfully");
          this.filter.page = 1;
          this.test_list = [];
          // this.getExamTests();
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.delete_exam_test_loading = false;
          this.delete_exam_test_id = null;
          this.deleteTestConfirmDialog = false;
        });
    },

    //End delete exam test

    uploadFile(file_name) {
      let formData = new FormData();
      formData.append("file", this.file_original);
      this.$axios
        .$post("/api/v1/upload", formData, {
          headers: {
            accept: "*/*",
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          this.form.file_original = response.data[0].file.name;
        })
        .catch((err) => {});
      // }
    },
  },
};
</script>

<style scoped></style>
