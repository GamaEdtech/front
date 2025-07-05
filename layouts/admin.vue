<script setup>
import { useDisplay } from 'vuetify'
import { useRouter } from 'vue-router'

const { mobile } = useDisplay()
const drawer = ref(true)

// Automatically open drawer on desktop, close on mobile
watch(mobile, (isMobile) => {
  drawer.value = !isMobile
}, { immediate: true })

const isPermanent = computed(() => !mobile.value)
const isTemporary = computed(() => mobile.value)

const router = useRouter()

const menuItems = [
        { title: "Type", link: "/admin/type", icon: "mdi-basket" },
        { title: "Blogs", link: "/admin/blogs", icon: "mdi-book-open-outline" },
        { title: "My Stock", link: "/admin/stock", icon: "mdi-finance" },
        { title: "Analysis", link: "/admin/analysis", icon: "mdi-chart-line" },
        { title: "Contact Us", link: "/admin/contact-us", icon: "mdi-archive-arrow-down-outline",},
      ]

const navigate = (link) => {
  router.push(link)
  if (mobile.value) drawer.value = false // auto-close drawer on mobile after navigation
}
</script>

<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :permanent="isPermanent"
      :temporary="isTemporary"
      app
      color="#1d2939"
    >
    <div class="text--white font-weight-semibold pa-4 gtext-t2 mb-6">
        Dashboard
    </div>
    <div class="d-flex ga-3 py-1 px-4 w-100 align-center gtext-t3 font-weight-medium primary-gray-300 mb-2">
      <img class="rounded-pill" style="width: 36px; height: 36px;" src="/public/images/adminAuth.png" alt="">
      Admin Panel
    </div>
      <v-list>
        <v-list-item
          v-for="item in menuItems"
          :key="item.link"
          link
          @click="navigate(item.link)"
          class="px-6"
        >
        <div class="d-flex align-center ga-3">
            <v-list-item-icon>
                <v-icon class="primary-gray-400">{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title class="primary-gray-400 gtext-t5">{{ item.title }}</v-list-item-title>
        </div>
          
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="#1d2939" dark>
      <v-app-bar-nav-icon
        v-if="mobile"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>
    </v-app-bar>

    <v-main>
      <NuxtPage class="pa-5" />
    </v-main>
  </v-app>
</template>

<style scoped>
.user {
  display: flex;
  align-items: center;
  margin-top: auto;
  margin-bottom: 10px;
}
.profile {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.v-container {
  flex: 1 1 0%;
  min-height: 0;
  overflow-y: auto;
}
:deep(.v-navigation-drawer--left){
    border-width: 0px !important;
}
</style>