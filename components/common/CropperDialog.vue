<template>
  <v-dialog
    v-model="dialogVisible"
    transition="dialog-bottom-transition"
    max-width="600"
  >
    <v-card id="img-cropper-dialog" color="light-green-darken-3">
      <v-card-actions class="pa-0">
        <v-btn
          color="light-green-darken-3"
          class="black--text text-transform-none gtext-t4 font-weight-medium"
          size="x-large"
          :loading="confirm_loading"
          block
          variant="flat"
          @click="emitFile()"
        >
          Confirm
        </v-btn>
      </v-card-actions>
      <ClientOnly>
        <Cropper
          :src="file_url"
          :stencil-props="stencil_props"
          image-restriction="stencil"
          @change="cropFile"
        />
      </ClientOnly>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from "vue";
import "vue-advanced-cropper/dist/style.css";
import { Cropper } from "vue-advanced-cropper";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  file_url: {
    type: String,
    default: "",
  },
  stencil_props: {
    type: Object,
    default: () => ({ width: 400, height: 150, resizable: false }),
  },
  confirm_loading: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["update:modelValue", "croppedData"]);

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const crop_file_loading = ref(false);
const cropped_data = ref(null);

function cropFile({ coordinates, canvas, image }) {
  if (!canvas) return;
  crop_file_loading.value = true;
  canvas.toBlob((blob) => {
    cropped_data.value = blob;
    crop_file_loading.value = false;
  }, "image/webp");
}

function emitFile() {
  emit("croppedData", cropped_data.value);
}
</script>
