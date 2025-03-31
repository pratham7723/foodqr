import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const Reports = () => {
  const [dailyData, setDailyData] = useState([]);
  const [mostOrderedItems, setMostOrderedItems] = useState([]);
  const [summary, setSummary] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    growthRateOrders: 0,
    growthRateRevenue: 0
  });
  const [loading, setLoading] = useState({
    daily: true,
    items: true,
    summary: true
  });
  const [error, setError] = useState({
    daily: '',
    items: '',
    summary: ''
  });
  const [filters, setFilters] = useState({
    days: 7,
    itemsLimit: 5
  });

  const fetchData = async () => {
    try {
      setLoading({ daily: true, items: true, summary: true });
      
      const [dailyResponse, itemsResponse, summaryResponse] = await Promise.all([
        axios.get(`${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/reports/daily`, {
          params: { days: filters.days }
        }),
        axios.get(`${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/reports/most-ordered`, {
          params: { limit: filters.itemsLimit }
        }),
        axios.get(`${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/reports/summary`)
      ]);

      setDailyData(dailyResponse.data);
      setMostOrderedItems(itemsResponse.data);
      setSummary(summaryResponse.data);
      
      setError({ daily: '', items: '', summary: '' });
    } catch (err) {
      console.error('Fetch error:', err);
      setError({
        daily: err.response?.data?.message || 'Failed to load daily data',
        items: err.response?.data?.message || 'Failed to load items data',
        summary: err.response?.data?.message || 'Failed to load summary data'
      });
    } finally {
      setLoading({ daily: false, items: false, summary: false });
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters.days, filters.itemsLimit]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Format currency with ₹ symbol and Indian number formatting
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Custom tooltip formatter
  const renderTooltipContent = (value, name) => {
    if (name === 'Total Revenue' || name === 'Revenue' || name === 'sales') {
      return [formatCurrency(value), name];
    }
    return [value, name];
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />

      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Reports Dashboard</h2>
          <div className="flex gap-4">
            <select
              value={filters.days}
              onChange={(e) => handleFilterChange('days', parseInt(e.target.value))}
              className="px-4 py-2 border rounded-md bg-white"
            >
              <option value="7">Last 7 Days</option>
              <option value="14">Last 14 Days</option>
              <option value="30">Last 30 Days</option>
            </select>
            <select
              value={filters.itemsLimit}
              onChange={(e) => handleFilterChange('itemsLimit', parseInt(e.target.value))}
              className="px-4 py-2 border rounded-md bg-white"
            >
              <option value="5">Top 5 Items</option>
              <option value="10">Top 10 Items</option>
              <option value="20">Top 20 Items</option>
            </select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Orders</h3>
            {loading.summary ? (
              <div className="animate-pulse h-8 w-3/4 bg-gray-200 rounded"></div>
            ) : error.summary ? (
              <p className="text-red-500">{error.summary}</p>
            ) : (
              <>
                <p className="text-3xl font-bold text-blue-600">{summary.totalOrders}</p>
                <p className={`text-sm ${summary.growthRateOrders >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {summary.growthRateOrders >= 0 ? '↑' : '↓'} {Math.abs(summary.growthRateOrders)}% from last period
                </p>
              </>
            )}
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Revenue</h3>
            {loading.summary ? (
              <div className="animate-pulse h-8 w-3/4 bg-gray-200 rounded"></div>
            ) : error.summary ? (
              <p className="text-red-500">{error.summary}</p>
            ) : (
              <>
                <p className="text-3xl font-bold text-green-600">{formatCurrency(summary.totalRevenue)}</p>
                <p className={`text-sm ${summary.growthRateRevenue >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {summary.growthRateRevenue >= 0 ? '↑' : '↓'} {Math.abs(summary.growthRateRevenue)}% from last period
                </p>
              </>
            )}
          </div>
        </div>

        {/* Daily Orders Chart */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Daily Orders & Revenue</h3>
          {loading.daily ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
            </div>
          ) : error.daily ? (
            <p className="text-red-500">{error.daily}</p>
          ) : dailyData.length === 0 ? (
            <p className="text-gray-500">No data available for the selected period</p>
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dailyData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 60,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="day" 
                    angle={-45} 
                    textAnchor="end" 
                    height={70}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <Tooltip formatter={renderTooltipContent} />
                  <Legend />
                  <Bar 
                    dataKey="orders" 
                    name="Total Orders" 
                    fill="#8884d8" 
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="sales" 
                    name="Total Revenue" 
                    fill="#82ca9d" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Most Ordered Items Table */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Most Ordered Items</h3>
          {loading.items ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
            </div>
          ) : error.items ? (
            <p className="text-red-500">{error.items}</p>
          ) : mostOrderedItems.length === 0 ? (
            <p className="text-gray-500">No items data available</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mostOrderedItems.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.orders}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(item.totalRevenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;