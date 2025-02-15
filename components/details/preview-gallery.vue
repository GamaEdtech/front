<template>
  <div>
    <section id="details-gallery-portrate" class="rounded-lg">
      <div class="card-carousel">
        <v-row justify="center">
          <!--Mobile side section-->
          <v-col
            cols="12"
            class="pr-0 d-flex d-md-none justify-center align-center"
          >
            <v-btn
              icon
              small
              :to="`${item.link}&state=${help_link_data.state}&section=${help_link_data.section}&base=${help_link_data.base}&course=${help_link_data.course}
                  &lesson=${help_link_data.lesson}`"
              v-for="(item, index) in items"
              :key="index"
              class="side-help-icon mr-1"
            >
              <v-tooltip right>
                <template v-slot:activator="{ on, attrs }">
                  <span
                    v-bind="attrs"
                    v-on="on"
                    :class="' icon icon-' + item.icon"
                  />
                </template>
                <span>{{ item.text }}</span>
              </v-tooltip>
            </v-btn>
          </v-col>
          <!--End mobile side section-->

          <!--Desktop side section-->
          <v-col cols="2" class="pr-0 d-none d-md-block">
            <nuxt-link
              :to="`${item.link}&state=${help_link_data.state}&section=${help_link_data.section}&base=${help_link_data.base}&course=${help_link_data.course}
                  &lesson=${help_link_data.lesson}`"
              v-for="(item, index) in items"
              :key="index"
              class="side-help-icon"
            >
              <v-tooltip right>
                <template v-slot:activator="{ on, attrs }">
                  <span
                    v-bind="attrs"
                    v-on="on"
                    :class="`icon icon-${item.icon}`"
                  />
                </template>
                <span>{{ item.text }}</span>
              </v-tooltip>
            </nuxt-link>
          </v-col>
          <!--End desktop side section-->

          <v-col cols="12" md="10" class="pl-1">
            <div class="mx-8 mx-md-0">
              <v-carousel
                id="product-carousel"
                :show-arrows="false"
                :hide-delimiters="images.length > 1 ? false : true"
                v-model="carouselVal"
              >
                <v-carousel-item v-for="(image, index) in images" :key="index">
                  <img :src="image" class="carousel-img" />
                </v-carousel-item>
              </v-carousel>
              <div class="thumbnails" v-show="images.length > 1">
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
  data() {
    return {
      carouselVal: null,
      images: [],
      help_link_data: {
        state: "",
        section: "",
        base: "",
        course: "",
        lesson: "",
      },

      items: [
        {
          class: "exam",
          text: "Related exam",
          icon: "exam",
          link: "/search?type=azmoon",
        },
        {
          class: "paper",
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
  methods: {
    changeSlide(index) {
      this.carouselVal = index;
    },
  },
};
</script>

<style lang="scss" scoped>
#details-gallery-portrate {
  #product-carousel {
    width: 22.2rem;
    height: 28rem !important;

    margin: auto auto;
    .carousel-img {
      max-width: 22.2rem;
      width: 100%;
      height: auto;
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
      width: 29rem;
      height: 36rem !important;

      margin: auto auto;
      .carousel-img {
        max-width: 29rem;
        width: 100%;
        height: auto;
        border-radius: 1.2rem;
      }
    }
  }
}

@media (min-width: 1264px) {
  #details-gallery-portrate {
    #product-carousel {
      width: 29rem;
      height: 24rem !important;

      margin: auto auto;
      .carousel-img {
        max-width: 29rem;
        width: 100%;
        height: auto;
        border-radius: 1.2rem;
      }
    }
  }
}

@media (min-width: 1310px) {
  #details-gallery-portrate {
    #product-carousel {
      height: 25.4rem !important;
    }
  }
}

@media (min-width: 1368px) {
  #details-gallery-portrate {
    #product-carousel {
      height: 26.5rem !important;
    }
  }
}

@media (min-width: 1428px) {
  #details-gallery-portrate {
    #product-carousel {
      height: 28rem !important;
    }
  }
}

@media (min-width: 1488px) {
  #details-gallery-portrate {
    #product-carousel {
      height: 29.2rem !important;
    }
  }
}

@media (min-width: 1546px) {
  #details-gallery-portrate {
    #product-carousel {
      height: 30.2rem !important;
    }
  }
}

@media (min-width: 1606px) {
  #details-gallery-portrate {
    #product-carousel {
      height: 31.2rem !important;
    }
  }
}

@media (min-width: 1666px) {
  #details-gallery-portrate {
    #product-carousel {
      height: 32.2rem !important;
    }
  }
}

@media (min-width: 1714px) {
  #details-gallery-portrate {
    #product-carousel {
      height: 33.2rem !important;
    }
  }
}

@media (min-width: 1714px) {
  #details-gallery-portrate {
    #product-carousel {
      height: 34.4rem !important;
    }
  }
}
</style>
