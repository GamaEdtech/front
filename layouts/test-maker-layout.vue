<template>
  <v-app>
    <main_header />
    <div class="mt-16 mt-md-0">
      <test-maker-menu/>
       <NuxtPage />
    </div>
  </v-app>
</template>

<script>
import category from '../components/common/category'
import main_footer from '../components/common/footer'
import main_header from '../components/common/header.vue';
import TestMakerMenu from "@/components/test-maker/test-maker-menu";

export default {
  name:'default_layout',
  components: {
    TestMakerMenu,
    main_header,
    category,
    main_footer,
  },
  data () {
    return {

    }
  },

}
</script>
