import React from 'react';
import Swal from 'sweetalert2';
import { adminAuthAPI } from '../../Services/api';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut 
} from 'lucide-react';

function Sidebar({ activeItem = 'dashboard' }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
    { id: 'products', label: 'Products', icon: Package, href: '/admin/products' },
    { id: 'orders', label: 'Orders', icon: ShoppingCart, href: '/admin/orders' },
    { id: 'customers', label: 'Customers', icon: Users, href: '/admin/customers' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, href: '/admin/analytics' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/admin/settings' },
  ];

  const getItemClasses = (id) => {
    const isActive = id === activeItem;
    return `
      flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium
      ${isActive 
        ? 'bg-indigo-700 text-white shadow-lg' 
        : 'text-indigo-100 hover:bg-indigo-700 hover:text-white'
      }
    `;
  };

  const handleLogout = (e) => {
    e.preventDefault();
    Swal.fire({
      title: 'Logout?',
      text: 'Are you sure you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#DC2626',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await adminAuthAPI.logout();
        } catch (err) {
          console.error('Admin logout error:', err);
        }
        localStorage.removeItem('authToken');
        localStorage.removeItem('authRole');
        window.location.href = '/admin/login';
      }
    });
  };

  return (
    <div className="w-64 bg-linear-to-b from-indigo-800 to-indigo-900 text-white shadow-xl min-h-screen">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.id}
                href={item.href}
                className={getItemClasses(item.id)}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>
        <div className="mt-8 pt-4 border-t border-indigo-600">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium text-indigo-100 hover:bg-indigo-700 hover:text-white w-full"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
