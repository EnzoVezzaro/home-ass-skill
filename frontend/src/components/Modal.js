import React from 'react';

function Modal({ isOpen, onClose, item }) {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{item.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div className="space-y-2">
          <p><span className="font-semibold">ID:</span> {item.id}</p>
          <p><span className="font-semibold">Category:</span> {item.category}</p>
          <p><span className="font-semibold">Price:</span> ${item.price.toFixed(2)}</p>
          {/* Add more item details as needed */}
        </div>
      </div>
    </div>
  );
}

export default Modal;
