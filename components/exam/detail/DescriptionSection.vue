<template>
  <div class="d-flex mb-4">
    <div class="w-100">
      <div class="d-flex align-center justify-space-between header">
        <h1 class="detail-title gama-text-h5">
          {{ title }}
        </h1>
      </div>

      <div class="description-holder my-4">
        <!--Topics-->
        <p class="gama-text-body2" v-if="topics && topics.length > 0">
          <i class="fa-solid fa-list ml-1 icon"></i>
          Topics:
        </p>
        <ul v-if="topics && topics.length > 0">
          <li v-for="(item, index) in topics" :key="index">
            {{ item.title }}
          </li>
        </ul>
        <!--End topics-->

        <!--Question number-->
        <p class="mt-1 gama-text-body2" v-if="testsNum">
          <i class="fa-solid fa-question ml-1 icon"></i>
          Questions: {{ testsNum }}
        </p>
        <!--End question number-->

        <!--Difficulty level-->
        <p class="mt-1 gama-text-body2" v-if="level">
          <i class="fa-solid fa-temperature-three-quarters ml-1 icon"></i>
          Difficulty level: {{ level }}
        </p>
        <!--End difficulty level-->

        <!--Start date-->
        <p class="mt-1 gama-text-body2">
          <i class="fa-solid fa-circle-play"></i>
          Start:
          {{ startDate ? startDate : "-" }}
        </p>
        <!--End start date-->

        <!--End date-->
        <p class="mt-1 gama-text-body2">
          <i class="fa-solid fa-circle-stop"></i>
          End:
          {{ endDate ? endDate : "-" }}
        </p>
        <!--End end date-->

        <!--Duration-->
        <p class="mt-1 gama-text-body2" v-if="examTime">
          <i class="fa-solid fa-clock"></i>
          Duration: {{ examTime }} minutes
        </p>
        <!--End duration-->
      </div>

      <div class="label-holder">
        <v-chip
          link
          v-show="sectionTitle"
          class="mr-1"
          :to="`/search?type=azmoon&section=${sectionId}`"
        >
          {{ sectionTitle }}
        </v-chip>
        <v-chip
          link
          v-show="baseTitle"
          :to="`/search?type=azmoon&section=${sectionId}&base=${baseId}`"
          class="mr-1"
        >
          {{ baseTitle }}
        </v-chip>
        <v-chip
          link
          v-show="lessonTitle"
          :to="`/search?type=azmoon&section=${sectionId}&base=${baseId}&lesson=${lessonId}`"
          class="ma-1"
        >
          {{ lessonTitle }}
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

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  topics: {
    type: Array,
    default: () => [],
  },
  testsNum: {
    type: [Number, String],
    default: 0,
  },
  level: {
    type: String,
    default: "",
  },
  startDate: {
    type: String,
    default: "",
  },
  endDate: {
    type: String,
    default: "",
  },
  examTime: {
    type: [Number, String],
    default: 0,
  },
  sectionTitle: {
    type: String,
    default: "",
  },
  sectionId: {
    type: [Number, String],
    default: "",
  },
  baseTitle: {
    type: String,
    default: "",
  },
  baseId: {
    type: [Number, String],
    default: "",
  },
  lessonTitle: {
    type: String,
    default: "",
  },
  lessonId: {
    type: [Number, String],
    default: "",
  },
  isLoggedIn: {
    type: Boolean,
    default: false,
  },
  credit: {
    type: Number,
    default: 0,
  },
  participation: {
    type: Object,
    default: () => ({}),
  },
  pdfPrice: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(["login", "register"]);

// Computed properties
const isFree = computed(() => {
  const participationPrice = props.participation?.price || 0;
  const pdfPrice = props.pdfPrice || 0;

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

<style scoped>
.detail-title {
  font-weight: bold;
}

.description-holder {
  line-height: 1.8;
}

.label-holder {
  margin-top: 12px;
}

.icon {
  color: #607d8b;
  margin-right: 8px;
}

.pointer {
  cursor: pointer;
}

.login,
.register {
  color: #2196f3;
}
</style>
