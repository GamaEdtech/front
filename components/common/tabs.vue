<template>
  <v-card class="d-block tab-header sticky-scroll" id="search-top-filter">
    <v-tabs v-model="active_tab">
      <v-tab @click="openLink('test')">
        <v-badge
          class="pa-1 mx-1 badge-sample"
          color="blue"
          :content="content_statistics.test"
        >
          <div class="nav-link sample-q-icon">
            <span class="icon icon-paper"></span>
            Past Papers
          </div>
        </v-badge>
      </v-tab>
      <v-tab @click="openLink('learnfiles')">
        <v-badge
          bordered
          class="pa-1 mx-1 badge-training"
          :content="content_statistics.learnfiles"
          color="#2E7D32"
        >
          <div class="nav-link training-content-icon">
            <span class="icon icon-multimedia"></span>
            Multimedia
          </div>
        </v-badge>
      </v-tab>
      <v-tab @click="openLink('question')">
        <v-badge
          bordered
          class="pa-1 mx-1 badge-q"
          :content="content_statistics.question"
          color="#BF360C"
        >
          <div class="nav-link q-a-icon">
            <span class="icon icon-q-a"></span>
            Forum
          </div>
        </v-badge>
      </v-tab>
      <v-tab @click="openLink('azmoon')">
        <v-badge
          bordered
          class="pa-1 mx-1 badge-online"
          :content="content_statistics.azmoon"
          color="#5600E8"
        >
          <div class="nav-link exam-icon">
            <span class="icon icon-exam"></span>
            QuizHub
          </div>
        </v-badge>
      </v-tab>
      <v-tab @click="openLink('dars')">
        <v-badge
          bordered
          class="pa-1 ml-1 mr-4 badge-tutorial"
          :content="content_statistics.tutorial"
          color="#BD081C"
        >
          <div class="nav-link tutorial-icon">
            <span class="icon icon-tutorial"></span>
            Tutorial
          </div>
        </v-badge>
      </v-tab>
      <!--      <v-tab @click="openLink('tutor')">-->
      <!--        <v-badge bordered class="pa-1 mx-1 badge-teachers"-->
      <!--                 :content="content_statistics.tutor" color="#8E24AA">-->
      <!--          <div class="nav-link teacher-icon">-->
      <!--            <span class="icon icong-teacher"></span>-->
      <!--            Tutor-->
      <!--          </div>-->
      <!--        </v-badge>-->
      <!--      </v-tab>-->
    </v-tabs>
  </v-card>
</template>

<script setup>
const route = useRoute();
const router = useRouter();

const active_tab = ref(0);
const content_statistics = ref({
  azmoon: "--",
  dars: "--",
  learnfiles: "--",
  question: "--",
  test: "--",
  tutor: "--",
  tutorial: "--",
});

// Set the active tab based on the route
onBeforeMount(() => {
  setActiveTabFromRoute(route.query.type);
});

// Watch for route changes
watch(() => route.query.type, (newVal) => {
  setActiveTabFromRoute(newVal);
});

// Helper function to set the active tab
const setActiveTabFromRoute = (routeType) => {
  if (routeType === "test") active_tab.value = 0;
  else if (routeType === "learnfiles") active_tab.value = 1;
  else if (routeType === "question") active_tab.value = 2;
  else if (routeType === "azmoon") active_tab.value = 3;
  else if (routeType === "dars") active_tab.value = 4;
  else if (routeType === "tutor") active_tab.value = 5;
};

// Function to open a link
const openLink = (val) => {
  const query = { type: val };
  if (route.query.section) {
    query.section = route.query.section;
  }
  if (route.query.base) {
    query.base = route.query.base;
  }
  if (route.query.lesson) {
    query.lesson = route.query.lesson;
  }
  if (route.query.topic) {
    query.topic = route.query.topic;
  }
  if (route.query.test_type !== 0 && query.type === "test") {
    query.test_type = route.query.test_type;
  }
  if (route.query.level !== 0 && query.type === "test") {
    query.level = route.query.level;
  }
  if (route.query.word === 1 && query.type === "test") {
    query.word = 1;
  }
  if (route.query.pdf === 1 && query.type === "test") {
    query.pdf = 1;
  }
  if (route.query.free === 1 && query.type === "test") {
    query.free = 1;
  }
  if (route.query.a_file === 1 && query.type === "test") {
    query.a_file = 1;
  }

  router.replace({ query: query });
};

// Expose content_statistics for parent components to set
defineExpose({
  content_statistics
});
</script>
<style lang="scss" scoped>
// .v-toolbar.v-toolbar--flat.v-toolbar--density-default.v-theme--light.v-locale--is-ltr.v-app-bar.d-block.d-lg-none .mobile_bar{
//   display: none;
// }
#search-top-filter {
  .icon-paper,
  .icon-multimedia,
  .icon-q-a,
  .icon-exam {
    font-size: 3rem !important;
  }
  position: sticky;
  top: 0;
  z-index: 5;
}

/*Remove default style for vuetify tabs and apply new style*/
.tab-header .v-tab {
  text-transform: none !important;
  font-size: 1.2rem;
}

.tab-header .v-tab .nav-link {
  padding: 0.8rem 0.8rem 0.8rem 0;
  display: flex;
  align-items: center;
}

.tab-header .v-tab:before {
  background-color: transparent !important;
}

.tab-header .v-badge__wrapper {
  right: 1.5rem !important;
  top: 0rem !important;
}

.tab-header .v-tab--active .nav-link {
  padding: 0.8rem 0.8rem 0.8rem 0.2rem;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 1.4rem;
  display: flex;
  align-items: center;
  color: #000000;
}

.tab-header .v-tab--active .badge-sample .nav-link {
  background: rgba(41, 98, 255, 0.05);
}

.tab-header .v-tab--active .badge-training .nav-link {
  background: rgba(1, 87, 155, 0.02);
}

.tab-header .v-tab--active .badge-q .nav-link {
  background: rgba(189, 8, 28, 0.05);
}

.tab-header .v-tab--active .badge-online .nav-link {
  background: rgba(86, 0, 232, 0.05);
}

.tab-header .v-tab--active .badge-tutorial .nav-link {
  background: rgba(189, 8, 28, 0.05);
}

.tab-header .v-tab--active .badge-teachers .nav-link {
  background: rgba(142, 36, 170, 0.05);
}

/*.tab-header .nav-link .icon {*/
/*  display: none !important;*/
/*}*/

.tab-header .v-tab--active .nav-link .icon {
  display: block !important;
  font-size: 2.5rem !important;
  padding-left: 1rem !important;
}

.tab-header .v-tabs-slider {
  display: none !important;
}

.tab-header .v-tab--active:hover::before {
  opacity: 0;
}

.tab-header .v-tab:hover::before {
  opacity: 0;
}

.tab-header .v-badge__badge {
  top: -0.2rem !important;
}

.sample-q-icon span {
  font-size: 2.5rem;
  padding-left: 1rem;
  padding-right: 0.4rem;
  color: #2962ff;
}

.training-content-icon span {
  font-size: 2.5rem;
  padding-left: 1rem;
  padding-right: 0.4rem;
  color: #2e7d32ff;
}

.q-a-icon span {
  font-size: 2.5rem;
  padding-left: 1rem;
  padding-right: 0.4rem;
  color: #bf360c;
}

.exam-icon span {
  font-size: 2.5rem;
  padding-left: 1rem;
  padding-right: 0.4rem;
  color: #5600e8;
}

.tutorial-icon span {
  font-size: 2.5rem;
  padding-left: 1rem;
  padding-right: 0.4rem;
  color: #bd081c;
}

.teacher-icon span {
  font-size: 2.5rem;
  padding-left: 1rem;
  padding-right: 0.4rem;
  color: #8e24aa;
}

/*End Remove default style for vuetify tabs and apply new style*/
</style>