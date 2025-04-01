<template>
  <v-app>
    <div class="d-flex">
      <v-navigation-drawer height="100vh" left permanent color="#1d2939">
        <v-list-item class="text-h4 font-weight-bold white--text"
          >Dashboard
        </v-list-item>
        <v-list dense nav>
          <v-list-item
            v-for="item in menuItems"
            :key="item.title"
            link
            :to="item.link"
            class="white--text"
          >
            <v-list-item-icon>
              <v-icon class="white--text">{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <template v-slot:append>
          <div class="d-flex align-center user pb-20">
            <img class="profile" alt="profile" :src="$auth.user.avatar" />
            <h3 class="ml-3 white--text">{{ userName }}</h3>
          </div>
        </template>
      </v-navigation-drawer>
      <!-- Sidebar -->

      <v-main>
        <v-app-bar dense color="#1d2939" />
        <v-container fluid>
          <Nuxt />
        </v-container>
      </v-main>
    </div>
  </v-app>
</template>

<script>
export default {
  name: "AdminLayout",
  data() {
    return {
      activeTab: "Order",
      menuItems: [
        { title: "Type", link: "/admin/type", icon: "mdi-basket" },
        { title: "My Stock", link: "/admin/stock", icon: "mdi-finance" },
        { title: "Analysis", link: "/admin/analysis", icon: "mdi-chart-line" },
      ],
      typeManagement: [{ text: "Location" }, { text: "Profile" }],
    };
  },
  computed: {
    userName() {
      return (
        this.$auth.user?.first_name || this.$auth.user?.last_name || "No name"
      );
    },
  },
  methods: {},
};
</script>

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
</style>
