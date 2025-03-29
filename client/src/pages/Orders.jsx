import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

const Orders = () => {
  // State for orders management
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [menuItems, setMenuItems] = useState([]);

  // State for manual order addition
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);
  const [newOrder, setNewOrder] = useState({
    customerName: "",
    phoneNumber: "",
    tableNumber: "",
    items: [{ menuItemId: "", name: "", price: 0, quantity: 1 }]
  });

  // Fetch orders and menu items from API
  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [ordersResponse, menuResponse] = await Promise.all([
        fetch(`${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/orders`),
        fetch(`${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/menus`)
      ]);

      if (!ordersResponse.ok) throw new Error(`Orders fetch failed: ${ordersResponse.status}`);
      if (!menuResponse.ok) throw new Error(`Menu fetch failed: ${menuResponse.status}`);

      const ordersData = await ordersResponse.json();
      const menuData = await menuResponse.json();

      setOrders(Array.isArray(ordersData) ? ordersData : (ordersData.data || []));
      setMenuItems(Array.isArray(menuData) ? menuData : (menuData.data || []));
      setLastUpdated(new Date());
      setError("");
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(`Failed to fetch data: ${error.message}`);
      
      // Fallback to mock data if API fails (remove in production)
      if (error.message.includes("Menu fetch failed")) {
        setMenuItems([
          { _id: "1", name: "Burger", price: 120, category: "Main" },
          { _id: "2", name: "Pizza", price: 180, category: "Main" },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh data
  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 30000);
    return () => clearInterval(intervalId);
  }, []);

  // Cancel an order
  const cancelOrder = async (orderId) => {
    if (!orderId) {
      alert("❌ Invalid order ID.");
      return;
    }

    const confirmCancel = window.confirm(`Are you sure you want to cancel Order #${orderId}?`);
    if (!confirmCancel) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/orders/${orderId}`, {
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

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus.toLowerCase() })
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

  // Add new order manually
  const addOrderManually = async () => {
    try {
      if (!newOrder.customerName || !newOrder.phoneNumber || !newOrder.tableNumber) {
        throw new Error("Customer name, phone number, and table number are required");
      }
      if (newOrder.items.length === 0 || newOrder.items.some(item => !item.menuItemId)) {
        throw new Error("Please add at least one valid menu item");
      }

      setLoading(true);
      
      // Prepare items for the API
      const itemsForApi = newOrder.items.map(item => ({
        _id: item.menuItemId,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }));

      const response = await fetch(`${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/orders?table=${newOrder.tableNumber}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: newOrder.customerName,
          phoneNumber: newOrder.phoneNumber,
          items: itemsForApi,
          total: newOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create order");
      }

      const createdOrder = await response.json();
      setOrders([createdOrder, ...orders]);
      setShowAddOrderModal(false);
      setNewOrder({
        customerName: "",
        phoneNumber: "",
        tableNumber: "",
        items: [{ menuItemId: "", name: "", price: 0, quantity: 1 }]
      });
      alert("✅ Order created successfully!");
    } catch (error) {
      alert(`❌ Failed to create order: ${error.message}`);
      console.error("Error creating order:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for item management
  const addNewItem = () => {
    setNewOrder(prev => ({
      ...prev,
      items: [...prev.items, { menuItemId: "", name: "", price: 0, quantity: 1 }]
    }));
  };

  const removeItem = (index) => {
    setNewOrder(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index, field, value) => {
    setNewOrder(prev => {
      const updatedItems = [...prev.items];
      if (field === 'menuItemId') {
        const selectedItem = menuItems.find(item => item._id === value);
        updatedItems[index] = {
          ...updatedItems[index],
          menuItemId: value,
          name: selectedItem?.name || "",
          price: selectedItem?.price || 0
        };
      } else {
        updatedItems[index] = { ...updatedItems[index], [field]: value };
      }
      return { ...prev, items: updatedItems };
    });
  };

  // Filter orders based on status
  const filteredOrders = orders.filter(order => 
    filter === "all" || order.status?.toLowerCase() === filter.toLowerCase()
  );

  // Format order items for display
  const formatItems = (items) => {
    if (!items || !Array.isArray(items)) return "No items";
    return items.map(item => 
      `${item.quantity || 1}x ${item.name || 'Unnamed Item'} (₹${item.price || 0})`
    ).join(', ');
  };

  // Get status badge with appropriate styling
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
              onClick={() => setShowAddOrderModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Add Order Manually
            </button>
            <button 
              onClick={fetchData}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
              disabled={loading}
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Status Filter Buttons */}
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

        {/* Add Order Modal */}
        {showAddOrderModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
              <h3 className="text-xl font-bold mb-4">Add New Order</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Customer Name*</label>
                    <input
                      type="text"
                      value={newOrder.customerName}
                      onChange={(e) => setNewOrder({...newOrder, customerName: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number*</label>
                    <input
                      type="tel"
                      value={newOrder.phoneNumber}
                      onChange={(e) => setNewOrder({...newOrder, phoneNumber: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Table Number*</label>
                  <input
                    type="text"
                    value={newOrder.tableNumber}
                    onChange={(e) => setNewOrder({...newOrder, tableNumber: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Order Items*</label>
                  {newOrder.items.map((item, index) => (
                    <div key={index} className="flex space-x-2 mt-2 items-center">
                      <select
                        value={item.menuItemId}
                        onChange={(e) => updateItem(index, 'menuItemId', e.target.value)}
                        className="flex-1 border border-gray-300 rounded-md p-2"
                        required
                      >
                        <option value="">Select an item</option>
                        {menuItems.map(menuItem => (
                          <option key={menuItem._id} value={menuItem._id}>
                            {menuItem.name} (₹{menuItem.price})
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                        className="w-20 border border-gray-300 rounded-md p-2"
                        min="1"
                        required
                      />
                      {newOrder.items.length > 1 && (
                        <button
                          onClick={() => removeItem(index)}
                          className="bg-red-500 text-white px-3 rounded-md hover:bg-red-600"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addNewItem}
                    className="mt-2 bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600"
                  >
                    Add Item
                  </button>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setShowAddOrderModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addOrderManually}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create Order"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            <p>{error}</p>
            <button 
              onClick={fetchData}
              className="mt-2 text-red-700 hover:text-red-800 font-medium"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredOrders.length === 0 && (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-500 text-lg">No orders found</p>
            <p className="text-sm text-gray-400 mt-1">
              {filter === 'all' ? 'No orders in the system' : `No ${filter} orders`}
            </p>
          </div>
        )}

        {/* Orders Table */}
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

                    return (
                      <tr key={orderId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">#{orderId}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium">{order.customerName || "Unknown"}</div>
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