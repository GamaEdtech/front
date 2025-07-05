<template>
  <div>
    <v-container fluid id="faq-page-header">
      <v-container>
        <v-row>
          <v-col cols="12">
            <div id="main-title-holder">
              <h1 class="gama-text-h1">$GET FAQ's</h1>
              <p class="gama-text-subtitle2">Frequently Asked Questions</p>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-container>

    <v-container id="faq-data-container">
      <v-row>
        <v-col cols="12">
          <v-expansion-panels flat accordion>
            <v-expansion-panel v-for="(faq, i) in faqs" :key="i">
              <v-expansion-panel-title>
                <span class="gama-text-button">{{ faq.question }}</span>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div class="gama-text-body2">{{ faq.answer }}</div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref } from "vue";

const faqs = ref([
  { question: "What is $GET?", answer: "$GET is the native token of the Gama ecosystem, designed to empower education and facilitate transactions within the platform." },
  { question: "What can I do with $GET?", answer: "$GET can be used for accessing premium educational content, participating in governance, and powering various features within the Gama ecosystem." },
  { question: "How do I earn $GET?", answer: "You can earn $GET by participating in educational activities, contributing to the community, or through special reward programs." },
  { question: "Can I buy $GET?", answer: "Yes, you can purchase $GET on supported exchanges such as Jupiter." },
  { question: "Can I sell my $GET?", answer: "Yes, $GET can be sold on supported exchanges where it is listed." },
  { question: "Do I need a special wallet to use $GET?", answer: "$GET is a Solana-based token, so you need a Solana-compatible wallet such as Phantom or Solflare." },
  { question: "How do I view $GET online?", answer: "You can view your $GET balance in your Solana wallet or on Solana blockchain explorers." },
  { question: "Why does $GET have value?", answer: "$GET has value because it powers the Gama ecosystem, is used for transactions, and has utility within the platform." },
  { question: "Is there a fixed amount of $GET?", answer: "Yes, $GET has a fixed total supply, ensuring scarcity and value for holders." },
  { question: "Why are some of them 'Locked'?", answer: "Some $GET tokens are locked for team, community, or ecosystem development and will be released over time according to the project's schedule." }
]);
</script>

<style>
#faq-page-header {
  height: 2rem;
  background: #24292f;
  position: relative;
}
#main-title-holder {
  position: absolute;
  margin: auto;
  left: 0;
  right: 0;
  top: 2.7rem;
  text-align: center;
}
.gama-text-h1 {
  color: #ffb600;
  margin-bottom: 0.8rem;
  font-size: 2.5rem;
  font-weight: 800;
}
.gama-text-subtitle2 {
  color: #ffb600 !important;
  font-size: 1.2rem;
}
#faq-data-container {
  margin-bottom: 1.5rem;
}
#list-rows {
  width: 90%;
  margin: auto;
}
.v-expansion-panel-title {
  padding: 1.55rem 0 1.55rem 0;
  border-bottom: 1px solid rgba(36, 41, 47, 0.1);
}
.gama-text-button {
  font-weight: 600;
  font-size: 1.8rem;
}
.v-expansion-panel-text__wrap {
  padding: 2.4rem 0 0 0;
}
.gama-text-body2 {
  line-height: 2.2rem;
  font-size: 1.6rem;
  color: #444;
}
@media only screen and (min-width: 600px) {
  #faq-page-header {
    height: 14rem;
  }
  #main-title-holder {
    top: 3.5rem;
  }
  .gama-text-h1 {
    margin-bottom: 0.8rem;
    font-size: 3rem;
  }
  .gama-text-subtitle2 {
    font-size: 1.4rem;
  }
  #faq-data-container {
    margin-bottom: 2.5rem;
  }
  .v-expansion-panel-title {
    padding: 1.9rem 0 1.9rem 0;
  }
  .gama-text-button {
    font-size: 2rem;
  }
  .gama-text-body2 {
    font-size: 1.7rem;
  }
}
@media only screen and (min-width: 960px) {
  #faq-page-header {
    height: 14rem;
  }
  #main-title-holder {
    top: 2.6rem;
    bottom: 2.6rem;
  }
  .gama-text-h1 {
    margin-bottom: 1.6rem;
    font-size: 3.5rem;
  }
  .gama-text-subtitle2 {
    font-size: 1.6rem;
  }
  #faq-data-container {
    margin-bottom: 4.8rem;
  }
  .v-expansion-panel-title {
    padding: 2.5rem 0 2.5rem 0;
  }
  .gama-text-button {
    font-size: 2.2rem;
  }
  .gama-text-body2 {
    font-size: 1.8rem;
  }
}
</style>