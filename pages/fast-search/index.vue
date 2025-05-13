<template>
  <fast-search-page
    :is-loading="isLoading"
    :book-image="bookImage"
    :breads="breads"
    :view-count="'28k'"
    :resources="resources"
    :papers="papers"
    :headers="headers"
    :combined-paper-items="combinedPaperItems"
    :timeline="timeline"
  />
</template>

<script>
import FastSearchPage from "@/components/search/fast-search/FastSearchPage.vue";

export default {
  auth: false,
  components: {
    FastSearchPage,
  },
  data() {
    return {
      isLoading: false,
      bookImage: require("@/assets/images/BiologyBook.png"),
      breads: [
        {
          text: "Past Paper",
          disabled: false,
          href: "/search?type=azmoon",
        },
        {
          text: "CIE",
          disabled: false,
          href: "/search?type=azmoon",
        },
        {
          text: "IGCSE",
          disabled: false,
          href: "/search?type=azmoon",
        },
        {
          text: "Biology (0610)",
          disabled: true,
          href: "/search?type=azmoon",
        },
      ],
      items: [
        {
          icon: "mdi-wifi",
          text: "Wifi",
        },
        {
          icon: "mdi-bluetooth",
          text: "Bluetooth",
        },
        {
          icon: "mdi-chart-donut",
          text: "Data Usage",
        },
      ],
      model: 1,
      resources: [
        {
          title: "Text book",
          link: "Science Learner′s Book 3 , Primary Checkpoint , Mathematics Learner′s Book 1 , Primary Checkpoint ",
          icon: "PaperIcon.svg",
        },
        {
          title: "Work book",
          link: "Mathematics Learner′s Book 1 , Primary Checkpoint ",
          icon: "ExamHub.svg",
        },
        {
          title: "Book Answer",
          link: "Mathematics Learner′s Book 1 , Primary Checkpoint ",
          icon: "QA.svg",
        },
        {
          title: "Study Guide",
          link: "Mathematics Learner′s Book 1 , Primary Checkpoint ",
          icon: "Guide.svg",
        },
      ],
      papers: {
        label: "Topical",
        icon: "Topical.svg",
        items: [
          "Paper1 2025",
          "Paper2 2025",
          "Paper3 2025",
          "Paper4 2025",
          "Paper5 2025",
          "Paper1 2024",
          "Paper2 2024",
          "Paper1 2023",
        ],
      },
      headers: [
        {
          text: "Classification",
          align: "start",
          sortable: true,
          value: "name",
          icon: "mdi-format-list-bulleted",
        },
        {
          text: "Year",
          align: "start",
          sortable: true,
          value: "year",
          icon: "mdi-format-list-bulleted",
        },
        {
          text: "Term",
          align: "start",
          sortable: true,
          value: "term",
          icon: "mdi-format-list-bulleted",
        },
        {
          text: "Download Files",
          sortable: false,
          value: "downloadFilesContains",
        },
        {
          text: "ExamHub",
          sortable: false,
          value: "examHubIcon",
        },
      ],
      papersItemsTable: {
        theme: {
          huedItems: [
            {
              name: "Paper 11 Oct Nov 2024",
              year: 2025,
              term: "term1",
              downloadFilesContains: {
                qp: false,
                ms: true,
                sf: false,
                in: true,
              },
            },
            {
              name: "Paper 23 Oct Nov 2024",
              year: 2025,
              term: "term1",
              downloadFilesContains: {
                qp: false,
                ms: true,
                sf: true,
                in: false,
              },
            },
            {
              name: "Paper 31 Oct Nov 2024",
              year: 2025,
              term: "term1",
              downloadFilesContains: {
                qp: true,
                ms: true,
                sf: false,
                in: true,
              },
            },
            {
              name: "Paper 11 May Jun 2024",
              year: 2025,
              term: "term1",
              downloadFilesContains: {
                qp: false,
                ms: true,
                sf: false,
                in: true,
              },
            },
            {
              name: "Paper 23 May Jun 2024",
              year: 2025,
              term: "term1",
              downloadFilesContains: {
                qp: false,
                ms: true,
                sf: true,
                in: false,
              },
            },
            {
              name: "Paper 31 May Jun 2024",
              year: 2025,
              term: "term1",
              downloadFilesContains: {
                qp: true,
                ms: true,
                sf: false,
                in: true,
              },
            },

            {
              name: "Paper 1",
              year: 2025,
              term: "term1",
              downloadFilesContains: {
                qp: false,
                ms: true,
                sf: false,
                in: true,
              },
            },
            {
              name: "Paper 2",
              year: 2025,
              term: "term1",
              downloadFilesContains: {
                qp: false,
                ms: true,
                sf: true,
                in: false,
              },
            },
            {
              name: "Paper 3",
              year: 2025,
              term: "term1",
              downloadFilesContains: {
                qp: true,
                ms: true,
                sf: false,
                in: true,
              },
            },
          ],
          blackAndWhite: [
            {
              name: "Paper 1",
              year: 2025,
              term: "term1",
              downloadFilesContains: {
                qp: false,
                ms: true,
                sf: false,
                in: true,
              },
            },
            {
              name: "Paper 2",
              year: 2025,
              term: "term1",
              downloadFilesContains: {
                qp: false,
                ms: true,
                sf: true,
                in: false,
              },
            },
            {
              name: "Paper 3",
              year: 2025,
              term: "term1",
              disable: true,
              downloadFilesContains: {
                qp: true,
                ms: true,
                sf: false,
                in: true,
              },
            },
            {
              name: "Paper 1",
              year: 2025,
              term: "term1",
              downloadFilesContains: {
                qp: false,
                ms: true,
                sf: false,
                in: true,
              },
            },
            {
              name: "Paper 2",
              year: 2025,
              term: "term1",
              downloadFilesContains: {
                qp: false,
                ms: true,
                sf: true,
                in: false,
              },
            },
            {
              name: "Paper 3",
              year: 2025,
              term: "term1",
              disable: true,
              downloadFilesContains: {
                qp: true,
                ms: true,
                sf: false,
                in: true,
              },
            },
          ],
        },
      },
      timeline: [
        {
          year: 2024,
          months: ["Oct", "Nov", "Mar", "JUN", "Mar"],
        },
        {
          year: 2023,
          months: ["Oct", "Nov", "May", "JUN"],
        },
      ],
    };
  },
  computed: {
    tableItems() {
      return Object.entries(this.papersItemsTable.theme).map(
        ([, value]) => value
      );
    },
    combinedPaperItems() {
      // Get huedItems and add theme property
      const huedItems = this.papersItemsTable.theme.huedItems.map((item) => ({
        ...item,
        theme: "huedItems",
      }));

      // Get blackAndWhite items and add theme property
      const blackAndWhiteItems = this.papersItemsTable.theme.blackAndWhite.map(
        (item) => ({
          ...item,
          theme: "blackAndWhite",
        })
      );

      // Combine both arrays
      return [...huedItems, ...blackAndWhiteItems];
    },
  },
  mounted() {
    // setTimeout(() => {
    //   this.isLoading = false;
    // }, 1500);
  },
};
</script>
