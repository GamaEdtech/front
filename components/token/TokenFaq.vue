<template>
  <div>
    <section class="token-market__section">
      <div class="token-market__head">
        <div class="d-flex align-center flex-column py-8">
          <h2 class="token-market__title">$GET FAQ’s</h2>
          <p class="token-market__description">Frequently Asked Questions</p>
        </div>
      </div>
      <v-container>
        <div class="mt-8">
          <v-expansion-panels multiple>
            <v-expansion-panel v-for="(faq, i) in faqs" :key="i">
              <v-expansion-panel-header
                expand-icon="mdi-plus"
                expand-icon-collapsed="mdi-minus"
                disable-icon-rotate
              >
                <h3 class="token-market__expansion">
                  {{ faq.question }}
                </h3>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <p>{{ faq.answer }}</p>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </v-container>
    </section>
  </div>
</template>

<script>
export default {
  name: "TokenFaq",
  data() {
    return {
      faqs: [
        {
          question: "What is $GET?",
          answer:
            "$GET is the native token of the Gama ecosystem, designed to empower education and facilitate transactions within the platform.",
        },
        {
          question: "What can I do with $GET?",
          answer:
            "$GET can be used for accessing premium educational content, participating in governance, and powering various features within the Gama ecosystem.",
        },
        {
          question: "How do I earn $GET?",
          answer:
            "You can earn $GET by participating in educational activities, contributing to the community, or through special reward programs.",
        },
        {
          question: "Can I buy $GET?",
          answer:
            "Yes, you can purchase $GET on supported exchanges such as Jupiter.",
        },
        {
          question: "Can I sell my $GET?",
          answer:
            "Yes, $GET can be sold on supported exchanges where it is listed.",
        },
        {
          question: "Do I need a special wallet to use $GET?",
          answer:
            "$GET is a Solana-based token, so you need a Solana-compatible wallet such as Phantom or Solflare.",
        },
        {
          question: "How do I view $GET online?",
          answer:
            "You can view your $GET balance in your Solana wallet or on Solana blockchain explorers.",
        },
        {
          question: "Why does $GET have value?",
          answer:
            "$GET has value because it powers the Gama ecosystem, is used for transactions, and has utility within the platform.",
        },
        {
          question: "Is there a fixed amount of $GET?",
          answer:
            "Yes, $GET has a fixed total supply, ensuring scarcity and value for holders.",
        },
        {
          question: "Why are some of them 'Locked'?",
          answer:
            "Some $GET tokens are locked for team, community, or ecosystem development and will be released over time according to the project's schedule.",
        },
      ],
    };
  },
};
</script>

<style scoped>
.token-market__section {
}
.token-market__head {
  background: #000000;
}
.token-market__title {
  font-size: 34px;
  color: #ffb600;
  font-weight: 800;
}
.token-market__description {
  color: #ffb600;
  font-size: 12px;
  font-weight: 500;
}
.token-market__expansion {
  color: #24292f;
  font-size: 18px;
  font-weight: 600;
}
@media (min-width: 600px) {
  .token-market__title {
    font-size: 50px;
    font-weight: 800;
  }
  .token-market__description {
    font-size: 14px;
    font-weight: 500;
  }
}
@media (min-width: 960px) {
}
</style>
