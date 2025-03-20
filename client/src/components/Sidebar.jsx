import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="bg-white w-64 p-6 shadow-lg flex flex-col justify-between h-screen">
      {/* Logo and Navigation Links */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-8">FlavorFusion</h1>
        <nav>
          <ul className="space-y-4">
            <li>
              <Link
                to="/dashboard"
                className="flex items-center text-gray-700 hover:text-orange-600 hover:bg-orange-50 p-2 rounded-lg transition duration-300"
              >
                <span className="mr-2">📊</span>
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/orders"
                className="flex items-center text-gray-700 hover:text-orange-600 hover:bg-orange-50 p-2 rounded-lg transition duration-300"
              >
                <span className="mr-2">🍽️</span>
                Orders
              </Link>
            </li>
            <li>
              <Link
                to="/Management"
                className="flex items-center text-gray-700 hover:text-orange-600 hover:bg-orange-50 p-2 rounded-lg transition duration-300"
              >
                <span className="mr-2">🪑</span>
                Table Manager
              </Link>
            </li>
            <li>
              <Link
                to="/menu"
                className="flex items-center text-gray-700 hover:text-orange-600 hover:bg-orange-50 p-2 rounded-lg transition duration-300"
              >
                <span className="mr-2">📋</span>
                Menu
              </Link>
            </li>
            <li>
              <Link
                to="/Tableqrcodes"
                className="flex items-center text-gray-700 hover:text-orange-600 hover:bg-orange-50 p-2 rounded-lg transition duration-300"
              >
                <span className="mr-2">🍴</span>
                Table Qr codes

              </Link>
            </li>
            <li>
              <Link
                to="/staff"
                className="flex items-center text-gray-700 hover:text-orange-600 hover:bg-orange-50 p-2 rounded-lg transition duration-300"
              >
                <span className="mr-2">🧑‍🍳</span>
                Staff
              </Link>
            </li>
            <li>
              <Link
                to="/reports"
                className="flex items-center text-gray-700 hover:text-orange-600 hover:bg-orange-50 p-2 rounded-lg transition duration-300"
              >
                <span className="mr-2">📈</span>
                Reports
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Logout Button */}
      <div>
        <button className="w-full flex items-center justify-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300">
          <span className="mr-2">🚪</span>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;