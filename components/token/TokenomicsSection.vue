<template>
  <section class="tokenomics-section">
    <v-container class="tokenomics-container">
      <v-row justify="center">
        <v-col cols="12">
          <div class="tokenomics-title">Tokenomics</div>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="12" class="d-flex justify-center">
          <img
            src="/images/token/tokenomicsdesktop.png"
            alt="Tokenomics"
            class="tokenomics-img"
            contain
          />
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script>
export default {
  name: "TokenomicsSection",
};
</script>

<style scoped>
.tokenomics-section {
  background-color: rgba(36, 41, 47, 0.05);
  padding: 24px 0;
}
.tokenomics-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
}
.tokenomics-title {
  text-align: center;
  color: #24292f;
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 32px;
}
.tokenomics-img {
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
}
</style>
