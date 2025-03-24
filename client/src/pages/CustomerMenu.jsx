import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import axios from "axios";
import { FaTimes } from "react-icons/fa";

// AR model configuration
const LOCAL_MODELS = {
  "Margerita": "/models/pizza.glb",
  "Burger": "/models/burger.glb",
  "Softy": "/models/icecream.glb",
  "Pina Colada": "/models/mocktail.glb",
  "Veg Sandwich": "/models/sandwich.glb",
  "Croissant": "/models/crossaint.glb",
  "Garlic Bread": "/models/garlicbread.glb"

};

const CustomerMenu = () => {
  const { table: pathTable } = useParams();
  const [searchParams] = useSearchParams();
  const tableNumber = pathTable || searchParams.get("table") || "N/A";

  // State management
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [arModelUrl, setArModelUrl] = useState(null);

  // Fetch menu items
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

  // Helper functions
  const categories = ["All", ...new Set(menuItems.map((item) => item.category))];

  const filteredMenuItems = selectedCategory === "All"
    ? menuItems
    : menuItems.filter((item) => item.category === selectedCategory);

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem._id === item._id);
      return existingItem
        ? prevCart.map((cartItem) =>
            cartItem._id === item._id
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          )
        : [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter((item) => item._id !== itemId));
  };

  const totalAmount = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const placeOrder = async () => {
    if (!tableNumber || cart.length === 0 || !userName.trim() || !phoneNumber.trim()) {
      alert(!tableNumber ? "Table number is missing!" :
            cart.length === 0 ? "❌ Your cart is empty." :
            "❌ Please enter your name and phone number.");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/orders?table=${tableNumber}`,
        {
          customerName: userName.trim(),
          phoneNumber: phoneNumber.trim(),
          items: cart.map((item) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          total: totalAmount,
        }
      );

      if (response.status === 201) {
        setOrderPlaced(true);
        setOrderNumber(response.data.order.orderId);
        setCart([]);
        setTimeout(() => setOrderPlaced(false), 3000);
      }
    } catch (error) {
      console.error("❌ Error placing order:", error);
      alert(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // AR Modal Component
  const ARModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="relative bg-white rounded-lg p-4 w-full h-full max-w-4xl max-h-[90vh]">
        <button 
          onClick={() => setArModelUrl(null)}
          className="absolute top-2 right-2 text-gray-800 hover:text-red-600 z-10"
        >
          <FaTimes size={24} />
        </button>
        <model-viewer
          src={arModelUrl}
          ar
          ar-modes="webxr scene-viewer quick-look"
          camera-controls
          auto-rotate
          style={{ width: '100%', height: '100%' }}
          alt="3D Model"
        >
          <button slot="ar-button" className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded">
            View in AR
          </button>
        </model-viewer>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-800">Our Menu</h2>
        <p className="text-gray-600">Explore our delicious dishes and order now!</p>
        <p className="text-lg font-bold text-orange-600 mt-2">
          Table Number: {tableNumber}
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
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
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col"
          >
            <div className="w-full h-40 overflow-hidden rounded-lg mb-4">
              <img
                src={item.photo}
                alt={item.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
            <p className="text-sm text-gray-600">{item.category}</p>
            <p className="text-lg font-bold text-orange-600 mt-2">
              ₹{item.price.toFixed(2)}
            </p>

            <div className="mt-auto space-y-2">
              <button
                onClick={() => addToCart(item)}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition duration-300 w-full"
              >
                Add to Cart
              </button>

              {LOCAL_MODELS[item.name] && (
                <button
                  onClick={() => setArModelUrl(LOCAL_MODELS[item.name])}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 w-full"
                >
                  View in 3D
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Floating Cart Button */}
      <div
        className="fixed bottom-4 left-4 bg-orange-600 text-white p-4 rounded-full shadow-lg cursor-pointer hover:bg-orange-700 transition duration-300"
        onClick={() => setCartOpen(true)}
      >
        🛒 {cart.length} {cart.length === 1 ? "Item" : "Items"}
      </div>

      {/* Cart Panel */}
      {cartOpen && (
        <div className="fixed bottom-0 left-0 right-0 bg-white p-6 rounded-t-lg shadow-lg max-h-[70vh] overflow-y-auto cart-container sm:left-auto sm:right-4 sm:bottom-4 sm:rounded-lg sm:max-w-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Your Cart</h3>
            <button
              onClick={() => setCartOpen(false)}
              className="text-gray-600 hover:text-gray-800"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {cart.length === 0 ? (
            <p className="text-gray-600">Your cart is empty.</p>
          ) : (
            <>
              <div className="space-y-4 mb-4">
                {cart.map((item) => (
                  <div key={item._id} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">{item.name}</h4>
                      <p className="text-sm text-gray-600">
                        ₹{item.price.toFixed(2)} × {item.quantity}
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

              <div className="mb-4">
                <p className="text-lg font-bold text-gray-800">
                  Total: ₹{totalAmount.toFixed(2)}
                </p>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
                <button
                  onClick={placeOrder}
                  disabled={isProcessing}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition duration-300 w-full disabled:bg-orange-400"
                >
                  {isProcessing ? "Processing..." : "Place Order"}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Order Confirmation */}
      {orderPlaced && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce">
          ✅ Order #{orderNumber} placed successfully!
        </div>
      )}

      {/* AR Viewer Modal */}
      {arModelUrl && <ARModal />}

      {/* Add model-viewer script */}
      <script 
        type="module" 
        src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js" 
        async
      />
    </div>
  );
};

export default CustomerMenu;