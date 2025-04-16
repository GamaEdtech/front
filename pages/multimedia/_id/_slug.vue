<template>
  <div class="test-details-content">
    <!-- Start : Category -->
    <category />
    <!-- End:Category -->

    <!--  Start: breadcrumb  -->
    <section>
      <v-row class="mt-0 py-0 header-path">
        <v-col cols="12">
          <breadcrumb :breads="breads" />
        </v-col>
      </v-row>
    </section>
    <!--  End: breadcrumb  -->

    <!--  Start: detail  -->
    <section>
      <v-container class="py-0">
        <div class="detail mt-md-8">
          <v-row>
            <v-col cols="12" md="4">
              <!--Show gallery of preview and book first page-->
              <multimedia-preview-gallery ref="preview_gallery" />
              <!--Show gallery of preview and book first page-->
            </v-col>
            <v-col cols="12" md="5">
              <!--  Description   -->
              <div class="d-flex mb-4">
                <div class="w-100">
                  <div class="d-flex align-center justify-space-between header">
                    <h1
                      class="gama-text-h5 font-weight-bold"
                      v-show="editMode.title == false"
                    >
                      {{ contentData.title }}
                      <v-btn
                        @click="editMode.title = true"
                        fab
                        v-if="$auth.user?.id == contentData.user_"
                        depressed
                        x-small
                      >
                        <v-icon> mdi-pencil </v-icon>
                      </v-btn>
                    </h1>
                  </div>

                  <div class="w-100">
                    <v-textarea
                      v-if="editMode.title"
                      width="100%"
                      rows="3"
                      placeholder="Title"
                      v-model="contentData.title"
                    >
                      <template slot="append-outer">
                        <v-btn
                          color="success"
                          @click="updateDetails()"
                          fab
                          depressed
                          :loading="editMode.title_loading"
                          x-small
                        >
                          <v-icon> mdi-check </v-icon>
                        </v-btn>
                      </template>
                    </v-textarea>
                  </div>
                  <div class="description-holder my-4">
                    <!--Description-->
                    <div class="description-tabs">
                      <v-tabs v-model="description_tab" color="teal">
                        <v-tab key="tab-description"
                          ><span class="gama-text-caption"
                            >Description</span
                          ></v-tab
                        >
                        <v-tab key="tab-chapters"
                          ><span class="gama-text-caption"
                            >Book chapters</span
                          ></v-tab
                        >
                      </v-tabs>
                    </div>
                    <div class="description-tabs">
                      <v-tabs-items v-model="description_tab">
                        <v-tab-item key="tab-description">
                          <span
                            class="gama-text-body2"
                            v-show="editMode.describe == false"
                            v-html="
                              contentData.description
                                ? contentData.description.replace(
                                    /\n/g,
                                    '<br />'
                                  )
                                : ''
                            "
                          />
                          <v-btn
                            v-if="$auth.user?.id == contentData.user_"
                            v-show="editMode.describe == false"
                            @click="editMode.describe = true"
                            fab
                            depressed
                            x-small
                          >
                            <v-icon> mdi-pencil </v-icon>
                          </v-btn>
                          <div>
                            <v-textarea
                              v-if="editMode.describe"
                              width="100%"
                              rows="18"
                              placeholder="Title"
                              v-model="contentData.description"
                            >
                              <template slot="append-outer">
                                <v-btn
                                  color="success"
                                  @click="updateDetails()"
                                  fab
                                  depressed
                                  :loading="editMode.describe_loading"
                                  x-small
                                >
                                  <v-icon> mdi-check </v-icon>
                                </v-btn>
                              </template>
                            </v-textarea>
                          </div>
                        </v-tab-item>
                        <v-tab-item key="tab-chapters" class="pa-0">
                          <div
                            color="#F5F5F5"
                            flat
                            style="max-height: 25rem; overflow-y: auto"
                          >
                            <ul class="pl-0" style="list-style-type: none">
                              <li v-for="item in contentData.collectionList">
                                <strong>{{ item.title }}</strong>
                                <ul
                                  style="list-style-type: none"
                                  v-if="item.chapters"
                                >
                                  <li v-for="chapter in item.chapters">
                                    {{ chapter.title }}
                                  </li>
                                </ul>
                              </li>
                            </ul>
                          </div>
                        </v-tab-item>
                      </v-tabs-items>
                    </div>
                    <!--End description-->
                  </div>

                  <div class="label-holder">
                    <v-chip link class="mr-1">
                      <nuxt-link
                        :to="`/search?type=learnfiles&section=${contentData.section}`"
                      >
                        {{ contentData.section_title }}
                      </nuxt-link>
                    </v-chip>
                    <v-chip link class="mr-1">
                      <nuxt-link
                        :to="`/search?type=learnfiles&section=${contentData.section}&base=${contentData.base}`"
                      >
                        {{ contentData.base_title }}
                      </nuxt-link>
                    </v-chip>
                    <v-chip link class="ma-1">
                      <nuxt-link
                        :to="`/search?type=learnfiles&section=${contentData.section}&base=${contentData.base}&lesson=${contentData.lesson}`"
                      >
                        {{ contentData.lesson_title }}
                      </nuxt-link>
                    </v-chip>
                  </div>
                </div>
              </div>
              <!--   Download Btn and Description  -->
              <div class="text-center download-sec">
                <div
                  v-if="!isFree"
                  class="d-none d-md-block mb-4 gama-text-body2"
                >
                  <span v-if="!$auth.loggedIn">
                    <span class="mdi mdi-bell icon"></span>
                    <span @click="openAuthDialog('login')" class="login"
                      >Login</span
                    >
                    <span @click="openAuthDialog('register')" class="register">
                      (register)
                    </span>
                    to download and charge your wallet.
                  </span>
                  <span v-else>
                    Your wallet charge is ${{ $auth.user?.credit }}
                  </span>
                  <nuxt-link
                    class="blue--text"
                    v-if="$auth.loggedIn"
                    to="/user/charge-wallet"
                    >(Top Up Wallet)</nuxt-link
                  >
                </div>
                <!-- <div class="font-weight-bold answer gama-text-body2">
                  <span class="mdi mdi-checkbox-marked icon"></span>
                  <span> The key answer sheet is at the end of the exam file.</span>
                </div> -->
              </div>
              <!--   fileCopyRight  -->
              <!-- <div class="d-none d-md-block  text-center file-copy-right gama-text-body2">
                <span class="">It is forbidden to republish the contents in cyber space.</span>
              </div> -->
            </v-col>
            <v-col md="3">
              <v-card flat class="content_main_info">
                <v-row class="align-center">
                  <v-col cols="3">
                    <v-img
                      :src="contentData.avatar"
                      alt=""
                      class="d-inline-block"
                      cover
                      height="48"
                      width="48"
                    />
                  </v-col>
                  <v-col cols="9" class="pl-0">
                    <p class="creator_title">
                      {{ contentData.first_name }} {{ contentData.last_name }}
                    </p>
                  </v-col>
                </v-row>
                <v-divider class="my-2" />
                <v-row>
                  <v-col cols="12" class="pb-0">
                    <i class="fa-solid fa-folder mr-1 icon"></i>
                    File type: {{ contentData.content_type_title }}
                  </v-col>
                  <v-col cols="12" class="pb-0">
                    <i class="fa-solid fa-book-open-reader mr-1 icon"></i>
                    Page count: {{ contentData.file_pages }}
                  </v-col>
                  <v-col cols="12" class="pb-0">
                    <i class="fa-solid fa-eye mr-1 icon"></i>
                    Viewed: {{ contentData.views }}
                  </v-col>
                  <v-col cols="12" class="pb-0">
                    <i class="fa-solid fa-calendar-alt mr-1 icon"></i>
                    Last update: {{ $dayjs(contentData.up_date).fromNow() }}
                  </v-col>
                  <v-col cols="12" class="pb-0">
                    <div @click="openCrashReportDialog" class="pointer">
                      <i class="fa-solid fa-bug mr-1 icon"></i>
                      Crash report
                    </div>
                  </v-col>
                  <v-col cols="12" class="pb-0">
                    <!--Dialog for share-->
                    <v-dialog
                      transition="dialog-top-transition"
                      class="share_dialog"
                      max-width="600"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <span v-bind="attrs" v-on="on">
                          <i class="fa-solid fa-share-alt mr-1 icon"></i>
                          Share
                        </span>
                      </template>
                      <template v-slot:default="dialog">
                        <v-card>
                          <v-toolbar color="default"> Share </v-toolbar>
                          <v-card-text class="mt-5">
                            <p class="mb-3">Share this content:</p>
                            <v-row>
                              <v-col cols="12">
                                <v-btn outlined block @click="copyUrl">
                                  <i class="fa-solid fa-copy mr-1 icon"></i>
                                  &nbsp;
                                  {{ copy_btn }}
                                </v-btn>
                              </v-col>
                              <v-col cols="6">
                                <v-btn
                                  @click="shareSocial('whatsapp')"
                                  target="_blank"
                                  block
                                  color="#25d366"
                                  class="white--text"
                                >
                                  <i class="fab fa-whatsapp mr-1 icon"></i>
                                  WhatsApp
                                </v-btn>
                              </v-col>
                              <v-col cols="6">
                                <v-btn
                                  block
                                  color="#00acee"
                                  class="white--text"
                                  @click="shareSocial('telegram')"
                                >
                                  <i
                                    class="fab fa-telegram-plane mr-1 icon"
                                  ></i>
                                  Telegram
                                </v-btn>
                              </v-col>
                            </v-row>
                          </v-card-text>
                          <v-card-actions class="justify-end">
                            <v-btn text @click="dialog.value = false"
                              >close
                            </v-btn>
                          </v-card-actions>
                        </v-card>
                      </template>
                    </v-dialog>
                  </v-col>
                </v-row>

                <div class="text-center mt-2">
                  <v-rating
                    v-model="rating"
                    color="yellow darken-3"
                    background-color="grey darken-1"
                    empty-icon="$ratingFull"
                    half-increments
                    hover
                  />
                </div>
                <v-divider class="d-none d-md-block" />

                <v-row class="mt-1 d-none d-md-block">
                  <v-col cols="12" class="pb-0">
                    <!-- <div v-if="contentData.files.ext == 'pptx'"> -->
                    <div>
                      <v-btn
                        @click="startDownload('pptx')"
                        block
                        dark
                        color="#bf360c"
                        class="mb-2"
                      >
                        Download PPTX{{
                          contentData.files.price > 0
                            ? " | $" + contentData.files.price
                            : ""
                        }}
                      </v-btn>
                    </div>
                  </v-col>
                </v-row>
              </v-card>
              <v-row>
                <!-- <v-col cols="12" class="text-center">
                  <span class="mt-2  gama-text-overline">
                    <i class="fa-solid fa-exclamation-circle mr-1 icon"></i>
                    Republishing is prohibited in cyber space.</span>
                </v-col> -->
              </v-row>
            </v-col>
          </v-row>
        </div>
      </v-container>
    </section>

    <!--Mobile order section-->
    <v-card class="order-btn-holder d-block d-md-none" width="100%">
      <v-card-text class="pb-0">
        <v-row class="px-10 text-center">
          <v-col cols="12" class="pb-1 pt-0">
            <div v-if="contentData.files.ext == 'pptx'">
              <v-btn
                @click="startDownload('pptx')"
                block
                color="#bf360c"
                dark
                class="mb-2"
              >
                Download PPTX{{
                  contentData.files.price > 0
                    ? " | $" + contentData.files.price
                    : ""
                }}
              </v-btn>
            </div>
          </v-col>

          <v-col cols="12">
            <div v-if="!isFree" class="mb-4">
              <p v-if="!$auth.loggedIn">
                <span class="mdi mdi-bell icon"></span>
                <span @click="openAuthDialog('login')" class="login blue--text"
                  >Login</span
                >
                <span
                  @click="openAuthDialog('register')"
                  class="register blue--text"
                >
                  (register)
                </span>
                <span>to download and charge.</span>
              </p>
              <span v-else>
                Your wallet charge is ${{ $auth.user?.credit }}
                <nuxt-link
                  class="blue--text"
                  v-if="$auth.loggedIn"
                  to="/user/charge-wallet"
                  >(Top Up Wallet)</nuxt-link
                >
              </span>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <!--End mobile order section-->

    <!--  End: detail  -->
    <v-container>
      <v-row>
        <v-col cols="12" md="6">
          <!--  Start: Course Card  -->
          <!--          <section>-->
          <!--            <div class="d-flex  align-center course-card box">-->
          <!--              <div class="right">-->
          <!--                <v-row>-->
          <!--                  <v-col cols="2">-->
          <!--                    <nuxt-link to="">-->
          <!--                      <img height="98" width="98" :src="require(`~/assets/images/teacher1.png`)" alt=""/>-->
          <!--                    </nuxt-link>-->
          <!--                  </v-col>-->
          <!--                  <v-col cols="10">-->
          <!--                    <div class="description ml-4">-->
          <!--                      <div>-->
          <!--                        <nuxt-link to="">-->
          <!--                          <h2 class="course-title">PowerPoint of the complete educational course, date (3) of the 12th-->
          <!--                            grade of the second secondary-theoretical period</h2>-->
          <!--                        </nuxt-link>-->
          <!--                      </div>-->
          <!--                      <v-row>-->
          <!--                        <v-col cols="10">-->
          <!--                          <div>-->
          <!--                            <nuxt-link to="" class="teacher">-->
          <!--                              <i class="fa-solid fa-user icon"></i>-->
          <!--                              <span>Lecturer: Shamsi Shabani</span>-->
          <!--                            </nuxt-link>-->
          <!--                          </div>-->
          <!--                          <div>-->
          <!--                            <p class="duration">-->
          <!--                              <i class="fa-solid fa-clock icon"></i>-->
          <!--                              <span>Course duration: 942 slides (13 files)</span>-->
          <!--                            </p>-->
          <!--                          </div>-->
          <!--                        </v-col>-->
          <!--                        <v-col cols="2">-->
          <!--                          <nuxt-link to="" class="teal&#45;&#45;text">-->
          <!--                            <strong>-->
          <!--                              View-->
          <!--                            </strong>-->
          <!--                          </nuxt-link>-->
          <!--                        </v-col>-->
          <!--                      </v-row>-->
          <!--                    </div>-->
          <!--                  </v-col>-->
          <!--                </v-row>-->
          <!--              </div>-->

          <!--            </div>-->
          <!--          </section>-->
          <!--  End: Course Card  -->
        </v-col>

        <v-col cols="12" md="6">
          <!--  Start:  Azmoon test album card   -->
          <!--          <section>-->
          <!--            <div class="d-flex align-center album-card box">-->
          <!--              <div class="right">-->
          <!--                <v-row>-->
          <!--                  <v-col cols="2">-->
          <!--                    <nuxt-link to="">-->
          <!--                      <img :src="require(`~/assets/images/poster1.jpg`)" alt="" class="poster-img"/>-->
          <!--                    </nuxt-link>-->
          <!--                  </v-col>-->
          <!--                  <v-col cols="10">-->
          <!--                    <div class="description ml-2">-->
          <!--                      <nuxt-link to="">-->
          <!--                        <h2 class="course-title">Exam test bank album, date (3) twelfth of the second term of-->
          <!--                          high school-theoretical</h2>-->
          <!--                      </nuxt-link>-->

          <!--                      <v-row>-->
          <!--                        <v-col cols="10">-->
          <!--                          <div class="num">-->
          <!--                            <i class="fa-solid fa-list-ol icon"></i>-->
          <!--                            <span>Number of tests: 1399</span>-->
          <!--                          </div>-->
          <!--                          <div class="level">-->
          <!--                            <i class="fa-solid fa-superscript icon"></i>-->
          <!--                            <span>Difficulty: Easy</span>-->
          <!--                          </div>-->
          <!--                        </v-col>-->
          <!--                        <v-col cols="2">-->
          <!--                          <nuxt-link to="" class="teal&#45;&#45;text">-->
          <!--                            <strong>-->
          <!--                              View-->
          <!--                            </strong>-->
          <!--                          </nuxt-link>-->
          <!--                        </v-col>-->
          <!--                      </v-row>-->
          <!--                    </div>-->
          <!--                  </v-col>-->
          <!--                </v-row>-->
          <!--              </div>-->

          <!--            </div>-->
          <!--          </section>-->
          <!--  End:  Azmoon test album card   -->
        </v-col>
      </v-row>
    </v-container>

    <!-- Start : Sample Test -->
    <!--    <related-content/>-->
    <!-- End : Sample test -->
    <!-- Start: Feed -->
    <section class="feed">
      <!--      <v-container class="pa-4 pa-md-12 pt-10">-->
      <!--        <v-row>-->
      <!--          <v-col cols="12" md="6">-->
      <!--            <latest-training-content/>-->
      <!--          </v-col>-->

      <!--          <v-col cols="12" md="6" class="related-ask-test py-0 d-flex flex-column justify-space-between">-->
      <!--            <related-qa/>-->

      <!--            <related-online-exam/>-->
      <!--          </v-col>-->

      <!--        </v-row>-->
      <!--      </v-container>-->
    </section>
    <!-- End: Feed -->

    <crash-report ref="crash_report" />
  </div>
</template>
<script>
import Breadcrumb from "../../../components/widgets/breadcrumb";
import LastViews from "@/components/common/last-views";
import RelatedCardBox from "./components/related-card-box";
import Category from "@/components/common/category";
import MultimediaPreviewGallery from "@/components/details/multimedia-preview-gallery.vue";
import RelatedContent from "@/components/details/related-content";
import LatestTrainingContent from "@/components/details/latest-training-content";
import RelatedQa from "@/components/details/related-qa";
import RelatedOnlineExam from "@/components/details/related-online-exam";
import CrashReport from "~/components/common/crash-report.vue";

export default {
  name: "multimedia-details",
  auth: false,
  components: {
    CrashReport,
    RelatedOnlineExam,
    RelatedQa,
    LatestTrainingContent,
    RelatedContent,
    MultimediaPreviewGallery,
    Category,
    Breadcrumb,
    LastViews,
    RelatedCardBox,
  },
  head() {
    return {
      title: this.contentData.title,
    };
  },
  async asyncData({ params, $axios, error }) {
    try {
      // Fetch content data from API
      const content = await $axios.$get(`/api/v1/files/${params.id}`);

      // If content exists
      if (content.status === 1 && content.data) {
        // Create a proper slug from the title
        const correctSlug =
          content.data.title_url ||
          content.data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/-$/, "");

        // Verify the URL slug matches the content
        if (params.slug !== correctSlug) {
          // If slugs don't match, we'll still render the page but with the correct data
          console.warn("Slug mismatch, but continuing with correct data");
        }

        return { contentData: content.data };
      } else {
        // No content found or API returned error
        return error({
          statusCode: 404,
          message: `Page not found: /multimedia/${params.id}/${params.slug}`,
        });
      }
    } catch (err) {
      // Handle API errors
      console.error("API error:", err);
      return error({
        statusCode: err.response?.status || 500,
        message:
          err.response?.data?.message ||
          "Something went wrong loading the content",
      });
    }
  },
  mounted() {
    //Init gallery image
    if (this.contentData) {
      this.$refs.preview_gallery.images = this.contentData.previewData.preview;
      this.$refs.preview_gallery.carouselVal = 0;

      //Update help link data
      this.$refs.preview_gallery.help_link_data = {
        state: this.contentData.state,
        section: this.contentData.section,
        base: this.contentData.base,
        course: this.contentData.course,
        lesson: this.contentData.lesson,
      };
    }

    this.initBreadCrumb();
  },

  data: () => ({
    description_tab: null,
    sell_btn: true,
    rating: 4.5,
    contentData: [],
    editMode: {
      title: false,
      describe: false,
      title_loading: false,
      describe_loading: false,
    },
    breads: [
      {
        text: "Multimedia",
        disabled: false,
        href: "/search?type=learnfiles",
      },
    ],
    detail: {
      poster: "poster1.jpg",
      linkPoster: "",
      title:
        "A collection of 120 test questions for lessons 6 to 9 on (3) 12th",
      rate: 5,
      previewImage: "test1.png",
      labels: [
        "History (3)",
        "Twelfth",
        "Second Secondary",
        "Literature",
        "Kermanshah",
        "District 2",
        "Shohadai Parvin",
        "Farvardin",
        "2019",
      ],
    },
    model: null,
    sampleTestList: [
      {
        type: "azmoon",
        img: "test2.png",
        description:
          "The series of tests of the twelfth history book Lessons 1 to 12",
        pages: "222",
        owner: "Gama management team",
        ownerImg: "gamaadmin.png",
      },
      {
        type: "azmoon",
        img: "test2.png",
        description:
          "The series of tests of the twelfth history book Lessons 1 to 12",
        pages: "222",
        owner: "Gama management team",
        ownerImg: "gamaadmin.png",
      },
      {
        type: "azmoon",
        img: "test2.png",
        description:
          "The series of tests of the twelfth history book Lessons 1 to 12",
        pages: "222",
        owner: "Gama management team",
        ownerImg: "gamaadmin.png",
      },
      {
        type: "",
        img: "test2.png",
        description:
          "The series of tests of the twelfth history book Lessons 1 to 12",
        pages: "222",
        owner: "Mehran Zangeneh",
        ownerImg: "teacher2.png",
      },
      {
        type: "",
        img: "test2.png",
        description:
          "The series of tests of the twelfth history book Lessons 1 to 12",
        pages: "222",
        owner: "Gama management team",
        ownerImg: "gamaadmin.png",
      },
      {
        type: "",
        img: "test2.png",
        description:
          "The series of tests of the twelfth history book Lessons 1 to 12",
        pages: "222",
        owner: "Gama management team",
        ownerImg: "gamaadmin.png",
      },
      {
        type: "",
        img: "test2.png",
        description:
          "The series of tests of the twelfth history book Lessons 1 to 12",
        pages: "222",
        owner: "Gama management team",
        ownerImg: "gamaadmin.png",
      },
      {
        type: "",
        img: "test2.png",
        description:
          "The series of tests of the twelfth history book Lessons 1 to 12",
        pages: "222",
        owner: "Gama management team",
        ownerImg: "gamaadmin.png",
      },
    ],
    relatedList: [
      {
        class: "learning",
        header: "Related educational content",
        icon: "learnfiles",
        description: " Powerpoint, video and ... files",
        contentItemList: [
          {
            title:
              "Online teaching, page 53 to 58 of Arabic (3) twelfth human | Lesson 4: The order of nature",
            link: "",
          },
          {
            title:
              "Pamphlet and Papers descriptive and test lesson 7 philosophy twelfth Reason in philosophy (1)",
            link: "",
          },
          {
            title:
              "Online teaching Arabic page 1 to 8 (3) 12th human | Lesson 1: Translation",
            link: "",
          },
        ],
      },
      {
        class: "question",
        header: "Related Q&As",
        icon: "qa",
        description: "Ask questions or answer other people's questions...",
        contentItemList: [
          {
            title:
              "Online teaching, page 53 to 58 of Arabic (3) twelfth human | Lesson 4: The order of nature",
            link: "",
          },
          {
            title:
              "Pamphlet and Papers descriptive and test lesson 7 philosophy twelfth Reason in philosophy (1)",
            link: "",
          },
          {
            title:
              "Online teaching Arabic page 1 to 8 (3) 12th human | Lesson 1: Translation",
            link: "",
          },
        ],
      },
      {
        class: "blog",
        header: "Related textbooks",
        icon: "blog",
        contentItemList: [
          {
            title:
              "Online teaching, page 53 to 58 of Arabic (3) twelfth human | Lesson 4: The order of nature",
            link: "",
          },
          {
            title:
              "Pamphlet and Papers descriptive and test lesson 7 philosophy twelfth Reason in philosophy (1)",
            link: "",
          },
          {
            title:
              "Online teaching Arabic page 1 to 8 (3) 12th human | Lesson 1: Translation",
            link: "",
          },
        ],
      },
      {
        class: "azmoon",
        header: "Related online tests",
        icon: "azmoon",
        contentItemList: [
          {
            title:
              "Online teaching, page 53 to 58 of Arabic (3) twelfth human | Lesson 4: The order of nature",
            link: "",
          },
          {
            title:
              "Pamphlet and Papers descriptive and test lesson 7 philosophy twelfth Reason in philosophy (1)",
            link: "",
          },
          {
            title:
              "Online teaching Arabic page 1 to 8 (3) 12th human | Lesson 1: Translation",
            link: "",
          },
        ],
      },
    ],

    copy_btn: "Copy",
    download_loading: false,
  }),
  methods: {
    initBreadCrumb() {
      this.breads.push(
        {
          text: this.contentData.section_title,
          disabled: false,
          href: `/search?type=learnfiles&section=${this.contentData.section}`,
        },
        {
          text: this.contentData.base_title,
          disabled: false,
          href: `/search?type=test&section=${this.contentData.section}&base=${this.contentData.base}`,
        },
        {
          text: this.contentData.lesson_title,
          disabled: false,
          href: `/search?type=test&section=${this.contentData.section}&base=${this.contentData.base}&lesson=${this.contentData.lesson}`,
        }
      );
    },
    openAuthDialog(val) {
      this.$router.push({ query: { auth_form: val } });
    },

    //Social section
    copyUrl() {
      navigator.clipboard.writeText(window.location.href);
      this.copy_btn = "Copied";
    },
    shareSocial(social_name) {
      if (social_name == "whatsapp")
        window.open(
          `https://api.whatsapp.com/send?text=${window.location.href}`
        );
      else if (social_name == "telegram")
        window.open(
          `https://telegram.me/share/url?url=${window.location.href}&text=${this.contentData.title}`
        );
    },

    //Download file
    startDownload(type) {
      // if (this.$auth.loggedIn) {
      this.download_loading = true;
      let apiUrl = "";
      apiUrl = `/api/v1/files/download/${this.$route.params.id}`;

      this.$fetch
        .$get(apiUrl)
        .then((response) => {
          var FileSaver = require("file-saver");
          FileSaver.saveAs(response.data.url, response.data.name);
        })
        .catch((err) => {
          if (err.response.status == 400) {
            if (
              err.response.data.status == 0 &&
              err.response.data.error == "creditNotEnough"
            ) {
              this.$toast.info("No enough credit");
            }
          } else if (err.response.status == 403) {
            this.$router.push({ query: { auth_form: "login" } });
          }
        })
        .finally(() => {
          this.download_loading = false;
        });
      // } else {
      //   this.openAuthDialog('login');
      // }
    },
    //End download file

    openCrashReportDialog() {
      this.$refs.crash_report.dialog = true;
      this.$refs.crash_report.form.type = "file";
    },

    isFree() {
      if (this.contentData.files.price > 0) return false;
      else return true;
    },
    //Convert form data from multipart to urlencode
    urlencodeFormData(fd) {
      var s = "";

      for (var pair of fd.entries()) {
        if (typeof pair[1] == "string") {
          s +=
            (s ? "&" : "") + this.encode(pair[0]) + "=" + this.encode(pair[1]);
        }
      }
      return s;
    },
    encode(s) {
      return encodeURIComponent(s).replace(/%20/g, "+");
    },
    updateDetails() {
      //Arrange to form data
      this.editMode.title_loading = true;
      let formData = new FormData();
      formData.append("title", this.contentData.title);
      formData.append("description", this.contentData.description);

      //End arrange to form data

      this.$fetch
        .$put(
          `/api/v1/files/${this.$route.params.id}`,
          this.urlencodeFormData(formData),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        )
        .then((response) => {
          if (response.data.id == 0 && response.data.repeated)
            this.$toast.info("The multimedia is duplicated");
          else {
            this.$toast.success("Updated successfully");
          }
        })
        .catch((err) => {
          if (err.response.status == 403)
            this.$router.push({ query: { auth_form: "login" } });
          else if (err.response.status == 400)
            this.$toast.error(err.response.data.message);
        })
        .finally(() => {
          this.editMode.title = false;
          this.editMode.describe = false;
          this.editMode.title_loading = false;
        });
    },
  },
};
</script>

<style>
.content_main_info {
  padding: 27px;
  background: #f5f5f5 !important;
  border-radius: 6px;
}

.content_main_info .creator_title {
  font-size: 18px;
}

.order-btn-holder {
  /*position: -webkit-sticky!important;*/
  position: fixed !important;
  bottom: 0 !important;
  z-index: 2 !important;
  border-top: 0.1rem solid #e1e2e3;
}

.order-btn-holder .v-btn {
  width: 40% !important;
}

.order-btn-holder span {
  font-size: 1.3rem;
}

p {
  font-size: 1.3rem !important;
}

.description-holder .v-tab {
  font-size: 1rem !important;
}

.description-holder .description-tabs {
  background: #f5f5f5 !important;
  padding: 0.8rem !important;
  border-radius: 0.8rem;
  margin-bottom: 1rem;
}

.description-holder .description-tabs .theme--light.v-tabs-items {
  background: #f5f5f5 !important;
  padding: 1.5rem;
}

.description-holder .v-tabs-bar__content {
  background: #f5f5f5 !important;
}
</style>
