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
                  variant="text"
                >
                  <v-icon size="large"> mdi-pencil </v-icon>
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
                  v-show="contentData.countryTitle"
                  class="blue-grey darken-1 white--text"
                  small
                >
                  {{ contentData.countryTitle }}
                </v-chip>
                <v-chip
                  v-show="contentData.stateTitle"
                  class="blue-grey darken-1 white--text"
                  small
                >
                  {{ contentData.stateTitle }}
                </v-chip>
                <v-chip
                  v-show="contentData.cityTitle"
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
            <!-- <Facilities
              :facilities="contentData.tags"
              @open-auth-dialog="openAuthDialog"
              @facilities-updated="refreshSchoolData"
            /> -->
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
                    variant="text"
                  >
                    <v-icon size="large"> mdi-pencil </v-icon>
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
                    variant="text"
                  >
                    <v-icon size="large"> mdi-pencil </v-icon>
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
                    variant="text"
                  >
                    <v-icon size="large"> mdi-pencil </v-icon>
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
                    variant="text"
                  >
                    <v-icon size="large"> mdi-pencil </v-icon>
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
                @click="showLeaveCommentDialog = true"
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
              :show-arrows="display.lgAndUp.value"
            >
              <v-slide-item>
                <v-card rounded class="list-item" :to="`/school/`">
                  <v-card-text>
                    <div class="item-info">
                      <div class="main-data">
                        <div class="float-left">
                          <h2 class="gtext-t4 font-weight-semibold mb-4">
                            School name School nament
                          </h2>
                          <v-chip
                            class="list-chip gtext-t5 font-weight-medium"
                            small
                          >
                            Pre-K
                          </v-chip>
                        </div>
                        <div class="item-img float-right">
                          <img src="/images/default-school.png" />
                        </div>
                      </div>
                      <v-divider class="mb-3" />
                      <div class="item-footer">
                        <div class="float-left">
                          <v-btn icon>
                            <v-icon> mdi-map-marker </v-icon>
                          </v-btn>
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
                                $dayjs(contentData.up_date).format("YYYY/MM/DD")
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
                          <v-chip
                            class="list-chip gtext-t5 font-weight-medium"
                            small
                          >
                            Pre-K
                          </v-chip>
                        </div>
                        <div class="item-img float-right">
                          <img src="/images/default-school.png" />
                        </div>
                      </div>
                      <v-divider class="mb-3" />
                      <div class="item-footer">
                        <div class="float-left">
                          <v-btn icon>
                            <v-icon> mdi-map-marker </v-icon>
                          </v-btn>
                        </div>

                        <div class="float-right d-flex mt-1">
                          <div
                            class="rate-section gtext-t6 font-weight-semibold mr-1"
                          >
                            4
                            <v-icon color="primary"> mdi-star </v-icon>
                          </div>
                          <div class="gtext-t6 primary-gray-300">
                            Update:
                            <span class="primary-gray-600">
                              {{
                                $dayjs(contentData.up_date).format("YYYY/MM/DD")
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
    <LeaveCommentDialog
      v-model="showLeaveCommentDialog"
      :commentForm="commentForm"
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
import { ref, reactive, computed, onMounted, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAsyncData, useNuxtApp } from "#imports";
import locationSearch from "@/components/form/LocationSearch.vue";
import GalleryDialog from "@/components/school/GalleryDialog.vue";
import ReportDialog from "@/components/school/ReportDialog.vue";
import Facilities from "@/components/school/detail/Facilities.vue";
import { useDisplay } from "vuetify/lib/composables/display";
import SelectLocationDialog from "@/components/common/SelectLocationDialog.vue";
import LeaveCommentDialog from "@/components/common/LeaveCommentDialog.vue";

const nuxtApp = useNuxtApp();
const route = useRoute();
const router = useRouter();
const display = useDisplay();
// State
const cropperDialog = ref(false);
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
const rating = ref(3.5);
const slideToggler = ref("map");
const topSlideClass = reactive({
  image: "under-image-left",
  map: "center-image",
  tour: "under-image-right",
});
const showLeaveCommentDialog = ref(false);
const showGalleryDialog = ref(false);
const commentForm = reactive({
  comment: "",
  classesQualityRate: 4.5,
  educationRate: 4,
  itTrainingRate: 4,
  safetyAndHappinessRate: 3.5,
  behaviorRate: 4,
  tuitionRatioRate: 5,
  facilitiesRate: 4.5,
  artisticActivitiesRate: 4,
});
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
const webUrlRule = [
  (v) =>
    !v ||
    /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/.test(
      v
    ) ||
    "Please enter a valid URL",
  (v) => !v || v.length <= 255 || "URL must be less than 255 characters",
];
const emailRule = [
  (v) => !!v || "Email is required",
  (v) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ||
    "Please enter a valid email address",
];
const phoneRule = [(v) => !!v || "Phone number is required"];
const nameRule = [(v) => !!v || "Name is required"];
const addressRule = [(v) => !!v || "Address is required"];
const reportDialog = ref(false);
const contentData = ref({});
const ratingData = ref({});

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

// Methods
function convertRateToString(value) {
  if (value > 3.5) return "Good";
  else if (value > 2) return "Average";
  else if (value <= 2) return "Poor";
  else return "Unknown";
}
function openGalleryDialog() {
  console.log("openGalleryDialog");

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
function normalizeURL(url) {
  if (!url) return "";
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return "http://" + url;
  }
  return url;
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
function isValidPhone(phone) {
  try {
    const phoneRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return phoneRegex.test(phone);
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
function editGeneralInfo(value) {
  if (value == "website") {
    form.web = contentData.value.webSite || "";
    generalDataEditMode.website = true;
  } else if (value == "email") {
    form.email = contentData.value.email || "";
    generalDataEditMode.email = true;
  } else if (value == "phone") {
    form.phone = contentData.value.phoneNumber || "";
    generalDataEditMode.phone1 = true;
  } else if (value == "address") {
    form.address = contentData.value.address || "";
    generalDataEditMode.address = true;
  } else if (value == "map") {
    generalDataEditMode.map = true;
  } else if (value == "name") {
    form.name = contentData.value.name || "";
    generalDataEditMode.name = true;
  }
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
