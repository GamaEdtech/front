<template>
  <v-container class="pb-10 mb-16">
    <create-test-form />
  </v-container>
</template>

<script setup>
import CreateTestForm from "~/components/test-maker/create-test-form.vue";

// Define layout and page metadata
definePageMeta({
  layout: "test-maker-layout",
});

useHead({
  title: "New Exam",
});
</script>
