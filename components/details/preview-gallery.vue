<template>
  <div>
    <section id="details-gallery-portrate" class="rounded-lg">
      <div class="card-carousel">
        <v-row justify="center">
          <!--Mobile side section-->
          <v-col
            cols="12"
            class="pr-0 d-flex d-md-none overflow-x-auto mt-3 mt-md-0"
          >
            <v-btn
              icon
              large
              :to="`${item.link}&state=${help_link_data.state}&section=${help_link_data.section}&base=${help_link_data.base}&course=${help_link_data.course}
                  &lesson=${help_link_data.lesson}`"
              v-for="(item, index) in items"
              :key="index"
              class="bg-blue-grey-darken-2 mx-3"
            >
              <v-tooltip location="right">
                <template v-slot:activator="{ props }">
                  <span
                    v-bind="props"
                    style="font-size: 26px"
                    :class="
                      'white--text text--lighten-1 icon icon-' + item.icon
                    "
                  />
                </template>
                <span>{{ item.text }}</span>
              </v-tooltip>
            </v-btn>
          </v-col>
          <!--End mobile side section-->

          <!--Desktop side section-->
          <v-col
            cols="2"
            xl="2"
            class="pr-0 pl-0 d-none d-md-flex flex-column align-center"
          >
            <v-btn
              icon
              large
              :to="`${item.link}&state=${help_link_data.state}&section=${help_link_data.section}&base=${help_link_data.base}&course=${help_link_data.course}
                  &lesson=${help_link_data.lesson}`"
              v-for="(item, index) in items"
              :key="index"
              class="mb-3 bg-blue-grey-darken-2 flex-shrink-0"
            >
              <v-tooltip location="right">
                <template v-slot:activator="{ props }">
                  <span
                    v-bind="props"
                    style="font-size: 26px"
                    :class="`icon icon-${item.icon} white--text text--darken-1`"
                  />
                </template>
                <span>{{ item.text }}</span>
              </v-tooltip>
            </v-btn>
          </v-col>
          <!--End desktop side section-->

          <v-col cols="12" md="9" xl="10" class="pl-2">
            <div class="mx-8 mx-md-0">
              <v-carousel
                id="product-carousel"
                :show-arrows="false"
                :hide-delimiters="false"
                v-model="carouselVal"
                class="product-carousel"
                cycle
                :show-arrows-on="'hover'"
              >
                <v-carousel-item
                  v-for="(image, index) in images"
                  :key="index"
                  cover
                >
                  <img :src="image" class="carousel-img" />
                </v-carousel-item>
              </v-carousel>

              <div class="main-thumbnails" v-if="images.length > 1">
                <div
                  v-for="(image, index) in images"
                  :key="index"
                  @click="changeSlide(index)"
                  class="thumbnail-box"
                  :class="{ 'active-box': carouselVal === index }"
                >
                  <img :src="image" class="thumbnail-preview" />
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </div>
    </section>
  </div>
</template>

<script setup>
// Props with types and defaults
const props = defineProps({
  imageUrls: {
    type: Array,
    default: () => [],
  },
  helpLinkData: {
    type: Object,
    default: () => ({
      state: "",
      section: "",
      base: "",
      course: "",
      lesson: "",
    }),
  },
  initialSlide: {
    type: Number,
    default: 0,
  },
});

// Reactive state
const carouselVal = ref(0);
const images = ref([]);
const help_link_data = reactive({
  state: "",
  section: "",
  base: "",
  course: "",
  lesson: "",
});

const active_img = ref(1);

const items = reactive([
  {
    class: "exam",
    text: "Related exam",
    icon: "exam",
    link: "/search?type=azmoon",
  },
  {
    class: "test",
    text: "Related paper",
    icon: "paper",
    link: "/search?type=test",
  },
  {
    class: "content",
    text: "Related multimedia",
    icon: "multimedia",
    link: "/search?type=learnfiles",
  },
  {
    class: "faq",
    text: "Related Q & A",
    icon: "q-a",
    link: "/search?type=question",
  },
  {
    class: "textbook ",
    text: "Related tutorial",
    icon: "tutorial",
    link: "/search?type=dars",
  },
]);

// Methods
function changeSlide(index) {
  carouselVal.value = index;
}

// Watch effects
watch(
  () => props.imageUrls,
  (newVal) => {
    if (newVal && newVal.length > 0) {
      images.value = [...newVal];
    }
  },
  { immediate: true }
);

watch(
  () => props.helpLinkData,
  (newVal) => {
    if (newVal) {
      Object.assign(help_link_data, newVal);
    }
  },
  { immediate: true }
);

watch(
  () => props.initialSlide,
  (newVal) => {
    if (newVal !== undefined) {
      carouselVal.value = newVal;
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
#details-gallery-portrate {
  #product-carousel {
    width: 100%;
    max-width: 100%;
    height: auto !important;
    margin: auto;
    border-radius: 1.2rem;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

    .carousel-img {
      width: 100%;
      height: auto;
      object-fit: contain;
      display: block;
      max-height: 500px;
      margin: 0 auto;
    }
  }
}

.thumbnail-nav {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  gap: 8px;
}

.thumbnail-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #ccc;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.active-dot {
  background-color: #000;
}

.main-thumbnails {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 10px;
}

.thumbnail-box {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
}

.active-box {
  border-color: #000;
}

.thumbnail-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media screen and (max-width: 600px) {
  #details-gallery-portrate #product-carousel {
    width: 100%;
    max-width: 100%;
    height: auto !important;

    .carousel-img {
      max-height: 300px;
    }
  }

  .thumbnail-box {
    width: 40px;
    height: 40px;
  }

  .thumbnail-dot {
    width: 10px;
    height: 10px;
  }
}

.side-help-icon {
  padding: 0.6rem;
  display: block;
  max-width: 4rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  text-align: center;
  background-color: #f5f5f5;
}

.side-help-icon .icon {
  font-size: 1.5rem;
}

@media (min-width: 600px) {
  #details-gallery-portrate {
    #product-carousel {
      width: 100%;
      max-width: 100%;
      height: auto !important;

      .carousel-img {
        max-height: 350px;
      }
    }
  }
}

@media (min-width: 960px) {
  #details-gallery-portrate {
    #product-carousel {
      width: 100%;
      max-width: 100%;
      height: auto !important;

      .carousel-img {
        max-height: 400px;
      }
    }

    .thumbnail-box {
      width: 70px;
      height: 70px;
    }
  }
}

@media (min-width: 1264px) {
  #details-gallery-portrate {
    #product-carousel {
      width: 100%;
      max-width: 100%;
      height: auto !important;

      .carousel-img {
        max-height: 450px;
      }
    }

    .thumbnail-box {
      width: 80px;
      height: 80px;
    }
  }
}
</style>
