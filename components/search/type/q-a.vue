<template>
  <div class="content-items" ref="mathJaxContainerRef">
    <v-card
      class="mb-1 content-item rounded-sm"
      v-for="item in items"
      :key="item.id"
    >
      <v-card-text class="pb-0">
        <div class="d-flex">
          <div class="pb-4 py-sm-4 img-holder">
            <div class="item-img">
              <v-img
                v-if="item.lesson_pic"
                @error="imgErrorHandler(item)"
                :src="item.lesson_pic"
                :alt="item.lesson_title"
                class="item-image"
              >
              </v-img>
              <v-card
                v-else
                class="book-no-img mx-auto fill-height align-center justify-center"
              >
                <v-card-text class="px-0">
                  <p class="font-weight-bold mb-3 mt-1">
                    {{ item.lesson_title }}
                  </p>
                  <a href="https://gamatrain.com">Gamatrain.com</a>
                </v-card-text>
              </v-card>
            </div>
          </div>
          <div class="content-holder pb-4 py-sm-4">
            <v-card
              flat
              class="tutorial-content d-flex flex-column pl-3 justify-space-between"
            >
              <v-card-text class="pa-0">
                <div class="item-content-title gama-text-button d-flex justify-space-between">
                  <nuxt-link :to="`/qa/${item.id}/${item.title_url}`">
                    <span v-html="item.title"></span>
                  </nuxt-link>
                </div>
                <nuxt-link
                  class="item-content-subtitle gama-text-caption my-2 d-none d-sm-block"
                  :to="`/qa/${item.id}/${item.title_url}`"
                >
                  <span v-html="item.question"></span>
                </nuxt-link>
                <div class="mt-3">
                  <v-chip
                    class="mr-1 mb-1 blue-grey darken-1 white--text"
                    :x-small="display.xs"
                    :small="!display.xs"
                    :to="`/search?type=${route.query.type}&section=${item.section}&base=${item.base}&lesson=${item.lesson}`"
                  >
                    {{ item.lesson_title }}
                  </v-chip>
                  <v-chip
                    :to="`/search?type=${route.query.type}&section=${item.section}&base=${item.base}`"
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
                    :to="`/search?type=${route.query.type}&section=${item.section}`"
                  >
                    {{ item.section_title }}
                  </v-chip>
                </div>
              </v-card-text>
              <v-card-actions
                class="item-content-footer pb-2 d-none d-sm-block"
                style="min-height: unset !important;"
              >
                <v-row>
                  <v-col cols="12" class="px-0">
                    <div class="d-flex pt-3 pt-md-0">
                      <div class="item-content-last-update gama-text-overline d-flex align-center mr-auto">
                        <i class="fa-solid fa-reply fa-xl"></i>
                        <span class="mx-2">
                          <span class="d-none d-sm-inline"> Reply: </span>
                          <span class="date_string d-inline-block">{{ item.reply_num }}</span>
                        </span>
                      </div>
                      <div class="item-content-last-update gama-text-overline d-flex align-center mr-auto">
                        <i class="fa-solid fa-calendar-days fa-xl"></i>
                        <span class="mx-2">
                          <span class="d-none d-lg-inline"> Last update: </span>
                          <span class="date_string d-inline-block">{{ $dayjs(item.up_date).fromNow() }}</span>
                        </span>
                      </div>
                    </div>
                  </v-col>
                  <v-col cols="4">
                    <div class="text-right align-right float-right d-flex align-content-center">
                      <nuxt-link icon :to="`/qa/${item.id}/${item.title_url}`">
                        <span
                          v-show="item.q_file_word"
                          class="fa-solid fa-file-word fa-2xl blue--text"
                        ></span>
                      </nuxt-link>
                      <nuxt-link icon :to="`/qa/${item.id}/${item.title_url}`">
                        <span
                          v-show="item.q_file"
                          class="fa-solid fa-file-pdf fa-2xl red--text pl-1"
                        ></span>
                      </nuxt-link>
                    </div>
                  </v-col>
                </v-row>
              </v-card-actions>
            </v-card>
          </div>
        </div>
      </v-card-text>
      <v-card-actions class="item-content-footer pt-0 d-block d-sm-none">
        <v-row>
          <v-col cols="12" class="py-0">
            <div class="d-flex pt-2">
              <div class="item-content-last-update gama-text-overline d-flex align-center mr-auto ml-1">
                <i class="fa-solid fa-reply"></i>
                <span>
                  <span class="d-none d-lg-inline"> Reply: </span>
                  <span class="date_string d-inline-block ml-1">{{ item.reply_num }}</span>
                </span>
              </div>
              <div class="item-content-last-update gama-text-overline d-flex align-center mr-auto">
                <i class="fa-solid fa-calendar-days"></i>
                <span class="mx-2">
                  <span class="d-none d-lg-inline"> Last update: </span>
                  <span class="date_string d-inline-block">{{ $dayjs(item.up_date).fromNow() }}</span>
                </span>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted, type PropType } from 'vue';
import { useNuxtApp, useRoute } from '#app';

import { useGlobalDisplay } from '~/composables/useGlobalDisplay';

interface QaItem {
  id: number | string;
  lesson_pic?: string;
  lesson_title: string;
  title: string;
  question: string;
  title_url: string;
  section: string;
  base: string;
  lesson: string;
  reply_num: number;
  up_date: string;
  q_file_word?: string;
  q_file?: string;
  section_title: string;
  base_title: string;
}

const props = defineProps({
  items: {
    type: Array as PropType<QaItem[]>,
    required: true,
  },
});

const route = useRoute();

const display = useGlobalDisplay();
const { $dayjs } = useNuxtApp();

const mathJaxContainerRef = ref<HTMLElement | null>(null);
const { $renderMathInElement, $ensureMathJaxReady } = useNuxtApp();

const typesetMathInContainer = async () => {
  if (process.client && mathJaxContainerRef.value) {
    try {
      await $ensureMathJaxReady();
      if (!window.MathJax || !window.MathJax.Hub) return;

      const elementToProcess = mathJaxContainerRef.value;
      
      if (elementToProcess instanceof HTMLElement) {
        await nextTick();
        $renderMathInElement(elementToProcess);
      }
    } catch (error) {
      console.error('Error during MathJax typesetting in q-a.vue:', error);
    }
  }
};
  
onMounted(() => {
  typesetMathInContainer();
});

watch(() => props.items, () => {
  nextTick(() => {
    typesetMathInContainer();
  });
}, { deep: true });


const imgErrorHandler = (item: QaItem) => {
  if (item) {
    item.lesson_pic = '';
  }
};
</script>
<style scoped>

.v-card>.v-card__progress+:not(.v-btn):not(.v-chip):not(.v-avatar), .v-card>:first-child:not(.v-btn):not(.v-chip):not(.v-avatar) {
    border-top-left-radius: inherit;
    border-top-right-radius: inherit;
}
.theme--light.v-card>.v-card__subtitle, .theme--light.v-card>.v-card__text {
    color: rgba(0, 0, 0, .6);
}
.v-application .pb-0 {
    padding-bottom: 0 !important;
}
.v-card__text {
    width: 100%;
}
.search-page .search-contents .content-items .content-item {
    border-bottom: .1rem solid #e1e2e3;
    border-radius: 20rem;
    border-right: .1rem solid #e1e2e3;
    box-shadow: 0 2px 10px rgba(0, 0, 0, .1) !important;
    margin-bottom: .8rem !important;
}
.search-page .search-contents .v-card:not(.v-sheet--outlined) {
    box-shadow: none;
}
.v-sheet.v-card:not(.v-sheet--outlined) {
    box-shadow: 0 3px 1px -2px rgba(0, 0, 0, .2), 0 2px 2px 0 rgba(0, 0, 0, .14), 0 1px 5px 0 rgba(0, 0, 0, .12);
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
    color: rgba(0, 0, 0, .87);
}
.v-application .rounded {
    border-radius: 8px !important;
}
a{
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
    border-color: rgba(0, 0, 0, .12);
    color: rgba(0, 0, 0, .87);
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
}.theme--light.v-chip:not(.v-chip--active) {
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
    border-color: rgba(0, 0, 0, .12);
    color: rgba(0, 0, 0, .87);
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
    display: inline-flex
;
    line-height: 20px;
    max-width: 100%;
    outline: none;
    overflow: hidden;
    padding: 0 12px;
    position: relative;
    -webkit-text-decoration: none;
    text-decoration: none;
    transition-duration: .28s;
    transition-property: box-shadow, opacity;
    transition-timing-function: cubic-bezier(.4,0,.2,1);
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
.fa-solid, .fas {
    font-family: "Font Awesome 6 Free";
    font-weight: 900;
}
.fa-2xl {
    font-size: 2em;
    line-height: .03125em;
    vertical-align: -.1875em;
}
.v-chip .v-chip__content {
    align-items: center;
    display: inline-flex
;
    height: 100%;
    max-width: 100%;
}
.v-card>.v-card__progress+:not(.v-btn):not(.v-chip):not(.v-avatar), .v-card>:first-child:not(.v-btn):not(.v-chip):not(.v-avatar) {
    border-top-left-radius: inherit;
    border-top-right-radius: inherit;
}
.theme--light.v-card>.v-card__subtitle, .theme--light.v-card>.v-card__text {
    color: rgba(0, 0, 0, .6);
}
.v-application .pb-0 {
    padding-bottom: 0 !important;
}
.v-card__text {
    width: 100%;
}
.v-card__subtitle, .v-card__text, .v-card__title {
    padding: 16px;
}
.v-card__subtitle, .v-card__text {
    font-size: .875rem;
    font-weight: 400;
    letter-spacing: .0071428571em;
    line-height: 1.375rem;
}
</style>

