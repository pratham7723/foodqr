import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { PDFDownloadLink } from "@react-pdf/renderer";
import BillPDF from "../components/BillPDF"; // Component to generate PDF
import axios from "axios";

const Management = () => {
  const [tables, setTables] = useState([]); // State to store table data
  const [loading, setLoading] = useState(false); // State for loading
  const [error, setError] = useState(""); // State for error
  const [editingTable, setEditingTable] = useState(null); // State for editing a table

  // Form state
  const [newTable, setNewTable] = useState({
    tableNumber: "",
    capacity: "",
    status: "Available",
    menuItems: [],
  });

  // Fetch table data from the backend
  useEffect(() => {
    const fetchTables = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/tables`
        );
        // Map the fetched data to match the expected structure
        const mappedTables = response.data.map((table) => ({
          id: table._id,
          tableNumber: table.tableNo,
          capacity: table.capacity || 4, // Use actual capacity if available
          status: table.status,
          order: table.menuItems
            .map(
              (item) =>
                `${item.quantity}x ${item.menuItem?.name || "Unknown Item"}`
            )
            .join(", "),
          billAmount: table.menuItems.reduce(
            (total, item) =>
              total + (item.menuItem?.price || 0) * item.quantity,
            0
          ),
        }));
        setTables(mappedTables);
      } catch (err) {
        setError("Failed to fetch table data");
        console.error(err);
      }
      setLoading(false);
    };

    fetchTables();
  }, []);

  // Handle input change for the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTable({ ...newTable, [name]: value });
  };

  // Handle adding or updating a table
  const addOrUpdateTable = async () => {
    if (!newTable.tableNumber || !newTable.capacity) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      let response;
      if (editingTable) {
        // Update existing table
        response = await axios.put(
          `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/tables/${
            editingTable._id
          }`,
          {
            tableNo: newTable.tableNumber,
            capacity: newTable.capacity,
            status: newTable.status,
            menuItems: newTable.menuItems,
          }
        );
        setTables(
          tables.map((table) =>
            table._id === editingTable._id ? response.data : table
          )
        );
        setEditingTable(null);
      } else {
        // Add new table
        response = await axios.post(
          `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/tables`,
          {
            tableNo: newTable.tableNumber,
            capacity: newTable.capacity,
            status: newTable.status,
            menuItems: newTable.menuItems,
          }
        );
        setTables([...tables, response.data]);
      }
      // Reset the form
      setNewTable({
        tableNumber: "",
        capacity: "",
        status: "Available",
        menuItems: [],
      });
      console.log("Table saved:", response.data);
    } catch (error) {
      alert("Failed to save table");
      console.error(error);
    }
  };

  // Handle editing a table
  const handleEditTable = (table) => {
    setEditingTable(table);
    setNewTable({
      tableNumber: table.tableNumber,
      capacity: table.capacity,
      status: table.status,
      menuItems: table.order
        ? table.order.split(", ").map((item) => {
            const [quantity, name] = item.split("x ");
            return { quantity: parseInt(quantity), menuItem: { name } };
          })
        : [],
    });
  };

  // Handle deleting a table
  const handleDeleteTable = async (id) => {
    if (window.confirm("Are you sure you want to delete this table?")) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/tables/${id}`
        );
        setTables(tables.filter((table) => table._id !== id));
        console.log("Table deleted:", id);
      } catch (error) {
        alert("Failed to delete table");
        console.error(error);
      }
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-100 flex">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-gray-100 flex">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Management Dashboard
          </h2>
        </div>

        {/* Add/Edit Table Form */}
        <form
          className="bg-white p-6 rounded-lg shadow-md mb-8"
          onSubmit={(e) => {
            e.preventDefault();
            addOrUpdateTable();
          }}
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            {editingTable ? "Edit Table" : "Add New Table"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input
              type="number"
              name="tableNumber"
              placeholder="Table Number"
              value={newTable.tableNumber}
              onChange={handleInputChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="number"
              name="capacity"
              placeholder="Capacity"
              value={newTable.capacity}
              onChange={handleInputChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
            <select
              name="status"
              value={newTable.status}
              onChange={handleInputChange}
              className="px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="Available">Available</option>
              <option value="Booked">Booked</option>
              <option value="Reserved">Reserved</option>
            </select>
          </div>

          <button
            type="submit"
            className="mt-4 bg-orange-600 text-white px-4 py-3 rounded-lg hover:bg-orange-700 transition duration-300"
          >
            {editingTable ? "Update Table" : "Add Table"}
          </button>

          {editingTable && (
            <button
              type="button"
              onClick={() => {
                setEditingTable(null);
                setNewTable({
                  tableNumber: "",
                  capacity: "",
                  status: "Available",
                  menuItems: [],
                });
              }}
              className="mt-4 bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 ml-2"
            >
              Cancel Edit
            </button>
          )}
        </form>

        {/* Tables Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Table Status
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {tables.map((table) => (
              <div
                key={table._id}
                className="bg-gray-50 p-4 rounded-lg shadow-sm"
              >
                <p className="text-lg font-semibold text-gray-800">
                  Table {table.tableNumber}
                </p>
                <p className="text-sm text-gray-600">
                  Capacity: {table.capacity}
                </p>
                <p
                  className={`text-sm ${
                    table.status === "Available"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  Status: {table.status}
                </p>
                {table.order && (
                  <>
                    <p className="text-sm text-gray-600 mt-2">
                      Order: {table.order}
                    </p>
                    <p className="text-sm text-gray-600">
                      Bill Amount: ${table.billAmount.toFixed(2)}
                    </p>
                    <div className="mt-2">
                      <PDFDownloadLink
                        document={<BillPDF table={table} />}
                        fileName={`bill_table_${table.tableNumber}.pdf`}
                      >
                        {({ loading }) =>
                          loading ? (
                            <button className="bg-gray-600 text-white px-4 py-2 rounded-lg">
                              Loading...
                            </button>
                          ) : (
                            <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition duration-300">
                              Print Bill
                            </button>
                          )
                        }
                      </PDFDownloadLink>
                    </div>
                  </>
                )}
                <div className="mt-2">
                  <button
                    onClick={() => handleEditTable(table)}
                    className="text-white bg-green-400 hover:bg-green-600 px-2 py-2 rounded-lg mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTable(table._id)}
                    className="text-white bg-red-400 hover:bg-red-600 px-2 py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Management;
