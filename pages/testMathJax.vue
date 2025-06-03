<template>
  <div class="mt-10">
    <textarea v-model="formula"/>
    <vue-mathjax :formula="formula"/>
  </div>
  <Script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-AMS_HTML"></Script>
</template>

<script setup lang="ts">
const formula = ref('$$x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}.$$');
</script>
