<template>
  <section class="how-buy-section py-8">
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="10" lg="10">
          <h2 class="how-buy-title text-center mb-8">How To Buy $GET</h2>
          <v-row class="mb-8" no-gutters>
            <v-col
              cols="12"
              md="3"
              class="d-flex justify-center align-self-start"
            >
              <img
                src="/images/token/wallet.png"
                alt="Wallet Icon"
                class="how-buy-icon"
                contain
              />
            </v-col>
            <v-col cols="12" md="9">
              <div class="how-buy-step-title">1. Set Up a Wallet</div>
              <ul class="how-buy-list">
                <li>
                  Go to
                  <a
                    href="https://phantom.com"
                    target="_blank"
                    rel="noopener"
                    class="how-buy-link"
                    >https://phantom.com</a
                  >
                </li>
                <li>
                  Create a wallet and receive
                  <span class="font-weight-bold font-weight-lg-regular"
                    >your secret recovery phrase</span
                  >
                </li>
                <li>Write your phrase down somewhere safe</li>
                <li class="font-weight-bold font-weight-lg-regular">
                  Never share this phrase with anyone
                </li>
              </ul>
            </v-col>
          </v-row>

          <v-row class="mb-8" no-gutters>
            <v-col
              cols="12"
              md="3"
              class="d-flex justify-center align-self-start"
            >
              <img
                src="/images/token/account.png"
                alt="DEX Icon"
                class="how-buy-icon"
                contain
              />
            </v-col>
            <v-col cols="12" md="9">
              <div class="how-buy-step-title">
                2. Connect to a Decentralized Exchange (DEX)
              </div>
              <ul class="how-buy-list">
                <li>
                  Go to
                  <a
                    href="https://jup.ag"
                    target="_blank"
                    rel="noopener"
                    class="how-buy-link"
                    >https://jup.ag</a
                  >
                  and create an account
                </li>
                <li>
                  Click
                  <span class="font-weight-bold font-weight-lg-regular"
                    >Connect Wallet</span
                  >
                  and choose
                  <span class="font-weight-bold font-weight-lg-regular"
                    >Phantom</span
                  >
                </li>
              </ul>
            </v-col>
          </v-row>

          <v-row class="mb-8" no-gutters>
            <v-col
              cols="12"
              md="3"
              class="d-flex justify-center align-self-start"
            >
              <img
                src="/images/token/search.png"
                alt="Search Icon"
                class="how-buy-icon"
                contain
              />
            </v-col>
            <v-col cols="12" md="9">
              <div class="how-buy-step-title">3. Find the $GET Token</div>
              <ul class="how-buy-list">
                <li>Search for $GET and select it</li>
              </ul>
            </v-col>
          </v-row>

          <v-row class="mt-10" align="center" justify="center">
            <v-col
              cols="4"
              md="4"
              class="d-flex flex-column align-start align-md-center"
            >
              <div class="d-flex flex-column align-center mb-4">
                <div class="d-flex align-center mb-4 mb-md-8">
                  <img
                    src="/images/token/token-get.png"
                    alt="GET"
                    class="token-icon mr-5"
                  />
                  <span class="how-buy-token-label">GET</span>
                </div>
                <div class="d-flex align-center mb-4 mb-md-8">
                  <img
                    src="/images/token/token-usdc.png"
                    alt="USDC"
                    class="token-icon mr-5"
                  />
                  <span class="how-buy-token-label">USDC</span>
                </div>
                <div class="d-flex align-center mb-4 mb-md-8">
                  <img
                    src="/images/token/token-usdt.png"
                    alt="USDT"
                    class="token-icon mr-5"
                  />
                  <span class="how-buy-token-label">USDT</span>
                </div>
                <div class="d-flex align-center">
                  <img
                    src="/images/token/token-wbtc.png"
                    alt="WBTC"
                    class="token-icon mr-5"
                  />
                  <span class="how-buy-token-label">WBTC</span>
                </div>
              </div>
            </v-col>
            <v-col cols="4" md="4" class="d-flex justify-start align-start">
              <img
                src="/images/token/guide.png"
                alt="Buy Illustration"
                class="how-buy-illustration"
                contain
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup></script>

<style scoped>
.token-icon {
  width: 30px;
  height: 30px;
}
.how-buy-section {
  background: #fff;
}
.how-buy-title {
  font-size: 24px;
  font-weight: 700;
  color: #000000;
}
.how-buy-step-title {
  font-size: 12px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 0.5rem;
}
.how-buy-list {
  margin: 0;
  padding-left: 2.2rem;
  font-size: 12px;
  color: #000000;
}
.how-buy-link {
  color: #0a7cff;
  text-decoration: underline;
}
.how-buy-token-label {
  font-size: 20px;
  font-weight: 500;
  color: #000000;
  width: 100px;
}
.how-buy-icon {
  border-radius: 12px;
  padding: 0 12px;
  width: 1px;
  width: 90px;
  height: 90px;
  object-fit: contain;
}
.how-buy-illustration {
  height: 160px;
}
@media (min-width: 600px) {
  .how-buy-illustration {
    margin-top: 2rem;
    height: 400px;
  }
  .token-icon {
    width: 62px;
    height: 62px;
  }
  .how-buy-list {
    margin: 0;
    padding-left: 2.2rem;
    font-size: 24px;
    color: #000000;
  }
  .how-buy-step-title {
    font-size: 24px;
    font-weight: 400;
    color: #000000;
    margin-bottom: 0.5rem;
  }
  .how-buy-icon {
    width: 165px;
    height: 165px;
  }
  .how-buy-title {
    font-size: 36px;
    font-weight: 800;
    color: #354053;
  }
}
@media (min-width: 960px) {
}
</style>
