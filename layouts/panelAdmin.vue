<template>
  <div class="admin-layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <h2 class="my-5">Dashboard</h2>
      <div class="d-flex align-center mb-5">
        <img
          id="logo"
          alt="gamatrain"
          :src="require('@/assets/images/Logo.svg')"
        />
        <h3 class="ml-2">Admin Panel</h3>
      </div>

      <ul>
        <p class="p">Caption</p>
        <li
          v-for="item in menuItems"
          :key="item.text"
          @click="selectTab(item.text)"
          :class="{ active: activeTab === item.text }"
        >
          <v-icon v-if="item.icon" class="mr-3" small>{{ item.icon }}</v-icon>
          <img
            v-else
            class="mr-3"
            :src="require(`@/assets/images/dashboard-icon/${item.img}`)"
            alt="icon"
          />
          {{ item.text }}
        </li>
      </ul>

      <ul>
        <p class="p">Type Management</p>
        <li
          v-for="item in typeManagement"
          :key="item.text"
          class="d-flex align-center"
          @click="selectTab(item.text)"
          :class="{ active: activeTab === item.text }"
        >
          <div class="dot"></div>
          {{ item.text }}
        </li>
      </ul>

      <div class="d-flex align-center user">
        <img class="profile" alt="profile" :src="$auth.user.avatar" />
        <h3 class="ml-3">{{ userName }}</h3>
      </div>
    </aside>

    <div class="main">
      <header class="header pa-7"></header>
      <main class="content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdminLayout",
  data() {
    return {
      activeTab: "Order",
      menuItems: [
        { text: "Order", img: "Order.svg" },
        { text: "My Stock", icon: "mdi-finance" },
        { text: "Analysis", icon: "mdi-chart-line" },
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
  methods: {
    selectTab(tab) {
      this.activeTab = tab;
      this.$emit("tab-selected", tab);
    },
  },
};
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
}
.sidebar {
  width: 304px;
  background: #1d2939;
  color: white;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
}
.sidebar ul {
  list-style: none;
  padding: 0;
}
.sidebar ul li {
  padding: 10px;
  cursor: pointer;
  color: #98a2b3;
  transition: 0.3s;
}
.sidebar ul li:hover,
.sidebar ul li.active {
  background: #344054;
  color: #ffffff;
}
.header {
  width: 100%;
  background: #1d2939;
  padding: 15px 20px;
  border-bottom: 1px solid #1d2939;
  color: #ffffff;
}
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.content {
  padding: 20px;
  background: #f4f4f4;
  flex: 1;
}
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
.p {
  font-size: 14px;
  color: #98a2b3;
}
</style>
