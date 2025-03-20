import React from 'react';
import Sidebar from '../components/Sidebar';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Reports = () => {
  // Sample data for daily orders and sales
  const dailyData = [
    { day: 'Monday', orders: 45, sales: 1200 },
    { day: 'Tuesday', orders: 60, sales: 1500 },
    { day: 'Wednesday', orders: 55, sales: 1400 },
    { day: 'Thursday', orders: 70, sales: 1800 },
    { day: 'Friday', orders: 85, sales: 2200 },
    { day: 'Saturday', orders: 90, sales: 2500 },
    { day: 'Sunday', orders: 80, sales: 2300 },
  ];

  // Sample data for most ordered items
  const mostOrderedItems = [
    { name: 'Classic Burger', orders: 120 },
    { name: 'Margherita Pizza', orders: 95 },
    { name: 'Grilled Chicken Salad', orders: 80 },
    { name: 'Spaghetti Bolognese', orders: 70 },
    { name: 'Chocolate Lava Cake', orders: 60 },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Reports</h2>
        </div>

        {/* Daily Orders and Sales Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Daily Orders and Sales</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="orders" fill="#8884d8" name="Orders" />
              <Bar dataKey="sales" fill="#82ca9d" name="Sales ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Most Ordered Items Table */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Most Ordered Items</h3>
          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Item</th>
                <th className="py-2">Orders</th>
              </tr>
            </thead>
            <tbody>
              {mostOrderedItems.map((item) => (
                <tr key={item.name} className="border-b hover:bg-gray-50">
                  <td className="py-4">{item.name}</td>
                  <td className="py-4">{item.orders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Additional Reports */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Total Orders */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Total Orders</h3>
            <p className="text-3xl font-bold text-orange-600">1,234</p>
            <p className="text-sm text-gray-500">+12% from last month</p>
          </div>

          {/* Total Revenue */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Total Revenue</h3>
            <p className="text-3xl font-bold text-orange-600">$12,345</p>
            <p className="text-sm text-gray-500">+8% from last month</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;