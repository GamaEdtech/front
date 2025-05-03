<template>
  <v-container>
    <!-- Loading Overlay -->
    <loading-overlay :is-loading="isLoading" />

    <!-- Header Section with Breadcrumb and Title -->
    <page-header
      :breads="breads"
      :book-image="bookImage"
      :view-count="viewCount"
    >
      <!-- Desktop view -->
      <template slot="content">
        <div class="d-none d-md-block">
          <!-- Resources List -->
          <resources-list :resources="resources" />

          <!-- Topical Tabs -->
          <topical-tabs :papers="papers" />
        </div>
      </template>
    </page-header>

    <!-- Mobile view -->
    <div class="d-block d-md-none mt-4">
      <!-- Resources List -->
      <resources-list :resources="resources" />

      <!-- Topical Tabs -->
      <topical-tabs :papers="papers" />
    </div>

    <!-- Table & Timeline -->
    <v-row
      class="d-flex flex-row align-start justify-space-around justify-lg-space-between"
    >
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
      <v-col
        cols="2"
        class="timeline-column d-none d-md-flex flex-column align-center"
      >
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
import CustomDataTable from "./CustomDataTable.vue";
import LoadingOverlay from "./LoadingOverlay.vue";
import PageHeader from "./PageHeader.vue";
import ResourcesList from "./ResourcesList.vue";
import TimelineColumn from "./TimelineColumn.vue";
import TopicalTabs from "./TopicalTabs.vue";

export default {
  name: "FastSearchPage",
  components: {
    LoadingOverlay,
    ResourcesList,
    TopicalTabs,
    CustomDataTable,
    TimelineColumn,
    PageHeader,
  },
  props: {
    // Pass down all props that can be customized
    isLoading: {
      type: Boolean,
      default: false,
    },
    bookImage: {
      type: String,
      default: require("@/assets/images/BiologyBook.png"),
    },
    breads: {
      type: Array,
      required: true,
    },
    viewCount: {
      type: [String, Number],
      default: "28k",
    },
    resources: {
      type: Array,
      required: true,
    },
    papers: {
      type: Object,
      required: true,
    },
    headers: {
      type: Array,
      required: true,
    },
    combinedPaperItems: {
      type: Array,
      required: true,
    },
    timeline: {
      type: Array,
      required: true,
    },
  },
};
</script>