<template>
  <v-container id="blog-list-container">
    <v-card flat>
      <div class="main-card">
        <v-row>
          <v-col cols="9" class="px-md-0">
            <h2 class="gama-text-h4" id="main-title ">Study Tips Blog</h2>
          </v-col>
          <v-col cols="3" class="text-right">
            <div class="d-none d-md-inline">
              <v-btn rounded outlined large to="/blog" class="gama-btn"
                >Go to blog</v-btn
              >
            </div>
            <v-btn rounded to="/blog" text class="d-inline d-md-none seeAllBtn">
              See all
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="12" class="px-md-0">
            <v-slide-group
              v-model="model"
              class="slider py-sm-4"
              :show-arrows="$vuetify.breakpoint.lgAndUp"
            >
              <div class="d-flex" v-if="isLoading">
                <v-slide-item v-for="i in 10" :key="i">
                  <v-skeleton-loader
                    class="mx-auto slide-loading"
                    type="card"
                  ></v-skeleton-loader>
                </v-slide-item>
              </div>

              <v-slide-item v-else v-for="(item, n) in slideItmes" :key="n">
                <v-card
                  flat
                  :to="`/blog/${item.id}/${$slugGenerator.convert(item.title)}`"
                >
                  <v-card
                    @mouseover="toggleHover('enter', n)"
                    @mouseleave="toggleHover('leave', n)"
                    class="ma-1"
                  >
                    <v-img :src="item.pic" height="150" />
                    <v-card-title>
                      <span class="gama-text-button" v-if="!isHovered[n]">
                        {{ item.title }}
                      </span>
                      <div v-else class="text-center">
                        <v-btn text size="small" color="primary">
                          read more
                        </v-btn>
                      </div>
                    </v-card-title>
                  </v-card>
                  <div class="gama-text-subtitle2">
                    <span v-html="truncateBody(item.body)"></span>
                    <nuxt-link
                      :to="`/blog/${item.id}/${$slugGenerator.convert(
                        item.title
                      )}`"
                      >Read more</nuxt-link
                    >
                  </div>
                </v-card>
              </v-slide-item>
            </v-slide-group>
          </v-col>
        </v-row>
      </div>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "home-blog-container",
  data() {
    return {
      model: null,
      isHovered: [],
      slideItmes: [],
      isLoading: true,
      isDragging: false,
      startX: 0,
      currentX: 0,
    };
  },
  mounted() {
    this.loadBlog();
  },
  methods: {
    toggleHover(action, n) {
      if (action == "enter") this.isHovered[n] = true;
      if (action == "leave") this.isHovered[n] = false;
    },
    loadBlog() {
      this.isLoading = true;
      this.$axios
        .$get("/api/v1/home/news")
        .then((response) => {
          this.slideItmes = response.data;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    truncateBody(text) {
      var cutLength = 40;
      if (this.$vuetify.breakpoint.sm) cutLength = 42;
      else if (this.$vuetify.breakpoint.xs) cutLength = 38;
      return text.length > cutLength ? text.slice(0, cutLength) + "..." : text;
    },
  },
};
</script>

<style>
#blog-list-container {
  margin: 2.4rem auto 2.4rem auto;
  height: 33rem;

  #main-title {
    color: #354053;
  }

  .v-btn {
    .v-btn__content {
      font-family: "Inter";
    }
  }

  .seeAllBtn {
    padding-right: 0;
    float: right;

    .v-btn__content {
      text-transform: none;
      color: #6e7781;
      font-family: Inter;
      font-size: 1.4rem;
      font-style: normal;
      font-weight: 300;
      line-height: normal;
    }

    .v-icon {
      padding-left: 0.4rem;
      font-size: 2.8rem;
      color: #ffb600;
    }
  }

  .slider {
    .slide-loading {
      width: 21.9rem;
      margin-right: 1.6rem !important;
      position: relative;
      border-radius: 0.6rem;
    }

    .v-card {
      width: 21.9rem;
      height: 19.9rem;
      margin-right: 1.6rem;
      position: relative;
      border-radius: 0.6rem;

      .v-card {
        height: 15.9rem;

        .v-card__title {
          border-radius: 0px 0px 6px 6px;
          background: rgba(36, 41, 47, 0.7);
          backdrop-filter: blur(7.5px);
          position: absolute;
          bottom: 0;
          right: 0;
          left: 0;
          font-family: "Inter";
          margin: 0 auto;
          color: #fff;
          padding-top: 0.6rem !important;
          padding-bottom: 0.6rem;
          height: 4.9rem;
          max-height: 4.9rem;

          .gama-text-button {
            color: #fff;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
        }
      }
    }

    .gama-text-subtitle2 {
      margin: auto auto;
      max-width: 18.2rem;
      text-align: left;
      color: #6e7781;

      & > a {
        color: #ffb600;
      }
    }
  }
}

@media screen and (min-width: 600px) {
  #blog-list-container {
    height: 37rem;

    .main-card {
      padding-left: 1.3rem !important;
      padding-right: 1.3rem !important;
    }

    .slider {
      .v-card {
        width: 25.6rem;
        height: 23.7rem;
        margin-right: 1.6rem;

        .v-card {
          height: 18.5rem;

          .v-card__title {
            font-size: 1.6rem;
            font-style: normal;
            font-weight: 600;
            line-height: 1.8rem;
            padding-top: 0.8rem !important;
            padding-bottom: 0.8rem;
            line-height: normal;
            height: 5.4rem;
            max-height: 5.4rem;
          }
        }
      }

      .gama-text-subtitle2 {
        max-width: 21.4rem;
      }
    }
  }
}

@media screen and (min-width: 960px) {
  #blog-list-container {
    margin: 7.8rem auto 8rem auto;
    height: 35.6rem;

    .main-card {
      padding-left: 1.2rem !important;
      padding-right: 1.2rem !important;
    }

    .slider {
      .v-card {
        width: 26.1rem;
        height: 23.7rem;
        margin-right: 1.6rem;

        .v-card {
          height: 18.5rem;

          .v-card__title {
            line-height: normal;

            .gama-text-button {
              font-size: 1.4rem;
            }
          }
        }
      }

      .gama-text-subtitle2 {
        max-width: 22rem;
      }
    }
  }
}

@media screen and (min-width: 1264px) {
  #blog-list-container {
    .slider {
      .v-card {
        .v-card {
          .v-card__title {
            .gama-text-button {
              font-size: 1.8rem;
            }
          }
        }
      }
    }
  }
}
</style>
