<template>
  <div>
    <v-row>
      <v-col cols="12" class="text-left">
        <span class="text-h4 teal--text">
          <v-icon color="teal"> mdi-card-account-details </v-icon>
          Confirm Identity
        </span>
      </v-col>
    </v-row>
    <v-card class="mt-3 pb-10" id="charge-wallet">
      <v-card-title>
        <p>
          To log in to your account, please confirm your mobile number and
          email.
        </p>
      </v-card-title>
      <v-card-text class="px-sm-8 px-md-4">
        <!-- <validation-observer  v-slot="{invalid}"> -->
        <form @submit.prevent="requestEmailVerify()">
          <v-row>
            <v-col cols="9" md="6">
              <!-- <validation-provider name="email" rules="required|email" v-slot="{errors}"> -->
              <v-text-field
                label="Email"
                outlined
                prepend-inner-icon="mdi-email-outline"
                dense
                :error-messages="errors"
                v-model="email"
              />
              <!-- </validation-provider> -->
            </v-col>
            <v-col cols="3" md="2" class="pl-0">
              <v-btn
                type="submit"
                class="teal white--text"
                :loading="emailConfirmLoading"
                :disabled="invalid"
              >
                Verify
              </v-btn>
            </v-col>
          </v-row>
        </form>
        <!-- </validation-observer> -->

        <!-- <validation-observer  v-slot="{invalid}"> -->
        <form @submit.prevent="requestEmailVerify()">
          <v-row class="mt-10">
            <v-col cols="9" md="6">
              <!-- <validation-provider name="mobile" rules="required|min:10" v-slot="{errors}"> -->
              <v-text-field
                label="Mobile number"
                outlined
                dense
                prepend-inner-icon="mdi-cellphone"
                :error-messages="errors"
                v-model="mobile"
              />
              <!-- </validation-provider> -->
            </v-col>
            <v-col cols="3" md="2" class="pl-0">
              <v-btn
                type="submit"
                class="teal white--text"
                :loading="mobileConfirmLoading"
                :disabled="invalid"
              >
                Verify
              </v-btn>
            </v-col>
          </v-row>
        </form>
        <!-- </validation-observer> -->
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
// import {ValidationObserver, ValidationProvider} from "vee-validate";

export default {
  layout: "dashboard_layout",
  name: "identity-confirmation",
  head() {
    return {
      title: "Confirm Identity",
    };
  },
  components: {
    // ValidationObserver,
    // ValidationProvider
  },
  data() {
    return {
      email: "",
      mobile: "",
      emailConfirmLoading: false,
      mobileConfirmLoading: false,
    };
  },
  methods: {
    requestEmailVerify() {
      this.emailConfirmLoading = true;
      this.$toast.success("Hi email");
    },
    requestMobileVerify() {
      this.mobileConfirmLoading = true;
      this.$toast.success("Hi mobile");
    },
  },
};
</script>

<style></style>
