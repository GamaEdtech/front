<script setup>

const props = defineProps({
  dialog: Boolean
})

let pass_recover_dialog = ref(false)
let google_register_loading =  ref(true)
let show1 = ref(false)
let password = ref("")
let confirmPassword = ref("")
let passRecoverLoading = ref(false)

let otp = ref("")
let identity = ref("")
let otp_loading = ref(false)
let countDown = ref(60)
let timerId = ref(null)
let sendOtpBtnStatus = ref(true)

let identityHolder = ref(true)
let otpHolder = ref(false)
let select_pass_holder = ref(false)
let googleRegisterBtn = ref(null)


watch(countDown ,(val) => {
      //When user wait 10 second
      if (val === 0) sendOtpBtnStatus.value = false;

      //When user request new otp code
      if (val === 60) countDownTimer();
    });

onMounted(() => {
  setTimeout(() => {
    if (window.google?.accounts?.id && googleRegisterBtn.value) {
      window.google.accounts.id.initialize({
        client_id: '231452968451-rd7maq3v4c8ce6d1e36uk3qacep20lp8.apps.googleusercontent.com',
        callback: handleCredentialResponse,
        auto_select: true
      })

      window.google.accounts.id.renderButton(googleRegisterBtn.value, {
        text: 'Login',
        size: 'large',
        width: '252',
        theme: 'outline'
      })

      google_register_loading.value = false
    }
  }, 4000)
})


// Google login callback
const handleCredentialResponse = async (response) => {

  const { data, error } = await $fetch('/api/v1/users/googleAuth', {
    method: 'POST',
    body: new URLSearchParams({
      'id_token' : response.credential
    }) 
  });

  if (error.value) {
    if (error.value.status === 401) {
      // Show error toast for wrong data
      $toast.error('LOGIN_WRONG_DATA');
    } else if ([500, 504].includes(error.value.status)) {
      // Handle request failure
      $toast.error('REQUEST_FAILED');
    }
  } else {
    // Store user data in authentication
    auth.setUserToken(data.value.data.jwtToken);
    auth.setUser(data.value.data.info);
    passRecoverDialog.value = false;
    toast.success('Logged in successfully');
    router.push('/user');
  }
};


// Handle OTP request
const requestPassRecover = async ()  => {
  passRecoverLoading.value = true;
  try{
     await fetch('api/v1/users/recovery',{
      method: 'POST',
      body: new URLSearchParams({
        'type' : 'request',
        'identity' : identity.value
      })
    })

    identityHolder.value = false;
    otpHolder.value = true;
    countDownTimer();
  } catch(err){
    //if (err.response.status == 400)
      //toast.error(err.response.data.message);
  }
  finally{
    passRecoverLoading.value = false;
  }
};


// Handle OTP confirmation
const onFinish = () => {
  try{
    fetch('/api/v1/users/recovery', {
    method: 'POST',
    body: new URLSearchParams({
      'type': 'confirm',
    'identity': identity.value,
    'code': otp.value,
    }),
  });
  }
  

  catch (err) {
    //if (err.status === 400) 
      //toast.error(error.value.data.message);
  }
  finally{
    otpHolder.value = false;
    selectPassHolder.value = true;
    passRecoverLoading.value = false;
  }
};

// Resend OTP code
const sendOtpCodeAgain = () => {

  const { data, error } = $fetch('/api/v1/users/recovery', {
    method: 'POST',
    body: new URLSearchParams({
      'type' : 'resend_code',
      'identity' : identity.value,
    }),
  });

  if (error.value) {
    if (error.value.status === 400) {
      toast.error(error.value.data.message);
    }
  } else {
    countDown.value = 60;
    sendOtpBtnStatus.value = true;
    toast.success('Otp code sent again');
  }
  passRecoverLoading.value = false;
};


// Timer for countdown
const countDownTimer = () => {
  if (timerId) {
    clearTimeout(timerId)
    timerId = null
  }
  countDown.value = 60
  tick()
}

const tick = () => {
  if (countDown.value > 0) {
    timerId = setTimeout(() => {
      countDown.value -= 1
      tick()
    }, 1000)
  } else {
    timerId = null 
  }
}


// Final password recovery
const passRecover = () => {
  passRecoverLoading.value = true;
  const { data, error } = $fetch('/api/v1/users/recovery', {
    method: 'POST',
    body: new URLSearchParams({
      'type' : 'resetpass',
      'identity' : identity.value,
      'pass' : password.value
    }),
  });

  if (error.value) {
    if (error.value.status === 400) {
      toast.error(error.value.data.message);
    }
  } else {
    toast.success('Password reset successfully');
    passRecoverDialog.value = false;
    identityHolder.value = true;
    otpHolder.value = false;
    selectPassHolder.value = false;
  }
  passRecoverLoading.value = false;
};

// Cancel password recovery
const cancelPassRecover = () => {
  props.dialog = false;
  identityHolder.value = true;
  otpHolder.value = false;
  selectPassHolder.value = false;
};

const emit = defineEmits(['switchToRegister','switchToRecover','update:dialog'])
// Switch to login page
const switchToLogin = () => {
  emit('switchToLogin');
};

// Switch to register page
const switchToRegister = () => {
  emit('switchToRegister');
};

function closeDialog() {
  emit('update:dialog', false)
}

</script>
<template>
  <v-dialog
    v-model="props.dialog"
    max-width="300px"
    style="z-index: 20001"
    @click:outside="closeDialog"
  >
    <v-card>
      <v-card-title>
        <span class="text-h5">Password recovery</span>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" class="text-center">
            <v-divider class="my-2" />

            <div v-show="google_register_loading">
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
            <div v-show="!google_register_loading" ref="googleRegisterBtn" />
          </v-col>
          <v-col cols="12">
            <div v-show="identityHolder">
              <!-- <validation-observer ref="observer" v-slot="{ invalid }"> -->
              <form @submit.prevent="requestPassRecover">
                <v-row>
                  <v-col cols="12">
                    <!-- <validation-provider
                        v-slot="{ errors }"
                        name="request_identity"
                        rules="required"
                      > -->
                    <v-text-field
                      dense
                      label="Email"
                      :error-messages="errors"
                      v-model="identity"
                      outlined
                    />
                    <!-- </validation-provider> -->
                  </v-col>

                  <v-col cols="12">
                    <v-divider class="mb-3" />
                    <p class="text-h6 text-center pointer">
                      <span @click="switchToLogin">Login</span>
                      |
                      <span @click="switchToRegister">Register</span>
                    </p>

                    <v-divider class="mt-3" />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6" lg="6">
                    <v-btn outlined @click="closeDialog">
                      Cancel
                    </v-btn>
                  </v-col>
                  <v-col cols="6" lg="6">
                    <v-btn
                      color="primary"
                      type="submit"
                      :loading="passRecoverLoading"
                      :disabled="invalid"
                    >
                      Recover
                    </v-btn>
                  </v-col>
                </v-row>
              </form>
              <!-- </validation-observer> -->
            </div>
            <div v-show="otpHolder">
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
            <div v-show="select_pass_holder">
              <!--Otp holder-->
              <v-col cols="12">
                <p class="text-h6">Please enter password</p>
                <!-- <validation-observer
                  ref="final_reg_observer"
                  v-slot="{ invalid }"
                > -->
                <form @submit.prevent="passRecover()">
                  <v-row>
                    <v-col cols="12">
                      <!-- <validation-provider
                          v-slot="{ errors }"
                          name="password"
                          rules="required|min:4"
                        > -->
                      <v-text-field
                        label="Password"
                        v-model="password"
                        outlined
                        :error-messages="errors"
                        dense
                        type="password"
                        :type="show1 ? 'text' : 'password'"
                        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                        @click:append="show1 = !show1"
                        required
                      />
                      <!-- </validation-provider> -->
                    </v-col>
                    <!--     Confirm Password       -->
                    <v-col cols="12">
                      <!-- <validation-provider
                          name="confirmPassword"
                          v-slot="{ errors }"
                          rules="required|min:4|confirmed:password"
                        > -->
                      <v-text-field
                        v-model="confirmPassword"
                        type="password"
                        :error-messages="errors"
                        label="Confirm password"
                        dense
                        outlined
                      >
                      </v-text-field>
                      <!-- </validation-provider> -->
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="6" lg="6">
                      <v-btn outlined @click="cancelPassRecover()">
                        Cancel
                      </v-btn>
                    </v-col>
                    <v-col cols="6" lg="6">
                      <v-btn
                        color="primary"
                        type="submit"
                        :loading="passRecoverLoading"
                        :disabled="invalid"
                      >
                        Reset
                      </v-btn>
                    </v-col>
                  </v-row>
                </form>
                <!-- </validation-observer> -->
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
