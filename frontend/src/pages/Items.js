import { useEffect, useState, useRef } from 'react';
import { useData } from '../state/DataContext';
import { Link } from 'react-router-dom';
import { FixedSizeList } from 'react-window';

function Items() {
  // Destructure items, fetchItems, totalPages, totalItems from context
  const { items, fetchItems, totalPages: contextTotalPages, totalItems: contextTotalItems } = useData(); 
  const isMountedRef = useRef(true);
  const abortControllerRef = useRef(null); // Use ref for AbortController to persist across renders

  // State for search and pagination
  const [searchQuery, setSearchQuery] = useState(''); // Controlled input state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Default to match backend
  const [isLoading, setIsLoading] = useState(true); // Loading state

  // Use context values for totalPages and totalItems
  const totalPages = contextTotalPages;
  const totalItems = contextTotalItems;

  // Main effect for fetching data when dependencies change
  useEffect(() => {
    // Silently abort any previous request to avoid race conditions
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    isMountedRef.current = true; // Mark component as mounted

    const fetchData = async () => {
      // Early return if component is unmounted
      if (!isMountedRef.current) return;

      setIsLoading(true); // Show loading state

      try {
        // Fetch items with current search query, page, and items per page
        await fetchItems(searchQuery, currentPage, itemsPerPage, signal);
        
        // Note: Pagination metadata is updated within fetchItems via context setters
        // so we don't need to handle response data here
      } catch (error) {
        // Silently handle aborted requests - this is normal behavior during search/pagination
        if (error.name === 'AbortError') {
          return; // Don't log - this is expected when user types or changes pages
        }
        
        // Only log actual errors if component is still mounted
        if (isMountedRef.current) {
          console.error('Error fetching items:', error);
        }
      } finally {
        // Always set loading to false when done (success or error)
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    // Cleanup function to prevent memory leaks
    return () => {
      isMountedRef.current = false;
      // Silently abort on cleanup - this is normal behavior
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchItems, searchQuery, currentPage, itemsPerPage]); // Re-fetch when these change

  // Search input handler - maintains focus by using controlled component pattern
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  // Pagination handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Loading state - show loading indicator
  if (isLoading) {
    return (
      <div>
        <div>
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Search Input - controlled component to maintain focus */}
      <div>
        <input
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {/* Conditional rendering: show items list or no items message */}
      {/* Render list using react-window */}
      {items.length > 0 && (
        <FixedSizeList
          height={400} // Adjust height as needed
          itemCount={items.length}
          itemSize={30} // Adjust item height as needed
          width="100%"
          itemData={{ items, Link }} // Pass items and Link component
        >
          {({ index, style, data }) => (
            <div style={style}>
              <Link to={`/items/${data.items[index].id}`}>{data.items[index].name}</Link>
            </div>
          )}
        </FixedSizeList>
      )}
      {!items.length && <p>No items found.</p>}

      {/* Pagination Controls - only show if more than 1 page */}
      {totalPages > 1 && (
        <div>
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            Previous
          </button>
          <span> Page {currentPage} of {totalPages} </span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      )}

      {/* Display total items count */}
      <div>
        Showing {items.length} of {totalItems} items.
      </div>
    </div>
  );
}

export default Items;
