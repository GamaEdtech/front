<template>
    <v-snackbar class="snackbar" :timeout="4000" v-model="snankebar.isShow"
        :color="snankebar.status === 'error' ? 'red' : 'green'" location="top left">
        <span class="snakebar-icon mdi"
            :class="snankebar.status === 'error' ? 'mdi-close-circle' : 'mdi-check-circle'"></span>
        <span class="snackbar-text">
            {{ snankebar.text }}
        </span>
    </v-snackbar>
    <v-container class="mt-16 main">
        <v-row>
            <v-col cols="12" sm="6" md="4">
                <div class="pt-4 mb-6 mb-md-0 mr-0 mr-md-12 d-flex flex-column">
                    <v-form class="form" v-model="isFormValid" ref="form">
                        <!--Name Input-->
                        <div>
                            <label class="lable">Name*</label>

                            <v-text-field rounded placeholder="Enter your full name" variant="outlined" height="48"
                                :rules="[rules.required]" v-model="formsData.name">
                            </v-text-field>
                        </div>

                        <!--Email Input-->
                        <div>
                            <label class="lable">Email*</label>

                            <v-text-field rounded variant="outlined" placeholder="Enter your email address" outlined
                                height="48" :rules="[rules.required, rules.email]"
                                v-model="formsData.email"></v-text-field>
                        </div>

                        <!--Subject Input-->
                        <div>
                            <label class="lable">Subject*</label>

                            <v-text-field rounded variant="outlined" placeholder="Enter your Subject" outlined
                                class="rounded-pill mb-5" height="48" :rules="[rules.required]"
                                v-model="formsData.subject"></v-text-field>
                        </div>


                        <!--Message textarea-->
                        <div>
                            <label class="lable">Discription*</label>

                            <v-textarea rounded variant="outlined" outlined name="input-7-4"
                                hint="Enter at least 25 characters." placeholder="Write something..." no-resize
                                height="155" :rules="[rules.required, rules.min25]"
                                v-model="formsData.message"></v-textarea>
                        </div>


                        <v-btn variant="flat" color="primary" size="x-large" type="submit" rounded
                            class="primary-gray-800" height="42" block :disabled="!isFormValid"
                            @click.prevent="submitForm" :loading="formLoading">
                            Send
                        </v-btn>
                    </v-form>
                </div>
            </v-col>
            <v-col class="map-container" cols="12" sm="6" md="8">
                <div class="address">
                    <v-icon size="x-large" color="#97A2B2" class="icon" icon="mdi-map-marker"></v-icon>
                    <span>
                        2419 West 53rd Street, Apt 5B, New York, NY 10019
                    </span>
                </div>
                <LMap class="map" ref="map" :options="{ zoomControl: false }" :zoom="zoom"
                    :center="[41.050652, 28.894283]" :use-global-leaflet="false">
                    <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                        layer-type="base" name="OpenStreetMap" />
                    <!-- Custom SVG marker -->
                    <LMarker :lat-lng="[41.050652, 28.894283]">
                        <LIcon :icon-size="[50, 50]" :icon-anchor="[50, 50]" class-name="custom-svg-marker">
                            <img src="/images/foundation--marker.svg" alt="Location marker" class="marker-image" />
                        </LIcon>
                    </LMarker>
                </LMap>
            </v-col>
        </v-row>
        <div>
        </div>
    </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRecaptcha } from '~/composables/useRecapcha'
import useApiService from '~/composables/useApiService'

const zoom = ref(20)
const rules = {
    required: (v: string) => !!v || 'This field is required.',
    email: (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid.',
    min25: (v: string) => (v && v.length >= 25) || 'Minimum 25 characters required.',
}
const formsData = reactive({
    name: '',
    email: '',
    message: '',
    subject: ''
})
const isFormValid = ref<boolean>(false)
const formLoading = ref<boolean>(false)
const snankebar = reactive({
    isShow: false,
    text: "",
    status: ""
})
const showSnackebar = (status: "success" | "error", message: string) => {
    snankebar.isShow = true
    snankebar.status = status
    snankebar.text = message
}
const form = ref<HTMLFormElement | null>(null)
const { getToken, initCaptcha, isLoaded } = useRecaptcha()

const submitForm = async () => {
    formLoading.value = true

    if (isFormValid.value) {
        try {
            if (!isLoaded()) {
                throw new Error('reCAPTCHA not loaded yet. Please try again.')
            }

            const token = await getToken('submit')

            const res: any = await useApiService.post("/api/v2/contacts", {
                captcha: token,
                fullName: formsData.name,
                email: formsData.email,
                subject: formsData.subject,
                body: formsData.message,
            })

            if (res.succeeded) {
                showSnackebar("success", 'Your message has been sent successfully.')
            } else {
                res.errors.forEach((error: any )=> {
                    showSnackebar("error", error.message)
                });
            }

            // Reset form
            if (form.value) {
                form.value.reset()
            }

            console.log(res);

        } catch (error: any) {
            console.log(error);
            formLoading.value = false
            showSnackebar("error", 'An error occurred. Please try again.')
        } finally {
            formLoading.value = false
        }
    } else {
        formLoading.value = false
    }
}

onMounted(() => {
    initCaptcha()
})
</script>

<style scoped>
.snackbar{
    /* transform: translate(-50%, 0); */
    --v-layout-top: 0 !important;
    --v-layout-left: 0 !important;
}

.snakebar-icon{
    font-size: 1.8rem !important;
}

.snackbar-text{
    font-size: 1.8rem !important;
    font-weight: 600;
    margin-left: 1rem;
}

.form {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    gap: 1.5rem;
}

.lable {
    display: block;
    margin-bottom: 1rem;
    font-weight: 600;
}

.map-container{
    position: relative;
}

.address{
    width: calc(100% - 24px);
    background-color: #F2F4F7;
    margin: 0 24px;
    padding: 1rem 2rem;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    transform: translate(-1.2rem, -1.2rem );
    z-index: 1000;
    border-radius: 0 0 2rem 2rem;
}

.address span {
    font-size: 2rem;
    font-weight: 600;
    color: #334053;
}

.map{
    border-radius: 2rem;
    -webkit-box-shadow: 8px 8px 24px 0px rgba(66, 68, 90, 0.08);
    -moz-box-shadow: 8px 8px 24px 0px rgba(66, 68, 90, 0.08);
    box-shadow: 8px 8px 24px 0px rgba(66, 68, 90, 0.08);
}

.marker-image {
    width: 50px;
    height: 50px;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

@media (max-width: 599px) {
    .map{
        height: 40rem !important;
    }
}

</style>