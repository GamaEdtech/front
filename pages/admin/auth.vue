<template>
  <v-container class="fill-height my-14" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="pa-8" elevation="0" color="#f8f9fc" rounded="lg">
          <div class="text-center mb-6">
            <div
              class="rounded-circle mx-auto d-flex align-center justify-center"
              style="width: 100px; height: 100px"
            >
              <img
                :src="require('@/assets/images/' + adminAuthIcon)"
                alt=""
                class="w-100 h-100"
              />
            </div>
            <h1 class="font-size-18 primary-gray-900 font-weight-bold mt-4">
              Admin Login
            </h1>
          </div>

          <v-alert
            v-if="loginError"
            type="error"
            dense
            text
            dismissible
            class="mb-4"
            @click="loginError = ''"
          >
            {{ loginError }}
          </v-alert>

          <v-form
            ref="form"
            class="soft-form__inputs-border"
            v-model="isFormValid"
          >
            <div class="mb-1">
              <label class="primary-gray-700 font-size-xs"
                >User Name / Email</label
              >
            </div>
            <v-text-field
              v-model="email"
              placeholder="Enter User Name or Email"
              outlined
              dense
              :rules="emailRules"
              :error-messages="emailError"
              rounded
              class="mb-6"
              background-color="white"
              @focus="emailError = ''"
            ></v-text-field>

            <div class="mb-1">
              <label class="primary-gray-700 font-size-xs">Password</label>
            </div>
            <v-text-field
              v-model="password"
              placeholder="Enter Password"
              outlined
              dense
              :rules="passwordRules"
              :error-messages="passwordError"
              rounded
              type="password"
              background-color="white"
              class="mb-4"
              @focus="passwordError = ''"
            ></v-text-field>

            <div class="d-flex align-center justify-space-between mb-6">
              <v-checkbox
                v-model="rememberMe"
                label="Remember me"
                hide-details
                class="mt-0 pt-0 primary-gray-800"
                color="primary"
                dense
              ></v-checkbox>
              <v-btn
                text
                color="#FFC107"
                class="text-lg-h6 pa-0 text-capitalize"
                >Forgot password?</v-btn
              >
            </div>

            <v-btn
              block
              x-large
              rounded
              color="#FFC107"
              class="primary-gray-800 font-weight-medium"
              height="56"
              :loading="loading"
              :disabled="loading"
              @click="login"
            >
              Login
            </v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "admin-auth",
  auth: false,
  layout: "default",
  data() {
    return {
      adminAuthIcon: "adminAuthIcon.png",
      email: "",
      password: "",
      rememberMe: false,
      loading: false,
      loginError: "",
      emailError: "",
      passwordError: "",
      isFormValid: false,
      emailRules: [(v) => !!v || "Email or username is required"],
      passwordRules: [(v) => !!v || "Password is required"],
    };
  },
  methods: {
    validateForm() {
      if (!this.email) {
        this.emailError = "Email or username is required";
        return false;
      }

      if (!this.password) {
        this.passwordError = "Password is required";
        return false;
      }

      return true;
    },
    login() {
      // Reset errors
      this.loginError = "";

      // Validate form
      if (!this.$refs.form.validate() || !this.validateForm()) {
        return;
      }

      this.loading = true;

      this.$auth
        .loginWith("local", {
          data: {
            email: this.email,
            password: this.password,
          },
        })
        .then(() => {
          this.$router.push("/admin");
        })
        .catch((error) => {
          console.error("Login error:", error);
          if (error.response && error.response.status === 401) {
            this.loginError = "Invalid email or password";
          } else {
            this.loginError = "Login failed. Please try again.";
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style scoped>
.v-text-field >>> .v-input__slot {
  min-height: 48px !important;
}
</style>
