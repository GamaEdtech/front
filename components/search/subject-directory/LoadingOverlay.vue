<template>
  <v-overlay :value="isLoading" absolute class="loading-overlay">
    <div class="d-flex flex-column align-center">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      ></v-progress-circular>
      <span class="mt-4 white--text">Loading...</span>
    </div>
  </v-overlay>
</template>

<script>
export default {
  name: 'LoadingOverlay',
  props: {
    isLoading: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.loading-overlay {
  z-index: 10;
  border-radius: 8px;
}
</style> 