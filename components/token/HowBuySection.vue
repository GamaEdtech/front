<template>
  <section class="how-buy-section py-8">
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="10" lg="10">
          <!-- New illustration layout: tokens + man -->
          <div class="how-buy-hero mb-12">
            <!-- Token icons and names -->
            <div class="how-buy-tokens">
              <div class="token-row">
                <div class="token-icon-col">
                  <img src="/images/token/Buy/token-get2.png" alt="GET" class="token-icon" />
                </div>
                <span class="how-buy-token-label">GET</span>
              </div>
              <div class="token-row">
                <div class="token-icon-col">
                  <img src="/images/token/Buy/token-usdc.png" alt="USDC" class="token-icon" />
                </div>
                <span class="how-buy-token-label">USDC</span>
              </div>
              <div class="token-row">
                <div class="token-icon-col">
                  <img src="/images/token/Buy/token-usdt.png" alt="USDT" class="token-icon" />
                </div>
                <span class="how-buy-token-label">USDT</span>
              </div>
              <div class="token-row">
                <div class="token-icon-col">
                  <img src="/images/token/Buy/token-wbtc.png" alt="WBTC" class="token-icon" />
                </div>
                <span class="how-buy-token-label">WBTC</span>
              </div>
            </div>
            <!-- Man illustration -->
            <div class="how-buy-man d-flex justify-center align-center">
              <img src="/images/token/Buy/guide.svg" alt="Buy Illustration" class="how-buy-illustration" />
            </div>
          </div>
          <!-- End hero -->
          <h2 class="how-buy-title text-center">How To Buy $GET</h2>
          <div class="steps-container">
            <div class="step-item" v-for="(step, index) in steps" :key="index">
              <div class="step-icon-wrapper">
                <img
                  :src="step.icon"
                  :alt="step.title + ' Icon'"
                  class="how-buy-icon"
                  contain
                />
              </div>
              <div class="step-content">
                <div class="step-title">{{ step.title }}</div>
                <ul class="step-list">
                  <li v-for="(item, i) in step.items" :key="i" 
                      :class="{ 'warning-text': item.isWarning }">
                    <template v-if="item.link">
                      Go to
                      <a :href="item.link" target="_blank" rel="noopener" class="how-buy-link">
                        {{ item.link }}
                      </a>
                      <template v-if="item.extraText">{{ item.extraText }}</template>
                    </template>
                    <template v-else>
                      <span :class="{ 'font-weight-bold': item.isBold }">{{ item.text }}</span>
                    </template>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup>
const steps = [
  {
    title: 'Set Up a Wallet',
    icon: '/images/token/Buy/wallet-6.svg',
    items: [
      { link: 'https://phantom.com' },
      { text: 'Create a wallet and receive your secret recovery phrase' },
      { text: 'Write your phrase down somewhere safe' },
      { text: 'Never share this phrase with anyone ❗'}
    ]
  },
  {
    title: 'Connect to a Decentralized Exchange (DEX)',
    icon: '/images/token/Buy/money-exchange.svg',
    items: [
      { link: 'https://jup.ag', extraText: ' and create an account' },
      { text: 'Click Connect Wallet and choose Phantom' }
    ]
  },
  {
    title: 'Find the $GET Token',
    icon: '/images/token/Buy/search1.svg',
    items: [
      { text: 'Search for $GET and select it' }
    ]
  },
  {
    title: 'Choose the Amount & Currency',
    icon: '/images/token/Buy/calculator2.svg',
    items: [
      { text: 'Select how much $GET you want to buy' },
      { text: 'Choose which currency to pay with (USDC, USDT, etc.)' },
      { text: 'Review the exchange rate and fees' }
    ]
  },
  {
    title: 'Confirm Transaction',
    icon: '/images/token/Buy/checked.svg',
    items: [
      { text: 'Double-check all transaction details' },
      { text: 'Ensure you have enough funds to cover the purchase and fees' },
      { text: 'Approve the transaction in your wallet' }
    ]
  },
  {
    title: 'Verify & Store',
    icon: '/images/token/Buy/verify.svg',
    items: [
      { text: 'Wait for transaction confirmation' },
      { text: 'Check your wallet balance for the $GET tokens' },
      { text: 'Store your tokens securely' }
    ]
  }
];
</script>

<style scoped>
.how-buy-section {
  background: #fff;
  padding: 4rem 0;
}

.how-buy-hero {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 80px;
}

.how-buy-tokens {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 40px;
}

.token-row {
  display: flex;
  align-items: center;
  gap: 24px;
}

.token-icon-col {
  width: 64px;
  display: flex;
  justify-content: flex-end;
}

.token-icon {
  width: 56px;
  height: 56px;
  display: block;
}

.how-buy-token-label {
  font-size: 1.5rem;
  font-weight: 700;
  color: #222;
  line-height: 1;
  min-width: 60px;
}


.how-buy-illustration {
  max-width: 400px;
  min-width: 250px;
  width: 100%;
  height: auto;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.1));
}

.how-buy-man {
  flex: 0 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.how-buy-title {
  font-size: 36px;
  font-weight: 800;
  color: #24292f;
  margin-bottom: 4rem;
  letter-spacing: -0.02em;
}

.steps-container {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  max-width: 900px;
  margin: 0 auto;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 2.5rem 2rem;
  background: #eeeff0;
  border-radius: 20px;
  box-shadow: 0 6px 32px rgba(44, 62, 80, 0.10);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
}

.step-item:hover {
  transform: translateY(-2px) scale(1.01);
  box-shadow: 0 12px 36px rgba(44, 62, 80, 0.13);
}

.step-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: #fff;
  border-radius: 16px;
  min-width: 80px;
  height: 80px;
  box-shadow: 0 2px 8px rgba(44,62,80,0.06);
}

.how-buy-icon {
  width: 48px;
  height: 48px;
  object-fit: contain;
  display: block;
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 2.25rem;
  font-weight: 700;
  color: #24292f;
  margin-bottom: 1rem;
}

.step-list {
  margin: 0;
  padding-left: 0;
  list-style-type: none;
}

.step-list li {
  display: flex;
  align-items: center;
  gap: 0.75em;
  margin-bottom: 0.75rem;
  font-size: 16px;
  line-height: 1.6;
  color: #000206;
  padding-left: 0;
}

.step-list li::before {
  content: "•";
  color: #0e0e0f;
  font-size: 1.2em;
  display: inline-block;
  width: 1em;
  text-align: center;
  flex-shrink: 0;
  position: static;
}

.warning-text {
  color: #e53935 !important;
  font-weight: 700;
}

.font-weight-bold {
  font-weight: 700;
}

.how-buy-link {
  color: #3578e5;
  text-decoration: underline;
  font-weight: 500;
}

@media (max-width: 900px) {
  .how-buy-hero {
    flex-direction: row;
    gap: 32px;
  }
  .how-buy-tokens {
    margin-right: 0 !important;
    margin-bottom: 2rem !important;
    align-items: center !important;
  }
  .how-buy-man {
    min-width: 160px;
  }
  .how-buy-illustration {
    max-width: 140px;
    min-width: 100px;
  }
  .token-icon {
    width: 40px;
    height: 40px;
  }
  .how-buy-token-label {
    font-size: 1.1rem;
  }
  .steps-container {
    gap: 2rem;
  }
  .step-item {
    flex-direction: column;
    align-items: flex-start;
    padding: 2rem 1.25rem;
  }
  .step-icon-wrapper {
    width: 80px !important;
    height: 80px !important;
    padding: 0.5rem !important;
    margin: 0 auto 1rem auto !important;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .how-buy-icon {
    width: 48px !important;
    height: 48px !important;
    display: block;
    margin: 0 auto;
  }
  .step-title {
    font-size: 1.05rem;
  }
  .step-list li {
    font-size: 14px;
  }
  .how-buy-card-icon {
    width: 100px;
    height: 100px;
    margin: 0 auto 1.5rem auto;
  }
  .how-buy-card-icon img {
    width: 64px;
    height: 64px;
  }
}

@media (max-width: 600px) {
  .how-buy-hero {
    gap: 16px;
  }
  .how-buy-man {
    flex: 1 1 60%;
    /* Optionally center the image */
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .how-buy-illustration {
    max-width: 80vw;   /* Use most of the viewport width */
    min-width: 0;
    width: 100%;
  }
  .how-buy-tokens {
    flex: 1 1 40%;
  }
}

@media (min-width: 601px) and (max-width: 900px) {
  .step-title {
    font-size: 2rem;
    color: #24292f;
    font-weight: 800;
    text-align: center;
    margin-top: 1rem;
    margin-bottom: 1.5rem;
    width: 100%;
    display: block;
  }
  .step-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .step-badge,
  .step-icon-wrapper {
    margin-left: auto;
    margin-right: auto;
    display: flex;
    justify-content: center;
  }
}

</style>
