<template>
  <div class="d-flex">
    <v-sheet class="chips-container">
      <v-chip
        v-show="localContentData.countryTitle"
        class="bg-blue-grey-darken-1 text-white mr-1"
        @click="emit('onChipsClick', { type: 'country', ...localContentData })"
      >
        {{ localContentData.countryTitle }}
      </v-chip>
      <v-chip
        v-show="localContentData.stateTitle"
        class="bg-blue-grey-darken-1 text-white mr-1"
          @click="emit('onChipsClick', { type: 'state', ...localContentData })"
      >
        {{ localContentData.stateTitle }}
      </v-chip>
      <v-chip
        v-show="localContentData.cityTitle"
        class="bg-blue-grey-darken-1 text-white mr-1"
         @click="emit('onChipsClick', { type: 'city', ...localContentData })"
      >
        {{ localContentData.cityTitle }}
      </v-chip>
      <v-chip
        v-if="localContentData.schoolType && localContentData.schoolType.name"
        class="bg-blue-grey-darken-1 text-white mr-1"
      >
        {{ localContentData?.schoolType?.name }}
      </v-chip>
      <v-chip
        :to="`/school?school_type=${localContentData.school_type}`"
        v-if="localContentData.school_type_title"
        class="bg-blue-grey-darken-1 text-white mr-1"
      >
        {{ localContentData.school_type_title }}
      </v-chip>
      <v-chip
        :to="`/school?section=${localContentData.section}`"
        v-if="localContentData.section_title"
        class="bg-blue-grey-darken-1 text-white mr-1"
      >
        {{ localContentData.section_title }}
      </v-chip>
      <v-chip
        :to="`/school?coed_status=${localContentData.sex}`"
        v-if="localContentData.sex_title"
        class="bg-blue-grey-darken-1 text-white mr-1"
      >
        {{ localContentData.sex_title }}
      </v-chip>
    </v-sheet>
    <v-spacer />
    <div class="gtext-t4 primary-blue-500 cursor-pointer">Contribute</div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  contentData: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['onChipsClick'])

const localContentData = ref(props.contentData);

watch(
  () => props.contentData,
  (newContent) => {
    localContentData.value = newContent;
  },
  { deep: true }
);
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
