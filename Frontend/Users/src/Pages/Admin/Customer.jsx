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
import { userAPI } from '../../Services/api';

function Customer() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
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
        <div className='p-4 fixed inset-0 backdrop-blur-sm bg-opacity-20 flex items-center justify-center z-50 animate-in fade-in duration-200'>
          <div className='bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-in zoom-in duration-300'>
            <div className='sticky top-0 bg-linear-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-gray-200'>
              <h3 className='text-lg font-semibold text-gray-900'>Customer Details</h3>
            </div>
            <form action="" className='p-6 space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700'>Full Name</label>
                <input
                  type='text'
                  name='name'
                  className='mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
                  placeholder='Juan Dela Cruz'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>Password</label>
                <input
                  type='password'
                  name='password'
                  className='mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>Phone</label>
                <input
                  type='text'
                  name='phone'
                  className='mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
                  placeholder='09xxxxxxxxx'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>Phone</label>
                <input
                  type='text'
                  name='phone'
                  className='mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
                  placeholder='09xxxxxxxxx'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>City</label>
                <input
                  type='text'
                  name='city'
                  className='mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
                  placeholder='Baybay'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>Country</label>
                <input
                  type='text'
                  name='country'
                  className='mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
                  placeholder='Philippines'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>Zip Code</label>
                <input
                  type='text'
                  name='zipcode'
                  className='mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
                  placeholder='6521'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>Status</label>
                <select
                  name='status'
                  className='mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
                >
                  <option value='Active'>Active</option>
                  <option value='Inactive'>Inactive</option>
                </select>
              </div>
              <div className='flex justify-end gap-3 pt-4'>
                <button
                  type='button'
                  onClick={() => setIsModalOpen(false)}
                  className='px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100'
                >
                  
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700'
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  }

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
                  <button onClick={() => setIsModalOpen(true)}
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
                          <button className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-1 rounded transition-colors duration-200">
                            <Edit size={16} />
                          </button>
                          <button className="text-red-600 hover:text-red-900 hover:bg-red-50 p-1 rounded transition-colors duration-200">
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