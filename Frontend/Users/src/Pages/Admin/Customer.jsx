import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Eye, 
  Edit,
  Trash2,
  Search,
  Filter,
  UserPlus
} from 'lucide-react';
import Sidebar from '../../Components/Admin/Sidebar.jsx';
import Header from '../../Components/Admin/Header.jsx';
import Swal from 'sweetalert2';
import { userAPI } from '../../Services/api';

function Customer() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAllUsers();
      if (response.success && response.data) {
        setCustomers(response.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderCustomerModal = () => {
    return (
      <>
        <div className='fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200'>
          <div className='bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in zoom-in duration-300'>
            {/* Header */}
            <div className='bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-6'>
              <h3 className='text-2xl font-bold text-white'>
                {editingUser ? 'Edit Customer' : 'Add New Customer'}
              </h3>
              <p className='text-indigo-100 text-sm mt-1'>
                {editingUser ? 'Update customer information' : 'Fill in the details below to add a new customer'}
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const fd = new FormData(e.target);
                const payload = {
                  name: fd.get('name') || '',
                  email: fd.get('email') || '',
                  phone: fd.get('phone') || '',
                  address: fd.get('address') || '',
                  city: fd.get('city') || '',
                  country: fd.get('country') || '',
                  zipcode: fd.get('zipcode') || '',
                  status: fd.get('status') || 'Active',
                };

                try {
                  if (editingUser) {
                    const res = await userAPI.update(editingUser.id, payload);
                    if (res.success) {
                      setCustomers(prev => prev.map(u => (u.id === editingUser.id ? { ...u, ...payload } : u)));
                      Swal.fire({ icon: 'success', title: 'Updated', text: 'Customer updated successfully.', confirmButtonColor: '#4F46E5' });
                    }
                  } else {
                    const res = await userAPI.create(payload);
                    if (res.success) {
                      const created = res.data || { ...payload, id: Date.now() };
                      setCustomers(prev => [...prev, created]);
                      Swal.fire({ icon: 'success', title: 'Added', text: 'Customer added successfully.', confirmButtonColor: '#4F46E5' });
                    }
                  }
                  setIsModalOpen(false);
                  setEditingUser(null);
                } catch (err) {
                  Swal.fire({ icon: 'error', title: 'Failed', text: err.message || 'Please try again.', confirmButtonColor: '#DC2626' });
                }
              }}
              className='p-8 overflow-y-auto max-h-[calc(90vh-140px)]'
            >
              {/* Personal Information Section */}
              <div className='space-y-6'>
                <div className='border-l-4 border-indigo-600 pl-4 mb-6'>
                  <h4 className='text-lg font-semibold text-gray-900'>Personal Information</h4>
                  <p className='text-sm text-gray-500'>Basic customer details</p>
                </div>

                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>
                    Full Name <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    name='name'
                    defaultValue={editingUser?.name || ''}
                    className='w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none'
                    placeholder='Juan Dela Cruz'
                    required
                  />
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                  <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                      Email Address <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='email'
                      name='email'
                      defaultValue={editingUser?.email || ''}
                      className='w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none'
                      placeholder='name@example.com'
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                      Phone Number
                    </label>
                    <input
                      type='text'
                      name='phone'
                      defaultValue={editingUser?.phone || ''}
                      className='w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none'
                      placeholder='09xxxxxxxxx'
                    />
                  </div>
                </div>
              </div>

              {/* Address Information Section */}
              <div className='space-y-6 mt-8'>
                <div className='border-l-4 border-blue-600 pl-4 mb-6'>
                  <h4 className='text-lg font-semibold text-gray-900'>Address Information</h4>
                  <p className='text-sm text-gray-500'>Location details</p>
                </div>

                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>
                    Street Address
                  </label>
                  <input
                    type='text'
                    name='address'
                    defaultValue={editingUser?.address || ''}
                    className='w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none'
                    placeholder='123 Main St'
                  />
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                  <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                      City
                    </label>
                    <input
                      type='text'
                      name='city'
                      defaultValue={editingUser?.city || ''}
                      className='w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none'
                      placeholder='Baybay'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                      Zip Code
                    </label>
                    <input
                      type='text'
                      name='zipcode'
                      defaultValue={editingUser?.zipcode || ''}
                      className='w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none'
                      placeholder='6521'
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>
                    Country
                  </label>
                  <input
                    type='text'
                    name='country'
                    defaultValue={editingUser?.country || ''}
                    className='w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none'
                    placeholder='Philippines'
                  />
                </div>
              </div>

              {/* Status Section */}
              <div className='space-y-6 mt-8'>
                <div className='border-l-4 border-green-600 pl-4 mb-6'>
                  <h4 className='text-lg font-semibold text-gray-900'>Account Status</h4>
                  <p className='text-sm text-gray-500'>Set customer account status</p>
                </div>

                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>
                    Status
                  </label>
                  <select
                    name='status'
                    defaultValue={editingUser?.status || 'Active'}
                    className='w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none bg-white'
                  >
                    <option value='Active'>✓ Active</option>
                    <option value='Inactive'>✕ Inactive</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className='flex justify-end gap-4 pt-8 mt-8 border-t border-gray-200'>
                <button
                  type='button'
                  onClick={() => { setIsModalOpen(false); setEditingUser(null); }}
                  className='px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold hover:from-indigo-700 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all'
                >
                  {editingUser ? '✓ Update Customer' : '+ Save Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  };

  const filteredCustomers = customers.filter(customer => {
    const name = (customer?.name || '').toLowerCase();
    const email = (customer?.email || '').toLowerCase();
    const status = (customer?.status || '').toLowerCase();
    const matchesSearch = name.includes(searchTerm.toLowerCase()) || email.includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || status === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-xl text-gray-500">Loading customers...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-xl text-red-500">Error: {error}</div>
          </div>
        </div>
      </div>
    );
  }

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow duration-300 transform hover:scale-105">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs sm:text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-2 sm:p-3 rounded-full ${color} transition-transform duration-300`}>
          <Icon size={20} className="sm:w-6 sm:h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isSidebarOpen ? 'w-64' : 'w-0'}`}>
        <Sidebar activeItem="customers" />
      </div>
      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out max-h-screen overflow-auto">
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />
        
        <div className="flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg animate-in fade-in delay-100">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-linear-to-r from-gray-50 to-gray-100">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">All Customers</h2>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-initial">
                    <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search customers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm w-full sm:w-64"
                    />
                  </div>
                  <div className="relative flex-1 sm:flex-initial">
                    <Filter size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm appearance-none w-full sm:w-auto"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <button onClick={() => { setEditingUser(null); setIsModalOpen(true); }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 flex items-center justify-center gap-2">
                    <UserPlus size={18} />
                    Add Customer
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              {filteredCustomers.length === 0 ? (
                <div className="p-6 text-center text-gray-500">No customers found.</div>
              ) : (
              <table className="w-full text-sm sm:text-base">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                    <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-indigo-600 font-semibold text-sm">
                              {((customer?.name || 'N A').split(' ').map(n => n[0]).join('') || 'NA')}
                            </span>
                          </div>
                          <div className="ml-3 sm:ml-4">
                            <div className="text-sm font-medium text-gray-900">{customer?.name || 'Unknown'}</div>
                            <div className="text-xs text-gray-500 md:hidden">{customer?.email || '—'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center gap-1">
                          <Mail size={14} className="text-gray-400" />
                          {customer?.email || '—'}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Phone size={14} className="text-gray-400" />
                          {customer?.phone || '—'}
                        </div>
                      </td>
                      <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center gap-1">
                          <MapPin size={14} className="text-gray-400" />
                          {customer?.city && customer?.country ? `${customer.city}, ${customer.country}` : 'N/A'}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {customer?.totalOrders || 0}
                      </td>
                      <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${customer?.totalSpent ? customer.totalSpent.toLocaleString() : '0.00'}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(customer?.status)} transition-all duration-200`}>
                          {customer?.status || 'Inactive'}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-1 sm:space-x-2">
                          <button className="text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 p-1 rounded transition-colors duration-200">
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => { setEditingUser(customer); setIsModalOpen(true); }}
                            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-1 rounded transition-colors duration-200">
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={async () => {
                              const result = await Swal.fire({
                                title: 'Delete customer?',
                                text: `This will remove ${customer.name || 'this customer'}.`,
                                icon: 'warning',
                                showCancelButton: true,
                                confirmButtonColor: '#DC2626',
                                cancelButtonColor: '#6B7280',
                                confirmButtonText: 'Delete',
                                cancelButtonText: 'Cancel',
                                reverseButtons: true,
                                focusCancel: true,
                              });
                              if (!result.isConfirmed) return;
                              try {
                                const res = await userAPI.remove(customer.id);
                                if (res.success) {
                                  setCustomers(prev => prev.filter(u => u.id !== customer.id));
                                  Swal.fire({ icon: 'success', title: 'Deleted', text: 'Customer deleted.', confirmButtonColor: '#4F46E5' });
                                }
                              } catch (err) {
                                Swal.fire({ icon: 'error', title: 'Delete failed', text: err.message || 'Please try again.', confirmButtonColor: '#DC2626' });
                              }
                            }}
                            className="text-red-600 hover:text-red-900 hover:bg-red-50 p-1 rounded transition-colors duration-200">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              )}
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && renderCustomerModal()}
    </div>
  );
}

export default Customer;