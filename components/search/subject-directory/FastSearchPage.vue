<template>
  <v-container>
    <!-- Loading Overlay -->
    <!-- <loading-overlay :is-loading="isLoading" /> -->

    <!-- Header Section with Breadcrumb and Title -->
    <page-header
      :breads="breads"
      :book-image="bookImage"
      :view-count="viewCount"
      @search-results="onSearchResult"
      @result-papers="onSearchPaper"
      @board-change="onChangeBoard"
      @grade-change="onGradeChange"
      @subject-change="onSubjectChange"
      @changeLoadingTable="onChangeLoadingTable"
      @changeLoadingTopSection="onChangeLoadingTopSection"
      ref="pageHeader"
      @changeLoadingInfinitScroll="onChangeLoadingInfiniteScroll"
      @changeBookImage="onChangeBookImage"
      @get-error="getError"
    >
      <!-- Desktop view -->
      <template slot="content">
        <div v-if="loadingTopSection" class="container-loader d-none d-md-flex">
          <v-skeleton-loader type="paragraph"></v-skeleton-loader>
          <v-skeleton-loader type="paragraph"></v-skeleton-loader>
          <v-skeleton-loader type="paragraph"></v-skeleton-loader>
          <v-skeleton-loader type="paragraph"></v-skeleton-loader>
        </div>
        <div class="d-none d-md-block" v-else>
          <!-- Resources List -->
          <resources-list :resources="resources" />

          <!-- Topical Tabs -->
          <topical-tabs :papers="papers" />
        </div>
      </template>
    </page-header>

    <!-- Mobile view -->
    <div class="d-block d-md-none mt-4">
      <div v-if="loadingTopSection" class="container-loader">
        <v-skeleton-loader type="paragraph"></v-skeleton-loader>
        <v-skeleton-loader type="paragraph"></v-skeleton-loader>
        <v-skeleton-loader type="paragraph"></v-skeleton-loader>
        <v-skeleton-loader type="paragraph"></v-skeleton-loader>
      </div>
      <template v-else>
        <!-- Resources List -->
        <resources-list :resources="resources" />

        <!-- Topical Tabs -->
        <topical-tabs :papers="papers" />
      </template>
    </div>

    <!-- Table & Timeline -->
    <v-row
      class="container-table-time-line d-flex flex-row justify-space-around justify-lg-space-between"
    >
      <v-col cols="10">
        <v-skeleton-loader
          v-if="loadingDataTable"
          type="table"
          class="elevation-0 custom-table"
        ></v-skeleton-loader>
        <custom-data-table
          v-else
          :headers="headers"
          :items="papersItemsTable"
          :timeline="timeline"
        />
      </v-col>
      <v-col cols="2" class="timeline-column d-flex flex-column align-center">
        <template v-if="loadingDataTable">
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

    <div class="line-infinite-loading" ref="loaderSection"></div>
    <v-row
      v-if="loadingInfinitScroll"
      class="d-flex flex-row align-start justify-space-around justify-lg-space-between"
    >
      <v-col cols="10">
        <v-skeleton-loader type="table-row"></v-skeleton-loader>
        <v-skeleton-loader type="table-row"></v-skeleton-loader>
        <v-skeleton-loader type="table-row"></v-skeleton-loader>
        <v-skeleton-loader type="table-row"></v-skeleton-loader>
        <v-skeleton-loader type="table-row"></v-skeleton-loader>
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
    papersItemsTable: {
      type: Array,
      required: true,
    },
    timeline: {
      type: Array,
      required: true,
    },
    loadingDataTable: {
      type: Boolean,
      required: true,
    },
    loadingTopSection: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      loadingInfinitScroll: false,
      isReachToEndListPaper: false,
    };
  },
  async mounted() {
    this.setupScrollListener();
  },
  methods: {
    onSearchResult(data) {
      this.$emit("search-results", data);
    },
    onSearchPaper(data, isContinuePreviousSubject) {
      if (data.data && data.data.list && data.data.list.length == 0) {
        this.isReachToEndListPaper = true;
      }
      this.$emit("result-papers", data, isContinuePreviousSubject);
    },
    getError() {
      this.isReachToEndListPaper = true;
    },
    onChangeBoard(board) {
      this.isReachToEndListPaper = false;
      this.$emit("board-change", board);
    },
    onGradeChange(grade) {
      this.isReachToEndListPaper = false;
      this.$emit("grade-change", grade);
    },
    onSubjectChange(subject) {
      this.isReachToEndListPaper = false;
      this.$emit("subject-change", subject);
    },
    onChangeLoadingTable(loadingStatus) {
      this.$emit("loading-table-change", loadingStatus);
    },
    onChangeLoadingTopSection(loadingStatus) {
      this.$emit("loading-top-section-change", loadingStatus);
    },
    onChangeLoadingInfiniteScroll(loadingStatus) {
      this.loadingInfinitScroll = loadingStatus;
    },
    onChangeBookImage(image) {
      this.$emit("change-book-image", image);
    },
    setupScrollListener() {
      const targetDiv = this.$refs.loaderSection;

      window.addEventListener("scroll", () => {
        const rect = targetDiv.getBoundingClientRect();
        const isDivInView = rect.top >= 0 && rect.bottom <= window.innerHeight;

        if (
          isDivInView &&
          !this.loadingDataTable &&
          !this.loadingInfinitScroll &&
          !this.isReachToEndListPaper
        ) {
          {
            this.$refs.pageHeader.fetchPapersWithPaginate();
          }
        }
      });
    },
  },
};
</script>

<style scoped>
.container-loader {
  display: flex;
  flex-direction: column;
  row-gap: 20px;
}

.line-infinite-loading {
  width: 100%;
  height: 6px;
}

.container-table-time-line {
  align-content: stretch;
}
</style>
