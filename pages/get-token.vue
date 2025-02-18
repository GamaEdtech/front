<template>
  <div>
    <v-container fluid id="service-page-header">
      <div class="overlay"></div>

      <v-container>
        <v-row>
          <v-col cols="12">
            <div id="main-title-holder">
              <h1 class="gama-text-h2">GET Token is Comming Soon</h1>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-container>

    <v-container id="get-token-page">
      <v-row>
        <v-col cols="12">
          <v-card flat>
            <v-card-text>
              <h2 class="gama-text-h4">GET Tokenomics</h2>
              <ul class="gama-text-body1">
                <li class="font-weight-bold">10 billion GET</li>
                <li>
                  <span class="font-weight-bold">Allocation:</span>
                  <ul>
                    <li>
                      <span class="font-weight-bold grey--text text--darken-3"
                        >70% Governance (7B GET)</span
                      >
                    </li>
                    <ul class="gama-text-body2">
                      <li>
                        <span class="font-weight-bold grey--text text--darken-2"
                          >Students</span
                        >
                        - Earn for using the system
                      </li>
                      <li>
                        <span class="font-weight-bold grey--text text--darken-2"
                          >Teachers</span
                        >
                        - Rewarded for adding content
                      </li>
                      <li>
                        <span class="font-weight-bold grey--text text--darken-2"
                          >Developers</span
                        >
                        - Contribute to system development
                      </li>
                      <li>
                        <span class="font-weight-bold grey--text text--darken-2"
                          >Other Community Members</span
                        >
                        - Promote on YouTube, LinkedIn, X, etc.
                      </li>
                    </ul>
                    <li>
                      <span class="font-weight-bold grey--text text--darken-3"
                        >20% Team (2B GET)</span
                      >
                    </li>
                    <li>
                      <span class="font-weight-bold grey--text text--darken-3"
                        >10% Liquidity (1B GET)</span
                      >
                    </li>
                  </ul>
                </li>
                <li class="font-weight-bold primary--text">
                  <a
                    href="https://solscan.io/token/GeutGuhcTYRf4rkbZmWDMEgjt5jHyJN4nHko38GJjQhv"
                    target="_blank"
                  >
                    See GET on SolScan
                  </a>
                </li>
              </ul>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-container fluid id="service-informed-choices">
      <v-container>
        <v-row>
          <v-col cols="12" md="6" class="order-last order-md-first">
            <h2 class="gama-text-h4 white--text">
              Token Lock & Release Schedule
            </h2>
            <ul class="gama-text-body1 white--text">
              <li>
                <span class="font-weight-bold">Team Share Lock</span>: Locked in
                <a
                  href="https://lock.jup.ag"
                  target="_blank"
                  class="primary--text"
                  >https://lock.jup.ag</a
                >
                for 5 years.
              </li>
              <li>
                <span class="font-weight-bold">Governance Lock:</span>
                Locked for 10 years, with 700M GET released annually for
                governance participants.
              </li>
            </ul>
          </v-col>
          <v-col cols="12" md="6">
            <v-img
              src="/images/token-lock.webp"
              alt="Token Lock & Release Schedule"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-container>

    <v-container id="service-extensive-database">
      <v-row>
        <v-col cols="12" md="6"> </v-col>
        <v-col cols="12" md="6">
          <h2 class="gama-text-h4">Profit Distribution & Buyback Mechanism</h2>

          <ul class="gama-text-body1">
            <li>
              After covering platform costs
              <span class="font-weight-bold"
                >(servers, development, maintenance, content team, and
                taxes)</span
              >, all remaining profits go towards buying back GET tokens.
            </li>
            <li>
              <span class="font-weight-bold">
                Bought-back GET tokens are distributed among governance members
                based
              </span>
              on their activity and contributions.
            </li>
          </ul>
        </v-col>
      </v-row>
    </v-container>

    <v-container fluid class="black">
      <v-row>
        <v-col cols="12" md="12">
          <!-- Prepare a div in your <body> for Terminal to render -->
          <!-- Adjust the width and height to suit your requirements -->
          <div
            id="integrated-terminal"
            class="mx-auto mt-10"
            style="width: 400px; height: 400px"
          ></div>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-container>
        <v-row>
          <v-col cols="12" md="12">
            <iframe
              width="100%"
              height="500"
              src="https://birdeye.so/tv-widget/GeutGuhcTYRf4rkbZmWDMEgjt5jHyJN4nHko38GJjQhv?chain=solana&viewMode=pair&chartInterval=1D&chartType=Candle&chartTimezone=Etc%2FUTC&chartLeftToolbar=show&theme=dark"
              frameborder="0"
              allowfullscreen
            >
            </iframe>
          </v-col>
        </v-row>
      </v-container>
    </v-container>

    <v-container fluid id="service-education-future">
      <v-row>
        <v-col cols="12" md="12">
          <p class="gama-text-h4">Join the Future of Education Today!</p>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: "GET Token",
      script: [
        {
          src: `https://terminal.jup.ag/main-v3.js`,
          defer: true,
        },
      ],
    };
  },
  auth: false,
  mounted() {
    this.$nextTick(() => {
      if (typeof window !== "undefined")
        window.Jupiter.init({
          displayMode: "integrated",
          integratedTargetId: "integrated-terminal",
          defaultExplorer: "Solscan",
          endpoint:
            "https://indulgent-cosmological-sailboat.solana-mainnet.quiknode.pro/3e2900150853164fcd9b1e055aaef070f28b04ac",
          formProps: {
            swapMode: "ExactIn",
            initialOutputMint: "GeutGuhcTYRf4rkbZmWDMEgjt5jHyJN4nHko38GJjQhv",
          },
        });
    });
  },
};
</script>

<style scoped>
#service-page-header {
  height: 60rem;
  background: url("/images/get-token-page-header.webp");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 250%;
  position: relative;

  .overlay {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 40%;
    background: linear-gradient(
      180deg,
      #000 0%,
      #000 0%,
      #000 0.33%,
      rgba(0, 0, 0, 0) 100%
    );
  }

  #main-title-holder {
    position: absolute;
    margin: auto;
    left: 0;
    right: 0;
    bottom: 4.7rem;
    border-radius: 0.625rem;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(7.5px);
    width: 31.2rem;
    height: 19.1rem;
    padding: 1.6rem 2.4rem 1.6rem 2.4rem;

    > h1 {
      color: #fff;
      text-align: center;
    }
  }
}

#get-token-page {
  padding-top: 4.6rem;
  padding-bottom: 3.2rem;

  .gama-text-h4 {
    margin-bottom: 2.4rem;
  }
}

#service-informed-choices {
  background: #24292f;
  height: 66rem;
  padding-top: 1.8rem;
  padding-bottom: 1.8rem;

  .gama-text-h4 {
    margin-bottom: 2.4rem;
  }

  .v-image {
    margin: auto auto 2.4rem auto;
    width: 31.2rem;
    height: 20rem;
    border-radius: 1rem;
  }
}

#service-extensive-database {
  height: 54rem;
  padding-top: 4.8rem;
  padding-bottom: 4.8rem;

  .gama-text-h4 {
    margin-bottom: 1.6rem;
  }

  .v-image {
    border-radius: 1rem;
    margin: auto auto;
    width: 31.2rem;
    height: 20rem;
    border-radius: 1rem;
  }
}

#service-friendly-interface {
  height: 880rem;
  background: #f4f4f4;
  padding-top: 4.8rem;
  padding-bottom: 4.8rem;

  .gama-text-h4 {
    margin-bottom: 2.4rem;
  }
}

#service-detailed-insights {
  height: 60rem;
  padding-top: 4.8rem;
  padding-bottom: 4.8rem;

  .gama-text-h4 {
    margin-bottom: 2.4rem;
  }

  .v-image {
    margin: auto auto 2.4rem auto;
    width: 31.2rem;
    height: 20rem;
    border-radius: 1rem;
  }
}

#service-real-reviews {
  height: 64rem;
  background: #f4f4f4;
  padding-top: 4.8rem;
  padding-bottom: 4.8rem;

  .gama-text-h4 {
    margin-bottom: 2.4rem;
  }

  .v-image {
    margin: auto auto 2.4rem auto;
    width: 31.2rem;
    height: 20rem;
    border-radius: 1rem;
  }
}

#service-save-favorites {
  height: 60rem;
  padding-top: 4.8rem;
  padding-bottom: 4.8rem;

  .gama-text-h4 {
    margin-bottom: 2.4rem;
  }

  .v-image {
    margin: auto;
    width: 31.2rem;
    height: 20rem;
    border-radius: 1rem;
    margin-bottom: 2.4rem;
  }
}

#service-personalized {
  height: 60rem;
  background: #f4f4f4;
  padding-top: 4.8rem;
  padding-bottom: 4.8rem;

  .gama-text-h4 {
    margin-bottom: 2.4rem;
  }

  .v-image {
    margin: auto;
    width: 31.2rem;
    height: 20rem;
    border-radius: 1rem;
  }
}

#service-education-future {
  height: 8rem;
  background: #ffb600;
  text-align: center;
  padding: 0;

  .col-12 {
    padding: 1.1rem 6.5rem 1.1rem 6.5rem !important;
  }
}

@media only screen and (min-width: 600px) {
  #service-page-header {
    height: 44rem;
    background-size: 100% 100%;

    #main-title-holder {
      bottom: 10rem;
      border-radius: 0.625rem;
      width: 54.4rem;
      height: 16rem;
      padding: 2.4rem 2.4rem 2.4rem 2.4rem;
    }
  }

  #service-informed-choices {
    background: #24292f;
    height: 51.6rem;
    padding-top: 4.8rem;
    padding-bottom: 4.8rem;

    .gama-text-h4 {
      margin-bottom: 1.6rem;
    }
  }

  #service-extensive-database {
    height: 51.6rem;
  }

  #service-friendly-interface {
    height: 51.6rem;

    .gama-text-h4 {
      margin-bottom: 1.6rem;
    }
  }

  #service-detailed-insights {
    height: 51.6rem;

    .gama-text-h4 {
      margin-bottom: 1.6rem;
    }
  }

  #service-real-reviews {
    height: 51.6rem;

    .gama-text-h4 {
      margin-bottom: 1.6rem;
    }
  }

  #service-save-favorites {
    height: 51.6rem;

    .gama-text-h4 {
      margin-bottom: 1.6rem;
    }
  }

  #service-personalized {
    height: 51.6rem;

    .gama-text-h4 {
      margin-bottom: 1.6rem;
    }
  }

  #service-education-future {
    height: 8rem;
    background: #ffb600;
    text-align: center;
    padding: 0;

    .col-12 {
      padding: 2.5rem 0 2.5rem 0 !important;
    }
  }
}

@media only screen and (min-width: 960px) {
  #service-page-header {
    height: 51.2rem;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100%;
    position: relative;

    #main-title-holder {
      position: absolute;
      margin: auto;
      left: 0;
      right: 0;
      bottom: 10rem;
      border-radius: 0.625rem;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(7.5px);
      width: 73rem;
      height: 16.6rem;
      padding: 2.5rem 4.8rem 2.5rem 4.8rem;

      > h1 {
        color: #fff;
        text-align: center;
      }
    }
  }

  #get-token-page {
    height: 48rem;
    padding-top: 10rem;
  }

  #service-informed-choices {
    background: #24292f;
    height: 46rem;
    padding-top: 10rem;
    padding-bottom: 10rem;

    .title {
      margin-bottom: 2.4rem;
    }

    .describe {
      color: #fff;
      font-size: 1.8rem;
      font-style: normal;
      font-weight: 500;
      line-height: 3rem;
    }

    .v-image {
      margin: auto;
      width: 40.56rem;
      height: 26rem;
      border-radius: 1rem;
    }
  }

  #service-extensive-database {
    height: 46rem;
    padding-top: 10rem;
    padding-bottom: 10rem;

    .v-image {
      margin: auto auto;
      width: 40.6rem;
      height: 26rem;
    }
  }

  #service-friendly-interface {
    height: 80rem;
    background: #f4f4f4;
    padding-top: 10rem;
    padding-bottom: 10rem;
  }

  #service-detailed-insights {
    height: 46rem;
    padding-top: 10rem;
    padding-bottom: 10rem;

    .v-image {
      margin: auto;
      width: 40.56rem;
      height: 26rem;
      border-radius: 1rem;
    }
  }

  #service-real-reviews {
    height: 46rem;
    background: #f4f4f4;
    padding-top: 10rem;
    padding-bottom: 10rem;

    .v-image {
      margin: auto;
      width: 40.6rem;
      height: 26rem;
      border-radius: 1rem;
    }
  }

  #service-save-favorites {
    height: 46rem;
    padding-top: 10rem;
    padding-bottom: 10rem;

    .v-image {
      margin: auto;
      width: 40.56rem;
      height: 26rem;
      border-radius: 1rem;
    }
  }

  #service-personalized {
    height: 46rem;
    background: #f4f4f4;
    padding-top: 10rem;
    padding-bottom: 10rem;

    .v-image {
      margin: auto;
      width: 40.6rem;
      height: 26rem;
      border-radius: 1rem;
    }
  }

  #service-education-future {
    height: 10rem;
    background: #ffb600;
    text-align: center;

    .col-12 {
      padding: 3.2rem 0 3.2rem 0 !important;
    }
  }
}
</style>
