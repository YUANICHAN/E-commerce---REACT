import React, { useState, useEffect } from 'react';
import { ArrowLeft, CreditCard, MapPin, User, Mail, Phone, Lock, ShoppingBag, CheckCircle, Package } from 'lucide-react';
import Footer from '../../Components/Users/Footer.jsx';
import Swal from 'sweetalert2';
import { paymentAPI, userAPI, addressAPI, paymentMethodAPI } from '../../Services/api.js';

export default function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [savedPaymentMethods, setSavedPaymentMethods] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [paymentMethodType, setPaymentMethodType] = useState('card'); // 'card' or 'cod'
  const [formData, setFormData] = useState({
    // Contact Information
    email: '',
    phone: '',
    
    // Shipping Address
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'Philippines',
    
    // Payment Information
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    
    // Additional
    saveInfo: false,
    billingAddressSame: true,
  });

  const [appliedPromo, setAppliedPromo] = useState(null);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);

  // Fetch user data, addresses, and payment methods on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        console.log('Fetching checkout user data...');
        
        // Fetch all data in parallel like Account page
        const [userRes, addressesRes, paymentsRes] = await Promise.all([
          userAPI.getCurrentUser().catch(err => {
            console.error('User fetch error:', err);
            return { success: false, data: null };
          }),
          addressAPI.getUserAddresses().catch(err => {
            console.error('Addresses fetch error:', err);
            return { success: false, data: [] };
          }),
          paymentMethodAPI.getUserPaymentMethods().catch(err => {
            console.error('Payments fetch error:', err);
            return { success: false, data: [] };
          })
        ]);

        console.log('User response:', userRes);
        console.log('Addresses response:', addressesRes);
        console.log('Payments response:', paymentsRes);

        // Handle user profile data
        if (userRes?.success && userRes?.data) {
          const user = userRes.data;
          console.log('Setting user data:', user);
          
          // Split name into firstName and lastName
          const nameParts = (user.name || '').split(' ');
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';
          
          // Pre-fill form with user data
          setFormData(prev => ({
            ...prev,
            email: user.email || '',
            phone: user.phone || '',
            firstName: firstName,
            lastName: lastName,
            address: user.address || '',
            city: user.city || '',
            zipCode: user.zipcode || '',
            country: user.country || 'Philippines',
          }));
        } else {
          console.log('No user data available');
        }

        // Handle saved addresses
        if (addressesRes?.success && addressesRes?.data) {
          console.log('Setting addresses:', addressesRes.data);
          setSavedAddresses(addressesRes.data);
          
          // Auto-select default address if available
          const defaultAddress = addressesRes.data.find(addr => addr.is_default);
          if (defaultAddress) {
            console.log('Auto-selecting default address:', defaultAddress);
            setSelectedAddressId(defaultAddress.id);
            populateAddressFields(defaultAddress);
          }
        } else {
          console.log('No saved addresses');
        }

        // Handle saved payment methods
        if (paymentsRes?.success && paymentsRes?.data) {
          console.log('Setting payment methods:', paymentsRes.data);
          setSavedPaymentMethods(paymentsRes.data);
          
          // Auto-select default payment method if available
          const defaultPayment = paymentsRes.data.find(pm => pm.is_default);
          if (defaultPayment) {
            console.log('Auto-selecting default payment:', defaultPayment);
            setSelectedPaymentId(defaultPayment.id);
            populatePaymentFields(defaultPayment);
          }
        } else {
          console.log('No saved payment methods');
        }
      } catch (error) {
        console.error('Error fetching checkout data:', error);
        // Continue with empty form - not a critical error
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Load cart data from sessionStorage
  useEffect(() => {
    const checkoutData = sessionStorage.getItem('checkoutData');
    if (checkoutData) {
      const data = JSON.parse(checkoutData);
      setCartItems(data.cartItems || []);
      setSubtotal(data.subtotal || 0);
      setDiscount(data.discount || 0);
      setShipping(data.shipping || 0);
      setTax(data.tax || 0);
      setTotal(data.total || 0);
      setAppliedPromo(data.appliedPromo || null);
    } else {
      // Fallback to mock cart if no data in sessionStorage
      const mockCart = [
        { id: 1, name: 'Premium Wireless Headphones', price: 299.99, quantity: 1, category: 'Electronics', image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200', product_id: 1 },
        { id: 2, name: 'Smart Watch Series 5', price: 399.99, quantity: 1, category: 'Electronics', image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200', product_id: 2 },
      ];
      setCartItems(mockCart);
      const mockSubtotal = mockCart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
      setSubtotal(mockSubtotal);
      setShipping(mockSubtotal > 100 ? 0 : 15.00);
      const mockTax = mockSubtotal * 0.08;
      setTax(mockTax);
      setTotal(mockSubtotal + (mockSubtotal > 100 ? 0 : 15.00) + mockTax);
    }
  }, []);

  // Helper function to populate address fields
  const populateAddressFields = (address) => {
    const nameParts = (address.name || '').split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    setFormData(prev => ({
      ...prev,
      firstName: firstName,
      lastName: lastName,
      address: address.address || '',
      city: address.city || '',
      zipCode: address.zipcode || '',
      country: address.country || 'Philippines',
      phone: address.phone || prev.phone,
    }));
  };

  // Helper function to populate payment fields
  const populatePaymentFields = (payment) => {
    setFormData(prev => ({
      ...prev,
      cardName: payment.holder_name || '',
      cardNumber: '**** **** **** ' + payment.last4,
      expiryDate: payment.expiry || '',
      // CVV is never pre-filled for security reasons
      cvv: '',
    }));
  };

  // Handle address selection
  const handleAddressSelect = (addressId) => {
    setSelectedAddressId(addressId);
    const address = savedAddresses.find(addr => addr.id === addressId);
    if (address) {
      populateAddressFields(address);
    }
  };

  // Handle payment method selection
  const handlePaymentSelect = (paymentId) => {
    setSelectedPaymentId(paymentId);
    const payment = savedPaymentMethods.find(pm => pm.id === paymentId);
    if (payment) {
      populatePaymentFields(payment);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleBackToCart = () => {
    window.location.href = '/cart';
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.email || !formData.phone || !formData.firstName || !formData.lastName || 
        !formData.address || !formData.city || !formData.zipCode) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Information',
        text: 'Please fill in all required shipping information.',
        confirmButtonColor: '#DC2626',
      });
      return;
    }

    if (paymentMethodType === 'card') {
      if (!formData.cardNumber || !formData.cardName || !formData.expiryDate || !formData.cvv) {
        Swal.fire({
          icon: 'error',
          title: 'Missing Payment Information',
          text: 'Please fill in all payment details.',
          confirmButtonColor: '#DC2626',
        });
        return;
      }
    }

    // Show loading
    Swal.fire({
      title: 'Processing Payment...',
      text: 'Please wait while we process your order',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      // Prepare payment data
      const paymentData = {
        cartItems: cartItems,
        subtotal: subtotal,
        discount: discount,
        shipping: shipping,
        tax: tax,
        total: total,
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        billingAddress: formData.billingAddressSame ? {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
          country: formData.country,
        } : null,
        paymentMethod: paymentMethodType === 'cod' ? {
          type: 'Cash on Delivery',
        } : {
          type: 'Credit Card',
          cardNumber: formData.cardNumber,
          cardName: formData.cardName,
          expiryDate: formData.expiryDate,
          cvv: formData.cvv,
        },
      };

      // Call payment API
      const response = await paymentAPI.processPayment(paymentData);

      if (response.success) {
        // Clear checkout data from sessionStorage
        sessionStorage.removeItem('checkoutData');

        Swal.fire({
          icon: 'success',
          title: 'Order Placed Successfully!',
          html: `
            <div class="text-left">
              <p class="mb-2"><strong>Order ID:</strong> #${response.data.orderId}</p>
              <p class="mb-2"><strong>Transaction ID:</strong> ${response.data.transactionId}</p>
              <p class="mb-2"><strong>Amount:</strong> $${response.data.amount.toFixed(2)}</p>
              <p class="mb-2"><strong>Payment Status:</strong> <span class="text-green-600 font-semibold">${response.data.status.toUpperCase()}</span></p>
              <p class="text-sm text-gray-500 mt-4">A confirmation email has been sent to ${formData.email}</p>
            </div>
          `,
          confirmButtonColor: '#4F46E5',
          confirmButtonText: 'View Order Details',
          showCancelButton: true,
          cancelButtonText: 'Continue Shopping',
          cancelButtonColor: '#6B7280',
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = '/account';
          } else {
            window.location.href = '/shop';
          }
        });
      } else {
        throw new Error(response.message || 'Payment failed');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Payment Failed',
        text: error.message || 'Unable to process payment. Please try again.',
        confirmButtonColor: '#DC2626',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">ShopHub</h1>
            <button 
              onClick={handleBackToCart}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
            >
              <ArrowLeft size={20} />
              Back to Cart
            </button>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {step > 1 ? <CheckCircle size={20} /> : '1'}
              </div>
              <span className={`font-medium ${step >= 1 ? 'text-indigo-600' : 'text-gray-600'}`}>
                Information
              </span>
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {step > 2 ? <CheckCircle size={20} /> : '2'}
              </div>
              <span className={`font-medium ${step >= 2 ? 'text-indigo-600' : 'text-gray-600'}`}>
                Payment
              </span>
            </div>
            <div className={`w-16 h-1 ${step >= 3 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                3
              </div>
              <span className={`font-medium ${step >= 3 ? 'text-indigo-600' : 'text-gray-600'}`}>
                Review
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-gray-600">Loading your information...</span>
          </div>
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmitOrder} className="space-y-6">
              {/* Contact Information */}
              <div className="bg-white rounded-2xl shadow-md p-8">
                <div className="border-l-4 border-indigo-600 pl-4 mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Mail size={24} />
                    Contact Information
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">How can we reach you?</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                      placeholder="john.doe@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                      placeholder="09xxxxxxxxx"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-2xl shadow-md p-8">
                <div className="border-l-4 border-blue-600 pl-4 mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <MapPin size={24} />
                    Shipping Address
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">Where should we deliver your order?</p>
                </div>

                {/* Saved Addresses Section */}
                {savedAddresses.length > 0 && (
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Select a saved address or enter a new one
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                      {savedAddresses.map((address) => (
                        <div
                          key={address.id}
                          onClick={() => handleAddressSelect(address.id)}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedAddressId === address.id
                              ? 'border-indigo-500 bg-indigo-50'
                              : 'border-gray-200 hover:border-indigo-300'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-gray-900">{address.name}</p>
                                {address.is_default && (
                                  <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full font-medium">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{address.address}</p>
                              <p className="text-sm text-gray-600">
                                {address.city}, {address.zipcode} {address.country}
                              </p>
                              {address.phone && (
                                <p className="text-sm text-gray-500 mt-1">📱 {address.phone}</p>
                              )}
                            </div>
                            {selectedAddressId === address.id && (
                              <CheckCircle className="text-indigo-600" size={20} />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600 mb-3">
                        Or edit the information below
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                        placeholder="John"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Street Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                      placeholder="123 Main Street, Unit 4B"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                        placeholder="Cebu City"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Zip Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                        placeholder="6000"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Country <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none bg-white"
                        required
                      >
                        <option value="Philippines">Philippines</option>
                        <option value="USA">United States</option>
                        <option value="UK">United Kingdom</option>
                        <option value="Canada">Canada</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="saveInfo"
                        checked={formData.saveInfo}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">Save this information for next time</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white rounded-2xl shadow-md p-8">
                <div className="border-l-4 border-green-600 pl-4 mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <CreditCard size={24} />
                    Payment Information
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">All transactions are secure and encrypted</p>
                </div>

                {/* Payment Method Type Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Choose Payment Method
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethodType('card')}
                      className={`p-4 border-2 rounded-lg transition-all flex items-center justify-center gap-3 ${
                        paymentMethodType === 'card'
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 hover:border-green-300 text-gray-700'
                      }`}
                    >
                      <CreditCard size={24} />
                      <span className="font-semibold">Credit/Debit Card</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethodType('cod')}
                      className={`p-4 border-2 rounded-lg transition-all flex items-center justify-center gap-3 ${
                        paymentMethodType === 'cod'
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 hover:border-green-300 text-gray-700'
                      }`}
                    >
                      <Package size={24} />
                      <span className="font-semibold">Cash on Delivery</span>
                    </button>
                  </div>
                </div>

                {/* Cash on Delivery Message */}
                {paymentMethodType === 'cod' && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Package className="text-blue-600 mt-0.5" size={20} />
                      <div>
                        <p className="font-semibold text-blue-900">Cash on Delivery Selected</p>
                        <p className="text-sm text-blue-700 mt-1">
                          Pay with cash when your order is delivered. Please prepare the exact amount of <strong>${total.toFixed(2)}</strong>
                        </p>
                        <ul className="text-sm text-blue-600 mt-2 ml-4 list-disc">
                          <li>Payment accepted only in cash</li>
                          <li>Have exact change ready</li>
                          <li>Available for orders under $500</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Card Payment Section - Only show when card is selected */}
                {paymentMethodType === 'card' && (
                  <>
                    {/* Saved Payment Methods Section */}
                    {savedPaymentMethods.length > 0 && (
                      <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Select a saved payment method or enter a new one
                        </label>
                        <div className="grid grid-cols-1 gap-3">
                          {savedPaymentMethods.map((payment) => (
                            <div
                              key={payment.id}
                              onClick={() => handlePaymentSelect(payment.id)}
                              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                selectedPaymentId === payment.id
                                  ? 'border-green-500 bg-green-50'
                                  : 'border-gray-200 hover:border-green-300'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <CreditCard className="text-gray-600" size={24} />
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <p className="font-semibold text-gray-900">
                                        {payment.type} •••• {payment.last4}
                                      </p>
                                      {payment.is_default && (
                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                                          Default
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-sm text-gray-600">{payment.holder_name}</p>
                                    <p className="text-sm text-gray-500">Expires: {payment.expiry}</p>
                                  </div>
                                </div>
                                {selectedPaymentId === payment.id && (
                                  <CheckCircle className="text-green-600" size={20} />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-sm text-gray-600 mb-3">
                            Or enter new payment details below
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Card Input Fields - Only show when card payment is selected */}
                {paymentMethodType === 'card' && (
                  <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Card Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Name on Card <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                      placeholder="JOHN DOE"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Expiry Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                        placeholder="MM/YY"
                        maxLength="5"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        CVV <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                        placeholder="123"
                        maxLength="4"
                        required
                      />
                      {selectedPaymentId && (
                        <p className="text-xs text-gray-500 mt-1">
                          Required for security even when using saved card
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="bg-indigo-50 rounded-lg p-4 flex items-start gap-3">
                    <Lock size={20} className="text-indigo-600 mt-0.5" />
                    <div className="text-sm text-indigo-900">
                      <p className="font-semibold">Your payment is secure</p>
                      <p className="text-indigo-700 mt-1">We use industry-standard encryption to protect your information.</p>
                    </div>
                  </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-4 rounded-xl hover:from-indigo-700 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all font-semibold text-lg"
              >
                Complete Order
              </button>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <ShoppingBag size={24} />
                Order Summary
              </h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img 
                      src={item.image_url} 
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.category}</p>
                      <p className="text-sm text-gray-700 mt-1">
                        Qty: {item.quantity} × ${Number(item.price).toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ${(Number(item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? <span className="text-green-600">FREE</span> : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (8%)</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-3xl font-bold text-indigo-600">
                  ${total.toFixed(2)}
                </span>
              </div>

              {/* Benefits */}
              <div className="space-y-3 pt-6 border-t border-gray-200">
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
                  <span className="text-gray-600">Secure payment processing</span>
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