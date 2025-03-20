import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { PDFDownloadLink } from '@react-pdf/renderer';
import BillPDF from '../components/BillPDF'; // Component to generate PDF

const Management = () => {
  // Sample tables data
  const [tables, setTables] = useState([
    { id: 1, tableNumber: 1, capacity: 4, status: 'Occupied', order: '2x Burger, 1x Fries', billAmount: 25.0 },
    { id: 2, tableNumber: 2, capacity: 6, status: 'Available', order: null, billAmount: 0 },
    { id: 3, tableNumber: 3, capacity: 2, status: 'Occupied', order: '1x Pizza, 2x Coke', billAmount: 18.5 },
    { id: 4, tableNumber: 4, capacity: 8, status: 'Occupied', order: '3x Tacos, 1x Salad', billAmount: 22.0 },
    { id: 5, tableNumber: 5, capacity: 4, status: 'Available', order: null, billAmount: 0 },
  ]);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Management Dashboard</h2>
        </div>

        {/* Tables Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Table Status</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {tables.map((table) => (
              <div key={table.id} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <p className="text-lg font-semibold text-gray-800">Table {table.tableNumber}</p>
                <p className="text-sm text-gray-600">Capacity: {table.capacity}</p>
                <p
                  className={`text-sm ${
                    table.status === 'Available' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  Status: {table.status}
                </p>
                {table.order && (
                  <>
                    <p className="text-sm text-gray-600 mt-2">Order: {table.order}</p>
                    <p className="text-sm text-gray-600">Bill Amount: ${table.billAmount.toFixed(2)}</p>
                    <div className="mt-2">
                      <PDFDownloadLink
                        document={<BillPDF table={table} />}
                        fileName={`bill_table_${table.tableNumber}.pdf`}
                      >
                        {({ loading }) =>
                          loading ? (
                            <button className="bg-gray-600 text-white px-4 py-2 rounded-lg">
                              Loading...
                            </button>
                          ) : (
                            <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition duration-300">
                              Print Bill
                            </button>
                          )
                        }
                      </PDFDownloadLink>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Management;