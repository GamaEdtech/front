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
                      v-show="!editMode.title"
                    >
                      {{ contentData?.title }}
                      <v-btn
                        @click="editMode.title = true"
                        fab
                        v-if="user?.id == contentData?.user_"
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
                            v-show="!editMode.describe"
                            v-html="
                              contentData?.description
                                ? contentData?.description.replace(
                                    /\n/g,
                                    '<br />'
                                  )
                                : ''
                            "
                          />
                          <v-btn
                            v-if="user?.id == contentData?.user_"
                            v-show="!editMode.describe"
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
                              <li v-for="item in contentData?.collectionList">
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
                        :to="`/search?type=learnfiles&section=${contentData?.section}`"
                      >
                        {{ contentData?.section_title }}
                      </nuxt-link>
                    </v-chip>
                    <v-chip link class="mr-1">
                      <nuxt-link
                        :to="`/search?type=learnfiles&section=${contentData?.section}&base=${contentData?.base}`"
                      >
                        {{ contentData?.base_title }}
                      </nuxt-link>
                    </v-chip>
                    <v-chip link class="ma-1">
                      <nuxt-link
                        :to="`/search?type=learnfiles&section=${contentData?.section}&base=${contentData?.base}&lesson=${contentData?.lesson}`"
                      >
                        {{ contentData?.lesson_title }}
                      </nuxt-link>
                    </v-chip>
                  </div>
                </div>
              </div>
              <!--   Download Btn and Description  -->
              <div class="text-center download-sec">
                <div
                  v-if="!checkIsFree"
                  class="d-none d-md-block mb-4 gama-text-body2"
                >
                  <span v-if="!isLoggedIn">
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
                    Your wallet charge is ${{ user?.credit }}
                  </span>
                  <nuxt-link
                    class="blue--text"
                    v-if="isLoggedIn"
                    to="/user/charge-wallet"
                    >(Top Up Wallet)</nuxt-link
                  >
                </div>
              </div>
            </v-col>
            <v-col md="3">
              <v-card flat class="content_main_info">
                <v-row class="align-center">
                  <v-col cols="3">
                    <v-img
                      :src="contentData?.avatar"
                      alt=""
                      class="d-inline-block"
                      cover
                      height="48"
                      width="48"
                    />
                  </v-col>
                  <v-col cols="9" class="pl-0">
                    <p class="creator_title">
                      {{ contentData?.first_name }} {{ contentData?.last_name }}
                    </p>
                  </v-col>
                </v-row>
                <v-divider class="my-2" />
                <v-row>
                  <v-col cols="12" class="pb-0">
                    <i class="fa-solid fa-folder mr-1 icon"></i>
                    File type: {{ contentData?.content_type_title }}
                  </v-col>
                  <v-col cols="12" class="pb-0">
                    <i class="fa-solid fa-book-open-reader mr-1 icon"></i>
                    Page count: {{ contentData?.file_pages }}
                  </v-col>
                  <v-col cols="12" class="pb-0">
                    <i class="fa-solid fa-eye mr-1 icon"></i>
                    Viewed: {{ contentData?.views }}
                  </v-col>
                  <v-col cols="12" class="pb-0">
                    <i class="fa-solid fa-calendar-alt mr-1 icon"></i>
                    Last update: {{ dayjs(contentData?.up_date).fromNow() }}
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
                    <div>
                      <v-btn
                        @click="startDownload('pptx')"
                        block
                        dark
                        color="#bf360c"
                        class="mb-2"
                      >
                        Download PPTX{{
                          contentData?.files?.price > 0
                            ? " | $" + contentData?.files?.price
                            : ""
                        }}
                      </v-btn>
                    </div>
                  </v-col>
                </v-row>
              </v-card>
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
            <div v-if="contentData?.files?.ext == 'pptx'">
              <v-btn
                @click="startDownload('pptx')"
                block
                color="#bf360c"
                dark
                class="mb-2"
              >
                Download PPTX{{
                  contentData?.files?.price > 0
                    ? " | $" + contentData?.files?.price
                    : ""
                }}
              </v-btn>
            </div>
          </v-col>

          <v-col cols="12">
            <div v-if="!checkIsFree" class="mb-4">
              <p v-if="!isLoggedIn">
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
                Your wallet charge is ${{ user?.credit }}
                <nuxt-link
                  class="blue--text"
                  v-if="isLoggedIn"
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
        </v-col>

        <v-col cols="12" md="6">
          <!--  Start:  Azmoon test album card   -->
        </v-col>
      </v-row>
    </v-container>

    <!-- Start : Sample Test -->
    <!-- End : Sample test -->
    <!-- Start: Feed -->
    <section class="feed"></section>
    <!-- End: Feed -->

    <crash-report ref="crash_report" />
  </div>
</template>

<script setup>
import { useFetch, useAsyncData } from "#app";
import dayjs from "dayjs";
import FileSaver from "file-saver";

import Breadcrumb from "@/components/widgets/breadcrumb";
import Category from "@/components/common/category";
import MultimediaPreviewGallery from "@/components/details/multimedia-preview-gallery.vue";
import CrashReport from "~/components/common/crash-report.vue";

// Declare props, emits, and refs
definePageMeta({
  auth: false,
});

const preview_gallery = ref(null);
const crash_report = ref(null);
const route = useRoute();
const router = useRouter();
const { $auth, $toast } = useNuxtApp();

// Reactive state
const description_tab = ref(null);
const rating = ref(4.5);
const contentData = ref({});
const editMode = reactive({
  title: false,
  describe: false,
  title_loading: false,
  describe_loading: false,
});
const breads = ref([
  {
    text: "Multimedia",
    disabled: false,
    href: "/search?type=learnfiles",
  },
]);
const copy_btn = ref("Copy");
const download_loading = ref(false);

// Computed properties
const checkIsFree = computed(() => {
  return contentData.value?.files?.price
    ? contentData.value.files.price <= 0
    : true;
});

// Authentication computed properties
const isLoggedIn = computed(() => {
  return $auth?.loggedIn ?? false;
});

const user = computed(() => {
  return $auth?.user ?? null;
});

// Set page head
useHead(() => ({
  title: contentData.value?.title || "Multimedia Details",
}));

// Fetch content data
async function fetchContentData() {
  try {
    const { id } = route.params;
    const { data: content } = await useFetch(`/api/v1/files/${id}`);

    if (content.value?.status === 1 && content.value?.data) {
      // Create a proper slug from the title
      const correctSlug =
        content.value.data.title_url ||
        content.value.data.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/-$/, "");

      // Verify the URL slug matches the content
      if (route.params.slug !== correctSlug) {
        // If slugs don't match, log warning but continue
        console.warn("Slug mismatch, but continuing with correct data");
      }

      contentData.value = content.value.data;
      return content.value.data;
    } else {
      throw new Error("Content not found");
    }
  } catch (err) {
    console.error("API error:", err);
    throw err;
  }
}

// Call asyncData on component creation
useAsyncData("multimedia-details", async () => {
  try {
    await fetchContentData();
  } catch (err) {
    showError({
      statusCode: err.response?.status || 500,
      message:
        err.response?.data?.message ||
        "Something went wrong loading the content",
    });
  }
});

// Initialize page elements
onMounted(() => {
  if (contentData.value) {
    // Set gallery images and carousel position
    preview_gallery.value.images =
      contentData.value?.previewData?.preview || [];
    preview_gallery.value.carouselVal = 0;

    // Update help link data
    preview_gallery.value.help_link_data = {
      state: contentData.value?.state || "",
      section: contentData.value?.section || "",
      base: contentData.value?.base || "",
      course: contentData.value?.course || "",
      lesson: contentData.value?.lesson || "",
    };
    initBreadCrumb();
  }
});

// Methods
function initBreadCrumb() {
  if (!contentData.value) return;
  console.log("contentData", contentData.value);

  breads.value.push(
    {
      text: contentData.value?.section_title,
      disabled: false,
      href: `/search?type=learnfiles&section=${contentData.value?.section}`,
    },
    {
      text: contentData.value?.base_title,
      disabled: false,
      href: `/search?type=test&section=${contentData.value?.section}&base=${contentData.value?.base}`,
    },
    {
      text: contentData.value?.lesson_title,
      disabled: false,
      href: `/search?type=test&section=${contentData.value?.section}&base=${contentData.value?.base}&lesson=${contentData.value?.lesson}`,
    }
  );
}

function openAuthDialog(val) {
  router.push({ query: { auth_form: val } });
}

function copyUrl() {
  navigator.clipboard.writeText(window.location.href);
  copy_btn.value = "Copied";
}

function shareSocial(social_name) {
  if (social_name == "whatsapp")
    window.open(`https://api.whatsapp.com/send?text=${window.location.href}`);
  else if (social_name == "telegram")
    window.open(
      `https://telegram.me/share/url?url=${window.location.href}&text=${contentData.value?.title}`
    );
}

async function startDownload(type) {
  download_loading.value = true;
  const apiUrl = `/api/v1/files/download/${route.params.id}`;

  try {
    const { data } = await useFetch(apiUrl);
    if (data.value) {
      FileSaver.saveAs(data.value.url, data.value.name);
    }
  } catch (err) {
    if (err.response?.status == 400) {
      if (
        err.response.data.status == 0 &&
        err.response.data.error == "creditNotEnough"
      ) {
        $toast.info("No enough credit");
      }
    } else if (err.response?.status == 403) {
      router.push({ query: { auth_form: "login" } });
    }
  } finally {
    download_loading.value = false;
  }
}

function openCrashReportDialog() {
  crash_report.value.dialog = true;
  crash_report.value.form.type = "file";
}

// Form data helpers
function urlencodeFormData(fd) {
  let s = "";
  for (var pair of fd.entries()) {
    if (typeof pair[1] == "string") {
      s += (s ? "&" : "") + encode(pair[0]) + "=" + encode(pair[1]);
    }
  }
  return s;
}

function encode(s) {
  return encodeURIComponent(s).replace(/%20/g, "+");
}

async function updateDetails() {
  //Arrange to form data
  editMode.title_loading = true;
  let formData = new FormData();
  formData.append("title", contentData.value?.title);
  formData.append("description", contentData.value?.description);

  try {
    const { data } = await useFetch(`/api/v1/files/${route.params.id}`, {
      method: "PUT",
      body: urlencodeFormData(formData),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (data.value?.id == 0 && data.value?.repeated) {
      $toast.info("The multimedia is duplicated");
    } else {
      $toast.success("Updated successfully");
    }
  } catch (err) {
    if (err.response?.status == 403) {
      router.push({ query: { auth_form: "login" } });
    } else if (err.response?.status == 400) {
      $toast.error(err.response.data.message);
    }
  } finally {
    editMode.title = false;
    editMode.describe = false;
    editMode.title_loading = false;
  }
}
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
