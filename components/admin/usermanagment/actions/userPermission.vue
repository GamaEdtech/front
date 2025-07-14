<script setup>
import useApiService from '~/composables/useApiService';


const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  id: String
});

const { $toast } = useNuxtApp();

const emit = defineEmits(['update:modelValue']);

const userRole = ref([])

const getUserPermission = async () => {
    try {
        const res = await useApiService.get(`/api/v2/admin/identities/${props.id}/permissions`);
        userRole.value = res.data.roles
    } catch (error) {
        
    }
}

const editUserPermission = async (id) => {
  const res = await useApiService.put(`/api/v2/admin/identities/${id}/permissions`,{
    roles: userRole.value
  })
  userRole.value = res.data.roles

}

onMounted(() => {
  getUserPermission()
})



</script>
<template>
  <v-dialog :model-value="modelValue" @click:outside="$emit('update:modelValue', false)" max-width="400px">
    <v-card class="bg-primary-gray-200">
      <v-card-title class="d-flex justify-center pa-4 bg-white">
        <span class="gtext-t3">User Permission</span>
      </v-card-title>

      <v-card-text class="py-2">
        <label class="primary-gray-700 gtext-t6 font-weight-medium mt-3">
                Roles
            </label>
        <v-select
          :items="['Admin']"
          variant="solo"
          density="compact"
          multiple
          v-model="userRole"
        ></v-select>
      </v-card-text>

      <v-card-actions class="d-flex justify-center ga-10 mb-2">
        <v-btn class="closeBtn" variant="plain" @click="$emit('update:modelValue', false)">
                    <span class="mdi mdi-close gtext-t1"></span>
                </v-btn>
        <v-btn
        class="rounded-pill gtext-t5 ml-4 submitBtn"
        @click="editUserPermission(props.id)"
      >
        <span>Submit</span>
      </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<style scoped>
:deep(.v-btn__content span){
  font-family: Inter, sans-serif !important;
  font-size: 1.4rem;
  font-style: normal;
  font-weight: 700;
  line-height: 0 !important;
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
}
.closeBtn {
    width: 24px !important;
    min-width: 24px !important;
    height: 24px !important;
    color: #919191;
    position: absolute;
    top: 16px;
    left: 16px;
    padding: 0px !important;
    &:hover{
        color: #F04438;
        transition: 300ms;
    }
}
</style>