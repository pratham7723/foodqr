import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import axios from 'axios';

const Waiter = () => {
  const [tables, setTables] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [newOrder, setNewOrder] = useState({
    tableNumber: '',
    customerName: '',
    phoneNumber: '',
    items: [],
    selectedItem: '',
    selectedQuantity: 1
  });
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [loading, setLoading] = useState(false);
  const [existingOrder, setExistingOrder] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [tablesRes, menuRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/tables`),
          fetch(`${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/menus`)
        ]);
        
        const tablesData = await tablesRes.json();
        const menuData = await menuRes.json();
        
        setTables(tablesData.data || tablesData);
        setMenuItems(menuData.data || menuData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleTableSelect = async (table) => {
    setSelectedTable(table);
    
    // Check if table already has an order
    if (table.currentOrder) {
      try {
        const response = await fetch(`${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/orders/${table.currentOrder}`);
        const existingOrderData = await response.json();
        setExistingOrder(existingOrderData);
        setNewOrder(prev => ({
          ...prev,
          tableNumber: table.tableNo,
          customerName: existingOrderData.customerName,
          phoneNumber: existingOrderData.phoneNumber,
          items: existingOrderData.items || []
        }));
      } catch (error) {
        console.error('Error fetching existing order:', error);
      }
    } else {
      setNewOrder(prev => ({
        ...prev,
        tableNumber: table.tableNo,
        customerName: '',
        phoneNumber: '',
        items: []
      }));
    }
    
    setShowOrderForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOrder(prev => ({ ...prev, [name]: value }));
  };

  const handleQuantityChange = (e) => {
    const value = Math.max(1, parseInt(e.target.value) || 1);
    setNewOrder(prev => ({ ...prev, selectedQuantity: value }));
  };

  const addItemToOrder = () => {
    const selectedItem = menuItems.find(item => item._id === newOrder.selectedItem);
    if (!selectedItem) return;

    // Check if item already exists in order
    const existingItemIndex = newOrder.items.findIndex(item => item._id === selectedItem._id);
    
    if (existingItemIndex >= 0) {
      // Update quantity if item already exists
      const updatedItems = [...newOrder.items];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + newOrder.selectedQuantity
      };
      setNewOrder(prev => ({
        ...prev,
        items: updatedItems,
        selectedItem: '',
        selectedQuantity: 1
      }));
    } else {
      // Add new item
      setNewOrder(prev => ({
        ...prev,
        items: [...prev.items, {
          _id: selectedItem._id,
          name: selectedItem.name,
          price: selectedItem.price,
          quantity: prev.selectedQuantity
        }],
        selectedItem: '',
        selectedQuantity: 1
      }));
    }
  };

  const removeItem = (index) => {
    setNewOrder(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItemQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedItems = [...newOrder.items];
    updatedItems[index] = {
      ...updatedItems[index],
      quantity: newQuantity
    };
    
    setNewOrder(prev => ({
      ...prev,
      items: updatedItems
    }));
  };

  const submitOrder = async () => {
    if (!newOrder.tableNumber || !newOrder.customerName || !newOrder.phoneNumber || newOrder.items.length === 0) {
      alert('Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      
      const orderData = {
        customerName: newOrder.customerName,
        phoneNumber: newOrder.phoneNumber,
        tableNumber: parseInt(newOrder.tableNumber),
        items: newOrder.items,
        total: newOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      };

      const url = existingOrder 
        ? `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/orders/${existingOrder._id}`
        : `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/orders?table=${newOrder.tableNumber}`;

      const method = existingOrder ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create/update order');
      }

      const resultOrder = await response.json();

      // Update table status locally
      setTables(prev => prev.map(table => 
        table.tableNo === parseInt(newOrder.tableNumber)
          ? { ...table, status: 'Booked', currentOrder: resultOrder._id }
          : table
      ));

      // Reset form
      setNewOrder({
        tableNumber: '',
        customerName: '',
        phoneNumber: '',
        items: [],
        selectedItem: '',
        selectedQuantity: 1
      });
      setExistingOrder(null);
      setShowOrderForm(false);
      alert(`Order ${existingOrder ? 'updated' : 'placed'} successfully!`);

    } catch (error) {
      console.error('Error submitting order:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const releaseTable = async (tableId) => {
    try {
      setLoading(true);
      
      const response = await axios.patch(
        `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/tables/${tableId}/release`,
        {}, // Empty body since it's a PATCH request
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 5000 // 5-second timeout
        }
      );
  
      console.log('Release response:', response.data);
      
      // Update state as before...
      
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        console.error('Request timeout:', error);
        alert('Server is not responding. Please try again.');
      } else if (error.response) {
        // Server responded with error status (4xx/5xx)
        console.error('Server error:', error.response.data);
        alert(`Error: ${error.response.data.message}`);
      } else if (error.request) {
        // No response received
        console.error('No response:', error.request);
        alert('Cannot connect to server. Check your network.');
      } else {
        console.error('Unknown error:', error.message);
        alert('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Waiter Dashboard</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          {tables.map((table) => (
            <div 
              key={table._id} 
              className={`p-4 rounded-lg shadow-sm cursor-pointer transition-all ${
                table.status === 'Available' 
                  ? 'bg-green-100 hover:bg-green-200' 
                  : 'bg-red-100 hover:bg-red-200'
              }`}
              onClick={() => handleTableSelect(table)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-lg font-semibold">Table {table.tableNo}</p>
                  <p className="text-sm">
                    Status: <span className="font-medium">{table.status}</span>
                  </p>
                  <p className="text-sm">Capacity: {table.capacity}</p>
                </div>
                {table.status !== 'Available' && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      releaseTable(table._id);
                    }}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Release
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {showOrderForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">
                {existingOrder ? 'Add to Existing Order' : 'New Order'} for Table {selectedTable?.tableNo}
              </h3>
              
              <div className="space-y-4">
                {!existingOrder && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Customer Name*</label>
                      <input
                        type="text"
                        name="customerName"
                        value={newOrder.customerName}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone Number*</label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={newOrder.phoneNumber}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        required
                      />
                    </div>
                  </>
                )}

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Order Items*</h4>
                  
                  <div className="flex space-x-2 mb-2">
                    <select
                      value={newOrder.selectedItem || ''}
                      onChange={(e) => setNewOrder(prev => ({ ...prev, selectedItem: e.target.value }))}
                      className="flex-1 border border-gray-300 rounded-md p-2"
                    >
                      <option value="">Select menu item</option>
                      {menuItems.map(item => (
                        <option key={item._id} value={item._id}>
                          {item.name} (₹{item.price})
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="1"
                      value={newOrder.selectedQuantity}
                      onChange={handleQuantityChange}
                      className="w-16 border border-gray-300 rounded-md p-2"
                    />
                    <button 
                      onClick={addItemToOrder}
                      className="bg-blue-600 text-white px-3 rounded-md hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>

                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {newOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                        <div className="flex items-center space-x-2">
                          <span>{item.name} (₹{item.price})</span>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItemQuantity(index, parseInt(e.target.value))}
                            className="w-12 border border-gray-300 rounded-md p-1 text-center"
                          />
                          <span>= ₹{item.price * item.quantity}</span>
                        </div>
                        <button 
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-right font-medium">
                    Total: ₹{newOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)}
                  </p>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => {
                      setShowOrderForm(false);
                      setExistingOrder(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitOrder}
                    disabled={loading}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
                  >
                    {loading 
                      ? existingOrder ? 'Updating...' : 'Submitting...' 
                      : existingOrder ? 'Update Order' : 'Submit Order'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Waiter;