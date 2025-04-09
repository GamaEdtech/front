<!-- in refactor proccess -->

<template>
  <div class="content-items">
    <v-card
      class="mb-1 content-item rounded-sm"
      v-for="(item, key) in items"
      :key="item.id"
    >
      <v-card-text class="pb-0">
        <div class="d-flex">
          <div class="pb-4 py-sm-4 img-holder">
            <div class="item-img">
              <v-img
                v-if="item.lesson_pic"
                @error="imgErrorHandler(item, key)"
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
                <div
                  class="item-content-title gama-text-button d-flex justify-space-between"
                >
                  <nuxt-link
                    :to="`/qa/${item.id}/${item.title_url}`"
                    ref="mathjaxEl"
                  >
                    {{ item.title }}
                  </nuxt-link>
                </div>
                <nuxt-link
                  class="item-content-subtitle gama-text-caption my-2 d-none d-sm-block"
                  :to="`/qa/${item.id}/${item.title_url}`"
                >
                  {{ item.question }}
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
              >
                <v-row>
                  <v-col cols="12" class="px-0">
                    <div class="d-flex pt-3 pt-md-0">
                      <div
                        class="item-content-last-update gama-text-overline d-flex align-center mr-auto"
                      >
                        <i class="fa-solid fa-reply fa-xl"></i>
                        <span class="mx-2">
                          <span class="d-none d-sm-inline"> Reply: </span>
                          <span class="date_string d-inline-block">
                            {{ item.reply_num }}
                          </span>
                        </span>
                      </div>
                      <div
                        class="item-content-last-update gama-text-overline d-flex align-center mr-auto"
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
                  <v-col cols="4">
                    <div
                      class="text-right align-right float-right d-flex align-content-center"
                    >
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
              <!--End item card footer-->
            </v-card>
          </div>
        </div>
      </v-card-text>
      <v-card-actions class="item-content-footer pt-0 d-block d-sm-none">
        <v-row>
          <v-col cols="12" class="py-0">
            <div class="d-flex pt-2">
              <div
                class="item-content-last-update gama-text-overline d-flex align-center mr-auto ml-1"
              >
                <i class="fa-solid fa-reply"></i>
                <span>
                  <span class="d-none d-lg-inline"> Reply: </span>
                  <span class="date_string d-inline-block ml-1">
                    {{ item.reply_num }}
                  </span>
                </span>
              </div>
              <div
                class="item-content-last-update gama-text-overline d-flex align-center mr-auto"
              >
                <i class="fa-solid fa-calendar-days"></i>
                <span class="mx-2">
                  <span class="d-none d-lg-inline"> Last update: </span>
                  <span class="date_string d-inline-block">
                    {{ $dayjs(item.up_date).fromNow() }}
                  </span>
                </span>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "q-a-list",
  props: ["items"],
  data() {
    return {};
  },
  watch: {
    items() {
      this.renderMathJax();
    },
  },
  mounted() {},
  methods: {
    renderMathJax() {
      if (window.MathJax) {
        window.MathJax.Hub.Queue([
          "Typeset",
          window.MathJax.Hub,
          this.$refs.mathJaxEl,
        ]);
      }
    },
    imgErrorHandler(item, key) {
      this.items[key].lesson_pic = "";
    },
  },
  computed: {
    display() {
      return useGlobalDisplay(); // Call the composable
    },
  },
};
</script>
