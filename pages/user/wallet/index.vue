<template>
  <div class="wallet-page">
    <div class="bg-primary-gray-100 rounded-xl px-7 py-6">
      <!-- Balance Card and Chart Section -->
      <v-row>
        <v-col cols="12" sm="6" md="6">
          <balance-card></balance-card>
        </v-col>

        <v-col cols="12" sm="6" md="6" class="d-none d-sm-block">
          <transaction-chart class="transaction-chart"></transaction-chart>
        </v-col>
      </v-row>
    </div>

    <!-- Mobile Chart (Initially Hidden) -->
    <v-expand-transition>
      <div
        v-if="showMobileChart"
        class="d-block d-sm-none mt-6 mobile-chart-container"
      >
        <div class="pa-4 rounded-lg bg-primary-gray-100">
          <transaction-chart class="transaction-chart"></transaction-chart>
        </div>
      </div>
    </v-expand-transition>

    <!-- Transaction History Section -->
    <transaction-history
      @toggle-chart="toggleMobileChart"
      :is-chart-visible="showMobileChart"
    ></transaction-history>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import TransactionChart from "~/components/user/wallet/TransactionChart.vue";
import BalanceCard from "~/components/user/wallet/BalanceCard.vue";
import TransactionHistory from "~/components/user/wallet/TransactionHistory.vue";

export default defineComponent({
  layout: "dashboard_layout",
  name: "Wallet",
  components: {
    TransactionChart,
    BalanceCard,
    TransactionHistory,
  },
  data() {
    return {
      showMobileChart: false,
    };
  },
  methods: {
    toggleMobileChart() {
      this.showMobileChart = !this.showMobileChart;
    },
  },
});
</script>

<style scoped>
.wallet-page {
  padding: 16px;
}

.transaction-chart {
  margin-bottom: 16px;
  position: relative;
  width: 100%;
}

.mobile-chart-container {
  margin-bottom: 16px;
}

.mobile-chart-container .transaction-chart {
  height: 250px;
}
</style>
