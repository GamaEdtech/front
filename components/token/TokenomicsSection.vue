<template>
  <section class="tokenomics-section">
    <v-container class="tokenomics-container">
      <h4 class="tokenomics-title">Tokenomics</h4>
      <v-row justify="center">
        <v-col cols="12" class="d-flex justify-center">
          <figure class="d-none d-sm-block text-center">
            <img
              src="/images/token/Tokenomics_Desktop.png"
              alt="Tokenomics chart desktop"
              class="tokenomics-img"
              contain
            />
            <figcaption class="sr-only">
              Tokenomics chart for desktop view
            </figcaption>
          </figure>
          <figure class="d-sm-none text-center">
            <img
              src="/images/token/tokenomicsmobile.png"
              alt="Tokenomics chart mobile"
              class="tokenomics-img"
              contain
            />
            <figcaption class="sr-only">
              Tokenomics chart for mobile view
            </figcaption>
          </figure>
        </v-col>
        <v-col cols="12">
          <div class="d-sm-none">
            <div class="mb-2">
              <v-card rounded="lg" elevation="3">
                <v-card-text>
                  <div class="d-flex align-center">
                    <div class="flex-shrink-0 pl-5">
                      <img
                        class="tokenomics-static__img"
                        src="/images/token/governance.svg"
                        alt=""
                      />
                    </div>
                    <div class="pl-5">
                      <div class="tokenomics-static__title governance-title">
                        Governance
                      </div>
                      <div class="tokenomics-static__content pl-3 mt-1">
                        <div>7B $GET</div>
                        <div>Locked for 10 years</div>
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </div>
            <div class="mb-2">
              <v-card rounded="lg" elevation="3">
                <v-card-text>
                  <div class="d-flex align-center">
                    <div class="flex-shrink-0 pl-5">
                      <img
                        class="tokenomics-static__img"
                        src="/images/token/team.svg"
                        alt=""
                      />
                    </div>
                    <div class="pl-5">
                      <div class="tokenomics-static__title team-title">
                        Governance
                      </div>
                      <div class="tokenomics-static__content pl-3 mt-1">
                        <div>7B $GET</div>
                        <div>Locked for 10 years</div>
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </div>
            <div class="mb-2">
              <v-card rounded="lg" elevation="3">
                <v-card-text>
                  <div class="d-flex align-center">
                    <div class="flex-shrink-0 pl-5">
                      <img
                        class="tokenomics-static__img"
                        src="/images/token/liquidity.png"
                        alt=""
                      />
                    </div>
                    <div class="pl-5">
                      <div class="tokenomics-static__title liquidity-title">
                        Governance
                      </div>
                      <div class="tokenomics-static__content pl-3 mt-1">
                        <div>7B $GET</div>
                        <div>Locked for 10 years</div>
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup></script>

<style scoped>
.tokenomics-section {
  padding: 6rem 2rem;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  position: relative;
}
.tokenomics-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 14px;
}
.tokenomics-title {
  text-align: center;
  color: #000000;
  font-size: 18px;
  font-weight: 800;
  margin-bottom: 12px;
}

.tokenomics-img {
  max-width: 1000px;
  width: 80%;
  margin: 0 auto;
}

.tokenomics-static__img {
  width: 54px;
  height: 54px;
  flex-shrink: 0;
}
.tokenomics-static__title {
  font-size: 16px;
  font-weight: 600;
}
.governance-title {
  color: #fd3333;
}
.team-title {
  color: #e3a313;
}
.liquidity-title {
  color: #4cb2ba;
}
.tokenomics-static__content {
  font-size: 14px;
  font-weight: 400;
  color: #000000;
}

@media (min-width: 600px) {
  .tokenomics-img {
    width: 100%;
  }
  .tokenomics-title {
    text-align: center;
    color: #24292f;
    font-size: 36px;
    font-weight: 700;
    margin-bottom: 32px;
  }
}

@media (max-width: 768px) {
  .tokenomics-section {
    margin-left: 2rem;
    margin-right: 2rem;
    padding: 3rem 1rem;
  }
}
</style>
