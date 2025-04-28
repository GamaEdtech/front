<template>
  <div class="wallet-page">
    <div class="bg-primary-gray-100 rounded-xl px-7 py-6">
      <!-- Balance Card and Chart Section -->
      <v-row>
        <v-col cols="12" sm="6" md="6">
          <balance-card></balance-card>
        </v-col>

        <v-col cols="12" sm="6" md="6">
          <transaction-chart class="transaction-chart"></transaction-chart>
        </v-col>
      </v-row>
    </div>

    <!-- Transaction History Section -->
    <transaction-history></transaction-history>
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
</style>
