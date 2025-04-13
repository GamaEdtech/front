<template>
  <v-list two-line>
    <v-list-item v-for="(item, i) in resources" :key="i" class="pa-0">
      <v-list-item-icon>
        <img :src="require('@/assets/icons/' + item.icon)" />
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title class="gama-text-h3 font-weight-bold">
          {{ item.title }}
        </v-list-item-title>
        <v-list-item-subtitle class="font-weight-medium primary-subtitle-500">
          {{ item.link }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  name: 'ResourcesList',
  props: {
    resources: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
.primary-subtitle-500 {
  color: #2e90fa !important;
  font-weight: 400 !important;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0%;
  vertical-align: middle;
  line-height: 22px;
}

.v-application--is-ltr .v-list-item__icon:first-child {
  margin-right: 12px;
}
</style> 