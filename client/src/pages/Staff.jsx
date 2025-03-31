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
    name: '',
    email: '',
    role: '',
    phone: '',
    password: '',
  });

  const [isEditing, setIsEditing] = useState(false);

  // Fetch staff data from the backend
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/users', {
          headers: {
            'Content-Type': 'application/json',
            // Add if using auth:
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
  
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch staff');
        }
  
        if (!Array.isArray(data)) {
          throw new Error('Received invalid staff data format');
        }
  
        setStaff(data);
      } catch (error) {
        console.error('Fetch error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  // Handle input change for forms
  const handleInputChange = (e, formType) => {
    const { name, value } = e.target;
    if (formType === 'new') {
      setNewStaff({ ...newStaff, [name]: value });
    } else {
      setEditStaff({ ...editStaff, [name]: value });
    }
  };

  // Add new staff
  const addStaff = async () => {
    // Validate required fields
    if (!newStaff.name || !newStaff.email || !newStaff.password) {
      setError('Name, email, and password are required');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:8000/api/v1/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStaff)
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add staff');
      }
  
      setStaff([...staff, data]);
      setNewStaff({ 
        name: '', 
        email: '', 
        password: '', 
        role: 'Waiter', 
        phone: '' 
      });
      setError(null);
    } catch (error) {
      console.error('Submission error:', error);
      setError(error.message);
    }
  };

  // Update staff
  const updateStaff = async () => {
    try {
      // Prepare update data (only include changed fields)
      const updateData = {
        role: editStaff.role,
        ...(editStaff.password && { password: editStaff.password })
      };

      const response = await fetch(`http://localhost:8000/api/v1/users/${editStaff._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to update staff');

      setStaff(staff.map((s) => (s._id === editStaff._id ? { ...s, ...updateData } : s)));
      setIsEditing(false);
    } catch (error) {
      console.error('Update Error:', error);
      setError(error.message);
    }
  };

  // Delete staff member
  const deleteStaff = async (id) => {
    if (!window.confirm('Are you sure you want to delete this staff member?')) return;
    
    try {
      const response = await fetch(`http://localhost:8000/api/v1/users/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete staff');

      setStaff(staff.filter((s) => s._id !== id));
    } catch (error) {
      setError(error.message);
    }
  };

  // Open edit modal with staff data
  const openEditModal = (staffMember) => {
    setEditStaff({
      _id: staffMember._id,
      name: staffMember.name,
      email: staffMember.email,
      role: staffMember.role,
      phone: staffMember.phone,
      password: ''
    });
    setIsEditing(true);
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

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
            <p>{error}</p>
            <button 
              onClick={() => setError(null)} 
              className="mt-2 text-red-700 hover:text-red-800 font-medium"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Add Staff Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Add New Staff</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input 
                type="text" 
                name="name" 
                placeholder="Full Name" 
                value={newStaff.name} 
                onChange={(e) => handleInputChange(e, 'new')} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                name="email" 
                placeholder="Email Address" 
                value={newStaff.email} 
                onChange={(e) => handleInputChange(e, 'new')} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input 
                type="password" 
                name="password" 
                placeholder="Password" 
                value={newStaff.password} 
                onChange={(e) => handleInputChange(e, 'new')} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select 
                name="role" 
                value={newStaff.role} 
                onChange={(e) => handleInputChange(e, 'new')} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="Waiter">Waiter</option>
                <option value="Chef">Chef</option>
                <option value="Manager">Manager</option>
                <option value="Owner">Owner</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input 
                type="text" 
                name="phone" 
                placeholder="Phone Number" 
                value={newStaff.phone} 
                onChange={(e) => handleInputChange(e, 'new')} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" 
              />
            </div>
          </div>
          <button 
            onClick={addStaff} 
            className="mt-2 bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Add Staff Member
          </button>
        </div>

        {/* Staff Table */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Staff Details</h3>
            <span className="text-sm text-gray-500">
              {staff.length} staff member{staff.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {staff.length > 0 ? (
                    staff.map((s) => (
                      <tr key={s._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{s.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            s.role === 'Manager' ? 'bg-blue-100 text-blue-800' :
                            s.role === 'Chef' ? 'bg-purple-100 text-purple-800' :
                            s.role === 'Owner' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {s.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{s.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{s.phone || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            s.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {s.status || 'Active'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            onClick={() => openEditModal(s)}
                            className="text-orange-600 hover:text-orange-900 mr-4"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => deleteStaff(s._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                        No staff members found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Edit Staff Modal */}
      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Edit Staff Member</h3>
              <button 
                onClick={() => setIsEditing(false)} 
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input 
                  type="text" 
                  value={editStaff.name} 
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  value={editStaff.email} 
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select 
                  name="role" 
                  value={editStaff.role} 
                  onChange={(e) => handleInputChange(e, 'edit')} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="Waiter">Waiter</option>
                  <option value="Chef">Chef</option>
                  <option value="Manager">Manager</option>
                  <option value="Owner">Owner</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password (Optional)</label>
                <input 
                  type="password" 
                  name="password"
                  placeholder="Leave blank to keep current"
                  value={editStaff.password} 
                  onChange={(e) => handleInputChange(e, 'edit')} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={updateStaff}
                  className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Staff;