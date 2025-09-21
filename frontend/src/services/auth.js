import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

// Create axios instance
const authAPI = axios.create({
  baseURL: `${API_URL}/auth`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
authAPI.interceptors.request.use(
  (config) => {
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

// Handle token expiration
authAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  // Register user
  register: async (userData) => {
    try {
      // Validate user type
      if (!userData.userType || !['user', 'admin'].includes(userData.userType)) {
        throw new Error('Please select a valid account type');
      }

      const response = await authAPI.post('/register', userData);
      
      if (response.data.success) {
        const { user, token } = response.data.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        return response.data;
      }
      throw new Error(response.data.message || 'Registration failed');
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Registration failed'
      );
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      // Validate user type
      if (!credentials.userType || !['user', 'admin'].includes(credentials.userType)) {
        throw new Error('Please select a valid account type');
      }

      const response = await authAPI.post('/login', credentials);
      
      if (response.data.success) {
        const { user, token } = response.data.data;
        
        // Validate that the logged-in user matches the selected type
        if (user.role !== credentials.userType) {
          throw new Error(`This account is registered as ${user.role}, not ${credentials.userType}. Please select the correct account type.`);
        }
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        return response.data;
      }
      throw new Error(response.data.message || 'Login failed');
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Login failed'
      );
    }
  },

  // Logout user
  logout: async () => {
    try {
      await authAPI.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await authAPI.get('/me');
      
      if (response.data.success) {
        const user = response.data.data.user;
        localStorage.setItem('user', JSON.stringify(user));
        return response.data;
      }
      throw new Error(response.data.message || 'Failed to get user');
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Failed to get user'
      );
    }
  },

  // Update profile
  updateProfile: async (userData) => {
    try {
      const response = await authAPI.put('/profile', userData);
      
      if (response.data.success) {
        const user = response.data.data.user;
        localStorage.setItem('user', JSON.stringify(user));
        return response.data;
      }
      throw new Error(response.data.message || 'Profile update failed');
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Profile update failed'
      );
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      const response = await authAPI.put('/password', passwordData);
      
      if (response.data.success) {
        return response.data;
      }
      throw new Error(response.data.message || 'Password change failed');
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Password change failed'
      );
    }
  },

  // Get stored user
  getStoredUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error getting stored user:', error);
      return null;
    }
  },

  // Get stored token
  getStoredToken: () => {
    return localStorage.getItem('token');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  // Check if user is admin
  isAdmin: () => {
    const user = authService.getStoredUser();
    return user && user.role === 'admin';
  }
};

export default authService;
