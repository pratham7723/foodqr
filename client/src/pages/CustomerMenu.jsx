import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const CustomerMenu = () => {
  // Sample menu data
  const menuItems = [
    { id: 1, name: 'Classic Burger', category: 'Burgers', price: 9.99, photo: 'https://via.placeholder.com/150', arModel: 'https://example.com/ar-model-1' },
    { id: 2, name: 'Margherita Pizza', category: 'Pizza', price: 12.99, photo: 'https://via.placeholder.com/150', arModel: 'https://example.com/ar-model-2' },
    { id: 3, name: 'Grilled Chicken Salad', category: 'Salads', price: 8.99, photo: 'https://via.placeholder.com/150', arModel: 'https://example.com/ar-model-3' },
    { id: 4, name: 'Spaghetti Bolognese', category: 'Pasta', price: 11.99, photo: 'https://via.placeholder.com/150', arModel: 'https://example.com/ar-model-4' },
    { id: 5, name: 'Chocolate Lava Cake', category: 'Desserts', price: 6.99, photo: 'https://via.placeholder.com/150', arModel: 'https://example.com/ar-model-5' },
  ];

  // State for selected category
  const [selectedCategory, setSelectedCategory] = useState('All');

  // State for cart
  const [cart, setCart] = useState([]);

  // Get unique categories
  const categories = ['All', ...new Set(menuItems.map((item) => item.category))];

  // Filter menu items by category
  const filteredMenuItems = selectedCategory === 'All'
    ? menuItems
    : menuItems.filter((item) => item.category === selectedCategory);

  // Add item to cart
  const addToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCart(cart.filter((item) => item.id !== itemId));
  };

  // Calculate total amount
  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  // Handle payment
  const handlePayment = async () => {
    const options = {
      key: 'YOUR_RAZORPAY_KEY', // Replace with your Razorpay key
      amount: totalAmount * 100, // Amount in paise
      currency: 'INR',
      name: 'FlavorFusion',
      description: 'Payment for Order',
      handler: function (response) {
        alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
        // Place order logic here (e.g., send order to backend)
        setCart([]); // Clear cart after payment
      },
      prefill: {
        name: 'Customer Name', // Replace with customer name
        email: 'customer@example.com', // Replace with customer email
        contact: '9999999999', // Replace with customer phone number
      },
      theme: {
        color: '#F37254',
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Restaurant Logo and Table Number */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <img
            src="https://via.placeholder.com/100" // Replace with your restaurant logo
            alt="Restaurant Logo"
            className="w-16 h-16 rounded-lg"
          />
          <h1 className="text-3xl font-bold text-gray-800 ml-4">FlavorFusion</h1>
        </div>
        <div className="bg-orange-600 text-white px-6 py-2 rounded-lg">
          <span className="text-lg font-semibold">Table 5</span> {/* Replace with dynamic table number */}
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-800">Our Menu</h2>
        <p className="text-gray-600">Explore our delicious dishes and visualize them in AR!</p>
      </div>

      {/* Category Filters */}
      <div className="flex justify-center space-x-4 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg ${
              selectedCategory === category
                ? 'bg-orange-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            } transition duration-300`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredMenuItems.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            {/* Menu Item Photo */}
            <img
              src={item.photo}
              alt={item.name}
              className="w-full h-40 object-cover rounded-lg mb-4"
            />

            {/* Menu Item Details */}
            <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
            <p className="text-sm text-gray-600">{item.category}</p>
            <p className="text-lg font-bold text-orange-600 mt-2">${item.price.toFixed(2)}</p>

            {/* Add to Cart Button */}
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

      {/* Cart Section */}
      <div className="fixed bottom-4 left-4 bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Cart</h3>
        {cart.length === 0 ? (
          <p className="text-gray-600">Your cart is empty.</p>
        ) : (
          <>
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">{item.name}</h4>
                    <p className="text-sm text-gray-600">${item.price.toFixed(2)} x {item.quantity}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <p className="text-lg font-bold text-gray-800">Total: ${totalAmount.toFixed(2)}</p>
              <button
                onClick={handlePayment}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition duration-300 w-full mt-4"
              >
                Proceed to Payment
              </button>
            </div>
          </>
        )}
      </div>

      {/* QR Code for Menu */}
      <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg">
        <QRCodeSVG
          value="https://your-restaurant.com/menu" // Replace with your actual URL
          size={80}
          level="H"
          includeMargin={true}
        />
        <p className="text-sm text-gray-600 mt-2">Scan to view menu</p>
      </div>
    </div>
  );
};

export default CustomerMenu;