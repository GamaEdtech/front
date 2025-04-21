<template>
  <v-list density="compact">
    <div v-for="(item, index) in items" :key="item.title">
      <v-list-item v-show="!item.subMenuList" link :to="item.link">
        <template v-slot:prepend>
          <v-icon>{{ item.icon }}</v-icon>
        </template>
        <v-list-item-title v-text="item.title"></v-list-item-title>
      </v-list-item>
      <v-list-group
        v-show="item.subMenuList"
        active-class="menu_group_active"
        :key="item.title"
        :value="openGroups[index]"
        @click="toggleGroup(index)"
      >
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props">
            <template v-slot:prepend>
              <v-icon>{{ item.icon }}</v-icon>
            </template>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item>
        </template>

        <v-list-item
          class="pl-7"
          active-class="menu_active"
          v-for="(subMenuItem, side) in item.subMenuList"
          :to="subMenuItem.link"
          :disabled="subMenuItem.status"
          :key="side.title"
        >
          <v-list-item-title v-text="subMenuItem.title"></v-list-item-title>
        </v-list-item>
      </v-list-group>
    </div>
  </v-list>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useNuxtApp } from "#app";

const { $auth } = useNuxtApp();

const openGroups = ref({});

const toggleGroup = (index) => {
  openGroups.value[index] = !openGroups.value[index];
};

const items = ref([
  {
    title: "Contents",
    icon: "mdi-plus-circle-outline",
    machine_name: "add_content",
    subMenuList: [
      {
        title: "Paper",
        link: "/user/paper",
        icon: "icong-test",
        icon_type: "custom",
        status: $auth.user?.group_id == "5" ? false : true,
      },
      {
        title: "Multimedia",
        link: "/user/multimedia",
        icon: "icong-test",
        icon_type: "custom",
        status: $auth.user?.group_id == "5" ? false : true,
      },
      {
        title: "Q & A",
        link: "/user/question",
        icon: "icong-test",
        icon_type: "custom",
      },
    ],
  },
  {
    title: "Online Exam",
    icon: "mdi-laptop",
    subMenuList: [
      {
        title: "Results",
        link: "/exam/results",
        icon: "icong-test",
        icon_type: "custom",
      },
      {
        title: "Exam maker",
        link: "/user/exam",
        icon: "icong-test",
        icon_type: "custom",
      },
    ],
  },
  {
    title: "Financial",
    icon: "mdi-credit-card-outline",
    subMenuList: [
      { title: "Top Up Wallet", link: "/user/charge-wallet" },
      { title: "Payments", link: "/user/payments" },
      { title: "Sell Report", link: "/user/sell-report" },
      { title: "Withdrawal", link: "/user/withdrawal" },
    ],
  },
  { title: "Messages", icon: "mdi-email-outline", link: "/user/ticket" },
  {
    title: "Profile",
    icon: "mdi-account-outline",
    link: "",
    subMenuList: [
      { title: "Edit Profile", link: "/user/profile" },
      { title: "Confirm Identity", link: "/user/identity-confirmation" },
      { title: "Change Password", link: "/user/edit-pass" },
      { title: "Settings", link: "/user/setting" },
    ],
  },
]);
</script>

<style scoped></style>
