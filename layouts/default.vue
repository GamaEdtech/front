<template>
  <v-app>
    <main_header />
    <!-- Board Selector Only -->
    <board-selector ref="boardSelector" @board-selected="handleBoardSelected" />
    <div>
      <Nuxt />
    </div>
    <main_footer />
  </v-app>
</template>

<script>
import main_header from "../components/common/header.vue";
import category from "../components/common/category";
import main_footer from "../components/common/footer";
import BoardSelector from "../components/common/BoardSelector.vue";

export default {
  name: "default_layout",
  components: {
    main_header,
    category,
    main_footer,
    BoardSelector,
  },
  data() {
    return {
      selectedBoard: null,
    };
  },
  mounted() {
    this.setFavicon();

    // Load board from route params if available
    // this.loadSelectionsFromRoute();

    // Listen for show-board-selector events from any component
    this.$root.$on("show-board-selector", this.showBoardSelector);
  },
  beforeDestroy() {
    // Clean up event listeners
    this.$root.$off("show-board-selector", this.showBoardSelector);
  },
  methods: {
    /**
     * Set favicon based on user's theme preference
     */
    setFavicon() {
      // Check if the user prefers dark mode
      const prefersDarkMode =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;

      // Set the favicon based on the color scheme preference
      const faviconElement = document.querySelector('link[rel="icon"]');
      if (faviconElement) {
        faviconElement.href = prefersDarkMode
          ? "/favicon-dark.ico"
          : "/favicon-light.ico";
      }
    },

    /**
     * Show the board selector dialog
     */
    showBoardSelector() {
      if (this.$refs.boardSelector) {
        this.$refs.boardSelector.showBoardSelectionDialog();
      }
    },

    /**
     * Load selections from route query parameters if available
     */
    async loadSelectionsFromRoute() {
      // If we have section in the route, use it for board
      if (this.$route.query.section) {
        const sectionId = String(this.$route.query.section);

        // Try to fetch board details from API
        try {
          const response = await this.$axios.get(
            `/api/v1/types/list/?type=section`
          );

          let boardDetails = null;

          if (response.data && Array.isArray(response.data.data)) {
            // Find the board with the matching ID
            boardDetails = response.data.data.find(
              (board) => String(board.id) === sectionId
            );
          }

          // Create a proper board object
          this.selectedBoard = {
            id: sectionId,
            title: boardDetails?.title || `Board ${sectionId}`,
            name:
              boardDetails?.name || boardDetails?.title || `Board ${sectionId}`,
            // Include section_id since that's what the API expects
            section_id: sectionId,
          };
        } catch (error) {
          console.error("Error fetching board details:", error);

          // Fallback to basic board object
          this.selectedBoard = {
            id: sectionId,
            title: `Board ${sectionId}`,
            name: `Board ${sectionId}`,
            section_id: sectionId,
          };
        }

        // Save to local storage for consistency
        localStorage.setItem(
          "selectedBoard",
          JSON.stringify(this.selectedBoard)
        );

        // If we also have a board selector reference, update its state
        if (this.$refs.boardSelector) {
          this.$refs.boardSelector.selectedBoard = this.selectedBoard;
        }
      }
    },

    /**
     * Handle board selection from BoardSelector component
     * @param {Object} board - The selected board
     */
    handleBoardSelected(board) {
      // Validate the board object
      if (!board || !board.id) {
        console.error("Invalid board selected", board);
        return;
      }

      // Ensure we have the required section_id property for API calls
      if (!board.section_id) {
        board.section_id = board.id;
      }

      this.selectedBoard = board;

      // Save to localStorage to ensure persistence across pages
      localStorage.setItem("selectedBoard", JSON.stringify(board));

      // Notify other components about the board change using a custom event
      this.$root.$emit("board-changed", board);
      // Update route with the selected board
      // this.updateRoute();
    },

    /**
     * Update route query parameters based on selections
     */
    // updateRoute() {
    //   // Create query object with existing query params
    //   const query = { ...this.$route.query };

    //   // Add board if selected, ensuring we use the right parameter names
    //   if (this.selectedBoard && this.selectedBoard.id) {
    //     // Use section as the parameter name
    //     query.section = this.selectedBoard.id;

    //     // Remove any conflicting parameters
    //     delete query.board;
    //   }

    //   // Update the route if we're not already on it
    //   const currentQuery = this.$route.query;
    //   const needsUpdate = currentQuery.section !== query.section;

    //   if (needsUpdate) {
    //     // Use replace to avoid adding unnecessary history entries
    //     this.$router.replace({ query });
    //   }
    // },

    /**
     * Reset board selection
     */
    resetSelections() {
      // Reset board in local storage
      localStorage.removeItem("selectedBoard");

      // Reset component data
      this.selectedBoard = null;

      // Show board selector again
      if (this.$refs.boardSelector) {
        this.$refs.boardSelector.showBoardSelectionDialog();
      }
    },
  },
};
</script>
