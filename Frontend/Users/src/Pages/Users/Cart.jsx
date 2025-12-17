import React, { useState, useEffect, use } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Tag, Truck } from 'lucide-react';
import Footer from '../../Components/Users/Footer.jsx';
import Swal from 'sweetalert2';
import { cartAPI } from '../../Services/api.js';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appliedPromo, setAppliedPromo] = useState(null);

  useEffect(() => {
    FetchCartItems();
  }, []);

  const FetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.getCart(1);
      console.log(response);
      if(response.success && response.data) {
        setCartItems(response.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch cart items');
    } finally {
      setLoading(false);
    }
  }

  const updateQuantity = async (id, change) => {
    const item = cartItems.find(i => i.id === id);
    if (!item) return;
    if (item.quantity === 1 && change === -1) {
      Swal.fire({
        icon: 'warning',
        title: 'Minimum quantity reached',
        text: 'Quantity cannot be less than 1. Remove the item instead.',
        confirmButtonColor: '#4F46E5',
      });
      return;
    }
    const newQty = Math.max(1, item.quantity + change);

    try {
      await cartAPI.updateCartItem({
        cart_id: id,
        user_id: 1,
        quantity: newQty,
      });
      setCartItems(items =>
        items.map(i => (i.id === id ? { ...i, quantity: newQty } : i))
      );
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Update failed',
        text: err.message || 'Unable to update quantity.',
        confirmButtonColor: '#DC2626',
      });
    }
  };

  const removeItem = async (id) => {
    const result = await Swal.fire({
      title: 'Remove this item?',
      text: 'This product will be removed from your cart.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DC2626',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Remove',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      focusCancel: true,
    });

    if (!result.isConfirmed) return;

    try {
      await cartAPI.removeCartItem({ cart_id: id, user_id: 1 });
      setCartItems(items => items.filter(item => item.id !== id));
      Swal.fire({
        icon: 'success',
        title: 'Removed',
        text: 'Item removed from your cart.',
        confirmButtonColor: '#4F46E5',
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Remove failed',
        text: err.message || 'Unable to remove item from cart.',
        confirmButtonColor: '#DC2626',
      });
    }
  };

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === 'SAVE10') {
      setAppliedPromo({ code: 'SAVE10', discount: 0.10 });
    } else if (promoCode.toUpperCase() === 'FREESHIP') {
      setAppliedPromo({ code: 'FREESHIP', discount: 0, freeShipping: true });
    } else {
      alert('Invalid promo code');
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const discount = appliedPromo?.discount ? subtotal * appliedPromo.discount : 0;
  const shipping = appliedPromo?.freeShipping ? 0 : 15.00;
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + shipping + tax;

  const handleContinueShopping = () => {
    window.location.href = '/shop';
  }

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Cart is Empty',
        text: 'Please add items to your cart before proceeding to checkout.',
        confirmButtonColor: '#4F46E5',
      });
      return;
    }
    // Store cart summary in sessionStorage for checkout page
    sessionStorage.setItem('checkoutData', JSON.stringify({
      cartItems,
      subtotal,
      discount,
      shipping,
      tax,
      total,
      appliedPromo
    }));
    window.location.href = '/checkout';
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">ShopHub</h1>
            <button onClick={handleContinueShopping} className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium">
              <ArrowLeft size={20} />
              Continue Shopping
            </button>
          </div>
        </div>
      </header>

      {/* Page Header */}
      <div className="bg-linear-to-r from-indigo-600 to-purple-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <ShoppingBag size={32} />
            <div>
              <h1 className="text-3xl font-bold">Shopping Cart</h1>
              <p className="text-indigo-100 mt-1">{cartItems.length} items in your cart</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some products to get started!</p>
            <button onClick={handleContinueShopping} className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium">
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex gap-6">
                    <img src={item.image_url} className='h-24 w-24 bg-cover rounded-lg' alt={item.name} />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">{item.category}</p>
                          <h3 className="font-semibold text-gray-800 text-lg">{item.name}</h3>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-2"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-2 hover:bg-white rounded-md transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="font-semibold text-gray-800 w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-2 hover:bg-white rounded-md transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-indigo-600">
                            ${(Number(item.price) * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">
                            ${Number(item.price).toFixed(2)} each
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>

                {/* Promo Code */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Promo Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      onClick={applyPromoCode}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                      Apply
                    </button>
                  </div>
                  {appliedPromo && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                      <Tag size={16} />
                      <span>Code "{appliedPromo.code}" applied!</span>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Try: SAVE10 or FREESHIP
                  </p>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span className="flex items-center gap-1">
                      <Truck size={16} />
                      Shipping
                    </span>
                    <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-bold text-gray-800">Total</span>
                  <span className="text-2xl font-bold text-indigo-600">
                    ${total.toFixed(2)}
                  </span>
                </div>

                {/* Checkout Button */}
                <button 
                  onClick={handleProceedToCheckout}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-lg mb-3"
                >
                  Proceed to Checkout
                </button>

                {/* Security Badge */}
                <div className="text-center text-sm text-gray-500">
                  <p>🔒 Secure checkout powered by Stripe</p>
                </div>

                {/* Benefits */}
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                  <div className="flex items-start gap-3 text-sm">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span className="text-gray-600">Free shipping on orders over $100</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span className="text-gray-600">30-day money-back guarantee</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span className="text-gray-600">24/7 customer support</span>
                  </div>
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