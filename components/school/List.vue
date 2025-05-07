<template>
  <div id="data-list">
    <v-container id="school-list-container">
      <div v-if="resultCount > 0">
        <v-card
          rounded
          v-for="item in schoolList"
          :key="item.id"
          class="list-item"
          v-show="item.name"
          min-height="200"
          :to="`/school/${item.id}/${item.slug}`"
        >
          <v-card-text>
            <div class="item-info">
              <div style="min-height: 130px" class="main-data d-flex">
                <div>
                  <div class="d-flex">
                    <h2 class="gtext-t4 font-weight-semibold mb-4">
                      {{ item.name }}
                    </h2>
                  </div>

                  <div class="mb-2">
                    <v-chip
                      v-show="item.countryTitle"
                      class="blue-grey darken-1 white--text mb-1"
                      small
                    >
                      {{ item.countryTitle }}
                    </v-chip>
                    <v-chip
                      v-show="item.stateTitle"
                      class="blue-grey darken-1 white--text mb-1"
                      :x-small="$vuetify.breakpoint.xs"
                      small
                    >
                      {{ item.stateTitle }}
                    </v-chip>
                    <v-chip
                      v-show="item.cityTitle"
                      class="blue-grey darken-1 white--text mb-1"
                      small
                    >
                      {{ item.cityTitle }}
                    </v-chip>
                  </div>

                  <!-- <v-chip class="primary">

             </v-chip> -->

                  <v-chip
                    v-if="item.school_type_title"
                    class="list-chip gtext-t5 font-weight-medium"
                    small
                  >
                    {{ item.school_type_title }}
                  </v-chip>

                  <!-- <v-chip class="primary">

             </v-chip>

             <v-chip class="primary">

             </v-chip> -->
                </div>
                <div class="item-img mb-1" v-show="isExpanded">
                  <v-img
                    max-height="130"
                    height="130"
                    class="rounded"
                    v-show="item.coverImage"
                    :src="item.coverImage"
                  />
                </div>
              </div>
              <v-divider class="mb-2" />
              <div class="item-footer">
                <div class="float-left">
                  <v-btn :disabled="!item.hasLocation" icon>
                    <v-icon> mdi-map-marker </v-icon>
                  </v-btn>
                  <v-btn :disabled="!item.hasPhone" icon>
                    <v-icon> mdi-phone </v-icon>
                  </v-btn>
                  <v-btn :disabled="!item.hasEmail" icon>
                    <v-icon> mdi-email </v-icon>
                  </v-btn>
                  <v-btn :disabled="!item.hasWebsite" icon>
                    <v-icon> mdi-web </v-icon>
                  </v-btn>
                </div>

                <div class="float-right d-flex mt-1">
                  <div class="rate-section gtext-t6 font-weight-semibold mr-4">
                    <v-icon color="primary"> mdi-star </v-icon>
                    {{ item.score ? item.score.toFixed(1) : "New" }}
                  </div>
                  <div class="gtext-t6 primary-gray-300">
                    <v-icon>mdi-update</v-icon>
                    <span class="primary-gray-600">{{
                      $moment(item.lastModifyDate).format("YYYY-MM-DD")
                    }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- <div class="item-img" v-show="!isExpanded">
              <img
                class="float-right"
                :src="require('assets/images/default-school.png')"
              />
            </div> -->
          </v-card-text>
        </v-card>

        <v-card class="list-item" v-if="!allDataLoaded">
          <div class="item-info">
            <div class="main-data">
              <v-skeleton-loader
                type="card-heading, list-item-two-line"
              ></v-skeleton-loader>
            </div>
            <div></div>
          </div>
        </v-card>
      </div>
      <div v-else-if="resultCount == 0 && schoolLoading == false">
        <span class="gtext-t4"> Opps! no data found </span>
      </div>
      <!-- <div v-else>
        <v-card class="list-item" v-for="i in 4" :key="i">
          <div class="item-info">
            <div class="main-data">
              <v-skeleton-loader
                type="card-heading, list-item-two-line"
              ></v-skeleton-loader>
            </div>
            <div></div>
          </div>
        </v-card>
      </div> -->
    </v-container>
  </div>
</template>

<script>
export default {
  name: "school-data-list",
  props: {
    isExpanded: true,
    schoolList: [],
    schoolLoading: true,
    resultCount: 0,
    allDataLoaded: false,
  },
  data() {
    return {};
  },
};
</script>
