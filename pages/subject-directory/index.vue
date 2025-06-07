<template>
  <fast-search-page
    :is-loading="isLoading"
    :book-image="bookImage"
    :breads="breads"
    :view-count="'28k'"
    :resources="resources"
    :papers="papersTopical"
    :headers="headers"
    :papersItemsTable="papersItemsTable"
    :timeline="timeline"
    :loadingTopSection="loadingTopSection"
    :loadingDataTable="loadingDataTable"
    @search-results="onSearchResult"
    @result-papers="onSearchPaper"
    @board-change="onChangeBoard"
    @grade-change="onGradeChange"
    @subject-change="onSubjectChange"
    @change-book-image="changeBookImage"
    @loading-table-change="onChangeLoadingTable"
    @loading-top-section-change="onChangeLoadingTopSection"
  />
</template>

<script>
import FastSearchPage from "~/components/search/subject-directory/FastSearchPage.vue";
import moment from "moment";

export default {
  auth: false,
  components: {
    FastSearchPage,
  },
  async asyncData({ params, query, $axios }) {
    const result = {
      isLoading: true,
      bookImage: null,
      searchResults: null,
      papersResults: null,
      resources: [],
      papersTopical: {
        label: "Topical",
        icon: "Topical.svg",
        items: [],
      },
      papersItemsTable: [],
      loadingTopSection: true,
      loadingDataTable: true,
      lessonTitle: "",
    };

    const subjectId = params.subject || query.subject;

    if (subjectId) {
      try {
        const baseURL = process.server
          ? `https://core.gamatrain.com/api/v1/`
          : `api/v1/`;
        let endpointTopSectionData = `${baseURL}tests/search?is_paper=false&directory=true&lesson=${subjectId}`;
        let endpointPapers = `${baseURL}tests/search?lesson=${subjectId}&page=1&perpage=20&is_paper=true&directory=true`;
        const response = await $axios.get(endpointTopSectionData);
        const responsePapers = await $axios.get(endpointPapers);

        result.searchResults = response.data;
        result.papersResults = responsePapers.data;
        result.isLoading = false;
        result.lessonTitle = result.searchResults.data.lesson_title
          ? result.searchResults.data.lesson_title
          : "";

        if (
          result.searchResults &&
          result.searchResults.data &&
          result.searchResults.data.list &&
          result.searchResults.data.list.length > 0 &&
          result.searchResults.data.lesson_pic
        ) {
          result.bookImage = result.searchResults.data.lesson_pic;
        } else {
          result.bookImage = null;
        }

        if (result.searchResults?.data?.list) {
          result.resources = result.searchResults.data.list;
          const filterTopical = result.resources.filter(
            (item) => item.title === "Topical"
          );
          if (filterTopical.length > 0) {
            result.papersTopical.items = filterTopical[0].items;
          }
        }

        if (result.papersResults?.data?.list) {
          result.papersItemsTable = result.papersResults.data.list;
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        result.isLoading = false;
      } finally {
        result.loadingDataTable = false;
        result.loadingTopSection = false;
      }
    }

    return result;
  },
  head() {
    return {
      titleTemplate: "%s",
      title: `${this.lessonTitle} Past Papers, Resources | Coursebook & Workbook – Free PDFs`,

      meta: [
        {
          hid: "apple-mobile-web-app-title",
          name: "apple-mobile-web-app-title",
          content: `${this.lessonTitle} Past Papers, Resources | Coursebook & Workbook – Free PDFs`,
        },
        {
          hid: "og:title",
          name: "og:title",
          content: `${this.lessonTitle} Past Papers, Resources | Coursebook & Workbook – Free PDFs`,
        },
        {
          hid: "og:site_name",
          name: "og:site_name",
          content: "GamaTrain",
        },
        {
          hid: "description",
          name: "description",
          content: `Download free PDF resources for ${this.lessonTitle}, including coursebook, workbook, study guide, and past papers with mark schemes. Updated for 2024 & 2025 exams.`,
        },
        {
          hid: "og:description",
          name: "og:description",
          content: `Download free PDF resources for ${this.lessonTitle}, including coursebook, workbook, study guide, and past papers with mark schemes. Updated for 2024 & 2025 exams.`,
        },
      ],
    };
  },
  data() {
    return {
      isLoading: true,
      breads: [
        {
          text: "Subject Directory",
          disabled: true,
          href: "/search?type=test",
          name: "type",
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
      timeline: [],
      selectedBoard: null,
      selectedGrade: null,
      selectedSubject: null,
    };
  },
  beforeMount() {
    if (this.papersItemsTable.length > 0) {
      this.generateTimeLine(false);
    }
  },
  methods: {
    onSearchResult(data) {
      this.resources = data.data.list ? data.data.list : [];
      this.lessonTitle = data.data.lesson_title ? data.data.lesson_title : "";

      const filterTopical = this.resources.filter(
        (item) => item.title == `Topical`
      );
      if (filterTopical && filterTopical.length > 0) {
        this.papersTopical.items = filterTopical[0].items;
      }
    },
    onSearchPaper(data, isContinuePreviousSubject) {
      if (data.data && data.data.list) {
        if (isContinuePreviousSubject) {
          this.papersItemsTable = [...this.papersItemsTable, ...data.data.list];
        } else {
          this.papersItemsTable = data.data.list;
        }
        this.generateTimeLine(isContinuePreviousSubject);
      }
    },
    generateTimeLine(isContinuePreviousSubject) {
      if (!isContinuePreviousSubject) {
        this.timeline = [];
      }
      if (!this.papersItemsTable || this.papersItemsTable.length === 0) {
        this.timeline = [];
        return;
      }
      const sortedItems = [...this.papersItemsTable].sort((a, b) => {
        const yearDiff = parseInt(b.edu_year) - parseInt(a.edu_year);
        if (yearDiff !== 0) return yearDiff;
        return parseInt(b.edu_month) - parseInt(a.edu_month);
      });

      const timelineMap = {};
      let positionCounter = 0;
      sortedItems.forEach((item) => {
        const year = parseInt(item.edu_year);
        const monthNumber = parseInt(item.edu_month);
        const month = moment()
          .month(monthNumber - 1)
          .format("MMM");

        if (!timelineMap[year]) {
          timelineMap[year] = { months: new Set(), positions: [] };
        }

        if (!timelineMap[year].months.has(month)) {
          timelineMap[year].positions.push(positionCounter);
        }

        timelineMap[year].months.add(month);
        positionCounter++;
      });

      this.timeline = Object.keys(timelineMap)
        .sort((a, b) => b - a)
        .map((year) => ({
          year: parseInt(year),
          months: Array.from(timelineMap[year].months),
          positions: timelineMap[year].positions,
        }));
    },
    onChangeBoard(board) {
      const newBoard = {
        text: board.name ? board.name : board.title,
        disabled: true,
        href: `/search?type=test&section=${board.id}`,
        name: "board",
      };
      this.selectedBoard = board;
      this.breads = this.breads.filter((item) => item.name == "type");
      this.breads.push(newBoard);
    },
    onGradeChange(grade) {
      if (grade) {
        const newGrade = {
          text: grade.name,
          disabled: true,
          href: this.selectedBoard
            ? `/search?type=test&section=${this.selectedBoard.id}&base=${grade.id}`
            : `/search?type=test`,
          name: "grade",
        };
        this.selectedGrade = grade;
        this.breads = this.breads.filter(
          (item) => item.name == "type" || item.name == "board"
        );
        this.breads.push(newGrade);
      }
    },
    onSubjectChange(subject) {
      if (subject) {
        const newSubject = {
          text: subject.name,
          disabled: true,
          href:
            this.selectedBoard && this.selectedGrade
              ? `/search?type=test&section=${this.selectedBoard.id}&base=${this.selectedGrade.id}&lesson=${subject.id}`
              : `/search?type=test`,
          name: "subject",
        };
        this.selectedSubject = subject;
        this.breads = this.breads.filter(
          (item) =>
            item.name == "type" || item.name == "board" || item.name == "grade"
        );
        this.breads.push(newSubject);
      }
    },
    changeBookImage(image) {
      this.bookImage = image;
    },
    onChangeLoadingTable(loadingStatus) {
      this.loadingDataTable = loadingStatus;
    },
    onChangeLoadingTopSection(loadingStatus) {
      this.loadingTopSection = loadingStatus;
    },
  },
};
</script>
