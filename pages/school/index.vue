<template>
  <div class="main-school-list-div">
    <!-- <button @click="openBottomNavFilterList = !openBottomNavFilterList">
      test
    </button> -->
    <div
      :class="`filter-list-div ${
        openBottomNavFilterList ? `open-bottom-nav` : ``
      }`"
    >
      <div class="grab-line-div">
        <div class="grab"></div>
      </div>
      <schoolFilter :sort-list="sortList" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import schoolFilter from "~/components/school/filter/Filter.vue";

const sortList = [
  {
    value: "scoreDesc",
    title: "Highest score",
  },
  {
    value: "viewsDesc",
    title: "Most active",
  },
  {
    value: "updateDesc",
    title: "Update date",
  },
  {
    value: "tuitionAsc",
    title: "Tuition Fee (Highest First)",
  },
  {
    value: "tuitionDesc",
    title: "Tuition Fee (Lowest First)",
  },
];

const openBottomNavFilterList = ref(true);
</script>

<style scoped>
@import "./index.scss";
</style>
