<template>
  <div class="admin-container">
    <h2>Dashboard</h2>
    <div class="main">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="d-flex">
          <img id="logo" alt="gamatrain" :src="require('@/assets/images/Logo.svg') " />

          <h3 class="d-flex justify-center align-center mt-6 ml-2">
            Admin Panel
          </h3>
        </div>
        <ul>
          <p class="p">caption</p>
          <li
            @click="activeTab = 'order'"
            :class="{ active: activeTab === 'order' }"
          >
            <img
              class="mr-3"
              alt="gamatrain"
              :src="require('@/assets/images/dashboard-icon/Order.webp')"
            />

            Order
          </li>
          <li
            @click="activeTab = 'My Stock'"
            :class="{ active: activeTab === 'My Stock' }"
          >
            <img
              class="mr-3"
              id="logo"
              alt="gamatrain"
              :src="require('@/assets/images/dashboard-icon/MyStock.webp')"
            />

            My Stock
          </li>
          <li
            @click="activeTab = 'Analysis'"
            :class="{ active: activeTab === 'Analysis' }"
          >
            <img
              class="mr-3"
              id="logo"
              alt="gamatrain"
              :src="require('@/assets/images/dashboard-icon/Analysis.webp')"
            />

            Analysis
          </li>
          <ul>
            <p class="p">Type Management</p>

            <li
              class="d-flex align-center"
              @click="activeTab = 'location'"
              :class="{ active: activeTab === 'location' }"
            >
              <div class="dot"></div>

              location
            </li>
            <li
              class="d-flex align-center"
              @click="activeTab = 'Profile'"
              :class="{ active: activeTab === 'Profile' }"
            >
              <div class="dot"></div>
              Profile
            </li>
          </ul>
        </ul>

        <div class="user">
          <img
            class="profile"
            id="logo"
            alt="gamatrain"
            :src="$auth.user.avatar"
          />

          <h3 class="d-flex justify-center align-center mt-4 ml-3">
            {{ $auth.user.first_name }} {{ $auth.user.last_name }}
          </h3>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="content">
        <div v-if="activeTab === 'order'">
          <AdminTable />
        </div>
        <div v-if="activeTab === 'My Stock'">
          <h1>My Stock</h1>
          <p>Manage user accounts here.</p>
        </div>
        <div v-if="activeTab === 'Analysis'">
          <h1>Analysis</h1>
          <p>Adjust admin Analysis here.</p>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import AdminTable from "@/components/AdminTable.vue";
export default {
  name: "AdminPanel",
  components: { AdminTable },
  data() {
    return {
      activeTab: "order",
    };
  },
  computed: {
    userName() {
      if (this.$auth.user.first_name) return this.$auth.user.first_name;
      else if (this.$auth.user.last_name) return this.$auth.user.last_name;
      else return "No name";
    },
  },
};
</script>

<style scoped>
.admin-container {
  display: flex;
  flex-direction: column;
  max-height: 100vh !important;
  background: #1d2939;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
.admin-container h2 {
  margin: 12px 28px;
  width: 106px;
  height: 32px;
  color: white;
  font-weight: 500;
}
.sidebar {
  width: 304px;
  background: #1d2939;
  color: white;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  height: 93vh;
}

.sidebar h3 {
  text-align: left;
  margin-bottom: 20px;
}
.dot {
  border-radius: 50%;
  width: 6px;
  height: 6px;
  background-color: #fff;
  margin-right: 15px;
}
.sidebar ul {
  /* flex-grow: 1; */
  min-height: 250px;
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
.main {
  display: flex;
}
.content {
  flex: 1;
  padding: 20px;
  margin-top: 20px;
  background: #f4f4f4;
}
.p {
  font-size: 14px;
  color: #98a2b3;
}
.user {
  display: flex;
  /* justify-content: center; */
  align-items: center;
  margin-top: auto;
}
.profile {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
</style>
