# Devilal E-commerce Product Management System

A full-stack application for managing products with React + Vite frontend and Node.js + Express + MongoDB backend.

## Features

- **Full CRUD Operations**: Create, read, update, and delete products
- **Advanced Filtering**: Filter by category, brand, price range, and featured status
- **Search Functionality**: Search products by name and description
- **Sorting Options**: Sort by name, price, date created
- **Pagination**: Navigate through large product catalogs
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Environment Configuration**: Fully configurable via environment variables
- **Modern UI**: Clean, professional interface with hover effects and animations

## Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **Tailwind CSS** for responsive styling
- **Lucide React** for icons
- **Axios** for API communication

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Environment-based configuration**
- **Security middleware** (Helmet, CORS, Rate Limiting)
- **Morgan** for logging

## Project Structure

```
devilal/
├── frontend/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API services
│   │   └── ...
│   ├── .env                 # Frontend environment variables
│   └── package.json
├── backend/                 # Node.js + Express backend
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── .env                # Backend environment variables
│   ├── server.js           # Main server file
│   ├── seedData.js         # Sample data seeder
│   └── package.json
└── README.md
```

## Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/devilal_products
DB_NAME=devilal_products
API_VERSION=v1
API_BASE_URL=/api/v1
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret_here_change_in_production
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
PRODUCTS_ROUTE=/products
CATEGORIES_ROUTE=/categories
BRANDS_ROUTE=/brands
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_API_TIMEOUT=5000
VITE_APP_NAME=Devilal Shop
VITE_APP_VERSION=1.0.0
VITE_ENABLE_PAGINATION=true
VITE_ITEMS_PER_PAGE=12
VITE_ENABLE_FILTERING=true
VITE_ENABLE_SORTING=true
VITE_THEME=light
VITE_ENABLE_ANIMATIONS=true
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or connection to MongoDB Atlas)
- npm or yarn

### 1. Clone and Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Setup Environment Variables

Copy the environment variable examples above into:
- `backend/.env`
- `frontend/.env`

Modify the MongoDB connection string and other settings as needed.

### 3. Start MongoDB

Make sure MongoDB is running on your system or you have a valid MongoDB Atlas connection string.

### 4. Seed Sample Data (Optional)

```bash
cd backend
npm run seed
```

### 5. Start the Application

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 6. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api/v1
- Health Check: http://localhost:5000/health

## API Endpoints

### Products
- `GET /api/v1/products` - Get all products with filtering and pagination
- `GET /api/v1/products/:id` - Get single product
- `POST /api/v1/products` - Create new product
- `PUT /api/v1/products/:id` - Update product
- `DELETE /api/v1/products/:id` - Delete product

### Metadata
- `GET /api/v1/products/meta/categories` - Get all categories
- `GET /api/v1/products/meta/brands` - Get all brands

### Query Parameters for GET /products
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12)
- `category` - Filter by category
- `brand` - Filter by brand
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `search` - Search in name and description
- `sortBy` - Sort field (name, price, createdAt)
- `sortOrder` - Sort order (asc, desc)
- `featured` - Filter featured products (true/false)

## Usage

### Adding Products
1. Click the "Add Product" button
2. Fill in the product details
3. Submit the form

### Editing Products
1. Click the edit icon on any product card
2. Modify the details in the modal
3. Save changes

### Filtering Products
1. Use the search bar for text search
2. Open the filter panel to set category, brand, price range
3. Use the sort dropdown to change ordering

### Responsive Design
- **Desktop**: Grid view with 4 columns
- **Tablet**: Grid view with 2-3 columns
- **Mobile**: Single column list view

## Development

### Available Scripts

**Backend:**
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with sample data

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Code Structure

**Backend:**
- `server.js` - Main application entry point
- `config/database.js` - MongoDB connection
- `models/Product.js` - Product schema
- `controllers/productController.js` - Business logic
- `routes/productRoutes.js` - API routes

**Frontend:**
- `App.jsx` - Main application component
- `components/ProductCatalog.jsx` - Main catalog view
- `components/ProductCard.jsx` - Individual product display
- `components/ProductModal.jsx` - Add/edit product modal
- `components/FilterPanel.jsx` - Filtering interface
- `components/Pagination.jsx` - Pagination controls
- `services/api.js` - API communication layer

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.