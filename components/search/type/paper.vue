<template>
  <div class="content-items">
    <v-card
      class="mb-1 content-item rounded-sm"
      v-for="item in items"
      :key="item.value"
    >
      <v-card-text class="pb-0">
        <div class="d-flex">
          <div class="pb-4 py-sm-4 img-holder">
            <div class="item-img">
              <v-img
                v-if="item.lesson_pic"
                :src="item.lesson_pic"
                :alt="item.lesson_title"
                class="item-image"
              >
                <template v-slot:placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular
                      indeterminate
                      color="grey lighten-5"
                    ></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
              <v-card
                v-else
                class="book-no-img mx-autofill-height align-center justify-center"
              >
                <p class="font-weight-bold mb-2">{{ item.lesson_title }}</p>
                <a href="https://gamatrain.com">Gamatrain.com</a>
              </v-card>
            </div>
          </div>
          <div class="content-holder pb-4 py-sm-4">
            <v-card
              flat
              class="fill-height tutorial-content d-flex flex-column pl-3 justify-space-between"
            >
              <v-card-text class="pa-0">
                <div
                  class="item-content-title gama-text-button d-flex justify-space-between"
                >
                  <nuxt-link :to="`/paper/${item.id}/${item.title_url}`">
                    {{ item.title }}
                  </nuxt-link>
                </div>
                <nuxt-link
                  class="item-content-subtitle gama-text-caption my-2 d-none d-sm-block"
                  :to="`/paper/${item.id}/${item.title_url}`"
                >
                  <span v-html="item.description"></span>
                </nuxt-link>
                <div class="mt-3">
                  <v-chip
                    class="mr-1 mb-1 blue-grey darken-1 white--text"
                    :x-small="display.xs"
                    :small="!display.xs"
                    :to="`/search?type=${$route.query.type}&section=${item.section}&base=${item.base}&lesson=${item.lesson}`"
                  >
                    {{ item.lesson_title }}
                  </v-chip>
                  <v-chip
                    :to="`/search?type=${$route.query.type}&section=${item.section}&base=${item.base}`"
                    class="mr-1 mb-1 blue-grey darken-1 white--text"
                    :x-small="display.xs"
                    :small="!display.xs"
                  >
                    {{ item.base_title }}
                  </v-chip>
                  <v-chip
                    :x-small="display.xs"
                    :small="!display.xs"
                    class="mr-1 mb-1 blue-grey darken-1 white--text"
                    :to="`/search?type=${$route.query.type}&section=${item.section}`"
                  >
                    {{ item.section_title }}
                  </v-chip>
                </div>
              </v-card-text>
              <!--Item card footer-->
              <v-card-actions
                class="item-content-footer pb-2 d-none d-sm-block"
                style="min-height: unset !important"
              >
                <v-row>
                  <v-col cols="10" sm="10" md="10" lg="11" class="px-0">
                    <div class="d-flex pt-3 pt-md-0">
                      <div
                        class="item-content-last-update gama-text-overline d-flex align-center mr-auto"
                      >
                        <i class="fa-solid fa-sticky-note fa-xl"></i>
                        <span class="mx-2">
                          <span class="d-none d-lg-inline">
                            Classification:
                          </span>
                          <span class="date_string d-inline-block">
                            {{ item.test_type_title }}
                          </span>
                        </span>
                      </div>
                      <div
                        class="item-content-last-update gama-text-overline d-flex align-center mx-auto"
                      >
                        <i class="fa-solid fa-eye fa-xl"></i>
                        <span class="mx-2">
                          <span class="d-none d-lg-inline"> Views: </span>
                          <span class="date_string d-inline-block">
                            {{ item.views }}
                          </span>
                        </span>
                      </div>
                      <div
                        class="item-content-last-update gama-text-overline d-flex align-center mx-auto"
                      >
                        <i class="fa-solid fa-calendar-days fa-xl"></i>
                        <span class="mx-2">
                          <span class="d-none d-lg-inline"> Last update: </span>
                          <span class="date_string d-inline-block">
                            {{ $dayjs(item.up_date).fromNow() }}
                          </span>
                        </span>
                      </div>
                    </div>
                  </v-col>
                  <v-col cols="3" sm="2" md="2" lg="1">
                    <div
                      class="text-right align-right float-right d-flex align-content-center"
                    >
                      <nuxt-link
                        icon
                        :to="`/paper/${item.id}/${item.title_url}`"
                      >
                        <span
                          v-show="item.q_file_word"
                          class="fa-solid fa-file-word fa-2xl blue--text"
                        ></span>
                      </nuxt-link>
                      <nuxt-link
                        icon
                        :to="`/paper/${item.id}/${item.title_url}`"
                      >
                        <span
                          v-show="item.q_file"
                          class="fa-solid fa-file-pdf fa-2xl red--text pl-1"
                        ></span>
                      </nuxt-link>
                    </div>
                  </v-col>
                </v-row>
              </v-card-actions>
              <!--End item card footer-->
            </v-card>
          </div>
        </div>
      </v-card-text>
      <v-card-actions class="item-content-footer py-0 d-block d-sm-none">
        <v-row>
          <v-col cols="10" class="py-0">
            <div class="d-flex pt-3">
              <div
                class="item-content-last-update gama-text-overline d-flex align-center mr-auto ml-1"
              >
                <i class="fa-solid fa-sticky-note"></i>
                <span class="mx-2">
                  <span class="d-none d-sm-inline"> Classification: </span>
                  <span class="date_string d-inline-block">
                    {{ item.test_type_title }}
                  </span>
                </span>
              </div>
              <div
                class="item-content-last-update gama-text-overline d-flex align-center mx-auto"
              >
                <i class="fa-solid fa-eye"></i>
                <span class="mx-2">
                  <span class="d-none d-sm-inline"> Views: </span>
                  <span class="date_string d-inline-block">
                    {{ item.views }}
                  </span>
                </span>
              </div>
              <div
                class="item-content-last-update gama-text-overline d-flex align-center mx-auto"
              >
                <i class="fa-solid fa-calendar-days"></i>
                <span class="mx-2">
                  <span class="d-none d-sm-inline"> Last update: </span>
                  <span class="date_string d-inline-block">
                    {{ $dayjs(item.up_date).fromNow() }}
                  </span>
                </span>
              </div>
            </div>
          </v-col>
          <v-col cols="2" class="py-2">
            <div class="text-right align-right float-right d-flex">
              <nuxt-link icon :to="`/paper/${item.id}/${item.title_url}`">
                <span
                  v-show="item.q_file_word"
                  class="fa-solid fa-file-word fa-lg blue--text"
                ></span>
              </nuxt-link>
              <nuxt-link icon :to="`/paper/${item.id}/${item.title_url}`">
                <span
                  v-show="item.q_file"
                  class="fa-solid fa-file-pdf fa-lg red--text pl-1"
                ></span>
              </nuxt-link>
            </div>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { computed } from "vue";

// Define props
const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
});

// Get the route
const route = useRoute();

// Get display settings
const display = computed(() => {
  return useGlobalDisplay();
});
</script>

<style scoped>
.v-card > .v-card__progress + :not(.v-btn):not(.v-chip):not(.v-avatar),
.v-card > :first-child:not(.v-btn):not(.v-chip):not(.v-avatar) {
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
}
.theme--light.v-card > .v-card__subtitle,
.theme--light.v-card > .v-card__text {
  color: rgba(0, 0, 0, 0.6);
}
.v-application .pb-0 {
  padding-bottom: 0 !important;
}
.v-card__text {
  width: 100%;
}
.search-page .search-contents .content-items .content-item {
  border-bottom: 0.1rem solid #e1e2e3;
  border-radius: 20rem;
  border-right: 0.1rem solid #e1e2e3;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1) !important;
  margin-bottom: 0.8rem !important;
}
.search-page .search-contents .v-card:not(.v-sheet--outlined) {
  box-shadow: none;
}
.v-sheet.v-card:not(.v-sheet--outlined) {
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
}
@media (min-width: 600px) {
  .content-items .content-item {
    min-height: 18.5rem !important;
  }
}
.v-sheet.v-card {
  border-radius: 8px;
}
.theme--light.v-card {
  background-color: #fff;
  color: rgba(0, 0, 0, 0.87);
}
.v-application .rounded {
  border-radius: 8px !important;
}
a {
  line-clamp: 2 !important;
  -webkit-line-clamp: 2 !important;
}
.theme--light.v-chip:not(.v-chip--active) {
  background: #e0e0e0;
}
.v-application .blue-grey.darken-1 {
  background-color: #546e7a !important;
  border-color: #546e7a !important;
}
.v-chip.v-size--small {
  border-radius: 12px;
  font-size: 15px !important;
  height: 24px;
}
.theme--light.v-chip {
  border-color: rgba(0, 0, 0, 0.12);
  color: rgba(0, 0, 0, 0.87);
}
.v-application .mb-1 {
  margin-bottom: 4px !important;
}
.v-application .mr-1 {
  margin-right: 4px !important;
}
.v-application .blue-grey {
  background-color: #607d8b !important;
  border-color: #607d8b !important;
}
.v-application .white--text {
  caret-color: #fff !important;
  color: #fff !important;
}
body .v-application a {
  color: inherit;
  -webkit-text-decoration: none;
  text-decoration: none;
}
.v-application a {
  cursor: pointer;
}
.v-application a {
  color: #ffb300;
}
.theme--light.v-chip:not(.v-chip--active) {
  background: #e0e0e0;
}
.v-application .blue-grey.darken-1 {
  background-color: #546e7a !important;
  border-color: #546e7a !important;
}
.v-chip.v-size--small {
  border-radius: 12px;
  font-size: 12px;
  height: 24px;
}
.theme--light.v-chip {
  border-color: rgba(0, 0, 0, 0.12);
  color: rgba(0, 0, 0, 0.87);
}
.v-application .mb-1 {
  margin-bottom: 4px !important;
}
.v-application .mr-1 {
  margin-right: 4px !important;
}
.v-application .blue-grey {
  background-color: #607d8b !important;
  border-color: #607d8b !important;
}
.v-application .white--text {
  caret-color: #fff !important;
  color: #fff !important;
}
body .v-application a {
  color: inherit;
  -webkit-text-decoration: none;
  text-decoration: none;
}
.v-application a {
  cursor: pointer;
}
.v-application a {
  color: #ffb300;
}
.v-chip--clickable {
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}
.v-chip {
  align-items: center;
  cursor: default;
  display: inline-flex;
  line-height: 20px;
  max-width: 100%;
  outline: none;
  overflow: hidden;
  padding: 0 12px;
  position: relative;
  -webkit-text-decoration: none;
  text-decoration: none;
  transition-duration: 0.28s;
  transition-property: box-shadow, opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  vertical-align: middle;
  white-space: nowrap;
}
.v-application .mb-1 {
  margin-bottom: 4px !important;
}
.v-application .mr-1 {
  margin-right: 4px !important;
}
.v-application .blue-grey {
  background-color: #607d8b !important;
  border-color: #607d8b !important;
}
.v-application .white--text {
  caret-color: #fff !important;
  color: #fff !important;
}
.v-application .pl-1 {
  padding-left: 4px !important;
}

.v-application .red--text {
  caret-color: #f44336 !important;
  color: #f44336 !important;
}
.fa-solid,
.fas {
  font-family: "Font Awesome 6 Free";
  font-weight: 900;
}
.fa-2xl {
  font-size: 2em;
  line-height: 0.03125em;
  vertical-align: -0.1875em;
}
.v-chip .v-chip__content {
  align-items: center;
  display: inline-flex;
  height: 100%;
  max-width: 100%;
}
.v-card > .v-card__progress + :not(.v-btn):not(.v-chip):not(.v-avatar),
.v-card > :first-child:not(.v-btn):not(.v-chip):not(.v-avatar) {
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
}
.theme--light.v-card > .v-card__subtitle,
.theme--light.v-card > .v-card__text {
  color: rgba(0, 0, 0, 0.6);
}
.v-application .pb-0 {
  padding-bottom: 0 !important;
}
.v-card__text {
  width: 100%;
}
.v-card__subtitle,
.v-card__text,
.v-card__title {
  padding: 16px;
}
.v-card__subtitle,
.v-card__text {
  font-size: 0.875rem;
  font-weight: 400;
  letter-spacing: 0.0071428571em;
  line-height: 1.375rem;
}
</style>
