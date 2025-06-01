<template>
  <div>
    <section class="token-market__section">
      <v-container>
        <h4 class="token-market__title mb-8">View $GET Live on Solana</h4>
        <div>
          <iframe
            width="100%"
            height="500"
            src="https://birdeye.so/tv-widget/GeutGuhcTYRf4rkbZmWDMEgjt5jHyJN4nHko38GJjQhv?chain=solana&viewMode=pair&chartInterval=1D&chartType=Candle&chartTimezone=Etc%2FUTC&chartLeftToolbar=show&theme=dark"
            frameborder="0"
            allowfullscreen
          >
          </iframe>
        </div>
        <div class="token-market__description">
          Keep an eye on $GET’s market movement and trade anytime with Jupiter.
        </div>
      </v-container>
    </section>
  </div>
</template>

<script>
export default {
  name: "TokenLiveChart",
};
</script>

<style scoped>
.token-market__title {
  color: #4e545b;
  font-size: 36px;
  font-weight: 800;
  text-align: center;
}
.token-market__section {
  padding-top: 8rem;
}
.token-market__description {
  color: #6e7781;
  font-size: 32px;
  font-weight: 500;
  margin: 20px 30px;
  text-align: center;
}
</style>
