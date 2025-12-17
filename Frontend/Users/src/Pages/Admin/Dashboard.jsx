import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package, 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Edit 
} from 'lucide-react';
import Sidebar from '../../Components/Admin/Sidebar.jsx';
import Header from '../../Components/Admin/Header.jsx';
import { dashboardAPI } from '../../Services/api.js';
import Swal from 'sweetalert2';

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    revenueChange: 0,
    ordersChange: 0,
    customersChange: 0,
    productsChange: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    setMounted(true);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await dashboardAPI.getDashboardData();
      
      if (res?.success) {
        setStats(res.data.stats);
        setRecentOrders(res.data.recentOrders || []);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: res?.message || 'Failed to load dashboard data',
          confirmButtonColor: '#DC2626',
        });
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load dashboard data',
        confirmButtonColor: '#DC2626',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const StatCard = ({ title, value, change, icon: Icon, color }) => (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow duration-300 transform hover:scale-105">
      <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
        <div className="flex-1 text-center sm:text-left">
          <p className="text-xs sm:text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{value}</p>
          <div className="flex items-center justify-center sm:justify-start mt-2">
            {change > 0 ? (
              <TrendingUp size={16} className="text-green-500 mr-1" />
            ) : (
              <TrendingDown size={16} className="text-red-500 mr-1" />
            )}
            <span className={`text-xs sm:text-sm font-medium ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {Math.abs(change)}% from last month
            </span>
          </div>
        </div>
        <div className={`p-2 sm:p-3 rounded-full ${color} transition-transform duration-300`}>
          <Icon size={20} className="sm:w-6 sm:h-6 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <div className="w-64 bg-gradient-to-b from-indigo-800 to-indigo-900"></div>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className={`${mounted ? 'transition-all duration-300 ease-in-out' : ''} overflow-hidden ${isSidebarOpen ? 'w-64' : 'w-0'}`}>
        <Sidebar activeItem="dashboard" />
      </div>
      <div className={`flex-1 flex flex-col ${mounted ? 'transition-all duration-300 ease-in-out' : ''}`}>
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />
        
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <StatCard 
            title="Total Revenue" 
            value={`$${stats.totalRevenue.toLocaleString()}`} 
            change={stats.revenueChange} 
            icon={DollarSign} 
            color="bg-green-500" 
          />
          <StatCard 
            title="Total Orders" 
            value={stats.totalOrders.toLocaleString()} 
            change={stats.ordersChange} 
            icon={ShoppingCart} 
            color="bg-blue-500" 
          />
          <StatCard 
            title="Total Customers" 
            value={stats.totalCustomers.toLocaleString()} 
            change={stats.customersChange} 
            icon={Users} 
            color="bg-purple-500" 
          />
          <StatCard 
            title="Total Products" 
            value={stats.totalProducts.toLocaleString()} 
            change={stats.productsChange} 
            icon={Package} 
            color="bg-orange-500" 
          />
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-md overflow-hidden hover:shadow-lg">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="flex items-center justify-between flex-col sm:flex-row gap-2">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Recent Orders</h2>
              <a href="/admin/orders" className="text-indigo-600 hover:text-indigo-800 font-medium text-sm sm:text-base transition-colors duration-200">
                View All
              </a>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm sm:text-base">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-200 text-xs sm:text-sm">
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap font-medium text-gray-900">#{order.id}</td>
                      <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-gray-900">{order.customer_name || 'N/A'}</td>
                      <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-gray-900">{order.customer_email || 'N/A'}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap font-medium text-gray-900">${parseFloat(order.total_amount).toFixed(2)}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)} transition-all duration-200`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-1 sm:space-x-2">
                          <button className="text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 p-1 rounded transition-colors duration-200">
                            <Eye size={16} />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-1 rounded transition-colors duration-200">
                            <Edit size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      No recent orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
