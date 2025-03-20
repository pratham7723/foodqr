import React from 'react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-50 to-orange-100 flex flex-col items-center justify-center p-6">
      {/* Hero Section */}
      <div className="text-center max-w-4xl">
        <h1 className="text-6xl font-bold text-orange-900 mb-6">
          Welcome to <span className="text-orange-600">FlavorFusion</span>
        </h1>
        <p className="text-xl text-orange-800 mb-8">
          Experience the future of dining with our QR-based digital menu and Augmented Reality dish previews.
          Explore our delicious dishes, place orders seamlessly, and enjoy a hassle-free dining experience.
        </p>

        {/* QR Code Section */}
        <div className="bg-white p-8 rounded-lg shadow-lg inline-block">
          <h2 className="text-2xl font-semibold text-orange-900 mb-4">
            Scan the QR Code to View the Menu
          </h2>
          <div className="bg-orange-100 p-4 rounded-lg">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png"
              alt="QR Code"
              className="w-48 h-48 mx-auto"
            />
          </div>
          <p className="text-sm text-orange-700 mt-4">
            Point your phone's camera at the QR code to access the menu.
          </p>
        </div>

        {/* Call-to-Action Button */}
        <button className="mt-8 bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition duration-300">
          Start Exploring
        </button>
      </div>

      {/* Features Section */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl">
        {/* Feature 1: QR Code Menu */}
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-orange-600 text-4xl mb-4">📱</div>
          <h3 className="text-xl font-semibold text-orange-900 mb-2">QR Code Menu</h3>
          <p className="text-orange-700">
            Access the menu instantly by scanning the QR code at your table.
          </p>
        </div>

        {/* Feature 2: AR Dish Preview */}
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-orange-600 text-4xl mb-4">👁️</div>
          <h3 className="text-xl font-semibold text-orange-900 mb-2">AR Dish Preview</h3>
          <p className="text-orange-700">
            Visualize your dishes in Augmented Reality before ordering.
          </p>
        </div>

        {/* Feature 3: Easy Ordering */}
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-orange-600 text-4xl mb-4">🍽️</div>
          <h3 className="text-xl font-semibold text-orange-900 mb-2">Easy Ordering</h3>
          <p className="text-orange-700">
            Add items to your cart and place orders directly from your phone.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;