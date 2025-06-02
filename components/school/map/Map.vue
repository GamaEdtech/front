<template>
  <ClientOnly>
    <LMap
      ref="map"
      class="map-container"
      :zoom="zoom"
      :min-zoom="minZoom"
      :center="center"
      :use-global-leaflet="true"
      @moveend="onMoveEnd"
      @ready="onMapReady"
    >
      <LTileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        layer-type="base"
        name="OpenStreetMap"
      />
      <!-- <LMarker
        v-for="(marker, index) in items"
        :lat-lng="[marker.lat, marker.long]"
        :icon="schoolIcon"
        :key="index"
      >
      </LMarker> -->
    </LMap>
  </ClientOnly>
</template>

<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  initialCenter: {
    type: Array,
    default: () => [39.90973623453719, -81.12304687500001],
  },
  initialZoom: {
    type: Number,
    default: 6,
  },
});

const emit = defineEmits([
  "mapMoved",
  "zoomChanged",
  "markerClicked",
  "userLocationFound",
]);

const map = ref(null);
const zoom = ref(props.initialZoom);
const minZoom = ref(2);
const center = ref(props.initialCenter);
const schoolIcon = ref(null);
const isMapReady = ref(false);
const isModuleImport = ref(false);

onMounted(async () => {
  getUserLocation();

  const L = await import("leaflet");
  await import("leaflet.markercluster");

  isModuleImport.value = true;
  console.log("module load");
  if (isMapReady.value) {
    setMarkers();
  }

  schoolIcon.value = L.icon({
    iconUrl: "/images/school-marker.png",
    iconSize: [40, 40],
    iconAnchor: [12, 25],
    popupAnchor: [1, -25],
  });
});

const onMapReady = () => {
  console.log("map ready");
  isMapReady.value = true;
  if (isModuleImport.value) {
    console.log("map ready if");
    map.value.setView(center.value);
    setMarkers();
  }
};

watch(
  () => props.items,
  () => {
    console.log("item recienve");
    if (isMapReady.value) {
      console.log("item recienve if");
      setMarkers();
    }
  }
);

const markerClusterGroupRef = ref(null);
const setMarkers = async () => {
  if (markerClusterGroupRef.value) {
    console.log("omad remove");
    markerClusterGroupRef.value.remove();
  }

  const mapItems = props.items
    .filter((item) => item.lat && item.long)
    .map((item) => ({
      lat: item.lat,
      lng: item.long,
      name: item.name,
      id: item.id,
      options: {
        icon: schoolIcon.value,
      },
    }));

  const { markerCluster, markers } = await useLMarkerCluster({
    leafletObject: map.value.leafletObject,
    markers: mapItems,
  });
  markerClusterGroupRef.value = markerCluster;
  markers.forEach((marker) => {
    marker.on("click", (e) => {
      console.log("e", e);
    });
  });
};

const onMoveEnd = (event) => {
  console.log("move on map");
  const bounds = event.target.getBounds();
  const newCenter = event.target.getCenter();
  const ne = bounds.getNorthEast();
  const distance = calculateDistance(newCenter, ne);
  emit("mapMoved", {
    center: [newCenter.lat, newCenter.lng],
    distance: distance,
  });
};

const calculateDistance = (point1, point2) => {
  const R = 6371000;
  const lat1 = point1.lat * (Math.PI / 180);
  const lon1 = point1.lng * (Math.PI / 180);
  const lat2 = point2.lat * (Math.PI / 180);
  const lon2 = point2.lng * (Math.PI / 180);

  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return formatNumber(R * c);
};

const formatNumber = (number) => {
  //Remove latest zero from number to avoid error from api side
  const roundedNumber = parseFloat(number.toFixed(6));
  const formattedString = roundedNumber.toString();
  const trimmedString = formattedString.replace(/\.?0+$/, "");
  return parseFloat(trimmedString);
};

const getUserLocation = () => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("geo location", position);
        center.value = [position.coords.latitude, position.coords.longitude];
      },
      (error) => {
        console.error("Error getting user location:", error);
      }
    );
  } else {
    console.error("Geolocation is not supported in this browser.");
  }
};

const focusOnSchool = (school) => {
  console.log("focus on school");
  // if (school.lat && school.long) {
  //   center.value = [school.lat, school.long];
  //   zoom.value = 14;
  // }
};

const setView = (latLng, zoomLevel) => {
  console.log("set view");
  // center.value = latLng;
  // zoom.value = zoomLevel;
};
</script>

<style scoped></style>
