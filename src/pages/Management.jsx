import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { PDFDownloadLink } from "@react-pdf/renderer";
import BillPDF from "../components/BillPDF";
import axios from "axios";

const Management = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);

  // Fetch table data
  useEffect(() => {
    const fetchTables = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/tables`
        );
        const mappedTables = response.data.map((table) => ({
          id: table._id,
          tableNumber: table.tableNo,
          capacity: table.capacity || 4,
          status: table.status,
          order: (table.menuItems || [])
            .map((item) => `${item.quantity}x ${item.menuItem?.name || "Unknown Item"}`)
            .join(", "),
          billAmount: (table.menuItems || []).reduce(
            (total, item) => total + (item.menuItem?.price || 0) * item.quantity,
            0
          ),
          customerName: table.customerName || "Walk-in Customer",
          customerPhone: table.customerPhone || "N/A",
          currentOrder: table.currentOrder || null,
          hasActiveOrder: table.status !== "Available",
          menuItems: table.menuItems || [] // Ensure menuItems is always an array
        }));
        setTables(mappedTables);
      } catch (err) {
        console.error("Failed to fetch table data:", err);
      }
      setLoading(false);
    };

    fetchTables();
  }, []);

  // Fetch order details
  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/orders/${orderId}`
      );
      setOrderDetails(response.data);
    } catch (error) {
      console.error("Error fetching order details:", error);
      // Fallback to table data if order details fetch fails
      const table = tables.find(t => t.currentOrder === orderId);
      if (table) {
        setOrderDetails({
          customerName: table.customerName,
          phoneNumber: table.customerPhone,
          status: "in-progress",
          items: (table.menuItems || []).map(item => ({
            name: item.menuItem?.name || "Unknown Item",
            quantity: item.quantity,
            price: item.menuItem?.price || 0
          })),
          total: table.billAmount
        });
      }
    }
  };

  // Handle viewing order
  const handleViewOrder = (table) => {
    if (table.hasActiveOrder) {
      setViewingOrder(table);
      if (table.currentOrder) {
        fetchOrderDetails(table.currentOrder);
      } else {
        // Handle case where there's no order ID but table is occupied
        setOrderDetails({
          customerName: table.customerName,
          phoneNumber: table.customerPhone,
          status: "in-progress",
          items: (table.menuItems || []).map(item => ({
            name: item.menuItem?.name || "Unknown Item",
            quantity: item.quantity,
            price: item.menuItem?.price || 0
          })),
          total: table.billAmount
        });
      }
    } else {
      alert("No active order for this table");
    }
  };

  // Handle print complete and table release
  const handlePrintComplete = async (tableId) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/tables/${tableId}/release`
      );
      
      setTables(prevTables => 
        prevTables.map(table => 
          table.id === tableId 
            ? { 
                ...table, 
                status: "Available", 
                order: "", 
                billAmount: 0,
                customerName: "",
                customerPhone: "",
                currentOrder: null,
                hasActiveOrder: false,
                menuItems: []
              } 
            : table
        )
      );
      setViewingOrder(null);
      setOrderDetails(null);
    } catch (error) {
      console.error("Error releasing table:", error);
      alert("Failed to release table. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Table Management</h2>
        </div>

        {/* Tables Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Table Status
          </h3>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {tables.map((table) => (
                <div key={table.id} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <p className="text-lg font-semibold text-gray-800">
                    Table {table.tableNumber}
                  </p>
                  <p className="text-sm text-gray-600">
                    Capacity: {table.capacity}
                  </p>
                  <p className={`text-sm ${
                    table.status === "Available" ? "text-green-600" : "text-red-600"
                  }`}>
                    Status: {table.status}
                  </p>
                  
                  {table.hasActiveOrder && (
                    <>
                      <p className="text-sm text-gray-600 mt-2">
                        Customer: {table.customerName}
                      </p>
                      <p className="text-sm text-gray-600">
                        Phone: {table.customerPhone}
                      </p>
                      <p className="text-sm text-gray-600">
                        Order: {table.order}
                      </p>
                      <p className="text-sm text-gray-600">
                        Bill Amount: ₹{table.billAmount.toFixed(2)}
                      </p>
                      
                      <div className="mt-2 flex flex-wrap gap-2">
                        <button
                          onClick={() => handleViewOrder(table)}
                          className="text-white bg-blue-400 hover:bg-blue-600 px-2 py-1 rounded text-sm"
                        >
                          View Order
                        </button>
                        <PDFDownloadLink
                          document={
                            <BillPDF 
                              table={table}
                              customer={{
                                name: table.customerName,
                                phone: table.customerPhone
                              }}
                              items={table.menuItems || []}
                            />
                          }
                          fileName={`Bill_Table_${table.tableNumber}.pdf`}
                          onClick={() => handlePrintComplete(table.id)}
                        >
                          {({ loading }) => (
                            <button className="bg-orange-600 text-white px-2 py-1 rounded text-sm hover:bg-orange-700">
                              {loading ? "Generating..." : "Print Bill"}
                            </button>
                          )}
                        </PDFDownloadLink>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Details Modal */}
        {viewingOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">
                  Order Details for Table {viewingOrder.tableNumber}
                </h3>
                <button 
                  onClick={() => {
                    setViewingOrder(null);
                    setOrderDetails(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {orderDetails ? (
                <div>
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-800">Customer Information</h4>
                    <p>Name: {orderDetails.customerName || "Walk-in Customer"}</p>
                    <p>Phone: {orderDetails.phoneNumber || "N/A"}</p>
                    <p>Status: <span className={`px-2 py-1 rounded-full text-xs ${
                      orderDetails.status === 'completed' 
                        ? 'bg-green-100 text-green-700' 
                        : orderDetails.status === 'preparing' 
                        ? 'bg-yellow-100 text-yellow-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {orderDetails.status}
                    </span></p>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-800">Order Items</h4>
                    {orderDetails.items && orderDetails.items.length > 0 ? (
                      <div className="border rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {orderDetails.items.map((item, index) => (
                              <tr key={index}>
                                <td className="px-4 py-2 whitespace-nowrap">{item.name}</td>
                                <td className="px-4 py-2 whitespace-nowrap">{item.quantity}</td>
                                <td className="px-4 py-2 whitespace-nowrap">₹{item.price.toFixed(2)}</td>
                                <td className="px-4 py-2 whitespace-nowrap">₹{(item.price * item.quantity).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="bg-gray-50">
                            <tr>
                              <td colSpan="3" className="px-4 py-2 text-right font-medium">Total Amount:</td>
                              <td className="px-4 py-2 font-medium">₹{orderDetails.total.toFixed(2)}</td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    ) : (
                      <p className="text-gray-500">No items in this order</p>
                    )}
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => {
                        setViewingOrder(null);
                        setOrderDetails(null);
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                    >
                      Close
                    </button>
                    <PDFDownloadLink
                      document={
                        <BillPDF 
                          table={viewingOrder}
                          customer={{
                            name: orderDetails.customerName,
                            phone: orderDetails.phoneNumber
                          }}
                          items={orderDetails.items || []}
                        />
                      }
                      fileName={`Bill_Table_${viewingOrder.tableNumber}.pdf`}
                      onClick={() => handlePrintComplete(viewingOrder.id)}
                    >
                      {({ loading }) => (
                        <button className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition">
                          {loading ? "Generating..." : "Print Bill & Release"}
                        </button>
                      )}
                    </PDFDownloadLink>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Management;