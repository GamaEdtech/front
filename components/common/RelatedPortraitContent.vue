<template>
  <div class="mx-4">
    <div class="d-flex mb-3" style="gap: 8px">
      <h1 class="gtext-t4 font-weight-semibold" style="color: #344054">
        Related {{ pageName }}
      </h1>
    </div>
    <v-slide-group
      show-arrows
      class="related-content"
      :style="{ height: `${CardHeight}` }"
    >
    <template #prev>
      <v-btn icon variant="tonal" size="sm" color="primary" class="prevBtn">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
    </template>

    <template #next>
      <v-btn icon variant="tonal" size="sm" color="primary" class="nextBtn">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </template>

      <v-slide-group-item v-for="item in data" :key="item.id">
        <nuxt-link :to="`/${pageType}/${item.id}/${item.title_url}`">
          <common-related-portrait-content-card
            :cardPicture="item.thumb_pic || fallbackImage"
            :cardTitle="item.title"
            :score="item.referee_score || item.type_title"
            :showScoreLabel="!!item.referee_score"
          />
        </nuxt-link>
      </v-slide-group-item>
    </v-slide-group>
  </div>
</template>
<script setup>

const props = defineProps({
  pageType: String,
  pageName: String,
  source: String,
  request: String,
})

const route = useRoute()

const data = ref(null)
const relatedId = route.params.slug[0]
const fallbackImage = '/images/GamaBag.webp'

const getRelatedContent = async () => {
  try {
    const response = await $fetch('/api/v1/recommendations/related',
     {
      method : 'GET',
      params: {
        source: props.source,
        request: props.request,
        id: relatedId
      },
    })
    const arrays = response.data
    for (const key in arrays) {
      if (Array.isArray(arrays[key]) && arrays[key].length > 0) {
        data.value = arrays[key]
        break
      }
    }

    if (!data.value) {
      data.value = []
    }
  } catch (error) {
    console.error('Search error:', error)
  }
}

onMounted(() => {
  getRelatedContent()
})

const CardHeight = computed(() => {
  if (props.pageType === 'paper') {
    return '243px'
  } else if (props.pageType === 'multimedia') {
    return '120px'
  }
  return 'auto'
})
</script>
<style>
.related-content {
  display: flex !important;
  flex-direction: column !important;
  align-items: center;
}
.prevBtn{
  display: flex !important;
}
</style>