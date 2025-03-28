import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

const formatINR = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount);
};

const Dashboard = () => {
  const [recentOrders, setRecentOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    occupiedTables: 0,
    totalTables: 0,
    todaysRevenue: 0
  });
  const [loading, setLoading] = useState({
    orders: true,
    stats: true,
    tables: true
  });
  const [error, setError] = useState({
    orders: '',
    stats: '',
    tables: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch recent orders
        setLoading(prev => ({ ...prev, orders: true }));
        const ordersResponse = await fetch(`${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/orders?limit=5&sort=-createdAt`);
        
        if (!ordersResponse.ok) {
          throw new Error(`Failed to fetch orders: ${ordersResponse.status}`);
        }

        const ordersData = await ordersResponse.json();
        const orders = Array.isArray(ordersData) ? ordersData : (ordersData.data || []);
        setRecentOrders(orders);
        setError(prev => ({ ...prev, orders: '' }));

        // Fetch statistics
        setLoading(prev => ({ ...prev, stats: true }));
        const statsResponse = await fetch(`${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/orders/stats`);
        
        if (!statsResponse.ok) {
          throw new Error(`Failed to fetch stats: ${statsResponse.status}`);
        }

        const statsData = await statsResponse.json();
        
        // Fetch tables data
        setLoading(prev => ({ ...prev, tables: true }));
        const tablesResponse = await fetch(`${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/tables`);
        
        if (!tablesResponse.ok) {
          throw new Error(`Failed to fetch tables: ${tablesResponse.status}`);
        }

        const tablesData = await tablesResponse.json();
        const totalTables = tablesData.length || 0;
        const occupiedTables = tablesData.filter(table =>  table.status === 'Occupied' || table.status === 'Booked').length;

        setStats({
          totalOrders: statsData.totalOrders || 0,
          totalRevenue: statsData.totalRevenue || 0,
          occupiedTables: occupiedTables,
          totalTables: totalTables,
          todaysRevenue: statsData.todaysRevenue || 0
        });
        
        setError(prev => ({ ...prev, stats: '', tables: '' }));
      } catch (err) {
        if (err.message.includes('orders')) {
          setError(prev => ({ ...prev, orders: err.message }));
        } else if (err.message.includes('tables')) {
          setError(prev => ({ ...prev, tables: err.message }));
        } else {
          setError(prev => ({ ...prev, stats: err.message }));
        }
        console.error("Error fetching data:", err);
      } finally {
        setLoading(prev => ({ orders: false, stats: false, tables: false }));
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 30000); // Auto-refresh every 30 seconds
    
    return () => clearInterval(intervalId);
  }, []);

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

  const formatItems = (items) => {
    if (!items || !Array.isArray(items)) return "No items";
    return items.map(item => 
      `${item.quantity || 1}x ${item.name || 'Unnamed Item'}`
    ).join(', ');
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

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
            {loading.stats ? (
              <div className="animate-pulse h-8 w-3/4 bg-gray-200 rounded"></div>
            ) : error.stats ? (
              <p className="text-red-500 text-sm">Error loading</p>
            ) : (
              <>
                <p className="text-3xl font-bold text-orange-600">
                  {formatNumber(stats.totalOrders)}
                </p>
                <p className="text-sm text-gray-500">
                  {stats.occupiedTables > 0 ? 
                    `${stats.occupiedTables} tables occupied` : 
                    'No active orders'}
                </p>
              </>
            )}
          </div>

          {/* Revenue */} 
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Revenue</h3>
            {loading.stats ? (
              <div className="animate-pulse h-8 w-3/4 bg-gray-200 rounded"></div>
            ) : error.stats ? (
              <p className="text-red-500 text-sm">Error loading</p>
            ) : (
              <>
                <p className="text-3xl font-bold text-orange-600">
                  {formatINR(stats.totalRevenue)}
                </p>
                <p className="text-sm text-gray-500">
                  Today's revenue: {formatINR(stats.todaysRevenue)}
                </p>
              </>
            )}
          </div>

          {/* Tables - Combined View */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Tables</h3>
            {loading.tables ? (
              <div className="animate-pulse h-8 w-3/4 bg-gray-200 rounded"></div>
            ) : error.tables ? (
              <p className="text-red-500 text-sm">Error loading</p>
            ) : (
              <>
                <p className="text-3xl font-bold text-orange-600">
                  {stats.occupiedTables}
                </p>
                <p className="text-sm text-gray-500">
                  {stats.totalTables - stats.occupiedTables} available (Total: {stats.totalTables})
                </p>
              </>
            )}
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Recent Orders</h3>
            {error.orders && (
              <span className="text-sm text-red-500">{error.orders}</span>
            )}
          </div>
          
          {loading.orders ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No recent orders found
            </div>
          ) : (
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
                {recentOrders.map((order) => {
                  const orderId = order.orderId || order._id;
                  const total = typeof order.total === 'number' ? order.total.toFixed(2) : 'N/A';
                  
                  return (
                    <tr key={orderId} className="border-b hover:bg-gray-50">
                      <td className="py-4">#{orderId}</td>
                      <td className="py-4">{order.customerName || 'Unknown'}</td>
                      <td className="py-4">{formatItems(order.items)}</td>
                      <td className="py-4">₹{total}</td>
                      <td className="py-4">{order.tableNumber || 'N/A'}</td>
                      <td className="py-4">
                        {getStatusBadge(order.status)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;