import React, { useState, useEffect } from 'react';

const KitchenStaff = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/orders");
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      
      if (Array.isArray(data?.data)) {
        // Filter to only include relevant orders for kitchen
        const kitchenOrders = data.data.filter(order => 
          ['pending', 'preparing'].includes(order.status.toLowerCase())
        );
        setOrders(kitchenOrders);
        setLastUpdated(new Date());
        setError('');
      } else {
        throw new Error("API did not return expected data format");
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError(`Failed to load orders: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const intervalId = setInterval(fetchOrders, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    setIsUpdating(true);
    try {
      // Normalize status to lowercase before sending
      const normalizedStatus = newStatus.toLowerCase();
      
      const response = await fetch(`http://localhost:8000/api/v1/orders/${orderId}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: normalizedStatus })
      });
  
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(text || 'Invalid server response');
      }
  
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || `Status update failed (${response.status})`);
      }
  
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.orderId === orderId ? { 
            ...order, 
            status: normalizedStatus // Use normalized status
          } : order
        ).filter(order => 
          ['pending', 'preparing'].includes(order.status.toLowerCase())
        )
      );
      
    } catch (error) {
      console.error("Update error:", error);
      setError(`Failed to update order: ${error.message}`);
      
      // Show more user-friendly error
      alert(`Update failed: ${error.message.replace('Current order status', 'Status')}`);
      
    } finally {
      setIsUpdating(false);
    }
  };

  const formatItems = (items) => {
    if (!items || !Array.isArray(items)) return "No items";
    return items.map(item => `${item.quantity}x ${item.name} (₹${item.price})`).join(', ');
  };

  const getOrdersByStatus = (status) => {
    return orders.filter(order => 
      order.status.toLowerCase() === status.toLowerCase()
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl">Loading orders...</p>
          <div className="mt-4 w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
        <div className="text-center text-red-500 max-w-md">
          <p className="text-xl font-bold">Error Loading Orders</p>
          <p className="mt-2 p-4 bg-red-50 rounded-lg">{error}</p>
          <button 
            onClick={fetchOrders}
            className="mt-4 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
            disabled={loading}
          >
            {loading ? 'Retrying...' : 'Retry'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Kitchen Dashboard</h2>
          {lastUpdated && (
            <p className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <button 
          onClick={fetchOrders}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center"
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Refreshing...
            </>
          ) : 'Refresh Orders'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pending Orders Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Pending Orders</h3>
            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
              {getOrdersByStatus('pending').length}
            </span>
          </div>
          
          {getOrdersByStatus('pending').length > 0 ? (
            getOrdersByStatus('pending').map(order => (
              <div key={order.orderId} className="border-b pb-4 mb-4 last:border-0">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">
                          Order #{order.orderId} • Table {order.tableNumber}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">Customer: {order.customerName}</p>
                      </div>
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{formatItems(order.items)}</p>
                    <p className="text-sm font-medium mt-2">Total: ₹{order.total}</p>
                    {order.specialInstructions && (
                      <p className="text-sm text-orange-600 mt-2">
                        <span className="font-medium">Notes:</span> {order.specialInstructions}
                      </p>
                    )}
                  </div>
                  <div className="ml-4 flex flex-col space-y-2 min-w-[120px]">
                    <button
                      onClick={() => updateOrderStatus(order.orderId, 'preparing')}
                      className="bg-orange-600 text-white px-3 py-2 rounded text-sm hover:bg-orange-700 transition-colors flex items-center justify-center"
                      disabled={isUpdating}
                    >
                      {isUpdating ? 'Processing...' : 'Start Preparing'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No pending orders</p>
              <p className="text-sm text-gray-400 mt-1">New orders will appear here</p>
            </div>
          )}
        </div>

        {/* Preparing Orders Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Preparing Orders</h3>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {getOrdersByStatus('preparing').length}
            </span>
          </div>
          
          {getOrdersByStatus('preparing').length > 0 ? (
            getOrdersByStatus('preparing').map(order => (
              <div key={order.orderId} className="border-b pb-4 mb-4 last:border-0">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">
                          Order #{order.orderId} • Table {order.tableNumber}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">Customer: {order.customerName}</p>
                      </div>
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                        {new Date(order.updatedAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{formatItems(order.items)}</p>
                    <p className="text-sm font-medium mt-2">Total: ₹{order.total}</p>
                    {order.specialInstructions && (
                      <p className="text-sm text-orange-600 mt-2">
                        <span className="font-medium">Notes:</span> {order.specialInstructions}
                      </p>
                    )}
                  </div>
                  <div className="ml-4 flex flex-col space-y-2 min-w-[120px]">
                    <button
                      onClick={() => updateOrderStatus(order.orderId, 'completed')}
                      className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors flex items-center justify-center"
                      disabled={isUpdating}
                    >
                      {isUpdating ? 'Processing...' : 'Mark Completed'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No orders in preparation</p>
              <p className="text-sm text-gray-400 mt-1">Orders being prepared will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KitchenStaff;