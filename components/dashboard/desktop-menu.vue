<template>
  <div>
    <!--Desktop dashboard menu-->
    <v-navigation-drawer permanent>
      <v-list-item class="px-2" to="/user">
        <v-list-item-avatar>
          <v-img class="mr-2" src="@/assets/images/dashboard-icon.png"></v-img>
        </v-list-item-avatar>

        <v-list-item-title class="text-h5">Dashboard</v-list-item-title>
      </v-list-item>

      <v-divider></v-divider>
      <navigation />
    </v-navigation-drawer>
    <!--End desktop dashboard menu-->
  </div>
</template>

<script>
import Navigation from "@/components/dashboard/navigation";

export default {
  name: "dashboard-desktop-menu",
  components: { Navigation },
};
</script>

<style scoped></style>
