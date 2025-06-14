<template>
  <div class="test-details-content">
    <!-- Start : Category -->
    <common-category />
    <!-- End:Category -->
    <!--  Start: breadcrumb  -->
    <section>
      <v-container class="py-0">
        <div class="mt-0 py-0 header-path">
          <!-- Skeleton loader for breadcrumb -->
          <v-skeleton-loader
            v-if="dataFetching"
            class="mx-auto"
            height="60"
          ></v-skeleton-loader>
          <!-- Actual breadcrumb when loaded -->
          <widgets-breadcrumb v-else :breads="breads" />
        </div>
      </v-container>
    </section>
    <!--  End: breadcrumb  -->

    <!--  Start: detail  -->
    <section>
      <v-container class="py-0">
        <!-- Skeleton loading state -->
        <div v-if="dataFetching" class="detail mt-md-8">
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
              <details-preview-gallery
                :image-urls="galleryImages"
                :help-link-data="galleryHelpData"
                :initial-slide="1"
              />
              <!--Show gallery of preview and book first page-->
            </v-col>
            <v-col cols="12" md="6">
              <!--  Description   -->
              <exam-detail-description-section
                :content-data="contentData"
                :is-logged-in="auth.isAuthenticated.value"
                :credit="user?.user.value.credit || 0"
                @login="openAuthDialog('login')"
                @register="openAuthDialog('register')"
              />
            </v-col>
            <v-col md="3">
              <exam-detail-sidebar-details
                :content-data="contentData"
                :is-logged-in="auth.isAuthenticated.value"
                :credit="user?.user.value.credit || 0"
                :download-loading="download_loading"
                @download="startDownload"
                @login="openAuthDialog('login')"
                @copy-url="copyUrl"
                @crash-report="openCrashReportDialog"
              />
            </v-col>
          </v-row>
        </div>
      </v-container>
    </section>

    <!--Mobile order section-->
    <exam-detail-mobile-order-section
      v-if="!dataFetching"
      :exam-id="contentData.id"
      :exam-prices="contentData.price"
      :is-logged-in="auth.isAuthenticated.value"
      :credit="user?.user.value.credit || 0"
      :user-exam-status="contentData.examUserData?.status || 0"
      :download-loading="download_loading"
      @download="startDownload"
      @login="openAuthDialog('login')"
      @register="openAuthDialog('register')"
    />
    <!--End mobile order section-->

    <!--  End: detail  -->

    <common-crash-report ref="crash_report" />
  </div>
</template>

<script setup>
// Get api, router, and route
const route = useRoute();
const router = useRouter();
const auth = useAuth();
const user = useUser();

// Component data
const contentData = ref({});
const crash_report = ref(null);
const copy_btn = ref("Copy");
const download_loading = ref(false);

// Reactive data for breadcrumbs
const breads = reactive([
  {
    text: "Online exam",
    disabled: false,
    href: "/search?type=azmoon",
  },
]);

// Gallery data
const galleryImages = ref([]);
const galleryHelpData = ref({
  state: "",
  section: "",
  base: "",
  course: "",
  lesson: "",
});

// Fetch the exam data
async function fetchExamData() {
  try {
    const { id } = route.params;
    const response = await useApiService.get(`/api/v1/exams/${id}`);

    if (response.status === 1 && response.data) {
      return response.data;
    }

    return response;
  } catch (err) {
    throw err;
  }
}

// Use asyncData to fetch data
const {
  data: asyncContentData,
  error,
  pending: dataFetching,
} = useAsyncData(
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

// Method to initialize breadcrumbs
function initBreadCrumb() {
  if (!contentData.value) return;

  // Clear existing breadcrumbs except the first one
  while (breads.length > 1) {
    breads.pop();
  }

  if (contentData.value.section_title) {
    breads.push({
      text: contentData.value.section_title,
      disabled: false,
      href: `/search?type=azmoon&section=${contentData.value.section}`,
    });
  }

  if (contentData.value.base_title) {
    breads.push({
      text: contentData.value.base_title,
      disabled: false,
      href: `/search?type=azmoon&section=${contentData.value.section}&base=${contentData.value.base}`,
    });
  }

  if (contentData.value.lesson_title) {
    breads.push({
      text: contentData.value.lesson_title,
      disabled: false,
      href: `/search?type=azmoon&section=${contentData.value.section}&base=${contentData.value.base}&lesson=${contentData.value.lesson}`,
    });
  }
}

// Function to update gallery data
function updateGalleryData() {
  if (contentData.value?.thumb_pic_url) {
    galleryImages.value = [contentData.value.thumb_pic_url];
  }

  galleryHelpData.value = {
    state: contentData.value?.state || "",
    section: contentData.value?.section || "",
    base: contentData.value?.base || "",
    course: contentData.value?.course || "",
    lesson: contentData.value?.lesson || "",
  };
}

// Watch for data changes and update contentData
watch(
  asyncContentData,
  (newData) => {
    if (newData) {
      contentData.value = newData;
      updateGalleryData();
      initBreadCrumb();
    }
  },
  { immediate: true }
);

// Methods
const openAuthDialog = (val) => {
  router.push({ query: { auth_form: val } });
};

const copyUrl = () => {
  navigator.clipboard.writeText(window.location.href);
  copy_btn.value = "Copied";
};

const startDownload = async () => {
  download_loading.value = true;
  try {
    const response = await useApiService.get(
      `/api/v1/exams/download/${route.params.id}`
    );
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

// Lifecycle hooks
onMounted(() => {
  // If data is already available, update the state
  if (asyncContentData.value && !contentData.value?.id) {
    contentData.value = asyncContentData.value;
    updateGalleryData();
    initBreadCrumb();
  }
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
p {
  font-size: 1.3rem !important;
}
</style>
