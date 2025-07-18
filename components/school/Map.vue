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
import { useRouter } from "vue-router";

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

const emit = defineEmits(["mapMoved", "userLocationFound"]);

const router = useRouter();

const map = ref(null);
const zoom = ref(props.initialZoom);
const minZoom = ref(2);
const center = ref(props.initialCenter);
const schoolIcon = ref(null);
const isMapReady = ref(false);
const isModuleImport = ref(false);

onMounted(() => {
  getUserLocation();

  const L = window.L;
  schoolIcon.value = L.icon({
    iconUrl: "/images/school-marker.png",
    iconSize: [40, 40],
    iconAnchor: [12, 25],
    popupAnchor: [1, -25],
  });

  isModuleImport.value = true;
  if (isMapReady.value) {
    map.value.leafletObject.setView(center.value);
    setMarkers();
  }
});

const onMapReady = () => {
  isMapReady.value = true;
  if (isModuleImport.value) {
    map.value.leafletObject.setView(center.value);
    setMarkers();
  }
};

watch(
  () => props.items,
  () => {
    if (isMapReady.value) {
      setMarkers();
    }
  }
);

const markerClusterGroupRef = ref([]);
const setMarkers = async () => {
  // if (markerClusterGroupRef.value) {
  //   markerClusterGroupRef.value.remove();
  // }

  const mapItems = props.items
    .filter((item) => item.lat && item.long)
    .map((item) => ({
      lat: item.lat,
      lng: item.long,
      name: item.name,
      id: item.id,
      options: {
        icon: schoolIcon.value,
        alt: item.id,
      },
    }));

  const { markerCluster, markers } = await useLMarkerCluster({
    leafletObject: map.value.leafletObject,
    markers: mapItems,
  });
  markerClusterGroupRef.value.push(markerCluster);
  markers.forEach((marker) => {
    marker.on("click", (event) => {
      if (event.target.options.alt) {
        window.open(`/school/${event.target.options.alt}`, "_blank");
      }
    });
  });
};

const onMoveEnd = (event) => {
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
        center.value = [position.coords.latitude, position.coords.longitude];
        emit("userLocationFound", center.value);
      },
      (error) => {
        console.error("Error getting user location:", error);
      }
    );
  } else {
    console.error("Geolocation is not supported in this browser.");
  }
};
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
  min-height: 400px;
}
</style>
