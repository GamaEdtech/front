import colors from "vuetify/es5/util/colors";

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head

  head: {
    titleTemplate: "%s | Gamatrain",
    title: "Free Past Papers, Quiz, Powerpoint and Study Guid",
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
        content: "Free Past Papers, Quiz, Powerpoint and Study Guid",
      },
      {
        hid: "og:title",
        name: "og:title",
        content:
          "Free Past Papers, Quiz, Powerpoint and Study Guid | GamaTrain",
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

  generate: {
    routes: ["/"],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    "@/assets/scss/app.scss",
    "@mdi/font/css/materialdesignicons.min.css",
    "@/assets/css/gama6/styles.css",
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: "plugins/vee-validate.js", ssr: true },
    // { src: "plugins/axios.js" },
    { src: "plugins/helper.js" },
    { src: "plugins/vue-emoji-picker", ssr: false },
    { src: "plugins/img-cropper", ssr: false },
    { src: "plugins/vuedraggable", ssr: false },
    { src: "plugins/gtag.js", mode: "client" },
    { src: "plugins/mathjax.js", mode: "client" },
    { src: "plugins/hotjar.client.js", mode: "client" },
    { src: "plugins/board-selection.js", mode: "client" },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    // "@nuxt/typescript-build",
    "nuxt-leaflet",
    // https://go.nuxtjs.dev/vuetify
    ["@nuxtjs/vuetify"],
    "@nuxtjs/dotenv",
    "@nuxtjs/moment",
    "@nuxtjs/pwa",

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
    "@nuxtjs/axios",
    "@nuxtjs/toast",
    "@nuxtjs/auth-next",
    "@nuxtjs/markdownit",
  ],

  axios: {
    proxy: true,
    baseUrl: process.env.API_BASE_URL,
    headers: {},
  },

  proxy: {
    "/api/v1/": {
      target: process.env.API_BASE_URL,
      pathRewrite: { "^/api/v1/": "/api/v1/" },
      secure: false,
      changeOrigin: true,
    },
    "/api/v2/": {
      target: process.env.API2_BASE_URL,
      pathRewrite: { "^/api/v2/": "/api/v1/" },
      secure: false,
      changeOrigin: true,
    },
    "/uploads/": {
      target: process.env.API_BASE_URL,
      pathRewrite: { "^/uploads": "/uploads" },
      secure: false,
      changeOrigin: true,
    },
  },

  router: {
    middleware: ["auth", "redirect"],
  },

  auth: {
    strategies: {
      // google: {
      //   clientId: process.env.GOOGLE_CLIENT_Id,
      //   redirectUri: process.env.GOOGLE_REDIRECT_URI,
      //   codeChallengeMethod: '',
      //   responseType: 'code',
      //   grantType: 'google',
      //   endpoints: {
      //     token: '/api/google_login',
      //     userInfo: '/api/user'
      //   },
      //   user: {
      //     property: 'user',
      //     autoFetch: false
      //   }
      // },
      local: {
        token: {
          property: "jwtToken",
          global: false,
        },
        user: {
          property: "data",
          autoFetch: true,
        },
        endpoints: {
          login: { url: "/api/v1/users/login", method: "post" },
          // refresh: {url: '/api/v1/users/refresh_token', method: 'post'},
          user: { url: "/api/v1/users/info", method: "get" },
          logout: { url: "/api/v1/users/logout", method: "get" },
        },
      },
    },
    redirect: {
      login: "/?access=denied",
      logout: "/",
      callback: false,
      home: "/",
    },
  },

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
  vuetify: {
    defaultAssets: false,
    customVariables: ["~/assets/variables.scss"],
    theme: {
      light: true,
      themes: {
        light: {
          background: "#FFFFFF",
          surface: "#FFFFFF",
          primary: "#FFB300",
          secondary: "#03DAC6",
          error: "#B00020",
          info: "#2196F3",
          success: "#4CAF50",
          warning: "#FB8C00",
        },
        dark: {
          background: colors.indigo.base,
          surface: "#FFFFFF",
          primary: "#FFB300",
          secondary: "#03DAC6",
          error: "#B00020",
          info: colors.teal.lighten1,
          success: "#4CAF50",
          warning: "#FB8C00",
        },
      },
    },
    icons: {
      iconfont: "mdi",
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ["vee-validate", "vue-chartjs", "ofetch", "defu", 'chart.js', "lil-gui"],
    extend(config, ctx) {
      config.module.rules.push(
        {
          test: /\.(glsl|vs|fs|vert|frag)$/,
          loader: 'raw-loader',
          exclude: /node_modules/
        })
    }
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

  server: {
    // host: "0.0.0.0",
    port: 3002,
  },

  serverMiddleware: [
    "~/serverMiddleware/data-to-xml.js",
    { path: "/api/chatgpt", handler: "~/serverMiddleware/chatgpt.js" },
  ],
};
