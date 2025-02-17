<template>
  <v-app>
    <v-container>
      <!-- Modal for Selection (Always Opens) -->
      <v-dialog v-model="showModal" persistent max-width="400px">
        <v-card>
          <v-card-title>Select a Board</v-card-title>
          <v-card-text>
            <!-- Show Selected Option (Hidden When Searching) -->
            <div
              v-if="selectedOption && !editing"
              class="selected-option"
              @click="editing = true"
            >
              <v-chip class="ma-2" color="primary" outlined>{{
                selectedOptionTitle
              }}</v-chip>
            </div>

            <!-- Search Input (Only Shows When Selecting a New Option) -->
            <v-text-field
              v-if="editing || !selectedOption"
              v-model="searchQuery"
              label="Search and select..."
              clearable
              @input="filterBoards"
            ></v-text-field>

            <!-- Filtered List -->
            <v-list v-if="editing || !selectedOption">
              <v-list-item
                v-for="board in filteredBoards"
                :key="board.id"
                @click="selectBoard(board)"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ board.title }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="gray" @click="closeModal">Close</v-btn>
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
      showModal: true, // Always open modal on page load
      editing: false, // Controls whether the user is selecting a new option
      selectedOption: null,
      selectedOptionTitle: "Select a board",
      searchQuery: "",
      boards: [],
      filteredBoards: [],
    };
  },
  mounted() {
    this.getBoards();
    const savedOption = localStorage.getItem("BoardSelection");
    const savedTitle = localStorage.getItem("BoardSelectionTitle");

    if (savedOption && savedTitle) {
      this.selectedOption = savedOption;
      this.selectedOptionTitle = savedTitle;
    }
  },
  methods: {
    async getBoards() {
      try {
        const res = await this.$axios.$get("/api/v1/types/list/?type=section");
        this.boards = res.data;
        this.filteredBoards = res.data; // Initialize filtered list
      } catch (err) {
        console.error("Error fetching boards:", err);
      }
    },
    filterBoards() {
      this.filteredBoards = this.boards.filter((board) =>
        board.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    selectBoard(board) {
      this.selectedOption = board.id;
      this.selectedOptionTitle = board.title;
      localStorage.setItem("BoardSelection", board.id);
      localStorage.setItem("BoardSelectionTitle", board.title);
      this.editing = false; // Hide input after selection
    },
    closeModal() {
      this.showModal = false;
      this.editing = false; // Reset to hide input when reopening
    },
  },
};
</script>

<style scoped>
.selected-option {
  cursor: pointer;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 5px;
  text-align: center;
}
</style>
