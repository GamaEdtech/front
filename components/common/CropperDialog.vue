<template>
  <!--Cropper dialog-->

  <v-dialog
    transition="dialog-bottom-transition"
    max-width="600"
    :value="value"
    @input="$emit('input', $event)"
  >
    <v-card id="img-cropper-dialog">
      <v-card-text class="pa-0">
        <v-col v-if="crop_file_loading" cols="12" class="text-center">
          <v-progress-circular
            :size="40"
            :width="4"
            class="mt-12 mb-12"
            color="orange"
            indeterminate
          />
        </v-col>
        <div v-else>
          <cropper
            :src="file_url"
            :stencil-props="stencil_props"
            image-restriction="stencil"
            @change="cropFile"
          />
        </div>
      </v-card-text>
      <v-card-actions
        style="position: sticky; bottom: 0; left: 0; right: 0"
        class="pa-0"
      >
        <v-btn
          dark
          class="primary black--text text-transform-none gtext-t4 font-weight-medium"
          x-large
          :loading="confirm_loading"
          block
          @click="emitFile()"
        >
          Confirm
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!--End cropper dialog-->
</template>

<script>
import "vue-advanced-cropper/dist/style.css";

export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    file_url: {
      type: String,
      default: "",
    },
    stencil_props: {
      type: Object,
      default: () => ({ width: 400, height: 300, resizable: false }),
    },
    confirm_loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      crop_file_loading: false,
      cropped_data: "",
    };
  },
  methods: {
    cropFile({ coordinates, canvas, image }) {
      canvas.toBlob((blob) => {
        this.cropped_data = blob; // Keep the Blob as is (no format conversion)
      }, "image/webp");
    },
    emitFile() {
      this.$emit("croppedData", this.cropped_data);
    },
  },
};
</script>
