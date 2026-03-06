// Seed script to populate products from frontend data
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/product');
const { connectDB } = require('../config/db');

const products = [
  // Solid Pearls
  {
    name: '24 Karat Gold',
    category: 'Solid Pearls',
    price: 1599,
    image: 'https://images.unsplash.com/photo-1503376763036-066120622c74?auto=format&fit=crop&q=80&w=600',
    description: 'The standard for gold automotive pearls. Single and solid color with a high metallic finish.',
    tag: 'Best Seller',
    stock: 50
  },
  {
    name: 'Blue Dream',
    category: 'Solid Pearls',
    price: 1499,
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=600',
    description: 'Deep, rich solid blue pearl for ultimate depth and clarity.',
    tag: 'New',
    stock: 45
  },
  {
    name: 'Electric Blurple',
    category: 'Solid Pearls',
    price: 1550,
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=600',
    description: 'A vibrant, metallic blend of blue and purple tones.',
    stock: 40
  },
  // Interference Pearls
  {
    name: 'Abalone',
    category: 'Interference Pearls',
    price: 1799,
    image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=600',
    description: 'Effect color offering iridescent hues, shifting subtly over a dark base coat.',
    tag: 'Ghost Effect',
    stock: 35
  },
  {
    name: 'Interference Green',
    category: 'Interference Pearls',
    price: 1850,
    image: 'https://images.unsplash.com/photo-1566008885218-90abf9200ddb?auto=format&fit=crop&q=80&w=600',
    description: 'Clear pearl that reflects a striking green flash. Best over black or white base.',
    stock: 30
  },
  // Carbon Pearls
  {
    name: 'Carbon Gold',
    category: 'Carbon Pearls',
    price: 1699,
    image: 'https://images.unsplash.com/photo-1562911791-c7a97b729ec5?auto=format&fit=crop&q=80&w=600',
    description: 'Highly metallic and bold solid pearl in a carbon-like dark gold.',
    tag: 'Popular',
    stock: 40
  },
  {
    name: 'Carbon Red',
    category: 'Carbon Pearls',
    price: 1699,
    image: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=600',
    description: 'Intense metallic red finish with deep pigment concentration.',
    tag: 'Hot',
    stock: 38
  },
  // OEM+ Pearls
  {
    name: 'Obsidian Black',
    category: 'OEM+ Pearls',
    price: 1450,
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=600',
    description: 'Deepest black with a subtle, factory-grade holographic sparkle. OEM+ quality.',
    stock: 50
  },
  {
    name: 'Porcelain White',
    category: 'OEM+ Pearls',
    price: 1450,
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=600',
    description: 'Clean, crisp white pearl with an enhanced subtle metallic effect.',
    stock: 48
  },
  // Special Effect Pearls
  {
    name: 'Andromeda',
    category: 'Special Effect Pearls',
    price: 2199,
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=600',
    description: 'Optically variable (color changing) shifting between blue, green, and purple.',
    tag: 'Premium',
    stock: 25
  },
  {
    name: 'Zombie Midnight',
    category: 'Special Effect Pearls',
    price: 2199,
    image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=600',
    description: 'Dark shifting tones from purple to green, perfect for a mysterious look.',
    tag: 'Limited',
    stock: 20
  },
  // Chroma Pearls
  {
    name: 'XTA Chroma',
    category: 'Chroma Pearls',
    price: 2999,
    image: 'https://images.unsplash.com/photo-1566008885218-90abf9200ddb?auto=format&fit=crop&q=80&w=600',
    description: 'The most vivid and hardest shifting pearls. Shows 5-6 colors from every angle.',
    tag: 'Exotic',
    stock: 15
  }
];

async function seedProducts() {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log('Connected to database');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert products
    const insertedProducts = await Product.insertMany(products);
    console.log(`Successfully seeded ${insertedProducts.length} products`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
}

seedProducts();

