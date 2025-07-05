<template>
  <div class="w-100 d-flex justify-center align-center flex-wrap ga-4">
    <template v-for="(filter, index) in filters">
      <v-btn
        append-icon="mdi-chevron-down"
        :class="`text-h5 ${
          filter.isOpenModal || filter.selectedItem ? `open-style-btn` : ``
        }`"
        variant="outlined"
        rounded="xl"
        value="board"
        :disabled="filter.disabled"
        @click="filter.isOpenModal = !filter.isOpenModal"
      >
        {{ filter.selectedItem ? filter.selectedItem.title : filter.title }}
      </v-btn>

      <search-select-dialog
        :titleModal="filter.title"
        :items="filter.items"
        v-model:showDialog="filter.isOpenModal"
        :selectedItem="filter.selectedItem"
        @changeSelectedItem="onFilterUpdate($event, filter.title)"
      />
    </template>
  </div>
</template>

<script setup>
import { onMounted, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const FILTER_INDEX = {
  Board: 0,
  Grade: 1,
  Subject: 2,
  Topic: 3,
  Type: 4,
  Classification: 5,
  Year: 6,
  Month: 7,
};
const FILTER_TYPE = {
  Board: "section",
  Grade: "base",
  Subject: "lesson",
  Topic: "topic",
  Type: "type",
  Classification: "classification",
  Year: "edu_year",
  Month: "edu_month",
};
const filters = reactive([
  {
    items: [],
    selectedItem: null,
    isOpenModal: false,
    title: "Board",
    disabled: false,
    loading: false,
  },
  {
    items: [],
    selectedItem: null,
    isOpenModal: false,
    title: "Grade",
    disabled: true,
    loading: false,
  },
  {
    items: [],
    selectedItem: null,
    isOpenModal: false,
    title: "Subject",
    disabled: true,
    loading: false,
  },
  {
    items: [],
    selectedItem: null,
    isOpenModal: false,
    title: "Topic",
    disabled: true,
    loading: false,
  },
  {
    items: [
      {
        title: "Past Papers",
        id: "101",
        hasClassification: true,
        typeForGetClassification: "test_type",
        typeForGetContent: "test",
      },
      {
        title: "Multimedia",
        id: "102",
        hasClassification: true,
        typeForGetClassification: "content_type",
        typeForGetContent: "learnfiles",
      },
      {
        title: "QuizHub",
        id: "103",
        hasClassification: true,
        typeForGetClassification: "test_type",
        typeForGetContent: "azmoon",
      },
      {
        title: "Forum",
        id: "104",
        hasClassification: false,
        typeForGetClassification: null,
        typeForGetContent: "question",
      },
      {
        title: "Tutorial",
        id: "105",
        hasClassification: false,
        typeForGetClassification: null,
        typeForGetContent: "dars",
      },
    ],
    selectedItem: null,
    isOpenModal: false,
    title: "Type",
    disabled: false,
    loading: false,
  },
  {
    items: [],
    selectedItem: null,
    isOpenModal: false,
    title: "Classification",
    disabled: true,
    loading: false,
  },
  {
    items: [
      {
        id: "2025",
        title: "2025",
      },
      {
        id: "2024",
        title: "2024",
      },
      {
        id: "2023",
        title: "2023",
      },
      {
        id: "2022",
        title: "2022",
      },
      {
        id: "2021",
        title: "2021",
      },
      {
        id: "2020",
        title: "2020",
      },
      {
        id: "2019",
        title: "2019",
      },
      {
        id: "2018",
        title: "2018",
      },
      {
        id: "2017",
        title: "2017",
      },
      {
        id: "2016",
        title: "2016",
      },
      {
        id: "2015",
        title: "2015",
      },
      {
        id: "2014",
        title: "2014",
      },
      {
        id: "2013",
        title: "2013",
      },
    ],
    selectedItem: null,
    isOpenModal: false,
    title: "Year",
    disabled: true,
    loading: false,
  },
  {
    items: [
      { id: 1, title: "January" },
      { id: 2, title: "February" },
      { id: 3, title: "March" },
      { id: 4, title: "April" },
      { id: 5, title: "May" },
      { id: 6, title: "June" },
      { id: 7, title: "July" },
      { id: 8, title: "August" },
      { id: 9, title: "September" },
      { id: 10, title: "October" },
      { id: 11, title: "November" },
      { id: 12, title: "December" },
    ],
    selectedItem: null,
    isOpenModal: false,
    title: "Month",
    disabled: true,
    loading: false,
  },
]);

const updateClassificationFilter = async () => {
  resetFilters(FILTER_INDEX.Classification, 6);
  if (filters[FILTER_INDEX.Type].selectedItem.hasClassification) {
    const response = await getInformationNextFilter(
      "Board",
      filters[FILTER_INDEX.Type].selectedItem.typeForGetClassification
    );
    if (response.data) {
      filters[FILTER_INDEX.Classification].items = response.data;
      filters[FILTER_INDEX.Classification].disabled = false;
    }
  } else {
    filters[FILTER_INDEX.Classification].disabled = true;
  }
};

const updateStatusMonthYearFilter = () => {
  if (
    filters[FILTER_INDEX.Type].selectedItem &&
    filters[FILTER_INDEX.Type].selectedItem.title == "Past Papers"
  ) {
    filters[FILTER_INDEX.Year].disabled = false;
    filters[FILTER_INDEX.Month].disabled = false;
  } else {
    filters[FILTER_INDEX.Year].selectedItem = null;
    filters[FILTER_INDEX.Year].disabled = true;
    filters[FILTER_INDEX.Month].selectedItem = null;
    filters[FILTER_INDEX.Month].disabled = true;
  }
};

const onFilterUpdate = async (item, filterName) => {
  const index = FILTER_INDEX[filterName];
  if (item.id && item.id != filters[index]?.selectedItem?.id) {
    filters[index].selectedItem = item;
    filters[index].isOpenModal = false;

    if (index == FILTER_INDEX.Board || index == FILTER_INDEX.Type) {
      if (
        filters[FILTER_INDEX.Board].selectedItem &&
        filters[FILTER_INDEX.Type].selectedItem
      ) {
        await updateClassificationFilter();
      }
      updateStatusMonthYearFilter();
    }

    if (index < FILTER_INDEX.Type) {
      resetFilters(index + 1, 4);
    }
    if (index < FILTER_INDEX.Topic) {
      const typeNextFilter = FILTER_TYPE[filters[index + 1].title];
      const response = await getInformationNextFilter(
        filterName,
        typeNextFilter
      );
      if (response.data) {
        filters[index + 1].items = response.data;
        filters[index + 1].disabled = false;
      }
    }

    updateQueryParam();
  }
};

const resetFilters = (startIndexFilter, endInexFilter) => {
  for (let index = startIndexFilter; index < endInexFilter; index++) {
    filters[index].items = [];
    filters[index].selectedItem = null;
    filters[index].disabled = true;
  }
};

const getInformationNextFilter = async (filterName, typeFilter) => {
  try {
    let params = { type: typeFilter };

    const keyParams = FILTER_TYPE[filterName] + "_id";
    const indexFilter = FILTER_INDEX[filterName];

    params[keyParams] = filters[indexFilter].selectedItem.id;
    const response = await $fetch(`/api/v1/types/list`, { params });
    return response;
  } catch (error) {
    console.log("error", error);
    return error;
  }
};

const updateQueryParam = () => {
  const query = {};
  filters.forEach((filter, index) => {
    const key = FILTER_TYPE[filter.title];
    if (filter.selectedItem && filter.selectedItem.id) {
      if (index == FILTER_INDEX.Classification) {
        if (
          filters[FILTER_INDEX.Type].selectedItem.typeForGetClassification ==
          "test_type"
        ) {
          query["test_type"] = filter.selectedItem.id;
        } else if (
          filters[FILTER_INDEX.Type].selectedItem.typeForGetClassification ==
          "content_type"
        ) {
          query["content_type"] = filter.selectedItem.id;
        }
      } else if (index == FILTER_INDEX.Type) {
        query[key] = filter.selectedItem.typeForGetContent;
      } else {
        query[key] = filter.selectedItem.id;
      }
    }
  });

  router.replace({ query });
};

const applyRouteToFilter = (index, queryKey, customId = null) => {
  const filter = filters[index];
  const key = queryKey || FILTER_TYPE[filter.title];
  const queryValue = customId || route.query[key];
  if (queryValue) {
    const found = filter.items.find(
      (item) => item.id == queryValue || item.typeForGetContent == queryValue
    );
    if (found) filter.selectedItem = found;
  }
};

const updateFiltersExistInRoute = async () => {
  const boardResponse = await getBoardData();
  if (boardResponse.data) {
    filters[FILTER_INDEX.Board].items = boardResponse.data;
    filters[FILTER_INDEX.Board].disabled = false;
    applyRouteToFilter(FILTER_INDEX.Board, FILTER_TYPE.Board);
  }

  for (let index = FILTER_INDEX.Grade; index <= FILTER_INDEX.Topic; index++) {
    if (filters[index - 1].selectedItem) {
      const typeNextFilter = FILTER_TYPE[filters[index].title];
      const response = await getInformationNextFilter(
        filters[index - 1].title,
        typeNextFilter
      );
      if (response.data) {
        filters[index].items = response.data;
        filters[index].disabled = false;
        applyRouteToFilter(index, FILTER_TYPE[filters[index].title]);
      }
    }
  }

  const typeFilter = filters[FILTER_INDEX.Type];
  applyRouteToFilter(FILTER_INDEX.Type, FILTER_TYPE.Type);
  if (typeFilter.selectedItem?.title === "Past Papers") {
    filters[FILTER_INDEX.Year].disabled = false;
    filters[FILTER_INDEX.Month].disabled = false;
  }

  [FILTER_INDEX.Year, FILTER_INDEX.Month].forEach((index) => {
    applyRouteToFilter(index, FILTER_TYPE[filters[index].title]);
  });

  if (filters[FILTER_INDEX.Board].selectedItem && typeFilter.selectedItem) {
    filters[FILTER_INDEX.Classification].disabled = false;
    const classResponse = await getInformationNextFilter(
      "Board",
      typeFilter.selectedItem.typeForGetClassification
    );
    if (classResponse.data) {
      filters[FILTER_INDEX.Classification].items = classResponse.data;
      const id = route.query["test_type"] || route.query["content_type"];
      applyRouteToFilter(
        FILTER_INDEX.Classification,
        id ? null : FILTER_TYPE.Classification,
        id
      );
    }
  }
};

const getBoardData = async () => {
  try {
    let params = { type: "section" };
    const response = await $fetch(`/api/v1/types/list`, { params });
    return response;
  } catch (error) {
    console.log("error", error);
    return error;
  }
};

onMounted(async () => {
  await updateFiltersExistInRoute();
});
</script>

<style scoped>
.open-style-btn {
  background-color: #fff8e8;
  border: 1px solid #ffebb9;
}
</style>
