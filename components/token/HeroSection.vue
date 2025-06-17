<template>
  <header class="hero-section">
    <div class="hero-section__content py-12">
      <v-container class="pb-0">
        <v-row align="center">
          <v-col
            cols="12"
            md="8"
            class="pb-0 d-flex flex-column justify-center"
          >
            <div class="d-flex flex-md-row flex-column mb-5 mb-md-10">
              <div
                class="align-self-md-end align-self-center mr-md-10 mb-2 w-full"
              >
                <v-btn
                  class="live-trading-btn mr-4 d-flex align-center"
                  rounded
                  :size="`${display.xs.value ? 'large' : 'x-large'}`"
                  elevation="0"
                >
                  <span class="live-trading-dot mr-2"></span>
                  Live Trading
                </v-btn>
              </div>
              <h1
                class="hero-section__title font-weight-bold text-white mt-5 mt-md-0"
              >
                $GET
              </h1>

              <div class="d-md-none d-flex justify-center mt-5">
                <img
                  src="/images/token/token.png"
                  alt="Token"
                  class="hero-token__image--mobile"
                />
              </div>
            </div>
            <div class="d-flex justify-center flex-column align-center">
              <div class="text-white mb-6 hero-token__description">
                The future of decentralized finance. powering innovation,
                enabling growth, and creating value for the community.
              </div>
              <div class="mb-1">
                <span class="hero-token__price text-white"
                  >${{ animatedPrice }}</span
                >
              </div>
              <div class="mb-6">
                <span class="hero-token__percentage">+6.47%</span>
              </div>
              <div class="d-flex align-center">
                <v-btn
                  :size="`${display.xs.value ? 'large' : 'x-large'}`"
                  class="buy-btn mr-4"
                  rounded
                  elevation="0"
                  >Buy $GET Now</v-btn
                >
                <v-btn
                  class="whitepaper-btn"
                  rounded
                  :size="`${display.xs.value ? 'large' : 'x-large'}`"
                  elevation="0"
                  >View Whitepaper</v-btn
                >
              </div>
            </div>
          </v-col>
          <v-col
            cols="12"
            md="4"
            class="pb-0 d-flex justify-center align-center"
          >
            <img
              src="/images/token/token.png"
              alt="Token"
              class="token-image d-none d-md-block"
            />
          </v-col>
        </v-row>
      </v-container>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useDisplay } from "vuetify";
const display = useDisplay();
const finalPrice = 0.002546; // your real price
const animatedPrice = ref(0);
const liveTradingCount = ref(0);
const targetCount = 24;

onMounted(() => {
  const duration = 1200; // ms
  const frameRate = 60;
  const totalFrames = Math.round((duration / 1000) * frameRate);
  let frame = 0;

  const animate = () => {
    frame++;
    const progress = Math.min(frame / totalFrames, 1);
    animatedPrice.value = +(finalPrice * progress).toFixed(6);
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  animate();

  let current = 0;
  const stepTime = Math.abs(Math.floor(duration / targetCount));
  const timer = setInterval(() => {
    current += 1;
    liveTradingCount.value = current;
    if (current >= targetCount) clearInterval(timer);
  }, stepTime);
});
</script>

<style scoped>
.hero-section {
  padding: 6rem 0 1rem 0;
  position: relative;
  background: #000000;
}
.hero-section__content {
}
.hero-section__title {
  font-size: 64px;
  font-weight: 800;
  line-height: 0.9em;
  text-align: center;
}
.live-trading-btn {
  background: rgba(5, 182, 231, 0.3) !important;
  border: 1px solid rgba(110, 119, 129, 1) !important;
  color: #fff !important;
  text-transform: none;
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 0px;
}
.buy-btn {
  background: linear-gradient(
    to bottom,
    rgba(36, 170, 148, 1) 0%,
    rgba(14, 68, 59, 1) 100%
  ) !important;
  color: #fff !important;
  border-radius: 30px !important;
  box-shadow: none !important;
  text-transform: none;
}
.hero-token__price {
  font-size: 24px;
  font-weight: 800;
}
.hero-token__description {
  font-size: 12px;
  font-weight: 400;
  text-align: center;
  line-height: 20px;
}
.hero-token__percentage {
  font-size: 20px;
  font-weight: 400;
  color: #24aa94;
}
.whitepaper-btn {
  background: rgba(66, 73, 82, 1) !important;
  border: 1.5px solid rgba(110, 119, 129, 1) !important;
  color: #fff !important;
  border-radius: 30px !important;
  box-shadow: none !important;
  text-transform: none;
}
.token-image {
  display: block;
  margin: 0 auto;
  max-width: 420px;
  width: 100%;
  height: auto;
}
.hero-token__image--mobile {
  width: 125px;
  height: 125px;
}
.live-trading-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(36, 170, 148, 1);
  display: inline-block;
  animation: pulse 1.2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(36, 170, 148, 0.7);
  }
  70% {
    box-shadow: 0 0 0 12px rgba(36, 170, 148, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(36, 170, 148, 0);
  }
}
@media (min-width: 600px) {
  .hero-token__percentage {
    font-size: 32px;
  }
  .hero-token__description {
    font-size: 24px;
    line-height: 36px;
  }
  .hero-token__price {
    font-size: 48px;
  }
  .hero-section__title {
    font-size: 156px;
    font-weight: 800;
    line-height: 0.9em;
  }
  .live-trading-dot {
    width: 24px;
    height: 24px;
  }
  .live-trading-btn {
    font-weight: 600;
    font-size: 24px;
  }
  .hero-section {
    padding: 10rem 0 8rem 0;
  }
}
@media (min-width: 960px) {
}
</style>
