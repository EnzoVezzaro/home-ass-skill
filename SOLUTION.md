# Solution and Trade-offs by Enzo Vezzaro

This document outlines my approach to addressing the issues in the take-home assessment, along with the trade-offs I considered for each solution.

## Backend (Node.js)

### 1. Refactor Blocking I/O

*   **Problem**: The `src/routes/items.js` file uses `fs.readFileSync`, which blocks the Node.js event loop.
*   **My Solution**: I will replace the synchronous file read with an asynchronous version (`fs.readFile`) and use `async/await` to handle the asynchronous operation. This will prevent blocking the event loop and improve the server's ability to handle concurrent requests.
*   **Trade-offs**: In my view, there are no trade-offs here. This is a standard best practice for I/O operations in Node.js that I always follow.

### 2. Performance Optimization for `/api/stats`

*   **Problem**: The `/api/stats` endpoint recalculates statistics on every request, which is inefficient.
*   **My Solution**: I will implement a caching mechanism. The stats will be calculated once and stored in memory. I'll use a file watcher (`fs.watchFile`) to monitor `items.json` for changes and invalidate the cache, recalculating the stats only when the data changes.
*   **Trade-offs**: This approach uses more memory to store the cached stats. The file watcher also adds a small amount of overhead. However, for a read-heavy endpoint, I believe the performance gains from avoiding recalculation on every request far outweigh these costs.

### 3. Testing

*   **Problem**: The backend lacks unit tests for the items routes.
*   **My Solution**: I will add unit tests using Jest for the `GET /api/items` and `GET /api/items/:id` endpoints. My tests will cover both successful responses (happy path) and error cases, such as when an item is not found.
*   **Trade-offs**: Writing tests takes time, but I consider it a crucial investment for ensuring code quality, preventing regressions, and simplifying future refactoring.

## Frontend (React)

### 1. Memory Leak in `Items.js`

*   **Problem**: The `Items.js` component has a memory leak if it unmounts before a fetch request completes.
*   **My Solution**: I will use a `useEffect` cleanup function to cancel the fetch request or ignore the result if the component has unmounted. I'll achieve this by using an `AbortController`.
*   **Trade-offs**: Using an `AbortController` is the modern and recommended approach, though it adds a bit more code. A simple boolean flag would be less code but is a less robust pattern. I've chosen the `AbortController` as it is a cleaner and more reliable solution.

### 2. Pagination & Server-Side Search

*   **Problem**: The frontend fetches all items at once and performs filtering on the client-side, which is not scalable.
*   **My Solution**: I will implement server-side pagination and search. I'll update the backend to accept `page`, `limit`, and `q` (search query) parameters. On the frontend, I'll add a search input and pagination controls, and it will fetch only the data needed for the current view.
*   **Trade-offs**: Server-side pagination and search add complexity to both the frontend and backend. However, I know it's essential for performance and scalability, especially with large datasets.

### 3. List Virtualization

*   **Problem**: Rendering a large list of items can cause performance issues in the browser.
*   **My Solution**: I will use `react-window` to implement list virtualization. This will ensure that only the visible items in the list are rendered in the DOM, significantly improving performance.
*   **Trade-offs**: Introducing a new library adds to the bundle size and some complexity to the list component. However, for large lists, the performance benefits are substantial and well worth it in my opinion.

### 4. UI/UX Polish

*   **Problem**: The UI could be improved with better loading states and general polish.
*   **My Solution**: I will add loading indicators (skeletons or spinners) to provide feedback to the user while data is being fetched. I will also make minor styling improvements to enhance the overall user experience.
*   **Trade-offs**: None. These are standard improvements that enhance the perceived performance and usability of the application, which I always strive for.
