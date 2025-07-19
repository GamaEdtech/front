<script setup>
import useApiService from '~/composables/useApiService';

const props = defineProps({
  modelValue: Boolean,
  locationType: String,
  location : Object
});
const { $toast } = useNuxtApp();

const emit = defineEmits(['update:modelValue','fetchLocations']);


const form = ref(null);
const formIsValid = ref(false);

const location = reactive({
    id: props.location.id,
    title: props.location.title,
    localTitle: props.location.localTitle,
    code: props.location.code,
    parentId: props.location.parentId,
    latitude: props.location.latitude,
    longitude: props.location.longitude
});

const rules = {
  required: v => v !== null && v !== undefined && v !== '' || 'This field is required',
  onlyNumbers: v => /^-?\d+(\.\d+)?$/.test(v) || 'Only numbers are allowed'
}


const editLocation = async () => {
  try{
    const res = await useApiService.put(`/api/v2/admin/locations/${props.locationType}/${location.id}`,
    {
        title: location.title,
        localTitle: location.localTitle,
        code: location.code,
        parentId: location.parentId,
        latitude: location.latitude,
        longitude: location.longitude,
      });
    if(res.succeeded){
      Object.keys(Location).forEach(key => {
        Location[key] = '';
      });
      form.value.reset();
      $toast.success("Location Edited Successfully")
      emit('update:modelValue', false);
      emit('fetchLocations');
    }
    else 
      $toast.error(res.errors[0].message)
  } catch(err){
      if (err.response?.status === 400) 
        $toast.error(err.response.data.message);
  }
}

watch(
  () => props.location,
  async (newVal) => {
    if (newVal) {
      location.title = newVal.title || '';
      location.localTitle = newVal.localTitle || '';
      location.code = newVal.code || '';
      location.parentId = newVal.parentId || 0;
      location.latitude = newVal.latitude || 0;
      location.longitude = newVal.longitude || 0;

      await nextTick();
      form.value?.validate();
    }
  },
  { immediate: true, deep: true }
);
</script>
<template>
  <v-dialog :model-value="modelValue" @click:outside="$emit('update:modelValue', false)" max-width="500px">
    <v-card class="bg-primary-gray-200 rounded-xl">
      <v-card-title class="d-flex flex-column align-center py-10 pb-6 ga-3 bg-white">
        <div class="rounded-pill bg-primary-gray-100 pa-4">
            <v-icon class="fontsize-80 primary-blue-500">mdi mdi-file-edit-outline</v-icon>
        </div>
        <span class="gtext-t3 font-weight-medium">Edit {{ location.title }}</span>
      </v-card-title>

      <v-card-text class="py-2">
        <v-form ref="form" v-model="formIsValid">
          <div class="d-flex flex-column w-100 ga-2 flex-sm-row">
            <div class="w-100">
              <label class="primary-gray-700 gtext-t6 font-weight-medium mt-3">
                Title
              </label>
              <v-text-field
              v-model="location.title"
              variant="solo"
              density="compact"
              />
            </div>
            <div class="w-100">
              <label class="primary-gray-700 gtext-t6 font-weight-medium mt-3">
                Local Title
              </label>
              <v-text-field
              v-model="location.localTitle"
              variant="solo"
              density="compact"
              />
            </div>
          </div>
          <div class="d-flex flex-column w-100 ga-2 flex-sm-row">
            <div class="w-100">
              <label class="primary-gray-700 gtext-t6 font-weight-medium mt-3">
                Code
              </label>
              <v-text-field
              v-model="location.code"
              variant="solo"
              density="compact"
              :rules="[rules.required]"
              />
            </div>
            <div class="w-100">
              <label class="primary-gray-700 gtext-t6 font-weight-medium mt-3">
                Parent Id
              </label>
              <v-text-field
              v-model="location.parentId"
              variant="solo"
              density="compact"
              type="number"
              :rules="[rules.required, rules.onlyNumbers]"
              />
            </div>
          </div>
          <div class="d-flex flex-column w-100 ga-2 flex-sm-row">
            <div class="w-100">
              <label class="primary-gray-700 gtext-t6 font-weight-medium mt-3">
                Latitude
              </label>
              <v-text-field
              v-model="location.latitude"
              variant="solo"
              density="compact"
              type="number"
              :rules="[rules.required, rules.onlyNumbers]"
              />
            </div>
            <div class="w-100">
              <label class="primary-gray-700 gtext-t6 font-weight-medium mt-3">
                Longitude
              </label>
              <v-text-field
              v-model="location.longitude"
              variant="solo"
              density="compact"
              type="number"
              :rules="[rules.required, rules.onlyNumbers]"
              />
            </div>
          </div>
        </v-form>
      </v-card-text>

      <v-card-actions class="d-flex justify-center ga-10 mb-2">
        <v-btn 
        class="closeBtn" 
        variant="plain" 
        @click="$emit('update:modelValue', false)"
        >
          <span class="mdi mdi-close gtext-t1"></span>
        </v-btn>
        <v-btn
        class="rounded-pill gtext-t5 ml-4 submitBtn"
        @click="editLocation" 
        :disabled="!formIsValid"
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
:deep(.v-btn__content){
  font-family: Inter, sans-serif !important;
  font-size: 1.4rem;
  font-style: normal;
  font-weight: 700;
  line-height: 0 !important;
}
:deep(.v-field__input){
  font-family: Inter, sans-serif;
  font-size: 1.4rem;
  line-height: 1rem;
  font-weight: 400;
}
:deep(.v-field){
  border-radius: 16px;
  border: 1px solid #c6c6c6;
  box-shadow: none;
}
.v-input{
  font-family: Inter, sans-serif !important;
  font-size: 1.2rem !important;
  line-height: 1rem !important;
  font-weight: 400 !important;
}
.submitBtn{
    height: 3.4rem;
    padding: 0.6rem 1.8rem;
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

/* Scoped to dialog card's scrollbar */
:deep(.v-dialog::-webkit-scrollbar) {
  width: 60px;
}

:deep(.v-dialog::-webkit-scrollbar-thumb) {
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
}

.v-dialog .v-card::-webkit-scrollbar-track {
  background: transparent;
}

/* Chrome, Safari, Edge, Opera */
:deep(input::-webkit-outer-spin-button),
:deep(input::-webkit-inner-spin-button) {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
:deep(input[type=number]) {
  -moz-appearance: textfield;
}

.fontsize-80{
    font-size: 80px !important;
}
</style>