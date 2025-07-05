<template>
  <section class="hero-section">
    <v-container class="hero-container">
      <v-row align="center" justify="center" class="min-h-screen">
        <v-col cols="12" md="6" class="hero-content">
          <div class="title-row">
            <div class="live-trading-badge ml-16">
              <span class="live-dot"></span>
              Live Trading
            </div>
            <h1 class="main-title">$GET</h1>
          </div>
          
          <p class="description">
            The future of decentralized finance. powering innovation,
            enabling growth, and creating value for the community.
          </p>
          
          <div class="price-section">
            <div class="price">${{ animatedPrice }}</div>
            <div class="change">+6.47%</div>
          </div>
          
          <div class="action-buttons">
            <v-btn
              target="_blank"
              href="https://jup.ag/swap/So11111111111111111111111111111111111111112-GeutGuhcTYRf4rkbZmWDMEgjt5jHyJN4nHko38GJjQhv"
              class="buy-btn"
              rounded
              elevation="0"
            >
              Buy $GET Now
            </v-btn>
            <v-btn
              to="/whitepaper"
              class="whitepaper-btn"
              rounded
              elevation="0"
            >
              View Whitepaper
            </v-btn>
          </div>
        </v-col>
        
        <v-col cols="12" md="6" class="hero-image-desktop">
          <div class="token-wrapper">
            <img src="/assets/images/token/GET-coin.svg" alt="GET Token" />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";

const finalPrice = ref(0);
const animatedPrice = ref(0);

const fetchTokenPrice = async () => {
  try {
    const data = await $fetch(
      "https://lite-api.jup.ag/price/v2?ids=GeutGuhcTYRf4rkbZmWDMEgjt5jHyJN4nHko38GJjQhv"
    );
    finalPrice.value = Object.values(data.data)[0]["price"];
    
    // Start animation after fetching the price
    animatePrice();
  } catch (error) {
    console.error("Error fetching token price:", error);
    finalPrice.value = 0.002546; // Fallback price
    animatePrice();
  }
};

const animatePrice = () => {
  const duration = 1200;
  const frameRate = 60;
  const totalFrames = Math.round((duration / 1000) * frameRate);
  let frame = 0;

  const animate = () => {
    frame++;
    const progress = Math.min(frame / totalFrames, 1);
    animatedPrice.value = +(finalPrice.value * progress).toFixed(6);
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  animate();
};

onMounted(() => {
  fetchTokenPrice();
});
</script>

<style scoped>
.hero-section {
  position: relative;
  color: white;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
  background-color: #000;
  padding: 6rem 2vw 1rem 2vw;
}

.hero-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;
  padding-left: 2vw;
  padding-right: 2vw;
}

.hero-content {
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  align-items: center;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 4rem;
  margin-bottom: 2rem;
  margin-top: 4rem;
  padding-left: 1rem;
  position: relative;
  width: 100%;
}

.live-trading-badge {
  background: rgba(5, 182, 231, 0.3);
  border: 1px solid rgba(110, 119, 129, 1);
  border-radius: 999px;
  padding: 12px 24px;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  gap: 12px;
  color: white;
  font-weight: 600;
  height: auto;
  min-width: 180px;
  width: auto;
  box-shadow: 0 2px 8px rgba(36, 170, 148, 0.08);
  white-space: nowrap;
  justify-content: center;
  margin-left: 1rem;
  position: relative;
}

.live-dot {
  width: 12px;
  height: 12px;
  min-width: 12px;
  background: #24aa94;
  border-radius: 50%;
  animation: pulse 2s infinite;
  display: inline-block;
  margin-right: 4px;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.main-title {
  font-family: 'Inter', 'Montserrat', 'Poppins', Arial, sans-serif;
  font-size: 6rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: #fff;
  margin: 0 0 1.5rem 0;
  line-height: 1.05;
}

.description {
  font-family: 'Inter', 'Montserrat', 'Poppins', Arial, sans-serif;
  font-size: 2rem;
  line-height: 1.6;
  color: #b0b0b0;
  margin-bottom: 2rem;
  max-width: 700px;
}

.price-section {
  margin-bottom: 2rem;
}

.price {
  font-size: 3rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
}

.change {
  font-size: 1.5rem;
  color: #24aa94;
  font-weight: 600;
}

.action-buttons {
  display: flex;
  gap: 1.2rem;
  flex-wrap: wrap;
  padding-top: 24px;
  padding-bottom: 24px;
  justify-content: center;
}

.buy-btn, .whitepaper-btn {
  padding-top: 26px !important;
  padding-right: 44px !important;
  padding-left: 44px !important;
  padding-bottom: 40px !important;
  height: auto !important;
  min-height: 0 !important;
}
.buy-btn .v-btn__content,
.whitepaper-btn .v-btn__content {
  padding-bottom: 40px !important;
}

.buy-btn {
  background: linear-gradient(90deg, #24aa94 0%, #18806d 100%) !important;
  color: #fff !important;
  border-radius: 999px !important;
  box-shadow: 0 4px 24px 0 rgba(36, 170, 148, 0.18) !important;
  text-transform: none !important;
  font-weight: 900;
  border: none !important;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  transition: all 0.2s cubic-bezier(.4,0,.2,1);
}

.buy-btn:hover {
  filter: brightness(1.08);
  box-shadow: 0 8px 32px rgba(36, 170, 148, 0.25) !important;
  transform: translateY(-2px) scale(1.03);
}

.whitepaper-btn {
  background: #484f57 !important;
  color: #fff !important;
  border-radius: 999px !important;
  box-shadow: 0 4px 24px 0 rgba(36, 170, 148, 0.10) !important;
  text-transform: none !important;
  font-weight: 900;
  border: 2px solid #bfc5cc !important;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  transition: all 0.2s cubic-bezier(.4,0,.2,1);
}

.whitepaper-btn:hover {
  background: #5a616a !important;
  filter: brightness(1.08);
  transform: translateY(-2px) scale(1.03);
}

.hero-image-desktop {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 350px;
  padding-left: 2vw;
}

.token-wrapper {
  position: relative;
  display: inline-block;
  overflow: hidden;
  border-radius: 50%;
}

.token-wrapper img {
  max-width: 420px;
  width: 100%;
  height: auto;
  animation: slowTilt 8s ease-in-out infinite;
  transition: transform 0.5s ease, max-width 0.5s;
}

.token-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.25) 50%,
    transparent
  );
  animation: shimmer 4s ease-in-out infinite;
  z-index: 1;
  pointer-events: none;
}

.token-wrapper:hover img {
  transform: scale(1.08) rotateY(20deg) rotateX(5deg);
}

@keyframes slowTilt {
  0%, 100% {
    transform: rotateY(-15deg);
  }
  50% {
    transform: rotateY(15deg);
  }
}

@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

@media (max-width: 1200px) {
  .token-wrapper img {
    max-width: 320px;
  }
  .hero-image-desktop {
    min-height: 250px;
    padding-left: 1vw;
  }
  .hero-container {
    max-width: 98vw;
    padding-left: 24px;
    padding-right: 2vw;
  }
}

@media (max-width: 900px) {
  .token-wrapper img {
    max-width: 220px;
  }
  .hero-image-desktop {
    min-height: 180px;
    padding-left: 0.5vw;
  }
  .hero-container {
    max-width: 100vw;
    padding-left: 2vw;
    padding-right: 2vw;
  }
}

@media (min-width: 1600px) {
  .token-wrapper img {
    max-width: 600px;
  }
  .hero-container {
    max-width: 1600px;
  }
}

@media (max-width: 960px) {
  .title-row {
    padding-left: 0.5rem;
    justify-content: center;
    flex-wrap: wrap;
    gap: 2rem;
  }

  .live-trading-badge {
    margin-left: 0;
    font-size: 1.1rem;
    padding: 12px 20px;
    min-width: 160px;
  }

  .main-title {
    font-size: 5rem;
  }
  
  .hero-content {
    text-align: center;
  }
  
  .action-buttons {
    justify-content: center;
  }
  
  .hero-image-desktop {
    margin-top: 2rem;
  }
  
  .token-wrapper img {
    max-width: 300px;
  }
}

@media (max-width: 600px) {
  .hero-section {
    padding: 2.5rem 5vw 1.5rem 5vw;
  }
  .hero-container {
    padding-left: 2vw;
    padding-right: 2vw;
  }
  .action-buttons {
    flex-direction: column;
    width: 100%;
  }
  .buy-btn, .whitepaper-btn {
    width: 100%;
    min-width: unset;
    margin: 0;
    padding-top: 32px !important;
    padding-bottom: 32px !important;
    font-size: 1.1rem !important;
  }

  .main-title {
    font-size: 2.2rem;
  }
  .price {
    font-size: 1.3rem;
  }
  .change {
    font-size: 1rem;
  }
  .description {
    font-size: 0.95rem;
    margin-bottom: 1.2rem;
  }
  .hero-content {
    padding: 1rem 0.5rem;
  }
  .token-wrapper img {
    max-width: 160px;
    margin-top: 2.5rem;
  }
  .live-trading-badge {
    padding: 8px 16px;
    font-size: 0.9rem;
    min-width: 140px;
  }
  .live-dot {
    width: 10px;
    height: 10px;
    min-width: 10px;
  }
}

@media (max-width: 400px) {
  .main-title {
    font-size: 1.5rem;
  }
  .price {
    font-size: 1rem;
  }
  .token-wrapper img {
    max-width: 110px;
    margin-top: 2.5rem;
  }
}

/* Mobile-only bottom padding for coin */
@media (max-width: 768px) {
  .hero-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
  }

  .main-title {
    font-size: clamp(3rem, 8vw, 6rem);
  }

  .description {
    font-size: clamp(1rem, 2vw, 1.2rem);
    margin-bottom: 1rem;
  }

  .price {
    font-size: clamp(2rem, 4vw, 3rem);
  }

  .change {
    font-size: clamp(1.2rem, 2vw, 1.5rem);
  }

  .hero-image-desktop {
    order: 2;
    margin-bottom: 2rem;
  }

  .price-section {
    order: 3;
    margin-bottom: 2rem;
  }

  .action-buttons {
    order: 4;
    width: 100%;
    justify-content: center;
  }

  .buy-btn, .whitepaper-btn {
    padding: 12px 24px !important;
    font-size: 14px !important;
    width: auto;
  }

  .token-wrapper img {
    max-width: 300px;
  }
}

/* Responsive adjustments for larger screens */
@media (min-width: 600px) {
  .live-trading-badge {
    padding: 18px 32px;
    font-size: 1.25rem;
  }
  
  .live-dot {
    width: 16px;
    height: 16px;
    min-width: 16px;
  }
  
  .main-title {
    font-size: 156px;
    margin-top: 4rem;
  }
  
  .description {
    font-size: 24px;
    line-height: 36px;
  }
  
  .price {
    font-size: 48px;
  }
  
  .change {
    font-size: 32px;
  }
  
  .hero-section {
    padding: 10rem 0 8rem 0;
  }
}

@media (min-width: 601px) {
  .action-buttons {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }
  .buy-btn, .whitepaper-btn {
    padding: 14px 28px !important;
    border-radius: 30px !important;
    font-size: 16px !important;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
    min-width: unset;
    box-shadow: none;
    letter-spacing: normal;
    display: inline-block;
  }
  .buy-btn {
    background: linear-gradient(to bottom, #24aa94, #0e443b) !important;
    color: white !important;
  }
  .buy-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(36, 170, 148, 0.3) !important;
  }
  .whitepaper-btn {
    background: rgba(66, 73, 82, 1) !important;
    border: 1.5px solid rgba(110, 119, 129, 1) !important;
    color: white !important;
  }
  .whitepaper-btn:hover {
    background: rgba(80, 90, 100, 1) !important;
    transform: translateY(-2px);
  }
}

@media (max-width: 599px) {
  .title-row {
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }
}

</style>
