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
              <paper-detail-description
                :title="contentData.title"
                :description="contentData.description"
                :edit-mode="editMode"
                :isOwner="$auth.user?.id == contentData.user_"
                :isMobile="display.xs"
                @update-details="updateDetails"
              >
                <template #labels>
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
                </template>
              </paper-detail-description>
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
              <paper-detail-content-info
                :contentData="contentData"
                @download="startDownload"
                @crash-report="openCrashReportDialog"
              >
                <template #share-dialog>
                  <common-detail-share-dialog :title="contentData.title" />
                </template>
              </paper-detail-content-info>
            </v-col>
          </v-row>
        </div>
      </v-container>
    </section>

    <!--Mobile order section-->
    <paper-detail-mobile-order
      :contentData="contentData"
      :is-logged-in="$auth.loggedIn"
      :user-credit="$auth.user && $auth.user.credit"
      :is-free="isFree"
      @download="startDownload"
      @open-auth="openAuthDialog"
    />
    <!--End mobile order section-->

    <!--  End: detail  -->
  </div>
</template>
<script setup>
import { ref, computed, watchEffect } from "vue";

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
const isFree = computed(() => {
  if (
    contentData.value.files.answer.price > 0 &&
    contentData.value.files.pdf.price > 0 &&
    contentData.value.files.word.price > 0
  )
    return false;
  else return true;
});
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
    .$put(`/api/v1/tests/${route.params.id}`, urlencodeFormData(formData), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
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
      editMode.value.title = false;
      editMode.value.describe = false;
      editMode.value.title_loading = false;
    });
};
</script>

<style>
/* Styles removed as they're now in component files */
</style>
