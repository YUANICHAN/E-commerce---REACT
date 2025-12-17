import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Footer from '../../Components/Users/Footer.jsx';
import { userAPI, orderAPI, addressAPI, paymentMethodAPI, wishlistAPI, authAPI } from '../../Services/api.js';
import { User, ShoppingBag, Heart, MapPin, CreditCard, Bell, Shield, LogOut, Edit2, Save, X, Package, Clock, Star, Settings, ChevronRight, Plus, Trash2 } from 'lucide-react';

export default function Account() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    zipcode: '',
    status: 'Active'
  });
  const [editData, setEditData] = useState({ ...profileData });
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressFormData, setAddressFormData] = useState({
    type: 'Home',
    name: '',
    address: '',
    city: '',
    state: '',
    zipcode: '',
    phone: '',
    country: '',
    is_default: false
  });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [paymentFormData, setPaymentFormData] = useState({
    type: 'Visa',
    last4: '',
    expiry: '',
    holder_name: '',
    is_default: false
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      console.log('Fetching all data...');
      
      const [userRes, ordersRes, addressesRes, paymentsRes, wishlistRes] = await Promise.all([
        userAPI.getCurrentUser().catch(err => {
          console.error('User fetch error:', err);
          return { success: false, data: null };
        }),
        orderAPI.getUserOrders().catch(err => {
          console.error('Orders fetch error:', err);
          return { success: false, data: [] };
        }),
        addressAPI.getUserAddresses().catch(err => {
          console.error('Addresses fetch error:', err);
          return { success: false, data: [] };
        }),
        paymentMethodAPI.getUserPaymentMethods().catch(err => {
          console.error('Payments fetch error:', err);
          return { success: false, data: [] };
        }),
        wishlistAPI.getUserWishlist().catch(err => {
          console.error('Wishlist fetch error:', err);
          return { success: false, data: [] };
        })
      ]);

      console.log('User response:', userRes);
      
      if (userRes?.success && userRes?.data) {
        console.log('Setting profile data:', userRes.data);
        setProfileData(userRes.data);
        setEditData(userRes.data);
      } else {
        console.log('User data not available');
      }
      
      if (ordersRes?.success) setOrders(ordersRes.data || []);
      if (addressesRes?.success) setAddresses(addressesRes.data || []);
      if (paymentsRes?.success) setPaymentMethods(paymentsRes.data || []);
      if (wishlistRes?.success) {
        setWishlistItems(wishlistRes.data || []);
        setWishlistCount(wishlistRes.count || 0);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load account data. Please try again.',
        confirmButtonColor: '#DC2626',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...profileData });
  };

  const handleSave = async () => {
    try {
      // If id doesn't exist, get it from the session
      const id = profileData.id || Session?.get?.('user_id');
      if (!id) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'User ID not found. Please log in again.',
          confirmButtonColor: '#DC2626',
        });
        return;
      }

      const res = await userAPI.update(id, editData);
      if (res.success) {
        setProfileData(res.data || editData);
        setIsEditing(false);
        Swal.fire({
          icon: 'success',
          title: 'Profile updated',
          text: 'Your profile has been updated successfully.',
          confirmButtonColor: '#4F46E5',
        });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Update failed',
        text: err.message || 'Failed to update profile.',
        confirmButtonColor: '#DC2626',
      });
    }
  };

  const handleCancel = () => {
    setEditData({ ...profileData });
    setIsEditing(false);
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setAddressFormData({
      type: 'Home',
      name: '',
      address: '',
      city: '',
      state: '',
      zipcode: '',
      phone: '',
      country: '',
      is_default: addresses.length === 0
    });
    setShowAddressModal(true);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setAddressFormData(address);
    setShowAddressModal(true);
  };

  const handleSaveAddress = async () => {
    try {
      if (!addressFormData.name || !addressFormData.address || !addressFormData.city || !addressFormData.zipcode) {
        Swal.fire({
          icon: 'warning',
          title: 'Missing fields',
          text: 'Please fill in all required fields.',
          confirmButtonColor: '#DC2626',
        });
        return;
      }

      let res;
      if (editingAddress) {
        res = await addressAPI.update(editingAddress.id, addressFormData);
      } else {
        res = await addressAPI.create(addressFormData);
      }

      if (res.success) {
        setShowAddressModal(false);
        fetchAllData();
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: editingAddress ? 'Address updated successfully.' : 'Address added successfully.',
          confirmButtonColor: '#4F46E5',
          timer: 1500
        });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message || 'Failed to save address.',
        confirmButtonColor: '#DC2626',
      });
    }
  };

  const handleDeleteAddress = async (id) => {
    const result = await Swal.fire({
      title: 'Delete address?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DC2626',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        const res = await addressAPI.remove(id);
        if (res.success) {
          fetchAllData();
          Swal.fire({
            icon: 'success',
            title: 'Deleted',
            text: 'Address deleted successfully.',
            confirmButtonColor: '#4F46E5',
            timer: 1500
          });
        }
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete address.',
          confirmButtonColor: '#DC2626',
        });
      }
    }
  };

  const handleDeletePaymentMethod = async (id) => {
    const result = await Swal.fire({
      title: 'Delete payment method?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DC2626',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        const res = await paymentMethodAPI.remove(id);
        if (res.success) {
          fetchAllData();
          Swal.fire({
            icon: 'success',
            title: 'Deleted',
            text: 'Payment method deleted successfully.',
            confirmButtonColor: '#4F46E5',
            timer: 1500
          });
        }
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete payment method.',
          confirmButtonColor: '#DC2626',
        });
      }
    }
  };

  const handleAddPaymentMethod = () => {
    setEditingPayment(null);
    setPaymentFormData({
      type: 'Visa',
      last4: '',
      expiry: '',
      holder_name: '',
      is_default: paymentMethods.length === 0
    });
    setShowPaymentModal(true);
  };

  const handleEditPaymentMethod = (payment) => {
    setEditingPayment(payment);
    setPaymentFormData(payment);
    setShowPaymentModal(true);
  };

  const handleSavePaymentMethod = async () => {
    try {
      if (!paymentFormData.last4 || !paymentFormData.expiry || !paymentFormData.holder_name) {
        Swal.fire({
          icon: 'warning',
          title: 'Missing fields',
          text: 'Please fill in all required fields.',
          confirmButtonColor: '#DC2626',
        });
        return;
      }

      let res;
      if (editingPayment) {
        res = await paymentMethodAPI.update(editingPayment.id, paymentFormData);
      } else {
        res = await paymentMethodAPI.create(paymentFormData);
      }

      if (res.success) {
        setShowPaymentModal(false);
        fetchAllData();
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: editingPayment ? 'Payment method updated successfully.' : 'Payment method added successfully.',
          confirmButtonColor: '#4F46E5',
          timer: 1500
        });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message || 'Failed to save payment method.',
        confirmButtonColor: '#DC2626',
      });
    }
  };

  const handleSetDefaultPayment = async (id) => {
    try {
      const res = await paymentMethodAPI.setDefault(id);
      if (res.success) {
        fetchAllData();
        Swal.fire({
          icon: 'success',
          title: 'Default Updated',
          text: 'Payment method set as default.',
          confirmButtonColor: '#4F46E5',
          timer: 1500
        });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to set default payment method.',
        confirmButtonColor: '#DC2626',
      });
    }
  };

  const handleRemoveFromWishlist = async (id) => {
    try {
      const res = await wishlistAPI.removeFromWishlist(id);
      if (res.success) {
        fetchAllData();
        Swal.fire({
          icon: 'success',
          title: 'Removed',
          text: 'Item removed from wishlist.',
          confirmButtonColor: '#4F46E5',
          timer: 1500
        });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to remove from wishlist.',
        confirmButtonColor: '#DC2626',
      });
    }
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Log out?',
      text: 'You will need to log in again to access your account.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DC2626',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Logout',
      cancelButtonText: 'Stay signed in',
      reverseButtons: true,
      focusCancel: true,
    });

    if (result.isConfirmed) {
      try {
        await authAPI.logout();
        await Swal.fire({
          icon: 'success',
          title: 'Logged out',
          text: 'You have been signed out successfully.',
          confirmButtonColor: '#4F46E5',
        });
        window.location.href = '/login';
      } catch (err) {
        console.error('Logout error:', err);
        window.location.href = '/login';
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'text-green-600 bg-green-100';
      case 'In Transit': return 'text-blue-600 bg-blue-100';
      case 'Processing': return 'text-yellow-600 bg-yellow-100';
      case 'Cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const displayAddresses = addresses.length > 0
    ? addresses
    : [{
        id: 'profile',
        type: 'Default',
        name: profileData.name || 'Your Name',
        address: profileData.address || 'No address on file',
        city: profileData.city || '',
        state: '',
        zipcode: profileData.zipcode || '',
        country: profileData.country || '',
        phone: profileData.phone || '',
        is_default: true,
      }];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const handleContinueShopping = () => {
    window.location.href = '/shop';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">ShopHub</h1>
            <button onClick={handleContinueShopping} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium">
              <ShoppingBag size={20} />
              Back to Shop
            </button>
          </div>
        </div>
      </header>

      {/* Page Header */}
      <div className="bg-linear-to-r from-indigo-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="bg-white bg-opacity-20 p-4 rounded-full">
              <User size={40} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">My Account</h1>
              <p className="text-indigo-100 mt-1">Manage your profile and preferences</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 sticky top-8">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-indigo-100 text-indigo-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <User size={20} />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'orders'
                      ? 'bg-indigo-100 text-indigo-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Package size={20} />
                  <span>Orders</span>
                </button>
                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'addresses'
                      ? 'bg-indigo-100 text-indigo-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <MapPin size={20} />
                  <span>Addresses</span>
                </button>
                <button
                  onClick={() => setActiveTab('payment')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'payment'
                      ? 'bg-indigo-100 text-indigo-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <CreditCard size={20} />
                  <span>Payment Methods</span>
                </button>
                <button
                  onClick={() => setActiveTab('wishlist')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'wishlist'
                      ? 'bg-indigo-100 text-indigo-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Heart size={20} />
                  <span>Wishlist</span>
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'settings'
                      ? 'bg-indigo-100 text-indigo-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Settings size={20} />
                  <span>Settings</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>
                  {!isEditing ? (
                    <button
                      onClick={handleEdit}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Edit2 size={18} />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Save size={18} />
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        <X size={18} />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={isEditing ? editData.name : profileData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={isEditing ? editData.email : profileData.email}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={isEditing ? editData.phone : profileData.phone}
                      onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input
                      type="text"
                      value={isEditing ? editData.address : profileData.address}
                      onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      value={isEditing ? editData.city : profileData.city}
                      onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                    <input
                      type="text"
                      value={isEditing ? editData.country : profileData.country}
                      onChange={(e) => setEditData({ ...editData, country: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code</label>
                    <input
                      type="text"
                      value={isEditing ? editData.zipcode : profileData.zipcode}
                      onChange={(e) => setEditData({ ...editData, zipcode: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                    />
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Statistics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-indigo-50 rounded-lg p-4 text-center">
                      <Package size={32} className="mx-auto text-indigo-600 mb-2" />
                      <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
                      <p className="text-sm text-gray-600">Total Orders</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 text-center">
                      <Heart size={32} className="mx-auto text-purple-600 mb-2" />
                      <p className="text-2xl font-bold text-gray-800">{wishlistCount}</p>
                      <p className="text-sm text-gray-600">Wishlist Items</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <Star size={32} className="mx-auto text-green-600 mb-2" />
                      <p className="text-2xl font-bold text-gray-800">4.8</p>
                      <p className="text-sm text-gray-600">Member Rating</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Order History</h2>
                <div className="space-y-4">
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                          <div>
                            <p className="font-semibold text-gray-800 text-lg">{order.order_number}</p>
                            <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                              <Clock size={16} />
                              {formatDate(order.created_at)}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                            <button className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
                              View Details
                              <ChevronRight size={18} />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                          <p className="text-gray-600">Order Total</p>
                          <p className="text-xl font-bold text-gray-800">${Number(order.total).toFixed(2)}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Package size={48} className="mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-600">No orders yet. Start shopping!</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Saved Addresses</h2>
                  <button 
                    onClick={handleAddAddress}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Plus size={20} />
                    Add New Address
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {displayAddresses.map((address) => {
                    const isProfileFallback = address.id === 'profile';
                    return (
                      <div key={address.id} className="border border-gray-200 rounded-lg p-6 relative">
                        {address.is_default && (
                          <span className="absolute top-4 right-4 bg-green-100 text-green-600 text-xs font-semibold px-3 py-1 rounded-full">
                            Default
                          </span>
                        )}
                        <div className="flex items-start gap-3 mb-4">
                          <MapPin size={24} className="text-indigo-600 shrink-0 mt-1" />
                          <div>
                            <p className="font-semibold text-gray-800 mb-1">{address.type}</p>
                            <p className="text-gray-700 font-medium">{address.name}</p>
                            <p className="text-gray-600 text-sm mt-2">{address.address}</p>
                            <p className="text-gray-600 text-sm">{address.city}{address.city && (address.state || address.zipcode) ? ',' : ''} {address.state} {address.zipcode}</p>
                            <p className="text-gray-600 text-sm">{address.country}</p>
                            {address.phone && <p className="text-gray-600 text-sm">{address.phone}</p>}
                            {isProfileFallback && !addresses.length && (
                              <p className="text-xs text-gray-500 mt-2">Default from your profile until you add an address.</p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 pt-4 border-t border-gray-200">
                          <button 
                            onClick={() => handleEditAddress(address)}
                            disabled={isProfileFallback}
                            className={`flex-1 px-4 py-2 border rounded-lg transition-colors ${isProfileFallback ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteAddress(address.id)}
                            disabled={isProfileFallback}
                            className={`flex-1 px-4 py-2 border rounded-lg transition-colors ${isProfileFallback ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50' : 'border-red-300 text-red-600 hover:bg-red-50'}`}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Payment Methods Tab */}
            {activeTab === 'payment' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Payment Methods</h2>
                  <button 
                    onClick={handleAddPaymentMethod}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Plus size={20} />
                    Add New Card
                  </button>
                </div>
                <div className="space-y-4">
                  {paymentMethods.length > 0 ? (
                    paymentMethods.map((method) => (
                      <div key={method.id} className="border border-gray-200 rounded-lg p-6 relative">
                        {method.is_default && (
                          <span className="absolute top-4 right-4 bg-green-100 text-green-600 text-xs font-semibold px-3 py-1 rounded-full">
                            Default
                          </span>
                        )}
                        <div className="flex items-center gap-4 mb-4">
                          <div className="bg-linear-to-br from-indigo-600 to-purple-600 rounded-lg p-3">
                            <CreditCard size={32} className="text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-lg">{method.type} •••• {method.last4}</p>
                            <p className="text-gray-600 text-sm">Expires {method.expiry}</p>
                            {method.holder_name && <p className="text-gray-600 text-sm">{method.holder_name}</p>}
                          </div>
                        </div>
                        <div className="flex gap-2 pt-4 border-t border-gray-200">
                          {!method.is_default && (
                            <button 
                              onClick={() => handleSetDefaultPayment(method.id)}
                              className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                            >
                              Set as Default
                            </button>
                          )}
                          <button 
                            onClick={() => handleDeletePaymentMethod(method.id)}
                            className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-1"
                          >
                            <Trash2 size={16} />
                            Remove
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <CreditCard size={48} className="mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-600">No payment methods saved yet.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">My Wishlist</h2>
                {wishlistItems.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistItems.map((item) => (
                      <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="bg-gray-200 h-48 flex items-center justify-center">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package size={48} className="text-gray-400" />
                          )}
                        </div>
                        <div className="p-4">
                          <p className="font-semibold text-gray-800 line-clamp-2">{item.name}</p>
                          <p className="text-indigo-600 font-bold text-lg mt-2">${Number(item.price).toFixed(2)}</p>
                          <div className="flex gap-2 mt-4">
                            <button className="flex-1 px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors text-sm">
                              Add to Cart
                            </button>
                            <button 
                              onClick={() => handleRemoveFromWishlist(item.id)}
                              className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart size={64} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-600 mb-4">Your wishlist is empty.</p>
                    <a href="/shop" className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                      Continue Shopping
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Account Settings</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between py-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <Bell size={24} className="text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-800">Email Notifications</p>
                        <p className="text-sm text-gray-600">Receive updates about your orders</p>
                      </div>
                    </div>
                    <label className="relative inline-block w-12 h-6">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-indigo-600 transition-colors"></div>
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between py-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <Shield size={24} className="text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-800">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-600">Add an extra layer of security</p>
                      </div>
                    </div>
                    <label className="relative inline-block w-12 h-6">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-indigo-600 transition-colors"></div>
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
                    </label>
                  </div>
                  <div className="pt-4">
                    <button className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-medium">
                      Delete Account
                    </button>
                    <p className="text-xs text-gray-500 text-center mt-2">This action cannot be undone</p>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select 
                  value={addressFormData.type} 
                  onChange={(e) => setAddressFormData({ ...addressFormData, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Home">Home</option>
                  <option value="Office">Office</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input 
                  type="text" 
                  value={addressFormData.name}
                  onChange={(e) => setAddressFormData({ ...addressFormData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                <input 
                  type="text" 
                  value={addressFormData.address}
                  onChange={(e) => setAddressFormData({ ...addressFormData, address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Street address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                <input 
                  type="text" 
                  value={addressFormData.city}
                  onChange={(e) => setAddressFormData({ ...addressFormData, city: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="City"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input 
                    type="text" 
                    value={addressFormData.state}
                    onChange={(e) => setAddressFormData({ ...addressFormData, state: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="State"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code *</label>
                  <input 
                    type="text" 
                    value={addressFormData.zipcode}
                    onChange={(e) => setAddressFormData({ ...addressFormData, zipcode: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Zip code"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input 
                  type="text" 
                  value={addressFormData.country}
                  onChange={(e) => setAddressFormData({ ...addressFormData, country: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Country"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input 
                  type="tel" 
                  value={addressFormData.phone}
                  onChange={(e) => setAddressFormData({ ...addressFormData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Phone number"
                />
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="is_default"
                  checked={addressFormData.is_default}
                  onChange={(e) => setAddressFormData({ ...addressFormData, is_default: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600"
                />
                <label htmlFor="is_default" className="text-sm text-gray-700">Set as default address</label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowAddressModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveAddress}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {editingAddress ? 'Update' : 'Add'} Address
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Method Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">{editingPayment ? 'Edit Payment Method' : 'Add New Payment Method'}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Card Type</label>
                <select 
                  value={paymentFormData.type} 
                  onChange={(e) => setPaymentFormData({ ...paymentFormData, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Visa">Visa</option>
                  <option value="Mastercard">Mastercard</option>
                  <option value="AmericanExpress">American Express</option>
                  <option value="Discover">Discover</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name *</label>
                <input 
                  type="text" 
                  value={paymentFormData.holder_name}
                  onChange={(e) => setPaymentFormData({ ...paymentFormData, holder_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Name on card"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last 4 Digits *</label>
                <input 
                  type="text" 
                  maxLength="4"
                  value={paymentFormData.last4}
                  onChange={(e) => setPaymentFormData({ ...paymentFormData, last4: e.target.value.replace(/\D/g, '') })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="1234"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date (MM/YY) *</label>
                <input 
                  type="text" 
                  maxLength="5"
                  value={paymentFormData.expiry}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, '');
                    if (value.length >= 2) {
                      value = value.slice(0, 2) + '/' + value.slice(2, 4);
                    }
                    setPaymentFormData({ ...paymentFormData, expiry: value });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="12/25"
                />
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="payment_default"
                  checked={paymentFormData.is_default}
                  onChange={(e) => setPaymentFormData({ ...paymentFormData, is_default: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600"
                />
                <label htmlFor="payment_default" className="text-sm text-gray-700">Set as default payment method</label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSavePaymentMethod}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {editingPayment ? 'Update' : 'Add'} Card
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
      
    </div>
  );
}