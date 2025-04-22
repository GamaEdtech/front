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
    // Function to apply board from local storage if available
    const applyStoredBoard = () => {
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
    app.router.afterEach((to) => {
      console.log('Route changed, updating stored selection:', to.query);
      
      // If section (board) param exists in route, store it
      if (to.query.section) {
        const sectionId = String(to.query.section);
        const currentBoard = localStorage.getItem('selectedBoard');
        let boardObj;
        
        // Try to use existing board object if available
        if (currentBoard) {
          try {
            boardObj = JSON.parse(currentBoard);
            // Update just the ID if the object structure exists
            if (boardObj.id !== sectionId) {
              console.log('Updating stored board ID:', sectionId);
              boardObj.id = sectionId;
              // Ensure we have title/name consistency
              boardObj.title = boardObj.title || sectionId;
              boardObj.name = boardObj.name || sectionId;
              localStorage.setItem('selectedBoard', JSON.stringify(boardObj));
            }
          } catch (e) {
            // If parsing fails, create a new object
            console.log('Creating new board object:', sectionId);
            boardObj = { 
              id: sectionId,
              title: sectionId,
              name: sectionId
            };
            localStorage.setItem('selectedBoard', JSON.stringify(boardObj));
          }
        } else {
          // Create new board object if none exists
          console.log('Creating new board object:', sectionId);
          boardObj = { 
            id: sectionId,
            title: sectionId,
            name: sectionId
          };
          localStorage.setItem('selectedBoard', JSON.stringify(boardObj));
        }
      }
    });
  }
}; 