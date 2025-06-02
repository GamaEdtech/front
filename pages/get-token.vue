<template>
  <div>
    <section>
      <HeroSection />
    </section>
    <section>
      <TokenAboutSection />
    </section>
    <section>
      <HowGetTokenSection />
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
import HeroSection from "~/components/token/HeroSection.vue";
import HowGetTokenSection from "~/components/token/HowGetTokenSection.vue";
import ProfitBuybackSection from "~/components/token/ProfitBuybackSection.vue";
import TokenAboutSection from "~/components/token/TokenAboutSection.vue";
import TokenFaq from "~/components/token/TokenFaq.vue";
import TokenLiveChart from "~/components/token/TokenLiveChart.vue";
import TokenomicsSection from "~/components/token/TokenomicsSection.vue";
import TokenPurchase from "~/components/token/TokenPurchase.vue";
import TrustCommunitySection from "~/components/token/TrustCommunitySection.vue";

export default {
  head() {
    return {
      title: "$GET Token",
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
    HeroSection,
    HowGetTokenSection,
    TokenAboutSection,
  },
  auth: false,
  mounted() {},
};
</script>

<style scoped></style>
