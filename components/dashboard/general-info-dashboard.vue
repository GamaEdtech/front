<template>
  <v-row v-if="progressData.num < 10 || userData.username === '0'">
    <v-col cols="12" md="8">
      <div class="d-flex pb-0" v-if="progressData.num < 10">
        <nuxt-link to="/user/edit-profile">
          <img
            width="72"
            height="72"
            v-if="userData.avatar"
            :src="userData.avatar"
          />
          <v-btn v-else class="d-flex" outlined fab x-large>
            <v-icon> mdi-account-outline </v-icon>
          </v-btn>
        </nuxt-link>
        <div class="pa-3">
          <p class="text-h4">
            <strong v-if="$auth.user.first_name || $auth.user.last_name">
              {{ $auth.user.first_name }} {{ $auth.user.last_name }}
            </strong>
            <strong v-else> No name </strong>
          </p>
          <p class="text-h5">
            {{ userData.section_title }} {{ userData.school_name }}
          </p>
        </div>
      </div>
    </v-col>
    <v-col cols="12" md="4" class="text-right pb-0">
      <!--Choose username-->
      <v-row v-if="userData.username === '0'">
        <v-col cols="12" md="12" class="pa-0 pa-md-3">
          <validation-observer ref="observer" v-slot="{ invalid }">
            <form @submit.prevent="updateUsername()">
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
                  label="Choose username"
                  type="text"
                >
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

    <!--Profile complete progress-->
    <v-col cols="12" class="pt-0" v-if="progressData.num < 10">
      <nuxt-link to="/user/edit-profile">
        <p class="text-h5 font-weight-bold mt-3 mb-3">
          Profile complete: {{ progressData.num * 10 }}% | Now complete
          <span class="text-capitalize green--text">
            {{ progressData.notComplete[0] }}
          </span>
        </p>
      </nuxt-link>
      <v-progress-linear
        color="teal"
        height="8"
        buffer-value="0"
        :value="progressData.num * 10"
        stream
      ></v-progress-linear>
    </v-col>
    <!--End profile complete progress-->
  </v-row>
</template>

<script>
import { ValidationProvider, ValidationObserver } from "vee-validate";

export default {
  name: "general-info-dashboard",
  data() {
    return {
      userData: {},
      progressData: {},
      username: "",
    };
  },
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  methods: {
    updateUsername() {
      this.$axios
        .$put(
          "/api/v1/users/username",
          { username: this.username },
          {
            headers: {
              Authorization: `${this.$auth.strategy.token.get()}`,
            },
          }
        )
        .then((response) => {
          this.userData.username = this.username;
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message);
        });
    },
  },
};
</script>

<style scoped></style>
