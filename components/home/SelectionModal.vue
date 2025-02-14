<template>
  <v-app>
    <v-container>
      <v-dialog v-model="showModal" persistent max-width="400px">
        <v-card>
          <v-card-title>Boards:</v-card-title>
          <v-card-text>
            <v-select
              v-model="selectedOption"
              :items="boards"
              item-text="title"
              item-value="id"
              label="Choose one"
            ></v-select>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              :disabled="!selectedOption"
              @click="saveSelection"
              >OK</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      showModal: false,
      selectedOption: null,
      boards: [],
    };
  },
  mounted() {
    const savedOption = localStorage.getItem("BoardSelection");
    if (!savedOption) {
      this.showModal = true;
    } else {
      this.selectedOption = savedOption;
    }
    this.getBoards();
  },
  methods: {
    saveSelection() {
      localStorage.setItem("BoardSelection", this.selectedOption);
      this.showModal = false;
    },
    async getBoards() {
      await this.$axios
        .$get("/api/v1/types/list/?type=section")
        .then((res) => {
          this.boards = res.data;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          console.log("finish");
        });
    },
  },
};
</script>
