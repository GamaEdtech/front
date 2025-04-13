<template>
  <div>
    <!-- Breadcrumb -->
    <v-col cols="12" class="px-0">
      <div class="mt-8 px-0 header-path">
        <div style="overflow-x: auto !important">
          <div style="min-width: max-content">
            <div class="mt-0 py-0 header-path">
              <breadcrumb :breads="breads" class="transparent" />
            </div>
          </div>
        </div>
      </div>
    </v-col>

    <!-- Title -->
    <v-row class="justify-space-between flex-nowrap">
      <v-col cols="8" sm="5" md="8">
        <div class="d-md-inline-flex flex-row align-center flex-wrap">
          <div v-for="(item, i) in breads" :key="i">
            <div
              class="d-block d-lg-inline-flex flex-row align-center mb-4"
              v-if="i != 0"
            >
              <span class="w-100 gama-text-h3 font-weight-semibold">
                {{ item.text }}
              </span>
              <v-icon size="18" color="black" class="mx-2">mdi-menu-down</v-icon>
            </div>
            <div>
            </div>
          </div>
          <div class="d-inline-flex d-md-none align-center gap-2">
            <v-icon color="#98A2B3">mdi-eye</v-icon>
            <span style="margin-inline: 8px; color:#98A2B3">View</span>
            <span class="gama-text-h6 font-weight-bold">
              {{ viewCount }}
            </span>
          </div>
        </div>
        
        <slot name="content"></slot>
      </v-col>
      <v-col cols="4" style="height: fit-content">
        <v-img
          :src="bookImage"
          max-height="300px"
          eager
          contain
          class=""
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import breadcrumb from "~/components/widgets/breadcrumb.vue";

export default {
  name: 'PageHeader',
  components: {
    breadcrumb
  },
  props: {
    breads: {
      type: Array,
      required: true
    },
    bookImage: {
      type: String,
      default: require('@/assets/images/BiologyBook.png')
    },
    viewCount: {
      type: [String, Number],
      default: '28k'
    }
  }
}
</script>

<style scoped>
/* Using global styles from styles.scss */
</style> 