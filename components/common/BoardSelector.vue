<template>
  <div class="board-selector">
    <!-- Board Selection Modal/Dialog -->
    <v-dialog v-model="showBoardDialog" :persistent="false" max-width="600px">
      <v-card>
        <div class="d-flex justify-space-between align-center">
          <v-card-title class="text-h5"> Board </v-card-title>
          <v-card-subtitle
            style="
              margin-top: 0px;
              padding-top: 0px;
              padding: 16px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 11px;
            "
          >
            <div class="search-result">Search result</div>
            <div class="search-count">{{ filteredBoards.length }}</div>
          </v-card-subtitle>
        </div>
        <v-card-text>
          <div class="search-container mb-4">
            <v-text-field
              v-model="searchTerm"
              label="Search Board"
              outlined
              dense
              prepend-inner-icon="mdi-magnify"
              append-icon="mdi-close"
              @click:append="searchTerm = ''"
              class="search-field"
              hide-details
              ref="searchField"
              @keyup.enter="handleSearch"
              :loading="isLoading"
            ></v-text-field>
            <v-btn
              style="background-color: #ffb600 !important; font-weight: 600"
              class="ml-2"
              rounded
              @click="handleSearch"
              :loading="isLoading"
            >
              Search
            </v-btn>
          </div>

          <v-alert
            v-if="searchTerm && filteredBoards.length === 0 && !isLoading"
            type="info"
            dense
            class="mb-4"
          >
            No boards found matching "{{ searchTerm }}". Try a different search
            term.
          </v-alert>

          <v-list v-if="filteredBoards.length > 0">
            <!-- Board options with logos/icons -->
            <v-list-item
              v-for="board in filteredBoards"
              :key="board.id"
              @click="selectBoard(board)"
              class="board-item"
            >
              <v-list-item-avatar>
                <!-- <v-img :src="board.logo || getBoardLogo(board.id)" :alt="board.name + ' logo'" /> -->
                <v-img :src="board.img" />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-if="!searchTerm">{{
                  board.name || board.title
                }}</v-list-item-title>
                <div
                  v-else
                  class="v-list-item__title"
                  v-html="highlightMatch(board.name || board.title)"
                ></div>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "BoardSelector",

  data() {
    return {
      showBoardDialog: false,
      searchTerm: "",
      selectedBoard: null,
      // Will be populated with boards from API
      boards: [],
      isLoading: false,
      error: null,
      boardImgs: [
        "CIE.svg",
        "Edexcel.svg",
        "AQA.svg",
        "OCR.svg",
        "Gama.svg",
        "Scientific Competition.svg",
      ],
    };
  },

  computed: {
    filteredBoards() {
      if (!this.searchTerm) return this.boards;

      const searchLower = this.searchTerm.toLowerCase();
      return this.boards.filter((board) => {
        const boardName = (board.name || board.title || "").toLowerCase();
        return boardName.includes(searchLower);
      });
    },
  },
  watch: {
    showBoardDialog(visible) {
      if (visible) {
        // When dialog opens, fetch boards and focus the search field
        this.fetchBoards();

        // Use nextTick to ensure the DOM is updated before focusing
        this.$nextTick(() => {
          if (this.$refs.searchField) {
            this.$refs.searchField.focus();
          }
        });
      }
    },
  },

  async mounted() {
    // Try to fetch boards first
    await this.fetchBoards();

    // Then check for board selection
    this.checkBoardSelection();
  },

  methods: {
    /**
     * Fetch available boards from API
     */
    async fetchBoards() {
      try {
        this.isLoading = true;
        this.error = null;

        // Fetch boards from the endpoint mentioned in the GitHub issue
        const response = await this.$axios.get(
          "api/v1/types/list/?type=section"
        );

        if (response.data && Array.isArray(response.data.data)) {
          this.boards = response.data.data.map((item, index) => ({
            ...item,
            img: require(`@/assets/boards/${this.boardImgs[index]}`),
          }));
          console.log(this.boards);
        }
      } catch (error) {
        console.error("Error fetching boards:", error);
        this.error = "Failed to load boards. Please try again.";

        // Fallback to static boards if API fails
        this.boards = [
          // { id: "6659", title: "CIE", name: "CIE" },
          // { id: "edexcel", title: "Edexcel" },
          // { id: "aqa", title: "AQA" },
          // { id: "ocr", title: "OCR" },
          // { id: "academic_events", title: "Academic Events" },
          // { id: "turkiye", title: "Türkiye" },
          // { id: "iran", title: "Iran" },
          // { id: "france", title: "France" },
        ];
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Get logo URL for a board based on its ID
     * @param {string} boardId - The board ID
     * @returns {string} - The logo URL
     */
    getBoardLogo(boardId) {
      // Map of board IDs to their logo paths
      const logoMap = {
        cie: "/images/boards/cie.png",
        edexcel: "/images/boards/edexcel.png",
        aqa: "/images/boards/aqa.png",
        ocr: "/images/boards/ocr.png",
        academic_events: "/images/boards/academic.png",
        turkiye: "/images/boards/turkiye.png",
        iran: "/images/boards/iran.png",
        france: "/images/boards/france.png",
      };

      return logoMap[boardId] || "/images/boards/default.png";
    },

    /**
     * Check if a board has been previously selected and stored in local storage
     */
    checkBoardSelection() {
      // Only proceed if we have boards available
      if (this.boards.length === 0) {
        this.showBoardSelectionDialog();
        return;
      }

      // Check for a board in local storage
      const storedBoard = localStorage.getItem("selectedBoard");

      if (storedBoard) {
        try {
          // Parse stored board information
          this.selectedBoard = JSON.parse(storedBoard);

          // Verify the board still exists in our list
          const boardExists = this.boards.some(
            (b) =>
              b.id === this.selectedBoard.id || b.id === this.selectedBoard.id
          );

          if (boardExists) {
            this.$emit("board-selected", this.selectedBoard);
          } else {
            // Board no longer exists, set default CIE board
            this.setDefaultBoard();
          }
        } catch (error) {
          // If parsing fails, clear the invalid storage and set default board
          console.error("Error parsing stored board", error);
          localStorage.removeItem("selectedBoard");
          this.setDefaultBoard();
        }
      } else {
        // No board selected, set default CIE board
        this.setDefaultBoard();
      }
    },

    /**
     * Set the default board (CIE)
     */
    setDefaultBoard() {
      // First look for CIE board in our board list
      const cieBoard = this.boards.find(
        (board) =>
          board.title === "CIE" || board.name === "CIE" || board.id === "6659" // CIE ID
      );

      if (cieBoard) {
        this.selectBoard(cieBoard);
      } else {
        // If we can't find CIE board specifically, use the first board in the list
        if (this.boards.length > 0) {
          this.selectBoard(this.boards[0]);
        } else {
          // As a last resort, create a default CIE board object
          const defaultBoard = {
            id: "6659",
            title: "CIE",
            name: "CIE",
          };
          this.selectBoard(defaultBoard);
        }
      }
    },

    /**
     * Show the board selection dialog
     */
    showBoardSelectionDialog() {
      this.showBoardDialog = true;
    },

    /**
     * Handle board selection
     * @param {Object} board - The selected board
     */
    selectBoard(board) {
      // Extract relevant properties, ensuring we have strings for IDs
      const boardId = board.id !== undefined ? String(board.id) : "";

      // Get the proper title and name, preferring original values when available
      const boardTitle = board.title || board.name || `Board ${boardId}`;
      const boardName = board.name || board.title || `Board ${boardId}`;

      // Make sure we have a complete board object with proper property values
      this.selectedBoard = {
        id: boardId,
        title: boardTitle, // Use the actual title
        name: boardName, // Use the actual name
        logo: board.img,
        // Keep any original properties that might be needed by the API
        ...(typeof board === "object" ? board : {}),
      };

      // Make sure we don't overwrite the title/name with the ID
      if (this.selectedBoard.title === boardId) {
        this.selectedBoard.title = `Board ${boardId}`;
      }

      if (this.selectedBoard.name === boardId) {
        this.selectedBoard.name = `Board ${boardId}`;
      }

      // Save to local storage for persistence
      localStorage.setItem("selectedBoard", JSON.stringify(this.selectedBoard));

      // Close the dialog
      this.showBoardDialog = false;

      // Emit event to notify parent components
      this.$emit("board-selected", this.selectedBoard);
    },

    /**
     * Allow manually clearing board selection
     */
    clearBoardSelection() {
      localStorage.removeItem("selectedBoard");
      this.selectedBoard = null;
      this.showBoardSelectionDialog();
    },

    /**
     * Handle search button click or enter key press
     */
    handleSearch() {
      // If search term is empty, fetch all boards again
      if (!this.searchTerm.trim()) {
        this.fetchBoards();
        return;
      }

      // If we already have boards loaded, filtering is handled
      // by the computed property filteredBoards

      // You could also implement server-side search by making
      // an API call with the search term if needed:
      // this.isLoading = true;
      // this.$axios.get(`api/v1/types/list/?type=section&search=${this.searchTerm}`)
      //   .then(response => {
      //     this.boards = response.data.data;
      //   })
      //   .catch(error => {
      //     console.error('Search error:', error);
      //   })
      //   .finally(() => {
      //     this.isLoading = false;
      //   });
    },

    // Method to highlight search matches in text
    /**
     * Highlights the search term within a text string
     * @param {string} text - The text to search within
     * @returns {string} - HTML with highlighted search term
     */
    highlightMatch(text) {
      if (!this.searchTerm || !text) return text;

      // Escape special regex characters in the search term
      const escapedSearchTerm = this.searchTerm.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      // Create a regex that's case insensitive
      const regex = new RegExp(`(${escapedSearchTerm})`, "gi");

      // Replace matches with highlighted version
      return text.replace(regex, '<span class="highlighted-text">$1</span>');
    },
  },
};
</script>

<style scoped>
.board-selector {
  width: 100%;
}

.search-container {
  display: flex;
  align-items: center;
}

.search-field {
  flex-grow: 1;
}

.search-result {
  font-family: Inter;
  font-weight: 500;
  font-size: 12px;
  line-height: 100%;
  letter-spacing: 0%;
  text-align: right;
  color: rgba(36, 41, 47, 0.3);
}

.search-count {
  color: #57b947;
  font-weight: 600;
  font-size: 18px;
}

.board-item {
  transition: background-color 0.2s ease;
  border-radius: 4px;
  margin-bottom: 8px;
}

.board-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

/* Highlighted text styling */
.highlighted-text {
  background-color: rgba(255, 179, 0, 0.3);
  font-weight: bold;
  border-radius: 2px;
  padding: 0 2px;
}
</style>
