<script setup>
import useApiService from '~/composables/useApiService';


defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
});
const { $toast } = useNuxtApp();

const emit = defineEmits(['update:modelValue']);


const form = ref(null);
const formIsValid = ref(false);

const newUser = ref({
  username: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: ''
});

const rules = {
  required: v => !!v || 'This field is required',
  email: v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
  phone: v => /^\d{10,15}$/.test(v) || 'Phone number must be valid',
  minPassword: v => (v && v.length >= 6) || 'Password must be at least 6 characters',
  matchPassword: v => v === newUser.value.password || 'Passwords must match'
};

const passwordVisible = ref(false)
const confirmPasswordVisible = ref(false)


const submitUser = async () => {
    try{
        const res = await useApiService.post('/api/v2/admin/identities',{
            'Username' : newUser.value.username,
            'FirstName' : newUser.value.firstName,
            'LastName' : newUser.value.lastName,
            'Email' : newUser.value.email,
            'PhoneNumber' : newUser.value.phone,
            'Password' : newUser.value.password,
            'ConfirmPassword' : newUser.value.confirmPassword
        })
        // Reset all form fields
            Object.keys(newUser.value).forEach(key => {
                newUser.value[key] = '';
            });
            form.value.reset();
            $toast.success("User Added Successfully")
            emit('update:modelValue', false);
            console.log('salam')
    }
    catch(err){
        if (err.response?.status === 400) 
        $toast.error(err.response.data.message);
    }
  
};
</script>
<template>
  <v-dialog :model-value="modelValue" @click:outside="$emit('update:modelValue', false)" max-width="500px">
    <v-card>
      <v-card-title class="d-flex justify-center pa-4 bg-primary-gray-200">
        <span class="gtext-t3">Add New User</span>
      </v-card-title>

      <v-card-text class="py-2">
        <v-form ref="form" v-model="formIsValid">
            <label class="primary-gray-700 gtext-t6 font-weight-medium mt-3">
                UserName
            </label>
            <v-text-field
            v-model="newUser.username"
            variant="solo"
            density="compact"
            :rules="[rules.required]"
            />
            <label class="primary-gray-700 gtext-t6 font-weight-medium mt-3">
                First Name
            </label>
            <v-text-field
            v-model="newUser.firstName"
            variant="solo"
            density="compact"
            />
            <label class="primary-gray-700 gtext-t6 font-weight-medium mt-3">
                Last Name
            </label>
            <v-text-field
            v-model="newUser.lastName"
            variant="solo"
            density="compact"
            />
            <label class="primary-gray-700 gtext-t6 font-weight-medium mt-3">
                Email
            </label>
            <v-text-field
            v-model="newUser.email"
            variant="solo"
            type="email"
            density="compact"
            :rules="[rules.required, rules.email]"
            />
            <label class="primary-gray-700 gtext-t6 font-weight-medium mt-3">
                Phone Number
            </label>
            <v-text-field
            v-model="newUser.PhoneNumber"
            variant="solo"
            type="email"
            density="compact"
            :rules="[rules.required, rules.phone]"
            />
            <label class="primary-gray-700 gtext-t6 font-weight-medium mt-3">
                Password
            </label>
            <v-text-field
            v-model="newUser.password"
            :append-inner-icon="passwordVisible ? 'mdi-eye' : 'mdi-eye-off' "
            :type="passwordVisible ? 'text' : 'password'"
            @click:append-inner="passwordVisible = !passwordVisible"
            variant="solo"
            type="email"
            density="compact"
            :rules="[rules.required, rules.minPassword]"
            />
            <label class="primary-gray-700 gtext-t6 font-weight-medium mt-3">
                confirm Password
            </label>
            <v-text-field
            v-model="newUser.confirmPassword"
            :append-inner-icon="confirmPasswordVisible ? 'mdi-eye' : 'mdi-eye-off' "
            :type="confirmPasswordVisible ? 'text' : 'password'"
            @click:append-inner="confirmPasswordVisible = !confirmPasswordVisible"
            variant="solo"
            type="email"
            density="compact"
            :rules="[rules.required, rules.matchPassword]"
            />
        </v-form>
      </v-card-text>

      <v-card-actions class="d-flex justify-center ga-10 mb-2">
        <v-btn
        class="rounded-pill gtext-t5 bg-primary-gray-700 text-white ml-4"
        @click="$emit('update:modelValue', false)"
      >
        <span>Cancel</span>
      </v-btn>
        <v-btn
        class="rounded-pill gtext-t5 ml-4 submitBtn"
        @click="submitUser" :disabled="!formIsValid"
      >
        <span>Submit</span>
      </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<style scoped>
:deep(.v-btn__content){
  font-family: Inter, sans-serif !important;
  font-size: 1.4rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}
:deep(.v-field__input){
  font-family: Inter, sans-serif;
  font-size: 1.6rem;
  line-height: 1.8rem;
  font-weight: 400;
}
:deep(.v-field){
  border-radius: 16px;
  border: 1px solid #E4E7EC;
  box-shadow: none;
}
.v-input{
  font-family: Inter, sans-serif !important;
  font-size: 1.2rem !important;
  line-height: 1.8rem !important;
  font-weight: 400 !important;
}
.submitBtn{
    width: 7rem;
    height: 3.4rem;
    padding: 0rem 1.2rem;
    background: #ffb600;
    color: #24292f;
    border-radius: 3rem;
    opacity: 0.7;
    &:hover{
        opacity: 1;
        transition: 300ms;
    }
}
</style>