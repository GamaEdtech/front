<template>
  <div>
    <section id="details-gallery-portrate" class="rounded-lg">
      <div class="card-carousel">
        <v-row justify="center">
          <!--Mobile side section-->
          <v-col cols="12" class="pr-0 d-flex d-md-none">
            <!-- <v-btn
              icon
              large
              :to="`${item.link}&state=${help_link_data.state}&section=${help_link_data.section}&base=${help_link_data.base}&course=${help_link_data.course}
                  &lesson=${help_link_data.lesson}`"
              v-for="(item, index) in items"
              :key="index"
              class="bg-blue-grey-darken-2 mr-1"
            >
              <v-tooltip right>
                <template v-slot:activator="{ on, attrs }">
                  <span
                    v-bind="attrs"
                    v-on="on"
                    :class="' icon icong-' + item.icon"
                  />
                </template>
                <span>{{ item.text }}</span>
              </v-tooltip>
            </v-btn> -->
            <v-btn
              icon
              large
              :to="`${item.link}&state=${help_link_data.state}&section=${help_link_data.section}&base=${help_link_data.base}&course=${help_link_data.course}
                  &lesson=${help_link_data.lesson}`"
              v-for="(item, index) in items"
              :key="index"
              class="bg-blue-grey-darken-2 mx-3"
            >
              <v-tooltip right>
                <template v-slot:activator="{ on, attrs }">
                  <span
                    v-bind="attrs"
                    v-on="on"
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
          <v-col cols="3" class="pr-0 d-none d-md-block">
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

          <v-col cols="12" md="9" class="pl-1">
            <div class="mx-8 mx-md-0">
              <v-carousel
                id="product-carousel"
                :show-arrows="false"
                :hide-delimiters="images.length > 1 ? false : true"
                v-model="carouselVal"
                height="auto"
                contain
                class="product-carousel"
              >
                <v-carousel-item
                  v-for="(image, index) in images"
                  :key="index"
                  contain
                >
                  <img :src="image" class="carousel-img" />
                </v-carousel-item>
              </v-carousel>
              <div class="thumbnails" v-if="images.length > 1">
                <v-slide-group
                  center-active
                  class="pa-4"
                  active-class="success"
                >
                  <v-slide-item
                    class="mx-2 thumbnail_itm"
                    v-for="(image, index) in images"
                    :key="index"
                  >
                    <img
                      :class="carouselVal == index ? 'active_slide' : ''"
                      @click="changeSlide(index)"
                      :src="image"
                    />
                  </v-slide-item>
                </v-slide-group>
              </div>
            </div>
          </v-col>
        </v-row>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "preview-gallery",
  props: {
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
  },
  data() {
    return {
      carouselVal: 0,
      images: [],
      help_link_data: {
        state: "",
        section: "",
        base: "",
        course: "",
        lesson: "",
      },

      active_img: 1,

      items: [
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
        // { class: "school", text: "School", icon: "school" ,link:"/search?type=school" },
        // { class: "tutor", text: "Tutor", icon: "teacher" ,link:"/search?type=tutor" },
      ],
    };
  },
  watch: {
    imageUrls: {
      immediate: true,
      handler(newVal) {
        if (newVal && newVal.length > 0) {
          this.images = [...newVal];
        }
      },
    },
    helpLinkData: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.help_link_data = { ...newVal };
        }
      },
    },
    initialSlide: {
      immediate: true,
      handler(newVal) {
        if (newVal !== undefined) {
          this.carouselVal = newVal;
        }
      },
    },
  },
  methods: {
    changeSlide(index) {
      this.carouselVal = index;
    },
  },
};
</script>

<style scoped>
/* Global carousel image constraints */
.carousel-img {
  object-fit: contain !important;
  width: 100% !important;
  max-width: 100% !important;
  max-height: 100% !important;
  margin: 0 auto !important;
  box-sizing: border-box !important;
}

.product-carousel {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden !important;
}

#details-gallery-portrate {
  #product-carousel {
    /* width: 22.2rem; */
    height: 28rem !important;
    margin: auto auto;
    overflow: hidden;

    .carousel-img {
      /* max-width: 22.2rem; */
      width: 100%;
      height: auto;
      max-height: 28rem;
      object-fit: contain;
      border-radius: 1.2rem;
    }
  }
}

.thumbnails {
  display: flex;
  justify-content: space-evenly;
  flex-direction: row;
  cursor: pointer;
  width: 100%;
}

.thumbnails .thumbnail_itm {
  max-width: 80px !important;
  max-height: 80px !important;
}

@media screen and (max-width: 600px) {
  .thumbnails {
    display: flex;
    justify-content: space-evenly;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
  }

  .thumbnails .thumbnail_itm {
    max-width: 50px !important;
    max-height: 40px !important;
  }
}

.active_slide {
  border: 2px solid #000;
  border-radius: 5px;
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
      /* width: 29rem; */
      height: 36rem !important;
      margin: auto auto;
      overflow: hidden;

      .carousel-img {
        /* max-width: 29rem !important; */
        width: 100% !important;
        height: auto;
        max-height: 36rem;
        object-fit: contain;
        border-radius: 1.2rem;
      }
    }
  }
}

@media (min-width: 1264px) {
  #details-gallery-portrate {
    #product-carousel {
      /* width: 29rem; */
      width: 100% !important;
      height: 24rem !important;
      margin: auto auto;
      overflow: hidden;

      .carousel-img {
        /* max-width: 29rem; */
        width: 100%;
        height: auto;
        max-height: 24rem;
        object-fit: contain;
        border-radius: 1.2rem;
      }
    }
  }
}

@media (min-width: 1310px) {
  #details-gallery-portrate {
    #product-carousel {
      height: 25.4rem !important;

      .carousel-img {
        max-height: 25.4rem;
      }
    }
  }
}

@media (min-width: 1368px) {
  #details-gallery-portrate {
    #product-carousel {
      height: 26.5rem !important;

      .carousel-img {
        max-height: 26.5rem;
      }
    }
  }
}

@media (min-width: 1428px) {
  #details-gallery-portrate {
    #product-carousel {
      height: 28rem !important;

      .carousel-img {
        max-height: 28rem;
      }
    }
  }
}

@media (min-width: 1488px) {
  #details-gallery-portrate {
    #product-carousel {
      height: 29.2rem !important;

      .carousel-img {
        max-height: 29.2rem;
      }
    }
  }
}

@media (min-width: 1546px) {
  #details-gallery-portrate {
    #product-carousel {
      height: 30.2rem !important;

      .carousel-img {
        max-height: 30.2rem;
      }
    }
  }
}

@media (min-width: 1606px) {
  #details-gallery-portrate {
    #product-carousel {
      height: 31.2rem !important;

      .carousel-img {
        max-height: 31.2rem;
      }
    }
  }
}

@media (min-width: 1666px) {
  #details-gallery-portrate {
    #product-carousel {
      height: 32.2rem !important;

      .carousel-img {
        max-height: 32.2rem;
      }
    }
  }
}

@media (min-width: 1714px) {
  #details-gallery-portrate {
    #product-carousel {
      height: 33.2rem !important;

      .carousel-img {
        max-height: 33.2rem;
      }
    }
  }
}

@media (min-width: 1714px) {
  #details-gallery-portrate {
    #product-carousel {
      height: 34.4rem !important;

      .carousel-img {
        max-height: 34.4rem;
      }
    }
  }
}
</style>
