import React from 'react';
import Sidebar from '../components/Sidebar';
import { QRCodeSVG } from 'qrcode.react';

const TableOrders = () => {
  // Sample data for tables
  const tables = [
    { id: 1, tableNumber: 1, status: 'Occupied' },
    { id: 2, tableNumber: 2, status: 'Available' },
    { id: 3, tableNumber: 3, status: 'Occupied' },
    { id: 4, tableNumber: 4, status: 'Available' },
    { id: 5, tableNumber: 5, status: 'Available' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Table Management</h2>
          <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition duration-300">
            Add Table
          </button>
        </div>

        {/* Table Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {tables.map((table) => (
            <div key={table.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              {/* Table Info */}
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-800">Table {table.tableNumber}</h3>
                <span
                  className={`px-2 py-1 rounded-full text-sm ${
                    table.status === 'Occupied'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-green-100 text-green-700'
                  }`}
                >
                  {table.status}
                </span>
              </div>

              {/* QR Code for Menu */}
              <div className="mt-4 flex justify-center">
                <QRCodeSVG
                  value={`https://your-restaurant.com/menu?table=${table.tableNumber}`} // Replace with your actual URL
                  size={120}
                  level="H"
                  includeMargin={true}
                />
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex justify-center space-x-2">
                <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition duration-300">
                  Edit
                </button>
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TableOrders;