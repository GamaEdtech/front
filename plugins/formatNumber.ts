// @ts-nocheck

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.globalProperties.$filters = {
    formatNumber(value) {
      if (!value) return "0";
      return new Intl.NumberFormat().format(value);
    },
  };
});
