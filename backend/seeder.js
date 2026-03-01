const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const products = [
  {
    name: 'Organic Spinach',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Fresh organic spinach leaves, rich in iron and perfect for salads or cooking.',
    category: 'Leafy',
    price: 2.99,
    stock: 50,
  },
  {
    name: 'Red Carrots',
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Sweet and crunchy carrots, freshly harvested from the farm.',
    category: 'Roots',
    price: 1.49,
    stock: 100,
  },
  {
    name: 'Fresh Tomatoes',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f02ac6d31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Juicy ripe tomatoes, perfect for sauces, salads, and sandwiches.',
    category: 'Fruits',
    price: 3.25,
    stock: 40,
  },
  {
    name: 'Seasonal Pumpkins',
    image: 'https://images.unsplash.com/photo-1506867072417-82a337855d0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Large, sweet seasonal pumpkins, great for soups and pies.',
    category: 'Seasonal',
    price: 5.99,
    stock: 20,
  }
];

const importData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();

    const createdUser = await User.create({
      name: 'Admin User',
      email: 'admin@freshkart.com',
      password: 'password123',
      role: 'admin',
    });

    const sampleProducts = products.map((product) => {
      return { ...product, user: createdUser._id };
    });

    await Product.insertMany(sampleProducts);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
