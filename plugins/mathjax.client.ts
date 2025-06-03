import VueMathjax from 'vue-mathjax-next'

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(VueMathjax)
})