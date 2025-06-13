<!-- in refactor proccess -->

<template>
  <div>
    <div>
      <v-chip link class="mr-1" small>
        <nuxt-link
          :to="`/search?type=${$route.query.type}&section=${contentData.section}&base=${contentData.base}&lesson=${contentData.lesson}`"
        >
          {{ contentData.lesson_title }}
        </nuxt-link>
      </v-chip>
      <v-chip link class="mr-1" small>
        <nuxt-link
          :to="`/search?type=${$route.query.type}&section=${contentData.section}&base=${contentData.base}`"
        >
          {{ contentData.base_title }}
        </nuxt-link>
      </v-chip>
      <v-chip link class="mr-1" small>
        <nuxt-link
          :to="`/search?type=${$route.query.type}&section=${contentData.section}`"
        >
          {{ contentData.section_title }}
        </nuxt-link>
      </v-chip>
    </div>
    <div class="item-content-footer">
      <div class="d-flex mt-3">
        <div class="item-content-user d-flex align-center mr-2">
          <v-avatar size="2em">
            <img
              :src="require('assets/images/defaultAvatar1.jpg')"
              alt="Avatar"
            />
          </v-avatar>
          <p class="mx-2">
            {{ contentData.first_name }} {{ contentData.last_name }}
          </p>
        </div>

        <div class="item-content-last-update d-flex align-center mx-auto">
          <i class="fa-solid fa-calendar-days"></i>
          <p class="mx-2">
            <span class="d-none d-md-inline"> Updated: </span>
            <span class="date_string d-inline-block">
              {{ $dayjs(contentData.up_date).fromNow() }}
            </span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  contentData: {},
});
</script>

<style scoped></style>
