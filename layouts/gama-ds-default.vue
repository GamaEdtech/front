<template>
  <v-app id="gama-ds-default">
    <main_header />
    <div>
      <Nuxt />
    </div>
    <v-footer padless>
      <main_footer />
    </v-footer>
  </v-app>
</template>

<script>
import main_header from '../components/common/header.vue'
import category from '../components/common/category'
import main_footer from '../components/common/footer'

export default {
  name: 'DefaultLayout',
  components: {
    main_header,
    category,
    main_footer,
  },
  data() {
    return {

    }
  },

}
</script>

<style>
@media (min-width: 960px) {
  #gama-ds-default .container {
    max-width: 80% !important;

  }
}

#gama-ds-default .container--fluid {
  max-width: inherit !important;
}
</style>
