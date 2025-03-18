import { defineNuxtPlugin } from "#app";
import VEmojiPicker from "vue3-emoji-picker";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VEmojiPicker);
});
