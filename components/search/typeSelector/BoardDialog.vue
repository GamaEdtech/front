<template>
  <div class="board-selector">
    <v-dialog v-model="dialogVisible" :persistent="false" max-width="600px">
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
            <v-list-item
              v-for="board in filteredBoards"
              :key="board.id"
              @click="selectBoard(board)"
              class="board-item"
            >
              <v-list-item-avatar>
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
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  name: "BoardSelector",
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      searchTerm: "",
      selectedBoard: null,
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
    ...mapState({
      storeBoards: (state) => state.common.boards,
      isStoreLoading: (state) => state.common.isLoadingBoards,
      error: (state) => state.common.boardsError,
    }),
    ...mapGetters("common", ["getAllBoards"]),

    boards() {
      return this.storeBoards.map((item, index) => ({
        ...item,
        img: require(`@/assets/boards/${
          this.boardImgs[index % this.boardImgs.length]
        }`),
      }));
    },

    isLoading() {
      return this.isStoreLoading;
    },

    filteredBoards() {
      if (!this.searchTerm) return this.boards;

      const searchLower = this.searchTerm.toLowerCase();
      return this.boards.filter((board) => {
        const boardName = (board.name || board.title || "").toLowerCase();
        return boardName.includes(searchLower);
      });
    },

    dialogVisible: {
      get() {
        return this.showDialog;
      },
      set(value) {
        this.$emit("update:show-dialog", value);
      },
    },
  },

  watch: {
    dialogVisible(visible) {
      if (visible) {
        this.$nextTick(() => {
          if (this.$refs.searchField) {
            this.$refs.searchField.focus();
          }
        });
      }
    },
  },

  async mounted() {
    await this.fetchBoardsFromStore();
    this.selectDefaultOrStoredBoard();
  },

  methods: {
    ...mapActions("common", ["fetchBoards"]),

    async fetchBoardsFromStore() {
      await this.fetchBoards();
      return this.boards;
    },

    selectDefaultOrStoredBoard() {
      if (this.$route.query.board) {
        const boardExists = this.boards.find(
          (b) => b.id === this.$route.query.board
        );
        if (boardExists) {
          this.selectedBoard = boardExists;
          this.$emit("board-selected", this.selectedBoard);
          return;
        }
      } else {
        const storedBoardJson = localStorage.getItem("selectedBoard");

        if (storedBoardJson) {
          try {
            const storedBoard = JSON.parse(storedBoardJson);
            const boardExists = this.boards.some(
              (b) => b.id === storedBoard.id
            );
            if (boardExists) {
              this.selectedBoard = storedBoard;
              this.$emit("board-selected", this.selectedBoard);
              return;
            }
          } catch (error) {
            console.error("Error parsing stored board", error);
            localStorage.removeItem("selectedBoard");
          }
        }
        this.setDefaultBoard();
      }
    },

    getBoardLogo(boardId) {
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

    setDefaultBoard() {
      const cieBoard = this.boards.find(
        (board) =>
          board.title === "CIE" || board.name === "CIE" || board.id === "6659" // CIE ID
      );

      if (cieBoard) {
        this.selectBoard(cieBoard);
      } else {
        if (this.boards.length > 0) {
          this.selectBoard(this.boards[0]);
        } else {
          const defaultBoard = {
            id: "6659",
            title: "CIE",
            name: "CIE",
          };
          this.selectBoard(defaultBoard);
        }
      }
    },

    showBoardSelectionDialog() {
      this.dialogVisible = true;
    },

    selectBoard(board) {
      const boardId = board.id !== undefined ? String(board.id) : "";
      const boardTitle = board.title || board.name || `Board ${boardId}`;
      const boardName = board.name || board.title || `Board ${boardId}`;
      this.selectedBoard = {
        id: boardId,
        title: boardTitle,
        name: boardName,
        logo: board.img,
        ...(typeof board === "object" ? board : {}),
      };

      if (this.selectedBoard.title === boardId) {
        this.selectedBoard.title = `Board ${boardId}`;
      }

      if (this.selectedBoard.name === boardId) {
        this.selectedBoard.name = `Board ${boardId}`;
      }

      localStorage.setItem("selectedBoard", JSON.stringify(this.selectedBoard));
      this.dialogVisible = false;
      this.$emit("board-selected", this.selectedBoard);
    },

    clearBoardSelection() {
      localStorage.removeItem("selectedBoard");
      this.selectedBoard = null;
      this.showBoardSelectionDialog();
    },

    handleSearch() {
      if (!this.searchTerm.trim()) {
        this.fetchBoardsFromStore();
        return;
      }
    },

    highlightMatch(text) {
      if (!this.searchTerm || !text) return text;
      const escapedSearchTerm = this.searchTerm.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );
      const regex = new RegExp(`(${escapedSearchTerm})`, "gi");
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
