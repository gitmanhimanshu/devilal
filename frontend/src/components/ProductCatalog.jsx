import React, { useState, useEffect } from 'react';
import { productAPI } from '../services/api';
import { authService } from '../services/auth';
import { Search, Filter, Plus, Grid, List, User, LogOut } from 'lucide-react';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import FilterPanel from './FilterPanel';
import Pagination from './Pagination';
import ImageModal from './ImageModal';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  
  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12
  });

  // Filter and search state
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    brand: 'all',
    minPrice: '',
    maxPrice: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'view'
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Filter panel state
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Image modal state
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState({ url: '', name: '' });

  // Authentication state
  const [user, setUser] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Load products
  const loadProducts = async (page = 1, newFilters = filters) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page,
        limit: pagination.itemsPerPage,
        ...newFilters
      };

      // Remove empty filter values
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === 'all') {
          delete params[key];
        }
      });

      const response = await productAPI.getProducts(params);
      
      if (response.data.success) {
        setProducts(response.data.data);
        setPagination(response.data.pagination);
      } else {
        setError('Failed to load products');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadProducts();
    // Check if user is logged in
    const storedUser = authService.getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  // Handle search
  const handleSearch = (searchTerm) => {
    const newFilters = { ...filters, search: searchTerm };
    setFilters(newFilters);
    loadProducts(1, newFilters);
  };

  // Handle filter change
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    loadProducts(1, newFilters);
  };

  // Handle page change
  const handlePageChange = (page) => {
    loadProducts(page);
  };

  // Handle product actions
  const handleAddProduct = () => {
    setSelectedProduct(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productAPI.deleteProduct(productId);
        loadProducts(pagination.currentPage);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete product');
      }
    }
  };

  const handleProductSave = async (productData) => {
    try {
      if (modalMode === 'add') {
        await productAPI.createProduct(productData);
      } else if (modalMode === 'edit') {
        await productAPI.updateProduct(selectedProduct._id, productData);
      }
      
      setIsModalOpen(false);
      loadProducts(pagination.currentPage);
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to save product');
    }
  };

  // Handle image click
  const handleImageClick = (imageUrl, productName) => {
    setSelectedImage({ url: imageUrl, name: productName });
    setIsImageModalOpen(true);
  };

  // Authentication handlers
  const handleLogin = async (credentials) => {
    const response = await authService.login(credentials);
    setUser(response.data.user);
    setIsLoginModalOpen(false);
  };

  const handleRegister = async (userData) => {
    const response = await authService.register(userData);
    setUser(response.data.user);
    setIsRegisterModalOpen(false);
  };

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
  };

  const handleSwitchToRegister = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  const handleSwitchToLogin = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <h1 className="text-2xl font-bold text-gray-900">
                {import.meta.env.VITE_APP_NAME || 'Devilal Shop'}
              </h1>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <User className="h-4 w-4 mr-1" />
                  Login
                </button>
                <button
                  onClick={() => setIsRegisterModalOpen(true)}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Login Required Message */}
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-blue-100 mb-6">
              <User className="h-12 w-12 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Devilal Shop</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-md">
              Please login or register to view our amazing products and start shopping!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <User className="h-5 w-5 mr-2" />
                Login to Continue
              </button>
              <button
                onClick={() => setIsRegisterModalOpen(true)}
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create New Account
              </button>
            </div>
          </div>
        </div>

        {/* Authentication Modals */}
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onSwitchToRegister={handleSwitchToRegister}
          onLogin={handleLogin}
        />

        <RegisterModal
          isOpen={isRegisterModalOpen}
          onClose={() => setIsRegisterModalOpen(false)}
          onSwitchToLogin={handleSwitchToLogin}
          onRegister={handleRegister}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Header */}
          <div className="flex items-center justify-between h-16 lg:hidden">
            <h1 className="text-xl font-bold text-gray-900">
              {import.meta.env.VITE_APP_NAME || 'Devilal Shop'}
            </h1>
            <button
              onClick={handleAddProduct}
              className="inline-flex items-center p-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                {import.meta.env.VITE_APP_NAME || 'Devilal Shop'}
              </h1>
            </div>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  value={filters.search}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {user && authService.isAdmin() && (
                <button
                  onClick={handleAddProduct}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </button>
              )}
              
              {user ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">Welcome, {user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <User className="h-4 w-4 mr-1" />
                    Login
                  </button>
                  <button
                    onClick={() => setIsRegisterModalOpen(true)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="lg:hidden pb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters Section - Toggleable */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Filter className="h-4 w-4 mr-2" />
              {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
          
          {isFilterOpen && (
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              isAlwaysVisible={false}
            />
          )}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                handleFilterChange({ ...filters, sortBy, sortOrder });
              }}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="price-asc">Price Low to High</option>
              <option value="price-desc">Price High to Low</option>
            </select>
          </div>

          <div className="flex items-center justify-between sm:justify-end space-x-2">
            <span className="text-sm text-gray-500">
              {pagination.totalItems} products
            </span>
            <div className="flex rounded-md shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 text-sm font-medium border ${
                  viewMode === 'grid'
                    ? 'bg-blue-50 border-blue-500 text-blue-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:text-gray-700'
                } rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 text-sm font-medium border-t border-r border-b ${
                  viewMode === 'list'
                    ? 'bg-blue-50 border-blue-500 text-blue-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:text-gray-700'
                } rounded-r-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 border border-red-300 rounded-md bg-red-50">
            <div className="text-sm text-red-800">{error}</div>
          </div>
        )}

        {/* Products Grid/List */}
        <div className="flex-1">
            {products.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg">No products found</div>
                <p className="text-gray-400 mt-2">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <>
                <div className={viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'
                  : 'space-y-4'
                }>
                  {products.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      viewMode={viewMode}
                      onEdit={handleEditProduct}
                      onDelete={handleDeleteProduct}
                      onView={handleViewProduct}
                      onImageClick={handleImageClick}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={pagination.currentPage}
                      totalPages={pagination.totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
        </div>
      </div>

      {/* Product Modal */}
      {isModalOpen && (
        <ProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          mode={modalMode}
          product={selectedProduct}
          onSave={handleProductSave}
        />
      )}

      {/* Image Modal */}
      {isImageModalOpen && (
        <ImageModal
          isOpen={isImageModalOpen}
          onClose={() => setIsImageModalOpen(false)}
          imageUrl={selectedImage.url}
          productName={selectedImage.name}
        />
      )}

      {/* Authentication Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToRegister={handleSwitchToRegister}
        onLogin={handleLogin}
      />

      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSwitchToLogin={handleSwitchToLogin}
        onRegister={handleRegister}
      />
    </div>
  );
};

export default ProductCatalog;