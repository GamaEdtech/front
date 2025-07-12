<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  email: String,
  username : String,
  phoneNumber: String,
  id: String
})
const { $toast } = useNuxtApp();
const emit = defineEmits(['update:email', 'update:username', 'update:phoneNumber','delete'])

const form = reactive({
  email: props.email,
  username: props.username,
  phoneNumber: props.phoneNumber,
  id: props.id
})

let editUserBtn = ref(false)

const editUser = async (id) => {
    try{
        await useApiService.put(`/api/v2/admin/identities/${id}`,{
            username: form.username,
            email: form.email,
            phoneNumber: form.phoneNumber,
            firstName: null,
            lastName: null,
            avatar: null,
            allowedIpAddressesList: [null]
        })
        $toast.success('User Edited Successfully')
        editUserBtn.value = !editUserBtn.value
    }
    catch (err) {
        if (err.response?.status === 400) 
        $toast.error(err.response.data.message);
  }

}

const onDeleteClick = () => {
  emit('delete', props.id)
}

watchEffect(() => {
  if (props.email != null) form.email = props.email; else form.email = '';
  if (props.username != null) form.username = props.username; else form.username = '';
  if (props.phoneNumber != null) form.phoneNumber = props.phoneNumber; else form.phoneNumber = '';
});

watch(
  form,
  (newVal) => {
    emit('update:email', newVal.email)
    emit('update:username', newVal.username)
    emit('update:phoneNumber', newVal.phoneNumber)
  },
  { deep: true }
)
</script>
<template>
  <div class="text-center">
    <v-dialog
      :model-value="modelValue"
      @click:outside="$emit('update:modelValue', false)"
      width="500"
    >
      <v-card class="bg-primary-gray-100">
          <v-card-title class="gtext-t4 bg-white flex-column d-flex align-center pt-12">
            <div class="avatarBg">
              <img width="64" height="64" src="/public/images/adminAuth.png" alt="avatar">
            </div>
            <p class="primary-gray-700 gtext-t3 font-weight-semibold mb-2">{{ username }}</p>
          </v-card-title>
        
        <div class="scrollcontainerdialog pa-3">

                <label class="primary-gray-700 gtext-t6 font-weight-medium">
                    UserName
                </label>
                <v-text-field
                v-model="form.username"
                variant="solo"
                density="comfortable"
                class="mt-1"
                :disabled="!editUserBtn"
                />
                <label class="primary-gray-700 gtext-t6 font-weight-medium">
                    Email
                </label>
                <v-text-field
                v-model="form.email"
                variant="solo"
                density="comfortable"
                class="mt-1"
                :disabled="!editUserBtn"
                />
                <label class="primary-gray-700 gtext-t6 font-weight-medium">
                    Phone Number
                </label>
                <v-text-field
                v-model="form.phoneNumber"
                variant="solo"
                density="comfortable"
                class="mt-1"
                :disabled="!editUserBtn"
                />
            <v-card-actions class="px-0">
                <v-btn class="closeBtn" variant="plain" @click="$emit('update:modelValue', false)">
                    <span class="mdi mdi-close gtext-t1"></span>
                </v-btn>
                <v-btn class="deleteBtn" variant="plain" @click="onDeleteClick">
                    <span class="mdi mdi-delete gtext-t1"></span>
                </v-btn>
                <v-row class="">
                    <v-col class="d-flex justify-center ga-10">

                        <v-btn class="editBtn" variant="plain" v-show="!editUserBtn" @click="editUserBtn = !editUserBtn ">
                            edit
                        </v-btn>

                        <v-btn class="cancelBtn" variant="plain" v-show="editUserBtn" @click="editUserBtn = !editUserBtn">
                            cancel
                        </v-btn>
                        <v-btn class="saveBtn" variant="plain"  v-show="editUserBtn" @click="editUser(id)">
                            Save
                        </v-btn>

                    </v-col>
                </v-row>
            </v-card-actions>
        </div>

      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>

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
.dashed-divider {
  border-top: 1px dashed #D0D5DD; /* similar to v-divider */
  width: 100%;
}
.avatarBg{
  display: flex;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #F2F4F7;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}
.messageContainer{
  position: relative;
}
.messageText{
  height: 212px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0px !important;
}
.messageText::-webkit-scrollbar {
  width: 4px; /* thinner scrollbar */
}

.messageText::-webkit-scrollbar-track {
  background: white; /* or a subtle background */
  border-radius: 4px;
}

.messageText::-webkit-scrollbar-thumb {
  background-color: #98A2B3; /* lighter thumb */
  border-radius: 4px;
}

.bottom-fade {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 18px; /* fading height */
  width: 100%;
  pointer-events: none;
  z-index: 1;
  background: linear-gradient(to bottom, transparent, #F2F4F7); /* Adjust color to match your background */
}

.closeBtn {
    width: 24px !important;
    min-width: 24px !important;
    height: 24px !important;
    color: #D0D5DD;
    position: absolute;
    top: 16px;
    left: 16px;
    padding: 0px !important;
    &:hover{
        color: #F04438;
        transition: 300ms;
    }
}
.deleteBtn {
    width: 24px !important;
    min-width: 24px !important;
    height: 24px !important;
    color: #D0D5DD;
    position: absolute;
    top: 16px;
    right: 16px;
    padding: 0px !important;
    &:hover{
        color: #F04438;
        transition: 300ms;
    }
}

.saveBtn{
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
.editBtn{
    color: #6a6b6d;
    opacity: 0.9;
    &:hover{
        color: rgb(69, 69, 69);
        opacity: 1;
        transition: 300ms;
    }
}
.cancelBtn{
    height: 3.4rem;
    width: 7rem;
    padding: 0rem 1.2rem;
    color: white;
    background-color: #344054;
    border-radius: 3rem;
    opacity: 0.9;
    &:hover{
        transition: 300ms;
        opacity: 1;
    }
}

/* Scoped to dialog card's scrollbar */
:deep(.v-dialog .scrollcontainerdialog::-webkit-scrollbar) {
  width: 60px;
}

:deep(.v-dialog .scrollcontainerdialog::-webkit-scrollbar-thumb) {
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
}

.v-dialog .v-card::-webkit-scrollbar-track {
  background: transparent;
}

/* Firefox support */
.v-dialog .v-card {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.3) transparent;
}

.bg-F8F9FC{
  background-color: #F8F9FC;
}
.color-4E5BA6{
color: #4E5BA6;
}

.max-width-fit{
max-width: fit-content;
}

.replyBtn{
  min-width: 170px;
}
:deep(.v-btn__content){
  font-family: Inter, sans-serif !important;
  font-size: 1.4rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}
</style>