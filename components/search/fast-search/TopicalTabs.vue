<template>
  <div>
    <!-- Desktop Layout -->
    <v-row class="my-0 flex-col flex-md-row d-none d-sm-flex">
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
          <v-list-item
            class="pa-0"
            style="min-height: fit-content; justify-content: space-evenly"
          >
            <v-chip-group>
              <v-chip
                v-for="(paper, i) in papers.items"
                :key="i"
                class="white--text bg-primary-gray-700"
                small
              >
                {{ paper }}
              </v-chip>
            </v-chip-group>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>

    <!-- Mobile Layout -->
    <div class="d-sm-none mb-4">
      <div class="d-flex align-center topical-header">
        <v-icon color="#667085" size="24" class="topical-icon"
          >mdi-book-open-variant</v-icon
        >
        <span class="gama-text-h6 font-weight-bold">{{ papers.label }}</span>
      </div>

      <div class="years-container">
        <div v-for="(year, index) in years" :key="index" class="year-section">
          <div class="year-label">{{ year.year }}</div>
          <div class="papers-container">
            <v-chip
              v-for="(paper, i) in year.papers"
              :key="i"
              class="white--text bg-primary-gray-700 paper-chip"
              small
            >
              {{ paper }}
            </v-chip>
          </div>
        </div>
      </div>
    </div>
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
    return {
      years: [
        {
          year: "2024",
          papers: ["Paper1", "Paper2", "Paper3"],
        },
        {
          year: "2023",
          papers: ["Paper1", "Paper2"],
        },
        {
          year: "2022",
          papers: ["Paper1", "Paper2"],
        },
      ],
    };
  },
};
</script>

<style scoped>
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
@media only screen and (min-width: 960px) and (max-width: 1264px){
  .gama-text-h6 {
    font-style: normal;
    font-size: 1rem  !important;
    font-weight: 700 !important;
    line-height: normal;
  }
}
.gama-text-h3,
.gama-text-h6 {
  color: #667085 !important;
}
</style> 