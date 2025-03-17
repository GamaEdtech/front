<template>
  <div class="data-holder" ref="container">
    <div ref="topSentinel" style="height: 10px"></div>
    <slot />
    <div style="height: 100px" ref="bottomSentinel"></div>
  </div>
</template>

<script>
export default {
  mounted() {
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
      this.topObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          this.$emit("updatePage", "top");
        }
      }, observerOptions);
      this.topObserver.observe(this.$refs.topSentinel);

      // Bottom Observer (Emit `arriveBottom`)
      this.bottomObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          this.$emit("updatePage", "bottom");
        }
      }, observerOptions);
      this.bottomObserver.observe(this.$refs.bottomSentinel);
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
