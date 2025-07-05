<template>
  <section class="tokenomics-section">
    <v-container class="tokenomics-container">
      <h4 class="tokenomics-title">Tokenomics</h4>
      <div class="tokenomics-main">
        <div class="tokenomics-chart-card">
          <img
            src="/images/token/TokenomicsPieChart.svg"
            alt="Tokenomics Section"
            class="tokenomics-svg"
          />
        </div>
        <div class="tokenomics-breakdowns">
          <div
            v-for="item in breakdowns"
            :key="item.key"
            class="tokenomics-breakdown-card"
            :class="item.key"
          >
            <div :class="['tokenomics-dot', item.dotClass]"></div>
            <img :src="item.icon" :alt="item.title" class="tokenomics-icon" />
            <div class="tokenomics-info">
              <div class="tokenomics-title">{{ item.title }}</div>
              <div class="tokenomics-amount">{{ item.amount }}</div>
              <div class="tokenomics-detail">{{ item.detail }}</div>
            </div>
            <div :class="['tokenomics-percent', item.percentClass]">{{ item.percent }}</div>
          </div>
        </div>
      </div>
    </v-container>
  </section>
</template>

<script setup>
const breakdowns = [
  {
    key: 'governance',
    dotClass: 'governance-dot',
    icon: '/images/token/Governance.svg',
    title: 'Governance',
    amount: '7B $GET',
    detail: 'Locked for 10 years',
    percent: '70%',
    percentClass: 'governance-percent'
  },
  {
    key: 'team',
    dotClass: 'team-dot',
    icon: '/images/token/Team.svg',
    title: 'Team & Development',
    amount: '2B $GET',
    detail: 'Locked for 5 years',
    percent: '20%',
    percentClass: 'team-percent'
  },
  {
    key: 'liquidity',
    dotClass: 'liquidity-dot',
    icon: '/images/token/Liquidity.svg',
    title: 'Liquidity Pool',
    amount: '1B $GET',
    detail: 'Bought back to drive value',
    percent: '10%',
    percentClass: 'liquidity-percent'
  }
]
</script>

<style scoped>
.tokenomics-section {
  padding: 6rem 0;
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.tokenomics-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 14px;
}

.tokenomics-title {
  text-align: center;
  color: #24292f;
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 32px;
}

.tokenomics-main {
  display: flex;
  gap: 3rem;
  align-items: flex-start;
  justify-content: center;
}

.tokenomics-chart-card {
  flex: 0 0 500px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tokenomics-svg {
  width: 100%;
  height: auto;
  object-fit: contain;
}

.tokenomics-breakdowns {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-width: 400px;
}

  .tokenomics-breakdown-card {
    display: flex;
    align-items: center;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(44, 62, 80, 0.10);
    padding: 1.5rem 2rem;
    min-height: 120px;
    position: relative;
  }

.tokenomics-dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 1.5rem;
  flex-shrink: 0;
}

.governance-dot { background: #3578e5; }
.team-dot { background: #7ecb20; }
.liquidity-dot { background: #4cb2ba; }

.tokenomics-icon {
  width: 54px;
  height: 54px;
  margin-right: 1.5rem;
  flex-shrink: 0;
}

.tokenomics-info {
  flex: 1;
}

.tokenomics-info .tokenomics-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-align: left;
  color: #24292f;
}

.tokenomics-amount {
  font-size: 1.25rem;
  color: #6c757d;
  margin-bottom: 0.25rem;
}

.tokenomics-detail {
  font-size: 1.1rem;
  color: #6c757d;
}

.tokenomics-percent {
  font-size: 3rem;
  font-weight: 700;
  margin-left: 1.5rem;
  align-self: center;
}

.governance-percent { color: #3578e5; }
.team-percent { color: #7ecb20; }
.liquidity-percent { color: #4cb2ba; }

@media (max-width: 960px) {
  .tokenomics-main {
    flex-direction: column;
    align-items: center;
  }
  
  .tokenomics-chart-card {
    margin-bottom: 2rem;
    flex: 0 0 auto;
  }

  .tokenomics-breakdowns {
    width: 100%;
  }
}

@media (max-width: 600px) {
  .tokenomics-section {
    padding: 3rem 1rem;
    margin: 0;
  }

  .tokenomics-title {
    font-size: 24px;
    margin-bottom: 24px;
  }

  .tokenomics-breakdown-card {
    padding: 1.25rem;
  }

  .tokenomics-dot {
    width: 24px;
    height: 24px;
    margin-right: 1rem;
  }

  .tokenomics-icon {
    width: 40px;
    height: 40px;
    margin-right: 1rem;
  }

  .tokenomics-info .tokenomics-title {
    font-size: 1.1rem;
  }

  .tokenomics-amount,
  .tokenomics-detail {
    font-size: 0.9rem;
  }

  .tokenomics-percent {
    font-size: 2rem;
    margin-left: 1rem;
  }
}
</style>