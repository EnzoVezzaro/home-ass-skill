import React, { createContext, useCallback, useContext, useState } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchItems = useCallback(async (searchQuery = '', currentPage = 1, itemsPerPage = 5, signal) => {
    // Construct URL
    let url = `http://localhost:3001/api/items?page=${currentPage}&limit=${itemsPerPage}`;
    if (searchQuery) {
      url += `&q=${encodeURIComponent(searchQuery)}`;
    }

    try {
      const res = await fetch(url, { signal });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      
      // Update context state
      setItems(data.items);
      setTotalPages(data.totalPages);
      setTotalItems(data.totalItems);

      // Return the full response object for the component to use
      return data; 
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Fetch aborted');
      } else {
        console.error('Error fetching items in DataContext:', error);
      }
      throw error; // Re-throw to be caught by the component
    }
  }, []); // Dependencies for useCallback: empty for now, assuming fetchItems logic is stable.

  return (
    <DataContext.Provider value={{ items, fetchItems, totalPages, totalItems }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
