import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { QRCodeSVG } from 'qrcode.react';

const TableOrders = () => {
  const [tables, setTables] = useState([]);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/tables'); // Update with your API endpoint
        const data = await response.json();
        
        // Sort tables in ascending order by tableNo
        const sortedTables = data.sort((a, b) => a.tableNo - b.tableNo);
        
        setTables(sortedTables);
      } catch (error) {
        console.error('Error fetching tables:', error);
      }
    };

    fetchTables();
  }, []);

  // Function to copy link
  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  // Function to download QR code as an image
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
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Table QR Codes</h2>
          <p className="text-gray-600">Scan or share the QR codes for each table.</p>
        </div>

        {/* Table Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {tables.map((table) => {
            const tableURL = `http://localhost:5173/customermenu?table=${table.tableNo}`;
            return (
              <div key={table._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                {/* Table Info */}
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-800">Table {table.tableNo}</h3>
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      table.status === 'Occupied'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {table.status}
                  </span>
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
                <div className="mt-4 flex flex-col items-center space-y-2">
                  <button
                    onClick={() => copyToClipboard(tableURL)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 w-full"
                  >
                    Copy Link
                  </button>
                  <button
                    onClick={() => downloadQRCode(table.tableNo)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300 w-full"
                  >
                    Download QR Code
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TableOrders;
