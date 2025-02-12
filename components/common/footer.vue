<template>
  <div>
    <v-footer v-if="!isPageToHideFooter">
      <v-container id="footer" class="px-0">
        <v-row>
          <v-col cols="12" sm="6" md="6" class="text-center text-sm-left">
            <nuxt-link to="/">
              <img
                id="logo"
                alt="gamatrain"
                src="/images/gamatrain-logo-black.svg"
              />
            </nuxt-link>
            <div id="short-describe" class="gama-text-body2">
              Our mission is to provide all training services to anyone and
              anywhere.
            </div>
            <div class="mt-4">
              <nuxt-link to="/" class="v-btn">
                <v-icon>mdi-twitter</v-icon>
              </nuxt-link>
              <nuxt-link to="/" class="v-btn">
                <v-icon> mdi-facebook </v-icon>
              </nuxt-link>
              <nuxt-link to="/" class="v-btn">
                <v-icon> mdi-instagram </v-icon>
              </nuxt-link>
            </div>
          </v-col>
          <v-col
            sm="3"
            md="3"
            class="d-none d-sm-block"
            v-for="(item, i) in footerLinks"
            :key="i"
          >
            <div class="link-title gama-text-button">
              {{ item.mainTitle }}
            </div>
            <nuxt-link
              v-for="link in item.subMenu"
              :key="link.link"
              :to="link.link"
              class="footer-link gama-text-body2"
            >
              {{ link.title }}
            </nuxt-link>
          </v-col>

          <v-col cols="12" class="d-block d-sm-none">
            <v-expansion-panels focusable flat id="mobile-footer-panels">
              <v-expansion-panel
                v-for="(item, i) in footerLinks"
                :key="i"
                style="border-bottom: 0.5px solid #424a53"
              >
                <v-expansion-panel-header class="link-title gama-text-button">{{
                  item.mainTitle
                }}</v-expansion-panel-header>
                <v-expansion-panel-content class="pt-4">
                  <nuxt-link
                    v-for="link in item.subMenu"
                    :key="link.link"
                    :to="link.link"
                    class="footer-link gama-text-body2"
                  >
                    {{ link.title }}
                  </nuxt-link>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
    <v-container fluid id="footer-copy-right" v-if="!isPageToHideFooter">
      <v-row>
        <v-col cols="12" class="pt-3 pb-1 text-center px-0">
          <span class="describe gama-text-overline"
            >All Right Reserved.Copyright @ 2023</span
          >
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isPageToHideFooter: this.$route.name === "admin",

      footerLinks: [
        {
          mainTitle: "We",
          subMenu: [
            {
              title: "About us",
              link: "/about-us",
            },
            {
              title: "Terms",
              link: "/terms",
            },
            {
              title: "FAQ",
              link: "/faq",
            },
          ],
        },
        {
          mainTitle: "Services",
          subMenu: [
            {
              title: "Paper",
              link: "/search?type=test",
            },
            {
              title: "School Finder",
              link: "/school-service",
            },
            {
              title: "Exam",
              link: "/search?type=azmoon",
            },
          ],
        },
      ],
    };
  },
};
</script>

<style>
#footer {
  margin-top: 4rem;
  padding-bottom: 5.2rem;

  #logo {
    width: 10.5996rem;
    height: 3.2rem;
    margin-bottom: 1.5rem;
  }

  #short-describe {
    color: #6e7781;
    margin-bottom: 1.2rem;
  }

  .v-btn {
    background-color: #ffb600;
    height: 2rem !important;
    width: 2rem !important;
    border-radius: 0.3125rem;
    margin: 0.1rem;

    .v-icon {
      font-size: 1.5rem;
      color: #fff;
    }
  }

  .link-title {
    color: #424a53;
    margin-bottom: 1rem;
  }

  .footer-link {
    display: block;
    text-decoration: none;
    margin-bottom: 1rem;
    color: #6e7781;
  }
}

#footer-copy-right {
  background: #24292f;
  padding-bottom: 0;

  .describe {
    color: #fff;
  }
}
</style>
