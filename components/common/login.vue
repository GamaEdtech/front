<template>
  <v-dialog v-model="login_dialog" max-width="300px" style="z-index: 20001">
    <v-card>
      <v-card-title>
        <span class="text-h5">Login</span>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" class="text-center">
            <v-divider class="my-2" />
            <div v-show="google_login_loading">
              <v-progress-circular
                color="teal"
                class="mr-2"
                size="20"
                width="2"
                indeterminate
              >
              </v-progress-circular>
              <span style="font-size: 1.2rem"> Loading google sign in</span>
            </div>
            <div v-show="!google_login_loading" ref="googleLoginBtn" />
          </v-col>
          <v-col cols="12">
            <div v-show="identity_holder">
              <validation-observer ref="observer" v-slot="{ invalid }">
                <form @submit.prevent="submit">
                  <v-row>
                    <v-col cols="12">
                      <validation-provider
                        v-slot="{ errors }"
                        name="Email"
                        rules="required"
                      >
                        <v-text-field
                          v-model="identity"
                          dense
                          label="Email"
                          :error-messages="errors"
                          required
                          outlined
                        />
                      </validation-provider>
                    </v-col>
                    <v-col cols="12">
                      <validation-provider
                        v-slot="{ errors }"
                        name="Password"
                        rules="required"
                      >
                        <v-text-field
                          label="Password"
                          v-model="password"
                          outlined
                          :error-messages="errors"
                          dense
                          type="password"
                          :type="passVisible ? 'text' : 'password'"
                          :append-icon="passVisible ? 'mdi-eye' : 'mdi-eye-off'"
                          @click:append="passVisible = !passVisible"
                          required
                        />
                      </validation-provider>
                      <p @click="switchToPassRecover" class="pointer">
                        Forget password
                      </p>
                    </v-col>
                    <v-col cols="12">
                      <v-divider class="mb-3" />
                      <p
                        class="text-h6 text-center pointer"
                        @click="switchToRegister"
                      >
                        Not registered? register now
                      </p>
                      <v-divider class="mt-3" />
                    </v-col>
                    <v-col cols="6">
                      <v-btn
                        outlined
                        block
                        @click="login_dialog = !login_dialog"
                      >
                        Cancel
                      </v-btn>
                    </v-col>
                    <v-col cols="6">
                      <v-btn
                        color="primary"
                        type="submit"
                        :disabled="invalid"
                        block
                        :loading="login_loading"
                      >
                        Login
                      </v-btn>
                    </v-col>
                  </v-row>
                </form>
              </validation-observer>
            </div>

            <div v-show="otp_holder">
              <!--Otp holder-->
              <v-col cols="12">
                <p class="text-h6">
                  Please enter code received your email address?
                </p>
                <v-otp-input
                  v-model="otp"
                  :disabled="otp_loading"
                  length="5"
                  @finish="onFinish"
                ></v-otp-input>
              </v-col>

              <v-col cols="12">
                <v-divider class="mb-3" />
                <p
                  class="text-h6 text-center pointer"
                  @click="recheckEnteredIdentity"
                >
                  Your email is incorrect? recheck it.
                </p>

                <v-divider class="my-3 text-center" />
                <v-btn
                  plain
                  class="text-none pointer"
                  @click="sendOtpCodeAgain()"
                  :disabled="sendOtpBtnStatus"
                >
                  Send code again
                  <span v-show="countDown" class="ml-3">{{ countDown }}</span>
                </v-btn>
              </v-col>
              <!--End otp holder-->
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { ValidationProvider, ValidationObserver } from "vee-validate";
import querystring from "querystring";
import axios from "axios";

export default {
  name: "login",
  data() {
    return {
      login_dialog: false,
      passVisible: false,
      login_loading: false,
      identity: "",
      password: "",

      otp: "",
      identity: "",
      otp_loading: false,
      countDown: 60,
      sendOtpBtnStatus: true,

      google_login_loading: true,
      identity_holder: true,
      otp_holder: false,
    };
  },
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  mounted() {},
  watch: {
    login_dialog(val) {
      if (val === true) {
        //Initialize google login
        setTimeout(() => {
          window.google.accounts.id.initialize({
            client_id:
              "231452968451-rd7maq3v4c8ce6d1e36uk3qacep20lp8.apps.googleusercontent.com",
            callback: this.handleCredentialResponse,
            auto_select: true,
          });

          window.google.accounts.id.renderButton(this.$refs.googleLoginBtn, {
            text: "Login",
            size: "large",
            width: "252",
            theme: "outline", // option : filled_black | outline | filled_blue
          });

          this.google_login_loading = false;
        }, 4000);
      }
    },
  },
  methods: {
    //Handle google login callback
    async handleCredentialResponse(response) {
      const querystring = require("querystring");

      await this.$axios
        .post(
          "/api/v1/users/googleAuth",
          querystring.stringify({
            id_token: response.credential,
          })
        )
        .then((response) => {
          this.$auth.setUserToken(response.data.data.jwtToken);
          this.$auth.setUser(response.data.data.info);
          this.submitLoginV2(response.data.data.jwtToken);

          this.login_dialog = false;
          this.$toast.success("Logged in successfully");

          this.$router.push({
            path: "/user",
          });
        })
        .catch(({ response }) => {
          if (response.status == 401) {
            this.$toast.error(this.$t(`LOGIN_WRONG_DATA`));
          } else if (response.status == 500 || response.status == 504) {
            this.$toast.error(this.$t(`REQUEST_FAILED`));
          }
        });
    },

    switchToRegister() {
      this.$emit("update:switchToRegister", "register");
    },
    switchToPassRecover() {
      this.$emit("update:switchToPassRecover", "pass_recover");
    },
    /**
     * Submits login credentials and handles authentication flow
     * - Makes POST request to login endpoint
     * - Handles OTP flow if required
     * - Sets auth tokens and user data on successful login
     * - Redirects to user page if on home page
     * @async
     * @returns {Promise<void>}
     */
    async submit() {
      this.login_loading = true;
      const querystring = require("querystring");
      await this.$axios
        .$post(
          "/api/v1/users/login",
          querystring.stringify({
            identity: this.identity,
            pass: this.password,
            type: "request",
          }),
          {
            responseType: "text",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        )
        .then(async (response) => {
          // Check if OTP login flow is required
          if (response.data.type && response.data.type == "loginByOTP") {
            this.$toast.success("Otp code sent");
            this.identity_holder = false;
            this.otp_holder = true;
          } else {
            // Regular login flow
            // Get v2 API token first
            await this.submitLoginV2(response.data.jwtToken);

            // Set auth data and user info
            this.$auth.setUserToken(response.data.jwtToken);
            this.$auth.setUser(response.data.info);

            this.$toast.success("Logged in successfully");
            this.login_dialog = false;

            // Redirect to user page if on home page
            if (this.$route.path == "/") {
              this.$router.push({
                path: "/user",
              });
            }
          }
        })
        .catch((err) => {
          // Handle login error
          if (err.response.status == 400)
            this.$toast.error(err.response.data.message);
        })
        .finally(() => {
          this.login_loading = false;
        });
    },
    /**
     * Submits login credentials to v2 API endpoint and stores token
     * @async
     * @returns {Promise<void>}
     */
    async submitLoginV2(old_token) {
      // Make POST request to v2 authentication endpoint
      const result = await this.$axios.$post(`/api/v2/identities/tokens/old`, {
        token: old_token,
      });
      if (result.succeeded) {
        // Store authentication token in local storage for v2 API
        localStorage.setItem("v2_token", result.data.token);
      } else if (
        result.errors.length &&
        result.errors[0].message === "UserNotFound"
      ) {
        let pass = this.password ? this.password : this.generatePassword();
        await this.registerV2(this.identity, pass);
      }
    },

    /**
     * Registers a new user with the v2 API endpoint
     * @async
     * @returns {Promise<void>}
     */
    async registerV2(email, pass) {
      // Make POST request to v2 registration endpoint
      const result = await this.$axios.$post(`/api/v2/identities/register`, {
        email: email,
        password: pass,
        confirmPassword: pass,
      });

      // If registration successful, attempt login
      if (result.data.succeeded) {
        await this.submitLoginV2(this.$auth.strategy.token.get());
      }
    },

    /**
     * Handles completion of OTP code entry and submits login request
     * @async
     * @returns {Promise<void>}
     */
    async onFinish() {
      // Import querystring for form data encoding
      const querystring = require("querystring");

      // Submit login request with OTP code
      this.$axios
        .$post(
          "/api/v1/users/login",
          querystring.stringify({
            type: "confirm",
            identity: this.identity,
            pass: this.password,
            code: this.otp,
            type: "confirm",
          })
        )
        .then(async (response) => {
          // Close login dialog and reset form state
          this.login_dialog = false;
          this.otp_holder = false;
          this.identity_holder = true;

          // Get v2 API token first
          await this.submitLoginV2(this.$auth.strategy.token.get());

          // Set authentication data
          this.$auth.setUserToken(response.data.jwtToken);
          this.$auth.setUser(response.data.info);

          // Show success message
          this.$toast.success("Logged in successfully");

          // Redirect to user page if on home page
          if (this.$route.path == "/")
            this.$router.push({
              path: "/user",
            });
        })
        .catch((err) => {
          // Handle login error
          if (err.response.status == 400)
            this.$toast.error(err.response.data.message);
        })
        .finally(() => {
          // Reset loading state
          this.register_loading = false;
        });
    },
    /**
     * Resets the form to show identity input instead of OTP input
     * by hiding OTP field and showing identity field
     */
    recheckEnteredIdentity() {
      // Hide OTP input section
      this.otp_holder = false;
      // Show identity input section
      this.identity_holder = true;
    },

    generatePassword(length = 12) {
      const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
      return Array.from(crypto.getRandomValues(new Uint8Array(length)))
        .map((x) => chars[x % chars.length])
        .join("");
    },
  },
};
</script>

<style scoped>
.btn-google {
  color: #545454;
  background-color: #ffffff;
  box-shadow: 0 1px 2px 1px #ddd;
}

.btn-google img {
  width: 30px;
  margin-right: 8px;
  max-width: 30px;
}
</style>
