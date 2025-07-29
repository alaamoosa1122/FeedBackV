import mongoose from 'mongoose';
import dotenv from 'dotenv';
import UserModel from '../Models/UserModel.js';

dotenv.config();

const createAdmin = async () => {
  try {
    const con = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@peercluster.xixmr.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority&appName=peerCluster`;
    await mongoose.connect(con);
    console.log('Connected to MongoDB');

    const adminUser = {
      name: 'Admin User',
      email: 'admin@library.com',
      password: 'admin123',
      confirmPassword: 'admin123',
      role: 'admin'
    };

    const existingAdmin = await UserModel.findOne({ email: adminUser.email });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    const admin = new UserModel(adminUser);
    await admin.save();
    console.log('Admin user created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdmin();
