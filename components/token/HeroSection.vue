<template>
  <div>
    <section class="hero-section">
      <div class="hero-section-content">
        <v-container fluid>
          <v-container class="pb-0">
            <v-row>
              <v-col cols="12" class="pb-0">
                <div class="h-content-header">
                  <h2 class="h-token-title">
                    <span class="h-token-title-prefix">$GET</span>
                    <span>Token</span>
                  </h2>
                  <div class="h-token-description">
                    Goverance & Earning Token for the Gama Ecosystem
                  </div>
                  <div class="h-token-token">
                    <img
                      class="h-token-token-img"
                      src="/images/token/token.png"
                    />
                  </div>
                </div>
                <div class="h-token-preview">
                  <img src="/images/token/hero.png" alt="" />
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-container>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "HeroSection",
};
</script>

<style scoped>
.hero-section {
  background: rgba(36, 41, 47, 0.05);
}
.hero-section-content {
  padding-top: 7rem;
  position: relative;
  width: 100%;
  margin: 0 auto;
  background: rgba(217, 217, 217, 1);
}
.h-content-header {
  /* padding-bottom: 40rem; */
}
.h-token-title-prefix {
  color: #e3a313;
}
.h-token-title {
  color: #354053;
  font-size: 46px;
  font-weight: 800;
  text-align: center;
}
.h-token-description {
  font-size: 20px;
  font-weight: 400;
  text-align: center;
  width: 40%;
  margin: 0 auto;
  line-height: 1.2;
  margin-top: 6px;
}
.h-token-token {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  position: absolute;
  left: 50%;
  top: 45%;
  transform: translate(-50%, -50%);
}
.h-token-token-img {
  width: 120px;
  height: 140px;
  object-fit: contain;
}
.h-token-preview {
  position: relative;
  overflow: hidden;
  margin-bottom: -1rem;
}

.h-token-preview img {
  width: 100%;
  height: 450px;
  object-fit: contain;
}
@media (min-width: 960px) {
  .hero-section-content {
    padding-top: 11rem;
  }
  .h-token-preview img {
    height: 550px;
  }
  .hero-section-content {
    width: 80%;
    margin: 0 auto;
  }
  .h-token-token-img {
    width: 200px;
    height: 220px;
  }
  .h-token-token {
    top: 45%;
  }
  .h-token-preview {
    margin-top: 5rem;
  }
}
</style>
