import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  // Global page headers: https://go.nuxtjs.dev/config-head

  runtimeConfig: {
    // The private keys which are only available server-side
    apiSecret: "123",
    // Keys within public are also exposed client-side
    public: {
      apiBase: "https://gamatrain.com",
      googleClientId:
        "231452968451-rd7maq3v4c8ce6d1e36uk3qacep20lp8.apps.googleusercontent.com",
    },
  },
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
          hid: "description",
          name: "description",
          content:
            "Discover GamaTrain, an innovative K12 learning platform transforming education with AI-powered instruction, a vibrant community, and personalized learning experiences.",
        },
        { name: "format-detection", content: "telephone=no" },
        {
          hid: "apple-mobile-web-app-title",
          name: "apple-mobile-web-app-title",
          content:
            "GamaTrain: Smart K12 Learning with AI, Community, and Personalized Education",
        },
        {
          hid: "og:title",
          name: "og:title",
          content:
            "GamaTrain: Smart K12 Learning with AI, Community, and Personalized Education",
        },
        {
          hid: "og:site_name",
          name: "og:site_name",
          content: "GamaTrain",
        },
      ],
      link: [
        {
          rel: "icon",
          type: "image/x-icon",
          href: "/favicon-dark.ico",
        },
        { rel: "stylesheet", href: "/assets/css/all.min.css" },
      ],
      script: [
        {
          src: "https://accounts.google.com/gsi/client",
          defer: true,
          async: true,
        },
        // {src: './assets/js/jquery.js', body: true},
      ],
    },
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    "vuetify/lib/styles/main.css",
    "@/assets/scss/app.scss",
    "@mdi/font/css/materialdesignicons.min.css",
    "@/assets/css/gama6/styles.css",
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: "plugins/helper.js" },
    { src: "plugins/vue-emoji-picker", ssr: false },
    { src: "plugins/img-cropper", ssr: false },
    { src: "plugins/vuedraggable", ssr: false },

  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    // "@nuxt/typescript-build",
    "nuxt-leaflet",
    // https://go.nuxtjs.dev/vuetify
    "@nuxtjs/vuetify",
    "@nuxtjs/dotenv",
    "@nuxtjs/moment",
    "@nuxtjs/pwa",
    "@nuxtjs/toast",

    // '@nuxtjs/onesignal',
  ],

  // oneSignal: {
  //   init: {
  //     appId: '782b76df-8189-482c-9047-1070af2d4a74',
  //     allowLocalhostAsSecureOrigin: true,
  //     welcomeNotification: {
  //       disable: true
  //     }
  //   }
  // },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    "dayjs-nuxt",
    "nuxt-gtag",
    "@nuxt/image",
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
  ],
  image: {
    domains: ['core.gamatrain.com']
  },
  gtag: {
    id: "G-VLSLZJR0WK",
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

  // router: {
  //   middleware: ["auth", "redirect"],
  // },

  // auth: {
  //   strategies: {
  //     // google: {
  //     //   clientId: process.env.GOOGLE_CLIENT_Id,
  //     //   redirectUri: process.env.GOOGLE_REDIRECT_URI,
  //     //   codeChallengeMethod: '',
  //     //   responseType: 'code',
  //     //   grantType: 'google',
  //     //   endpoints: {
  //     //     token: '/api/google_login',
  //     //     userInfo: '/api/user'
  //     //   },
  //     //   user: {
  //     //     property: 'user',
  //     //     autoFetch: false
  //     //   }
  //     // },
  //     local: {
  //       token: {
  //         property: "jwtToken",
  //         global: true,
  //       },
  //       user: {
  //         property: "data",
  //         autoFetch: true,
  //       },
  //       endpoints: {
  //         login: { url: "/api/v1/users/login", method: "post" },
  //         // refresh: {url: '/api/v1/users/refresh_token', method: 'post'},
  //         user: { url: "/api/v1/users/info", method: "get" },
  //         logout: { url: "/api/v1/users/logout", method: "get" },
  //       },
  //     },
  //   },
  //   redirect: {
  //     login: "/?access=denied",
  //     logout: "/",
  //     callback: false,
  //     home: "/",
  //   },
  // },

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

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [
      "vuetify",
      // "vee-validate",
      "vue-chartjs",
      "defu",
      "@ckeditor/ckeditor5-vue",
    ],
  },

  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },

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

  nitro: {
    // prerender: { routes: ["/search"] },
  },

  server: {
    host: "0.0.0.0",
    port: 3002,
  },

  devServer: {
    port: 3002,
  },

  serverMiddleware: ["~/server/middleware/sitemap.js"],
  compatibilityDate: "2025-01-25",
});
