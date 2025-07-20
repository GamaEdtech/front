<template>
  <div class="d-flex align-center mt-11 mb-9">
    <div class="gtext-h5 gtext-md-h5 primary-gray-600">Tuition fee</div>
    <v-spacer />
    <div class="gtext-t2 font-weight-heavy primary-gray-800">
      <span v-if="contentData.tuition && !isEditMode">
        <span class="gtext-t6">$</span>
        {{ contentData.tuition.toLocaleString() }}
      </span>
      <span
        v-if="!contentData.tuition && !isEditMode"
        @click="handleEdit"
        class="gtext-t4 primary-blue-500 align-self-center pointer"
      >
        Contribute
      </span>
      <template v-if="!isEditMode && contentData.tuition">
        <v-btn
          @click="handleEdit"
          class="ml-2"
          icon
          color="blue-grey"
          variant="text"
        >
          <v-icon size="large"> mdi-pencil </v-icon>
        </v-btn>
      </template>
      <v-text-field
        :rules="tuitionRule"
        v-model="tuitionFee"
        v-if="isEditMode"
        width="250"
        placeholder="Tuition fee"
        variant="underlined"
        type="number"
        hide-spin-buttons
        prepend-inner-icon="mdi-currency-usd"
      >
        <template #append>
          <v-btn
            :loading="submitLoader"
            color="success"
            @click="handleUpdate"
            variant="flat"
            width="30"
            height="30"
            icon
          >
            <v-icon size="large"> mdi-check </v-icon>
          </v-btn>
        </template>
      </v-text-field>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  contentData: {
    type: Object,
    required: true,
  },
});
const nuxtApp = useNuxtApp();
const route = useRoute();

const isEditMode = ref(false);
const submitLoader = ref(false);
const tuitionFee = ref(0);
const tuitionRule = [
  (v) => !!v || "Tuition fee is required",
  (v) => /^\d+$/.test(v) || "Please enter only numbers",
];

const handleEdit = () => {
  tuitionFee.value = props.contentData.tuition ? props.contentData.tuition : 0;
  isEditMode.value = true;
};

function isValid(value) {
  return /^\d+$/.test(value);
}
const handleUpdate = () => {
  let formData = {};
  if (!isValid(tuitionFee.value)) {
    nuxtApp.$toast?.error("Please enter a valid Tuition Fee");
    return;
  }
  formData = { tuition: tuitionFee.value ?? null };
  submitLoader.value = true;

  useApiService
    .post(`/api/v2/schools/${route.params.id}/contributions`, formData)
    .then(async (response) => {
      if (response.succeeded) {
        nuxtApp.$toast?.success(
          "Your contribution has been successfully submitted"
        );
        props.contentData.tuition = Number(tuitionFee.value);
      } else {
        nuxtApp.$toast?.error(response?.errors[0]?.message);
      }
    })
    .catch((err) => {
      console.log("err", err);

      if (err?.response?.status == 401 || err?.response?.status == 403) {
      } else nuxtApp.$toast?.error(err?.response?.data?.message);
    })
    .finally(() => {
      isEditMode.value = false;
      submitLoader.value = false;
    });
};
</script>
