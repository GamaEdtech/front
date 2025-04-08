<template>
  <v-container id="school-details">
    <v-row class="d-flex d-md-none">
      <div class="top-slide-container">
        <img v-if="contentData.pic" class="schoolDetailsImg" :class="topSlideClass.image" @click="galleryDialog = true"
          src="/images/school-default.png" alt="School image" />
        <div v-else class="enter-img-holder pointer" :class="topSlideClass.image" @click="galleryDialog = true">
          <div class="text-center">
            <v-icon :size="$vuetify.breakpoint.mdAndUp ? 48 : 24"
              class="primary-gray-300 mb-2 mb-md-10">mdi-panorama-outline</v-icon>
            <p class="gtext-t6 gtext-md-t4 primary-blue-500">Contribute</p>
          </div>
        </div>
        <client-only>
          <l-map ref="schoolMap" :zoom="map.zoom" :min-zoom="map.minZoom" :center="map.center"
            :class="topSlideClass.map" @click="selectLocationDialog = true" id="schoolDetailsMap">
            <l-tile-layer :url="map.url"></l-tile-layer>
            <l-marker @click="$router.push(`/school/1`)" :lat-lng="map.latLng" :icon="map.schoolIcon"></l-marker>
          </l-map>
        </client-only>

        <div v-if="contentData.tour">
          <client-only>
            <a-scene embedded id="schoolDetailsVr" :class="topSlideClass.tour">
              <a-sky src="/images/school-vr.png"></a-sky>
            </a-scene>
          </client-only>
        </div>
        <div v-else class="enter-img-holder pointer" :class="topSlideClass.tour" @click="openTourImgInput">
          <div class="text-center">
            <v-icon :size="$vuetify.breakpoint.mdAndUp ? 48 : 24"
              class="primary-gray-300 mb-2 mb-md-10">mdi-rotate-360</v-icon>
            <p class="gtext-t6 gtext-md-t4 primary-blue-500">Contribute</p>
          </div>
        </div>
      </div>
    </v-row>

    <v-row class="d-none d-md-flex">
      <v-col cols="12" md="4">
        <img v-if="contentData.pic" @click="galleryDialog = true" class="pointer schoolDetailsImg"
          src="/images/school-default.png" alt="School image" />
        <div v-else class="enter-img-holder pointer" @click="galleryDialog = true">
          <div class="text-center">
            <v-icon size="48" class="primary-gray-300 mb-10">mdi-panorama-outline</v-icon>
            <p class="gtext-t4 primary-blue-500">Contribute</p>
          </div>
        </div>
      </v-col>
      <v-col cols="12" md="4">
        <client-only>
          <l-map ref="schoolMap" :zoom="map.zoom" :min-zoom="map.minZoom" :center="map.center" id="schoolDetailsMap"
            @click="openLocationDialog">
            <l-tile-layer :url="map.url"></l-tile-layer>
            <l-marker :lat-lng="map.latLng" :icon="map.schoolIcon"></l-marker>
          </l-map>
        </client-only>
      </v-col>
      <v-col cols="12" md="4">
        <div v-if="contentData.tour">
          <client-only>
            <a-scene embedded id="schoolDetailsVr">
              <a-sky src="/images/school-vr.png"></a-sky>
            </a-scene>
          </client-only>
        </div>
        <div v-else class="enter-img-holder pointer" @click="openTourImgInput">
          <div class="text-center">
            <v-icon size="48" class="primary-gray-300 mb-10">mdi-rotate-360</v-icon>
            <p class="gtext-t4 primary-blue-500">Contribute</p>
          </div>
        </div>
        <v-file-input class="d-none" v-model="tourImg" ref="tourImgRef" hide-details></v-file-input>
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
            <v-btn-toggle style="order: 2" v-model="slideToggler" rounded active-class="bg-white" @change="changeSlide">
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
              {{ contentData.score ? contentData.score : "New" }}
              <v-icon size="20" color="primary"> mdi-star </v-icon>
            </div>
          </v-col>
        </v-row>

        <!-- General data section -->
        <v-row>
          <v-col cols="11" md="8">
            <h1 class="gtext-h4 gtext-sm-h4 gtext-lg-h4">
              {{ contentData.name }}
              <span v-show="contentData.school_type_title">,
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
            <div class="float-right d-flex mt-1">
              <v-icon size="20" class="primary-gray-300">mdi-heart</v-icon>
              <div class="d-none d-md-block rate-section gtext-t4 font-weight-semibold ml-4">
                {{ contentData.score ? contentData.score : "New" }}
                <v-icon size="20" color="primary"> mdi-star </v-icon>
              </div>
            </div>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" md="8">
            <div class="d-flex">
              <v-sheet class="chips-container" v-scroll-x>
                <v-chip v-if="contentData.countryTitle" class="blue-grey darken-1 white--text" small>
                  {{ contentData.countryTitle }}
                </v-chip>
                <v-chip v-if="contentData.stateTitle" class="blue-grey darken-1 white--text" small>
                  {{ contentData.stateTitle }}
                </v-chip>
                <v-chip v-if="contentData.cityTitle" class="blue-grey darken-1 white--text" small>
                  {{ contentData.cityTitle }}
                </v-chip>
                <v-chip v-if="contentData.schoolType && contentData.schoolType.name"
                  class="blue-grey darken-1 white--text" small>
                  {{ contentData?.schoolType?.name }}
                </v-chip>
                <v-chip :to="`/school?school_type=${contentData.school_type}`" v-if="contentData.school_type_title"
                  class="blue-grey darken-1 white--text" small>
                  {{ contentData.school_type_title }}
                </v-chip>
                <v-chip :to="`/school?section=${contentData.section}`" v-if="contentData.section_title"
                  class="blue-grey darken-1 white--text" small>
                  {{ contentData.section_title }}
                </v-chip>
                <v-chip :to="`/school?coed_status=${contentData.sex}`" v-if="contentData.sex_title"
                  class="blue-grey darken-1 white--text" small>
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
                <span v-show="contentData.tuition_fee"><span class="gtext-t6">$</span>
                  {{ contentData.tuition_fee | numberFormat }}</span>
                <span v-show="!contentData.tuition_fee">(N/A)</span>
              </div>
            </div>
            <div class="d-flex">
              <div class="gtext-h5 primary-gray-600">
                <div class="mb-4">Sports facilities</div>
                <div>
                  <v-btn class="bg-primary-gray-800 white--text" :disabled="contentData.sport_hall == '0'" height="56"
                    width="56">
                    <v-icon size="24"> mdi-basketball </v-icon>
                  </v-btn>
                  <v-btn class="bg-primary-gray-800 white--text" :disabled="contentData.dorm == '0'" height="56"
                    width="56">
                    <v-icon size="24"> mdi-bed </v-icon>
                  </v-btn>

                  <v-btn class="bg-primary-gray-800 white--text" :disabled="contentData.smart_class == '0'" height="56"
                    width="56">
                    <v-icon size="24"> mdi-tablet-cellphone </v-icon>
                  </v-btn>
                </div>
              </div>
              <v-spacer />
              <div @click="facilitiesDialog = true" class="gtext-t4 primary-blue-500 align-self-center pointer">
                Contribute
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="4" id="main-info-section">
            <div class="d-flex info-itm ml-md-6">
              <div class="info-sign">
                <v-icon color="primary"> mdi-web </v-icon>
              </div>
              <div class="info-data">
                <a v-show="contentData.webSite" :href="normalizeURL(contentData.webSite)" target="_blank"
                  class="blue--text">
                  {{ contentData.webSite }}
                </a>
                <span v-show="!(contentData.webSite || generalDataEditMode.website)" @click="editGeneralInfo('website')"
                  class="gtext-t4 primary-blue-500 align-self-center pointer">
                  Contribute
                </span>

                <v-text-field v-model="form.web" v-if="generalDataEditMode.website" placeholder="Website">
                  <template slot="append-outer">
                    <v-btn color="success" @click="updateGeneralInfo('website')" fab depressed x-small>
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
                <a v-show="contentData.email" :href="`mailto:${contentData.email}`">
                  {{ contentData.email }}
                </a>
                <span v-show="!(contentData.email || generalDataEditMode.email)" @click="editGeneralInfo('email')"
                  class="gtext-t4 primary-blue-500 align-self-center pointer">
                  Contribute
                </span>
                <v-text-field v-model="form.email" v-if="generalDataEditMode.email" placeholder="Email">
                  <template slot="append-outer">
                    <v-btn color="success" @click="updateGeneralInfo('email')" fab depressed x-small>
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
                <a v-show="contentData.phoneNumber" :href="`tel: ${contentData.phoneNumber}`">
                  {{ contentData.phoneNumber }}
                </a>
                <span @click="editGeneralInfo('phone')" v-show="!(contentData.phoneNumber || generalDataEditMode.phone1)
                  " class="gtext-t4 primary-blue-500 align-self-center pointer">
                  Contribute
                </span>
                <v-text-field v-model="form.phone" v-if="generalDataEditMode.phone1" placeholder="Phone">
                  <template slot="append-outer">
                    <v-btn color="success" @click="updateGeneralInfo('phone')" fab depressed x-small>
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
                <span v-show="contentData.address">{{
                  contentData.address
                  }}</span>
                <span @click="editGeneralInfo('address')" v-show="!(contentData.address || generalDataEditMode.address)"
                  class="gtext-t4 primary-blue-500 align-self-center pointer">
                  Contribute
                </span>

                <v-text-field v-model="form.address" v-if="generalDataEditMode.address" placeholder="Enter address">
                  <template slot="append-outer">
                    <v-btn color="success" @click="updateGeneralInfo('address')" fab depressed x-small>
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
              <img src="/images/score.png" id="score-img" alt="Users score" class="mr-8" />
              <div class="mt-10">
                <div class="gtext-t6 primary-gray-400 mb-10">
                  Total comments
                  <span class="primary-gray-800 font-weight-heavy">
                    {{ ratingData?.totalCount }}
                  </span>
                </div>
                <div>
                  <v-rating v-model="ratingData.averageRate" background-color="orange lighten-3" color="orange"
                    half-increments hover size="24"></v-rating>
                </div>
                <div class="gtext-t6 primary-gray-400">
                  Average score &nbsp;<span class="primary-gray-900 gtext-t4 font-weight-medium">
                    {{
                      ratingData.averageRate
                        ? ratingData.averageRate.toFixed(1)
                        : "New"
                    }} </span><span>&nbsp;/&nbsp;5</span>
                </div>
              </div>
            </div>
            <div class="mt-10 mb-12">
              <v-btn block class="bg-primary-gray-800 white--text text-transform-none gtext-t4 font-weight-medium"
                rounded x-large @click="leaveCommentDialog = true">Leave a Comment</v-btn>
            </div>
          </v-col>
          <v-col cols="12" md="8">
            <ul id="score-results pl-0 mr-4">
              <li class="d-flex mb-4">
                <div class="bullet"></div>
                <div class="gtext-t4 font-weight-medium score-title">
                  Classroom & facility quality
                </div>
                <v-progress-linear color="success" rounded :value="(ratingData.facilitiesRate * 100) / 5" height="8"
                  class="mt-3" />

                <div class="gtext-t4 font-weight-medium rate-title ml-2">
                  {{ convertRateToString(ratingData.facilitiesRate) }}
                </div>
              </li>
              <li class="d-flex mb-4">
                <div class="bullet"></div>
                <div class="gtext-t4 font-weight-medium score-title">
                  Teachers’ expertise
                </div>
                <v-progress-linear color="success" rounded :value="(ratingData.educationRate * 100) / 5" height="8"
                  class="mt-3"></v-progress-linear>

                <div class="gtext-t4 font-weight-medium rate-title ml-2">
                  {{ convertRateToString(ratingData.educationRate) }}
                </div>
              </li>
              <li class="d-flex mb-4">
                <div class="bullet"></div>
                <div class="gtext-t4 font-weight-medium score-title">
                  Tech accessibility
                </div>
                <v-progress-linear color="success" rounded :value="(ratingData.educationRate * 100) / 5" height="8"
                  class="mt-3"></v-progress-linear>

                <div class="gtext-t4 font-weight-medium rate-title ml-2">
                  {{ convertRateToString(ratingData.itTrainingRate) }}
                </div>
              </li>
              <li class="d-flex mb-4">
                <div class="bullet"></div>
                <div class="gtext-t4 font-weight-medium score-title">
                  Safety & environment
                </div>
                <v-progress-linear color="success" rounded :value="(ratingData.safetyAndHappinessRate * 100) / 5"
                  height="8" class="mt-3"></v-progress-linear>

                <div class="gtext-t4 font-weight-medium rate-title ml-2">
                  {{ convertRateToString(ratingData.safetyAndHappinessRate) }}
                </div>
              </li>
              <li class="d-flex mb-4">
                <div class="bullet"></div>
                <div class="gtext-t4 font-weight-medium score-title">
                  Staff behavior
                </div>
                <v-progress-linear color="success" rounded :value="(ratingData.behaviorRate * 100) / 5" height="8"
                  class="mt-3" />

                <div class="gtext-t4 font-weight-medium rate-title ml-2">
                  {{ convertRateToString(ratingData.behaviorRate) }}
                </div>
              </li>
              <li class="d-flex mb-4">
                <div class="bullet"></div>
                <div class="gtext-t4 font-weight-medium score-title">
                  Value for tuition
                </div>
                <v-progress-linear color="success" rounded :value="(ratingData.tuitionRatioRate * 100) / 5" height="8"
                  class="mt-3" />

                <div class="gtext-t4 font-weight-medium rate-title ml-2">
                  {{ convertRateToString(ratingData.tuitionRatioRate) }}
                </div>
              </li>
              <li class="d-flex mb-4">
                <div class="bullet"></div>
                <div class="gtext-t4 font-weight-medium score-title">
                  Sports facilities
                </div>
                <v-progress-linear color="success" rounded :value="(ratingData.facilitiesRate * 100) / 5" height="8"
                  class="mt-3"></v-progress-linear>

                <div class="gtext-t4 font-weight-medium rate-title ml-2">
                  {{ convertRateToString(ratingData.facilitiesRate) }}
                </div>
              </li>
              <li class="d-flex">
                <div class="bullet"></div>
                <div class="gtext-t4 font-weight-medium score-title">
                  Art & counseling programs
                </div>
                <v-progress-linear color="success" rounded :value="(ratingData.artisticActivitiesRate * 100) / 5"
                  height="8" class="mt-3"></v-progress-linear>

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
            <v-card v-for="comment in commentList" :key="comment.id" class="comment-card primary-gray-100 pt-4 mb-3"
              elevation="1">
              <v-card-text>
                <div class="comment-card-header">
                  <div class="d-flex float-left">
                    <v-avatar size="60">
                      <img class="profile-avatar" :src="comment.creationUserAvatar" />
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
                    <v-rating :value="comment.averageRate" background-color="orange lighten-3" color="orange"
                      half-increments size="24" readonly></v-rating>
                  </div>
                </div>
                <v-divider class="mb-5" />
                <div class="gtext-t2 primary-gray-700 mb-6">
                  “{{ comment.comment }}”
                </div>
                <div class="pb-8">
                  <div class="float-left">
                    <v-btn class="bg-primary-gray-700 white--text mr-6" fab x-small>
                      <v-icon size="14"> mdi-thumb-down </v-icon>
                    </v-btn>
                    <v-btn class="bg-primary-gray-700 white--text mr-6" fab x-small>
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
              <v-btn rounded class="text-transform-none gtext-t4 font-weight-medium" color="white" x-large>Load
                more</v-btn>
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
            <v-slide-group class="slider py-sm-4" :show-arrows="$vuetify.breakpoint.lgAndUp">
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

                          <v-chip class="list-chip gtext-t5 font-weight-medium" small>
                            Pre-K
                          </v-chip>

                          <!-- <v-chip class="primary">

             </v-chip>

             <v-chip class="primary">

             </v-chip> -->
                        </div>
                        <div class="item-img float-right">
                          <img :src="require('assets/images/default-school.png')" />
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
                          <div class="rate-section gtext-t6 font-weight-semibold mr-1">
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

                          <v-chip class="list-chip gtext-t5 font-weight-medium" small>
                            Pre-K
                          </v-chip>

                          <!-- <v-chip class="primary">

             </v-chip>

             <v-chip class="primary">

             </v-chip> -->
                        </div>
                        <div class="item-img float-right">
                          <img :src="require('assets/images/default-school.png')" />
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
                          <div class="rate-section gtext-t6 font-weight-semibold mr-1">
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
    <v-dialog transition="dialog-bottom-transition" v-model="leaveCommentDialog" :fullscreen="$vuetify.breakpoint.xs"
      max-width="924" style="z-index: 1501">
      <v-card>
        <v-card-text class="pt-6 pb-0 pt-md-8 pb-2 px-6 px-md-12">
          <div class="d-flex">
            <div class="gtext-h5 priamry-gray-700">Leave a Comment</div>
            <v-spacer></v-spacer>
            <v-btn icon><v-icon size="20" @click="leaveCommentDialog = false">mdi-close</v-icon></v-btn>
          </div>
          <v-divider class="mb-12 mt-4" />
          <v-row>
            <v-col cols="12" md="6">
              <ul id="score-form">
                <li class="d-flex mb-4">
                  <div class="bullet"></div>
                  <div class="gtext-t4 font-weight-medium primary-gray-700 score-title">
                    Classroom & facility quality
                  </div>
                  <v-rating v-model="commentForm.classesQualityRate" background-color="orange lighten-3" color="orange"
                    half-increments hover size="24"></v-rating>
                </li>
                <li class="d-flex mb-4">
                  <div class="bullet"></div>
                  <div class="gtext-t4 font-weight-medium primary-gray-700 score-title">
                    Teachers’ expertise
                  </div>
                  <v-rating v-model="commentForm.educationRate" background-color="orange lighten-3" color="orange"
                    half-increments hover size="24"></v-rating>
                </li>
                <li class="d-flex mb-4">
                  <div class="bullet"></div>
                  <div class="gtext-t4 font-weight-medium primary-gray-700 score-title">
                    Tech accessibility
                  </div>
                  <v-rating v-model="commentForm.itTrainingRate" background-color="orange lighten-3" color="orange"
                    half-increments hover size="24"></v-rating>
                </li>
                <li class="d-flex mb-4">
                  <div class="bullet"></div>
                  <div class="gtext-t4 font-weight-medium primary-gray-700 score-title">
                    Safety & environment
                  </div>
                  <v-rating v-model="commentForm.safetyAndHappinessRate" background-color="orange lighten-3"
                    color="orange" half-increments hover size="24"></v-rating>
                </li>
                <li class="d-flex mb-4">
                  <div class="bullet"></div>
                  <div class="gtext-t4 font-weight-medium primary-gray-700 score-title">
                    Staff behavior
                  </div>
                  <v-rating v-model="commentForm.behaviorRate" background-color="orange lighten-3" color="orange"
                    half-increments hover size="24"></v-rating>
                </li>
                <li class="d-flex mb-4">
                  <div class="bullet"></div>
                  <div class="gtext-t4 font-weight-medium primary-gray-700 score-title">
                    Value for tuition
                  </div>
                  <v-rating v-model="commentForm.tuitionRatioRate" background-color="orange lighten-3" color="orange"
                    half-increments hover size="24"></v-rating>
                </li>
                <li class="d-flex mb-4">
                  <div class="bullet"></div>
                  <div class="gtext-t4 font-weight-medium primary-gray-700 score-title">
                    Facilities
                  </div>
                  <v-rating v-model="commentForm.tuitionRatioRate" background-color="orange lighten-3" color="orange"
                    half-increments hover size="24"></v-rating>
                </li>
                <li class="d-flex">
                  <div class="bullet"></div>
                  <div class="gtext-t4 font-weight-medium primary-gray-700 score-title">
                    Art & counseling programs
                  </div>
                  <v-rating v-model="commentForm.artisticActivitiesRate" background-color="orange lighten-3"
                    color="orange" half-increments hover size="24"></v-rating>
                </li>
              </ul>
            </v-col>
            <v-col cols="12" md="6">
              <div style="position: relative">
                <v-textarea placeholder="Type your comment" v-model="commentForm.comment" outlined
                  :rows="$vuetify.breakpoint.xs ? 10 : 22" />
                <v-btn x-small height="40" width="40" :loading="help_loading" @click="sendToAI()" class="white--text"
                  color="teal lighten-2" style="position: absolute; right: 10px; bottom: 40px"><v-icon small
                    color="white">mdi-auto-fix</v-icon></v-btn>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="justify-center pb-13">
          <v-btn class="primary black--text text-transform-none gtext-t4 font-weight-medium" rounded width="100%"
            max-width="400" x-large :disabled="!commentForm.comment" :loading="loading.submitComment"
            @click="submitComment">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- End leave comment dialog -->

    <gallery-dialog v-model="galleryDialog" :contentData="contentData" />

    <!-- Select Location dialog -->
    <v-dialog transition="dialog-bottom-transition" v-model="selectLocationDialog" :fullscreen="$vuetify.breakpoint.xs"
      max-width="720" style="z-index: 20001">
      <v-card>
        <v-card-text class="pt-6 pt-md-8 px-6 px-md-8">
          <div class="d-flex">
            <div class="gtext-h5 priamry-gray-700">Location</div>
            <v-spacer></v-spacer>
            <v-btn icon><v-icon size="20" @click="selectLocationDialog = false">mdi-close</v-icon></v-btn>
          </div>
        </v-card-text>

        <div id="locationPickerMapContainer">
          <client-only>
            <l-map ref="editSchoolMap" :zoom="2" :center="map.center" id="mapSection" @move="updateMarkerPosition">
              <l-tile-layer :url="map.url"></l-tile-layer>
              <l-marker ref="editMapMarker" :lat-lng="map.center" :icon="map.schoolIcon"></l-marker>
            </l-map>
          </client-only>
          <locationSearch id="searchSection" @locationSelected="goToSearchLocation" rounded label="Search anything" />
        </div>
        <v-card-actions class="justify-center pb-13">
          <v-btn :loading="mapSubmitLoader" @click="updateGeneralInfo('map')"
            class="primary black--text text-transform-none gtext-t4 font-weight-medium" rounded width="100%"
            max-width="400" x-large>Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- End select location dialog -->

    <!-- Select facilites dialog -->
    <v-dialog transition="dialog-bottom-transition" v-model="facilitiesDialog" :fullscreen="$vuetify.breakpoint.xs"
      max-width="720" style="z-index: 20001">
      <v-card>
        <v-card-text class="py-6 py-md-8 px-6 px-md-8">
          <div class="d-flex">
            <div class="gtext-h5 priamry-gray-700">Facilities</div>
            <v-spacer></v-spacer>
            <v-btn icon><v-icon size="20" @click="facilitiesDialog = false">mdi-close</v-icon></v-btn>
          </div>
          <v-divider class="mb-12 mt-4" />
          <v-row>
            <v-col cols="12" md="6">
              <v-btn class="bg-primary-gray-800 white--text" :disabled="contentData.sport_hall == '0'" height="56"
                width="56">
                <v-icon size="24"> mdi-basketball </v-icon>
              </v-btn>
              <span class="gtext-t4 ml-4 font-weight-medium">Sport hall</span>
            </v-col>
            <v-col cols="12" md="6">
              <v-btn class="bg-primary-gray-800 white--text" :disabled="contentData.dorm == '0'" height="56" width="56">
                <v-icon size="24"> mdi-bed </v-icon>
              </v-btn>
              <span class="gtext-t4 ml-4 font-weight-medium">Dorm</span>
            </v-col>
            <v-col cols="12" md="6">
              <v-btn class="bg-primary-gray-800 white--text" :disabled="contentData.smart_class == '0'" height="56"
                width="56">
                <v-icon size="24"> mdi-tablet-cellphone </v-icon>
              </v-btn>
              <span class="gtext-t4 ml-4 font-weight-medium">Smart class</span>
            </v-col>
            <v-col cols="12" md="6"> </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="justify-center pb-13">
          <v-btn class="primary black--text text-transform-none gtext-t4 font-weight-medium" rounded width="100%"
            max-width="400" x-large>Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- End select facilites dialog -->
  </v-container>
</template>

<script>
import locationSearch from "@/components/Form/LocationSearch";
import GalleryDialog from "@/components/school/GalleryDialog.vue";

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

      form: {
        web: null,
        email: null,
        phone: null,
        address: null,
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
      facilitiesDialog: false,

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
      },

      mapSubmitLoader: false,

      commentList: [],

      generalDataEditMode: {
        website: false,
        email: false,
        phone1: false,
        address: false,
        map: false,
      },
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
  },
  async asyncData({ params, $axios }) {
    const baseURL = process.server
      ? `https://api.gamaedtech.com/api/v1/`
      : "/api/v2/";

    const content = await $axios.$get(`${baseURL}schools/${params.id}`);
    const rating = await $axios.$get(`${baseURL}schools/${params.id}/rate`);

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
  },
  methods: {
    convertRateToString(value) {
      if (value > 3.5) return "Good";
      else if (value > 2) return "Average";
      else if (value <= 2) return "Poor";
      else return "Unknown";
    },
    normalizeURL(url) {
      // Check if the URL starts with 'http://' or 'https://'
      if (url && !url.startsWith("http://") && !url.startsWith("https://")) {
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
      this.mapMarkerData = newCenter
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
      this.$refs.tourImgRef.$el.querySelector("input").click();
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
          - **Location:** ${this.contentData.countryTitle}, ${this.contentData.stateTitle
        }, ${this.contentData.cityTitle}
          ${this.contentData.webSite
          ? `- **Website:** ${this.contentData.webSite}`
          : ""
        }

          ### **Evaluation Criteria:**
          Rate each of the following aspects on a scale of 1 to 5 stars (as numbers) from sources like OpenStreetMap, Google Maps, and the school’s official website, then provide a brief comment base on The following aspects for school (don't repeat school name and location in comment).
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
          - A short, engaging, fact-based description including emojis (min:350 char, max 400 char), Not rely solely on the ratings but should reflect the school’s actual characteristics and unique features., Highlight both strengths and weaknesses of the school, providing a balanced perspective, Use emojis to make it more appealing

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
        .catch((err) => {
        });
    },
    editGeneralInfo(value) {
      if (value == "website") this.generalDataEditMode.website = true;
      else if (value == "email") this.generalDataEditMode.email = true;
      else if (value == "phone") this.generalDataEditMode.phone1 = true;
      else if (value == "address") this.generalDataEditMode.address = true;
      else if (value == "map") this.generalDataEditMode.map = true;
    },
    updateGeneralInfo(value) {

      if (value == "website") this.generalDataEditMode.website = false;
      else if (value == "email") this.generalDataEditMode.email = false;
      else if (value == "phone") this.generalDataEditMode.phone1 = false;
      else if (value == "address") this.generalDataEditMode.address = false;

      var formData = {}

      switch (value) {
        case "website":
          formData = {
            webSite: this.form.web ?? null,
          }
          break;
        case "email":
          formData = {
            email: this.form.email ?? null,
          }
          break;
        case "phone":
          formData = {
            phoneNumber: this.form.phone ?? null,
          }
          break;
        case "address":
          formData = {
            address: this.form.address ?? null,
          }
          break;
        case "map":
          this.mapSubmitLoader = true
          formData = {
            "latitude": this.mapMarkerData.lat,
            "longitude": this.mapMarkerData.lng,
          }
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
        .then((response) => {
          if (response.succeeded) {
            this.$toast.success("Your contribution has been successfully submitted");
          } else {
            this.$toast.error(response?.errors[0]?.message);
          }
        })
        .catch((err) => {
          if (err.response.status == 401 || err.response.status == 403) {
          } else this.$toast.error(err.response.data.message);
        })
        .finally(() => {
          this.mapSubmitLoader = false
          this.selectLocationDialog = false
        });
    },
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
  width: 80% !important;
  max-height: 26.4rem;
  overflow: hidden;
  opacity: 1;
  transition: opacity 0.5s ease-in-out;
}

.center-image.enter-img-holder {
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
  left: -35%;
  z-index: 1;
}

.under-image-left.enter-img-holder p {
  max-width: 2rem;
}

.under-image-right {
  right: -35%;
  z-index: 2;
}

.under-image-right.enter-img-holder p {
  max-width: 2rem;
}

.schoolThumbImg {
  width: 100%;
  height: 6.4247rem;
  max-height: 6.4247rem;
  border-radius: 0.4rem;
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
</style>
