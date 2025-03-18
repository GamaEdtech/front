<template>
  <div class="data-holder" ref="container">
    <gama-button
      class="mx-auto"
      @click="loadPreviousPage()"
      v-show="this.scrollPage.top > 1"
      small
      outlined
      :loading="loading"
      >Load Previous Data</gama-button
    >
    <!-- <div ref="topSentinel"></div> -->
    <slot />
    <div style="height: 100px" ref="bottomSentinel"></div>
  </div>
</template>

<script>
import GamaButton from "@/components/gama/Button";
export default {
  data() {
    return {
      currentPage: this.$route.query.page ? Number(this.$route.query.page) : 1, // Start from page 1
      loadedPages: [],
      loading: false, // Flag to track if component is fully loaded
      scrollPage: {
        top: null,
        bottom: null,
      },
    };
  },
  components: {
    GamaButton,
  },
  mounted() {
    this.loadedPages.push(this.currentPage);
    this.scrollPage.top = this.currentPage;
    this.scrollPage.bottom = this.currentPage;
    this.initObservers();
  },
  beforeDestroy() {
    if (this.topObserver) this.topObserver.disconnect();
    if (this.bottomObserver) this.bottomObserver.disconnect();
  },
  methods: {
    initObservers() {
      const observerOptions = { root: null, threshold: 0.1 };

      // Top Observer (Emit `arriveTop`)
      // this.topObserver = new IntersectionObserver((entries) => {
      //   if (entries[0].isIntersecting) {
      //     this.loadPreviousPage();
      //   }
      // }, observerOptions);
      // this.topObserver.observe(this.$refs.topSentinel);

      // Bottom Observer (Emit `arriveBottom`)
      this.bottomObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          this.loadNextPage();
        }
      }, observerOptions);
      this.bottomObserver.observe(this.$refs.bottomSentinel);
    },
    loadNextPage() {
      this.scrollPage.bottom++;
      if (!this.loadedPages.includes(this.scrollPage.bottom)) {
        this.loadedPages.push(this.scrollPage.bottom);
        this.$emit("updatePage", "bottom", this.scrollPage.bottom);
      }
    },

    loadPreviousPage() {
      this.loading = true;
      if (this.scrollPage.top > 1) {
        this.scrollPage.top--;
        if (!this.loadedPages.includes(this.scrollPage.top)) {
          this.loadedPages.push(this.scrollPage.top);
          this.$emit("updatePage", "top", this.scrollPage.top);
        }
      }
      setTimeout(() => {
        this.loading = false;
      }, 2000);
    },
  },
};
</script>

<style scoped>
.data-holder {
  display: flex;
  flex-direction: column;
  flex: 1; /* Dynamic height */
  overflow-y: auto; /* Allow scrolling */
}
</style>
