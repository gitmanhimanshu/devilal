const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/devilal-shop');
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@devilal.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@devilal.com',
      password: 'admin123',
      role: 'admin'
    });

    console.log('Admin user created successfully:');
    console.log('Email: admin@devilal.com');
    console.log('Password: admin123');
    console.log('Role: admin');

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

createAdminUser();
