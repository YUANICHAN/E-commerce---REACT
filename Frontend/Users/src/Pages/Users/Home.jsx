import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Heart, Star, ShoppingCart, TrendingUp, Zap, Award } from 'lucide-react';
import Navbar from '../../Components/Users/Navbar.jsx';
import Footer from '../../Components/Users/Footer.jsx';
import { productAPI, categoryAPI, cartAPI } from '../../Services/api.js';

export default function Homepage() {

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  const handleAddToCart = async (productId) => {
    try {
      setLoading(true);
      const response = await cartAPI.addToCart({
        user_id: 1,
        product_id: productId,
        quantity: 1,
      });
      
      // Get product details for the alert
      const product = products.find(p => p.id === productId);
      
      setCartCount(prev => prev + 1);
      
      Swal.fire({
        icon: 'success',
        title: 'Added to Cart!',
        text: `${product?.name || 'Product'} has been added to your cart.`,
        confirmButtonColor: '#4F46E5',
        timer: 2000,
        showConfirmButton: true,
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to add to cart',
        text: err.message || 'Something went wrong. Please try again.',
        confirmButtonColor: '#DC2626',
      });
    } finally {
      setLoading(false);
      cartAPI.getCart().then(response => {
        if (response.data) {
          setCartCount(response.data.length);
        }
      }).catch(() => {});
    }
  }

  useEffect(() => {
    fetchProducts();
    fetCategories();
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll();
      console.log(response);
      if (response.success && response.data) {
        setProducts(response.data);
      }
    } catch (err) {
      setError(alert(err.message || 'Failed to fetch products'));
    } finally {
      setLoading(false);
    }
  }

  const fetCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      console.log(response);
      if(response.success && response.data) {
        setCategories(response.data);
      }
    } catch (err) {
      setError(alert(err.message || 'Failed to fetch categories'));
    } finally {
      setLoading(false);
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === null || selectedCategory === 'All' || product.category === selectedCategory;
    return matchesCategory;
  })
  
  // Placeholder function for the search bar in Navbar
  const handleSearch = (searchTerm) => {
    console.log("Searching for:", searchTerm);
    // In a real app, this would trigger a search API call
  };

  const handleShop = () => {
    window.location.href = '/shop';
  }

  // Map category names to icons and colors
  const categoryIcons = {
    'Electronics': { icon: '💻', color: 'bg-blue-100 text-blue-600' },
    'Fashion': { icon: '👕', color: 'bg-pink-100 text-pink-600' },
    'Home & Living': { icon: '🏠', color: 'bg-green-100 text-green-600' },
    'Sports': { icon: '⚽', color: 'bg-orange-100 text-orange-600' },
    'Books': { icon: '📚', color: 'bg-purple-100 text-purple-600' },
    'Beauty': { icon: '💄', color: 'bg-red-100 text-red-600' },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar cartCount={cartCount} onSearch={handleSearch} />

      <section className="bg-linear-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-4">
              Discover Amazing Deals
            </h1>
            <p className="text-xl mb-8 text-indigo-100">
              Shop the latest trends with up to 50% off on selected items
            </p>
            <button onClick={handleShop} className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors shadow-lg">
              Shop Now
            </button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`p-6 rounded-xl hover:shadow-lg transition-all hover:scale-105 text-center ${
              selectedCategory === null ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <div className="text-4xl mb-2">✨</div>
            <div className="font-semibold text-sm">All</div>
          </button>
          {categories.map((category) => {
            const categoryName = category.name || category;
            const { icon, color } = categoryIcons[categoryName] || { icon: '📦', color: 'bg-gray-100 text-gray-600' };
            const isSelected = selectedCategory === categoryName;
            return (
              <button
                key={categoryName}
                onClick={() => setSelectedCategory(categoryName)}
                className={`p-6 rounded-xl hover:shadow-lg transition-all hover:scale-105 ${
                  isSelected ? 'ring-2 ring-indigo-600 shadow-lg' : color
                }`}
              >
                <div className="text-4xl mb-2 text-center">{icon}</div>
                <div className="font-semibold text-center text-sm">{categoryName}</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Featured Products</h2>
          <button className="text-indigo-600 font-semibold hover:text-indigo-700">
            View All →
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-105 overflow-hidden"
            >
              <div className="relative">
                <img src={product.image} alt={product.name} className='h-48 w-full object-cover' />
                <button className="absolute top-3 left-3 bg-white p-2 rounded-full hover:bg-red-50 transition-colors">
                  <Heart size={18} className="text-gray-600 hover:text-red-500" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2">{product.name}</h3>
                <div className="flex items-center gap-1 mb-3">
                  <Star size={16} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-medium text-gray-700">{product.rating}</span>
                  <span className="text-sm text-gray-500">(256 reviews)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-indigo-600">
                    ${product.price}
                  </span>
                  <button
                    onClick={() => handleAddToCart(product.id)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="bg-indigo-100 p-3 rounded-lg">
                <Zap className="text-indigo-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-2">Fast Delivery</h3>
                <p className="text-gray-600 text-sm">Get your orders delivered within 24-48 hours</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Award className="text-green-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-2">Quality Guarantee</h3>
                <p className="text-gray-600 text-sm">100% authentic products with warranty</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp className="text-purple-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-2">Best Prices</h3>
                <p className="text-gray-600 text-sm">Competitive pricing and exclusive deals</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}