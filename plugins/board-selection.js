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
    
    // Default CIE board ID - this is the ID we want to use as default
    const DEFAULT_BOARD_ID = "6659"; // CIE board ID
    const DEFAULT_BOARD_NAME = "CIE";
    
    // Function to fetch the full board details by ID
    const fetchBoardDetails = async (boardId) => {
      try {
        const response = await app.$axios.get(`/api/v1/types/list/?type=section`);
        
        if (response.data && Array.isArray(response.data.data)) {
          const boards = response.data.data;
          
          // First check if this is for setting default board (CIE)
          if (boardId === "default") {
            // Look for CIE board by name
            const cieBoard = boards.find(board => 
              board.title === DEFAULT_BOARD_NAME || 
              board.name === DEFAULT_BOARD_NAME
            );
            
            if (cieBoard) {
              // Cache the CIE board details for future use
              boardCache[cieBoard.id] = cieBoard;
              return cieBoard;
            }
            
            // If CIE not found by name, use default ID
            const defaultBoard = boards.find(board => 
              String(board.id) === String(DEFAULT_BOARD_ID)
            );
            
            if (defaultBoard) {
              boardCache[DEFAULT_BOARD_ID] = defaultBoard;
              return defaultBoard;
            }
            
            // If still no match, return first board in list
            if (boards.length > 0) {
              return boards[0];
            }
          } else {
            // Regular board lookup by ID
            const boardDetails = boards.find(board => 
              String(board.id) === String(boardId)
            );
            
            if (boardDetails) {
              // Cache the board details for future use
              boardCache[boardId] = boardDetails;
              return boardDetails;
            }
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
      // For default case (no board selected yet)
      if (boardId === "default" && !boardDetails) {
        return {
          id: DEFAULT_BOARD_ID,
          title: DEFAULT_BOARD_NAME,
          name: DEFAULT_BOARD_NAME,
          section_id: DEFAULT_BOARD_ID
        };
      }
      
      // Start with a basic object with the ID
      const boardObj = { 
        id: String(boardId)
      };
      
      // If we have details from the API, use those
      if (boardDetails) {
        boardObj.title = boardDetails.title || boardDetails.name || boardDetails.id;
        boardObj.name = boardDetails.name || boardDetails.title || boardDetails.id;
        boardObj.section_id = boardDetails.id; // Ensure section_id is set
      } else {
        // Otherwise use cached board details if available
        if (boardCache[boardId]) {
          boardObj.title = boardCache[boardId].title || boardCache[boardId].name || boardId;
          boardObj.name = boardCache[boardId].name || boardCache[boardId].title || boardId;
          boardObj.section_id = boardCache[boardId].id; // Ensure section_id is set
        } else {
          // As a fallback, make the title and name different from the ID
          boardObj.title = `Board ${boardId}`;
          boardObj.name = `Board ${boardId}`;
          boardObj.section_id = boardId;
        }
      }
      
      return boardObj;
    };
    
    // Function to set the default board (CIE)
    const setDefaultBoard = async () => {
      try {
        
        // Try to get the CIE board details from API
        const cieBoard = await fetchBoardDetails("default");
        
        // Create board object with CIE details or fallback to default values
        const defaultBoard = cieBoard ? 
          createBoardObject(cieBoard.id, cieBoard) : 
          createBoardObject("default");
        
        // Save to localStorage
        localStorage.setItem('selectedBoard', JSON.stringify(defaultBoard));
        
        return defaultBoard;
      } catch (error) {
        console.error('Error setting default board:', error);
        
        // Fallback to basic default board object
        const fallbackBoard = createBoardObject("default");
        localStorage.setItem('selectedBoard', JSON.stringify(fallbackBoard));
        
        return fallbackBoard;
      }
    };
    
    // Function to apply board from local storage if available
    const applyStoredBoard = async () => {
      try {
        console.log('Applying stored board selection');
        
        // Check for stored board
        let storedBoard = localStorage.getItem('selectedBoard');
        let board = null;
        
        // If no board exists in localStorage, set default CIE board
        if (!storedBoard) {
          console.log('No board in localStorage, setting default CIE board');
          board = await setDefaultBoard();
          storedBoard = JSON.stringify(board);
        } else {
          // Parse the stored board
          board = JSON.parse(storedBoard);
        }
        
        // Build query with existing params
        const query = { ...route.query };
        let changed = false;
        
        // If board exists and not in query, add it
        if (board && board.id && !query.section) {
          console.log('Setting section parameter from board:', board.id);
          query.section = String(board.id);
          changed = true;
        }
        
        // Important: Preserve the base parameter if it exists, only update if it doesn't
        // This ensures we don't override a grade selection that might have been set by other components
        if (!query.base && route.query.base) {
          query.base = route.query.base;
        }
        
        // If we need to update the route with stored values
        if (changed) {
          console.log('Updating route with stored selections:', query);
          // Use replace to avoid navigation issues
          app.router.replace({ query }).catch((err) => {
            if (err && err.name === "NavigationDuplicated") {
              console.log("Ignoring NavigationDuplicated error");
            } else {
              console.error("Router replace error:", err);
            }
          });
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
      console.log('Route changed, checking parameters:', to.query);
      
      // If section (board) param exists in route, store it
      if (to.query.section) {
        const sectionId = String(to.query.section);
        const currentBoard = localStorage.getItem('selectedBoard');
        let boardObj = null;
        let shouldUpdateStorage = false;
        
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
              
              shouldUpdateStorage = true;
            } else {
              // Use existing board object, but preserve it for later parameter checks
              boardObj = parsedBoard;
            }
          } catch (e) {
            console.error('Error parsing current board:', e);
            
            // If parsing fails, create a new object
            const boardDetails = await fetchBoardDetails(sectionId);
            boardObj = createBoardObject(sectionId, boardDetails);
            
            shouldUpdateStorage = true;
          }
        } else {
          // Create new board object if none exists
          console.log('Creating new board object:', sectionId);
          
          // Try to get board details from API
          const boardDetails = await fetchBoardDetails(sectionId);
          boardObj = createBoardObject(sectionId, boardDetails);
          
          shouldUpdateStorage = true;
        }
        
        // Update localStorage if the board changed
        if (shouldUpdateStorage) {
          localStorage.setItem('selectedBoard', JSON.stringify(boardObj));
        }
      }
    });
  }
}; 