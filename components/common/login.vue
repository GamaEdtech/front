<script setup>
import { ref } from "vue";
import { useField, useForm } from "vee-validate";
import * as yup from "yup";

const login_dialog = defineModel(false);
const passVisible = ref(false);
const login_loading = ref(false);
const validationSchema = yup.object().shape({
  identity: yup
    .string()
    .required("Email is required")
    .email("Must be a valid email"),
  password: yup.string().required().min(4),
});
const { handleSubmit, handleReset } = useForm({
  validationSchema,
});
const identity = useField("identity");
const password = useField("password");

const otp = ref("");
const otp_loading = ref(false);
const countDown = ref(60);
const sendOtpBtnStatus = ref(true);

const google_login_loading = ref(true);
const identity_holder = ref(true);
const otp_holder = ref(false);

const submit = handleSubmit(async () => {
  login_loading.value = true;
  try {
    const response = await fetch("/api/v1/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        identity: identity.value.value,
        pass: password.value.value,
        type: "request",
      }),
    });

    if (!response.ok) throw await response.json();

    const data = await response.json();

    if (data.type === "loginByOTP") {
      $toast.success("Otp code sent");
      identity_holder.value = false;
      otp_holder.value = true;
    } else {
      $auth.setUserToken(data.jwtToken);
      $auth.setUser(data.info);
      $toast.success("Logged in successfully");
      model.value = false;
      if ($route.path === "/") $router.push({ path: "/user" });
    }
  } catch (error) {
    if (error.status === 400) $toast.error(error.message);
  } finally {
    login_loading.value = false;
  }
});

const switchToRegister = () => {
  const emit = defineEmits(['update:switchToRegister'])
  emit("update:switchToRegister", "register");
};

const switchToPassRecover = () => {
  const emit = defineEmits(['update:switchToRegister'])
  emit("update:switchToPassRecover", "pass_recover");
};

const recheckEnteredIdentity = () => {
  otp_holder.value = false;
  identity_holder.value = true;
};
</script>

<template>
  <v-dialog v-model="login_dialog" max-width="300px">
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
              />
              <span style="font-size: 1.2rem"> Loading google sign in</span>
            </div>
            <div v-show="!google_login_loading" ref="googleLoginBtn" />
          </v-col>
          <v-col cols="12">
            <div v-show="identity_holder">
              <form @submit.prevent="submit">
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="identity.value.value"
                      dense
                      label="Email"
                      outlined
                      required
                      autocomplete="off"
                      :error-messages="identity.errorMessage.value"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="password.value.value"
                      label="Password"
                      outlined
                      dense
                      :type="passVisible ? 'text' : 'password'"
                      :append-icon="passVisible ? 'mdi-eye' : 'mdi-eye-off'"
                      @click:append="passVisible = !passVisible"
                      required
                      :error-messages="password.errorMessage.value"
                    />
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
                      Not registered? Register now
                    </p>
                    <v-divider class="mt-3" />
                  </v-col>
                  <v-col cols="6">
                    <v-btn outlined block @click="model = !login_dialog">Cancel</v-btn>
                  </v-col>
                  <v-col cols="6">
                    <v-btn
                      color="primary"
                      type="submit"
                      :loading="login_loading"
                      block
                    >
                      Login
                    </v-btn>
                  </v-col>
                </v-row>
              </form>
            </div>

            <div v-show="otp_holder">
              <!--Otp holder-->
              <v-col cols="12">
                <p class="text-h6">
                  Please enter the code received on your email address:
                </p>
                <v-otp-input
                  v-model="otp"
                  :disabled="otp_loading"
                  length="5"
                  @finish="onFinish"
                />
              </v-col>
              <v-col cols="12">
                <v-divider class="mb-3" />
                <p
                  class="text-h6 text-center pointer"
                  @click="recheckEnteredIdentity"
                >
                  Your email is incorrect? Recheck it.
                </p>
                <v-divider class="my-3 text-center" />
                <v-btn
                  plain
                  class="text-none pointer"
                  @click="sendOtpCodeAgain"
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
