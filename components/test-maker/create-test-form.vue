<template>
  <div id="create-test">
    <embed
      v-if="file_original_path"
      :src="file_original_path"
      width="100%"
      height="200px;"
    />
    <v-card flat class="mt-3">
      <!--Create test form-->
      <v-expansion-panels
        v-model="path_panel_expand"
        :flat="true"
        multiple
        density="compact"
      >
        <v-expansion-panel>
          <v-form ref="observer" v-model="isFormValid">
            <v-row>
              <v-col cols="12" md="2" class="mt-2">
                <v-autocomplete
                  v-model="form.section"
                  :items="level_list"
                  label="Board"
                  item-title="title"
                  item-value="id"
                  variant="outlined"
                  density="compact"
                  :rules="[(v) => !!v || 'Level is required']"
                ></v-autocomplete>
              </v-col>

              <v-col cols="12" md="2" class="mt-2">
                <v-autocomplete
                  v-model="form.base"
                  :items="grade_list"
                  label="Grade"
                  item-title="title"
                  item-value="id"
                  variant="outlined"
                  density="compact"
                  :rules="[(v) => !!v || 'Grade is required']"
                ></v-autocomplete>
              </v-col>

              <v-col cols="12" md="2" class="mt-2">
                <v-autocomplete
                  v-model="form.lesson"
                  :items="lesson_list"
                  label="Subject"
                  item-title="title"
                  item-value="id"
                  variant="outlined"
                  density="compact"
                  :rules="[(v) => !!v || 'Lesson is required']"
                ></v-autocomplete>
              </v-col>

              <v-col cols="12" md="2" class="mt-2">
                <v-autocomplete
                  v-model="form.topic"
                  :items="topic_list"
                  label="Topic"
                  item-title="title"
                  item-value="id"
                  variant="outlined"
                  density="compact"
                ></v-autocomplete>
              </v-col>

              <v-col cols="12" md="2" class="mt-2">
                <v-autocomplete
                  v-model="form.type"
                  :items="typeList"
                  label="Type"
                  item-title="title"
                  item-value="value"
                  variant="outlined"
                  density="compact"
                  :rules="[(v) => !!v || 'Question type is required']"
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-form>
        </v-expansion-panel>
      </v-expansion-panels>

      <!--Question section-->
      <v-card-text id="test-question">
        <VeeForm @submit="submitQuestion">
          <v-row style="flex-wrap: nowrap !important;">
            <v-col cols="12" md="6">
              <div class="mb-3 h-full">
                <label class="text-subtitle-1 font-weight-medium mb-2 d-block"
                  >Question:</label
                >
                <div class="d-flex">
                  <div class="flex-grow-1">
                    <RickEditor v-model:modelValue="form.question"  />
                  </div>
                </div>
              </div>
              <input
                ref="questionInput"
                type="file"
                accept="image/*"
                style="display: none"
                @change="
                  form_hidden_data.q_file = $event.target.files[0];
                  uploadFile('q_file');
                "
              />
              <v-card v-if="form.q_file_base64" class="mt-2 mb-3 pa-1">
                <div class="d-flex justify-end pr-1 pt-1">
                  <v-btn
                    icon="mdi-trash-can-outline"
                    color="red"
                    size="small"
                    variant="plain"
                    @click="deleteFile('q_file')"
                  ></v-btn>
                </div>
                <v-img
                  :src="form.q_file_base64"
                  max-height="100px"
                  contain
                ></v-img>
              </v-card>
            </v-col>

            <v-col cols="12" >
              <div class="mb-3">
                <!--Answers-->
                <div v-if="form.type === 'descriptive'">
                  <v-row>
                    <v-col cols="12">
                      <div class="d-flex mb-3 mt-3">
                        <div class="text-h6 mr-3">Solution:</div>
                        <v-chip-group
                          v-model="text_answer"
                          column
                          multiple
                          @update:model-value="answerTypeChanged('txt')"
                        >
                          <v-chip
                            :value="true"
                            color="teal"
                            filter
                            label
                            variant="outlined"
                          >
                            <v-icon start icon="mdi-text"></v-icon>
                            Text
                          </v-chip>
                        </v-chip-group>

                        <v-chip-group
                          v-model="photo_answer"
                          column
                          multiple
                          @update:model-value="answerTypeChanged('photo')"
                        >
                          <v-chip
                            :value="true"
                            color="teal"
                            filter
                            label
                            variant="outlined"
                          >
                            <v-icon start icon="mdi-camera"></v-icon>
                            Photo
                          </v-chip>
                        </v-chip-group>
                      </div>
                    </v-col>
                  </v-row>

                  <v-row v-if="text_answer">
                    <v-col cols="12">
                      <div class="d-flex">
                        <div class="flex-grow-1">
                          <RickEditor v-model:modelValue="form.answer_full"  />
                        </div>
                        <div class="ml-2 d-flex align-start mt-2">
                          <v-btn
                            icon="mdi-camera-outline"
                            color="teal"
                            size="small"
                            variant="text"
                            @click="selectFile('answer_full_file')"
                          ></v-btn>
                        </div>
                      </div>
                    </v-col>
                  </v-row>

                  <v-row v-if="photo_answer">
                    <v-col cols="12">
                      <v-btn
                        variant="outlined"
                        color="teal"
                        prepend-icon="mdi-camera"
                        @click="selectFile('answer_full_file')"
                      >
                        Select Photo
                      </v-btn>
                      <input
                        ref="answerFullInput"
                        type="file"
                        accept="image/*"
                        style="display: none"
                        @change="
                          form_hidden_data.answer_full_file =
                            $event.target.files[0];
                          uploadFile('answer_full_file');
                        "
                      />
                      <v-card
                        v-if="form.answer_full_file_base64"
                        class="mt-2 mb-3 pa-1"
                      >
                        <div class="d-flex justify-end pr-1 pt-1">
                          <v-btn
                            icon="mdi-trash-can-outline"
                            color="red"
                            size="small"
                            variant="plain"
                            @click="deleteFile('answer_full_file')"
                          ></v-btn>
                        </div>
                        <v-img
                          :src="form.answer_full_file_base64"
                          max-height="100px"
                          contain
                        ></v-img>
                      </v-card>
                    </v-col>
                  </v-row>
                </div>

                <!--Four options-->
                <div v-if="form.type === 'fourchoice'">
                  <v-row>
                    <v-col cols="12">
                      <div class="d-flex mb-3 mt-3">
                        <div class="text-h6 mr-3">Choices type:</div>
                        <v-chip-group
                          v-model="text_answer"
                          column
                          multiple
                          @update:model-value="answerTypeChanged('txt')"
                        >
                          <v-chip
                            :value="true"
                            color="teal"
                            filter
                            label
                            variant="outlined"
                          >
                            <v-icon start icon="mdi-text"></v-icon>
                            Text
                          </v-chip>
                        </v-chip-group>

                        <v-chip-group
                          v-model="photo_answer"
                          column
                          multiple
                          @update:model-value="answerTypeChanged('photo')"
                        >
                          <v-chip
                            :value="true"
                            color="teal"
                            filter
                            label
                            variant="outlined"
                          >
                            <v-icon start icon="mdi-camera"></v-icon>
                            Photo
                          </v-chip>
                        </v-chip-group>
                      </div>
                    </v-col>
                  </v-row>


                    <v-col cols="12" class="pb-0">
                      <v-radio-group v-model="form.true_answer" direction="horizontal" inline required>
                        <Field name="true_answer" rules="required" v-slot="{}">
                          <div>
                            <v-radio value="a" label="A"></v-radio>
                            <div
                              v-if="text_answer"
                              class="d-inline-block"
                              style="width: calc(100% - 45px)"
                            >
                              <div class="d-flex">
                                <div class="flex-grow-1">
                             
                                </div>
                                <div class="ml-2 d-flex align-start mt-2">
                                  <v-btn
                                    icon="mdi-camera-outline"
                                    color="teal"
                                    size="small"
                                    variant="text"
                                    @click="selectFile('a_file')"
                                  ></v-btn>
                                </div>
                              </div>
                            </div>
                            <div v-if="photo_answer" class="ml-5">
                              <v-btn
                                variant="outlined"
                                color="teal"
                                prepend-icon="mdi-camera"
                                @click="selectFile('a_file')"
                              >
                                Select Photo
                              </v-btn>
                              <input
                                ref="aInput"
                                type="file"
                                accept="image/*"
                                style="display: none"
                                @change="
                                  form_hidden_data.a_file =
                                    $event.target.files[0];
                                  uploadFile('a_file');
                                "
                              />
                              <v-card
                                v-if="form.a_file_base64"
                                class="mt-2 mb-3 pa-1"
                              >
                                <div class="d-flex justify-end pr-1 pt-1">
                                  <v-btn
                                    icon="mdi-trash-can-outline"
                                    color="red"
                                    size="small"
                                    variant="plain"
                                    @click="deleteFile('a_file')"
                                  ></v-btn>
                                </div>
                                <v-img
                                  :src="form.a_file_base64"
                                  max-height="100px"
                                  contain
                                ></v-img>
                              </v-card>
                            </div>
                          </div>
                        </Field>

                        <Field name="true_answer" rules="required" v-slot="{}">
                          <div>
                            <v-radio value="b" label="B"></v-radio>
                            <div
                              v-if="text_answer"
                              class="d-inline-block"
                              style="width: calc(100% - 45px)"
                            >
                              <div class="d-flex">
                                <div class="flex-grow-1">
                                  <RickEditor v-model:modelValue="form.answer_b"  />
                                </div>
                                <div class="ml-2 d-flex align-start mt-2">
                                  <v-btn
                                    icon="mdi-camera-outline"
                                    color="teal"
                                    size="small"
                                    variant="text"
                                    @click="selectFile('b_file')"
                                  ></v-btn>
                                </div>
                              </div>
                            </div>
                            <div v-if="photo_answer" class="ml-5">
                              <v-btn
                                variant="outlined"
                                color="teal"
                                prepend-icon="mdi-camera"
                                @click="selectFile('b_file')"
                              >
                                Select Photo
                              </v-btn>
                              <input
                                ref="bInput"
                                type="file"
                                accept="image/*"
                                style="display: none"
                                @change="
                                  form_hidden_data.b_file =
                                    $event.target.files[0];
                                  uploadFile('b_file');
                                "
                              />
                              <v-card
                                v-if="form.b_file_base64"
                                class="mt-2 mb-3 pa-1"
                              >
                                <div class="d-flex justify-end pr-1 pt-1">
                                  <v-btn
                                    icon="mdi-trash-can-outline"
                                    color="red"
                                    size="small"
                                    variant="plain"
                                    @click="deleteFile('b_file')"
                                  ></v-btn>
                                </div>
                                <v-img
                                  :src="form.b_file_base64"
                                  max-height="100px"
                                  contain
                                ></v-img>
                              </v-card>
                            </div>
                          </div>
                        </Field>

                        <Field name="true_answer" rules="required" v-slot="{}">
                          <div>
                            <v-radio value="c" label="C"></v-radio>
                            <div
                              v-if="text_answer"
                              class="d-inline-block"
                              style="width: calc(100% - 45px)"
                            >
                              <div class="d-flex">
                                <div class="flex-grow-1">
                                  <RickEditor v-model:modelValue="form.answer_c"  />
                                </div>
                                <div class="ml-2 d-flex align-start mt-2">
                                  <v-btn
                                    icon="mdi-camera-outline"
                                    color="teal"
                                    size="small"
                                    variant="text"
                                    @click="selectFile('c_file')"
                                  ></v-btn>
                                </div>
                              </div>
                            </div>
                            <div v-if="photo_answer" class="ml-5">
                              <v-btn
                                variant="outlined"
                                color="teal"
                                prepend-icon="mdi-camera"
                                @click="selectFile('c_file')"
                              >
                                Select Photo
                              </v-btn>
                              <input
                                ref="cInput"
                                type="file"
                                accept="image/*"
                                style="display: none"
                                @change="
                                  form_hidden_data.c_file =
                                    $event.target.files[0];
                                  uploadFile('c_file');
                                "
                              />
                              <v-card
                                v-if="form.c_file_base64"
                                class="mt-2 mb-3 pa-1"
                              >
                                <div class="d-flex justify-end pr-1 pt-1">
                                  <v-btn
                                    icon="mdi-trash-can-outline"
                                    color="red"
                                    size="small"
                                    variant="plain"
                                    @click="deleteFile('c_file')"
                                  ></v-btn>
                                </div>
                                <v-img
                                  :src="form.c_file_base64"
                                  max-height="100px"
                                  contain
                                ></v-img>
                              </v-card>
                            </div>
                          </div>
                        </Field>

                        <Field name="true_answer" rules="required" v-slot="{}">
                          <div>
                            <v-radio value="d" label="D"></v-radio>
                            <div
                              v-if="text_answer"
                              class="d-inline-block"
                              style="width: calc(100% - 45px)"
                            >
                              <div class="d-flex">
                                <div class="flex-grow-1">
                                  <RickEditor v-model:modelValue="form.answer_d"  />
                                </div>
                                <div class="ml-2 d-flex align-start mt-2">
                                  <v-btn
                                    icon="mdi-camera-outline"
                                    color="teal"
                                    size="small"
                                    variant="text"
                                    @click="selectFile('d_file')"
                                  ></v-btn>
                                </div>
                              </div>
                            </div>
                            <div v-if="photo_answer" class="ml-5">
                              <v-btn
                                variant="outlined"
                                color="teal"
                                prepend-icon="mdi-camera"
                                @click="selectFile('d_file')"
                              >
                                Select Photo
                              </v-btn>
                              <input
                                ref="dInput"
                                type="file"
                                accept="image/*"
                                style="display: none"
                                @change="
                                  form_hidden_data.d_file =
                                    $event.target.files[0];
                                  uploadFile('d_file');
                                "
                              />
                              <v-card
                                v-if="form.d_file_base64"
                                class="mt-2 mb-3 pa-1"
                              >
                                <div class="d-flex justify-end pr-1 pt-1">
                                  <v-btn
                                    icon="mdi-trash-can-outline"
                                    color="red"
                                    size="small"
                                    variant="plain"
                                    @click="deleteFile('d_file')"
                                  ></v-btn>
                                </div>
                                <v-img
                                  :src="form.d_file_base64"
                                  max-height="100px"
                                  contain
                                ></v-img>
                              </v-card>
                            </div>
                          </div>
                        </Field>
                      </v-radio-group>
                    </v-col>
                </div>

                <!--Two options-->
                <div v-if="form.type === 'twochoice'">
                  <v-row>
                    <v-col cols="12">
                      <div class="d-flex mb-3 mt-3">
                        <div class="text-h6 mr-3">Answers:</div>
                        <v-chip-group
                          v-model="text_answer"
                          column
                          multiple
                          @update:model-value="answerTypeChanged('txt')"
                        >
                          <v-chip
                            :value="true"
                            color="teal"
                            filter
                            label
                            variant="outlined"
                          >
                            <v-icon start icon="mdi-text"></v-icon>
                            Text
                          </v-chip>
                        </v-chip-group>

                        <v-chip-group
                          v-model="photo_answer"
                          column
                          multiple
                          @update:model-value="answerTypeChanged('photo')"
                        >
                          <v-chip
                            :value="true"
                            color="teal"
                            filter
                            label
                            variant="outlined"
                          >
                            <v-icon start icon="mdi-camera"></v-icon>
                            Photo
                          </v-chip>
                        </v-chip-group>
                      </div>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12" class="pb-0">
                      <v-radio-group v-model="form.true_answer" inline required>
                        <Field name="true_answer" rules="required" v-slot="{}">
                          <div>
                            <v-radio value="a" label="A"></v-radio>
                            <div
                              v-if="text_answer"
                              class="d-inline-block"
                              style="width: calc(100% - 45px)"
                            >
                              <v-text-field
                                v-model="form.answer_a"
                                label="a"
                                type="text"
                                variant="outlined"
                                density="compact"
                                :rules="
                                  text_answer_rules
                                    ? [(v) => !!v || 'Answer A is required']
                                    : []
                                "
                              ></v-text-field>
                            </div>
                            <div v-if="photo_answer" class="ml-5">
                              <v-btn
                                variant="outlined"
                                color="teal"
                                prepend-icon="mdi-camera"
                                @click="selectFile('a_file')"
                              >
                                Select Photo
                              </v-btn>
                              <input
                                ref="aInput"
                                type="file"
                                accept="image/*"
                                style="display: none"
                                @change="
                                  form_hidden_data.a_file =
                                    $event.target.files[0];
                                  uploadFile('a_file');
                                "
                              />
                              <v-card
                                v-if="form.a_file_base64"
                                class="mt-2 mb-3 pa-1"
                              >
                                <div class="d-flex justify-end pr-1 pt-1">
                                  <v-btn
                                    icon="mdi-trash-can-outline"
                                    color="red"
                                    size="small"
                                    variant="plain"
                                    @click="deleteFile('a_file')"
                                  ></v-btn>
                                </div>
                                <v-img
                                  :src="form.a_file_base64"
                                  max-height="100px"
                                  contain
                                ></v-img>
                              </v-card>
                            </div>
                          </div>
                        </Field>

                        <Field name="true_answer" rules="required" v-slot="{}">
                          <div>
                            <v-radio value="b" label="B"></v-radio>
                            <div
                              v-if="text_answer"
                              class="d-inline-block"
                              style="width: calc(100% - 45px)"
                            >
                              <v-text-field
                                v-model="form.answer_b"
                                label="b"
                                type="text"
                                variant="outlined"
                                density="compact"
                                :rules="
                                  text_answer_rules
                                    ? [(v) => !!v || 'Answer B is required']
                                    : []
                                "
                              ></v-text-field>
                            </div>
                            <div v-if="photo_answer" class="ml-5">
                              <v-btn
                                variant="outlined"
                                color="teal"
                                prepend-icon="mdi-camera"
                                @click="selectFile('b_file')"
                              >
                                Select Photo
                              </v-btn>
                              <input
                                ref="bInput"
                                type="file"
                                accept="image/*"
                                style="display: none"
                                @change="
                                  form_hidden_data.b_file =
                                    $event.target.files[0];
                                  uploadFile('b_file');
                                "
                              />
                              <v-card
                                v-if="form.b_file_base64"
                                class="mt-2 mb-3 pa-1"
                              >
                                <div class="d-flex justify-end pr-1 pt-1">
                                  <v-btn
                                    icon="mdi-trash-can-outline"
                                    color="red"
                                    size="small"
                                    variant="plain"
                                    @click="deleteFile('b_file')"
                                  ></v-btn>
                                </div>
                                <v-img
                                  :src="form.b_file_base64"
                                  max-height="100px"
                                  contain
                                ></v-img>
                              </v-card>
                            </div>
                          </div>
                        </Field>
                      </v-radio-group>
                    </v-col>
                  </v-row>
                </div>

                <!--True/False-->
                <div v-if="form.type === 'tf'">
                  <v-row>
                    <v-col cols="12">
                      <div class="d-flex mb-3 mt-3">
                        <div class="text-h6 mr-3">Answers:</div>
                      </div>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12" class="pb-0">
                      <v-radio-group v-model="form.true_answer" inline required>
                        <Field name="true_answer" rules="required" v-slot="{}">
                          <div>
                            <v-radio value="a" label="True"></v-radio>
                          </div>
                        </Field>

                        <Field name="true_answer" rules="required" v-slot="{}">
                          <div>
                            <v-radio value="b" label="False"></v-radio>
                          </div>
                        </Field>
                      </v-radio-group>
                    </v-col>
                  </v-row>
                </div>

                <!--Blank-->
                <div v-if="form.type === 'blank'">
                  <v-row>
                    <v-col cols="12">
                      <div class="d-flex mb-3 mt-3">
                        <div class="text-h6 mr-3">Answer:</div>

                        <v-chip-group
                          v-model="text_answer"
                          column
                          multiple
                          @update:model-value="answerTypeChanged('txt')"
                        >
                          <v-chip
                            :value="true"
                            color="teal"
                            filter
                            label
                            variant="outlined"
                          >
                            <v-icon start icon="mdi-text"></v-icon>
                            Text
                          </v-chip>
                        </v-chip-group>

                        <v-chip-group
                          v-model="photo_answer"
                          column
                          multiple
                          @update:model-value="answerTypeChanged('photo')"
                        >
                          <v-chip
                            :value="true"
                            color="teal"
                            filter
                            label
                            variant="outlined"
                          >
                            <v-icon start icon="mdi-camera"></v-icon>
                            Photo
                          </v-chip>
                        </v-chip-group>
                      </div>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12" class="pb-0">
                      <div>
                        <div v-if="text_answer">
                          <v-text-field
                            v-model="form.answer_full"
                            label="Answer"
                            type="text"
                            variant="outlined"
                            density="compact"
                            :rules="
                              text_answer_rules
                                ? [(v) => !!v || 'Answer is required']
                                : []
                            "
                          ></v-text-field>
                        </div>

                        <div v-if="photo_answer">
                          <v-btn
                            variant="outlined"
                            color="teal"
                            prepend-icon="mdi-camera"
                            @click="selectFile('answer_full_file')"
                          >
                            Select Photo
                          </v-btn>
                          <input
                            ref="answerFullInput"
                            type="file"
                            accept="image/*"
                            style="display: none"
                            @change="
                              form_hidden_data.answer_full_file =
                                $event.target.files[0];
                              uploadFile('answer_full_file');
                            "
                          />
                          <v-card
                            v-if="form.answer_full_file_base64"
                            class="mt-2 mb-3 pa-1"
                          >
                            <div class="d-flex justify-end pr-1 pt-1">
                              <v-btn
                                icon="mdi-trash-can-outline"
                                color="red"
                                size="small"
                                variant="plain"
                                @click="deleteFile('answer_full_file')"
                              ></v-btn>
                            </div>
                            <v-img
                              :src="form.answer_full_file_base64"
                              max-height="100px"
                              contain
                            ></v-img>
                          </v-card>
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </div>

                <!--Shortanswer-->
                <div v-if="form.type === 'shortanswer'">
                  <v-row>
                    <v-col cols="12">
                      <div class="d-flex mb-3 mt-3">
                        <div class="text-h6 mr-3">Answer:</div>

                        <v-chip-group
                          v-model="text_answer"
                          column
                          multiple
                          @update:model-value="answerTypeChanged('txt')"
                        >
                          <v-chip
                            :value="true"
                            color="teal"
                            filter
                            label
                            variant="outlined"
                          >
                            <v-icon start icon="mdi-text"></v-icon>
                            Text
                          </v-chip>
                        </v-chip-group>

                        <v-chip-group
                          v-model="photo_answer"
                          column
                          multiple
                          @update:model-value="answerTypeChanged('photo')"
                        >
                          <v-chip
                            :value="true"
                            color="teal"
                            filter
                            label
                            variant="outlined"
                          >
                            <v-icon start icon="mdi-camera"></v-icon>
                            Photo
                          </v-chip>
                        </v-chip-group>
                      </div>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12" class="pb-0">
                      <div>
                        <div v-if="text_answer">
                          <v-text-field
                            v-model="form.answer_full"
                            label="Answer"
                            type="text"
                            variant="outlined"
                            density="compact"
                            :rules="
                              text_answer_rules
                                ? [(v) => !!v || 'Answer is required']
                                : []
                            "
                          ></v-text-field>
                        </div>

                        <div v-if="photo_answer">
                          <v-btn
                            variant="outlined"
                            color="teal"
                            prepend-icon="mdi-camera"
                            @click="selectFile('answer_full_file')"
                          >
                            Select Photo
                          </v-btn>
                          <input
                            ref="answerFullInput"
                            type="file"
                            accept="image/*"
                            style="display: none"
                            @change="
                              form_hidden_data.answer_full_file =
                                $event.target.files[0];
                              uploadFile('answer_full_file');
                            "
                          />
                          <v-card
                            v-if="form.answer_full_file_base64"
                            class="mt-2 mb-3 pa-1"
                          >
                            <div class="d-flex justify-end pr-1 pt-1">
                              <v-btn
                                icon="mdi-trash-can-outline"
                                color="red"
                                size="small"
                                variant="plain"
                                @click="deleteFile('answer_full_file')"
                              ></v-btn>
                            </div>
                            <v-img
                              :src="form.answer_full_file_base64"
                              max-height="100px"
                              contain
                            ></v-img>
                          </v-card>
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </div>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-btn
                color="teal"
                variant="flat"
                block
                type="submit"
                :loading="create_loading"
              >
                Create Test
              </v-btn>
            </v-col>
          </v-row>
        </VeeForm>
      </v-card-text>
    </v-card>

    <!--Cropper Dialog-->
    <v-dialog v-model="cropper_dialog" max-width="500">
      <v-card>
        <v-card-title>Crop image</v-card-title>
        <v-card-text>
          <!-- Replace with vue-advanced-cropper v3 component when updating -->
          <div v-if="cropper_dialog">
            <!-- Placeholder for cropper component -->
            <img :src="crop_file_url" style="max-width: 100%" />
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" variant="text" @click="cropper_dialog = false">
            Cancel
          </v-btn>
          <v-btn color="teal" variant="text" @click="cropper_dialog = false">
            Crop
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Form as VeeForm, Field, useForm } from "vee-validate";
import { required } from "@vee-validate/rules";
import { defineRule } from "vee-validate";
import TopicSelector from "~/components/form/topic-selector";
import { useNuxtApp } from "#app";
// import CkEditor from "./ckEditor.vue";";
import * as yup from "yup";

// Define validation rules
defineRule("required", required);

// Get services
const { $toast, $fetch } = useNuxtApp();
const router = useRouter();
const route = useRoute();

// Form validation
const { handleSubmit, resetForm } = useForm();
const observer = ref(null);
const isFormValid = ref(false);

// Refs for file inputs
const questionInput = ref(null);
const answerFullInput = ref(null);
const aInput = ref(null);
const bInput = ref(null);
const cInput = ref(null);
const dInput = ref(null);

// Component state
const props = defineProps({
  examEditMode: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:updateTestList", "update:goToPreviewStep"]);

// State variables
const path_panel_expand = ref(true);
const create_loading = ref(false);
const test_step = ref(1);
const text_answer = ref(true);
const text_answer_rules = ref("required");
const photo_answer = ref(false);
const photo_answer_rules = ref("");
const examTestListLength = ref(0);
const file_original_path = ref("");
const crop_file_url = ref("");
const crop_file_loading = ref(false);
const cropper_dialog = ref(false);
const current_crop_file = ref("");

// Form data
const form = reactive({
  section: "",
  base: "",
  level: "",
  grade: "",
  lesson: "",
  topic: "",
  type: "fourchoice",
  direction: "ltr",
  true_answer: "",
  question: "",
  q_file_base64: "",
  answer_full: "",
  answer_full_file_base64: "",
  a_file_base64: "",
  b_file_base64: "",
  c_file_base64: "",
  d_file_base64: "",
  testImgAnswers: false,
});

const form_hidden_data = reactive({
  q_file: null,
  answer_full_file: null,
  a_file: null,
  b_file: null,
  c_file: null,
  d_file: null,
});

// Data lists
const level_list = ref([]);
const grade_list = ref([]);
const field_list = ref([]);
const lesson_list = ref([]);
const topic_list = ref([]);

// Static data
const txt_direction_list = [
  { value: "ltr", title: "LTR" },
  { value: "rtl", title: "RTL" },
];

const stencil_props = {
  width: 180,
  height: 180,
};

const typeList = [
  { value: "fourchoice", title: "Multiple choice(4)" },
  { value: "twochoice", title: "Multiple choice(2)" },
  { value: "descriptive", title: "Open-Ended" },
  { value: "tf", title: "True/False" },
  { value: "blank", title: "Blank" },
  { value: "shortanswer", title: "Short answer" },
];

// Editor configuration
const editorConfig = {
  toolbar: ["bold", "underline", "alignment"],
  plugins: [
    "Autoformat",
    "Essentials",
    "MathType",
    "Alignment",
    "Bold",
    "Underline",
    "PasteFromOffice",
    "Paragraph",
    "WordCount",
  ],
  mathType: {
    wiriseditorparselatex: false,
  },
};

// Define validation rules
const validationSchema = yup.object({
  question: yup.string().required("Question is required"),
  true_answer: yup.string().when("type", {
    is: (val) => ["fourchoice", "twochoice", "tf"].includes(val),
    then: () => yup.string().required("Please select the correct answer"),
  }),
  // Additional validations based on answer type
  answer_a: yup.string().when(["type", "testImgAnswers"], {
    is: (type, testImgAnswers) =>
      ["fourchoice", "twochoice", "tf"].includes(type) && !testImgAnswers,
    then: () => yup.string().required("Answer A is required"),
  }),
  answer_b: yup.string().when(["type", "testImgAnswers"], {
    is: (type, testImgAnswers) =>
      ["fourchoice", "twochoice", "tf"].includes(type) && !testImgAnswers,
    then: () => yup.string().required("Answer B is required"),
  }),
  answer_c: yup.string().when(["type", "testImgAnswers"], {
    is: (type, testImgAnswers) => type === "fourchoice" && !testImgAnswers,
    then: () => yup.string().required("Answer C is required"),
  }),
  answer_d: yup.string().when(["type", "testImgAnswers"], {
    is: (type, testImgAnswers) => type === "fourchoice" && !testImgAnswers,
    then: () => yup.string().required("Answer D is required"),
  }),
  answer_full: yup.string().when(["type", "testImgAnswers"], {
    is: (type, testImgAnswers) => type === "descriptive" && !testImgAnswers,
    then: () => yup.string().required("Full answer is required"),
  }),
});

// Use VeeValidate form
const {
  handleSubmit: veeHandleSubmit,
  isSubmitting,
  validate,
} = useForm({
  validationSchema,
  initialValues: {
    section: "",
    base: "",
    level: "",
    grade: "",
    lesson: "",
    topic: "",
    type: "fourchoice",
    direction: "ltr",
    true_answer: "",
    question: "",
    q_file_base64: "",
    answer_full: "",
    answer_full_file_base64: "",
    answer_a: "",
    answer_b: "",
    answer_c: "",
    answer_d: "",
    a_file_base64: "",
    b_file_base64: "",
    c_file_base64: "",
    d_file_base64: "",
    testImgAnswers: false,
  },
});

// Methods
const getTypeList = async (type, parent = "") => {
  const params = { type };

  if (type === "base") params.section_id = parent;
  if (type === "lesson") params.base_id = parent;
  if (type === "topic") params.lesson_id = parent;
  if (type === "area") params.state_id = parent;

  if (type === "school") {
    params.section_id = form.level;
    params.area_id = form.area;
  }

  try {
    const res = await $fetch("/api/v1/types/list", {
      method: "GET",
      params,
    });

    if (type === "section") {
      level_list.value = res.data;
    } else if (type === "base") {
      grade_list.value = res.data;
    } else if (type === "lesson") {
      lesson_list.value = res.data;
    } else if (type === "topic") {
      topic_list.value = res.data;
    }
  } catch (err) {
    $toast.error(err.message || "Error loading data");
  }
};

const submitQuestion = veeHandleSubmit(async (values) => {
  create_loading.value = true;
  const querystring = require("querystring");

  try {
    const response = await $fetch("/api/v1/examTests", {
      method: "POST",
      body: querystring.stringify(values),
    });

    if (response.status == 1) {
      $toast.success("Created successfully");
      path_panel_expand.value = false;

      // Edit mode or create exam progress
      if (props.examEditMode === true)
        emit("update:updateTestList", response.data.id);
      // End edit mode or create exam progress

      // Reset form fields
      form.question = "";
      form.q_file_base64 = "";
      form.answer_full = "";
      form.answer_full_file_base64 = "";
      form.true_answer = "";
      form.testImgAnswers = false;
      text_answer.value = true;
      photo_answer.value = false;
      form.answer_a = "";
      form.answer_b = "";
      form.answer_c = "";
      form.answer_d = "";
      form.a_file_base64 = "";
      form.b_file_base64 = "";
      form.c_file_base64 = "";
      form.d_file_base64 = "";

      resetForm();
    } else {
      $toast.error("An error occurred, try again");
    }
  } catch (err) {
    if (err.response?.status == 400) $toast.error(err.response.data.message);
    else if (err.response?.status == 403) {
      // Handle authentication error
      $toast.error("Authentication error");
      router.push("/login");
    } else {
      $toast.error(err.message || "An error occurred");
    }
  } finally {
    create_loading.value = false;
  }
});

const selectFile = (file_name) => {
  if (file_name === "q_file") {
    questionInput.value?.click();
  } else if (file_name === "answer_full_file") {
    document.querySelector('input[ref="answerFullInput"]')?.click();
  } else if (file_name === "a_file") {
    document.querySelector('input[ref="aInput"]')?.click();
  } else if (file_name === "b_file") {
    document.querySelector('input[ref="bInput"]')?.click();
  } else if (file_name === "c_file") {
    document.querySelector('input[ref="cInput"]')?.click();
  } else if (file_name === "d_file") {
    document.querySelector('input[ref="dInput"]')?.click();
  }
};

const uploadFile = (file_name) => {
  let file = null;

  if (file_name === "q_file") {
    file = form_hidden_data.q_file;
  } else if (file_name === "answer_full_file") {
    file = form_hidden_data.answer_full_file;
  } else if (file_name === "a_file") {
    file = form_hidden_data.a_file;
  } else if (file_name === "b_file") {
    file = form_hidden_data.b_file;
  } else if (file_name === "c_file") {
    file = form_hidden_data.c_file;
  } else if (file_name === "d_file") {
    file = form_hidden_data.d_file;
  }

  if (file) {
    if (file_name === "q_file") {
      form.q_file_base64 = URL.createObjectURL(file);
    } else if (file_name === "answer_full_file") {
      form.answer_full_file_base64 = URL.createObjectURL(file);
    } else if (file_name === "a_file") {
      form.a_file_base64 = URL.createObjectURL(file);
    } else if (file_name === "b_file") {
      form.b_file_base64 = URL.createObjectURL(file);
    } else if (file_name === "c_file") {
      form.c_file_base64 = URL.createObjectURL(file);
    } else if (file_name === "d_file") {
      form.d_file_base64 = URL.createObjectURL(file);
    }

    // If using image cropper, handle here
    // For now, we're directly using the file
    uploadFileToServer(file, file_name);
  }
};

const uploadFileToServer = async (file, file_name) => {
  try {
    // Create a form data object
    const formData = new FormData();
    formData.append("file", file);

    const { $axios } = useNuxtApp();
    const response = await $axios.post("/api/v1/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data && response.data.data && response.data.data.length > 0) {
      const fileName = response.data.data[0].file.name;

      // Store the file name in the corresponding form field
      if (file_name === "q_file") {
        form.q_file = fileName;
      } else if (file_name === "answer_full_file") {
        form.answer_full_file = fileName;
      } else if (file_name === "a_file") {
        form.a_file = fileName;
      } else if (file_name === "b_file") {
        form.b_file = fileName;
      } else if (file_name === "c_file") {
        form.c_file = fileName;
      } else if (file_name === "d_file") {
        form.d_file = fileName;
      }
    }
  } catch (error) {
    const toast = useNuxtApp().$toast;
    if (toast) {
      toast.error("Failed to upload file");
    }
    console.error("File upload error:", error);
  }
};

const cropFile = ({ coordinates, canvas, image }) => {
  if (current_crop_file.value === "q_file")
    form.q_file_base64 = canvas.toDataURL();
  else if (current_crop_file.value === "answer_full_file")
    form.answer_full_file_base64 = canvas.toDataURL();
  else if (current_crop_file.value === "a_file")
    form.a_file_base64 = canvas.toDataURL();
  else if (current_crop_file.value === "b_file")
    form.b_file_base64 = canvas.toDataURL();
  else if (current_crop_file.value === "c_file")
    form.c_file_base64 = canvas.toDataURL();
  else if (current_crop_file.value === "d_file")
    form.d_file_base64 = canvas.toDataURL();
};

const deleteFile = (file_name) => {
  if (file_name === "q_file") {
    form.q_file_base64 = "";
    if (questionInput.value) questionInput.value.value = null;
    current_crop_file.value = "";
  } else if (file_name === "answer_full_file") {
    form.answer_full_file_base64 = "";
    if (answerFullInput.value) answerFullInput.value.value = null;
    current_crop_file.value = "";
  } else if (file_name === "a_file") {
    form.a_file_base64 = "";
    if (aInput.value) aInput.value.value = null;
    current_crop_file.value = "";
  } else if (file_name === "b_file") {
    form.b_file_base64 = "";
    if (bInput.value) bInput.value.value = null;
    current_crop_file.value = "";
  } else if (file_name === "c_file") {
    form.c_file_base64 = "";
    if (cInput.value) cInput.value.value = null;
    current_crop_file.value = "";
  } else if (file_name === "d_file") {
    form.d_file_base64 = "";
    if (dInput.value) dInput.value.value = null;
    current_crop_file.value = "";
  }
};

const answerTypeChanged = (type) => {
  if (type === "txt") {
    if (text_answer.value === true) {
      photo_answer.value = false;
      form.testImgAnswers = false;
      text_answer_rules.value = "required";
      photo_answer_rules.value = "";
    } else {
      photo_answer.value = true;
      form.testImgAnswers = true;
      text_answer_rules.value = "";
    }
  } else {
    if (photo_answer.value === true) {
      text_answer.value = false;
      form.testImgAnswers = true;
      text_answer_rules.value = "";
    } else {
      text_answer.value = true;
      form.testImgAnswers = false;
      text_answer_rules.value = "required";
      photo_answer_rules.value = "";
    }
  }
};

const getCurrentExamInfo = async () => {
  // Implementation for fetching exam info if needed
};

const getBase64FromUrl = async (url) => {
  try {
    const response = await $fetch(url.replace(process.env.FILE_BASE_URL, ""), {
      responseType: "blob",
    });
    file_original_path.value = URL.createObjectURL(response);
  } catch (err) {
    console.error(err);
  }
};

const urlencodeFormData = (fd) => {
  let s = "";
  for (const pair of fd.entries()) {
    if (typeof pair[1] === "string") {
      s += (s ? "&" : "") + encode(pair[0]) + "=" + encode(pair[1]);
    }
  }
  return s;
};

const encode = (s) => {
  return encodeURIComponent(s).replace(/%20/g, "+");
};

const goToPreviewStep = () => {
  emit("update:goToPreviewStep", 3);
};

// Watch form fields
watch(
  () => form.section,
  (val) => {
    if (val) getTypeList("base", val);
  }
);

watch(
  () => form.base,
  (val) => {
    if (val) getTypeList("lesson", val);
  }
);

watch(
  () => form.lesson,
  (val) => {
    if (val) getTypeList("topic", val);
  }
);

watch(
  () => form.type,
  (val) => {
    if (val == "tf") {
      form.answer_a = "True";
      form.answer_b = "False";
    } else {
      form.answer_a = "";
      form.answer_b = "";
    }
  }
);

// Initialize on mount
onMounted(() => {
  getTypeList("section");
  getCurrentExamInfo();
});
</script>

<style lang="scss">
.topic_season {
  background-color: rgba(144, 202, 249, 0.2);
}

.pointer {
  cursor: pointer;
}

#test-question {
  margin-bottom: 20px;
}

.test-maker {
  .test-list {
    margin-bottom: 20px;
  }

  .answer {
    margin-left: 10px;
  }

  .true_answer {
    color: #4caf50;
  }
}

/* For image previews */
.v-card img {
  max-width: 100%;
  height: auto;
}

.ckeditor-wrapper {
  width: 100%;
}
</style>
