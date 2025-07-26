import { createConfigForNuxt } from "@nuxt/eslint-config";

export default createConfigForNuxt({
  features: {
    stylistic: true,
  },
})
  .override("nuxt/stylistic", {
    rules: {
      "@stylistic/quotes": "off",
      "@stylistic/member-delimiter-style": "off",
      "@stylistic/semi": "off",
      "@stylistic/max-statements-per-line": "off",
      "@stylistic/indent": "off",
      "@stylistic/no-trailing-spaces": "off",
      "@stylistic/brace-style": "off",
      "@stylistic/arrow-parens": "off",
      "@stylistic/comma-dangle": "off",
      "@stylistic/eol-last": "off",
      "@stylistic/no-multiple-empty-lines": "off",
      "@stylistic/operator-linebreak": "off",
      "@stylistic/quote-props": "off",
    },
  })
  .override("nuxt/typescript/rules", {
    rules: {
      "@typescript-eslint/ban-types": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  })
  .override("nuxt/rules", {
    rules: {
      "vue/no-v-html": "off",
    },
  });
