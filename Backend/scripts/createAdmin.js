// Script to create an admin account
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { connectDB } = require('../config/db');

async function createAdmin() {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/painting-shop';
    await connectDB(MONGO_URI);
    console.log('Connected to database');

    // Admin credentials
    const adminEmail = 'admin@painting-shop.com';
    const adminPassword = 'Admin123';
    const adminName = 'Admin User';

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('⚠️  Admin account already exists!');
      console.log('Email:', adminEmail);
      console.log('To reset password, delete the existing admin and run this script again.');
      process.exit(0);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(adminPassword, 12);

    // Create admin user
    const admin = new User({
      name: adminName,
      email: adminEmail,
      passwordHash: passwordHash,
      role: 'ADMIN'
    });

    await admin.save();

    console.log('\n✅ Admin account created successfully!\n');
    console.log('═══════════════════════════════════════════════════════');
    console.log('📧 EMAIL:    ' + adminEmail);
    console.log('🔑 PASSWORD: ' + adminPassword);
    console.log('👤 ROLE:     ADMIN');
    console.log('═══════════════════════════════════════════════════════');
    console.log('\n💡 You can now login at: http://localhost:5173/login\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin account:', error);
    process.exit(1);
  }
}

createAdmin();

