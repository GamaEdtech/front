<template>
  <section class="how-buy-section py-8">
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="10" lg="10">
          <div class="text-center mb-12">
            <img
              src="/images/token/BuyImage.svg"
              alt="Buy Illustration"
              class="how-buy-illustration"
              contain
            />
          </div>
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
                <div class="step-title">{{ index + 1 }}. {{ step.title }}</div>
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
    icon: '/images/token/wallet-6.svg',
    items: [
      { link: 'https://phantom.com' },
      { text: 'Create a wallet and receive your secret recovery phrase', isBold: true },
      { text: 'Write your phrase down somewhere safe' },
      { text: 'Never share this phrase with anyone ❗', isWarning: true }
    ]
  },
  {
    title: 'Connect to a Decentralized Exchange (DEX)',
    icon: '/images/token/money-exchange.svg',
    items: [
      { link: 'https://jup.ag', extraText: ' and create an account' },
      { text: 'Click Connect Wallet and choose Phantom', isBold: true }
    ]
  },
  {
    title: 'Find the $GET Token',
    icon: '/images/token/search1.svg',
    items: [
      { text: 'Search for $GET and select it' }
    ]
  },
  {
    title: 'Choose the Amount & Currency',
    icon: '/images/token/calculator2.svg',
    items: [
      { text: 'Select how much $GET you want to buy' },
      { text: 'Choose which currency to pay with (USDC, USDT, etc.)' },
      { text: 'Review the exchange rate and fees' }
    ]
  },
  {
    title: 'Confirm Transaction',
    icon: '/images/token/checked.svg',
    items: [
      { text: 'Double-check all transaction details' },
      { text: 'Ensure you have enough funds to cover the purchase and fees' },
      { text: 'Approve the transaction in your wallet' }
    ]
  },
  {
    title: 'Verify & Store',
    icon: '/images/token/verify.svg',
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

.how-buy-illustration {
  max-width: 100%;
  height: auto;
  width: 400px;
  margin: 0 auto;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.1));
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
  gap: 2rem;
  padding: 2rem;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.step-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1);
}

.step-icon-wrapper {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 1rem;
  background: #333333;
  border-radius: 12px;
  min-width: 90px;
  height: 90px;
}

.how-buy-icon {
  width: 50px;
  height: 50px;
  object-fit: contain;
  filter: brightness(0.2);
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 20px;
  font-weight: 700;
  color: #24292f;
  margin-bottom: 1rem;
}

.step-list {
  margin: 0;
  padding-left: 1.5rem;
  list-style-type: none;
}

.step-list li {
  position: relative;
  padding-left: 1rem;
  margin-bottom: 0.75rem;
  font-size: 16px;
  line-height: 1.6;
  color: #4a5568;
}

.step-list li::before {
  content: "•";
  position: absolute;
  left: -1rem;
  color: #24aa94;
}

.how-buy-link {
  color: #0a7cff;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.how-buy-link:hover {
  color: #0056b3;
  text-decoration: underline;
}

.warning-text {
  color: #e53e3e !important;
  font-weight: 600;
}

.font-weight-bold {
  font-weight: 600;
  color: #24292f;
}

@media (max-width: 960px) {
  .how-buy-section {
    padding: 3rem 1rem;
  }

  .how-buy-illustration {
    width: 300px;
    margin-bottom: 2rem;
  }

  .how-buy-title {
    font-size: 28px;
    margin-bottom: 3rem;
  }

  .steps-container {
    gap: 2rem;
  }

  .step-item {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 1.5rem;
    gap: 1.5rem;
  }

  .step-icon-wrapper {
    min-width: 70px;
    height: 70px;
    padding: 0.75rem;
  }

  .how-buy-icon {
    width: 40px;
    height: 40px;
  }

  .step-title {
    font-size: 18px;
  }

  .step-list {
    text-align: left;
    padding-left: 1rem;
  }

  .step-list li {
    font-size: 15px;
    padding-left: 0.75rem;
  }
}

@media (max-width: 600px) {
  .how-buy-section {
    padding: 2rem 1rem;
  }

  .how-buy-illustration {
    width: 250px;
  }

  .how-buy-title {
    font-size: 24px;
    margin-bottom: 2rem;
  }

  .step-item {
    padding: 1.25rem;
    gap: 1.25rem;
  }

  .step-icon-wrapper {
    min-width: 60px;
    height: 60px;
  }

  .how-buy-icon {
    width: 32px;
    height: 32px;
  }

  .step-title {
    font-size: 16px;
  }

  .step-list li {
    font-size: 14px;
    line-height: 1.5;
    margin-bottom: 0.5rem;
  }
}
</style>
