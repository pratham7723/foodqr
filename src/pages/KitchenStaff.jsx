import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

const KitchenStaff = () => {
  // Sample orders data
  const [orders, setOrders] = useState([
    { id: 1, tableNumber: 1, items: '2x Burger, 1x Fries', status: 'Pending' },
    { id: 2, tableNumber: 3, items: '1x Pizza, 2x Coke', status: 'Pending' },
    { id: 3, tableNumber: 5, items: '3x Tacos, 1x Salad', status: 'New' },
  ]);

  // Mark order as completed
  const markOrderAsCompleted = (orderId) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: 'Completed' } : order
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Kitchen Staff Dashboard</h2>
        </div>

        {/* Orders Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* New Orders */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">New Orders</h3>
            {orders
              .filter((order) => order.status === 'New')
              .map((order) => (
                <div key={order.id} className="border-b pb-4 mb-4">
                  <p className="text-lg font-semibold text-gray-800">Table {order.tableNumber}</p>
                  <p className="text-sm text-gray-600">{order.items}</p>
                  <button
                    onClick={() => markOrderAsCompleted(order.id)}
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition duration-300 mt-2"
                  >
                    Mark as Completed
                  </button>
                </div>
              ))}
          </div>

          {/* Pending Orders */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Pending Orders</h3>
            {orders
              .filter((order) => order.status === 'Pending')
              .map((order) => (
                <div key={order.id} className="border-b pb-4 mb-4">
                  <p className="text-lg font-semibold text-gray-800">Table {order.tableNumber}</p>
                  <p className="text-sm text-gray-600">{order.items}</p>
                  <button
                    onClick={() => markOrderAsCompleted(order.id)}
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition duration-300 mt-2"
                  >
                    Mark as Completed
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KitchenStaff;