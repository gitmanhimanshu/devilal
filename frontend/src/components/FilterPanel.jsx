import React, { useState, useEffect } from 'react';
import { productAPI } from '../services/api';

const FilterPanel = ({ filters, onFilterChange, isAlwaysVisible = false }) => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const [categoriesRes, brandsRes] = await Promise.all([
          productAPI.getCategories(),
          productAPI.getBrands()
        ]);

        if (categoriesRes.data.success) {
          setCategories(categoriesRes.data.data);
        }
        if (brandsRes.data.success) {
          setBrands(brandsRes.data.data);
        }
      } catch (error) {
        console.error('Error loading filter options:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFilterOptions();
  }, []);

  const handleFilterChange = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFilterChange({
      search: '',
      category: 'all',
      brand: 'all',
      minPrice: '',
      maxPrice: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${isAlwaysVisible ? '' : 'lg:sticky lg:top-4'}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Clear All
        </button>
      </div>

      <div className={`${isAlwaysVisible ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4' : 'space-y-6'}`}>
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Brand Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brand
          </label>
          <select
            value={filters.brand}
            onChange={(e) => handleFilterChange('brand', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Brands</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <input
                type="number"
                placeholder="Min"
                min="0"
                step="0.01"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <input
                type="number"
                placeholder="Max"
                min="0"
                step="0.01"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Featured Products */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.featured === 'true'}
              onChange={(e) => handleFilterChange('featured', e.target.checked ? 'true' : '')}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Featured Products Only</span>
          </label>
        </div>

        {/* In Stock Filter */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.inStock === 'true'}
              onChange={(e) => handleFilterChange('inStock', e.target.checked ? 'true' : '')}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">In Stock Only</span>
          </label>
        </div>

        {/* Price Range Presets */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quick Price Filters
          </label>
          <div className="space-y-2">
            <button
              onClick={() => {
                handleFilterChange('minPrice', '');
                handleFilterChange('maxPrice', '100');
              }}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors duration-200"
            >
              Under $100
            </button>
            <button
              onClick={() => {
                handleFilterChange('minPrice', '100');
                handleFilterChange('maxPrice', '300');
              }}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors duration-200"
            >
              $100 - $300
            </button>
            <button
              onClick={() => {
                handleFilterChange('minPrice', '300');
                handleFilterChange('maxPrice', '500');
              }}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors duration-200"
            >
              $300 - $500
            </button>
            <button
              onClick={() => {
                handleFilterChange('minPrice', '500');
                handleFilterChange('maxPrice', '');
              }}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors duration-200"
            >
              Over $500
            </button>
          </div>
        </div>

        {/* Active Filters Summary */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Active Filters
          </label>
          <div className="space-y-1">
            {filters.category !== 'all' && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Category:</span>
                <span className="font-medium text-gray-900">
                  {filters.category.charAt(0).toUpperCase() + filters.category.slice(1)}
                </span>
              </div>
            )}
            {filters.brand !== 'all' && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Brand:</span>
                <span className="font-medium text-gray-900">{filters.brand}</span>
              </div>
            )}
            {(filters.minPrice || filters.maxPrice) && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Price:</span>
                <span className="font-medium text-gray-900">
                  ${filters.minPrice || '0'} - ${filters.maxPrice || '∞'}
                </span>
              </div>
            )}
            {filters.featured === 'true' && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Featured:</span>
                <span className="font-medium text-gray-900">Yes</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;