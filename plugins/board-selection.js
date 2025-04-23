/**
 * Board Selection Plugin
 * 
 * This plugin handles board selection persistence across the application.
 * It checks for stored selections in local storage and ensures they're applied
 * consistently across page navigation.
 */
export default ({ app, store, route }) => {
  // This runs on client-side only
  if (process.client) {
    // Keep a cache of board name/title mappings
    let boardCache = {};
    
    // Function to fetch the full board details by ID
    const fetchBoardDetails = async (boardId) => {
      try {
        console.log('Fetching board details for:', boardId);
        const response = await app.$axios.get(`/api/v1/types/list/?type=section`);
        
        if (response.data && Array.isArray(response.data.data)) {
          const boards = response.data.data;
          // Find the board with matching ID
          const boardDetails = boards.find(board => 
            String(board.id) === String(boardId)
          );
          
          if (boardDetails) {
            // Cache the board details for future use
            boardCache[boardId] = boardDetails;
            console.log('Found board details:', boardDetails);
            return boardDetails;
          }
        }
        console.warn('Board details not found in API response');
        return null;
      } catch (error) {
        console.error('Error fetching board details:', error);
        return null;
      }
    };
    
    // Function to create a proper board object with distinct properties
    const createBoardObject = (boardId, boardDetails = null) => {
      // Start with a basic object with the ID
      const boardObj = { 
        id: String(boardId)
      };
      
      // If we have details from the API, use those
      if (boardDetails) {
        boardObj.title = boardDetails.title || boardDetails.name || boardDetails.id;
        boardObj.name = boardDetails.name || boardDetails.title || boardDetails.id;
      } else {
        // Otherwise use cached board details if available
        if (boardCache[boardId]) {
          boardObj.title = boardCache[boardId].title || boardCache[boardId].name || boardId;
          boardObj.name = boardCache[boardId].name || boardCache[boardId].title || boardId;
        } else {
          // As a fallback, make the title and name different from the ID
          boardObj.title = `Board ${boardId}`;
          boardObj.name = `Board ${boardId}`;
        }
      }
      
      return boardObj;
    };
    
    // Function to apply board from local storage if available
    const applyStoredBoard = async () => {
      try {
        console.log('Applying stored board selection');
        
        // Check for stored board
        const storedBoard = localStorage.getItem('selectedBoard');
        
        // Build query with existing params
        const query = { ...route.query };
        let changed = false;
        
        // If board exists in storage but not in query, add it
        if (storedBoard && !query.section) {
          try {
            const board = JSON.parse(storedBoard);
            if (board && board.id) {
              console.log('Setting section parameter from stored board:', board.id);
              query.section = String(board.id);
              changed = true;
            }
          } catch (e) {
            console.error('Error parsing stored board:', e);
            localStorage.removeItem('selectedBoard');
          }
        }
        
        // If we need to update the route with stored values
        if (changed) {
          console.log('Updating route with stored selections:', query);
          // Use replace to avoid navigation issues
          app.router.replace({ query });
        }
      } catch (error) {
        console.error('Error applying stored board:', error);
      }
    };
    
    // Apply stored selections on app initialization
    // Add a small delay to ensure Vue is fully loaded
    setTimeout(() => {
      applyStoredBoard();
    }, 300); // Increased delay to ensure app is fully mounted
    
    // Update local storage when route changes with board params
    app.router.afterEach(async (to) => {
      console.log('Route changed, updating stored selection:', to.query);
      
      // If section (board) param exists in route, store it
      if (to.query.section) {
        const sectionId = String(to.query.section);
        const currentBoard = localStorage.getItem('selectedBoard');
        let boardObj = null;
        
        // Try to use existing board object if available
        if (currentBoard) {
          try {
            const parsedBoard = JSON.parse(currentBoard);
            
            // Only update if the ID changed
            if (parsedBoard.id !== sectionId) {
              console.log('Board ID changed, fetching new board details:', sectionId);
              
              // Try to get board details from API
              const boardDetails = await fetchBoardDetails(sectionId);
              boardObj = createBoardObject(sectionId, boardDetails);
              
              // Save the updated board
              localStorage.setItem('selectedBoard', JSON.stringify(boardObj));
            }
          } catch (e) {
            console.error('Error parsing current board:', e);
            
            // If parsing fails, create a new object
            const boardDetails = await fetchBoardDetails(sectionId);
            boardObj = createBoardObject(sectionId, boardDetails);
            localStorage.setItem('selectedBoard', JSON.stringify(boardObj));
          }
        } else {
          // Create new board object if none exists
          console.log('Creating new board object:', sectionId);
          
          // Try to get board details from API
          const boardDetails = await fetchBoardDetails(sectionId);
          boardObj = createBoardObject(sectionId, boardDetails);
          localStorage.setItem('selectedBoard', JSON.stringify(boardObj));
        }
      }
    });
  }
}; 