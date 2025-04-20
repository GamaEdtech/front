<template>
  <div>
    <!--Dialog for share-->
    <v-dialog
      transition="dialog-top-transition"
      class="share_dialog"
      max-width="600"
    >
      <template v-slot:activator="{ props }">
        <span v-bind="props" class="pointer">
          <i class="fa-solid fa-share-alt mr-1 icon"></i>
          Share
        </span>
      </template>
      <template v-slot:default="{ isActive }">
        <v-card>
          <v-toolbar color="default" title="Share"> </v-toolbar>
          <v-card-text>
            <p class="mb-3">Share this content:</p>
            <v-row>
              <v-col cols="12">
                <v-btn outlined block @click="copyUrl">
                  <i class="fa-solid fa-copy mr-1 icon"></i>
                  &nbsp;
                  {{ copyBtnText }}
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn
                  @click="shareWhatsApp"
                  target="_blank"
                  block
                  color="#25d366"
                  class="text-white"
                >
                  <i class="fab fa-whatsapp mr-1 icon"></i>
                  WhatsApp
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn
                  block
                  color="#00acee"
                  class="text-white"
                  @click="shareTelegram"
                >
                  <i class="fab fa-telegram-plane mr-1 icon"></i>
                  Telegram
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn text @click="isActive.value = false">close</v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["copy", "share"]);

const copyBtnText = ref("Copy");

function copyUrl() {
  emit("copy");
  copyBtnText.value = "Copied";
}

function shareWhatsApp() {
  emit("share", "whatsapp");
}

function shareTelegram() {
  emit("share", "telegram");
}
</script>

<style scoped>
.pointer {
  cursor: pointer;
}
</style>
