<template>
  <v-app>
    <main_header />
    <div>
      <Nuxt />
    </div>
    <main_footer />
  </v-app>
</template>

<script>
import main_header from "../components/common/header.vue";
import category from "../components/common/category";
import main_footer from "../components/common/footer";

export default {
  name: "default_layout",
  components: {
    main_header,
    category,
    main_footer,
  },
  data() {
    return {};
  },
  mounted() {
    this.setFavicon();
  },
  beforeDestroy() {},
  methods: {
    /**
     * Set favicon based on user's theme preference
     */
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
