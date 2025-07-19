<template>
  <div class="d-flex mb-4">
    <div class="w-100">
      <div class="d-flex align-center justify-space-between header">
        <h1 class="detail-title gama-text-h5">
          {{ contentData.title }}
        </h1>
      </div>

      <div class="description-holder my-4">
        <!--Topics-->
        <p
          class="gama-text-body2"
          v-if="contentData.topics && contentData.topics.length > 0"
        >
          <i class="fa-solid fa-list ml-1 icon"></i>
          Topics:
        </p>
        <ul v-if="contentData.topics && contentData.topics.length > 0">
          <li v-for="(item, index) in contentData.topics" :key="index">
            {{ item.title }}
          </li>
        </ul>
        <!--End topics-->

        <!--Question number-->
        <p class="mt-1 gama-text-body2" v-if="contentData.tests_num">
          <i class="fa-solid fa-question ml-1 icon"></i>
          Questions: {{ contentData.tests_num }}
        </p>
        <!--End question number-->

        <!--Difficulty level-->
        <p class="mt-1 gama-text-body2" v-if="contentData.level">
          <i class="fa-solid fa-temperature-three-quarters ml-1 icon"></i>
          Difficulty level: {{ contentData.level }}
        </p>
        <!--End difficulty level-->

        <!--Start date-->
        <p class="mt-1 gama-text-body2">
          <i class="fa-solid fa-circle-play"></i>
          Start:
          {{ contentData.start_date ? contentData.start_date : "-" }}
        </p>
        <!--End start date-->

        <!--End date-->
        <p class="mt-1 gama-text-body2">
          <i class="fa-solid fa-circle-stop"></i>
          End:
          {{ contentData.end_date ? contentData.end_date : "-" }}
        </p>
        <!--End end date-->

        <!--Duration-->
        <p class="mt-1 gama-text-body2" v-if="contentData.azmoon_time">
          <i class="fa-solid fa-clock"></i>
          Duration: {{ contentData.azmoon_time }} minutes
        </p>
        <!--End duration-->
      </div>

      <div class="label-holder">
        <v-chip
          link
          v-show="contentData.section_title"
          class="mr-1"
          :to="`/search?type=azmoon&section=${contentData.section}`"
        >
          {{ contentData.section_title }}
        </v-chip>
        <v-chip
          link
          v-show="contentData.base_title"
          :to="`/search?type=azmoon&section=${contentData.section}&base=${contentData.base}`"
          class="mr-1"
        >
          {{ contentData.base_title }}
        </v-chip>
        <v-chip
          link
          v-show="contentData.lesson_title"
          :to="`/search?type=azmoon&section=${contentData.section}&base=${contentData.base}&lesson=${contentData.lesson}`"
          class="ma-1"
        >
          {{ contentData.lesson_title }}
        </v-chip>
        <v-chip
          :small="display.mdAndDown.value"
          link
          v-show="contentData.paperID"
          :to="`/paper/${contentData.paperID}`"
          class="ma-1 primary"
        >
          Past Paper
        </v-chip>
      </div>
    </div>
  </div>

  <!-- Download Btn and Description -->
  <div v-if="!isFree" class="text-center download-sec">
    <div class="d-none d-md-block mb-4">
      <p v-if="!isLoggedIn" class="gama-text-body2">
        <span class="mdi mdi-bell icon"></span>
        <span @click="onLogin" class="login pointer">Login</span>
        <span @click="onRegister" class="register pointer"> (register) </span>
        to download and charge your wallet.
      </p>
      <span v-else class="gama-text-body2">
        Your wallet charge is ${{ credit }}
      </span>
      <nuxt-link class="blue--text" v-if="isLoggedIn" to="/user/charge-wallet"
        >(Top Up Wallet)
      </nuxt-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useDisplay } from "vuetify";
const props = defineProps({
  contentData: {
    type: Object,
    required: true,
  },
  isLoggedIn: {
    type: Boolean,
    default: false,
  },
  credit: {
    type: [Number, String],
    default: 0,
  },
});

// Create a shortcut computed property for better readability
const contentData = computed(() => props.contentData);
const display = useDisplay();
const emit = defineEmits(["login", "register"]);

// Computed properties
const isFree = computed(() => {
  const participationPrice = contentData.value.participation?.price || 0;
  const pdfPrice = contentData.value.files?.pdf?.price || 0;

  return !(participationPrice > 0 && pdfPrice > 0);
});

// Methods
function onLogin() {
  emit("login");
}

function onRegister() {
  emit("register");
}
</script>
