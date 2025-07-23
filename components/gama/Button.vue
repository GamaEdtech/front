<template>
  <v-btn
    v-bind="$attrs"
    rounded
    color="primary"
    class="gama-btn"
    @click="handleClick"
  >
    <slot />
  </v-btn>
</template>

<script>
export default {
  name: 'GamaButton',
  methods: {
    handleClick(event) {
      if (this.$listeners.click) {
        this.$listeners.click(event) // Call the parent click handler if passed
      }
    },
  },
}
</script>

<style scoped>
.gama-btn {
  margin-top: 1.5rem;
  color: #24292f;
}
</style>
