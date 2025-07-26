import { defineNuxtPlugin } from '#app'
import {
  StencilPreview,
  DraggableArea,
  DraggableElement,
  ResizeEvent,
} from 'vue-advanced-cropper'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('StencilPreview', StencilPreview)
  nuxtApp.vueApp.component('DraggableArea', DraggableArea)
  nuxtApp.vueApp.component('DraggableElement', DraggableElement)
  nuxtApp.vueApp.component('ResizeEvent', ResizeEvent)
})
