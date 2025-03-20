import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

const Waiter = () => {
  // Sample tables data
  const [tables, setTables] = useState([
    { id: 1, tableNumber: 1, status: 'Available', order: null },
    { id: 2, tableNumber: 2, status: 'Occupied', order: '1x Pizza, 2x Coke' },
    { id: 3, tableNumber: 3, status: 'Available', order: null },
    { id: 4, tableNumber: 4, status: 'Occupied', order: '3x Tacos, 1x Salad' },
    { id: 5, tableNumber: 5, status: 'Available', order: null },
  ]);

  // State for new order
  const [newOrder, setNewOrder] = useState({
    tableNumber: '',
    items: '',
  });

  // Handle input change for new order
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOrder({ ...newOrder, [name]: value });
  };

  // Add new order
  const addOrder = () => {
    if (newOrder.tableNumber && newOrder.items) {
      const updatedTables = tables.map((table) =>
        table.tableNumber === parseInt(newOrder.tableNumber)
          ? { ...table, status: 'Occupied', order: newOrder.items }
          : table
      );
      setTables(updatedTables);
      setNewOrder({ tableNumber: '', items: '' }); // Reset form
    } else {
      alert('Please fill in all fields.');
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
          <h2 className="text-3xl font-bold text-gray-800">Waiter Dashboard</h2>
        </div>

        {/* Add New Order Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Take New Order</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="number"
              name="tableNumber"
              placeholder="Table Number"
              value={newOrder.tableNumber}
              onChange={handleInputChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="text"
              name="items"
              placeholder="Items (e.g., 2x Burger, 1x Fries)"
              value={newOrder.items}
              onChange={handleInputChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <button
            onClick={addOrder}
            className="mt-4 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition duration-300"
          >
            Add Order
          </button>
        </div>

        {/* Tables Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Tables</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {tables.map((table) => (
              <div key={table.id} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <p className="text-lg font-semibold text-gray-800">Table {table.tableNumber}</p>
                <p
                  className={`text-sm ${
                    table.status === 'Available' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {table.status}
                </p>
                {table.order && (
                  <p className="text-sm text-gray-600 mt-2">Order: {table.order}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Waiter;