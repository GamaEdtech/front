<template>
  <v-container>
    <!-- Loading Overlay -->
    <loading-overlay :is-loading="isLoading" />

    <!-- Header Section with Breadcrumb and Title -->
    <page-header :breads="breads" :book-image="bookImage" :view-count="viewCount">
      <template v-slot:content>
        <!-- Resources List -->
        <resources-list :resources="resources" />
        
        <!-- Topical Tabs -->
        <topical-tabs :papers="papers" />
      </template>
    </page-header>

    <!-- Table & Timeline -->
    <v-row class="d-flex flex-row align-start justify-space-between">
      <v-col cols="12" md="8">
        <v-skeleton-loader
          v-if="isLoading"
          type="table"
          class="elevation-0 custom-table"
        ></v-skeleton-loader>
        <custom-data-table 
          v-else
          :headers="headers"
          :items="combinedPaperItems"
        />
      </v-col>
      <v-col cols="2" class="timeline-column d-flex flex-column align-center">
        <template v-if="isLoading">
          <v-skeleton-loader
            type="list-item-three-line, list-item-three-line"
            class="mx-auto"
          ></v-skeleton-loader>
        </template>
        <template v-else>
          <!-- Timeline Column -->
          <timeline-column :timeline="timeline" />
        </template>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import LoadingOverlay from './LoadingOverlay.vue';
import ResourcesList from './ResourcesList.vue';
import TopicalTabs from './TopicalTabs.vue';
import CustomDataTable from './CustomDataTable.vue';
import TimelineColumn from './TimelineColumn.vue';
import PageHeader from './PageHeader.vue';

export default {
  name: 'FastSearchPage',
  components: {
    LoadingOverlay,
    ResourcesList,
    TopicalTabs,
    CustomDataTable,
    TimelineColumn,
    PageHeader
  },
  props: {
    // Pass down all props that can be customized
    isLoading: {
      type: Boolean,
      default: false
    },
    bookImage: {
      type: String,
      default: require('@/assets/images/BiologyBook.png')
    },
    breads: {
      type: Array,
      required: true
    },
    viewCount: {
      type: [String, Number],
      default: '28k'
    },
    resources: {
      type: Array,
      required: true
    },
    papers: {
      type: Object,
      required: true
    },
    headers: {
      type: Array,
      required: true
    },
    combinedPaperItems: {
      type: Array,
      required: true
    },
    timeline: {
      type: Array,
      required: true
    }
  }
}
</script>