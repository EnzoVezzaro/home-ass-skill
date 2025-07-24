General

- add .env file to .gitignore
- change npm to pnpm
- change port backend from 5000 to 8000

Backend

1. **Refactor blocking I/O**  
- refactor readData function to make it async
- created writeData function for better management
- made changes to /api/items to do readData and writeData async
- moved readData and writeData to utils

2. **Performance**  
- refactor /api/stats to cache results using TTL

3. **Testing**  
- added jest to the project
- create tests cases for Items (happy + error)

Frontend

1. **Memory Leak**  
   - `Items.js` leaks memory if the component unmounts before fetch completes. Fix it.

2. **Pagination & Search**  
  - Implement paginated list with server‑side search (`q` param).
  - Updated backend list functions
  - Updated test on changed functions

3. **Performance**  
   - Added a 500 records large file 
   - Integrated react-window to UI frontend

4. **UI/UX Polish**  
   - Added tailwind to frontend
   - Made changes for better usability and UI
   - Improve usability and overall design 