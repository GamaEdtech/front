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
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/no-dynamic-delete": "off",
      "@typescript-eslint/unified-signatures": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "nuxt/nuxt-config-keys-order": "off",
    },
  })
  .override("nuxt/rules", {
    rules: {
      "vue/no-unused-vars": "off",
      "vue/no-v-html": "off",
      "vue/no-v-text-v-html-on-component": "off",
      "vue/valid-v-slot": "off",
      "no-empty": "off",
      "no-undef": "off",
      "vue/no-template-shadow": "off",
      "no-useless-catch": "off",
      "no-useless-escape": "off",
      "vue/no-duplicate-attributes": "off",
      "vue/no-side-effects-in-computed-properties": "off",
      "vue/no-use-v-if-with-v-for": "off",
      "vue/no-mutating-props": "off",
      // "vue/require-prop-type-constructor": "off",



    },
  });
