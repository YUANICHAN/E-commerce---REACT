import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Star, Clock, Zap, TrendingUp, ArrowLeft, Flame } from 'lucide-react';
import Footer from '../../Components/Users/Footer.jsx';

export default function TodaysDeals() {
  const [cartCount, setCartCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30
  });

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const deals = [
    { 
      id: 1, 
      name: 'Premium Wireless Headphones', 
      originalPrice: 299.99, 
      dealPrice: 179.99, 
      discount: 40,
      rating: 4.8, 
      reviews: 256, 
      image: '🎧', 
      category: 'Electronics',
      stockLeft: 12,
      soldCount: 145,
      featured: true,
      badge: 'Lightning Deal'
    },
    { 
      id: 2, 
      name: 'Smart Fitness Watch', 
      originalPrice: 199.99, 
      dealPrice: 129.99, 
      discount: 35,
      rating: 4.6, 
      reviews: 189, 
      image: '⌚', 
      category: 'Electronics',
      stockLeft: 8,
      soldCount: 234,
      featured: false,
      badge: 'Hot Deal'
    },
    { 
      id: 3, 
      name: 'Ultra HD Camera', 
      originalPrice: 899.99, 
      dealPrice: 629.99, 
      discount: 30,
      rating: 4.9, 
      reviews: 412, 
      image: '📷', 
      category: 'Electronics',
      stockLeft: 5,
      soldCount: 89,
      featured: true,
      badge: 'Limited Stock'
    },
    { 
      id: 4, 
      name: 'Portable Bluetooth Speaker', 
      originalPrice: 79.99, 
      dealPrice: 39.99, 
      discount: 50,
      rating: 4.7, 
      reviews: 324, 
      image: '🔊', 
      category: 'Electronics',
      stockLeft: 25,
      soldCount: 567,
      featured: false,
      badge: 'Best Seller'
    },
    { 
      id: 5, 
      name: 'Designer Leather Jacket', 
      originalPrice: 349.99, 
      dealPrice: 209.99, 
      discount: 40,
      rating: 4.5, 
      reviews: 145, 
      image: '🧥', 
      category: 'Fashion',
      stockLeft: 15,
      soldCount: 178,
      featured: false,
      badge: 'Trending'
    },
    { 
      id: 6, 
      name: 'Running Shoes Pro', 
      originalPrice: 129.99, 
      dealPrice: 77.99, 
      discount: 40,
      rating: 4.8, 
      reviews: 567, 
      image: '👟', 
      category: 'Fashion',
      stockLeft: 20,
      soldCount: 423,
      featured: false,
      badge: 'Popular'
    },
    { 
      id: 7, 
      name: 'Gaming Keyboard RGB', 
      originalPrice: 149.99, 
      dealPrice: 89.99, 
      discount: 40,
      rating: 4.7, 
      reviews: 445, 
      image: '⌨️', 
      category: 'Electronics',
      stockLeft: 18,
      soldCount: 312,
      featured: true,
      badge: 'Flash Sale'
    },
    { 
      id: 8, 
      name: 'Coffee Maker Deluxe', 
      originalPrice: 159.99, 
      dealPrice: 99.99, 
      discount: 38,
      rating: 4.7, 
      reviews: 289, 
      image: '☕', 
      category: 'Home & Living',
      stockLeft: 10,
      soldCount: 267,
      featured: false,
      badge: 'Deal of the Day'
    },
  ];

  const addToCart = () => {
    setCartCount(cartCount + 1);
  };

  const featuredDeals = deals.filter(deal => deal.featured);
  const regularDeals = deals.filter(deal => !deal.featured);

  const handleContinueShopping = () => {
    window.location.href = '/shop';
  }

  const handleCartClick = () => {
    window.location.href = '/cart';
  }

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

      {/* Page Header with Countdown */}
      <div className="bg-linear-to-r from-red-600 via-orange-600 to-yellow-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Flame size={40} className="animate-pulse" />
              <h1 className="text-4xl md:text-5xl font-bold">Today's Hot Deals</h1>
              <Flame size={40} className="animate-pulse" />
            </div>
            <p className="text-yellow-100 text-lg mb-6">Massive discounts on your favorite products - Limited time only!</p>
            
            {/* Countdown Timer */}
            <div className="flex items-center justify-center gap-4 bg-opacity-20 rounded-xl p-6 max-w-2xl mx-auto">
              <Clock size={32} />
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="bg-white text-red-600 rounded-lg px-4 py-3 font-bold text-3xl min-w-[70px]">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </div>
                  <p className="text-sm mt-2">Hours</p>
                </div>
                <span className="text-4xl font-bold">:</span>
                <div className="text-center">
                  <div className="bg-white text-red-600 rounded-lg px-4 py-3 font-bold text-3xl min-w-[70px]">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </div>
                  <p className="text-sm mt-2">Minutes</p>
                </div>
                <span className="text-4xl font-bold">:</span>
                <div className="text-center">
                  <div className="bg-white text-red-600 rounded-lg px-4 py-3 font-bold text-3xl min-w-[70px]">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </div>
                  <p className="text-sm mt-2">Seconds</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Banner */}
        <div className="bg-linear-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-6 mb-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap size={24} className="text-yellow-300" />
                <p className="text-3xl font-bold">8</p>
              </div>
              <p className="text-indigo-100">Active Deals</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp size={24} className="text-green-300" />
                <p className="text-3xl font-bold">40%</p>
              </div>
              <p className="text-indigo-100">Max Discount</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star size={24} className="text-yellow-300 fill-yellow-300" />
                <p className="text-3xl font-bold">2.2K+</p>
              </div>
              <p className="text-indigo-100">Items Sold Today</p>
            </div>
          </div>
        </div>

        {/* Featured Lightning Deals */}
        {featuredDeals.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Zap size={32} className="text-yellow-500 fill-yellow-500" />
              <h2 className="text-3xl font-bold text-gray-800">Lightning Deals</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredDeals.map((deal) => (
                <div
                  key={deal.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all hover:scale-105 overflow-hidden border-2 border-yellow-400"
                >
                  <div className="relative">
                    <div className="bg-linear-to-br from-yellow-100 to-orange-100 h-56 flex items-center justify-center text-7xl">
                      {deal.image}
                    </div>
                    <div className="absolute top-3 right-3 bg-red-600 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                      -{deal.discount}%
                    </div>
                    <div className="absolute top-3 left-3 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full font-bold text-sm">
                      {deal.badge}
                    </div>
                    <button className="absolute bottom-3 right-3 bg-white p-2 rounded-full hover:bg-red-50 transition-colors shadow-lg">
                      <Heart size={20} className="text-gray-600 hover:text-red-500" />
                    </button>
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-gray-500 mb-1">{deal.category}</p>
                    <h3 className="font-bold text-gray-800 text-lg mb-2">{deal.name}</h3>
                    <div className="flex items-center gap-1 mb-3">
                      <Star size={16} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-medium text-gray-700">{deal.rating}</span>
                      <span className="text-sm text-gray-500">({deal.reviews})</span>
                    </div>
                    
                    {/* Stock Progress */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Only {deal.stockLeft} left!</span>
                        <span>{deal.soldCount} sold</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-600 h-2 rounded-full transition-all"
                          style={{ width: `${(deal.soldCount / (deal.soldCount + deal.stockLeft)) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-2xl font-bold text-red-600">
                          ${deal.dealPrice.toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-500 line-through ml-2">
                          ${deal.originalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={addToCart}
                      className="w-full bg-linear-to-r from-red-600 to-orange-600 text-white py-3 rounded-lg hover:from-red-700 hover:to-orange-700 transition-all font-semibold flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={18} />
                      Grab Deal Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* More Deals Today */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp size={32} className="text-indigo-600" />
            <h2 className="text-3xl font-bold text-gray-800">More Deals Today</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {regularDeals.map((deal) => (
              <div
                key={deal.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-105 overflow-hidden"
              >
                <div className="relative">
                  <div className="bg-linear-to-br from-gray-100 to-gray-200 h-48 flex items-center justify-center text-6xl">
                    {deal.image}
                  </div>
                  <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full font-bold">
                    -{deal.discount}%
                  </div>
                  <div className="absolute top-3 left-3 bg-indigo-600 text-white px-2 py-1 rounded-lg font-semibold text-xs">
                    {deal.badge}
                  </div>
                  <button className="absolute bottom-3 right-3 bg-white p-2 rounded-full hover:bg-red-50 transition-colors">
                    <Heart size={16} className="text-gray-600 hover:text-red-500" />
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-500 mb-1">{deal.category}</p>
                  <h3 className="font-semibold text-gray-800 mb-2">{deal.name}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-medium text-gray-700">{deal.rating}</span>
                    <span className="text-xs text-gray-500">({deal.reviews})</span>
                  </div>
                  
                  {/* Stock Indicator */}
                  <p className="text-xs text-orange-600 font-medium mb-3">
                    🔥 Only {deal.stockLeft} left
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-xl font-bold text-red-600">
                        ${deal.dealPrice.toFixed(2)}
                      </span>
                      <span className="text-xs text-gray-500 line-through ml-1 block">
                        ${deal.originalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={addToCart}
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={16} />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}