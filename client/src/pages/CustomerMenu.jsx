import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
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
  "Garlic Bread": "/models/garlicbread.glb",
  "Donut": "models/donut.glb",
  "Coca Cola": "/models/coke.glb",
  "Cake": "/models/cake.glb",
  "Red Velvet Pastry": "/models/redvelvet.glb",
  "cappuccino": "/models/coffee_cup.glb",
  "Cold Coffee": "/models/creamed_coffee.glb",
  "Iced Coffee": "/models/ice_coffee.glb",
  "Loaded Nachos": "/models/nachos.glb",
  "Veg Overloaded Pizza": "/models/Tp Pizza.glb",
  "Red Pepperoni Pizza": "/models/red peprika.glb",
  "Chicken Momos": "/models/momo_food.glb",
  "Veg Momos": "/models/momo_food.glb",

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
  const [existingOrders, setExistingOrders] = useState([]);
  const [isFetchingOrders, setIsFetchingOrders] = useState(false);

  // Fetch menu items
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/menus`
        );
        setMenuItems(response.data.data || response.data);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };
    fetchMenuItems();
  }, []);

  // Fetch existing orders when table number changes
  useEffect(() => {
    const fetchExistingOrders = async () => {
      try {
        const tableNum = parseInt(tableNumber, 10);
        if (isNaN(tableNum)) return;

        setIsFetchingOrders(true);
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/orders?table=${tableNum}`
        );
        
        // Filter for active orders (not completed/cancelled)
        const orders = response.data.data || response.data;
        const activeOrders = orders.filter(order => 
          !['completed', 'cancelled'].includes(order.status?.toLowerCase())
        );
        
        setExistingOrders(activeOrders);
      } catch (error) {
        console.error("Error fetching existing orders:", error);
      } finally {
        setIsFetchingOrders(false);
      }
    };

    fetchExistingOrders();
  }, [tableNumber]);

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

  const updateItemQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart(cart.map(item => 
      item._id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const totalAmount = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const placeOrder = async () => {
    try {
      // Validate inputs
      const tableNum = parseInt(tableNumber, 10);
      if (isNaN(tableNum)) {
        alert("❌ Please scan a valid table QR code");
        return;
      }
  
      if (!userName?.trim() || !phoneNumber?.trim()) {
        alert("❌ Please enter your name and phone number");
        return;
      }
  
      if (cart.length === 0) {
        alert("❌ Your cart is empty");
        return;
      }

      setIsProcessing(true);

      // Prepare order data
      const orderData = {
        customerName: userName.trim(),
        phoneNumber: phoneNumber.trim(),
        tableNumber: tableNum,
        items: cart.map(item => ({
          _id: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        total: totalAmount,
        specialInstructions: "",
        status: "pending"
      };

      // Check for existing order from same customer
      const existingOrder = existingOrders.find(order => 
        order.customerName === userName.trim() && 
        order.phoneNumber === phoneNumber.trim()
      );

      let response;
      
      if (existingOrder) {
        // Update existing order by merging items
        const mergedItems = [...existingOrder.items];
        
        cart.forEach(cartItem => {
          const existingItemIndex = mergedItems.findIndex(
            item => item._id === cartItem._id
          );
          
          if (existingItemIndex >= 0) {
            mergedItems[existingItemIndex].quantity += cartItem.quantity;
          } else {
            mergedItems.push({
              _id: cartItem._id,
              name: cartItem.name,
              price: cartItem.price,
              quantity: cartItem.quantity
            });
          }
        });

        const updatedTotal = mergedItems.reduce(
          (sum, item) => sum + (item.price * item.quantity), 0
        );

        response = await axios.put(
          `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/orders/${existingOrder._id}`,
          {
            ...existingOrder,
            items: mergedItems,
            total: updatedTotal
          }
        );
      } else {
        // Create new order
        response = await axios.post(
          `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/orders?table=${tableNum}`,
          orderData
        );
      }

      // Handle success
      if (response.status === 200 || response.status === 201) {
        const order = response.data.data || response.data;
        setOrderPlaced(true);
        setOrderNumber(order.orderId || "N/A");
        setCart([]);
        
        // Refresh existing orders
        const updatedResponse = await axios.get(
          `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/orders?table=${tableNum}`
        );
        const updatedOrders = updatedResponse.data.data || updatedResponse.data;
        setExistingOrders(updatedOrders.filter(order => 
          !['completed', 'cancelled'].includes(order.status?.toLowerCase())
        ));
        
        setTimeout(() => setOrderPlaced(false), 5000);
      }

    } catch (error) {
      console.error("Order Error:", error);
      alert(
        error.response?.data?.message || 
        "Order failed. Please check your connection and try again"
      );
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
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Our Menu</h2>
        <p className="text-gray-600">Explore our delicious dishes and order now!</p>
        <p className="text-lg font-bold text-orange-600 mt-2">
          Table Number: {tableNumber}
        </p>
        {existingOrders.length > 0 && (
          <p className="text-sm text-green-600 mt-1">
            You have {existingOrders.length} active order(s)
          </p>
        )}
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1 md:px-4 md:py-2 rounded-lg ${
              selectedCategory === category
                ? "bg-orange-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            } transition duration-300 text-sm md:text-base`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {filteredMenuItems.map((item) => (
          <div
            key={item._id}
            className="bg-white p-4 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col"
          >
            <div className="w-full h-32 md:h-40 overflow-hidden rounded-lg mb-3 md:mb-4">
              <img
                src={item.photo}
                alt={item.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            <h3 className="text-lg md:text-xl font-semibold text-gray-800">{item.name}</h3>
            <p className="text-xs md:text-sm text-gray-600">{item.category}</p>
            <p className="text-md md:text-lg font-bold text-orange-600 mt-1 md:mt-2">
              ₹{item.price.toFixed(2)}
            </p>

            <div className="mt-auto space-y-2 pt-2">
              <button
                onClick={() => addToCart(item)}
                className="bg-orange-600 text-white px-3 py-1 md:px-4 md:py-2 rounded-lg hover:bg-orange-700 transition duration-300 w-full text-sm md:text-base"
              >
                Add to Cart
              </button>

              {LOCAL_MODELS[item.name] && (
                <button
                  onClick={() => setArModelUrl(LOCAL_MODELS[item.name])}
                  className="bg-blue-600 text-white px-3 py-1 md:px-4 md:py-2 rounded-lg hover:bg-blue-700 transition duration-300 w-full text-sm md:text-base"
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
        className="fixed bottom-4 left-4 bg-orange-600 text-white p-3 md:p-4 rounded-full shadow-lg cursor-pointer hover:bg-orange-700 transition duration-300 flex items-center justify-center"
        onClick={() => setCartOpen(true)}
      >
        <span className="text-lg">🛒</span>
        <span className="ml-1 text-sm md:text-base">
          {cart.length} {cart.length === 1 ? "Item" : "Items"}
        </span>
      </div>

      {/* Cart Panel */}
      {cartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center md:justify-end z-40">
          <div className="bg-white w-full max-h-[70vh] md:max-h-[80vh] overflow-y-auto rounded-t-lg md:rounded-lg shadow-lg md:max-w-md md:mr-4">
            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800">Your Cart</h3>
              <button
                onClick={() => setCartOpen(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="p-4">
              {cart.length === 0 ? (
                <p className="text-gray-600 text-center py-4">Your cart is empty.</p>
              ) : (
                <>
                  <div className="space-y-3 mb-4">
                    {cart.map((item) => (
                      <div key={item._id} className="flex justify-between items-center border-b pb-3">
                        <div className="flex-1">
                          <h4 className="text-md font-semibold text-gray-800">{item.name}</h4>
                          <p className="text-xs text-gray-600">₹{item.price.toFixed(2)} each</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateItemQuantity(item._id, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded"
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateItemQuantity(item._id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="text-red-600 hover:text-red-700 ml-2"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Subtotal:</span>
                      <span>₹{totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Existing Orders Summary */}
                  {existingOrders.length > 0 && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-medium mb-2 text-blue-800">Your Active Orders:</h4>
                      {existingOrders.map((order, index) => (
                        <div key={index} className="text-sm mb-1 text-blue-700">
                          Order #{order.orderId || index + 1}: {order.items.length} items (₹{order.total.toFixed(2)})
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                    <button
                      onClick={placeOrder}
                      disabled={isProcessing}
                      className={`w-full p-3 rounded-lg text-white font-medium ${
                        isProcessing ? 'bg-orange-400' : 'bg-orange-600 hover:bg-orange-700'
                      } transition duration-300`}
                    >
                      {isProcessing ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        'Place Order'
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Order Confirmation */}
      {orderPlaced && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce z-50">
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