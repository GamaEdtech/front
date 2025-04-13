<template>
  <!-- Gallery dialog -->
  <div>
    <v-dialog
      transition="dialog-bottom-transition"
      :value="value"
      @input="$emit('input', $event)"
      :fullscreen="$vuetify.breakpoint.xs"
      max-width="720"
      style="z-index: 20001"
    >
      <v-card>
        <v-card-text class="py-6 py-md-8 px-6 px-md-8">
          <div class="d-flex">
            <div class="gtext-h5 priamry-gray-700">School images</div>
            <v-spacer></v-spacer>
            <v-btn icon
              ><v-icon size="20" @click="$emit('input', false)"
                >mdi-close</v-icon
              ></v-btn
            >
          </div>
          <v-divider class="mb-12 mt-4" />
          <v-row>
            <v-col cols="12" md="7">
              <img
                v-if="mainImage"
                class="schoolDetailsImg"
                :src="mainImage"
                alt="School image"
              />
              <div
                v-else
                class="enter-img-holder pointer"
                @click="galleryDialog = true"
              >
                <div class="text-center">
                  <v-icon size="48" class="primary-gray-300 mb-10"
                    >mdi-panorama-outline</v-icon
                  >
                  <p class="gtext-t4 primary-blue-500">No image</p>
                  <div class="mt-2 gtext-t6 primary-gray-400">
                    Accepted formats: JPG, PNG, WebP
                  </div>
                </div>
              </div>
              <div class="text-center gtext-t5 font-weight-heavy mt-6">
                {{ selectedImageIndex }}/<span class="gray--text">{{
                  images.length
                }}</span>
                <v-chip v-if="pendingUpload" small color="orange" class="ml-2"
                  >Pending upload</v-chip
                >
              </div>
            </v-col>
            <v-col cols="12" md="5">
              <v-row>
                <!-- Pending upload previews -->
                <v-col
                  v-for="(preview, index) in pendingPreviews"
                  :key="`pending-${index}`"
                  cols="3"
                  class="pa-1"
                  @click="handlePreviewSelected(preview, index)"
                >
                  <div class="position-relative">
                    <v-img
                      :src="preview"
                      aspect-ratio="1"
                      class="position-relative rounded pending-thumb"
                      :class="mainImage === preview ? 'primary--border' : ''"
                      cover
                    ></v-img>
                    <div class="pending-badge">
                      <v-icon size="small" color="white"
                        >mdi-cloud-upload-outline</v-icon
                      >
                    </div>
                  </div>
                </v-col>
                <v-col
                  cols="3"
                  class="pa-1 cursor-pointer"
                  v-for="(item, index) in images"
                  :key="`gallery-${index}`"
                  @click="handleSelectedImage(item, index)"
                >
                  <div class="position-relative">
                    <v-img
                      :src="item"
                      aspect-ratio="1"
                      class="position-relative rounded"
                      :class="mainImage === item ? 'primary--border' : ''"
                      cover
                    ></v-img>
                  </div>
                </v-col>

                <v-col
                  cols="4"
                  align="center"
                  justify="center"
                  class="fill-height pl-0"
                >
                  <v-btn
                    color="primary"
                    fab
                    depressed
                    @click="openImgInput"
                    :class="{ 'pulse-animation': images.length === 0 }"
                  >
                    <v-icon size="48"> mdi-plus </v-icon>
                  </v-btn>
                  <div class="mt-2 gtext-t6 primary-gray-400 text-center">
                    JPG, PNG, WebP
                  </div>
                  <v-file-input
                    class="d-none"
                    v-model="imgInput"
                    @change="validateAndOpenCropper"
                    ref="imgInputRef"
                    accept="image/jpeg, image/png, image/jpg, image/webp"
                    hide-details
                    multiple
                  ></v-file-input>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="justify-center pb-13">
          <div class="d-flex flex-column align-center w-100">
            <v-btn
              @click="handleCloseDialog"
              class="primary black--text text-transform-none gtext-t4 font-weight-medium"
              rounded
              width="100%"
              max-width="400"
              x-large
              :loading="saveLoading"
              :disabled="!pendingUpload"
              >{{
                pendingUpload
                  ? Array.isArray(pendingUpload)
                    ? `Upload ${pendingUpload.length} Images & Save`
                    : "Upload & Save"
                  : "Save"
              }}</v-btn
            >
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <cropper-dialog
      @croppedData="croppedData"
      v-model="cropperDialog"
      :file_url="crop_file_url"
      :confirm_loading="crop_confirm_loading"
    />
  </div>

  <!-- End gallery dialog -->
</template>

<script>
import CropperDialog from "@/components/common/CropperDialog.vue";

export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    contentData: Object,
    images: {},
  },
  components: {
    CropperDialog,
  },
  data() {
    return {
      imgInput: null,
      crop_confirm_loading: false,
      crop_file_url: "",
      cropperDialog: false,
      mainImage: null,
      selectedImageIndex: 0,
      pendingUpload: null,
      pendingUploads: [],
      pendingPreviews: [],
      currentCropIndex: 0,
      saveLoading: false,
    };
  },
  methods: {
    handleSelectedImage(row, index) {
      this.mainImage = row;
      this.selectedImageIndex = index + 1;
    },
    handlePreviewSelected(preview, index) {
      this.mainImage = preview;
      this.selectedImageIndex = this.images.length + index + 1;
    },
    handleCloseDialog() {
      // If disabled button was clicked, do nothing
      if (!this.pendingUpload && this.images.length === 0) {
        return;
      }

      if (this.pendingUpload) {
        this.uploadImage();
      } else {
        this.$emit("input", false);
      }
    },
    uploadImage() {
      this.saveLoading = true;

      // Handle either single file or array of files
      const filesToUpload = Array.isArray(this.pendingUpload)
        ? this.pendingUpload
        : [this.pendingUpload];

      // Create an array of promises for each file upload
      const uploadPromises = filesToUpload.map((file) => {
        let formData = new FormData();
        formData.append("File", file);
        formData.append("FileType", "SimpleImage");

        return this.$axios.$post(
          `/api/v2/schools/${this.$route.params.id}/images/SimpleImage`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("v2_token")}`,
            },
          }
        );
      });

      // Wait for all uploads to complete
      Promise.all(uploadPromises)
        .then((responses) => {
          // Collect all new image URLs
          const newImageUrls = responses
            .filter((response) => response && response.url)
            .map((response) => response.url);

          if (newImageUrls.length > 0) {
            // Make a copy of the images array and add the new URLs to the beginning
            const updatedImages = [...newImageUrls, ...this.images];
            this.$emit("update:images", updatedImages);
          }

          // Show success message
          const successCount = newImageUrls.length;
          const totalCount = filesToUpload.length;

          this.$toast.success(
            `Your images have been submitted but need to be reviewed by the community before being shown`,
            {
              containerClass: "toast-dialog-notif",
            }
          );

          // Reset state
          this.pendingUpload = null;
          this.pendingUploads = [];
          this.pendingPreviews = [];
          this.currentCropIndex = 0;

          // Close dialog and refresh gallery
          this.$emit("input", false);
          this.$emit("refresh-gallery");
        })
        .catch((err) => {
          if (err.response?.status == 401 || err.response?.status == 403) {
            this.openAuthDialog("login");
          } else {
            this.$toast.error(err.response?.data?.message || "Upload failed", {
              containerClass: "toast-dialog-notif",
            });
          }
        })
        .finally(() => {
          this.saveLoading = false;
        });
    },
    openImgInput() {
      this.$refs.imgInputRef.$el.querySelector("input").click();
    },
    validateAndOpenCropper(files) {
      if (!files || files.length === 0) return;

      // Reset the pending uploads array
      this.pendingUploads = [];
      this.pendingPreviews = [];
      this.currentCropIndex = 0;

      // Check if we have multiple files
      const filesArray = Array.isArray(files) ? files : [files];

      // Validate all files first
      for (let i = 0; i < filesArray.length; i++) {
        const file = filesArray[i];

        // Check file type
        const validTypes = [
          "image/jpeg",
          "image/png",
          "image/jpg",
          "image/webp",
        ];
        if (!validTypes.includes(file.type)) {
          this.$toast.error(
            `File ${file.name}: Invalid file type. Please use JPG, PNG or WebP images.`,
            {
              containerClass: "toast-dialog-notif",
            }
          );
          continue;
        }

        // Check file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
          this.$toast.error(
            `File ${file.name}: Too large. Maximum size is 5MB.`,
            {
              containerClass: "toast-dialog-notif",
            }
          );
          continue;
        }

        // If file passes validation, add it to pending uploads
        this.pendingUploads.unshift(file);

        // Create and add preview URL
        const previewUrl = URL.createObjectURL(file);
        this.pendingPreviews.unshift(previewUrl);
      }

      // Show the first file as the main preview
      if (this.pendingPreviews.length > 0) {
        this.mainImage = this.pendingPreviews[0];
      }

      // If we have valid files, start the cropping process with the first one
      if (this.pendingUploads.length > 0) {
        this.openCropper(this.pendingUploads[0]);
      } else {
        this.imgInput = null;
      }
    },
    openCropper(file) {
      this.crop_file_url = URL.createObjectURL(file);
      if (this.crop_file_url) this.cropperDialog = true;
    },
    openAuthDialog(val) {
      this.$router.push({ query: { auth_form: val } });
    },
    croppedData(data) {
      const timestamp = new Date().getTime();

      // Determine file type from the cropped data - cropped image is usually in PNG format
      // but we'll respect the original file type if possible
      const originalFile = this.pendingUploads[this.currentCropIndex];
      let fileType = "image/png";
      let fileExt = "png";

      if (originalFile) {
        // Try to get the original file type
        if (
          originalFile.type.includes("jpeg") ||
          originalFile.type.includes("jpg")
        ) {
          fileType = "image/jpeg";
          fileExt = "jpg";
        } else if (originalFile.type.includes("png")) {
          fileType = "image/png";
          fileExt = "png";
        } else if (originalFile.type.includes("webp")) {
          fileType = "image/webp";
          fileExt = "webp";
        }
      }

      const filename = `image_${timestamp}_${this.currentCropIndex}.${fileExt}`;
      const file = new File([data], filename, { type: fileType });

      // Add the cropped file to a collection of files to upload
      if (!this.pendingUpload) {
        this.pendingUpload = [];
      } else if (!Array.isArray(this.pendingUpload)) {
        // Convert to array if it's a single file
        this.pendingUpload = [this.pendingUpload];
      }

      // Add the newly cropped file
      this.pendingUpload.unshift(file);

      // Move to the next file if there are more files to crop
      this.currentCropIndex++;

      if (this.currentCropIndex < this.pendingUploads.length) {
        // Process the next file
        this.openCropper(this.pendingUploads[this.currentCropIndex]);
      } else {
        // We're done cropping all files
        this.cropperDialog = false;
        const fileCount = this.pendingUpload.length;
        this.$toast.info(
          `${fileCount} ${
            fileCount === 1 ? "image" : "images"
          } ready to upload. Click Save to complete the upload.`,
          {
            containerClass: "toast-dialog-notif",
          }
        );
      }
    },
  },
  watch: {
    images(newValue) {
      if (newValue.length >= 1) {
        this.mainImage = newValue[0];
        this.selectedImageIndex = 1;
      }
    },
  },
  mounted() {
    // Initialize selected image if images exist
    if (this.images && this.images.length > 0) {
      this.mainImage = this.images[0];
      this.selectedImageIndex = 1;
    }
  },
};
</script>

<style scoped>
.schoolDetailsImg {
  height: 28.1rem;
  max-height: 28.1rem;
  width: 100%;
  border-radius: 0.6rem;
}

.schoolThumbImg {
  width: 100%;
  height: 6.4247rem;
  max-height: 6.4247rem;
  border-radius: 0.4rem;
}

.enter-img-holder {
  background: #f2f4f7;
  height: 28.1rem;
  width: 100%;
  border-radius: 0.6rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pulse-animation {
  animation: pulse 1.5s infinite;
}

.pending-thumb {
  filter: blur(1px);
  opacity: 0.8;
  transition: all 0.3s ease;
}

.pending-thumb:hover {
  filter: blur(0);
  opacity: 1;
}

.pending-badge {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(var(--v-primary-base), 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(var(--v-primary-base), 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(var(--v-primary-base), 0);
  }
}
</style>
