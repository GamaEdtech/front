<template>
  <v-app>
    <common-header />
    <div>
      <slot />
    </div>
    <common-footer />
    <AppGlobalSnackbar />
  </v-app>
</template>

<script>
export default {
  name: "default_layout",
  mounted() {
    this.setFavicon();
  },
  methods: {
    setFavicon() {
      // Check if the user prefers dark mode
      const prefersDarkMode =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;

      // Set the favicon based on the color scheme preference
      const faviconElement = document.querySelector('link[rel="icon"]');
      if (faviconElement) {
        faviconElement.href = prefersDarkMode
          ? "/favicon-dark.ico"
          : "/favicon-light.ico";
      }
    },
  },
};
</script>
