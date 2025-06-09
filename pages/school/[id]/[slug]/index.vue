<template>
  <v-container id="school-details">
    <v-row class="d-flex d-md-none">
      <div class="top-slide-container">
        <img
          v-if="contentData.pic"
          class="schoolDetailsImg"
          :class="topSlideClass.image"
          @click="openGalleryDialog"
          :src="contentData.pic"
          alt="School image"
        />
        <div
          v-else
          class="enter-img-holder pointer"
          :class="topSlideClass.image"
          @click="openGalleryDialog"
        >
          <div class="text-center">
            <v-icon
              :size="display.mdAndUp.value ? 48 : 24"
              class="primary-gray-300 mb-2 mb-md-10"
              >mdi-panorama-outline</v-icon
            >
            <div class="gtext-t6 gtext-md-t4 primary-blue-500">Contribute</div>
          </div>
        </div>
        <client-only>
          <l-map
            ref="schoolMap"
            :zoom="map.zoom"
            :min-zoom="map.minZoom"
            :center="map.center"
            :class="topSlideClass.map"
            @click="showSelectLocationDialog = true"
            id="schoolDetailsMap"
          >
            <l-tile-layer :url="map.url"></l-tile-layer>
            <l-marker :lat-lng="map.latLng">
              <LIcon
                icon-url="/images/school-marker.png"
                :icon-size="[64, 64]"
                :icon-anchor="[16, 32]"
              ></LIcon>
            </l-marker>
          </l-map>
        </client-only>

        <div
          class="position-relative under-image-right"
          v-if="contentData.tour && !tourImgPreview"
        >
          <img
            @click="openTourImgInput"
            class="pointer schoolDetailsImg"
            :src="contentData.tour"
            alt="School image Preview"
          />

          <div class="upload-overlay">
            <v-btn
              @click="openTourImgInput"
              class=""
              icon
              color="white"
              variant="text"
            >
              <v-icon size="large"> mdi-pencil </v-icon>
            </v-btn>
          </div>
        </div>
        <div
          v-else-if="tourImgPreview"
          class="position-relative"
          :class="topSlideClass.tour"
        >
          <img
            class="pointer schoolDetailsImg"
            :src="tourImgPreview"
            alt="School image Preview"
          />
          <div class="upload-overlay">
            <v-btn
              color="primary"
              small
              fab
              @click="uploadTourImage"
              :loading="loading.uploadTour"
              class="text-transform-none gtext-t6 font-weight-medium"
            >
              <v-icon small>mdi-cloud-upload</v-icon>
            </v-btn>
            <v-btn
              color="error"
              small
              fab
              @click="clearTourImage"
              class="text-transform-none gtext-t6 font-weight-medium ml-sm-1"
            >
              <v-icon small>mdi-delete</v-icon>
            </v-btn>
          </div>
        </div>
        <div
          v-else
          class="enter-img-holder pointer"
          :class="topSlideClass.tour"
          @click="openTourImgInput"
        >
          <div class="text-center">
            <v-icon
              :size="display.mdAndUp.value ? 48 : 24"
              class="primary-gray-300 mb-2 mb-md-10"
              >mdi-rotate-360</v-icon
            >
            <div class="gtext-t6 gtext-md-t4 primary-blue-500">Contribute</div>
          </div>
        </div>

        <div
          v-if="galleryImages && galleryImages.length > 0"
          :class="topSlideClass.image"
        >
          <v-carousel
            hide-delimiters
            show-arrows-on-hover
            height="26.4rem"
            class="gallery-carousel"
            cycle
            interval="3000"
            @click="openGalleryDialog"
            v-model="activeGalleryIndex"
            @change="updateMainGalleryImage"
          >
            <v-carousel-item
              v-for="(image, index) in galleryImages"
              :key="index"
              :src="image?.fileUri"
              eager
              cover
              class="pointer"
              @click="openGalleryDialog"
            >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular
                    indeterminate
                    color="primary"
                  ></v-progress-circular>
                </v-row>
              </template>
            </v-carousel-item>
          </v-carousel>
        </div>
        <div
          v-else
          class="enter-img-holder pointer"
          :class="topSlideClass.image"
          @click="openGalleryDialog"
        >
          <div class="text-center">
            <v-icon
              :size="display.mdAndUp.value ? 48 : 24"
              class="primary-gray-300 mb-2 mb-md-10"
              >mdi-panorama-outline</v-icon
            >
            <div class="gtext-t6 gtext-md-t4 primary-blue-500">Contribute</div>
          </div>
        </div>
      </div>
    </v-row>

    <v-row class="d-none d-md-flex mt-15">
      <v-col cols="12" md="4">
        <div v-if="galleryImages && galleryImages.length > 0">
          <v-carousel
            hide-delimiters
            show-arrows="hover"
            height="28.1rem"
            class="rounded-lg gallery-carousel"
            @click="openGalleryDialog"
            v-model="activeGalleryIndex"
            @change="updateMainGalleryImage"
          >
            <v-carousel-item
              v-for="(image, index) in galleryImages"
              :key="index"
              :src="image.fileUri"
              eager
              cover
              class="pointer"
              @click="openGalleryDialog"
            >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular
                    indeterminate
                    color="primary"
                  ></v-progress-circular>
                </v-row>
              </template>
            </v-carousel-item>
          </v-carousel>
        </div>
        <div v-else class="enter-img-holder pointer" @click="openGalleryDialog">
          <div class="text-center">
            <v-icon size="48" class="primary-gray-300 mb-10"
              >mdi-panorama-outline</v-icon
            >
            <p class="gtext-t4 primary-blue-500">Contribute</p>
            <div class="mt-2 gtext-t6 primary-gray-400">
              Accepted formats: JPG, PNG, WebP
            </div>
          </div>
        </div>
      </v-col>
      <v-col cols="12" md="4">
        <client-only>
          <l-map
            ref="schoolMap"
            :zoom="map.zoom"
            :min-zoom="map.minZoom"
            :center="map.center"
            id="schoolDetailsMap"
            @click="openLocationDialog"
          >
            <l-tile-layer :url="map.url"></l-tile-layer>
            <l-marker :lat-lng="map.latLng">
              <LIcon
                icon-url="/images/school-marker.png"
                :icon-size="[64, 64]"
                :icon-anchor="[16, 32]"
              ></LIcon>
            </l-marker>
          </l-map>
        </client-only>
      </v-col>
      <v-col cols="12" md="4">
        <template v-if="contentData.tour && !tourImgPreview">
          <div class="position-relative">
            <img
              class="pointer schoolDetailsImg"
              :src="contentData.tour"
              alt="School image Preview"
            />
            <div class="upload-overlay px-3">
              <div class="px-3 d-flex justify-center align-center">
                <v-btn
                  @click="openTourImgInput"
                  class=""
                  icon
                  color="white"
                  variant="text"
                >
                  <v-icon size="large"> mdi-pencil </v-icon>
                </v-btn>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <template v-if="tourImgPreview">
            <div class="position-relative">
              <img
                class="pointer schoolDetailsImg"
                :src="tourImgPreview"
                alt="School image Preview"
              />
              <div class="upload-overlay px-3">
                <div class="px-3 d-flex justify-center align-center">
                  <v-btn
                    small
                    fab
                    color="primary"
                    @click="uploadTourImage"
                    :loading="loading.uploadTour"
                    class="text-transform-none gtext-t4 font-weight-medium mr-3"
                  >
                    <v-icon small>mdi-cloud-upload</v-icon>
                    <!-- Upload Tour Image -->
                  </v-btn>
                  <v-btn
                    small
                    fab
                    color="error"
                    @click="clearTourImage"
                    class="text-transform-none gtext-t4 font-weight-medium"
                  >
                    <v-icon small>mdi-delete</v-icon>
                    <!-- Delete -->
                  </v-btn>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="enter-img-holder pointer" @click="openTourImgInput">
              <div class="text-center">
                <v-icon size="48" class="primary-gray-300 mb-10"
                  >mdi-rotate-360</v-icon
                >
                <div class="gtext-t4 primary-blue-500">Contribute</div>
                <div class="mt-2 gtext-t6 primary-gray-400">
                  Accepted formats: JPG, PNG, WebP
                </div>
              </div>
            </div>
          </template>
        </template>

        <v-file-input
          class="d-none"
          v-model="tourImg"
          ref="tourImgRef"
          accept="image/jpeg, image/png, image/jpg, image/webp"
          hide-details
          @change="validateAndProcessImage"
        ></v-file-input>
      </v-col>
    </v-row>

    <!-- Data container -->
    <v-row class="data-container">
      <v-col cols="12">
        <v-row class="mt-6 d-flex d-md-none">
          <v-col cols="3" class="text-left d-block d-md-none">
            <div class="text-center">
              <div class="gama-text-body2 primary-gray-500 pt-1">
                <v-icon small>mdi-update</v-icon>
                {{ $dayjs(contentData.up_date).format("YY/MM/DD") }}
              </div>
            </div>
          </v-col>
          <v-col cols="6" class="text-center d-block d-md-none">
            <v-btn-toggle
              style="order: 2"
              v-model="slideToggler"
              rounded
              active-class="bg-white"
              @change="changeSlide"
            >
              <v-btn small class="text-transform-none gtext-t5" value="image">
                Image
              </v-btn>
              <v-btn small class="text-transform-none gtext-t5" value="map">
                Map
              </v-btn>
              <v-btn small class="text-transform-none gtext-t5" value="tour">
                Tour
              </v-btn>
            </v-btn-toggle>
          </v-col>
          <v-col cols="3" class="text-right d-block d-md-none">
            <div class="rate-section gtext-t4 font-weight-semibold ml-1">
              {{
                ratingData.averageRate
                  ? ratingData.averageRate.toFixed(1)
                  : "New"
              }}
              <v-icon size="20" color="primary"> mdi-star </v-icon>
            </div>
          </v-col>
        </v-row>

        <!-- General data section -->
        <v-row>
          <v-col cols="11" md="8">
            <common-school-title :content="contentData" />
          </v-col>
          <v-col cols="1" md="4">
            <div class="float-right d-flex align-center mt-1">
              <span class="mr-3">
                <v-icon
                  @click="reportDialog = true"
                  size="20"
                  color="primary"
                  plain
                  class=""
                  >mdi-alert-circle-outline</v-icon
                >
              </span>
              <v-icon size="20" class="primary-gray-300">mdi-heart</v-icon>

              <div
                class="d-none d-md-block rate-section gtext-t4 font-weight-semibold ml-4"
              >
                <!-- {{ contentData.score ? contentData.score : "New" }} -->
                {{
                  ratingData.averageRate
                    ? ratingData.averageRate.toFixed(1)
                    : "New"
                }}
                <v-icon size="20" color="primary"> mdi-star </v-icon>
              </div>
            </div>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" md="8">
            <SchoolChips :contentData="contentData" />
            <TuitionInfo :contentData="contentData" />
            <Facilities
              :facilities="contentData.tags"
              @open-auth-dialog="openAuthDialog"
              @facilities-updated="refreshSchoolData"
            />
          </v-col>
          <v-col cols="12" md="4" id="main-info-section">
            <common-school-main-info :content="contentData" />
          </v-col>
        </v-row>

        <!-- End general data section -->

        <!-- Users score -->
        <UsersScore
          :ratingData="ratingData"
          @leave-comment="showLeaveCommentDialog = true"
        />
        <!-- End users score -->

        <!-- Recent comments -->
        <RecentComments :commentList="commentList" />
        <!-- End recent comments -->

        <!-- Similar schools -->
        <SimilarSchools :similarSchools="similarSchools" />
        <!-- End similar schools -->
      </v-col>
    </v-row>
    <!-- End data container -->

    <!-- Leave comment dialog -->
    <LeaveCommentDialog
      v-model="showLeaveCommentDialog"
      :contentData="contentData"
    />
    <!-- End leave comment dialog -->

    <gallery-dialog
      v-model="showGalleryDialog"
      :contentData="contentData"
      :images="galleryImages"
      @refresh-gallery="loadGalleryImages"
    />

    <!-- Select Location dialog -->
    <SelectLocationDialog
      v-model="showSelectLocationDialog"
      :contentData="contentData"
      :map="map"
      :mapSubmitLoader="mapSubmitLoader"
      @update="handleSelectLocationUpdate"
      @locationSelected="goToSearchLocation"
    />
    <!-- End select location dialog -->

    <!-- Report School Issue Dialog -->
    <ReportDialog
      v-model="reportDialog"
      :school-id="$route.params.id"
      @open-auth-dialog="openAuthDialog"
    />
    <!-- End Report School Issue Dialog -->
  </v-container>
</template>

<script setup>
import GalleryDialog from "@/components/school/GalleryDialog.vue";
import ReportDialog from "@/components/school/ReportDialog.vue";
import Facilities from "@/components/school/detail/Facilities.vue";
import { useDisplay } from "vuetify/lib/composables/display";
import SelectLocationDialog from "@/components/common/SelectLocationDialog.vue";
import LeaveCommentDialog from "@/components/common/LeaveCommentDialog.vue";
import UsersScore from "@/components/common/UsersScore.vue";
import RecentComments from "@/components/common/RecentComments.vue";
import SimilarSchools from "@/components/common/SimilarSchools.vue";
import TuitionInfo from "@/components/common/TuitionInfo.vue";
import SchoolChips from "@/components/common/SchoolChips.vue";

const nuxtApp = useNuxtApp();
const route = useRoute();
const router = useRouter();
const display = useDisplay();
const map = reactive({
  url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  zoom: 10,
  minZoom: 2,
  center: [0, 0],
  latLng: [0, 0],
  object: null,
  boundingBox: {},
  schoolIcon: null,
});
const tourImgPreview = ref(null);
const galleryImages = ref([]);
const activeGalleryIndex = ref(0);
const tourPanoramas = ref([]);
const form = reactive({
  web: "",
  email: "",
  phone: "",
  address: "",
  name: "",
});
const mapMarkerData = ref({});
const slideToggler = ref("map");
const topSlideClass = reactive({
  image: "under-image-left",
  map: "center-image",
  tour: "under-image-right",
});
const showLeaveCommentDialog = ref(false);
const showGalleryDialog = ref(false);

const showSelectLocationDialog = ref(false);
const tourImg = ref(null);
const loading = reactive({ uploadTour: false });
const mapSubmitLoader = ref(false);
const addressSubmitLoader = ref(false);
const webSubmitLoader = ref(false);
const emailSubmitLoader = ref(false);
const phoneSubmitLoader = ref(false);
const nameSubmitLoader = ref(false);
const commentList = ref([]);
const generalDataEditMode = reactive({
  website: false,
  email: false,
  phone1: false,
  address: false,
  map: false,
  name: false,
});
const reportDialog = ref(false);
const contentData = ref({});
const ratingData = ref({});
const similarSchools = [];

// Data fetching
const { data: contentDataRaw } = await useAsyncData("contentData", () =>
  $fetch(`/api/v2/schools/${route.params.id}`)
);
const { data: ratingDataRaw } = await useAsyncData("ratingData", () =>
  $fetch(`/api/v2/schools/${route.params.id}/rate`)
);
if (contentDataRaw.value?.succeeded) {
  contentData.value = contentDataRaw.value.data;
}
if (ratingDataRaw.value?.succeeded) {
  ratingData.value = ratingDataRaw.value.data;
}

function openGalleryDialog() {
  if (galleryImages.value && galleryImages.value.length > 0) {
    const currentIndex = activeGalleryIndex.value;
    if (currentIndex >= 0 && currentIndex < galleryImages.value.length) {
      contentData.value.pic = galleryImages.value[currentIndex];
    }
  }
  showGalleryDialog.value = true;
}
function updateMainGalleryImage(index) {
  activeGalleryIndex.value = index;
  if (galleryImages.value && galleryImages.value.length > index) {
    contentData.value.pic = galleryImages.value[index];
  }
}
function refreshTourContent() {
  const currentTour = contentData.value.tour;
  contentData.value.tour = null;
  nextTick(() => {
    contentData.value.tour = currentTour;
  });
}

function changeSlide() {
  if (slideToggler.value == "map") {
    topSlideClass.image = "under-image-left";
    topSlideClass.map = "center-image";
    topSlideClass.tour = "under-image-right";
  } else if (slideToggler.value == "image") {
    topSlideClass.image = "center-image";
    topSlideClass.map = "under-image-right";
    topSlideClass.tour = "under-image-left";
  } else if (slideToggler.value == "tour") {
    topSlideClass.image = "under-image-right";
    topSlideClass.map = "under-image-left";
    topSlideClass.tour = "center-image";
  }
}

function openLocationDialog() {
  showSelectLocationDialog.value = true;
  setTimeout(() => {
    // Implement with template refs if needed
    window.dispatchEvent(new Event("resize"));
  }, 500);
}
const tourImgRef = ref(null);

function openTourImgInput() {
  if (tourImgRef.value) {
    tourImgRef.value.click();
  }
}
function validateAndProcessImage(file) {
  if (!file) return;
  const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (!validTypes.includes(file.type)) {
    nuxtApp.$toast?.error(
      "Invalid file type. Please use JPG, PNG or WebP images."
    );
    tourImg.value = null;
    return;
  }
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    nuxtApp.$toast?.error("File too large. Maximum size is 5MB.");
    tourImg.value = null;
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    tourImgPreview.value = e.target.result;
  };
  reader.readAsDataURL(file);
}
function uploadTourImage() {
  if (!tourImg.value) {
    nuxtApp.$toast?.error("Please select an image to upload");
    return;
  }
  const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (!validTypes.includes(tourImg.value.type)) {
    nuxtApp.$toast?.error(
      "Invalid file type. Please use JPG, PNG or WebP images."
    );
    return;
  }
  loading.uploadTour = true;
  let formData = new FormData();
  formData.append("File", tourImg.value);
  formData.append("FileType", "Tour360");
  $fetch(`/api/v2/schools/${route.params.id}/images/Tour360`, {
    method: "POST",
    body: formData,
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("v2_token")}`,
    },
  })
    .then(() => {
      nuxtApp.$toast?.success(
        "Your 360° tour image has been successfully uploaded"
      );
      // Reload tour panorama
      tourImg.value = null;
      tourImgPreview.value = null;
      setTimeout(() => {
        refreshTourContent();
        // Optionally change slide
      }, 500);
    })
    .catch((err) => {
      if (err?.response?.status == 401 || err?.response?.status == 403) {
        openAuthDialog("login");
      } else {
        nuxtApp.$toast?.error(err?.response?.data?.message || "Upload failed");
      }
    })
    .finally(() => {
      loading.uploadTour = false;
    });
}
function clearTourImage() {
  tourImg.value = null;
  tourImgPreview.value = null;
  nuxtApp.$toast?.info("Image removed");
}
function isValidUrl(url) {
  try {
    new URL(url);
    return /^https?:\/\//.test(url);
  } catch (e) {
    return false;
  }
}
function isValidEmail(email) {
  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  } catch (e) {
    return false;
  }
}

function isRequired(value) {
  try {
    return !!value.trim();
  } catch (e) {
    return false;
  }
}
function openAuthDialog(val) {
  router.push({ query: { auth_form: val } });
}
function loadComments() {
  $fetch(`/api/v2/schools/${route.params.id}/comments`, {
    params: {
      "PagingDto.PageFilter.Size": 20,
    },
  })
    .then((response) => {
      commentList.value = response.data.list;
    })
    .catch(() => {});
}
function loadGalleryImages() {
  $fetch(`/api/v2/schools/${route.params.id}/images/SimpleImage`)
    .then((response) => {
      galleryImages.value = [...response.data].reverse();
      if (galleryImages.value.length >= 1) {
        contentData.value.pic = galleryImages.value[0].fileUri;
      } else {
        contentData.value.pic = null;
      }
    })
    .catch(() => {});
}
function loadTourPanorama() {
  $fetch(`/api/v2/schools/${route.params.id}/images/Tour360`)
    .then((response) => {
      tourPanoramas.value = response.data;
      if (tourPanoramas.value.length >= 1) {
        contentData.value.tour =
          tourPanoramas.value[tourPanoramas.value.length - 1].fileUri;
      } else {
        contentData.value.tour = null;
      }
    })
    .catch(() => {});
}
function updateGeneralInfo(value) {
  let formData = {};
  if (value == "website") {
    if (!isValidUrl(form.web)) {
      nuxtApp.$toast?.error("Please enter a valid website URL");
      return;
    }
    generalDataEditMode.website = false;
    formData = { webSite: form.web ?? null };
  }
  if (value == "email") {
    if (!isValidEmail(form.email)) {
      nuxtApp.$toast?.error("Please enter a valid Email");
      return;
    }
    generalDataEditMode.email = false;
    formData = { email: form.email ?? null };
  }
  if (value == "phone") {
    if (!isRequired(form.phone)) {
      nuxtApp.$toast?.error("Please enter a valid Phone Number");
      return;
    }
    generalDataEditMode.phone1 = false;
    formData = { phoneNumber: form.phone ?? null };
  }
  if (value == "address") {
    if (!isRequired(form.address)) {
      nuxtApp.$toast?.error(
        "Please enter a valid address (minimum 10 characters)"
      );
      return;
    }
    generalDataEditMode.address = false;
    formData = { address: form.address ?? null };
  }
  if (value == "name") {
    if (!isRequired(form.name)) {
      nuxtApp.$toast?.error("Please enter a valid Name");
      return;
    }
    generalDataEditMode.name = false;
    formData = { name: form.name ?? null };
  }
  if (value == "map") {
    generalDataEditMode.map = false;
    formData = {
      latitude: mapMarkerData.value.lat,
      longitude: mapMarkerData.value.lng,
    };
  }
  let loaderRef = {
    website: webSubmitLoader,
    email: emailSubmitLoader,
    phone: phoneSubmitLoader,
    address: addressSubmitLoader,
    name: nameSubmitLoader,
    map: mapSubmitLoader,
  }[value];
  if (loaderRef) loaderRef.value = true;
  $fetch(`/api/v2/schools/${route.params.id}/contributions`, {
    method: "POST",
    body: formData,
    headers: { Authorization: `Bearer ${localStorage.getItem("v2_token")}` },
  })
    .then(async (response) => {
      if (response.succeeded) {
        switch (value) {
          case "name":
            contentData.value.name = form.name;
            break;
          case "website":
            contentData.value.webSite = form.web;
            break;
          case "phone":
            contentData.value.phoneNumber = form.phone;
            break;
          case "address":
            contentData.value.address = form.address;
            break;
          case "email":
            contentData.value.email = form.email;
            break;
          default:
            break;
        }
        nuxtApp.$toast?.success(
          "Your contribution has been successfully submitted"
        );
      } else {
        nuxtApp.$toast?.error(response?.errors[0]?.message);
      }
    })
    .catch((err) => {
      if (err?.response?.status == 401 || err?.response?.status == 403) {
        openAuthDialog("login");
      } else nuxtApp.$toast?.error(err?.response?.data?.message);
    })
    .finally(() => {
      form.web = null;
      form.email = null;
      form.phone = null;
      form.address = null;
      form.name = null;
      mapSubmitLoader.value = false;
      showSelectLocationDialog.value = false;
      webSubmitLoader.value = false;
      emailSubmitLoader.value = false;
      phoneSubmitLoader.value = false;
      addressSubmitLoader.value = false;
      nameSubmitLoader.value = false;
    });
}
function refreshSchoolData() {}

onMounted(() => {
  if (contentData.value.latitude && contentData.value.longitude) {
    map.center = [contentData.value.latitude, contentData.value.longitude];
    map.latLng = [contentData.value.latitude, contentData.value.longitude];
  }
  loadComments();
  loadGalleryImages();
  loadTourPanorama();
});

function handleSelectLocationUpdate(payload) {
  updateGeneralInfo("map");
}
</script>

<style scoped>
.top-slide-container {
  position: fixed;
  margin-top: 5.4rem;
  margin-bottom: 2rem;
  width: 100vw;
  height: 26.4rem;
  max-height: 26.4rem;
  overflow: hidden;
  z-index: 0;
}

.position-relative {
  position: relative;
}

.upload-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 0.6rem;
  padding: 1rem;
}

@media (max-width: 600px) {
  .upload-overlay {
    flex-direction: column;
  }

  .upload-overlay .v-btn {
    margin: 0.25rem 0;
    flex-shrink: 0;
  }

  .upload-overlay .v-icon {
    font-size: 1.2rem !important;
  }
}

.data-container {
  position: relative;
  z-index: 1;
  margin-top: 30rem;
  background: #fff;
  border-top-left-radius: 3.2rem;
  border-top-right-radius: 3.2rem;
}

.center-image {
  position: absolute;
  top: 0;
  left: 0 !important;
  margin: auto;
  z-index: 3;
  right: 0 !important;
  width: 70% !important;
  max-height: 26.4rem;
  overflow: hidden;
  opacity: 1;
  transition: opacity 0.5s ease-in-out;
}

.center-image.enter-img-holder,
.center-image.position-relative {
  border-right: 1px solid white;
  border-left: 1px solid white;
}

.under-image-left,
.under-image-right {
  position: absolute;
  top: 0;
  max-height: 26.4rem;
  width: 80% !important;
}

.under-image-left {
  left: -32%;
  z-index: 1;
}

.under-image-left.enter-img-holder p,
.under-image-left.position-relative p {
  max-width: 2rem;
}

.under-image-right {
  right: -32%;
  z-index: 2;
}

.under-image-right.enter-img-holder p,
.under-image-right.position-relative p {
  max-width: 2rem;
}

#schoolDetailsVr {
  height: 28.1rem;
  max-height: 28.1rem;
  width: 100%;
}

#schoolDetailsVr .a-canvas {
  border-radius: 0.6rem !important;
}

#schoolDetailsMap {
  border-radius: 0.6rem;
  height: 28.1rem;
  max-height: 28.1rem;
  width: 100%;
}

@media (min-width: 960px) {
  .data-container {
    margin-top: 1rem;
  }

  .chips-container {
    white-space: normal;
    width: 80%;
  }
}

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

.gallery-carousel {
  border-radius: 0.6rem;
  cursor: pointer;
}

/* Target the carousel navigation arrows */
.gallery-carousel .v-window__prev,
.gallery-carousel .v-window__next {
  z-index: 10;
}
</style>
