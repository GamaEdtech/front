<template>
  <div class="wallet-page">
    <div class="bg-primary-gray-100 rounded-xl px-7 py-6">
      <!-- Balance Card and Chart Section -->
      <v-row>
        <v-col cols="12" sm="6" md="6">
          <div class="balance-card rounded-lg h-full" dark>
            <div class="balance-card-content pb-5 pt-12">
              <div
                class="balance-title d-flex align-center mb-4 cursor-pointer"
              >
                <span class="text-xl-h4 gray--text">Main balance</span>
                <v-icon small class="ml-2 gray--text">mdi-eye</v-icon>
              </div>

              <div class="balance-amount d-flex align-center">
                <span class="currency mr-2 mt-3 yellow--text-darken">$GET</span>
                <span class="amount text-white">14,235</span>
                <span class="decimal text-white">.34</span>
                <v-img
                  class="mr-4 mb-4"
                  :src="require('@/assets/images/wallet/wallet-amount.png')"
                ></v-img>
              </div>

              <div class="balance-actions d-flex justify-space-between mt-10">
                <div class="action-btn text-center">
                  <v-icon small class="gray--text">mdi-tray-arrow-up</v-icon>
                  <div class="text-lg-h6 yellow--text-darken mt-2">Top up</div>
                </div>
                <div class="action-btn text-center ml-8">
                  <v-icon small class="gray--text">mdi-tray-arrow-down</v-icon>
                  <div class="text-lg-h6 yellow--text-darken mt-2">
                    Withdraw
                  </div>
                </div>
                <div class="action-btn text-center ml-8">
                  <v-icon small class="gray--text">mdi-swap-horizontal</v-icon>
                  <div class="text-lg-h6 yellow--text-darken mt-2">
                    Transfer
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-col>

        <v-col cols="12" sm="6" md="6">
          <transaction-chart class="transaction-chart"></transaction-chart>
        </v-col>
      </v-row>
    </div>

    <!-- Transaction History Section -->
    <div class="mt-8" elevation="0">
      <div class="text-h5 primary-gray-700 font-weight-bold pb-2">
        Transaction History
      </div>

      <div class="transaction-tabs mb-4">
        <v-tabs
          v-model="activeTab"
          background-color="transparent"
          color="primary"
        >
          <v-tab class="font-weight-regular">All</v-tab>
          <v-tab class="font-weight-regular">Earned</v-tab>
          <v-tab class="font-weight-regular">Spent</v-tab>
        </v-tabs>
      </div>

      <v-data-table
        :headers="headers"
        :items="transactions"
        :items-per-page="5"
        hide-default-footer
        class="elevation-0 transaction-table"
      >
        <template v-slot:item.type="{ item }">
          {{ item.type }}
        </template>

        <template v-slot:item.amount="{ item }">
          <div class="d-flex align-center">
            <span class="font-weight-bold">{{
              item.amount.toLocaleString()
            }}</span>
            <span class="ml-1 caption grey--text">$GET</span>
          </div>
        </template>

        <template v-slot:item.state="{ item }">
          <div class="state-chip d-flex align-center">
            <div :class="`state-icon-bg ${getStateColorClass(item.state)}`">
              <v-icon small>{{ getStateIcon(item.state) }}</v-icon>
            </div>
            <span :class="`ml-2 ${getStateTextColorClass(item.state)}`">{{
              item.state
            }}</span>
          </div>
        </template>

        <template v-slot:item.date="{ item }">
          <div class="d-flex align-center">
            <v-icon small class="mr-1 primary-gray-300"
              >mdi-clock-outline</v-icon
            >
            <span class="primary-gray-500">{{ item.date }}</span>
          </div>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import TransactionChart from "~/components/user/wallet/TransactionChart.vue";

export default defineComponent({
  layout: "dashboard_layout",
  name: "Wallet",
  components: {
    TransactionChart,
  },
  data() {
    return {
      activeTab: 0,
      headers: [
        {
          text: "Type",
          value: "type",
          sortable: true,
          align: "start",
          class: "font-weight-medium",
        },
        {
          text: "Amount",
          value: "amount",
          sortable: true,
          align: "start",
          class: "font-weight-medium",
        },
        {
          text: "State",
          value: "state",
          sortable: true,
          align: "start",
          class: "font-weight-medium",
        },
        {
          text: "Date",
          value: "date",
          sortable: true,
          align: "start",
          class: "font-weight-medium",
        },
      ],
      transactions: [
        {
          type: "Uploaded School Photo",
          amount: 6000000,
          state: "Pending",
          date: "3/15/2024 13:15",
        },
        {
          type: "Created a Quiz",
          amount: 6000000,
          state: "Spent",
          date: "3/15/2024 13:15",
        },
        {
          type: "Commented on School",
          amount: 6000000,
          state: "Earned",
          date: "3/15/2024 13:15",
        },
        {
          type: "Created a Quiz",
          amount: 6000000,
          state: "Spent",
          date: "3/15/2024 13:15",
        },
        {
          type: "Commented on School",
          amount: 6000000,
          state: "Earned",
          date: "3/15/2024 13:15",
        },
        {
          type: "Commented on School",
          amount: 6000000,
          state: "Earned",
          date: "3/15/2024 13:15",
        },
      ],
    };
  },
  methods: {
    getStateColor(state) {
      switch (state) {
        case "Pending":
          return "amber";
        case "Spent":
          return "red";
        case "Earned":
          return "green";
        default:
          return "grey";
      }
    },
    getStateColorClass(state) {
      switch (state) {
        case "Pending":
          return "pending-bg";
        case "Spent":
          return "spent-bg";
        case "Earned":
          return "earned-bg";
        default:
          return "grey-bg";
      }
    },
    getStateTextColorClass(state) {
      switch (state) {
        case "Pending":
          return "amber--text";
        case "Spent":
          return "red--text";
        case "Earned":
          return "green--text";
        default:
          return "grey--text";
      }
    },
    getStateIcon(state) {
      switch (state) {
        case "Pending":
          return "mdi-dots-horizontal";
        case "Spent":
          return "mdi-arrow-down";
        case "Earned":
          return "mdi-arrow-up";
        default:
          return "mdi-help-circle-outline";
      }
    },
  },
});
</script>

<style scoped>
.wallet-page {
  padding: 16px;
}

.balance-card {
  background: url("~@/assets/images/wallet/wallet-background.png"),
    radial-gradient(circle at top left, #2a3040, #1e2631);
  background-size: cover;
  background-position: center;
  color: white;
  border-radius: 16px !important;
}

.balance-card-content {
  width: 70%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
}

.balance-title {
  font-size: 14px;
}

.balance-amount {
  margin-top: 10px;
}

.currency {
  font-size: 12px;
  font-weight: bold;
}

.amount {
  font-size: 4rem;
  font-weight: bold;
}

.decimal {
  font-size: 18px;
  align-self: flex-start;
  margin-top: 16px;
}

.action-btn {
  cursor: pointer;
}

.transaction-tabs >>> .v-tab {
  min-width: 0;
  text-transform: none;
  font-weight: 400;
  padding: 0 16px;
  font-size: 14px;
}

.transaction-tabs >>> .v-tabs-slider {
  height: 2px;
}

.transaction-table >>> .v-data-table__wrapper {
  overflow-x: auto;
}

.transaction-table >>> thead {
  background-color: #f5f7fa;
  border-radius: 8px;
}

.transaction-table >>> thead th {
  font-size: 14px !important;
  color: #4b5563 !important;
  font-weight: 500 !important;
  padding: 12px 16px !important;
  text-transform: none !important;
  letter-spacing: 0 !important;
}

.transaction-table >>> thead th.sortable .v-data-table-header__icon {
  color: #9ca3af;
  margin-left: 4px;
}

.transaction-table >>> tbody td {
  padding: 16px !important;
  height: auto !important;
}

.transaction-chart {
  /* height: 190px; */
  margin-bottom: 16px;
  position: relative;
  width: 100%;
}

.state-chip {
  display: flex;
  align-items: center;
}

.state-icon-bg {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pending-bg {
  background-color: rgba(255, 193, 7, 0.15);
}

.pending-bg i {
  color: #ffc107 !important;
}

.spent-bg {
  background-color: rgba(255, 82, 82, 0.15);
}

.spent-bg i {
  color: #ff5252 !important;
}

.earned-bg {
  background-color: rgba(76, 175, 80, 0.15);
}

.earned-bg i {
  color: #4caf50 !important;
}

.header-cell {
  display: flex;
  align-items: center;
  font-weight: 500;
  color: #4b5563;
}

.sort-icon {
  color: #9ca3af;
  margin-left: 4px;
}
</style>
