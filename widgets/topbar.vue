<template>
  <div
    class="topbar"
    elevation="4"
  >
    <div class="d-flex align-center">
      <div>
        <span class="mdi mdi-account-multiple-plus icon" />
      </div>
      <div />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        { title: 'Dashboard', icon: 'mdi-view-dashboard' },
        { title: 'Photos', icon: 'mdi-image' },
        { title: 'About', icon: 'mdi-help-box' },
      ],
      right: null,
    }
  },
}
</script>
