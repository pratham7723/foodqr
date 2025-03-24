import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // 'all', 'pending', 'preparing', 'completed', 'cancelled'
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/api/v1/orders");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      
      // Handle both array and { data: array } responses
      const ordersData = Array.isArray(data) ? data : (data.data || []);
      
      if (!Array.isArray(ordersData)) {
        throw new Error("Invalid data format from API");
      }

      setOrders(ordersData);
      setLastUpdated(new Date());
      setError("");
    } catch (error) {
      setError(`Failed to fetch orders: ${error.message}`);
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const intervalId = setInterval(fetchOrders, 30000); // Auto-refresh every 30 seconds
    return () => clearInterval(intervalId);
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
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to cancel order");
      }

      setOrders(prevOrders => prevOrders.filter(order => 
        (order.orderId || order._id) !== orderId
      ));

      alert(`✅ Order #${orderId} cancelled successfully!`);
    } catch (error) {
      console.error("Error canceling order:", error);
      alert(`❌ Failed to cancel order: ${error.message}`);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus.toLowerCase() }) // Ensure lowercase
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update order status");
      }

      const updatedOrder = await response.json();
      
      setOrders(prevOrders => 
        prevOrders.map(order => 
          (order.orderId || order._id) === orderId ? updatedOrder : order
        )
      );

      return true;
    } catch (error) {
      console.error("Error updating order status:", error);
      alert(`❌ Failed to update order: ${error.message}`);
      return false;
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === "all") return true;
    return order.status?.toLowerCase() === filter.toLowerCase();
  });

  const formatItems = (items) => {
    if (!items || !Array.isArray(items)) return "No items";
    return items.map(item => 
      `${item.quantity || 1}x ${item.name || 'Unnamed Item'} (₹${item.price || 0})`
    ).join(', ');
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800",
      preparing: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800"
    };
    
    const normalizedStatus = status?.toLowerCase() || 'unknown';
    const colorClass = statusColors[normalizedStatus] || "bg-gray-100 text-gray-800";
    
    return (
      <span className={`px-2 py-1 ${colorClass} rounded-full text-sm capitalize`}>
        {normalizedStatus}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />

      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Orders Management</h2>
          <div className="flex items-center space-x-2">
            {lastUpdated && (
              <span className="text-sm text-gray-500">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <button 
              onClick={fetchOrders}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
              disabled={loading}
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        <div className="mb-4 flex space-x-2">
          {['all', 'pending', 'preparing', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 rounded-full text-sm ${
                filter === status 
                  ? 'bg-orange-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            <p>{error}</p>
            <button 
              onClick={fetchOrders}
              className="mt-2 text-red-700 hover:text-red-800 font-medium"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && filteredOrders.length === 0 && (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-500 text-lg">No orders found</p>
            <p className="text-sm text-gray-400 mt-1">
              {filter === 'all' ? 'No orders in the system' : `No ${filter} orders`}
            </p>
          </div>
        )}

        {!loading && filteredOrders.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Table</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => {
                    const orderId = order.orderId || order._id;
                    const phoneNumber = order.phoneNumber || "N/A";
                    const specialInstructions = order.specialInstructions || "";

                    return (
                      <tr key={orderId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">#{orderId}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium">{order.customerName || "Unknown"}</div>
                          {specialInstructions && (
                            <div className="text-xs text-orange-600 mt-1">
                              Notes: {specialInstructions}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{phoneNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{order.tableNumber || "N/A"}</td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{formatItems(order.items)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          ₹{typeof order.total === 'number' ? order.total.toFixed(2) : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(order.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap space-x-2">
                          <button
                            onClick={() => {
                              const newStatus = order.status === 'preparing' ? 'completed' : 'preparing';
                              updateOrderStatus(orderId, newStatus);
                            }}
                            className={`px-3 py-1 rounded text-sm ${
                              order.status === 'preparing'
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                            disabled={['completed', 'cancelled'].includes(order.status?.toLowerCase())}
                          >
                            {order.status === 'preparing' ? 'Complete' : 'Start Preparing'}
                          </button>
                          <button
                            onClick={() => cancelOrder(orderId)}
                            className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                            disabled={['completed', 'cancelled'].includes(order.status?.toLowerCase())}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;