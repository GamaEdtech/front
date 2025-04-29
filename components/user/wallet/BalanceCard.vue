<template>
  <div class="balance-card rounded-lg h-full" dark>
    <div class="balance-card-content pb-5 pt-6">
      <div
        class="balance-title d-flex align-center mb-4 cursor-pointer"
        @click="toggleBalanceVisibility"
      >
        <span class="text-xl-h4 gray--text">Main balance</span>
        <v-icon small class="ml-2 gray--text">{{
          showBalance ? "mdi-eye" : "mdi-eye-off"
        }}</v-icon>
      </div>

      <div v-if="loading" class="balance-amount d-flex align-center">
        <v-skeleton-loader
          type="text"
          width="250"
          height="60"
          class="mt-2"
        ></v-skeleton-loader>
      </div>

      <div v-else-if="!showBalance" class="balance-amount d-flex align-center">
        <div class="hidden-balance">
          <span v-for="n in 4" :key="n" class="dot mx-1"></span>
        </div>
      </div>

      <div v-else class="balance-amount d-flex align-center mb-8">
        <span class="currency mr-2 mt-3 yellow--text-darken">$GET</span>
        <span class="amount text-white">{{ Math.floor(balance) }}</span>
        <span class="decimal text-white">.{{ getDecimal(balance) }}</span>
        <v-img
          class="mr-4 mb-4"
          :src="require('@/assets/images/wallet/wallet-amount.png')"
        ></v-img>
      </div>

      <div class="balance-actions d-flex justify-space-between">
        <div class="action-btn text-center">
          <v-icon small class="gray--text">mdi-tray-arrow-up</v-icon>
          <div class="text-lg-h6 yellow--text-darken mt-2">Top up</div>
        </div>
        <div class="action-btn text-center ml-8">
          <v-icon small class="gray--text">mdi-tray-arrow-down</v-icon>
          <div class="text-lg-h6 yellow--text-darken mt-2">Withdraw</div>
        </div>
        <div class="action-btn text-center ml-8">
          <v-icon small class="gray--text">mdi-swap-horizontal</v-icon>
          <div class="text-lg-h6 yellow--text-darken mt-2">Transfer</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "BalanceCard",
  data() {
    return {
      balance: 0,
      loading: true,
      showBalance: true,
      token: "",
    };
  },
  created() {
    // Safely get token during component creation
    this.getToken();
    this.fetchBalance();
  },
  methods: {
    getToken() {
      // Check if we're in browser environment
      if (process.client) {
        this.token = localStorage.getItem("v2_token") || "";
      }
    },
    fetchBalance() {
      this.loading = true;
      this.$axios
        .$get("/api/v2/transactions/balance", {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        })
        .then((response) => {
          if (response.succeeded) {
            this.balance = response.data;
          }
        })
        .catch((err) => {
          if (err.response && err.response.status == 403) {
            this.$auth.logout();
          }
          console.error("Error fetching balance:", err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getDecimal(num) {
      return Math.floor((num % 1) * 100)
        .toString()
        .padStart(2, "0");
    },
    toggleBalanceVisibility() {
      this.showBalance = !this.showBalance;
    },
  },
});
</script>

<style scoped>
.balance-card {
  background: url("~@/assets/images/wallet/wallet-background.png"),
    radial-gradient(circle at top left, #2a3040, #1e2631);
  background-size: cover;
  background-position: center;
  color: white;
  border-radius: 16px !important;
  max-height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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

/* Hidden Balance Style */
.hidden-balance {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 64px;
}

.hidden-balance .dot {
  width: 10px;
  height: 10px;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
}

/* Skeleton Loading Styles */
::v-deep .v-skeleton-loader__text {
  background: rgba(255, 255, 255, 0.1) !important;
  border-radius: 8px;
}
</style>
