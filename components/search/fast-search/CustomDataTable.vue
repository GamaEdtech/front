<template>
  <v-data-table
    :headers="headers"
    :items="items"
    class="elevation-0 custom-table"
    disable-pagination
    hide-default-footer
    :item-class="rowClass"
  >
    <template v-slot:[`header.text`]="{ header }">
      <v-icon small class="mr-1">mdi-arrow-down-drop-circle</v-icon>
      {{ header.text }}
    </template>

    <!-- Column Classification -->
    <template v-slot:[`item.name`]="{ item }">
      <span class="font-weight-normal text--primary-gray-600">{{
        item.name
      }}</span>
    </template>

    <!-- Column Download Files -->
    <template v-slot:[`item.downloadFilesContains`]="{ item }">
      <div class="d-flex flex-wrap justify-content-center">
        <v-chip
          v-if="item.downloadFilesContains.qp"
          small
          class="ma-1 chip-pill"
          :color="item.theme === 'blackAndWhite' ? '#344054' : '#FEF3F2'"
          :text-color="item.theme === 'blackAndWhite' ? '#FFFFFF' : '#F04438'"
          >qp</v-chip
        >
        <v-chip
          v-else
          small
          class="ma-1 chip-pill"
          color="#F2F4F7"
          text-color="#D0D5DD"
          >qp</v-chip
        >

        <v-chip
          v-if="item.downloadFilesContains.ms"
          small
          class="ma-1 chip-pill"
          :color="item.theme === 'blackAndWhite' ? '#344054' : '#ECFDF3'"
          :text-color="item.theme === 'blackAndWhite' ? '#FFFFFF' : '#12B76A'"
          >ms</v-chip
        >
        <v-chip
          v-else
          small
          class="ma-1 chip-pill"
          color="#F2F4F7"
          text-color="#D0D5DD"
          >ms</v-chip
        >

        <v-chip
          v-if="item.downloadFilesContains.sf"
          small
          class="ma-1 chip-pill"
          :color="item.theme === 'blackAndWhite' ? '#344054' : '#FFFAEB'"
          :text-color="item.theme === 'blackAndWhite' ? '#FFFFFF' : '#F79009'"
          >sf</v-chip
        >
        <v-chip
          v-else
          small
          class="ma-1 chip-pill"
          color="#F2F4F7"
          text-color="#D0D5DD"
          >sf</v-chip
        >

        <v-chip
          v-if="item.downloadFilesContains.in"
          small
          class="ma-1 chip-pill"
          :color="item.theme === 'blackAndWhite' ? '#344054' : '#FCF6F3'"
          :text-color="item.theme === 'blackAndWhite' ? '#FFFFFF' : '#8F4949'"
          >in</v-chip
        >
        <v-chip
          v-else
          small
          class="ma-1 chip-pill"
          color="#F2F4F7"
          text-color="#D0D5DD"
          >in</v-chip
        >
      </div>
    </template>

    <!-- Column ExamHub -->
    <template v-slot:[`item.examHubIcon`]="{ item }">
      <v-chip
        class="d-flex align-center justify-center v-chip--link"
        :color="item.theme === 'blackAndWhite' ? '#F2F4F7' : '#F9F5FF'"
        link
        small
        :disabled="item.disable"
      >
        <img
          :src="
            require(item.theme == 'blackAndWhite'
              ? '@/assets/icons/bw_ExamHub.svg'
              : '@/assets/icons/ExamHub.svg')
          "
          alt="examHub icon"
          :style="{
            width: '18px',
            height: '18px',
          }"
        />
      </v-chip>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: "CustomDataTable",
  props: {
    headers: {
      type: Array,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
  },
  methods: {
    rowClass(item, index) {
      if ((index + 1) % 3 === 0) {
        return "my-4";
      }
      return "";
    },
  },
};
</script>

<style scoped>
.custom-table >>> .v-data-table {
  border-radius: 8px;
  font-size: 14px;
  background-color: white;
}

.custom-table >>> .v-data-table-header th {
  background-color: var(--primary-grey-100, #f2f4f7);
  color: #344054;
  font-family: Inter;
  font-size: 1.3rem !important;
  font-style: normal;
  font-weight: 500;
  line-height: 2.6rem;
  border-bottom: unset !important;
}
.custom-table >>> .v-data-table-header th:nth-child(4) {
  align-items: center !important;
  text-align: center !important;
}
.custom-table >>> .v-data-table-header th:nth-child(5) {
  align-items: center !important;
  text-align: center !important;
}

.custom-table >>> .v-data-table__wrapper > table > tbody > tr:hover {
  background-color: #f9f5ff9f !important;
  cursor: pointer;
  border: unset !important;
}

.custom-table >>> .v-data-table__wrapper > table > tbody > tr td:first-child {
  padding-left: 16px;
}
.custom-table >>> .v-data-table__wrapper > table > tbody > tr td:nth-child(2),
.custom-table >>> .v-data-table__wrapper > table > tbody > tr td:nth-child(3) {
  font-family: Inter !important;
  font-weight: 400 !important;
  color: #475467 !important;
  font-size: 16px;
  line-height: 26px;
  letter-spacing: 0%;
}
.custom-table >>> .v-data-table__wrapper > table > tbody > tr td:last-child {
  text-align: center !important;
  display: flex;
  justify-content: center;
  height: revert;
}

::v-deep .v-data-table__wrapper > table > tbody > tr > td {
  padding-block: 1.2rem !important;
}

::v-deep .v-data-table__wrapper > table > tbody > tr > td:first-child > span {
  font-family: Inter !important;
  font-weight: 300 !important;
  font-size: 1.4rem !important;
  line-height: 26px !important;
  letter-spacing: 0% !important;
}
::v-deep .v-data-table__wrapper > table > tbody > tr:nth-child(3)::after {
  content: "";
  display: table-column;
  width: 100%;
}

.v-chip--link {
  padding: 0;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
}

.chip-pill {
  border-radius: 16px;
  min-width: 30px;
  height: 24px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
}
</style> 