const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const connectDB = require('./config/database');

dotenv.config();

const sampleProducts = [
  {
    name: 'Modern Sectional Sofa',
    description: 'Comfortable and stylish sectional sofa perfect for modern living rooms',
    price: 899,
    originalPrice: 1299,
    category: 'furniture',
    brand: 'ComfortLiving',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
    featured: true,
    rating: 4.5,
    reviews: 89
  },
  {
    name: 'Oak Dining Table',
    description: 'Solid oak dining table that seats 6 people comfortably',
    price: 649,
    originalPrice: 849,
    category: 'furniture',
    brand: 'WoodCraft',
    image: 'https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=400&h=400&fit=crop',
    featured: true,
    rating: 4.8,
    reviews: 156
  },
  {
    name: 'Minimalist Floor Lamp',
    description: 'Sleek and modern floor lamp with adjustable brightness',
    price: 129,
    originalPrice: 179,
    category: 'lighting',
    brand: 'LightDesign',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    featured: false,
    rating: 4.2,
    reviews: 43
  },
  {
    name: 'Vintage Armchair',
    description: 'Classic vintage-style armchair with premium leather upholstery',
    price: 459,
    originalPrice: 599,
    category: 'furniture',
    brand: 'RetroStyle',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
    featured: true,
    rating: 4.6,
    reviews: 78
  },
  {
    name: 'Ceramic Table Vase',
    description: 'Handcrafted ceramic vase perfect for fresh flowers or dried arrangements',
    price: 39,
    originalPrice: 59,
    category: 'decor',
    brand: 'ArtisanCraft',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
    featured: false,
    rating: 4.3,
    reviews: 92
  },
  {
    name: 'Industrial Bookshelf',
    description: 'Metal and wood bookshelf with industrial design aesthetic',
    price: 299,
    originalPrice: 399,
    category: 'storage',
    brand: 'UrbanLoft',
    image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=400&fit=crop',
    featured: false,
    rating: 4.4,
    reviews: 67
  },
  {
    name: 'Pendant Light Set',
    description: 'Set of 3 matching pendant lights for kitchen or dining area',
    price: 189,
    originalPrice: 249,
    category: 'lighting',
    brand: 'ModernLights',
    image: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=400&h=400&fit=crop',
    featured: true,
    rating: 4.7,
    reviews: 134
  },
  {
    name: 'Wool Area Rug',
    description: 'Hand-woven wool area rug with geometric pattern',
    price: 219,
    originalPrice: 319,
    category: 'textiles',
    brand: 'WeaveMasters',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
    featured: false,
    rating: 4.1,
    reviews: 28
  },
  {
    name: 'Coffee Table',
    description: 'Glass top coffee table with modern metal legs',
    price: 329,
    originalPrice: 429,
    category: 'furniture',
    brand: 'GlassDesign',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
    featured: false,
    rating: 4.0,
    reviews: 51
  },
  {
    name: 'Wall Mirror',
    description: 'Large decorative wall mirror with ornate frame',
    price: 159,
    originalPrice: 219,
    category: 'decor',
    brand: 'ReflectStyle',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
    featured: true,
    rating: 4.5,
    reviews: 73
  },
  {
    name: 'Storage Ottoman',
    description: 'Multi-functional storage ottoman that doubles as seating',
    price: 89,
    originalPrice: 129,
    category: 'storage',
    brand: 'SmartFurniture',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
    featured: false,
    rating: 4.2,
    reviews: 94
  },
  {
    name: 'Table Lamp',
    description: 'Classic table lamp with fabric shade',
    price: 79,
    originalPrice: 109,
    category: 'lighting',
    brand: 'ClassicLights',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
    featured: false,
    rating: 4.3,
    reviews: 37
  },
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
    price: 199.99,
    originalPrice: 249.99,
    category: 'electronics',
    brand: 'TechSound',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    featured: true,
    rating: 4.5,
    reviews: 128,
    inStock: true,
    stock: 50
  },
  {
    name: 'Smart Fitness Watch',
    description: 'Advanced fitness tracking with heart rate monitor, GPS, and water resistance.',
    price: 299.99,
    originalPrice: 349.99,
    category: 'electronics',
    brand: 'FitTech',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    featured: true,
    rating: 4.7,
    reviews: 89,
    inStock: true,
    stock: 25
  },
  {
    name: 'Organic Cotton T-Shirt',
    description: 'Comfortable and sustainable organic cotton t-shirt in various colors.',
    price: 29.99,
    originalPrice: 39.99,
    category: 'clothing',
    brand: 'EcoWear',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    featured: false,
    rating: 4.2,
    reviews: 156,
    inStock: true,
    stock: 100
  },
  {
    name: 'Gaming Mechanical Keyboard',
    description: 'RGB backlit mechanical keyboard with customizable keys and anti-ghosting technology.',
    price: 149.99,
    originalPrice: 199.99,
    category: 'electronics',
    brand: 'GameMaster',
    image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500',
    featured: true,
    rating: 4.6,
    reviews: 203,
    inStock: true,
    stock: 30
  },
  {
    name: 'Premium Coffee Maker',
    description: 'Automatic drip coffee maker with programmable timer and thermal carafe.',
    price: 89.99,
    originalPrice: 119.99,
    category: 'home',
    brand: 'BrewMaster',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500',
    featured: false,
    rating: 4.3,
    reviews: 87,
    inStock: true,
    stock: 15
  },
  {
    name: 'Leather Crossbody Bag',
    description: 'Genuine leather crossbody bag with multiple compartments and adjustable strap.',
    price: 79.99,
    originalPrice: 99.99,
    category: 'accessories',
    brand: 'LeatherCraft',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
    featured: false,
    rating: 4.4,
    reviews: 142,
    inStock: true,
    stock: 40
  },
  {
    name: 'Wireless Charging Pad',
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices.',
    price: 39.99,
    originalPrice: 49.99,
    category: 'electronics',
    brand: 'ChargeTech',
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500',
    featured: false,
    rating: 4.1,
    reviews: 95,
    inStock: true,
    stock: 60
  },
  {
    name: 'Yoga Mat Premium',
    description: 'Non-slip yoga mat with carrying strap, perfect for all yoga practices.',
    price: 49.99,
    originalPrice: 69.99,
    category: 'sports',
    brand: 'FlexiFit',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500',
    featured: false,
    rating: 4.5,
    reviews: 178,
    inStock: true,
    stock: 35
  },
  {
    name: 'Smart Home Speaker',
    description: 'Voice-controlled smart speaker with built-in assistant and high-quality audio.',
    price: 129.99,
    originalPrice: 159.99,
    category: 'electronics',
    brand: 'SmartHome',
    image: 'https://images.unsplash.com/photo-1543512214-318c7553f226?w=500',
    featured: true,
    rating: 4.8,
    reviews: 267,
    inStock: true,
    stock: 20
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    // Insert sample products
    await Product.insertMany(sampleProducts);
    console.log('Sample products inserted successfully');
    
    console.log(`${sampleProducts.length} products added to database`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();