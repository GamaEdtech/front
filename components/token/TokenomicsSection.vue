<template>
  <section class="tokenomics-section-dark">
    <div class="tokenomics-container-dark">
      <h2 class="tokenomics-title-dark">Tokenomics</h2>
      <h4 class="tokenomics-subtitle-dark">
        Transparent allocation for sustainable growth
      </h4>
      <div class="tokenomics-main-dark">
        <div class="tokenomics-chart-card-dark">
          <img
            src="/images/token/Tokenomics/TokenomicsPieChart.png"
            alt="Tokenomics Section"
            class="tokenomics-svg-dark"
          />
        </div>
        <div class="tokenomics-breakdowns-dark">
          <div
            v-for="item in breakdowns"
            :key="item.key"
            class="tokenomics-breakdown-card-dark"
            @click="openBreakdown(item)"
            style="cursor: pointer"
          >
            <div :class="['tokenomics-dot-dark', item.dotClass]"></div>
            <img
              :src="item.icon"
              :alt="item.title"
              class="tokenomics-icon-dark"
            />
            <div class="tokenomics-info-dark">
              <div class="tokenomics-title-dark">{{ item.title }}</div>
              <div class="tokenomics-amount-dark">{{ item.amount }}</div>
              <div class="tokenomics-detail-dark">{{ item.detail }}</div>
            </div>
            <div :class="['tokenomics-percent-dark', item.percentClass]">
              {{ item.percent }}
            </div>
          </div>
        </div>
      </div>
      <!-- Modal popup for breakdown details -->
      <v-dialog
        v-model="dialog"
        max-width="600"
        persistent
        class="tokenomics-modal-dialog"
      >
        <v-card class="tokenomics-modal-card-dark">
          <v-card-title class="headline modal-title">{{
            selectedBreakdown?.title
          }}</v-card-title>
          <v-card-text>
            <div class="modal-percent">{{ selectedBreakdown?.percent }}</div>
            <div class="modal-amount">{{ selectedBreakdown?.amount }}</div>
            <div class="modal-popup-text">
              {{ selectedBreakdown?.popupText }}
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn class="modal-close-btn" @click="dialog = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";

const dialog = ref(false);
const selectedBreakdown = ref(null);

function openBreakdown(item) {
  selectedBreakdown.value = item;
  dialog.value = true;
}

const breakdowns = [
  {
    key: "governance",
    dotClass: "governance-dot-dark",
    icon: "/images/token/Tokenomics/Governance.svg",
    title: "Governance",
    detail: "70B $GET - Locked for 10 years.",
    popupText:
      'These tokens are reserved for community governance. "Locked" means that these tokens are not available for a certain amount of time. After unlocking, these tokens will help guide decisions like new features, tokenomics, and more.',
    percent: "70%",
    percentClass: "governance-percent-dark",
  },
  {
    key: "team",
    dotClass: "team-dot-dark",
    icon: "/images/token/Tokenomics/Team.svg",
    title: "Team",
    detail: "20B $GET - Development fund",
    popupText:
      "These tokens are reserved for core contributors. This includes the team, developers, and anyone else contributing to the development and maintenance of the GamaTrain platform.",
    percent: "20%",
    percentClass: "team-percent-dark",
  },
  {
    key: "liquidity",
    dotClass: "liquidity-dot-dark",
    icon: "/images/token/Tokenomics/Liquidity.svg",
    title: "Liquidity",
    detail: "10B $GET - Market liquidity",
    popupText:
      "These tokens are used to make it easier to buy and sell $GET on exchanges. They help provide price stability of the token and avoid big price swings.",
    percent: "10%",
    percentClass: "liquidity-percent-dark",
  },
];
</script>

<style scoped>
.tokenomics-section-dark {
  background: #252626;
  padding: 6rem 0;
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
}
.tokenomics-container-dark {
  max-width: 1200px;
  margin: 0 auto;
  padding: 14px;
}
.tokenomics-title-dark {
  text-align: center;
  color: #fff;
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 32px;
}
.tokenomics-subtitle-dark {
  text-align: center;
  color: #9c9898;
  font-size: 24px;
  font-weight: 400;
  margin-bottom: 42px;
}
.tokenomics-main-dark {
  display: flex;
  gap: 3rem;
  align-items: flex-start;
  justify-content: center;
}
.tokenomics-chart-card-dark {
  flex: 0 0 500px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.tokenomics-svg-dark {
  width: 620px;
  border-radius: 12px;
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
}
.tokenomics-breakdowns-dark {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-width: 400px;
}
.tokenomics-breakdown-card-dark {
  display: flex;
  align-items: center;
  background: #363637;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
  padding: 3.8rem 4rem;
  min-height: 120px;
  position: relative;
  transition:
    box-shadow 0.2s,
    background 0.2s;
}
.tokenomics-breakdown-card-dark:hover {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.28);
  background: #444446;
}
.tokenomics-dot-dark {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 1.5rem;
  flex-shrink: 0;
}
.governance-dot-dark {
  background: #188896;
}
.team-dot-dark {
  background: #df2121;
}
.liquidity-dot-dark {
  background: #95c9d7;
}
.tokenomics-icon-dark {
  width: 54px;
  height: 54px;
  margin-right: 1.5rem;
  flex-shrink: 0;
}
.tokenomics-info-dark {
  flex: 1;
}
.tokenomics-info-dark .tokenomics-title-dark {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-align: left;
  color: #fff;
}
.tokenomics-amount-dark {
  font-size: 1.25rem;
  color: #b0bec5;
  margin-bottom: 0.25rem;
}
.tokenomics-detail-dark {
  font-size: 1.1rem;
  color: #b0bec5;
}
.tokenomics-percent-dark {
  font-size: 3rem;
  font-weight: 700;
  margin-left: 1.5rem;
  align-self: center;
}
.governance-percent-dark {
  color: #188896;
}
.team-percent-dark {
  color: #df2121;
}
.liquidity-percent-dark {
  color: #95c9d7;
}
.tokenomics-modal-card-dark {
  background: #dfe0e3;
  color: #171616;
  padding: 2.5rem 2rem;
  border-radius: 24px;
}

.modal-title {
  font-size: 2.5rem;
  color: #0a0a0a;
  font-weight: 800;
  margin-bottom: 1rem;
}

.modal-percent {
  font-size: 2.8rem;
  font-weight: 700;
  color: #0f871f;
  margin-bottom: 1rem;
}

.modal-amount {
  font-size: 1.5rem;
  color: #b0bec5;
  margin-bottom: 1rem;
}

.modal-popup-text {
  font-size: 2.25rem;
  color: #322e2e;
  line-height: 1.7;
}

.tokenomics-modal-dialog .v-overlay__content {
  align-items: flex-start !important;
  margin-top: 0px;
}

.modal-close-btn {
  color: #2121df !important;
  font-weight: 700;
  font-size: 1.6rem;
  text-transform: none;
  letter-spacing: 0;
}

:deep(.tokenomics-modal-dialog .v-overlay__content) {
  align-items: flex-start !important;
  margin-top: 50px;
}

@media (max-width: 960px) {
  .tokenomics-main-dark {
    flex-direction: column;
    align-items: center;
  }
  .tokenomics-chart-card-dark {
    margin-bottom: 2rem;
    border-radius: 12px;
    flex: 0 0 auto;
  }
  .tokenomics-breakdowns-dark {
    width: 100%;
  }
}
@media (max-width: 600px) {
  .tokenomics-section-dark {
    padding: 3rem 1rem;
    margin: 0;
  }
  .tokenomics-title-dark {
    font-size: 24px;
    margin-bottom: 24px;
  }
  .tokenomics-breakdown-card-dark {
    padding: 1.25rem;
  }
  .tokenomics-dot-dark {
    width: 24px;
    height: 24px;
    margin-right: 1rem;
  }
  .tokenomics-icon-dark {
    width: 40px;
    height: 40px;
    margin-right: 1rem;
  }
  .tokenomics-info-dark .tokenomics-title-dark {
    font-size: 1.1rem;
  }
  .tokenomics-amount-dark,
  .tokenomics-detail-dark {
    font-size: 0.9rem;
  }
  .tokenomics-percent-dark {
    font-size: 2rem;
    margin-left: 1rem;
  }
  .v-btn__content {
    color: #101010;
  }
  .tokenomics-svg-dark {
    width: 200px;
  }
}
</style>
