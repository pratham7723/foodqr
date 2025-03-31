import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';

const TableOrders = () => {
  const [tables, setTables] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTable, setCurrentTable] = useState(null);
  const [formData, setFormData] = useState({
    tableNo: '',
    capacity: 4,
    status: 'Available'
  });

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/tables`);
      const sortedTables = response.data.sort((a, b) => a.tableNo - b.tableNo);
      setTables(sortedTables);
    } catch (error) {
      console.error('Error fetching tables:', error);
      alert('Failed to fetch tables');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'tableNo' || name === 'capacity' ? Number(value) : value
    });
  };

  const openModal = (table = null) => {
    setCurrentTable(table);
    setFormData(table ? {
      tableNo: table.tableNo,
      capacity: table.capacity,
      status: table.status
    } : {
      tableNo: '',
      capacity: 4,
      status: 'Available'
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentTable(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentTable) {
        // Update existing table
        await axios.put(
          `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/tables/${currentTable._id}`,
          formData
        );
        alert('Table updated successfully');
      } else {
        // Create new table
        await axios.post(
          `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/tables`,
          formData
        );
        alert('Table added successfully');
      }
      fetchTables();
      closeModal();
    } catch (error) {
      console.error('Error saving table:', error);
      alert(error.response?.data?.message || 'Failed to save table');
    }
  };

  const handleDelete = async (tableId) => {
    if (window.confirm('Are you sure you want to delete this table?')) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/tables/${tableId}`
        );
        alert('Table deleted successfully');
        fetchTables();
      } catch (error) {
        console.error('Error deleting table:', error);
        alert('Failed to delete table');
      }
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  const downloadQRCode = (tableNo) => {
    const svgElement = document.getElementById(`qrcode-${tableNo}`);
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = pngFile;
      link.download = `Table-${tableNo}-QRCode.png`;
      link.click();
    };

    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Table QR Codes</h2>
            <p className="text-gray-600">Scan or share the QR codes for each table.</p>
          </div>
          <button
            onClick={() => openModal()}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition duration-300"
          >
            Add New Table
          </button>
        </div>

        {/* Table Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {tables.map((table) => {
            const tableURL = `${import.meta.env.VITE_REACT_APP_CLIENT_URL}/customermenu?table=${table.tableNo}`;
            return (
              <div key={table._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                {/* Table Info */}
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-800">Table {table.tableNo}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        table.status === 'Occupied'
                          ? 'bg-red-100 text-red-700'
                          : table.status === 'Reserved'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {table.status}
                    </span>
                    <span className="text-sm text-gray-600">Capacity: {table.capacity}</span>
                  </div>
                </div>

                {/* QR Code for Table */}
                <div className="mt-4 flex justify-center">
                  <QRCodeSVG
                    id={`qrcode-${table.tableNo}`}
                    value={tableURL}
                    size={120}
                    level="H"
                    includeMargin={true}
                  />
                </div>

                {/* Action Buttons */}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => copyToClipboard(tableURL)}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                  >
                    Copy Link
                  </button>
                  <button
                    onClick={() => downloadQRCode(table.tableNo)}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                  >
                    Download QR
                  </button>
                  <button
                    onClick={() => openModal(table)}
                    className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(table._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add/Edit Table Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">
                {currentTable ? 'Edit Table' : 'Add New Table'}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Table Number</label>
                  <input
                    type="number"
                    name="tableNo"
                    value={formData.tableNo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                    min="1"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Capacity</label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                    min="1"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="Available">Available</option>
                    <option value="Occupied">Occupied</option>
                    <option value="Reserved">Reserved</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
                  >
                    {currentTable ? 'Update' : 'Add'} Table
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableOrders;