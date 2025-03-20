import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

const Staff = () => {
  // Sample staff data
  const [staff, setStaff] = useState([
    { id: 1, name: 'John Doe', role: 'Waiter', contact: 'john.doe@example.com', status: 'Active' },
    { id: 2, name: 'Jane Smith', role: 'Chef', contact: 'jane.smith@example.com', status: 'Active' },
    { id: 3, name: 'Mike Johnson', role: 'Waiter', contact: 'mike.johnson@example.com', status: 'Inactive' },
  ]);

  // State for adding new staff
  const [newStaff, setNewStaff] = useState({
    name: '',
    role: 'Waiter',
    contact: '',
    status: 'Active',
  });

  // Handle input change for new staff form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStaff({ ...newStaff, [name]: value });
  };

  // Add new staff
  const addStaff = () => {
    if (newStaff.name && newStaff.contact) {
      const staffMember = { ...newStaff, id: staff.length + 1 };
      setStaff([...staff, staffMember]);
      setNewStaff({ name: '', role: 'Waiter', contact: '', status: 'Active' }); // Reset form
    } else {
      alert('Please fill in all fields.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Staff Management</h2>
        </div>

        {/* Add Staff Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Add New Staff</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={newStaff.name}
              onChange={handleInputChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <select
              name="role"
              value={newStaff.role}
              onChange={handleInputChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="Waiter">Waiter</option>
              <option value="Chef">Chef</option>
              <option value="Manager">Manager</option>
            </select>
            <input
              type="text"
              name="contact"
              placeholder="Contact Info"
              value={newStaff.contact}
              onChange={handleInputChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <select
              name="status"
              value={newStaff.status}
              onChange={handleInputChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <button
            onClick={addStaff}
            className="mt-4 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition duration-300"
          >
            Add Staff
          </button>
        </div>

        {/* Staff Table */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Staff Details</h3>
          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">ID</th>
                <th className="py-2">Name</th>
                <th className="py-2">Role</th>
                <th className="py-2">Contact</th>
                <th className="py-2">Status</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((staffMember) => (
                <tr key={staffMember.id} className="border-b hover:bg-gray-50">
                  <td className="py-4">{staffMember.id}</td>
                  <td className="py-4">{staffMember.name}</td>
                  <td className="py-4">{staffMember.role}</td>
                  <td className="py-4">{staffMember.contact}</td>
                  <td className="py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        staffMember.status === 'Active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {staffMember.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <button className="text-orange-600 hover:text-orange-700 mr-2">
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-700">
                      Remove
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

export default Staff;