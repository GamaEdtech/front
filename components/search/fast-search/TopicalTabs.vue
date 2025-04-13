<template>
  <v-row class="my-0 flex-col flex-md-row">
    <v-col>
      <v-list class="d-inline-flex flex-col flex-md-row align-center flex-wrap">
        <v-list-item
          class="pa-0 d-inline-flex flex-row align-center"
          style="min-height: fit-content"
        >
          <v-list-item-icon style="padding-block: 0; margin-block: 0">
            <img :src="require('@/assets/icons/' + papers.icon)" />
          </v-list-item-icon>
          <v-list-item-content style="padding-block: 0; margin-block: 0">
            <v-list-item-title
              class="d-flex flex-row align-center gama-text-h3 font-weight-bold"
            >{{ papers.label }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          class="pa-0"
          style="min-height: fit-content; justify-content: space-evenly"
        >
          <v-chip-group>
            <v-chip
              v-for="(paper, i) in papers.items"
              :key="i"
              class="white--text bg-primary-gray-700"
              small
            >
              {{ paper }}
            </v-chip>
          </v-chip-group>
        </v-list-item>
      </v-list>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'TopicalTabs',
  props: {
    papers: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
/* Styles are using predefined classes from assets/scss/styles.scss */
</style> 