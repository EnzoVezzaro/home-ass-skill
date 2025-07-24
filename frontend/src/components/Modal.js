import React from 'react';
import StarRating from './StarRating';

function Modal({ isOpen, onClose, item }) {
  if (!isOpen || !item) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full m-4 overflow-hidden transform transition-all duration-300 ease-in-out scale-95 hover:scale-100"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
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
          <div className="p-8 md:p-12 relative">
            <button 
              onClick={onClose} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

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
  );
}

export default Modal;
