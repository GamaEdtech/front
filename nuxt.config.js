import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  // Add compatibility date to fix the warning
  compatibilityDate: "2024-04-03",

  // Global page headers
  app: {
    head: {
      titleTemplate: "%s | Gamatrain",
      title:
        "GamaTrain: Smart K12 Learning with AI, Community, and Personalized Education",
      htmlAttrs: {
        lang: "en",
      },
      meta: [
        { charset: "utf-8" },
        { "http-equiv": "Content-Type" },
        {
          name: "viewport",
          content:
            "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0",
        },
        {
          name: "description",
          content:
            "Discover GamaTrain, an innovative K12 learning platform transforming education with AI-powered instruction, a vibrant community, and personalized learning experiences.",
        },
        { name: "format-detection", content: "telephone=no" },
        {
          name: "apple-mobile-web-app-title",
          content:
            "GamaTrain: Smart K12 Learning with AI, Community, and Personalized Education",
        },
        {
          property: "og:title",
          content:
            "GamaTrain: Smart K12 Learning with AI, Community, and Personalized Education",
        },
        { property: "og:site_name", content: "GamaTrain" },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon-dark.ico" },
        { rel: "stylesheet", href: "/assets/css/all.min.css" },
      ],
      script: [
        {
          src: "https://accounts.google.com/gsi/client",
          defer: true,
          async: true,
        },
      ],
    },
  },

  // Runtime config
  runtimeConfig: {
    apiSecret: process.env.API_SECRET || "123",
    public: {
      apiBase: process.env.API_BASE || "https://gamatrain.com",
      googleClientId:
        process.env.GOOGLE_CLIENT_ID ||
        "231452968451-rd7maq3v4c8ce6d1e36uk3qacep20lp8.apps.googleusercontent.com",
    },
  },

  // toast config
  toast: {
    position: "top-center",
    duration: 3000,
    register: [
      // Register custom toasts
      {
        name: "my-error",
        message: "Oops...Something went wrong",
        options: {
          type: "error",
        },
      },
    ],
  },

  // pwa config
  pwa: {
    manifest: {
      name: "Gamatrain App",
      short_name: "Gamatrain",
      description:
        "Discover GamaTrain, an innovative K12 learning platform transforming education with AI-powered instruction, a vibrant community, and personalized learning experiences.",
      lang: "en",
      useWebmanifestExtension: false,
    },
  },

  // Global CSS
  css: [
    "vuetify/lib/styles/main.css",
    "@/assets/scss/app.scss",
    "@mdi/font/css/materialdesignicons.min.css",
    "@/assets/css/gama6/styles.css",
  ],

  // Plugins
  plugins: [
    { src: "plugins/helper.js" },
    { src: "plugins/vue-emoji-picker.js", mode: "client" },
    { src: "plugins/img-cropper", mode: "client" },
    { src: "plugins/vuedraggable", mode: "client" },
  ],

  // Auto import components
  components: true,

  // Modules
  modules: [
    "dayjs-nuxt",
    "@nuxtjs/leaflet",
    "nuxt-gtag",
    "@nuxt/image",
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
  ],

  // Development modules
  devtools: { enabled: true },

  // Module configuration
  image: {
    domains: ["core.gamatrain.com"],
  },

  gtag: {
    id: "G-VLSLZJR0WK",
  },

  // Build configuration
  build: {
    transpile: ["vuetify", "vue-chartjs", "defu", "@ckeditor/ckeditor5-vue"],
  },

  // Vite configuration
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["vue", "vue-router"],
            vuetify: ["vuetify"],
            charts: ["vue-chartjs", "chart.js"],
            ckeditor: [
              "@ckeditor/ckeditor5-vue",
              "@ckeditor/ckeditor5-build-classic",
            ],
          },
        },
      },
    },
    define: {
      global: "globalThis",
    },
  },

  routeRules: {
    "/test-maker/**": { ssr: false, prerender: true },
    "/api/v1/**": {
      proxy: "https://core.gamatrain.com/api/v1/**",
    },
    "/api/v2/**": {
      proxy: "https://api.gamaedtech.com/api/v1/**",
    },
    "/uploads/**": {
      proxy: "https://core.gamatrain.com/uploads/**",
    },
  },

  // Development server configuration
  devServer: {
    host: "0.0.0.0",
    port: 3000,
  },

  // Server middleware
  serverMiddleware: ["~/server/middleware/sitemap.js"],

  // SSR configuration
  ssr: true,
});
