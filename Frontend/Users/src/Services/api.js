import { use } from "react";

// API Configuration
const API_BASE_URL = 'http://localhost:8000/api';

// Fetch helper with error handling
const fetchAPI = async (endpoint, options = {}) => {
  try {
    const isFormData = options.body instanceof FormData;
    const headers = options.headers ? { ...options.headers } : {};

    if (!isFormData) {
      headers['Content-Type'] = headers['Content-Type'] || 'application/json';
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      credentials: 'include',
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API Error');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const userAPI = {
  getAllUsers: () => fetchAPI('/users', { method: 'GET' }),
  getCurrentUser: () => fetchAPI('/users/current', { method: 'GET' }),
  create: (user) => fetchAPI('/users', { method: 'POST', body: JSON.stringify(user) }),
  update: (id, user) => fetchAPI(`/users/${id}`, { method: 'PUT', body: JSON.stringify(user) }),
  remove: (id) => fetchAPI(`/users/${id}`, { method: 'DELETE' }),
};

export const productAPI = {
  getAll: () => fetchAPI('/products', { method: 'GET' }),
  create: (product) => fetchAPI('/products', { method: 'POST', body: JSON.stringify(product) }),
  update: (id, product) => fetchAPI(`/products/${id}`, { method: 'PUT', body: JSON.stringify(product) }),
  remove: (id) => fetchAPI(`/products/${id}`, { method: 'DELETE' }),
  upload: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return fetchAPI('/products/upload', { method: 'POST', body: formData });
  },
};

export const categoryAPI = {
  getAll: () => fetchAPI('/categories', { method: 'GET' }),
}

export const authAPI = {
  login: (credentials) => fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  logout: () => fetchAPI('/auth/logout', { method: 'POST', body: JSON.stringify({}) }),
};

export const cartAPI = {
  getCart: (userId) => fetchAPI(`/cart/${userId}`, { method: 'GET' }),
  addToCart: (item) => fetchAPI('/cart/add', { method: 'POST', body: JSON.stringify(item) }),
  updateCartItem: (payload) => fetchAPI('/cart/update', { method: 'PUT', body: JSON.stringify(payload) }),
  removeCartItem: (payload) => fetchAPI('/cart/remove', { method: 'DELETE', body: JSON.stringify(payload) }),
}

export const orderAPI = {
  getUserOrders: () => fetchAPI('/orders', { method: 'GET' }),
  getOrderDetails: (id) => fetchAPI(`/orders/${id}`, { method: 'GET' }),
};

export const addressAPI = {
  getUserAddresses: () => fetchAPI('/addresses', { method: 'GET' }),
  create: (address) => fetchAPI('/addresses', { method: 'POST', body: JSON.stringify(address) }),
  update: (id, address) => fetchAPI(`/addresses/${id}`, { method: 'PUT', body: JSON.stringify(address) }),
  remove: (id) => fetchAPI(`/addresses/${id}`, { method: 'DELETE' }),
};

export const paymentMethodAPI = {
  getUserPaymentMethods: () => fetchAPI('/payment-methods', { method: 'GET' }),
  create: (method) => fetchAPI('/payment-methods', { method: 'POST', body: JSON.stringify(method) }),
  update: (id, method) => fetchAPI(`/payment-methods/${id}`, { method: 'PUT', body: JSON.stringify(method) }),
  setDefault: (id) => fetchAPI(`/payment-methods/${id}/default`, { method: 'PUT', body: JSON.stringify({}) }),
  remove: (id) => fetchAPI(`/payment-methods/${id}`, { method: 'DELETE' }),
};

export const wishlistAPI = {
  getUserWishlist: () => fetchAPI('/wishlist', { method: 'GET' }),
  addToWishlist: (productId) => fetchAPI('/wishlist/add', { method: 'POST', body: JSON.stringify({ product_id: productId }) }),
  removeFromWishlist: (id) => fetchAPI(`/wishlist/${id}`, { method: 'DELETE' }),
};

export default fetchAPI;

