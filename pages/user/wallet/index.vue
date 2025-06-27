<template>
  <div class="wallet-page">
    <div class="wallet-page-container">
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
    <div class="px-4">
      <!-- Mobile Chart (Initially Hidden) -->
      <v-expand-transition>
        <div
          v-if="showMobileChart"
          class="d-block d-sm-none mt-6 mobile-chart-container"
        >
          <div class="pa-4 rounded-lg bg-primary-gray-100">
            <transaction-chart
              class="transaction-chart h-full"
            ></transaction-chart>
          </div>
        </div>
      </v-expand-transition>

      <!-- Transaction History Section -->
      <transaction-history
        @toggle-chart="toggleMobileChart"
        :is-chart-visible="showMobileChart"
      ></transaction-history>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import TransactionChart from '~/components/user/wallet/TransactionChart.vue';
import BalanceCard from '~/components/user/wallet/BalanceCard.vue';
import TransactionHistory from '~/components/user/wallet/TransactionHistory.vue';

// Page metadata
definePageMeta({
  layout: 'dashboard-layout'
});

// Define reactive state
const showMobileChart = ref(false);

// Methods
const toggleMobileChart = () => {
  showMobileChart.value = !showMobileChart.value;
};

</script>

<style scoped>
.wallet-page-container {
  background: #f2f4f7 !important;
  padding: 26px 26px;
}
@media only screen and (min-width: 600px) {
  .wallet-page {
    padding: 16px;
  }
  .wallet-page-container {
    background: #f2f4f7 !important;
    border-radius: 16px;
    padding: 20px 20px;
  }
}

.transaction-chart {
  margin-bottom: 16px;
  position: relative;
  width: 100%;
  height: max-content;
}

.mobile-chart-container .transaction-chart {
  height: 250px;
}
</style>
