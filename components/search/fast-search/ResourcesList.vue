<template>
  <div>
    <!-- Desktop view -->
    <v-list two-line class="d-none d-md-block pa-0">
      <v-list-item
        v-for="(item, i) in resources"
        :key="`desktop-${i}`"
        class="pa-0"
      >
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
          <v-divider class="my-2" />
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <!-- Mobile view -->
    <div class="d-block d-md-none">
      <div
        v-for="(item, i) in resources"
        :key="`mobile-${i}`"
        class="resource-mobile mb-4"
      >
        <div class="d-flex align-center mb-2">
          <img
            :src="require('@/assets/icons/' + item.icon)"
            class="resource-icon mr-2"
          />
          <span class="gama-text-h6 font-weight-bold">{{ item.title }}</span>
        </div>
        <div class="primary-subtitle-500 ml-8">
          <template>
            <div style="max-width: max-content" class="mobile-link">
              {{ item.link }}
            </div>
          </template>
        </div>
        <v-divider />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ResourcesList",
  props: {
    resources: {
      type: Array,
      required: true,
    },
  },
};
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

.resource-mobile .resource-icon {
  width: 24px;
  height: 24px;
}

.gama-text-h6,
.gama-text-h3 {
  color: #667085 !important;
}

.mobile-link {
  margin-bottom: 4px;
  color: #2e90fa !important;
  font-size: 14px;
  line-height: 30px;
}
.v-divider {
  border-color: #f2f4f7 !important;
}
</style>