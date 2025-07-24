import React, { memo, forwardRef } from 'react';
import SearchInput from './SearchInput';

const Header = memo(forwardRef(({ totalItems, currentPage, totalPages, searchQuery, onSearchChange, onClear }, ref) => (
  <div className="mb-8">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Products Available</h2>
        <p className="text-gray-600">
          Discover our collection of {totalItems} available products
        </p>
      </div>
      
      <div className="mt-4 md:mt-0">
        <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages} • {totalItems} total items
          </span>
        </div>
      </div>
    </div>
    
    <SearchInput 
      ref={ref}
      searchQuery={searchQuery}
      onSearchChange={onSearchChange}
      onClear={onClear}
    />
  </div>
)));

export default Header;
