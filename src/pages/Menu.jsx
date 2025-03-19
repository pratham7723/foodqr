import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

const Menu = () => {
  // Sample menu data
  const [menuItems, setMenuItems] = useState([
    { id: 1, name: 'Classic Burger', category: 'Burgers', price: 9.99, status: 'Available', photo: '', arModel: '' },
    { id: 2, name: 'Margherita Pizza', category: 'Pizza', price: 12.99, status: 'Available', photo: '', arModel: '' },
    { id: 3, name: 'Grilled Chicken Salad', category: 'Salads', price: 8.99, status: 'Out of Stock', photo: '', arModel: '' },
    { id: 4, name: 'Spaghetti Bolognese', category: 'Pasta', price: 11.99, status: 'Available', photo: '', arModel: '' },
    { id: 5, name: 'Chocolate Lava Cake', category: 'Desserts', price: 6.99, status: 'Available', photo: '', arModel: '' },
  ]);

  // State for adding new menu item
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    price: '',
    status: 'Available',
    photo: '',
    arModel: '',
  });

  // Handle input change for new item form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  // Handle photo upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewItem({ ...newItem, photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle AR model upload
  const handleARModelUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewItem({ ...newItem, arModel: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Add new menu item
  const addMenuItem = () => {
    if (newItem.name && newItem.category && newItem.price) {
      const menuItem = { ...newItem, id: menuItems.length + 1 };
      setMenuItems([...menuItems, menuItem]);
      setNewItem({ name: '', category: '', price: '', status: 'Available', photo: '', arModel: '' }); // Reset form
    } else {
      alert('Please fill in all required fields.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Menu</h2>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search menu items..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition duration-300">
              Add New Item
            </button>
          </div>
        </div>

        {/* Add New Item Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Add New Menu Item</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={newItem.name}
              onChange={handleInputChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={newItem.category}
              onChange={handleInputChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={newItem.price}
              onChange={handleInputChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <select
              name="status"
              value={newItem.status}
              onChange={handleInputChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="Available">Available</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="file"
              accept=".glb,.gltf"
              onChange={handleARModelUpload}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <button
            onClick={addMenuItem}
            className="mt-4 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition duration-300"
          >
            Add Item
          </button>
        </div>

        {/* Menu Table */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">ID</th>
                <th className="py-2">Photo</th>
                <th className="py-2">Name</th>
                <th className="py-2">Category</th>
                <th className="py-2">Price</th>
                <th className="py-2">Status</th>
                <th className="py-2">AR Model</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="py-4">{item.id}</td>
                  <td className="py-4">
                    {item.photo ? (
                      <img src={item.photo} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                    ) : (
                      <span className="text-gray-500">No Photo</span>
                    )}
                  </td>
                  <td className="py-4">{item.name}</td>
                  <td className="py-4">{item.category}</td>
                  <td className="py-4">${item.price.toFixed(2)}</td>
                  <td className="py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        item.status === 'Available'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4">
                    {item.arModel ? (
                      <a
                        href={item.arModel}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-600 hover:text-orange-700"
                      >
                        View AR Model
                      </a>
                    ) : (
                      <span className="text-gray-500">No AR Model</span>
                    )}
                  </td>
                  <td className="py-4">
                    <button className="text-orange-600 hover:text-orange-700 mr-2">
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-700">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Menu;