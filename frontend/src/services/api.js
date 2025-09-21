import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    
    // Add token to requests
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    // Handle token expiration
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Don't redirect automatically, let components handle it
    }
    
    return Promise.reject(error);
  }
);

// Product API methods
export const productAPI = {
  // Get all products with filters and pagination
  getProducts: (params = {}) => {
    return api.get('/products', { params });
  },

  // Get single product by ID
  getProduct: (id) => {
    return api.get(`/products/${id}`);
  },

  // Create new product
  createProduct: (productData) => {
    return api.post('/products', productData);
  },

  // Update existing product
  updateProduct: (id, productData) => {
    return api.put(`/products/${id}`, productData);
  },

  // Delete product
  deleteProduct: (id) => {
    return api.delete(`/products/${id}`);
  },

  // Get categories
  getCategories: () => {
    return api.get('/products/meta/categories');
  },

  // Get brands
  getBrands: () => {
    return api.get('/products/meta/brands');
  },
};

export default api;