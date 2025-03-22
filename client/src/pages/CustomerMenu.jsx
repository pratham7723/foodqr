import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import axios from "axios"; // Use axios for API calls
import { FaTimes } from "react-icons/fa"; // Import close icon

const CustomerMenu = () => {
  const { table: pathTable } = useParams();
  const [searchParams] = useSearchParams();
  const tableNumber = pathTable || searchParams.get("table") || "N/A";

  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);

  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Fetch menu items using axios
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/menus`
        );
        setMenuItems(response.data);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };

    fetchMenuItems();
  }, []);

  // Get unique categories
  const categories = [
    "All",
    ...new Set(menuItems.map((item) => item.category)),
  ];

  // Filter menu items based on selected category
  const filteredMenuItems =
    selectedCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  // Add item to cart
  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (cartItem) => cartItem._id === item._id
      );
      if (existingItemIndex !== -1) {
        return prevCart.map((cartItem, index) =>
          index === existingItemIndex
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCart(cart.filter((item) => item._id !== itemId));
  };

  // Calculate total amount
  const totalAmount = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Place order
  const placeOrder = async () => {
    if (!tableNumber) {
      alert("Table number is missing!");
      return;
    }

    if (cart.length === 0) {
      alert("❌ Your cart is empty.");
      return;
    }

    if (!userName.trim() || !phoneNumber.trim()) {
      alert("❌ Please enter your name and phone number.");
      return;
    }

    setIsProcessing(true);

    const orderData = {
      customerName: userName.trim(),
      phoneNumber: phoneNumber.trim(),
      items: cart.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      total: totalAmount,
    };

    console.log("📤 Sending Order Data:", orderData);

    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_REACT_APP_SERVER_URL
        }/api/v1/orders?table=${tableNumber}`, // Add table as a query parameter
        orderData
      );
      console.log("🔄 Server Response:", response.data);

      if (response.status === 201) {
        setOrderPlaced(true);
        setOrderNumber(response.data.order.orderId); // Use orderId from the response
        setCart([]);
        setTimeout(() => setOrderPlaced(false), 3000);
      } else {
        alert(`❌ Failed to place order: ${response.data.message}`);
      }
    } catch (error) {
      console.error("❌ Error placing order:", error);
      if (error.response) {
        console.error("Backend Error Response:", error.response.data);
        alert(`❌ Failed to place order: ${error.response.data.message}`);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } finally {
      setIsProcessing(false);
    }
  };
  // Close cart when clicking outside
  const handleClickOutside = (e) => {
    if (cartOpen && !e.target.closest(".cart-container")) {
      setCartOpen(false);
    }
  };

  // Add event listener for clicking outside
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [cartOpen]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-800">Our Menu</h2>
        <p className="text-gray-600">
          Explore our delicious dishes and order now!
        </p>
        <p className="text-lg font-bold text-orange-600 mt-2">
          Table Number: {tableNumber}
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex justify-center space-x-4 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg ${
              selectedCategory === category
                ? "bg-orange-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            } transition duration-300`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredMenuItems.map((item) => (
          <div
            key={item._id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            {/* Image with fixed height and width */}
            <div className="w-full h-40 overflow-hidden rounded-lg mb-4">
              <img
                src={item.photo}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>

            <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
            <p className="text-sm text-gray-600">{item.category}</p>
            <p className="text-lg font-bold text-orange-600 mt-2">
              ₹{item.price.toFixed(2)}
            </p>

            <button
              onClick={() => addToCart(item)}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition duration-300 w-full mt-4"
            >
              Add to Cart
            </button>

            {/* AR Model Button */}
            <div className="mt-4">
              <a
                href={item.arModel}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition duration-300 block text-center"
              >
                View in AR
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Cart Bubble */}
      <div
        className="fixed bottom-4 left-4 bg-orange-600 text-white p-4 rounded-full shadow-lg cursor-pointer"
        onClick={() => setCartOpen(!cartOpen)}
      >
        🛒 {cart.length} Items
      </div>

      {/* Expanded Cart */}
      {cartOpen && (
        <div className="fixed bottom-4 left-4 bg-white p-6 rounded-lg shadow-lg w-80 cart-container">
          {/* Close Button (X icon) */}
          <button
            onClick={() => setCartOpen(false)}
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
          >
            <FaTimes />
          </button>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Your Cart
          </h3>
          {cart.length === 0 ? (
            <p className="text-gray-600">Your cart is empty.</p>
          ) : (
            <>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">
                        {item.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        ₹{item.price.toFixed(2)} x {item.quantity}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <p className="text-lg font-bold text-gray-800">
                  Total: ₹{totalAmount.toFixed(2)}
                </p>

                {/* User Details */}
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full p-2 border rounded mt-2"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  className="w-full p-2 border rounded mt-2"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />

                <button
                  onClick={placeOrder}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition duration-300 w-full mt-4"
                >
                  {isProcessing ? "Processing..." : "Place Order"}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Order Placed Notification */}
      {orderPlaced && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
          ✅ Order Placed Successfully! Your order number is {orderNumber}.
        </div>
      )}
    </div>
  );
};

export default CustomerMenu;
