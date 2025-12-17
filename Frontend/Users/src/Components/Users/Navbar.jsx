import React, { useState } from 'react';
import { ShoppingCart, Heart, UserCircle, Search, Menu, X, Tag, Compass, Home } from 'lucide-react';
import '../../index.css';

export default function UserNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(3); 

  const mainLinks = [
    { id: 'home', label: 'Home', icon: Home, href: '/home' },
    { id: 'shop', label: 'Shop', icon: Compass, href: '/shop' },
    { id: 'deals', label: 'Today\'s Deals', icon: Tag, href: '/deals' },
  ];

  const utilityIcons = [
    { id: 'wishlist', label: 'Wishlist', icon: Heart, href: '/account/wishlist' },
    { id: 'account', label: 'Account', icon: UserCircle, href: '/account' },
  ];

  const getLinkClasses = (href) => {
    const isActive = href === location.pathname;
    return `
      flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm
      ${isActive ? 'bg-white text-indigo-600 shadow-lg' : 'text-white hover:bg-indigo-700'}
    `;
  };
  
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-linear-to-r from-indigo-600 to-indigo-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Logo and Main Links (Desktop) */}
          <div className="flex items-center">
            {/* Logo */}
            <div className="shrink-0 mr-6">
              <h1 className="font-bold text-2xl">E-Shop</h1>
            </div>

            {/* Main Navigation Links (Desktop) */}
            <div className="hidden md:flex md:space-x-1">
              {mainLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={handleLinkClick}
                    className={getLinkClasses(item.href)}
                  >
                    <Icon size={18} />
                    <span className="font-medium">{item.label}</span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Search Bar and Utility Icons (Desktop) */}
          <div className="flex items-center gap-4">
            {/* Search Bar (Optional, added for e-commerce context) */}
            <div className="hidden lg:flex">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-300" size={18} />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-48 pl-10 pr-3 py-1 text-sm rounded-lg bg-indigo-700 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>
            </div>

            {/* Utility Icons */}
            {utilityIcons.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={`
                    ${getLinkClasses(item.href)}
                    bg-transparent p-2 rounded-full hover:bg-indigo-700
                    flex items-center justify-center
                  `}
                  title={item.label}
                >
                  <Icon size={22} />
                </a>
              );
            })}
            
            {/* Cart Icon with Badge */}
            <a
              href="/cart"
              onClick={handleLinkClick}
              className={`
                ${getLinkClasses('/cart')}
                bg-transparent p-2 rounded-full hover:bg-indigo-700 relative
              `}
              title="Shopping Cart"
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-indigo-200 hover:text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Conditionally Rendered) */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            
            {/* Search for Mobile */}
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-300" size={18} />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-3 py-2 text-sm rounded-lg bg-indigo-700 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
            
            {/* Main Links (Mobile) */}
            {mainLinks.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={`w-full text-left ${getLinkClasses(item.href)}`}
                >
                  <Icon size={20} />
                  {item.label}
                </a>
              );
            })}

            <div className="border-t border-indigo-500 pt-1 mt-1"></div>

            {/* Utility Icons (Mobile) */}
            {utilityIcons.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={`w-full text-left ${getLinkClasses(item.href)}`}
                >
                  <Icon size={20} />
                  {item.label}
                </a>
              );
            })}
            
            {/* Cart Link (Mobile) */}
             <a
              href="/cart"
              onClick={handleLinkClick}
              className={`w-full text-left ${getLinkClasses('/cart')}`}
            >
              <ShoppingCart size={20} />
              Cart ({cartCount})
            </a>

          </div>
        </div>
      )}
    </nav>
  );
}