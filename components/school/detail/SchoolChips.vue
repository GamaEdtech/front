<template>
  <div class="d-flex">
    <v-sheet class="chips-container">
      <v-chip
        v-show="contentData.countryTitle"
        class="bg-blue-grey-darken-1 text-white mr-1"
      >
        {{ contentData.countryTitle }}
      </v-chip>
      <v-chip
        v-show="contentData.stateTitle"
        class="bg-blue-grey-darken-1 text-white mr-1"
      >
        {{ contentData.stateTitle }}
      </v-chip>
      <v-chip
        v-show="contentData.cityTitle"
        class="bg-blue-grey-darken-1 text-white mr-1"
      >
        {{ contentData.cityTitle }}
      </v-chip>
      <v-chip
        v-if="contentData.schoolType && contentData.schoolType.name"
        class="bg-blue-grey-darken-1 text-white mr-1"
      >
        {{ contentData?.schoolType?.name }}
      </v-chip>
      <v-chip
        :to="`/school?school_type=${contentData.school_type}`"
        v-if="contentData.school_type_title"
        class="bg-blue-grey-darken-1 text-white mr-1"
      >
        {{ contentData.school_type_title }}
      </v-chip>
      <v-chip
        :to="`/school?section=${contentData.section}`"
        v-if="contentData.section_title"
        class="bg-blue-grey-darken-1 text-white mr-1"
      >
        {{ contentData.section_title }}
      </v-chip>
      <v-chip
        :to="`/school?coed_status=${contentData.sex}`"
        v-if="contentData.sex_title"
        class="bg-blue-grey-darken-1 text-white mr-1"
      >
        {{ contentData.sex_title }}
      </v-chip>
    </v-sheet>
    <v-spacer />
    <div class="gtext-t4 primary-blue-500 cursor-pointer">Contribute</div>
  </div>
</template>

<script setup>
const props = defineProps({
  contentData: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.chips-container {
  white-space: nowrap;
  overflow-x: auto;
  width: 75%;
  padding-top: 0.4rem;
  scrollbar-width: thin;
  /* Firefox */
  scrollbar-color: transparent transparent;
  /* Firefox */
}

/* Webkit (Chrome, Safari) */
.chips-container::-webkit-scrollbar {
  width: 5px;
  /* Adjust width as needed */
}

.chips-container::-webkit-scrollbar-thumb {
  background-color: transparent;
}

.chips-container::-webkit-scrollbar-track {
  background-color: transparent;
}
</style>
