import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { IKContext, IKUpload } from "imagekitio-react";
import { FaEdit, FaTrash } from "react-icons/fa";

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isUploading, setUploading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [filteredMenuItems, setFilteredMenuItems] = useState([]); // State for filtered items

  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    price: "",
    status: "Available",
    photo: "",
    arModel: "",
  });

  // Fetch menu data from the backend
  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/menus`
        );
        setMenuItems(response.data);
        setFilteredMenuItems(response.data); // Initialize filtered items with all items
      } catch (err) {
        setError("Failed to fetch menu items");
        console.error(err);
      }
      setLoading(false);
    };

    fetchMenu();
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle search on Enter key press
  const handleSearch = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission (if inside a form)
      const filtered = menuItems.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMenuItems(filtered);
    }
  };

  // Handle adding or updating a menu item
  const addMenuItem = async () => {
    if (!newItem.name || !newItem.category || !newItem.price) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      let response;
      if (editingItem) {
        // Update existing item
        response = await axios.put(
          `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/menus/${
            editingItem._id
          }`,
          newItem
        );
        setMenuItems(
          menuItems.map((item) =>
            item._id === editingItem._id ? response.data : item
          )
        );
        setFilteredMenuItems(
          filteredMenuItems.map((item) =>
            item._id === editingItem._id ? response.data : item
          )
        );
        setEditingItem(null);
      } else {
        // Add new item
        response = await axios.post(
          `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/menus`,
          newItem
        );
        setMenuItems([...menuItems, response.data]);
        setFilteredMenuItems([...filteredMenuItems, response.data]);
      }
      // Reset the form
      setNewItem({
        name: "",
        category: "",
        price: "",
        status: "Available",
        photo: "",
        arModel: "",
      });
      console.log("Menu item saved:", response.data);
    } catch (error) {
      alert("Failed to save menu item");
      console.error(error);
    }
  };

  // Handle editing an item
  const handleEditItem = (item) => {
    setEditingItem(item);
    setNewItem({
      name: item.name,
      category: item.category,
      price: item.price,
      status: item.status,
      photo: item.photo,
      arModel: item.arModel,
    });
  };

  // Handle deleting an item
  const handleDeleteItem = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/menus/${id}`
        );
        setMenuItems(menuItems.filter((item) => item._id !== id));
        setFilteredMenuItems(
          filteredMenuItems.filter((item) => item._id !== id)
        );
        console.log("Menu item deleted:", id);
      } catch (error) {
        alert("Failed to delete menu item");
        console.error(error);
      }
    }
  };

  // ImageKit authentication
  const authenticator = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/images/auth`
      );
      const { expire, signature, token } = response.data.data;
      return { expire, signature, token };
    } catch (error) {
      console.error("Error authenticating with ImageKit:", error);
    }
  };

  // Handle image upload success
  const handleUploadSuccess = (response) => {
    setUploading(false);
    console.log("Upload success:", response);
    setNewItem((prev) => ({ ...prev, photo: response.url }));
  };

  // Handle AR model upload success
  const handleARUploadSuccess = (response) => {
    console.log("AR Model Upload successful:", response);
    setNewItem((prev) => ({ ...prev, arModel: response.url }));
  };

  // Handle upload error
  const handleUploadError = (error) => {
    setUploading(false);
    console.error("Upload failed:", error);
    alert("Upload failed. Please try again.");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar disabled={isUploading} />

      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Menu</h2>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={handleSearchChange} // Handle search input change
              onKeyDown={handleSearch} // Trigger search on Enter key press
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="button"
              onClick={() => {
                const filtered = menuItems.filter((item) =>
                  item.name.toLowerCase().includes(searchTerm.toLowerCase())
                );
                setFilteredMenuItems(filtered);
              }}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
            >
              Search
            </button>
          </div>
        </div>

        {/* Add New Item Form */}
        <form
          className="bg-white p-6 rounded-lg shadow-md mb-8"
          onSubmit={(e) => {
            e.preventDefault(); // Prevent page reload
            addMenuItem(); // Handle form submission
          }}
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            {editingItem ? "Edit Menu Item" : "Add New Menu Item"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={newItem.name}
              onChange={handleInputChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={newItem.category}
              onChange={handleInputChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={newItem.price}
              onChange={handleInputChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
            <select
              name="status"
              value={newItem.status}
              onChange={handleInputChange}
              className="px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="Available">Available</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>

            {/* Upload Buttons */}
            <div className="flex flex-col items-center space-y-2">
              <label
                htmlFor="image-file-upload"
                className={`bg-orange-600 text-white px-3 py-4 rounded-lg text-sm ${
                  isUploading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-orange-700 cursor-pointer"
                }`}
              >
                Upload Image
              </label>
              <IKContext
                publicKey={import.meta.env.VITE_REACT_APP_IMAGEKIT_PUBLIC_KEY}
                urlEndpoint={
                  import.meta.env.VITE_REACT_APP_IMAGEKIT_URL_ENDPOINT
                }
                authenticator={authenticator}
              >
                <IKUpload
                  className="hidden"
                  onSuccess={handleUploadSuccess}
                  onError={handleUploadError}
                  multiple={false}
                  type="image/*"
                  id="image-file-upload"
                  folder="qrcode/menu_images"
                  onUploadStart={() => setUploading(true)}
                  disabled={isUploading}
                />
              </IKContext>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <label
                htmlFor="ar-file-upload"
                className={`bg-orange-600 text-white px-3 py-4 rounded-lg text-sm ${
                  isUploading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-orange-700 cursor-pointer"
                }`}
              >
                Upload AR Model
              </label>
              <IKContext>
                <IKUpload
                  className="hidden"
                  onSuccess={handleARUploadSuccess}
                  onError={handleUploadError}
                  multiple={false}
                  id="ar-file-upload"
                  folder="qrcode/ar_models"
                  accept=".glb,.gltf"
                  onUploadStart={() => setUploading(true)}
                  disabled={isUploading}
                />
              </IKContext>
            </div>
          </div>

          <button
            type="submit"
            className={`mt-4 bg-orange-600 text-white px-4 py-3 rounded-lg transition duration-300 ${
              isUploading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-orange-700 cursor-pointer"
            }`}
            disabled={isUploading}
          >
            {editingItem ? "Update Item" : "Add Item"}
          </button>

          {editingItem && (
            <button
              type="button"
              onClick={() => {
                setEditingItem(null);
                setNewItem({
                  name: "",
                  category: "",
                  price: "",
                  status: "Available",
                  photo: "",
                  arModel: "",
                });
              }}
              className="mt-4 bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 ml-2"
            >
              Cancel Edit
            </button>
          )}
        </form>

        {/* Menu Table */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <table className="w-full table-fixed">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2 w-24">ID</th>
                <th className="py-2 w-32">Photo</th>
                <th className="py-2 w-48">Name</th>
                <th className="py-2 w-48">Category</th>
                <th className="py-2 w-32">Price</th>
                <th className="py-2 w-32">Status</th>
                <th className="py-2 w-48">AR Model</th>
                <th className="py-2 w-32">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMenuItems.map((item) => (
                <tr key={item._id} className="border-b hover:bg-gray-50">
                  <td className="py-4 w-24 truncate">{item._id.slice(0, 8)}</td>
                  <td className="py-4 w-32">
                    {item.photo ? (
                      <img
                        src={item.photo}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <span className="text-gray-500">No Photo</span>
                    )}
                  </td>
                  <td className="py-4 w-48 truncate">{item.name}</td>
                  <td className="py-4 w-48 truncate">{item.category}</td>
                  <td className="py-4 w-32">
                    ${Number(item.price).toFixed(2)}
                  </td>
                  <td className="py-4 w-32">
                    <span
                      className={`px-2 py-2 rounded-full text-sm ${
                        item.status === "Available"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 w-48 truncate">
                    {item.arModel ? (
                      <a
                        href={item.arModel}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View AR Model
                      </a>
                    ) : (
                      <span>No AR Model</span>
                    )}
                  </td>
                  <td className="py-4 w-32">
                    <button
                      onClick={() => handleEditItem(item)}
                      className="text-white bg-green-400 hover:bg-green-600 px-2 py-2 rounded-lg mr-2"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item._id)}
                      className="text-white bg-red-400 hover:bg-red-600 px-2 py-2 rounded-lg"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Menu;
