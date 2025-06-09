<template>
  <v-container id="school-details">
    <v-row class="d-flex d-md-none">
      <div class="top-slide-container">
        <client-only>
          <school-detail-school-map
            :content="contentData"
            :class="topSlideClass.map"
          ></school-detail-school-map>
        </client-only>
        <school-detail-school-tour
          :class="topSlideClass.tour"
          :content="contentData"
        ></school-detail-school-tour>
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
        <school-detail-school-map
          :content="contentData"
        ></school-detail-school-map>
      </v-col>
      <v-col cols="12" md="4">
        <school-detail-school-tour
          :content="contentData"
          @fetch="loadTourPanorama"
        ></school-detail-school-tour>
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
              size="x-small"
              v-model="slideToggler"
              rounded="xl"
              color="white"
              base-color="grey-lighten-3"
              selected-class="bg-white"
              active-class="bg-white"
              @update:modelValue="changeSlide"
              class="school-head-toggle"
              border
            >
              <v-btn
                color="white"
                size="x-small"
                class="text-transform-none gtext-t5 text-white"
                value="image"
              >
                <span class="text-black"> Image</span>
              </v-btn>
              <v-btn
                color="white"
                size="x-small"
                class="text-transform-none gtext-t5 text-white"
                value="map"
              >
                <span class="text-black"> Map</span>
              </v-btn>
              <v-btn
                color="white"
                size="x-small"
                class="text-transform-none gtext-t5 text-white"
                value="tour"
              >
                <span class="text-black"> Tour</span>
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
            <school-detail-school-title :content="contentData" />
          </v-col>
          <v-col cols="1" md="4" class="align-self-center">
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
            <school-detail-school-chips :contentData="contentData" />
            <school-detail-tuition-info :contentData="contentData" />
            <school-detail-facilities
              :facilities="contentData.tags"
              @open-auth-dialog="openAuthDialog"
              @facilities-updated="refreshSchoolData"
            />
          </v-col>
          <v-col cols="12" md="4" id="main-info-section">
            <school-detail-school-main-info :content="contentData" />
          </v-col>
        </v-row>

        <!-- End general data section -->

        <school-detail-users-score
          :ratingData="ratingData"
          @leave-comment="showLeaveCommentDialog = true"
        />
        <school-detail-recent-comments :commentList="commentList" />
        <school-detail-similar-schools :similarSchools="similarSchools" />
      </v-col>
    </v-row>
    <!-- End data container -->

    <school-detail-leave-comment-dialog
      v-model="showLeaveCommentDialog"
      :contentData="contentData"
    />
    <school-detail-gallery-dialog
      v-model="showGalleryDialog"
      :contentData="contentData"
      :images="galleryImages"
      @refresh-gallery="loadGalleryImages"
    />
    <school-detail-report-dialog
      v-model="reportDialog"
      :school-id="$route.params.id"
      @open-auth-dialog="openAuthDialog"
    />
  </v-container>
</template>

<script setup>
import { useDisplay } from "vuetify/lib/composables/display";

const nuxtApp = useNuxtApp();
const route = useRoute();
const router = useRouter();
const display = useDisplay();
const galleryImages = ref([]);
const activeGalleryIndex = ref(0);
const tourPanoramas = ref([]);
const slideToggler = ref("map");
const topSlideClass = reactive({
  image: "under-image-left",
  map: "center-image",
  tour: "under-image-right",
});
const showLeaveCommentDialog = ref(false);
const showGalleryDialog = ref(false);
const commentList = ref([]);
const reportDialog = ref(false);
const contentData = ref({});
const ratingData = ref({});
const similarSchools = [];

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
function refreshSchoolData() {}

onMounted(() => {
  loadComments();
  loadGalleryImages();
  loadTourPanorama();
});
</script>

<style scoped>
.school-head-toggle {
  height: 28px !important;
}

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

@media (max-width: 600px) {
  .top-slide-container {
    margin-top: 2.4rem;
  }

  .data-container {
    margin-top: 27rem !important;
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
