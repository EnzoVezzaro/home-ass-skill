import React, { useEffect, useRef } from 'react';
import { useData } from '../state/DataContext';
import { Link } from 'react-router-dom';

function Items() {
  const { items, fetchItems } = useData();
  const isMountedRef = useRef(true);

  useEffect(() => {
    // Create AbortController for request cancellation
    const abortController = new AbortController();
    isMountedRef.current = true;

    // Fetch items with proper cleanup handling
    const fetchData = async () => {
      try {
        // Pass abort signal if fetchItems supports it
        await fetchItems(abortController.signal);
        
        // Only proceed if component is still mounted and request wasn't aborted
        if (!isMountedRef.current || abortController.signal.aborted) {
          console.log('Component unmounted or request aborted');
          return;
        }
      } catch (error) {
        // Don't log aborted requests as errors
        if (error.name === 'AbortError') {
          console.log('Request was cancelled');
          return;
        }
        
        // Only log actual errors if component is still mounted
        if (isMountedRef.current) {
          console.error('Error fetching items:', error);
        }
      }
    };

    fetchData();

    // Cleanup function to prevent memory leaks
    return () => {
      isMountedRef.current = false;
      abortController.abort(); // Cancel ongoing request
    };
  }, [fetchItems]);

  if (!items.length) return <p>Loading...</p>;

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          <Link to={`/items/${item.id}`}>{item.name}</Link>
        </li>
      ))}
    </ul>
  );
}

export default Items;