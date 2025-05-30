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
    @search-results="onSearchResult"
    @result-papers="onSearchPaper"
    @board-change="onChangeBoard"
    @grade-change="onGradeChange"
    @subject-change="onSubjectChange"
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
  data() {
    return {
      isLoading: true,
      bookImage: require("@/assets/images/BiologyBook.png"),
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
      resources: [],
      papersTopical: {
        label: "Topical",
        icon: "Topical.svg",
        items: [],
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
      papersItemsTable: [],
      timeline: [],
      selectedBoard: null,
      selectedGrade: null,
      selectedSubject: null,
    };
  },
  mounted() {},
  methods: {
    onSearchResult(data) {
      this.resources = data.data.list;
      const filterTopical = data.data.list.filter(
        (item) => item.title == `Topical`
      );
      if (filterTopical && filterTopical.length > 0) {
        this.papersTopical.items = filterTopical[0].items;
      }
    },
    onSearchPaper(data, isContinuePreviousSubject) {
      if (isContinuePreviousSubject) {
        this.papersItemsTable = [...this.papersItemsTable, ...data.data.list];
      } else {
        this.papersItemsTable = data.data.list;
        this.timeline = [];
      }

      if (!this.papersItemsTable || this.papersItemsTable.length === 0) {
        this.timeline = [];
        return;
      }

      const moments = this.papersItemsTable
        .map((item) => moment(item.subdate))
        .sort((a, b) => b - a);

      const timelineMap = {};
      let positionCounter = 0;

      moments.forEach((m) => {
        const year = m.year();
        const month = m.format("MMM");

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
  },
};
</script>
