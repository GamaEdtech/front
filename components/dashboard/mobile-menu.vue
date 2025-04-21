<template>
  <!--Dashboard mobile menu-->
  <v-row class="d-block d-md-none mobile_dashboard_menu">
    <v-col cols="12" class="px-0 pb-0 mb-0">
      <v-tabs
        background-color="#fff"
        icons-and-text
        centered
        v-model="active_tab"
        active-class="tab_actived"
        class="fixed-tabs-bar"
      >
        <v-tab
          @click="openLink(item)"
          v-for="(item, index) in items"
          :key="index"
        >
          <span>{{ item.title }}</span>
          <v-btn icon>
            <v-icon>
              {{ item.icon }}
            </v-icon>
          </v-btn>
        </v-tab>
      </v-tabs>
    </v-col>

    <v-bottom-sheet v-model="sheet">
      <v-list>
        <v-list-item
          :to="sub_item.link"
          v-for="sub_item in subList"
          :key="sub_item.title"
          @click="sheet = false"
        >
          <v-list-item-icon>
            <v-icon>{{ sub_item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title class="text-h6">{{
            sub_item.title
          }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-bottom-sheet>
  </v-row>
  <!--End dashboard mobile menu-->
</template>

<script>
export default {
  name: "dashboard-mobile-menu",
  data() {
    return {
      active_tab: 0,
      items: [
        {
          title: "Contents",
          icon: "mdi-plus-circle-outline",
          link: "",
          machine_name: "add_content",
          subMenuList: [
            {
              title: "Paper",
              link: "/user/paper",
              icon: "icong-test",
              icon_type: "custom",
              status: this.$auth.user?.group_id == "5" ? false : true,
            },
            {
              title: "Multimedia",
              link: "/user/multimedia",
              icon: "icong-learnfiles",
              icon_type: "custom",
              status: this.$auth.user?.group_id == "5" ? false : true,
            },
            {
              title: "Q & A",
              link: "/user/question",
              icon: "icong-qa",
              icon_type: "custom",
            },
          ],
        },
        {
          title: "Online Exam",
          icon: "mdi-laptop",
          link: "/test-maker",
          subMenuList: [
            {
              title: "Results",
              link: "/exam/results",
              icon: "mdi-chart-timeline",
              icon_type: "custom",
            },
            {
              title: "Exam maker",
              link: "/user/exam",
              icon: "icong-azmoon",
              icon_type: "custom",
            },
          ],
        },
        {
          title: "Financial",
          icon: "mdi-credit-card-outline",
          subMenuList: [
            {
              title: "Top Up Wallet",
              icon: "mdi-credit-card-plus-outline",
              link: "/user/charge-wallet",
            },
            { title: "Payments", icon: "mdi-link", link: "/user/payments" },
            {
              title: "Sell Report",
              icon: "mdi-chart-line",
              link: "/user/sell-report",
            },
            { title: "Withdrawal", icon: "mdi-cash", link: "/user/withdrawal" },
          ],
        },
        { title: "Messages", icon: "mdi-email-outline", link: "/user/ticket" },
        {
          title: "Profile",
          icon: "mdi-account-outline",
          link: "",
          subMenuList: [
            {
              title: "Edit Profile",
              link: "/user/profile",
              icon: "mdi-account-outline",
            },
            {
              title: "Confirm Identity",
              link: "/user/identity-confirmation",
              icon: " mdi-card-account-details",
            },
            {
              title: "Change Password",
              link: "/user/edit-pass",
              icon: "mdi-key",
            },
            {
              title: "Settings",
              link: "/user/setting",
              icon: "mdi-account-cog-outline",
            },
          ],
        },
        // {title: 'Notification', icon: 'mdi-bell-outline', link: '/'},
      ],
      sheet: false,
      subList: [],
    };
  },
  methods: {
    openLink(item) {
      if (!item.subMenuList) this.$router.push({ path: item.link });
      else {
        this.subList = item.subMenuList;
        this.sheet = true;
      }
    },
  },
};
</script>

<style></style>
