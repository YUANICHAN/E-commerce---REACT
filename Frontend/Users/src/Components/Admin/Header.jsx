import React from 'react';
import { notify } from '../Notification.jsx';
import { Menu, Bell, Settings, LogOut, User, Search, X } from 'lucide-react';

function Header({ onToggleSidebar, isSidebarOpen }) {

  const handleSettingsClick = () => {
    window.location.href = '/admin/settings';
  }

  const handleNotifyClick = () => {
    notify.info('You have new notifications', { icon: '🔔' });
  }
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 p-2">
      <div className="flex items-center justify-between h-16 px-6 gap-4">
        {/* Left section - Menu toggle & search */}
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900"
            title={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        </div>

        {/* Right section - Notifications & User menu */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button onClick={handleNotifyClick} className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Settings */}
          <button onClick={handleSettingsClick} className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900">
            <Settings size={20} />
          </button>

          {/* Divider */}
          <div className="hidden sm:block w-px h-6 bg-gray-200"></div>

          {/* User Profile Dropdown */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <button className="w-10 h-10 bg-linear-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white hover:shadow-lg transition-shadow font-medium text-sm">
              A
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
