<template>
  <v-dialog
    v-model="dialogVisible"
    transition="dialog-bottom-transition"
    fullscreen
    style="z-index: 20001"
  >
    <v-card>
      <v-card-text class="pt-6 pt-md-8 px-6 px-md-8">
        <div class="d-flex">
          <div class="gtext-h5 priamry-gray-700">Location</div>
          <v-spacer></v-spacer>
          <v-btn icon variant="text" @click="dialogVisible = false">
            <v-icon size="20">mdi-close</v-icon>
          </v-btn>
        </div>
      </v-card-text>
      <div id="locationPickerMapContainer">
        <client-only>
          <l-map
            ref="editSchoolMap"
            :zoom="map.zoom"
            :center="map.center"
            id="mapSection"
            @move="updateMarkerPosition"
          >
            <l-tile-layer :url="map.url"></l-tile-layer>
            <l-marker ref="editMapMarker" :lat-lng="map.center">
              <LIcon
                icon-url="/images/school-marker.png"
                :icon-size="[64, 64]"
                :icon-anchor="[16, 32]"
              ></LIcon>
            </l-marker>
          </l-map>
        </client-only>
        <locationSearch
          id="searchSection"
          @locationSelected="goToSearchLocation"
          rounded
          label="Search anything"
        />
      </div>
      <a
        :href="`https://www.google.com/maps?q=${contentData.latitude},${contentData.longitude}`"
        target="_blank"
        class="ml-1 blue--text"
      >
        See on Google Map
      </a>
      <v-card-actions class="justify-center pb-13">
        <v-btn
          :loading="mapSubmitLoader"
          @click="emitUpdate()"
          class="primary black--text text-transform-none gtext-t4 font-weight-medium"
          rounded
          width="100%"
          max-width="400"
          size="x-large"
          color="primary"
          variant="flat"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import locationSearch from "@/components/form/LocationSearch.vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  contentData: {
    type: Object,
    required: true,
  },
  map: {
    type: Object,
    required: true,
  },
  mapSubmitLoader: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["update:modelValue", "update", "locationSelected"]);

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const editSchoolMap = ref(null);
const editMapMarker = ref(null);

function updateMarkerPosition() {
  const mapInstance = editSchoolMap.value?.leafletObject;
  const markerInstance = editMapMarker.value?.leafletObject;
  if (!mapInstance || !markerInstance) return;
  const newCenter = mapInstance.getCenter();
  markerInstance.setLatLng(newCenter);
}

function goToSearchLocation(val) {
  const mapInstance = editSchoolMap.value?.leafletObject;
  if (!mapInstance) return;
  mapInstance.setView([val[0], val[1]], 12);
  setTimeout(() => {
    window.dispatchEvent(new Event("resize"));
  }, 100);
}

function emitUpdate() {
  emit("update");
}
</script>

<style scoped>
#locationPickerMapContainer {
  position: relative;
  overflow-x: hidden;

  #mapSection {
    width: 100%;
    height: 80vh !important;
  }

  #searchSection {
    position: absolute;
    top: 1.6rem;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 200002;
    background: #fff;
    max-width: 30rem;
  }
}
</style>
