<template>
  <v-container class="fill-height my-14 my-lg-5" fluid>
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
            class="mb-4 login-error-alert"
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
              <label class="primary-gray-700 font-size-xs font-weight-medium"
                >User Name / Email</label
              >
            </div>
            <v-text-field
              v-model="form.email"
              placeholder="Enter User Name or Email"
              outlined
              dense
              :rules="emailRules"
              :error-messages="emailError"
              rounded
              class=""
              background-color="white"
              @focus="emailError = ''"
            ></v-text-field>

            <div class="mb-1">
              <label class="primary-gray-700 font-size-xs font-weight-medium"
                >Password</label
              >
            </div>
            <v-text-field
              v-model="form.password"
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
                class="mt-0 pt-0 primary-gray-800 font-weight-medium"
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
              color="#FFB600"
              class="primary-gray-800 content-button-text"
              height="40"
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
      form: {
        email: "",
        password: "",
      },
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
      if (!this.form.email) {
        this.emailError = "Email or username is required";
        return false;
      }

      if (!this.form.password) {
        this.passwordError = "Password is required";
        return false;
      }

      return true;
    },
    async login() {
      this.loginError = "";

      if (!this.$refs.form.validate() || !this.validateForm()) {
        return;
      }

      try {
        this.loading = true;
        const formData = {
          username: this.form.email,
          password: this.form.password,
        };

        const result = await this.$axios.$post(
          `/api/v2/identities/tokens`,
          formData
        );
        if (result.succeeded) {
          localStorage.setItem("v2_token", result.data.token);
          // this.$auth.setUserToken(result.data.token);
          this.$auth.setUser({});
          this.$router.push("/admin");
        } else {
          // Handle unsuccessful authentication
          if (result.errors && result.errors.length > 0) {
            const errorMessage = result.errors[0].message;
            if (errorMessage === "WrongUsernameOrPassword") {
              this.loginError =
                "Invalid username or password. Please try again.";
            } else if (errorMessage == "UserLockedOut") {
              this.loginError =
                "Your account has been locked due to multiple failed login attempts. Please contact an administrator for assistance.";
            } else {
              this.loginError = errorMessage;
            }
          } else {
            this.loginError = "Login failed. Please try again.";
          }
        }
      } catch (error) {
        console.error("Login error:", error);
        this.loginError = "An error occurred during login. Please try again.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.v-text-field >>> .v-input__slot {
  min-height: 48px !important;
}

.content-button-text {
  font-size: 14px !important;
  font-weight: 500 !important;
}

.login-error-alert {
  border-radius: 8px;
  padding: 10px !important;
  word-break: break-word;
  font-size: 14px;
}

@media (max-width: 600px) {
  .login-error-alert {
    padding: 8px !important;
    font-size: 13px;
  }
}
</style>
