import React from 'react';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition duration-300">
              Notifications
            </button>
          </div>
        </div>

        {/* Metrics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Orders */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Total Orders</h3>
            <p className="text-3xl font-bold text-orange-600">1,234</p>
            <p className="text-sm text-gray-500">+12% from last month</p>
          </div>

          {/* Revenue */} 
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Revenue</h3>
            <p className="text-3xl font-bold text-orange-600">$12,345</p>
            <p className="text-sm text-gray-500">+8% from last month</p>
          </div>

          {/* Active Tables */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Active Tables</h3>
            <p className="text-3xl font-bold text-orange-600">18</p>
            <p className="text-sm text-gray-500">5 tables available</p>
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Recent Orders</h3>
          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Order ID</th>
                <th className="py-2">Customer</th>
                <th className="py-2">Items</th>
                <th className="py-2">Total</th>
                <th className="py-2">Table</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {/* Example Order Rows */}
              <tr className="border-b hover:bg-gray-50">
                <td className="py-4">#12345</td>
                <td className="py-4">John Doe</td>
                <td className="py-4">2x Burger, 1x Fries</td>
                <td className="py-4">$25.00</td>
                <td className="py-4">Table 1</td>
                <td className="py-4">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    Completed
                  </span>
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-4">#12346</td>
                <td className="py-4">Jane Smith</td>
                <td className="py-4">1x Pizza, 2x Coke</td>
                <td className="py-4">$18.50</td>
                <td className="py-4">Table 3</td>
                <td className="py-4">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                    Preparing
                  </span>
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-4">#12347</td>
                <td className="py-4">Mike Johnson</td>
                <td className="py-4">3x Tacos, 1x Salad</td>
                <td className="py-4">$22.00</td>
                <td className="py-4">Table 5</td>
                <td className="py-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    Pending
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;