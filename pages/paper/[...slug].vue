<template>
  <div class="test-details-content">
    <paper-detail-skeleton-loader v-if="dataFetching" />

    <!-- Show actual content when loaded -->
    <template v-else>
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
                  :title="contentData?.title"
                  :description="contentData?.description"
                >
                  <template #labels>
                    <v-chip
                      link
                      class="mr-1 bg-blue-grey-darken-1 white--text"
                      :small="display.mdAndDown"
                    >
                      <nuxt-link
                        :to="`/search?type=test&section=${contentData?.section}`"
                      >
                        {{ contentData?.section_title }}
                      </nuxt-link>
                    </v-chip>
                    <v-chip
                      link
                      class="mr-1 bg-blue-grey-darken-1 white--text"
                      :small="display.mdAndDown"
                    >
                      <nuxt-link
                        :to="`/search?type=test&section=${contentData?.section}&base=${contentData?.base}`"
                      >
                        {{ contentData?.base_title }}
                      </nuxt-link>
                    </v-chip>
                    <v-chip
                      class="ma-1 bg-blue-grey-darken-1 white--text"
                      :small="display.mdAndDown"
                    >
                      <nuxt-link
                        :to="`/search?type=test&section=${contentData?.section}&base=${contentData?.base}&lesson=${contentData?.lesson}`"
                      >
                        {{ contentData?.lesson_title }}
                      </nuxt-link>
                    </v-chip>
                    <v-chip
                      class="ma-1 bg-blue-grey-darken-1 white--text"
                      :small="display.mdAndDown"
                    >
                      {{ contentData?.edu_month_title }}
                    </v-chip>
                    <v-chip
                      :small="display.mdAndDown"
                      :to="`/search?type=test&section=${contentData?.section}&base=${contentData?.base}&lesson=${contentData?.lesson}&edu_year=${contentData?.edu_year}`"
                      class="ma-1 bg-blue-grey-darken-1 white--text"
                    >
                      {{ contentData?.edu_year }}
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
                  @crash-report="openCrashReportDialog"
                >
                  <template #share-dialog>
                    <common-detail-share-dialog :title="contentData?.title" />
                  </template>
                </paper-detail-content-info>
              </v-col>
            </v-row>
          </div>
          <common-related-portrait-content
        pageType="paper"
        pageName="Past Papers"
        source="test"
        request="test"
      />
        </v-container>
      </section>

      <!--  End: detail  -->
    </template>
  </div>
</template>
<script setup>
const route = useRoute();
const router = useRouter();
const paperId = computed(() => {
  if (!route.params.slug || !route.params.slug.length) return null;
  return route.params.slug[0];
});

// Track loading state

const {
  data: contentData,
  error,
  pending: dataFetching,
} = await useAsyncData(
  `paper-${paperId.value}`,
  async () => {
    try {
      const response = await $fetch(
        `/api/v1/tests/${route.params.slug[0]}`,
        {}
      );

      return response.data;
    } catch (e) {
      if (e?.status === 404) {
        router.push("/search?type=test");
      }
      throw e;
    } finally {
    }
  },
  {
    server: true,
    lazy: false,
    immediate: true,
    watch: [() => paperId.value],
  }
);

const schemaData = computed(() => ({
  "@context": "https://schema.org",
  "@type": "LearningResource",
  name: contentData.value?.title || "GamaEdtech",
  image:
    contentData.value?.thumb_pic ||
    contentData.value?.lesson_pic ||
    "https://gamatrain.com/images/gamatrain-logo.svg",
  url: route.fullPath || "",
  description: contentData.value?.description || "GamaEdtech",
}));

useHead({
  title: contentData.value?.title,
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

  galleryHelpData.value = {
    state: contentData.value?.state || "",
    section: contentData.value?.section || "",
    base: contentData.value?.base || "",
    course: contentData.value?.course || "",
    lesson: contentData.value?.lesson || "",
  };
}

const breads = ref([
  {
    text: "Paper",
    disabled: false,
    href: "/search?type=test",
  },
]);

const display = useGlobalDisplay();

const initBreadCrumb = () => {
  if (!contentData.value) return;

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

watchEffect(() => {
  if (contentData.value) {
    initBreadCrumb();
  }
});

const openCrashReportDialog = () => {
  crash_report.value.dialog = true;
  crash_report.value.form.type = "test";
};
</script>

<style></style>
