import React from 'react';
import { Heart, Edit, Trash2, Eye, Star } from 'lucide-react';

const ProductCard = ({ product, viewMode = 'grid', onEdit, onDelete, onView, onImageClick }) => {
  const {
    _id,
    name,
    description,
    price,
    originalPrice,
    category,
    brand,
    image,
    featured,
    rating,
    reviews,
    inStock
  } = product;

  const discountPercentage = originalPrice && originalPrice > price 
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(product);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(_id);
  };

  const handleView = () => {
    onView(product);
  };

  const handleImageClick = (e) => {
    e.stopPropagation();
    if (onImageClick) {
      onImageClick(image, name);
    }
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer group">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-shrink-0 mx-auto sm:mx-0">
            <img
              src={image}
              alt={name}
              className="h-20 w-20 sm:h-16 sm:w-16 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity duration-200"
              onClick={handleImageClick}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x300?text=Product+Image';
              }}
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-2 sm:space-y-0">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 truncate">{name}</h3>
                <p className="text-sm text-gray-500 mt-1">{brand} • {category}</p>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{description}</p>
                
                <div className="flex items-center mt-2">
                  {rating > 0 && (
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">
                        {rating} ({reviews} reviews)
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between sm:block sm:text-right">
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-gray-900">${price}</span>
                  {originalPrice && originalPrice > price && (
                    <span className="text-sm text-gray-500 line-through">${originalPrice}</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {discountPercentage > 0 && (
                    <span className="inline-block px-2 py-1 text-xs font-semibold text-red-600 bg-red-100 rounded-full">
                      {discountPercentage}% OFF
                    </span>
                  )}
                  {featured && (
                    <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full">
                      Featured
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-shrink-0">
            <div className="flex sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={handleView}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-200"
                title="View Details"
              >
                <Eye className="h-4 w-4" />
              </button>
              <button
                onClick={handleEdit}
                className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors duration-200"
                title="Edit Product"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
                title="Delete Product"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg sm:hover:scale-105 transition-all duration-200 cursor-pointer group"
      onClick={handleView}
    >
      {/* Product Image */}
      <div className="relative">
        <img
          src={image}
          alt={name}
          className="w-full h-40 sm:h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity duration-200"
          onClick={handleImageClick}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x300?text=Product+Image';
          }}
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col space-y-1">
          {featured && (
            <span className="px-2 py-1 text-xs font-semibold text-white bg-blue-600 rounded-full">
              Featured
            </span>
          )}
          {discountPercentage > 0 && (
            <span className="px-2 py-1 text-xs font-semibold text-white bg-red-600 rounded-full">
              {discountPercentage}% OFF
            </span>
          )}
          {!inStock && (
            <span className="px-2 py-1 text-xs font-semibold text-white bg-gray-600 rounded-full">
              Out of Stock
            </span>
          )}
        </div>

        {/* Action Buttons - Mobile */}
        <div className="absolute top-2 right-2 flex space-x-1 sm:hidden">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleView();
            }}
            className="p-1.5 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors duration-200"
            title="View Details"
          >
            <Eye className="h-3 w-3 text-gray-600" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(e);
            }}
            className="p-1.5 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors duration-200"
            title="Edit Product"
          >
            <Edit className="h-3 w-3 text-gray-600" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(e);
            }}
            className="p-1.5 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors duration-200"
            title="Delete Product"
          >
            <Trash2 className="h-3 w-3 text-gray-600" />
          </button>
        </div>

        {/* Action Buttons - Desktop */}
        <div className="absolute top-2 right-2 hidden sm:flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Add to wishlist functionality here
            }}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors duration-200"
            title="Add to Wishlist"
          >
            <Heart className="h-4 w-4 text-gray-600" />
          </button>
        </div>

        {/* Hover Actions - Desktop */}
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:flex items-center justify-center space-x-2">
          <button
            onClick={handleView}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors duration-200"
            title="View Details"
          >
            <Eye className="h-4 w-4 text-gray-600" />
          </button>
          <button
            onClick={handleEdit}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors duration-200"
            title="Edit Product"
          >
            <Edit className="h-4 w-4 text-gray-600" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors duration-200"
            title="Delete Product"
          >
            <Trash2 className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3 sm:p-4">
        <div className="mb-2">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-1">{name}</h3>
          <p className="text-xs sm:text-sm text-gray-500">{brand} • {category}</p>
        </div>

        <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>

        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3 w-3 sm:h-4 sm:w-4 ${
                    star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs sm:text-sm text-gray-600 ml-2">({reviews})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg sm:text-xl font-bold text-gray-900">${price}</span>
            {originalPrice && originalPrice > price && (
              <span className="text-xs sm:text-sm text-gray-500 line-through">${originalPrice}</span>
            )}
          </div>
          
          {inStock ? (
            <span className="text-xs sm:text-sm text-green-600 font-medium">In Stock</span>
          ) : (
            <span className="text-xs sm:text-sm text-red-600 font-medium">Out of Stock</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;