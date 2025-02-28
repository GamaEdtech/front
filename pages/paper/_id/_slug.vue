<template>
  <div class="test-details-content">
    <!-- Start : Category -->
    <category />

    <!-- End:Category -->

    <!--  Start: breadcrumb  -->
    <section>
      <v-container class="py-0">
        <div class="mt-0 py-0 header-path">
          <breadcrumb :breads="breads" />
        </div>
      </v-container>
    </section>
    <!--  End: breadcrumb  -->

    <!--  Start: detail  -->
    <section>
      <v-container class="py-0">
        <div class="detail mt-6 mt-md-8">
          <v-row>
            <v-col cols="12" md="8" lg="6" class="px-8 px-lg=0">
              <!--  Description   -->
              <div class="d-flex mb-4">
                <div class="w-100">
                  <div class="d-flex align-center justify-space-between header">
                    <h1 class="gama-text-h5" v-show="editMode.title == false">
                      {{ contentData.title }}
                      <v-btn
                        v-if="$auth.user?.id == contentData.user_"
                        @click="editMode.title = true"
                        fab
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
                      placeholder="Title"
                      rows="3"
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
                    <span
                      v-show="editMode.describe == false"
                      :class="
                        $vuetify.breakpoint.xs
                          ? 'gama-text-body1'
                          : 'gama-text-body2'
                      "
                      v-html="
                        contentData.description
                          ? contentData.description.replace(/\n/g, '<br />')
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
                    <!--End description-->
                  </div>

                  <div class="label-holder">
                    <v-chip
                      link
                      class="mr-1 blue-grey darken-1 white--text"
                      :small="$vuetify.breakpoint.mdAndDown"
                    >
                      <nuxt-link
                        :to="`/search?type=test&section=${contentData.section}`"
                      >
                        {{ contentData.section_title }}
                      </nuxt-link>
                    </v-chip>
                    <v-chip
                      link
                      class="mr-1 blue-grey darken-1 white--text"
                      :small="$vuetify.breakpoint.mdAndDown"
                    >
                      <nuxt-link
                        :to="`/search?type=test&section=${contentData.section}&base=${contentData.base}`"
                      >
                        {{ contentData.base_title }}
                      </nuxt-link>
                    </v-chip>
                    <v-chip
                      link
                      class="ma-1 blue-grey darken-1 white--text"
                      :small="$vuetify.breakpoint.mdAndDown"
                    >
                      <nuxt-link
                        :to="`/search?type=test&section=${contentData.section}&base=${contentData.base}&lesson=${contentData.lesson}`"
                      >
                        {{ contentData.lesson_title }}
                      </nuxt-link>
                    </v-chip>
                    <v-chip
                      class="ma-1 blue-grey darken-1 white--text"
                      :small="$vuetify.breakpoint.mdAndDown"
                    >
                      {{ contentData.edu_month_title }}
                    </v-chip>
                    <v-chip
                      :small="$vuetify.breakpoint.mdAndDown"
                      :to="`/search?type=test&section=${contentData.section}&base=${contentData.base}&lesson=${contentData.lesson}&edu_year=${contentData.edu_year}`"
                      class="ma-1 blue-grey darken-1 white--text"
                    >
                      {{ contentData.edu_year }}
                    </v-chip>
                  </div>
                </div>
              </div>
              <!--   Download Btn and Description  -->
              <!-- <div class="text-center download-sec"> -->
              <!-- <div class="d-none d-md-block mb-4" v-show="isFree == false">
                  <p v-if="!$auth.loggedIn" class="gama-text-body2">
                    <span class="mdi mdi-bell icon"></span>
                    <span @click="openAuthDialog('login')" class="login"
                      >Login</span
                    >
                    <span @click="openAuthDialog('register')" class="register">
                      (register)
                    </span>
                    to download and charge your wallet.
                  </p>
                  <span v-else class="gama-text-body2">
                    Your wallet charge is ${{ $auth.user && $auth.user.credit }}
                  </span>
                  <nuxt-link
                    class="blue--text"
                    v-if="$auth.loggedIn"
                    to="/user/charge-wallet"
                    >(Top Up Wallet)</nuxt-link
                  >
                </div> -->
              <!-- <div class="font-weight-bold answer gama-text-body2">
                  <span class="mdi mdi-checkbox-marked icon"></span>
                  <span> The key answer sheet is at the end of the exam file.</span>
                </div> -->
              <!-- </div> -->
              <!--   fileCopyRight  -->
              <!-- <div class="d-none d-md-block text-center">
                <p class="gama-text-body2 file-copy-right">
                  It is forbidden to republish the contents in cyber space.
                </p>
              </div> -->
            </v-col>
            <v-col cols="12" sm="5" lg="3" order-lg="first">
              <!--Show gallery of preview and book first page-->
              <preview-gallery ref="preview_gallery" />
              <!--Show gallery of preview and book first page-->
            </v-col>

            <v-col sm="7" md="4" lg="3">
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
                    Classification: {{ contentData.test_type_title }}
                  </v-col>
                  <v-col cols="12" class="pb-0">
                    <i class="fa-solid fa-book-open-reader mr-1 icon"></i>
                    Page count: {{ contentData.q_file_pages }}
                  </v-col>
                  <v-col cols="12" class="pb-0">
                    <i class="fa-solid fa-eye mr-1 icon"></i>
                    Viewed: {{ contentData.views }}
                  </v-col>
                  <v-col cols="12" class="pb-0">
                    <i class="fa-solid fa-calendar-alt mr-1 icon"></i>
                    Last update: {{ $moment(contentData.up_date).fromNow() }}
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
                    <div v-if="contentData.files.word.exist == true">
                      <v-btn
                        @click="startDownload('q_word')"
                        block
                        color="primary"
                        class="mb-2"
                      >
                        Download Question Doc
                        {{
                          contentData.files.word.price > 0
                            ? "| $" + contentData.files.word.price
                            : ""
                        }}
                      </v-btn>
                    </div>
                    <div v-if="contentData.files.pdf.exist == true">
                      <v-btn
                        @click="startDownload('q_pdf')"
                        class="mb-2 white--text font-weight-bold"
                        block
                        color="#E60012"
                      >
                        {{ contentData.test_type_title }}
                        {{
                          contentData.files.word.price > 0
                            ? "| $" + contentData.files.word.price
                            : ""
                        }}
                      </v-btn>
                    </div>
                    <div v-if="contentData.files.answer.exist == true">
                      <v-btn
                        v-show="contentData.files.answer.ext == 'pdf'"
                        class="mb-2 font-weight-bold"
                        @click="startDownload('a_file')"
                        block
                        color="teal accent-3"
                      >
                        Mark Sheme
                        {{
                          contentData.files.word.price > 0
                            ? "| $" + contentData.files.word.price
                            : ""
                        }}
                      </v-btn>
                      <v-btn
                        v-show="contentData.files.answer.ext == 'word'"
                        @click="startDownload('a_file')"
                        block
                        color="primary"
                        class="mb-2"
                      >
                        Download Answer Doc
                        {{
                          contentData.files.word.price > 0
                            ? "| $" + contentData.files.word.price
                            : ""
                        }}
                      </v-btn>
                    </div>
                    <v-btn
                      v-if="
                        contentData.exams && contentData.exams[0].status != 7
                      "
                      :to="`/exam/${contentData?.exams[0].id}`"
                      block
                      color="#5600e8"
                      class="mb-2 white--text font-weight-bold"
                    >
                      Begin Quiz
                    </v-btn>
                    <v-btn
                      v-else
                      :to="`/test-maker/create?board=${contentData.section}&grade=${contentData.base}&subject=${contentData.lesson}&paperId=${contentData.id}`"
                      block
                      outlined
                      color="primary"
                      class="mb-2 white--text font-weight-bold"
                    >
                      Create Quiz
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card>
              <!-- <v-row>
                <v-col cols="12" class="text-center">
                  <p class="mt-2 gama-text-overline">
                    <i class="fa-solid fa-exclamation-circle mr-1 icon"></i>
                    Republishing is prohibited in cyber space.
                  </p>
                </v-col>
              </v-row> -->
            </v-col>
          </v-row>
        </div>
      </v-container>
    </section>

    <!--Mobile order section-->
    <v-card class="order-btn-holder d-block d-md-none">
      <v-card-text class="pb-0">
        <v-row class="px-10 text-center">
          <v-col cols="12" class="pb-1 pt-0">
            <div v-if="contentData.files.word.exist == true">
              <v-btn
                @click="startDownload('q_word')"
                block
                color="primary"
                class="mb-2"
              >
                Download Question Doc
                {{
                  contentData.files.word.price > 0
                    ? "| $" + contentData.files.word.price
                    : ""
                }}
              </v-btn>
            </div>
            <div v-if="contentData.files.pdf.exist == true">
              <v-btn
                @click="startDownload('q_pdf')"
                class="mb-2 white--text font-weight-bold"
                block
                color="#E60012"
              >
                Question Paper
                {{
                  contentData.files.word.price > 0
                    ? "| $" + contentData.files.word.price
                    : ""
                }}
              </v-btn>
            </div>
            <div v-if="contentData.files.answer.exist == true">
              <v-btn
                v-show="contentData.files.answer.ext == 'pdf'"
                class="mb-2 font-weight-bold"
                @click="startDownload('a_file')"
                block
                color="teal accent-3"
              >
                Mark Sheme
                {{
                  contentData.files.word.price > 0
                    ? "| $" + contentData.files.word.price
                    : ""
                }}
              </v-btn>
              <v-btn
                v-show="contentData.files.answer.ext == 'word'"
                @click="startDownload('a_file')"
                block
                color="primary"
                class="mb-2"
              >
                Download Answer Doc
                {{
                  contentData.files.word.price > 0
                    ? "| $" + contentData.files.word.price
                    : ""
                }}
              </v-btn>
            </div>
          </v-col>

          <v-col cols="12">
            <div class="mb-4" v-if="isFree == false">
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
                Your wallet charge is ${{ $auth.user && $auth.user.credit }}
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

    <!-- Start : Past Papers -->
    <related-content
      class="mt-8"
      :board="contentData.section"
      :grade="contentData.base"
      :subject="contentData.lesson"
      :test_type="contentData.test_type"
    />

    <!-- End : Past Papers -->
    <!-- Start: Feed -->
    <section class="feed">
      <!-- <v-container class="pa-4 pa-md-12 pt-10">
        <v-row>
          <v-col cols="12" md="6">
            <latest-training-content />
          </v-col>

          <v-col
            cols="12"
            md="6"
            class="related-ask-test py-0 d-flex flex-column justify-space-between"
          >
            <related-qa />

            <related-online-exam />
          </v-col>
        </v-row>
      </v-container> -->
    </section>
    <!-- End: Feed -->

    <crash-report ref="crash_report" />
  </div>
</template>
<script>
import Breadcrumb from "../../../components/widgets/breadcrumb";
import LastViews from "@/components/common/last-views";
import RelatedCardBox from "@/components/paper/related-card-box.vue";
import Category from "@/components/common/category";
import PreviewGallery from "@/components/details/preview-gallery";
import RelatedContent from "@/components/details/related-content";
import LatestTrainingContent from "@/components/details/latest-training-content";
import RelatedQa from "@/components/details/related-qa";
import RelatedOnlineExam from "@/components/details/related-online-exam";
import CrashReport from "~/components/common/crash-report.vue";

export default {
  name: "paper-details",
  auth: false,
  components: {
    CrashReport,
    RelatedOnlineExam,
    RelatedQa,
    LatestTrainingContent,
    RelatedContent,
    PreviewGallery,
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
  async asyncData({ params, $axios, redirect }) {
    // This could also be an action dispatch
    try {
      const content = await $axios.$get(`/api/v1/tests/${params.id}`);
      return { contentData: content.data };
    } catch (e) {
      if (e.response && e.response.status === 404) {
        redirect("/search?type=test");
      }
    }
  },
  mounted() {
    //Init gallery image
    if (this.contentData) {
      if (this.contentData.thumb_pic)
        this.$refs.preview_gallery.images.push(this.contentData.thumb_pic);
      this.$refs.preview_gallery.images.push(this.contentData.lesson_pic);
      this.$refs.preview_gallery.carouselVal = this.contentData.thumb_pic
        ? 0
        : 1;

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
    sell_btn: true,
    rating: 4.5,
    contentData: [],
    breads: [
      {
        text: "Past Papers",
        disabled: false,
        href: "/search?type=test",
      },
    ],
    editMode: {
      title: false,
      describe: false,
      title_loading: false,
      describe_loading: false,
    },
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
        description: " File های پاورپوینت، ویدئو، صوتی، متنی و ...",
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
          href: `/search?type=test&section=${this.contentData.section}`,
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
      //if (this.$auth.loggedIn) {
      this.download_loading = true;
      let apiUrl = "";
      if (type === "q_word")
        apiUrl = `/api/v1/tests/download/${this.$route.params.id}/word`;
      if (type === "q_pdf")
        apiUrl = `/api/v1/tests/download/${this.$route.params.id}/pdf`;
      if (type === "a_file")
        apiUrl = `/api/v1/tests/download/${this.$route.params.id}/answer`;
      this.$axios
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
            this.openAuthDialog("login");
            // this.$router.push({ query: { auth_form: "login" } });
          }
          console.log(err);
        })
        .finally(() => {
          this.download_loading = false;
        });
      // } else {
      //   this.openAuthDialog("login");
      // }
    },
    //End download file

    openCrashReportDialog() {
      this.$refs.crash_report.dialog = true;
      this.$refs.crash_report.form.type = "test";
    },
    isFree() {
      if (
        this.contentData.files.answer.price > 0 &&
        this.contentData.files.pdf.price > 0 &&
        this.contentData.files.word.price > 0
      )
        return false;
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

      this.$axios
        .$put(
          `/api/v1/tests/${this.$route.params.id}`,
          this.urlencodeFormData(formData),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        )
        .then((response) => {
          if (response.data.id == 0 && response.data.repeated)
            this.$toast.info("The paper is duplicated");
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
  padding-top: 16px !important;
  background: #f6f8fa !important;
  border-top: 0.1rem solid #e1e2e3;
  width: 100%;
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
</style>
