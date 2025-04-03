<template>
  <div>
    <admin-table />
  </div>
</template>

<script>
import AdminTable from "~/components/admin/AdminTable.vue";
// import MyStock from "@/components/MyStock.vue";
// import AnalysisReport from "@/components/AnalysisReport.vue";

export default {
  layout: "admin",
  components: { AdminTable },
  data() {
    return {};
  },
};
</script>
