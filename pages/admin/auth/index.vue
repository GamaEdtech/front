<script setup>

// Disable Nuxt Auth middleware
definePageMeta({
  name: 'admin-auth',
  layout: 'default',
  auth: false,
})
const router = useRoute()

const rememberMe = ref(false)
const loading = ref(false)
const loginError = ref('')
const emailError = ref('')
const passwordError = ref('')
const isFormValid = ref(false)
const passwordShow = ref(false)

const emailRules = [(v) => !!v || 'Email or username is required']
const passwordRules = [
  v => !!v || 'Password is required',
  v => (v && v.length >= 4) || 'Password must be at least 4 characters',
]

const form = reactive({
  email: '',
  password: '',
})


const submit = async () => {
  const auth = useAuth();
  const { setUser } = useUser();
  loginError.value = ''

  try {
    loading.value = true

    const formData = {
      username: form.email,
      password: form.password,
    }

    const result = await useApiService.post('/api/v2/identities/tokens', formData)

    if (result.succeeded) {
      if (rememberMe.value) {
        localStorage.setItem('v2_token', result.data.token)
      } else {
        sessionStorage.setItem('v2_token', result.data.token)
      }
      auth.setUserToken(result.data.jwtToken);
      setUser(result.data.info);
      router.push('/admin')
    } else {
      const errorMessage = result?.errors?.[0]?.message
      switch (errorMessage) {
        case 'WrongUsernameOrPassword':
          loginError.value = 'Invalid username or password. Please try again.'
          break
        case 'UserLockedOut':
          loginError.value =
            'Your account has been locked due to multiple failed login attempts. Please contact an administrator.'
          break
        default:
          loginError.value = errorMessage || 'Login failed. Please try again.'
      }
    }
  } catch (err) {
    console.error('Login error:', err)
    loginError.value = 'An error occurred during login. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
<template>
  <v-container class="fill-height my-14 my-lg-5" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="pa-8" elevation="0" color="#F2F4F7" rounded="lg">
          <div class="text-center mb-6">
            <div
              class="rounded-circle mx-auto d-flex align-center justify-center"
              style="width: 100px; height: 100px"
            >
              <img
                src="/public/images/adminAuth.png"
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
            ref="adminForm"
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
              variant="outlined"
              density="comfortable"
              :rules="emailRules"
              rounded
              @focus="emailError = ''"
              class="mb-9"
            ></v-text-field>

            <div class="mb-1">
              <label class="primary-gray-700 font-size-xs font-weight-medium"
                >Password</label
              >
            </div>
            <v-text-field
              v-model="form.password"
              :append-icon="passwordShow ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="passwordShow = !passwordShow"
              placeholder="Enter Password"
              variant="outlined"
              density="comfortable"
              :rules="passwordRules"
              rounded
              :type="passwordShow ? 'text' : 'password'"
              background-color="white"
              class="mb-4"
              @focus="passwordError = ''"
            ></v-text-field>

            <div class="d-flex align-center justify-space-between mb-6">
              <v-checkbox
                v-model="rememberMe"
                label="Remember me"
                hide-details
                class="mt-0 pt-0 primary-gray-800 gtext-t5 font-weight-medium"
                color="primary"
              ></v-checkbox>
              <v-btn
                variant="plain"
                color="#FFB600"
                class="gtext-t5 pa-0 text-capitalize"
                >Forgot password?</v-btn
              >
            </div>

            <v-btn
              block
              rounded
              height="40px"
              color="#FFB600"
              class="primary-gray-800 gtext-t5 mb-5"
              :loading="loading"
              :disabled="!isFormValid"
              @click="submit"
            >
              Login
            </v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
:deep(.v-label){
    font-size: 14px !important;
    font-weight: 400;
    color: #1D2939;
}
:deep(.v-field__field){
    background-color: white;
    border-radius: 25px;
}

:deep(.v-text-field  .v-input__slot) {
  min-height: 48px !important;
}

:deep(.v-input__append){
  font-size: 16px !important;
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