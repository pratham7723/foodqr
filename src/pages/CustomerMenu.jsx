import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const CustomerMenu = () => {
  // Sample menu data
  const menuItems = [
    { id: 1, name: 'Classic Burger', category: 'Burgers', price: 9.99, photo: 'https://via.placeholder.com/150', arModel: 'https://example.com/ar-model-1' },
    { id: 2, name: 'Margherita Pizza', category: 'Pizza', price: 12.99, photo: 'https://via.placeholder.com/150', arModel: 'https://example.com/ar-model-2' },
    { id: 3, name: 'Grilled Chicken Salad', category: 'Salads', price: 8.99, photo: 'https://via.placeholder.com/150', arModel: 'https://example.com/ar-model-3' },
    { id: 4, name: 'Spaghetti Bolognese', category: 'Pasta', price: 11.99, photo: 'https://via.placeholder.com/150', arModel: 'https://example.com/ar-model-4' },
    { id: 5, name: 'Chocolate Lava Cake', category: 'Desserts', price: 6.99, photo: 'https://via.placeholder.com/150', arModel: 'https://example.com/ar-model-5' },
  ];

  // State for selected category
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Get unique categories
  const categories = ['All', ...new Set(menuItems.map((item) => item.category))];

  // Filter menu items by category
  const filteredMenuItems = selectedCategory === 'All'
    ? menuItems
    : menuItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Our Menu</h1>
        <p className="text-gray-600">Explore our delicious dishes and visualize them in AR!</p>
      </div>

      {/* Category Filters */}
      <div className="flex justify-center space-x-4 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg ${
              selectedCategory === category
                ? 'bg-orange-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            } transition duration-300`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredMenuItems.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            {/* Menu Item Photo */}
            <img
              src={item.photo}
              alt={item.name}
              className="w-full h-40 object-cover rounded-lg mb-4"
            />

            {/* Menu Item Details */}
            <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
            <p className="text-sm text-gray-600">{item.category}</p>
            <p className="text-lg font-bold text-orange-600 mt-2">${item.price.toFixed(2)}</p>

            {/* AR Model Button */}
            <div className="mt-4">
              <a
                href={item.arModel}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition duration-300 block text-center"
              >
                View in AR
              </a>
            </div>
          </div>
        ))}
      </div>

    
    </div>
  );
};

export default CustomerMenu;