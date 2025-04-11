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
                    Accepted formats: JPG, PNG
                  </div>
                </div>
              </div>
              <div class="text-center gtext-t5 font-weight-heavy mt-6">
                {{ selectedImageIndex }}/<span class="gray--text">{{
                  images.length
                }}</span>
              </div>
            </v-col>
            <v-col cols="12" md="5">
              <v-row>
                <v-col
                  v-if="contentData.pic"
                  cols="4"
                  class="pl-0 cursor-pointer"
                  v-for="(item, index) in images"
                  :key="item"
                  @click="handleSelectedImage(item, index)"
                >
                  <img
                    class="schoolThumbImg w-100 w-full rounded cursor-pointer"
                    :src="item"
                    alt="School image"
                  />
                </v-col>
                <v-col
                  cols="4"
                  align="center"
                  justify="center"
                  class="fill-height pl-0"
                >
                  <v-btn color="primary" fab depressed @click="openImgInput">
                    <v-icon size="48"> mdi-plus </v-icon>
                  </v-btn>
                  <div class="mt-2 gtext-t6 primary-gray-400 text-center">
                    JPG, PNG
                  </div>
                  <v-file-input
                    class="d-none"
                    v-model="imgInput"
                    @change="validateAndOpenCropper"
                    ref="imgInputRef"
                    accept="image/jpeg, image/png, image/jpg"
                    hide-details
                  ></v-file-input>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="justify-center pb-13">
          <v-btn
            @click="handleCloseDialog"
            class="primary black--text text-transform-none gtext-t4 font-weight-medium"
            rounded
            width="100%"
            max-width="400"
            x-large
            >Save</v-btn
          >
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
    };
  },
  methods: {
    handleSelectedImage(row, index) {
      this.mainImage = row;
      this.selectedImageIndex = index + 1;
    },
    handleCloseDialog() {
      this.$emit("input", false);
    },
    openImgInput() {
      this.$refs.imgInputRef.$el.querySelector("input").click();
    },
    validateAndOpenCropper(file) {
      if (!file) return;

      // Check file type
      const validTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        this.$toast.error("Invalid file type. Please use JPG or PNG images.", {
          containerClass: "toast-dialog-notif",
        });
        this.imgInput = null;
        return;
      }

      // Check file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        this.$toast.error("File too large. Maximum size is 5MB.", {
          containerClass: "toast-dialog-notif",
        });
        this.imgInput = null;
        return;
      }

      // If validation passes, open the cropper
      this.openCropper();
    },
    openCropper() {
      var file = this.imgInput;
      this.crop_file_url = URL.createObjectURL(file);
      if (this.crop_file_url) this.cropperDialog = true;
    },
    openAuthDialog(val) {
      this.$router.push({ query: { auth_form: val } });
    },
    croppedData(data) {
      this.crop_confirm_loading = true;
      let formData = new FormData();
      formData.append("File", data);
      formData.append("FileType", "SimpleImage");
      this.$axios
        .$post(
          `/api/v2/schools/${this.$route.params.id}/images/SimpleImage`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("v2_token")}`,
            },
          }
        )
        .then((response) => {
          // let file = response.data[0].file.name;
          //push to image array here
          this.$toast.success(
            "Your contribution has been successfully submitted",
            {
              containerClass: "toast-dialog-notif",
            }
          );
          this.cropperDialog = false;
        })
        .catch((err) => {
          if (err.response?.status == 401 || err.response?.status == 403) {
            this.openAuthDialog("login");
          } else
            this.$toast.error(err.response.data.message, {
              containerClass: "toast-dialog-notif",
            });
        })
        .finally(() => {
          this.crop_confirm_loading = false;
        });
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
  mounted() {},
};
</script>

<style scoped>
.schoolDetailsImg {
  height: 28.1rem;
  max-height: 28.1rem;
  width: 100%;
  border-radius: 0.6rem;
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
</style>
