import React, { useState } from 'react';
import { Heart, ShoppingCart, X, Star, ArrowLeft, Share2, Tag } from 'lucide-react';
import Footer from '../../Components/Users/Footer.jsx';

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([
    { id: 1, name: 'Premium Wireless Headphones', price: 299.99, rating: 4.8, reviews: 256, image: '🎧', category: 'Electronics', inStock: true, discount: 15 },
    { id: 2, name: 'Smart Fitness Watch', price: 199.99, rating: 4.6, reviews: 189, image: '⌚', category: 'Electronics', inStock: true, discount: 0 },
    { id: 3, name: 'Ultra HD Camera', price: 899.99, rating: 4.9, reviews: 412, image: '📷', category: 'Electronics', inStock: true, discount: 10 },
    { id: 5, name: 'Designer Leather Jacket', price: 349.99, rating: 4.5, reviews: 145, image: '🧥', category: 'Fashion', inStock: true, discount: 20 },
    { id: 6, name: 'Running Shoes Pro', price: 129.99, rating: 4.8, reviews: 567, image: '👟', category: 'Fashion', inStock: false, discount: 0 },
    { id: 7, name: 'Yoga Mat Premium', price: 49.99, rating: 4.6, reviews: 234, image: '🧘', category: 'Sports', inStock: true, discount: 0 },
  ]);

  const [cartCount, setCartCount] = useState(0);

  const removeFromWishlist = (id) => {
    setWishlistItems(items => items.filter(item => item.id !== id));
  };

  const addToCart = (id) => {
    setCartCount(cartCount + 1);
    // Optionally remove from wishlist after adding to cart
    // removeFromWishlist(id);
  };

  const addAllToCart = () => {
    const inStockCount = wishlistItems.filter(item => item.inStock).length;
    setCartCount(cartCount + inStockCount);
  };

  const shareWishlist = () => {
    alert('Wishlist link copied to clipboard!');
  };

  const handleContinueShopping = () => {
    window.location.href = '/shop';
  };

  const handleCartClick = () => {
    window.location.href = '/cart';
  }

  const totalValue = wishlistItems.reduce((sum, item) => sum + item.price, 0);
  const totalSavings = wishlistItems.reduce((sum, item) => {
    if (item.discount > 0) {
      return sum + (item.price * item.discount / 100);
    }
    return sum;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">ShopHub</h1>
            <div className="flex items-center gap-4">
              <button onClick={handleCartClick} className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
                <ShoppingCart size={24} />
                <span className="bg-indigo-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              </button>
              <button onClick={handleContinueShopping} className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium">
                <ArrowLeft size={20} />
                <span className="hidden sm:inline">Back to Shop</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Page Header */}
      <div className="bg-linear-to-r from-indigo-600 to-purple-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart size={32} className="fill-white" />
              <div>
                <h1 className="text-3xl font-bold">My Wishlist</h1>
                <p className="text-indigo-100 mt-1">{wishlistItems.length} items saved for later</p>
              </div>
            </div>
            <button
              onClick={shareWishlist}
              className="hidden sm:flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-colors"
            >
              <Share2 size={18} />
              Share Wishlist
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Heart size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">Save your favorite items and never lose track of what you love!</p>
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium">
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Wishlist Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Action Bar */}
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <p className="text-gray-600">
                    <span className="font-semibold text-gray-800">{wishlistItems.filter(item => item.inStock).length}</span> items available
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={shareWishlist}
                      className="sm:hidden flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      <Share2 size={18} />
                      Share
                    </button>
                    <button
                      onClick={addAllToCart}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                    >
                      <ShoppingCart size={18} />
                      Add All to Cart
                    </button>
                  </div>
                </div>
              </div>

              {/* Wishlist Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {wishlistItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden"
                  >
                    <div className="relative">
                      <div className="bg-linear-to-br from-gray-100 to-gray-200 h-48 flex items-center justify-center text-6xl">
                        {item.image}
                      </div>
                      {item.discount > 0 && (
                        <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          -{item.discount}%
                        </div>
                      )}
                      {!item.inStock && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold">
                            Out of Stock
                          </span>
                        </div>
                      )}
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="absolute top-3 left-3 bg-white p-2 rounded-full hover:bg-red-50 transition-colors"
                      >
                        <X size={18} className="text-red-500" />
                      </button>
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-gray-500 mb-1">{item.category}</p>
                      <h3 className="font-semibold text-gray-800 mb-2">{item.name}</h3>
                      <div className="flex items-center gap-1 mb-3">
                        <Star size={16} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-medium text-gray-700">{item.rating}</span>
                        <span className="text-sm text-gray-500">({item.reviews})</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-indigo-600">
                            ${item.discount > 0 ? (item.price * (1 - item.discount / 100)).toFixed(2) : item.price.toFixed(2)}
                          </span>
                          {item.discount > 0 && (
                            <span className="text-sm text-gray-500 line-through ml-2">
                              ${item.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => addToCart(item.id)}
                          disabled={!item.inStock}
                          className={`px-4 py-2 rounded-lg transition-colors font-medium flex items-center gap-2 ${
                            item.inStock
                              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          <ShoppingCart size={18} />
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Wishlist Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Wishlist Summary</h2>

                {/* Stats */}
                <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Items</span>
                    <span className="font-semibold text-gray-800">{wishlistItems.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Value</span>
                    <span className="font-semibold text-gray-800">${totalValue.toFixed(2)}</span>
                  </div>
                  {totalSavings > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 flex items-center gap-1">
                        <Tag size={16} className="text-green-500" />
                        Potential Savings
                      </span>
                      <span className="font-semibold text-green-600">${totalSavings.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">In Stock</span>
                    <span className="font-semibold text-green-600">
                      {wishlistItems.filter(item => item.inStock).length}
                    </span>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-3 mb-6">
                  <button
                    onClick={addAllToCart}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={20} />
                    Add All to Cart
                  </button>
                  <button
                    onClick={shareWishlist}
                    className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold flex items-center justify-center gap-2"
                  >
                    <Share2 size={20} />
                    Share Wishlist
                  </button>
                </div>

                {/* Tips */}
                <div className="bg-indigo-50 rounded-lg p-4">
                  <h3 className="font-semibold text-indigo-900 mb-3">💡 Wishlist Tips</h3>
                  <ul className="space-y-2 text-sm text-indigo-800">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 mt-0.5">•</span>
                      <span>Items with discounts won't last long!</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 mt-0.5">•</span>
                      <span>We'll notify you of price drops</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 mt-0.5">•</span>
                      <span>Share your wishlist with friends</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}