import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/v1/orders");

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched orders:", JSON.stringify(data, null, 2)); // Debug API response

        // Ensure data is an array before setting state
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          setError("Invalid data format from API");
          console.error("Unexpected API response format:", data);
        }
      } catch (error) {
        setError("Failed to fetch orders");
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const cancelOrder = async (orderId) => {
    if (!orderId) {
      alert("❌ Invalid order ID.");
      return;
    }

    const confirmCancel = window.confirm(`Are you sure you want to cancel Order #${orderId}?`);
    if (!confirmCancel) return;

    try {
      const response = await fetch(`http://localhost:8000/api/v1/orders/${orderId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to cancel order");
      }

      setOrders((prevOrders) => prevOrders.filter((order) => (order.orderId || order._id) !== orderId));

      alert(`✅ Order #${orderId} cancelled successfully!`);
    } catch (error) {
      console.error("Error canceling order:", error);
      alert("❌ Failed to cancel order. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />

      <div className="flex-1 p-8">
        <h2 className="text-3xl font-bold text-gray-800">Orders</h2>

        {loading && <p>Loading orders...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && orders.length === 0 && <p>No orders found.</p>}

        {!loading && orders.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2">Order ID</th>
                  <th className="py-2">Customer</th>
                  <th className="py-2">Phone</th>
                  <th className="py-2">Table</th>
                  <th className="py-2">Items</th>
                  <th className="py-2">Total</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const orderId = order?.orderId || order?._id || "N/A";
                  const customerName = order?.customerName || "Unknown";
                  const phoneNumber = "N/A"; // Not available in API response
                  const tableNumber = order?.tableNumber || "N/A";
                  const status = order?.status || "Unknown";

                  // Extract item names
                  const itemNames = order?.items?.map((item) => item.name || "Unnamed Item").join(", ") || "N/A";

                  // Calculate total price if missing
                  const totalAmount =
                    typeof order?.total === "number"
                      ? order.total.toFixed(2)
                      : order.items?.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0).toFixed(2) || "N/A";

                  return (
                    <tr key={orderId} className="border-b hover:bg-gray-50">
                      <td className="py-4">#{orderId}</td>
                      <td className="py-4">{customerName}</td>
                      <td className="py-4">{phoneNumber}</td>
                      <td className="py-4">{tableNumber}</td>
                      <td className="py-4">{itemNames}</td>
                      <td className="py-4">₹{totalAmount}</td>
                      <td className="py-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">{status}</span>
                      </td>
                      <td className="py-4 flex space-x-4">
                        <button className="text-orange-600 hover:text-orange-700">View</button>
                        <button
                          onClick={() => cancelOrder(orderId)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
