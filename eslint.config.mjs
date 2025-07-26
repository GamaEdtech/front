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
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  })
  .override('nuxt/rules', {
    rules: {
      'vue/no-v-html': 'off',
    },
  })
