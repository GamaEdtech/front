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

    <!-- What is $GET section -->
    <section class="about-get-section">
      <v-container>
        <div class="d-flex justify-content-center mb-4">
          <div>
            <h2 class="about-get-title">What is <b>$GET</b></h2>
          </div>
        </div>
        <v-row class="justify-content-center">
          <v-col cols="12" md="7">
            <div class="d-flex justify-end">
              <div class="about-get-desc">
                <b>$GET</b> is GamaTrain's own cryptocurrency used for
                governance and incentivizing the Gama ecosystem.<br /><br />
                It empowers users to vote on platform decisions, propose new
                features, and earn rewards for meaningful contributions.<br /><br />
                By holding and using <b>$GET</b>, participants become active
                stakeholders in shaping the future of GamaTrain — from content
                creation to community growth.
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="2" class="about-get-img-col">
            <img
              class="about-get-img"
              src="/images/token/about.png"
              alt="What is $GET"
            />
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- What Can You Do With $GET section -->
    <section class="can-get-section mt-10">
      <v-container>
        <div class="d-flex justify-content-center mb-9">
          <h2 class="can-get-title">What Can You Do With $GET?</h2>
        </div>
        <v-row class="justify-content-center">
          <v-col cols="12" md="6">
            <div class="can-get-desc d-flex">
              <div>
                <div class="pl-10">
                  <div class="text-h4">You can use <b>$GET</b> to:</div>
                  <ul class="can-get-list text-h5">
                    <li><b>Vote</b> on platform decisions</li>
                    <li><b>Propose</b> new features</li>
                    <li><b>Shape</b> the future of GamaTrain</li>
                  </ul>
                </div>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="3" class="can-get-img-col">
            <img
              class="can-get-img"
              src="/images/token/can.png"
              alt="What can you do with $GET"
            />
          </v-col>
        </v-row>
        <div>
          <div class="can-get-footnote text-h4 mt-7">
            As the ecosystem grows, <b>$GET</b> may also unlock exclusive tools,
            boost visibility for your content and grant access to new learning
            materials.
          </div>
        </div>
      </v-container>
    </section>

    <section>
      <EarnGetSection />
    </section>
    <section>
      <TrustCommunitySection />
    </section>
    <section>
      <TokenomicsSection />
    </section>
    <section>
      <ProfitBuybackSection />
    </section>
    <section>
      <TokenPurchase />
    </section>
    <section>
      <TokenLiveChart />
    </section>
    <section>
      <TokenFaq />
    </section>
  </div>
</template>

<script>
import EarnGetSection from "@/components/token/EarnGetSection.vue";
import ProfitBuybackSection from "~/components/token/ProfitBuybackSection.vue";
import TokenFaq from "~/components/token/TokenFaq.vue";
import TokenLiveChart from "~/components/token/TokenLiveChart.vue";
import TokenomicsSection from "~/components/token/TokenomicsSection.vue";
import TokenPurchase from "~/components/token/TokenPurchase.vue";
import TrustCommunitySection from "~/components/token/TrustCommunitySection.vue";

export default {
  head() {
    return {
      title: "$GET Token",
      script: [
        {
          src: `https://terminal.jup.ag/main-v3.js`,
          defer: true,
        },
      ],
    };
  },
  components: {
    EarnGetSection,
    ProfitBuybackSection,
    TokenFaq,
    TokenLiveChart,
    TokenomicsSection,
    TokenPurchase,
    TrustCommunitySection,
  },
  auth: false,
  mounted() {},
};
</script>

<style scoped>
.hero-section {
  background: rgba(36, 41, 47, 0.05);
}
.hero-section-content {
  padding-top: 11rem;
  position: relative;
  width: 80%;
  margin: 0 auto;
  background: rgba(217, 217, 217, 1);
  /* padding: 0 4rem; */
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
  width: 200px;
  height: 220px;
}
.h-token-preview {
  position: relative;
  overflow: hidden;
  margin-bottom: -1rem;
  margin-top: 5rem;
}

.h-token-preview img {
  width: 100%;
  height: 550px;
  object-fit: contain;
}

.about-get-section {
  background: #fff;
  padding: 5rem 0 2rem 0;
}
.about-get-title {
  font-size: 34px;
  font-weight: 800;
  color: #24292f;
  margin-bottom: 1.5rem;
}
.about-get-desc {
  font-size: 20px;
  color: #24292f;
  line-height: 1.7;
}
.about-get-img-col {
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
.about-get-img {
  width: 180px;
  max-width: 100%;
}

.can-get-section {
  width: 75%;
  margin: 0 auto;
}
.can-get-title {
  font-size: 32px;
  font-weight: 700;
  color: #000000;
  text-align: center;
}
.can-get-desc {
  font-size: 20px;
  color: #333;
  line-height: 1.7;
}
.can-get-list {
  padding: 0;
  list-style: disc;
  padding-left: 55px;
  margin-top: 15px;
  padding-bottom: 10px;
}
.can-get-list li {
  margin-bottom: 0.7rem;
  font-size: 20px;
}
.can-get-footnote {
  color: #000000;
}
.can-get-img-col {
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
.can-get-img {
  width: 230px;
  max-width: 100%;
}
</style>
