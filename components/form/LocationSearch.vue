<template>
  <v-autocomplete
    v-if="render"
    class="locationField"
    v-model="selectedItem"
    :loading="loading"
    :items="items"
    hide-details
    item-text="display_name"
    item-value="location"
    :search-input.sync="search"
    :label="label"
    :placeholder="placeholder"
    @keydown="toggleSearch(true)"
    :solo="solo"
    :rounded="rounded"
    prepend-inner-icon="mdi-magnify"
    outlined
  >
    <template v-slot:no-data>
      <v-list-item>
        <v-list-item-title>
          Type something to start
          <strong> searching </strong>
        </v-list-item-title>
      </v-list-item>
    </template>
  </v-autocomplete>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from "vue";
import { useNuxtApp } from "#app";

const props = defineProps({
  label: String,
  solo: String,
  rounded: Boolean,
  placeholder: String,
});
const emit = defineEmits(["locationSelected"]);

const search = ref("");
const selectedItem = ref("");
const items = ref([]);
const loading = ref(false);
const timer = ref(null);
const waitTime = 750;
const searchToggle = ref(false);
const render = ref(true);

async function searchLocation(searchVal) {
  loading.value = true;
  try {
    const searchLocation = await $fetch(
      "https://nominatim.openstreetmap.org/search.php",
      {
        params: {
          q: searchVal,
          format: "json",
        },
        headers: {
          "Accept-Language": "en;q=0.3",
        },
      }
    );
    items.value = [];
    for (let i = 0; i < searchLocation.length; i++) {
      items.value[i] = {};
      items.value[i]["display_name"] =
        searchLocation[i].display_name.substr(0, 38) +
        (searchLocation[i].display_name.length > 38 ? "..." : "");
      items.value[i]["location"] = [
        searchLocation[i].lat,
        searchLocation[i].lon,
      ];
    }
  } finally {
    loading.value = false;
  }
}

function toggleSearch(val) {
  searchToggle.value = val;
}

function addAndSetItem(location) {
  items.value = [];
  let item = {};
  item["display_name"] =
    location.locationName.substr(0, 38) +
    (location.locationName.length > 38 ? "..." : "");
  item["location"] = [location.lat + "", location.lng + ""];
  items.value[items.value.length] = item;
  selectedItem.value = items.value[items.value.length - 1].location;
  render.value = false;
  nextTick(() => {
    render.value = true;
  });
}

onMounted(() => {
  timer.value = setTimeout(() => {}, waitTime);
});

watch(search, (val) => {
  if (val && searchToggle.value) {
    clearTimeout(timer.value);
    timer.value = setTimeout(() => {
      if (val !== selectedItem.value) searchLocation(val);
    }, waitTime);
  }
});

watch(selectedItem, (val) => {
  if (val && searchToggle.value) emit("locationSelected", val);
});
</script>

<style scoped></style>
