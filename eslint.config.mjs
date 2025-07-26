import { createConfigForNuxt } from '@nuxt/eslint-config'

export default createConfigForNuxt({
  features: {
    stylistic: true,
  },
})
  .override('nuxt/stylistic', {
    rules: {
    },
  })
  .override('nuxt/typescript/rules', {
    rules: {
    },
  })
  .override('nuxt/rules', {
    rules: {
      'vue/no-v-html': 'off',
    },
  })
