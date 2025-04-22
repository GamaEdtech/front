<!-- in refactor proccess -->
<template>
  <div class="test-details-content">
    <!-- Start : Category -->
    <common-category />

    <!-- End:Category -->

    <!--  Start: breadcrumb  -->
    <section>
      <v-container class="py-0">
        <div class="mt-0 py-0 header-path">
          <widgets-breadcrumb :breads="breads" />
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
                        display.xs ? 'gama-text-body1' : 'gama-text-body2'
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
                      class="mr-1 bg-blue-grey-darken-1 white--text"
                      :small="display.mdAndDown"
                    >
                      <nuxt-link
                        :to="`/search?type=test&section=${contentData.section}`"
                      >
                        {{ contentData.section_title }}
                      </nuxt-link>
                    </v-chip>
                    <v-chip
                      link
                      class="mr-1 bg-blue-grey-darken-1 white--text"
                      :small="display.mdAndDown"
                    >
                      <nuxt-link
                        :to="`/search?type=test&section=${contentData.section}&base=${contentData.base}`"
                      >
                        {{ contentData.base_title }}
                      </nuxt-link>
                    </v-chip>
                    <v-chip
                      link
                      class="ma-1 bg-blue-grey-darken-1 white--text"
                      :small="display.mdAndDown"
                    >
                      <nuxt-link
                        :to="`/search?type=test&section=${contentData.section}&base=${contentData.base}&lesson=${contentData.lesson}`"
                      >
                        {{ contentData.lesson_title }}
                      </nuxt-link>
                    </v-chip>
                    <v-chip
                      class="ma-1 bg-blue-grey-darken-1 white--text"
                      :small="display.mdAndDown"
                    >
                      {{ contentData.edu_month_title }}
                    </v-chip>
                    <v-chip
                      :small="display.mdAndDown"
                      :to="`/search?type=test&section=${contentData.section}&base=${contentData.base}&lesson=${contentData.lesson}&edu_year=${contentData.edu_year}`"
                      class="ma-1 bg-blue-grey-darken-1 white--text"
                    >
                      {{ contentData.edu_year }}
                    </v-chip>
                  </div>
                </div>
              </div>
            </v-col>
            <v-col cols="12" sm="5" lg="3" order-lg="first">
              <!--Show gallery of preview and book first page-->
              <details-preview-gallery
                :image-urls="previewImages"
                :help-link-data="galleryHelpData"
                :initial-slide="1"
              />
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
                    Last update: {{ $dayjs(contentData.up_date).fromNow() }}
                  </v-col>
                  <v-col cols="12" class="pb-0">
                    <div @click="openCrashReportDialog" class="pointer">
                      <i class="fa-solid fa-bug mr-1 icon"></i>
                      Crash report
                    </div>
                  </v-col>
                  <v-col cols="12" class="pb-0">
                    <common-detail-share-dialog :title="title" />
                  </v-col>
                </v-row>

                <div class="text-center mt-2">
                  <v-rating
                    v-model="rating"
                    hover
                    background-color="grey-darken-1"
                    color="yellow-darken-3"
                    size="35"
                    half-increments
                  ></v-rating>
                </div>
                <v-divider class="d-none d-md-block" />

                <v-row class="mt-1 d-none d-md-block">
                  <v-col cols="12" class="pb-0">
                    <div v-if="contentData.files?.word.exist == true">
                      <v-btn
                        @click="startDownload('q_word')"
                        block
                        color="primary"
                        class="mb-2"
                      >
                        Download Question Doc
                        {{
                          contentData.files?.word.price > 0
                            ? "| $" + contentData.files?.word.price
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
                          contentData.files?.word.price > 0
                            ? "| $" + contentData.files?.word.price
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
                          contentData.files?.word.price > 0
                            ? "| $" + contentData.files?.word.price
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
                          contentData.files?.word.price > 0
                            ? "| $" + contentData.files?.word.price
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
            <div v-if="contentData.files?.word.exist == true">
              <v-btn
                @click="startDownload('q_word')"
                block
                color="primary"
                class="mb-2"
              >
                Download Question Doc
                {{
                  contentData.files?.word.price > 0
                    ? "| $" + contentData.files?.word.price
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
                  contentData.files?.word.price > 0
                    ? "| $" + contentData.files?.word.price
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
                  contentData.files?.word.price > 0
                    ? "| $" + contentData.files?.word.price
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
                  contentData.files?.word.price > 0
                    ? "| $" + contentData.files?.word.price
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
  </div>
</template>
<script setup>
const route = useRoute();
const router = useRouter();
const { data: contentData, error } = await useAsyncData(async () => {
  try {
    const response = await $fetch(`/api/v1/tests/${route.params.id}`);
    return response.data;
  } catch (e) {
    if (e?.status === 404) {
      router.push("/search?type=test");
    }
    throw e;
  }
});

const schemaData = computed(() => ({
  "@context": "https://schema.org",
  "@type": "LearningResource",
  name: contentData.value?.title || "GamaEdtech",
  image:
    contentData.value?.thumb_pic ||
    contentData.value?.lesson_pic ||
    "https://gamatrain.com/images/gamatrain-logo.svg", // Ensure it's a valid URL
  url: route.fullPath || "", // Optional: Add the page URL
  description: contentData.value?.description || "GamaEdtech",
}));

useHead({
  title: contentData.value.title,
  script: [
    {
      hid: "json-ld-schema",
      innerHTML: JSON.stringify(schemaData.value),
      type: "application/ld+json",
    },
  ],
  __dangerouslyDisableSanitizersByTagID: {
    "json-ld-schema": ["innerHTML"],
  },
});

const previewImages = ref([]);
const galleryHelpData = ref({
  state: "",
  section: "",
  base: "",
  course: "",
  lesson: "",
});

if (contentData.value) {
  previewImages.value.push(contentData.value.thumb_pic);
  previewImages.value.push(contentData.value.lesson_pic);
  previewImages.value.carouselVal = 0;
  //Update help link data

  galleryHelpData.value = {
    state: contentData.value?.state || "",
    section: contentData.value?.section || "",
    base: contentData.value?.base || "",
    course: contentData.value?.course || "",
    lesson: contentData.value?.lesson || "",
  };
}

const rating = ref(4.5);
const breads = ref([
  {
    text: "Paper",
    disabled: false,
    href: "/search?type=test",
  },
]);
const editMode = ref({
  title: false,
  describe: false,
  title_loading: false,
  describe_loading: false,
});

const download_loading = ref(false);
const display = useGlobalDisplay(); // Assuming you are using this composable

const initBreadCrumb = () => {
  breads.value.push(
    {
      text: contentData.value.section_title,
      disabled: false,
      href: `/search?type=test&section=${contentData.value.section}`,
    },
    {
      text: contentData.value.base_title,
      disabled: false,
      href: `/search?type=test&section=${contentData.value.section}&base=${contentData.value.base}`,
    },
    {
      text: contentData.value.lesson_title,
      disabled: false,
      href: `/search?type=test&section=${contentData.value.section}&base=${contentData.value.base}&lesson=${contentData.value.lesson}`,
    }
  );
};

initBreadCrumb();

const openAuthDialog = (val) => {
  router.push({ query: { auth_form: val } });
};

//Download file
const startDownload = (type) => {
  //if (this.$auth.loggedIn) {
  download_loading.value = true;
  let apiUrl = "";
  if (type === "q_word")
    apiUrl = `/api/v1/tests/download/${route.params.id}/word`;
  if (type === "q_pdf")
    apiUrl = `/api/v1/tests/download/${route.params.id}/pdf`;
  if (type === "a_file")
    apiUrl = `/api/v1/tests/download/${route.params.id}/answer`;
  $fetch
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
        openAuthDialog("login");
        // this.$router.push({ query: { auth_form: "login" } });
      }
      console.log(err);
    })
    .finally(() => {
      download_loading.value = false;
    });
  // } else {
  //   this.openAuthDialog("login");
  // }
};
//End download file

const openCrashReportDialog = () => {
  crash_report.value.dialog = true;
  crash_report.value.form.type = "test";
};
const isFree = () => {
  if (
    contentData.value.files.answer.price > 0 &&
    contentData.value.files.pdf.price > 0 &&
    contentData.value.files.word.price > 0
  )
    return false;
  else return true;
};
//Convert form data from multipart to urlencode
const urlencodeFormData = (fd) => {
  var s = "";

  for (var pair of fd.entries()) {
    if (typeof pair[1] == "string") {
      s += (s ? "&" : "") + encode(pair[0]) + "=" + encode(pair[1]);
    }
  }
  return s;
};
const encode = (s) => {
  return encodeURIComponent(s).replace(/%20/g, "+");
};

const updateDetails = () => {
  //Arrange to form data
  editMode.value.title_loading = true;
  let formData = new FormData();
  formData.append("title", contentData.value.title);
  formData.append("description", contentData.value.description);

  //End arrange to form data

  $fetch
    .$put(
      `/api/v1/tests/${this.$route.params.id}`,
      urlencodeFormData(formData),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )
    .then((response) => {
      if (response.data.id == 0 && response.data.repeated)
        $toast.info("The paper is duplicated");
      else {
        $toast.success("Updated successfully");
      }
    })
    .catch((err) => {
      if (err.response.status == 403)
        router.push({ query: { auth_form: "login" } });
      else if (err.response.status == 400)
        $toast.error(err.response.data.message);
    })
    .finally(() => {
      editMode.title = false;
      editMode.describe = false;
      editMode.title_loading = false;
    });
};
</script>

<style>
.content_main_info {
  padding: 27px !important;
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
