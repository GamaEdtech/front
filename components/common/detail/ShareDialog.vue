<template>
  <v-dialog
    transition="dialog-top-transition"
    class="share_dialog"
    max-width="600"
  >
    <template v-slot:activator="{ props }">
      <span v-bind="props" class="share-trigger pointer">
        <i class="fa-solid fa-share-alt mr-1 icon"></i>
        Share
      </span>
    </template>
    <template v-slot:default="{ isActive }">
      <v-card>
        <v-toolbar color="default" title="Share"></v-toolbar>
        <v-card-text class="mt-5">
          <p class="mb-3">Share this content:</p>
          <v-row>
            <v-col cols="12">
              <v-btn outlined block @click="copyUrl">
                <i class="fa-solid fa-copy mr-1 icon"></i>&nbsp;
                {{ copyBtnText }}
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn
                @click="shareSocial('whatsapp')"
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
                @click="shareSocial('telegram')"
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
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
});

// Reactive data
const copyBtnText = ref("Copy");

// Methods
function copyUrl() {
  navigator.clipboard.writeText(window.location.href);
  copyBtnText.value = "Copied";
  setTimeout(() => {
    copyBtnText.value = "Copy";
  }, 2000);
}

function shareSocial(platform) {
  if (platform == "whatsapp")
    window.open(`https://api.whatsapp.com/send?text=${window.location.href}`);
  else if (platform == "telegram")
    window.open(
      `https://telegram.me/share/url?url=${window.location.href}&text=${props.title}`
    );
}
</script>
