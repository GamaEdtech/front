<template>
  <div class="test-details-content">
    <!-- Start : Category -->
    <category />
    <!-- End:Category -->

    <!--  Start: breadcrumb  -->
    <section>
      <v-container class="py-0">
        <div class="mt-0 py-0 header-path">
          <!-- Skeleton loader for breadcrumb -->
          <v-skeleton-loader
            v-if="pending"
            class="mx-auto"
            height="60"
          ></v-skeleton-loader>
          <!-- Actual breadcrumb when loaded -->
          <breadcrumb v-else :breads="breads" />
        </div>
      </v-container>
    </section>
    <!--  End: breadcrumb  -->

    <!--  Start: detail  -->
    <section>
      <v-container class="py-0">
        <!-- Skeleton loading state -->
        <div v-if="pending" class="detail mt-md-8">
          <v-row>
            <!-- Skeleton for gallery -->
            <v-col cols="12" md="3">
              <v-skeleton-loader
                class="mx-auto"
                height="300"
              ></v-skeleton-loader>
            </v-col>

            <!-- Skeleton for description -->
            <v-col cols="12" md="6">
              <v-skeleton-loader
                class="mx-auto"
                height="300"
              ></v-skeleton-loader>
            </v-col>

            <!-- Skeleton for sidebar -->
            <v-col md="3">
              <v-skeleton-loader
                class="mx-auto"
                type="list-item-avatar"
              ></v-skeleton-loader>

              <v-skeleton-loader
                class="mx-auto mt-2"
                type="list-item-three-line"
                repeat="4"
              ></v-skeleton-loader>

              <v-skeleton-loader
                class="mx-auto mt-4"
                type="button"
              ></v-skeleton-loader>
            </v-col>
          </v-row>
        </div>

        <!-- Actual content when loaded -->
        <div v-else class="detail mt-md-8">
          <v-row>
            <v-col cols="12" md="3">
              <!--Show gallery of preview and book first page-->
              <preview-gallery
                :image-urls="galleryImages"
                :help-link-data="galleryHelpData"
                :initial-slide="1"
              />
              <!--Show gallery of preview and book first page-->
            </v-col>
            <v-col cols="12" md="6">
              <!--  Description   -->
              <exam-detail-description-section
                :title="contentData.title"
                :topics="contentData.topics"
                :tests-num="contentData.tests_num"
                :level="contentData.level"
                :start-date="contentData.start_date"
                :end-date="contentData.end_date"
                :exam-time="contentData.azmoon_time"
                :section-title="contentData.section_title"
                :section-id="contentData.section"
                :base-title="contentData.base_title"
                :base-id="contentData.base"
                :lesson-title="contentData.lesson_title"
                :lesson-id="contentData.lesson"
                :is-logged-in="$auth.loggedIn"
                :credit="$auth.user?.credit || 0"
                :participation="contentData.participation"
                :pdf-price="contentData.files?.pdf?.price || 0"
                @login="openAuthDialog('login')"
                @register="openAuthDialog('register')"
              />
            </v-col>
            <v-col md="3">
              <exam-detail-sidebar-details
                :avatar="contentData.avatar"
                :first-name="contentData.first_name"
                :last-name="contentData.last_name"
                :exam-type-title="contentData.azmoon_type_title"
                :views="contentData.views"
                :up-date="contentData.up_date"
                :exam-id="contentData.id"
                :exam-prices="contentData.price"
                :is-logged-in="$auth.loggedIn"
                :user-exam-status="contentData.examUserData?.status || 0"
                :download-loading="download_loading"
                :title="contentData.title"
                @download="startDownload"
                @login="openAuthDialog('login')"
                @copy-url="copyUrl"
                @share="shareSocial"
                @crash-report="openCrashReportDialog"
              />
            </v-col>
          </v-row>
        </div>
      </v-container>
    </section>

    <!--Mobile order section-->
    <exam-detail-mobile-order-section
      v-if="!pending"
      :exam-id="contentData.id"
      :exam-prices="contentData.price"
      :is-logged-in="$auth.loggedIn"
      :credit="$auth.user?.credit || 0"
      :user-exam-status="contentData.examUserData?.status || 0"
      :download-loading="download_loading"
      @download="startDownload"
      @login="openAuthDialog('login')"
      @register="openAuthDialog('register')"
    />
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

<script setup>
import Breadcrumb from "@/components/widgets/breadcrumb";
import LastViews from "@/components/common/last-views";
import RelatedCardBox from "./components/related-card-box";
import Category from "@/components/common/category";
import PreviewGallery from "@/components/details/preview-gallery";
import RelatedContent from "@/components/details/related-content";
import LatestTrainingContent from "@/components/details/latest-training-content";
import RelatedQa from "@/components/details/related-qa";
import RelatedOnlineExam from "@/components/details/related-online-exam";
import CrashReport from "~/components/common/crash-report.vue";
import ExamDetailDescriptionSection from "@/components/exam/detail/DescriptionSection.vue";
import ExamDetailSidebarDetails from "@/components/exam/detail/SidebarDetails.vue";
import ExamDetailMobileOrderSection from "@/components/exam/detail/MobileOrderSection.vue";
import ExamDetailShareDialog from "@/components/exam/detail/ShareDialog.vue";

// Get api, router, and route
const route = useRoute();
const router = useRouter();
const { $auth, $toast } = useNuxtApp();

// Component data
const contentData = ref({});
const pending = ref(true);
const crash_report = ref(null);
const copy_btn = ref("Copy");
const download_loading = ref(false);

// Gallery data
const galleryImages = ref([]);
const galleryHelpData = ref({
  state: "",
  section: "",
  base: "",
  course: "",
  lesson: "",
});

// Reactive data
const sell_btn = ref(true);
const rating = ref(4.5);

// Fetch the exam data
async function fetchExamData() {
  try {
    const { id } = route.params;
    const response = await $fetch(`/api/v1/exams/${id}`);

    if (response.status === 1 && response.data) {
      return response.data;
    }

    return response;
  } catch (err) {
    throw err;
  }
}

// Use asyncData to fetch data
const { data: asyncContentData, error } = useAsyncData(
  `exam-${route.params.id}`,
  async () => {
    try {
      const data = await fetchExamData();
      return data;
    } catch (err) {
      return null;
    }
  },
  {
    server: true,
    lazy: false,
    immediate: true,
    watch: [() => route.params.id],
  }
);

// Set page title
useHead(() => ({
  title: contentData.value?.title || "Exam Details",
}));

// Lifecycle hooks
onMounted(async () => {
  pending.value = true;

  // Verify we have content data
  if (!contentData.value || Object.keys(contentData.value).length === 0) {
    if (asyncContentData.value) {
      contentData.value = asyncContentData.value;

      // Update gallery data
      if (contentData.value.thumb_pic_url) {
        console.log("Setting gallery image:", contentData.value.thumb_pic_url);
        galleryImages.value = [contentData.value.thumb_pic_url];
      }

      galleryHelpData.value = {
        state: contentData.value.state || "",
        section: contentData.value.section || "",
        base: contentData.value.base || "",
        course: contentData.value.course || "",
        lesson: contentData.value.lesson || "",
      };

      initBreadCrumb();
    }
  }

  pending.value = false;
});

// Reactive data
const breads = reactive([
  {
    text: "Online exam",
    disabled: false,
    href: "/search?type=azmoon",
  },
]);

const detail = reactive({
  poster: "poster1.jpg",
  linkPoster: "",
  title: "A collection of 120 test questions for lessons 6 to 9 on (3) 12th",
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
});

// Sample data (could be moved to its own file if needed)
const sampleTestList = reactive([
  {
    type: "azmoon",
    img: "test2.png",
    description:
      "The series of tests of the twelfth history book Lessons 1 to 12",
    pages: "222",
    owner: "Gama management team",
    ownerImg: "gamaadmin.png",
  },
  // ... existing code ...
]);

const relatedList = reactive([
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
      // ... existing code ...
    ],
  },
  // ... existing code ...
]);

// Methods
const initBreadCrumb = () => {
  if (!contentData.value) return;

  breads.push(
    {
      text: contentData.value.section_title,
      disabled: false,
      href: `/search?type=azmoon&section=${contentData.value.section}`,
    },
    {
      text: contentData.value.base_title,
      disabled: false,
      href: `/search?type=azmoon&section=${contentData.value.section}&base=${contentData.value.base}`,
    },
    {
      text: contentData.value.lesson_title,
      disabled: false,
      href: `/search?type=azmoon&section=${contentData.value.section}&base=${contentData.value.base}&lesson=${contentData.value.lesson}`,
    }
  );
};

const openAuthDialog = (val) => {
  router.push({ query: { auth_form: val } });
};

const copyUrl = () => {
  navigator.clipboard.writeText(window.location.href);
  copy_btn.value = "Copied";
};

const shareSocial = (social_name) => {
  const pageTitle = contentData.value?.title || "";

  if (social_name === "whatsapp")
    window.open(`https://api.whatsapp.com/send?text=${window.location.href}`);
  else if (social_name === "telegram")
    window.open(
      `https://telegram.me/share/url?url=${window.location.href}&text=${pageTitle}`
    );
};

const startDownload = async () => {
  download_loading.value = true;
  try {
    const response = await $fetch(`/api/v1/exams/download/${route.params.id}`);
    const FileSaver = await import("file-saver");
    FileSaver.saveAs(response.data.url, response.data.name);
  } catch (err) {
    if (err.response?.status == 400) {
      if (
        err.response.data.status == 0 &&
        err.response.data.error == "creditNotEnough"
      ) {
        useToast().info("No enough credit");
      }
    } else if (err.response?.status == 403) {
      router.push({ query: { auth_form: "login" } });
    }
    console.log(err);
  } finally {
    download_loading.value = false;
  }
};

const openCrashReportDialog = () => {
  crash_report.value.dialog = true;
  crash_report.value.form.type = "test";
};

// Computed properties
const isFree = computed(() => {
  if (!contentData.value) return true;

  if (
    contentData.value.participation?.price > 0 &&
    contentData.value.files?.pdf?.price > 0
  )
    return false;
  else return true;
});

// Define expose for components that need to be accessed by ref
defineExpose({
  crash_report,
});
</script>

<script>
// Component metadata
export default {
  name: "exam-details",
  auth: false,
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
  right: 0 !important;
  left: 0 !important;
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
</style>
