import React from 'react';
import { X, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';

const ImageModal = ({ isOpen, onClose, imageUrl, productName }) => {
  const [zoom, setZoom] = React.useState(1);
  const [rotation, setRotation] = React.useState(0);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.5, 0.5));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-90"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative flex items-center justify-center min-h-screen p-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-colors duration-200"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Controls */}
        <div className="absolute top-4 left-4 z-10 flex space-x-2">
          <button
            onClick={handleZoomIn}
            className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-colors duration-200"
            title="Zoom In"
          >
            <ZoomIn className="h-5 w-5" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-colors duration-200"
            title="Zoom Out"
          >
            <ZoomOut className="h-5 w-5" />
          </button>
          <button
            onClick={handleRotate}
            className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-colors duration-200"
            title="Rotate"
          >
            <RotateCw className="h-5 w-5" />
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-2 text-white hover:bg-white hover:bg-opacity-20 rounded-md transition-colors duration-200 text-sm"
            title="Reset"
          >
            Reset
          </button>
        </div>

        {/* Image Container */}
        <div className="relative max-w-full max-h-full">
          <img
            src={imageUrl}
            alt={productName}
            className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              transition: 'transform 0.3s ease-in-out'
            }}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
            }}
          />
        </div>

        {/* Product Name */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg">
          <p className="text-sm font-medium">{productName}</p>
        </div>

        {/* Zoom Level Indicator */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
          {Math.round(zoom * 100)}%
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
