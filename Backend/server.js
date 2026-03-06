// server.js (UPDATED)

require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { connectDB } = require('./config/db');

const authRoutes = require('./routes/authroutes');
const userRoutes = require('./routes/userroutes');
const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// CORS - allow React app origin (set in env or change to your front-end origin)

// rate limiter for auth endpoints
// const limiter = rateLimit({
//   windowMs: 1 * 60 * 1000,
//   max: 10,
//   message: 'Too many requests, try again later'
// });
// app.use('/api/auth', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/dashboard', dashboardRoutes); 

// health
app.get('/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/painting-shop';

// Connect to DB and start server
connectDB(MONGO_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server listening on port ${PORT}`);
    console.log(`📦 MongoDB connected`);
  });
}).catch(err => {
  console.error('❌ Failed to connect to DB:', err.message);
  console.log('💡 Make sure MongoDB is running or update MONGO_URI in .env file');
  // Still start the server - orders can be created but won't persist without DB
  app.listen(PORT, () => {
    console.log(`⚠️  Server listening on port ${PORT} (without database)`);
  });
});