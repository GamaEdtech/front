<template>
  <div>
    <!-- Desktop view -->
    <v-list two-line class="d-none d-md-block pa-0">
      <v-list-item
        v-for="(resource, i) in resources"
        :key="`desktop-${i}`"
        class="pa-0"
        v-if="
          resource.items &&
          resource.items.length > 0 &&
          resource.title != `Topical`
        "
      >
        <v-list-item-icon>
          <v-icon
            color="#667085"
            size="24"
            v-if="resource.useCustomIcon"
            :class="resource.icon"
          ></v-icon>
          <v-icon color="#667085" size="24" v-else>{{
            getMaterialIcon(resource.icon)
          }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="gama-text-h3 font-weight-bold">
            {{ resource.title }}
          </v-list-item-title>
          <div class="container-links">
            <NuxtLink
              class="font-weight-medium primary-subtitle-500"
              v-for="(item, j) in resource.items"
              :key="j"
              :to="`/paper/${item.id}/${item.title_url}`"
            >
              {{
                item.title.length > 50
                  ? item.title.slice(0, 50) + "..."
                  : item.title
              }}.
            </NuxtLink>
          </div>
          <v-divider class="my-2" />
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <!-- Mobile view -->
    <div class="d-block d-md-none">
      <div
        v-for="(resource, i) in resources"
        :key="`mobile-${i}`"
        class="resource-mobile mb-4"
        v-if="
          resource.items &&
          resource.items.length > 0 &&
          resource.title != `Topical`
        "
      >
        <div class="d-flex align-center mb-2">
          <v-icon
            color="#667085"
            size="24"
            v-if="resource.useCustomIcon"
            :class="resource.icon"
            class="resource-icon mr-2"
          ></v-icon>
          <v-icon color="#667085" size="24" v-else class="resource-icon mr-2">{{
            getMaterialIcon(resource.icon)
          }}</v-icon>
          <span class="gama-text-h6 font-weight-bold">{{
            resource.title
          }}</span>
        </div>
        <div class="ml-8">
          <div class="container-links">
            <NuxtLink
              class="primary-subtitle-500"
              v-for="(item, j) in resource.items"
              :key="j"
              :to="`/paper/${item.id}/${item.title_url}`"
            >
              {{
                item.title.length > 50
                  ? item.title.slice(0, 50) + "..."
                  : item.title
              }}.
            </NuxtLink>
          </div>
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
  methods: {
    getMaterialIcon(iconName) {
      // Map your current icon names to Material Design icon names
      const iconMap = {
        "ExamHub.svg": "mdi-notebook-edit-outline",
        "PaperIcon.svg": "mdi-file-document-outline",
        "QA.svg": "mdi-forum",
        "Guide.svg": "mdi-sign-direction",
        "Tutorial.svg": "mdi-book-open-page-variant-outline",
        // Add more mappings as needed
        // Default icon if not found in mapping
        default: "mdi-file-outline",
      };

      return iconMap[iconName] || iconMap.default;
    },
  },
};
</script>

<style scoped>
.container-links {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  column-gap: 4px;
}
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
.v-list-item__icon > i {
  color: #ffb600 !important;
}
.resource-mobile .resource-icon {
  color: #ffb600 !important;
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

/* Custom icon styles */
.icon-q-a,
.icon-exam,
.icon-paper,
.icon-tutorial {
  font-size: 24px;
}
</style>
