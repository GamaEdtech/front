<template>
  <div class="balance-card rounded-lg h-full" dark>
    <div class="balance-card-content pb-5 pt-12">
      <div class="balance-title d-flex align-center mb-4 cursor-pointer">
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
</style>
