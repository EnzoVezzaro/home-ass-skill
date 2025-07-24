import { useEffect, useState, useRef } from 'react';
import { useData } from '../state/DataContext';
import Modal from '../components/Modal'; // Import the Modal component
import { FixedSizeList } from 'react-window';

function Items() {
  // Destructure items, fetchItems, totalPages, totalItems, selectedItem, isModalOpen, fetchItemById, closeModal from context
  const { items, fetchItems, totalPages: contextTotalPages, totalItems: contextTotalItems, selectedItem, isModalOpen, fetchItemById, closeModal } = useData(); 
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

  // Handle item click to open modal
  const handleItemClick = (item) => {
    fetchItemById(item.id); // Fetch item details and open modal
  };

  // Loading state - show loading indicator
  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <p className="text-center text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Items List */}
      {items.length > 0 ? (
        <FixedSizeList
          height={400} // Adjust height as needed
          itemCount={items.length}
          itemSize={40} // Adjust item height for better spacing
          width="100%"
          itemData={{ items }} // Pass items
        >
          {({ index, style, data }) => (
            <div 
              style={style} 
              className="p-2 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between"
              onClick={() => handleItemClick(data.items[index])}
            >
              <span className="text-lg font-medium">{data.items[index].name}</span>
              {/* Optionally add an icon or arrow here */}
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </div>
          )}
        </FixedSizeList>
      ) : (
        <p className="text-center text-gray-500">No items found.</p>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 space-x-2">
          <button onClick={handlePrevPage} disabled={currentPage === 1} className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed">
            Previous
          </button>
          <span className="text-gray-700">Page {currentPage} of {totalPages}</span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages} className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed">
            Next
          </button>
        </div>
      )}

      {/* Display total items count */}
      <div className="text-center mt-4 text-gray-600">
        Showing {items.length} of {totalItems} items.
      </div>

      {/* Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        item={selectedItem} 
      />
    </div>
  );
}

export default Items;
