<template>
  <div
    class="w-100 card-search rounded-lg px-2 py-4 d-flex flex-wrap ga-3 align-center justify-start"
  >
    <div class="d-flex ga-3 align-stretch justify-start">
      <div class="img-div rounded-ts-lg rounded-bs-lg bg-red"></div>
      <div
        class="content-card d-flex flex-column ga-2 align-start justify-center justify-sm-space-between"
      >
        <span class="text-h5 text-sm-h4 text-black font-weight-medium"
          >ENGLISH 0861,01 October 2024 </span
        >
        <div class="d-flex align-center justify-start flex-wrap ga-3">
          <v-chip
            variant="flat"
            class="text-subtitle-1 text-sm-h5 pl-5 pr-5"
            color="#F2F4F7"
          >
            English(0861)
          </v-chip>
          <v-chip
            variant="flat"
            class="text-subtitle-1 text-sm-h5 pl-3 pr-3"
            color="#F2F4F7"
            >Lower Secondary Checkpoint</v-chip
          >
        </div>
        <div class="d-none d-sm-flex align-center justify-space-between w-100">
          <span
            class="primary-gray-400 text-subtitle-1 d-flex align-start ga-1"
          >
            <v-icon color="#667085">mdi-folder-outline</v-icon>
            Paper 1
          </span>
          <span
            class="primary-gray-400 text-subtitle-1 d-flex align-start ga-1"
          >
            <v-icon color="#667085">mdi-eye</v-icon>
            154
          </span>
          <span
            class="primary-gray-400 text-subtitle-1 d-flex align-start ga-1"
          >
            <v-icon color="#667085">mdi-calendar-range</v-icon>
            10/25/2024
          </span>

          <v-icon color="#F04438">mdi-file-pdf-box</v-icon>
        </div>
      </div>
    </div>
    <div class="d-flex d-sm-none align-center justify-space-between w-100">
      <span class="primary-gray-400 text-subtitle-1 d-flex align-start ga-1">
        <v-icon color="#667085">mdi-folder-outline</v-icon>
        Paper 1
      </span>
      <span class="primary-gray-400 text-subtitle-1 d-flex align-start ga-1">
        <v-icon color="#667085">mdi-eye</v-icon>
        154
      </span>
      <span class="primary-gray-400 text-subtitle-1 d-flex align-start ga-1">
        <v-icon color="#667085">mdi-calendar-range</v-icon>
        10/25/2024
      </span>

      <v-icon color="#F04438">mdi-file-pdf-box</v-icon>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.card-search {
  border: 1px solid #d7d7d8;
  min-height: 120px;
  max-width: 1200px;
}
.img-div {
  min-width: 100px;
  height: 120px;
}
</style>
