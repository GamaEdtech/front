<template>
  <v-container>
    <div style="display: flex;gap: 50px;">
      <form @submit.prevent="handleSubmit" style="width: 380px;height: 601px;">
        <div style="margin-bottom: 16px;">
          <label for="name" style="margin-bottom: 4px;">Name*</label>
          <input style="padding-left: 20px;padding-right: 20px;padding-top: 15px;padding-bottom: 15px;border: 1px solid #E4E7EC;border-radius: 30px; width: 380px; height: 48px;" v-model="form.name" type="text" id="name" placeholder="ui.lib.drive@gmail.com" required />
        </div>
        
        <div style="margin-bottom: 16px;">
          <label for="email" style="margin-bottom: 4px;">Email* </label>
          <input style="padding-left: 20px;padding-right: 20px;padding-top: 15px;padding-bottom: 15px;border: 1px solid #E4E7EC;border-radius: 30px; width: 380px; height: 48px;" v-model="form.email" type="email" id="email" placeholder="ui.lib.drive@gmail.com" required />
        </div>
        
        <div style="margin-bottom: 50px;">
          <label for="message" style="margin-bottom: 4px;">Message*</label>
          <textarea style="padding-left: 12px;padding-right: 12px;padding-top: 8px;padding-bottom: 12px;resize: none; width: 380px; height: 155px; border-radius: 16px;border: 1px solid #E4E7EC;" v-model="form.message" placeholder="Enter here.............." id="message" required></textarea>
          <p style="font-size: 14px;font-weight: 400; color: #98A2B3;">Enter at least 25 characters.</p>
        </div>


              <!-- Show Selected Files -->
        <div v-if="form.files.length" style="margin-bottom: 24px;">
          <ul style="padding: 0;">
            <li v-for="(file, index) in form.files" :key="index" style="display: flex; justify-content: space-between; width: 380px;list-style: none; font-size: 16px; font-weight: 500; color: #667085;">
              {{ file.name }}
              <button type="button" @click="removeFile(index)">
                <v-icon style="background-color: white;color: #F04438; border-radius: 50%;">mdi mdi-minus-circle</v-icon>
              </button>
            </li>
          </ul>
        </div>
        <!-- File Upload Field -->
        <div style="display: flex; align-items: center;margin-bottom: 56px;">
          <input
            ref="fileInput"
            type="file"
            id="files"
            multiple
            @change="handleFileChange"
            style="display: none;"
          />
          <div style="width: 110px;height: 30px; border-radius: 30px; border:1px solid #E4E7EC;
            display: flex; justify-content: center; align-items: center; cursor: pointer;margin-right: 6px;" @click="triggerFileSelect">
            <v-icon style="font-size: 14px;color: #2E90FA;">mdi-paperclip</v-icon>
            <p style="color: #2E90FA; font-size: 14px; font-weight: 500;"> Attach Files </p>
          </div>
          <p style="color: #98A2B3; font-size: 12px; font-weight: 400;">2 MB max size (*.jpeg, *.webp, *.png)</p>
        </div>


        
          <button style="border: 1px solid #E4E7EC;border-radius: 30px; width: 380px; height: 42px; background-color: #FFB600;color: #1D2939;" type="submit">Send</button>
      </form>
      
        <!-- Map -->
      <client-only>
        <div style="width: 601px; height: 683px;" id="map" ref="mapContainer"></div>
      </client-only>
    </div>
  </v-container>
</template>
  
<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

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
      officeCoords: [25.276987, 55.296249]
    }
  },
  methods: {
    handleSubmit() {
      // You can send data to an API or use $axios if installed
      console.log('Form submitted:', this.form)

      // Optional: Reset the form
      this.form = { name: '', email: '', message: '' }
    },
    handleFileChange(event) {
      const selectedFiles = Array.from(event.target.files)
      this.form.files = this.form.files.concat(selectedFiles)
      // Clear input value so same file can be re-selected if removed
      event.target.value = null
    },
    removeFile(index) {
      this.form.files.splice(index, 1)
    },
    triggerFileSelect() {
    this.$refs.fileInput.click()
  },
  initMap() {
      // Fix marker icons (Nuxt/Webpack)
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
        iconUrl: require('leaflet/dist/images/marker-icon.png'),
        shadowUrl: require('leaflet/dist/images/marker-shadow.png')
      })

      // Initialize the map
      this.map = L.map(this.$refs.mapContainer, {
        center: this.officeCoords,
        zoom: 15,
        zoomControl: false,
        attributionControl: false
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(this.map)

      L.marker(this.officeCoords).addTo(this.map)
    }
  },
  mounted() {
    // Only run Leaflet in the browser
    if (process.client) {
      this.initMap()
    }
  },
}
</script>