import React from 'react';
import Sidebar from '../components/Sidebar';

const Orders = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Orders</h2>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search orders..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition duration-300">
              Filter
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Order ID</th>
                <th className="py-2">Customer</th>
                <th className="py-2">Items</th>
                <th className="py-2">Total</th>
                <th className="py-2">Status</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Example Order Rows */}
              <tr className="border-b hover:bg-gray-50">
                <td className="py-4">#12345</td>
                <td className="py-4">John Doe</td>
                <td className="py-4">2x Burger, 1x Fries</td>
                <td className="py-4">$25.00</td>
                <td className="py-4">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    Completed
                  </span>
                </td>
                <td className="py-4">
                  <button className="text-orange-600 hover:text-orange-700">
                    View
                  </button>
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-4">#12346</td>
                <td className="py-4">Jane Smith</td>
                <td className="py-4">1x Pizza, 2x Coke</td>
                <td className="py-4">$18.50</td>
                <td className="py-4">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                    Preparing
                  </span>
                </td>
                <td className="py-4">
                  <button className="text-orange-600 hover:text-orange-700">
                    View
                  </button>
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-4">#12347</td>
                <td className="py-4">Mike Johnson</td>
                <td className="py-4">3x Tacos, 1x Salad</td>
                <td className="py-4">$22.00</td>
                <td className="py-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    Pending
                  </span>
                </td>
                <td className="py-4">
                  <button className="text-orange-600 hover:text-orange-700">
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;