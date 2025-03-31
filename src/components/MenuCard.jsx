import React from 'react';

const MenuCard = ({ item }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-center">
        {/* Menu Details */}
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
          <p className="text-sm text-gray-600">{item.category}</p>
          <p className="text-lg font-bold text-orange-600 mt-2">${item.price.toFixed(2)}</p>
          <p className="text-sm text-gray-700">Quantity: {item.quantity}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex space-x-2">
        <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition duration-300">
          Edit
        </button>
        <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300">
          Remove
        </button>
      </div>
    </div>
  );
};

export default MenuCard;