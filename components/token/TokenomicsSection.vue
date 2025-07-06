<template>
  <section class="tokenomics-section">
    <v-container class="tokenomics-container">
      <div class="tokenomics-main">
        <div class="tokenomics-chart-card">
          <picture>
            <source srcset="/images/token/TokenomicsMobile.svg" media="(max-width: 600px)" />
            <img
              src="/images/token/TokenomicsDark2.svg"
              alt="Tokenomics Section"
              class="tokenomics-svg"
            />
          </picture>
        </div>
      </div>
    </v-container>
  </section>
</template>

<script setup>
// No breakdowns needed
</script>

<style scoped>
.tokenomics-section {
  padding: 4vw 0;
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  background: rgba(26, 28, 29, 1);
}

.tokenomics-container {
  max-width: 100vw;
  margin: 0 auto;
  padding: 0;
}

.tokenomics-title {
  text-align: center;
  color: #24292f;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2vw;
}

.tokenomics-main {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tokenomics-chart-card {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tokenomics-svg {
  width: 100%;
  max-width: 100vw;
  height: auto;
  display: block;
  object-fit: contain;
}
</style>