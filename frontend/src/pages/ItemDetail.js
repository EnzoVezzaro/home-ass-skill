import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import StarRating from '../components/StarRating';

function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/items/${id}`);
        if (!response.ok) {
          throw new Error('Item not found');
        }
        const data = await response.json();
        setItem(data);
      } catch (error) {
        console.error('Error fetching item:', error);
        navigate('/'); // Redirect to home if item not found or on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchItem();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-6 py-8">
          <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-lg animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-12 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-20 bg-gray-200 rounded mb-6"></div>
            <div className="flex justify-between items-center">
              <div className="h-6 bg-gray-200 rounded w-28"></div>
              <div className="h-10 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return null; // Or a "not found" message
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-6">
        <div className="mb-8">
          <Link to="/" className="text-green-600 hover:text-green-800 transition-colors">
            &larr; Back to Products
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image Section */}
            <div className="p-8 bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
              <div className="text-center">
                <div className="w-48 h-48 bg-green-400 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-2xl">
                  <svg className="w-24 h-24 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <span className="text-lg font-medium text-gray-700">Product Image</span>
              </div>
            </div>

            {/* Details Section */}
            <div className="p-8 md:p-12">
              <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full mb-3 inline-block">
                {item.category || 'General'}
              </span>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{item.name}</h1>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                {item.description || 'This is a high-quality product with excellent features and long-lasting performance. It is designed to meet your needs and exceed your expectations.'}
              </p>

              <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
                <p className="text-4xl font-extrabold text-gray-900">
                  €{item.price}
                </p>
                <div className="flex items-center">
                  <StarRating rating={item.rating || 0} />
                  <span className="ml-2 text-gray-500">({item.reviews || 0} reviews)</span>
                </div>
              </div>

              <div className="space-y-4">
                <button className="w-full bg-green-500 text-white font-bold py-4 px-6 rounded-xl hover:bg-green-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1">
                  Add to Cart
                </button>
                <button className="w-full bg-gray-100 text-gray-800 font-bold py-4 px-6 rounded-xl hover:bg-gray-200 transition-all duration-300">
                  Add to Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemDetail;
