<template>
  <div class="stats-section">
    <v-container>
      <div class="stats-section__content">
        <h1 class="stats-section__title">LIVE STATISTICS</h1>
        <p class="stats-section__desc pt-1">
          Real-time data and analytics for the $GET token ecosystem
        </p>

        <div>
          <v-row class="mt-2 mx-5">
            <v-col cols="6">
              <div class="stats-section-stats__card darken-card">
                <div class="d-flex justify-space-between">
                  <div class="stats-section-stats__card--icon">
                    <ClientOnly>
                      <v-icon
                        :size="`${display.xs.value ? 'small' : 'x-large'}`"
                        color="white"
                        >mdi-poll</v-icon
                      >
                      <template #fallback>
                        <v-icon size="x-large" color="white">mdi-poll</v-icon>
                      </template>
                    </ClientOnly>
                  </div>
                  <div class="stats-section-stats__card--percent">+5.2%</div>
                </div>
                <div class="stats-section-stats__card--title">Market Cap</div>
                <div class="stats-section-stats__card--value">$ 2.3B</div>
              </div>
            </v-col>
            <v-col cols="6">
              <div class="stats-section-stats__card darken-card">
                <div class="d-flex justify-space-between">
                  <div class="stats-section-stats__card--icon">
                    <ClientOnly>
                      <v-icon
                        :size="`${display.xs.value ? 'small' : 'x-large'}`"
                        color="white"
                        >mdi-finance</v-icon
                      >
                      <template #fallback>
                        <v-icon size="x-large" color="white">mdi-finance</v-icon>
                      </template>
                    </ClientOnly>
                  </div>
                  <div class="stats-section-stats__card--percent">+10%</div>
                </div>
                <div class="stats-section-stats__card--title">24h Volume</div>
                <div class="stats-section-stats__card--value">$ 1124.5M</div>
              </div>
            </v-col>
            <v-col cols="6">
              <div class="stats-section-stats__card">
                <div class="d-flex justify-space-between">
                  <div class="stats-section-stats__card--icon">
                    <ClientOnly>
                      <v-icon
                        :size="`${display.xs.value ? 'small' : 'x-large'}`"
                        color="white"
                        >mdi-cached</v-icon
                      >
                      <template #fallback>
                        <v-icon size="x-large" color="white">mdi-cached</v-icon>
                      </template>
                    </ClientOnly>
                  </div>
                  <div class="stats-section-stats__card--percent text-white">
                    75%
                  </div>
                </div>
                <div class="stats-section-stats__card--title">
                  Circuleating Supply
                </div>
                <div class="stats-section-stats__card--value">750M GET</div>
              </div>
            </v-col>
            <v-col cols="6">
              <div class="stats-section-stats__card">
                <div class="d-flex justify-space-between">
                  <div class="stats-section-stats__card--icon">
                    <ClientOnly>
                      <v-icon
                        :size="`${display.xs.value ? 'small' : 'x-large'}`"
                        color="white"
                        >mdi-account-arrow-up</v-icon
                      >
                      <template #fallback>
                        <v-icon size="x-large" color="white">mdi-account-arrow-up</v-icon>
                      </template>
                    </ClientOnly>
                  </div>
                  <div
                    class="stats-section-stats__card--percent text-deep-orange-lighten-1"
                  >
                    -3.4%
                  </div>
                </div>
                <div class="stats-section-stats__card--title">Holders</div>
                <div class="stats-section-stats__card--value">45.672</div>
              </div>
            </v-col>
          </v-row>
        </div>
        <div class="mt-4">
          <h2 class="stats-section-chart__title">Price Performance</h2>
        </div>

        <v-row class="mt-2 mx-5">
          <v-col cols="4" sm="3" class="d-flex flex-column h-100 px-2 py-0">
            <div>
              <div class="stats-section-chart__card">
                <div class="stats-section-chart__box">$0.00892</div>
              </div>
              <div class="stats-section-chart__coins flex-grow-1">
                <div class="d-flex align-center mb-2 mb-md-4">
                  <img
                    src="/images/token/token-get.png"
                    alt="GET"
                    class="token-icon mr-2"
                  />
                  <span class="token-label">GET</span>
                </div>
                <div class="d-flex align-center mb-2 mb-md-4">
                  <img
                    src="/images/token/token-usdc.png"
                    alt="USDC"
                    class="token-icon mr-2"
                  />
                  <span class="token-label">USDC</span>
                </div>
                <div class="d-flex align-center mb-2 mb-md-4">
                  <img
                    src="/images/token/token-usdt.png"
                    alt="USDT"
                    class="token-icon mr-2"
                  />
                  <span class="token-label">USDT</span>
                </div>
                <div class="d-flex align-center">
                  <img
                    src="/images/token/token-wbtc.png"
                    alt="WBTC"
                    class="token-icon mr-2"
                  />
                  <span class="token-label">WBTC</span>
                </div>
              </div>
            </div>
          </v-col>
          <v-col cols="8" sm="9" class="px-2 py-0">
            <iframe
              class="stats-section-chart__iframe"
              width="100%"
              src="https://birdeye.so/tv-widget/GeutGuhcTYRf4rkbZmWDMEgjt5jHyJN4nHko38GJjQhv?chain=solana&viewMode=pair&chartInterval=1D&chartType=Candle&chartTimezone=Etc%2FUTC&chartLeftToolbar=show&theme=dark"
              frameborder="0"
              allowfullscreen
            >
            </iframe>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </div>
</template>

<script setup>
import { useDisplay } from "vuetify";
const display = useDisplay();
</script>

<style scoped>
.stats-section-chart__coins {
  background: #000518;
  border: 1px solid #1c3771;
  border-radius: 8px;
  margin-top: 10px;
  padding: 5px 5px;
  height: 100%;
}
.token-icon {
  width: 15px;
  height: 15px;
}
.token-label {
  font-size: 10px;
  color: #fff;
  font-weight: 700;
}
.stats-section-chart__card {
  border-radius: 8px;
  border: 2px solid #f8ba23;
  padding: 4px 4px;
}
.stats-section-chart__box {
  border-radius: 6px;
  border: 2px solid #132c5b;
  padding: 4px 2px;
  color: #fff;
  font-size: 10px;
  text-align: center;
  font-weight: 700;
}
.stats-section-chart__title {
  font-size: 20px;
  color: #fff;
  text-align: center;
}
.stats-section-chart__iframe {
  height: 145px;
}
.stats-section-stats__card {
  border-radius: 8px;
  padding: 1.2rem;
  background: #70eef1;
}
.darken-card {
  background: #17a79d;
}
.stats-section-stats__card--icon {
  width: 24px;
  height: 20px;
  background: #07132f;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
  border-radius: 6px;
}
.stats-section-stats__card--percent {
  background: #061530;
  width: 41px;
  height: 19px;
  border-radius: 20px;
  color: #49d886;
  font-size: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  padding: 5px;
}
.stats-section-stats__card--title {
  color: #0e1037;
  font-weight: 800;
  margin-top: 7px;
  font-size: 9px;
}
.stats-section-stats__card--value {
  background: #05122e;
  color: #efefec;
  border-radius: 4px;
  width: 100%;
  text-align: center;
  font-weight: 800;
  padding: 5px 5px;
  margin-top: 2px;
}
.stats-section {
  background: #03122e;
  padding: 3rem 0;
}
.stats-section__content {
} 
.stats-section__title {
  font-size: 28px;
  color: #fff;
  text-align: center;
}
.stats-section__desc {
  text-align: center;
  color: #fff;
  font-size: 10px;
}
@media (min-width: 600px) {
  .stats-section-chart__iframe {
    height: 100%;
  }
  .stats-section-chart__coins {
    padding: 15px 15px;
  }
  .stats-section-chart__card {
    padding: 8px 10px;
  }
  .stats-section-chart__box {
    font-size: 20px;
  }
  .stats-section-chart__title {
    font-size: 34px;
  }
  .token-icon {
    width: 30px;
    height: 30px;
  }
  .token-label {
    font-size: 18px;
  }
  .stats-section__title {
    font-size: 38px;
  }
  .stats-section__desc {
    font-size: 20px;
  }
  .stats-section-stats__card--icon {
    width: 50px;
    height: 44px;
  }
  .stats-section-stats__card--percent {
    width: 82px;
    height: 42px;
    font-size: 20px;
  }
  .stats-section-stats__card--title {
    font-weight: 800;
    margin-top: 7px;
    font-size: 20px;
  }
  .stats-section-stats__card--value {
    background: #05122e;
    color: #efefec;
    border-radius: 4px;
    width: 100%;
    text-align: center;
    font-weight: 800;
    padding: 10px 5px;
    margin-top: 2px;
    font-size: 28px;
  }
}
@media (min-width: 960px) {
  .stats-section-stats__card {
    padding: 1.7rem;
  }
}
.live-statistics-section {
  max-width: 1200px;         
  margin-left: auto;
  margin-right: auto;
  padding-left: 2rem;       
  padding-right: 2rem;
}
@media (max-width: 600px) {
  .live-statistics-section {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
}
</style>
