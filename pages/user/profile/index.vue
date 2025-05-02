<template>
  <div>
    <v-row>
      <v-col cols="12" md="8">
        <div class="d-flex pb-0">
          <img
            width="72 "
            height="72"
            class="pointer"
            style="border-radius: 5px !important"
            v-if="avatar_url"
            @click="selectAvatar"
            :src="avatar_url"
          />
          <v-btn
            v-else
            class="d-flex pointer"
            outlined
            fab
            x-large
            @click="selectAvatar"
          >
            <v-icon> mdi-account-outline </v-icon>
          </v-btn>
          <div class="pa-3">
            <p class="text-h4 pointer" @click="selectAvatar">
              <v-icon> mdi-pencil </v-icon>
              Edit
            </p>
            <nuxt-link to="/" class="text-h5">
              Help to pick profile pic
            </nuxt-link>
          </div>
        </div>
      </v-col>
      <v-col cols="12" md="4" class="text-right pb-0">
        <!--Choose username-->
        <v-row>
          <v-col cols="12" md="12" class="pa-0 pa-md-3">
            <validation-observer ref="observer" v-slot="{ invalid }">
              <form @submit.prevent="updateUsername()">
                <v-file-input
                  class="d-none"
                  accept="image/png,image/webp,"
                  @change="uploadAvatar"
                  v-model="form.avatar"
                  ref="avatar-input"
                />

                <validation-provider
                  name="username"
                  v-slot="{ errors }"
                  rules="required|min:6"
                >
                  <v-text-field
                    v-model="username"
                    filled
                    dense
                    :error-messages="errors"
                    class="mt-4 mb-0"
                    placeholder="Choose username"
                    type="text"
                  >
                    <template slot="prepend-inner">
                      <span class="mt-1">@</span>
                    </template>
                    <template slot="append">
                      <v-btn
                        class="default"
                        type="submit"
                        :disabled="invalid"
                        absolute
                        style="right: 0; height: 80%; top: 10%; bottom: 0"
                      >
                        choose
                      </v-btn>
                    </template>
                  </v-text-field>
                </validation-provider>
              </form>
            </validation-observer>
          </v-col>
        </v-row>
        <!--End choose username-->
      </v-col>
    </v-row>

    <validation-observer ref="observer" v-slot="{ invalid }">
      <form @submit.prevent="submitProfile">
        <!--Personal information-->
        <v-row>
          <v-col cols="12" class="pl-5 text-h4 teal--text">
            <v-icon large color="teal">mdi-account-outline</v-icon>
            <span> Your personal information </span>
          </v-col>

          <v-col cols="12" md="3">
            <validation-provider
              v-slot="{ errors }"
              name="first_name"
              rules="required"
            >
              <v-text-field
                dense
                v-model="form.first_name"
                :error-messages="errors"
                label="First name"
                outlined
              />
            </validation-provider>
          </v-col>
          <v-col cols="12" md="3">
            <validation-provider
              v-slot="{ errors }"
              name="last_name"
              rules="required"
            >
              <v-text-field
                dense
                v-model="form.last_name"
                :error-messages="errors"
                label="Last name"
                outlined
              />
            </validation-provider>
          </v-col>
          <v-col cols="12" md="3">
            <validation-provider
              v-slot="{ errors }"
              name="gender"
              rules="required"
            >
              <v-autocomplete
                dense
                v-model="form.gender"
                :error-messages="errors"
                :items="gender_list"
                item-value="id"
                item-text="title"
                label="Gender"
                outlined
              />
            </validation-provider>
          </v-col>
        </v-row>
        <!--End personal information-->

        <!--Location details-->
        <v-row>
          <v-col cols="12" class="pl-5 text-h4 teal--text">
            <v-icon large color="teal">mdi-map-marker-outline</v-icon>
            <span> Location details </span>
          </v-col>

          <v-col cols="12" md="3">
            <validation-provider
              v-slot="{ errors }"
              name="state"
              rules="required"
            >
              <v-autocomplete
                dense
                :items="state_list"
                v-model="form.state"
                item-text="title"
                item-value="id"
                :error-messages="errors"
                label="State"
                outlined
              />
            </validation-provider>
          </v-col>
          <v-col cols="12" md="3">
            <validation-provider
              v-slot="{ errors }"
              name="area"
              rules="required"
            >
              <v-autocomplete
                dense
                :items="area_list"
                v-model="form.area"
                item-text="title"
                item-value="id"
                :error-messages="errors"
                label="Area"
                outlined
              />
            </validation-provider>
          </v-col>
          <v-col cols="12" md="6" lg="6" xl="6">
            <validation-provider
              v-slot="{ errors }"
              name="businessLocation"
              rules="required"
            >
              <LocationField
                label="Location"
                @locationSelected="selectLocation"
              />
            </validation-provider>
          </v-col>
        </v-row>
        <!--End location details-->

        <!--School profile-->
        <v-row>
          <v-col cols="12" class="pl-5 text-h4 teal--text">
            <v-icon large color="teal">mdi-account-school-outline</v-icon>
            <span> School Profile </span>
          </v-col>

          <v-col cols="12" md="3">
            <validation-provider
              v-slot="{ errors }"
              name="level"
              rules="required"
            >
              <v-autocomplete
                dense
                v-model="form.level"
                :items="level_list"
                :error-messages="errors"
                item-text="title"
                item-value="id"
                label="Curriculum"
                outlined
              />
            </validation-provider>
          </v-col>
          <v-col cols="12" md="3">
            <validation-provider
              v-slot="{ errors }"
              name="grade"
              rules="required"
            >
              <v-autocomplete
                dense
                v-model="form.grade"
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
          <v-col cols="12" md="3">
            <validation-provider
              v-slot="{ errors }"
              name="school"
              rules="required"
            >
              <v-autocomplete
                dense
                :items="school_list"
                item-value="id"
                item-text="title"
                v-model="form.school"
                :error-messages="errors"
                label="School"
                outlined
              />
            </validation-provider>
          </v-col>
        </v-row>
        <!--End school profile-->

        <v-row>
          <v-divider class="my-3" />

          <v-col cols="12" md="6" class="pb-0">
            <v-btn type="submit" lg color="success" block> Submit </v-btn>
          </v-col>
          <v-col cols="12" md="6">
            <v-btn lg outlined color="error" to="/user/question" block>
              Discard
            </v-btn>
          </v-col>
        </v-row>
      </form>
    </validation-observer>

    <v-col cols="auto">
      <v-dialog
        transition="dialog-bottom-transition"
        max-width="600"
        v-model="cropper_dialog"
      >
        <template v-slot:default="dialog">
          <v-card>
            <v-card-actions class="pa-0">
              <v-btn
                class="success text-center"
                x-large
                block
                @click="cropper_dialog = false"
              >
                Confirm
              </v-btn>
            </v-card-actions>
            <v-card-text class="pa-0">
              <v-col v-if="crop_avatar_loading" cols="12" class="text-center">
                <v-progress-circular
                  :size="40"
                  :width="4"
                  class="mt-12 mb-12"
                  color="orange"
                  indeterminate
                />
              </v-col>
              <div v-else>
                <cropper
                  :src="crop_avatar_url"
                  :stencil-props="stencil_props"
                  :stencil-size="stencil_size"
                  image-restriction="stencil"
                  @change="cropAvatar"
                />
              </div>
            </v-card-text>
          </v-card>
        </template>
      </v-dialog>
    </v-col>
  </div>
</template>

<script>
import { ValidationObserver, ValidationProvider } from "vee-validate";
import LocationField from "@/components/form/LocationField";
// import "vue-advanced-cropper/dist/style.css";

export default {
  name: "edit-profile",
  layout: "dashboard_layout",
  data() {
    return {
      cropper_dialog: false,

      stencil_size: {
        width: 180,
        height: 180,
      },
      stencil_props: {
        width: 180,
        height: 180,
      },

      user_type: this.$auth.user.group_id,
      form: {
        name: "",
      },
      user_info: [],
      userData: [],
      username: "",
      avatar_url: "",
      crop_avatar_url: "",
      crop_avatar_loading: false,

      //List
      gender_list: [
        { id: 1, title: "Male" },
        { id: 2, title: "Female" },
      ],
      level_list: [],
      grade_list: [],
      school_list: [],
      field_list: [],
      state_list: [],
      area_list: [],
      //End list
    };
  },
  head() {
    return {
      title: "Edit Profile",
    };
  },
  components: {
    ValidationObserver,
    ValidationProvider,
    LocationField,
  },
  created() {
    this.getTypeList("section");
    this.getTypeList("state");
    this.getUserInfo();
  },
  watch: {
    "form.level"(val) {
      this.getTypeList("base", val);
      if (this.form.area) this.getTypeList("school");
    },
    "form.state"(val) {
      this.getTypeList("area", val);
    },
    "form.area"(val) {
      this.getTypeList("school", val);
    },
    crop_avatar_url(val) {
      if (val) this.crop_avatar_loading = false;
      else this.crop_avatar_loading = true;
    },
  },
  methods: {
    getUserInfo() {
      var apiUrl = "/api/v1/students/dashboard";
      if (this.user_type === "5") apiUrl = "/api/v1/teachers/dashboard";

      this.$fetch
        .$get(apiUrl)
        .then((response) => {
          this.user_info = response.data;
          this.userData = this.user_info.user;
          this.avatar_url = this.userData.avatar;
          this.username = this.userData.username;
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message);
        });
    },
    submitProfile() {
      this.$toast.success("Hi");
    },
    getTypeList(type, parent = "") {
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
        params.section_id = this.form.level;
        params.area_id = this.form.area;
      }

      this.$fetch
        .$get("/api/v1/types/list", {
          params,
        })
        .then((res) => {
          var data = {};
          if (type === "section") {
            this.level_list = res.data;
          } else if (type === "base") {
            this.grade_list = res.data;
          } else if (type === "lesson") {
            this.lesson_list = res.data;
          } else if (type === "topic") {
            this.topic_list = res.data;
          } else if (type === "test_type") {
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

    selectAvatar() {
      this.$refs["avatar-input"].$refs.input.click();
    },
    uploadAvatar() {
      this.crop_avatar_url = true;
      const file = this.form.avatar;
      if (file) {
        this.avatar_url = URL.createObjectURL(file);
        this.crop_avatar_url = URL.createObjectURL(file);
      }
      this.cropper_dialog = true;
    },
    cropAvatar({ coordinates, canvas, image }) {
      console.log(canvas.toDataURL());
      this.avatar_url = canvas.toDataURL();
    },

    selectLocation(location) {
      this.businessLocation.location = location.lat + "," + location.lng;
      this.businessLocation.country_code = location.country_code;
      this.businessLocation.country = location.country;
      this.businessLocation.state = location.state;
      this.$refs.phone_num_input.country_code = location.country_code;
    },
  },
};
</script>

<style></style>
