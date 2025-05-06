<template>
  <v-container>
    <div class="d-flex flex-column flex-md-row justify-center align-center">
      <div
        class="pt-4  mb-6 mb-md-0 mr-0 mr-md-12"
        :style="$vuetify.breakpoint.smAndDown ? 'width: 347px' : 'width: 380px; height: 601px;'"
      >
      <v-form v-model="valid">
        <!--Name Input-->
        <v-text-field
            label="Name*"
            placeholder="ui.lib.drive@gmail.com"
            outlined
            class="rounded-pill mb-5"
            height="48"
            :rules="[rules.required]"
            v-model="form.name"
          ></v-text-field>

        <!--Email Input-->
        <v-text-field
            label="Email*"
            placeholder="ui.lib.drive@gmail.com"
            outlined
            class="rounded-pill mb-5"
            height="48"
            :rules="[rules.required, rules.email]"
            v-model="form.email"
        ></v-text-field>


        <!--Message textarea-->
        <v-textarea
          outlined
          name="input-7-4"
          label="Message*"
          hint="Enter at least 25 characters."
          placeholder="Enter here.............."
          no-resize
          class="rounded-xl mb-5"
          height="155"
          :rules="[rules.required, rules.min25]"
          v-model="form.message"
        ></v-textarea>

        <!--File Input & Preview(delete) File-->
        <div class="d-flex flex-column-reverse mb-10" style="gap: 12px;">
          <!--File Input-->
          <div class="d-flex" style="gap: 10px;">
            <!-- Hidden file input (no multiple) -->
            <input
              type="file"
              ref="fileInput"
              @change="handleFile"
              class="d-none"
            />

            <!-- Custom trigger -->
            <v-btn
              color="#2E90FA"
              outlined
              rounded
              @click="triggerFileSelect"
              class="d-flex align-center gtext-t5 font-weight-medium"
            >
              <v-icon class="gtext-t4 font-weight-medium">mdi-paperclip</v-icon>
              Attach File

            </v-btn>

            <!-- Hint -->
            <p class="gtext-t6 d-flex align-center" style="color: #98A2B3;">
              Max size: 2MB (jpeg, png, webp)
            </p>

          </div>
          
          <!-- File display with remove option -->
          <div>
            <div v-if="file" class="d-flex align-center justify-space-between">
              <span>{{ file.name }}</span>
              <v-btn icon small @click="removeFile">
                <v-icon color="error">mdi-minus-circle</v-icon>
              </v-btn>
            </div>
          </div>
        </div>

        <v-btn
          color="primary"
          type="submit"
          style="border-radius: 30px;color: black;"
          height="42"
          block
          :disabled="!valid"
          @click="submitForm"
        >
          Send
        </v-btn>
      </v-form>
    </div>
      

      <!-- Map -->
      <div class="d-flex flex-column">
        <client-only>
          <div class="rounded-t-xl" :style="mapStyles" id="map" ref="mapContainer"></div>
        </client-only>
        <div class="d-flex flex-row rounded-b-xl align-center py-2 pl-4" :style="infoBoxStyles" style="background-color: #F2F4F7;gap: 8px;">
          <v-icon class="gtext-t4" style="color: #98A2B3;">mdi-map-marker</v-icon>
          <p :class="[textSizeClass, 'font-weight-medium']" style="color: #344054;">2419 West 53rd Street, Apt 5B, New York, NY 10019</p>
        </div>
      </div>

    </div>
  </v-container>
</template>
  
<script>

export default {
  data() {
    return {
      form: {
        name: '',
        email: '',
        message: '',
        files: []
      },
      map: null,
      officeCoords: [40.764064, -73.988577],
      file: null,
      rules: {
        required: v => !!v || 'This field is required.',
        email: v => /.+@.+\..+/.test(v) || 'E-mail must be valid.',
        min25: v => (v && v.length >= 25) || 'Minimum 25 characters required.',
      },
      valid: false, // track form validity
    }
  },
  methods: {
    submitForm() {
    const isValid = this.$refs.form.validate()
    if (isValid) {
      console.log('Submit form', this.name, this.email, this.message)
    }
  },
    triggerFileSelect() {
      this.$refs.fileInput.click();
    },
    handleFile(event) {
      const selectedFile = event.target.files[0];

      if (
        selectedFile &&
        ['image/jpeg', 'image/png', 'image/webp'].includes(selectedFile.type) &&
        selectedFile.size <= 2 * 1024 * 1024
      ) {
        this.file = selectedFile;
      } else {
        alert('Invalid file. Only jpeg, png, or webp under 2MB allowed.');
        this.$refs.fileInput.value = null; // Reset input
      }
    },
    removeFile() {
      this.file = null;
      this.$refs.fileInput.value = null;
    }
  },
  async mounted() {
    if (process.client) {
      const L = await import('leaflet') // ✅ dynamic import

      // Remove default icon paths
      delete L.Icon.Default.prototype._getIconUrl;

      // Define a custom MDI icon marker
      const customMarker = L.divIcon({
        className: "", // don't use default styles
        html: `
          <div style="
            color: #FFB600;
            font-size: 50px;
            line-height: 1;
            display: flex;
            justify-content: center;
            align-items: center;
          ">
            <i class="mdi mdi-map-marker"></i>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      // Initialize the map
      this.map = L.map(this.$refs.mapContainer, {
        center: this.officeCoords,
        zoom: 15,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(this.map)

      // Add custom MDI icon marker
      L.marker(this.officeCoords, { icon: customMarker }).addTo(this.map);
    }
  },
  computed: {
    textSizeClass() {
    if (this.$vuetify.breakpoint.smAndDown) {
      return 'gtext-t7'; // Mobile
    } else if (this.$vuetify.breakpoint.mdOnly) {
      return 'gtext-t6'; // Tablet
    } else {
      return 'gtext-t5'; // Desktop
    }
  },
    mapStyles() {
      const { md, xs , sm } = this.$vuetify.breakpoint;

      if (xs) {
        return {
          width: '379px',
          height: '118px',
        };
      } else if (sm) {
        return {
          width: '348px',
          height: '377px',
        };
      }else if (md) {
        return {
          width: '348px',
          height: '577px',
        };
      } else {
        return {
          width: '683px',
          height: '601px',
        };
      }
    },
    infoBoxStyles() {
      const { sm,md, xs } = this.$vuetify.breakpoint;

      let width = '683px';
      if (xs) width = '379px';
      else if (sm||md) width = '348px';

      return {
        width,
        height: '36px',
        backgroundColor: '#F2F4F7',
        gap: '8px',
      };
    },
  },
}
</script>
<style scoped>
.theme--light.v-btn.v-btn--disabled.v-btn--has-bg {
  background-color: #FFE3B5 !important; /* Keep your yellow color */
  color: #98A2B3 !important; /* Custom text color */
  pointer-events: none; /* still disables clicks */
}
</style>