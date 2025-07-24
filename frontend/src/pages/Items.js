import { useEffect, useState, useRef, useCallback } from 'react';
import { useData } from '../state/DataContext';
import useDebounce from '../hooks/useDebounce';
import Modal from '../components/Modal';
import AssignmentInfo from '../components/AssignmentInfo';
import Header from '../components/Header';
import StarRating from '../components/StarRating';

function SimilarProducts() {
  const { items, fetchItems, totalPages: contextTotalPages, totalItems: contextTotalItems, selectedItem, isModalOpen, fetchItemById, closeModal } = useData(); 
  const searchInputRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [isLoading, setIsLoading] = useState(true);
  
  const totalPages = contextTotalPages;
  const totalItems = contextTotalItems;

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Fetch data effect
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        await fetchItems(debouncedSearchQuery, currentPage, itemsPerPage, signal);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error fetching items:', error);
        }
      } finally {
        // Check if the component is still mounted before setting state
        if (!signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [fetchItems, debouncedSearchQuery, currentPage, itemsPerPage]);

  // Stable memoized callbacks that won't change reference
  const handleSearchChange = useCallback((event) => {
    setSearchQuery(event.target.value);
  }, []);

  // Reset page to 1 when search query changes
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [debouncedSearchQuery]);

  // Keep focus on search input after search
  useEffect(() => {
    if (debouncedSearchQuery) {
      searchInputRef.current?.focus();
    }
  }, [debouncedSearchQuery]);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setCurrentPage(1); // Always reset to page 1
  }, []);

  const handleNextPage = useCallback((e) => {
    e.preventDefault(); 
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, totalPages]);

  const handlePrevPage = useCallback((e) => {
    e.preventDefault(); 
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage]);

  const handlePageClick = useCallback((e, pageNum) => {
    e.preventDefault(); 
    setCurrentPage(pageNum);
  }, []);

  const handleItemClick = useCallback((item) => {
    fetchItemById(item.id);
  }, [fetchItemById]);

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-6 py-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Products Available</h2>
            <p className="text-gray-600 mb-6">
              Loading available products from our inventory...
            </p>
          </div>
          
          {/* Loading skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse shadow-sm">
                <div className="h-40 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-3"></div>
                <div className="h-6 bg-gray-200 rounded mb-4 w-20"></div>
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <Header 
          ref={searchInputRef}
          totalItems={totalItems}
          currentPage={currentPage}
          totalPages={totalPages}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onClear={handleClearSearch}
        />

        {/* Products Grid - Improved layout */}
        {items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {items.map((item, index) => (
              <div 
                key={item.id || index} 
                className="bg-white rounded-xl border border-gray-200 hover:border-green-300 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => handleItemClick(item)}
              >
                {/* Product Image/Icon Area - Enhanced */}
                <div className="relative h-40 bg-gradient-to-br from-green-50 to-green-100 rounded-lg mb-4 flex items-center justify-center group-hover:from-green-100 group-hover:to-green-200 transition-all duration-300 overflow-hidden">
                  <div className="text-center transform group-hover:scale-105 transition-transform duration-300">
                    <div className="w-16 h-16 bg-green-400 rounded-xl mx-auto mb-3 flex items-center justify-center shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-600">Product</span>
                  </div>
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-green-400 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-lg"></div>
                </div>

                {/* Product Info - Enhanced */}
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800 mb-1 truncate group-hover:text-green-700 transition-colors">
                      {item.name || 'Product Name'}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {item.description || 'High-quality product with excellent features and performance.'}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-xl font-bold text-gray-900">
                      €{item.price || '1,549.00'}
                    </p>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      In Stock
                    </span>
                  </div>

                  {/* Rating and Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <StarRating rating={item.rating || 4.5} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery ? `No results for "${searchQuery}"` : 'No products available at the moment'}
            </p>
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        )}

        {/* Pagination - Enhanced */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
            <div className="flex items-center space-x-2">
              <button 
                onClick={handlePrevPage} 
                disabled={currentPage === 1} 
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                <span>Previous</span>
              </button>
              
              <div className="flex items-center space-x-2">
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                  if (pageNum > totalPages) return null;
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={(e) => handlePageClick(e, pageNum)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        currentPage === pageNum
                          ? 'bg-green-500 text-white'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button 
                onClick={handleNextPage} 
                disabled={currentPage === totalPages} 
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                <span>Next</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Assignment Info Section */}
        <AssignmentInfo />

        {/* Modal */}
        <Modal 
          isOpen={isModalOpen} 
          onClose={closeModal} 
          item={selectedItem} 
        />
      </div>
    </div>
  );
}

export default SimilarProducts;
