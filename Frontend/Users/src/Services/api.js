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

export default fetchAPI;

