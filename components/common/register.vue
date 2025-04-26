<script setup>
import { useAuth } from '~/composables/useAuth';

const { $toast } = useNuxtApp()
const props = defineProps({
  dialog: Boolean
})

let register_dialog = ref(false)
let google_register_loading = ref(true)
let show1 = ref(false)
let password = ref("")
let confirmPassword = ref("")
let register_loading = ref(false)
let googleRegisterBtn = ref(null)
let timerId = ref(null)

let otp = ref("")
let identity = ref("")
let otp_loading = ref(false)
let countDown = ref(60)
let sendOtpBtnStatus= ref(true)
let identity_holder = ref(true)
let otp_holder = ref(false)
let select_pass_holder = ref(false)


onMounted(() => {
  setTimeout(() => {
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
    
  }, 4000)
})

watch(countDown, (val) => {
  //When user wait 10 second
  if (val === 0) sendOtpBtnStatus.value = false
  //When user request new otp code
  if (val === 60) countDownTimer()
})


const emit = defineEmits(['switchToRegister','update:dialog'])
// Switch to login page
const switchToLogin = () => {
  emit('switchToLogin');
};
function closeDialog() {
  register_dialog.value = false
  identity_holder.value = true
  otp_holder.value = false
  select_pass_holder.value = false
  emit('update:dialog', false)
}

const recheckEnteredIdentity = () => {
  otp_holder.value = false
  identity_holder.value = true
}

const cancelRegister = () => {
  register_dialog.value = false
  identity_holder.value = true
  otp_holder.value = false
  select_pass_holder.value = false
}

const requestRegister = async () => {
  register_loading.value = true
  try{
    const response = await $fetch('/api/v1/users/register',{
      method : 'POST',
      body: new URLSearchParams({
      type: "request",
      identity: identity.value,
    })})
    if(response.status === 1){
      $toast.success("Otp code sent")
      identity_holder.value = false
      otp_holder.value = true
      countDownTimer();
    }else{
      $toast.error(response.message)
    }
  }
    catch (error) {
      const errorData = error?.response?._data;

      if(error?.response?.status === 400)
        $toast.error(errorData.message);
      else
        $toast.error('Something went wrong.')
    }
    finally{
      register_loading.value = false
    }
}


const onFinish = async () => {
  try {
    const response = await $fetch('/api/v1/users/register', {
      method: 'POST',
      body: new URLSearchParams({
        type: "confirm",
        identity: identity.value,
        code: otp.value,
      })
    })
    if(response.status === 1){
      otp_holder.value = false
      select_pass_holder.value = true
    }}
  catch(error) {
    const errorData = error?.response?._data;

    if(error?.response?.status === 400)
      $toast.error(errorData.message);
    else
      $toast.error('Something went wrong.')
    }
}

const sendOtpCodeAgain = async () => {
  try {
    const response = await $fetch('/api/v1/users/register',{
      method : 'POST',
      body: new URLSearchParams({
      type: "resend_code",
      identity: identity.value,
    })
    })
    countDownTimer();
    sendOtpBtnStatus.value = true
    $toast.success("Otp code sent again")}
  catch(error) {
    const errorData = error?.response?._data;

    if(error?.response?.status === 400)
      $toast.error(errorData.message);
    else
      $toast.error('Something went wrong.')
      
    }
}

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

const finalRegister = async () => {
  register_loading.value = true
  const auth = useAuth();
  try{
    await auth.register({
      identity: identity.value,
      pass: password.value,
    })
    $toast.success("Registered successfully")
    register_dialog.value = false
    identity_holder.value = true
    otp_holder.value = false
    select_pass_holder.value = false
    }
  catch(error) {
    const errorData = error?.response?._data;

    if(error?.response?.status === 400)
      $toast.error(errorData.message);
    else
      $toast.error('Something went wrong.')
    }
  finally{
      register_loading.value = false
      closeDialog();
    }
}


const handleCredentialResponse = async(value) => {
  try{
    const response = await $fetch('/api/v1/users/googleAuth', {
      method: 'POST',
      body: new URLSearchParams({
        id_token: value.credential,
      })
    })
    if(response.status === 1){
      $toast.success("Logged in successfully");
      auth.setUserToken(response.data.jwtToken);
      closeDialog();
      navigateTo('/user');
    }
  } catch (err) {
    const status = err?.response?.status

    if (status === 401) {
      $toast.error(useNuxtApp().$t('LOGIN_WRONG_DATA'))
    } else if (status === 500 || status === 504) {
      $toast.error(useNuxtApp().$t('REQUEST_FAILED'))
    }
  }
}

</script>
<template>
  <v-dialog v-model="props.dialog" max-width="300px" style="z-index: 20001" @click:outside="closeDialog">
    <v-card>
      <v-card-title>
        <span class="text-h5">Register</span>
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
            <div v-show="identity_holder">
              <validation-observer>
                <form @submit.prevent="requestRegister()">
                  <v-row>
                    <v-col cols="12">
                      <validation-provider
                        name="request_identity"
                        rules="required"
                      >
                        <v-text-field
                          dense
                          label="Email"
                          v-model="identity"
                          outlined
                        />
                      </validation-provider>
                      <p class="text-h6">
                        A agree
                        <span class="blue--text">terms and conditions</span>
                      </p>
                    </v-col>

                    <v-col cols="12">
                      <v-divider class="mb-3" />
                      <p
                        class="text-h6 text-center pointer"
                        @click="switchToLogin"
                      >
                        Already registered? login now
                      </p>

                      <v-divider class="mt-3" />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="6" lg="6">
                      <v-btn outlined @click="closeDialog"> Cancel </v-btn>
                    </v-col>
                    <v-col cols="6" lg="6">
                      <v-btn
                        color="primary"
                        type="submit"
                        :loading="register_loading"
                      >
                        Register
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
            <div v-show="select_pass_holder">
              <!--Otp holder-->
              <v-col cols="12">
                <p class="text-h6">Please enter password</p>
                <!-- <validation-observer -->
                <form @submit.prevent="finalRegister()">
                  <v-row>
                    <v-col cols="12">
                      <!-- <validation-provider -->
                      <!-- v-slot="{ errors }" name="password" rules="required|min:8"
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
                      <!-- <validation-provider -->
                      <!-- name="confirmPassword" v-slot="{ errors }"
                      rules="required|min:8|confirmed:password" > -->
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
                      <v-btn outlined @click="closeDialog"> Cancel </v-btn>
                    </v-col>
                    <v-col cols="6" lg="6">
                      <v-btn
                        color="primary"
                        type="submit"
                        :loading="register_loading"
                        :disabled="invalid"
                      >
                        Register
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
