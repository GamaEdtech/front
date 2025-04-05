<template>
  <v-container class="mt-8" id="test-album">
    <!--Mobile filter-->
    <v-row justify="center" class="d-block d-md-none">
      <v-dialog
        v-model="dialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition "
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            v-on="on"
            class="d-block d-md-none"
            min-width="40"
            fixed
            right
            style="z-index: 10; bottom: 8rem"
            x-large
            color="teal"
            dark
            rounded
          >
            <v-icon> mdi-filter </v-icon>
            <v-slide-x-reverse-transition>
              <span v-show="expandFilterMenu" class="text-h6"> filter </span>
            </v-slide-x-reverse-transition>
          </v-btn>
        </template>
        <v-card>
          <div style="position: sticky; top: 0; left: 0; right: 0; z-index: 10">
            <v-toolbar class="filter-btn-header">
              <v-toolbar-items>
                <v-btn
                  class="text-h5 font-weight-bold"
                  text
                  @click="dialog = false"
                >
                  Search in albums
                </v-btn>
              </v-toolbar-items>
              <v-spacer></v-spacer>
              <v-btn icon @click="dialog = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>
          </div>
          <v-card-text>
            <!--Filter section-->
            <v-row class="mt-4">
              <v-col cols="12" md="3">
                <v-autocomplete
                  dense
                  v-model="filter.level"
                  clearable
                  :items="level_list"
                  item-text="title"
                  item-value="id"
                  label="Curriculum"
                  outlined
                />
              </v-col>
              <v-col cols="12" md="3">
                <v-autocomplete
                  dense
                  v-model="filter.grade"
                  clearable
                  :items="grade_list"
                  item-value="id"
                  item-text="title"
                  label="Grade"
                  outlined
                />
              </v-col>
              <v-col cols="12" md="3">
                <v-autocomplete
                  dense
                  :items="lesson_list"
                  item-value="id"
                  item-text="title"
                  v-model="filter.lesson"
                  clearable
                  label="Subject"
                  outlined
                />
              </v-col>
            </v-row>
            <!--End filter section-->
          </v-card-text>
          <v-card-actions
            style="position: sticky; bottom: 0; left: 0; right: 0"
          >
            <v-btn
              medium
              block
              class="filter-show-result mr-4"
              @click="dialog = !dialog"
            >
              show result ({{ album_list.length }})
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <v-row>
      <v-col cols="12" class="pl-5">
        <span class="text-h4 teal--text">
          <v-icon color="teal" large> mdi-image-album </v-icon>
          Albums
        </span>
      </v-col>
    </v-row>
    <v-card flat class="mt-3 mb-6 pb-10 album-card">
      <v-card-text>
        <!--Filter section-->
        <v-row class="d-none d-md-flex">
          <v-col cols="12" md="3">
            <v-autocomplete
              dense
              v-model="filter.level"
              clearable
              :items="level_list"
              item-text="title"
              item-value="id"
              label="Curriculum"
              outlined
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
              dense
              v-model="filter.grade"
              clearable
              :items="grade_list"
              item-value="id"
              item-text="title"
              label="Grade"
              outlined
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
              dense
              :items="lesson_list"
              item-value="id"
              item-text="title"
              v-model="filter.lesson"
              clearable
              label="Subject"
              outlined
            />
          </v-col>
        </v-row>
        <!--End filter section-->

        <!--Albums-->
        <v-row>
          <v-col
            cols="12"
            class="text-center"
            v-if="page_loading === false && album_list.length === 0"
          >
            <p>Oops! no data found</p>
          </v-col>
          <v-col
            cols="12"
            sm="6"
            md="3"
            v-else
            v-for="(album, index) in album_list"
            :key="index"
          >
            <v-card class="album-card">
              <v-card-title class="text-h4">
                <nuxt-link :to="`/albums/${album.lesson}`">
                  {{ album.lesson_title }} album
                </nuxt-link>
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="7">
                    <nuxt-link :to="`/albums/${album.lesson}`">
                      <v-img
                        class="album-img"
                        v-if="album.lesson_pic"
                        @error="imgErrorHandler(album, index)"
                        :src="album.lesson_pic"
                      />
                      <v-card
                        v-else
                        flat
                        class="album-no-img container mx-auto fill-height align-center justify-center"
                      >
                        <v-card-text class="px-0">
                          <p class="font-weight-bold mb-3 mt-5">
                            {{ album.lesson_title }}
                          </p>
                          <a href="https://gamatrain.com">Gamatrain.com</a>
                        </v-card-text>
                      </v-card>
                    </nuxt-link>
                  </v-col>
                  <v-col
                    cols="5"
                    class="d-flex align-center justify-center pr-0"
                  >
                    <p
                      class="price_label green--text"
                      v-show="album.price === '0'"
                    >
                      Free
                    </p>
                    <p class="price_label" v-show="album.price !== '0'">
                      <span class="red--text">
                        ${{ album.price | numberFormat }}
                      </span>
                      <br />
                      <br />
                      <span class="subscription_label">
                        Yearly subscription
                      </span>
                    </p>
                  </v-col>
                  <v-col cols="12" class="py-0">
                    <v-divider />
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-chip label class="test-count-label">
                  <span class="label-text">Test count:&nbsp; </span>
                  <span class="label-val">{{
                    $numberFormat(album.tests_num)
                  }}</span>
                </v-chip>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <v-row v-show="page_loading">
          <v-col cols="12" class="text-center">
            <v-progress-circular
              :size="40"
              :width="4"
              class="mt-12 mb-12"
              color="orange"
              indeterminate
            />
          </v-col>
        </v-row>

        <!--End albums-->
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { ValidationObserver, ValidationProvider } from "vee-validate";
import TopicSelector from "@/components/form/topic-selector";

export default {
  layout: "test-maker-layout",
  name: "test-maker",
  head() {
    return {
      title: "Online exam albums",
    };
  },
  components: {
    ValidationObserver,
    ValidationProvider,
    TopicSelector,
  },
  data() {
    return {
      test_step: 1,
      page_loading: false,
      page: 1,
      all_files_loaded: false,

      filter: {
        level: "",
        grade: "",
        lesson: "",
      },
      timepicker_menu: false,

      level_list: [],
      grade_list: [],
      field_list: [],
      lesson_list: [],
      album_list: [],
      dialog: false,
      expandFilterMenu: true,
    };
  },
  mounted() {
    this.getTypeList("section");
    this.getAlbumList();
    this.scroll();
  },
  watch: {
    "filter.level"(val) {
      this.filter.grade = "";
      this.filter.lesson = "";
      if (val) {
        this.getTypeList("base", val);
      }
      this.page = 1;
      this.all_files_loaded = false;
      this.album_list = [];
      this.getAlbumList();
    },
    "filter.grade"(val) {
      this.filter.lesson = "";
      if (val) {
        this.album_list = [];
        this.page = 1;
        this.all_files_loaded = false;
        this.getAlbumList();
        this.getTypeList("lesson", val);
      }
    },
    "filter.lesson"(val) {
      if (val) {
        this.page = 1;
        this.all_files_loaded = false;
        this.album_list = [];
        this.getAlbumList();
      }
    },
  },
  methods: {
    getTypeList(type, parent = "") {
      var params = {
        type: type,
      };
      if (type === "base") params.section_id = parent;
      if (type === "lesson") {
        params.base_id = parent;
      }

      this.$fetch
        .$get("/api/v1/types/list", {
          params,
        })
        .then((res) => {
          var data = {};
          if (type === "section") {
            this.level_list = res.data;
          } else if (type === "base") {
            this.grade_list = res.data;
          } else if (type === "lesson") {
            this.lesson_list = res.data;
          }
        })
        .catch((err) => {
          this.$toast.error(err);
        });
    },
    getAlbumList() {
      if (this.all_files_loaded === false) {
        this.page_loading = true;
        this.$fetch
          .$get("/api/v1/albums", {
            params: {
              perpage: 12,
              page: this.page,
              section: this.filter.level,
              base: this.filter.grade,
              lesson: this.filter.lesson,
            },
          })
          .then((response) => {
            let result = response.data.list;
            for (var index in result) {
              if (
                this.album_list.findIndex((x) => x.id === result[index].id) ==
                -1
              )
                this.album_list.push(result[index]);
            }

            console.log("Length" + result.length);
            if (result.length === 0)
              //For terminate auto load request
              this.all_files_loaded = true;
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            this.page_loading = false;
          });
      }
    },
    scroll() {
      //For infinite loading
      window.onscroll = () => {
        //Scroll position
        var scrollPosition =
          Math.max(
            window.pageYOffset,
            document.documentElement.scrollTop,
            document.body.scrollTop
          ) +
          window.innerHeight +
          50;
        let bottomOfWindow =
          scrollPosition >= document.documentElement.offsetHeight;

        //Avoid the number of requests
        if (this.timer) {
          clearTimeout(this.timer);
          this.timer = null;
        }

        //Section for control filter menu button on mobile device
        if (window.scrollY > 1000) this.expandFilterMenu = false;
        else this.expandFilterMenu = true;
        //End section for control filter menu button on mobile device

        //Load next page
        if (bottomOfWindow && this.all_files_loaded === false) {
          this.page_loading = true;
          this.timer = setTimeout(() => {
            this.page++;
            this.getAlbumList();
          }, 800);
        }
      };
    },
    imgErrorHandler(item, key) {
      this.album_list[key].lesson_pic = "";
    },
  },
};
</script>

<style scoped></style>
