<!-- components/TutorialTree.vue -->
<template>
    <ul class="ml-4">
      <li v-for="item in items" :key="item.id" class="mb-2">
        <div class="d-flex align-center" @click="toggleOpen(item.id)" style="cursor: pointer">
          <v-icon color="teal" size="small" class="mr-2">
            {{ isOpen(item.id) ? 'mdi-chevron-down' : 'mdi-chevron-right' }}
          </v-icon>
          <v-icon color="teal" size="small" class="mr-2">
            {{ item.chapters ? 'mdi-folder' : 'mdi-file-document-outline' }}
          </v-icon>
          <span>
            <nuxt-link
              v-if="item.tutorials?.length === 1"
              :to="`/tutorial/${item.tutorials[0].id}/${$slugGenerator.convert(item.title)}`"
              class="font-weight-medium text-teal-darken-2"
            >
              {{ item.title }}
            </nuxt-link>
            <span v-else class="font-weight-medium">
              {{ item.title }}
            </span>
          </span>
        </div>
  
        <transition name="fade">
          <TutorialTree
            v-if="item.chapters && item.chapters.length > 0 && isOpen(item.id)"
            :items="item.chapters"
          />
        </transition>
      </li>
    </ul>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  // Props
  defineProps({
    items: {
      type: Array,
      required: true,
    },
  });
  
  // Open state map
  const openMap = ref({});
  
  const toggleOpen = (id) => {
    openMap.value[id] = !openMap.value[id];
  };
  
  const isOpen = (id) => openMap.value[id];
  </script>
  
  <style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.2s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
    transform: translateY(-2px);
  }
  </style>