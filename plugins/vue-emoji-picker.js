// This file should be client-side only
export default defineNuxtPlugin((nuxtApp) => {
  // Only run on client-side
  if (process.client) {
    // Dynamically import only on client side
    import('vue3-emoji-picker')
      .then((module) => {
        const VEmojiPicker = module.default;
        nuxtApp.vueApp.use(VEmojiPicker);
      })
      .catch(error => {
        console.error('Failed to load emoji picker:', error);
      });
  }
});
