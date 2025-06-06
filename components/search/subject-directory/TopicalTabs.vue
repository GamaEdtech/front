<template>
  <div v-if="papers.items.length > 0" id="topicals-taps">
    <!-- Desktop Layout -->
    <v-row class="my-0 flex-col flex-md-row d-flex">
      <v-col>
        <v-list
          class="d-inline-flex flex-col flex-md-row align-center flex-wrap"
        >
          <v-list-item
            class="pa-0 d-inline-flex flex-row align-center"
            style="min-height: fit-content"
          >
            <v-list-item-icon style="padding-block: 0; margin-block: 0">
              <v-icon color="#667085" size="24">mdi-book-open-variant</v-icon>
            </v-list-item-icon>
            <v-list-item-content style="padding-block: 0; margin-block: 0">
              <v-list-item-title
                class="d-flex flex-row align-center gama-text-h6 font-weight-bold"
                >{{ papers.label }}</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
          <div class="container-topical-chip">
            <v-chip-group>
              <v-chip
                v-for="(paper, i) in papers.items"
                :key="i"
                class="white--text bg-primary-gray-700"
                small
              >
                <NuxtLink :to="`/paper/${paper.id}/${paper.title_url}`">
                  {{
                    paper.title.length > 50
                      ? paper.title.slice(0, 50) + "..."
                      : paper.title
                  }}
                </NuxtLink>
              </v-chip>
            </v-chip-group>
          </div>
        </v-list>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "TopicalTabs",
  props: {
    papers: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
};
</script>

<style>
#topicals-taps {
  .v-list-item__icon:first-child {
    margin-right: 12px !important;
  }

  .topical-icon {
    margin-right: 12px;
    color: #ffb600 !important;
  }
  .v-list-item__icon > i {
    color: #ffb600 !important;
  }

  .years-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
  }

  .year-label {
    color: #667085;
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }

  .papers-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .paper-chip {
    border-radius: 1rem;
    font-weight: 500;
  }
  .container-topical-chip {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }
  .v-chip-group .v-slide-group__content {
    flex-wrap: wrap !important;
  }
  .v-item-group > .v-slide-group__wrapper > .v-slide-group__content {
    flex-wrap: wrap !important;
  }
}
@media only screen and (min-width: 960px) and (max-width: 1264px) {
  .gama-text-h6 {
    font-style: normal;
    font-size: 1rem !important;
    font-weight: 700 !important;
    line-height: normal;
  }
}
</style>
