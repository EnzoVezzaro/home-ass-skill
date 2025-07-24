import React, { createContext, useCallback, useContext, useState } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null); // State for the selected item
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

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

  // Function to fetch a single item by ID
  const fetchItemById = useCallback(async (itemId, signal) => {
    try {
      const res = await fetch(`http://localhost:3001/api/items/${itemId}`, { signal });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setSelectedItem(data); // Set the selected item
      setIsModalOpen(true); // Open the modal
      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Fetch item by ID aborted');
      } else {
        console.error('Error fetching item by ID:', error);
      }
      throw error;
    }
  }, []);

  // Function to close the modal
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedItem(null); // Clear selected item when closing
  }, []);

  return (
    <DataContext.Provider value={{ items, fetchItems, totalPages, totalItems, selectedItem, isModalOpen, fetchItemById, closeModal }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
