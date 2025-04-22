<template>
  <div class="board-selector">
    <!-- Board Selection Modal/Dialog -->
    <v-dialog v-model="showBoardDialog" persistent max-width="600px">
      <v-card>
        <v-card-title class="text-h5">
          Board
        </v-card-title>
        <v-card-subtitle>
          Search result <span class="search-count">{{ boards.length }}</span>
        </v-card-subtitle>
        <v-card-text>
          <div class="search-container mb-4">
            <v-text-field
              v-model="searchTerm"
              label="Search Board"
              outlined
              dense
              prepend-inner-icon="mdi-magnify"
              class="search-field"
              hide-details
            ></v-text-field>
            <v-btn color="primary" class="ml-2 search-btn" rounded>Search</v-btn>
          </div>
          
          <v-list>
            <!-- Board options with logos/icons -->
            <v-list-item 
              v-for="board in filteredBoards" 
              :key="board.id"
              @click="selectBoard(board)"
              class="board-item"
            >
              <v-list-item-avatar>
                <v-img :src="board.logo || getBoardLogo(board.id)" :alt="board.name + ' logo'" />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ board.name || board.title }}</v-list-item-title>
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
  name: 'BoardSelector',
  
  data() {
    return {
      showBoardDialog: false,
      searchTerm: '',
      selectedBoard: null,
      // Will be populated with boards from API
      boards: [],
      isLoading: false,
      error: null
    }
  },
  
  computed: {
    filteredBoards() {
      if (!this.searchTerm) return this.boards;
      
      const searchLower = this.searchTerm.toLowerCase();
      return this.boards.filter(board => {
        const boardName = (board.name || board.title || '').toLowerCase();
        return boardName.includes(searchLower);
      });
    }
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
        const response = await this.$axios.get('api/v1/types/list/?type=section');
        
        if (response.data && Array.isArray(response.data.data)) {
          this.boards = response.data.data;
        }
      } catch (error) {
        console.error('Error fetching boards:', error);
        this.error = 'Failed to load boards. Please try again.';
        
        // Fallback to static boards if API fails
        this.boards = [
          { id: 'cie', title: 'CIE' },
          { id: 'edexcel', title: 'Edexcel' },
          { id: 'aqa', title: 'AQA' },
          { id: 'ocr', title: 'OCR' },
          { id: 'academic_events', title: 'Academic Events' },
          { id: 'turkiye', title: 'Türkiye' },
          { id: 'iran', title: 'Iran' },
          { id: 'france', title: 'France' }
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
        'cie': '/images/boards/cie.png',
        'edexcel': '/images/boards/edexcel.png',
        'aqa': '/images/boards/aqa.png',
        'ocr': '/images/boards/ocr.png',
        'academic_events': '/images/boards/academic.png',
        'turkiye': '/images/boards/turkiye.png',
        'iran': '/images/boards/iran.png',
        'france': '/images/boards/france.png'
      };
      
      return logoMap[boardId] || '/images/boards/default.png';
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
      const storedBoard = localStorage.getItem('selectedBoard');
      
      if (storedBoard) {
        try {
          // Parse stored board information
          this.selectedBoard = JSON.parse(storedBoard);
          
          // Verify the board still exists in our list
          const boardExists = this.boards.some(b => 
            b.id === this.selectedBoard.id || 
            b.id === this.selectedBoard.id
          );
          
          if (boardExists) {
            this.$emit('board-selected', this.selectedBoard);
          } else {
            // Board no longer exists, show selection dialog
            localStorage.removeItem('selectedBoard');
            this.showBoardSelectionDialog();
          }
        } catch (error) {
          // If parsing fails, clear the invalid storage and show dialog
          console.error('Error parsing stored board', error);
          localStorage.removeItem('selectedBoard');
          this.showBoardSelectionDialog();
        }
      } else {
        // No board selected, show the selection dialog
        this.showBoardSelectionDialog();
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
      // Log board data for debugging
      console.log('Raw selected board:', board);
      
      // Extract relevant properties, ensuring we have strings for IDs
      // The ID could be a number, so we need to convert it to a string
      const boardId = board.id !== undefined ? String(board.id) : '';
      const boardTitle = board.title || board.name || 'Unknown Board';
      
      // Make sure we have a complete board object with consistent property names
      this.selectedBoard = {
        id: boardId,
        title: boardTitle,
        name: boardTitle, // Include both name and title for consistency
        logo: board.logo || this.getBoardLogo(boardId),
        // Keep any original properties that might be needed by the API
        ...(typeof board === 'object' ? board : {})
      };
      
      console.log('Processed board object:', this.selectedBoard);
      
      // Save to local storage for persistence
      localStorage.setItem('selectedBoard', JSON.stringify(this.selectedBoard));
      
      // Close the dialog
      this.showBoardDialog = false;
      
      // Emit event to notify parent components
      this.$emit('board-selected', this.selectedBoard);
    },
    
    /**
     * Allow manually clearing board selection
     */
    clearBoardSelection() {
      localStorage.removeItem('selectedBoard');
      this.selectedBoard = null;
      this.showBoardSelectionDialog();
    }
  }
}
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

.search-count {
  color: #4CAF50;
  font-weight: bold;
}

.board-item {
  transition: background-color 0.2s ease;
  border-radius: 4px;
  margin-bottom: 8px;
}

.board-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}
</style> 