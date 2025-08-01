<template>
  <div class="test-details-content">
    <paper-detail-skeleton-loader v-if="dataFetching" />

    <template v-else>
      <common-category />

      <section>
        <v-container class="py-0">
          <div class="mt-0 py-0 header-path">
            <widgets-breadcrumb :breads="breads" />
          </div>
        </v-container>
      </section>

      <section>
        <v-container class="py-0">
          <div class="d-lg-none mt-4">
            <paper-detail-title :title="contentData?.title" />
          </div>
          <div class="detail mt-6 mt-md-8">
            <v-row>
              <v-col
                cols="12"
                md="12"
                lg="6"
                xl="6"
                class="px-8 px-lg=0 order-3 order-md-3 order-lg-2"
              >
                <paper-detail-description
                  :title="contentData?.title"
                  :description="contentData?.description"
                >
                  <template #labels>
                    <v-chip
                      link
                      class="mr-1 bg-blue-grey-darken-1 text-white"
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
                      class="mr-1 bg-blue-grey-darken-1 text-white"
                      :small="display.mdAndDown"
                    >
                      <nuxt-link
                        :to="`/search?type=test&section=${contentData?.section}&base=${contentData?.base}`"
                      >
                        {{ contentData?.base_title }}
                      </nuxt-link>
                    </v-chip>
                    <v-chip
                      class="ma-1 bg-blue-grey-darken-1 text-white"
                      :small="display.mdAndDown"
                    >
                      <nuxt-link
                        :to="`/search?type=test&section=${contentData?.section}&base=${contentData?.base}&lesson=${contentData?.lesson}`"
                      >
                        {{ contentData?.lesson_title }}
                      </nuxt-link>
                    </v-chip>
                    <v-chip
                      class="ma-1 bg-blue-grey-darken-1 text-white"
                      :small="display.mdAndDown"
                    >
                      {{ contentData?.edu_month_title }}
                    </v-chip>
                    <v-chip
                      :small="display.mdAndDown"
                      :to="`/search?type=test&section=${contentData?.section}&base=${contentData?.base}&lesson=${contentData?.lesson}&edu_year=${contentData?.edu_year}`"
                      class="ma-1 bg-blue-grey-darken-1 text-white"
                    >
                      {{ contentData?.edu_year }}
                    </v-chip>
                    <v-chip
                      :small="display.mdAndDown"
                      :to="`/subject-directory?board=${contentData?.section}&grade=${contentData?.base}&subject=${contentData?.lesson}`"
                      class="ma-1 bg-primary text-white"
                    >
                      {{ contentData?.lesson_title }} directory
                    </v-chip>
                  </template>
                </paper-detail-description>
              </v-col>
              <v-col
                cols="12"
                sm="5"
                md="3"
                lg="3"
                xl="3"
                order-lg="first"
                class="order-2 order-sm-1 order-md-1"
              >
                <details-preview-gallery
                  :image-urls="previewImages"
                  :help-link-data="galleryHelpData"
                  :initial-slide="1"
                />
              </v-col>
              <v-col
                class="order-1 order-md-2 order-lg-3"
                sm="7"
                md="9"
                lg="3"
                xl="3"
              >
                <paper-detail-content-info
                  :content-data="contentData"
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
            page-type="paper"
            page-name="Past Papers"
            source="test"
            request="test"
          />
        </v-container>
      </section>

      <div v-if="randomTestContent">
        <v-divider
          class="mt-4 mx-auto"
          style="width: 80%"
        />
        <test-details :content-data="randomTestContent" />
        <v-divider
          class="mt-1 mx-auto"
          style="width: 80%"
        />
      </div>
    </template>
    <v-row
      justify="center"
      class="mt-10"
    >
      <v-col
        cols="12"
        md="8"
        class="text-center"
      >
        <common-ad-banner
          v-model="isAdsLoad"
          adslot="7199289937"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()
const requestURL = ref(useRequestURL().host)
const randomTestContent = ref(null)
const pageDescribe = ref('')
const pageTitle = ref('')
const isAdsLoad = ref(false)

// Track loading state

const { data: contentData, pending: dataFetching } = await useAsyncData(
  `paper-${route.params.id}`,
  async () => {
    try {
      const response = await $fetch(`/api/v1/tests/${route.params.id}`, {})

      return response.data
    }
    catch (e) {
      if (e?.status === 404) {
        router.push('/search?type=test')
      }
      throw e
    }
    finally {
      // Reset loading states if needed
    }
  },
  {
    server: true,
    lazy: false,
    immediate: true,
    watch: [() => route.params.id],
  },
)

const schemaData = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'LearningResource',
  'name': contentData.value?.title || 'GamaEdtech',
  'image':
    contentData.value?.thumb_pic
    || contentData.value?.lesson_pic
    || 'https://gamatrain.com/images/gamatrain-logo.svg',
  'url': route.fullPath || '',
  'description': contentData.value?.description || 'GamaEdtech',
}))

const previewImages = ref([])
const galleryHelpData = ref({
  state: '',
  section: '',
  base: '',
  course: '',
  lesson: '',
})

const setMetaData = () => {
  if (!contentData.value) return

  const { section_title, base_title, title, is_paper } = contentData.value

  // Build common title parts
  const titleParts = [section_title, base_title, title].filter(Boolean)
  const baseTitle = titleParts.join(' ')

  if (is_paper) {
    pageTitle.value = `${baseTitle} past paper`
    pageDescribe.value = `Download ${baseTitle} past paper with mark scheme (MS). Access a full collection of past papers for study, revision, and exam practice.`
  }
  else {
    pageTitle.value = baseTitle
    pageDescribe.value = `Free download of ${title} – ${base_title}, ${section_title} curriculum. Ideal for quick revision, practice, and exam prep.`
  }

  useHead({
    title: pageTitle.value,
    meta: [
      {
        hid: 'apple-mobile-web-app-title',
        name: 'apple-mobile-web-app-title',
        content: pageTitle.value,
      },
      {
        hid: 'og:title',
        name: 'og:title',
        content: pageTitle.value,
      },
      {
        hid: 'og:site_name',
        name: 'og:site_name',
        content: 'GamaTrain',
      },
      {
        hid: 'description',
        name: 'description',
        content: pageDescribe.value,
      },
      {
        hid: 'og:description',
        name: 'og:description',
        content: pageDescribe.value,
      },
    ],
    script: [
      {
        hid: 'json-ld-schema',
        innerHTML: JSON.stringify(schemaData.value),
        type: 'application/ld+json',
      },
    ],
    link: [
      {
        rel: 'canonical',
        href: contentData.value
          ? `https://${requestURL.value}/paper/${contentData.value.id}/${contentData.value.title_url}`
          : `https://${requestURL.value}/paper/${route.params.id}`,
      },
    ],
    __dangerouslyDisableSanitizersByTagID: {
      'json-ld-schema': ['innerHTML'],
    },
  })
}

watchEffect(() => {
  if (contentData.value) {
    previewImages.value = []
    previewImages.value.push(contentData.value.thumb_pic)
    if (contentData.value.lesson_pic) {
      previewImages.value.push(contentData.value.lesson_pic)
    }

    previewImages.value.carouselVal = 0

    galleryHelpData.value = {
      state: contentData.value?.state || '',
      section: contentData.value?.section || '',
      base: contentData.value?.base || '',
      course: contentData.value?.course || '',
      lesson: contentData.value?.lesson || '',
    }
  }
})

const breads = ref([])

const display = useGlobalDisplay()

const initBreadCrumb = () => {
  if (!contentData.value) return
  breads.value = []
  breads.value.push({
    text: 'Paper',
    disabled: false,
    href: '/search?type=test',
  })
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
    },
  )
}

watchEffect(() => {
  if (contentData.value) {
    initBreadCrumb()
    setMetaData()
  }
})

const openCrashReportDialog = () => {
  crash_report.value.dialog = true
  crash_report.value.form.type = 'test'
}
const grabRandomTestCode = () => {
  if (contentData.value && contentData.value.lesson) {
    $fetch(`/api/v1/examTests/random?lesson=${contentData.value.lesson}`)
      .then((response) => {
        if (response.data.code) {
          retriveRandomTest(response.data.code)
        }
      })
      .catch((_err) => {})
  }
}
const retriveRandomTest = (code) => {
  $fetch(`/api/v1/examTests/${code}`)
    .then((response) => {
      randomTestContent.value = response.data
    })
    .catch((_err) => {})
}

onMounted(() => {
  grabRandomTestCode()
})
</script>

<style></style>
