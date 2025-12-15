import React, { useState } from 'react';
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

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Mock data - in a real app, this would come from an API
  const [stats] = useState({
    totalRevenue: 125430.50,
    totalOrders: 1247,
    totalCustomers: 892,
    totalProducts: 456,
    revenueChange: 12.5, // percentage
    ordersChange: 8.2,
    customersChange: -2.1,
    productsChange: 5.7,
  });

  const recentOrders = [
    { id: '#12345', customer: 'John Doe', product: 'Wireless Headphones', amount: 299.99, status: 'Shipped', date: '2023-10-15' },
    { id: '#12346', customer: 'Jane Smith', product: 'Smart Watch', amount: 199.99, status: 'Processing', date: '2023-10-14' },
    { id: '#12347', customer: 'Bob Johnson', product: 'Bluetooth Speaker', amount: 79.99, status: 'Delivered', date: '2023-10-13' },
    { id: '#12348', customer: 'Alice Brown', product: 'HD Camera', amount: 899.99, status: 'Pending', date: '2023-10-12' },
  ];

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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isSidebarOpen ? 'w-64' : 'w-0'}`}>
        <Sidebar activeItem="dashboard" />
      </div>
      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />
        
        <div className="flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8 animate-in fade-in duration-500">
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
        <div className="bg-white rounded-lg sm:rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg animate-in fade-in delay-100">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-linear-to-r from-gray-50 to-gray-100">
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
                  <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-200 text-xs sm:text-sm">
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap font-medium text-gray-900">{order.id}</td>
                    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-gray-900">{order.customer}</td>
                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-gray-900">{order.product}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap font-medium text-gray-900">${order.amount}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)} transition-all duration-200`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
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
                ))}
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
