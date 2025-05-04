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
              :size="$vuetify.breakpoint.mdAndUp ? 48 : 24"
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
            @click="selectLocationDialog = true"
            id="schoolDetailsMap"
          >
            <l-tile-layer :url="map.url"></l-tile-layer>
            <l-marker :lat-lng="map.latLng" :icon="map.schoolIcon"></l-marker>
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
            <v-btn @click="openTourImgInput" class="" icon color="white">
              <v-icon small> mdi-pencil </v-icon>
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
              :size="$vuetify.breakpoint.mdAndUp ? 48 : 24"
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
              :size="$vuetify.breakpoint.mdAndUp ? 48 : 24"
              class="primary-gray-300 mb-2 mb-md-10"
              >mdi-panorama-outline</v-icon
            >
            <div class="gtext-t6 gtext-md-t4 primary-blue-500">Contribute</div>
          </div>
        </div>
      </div>
    </v-row>

    <v-row class="d-none d-md-flex">
      <v-col cols="12" md="4">
        <div v-if="galleryImages && galleryImages.length > 0">
          <v-carousel
            hide-delimiters
            show-arrows-on-hover
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
            <l-marker :lat-lng="map.latLng" :icon="map.schoolIcon"></l-marker>
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
                <v-btn @click="openTourImgInput" class="" icon color="white">
                  <v-icon small> mdi-pencil </v-icon>
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
                {{ $moment(contentData.up_date).format("YY/MM/DD") }}
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
              <!-- {{ contentData.score ? contentData.score : "New" }} -->
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
            <h1 class="gtext-h4 gtext-sm-h4 gtext-lg-h4">
              <div class="d-flex align-center flex-wrap">
                <div v-show="!generalDataEditMode.name">
                  {{ contentData.name }}
                </div>
                <v-btn
                  v-if="!generalDataEditMode.name"
                  @click="editGeneralInfo('name')"
                  class="ml-4"
                  icon
                  color="blue-grey"
                >
                  <v-icon small> mdi-pencil </v-icon>
                </v-btn>
                <v-text-field
                  v-model="form.name"
                  v-if="generalDataEditMode.name"
                  placeholder="Name"
                  :rules="nameRule"
                >
                  <template slot="append-outer">
                    <v-btn
                      :loading="nameSubmitLoader"
                      color="success"
                      @click="updateGeneralInfo('name')"
                      fab
                      depressed
                      x-small
                    >
                      <v-icon> mdi-check </v-icon>
                    </v-btn>
                  </template>
                </v-text-field>
              </div>

              <span v-show="contentData.school_type_title"
                >,
                {{ contentData.school_type_title }}
              </span>
              <span v-show="contentData.section_title">
                , {{ contentData.section_title }}
              </span>
              <span v-show="contentData.area_title">
                , {{ contentData.area_title }}
              </span>
            </h1>
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
            <div class="d-flex">
              <v-sheet class="chips-container">
                <v-chip
                  v-if="contentData.countryTitle"
                  class="blue-grey darken-1 white--text"
                  small
                >
                  {{ contentData.countryTitle }}
                </v-chip>
                <v-chip
                  v-if="contentData.stateTitle"
                  class="blue-grey darken-1 white--text"
                  small
                >
                  {{ contentData.stateTitle }}
                </v-chip>
                <v-chip
                  v-if="contentData.cityTitle"
                  class="blue-grey darken-1 white--text"
                  small
                >
                  {{ contentData.cityTitle }}
                </v-chip>
                <v-chip
                  v-if="contentData.schoolType && contentData.schoolType.name"
                  class="blue-grey darken-1 white--text"
                  small
                >
                  {{ contentData?.schoolType?.name }}
                </v-chip>
                <v-chip
                  :to="`/school?school_type=${contentData.school_type}`"
                  v-if="contentData.school_type_title"
                  class="blue-grey darken-1 white--text"
                  small
                >
                  {{ contentData.school_type_title }}
                </v-chip>
                <v-chip
                  :to="`/school?section=${contentData.section}`"
                  v-if="contentData.section_title"
                  class="blue-grey darken-1 white--text"
                  small
                >
                  {{ contentData.section_title }}
                </v-chip>
                <v-chip
                  :to="`/school?coed_status=${contentData.sex}`"
                  v-if="contentData.sex_title"
                  class="blue-grey darken-1 white--text"
                  small
                >
                  {{ contentData.sex_title }}
                </v-chip>
              </v-sheet>
              <v-spacer />

              <div class="gtext-t4 primary-blue-500">Contribute</div>
            </div>

            <div class="d-flex mt-11 mb-9">
              <div class="gtext-h5 gtext-md-h5 primary-gray-600">
                Tuition fee
              </div>
              <v-spacer />
              <!-- <div class="gtext-t4 primary-blue-500">Contribute</div> -->

              <div class="gtext-t2 font-weight-heavy primary-gray-800">
                <span v-show="contentData.tuition_fee"
                  ><span class="gtext-t6">$</span>
                  {{ contentData.tuition_fee | numberFormat }}</span
                >
                <span v-show="!contentData.tuition_fee">(N/A)</span>
              </div>
            </div>
            <Facilities
              :facilities="contentData.tags"
              @open-auth-dialog="openAuthDialog"
              @facilities-updated="refreshSchoolData"
            />
          </v-col>
          <v-col cols="12" md="4" id="main-info-section">
            <div class="d-flex info-itm ml-md-6">
              <div class="info-sign">
                <v-icon color="primary"> mdi-web </v-icon>
              </div>
              <div class="info-data overflow-hidden">
                <a
                  v-show="contentData.webSite && !generalDataEditMode.website"
                  :href="normalizeURL(contentData.webSite)"
                  target="_blank"
                  class="blue--text overflow-hidden text-ellipsis flex-grow-1"
                >
                  {{ contentData.webSite }}
                </a>
                <template v-if="contentData.webSite">
                  <v-btn
                    v-if="!generalDataEditMode.website"
                    @click="editGeneralInfo('website')"
                    class="ml-2"
                    icon
                    color="blue-grey"
                  >
                    <v-icon small> mdi-pencil </v-icon>
                  </v-btn>
                </template>
                <template v-else>
                  <span
                    v-show="
                      !(contentData.webSite || generalDataEditMode.website)
                    "
                    @click="editGeneralInfo('website')"
                    class="gtext-t4 primary-blue-500 align-self-center pointer"
                  >
                    Contribute
                  </span>
                </template>

                <v-text-field
                  v-model="form.web"
                  v-if="generalDataEditMode.website"
                  placeholder="Website"
                  :rules="webUrlRule"
                >
                  <template slot="append-outer">
                    <v-btn
                      :loading="webSubmitLoader"
                      color="success"
                      @click="updateGeneralInfo('website')"
                      fab
                      depressed
                      x-small
                    >
                      <v-icon> mdi-check </v-icon>
                    </v-btn>
                  </template>
                </v-text-field>
              </div>
            </div>

            <div class="d-flex info-itm ml-md-6">
              <div class="info-sign">
                <v-icon color="primary"> mdi-email </v-icon>
              </div>
              <div class="info-data">
                <a
                  class="flex-grow-1"
                  v-show="contentData.email && !generalDataEditMode.email"
                  :href="`mailto:${contentData.email}`"
                >
                  {{ contentData.email }}
                </a>

                <template v-if="contentData.email">
                  <v-btn
                    v-if="!generalDataEditMode.email"
                    @click="editGeneralInfo('email')"
                    class="ml-2"
                    icon
                    color="blue-grey"
                  >
                    <v-icon small> mdi-pencil </v-icon>
                  </v-btn>
                </template>
                <template v-else>
                  <span
                    v-show="!(contentData.email || generalDataEditMode.email)"
                    @click="editGeneralInfo('email')"
                    class="gtext-t4 primary-blue-500 align-self-center pointer"
                  >
                    Contribute
                  </span>
                </template>

                <v-text-field
                  :rules="emailRule"
                  v-model="form.email"
                  v-if="generalDataEditMode.email"
                  placeholder="Email"
                >
                  <template slot="append-outer">
                    <v-btn
                      :loading="emailSubmitLoader"
                      color="success"
                      @click="updateGeneralInfo('email')"
                      fab
                      depressed
                      x-small
                    >
                      <v-icon> mdi-check </v-icon>
                    </v-btn>
                  </template>
                </v-text-field>
              </div>
            </div>

            <div class="d-flex info-itm ml-md-6">
              <div class="info-sign">
                <v-icon color="primary"> mdi-phone </v-icon>
              </div>
              <div class="info-data">
                <a
                  class="flex-grow-1"
                  v-show="
                    contentData.phoneNumber && !generalDataEditMode.phone1
                  "
                  :href="`tel: ${contentData.phoneNumber}`"
                >
                  {{ contentData.phoneNumber }}
                </a>

                <template v-if="contentData.phoneNumber">
                  <v-btn
                    v-if="!generalDataEditMode.phone1"
                    @click="editGeneralInfo('phone')"
                    class="ml-2"
                    icon
                    color="blue-grey"
                  >
                    <v-icon small> mdi-pencil </v-icon>
                  </v-btn>
                </template>
                <template v-else>
                  <span
                    @click="editGeneralInfo('phone')"
                    v-show="
                      !(contentData.phoneNumber || generalDataEditMode.phone1)
                    "
                    class="gtext-t4 primary-blue-500 align-self-center pointer"
                  >
                    Contribute
                  </span>
                </template>

                <v-text-field
                  :rules="phoneRule"
                  v-model="form.phone"
                  v-if="generalDataEditMode.phone1"
                  placeholder="Phone"
                >
                  <template slot="append-outer">
                    <v-btn
                      :loading="phoneSubmitLoader"
                      color="success"
                      @click="updateGeneralInfo('phone')"
                      fab
                      depressed
                      x-small
                    >
                      <v-icon> mdi-check </v-icon>
                    </v-btn>
                  </template>
                </v-text-field>
              </div>
            </div>

            <div class="d-flex info-itm ml-md-6">
              <div class="info-sign">
                <v-icon size="20" color="primary"> mdi-map-marker </v-icon>
              </div>
              <div class="info-data info-data-address">
                <span
                  class="flex-grow-1"
                  v-show="contentData.address && !generalDataEditMode.address"
                  >{{ contentData.address }}</span
                >

                <template v-if="contentData.address">
                  <v-btn
                    v-if="!generalDataEditMode.address"
                    @click="editGeneralInfo('address')"
                    class="ml-2"
                    icon
                    color="blue-grey"
                  >
                    <v-icon small> mdi-pencil </v-icon>
                  </v-btn>
                </template>
                <template v-else>
                  <span
                    @click="editGeneralInfo('address')"
                    v-show="
                      !(contentData.address || generalDataEditMode.address)
                    "
                    class="gtext-t4 primary-blue-500 align-self-center pointer"
                  >
                    Contribute
                  </span>
                </template>

                <v-text-field
                  v-model="form.address"
                  v-if="generalDataEditMode.address"
                  placeholder="Enter address"
                  :rules="addressRule"
                >
                  <template slot="append-outer">
                    <v-btn
                      :loading="addressSubmitLoader"
                      color="success"
                      @click="updateGeneralInfo('address')"
                      fab
                      depressed
                      x-small
                    >
                      <v-icon> mdi-check </v-icon>
                    </v-btn>
                  </template>
                </v-text-field>
              </div>
            </div>
          </v-col>
        </v-row>

        <!-- End general data section -->

        <!-- Users score -->
        <v-row class="mt-16">
          <v-col cols="12" md="4">
            <h3 class="gtext-h5 primary-gray-600 mb-15 font-weight-bold">
              Score
            </h3>
            <div class="d-flex">
              <img
                src="/images/score.png"
                id="score-img"
                alt="Users score"
                class="mr-8"
              />
              <div class="mt-10">
                <div class="gtext-t6 primary-gray-400 mb-10">
                  Total comments
                  <span class="primary-gray-800 font-weight-heavy">
                    {{ ratingData?.totalCount }}
                  </span>
                </div>
                <div>
                  <v-rating
                    v-model="ratingData.averageRate"
                    background-color="orange lighten-3"
                    color="orange"
                    half-increments
                    hover
                    size="24"
                  ></v-rating>
                </div>
                <div class="gtext-t6 primary-gray-400">
                  Average score &nbsp;<span
                    class="primary-gray-900 gtext-t4 font-weight-medium"
                  >
                    {{
                      ratingData.averageRate
                        ? ratingData.averageRate.toFixed(1)
                        : "New"
                    }} </span
                  ><span>&nbsp;/&nbsp;5</span>
                </div>
              </div>
            </div>
            <div class="mt-10 mb-12">
              <v-btn
                block
                class="bg-primary-gray-800 white--text text-transform-none gtext-t4 font-weight-medium"
                rounded
                x-large
                @click="leaveCommentDialog = true"
                >Leave a Comment</v-btn
              >
            </div>
          </v-col>
          <v-col cols="12" md="8">
            <ul id="score-results pl-0 mr-4">
              <li class="d-flex mb-4">
                <div class="bullet"></div>
                <div class="gtext-t4 font-weight-medium score-title">
                  Classroom & facility quality
                </div>
                <v-progress-linear
                  color="success"
                  rounded
                  :value="(ratingData.facilitiesRate * 100) / 5"
                  height="8"
                  class="mt-3"
                />

                <div class="gtext-t4 font-weight-medium rate-title ml-2">
                  {{ convertRateToString(ratingData.facilitiesRate) }}
                </div>
              </li>
              <li class="d-flex mb-4">
                <div class="bullet"></div>
                <div class="gtext-t4 font-weight-medium score-title">
                  Teachers' expertise
                </div>
                <v-progress-linear
                  color="success"
                  rounded
                  :value="(ratingData.educationRate * 100) / 5"
                  height="8"
                  class="mt-3"
                ></v-progress-linear>

                <div class="gtext-t4 font-weight-medium rate-title ml-2">
                  {{ convertRateToString(ratingData.educationRate) }}
                </div>
              </li>
              <li class="d-flex mb-4">
                <div class="bullet"></div>
                <div class="gtext-t4 font-weight-medium score-title">
                  Tech accessibility
                </div>
                <v-progress-linear
                  color="success"
                  rounded
                  :value="(ratingData.educationRate * 100) / 5"
                  height="8"
                  class="mt-3"
                ></v-progress-linear>

                <div class="gtext-t4 font-weight-medium rate-title ml-2">
                  {{ convertRateToString(ratingData.itTrainingRate) }}
                </div>
              </li>
              <li class="d-flex mb-4">
                <div class="bullet"></div>
                <div class="gtext-t4 font-weight-medium score-title">
                  Safety & environment
                </div>
                <v-progress-linear
                  color="success"
                  rounded
                  :value="(ratingData.safetyAndHappinessRate * 100) / 5"
                  height="8"
                  class="mt-3"
                ></v-progress-linear>

                <div class="gtext-t4 font-weight-medium rate-title ml-2">
                  {{ convertRateToString(ratingData.safetyAndHappinessRate) }}
                </div>
              </li>
              <li class="d-flex mb-4">
                <div class="bullet"></div>
                <div class="gtext-t4 font-weight-medium score-title">
                  Staff behavior
                </div>
                <v-progress-linear
                  color="success"
                  rounded
                  :value="(ratingData.behaviorRate * 100) / 5"
                  height="8"
                  class="mt-3"
                />

                <div class="gtext-t4 font-weight-medium rate-title ml-2">
                  {{ convertRateToString(ratingData.behaviorRate) }}
                </div>
              </li>
              <li class="d-flex mb-4">
                <div class="bullet"></div>
                <div class="gtext-t4 font-weight-medium score-title">
                  Value for tuition
                </div>
                <v-progress-linear
                  color="success"
                  rounded
                  :value="(ratingData.tuitionRatioRate * 100) / 5"
                  height="8"
                  class="mt-3"
                />

                <div class="gtext-t4 font-weight-medium rate-title ml-2">
                  {{ convertRateToString(ratingData.tuitionRatioRate) }}
                </div>
              </li>
              <li class="d-flex mb-4">
                <div class="bullet"></div>
                <div class="gtext-t4 font-weight-medium score-title">
                  Sports facilities
                </div>
                <v-progress-linear
                  color="success"
                  rounded
                  :value="(ratingData.facilitiesRate * 100) / 5"
                  height="8"
                  class="mt-3"
                ></v-progress-linear>

                <div class="gtext-t4 font-weight-medium rate-title ml-2">
                  {{ convertRateToString(ratingData.facilitiesRate) }}
                </div>
              </li>
              <li class="d-flex">
                <div class="bullet"></div>
                <div class="gtext-t4 font-weight-medium score-title">
                  Art & counseling programs
                </div>
                <v-progress-linear
                  color="success"
                  rounded
                  :value="(ratingData.artisticActivitiesRate * 100) / 5"
                  height="8"
                  class="mt-3"
                ></v-progress-linear>

                <div class="gtext-t4 font-weight-medium rate-title ml-2">
                  {{ convertRateToString(ratingData.artisticActivitiesRate) }}
                </div>
              </li>
            </ul>
          </v-col>
        </v-row>
        <!-- End users score -->

        <!-- Recent comments -->
        <v-row v-show="commentList.length">
          <v-col cols="12">
            <h3 class="gtext-h5 primary-gray-600">Comments</h3>
          </v-col>
          <v-col cols="12" md="12">
            <v-card
              v-for="comment in commentList"
              :key="comment.id"
              class="comment-card primary-gray-100 pt-4 mb-3"
              elevation="1"
            >
              <v-card-text>
                <div class="comment-card-header">
                  <div class="d-flex float-left">
                    <v-avatar size="60">
                      <img
                        class="profile-avatar"
                        :src="comment.creationUserAvatar"
                      />
                    </v-avatar>
                    <div class="ml-2">
                      <!-- <div class="gtext-t3 primary-gray-500">
                        Teacher, Blackven
                      </div> -->
                      <div class="gtext-t2 primary-gray-900">
                        {{ comment.creationUser }}
                      </div>
                    </div>
                  </div>
                  <div class="float-right">
                    <v-rating
                      :value="comment.averageRate"
                      background-color="orange lighten-3"
                      color="orange"
                      half-increments
                      size="24"
                      readonly
                    ></v-rating>
                  </div>
                </div>
                <v-divider class="mb-5" />
                <div class="gtext-t2 primary-gray-700 mb-6">
                  "{{ comment.comment }}"
                </div>
                <div class="pb-8">
                  <div class="float-left">
                    <v-btn
                      class="bg-primary-gray-700 white--text mr-6"
                      fab
                      x-small
                    >
                      <v-icon size="14"> mdi-thumb-down </v-icon>
                    </v-btn>
                    <v-btn
                      class="bg-primary-gray-700 white--text mr-6"
                      fab
                      x-small
                    >
                      <v-icon size="14"> mdi-thumb-up </v-icon>
                    </v-btn>
                    <v-btn class="bg-primary-blue-500 white--text" fab x-small>
                      <v-icon size="14"> mdi-forum </v-icon>
                    </v-btn>
                  </div>
                  <div class="float-right gtext-t5">
                    {{ comment.creationDate }}
                  </div>
                </div>
              </v-card-text>
            </v-card>

            <div class="text-center mt-14">
              <v-btn
                rounded
                class="text-transform-none gtext-t4 font-weight-medium"
                color="white"
                x-large
                >Load more</v-btn
              >
            </div>
          </v-col>
          <!-- <v-col cols="12" md="3" class="d-none d-md-block pl-15">
            <div id="advert-section">
              <div class="vertical-text">Advertising</div>
            </div>
          </v-col> -->
        </v-row>
        <!-- End recent comments -->

        <!-- Similar schools -->
        <v-row id="similar-schools" v-show="false">
          <v-col cols="12">
            <h3 class="gtext-h5 primary-gray-600">Similar schools</h3>
          </v-col>
          <v-col cols="12">
            <v-slide-group
              class="slider py-sm-4"
              :show-arrows="$vuetify.breakpoint.lgAndUp"
            >
              <!-- <div class="d-flex" v-if="isLoading">
                <v-slide-item v-for="i in 10" :key="i">
                  <v-skeleton-loader
                    class="mx-auto slide-loading"
                    type="card"
                  ></v-skeleton-loader>
                </v-slide-item>
              </div> -->

              <v-slide-item>
                <v-card rounded class="list-item" :to="`/school/`">
                  <v-card-text>
                    <div class="item-info">
                      <div class="main-data">
                        <div class="float-left">
                          <h2 class="gtext-t4 font-weight-semibold mb-4">
                            School name School nament
                          </h2>

                          <!-- <v-chip class="primary">

             </v-chip> -->

                          <v-chip
                            class="list-chip gtext-t5 font-weight-medium"
                            small
                          >
                            Pre-K
                          </v-chip>

                          <!-- <v-chip class="primary">

             </v-chip>

             <v-chip class="primary">

             </v-chip> -->
                        </div>
                        <div class="item-img float-right">
                          <img
                            :src="require('assets/images/default-school.png')"
                          />
                        </div>
                      </div>
                      <v-divider class="mb-3" />
                      <div class="item-footer">
                        <div class="float-left">
                          <v-btn icon>
                            <v-icon> mdi-map-marker </v-icon>
                          </v-btn>

                          <!-- <v-btn :disabled="!item.location" icon>
                    <v-icon> mdi-map-marker </v-icon>
                  </v-btn>
                  <v-btn :disabled="!item.phone1" icon>
                    <v-icon> mdi-phone </v-icon>
                  </v-btn>
                  <v-btn :disabled="!item.address" icon>
                    <v-icon> mdi-email </v-icon>
                  </v-btn>
                  <v-btn :disabled="!item.site" icon>
                    <v-icon> mdi-web </v-icon>
                  </v-btn> -->
                        </div>

                        <div class="float-right d-flex mt-1">
                          <div
                            class="rate-section gtext-t6 font-weight-semibold mr-1"
                          >
                            <!-- {{ item.score }} -->
                            4
                            <v-icon color="primary"> mdi-star </v-icon>
                          </div>
                          <div class="gtext-t6 primary-gray-300">
                            Update:
                            <span class="primary-gray-600">
                              {{
                                $moment(contentData.up_date).format(
                                  "YYYY/MM/DD"
                                )
                              }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-slide-item>
              <v-slide-item>
                <v-card rounded class="list-item" :to="`/school/`">
                  <v-card-text>
                    <div class="item-info">
                      <div class="main-data">
                        <div class="float-left">
                          <h2 class="gtext-t4 font-weight-semibold mb-4">
                            School name School nament
                          </h2>

                          <!-- <v-chip class="primary">

             </v-chip> -->

                          <v-chip
                            class="list-chip gtext-t5 font-weight-medium"
                            small
                          >
                            Pre-K
                          </v-chip>

                          <!-- <v-chip class="primary">

             </v-chip>

             <v-chip class="primary">

             </v-chip> -->
                        </div>
                        <div class="item-img float-right">
                          <img
                            :src="require('assets/images/default-school.png')"
                          />
                        </div>
                      </div>
                      <v-divider class="mb-3" />
                      <div class="item-footer">
                        <div class="float-left">
                          <v-btn icon>
                            <v-icon> mdi-map-marker </v-icon>
                          </v-btn>

                          <!-- <v-btn :disabled="!item.location" icon>
                    <v-icon> mdi-map-marker </v-icon>
                  </v-btn>
                  <v-btn :disabled="!item.phone1" icon>
                    <v-icon> mdi-phone </v-icon>
                  </v-btn>
                  <v-btn :disabled="!item.address" icon>
                    <v-icon> mdi-email </v-icon>
                  </v-btn>
                  <v-btn :disabled="!item.site" icon>
                    <v-icon> mdi-web </v-icon>
                  </v-btn> -->
                        </div>

                        <div class="float-right d-flex mt-1">
                          <div
                            class="rate-section gtext-t6 font-weight-semibold mr-1"
                          >
                            <!-- {{ item.score }} -->
                            4
                            <v-icon color="primary"> mdi-star </v-icon>
                          </div>
                          <div class="gtext-t6 primary-gray-300">
                            Update:
                            <span class="primary-gray-600">
                              {{
                                $moment(contentData.up_date).format(
                                  "YYYY/MM/DD"
                                )
                              }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-slide-item>
            </v-slide-group>
          </v-col>
        </v-row>
        <!-- End similar schools -->
      </v-col>
    </v-row>
    <!-- End data container -->

    <!-- Leave comment dialog -->
    <v-dialog
      transition="dialog-bottom-transition"
      v-model="leaveCommentDialog"
      :fullscreen="$vuetify.breakpoint.xs"
      max-width="924"
      style="z-index: 1501"
    >
      <v-card>
        <v-card-text class="pt-6 pb-0 pt-md-8 pb-2 px-6 px-md-12">
          <div class="d-flex">
            <div class="gtext-h5 priamry-gray-700">Leave a Comment</div>
            <v-spacer></v-spacer>
            <v-btn icon
              ><v-icon size="20" @click="leaveCommentDialog = false"
                >mdi-close</v-icon
              ></v-btn
            >
          </div>
          <v-divider class="mb-12 mt-4" />
          <v-row>
            <v-col cols="12" md="6">
              <ul id="score-form">
                <li class="d-flex mb-4">
                  <div class="bullet"></div>
                  <div
                    class="gtext-t4 font-weight-medium primary-gray-700 score-title"
                  >
                    Classroom & facility quality
                  </div>
                  <v-rating
                    v-model="commentForm.classesQualityRate"
                    background-color="orange lighten-3"
                    color="orange"
                    half-increments
                    hover
                    size="24"
                  ></v-rating>
                </li>
                <li class="d-flex mb-4">
                  <div class="bullet"></div>
                  <div
                    class="gtext-t4 font-weight-medium primary-gray-700 score-title"
                  >
                    Teachers' expertise
                  </div>
                  <v-rating
                    v-model="commentForm.educationRate"
                    background-color="orange lighten-3"
                    color="orange"
                    half-increments
                    hover
                    size="24"
                  ></v-rating>
                </li>
                <li class="d-flex mb-4">
                  <div class="bullet"></div>
                  <div
                    class="gtext-t4 font-weight-medium primary-gray-700 score-title"
                  >
                    Tech accessibility
                  </div>
                  <v-rating
                    v-model="commentForm.itTrainingRate"
                    background-color="orange lighten-3"
                    color="orange"
                    half-increments
                    hover
                    size="24"
                  ></v-rating>
                </li>
                <li class="d-flex mb-4">
                  <div class="bullet"></div>
                  <div
                    class="gtext-t4 font-weight-medium primary-gray-700 score-title"
                  >
                    Safety & environment
                  </div>
                  <v-rating
                    v-model="commentForm.safetyAndHappinessRate"
                    background-color="orange lighten-3"
                    color="orange"
                    half-increments
                    hover
                    size="24"
                  ></v-rating>
                </li>
                <li class="d-flex mb-4">
                  <div class="bullet"></div>
                  <div
                    class="gtext-t4 font-weight-medium primary-gray-700 score-title"
                  >
                    Staff behavior
                  </div>
                  <v-rating
                    v-model="commentForm.behaviorRate"
                    background-color="orange lighten-3"
                    color="orange"
                    half-increments
                    hover
                    size="24"
                  ></v-rating>
                </li>
                <li class="d-flex mb-4">
                  <div class="bullet"></div>
                  <div
                    class="gtext-t4 font-weight-medium primary-gray-700 score-title"
                  >
                    Value for tuition
                  </div>
                  <v-rating
                    v-model="commentForm.tuitionRatioRate"
                    background-color="orange lighten-3"
                    color="orange"
                    half-increments
                    hover
                    size="24"
                  ></v-rating>
                </li>
                <li class="d-flex mb-4">
                  <div class="bullet"></div>
                  <div
                    class="gtext-t4 font-weight-medium primary-gray-700 score-title"
                  >
                    Facilities
                  </div>
                  <v-rating
                    v-model="commentForm.tuitionRatioRate"
                    background-color="orange lighten-3"
                    color="orange"
                    half-increments
                    hover
                    size="24"
                  ></v-rating>
                </li>
                <li class="d-flex">
                  <div class="bullet"></div>
                  <div
                    class="gtext-t4 font-weight-medium primary-gray-700 score-title"
                  >
                    Art & counseling programs
                  </div>
                  <v-rating
                    v-model="commentForm.artisticActivitiesRate"
                    background-color="orange lighten-3"
                    color="orange"
                    half-increments
                    hover
                    size="24"
                  ></v-rating>
                </li>
              </ul>
            </v-col>
            <v-col cols="12" md="6">
              <div style="position: relative">
                <v-textarea
                  placeholder="Type your comment"
                  v-model="commentForm.comment"
                  outlined
                  :rows="$vuetify.breakpoint.xs ? 10 : 22"
                />
                <v-btn
                  x-small
                  height="40"
                  width="40"
                  :loading="help_loading"
                  @click="sendToAI()"
                  class="white--text"
                  color="teal lighten-2"
                  style="position: absolute; right: 10px; bottom: 40px"
                  ><v-icon small color="white">mdi-auto-fix</v-icon></v-btn
                >
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="justify-center pb-13">
          <v-btn
            class="primary black--text text-transform-none gtext-t4 font-weight-medium"
            rounded
            width="100%"
            max-width="400"
            x-large
            :disabled="!commentForm.comment"
            :loading="loading.submitComment"
            @click="submitComment"
            >Submit</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- End leave comment dialog -->

    <gallery-dialog
      v-model="galleryDialog"
      :contentData="contentData"
      :images="galleryImages"
      @refresh-gallery="loadGalleryImages"
    />

    <!-- Select Location dialog -->
    <v-dialog
      transition="dialog-bottom-transition"
      v-model="selectLocationDialog"
      :fullscreen="$vuetify.breakpoint.xs"
      max-width="720"
      style="z-index: 20001"
    >
      <v-card>
        <v-card-text class="pt-6 pt-md-8 px-6 px-md-8">
          <div class="d-flex">
            <div class="gtext-h5 priamry-gray-700">Location</div>
            <v-spacer></v-spacer>
            <v-btn icon
              ><v-icon size="20" @click="selectLocationDialog = false"
                >mdi-close</v-icon
              ></v-btn
            >
          </div>
        </v-card-text>

        <div id="locationPickerMapContainer">
          <client-only>
            <l-map
              ref="editSchoolMap"
              :zoom="2"
              :center="map.center"
              id="mapSection"
              @move="updateMarkerPosition"
            >
              <l-tile-layer :url="map.url"></l-tile-layer>
              <l-marker
                ref="editMapMarker"
                :lat-lng="map.center"
                :icon="map.schoolIcon"
              ></l-marker>
            </l-map>
          </client-only>
          <locationSearch
            id="searchSection"
            @locationSelected="goToSearchLocation"
            rounded
            label="Search anything"
          />
        </div>
        <a
          :href="`https://www.google.com/maps?q=${contentData.latitude}, ${contentData.longitude}`"
          target="blank"
          class="ml-1 blue--text"
          >See on Google Map</a
        >
        <v-card-actions class="justify-center pb-13">
          <v-btn
            :loading="mapSubmitLoader"
            @click="updateGeneralInfo('map')"
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

<script>
import locationSearch from "@/components/Form/LocationSearch";
import GalleryDialog from "@/components/school/GalleryDialog.vue";
import ReportDialog from "@/components/school/ReportDialog.vue";
import Facilities from "@/components/school/detail/Facilities.vue";
export default {
  name: "school-details",
  auth: false,
  data() {
    return {
      cropperDialog: false,
      map: {
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        zoom: 10,
        minZoom: 2,
        center: [0, 0], // Initial map center coordinates
        latLng: [0, 0],
        object: null,
        boundingBox: {},
        schoolIcon: null,
      },
      tourImgPreview: null,
      galleryImages: [],
      activeGalleryIndex: 0,
      tourPanoramas: [],
      form: {
        web: null,
        email: null,
        phone: null,
        address: null,
        name: null,
      },

      mapMarkerData: {},

      rating: 3.5,
      slideToggler: "map",
      topSlideClass: {
        image: "under-image-left",
        map: "center-image",
        tour: "under-image-right",
      },
      help_loading: false,
      leaveCommentDialog: false,
      galleryDialog: false,

      commentForm: {
        comment: "",
        classesQualityRate: 4.5,
        educationRate: 4,
        itTrainingRate: 4,
        safetyAndHappinessRate: 3.5,
        behaviorRate: 4,
        tuitionRatioRate: 5,
        facilitiesRate: 4.5,
        artisticActivitiesRate: 4,
      },
      selectLocationDialog: false,
      tourImg: null,

      loading: {
        submitComment: false,
        uploadTour: false,
      },

      mapSubmitLoader: false,
      addressSubmitLoader: false,
      webSubmitLoader: false,
      emailSubmitLoader: false,
      phoneSubmitLoader: false,
      nameSubmitLoader: false,
      commentList: [],

      generalDataEditMode: {
        website: false,
        email: false,
        phone1: false,
        address: false,
        map: false,
        name: false,
      },

      webUrlRule: [
        (v) =>
          !v ||
          /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/.test(
            v
          ) ||
          "Please enter a valid URL",
        (v) => !v || v.length <= 255 || "URL must be less than 255 characters",
      ],
      emailRule: [
        (v) => !!v || "Email is required",
        (v) =>
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ||
          "Please enter a valid email address",
      ],
      phoneRule: [(v) => !!v || "Phone number is required"],
      nameRule: [(v) => !!v || "Name is required"],
      addressRule: [(v) => !!v || "Address is required"],

      reportDialog: false,
    };
  },
  head() {
    return {
      title: this.contentData.name,
      script: [
        {
          type: "application/ld+json",
          json: {
            "@context": "https://schema.org",
            "@type": "School", // Change this based on your content type
            name: this.contentData.name,
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: this.ratingData.averageRate
                ? this.ratingData.averageRate.toFixed(1)
                : 3,
              reviewCount: this.ratingData.totalCount,
            },
          },
        },
      ],
    };
  },
  components: {
    locationSearch,
    GalleryDialog,
    ReportDialog,
    Facilities,
  },
  async asyncData({ params, $axios }) {
    const baseURL = process.server
      ? `${process.env.API2_BASE_URL}/api/v1`
      : "/api/v2";

    const content = await $axios.$get(`${baseURL}/schools/${params.id}`);
    const rating = await $axios.$get(`${baseURL}/schools/${params.id}/rate`);

    var contentData = [];
    var ratingData = [];

    //Check data exist
    if (content.succeeded) {
      contentData = content.data;
    }
    if (rating.succeeded) {
      ratingData = rating.data;
    }

    return { contentData, ratingData };
  },
  mounted() {
    this.map.schoolIcon = L.icon({
      iconUrl: "/images/school-marker.png", // Replace with school marker icon
      iconSize: [64, 64], // Adjust the size as needed
      iconAnchor: [16, 32], // Adjust the anchor point as needed
    });

    this.map.center = [this.contentData.latitude, this.contentData.longitude];
    this.map.latLng = [this.contentData.latitude, this.contentData.longitude];

    //Load comments
    this.loadComments();
    this.loadGalleryImages();
    this.loadTourPanorama();
  },
  watch: {
    // Remove the tourImg watch as it's now handled in validateAndProcessImage
  },
  methods: {
    convertRateToString(value) {
      if (value > 3.5) return "Good";
      else if (value > 2) return "Average";
      else if (value <= 2) return "Poor";
      else return "Unknown";
    },
    openGalleryDialog() {
      // Ensure the GalleryDialog shows the currently selected image
      if (this.galleryImages && this.galleryImages.length > 0) {
        const currentIndex = this.activeGalleryIndex;
        if (currentIndex >= 0 && currentIndex < this.galleryImages.length) {
          this.$set(this.contentData, "pic", this.galleryImages[currentIndex]);
        }
      }
      this.galleryDialog = true;
    },
    updateMainGalleryImage(index) {
      this.activeGalleryIndex = index;
      if (this.galleryImages && this.galleryImages.length > index) {
        this.$set(this.contentData, "pic", this.galleryImages[index]);
      }
    },
    refreshTourContent() {
      // Force the tour image to refresh by setting it to null and back
      const currentTour = this.contentData.tour;
      this.$set(this.contentData, "tour", null);
      this.$nextTick(() => {
        this.$set(this.contentData, "tour", currentTour);
      });
    },
    normalizeURL(url) {
      if (!url) return "";

      // Check if the URL starts with 'http://' or 'https://'
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        // If not, assume it's 'http://'
        return "http://" + url;
      }
      // If it already has a protocol, leave it as is
      return url;
    },
    changeSlide() {
      if (this.slideToggler == "map") {
        this.topSlideClass.image = "under-image-left";
        this.topSlideClass.map = "center-image";
        this.topSlideClass.tour = "under-image-right";
      } else if (this.slideToggler == "image") {
        this.topSlideClass.image = "center-image";
        this.topSlideClass.map = "under-image-right";
        this.topSlideClass.tour = "under-image-left";
      } else if (this.slideToggler == "tour") {
        this.topSlideClass.image = "under-image-right";
        this.topSlideClass.map = "under-image-left";
        this.topSlideClass.tour = "center-image";
      }

      const rootElement = this.$el;

      // Finding an element with a specific class
      const targetElement = rootElement.querySelector(".center-image");

      // Manipulating the found element (for example, changing its color)
      // if (targetElement) {
      //   targetElement.style.opacity = "1";
      // }
    },

    updateMarkerPosition() {
      // Get the map and marker references
      const map = this.$refs.editSchoolMap.mapObject;
      const marker = this.$refs.editMapMarker.mapObject;

      // Get the new center coordinates
      const newCenter = map.getCenter();

      // Update the marker position to the new center
      marker.setLatLng(newCenter);
      this.mapMarkerData = newCenter;
    },
    goToSearchLocation(val) {
      const map = this.$refs.editSchoolMap.mapObject;
      map.setView([val[0], val[1]], 12);

      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 100);
    },
    openLocationDialog() {
      this.selectLocationDialog = true;

      setTimeout(() => {
        const map = this.$refs.editSchoolMap.mapObject;
        map.setView(this.map.center, 12);
        window.dispatchEvent(new Event("resize"));
      }, 500);
    },
    openTourImgInput() {
      // Make sure the mobile file input activates
      if (this.$refs.tourImgRef) {
        this.$refs.tourImgRef.$el.querySelector("input").click();
      }
    },

    validateAndProcessImage(file) {
      if (!file) return;

      // Check file type
      const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
      if (!validTypes.includes(file.type)) {
        this.$toast.error(
          "Invalid file type. Please use JPG, PNG or WebP images."
        );
        this.tourImg = null;
        return;
      }

      // Check file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        this.$toast.error("File too large. Maximum size is 5MB.");
        this.tourImg = null;
        return;
      }

      // Create the preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.tourImgPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    },

    uploadTourImage() {
      if (!this.tourImg) {
        this.$toast.error("Please select an image to upload");
        return;
      }

      // Validate file type again before upload
      const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
      if (!validTypes.includes(this.tourImg.type)) {
        this.$toast.error(
          "Invalid file type. Please use JPG, PNG or WebP images."
        );
        return;
      }

      this.loading.uploadTour = true;

      // Create FormData to send the file
      let formData = new FormData();
      formData.append("File", this.tourImg);
      formData.append("FileType", "Tour360");

      this.$axios
        .$post(
          `/api/v2/schools/${this.$route.params.id}/images/Tour360`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("v2_token")}`,
            },
          }
        )
        .then((response) => {
          this.$toast.success(
            "Your 360° tour image has been successfully uploaded"
          );

          // Load the new tour panorama data from the server
          this.loadTourPanorama();

          // Clear preview and input
          this.tourImg = null;
          this.tourImgPreview = null;

          // Force Vue to update the template after a short delay
          setTimeout(() => {
            this.refreshTourContent();
            // Change the slide to 'tour' if on mobile view
            if (this.$vuetify.breakpoint.smAndDown) {
              this.slideToggler = "tour";
              // this.changeSlide();
            }
          }, 500);
        })
        .catch((err) => {
          if (err.response?.status == 401 || err.response?.status == 403) {
            this.openAuthDialog("login");
          } else {
            this.$toast.error(err.response?.data?.message || "Upload failed");
          }
        })
        .finally(() => {
          this.loading.uploadTour = false;
        });
    },

    clearTourImage() {
      this.tourImg = null;
      this.tourImgPreview = null;
      this.$toast.info("Image removed");
    },

    isValidUrl(url) {
      try {
        // Try to create a URL object - this will validate basic URL structure
        new URL(url);
        // Check if it starts with http:// or https://
        return /^https?:\/\//.test(url);
      } catch (e) {
        return false;
      }
    },
    isValidEmail(email) {
      try {
        // Basic format check using a regular expression
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      } catch (e) {
        return false;
      }
    },
    isValidPhone(email) {
      try {
        // Basic format check using a regular expression
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      } catch (e) {
        return false;
      }
    },

    isRequired(value) {
      try {
        return !!value.trim();
      } catch (e) {
        return false;
      }
    },

    submitComment() {
      this.loading.submitComment = true;

      this.$axios
        .$post(
          `/api/v2/schools/${this.$route.params.id}/comments`,
          this.commentForm,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("v2_token")}`,
            },
          }
        )
        .then((response) => {
          if (response.succeeded) {
            this.$toast.success("Your comment has been successfully submitted");
            this.loadComments();
            this.leaveCommentDialog = false;
          } else {
            this.$toast.error(response?.errors[0]?.message);
          }
        })
        .catch((err) => {
          if (err.response.status == 401 || err.response.status == 403) {
            this.openAuthDialog("login");
          } else this.$toast.error("Something is wrong.");
        })
        .finally(() => {
          this.loading.submitComment = false;
        });
    },
    async sendToAI() {
      const userComment = `You are an educational review assistant. Your task is to evaluate the following school and return a structured JSON response.

          ### **School Information:**
          - **Name:** ${this.contentData.name}
          - **Location:** ${this.contentData.countryTitle}, ${
        this.contentData.stateTitle
      }, ${this.contentData.cityTitle}
          ${
            this.contentData.webSite
              ? `- **Website:** ${this.contentData.webSite}`
              : ""
          }

          ### **Evaluation Criteria:**
          Rate each of the following aspects on a scale of 1 to 5 stars (as numbers) from sources like OpenStreetMap, Google Maps, and the school's official website, then provide a brief comment base on The following aspects for school (don't repeat school name and location in comment).
          \n1. Quality of classrooms and educational facilities
          \n2. Teachers' proficiency and teaching effectiveness
          \n3. Access to and use of computers and technology
          \n4. Safety and overall atmosphere of the school
          \n5. Behavior of school officials towards students
          \n6. Affordability relative to the services provided
          \n7. Availability of suitable sports facilities
          \n8. Presence of art classes or counseling programs\n\n

          ### **Response Format:**
          Return a structured JSON object with:
          - Category ratings as numbers (1-5) and it 8 items.
          - A short, engaging, fact-based description including emojis (min:350 char, max 400 char), Not rely solely on the ratings but should reflect the school's actual characteristics and unique features., Highlight both strengths and weaknesses of the school, providing a balanced perspective, Use emojis to make it more appealing

          Response Format: (Don't forget end of rating object close by })
          \`\`\`json
          {
            "description": "🏫 Cornerstone Preparatory School offers a great learning environment with skilled teachers and strong safety measures. However, technology access and arts programs could be improved.",
            "ratings": {
              "classrooms_quality": ai_rate as number,
              "teachers_proficiency": ai_rate as number,
              "technology_access": ai_rate as number,
              "school_safety": ai_rate as number,
              "officials_behavior": ai_rate as number,
              "affordability": ai_rate as number,
              "sports_facilities": ai_rate as number,
              "art_counseling": ai_rate as number
            }
          }
          \`\`\`
          `;

      if (!localStorage.getItem("v2_token")) {
        this.$toast.error("Login required to proceed.");
        this.openAuthDialog("login");
        return;
      }

      if (!userComment) {
        this.$toast.error("Sorry, insufficient data");
        return;
      }
      this.help_loading = true;
      try {
        const apiResponse = await this.$axios.$post("/api/chatgpt", {
          userComment,
        });

        // Remove the code block formatting (```json\n) and parse the JSON string
        const cleanedResponse = apiResponse.response
          .replace(/^\s*```json[\s\S]*?\n/, "") // Remove the opening markdown
          .replace(/```$/, ""); // Remove the closing markdown

        // Now parse the cleaned response as JSON
        const parsedResponse = JSON.parse(cleanedResponse);

        // Extract ratings and description
        const ratings = parsedResponse.ratings;
        this.commentForm.comment = parsedResponse.description;

        // Example of how to use ratings in your code
        this.commentForm.classesQualityRate = ratings.classrooms_quality; // 4
        this.commentForm.educationRate = ratings.teachers_proficiency; // 5
        this.commentForm.itTrainingRate = ratings.technology_access; // 3
        this.commentForm.safetyAndHappinessRate = ratings.school_safety; // 4
        this.commentForm.behaviorRate = ratings.officials_behavior; // 5
        this.commentForm.tuitionRatioRate = ratings.affordability; // 3
        this.commentForm.facilitiesRate = ratings.sports_facilities; // 4
        this.commentForm.artisticActivitiesRate = ratings.art_counseling; // 2

        // this.commentForm.safetyAndHappinessRate = ratings.sc;
      } catch {
        this.$toast.error("Error: Failed to get AI response.");
        this.aiResponse = "Failed to get AI response.";
      } finally {
        this.help_loading = false;
      }
    },

    openAuthDialog(val) {
      this.$router.push({ query: { auth_form: val } });
    },
    loadComments() {
      this.$axios
        .$get(`/api/v2/schools/${this.$route.params.id}/comments`, {
          params: {
            "PagingDto.PageFilter.Size": 20,
          },
        })
        .then((response) => {
          this.commentList = response.data.list;
        })
        .catch((err) => {});
    },
    loadGalleryImages() {
      this.$axios
        .$get(`/api/v2/schools/${this.$route.params.id}/images/SimpleImage`)
        .then((response) => {
          this.galleryImages = [...response.data].reverse();
          if (this.galleryImages.length >= 1) {
            this.$set(this.contentData, "pic", this.galleryImages[0].fileUri);
          } else {
            this.$set(this.contentData, "pic", null);
          }
        })
        .catch((err) => {});
    },
    loadTourPanorama() {
      this.$axios
        .$get(`/api/v2/schools/${this.$route.params.id}/images/Tour360`)
        .then((response) => {
          this.tourPanoramas = response.data;
          if (this.tourPanoramas.length >= 1) {
            // Use Vue's $set to ensure reactivity
            this.$set(
              this.contentData,
              "tour",
              this.tourPanoramas[this.tourPanoramas.length - 1].fileUri
            );
          } else {
            this.$set(this.contentData, "tour", null);
          }
        })
        .catch((err) => {});
    },
    editGeneralInfo(value) {
      if (value == "website") {
        this.form.web = this.contentData.webSite || "";
        this.generalDataEditMode.website = true;
      } else if (value == "email") {
        this.form.email = this.contentData.email || "";
        this.generalDataEditMode.email = true;
      } else if (value == "phone") {
        this.form.phone = this.contentData.phoneNumber || "";
        this.generalDataEditMode.phone1 = true;
      } else if (value == "address") {
        this.form.address = this.contentData.address || "";
        this.generalDataEditMode.address = true;
      } else if (value == "map") {
        this.generalDataEditMode.map = true;
      } else if (value == "name") {
        this.form.name = this.contentData.name || "";
        this.generalDataEditMode.name = true;
      }
    },
    updateGeneralInfo(value) {
      if (value == "website") {
        if (!this.isValidUrl(this.form.web)) {
          this.$toast.error("Please enter a valid website URL");
          return;
        }
        this.generalDataEditMode.website = false;
      }
      if (value == "email") {
        if (!this.isValidEmail(this.form.email)) {
          this.$toast.error("Please enter a valid Email");
          return;
        }
        this.generalDataEditMode.email = false;
      }
      if (value == "phone") {
        if (!this.isRequired(this.form.phone)) {
          this.$toast.error("Please enter a valid Phone Number");
          return;
        }
        this.generalDataEditMode.phone1 = false;
      }
      if (value == "address") {
        if (!this.isRequired(this.form.address)) {
          this.$toast.error(
            "Please enter a valid address (minimum 10 characters)"
          );
          return;
        }
        this.generalDataEditMode.address = false;
      }
      if (value == "name") {
        if (!this.isRequired(this.form.name)) {
          this.$toast.error("Please enter a valid Name");
          return;
        }
        this.generalDataEditMode.name = false;
      }
      var formData = {};
      switch (value) {
        case "website":
          this.webSubmitLoader = true;
          formData = {
            webSite: this.form.web ?? null,
          };
          break;
        case "email":
          this.emailSubmitLoader = true;
          formData = {
            email: this.form.email ?? null,
          };
          break;
        case "phone":
          this.phoneSubmitLoader = true;
          formData = {
            phoneNumber: this.form.phone ?? null,
          };
          break;
        case "address":
          this.addressSubmitLoader = true;
          formData = {
            address: this.form.address ?? null,
          };
          break;
        case "name":
          this.nameSubmitLoader = true;
          formData = {
            name: this.form.name ?? null,
          };
          break;
        case "map":
          this.mapSubmitLoader = true;
          formData = {
            latitude: this.mapMarkerData.lat,
            longitude: this.mapMarkerData.lng,
          };
          break;
        default:
          break;
      }
      this.$axios
        .$post(
          `/api/v2/schools/${this.$route.params.id}/contributions`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("v2_token")}`,
            },
          }
        )
        .then(async (response) => {
          if (response.succeeded) {
            switch (value) {
              case "name":
                this.contentData.name = this.form.name;
                break;
              case "website":
                this.contentData.webSite = this.form.web;
                break;
              case "phone":
                this.contentData.phoneNumber = this.form.phone;
                break;
              case "address":
                this.contentData.address = this.form.address;
                break;
              case "email":
                this.contentData.email = this.form.email;
                break;
              default:
                break;
            }
            this.$toast.success(
              "Your contribution has been successfully submitted"
            );
          } else {
            this.$toast.error(response?.errors[0]?.message);
          }
        })
        .catch((err) => {
          if (err.response.status == 401 || err.response.status == 403) {
          } else this.$toast.error(err.response.data.message);
        })
        .finally(() => {
          this.form.web = null;
          this.form.email = null;
          this.form.phone = null;
          this.form.address = null;
          this.form.name = null;
          this.mapSubmitLoader = false;
          this.selectLocationDialog = false;
          this.webSubmitLoader = false;
          this.emailSubmitLoader = false;
          this.phoneSubmitLoader = false;
          this.addressSubmitLoader = false;
          this.nameSubmitLoader = false;
        });
    },
    refreshSchoolData() {},
  },
};
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

.list-chip {
  background: var(--primary-warning-50, #fffaeb) !important;
  color: var(--primary-yellow-gama-500, #ffb600) !important;
}

#main-info-section {
  .info-itm {
    margin-bottom: 0.8rem;

    .info-sign {
      width: 5.6rem;
      min-width: 5.6rem;
      height: 5.6rem;
      border-radius: 0.6rem;
      border: 1px solid var(--Primary-Yellow-Gama-50, #fff8ed);
      background: #fff;
      box-shadow: 2px 6px 24px 0px rgba(16, 24, 40, 0.05);
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .info-data {
      width: 100%;
      min-height: 5.6rem;
      max-height: 5.6rem;
      border-radius: 0.6rem;
      border: 1px solid var(--Primary-Yellow-Gama-50, #fff8ed);
      background: var(--White, #fff);
      box-shadow: 2px 6px 24px 0px rgba(16, 24, 40, 0.05);
      display: flex;
      justify-content: left;
      padding: 1.5rem 1.6rem 1.5rem 1.6rem;
      align-items: center;
      margin-left: 0.4rem;
    }

    .info-data-address {
      max-height: 12rem;
    }
  }
}

#score-img {
  width: 16rem;
  height: 16rem;
}

.score-title {
  min-width: 22rem !important;
}

#score-results {
  .rate-title {
    width: 14rem;
    text-align: right;
  }

  .bullet {
    width: 0.8rem;
    height: 0.8rem;
    border-radius: 0.4rem;
    background: #12b76a;
    margin-top: 1.2rem;
    margin-right: 0.8rem;
  }
}

#score-form {
  padding: 0;

  .score-title {
    width: 15rem;
    margin-right: 1rem;
  }

  .bullet {
    width: 0.8rem;
    height: 0.8rem;
    border-radius: 0.4rem;
    background: #ffb600;
    margin-top: 1.2rem;
    margin-right: 0.8rem;
  }
}

.comment-card {
  .comment-card-header {
    height: 8rem;
  }
}

#advert-section {
  width: 100%;
  height: 84.4rem;
  float: right;
  flex-shrink: 0;
  border-radius: 0.6rem;
  background: var(--Primary-Grey-100, #f2f4f7);
  display: flex;
  align-items: center;
  justify-content: center;
}

.vertical-text {
  transform: rotate(-90deg);
  color: var(--Primary-Grey-500, #667085);
  text-align: center;
  font-family: Inter;
  font-size: 5rem;
  font-style: normal;
  font-weight: 400;
  line-height: 9.6rem;
  /* 192% */
  letter-spacing: 1.95rem;
}

#similar-schools {
  .list-item {
    height: 15rem;
    margin-bottom: 2rem;
    margin-left: 0.8rem;
    margin-right: 0.8rem;

    .item-info {
      .main-data {
        height: 8rem;

        .item-img img {
          width: 10.7rem;
          height: 8.1rem;
          flex-shrink: 0;
          border-radius: 0.4rem;
        }
      }
    }
  }
}

#locationPickerMapContainer {
  position: relative;
  overflow-x: hidden;

  #mapSection {
    width: 100%;
    height: 44rem;
  }

  #searchSection {
    position: absolute;
    top: 1.6rem;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 200002;
    background: #fff;
    max-width: 30rem;
  }
}

.chips-container {
  white-space: nowrap;
  overflow-x: auto;
  width: 75%;
  padding-top: 0.4rem;
  scrollbar-width: thin;
  /* Firefox */
  scrollbar-color: transparent transparent;
  /* Firefox */
}

/* Webkit (Chrome, Safari) */
.chips-container::-webkit-scrollbar {
  width: 5px;
  /* Adjust width as needed */
}

.chips-container::-webkit-scrollbar-thumb {
  background-color: transparent;
}

.chips-container::-webkit-scrollbar-track {
  background-color: transparent;
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
