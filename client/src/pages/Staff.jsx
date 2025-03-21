import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for adding new staff
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Waiter',
    phone: '',
    status: 'Active',
  });

  // State for editing staff
  const [editStaff, setEditStaff] = useState({
    _id: '',
    role: '',
    password: '',
  });

  const [isEditing, setIsEditing] = useState(false);

  // Fetch staff data from the backend
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/users');
        if (!response.ok) throw new Error('Failed to fetch staff data');

        const data = await response.json();
        setStaff(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  // Handle input change for new staff form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStaff({ ...newStaff, [name]: value });
  };

  // Add new staff
  const addStaff = async () => {
    if (!newStaff.name || !newStaff.email || !newStaff.password) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/v1/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStaff),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add staff');
      }

      const data = await response.json();
      setStaff([...staff, data]);
      setNewStaff({ name: '', email: '', password: '', role: 'Waiter', phone: '', status: 'Active' });
    } catch (error) {
      setError(error.message);
      alert(`Error: ${error.message}`);
    }
  };

  // Update staff
  const updateStaff = async (id, updatedData) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to update staff');

      setStaff(staff.map((s) => (s._id === id ? { ...s, ...updatedData } : s)));
      setIsEditing(false); // Close modal after update
    } catch (error) {
      console.error('Update Error:', error);
      alert(`Error: ${error.message}`);
    }
  };

  // Delete staff member
  const deleteStaff = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/users/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete staff');

      setStaff(staff.filter((s) => s._id !== id));
    } catch (error) {
      alert(`Error: ${error.message}`);
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
            <input type="text" name="name" placeholder="Name" value={newStaff.name} onChange={handleInputChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
            <input type="email" name="email" placeholder="Email" value={newStaff.email} onChange={handleInputChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
            <input type="password" name="password" placeholder="Password" value={newStaff.password} onChange={handleInputChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
            <select name="role" value={newStaff.role} onChange={handleInputChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500">
              <option value="Waiter">Waiter</option>
              <option value="Chef">Chef</option>
              <option value="Manager">Manager</option>
              <option value="Owner">Owner</option>
            </select>
            <input type="text" name="phone" placeholder="Phone" value={newStaff.phone} onChange={handleInputChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
          </div>
          <button onClick={addStaff} className="mt-4 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">Add Staff</button>
        </div>

        {/* Staff Table */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Staff Details</h3>
          {loading ? <p>Loading staff data...</p> : error ? <p className="text-red-500">Error: {error}</p> : (
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th>Name</th><th>Role</th><th>Email</th><th>Phone</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((s) => (
                  <tr key={s._id} className="border-b">
                    <td>{s.name}</td>
                    <td>{s.role}</td>
                    <td>{s.email}</td>
                    <td>{s.phone}</td>
                    <td>
                      <button onClick={() => { setEditStaff({ _id: s._id, role: s.role, password: '' }); setIsEditing(true); }} className="text-orange-600 mr-2">Edit</button>
                      <button onClick={() => deleteStaff(s._id)} className="text-red-600">Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Edit Staff Modal */}
      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3>Edit Staff</h3>
            <select value={editStaff.role} onChange={(e) => setEditStaff({ ...editStaff, role: e.target.value })} className="w-full mb-4">
              <option value="Waiter">Waiter</option><option value="Chef">Chef</option><option value="Manager">Manager</option><option value="Owner">Owner</option>
            </select>
            <input type="password" placeholder="New Password (Optional)" onChange={(e) => setEditStaff({ ...editStaff, password: e.target.value })} className="w-full mb-4"/>
            <button onClick={() => updateStaff(editStaff._id, editStaff)} className="bg-orange-600 text-white px-4 py-2">Update</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Staff;
