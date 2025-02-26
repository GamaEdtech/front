<template>
  <AdminLayout @tab-selected="changeTab">
    <component :is="currentComponent" />
  </AdminLayout>
</template>

<script>
import AdminLayout from "@/layouts/panelAdmin.vue";
import AdminTable from "@/components/AdminTable.vue";
// import MyStock from "@/components/MyStock.vue";
// import AnalysisReport from "@/components/AnalysisReport.vue";

export default {
  components: { AdminLayout, AdminTable,  },
  data() {
    return {
      currentTab: "Order",
    };
  },
  computed: {
    currentComponent() {
      switch (this.currentTab) {
        case "Order":
          return "AdminTable";
        case "My Stock":
          return "MyStock";
        case "Analysis":
          return "AnalysisReport";
        default:
          return "AdminTable";
      }
    },
  },
  methods: {
    changeTab(tab) {
      this.currentTab = tab;
    },
  },
};
</script>
