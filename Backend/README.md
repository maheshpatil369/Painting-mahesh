# Painting Shop Backend

Backend API for the Painting Shop e-commerce application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the Backend directory with the following variables:
```
MONGO_URI=mongodb://localhost:27017/painting-shop
JWT_ACCESS_SECRET=your-access-token-secret-key-here
JWT_REFRESH_SECRET=your-refresh-token-secret-key-here
FRONTEND_ORIGIN=http://localhost:5173
PORT=4000
```

3. Make sure MongoDB is running (or update MONGO_URI to your MongoDB connection string)

4. Seed the database with initial products:
```bash
npm run seed
```

5. Start the development server:
```bash
npm run dev
```

Or start the production server:
```bash
npm start
```

## API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user (requires auth)

### Products (`/api/products`)
- `GET /api/products` - Get all products (public)
- `GET /api/products/:id` - Get single product (public)
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Orders (`/api/orders`)
- `POST /api/orders` - Create new order (authenticated)
- `GET /api/orders/:id` - Get order by ID (authenticated - own orders or admin)

### User Routes (`/api/users`)
- `GET /api/users/orders` - Get user's orders (authenticated)

### Admin Routes (`/api/admin`)
- `GET /api/admin/users` - Get all users (admin only)
- `GET /api/admin/orders` - Get all orders (admin only)

### Dashboard (`/api/dashboard`)
- `GET /api/dashboard/kpis` - Get dashboard KPIs (admin only)
- `GET /api/dashboard/history` - Get sales history (admin only)

## Models

### User
- `name` (String)
- `email` (String, unique, required)
- `passwordHash` (String, required)
- `phone` (String)
- `role` (String, enum: ['CUSTOMER', 'ADMIN'], default: 'CUSTOMER')

### Product
- `name` (String, required)
- `description` (String)
- `category` (String, required)
- `price` (Number, required) - Price in INR
- `image` (String) - Image URL
- `tag` (String) - Optional tag like 'Best Seller', 'New', etc.
- `stock` (Number, default: 0)
- `sku` (String, unique, optional)

### Order
- `user` (ObjectId, ref: User, required)
- `status` (String, enum: ['PENDING', 'PAID', 'SHIPPED', 'CANCELLED', 'COMPLETED'], default: 'PENDING')
- `total` (Number, required) - Total amount in INR
- `subtotal` (Number, required)
- `shipping` (Number, default: 250)
- `shippingAddress` (Object, required)
- `paymentMethod` (String, default: 'COD')
- `items` (Array of Objects, required)

## Authentication

The API uses JWT tokens for authentication:
- Access tokens are sent in the `Authorization` header as `Bearer <token>`
- Refresh tokens are stored in HTTP-only cookies
- Access tokens expire in 15 minutes (configurable)
- Refresh tokens expire in 30 days (configurable)

## Notes

- All admin routes require the user to have the 'ADMIN' role
- Order creation requires authentication
- Users can only view their own orders (unless they are admin)
- Products are publicly accessible for reading, but require admin role for create/update/delete

