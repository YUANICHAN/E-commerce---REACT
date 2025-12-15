import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold text-lg mb-4">About ShopHub</h4>
            <p className="text-gray-400 text-sm">Your trusted destination for quality products at amazing prices.</p>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
              <li><a href="#" className="hover:text-white">FAQs</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4">Customer Service</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white">Shipping Info</a></li>
              <li><a href="#" className="hover:text-white">Returns</a></li>
              <li><a href="#" className="hover:text-white">Track Order</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4">Follow Us</h4>
            <p className="text-gray-400 text-sm mb-4">Stay connected on social media</p>
            <div className="flex gap-3">
              <button className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg transition-colors">📘</button>
              <button className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg transition-colors">📷</button>
              <button className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg transition-colors">🐦</button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
          © 2024 ShopHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
