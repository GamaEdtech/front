<template>
  <header class="hero-section">
    <div class="hero-section-content">
      <v-container fluid>
        <v-container class="pb-0">
          <v-row>
            <v-col cols="12" class="pb-0">
              <div class="h-content-header">
                <h1 class="h-token-title">
                  <span class="h-token-title-prefix">$GET</span>
                  <span>Token</span>
                </h1>
                <p class="h-token-description">
                  Governance & Earning Token for the Gama Ecosystem
                </p>
                <div class="h-token-token">
                  <img
                    class="h-token-token-img"
                    src="/images/token/token.png"
                    alt="$GET token illustration"
                  />
                </div>
              </div>
              <div class="h-token-preview">
                <img
                  src="/images/token/hero.png"
                  alt="Gama $GET token hero preview"
                />
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-container>
    </div>
  </header>
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
  background: rgba(36, 41, 47, 0.05);
}
.h-content-header {
  /* padding-bottom: 40rem; */
}
.h-token-title-prefix {
  color: #e3a313;
}
.h-token-title {
  color: #354053;
  font-size: 34px;
  font-weight: 800;
  text-align: center;
}
.h-token-description {
  font-size: 14px;
  font-weight: 400;
  text-align: center;
  width: 65%;
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
  top: 50%;
  transform: translate(-50%, -50%);
}
.h-token-token-img {
  width: 100px;
  height: 120px;
  object-fit: contain;
}
.h-token-preview {
  position: relative;
  overflow: hidden;
  margin-bottom: -1rem;
  padding-top: 6rem;
}
.h-token-preview img {
  width: 100%;
  height: 250px;
  object-fit: contain;
}
@media (min-width: 600px) {
  .h-token-token {
    top: 45%;
  }
  .h-token-token-img {
    width: 120px;
    height: 140px;
    object-fit: contain;
  }
  .hero-section-content {
    padding-top: 7rem;
    position: relative;
    width: 100%;
    margin: 0 auto;
    background: rgba(217, 217, 217, 1);
  }
  .h-token-preview img {
    width: 100%;
    height: 450px;
  }
  .h-token-preview {
    padding-top: unset;
  }
  .h-token-title {
    font-size: 46px;
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
  .h-token-preview {
    padding-top: unset;
  }
}
</style>
