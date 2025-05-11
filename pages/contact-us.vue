<template>
  <v-container>
    <v-row
      class="mb-12 mt-15 mt-lg-4"
      align="center"
      justify="center"
      >
      <!-- Form -->
      <v-col cols="12" md="5" class="pt-4 mb-6 mb-md-0" align="center">
        <div
          class="pt-4 mb-6 mb-md-0 mr-0 mr-md-12 d-flex flex-column"
          >
          <v-form v-model="valid">
            <!--Name Input-->
            <v-text-field
                label="Name*"
                placeholder="Enter your full name"
                outlined
                class="rounded-pill mb-5"
                height="48"
                :rules="[rules.required]"
                v-model="form.name"
              ></v-text-field>

            <!--Email Input-->
            <v-text-field
                label="Email*"
                placeholder="Enter your email address"
                outlined
                class="rounded-pill mb-5"
                height="48"
                :rules="[rules.required, rules.email]"
                v-model="form.email"
            ></v-text-field>

            <!--Subject Input-->
            <v-text-field
                label="Subject*"
                placeholder="Enter your Subject"
                outlined
                class="rounded-pill mb-5"
                height="48"
                :rules="[rules.required]"
                v-model="form.subject"
            ></v-text-field>


            <!--Message textarea-->
            <v-textarea
              outlined
              name="input-7-4"
              label="Message*"
              hint="Enter at least 25 characters."
              placeholder="Write something..."
              no-resize
              class="rounded-xl mb-10"
              height="155"
              :rules="[rules.required, rules.min25]"
              v-model="form.message"
            ></v-textarea>

            <!--File Input & Preview(delete) File-->
            <!--<v-row class="mb-14" dense>

              <v-col cols="12" v-show="form.file">
                <v-row align="center" justify="space-between">
                  <v-col cols="auto">
                    <span>{{ form.file?.name }}</span>
                  </v-col>
                  <v-col cols="auto">
                    <v-btn icon small @click="removeFile">
                      <v-icon color="error">mdi-minus-circle</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="12" v-show="!form.file">
                <v-row align="center" dense>
                   Hidden file input 
                  <input
                    type="file"
                    ref="fileInput"
                    @change="handleFile"
                    class="d-none"
                  />

                   Attach file button 
                  <v-col cols="auto">
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
                  </v-col>

                   Hint 
                  <v-col>
                    <p class="gtext-t6 d-flex align-center gray--text">
                      Max size: 2MB (jpeg, png, webp)
                    </p>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>-->

            <v-btn
              color="primary"
              type="submit"
              rounded
              class="primary-gray-800"
              height="42"
              block
              :disabled="!valid"
              @click="submitForm"
            >
              Send
            </v-btn>
          </v-form>
        </div>
      </v-col>

      <!-- Map -->
       <v-col cols="12" md="6" align="center">
        <v-row no-gutters class="rounded-xl overflow-hidden">
          <v-col cols="12">
            <client-only>
              <div id="map" ref="mapContainer" class="rounded-t-xl mapStyle"></div>
            </client-only>
          </v-col>

          <!-- Address Box -->
          <v-col cols="12" class="bg-primary-gray-100 py-2 pl-4">
            <v-row no-gutters align="center">
              <v-col cols="auto mr-1">
                <v-icon class="gtext-t5 gray--text">mdi-map-marker</v-icon>
              </v-col>
              <v-col>
                <p class="font-weight-medium primary-gray-700 text-left">
                  2419 West 53rd Street, Apt 5B, New York, NY 10019
                </p>
              </v-col>
            </v-row>
          </v-col>
          
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
  
<script>

export default {
  auth: false,
  data() {
    return {
      form: {
        name: '',
        email: '',
        message: '',
        subject:''
        //file: null
      },
      map: null,
      officeCoords: [41.050652, 28.894283],
      rules: {
        required: v => !!v || 'This field is required.',
        email: v => /.+@.+\..+/.test(v) || 'E-mail must be valid.',
        min25: v => (v && v.length >= 25) || 'Minimum 25 characters required.',
      },
      valid: false, // track form validity
    }
  },
  methods: {
    async submitForm(event) {
      event.preventDefault();
      if (this.valid){
        const token = await this.$recaptcha.execute('contact_form');
        console.log(token)
        try{
          await this.$axios.$post('/api/v2/contacts', {
            captcha: token, 
            fullName: this.form.name,
            email: this.form.email,
            subject: this.form.subject,
            body: this.form.message,
          });

            this.$toast.show('<span class="mdi mdi-check-circle gtext-t3 toast-contactus-message-success"></span> <span>Your message has been sent successfully.</span>', {
              type: 'success',
              className: 'gtext-t5 white--text bg-primary-gray-800 text-left font-weight-medium toast-contactus-success'
            })
        }catch (err){
          if (err.response.status == 400)
              this.$toast.error(err.response.data.message);
      }}
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
        this.form.file = selectedFile;
      } else {
        this.$refs.fileInput.value = null;
        this.$toast.show('<span class="mdi mdi-close-circle gtext-t3 toast-contactus-message-error"></span> <span>Your file size exceeds the allowed limit.</span>', {
        type: 'error',
        className: 'gtext-t5 white--text bg-primary-gray-800 text-left font-weight-medium toast-contactus-error'
      })
      }
    },
    removeFile() {
      this.form.file = null;
      this.$refs.fileInput.value = null;
    }
  },
  async mounted() {
    if (process.client) {
      const L = await import('leaflet') // dynamic import

      // Remove default icon paths
      delete L.Icon.Default.prototype._getIconUrl;

      // Define a custom MDI icon marker
      const customMarker = L.divIcon({
        className: "",
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
}
</script>
<style scoped>
.theme--light.v-btn.v-btn--disabled.v-btn--has-bg {
  background-color: #FFE3B5 !important;
  color: #98A2B3 !important;
  pointer-events: none;
}

.display-flex{
  display: flex;
}

.mapStyle {
  width: 100%;
  height: 601px; 
}

@media (max-width: 1264px) {
  .mapStyle {
    height: 577px; 
  }
}

@media (max-width: 960px) {
  .mapStyle {
    height: 377px;
  }
}

@media (max-width: 600px) {
  .mapStyle {
    height: 118px;
  }
}
</style>