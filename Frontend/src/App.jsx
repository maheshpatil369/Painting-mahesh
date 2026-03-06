// File: Frontend/src/App.jsx (CORRECTED)

import React, { useState } from 'react';
// 🔑 IMPORT: Add useLocation for route checking
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'; 

// 🔑 CORRECTED: Imports using your folder structure
import AuthProvider from './Context/AuthContext.jsx'; 
import Navbar from './components/Navbar.jsx'; 
import Footer from './components/Footer.jsx'; 
import CartSidebar from './components/CartSidebar.jsx'; 
import ProtectedRoute from './components/ProtectedRoute.jsx'; 

// Pages (from the 'src/pages' directory)
import Home from './pages/Home.jsx'; 
import Shop from './pages/Shop.jsx'; 
import ProductPage from './pages/ProductPage.jsx'; 
import Contact from './pages/Contact.jsx'; 
import Cart from './pages/Cart.jsx'; 
import Checkout from './pages/Checkout.jsx'; 
import About from './pages/About.jsx'; 
import Services from './pages/Services.jsx'; 
import Signup from './pages/Signup';
import Login from './pages/Login';
import UserDashboard from './pages/UserDashboard.jsx'; 

// Admin components (from the 'src/Context' directory)
import AdminDashboard from './Context/AdminDashboard.jsx';
import AdminProducts from './Context/AdminProducts.jsx';
import AdminOrders from './Context/AdminOrders.jsx'; 

export default function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // 🔑 HOOK: Initialize useLocation inside the functional component
  const location = useLocation(); 

  // 🔑 LOGIC: Check if the current path starts with /user or /admin
  const isDashboardRoute = location.pathname.startsWith('/user') || location.pathname.startsWith('/admin');

  // --- Cart handling functions (no changes) ---
  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
      if (existingItemIndex > -1) {
        const newItems = [...prevItems];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity,
        };
        return newItems;
      } else {
        return [...prevItems, { ...product, quantity }];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (index) => {
    const newCart = [...cartItems];
    newCart.splice(index, 1);
    setCartItems(newCart);
  };
  
  const updateQuantity = (index, newQuantity) => {
    setCartItems(prevItems => {
      const newItems = [...prevItems];
      if (newQuantity > 0) {
        newItems[index] = { ...newItems[index], quantity: newQuantity };
      } else {
        newItems.splice(index, 1);
      }
      return newItems;
    });
  };

  const clearCart = () => setCartItems([]);
  const totalCartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  // --- End Cart handling functions ---


  return (
    <AuthProvider> 
      <div className="min-h-screen flex flex-col bg-white text-black font-sans">
        {/* 🔑 CONDITIONAL RENDERING: Hide Navbar on /user and /admin routes */}
        {!isDashboardRoute && <Navbar cartCount={totalCartCount} />}
        
        <CartSidebar 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
          cartItems={cartItems} 
          onRemoveItem={removeFromCart} 
          onUpdateQuantity={updateQuantity} 
        />

        {/* 🔑 CONDITIONAL PADDING: Remove pt-20 if Navbar is hidden (Dashboard routes) */}
        <main className={`flex-grow ${!isDashboardRoute ? 'pt-20' : ''}`}> 
          <Routes>
            {/* Public/User Auth Routes */}
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/user"
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />

            {/* Public Routes */}
            <Route path="/" element={<Home onAddToCart={addToCart} />} />
            <Route path="/shop" element={<Shop onAddToCart={addToCart} />} />
            <Route path="/product/:id" element={<ProductPage onAddToCart={addToCart} />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Cart cartItems={cartItems} onRemoveItem={removeFromCart} onUpdateQuantity={updateQuantity} />} />
            <Route path="/checkout" element={<Checkout cartItems={cartItems} clearCart={clearCart} />} />
            <Route path="/about" element={<About />} /> 
            <Route path="/services" element={<Services />} /> 
            
            {/* Protected Admin Routes */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} /> 
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/products" 
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminProducts />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/orders" 
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminOrders />
                </ProtectedRoute>
              } 
            />

          </Routes>
        </main>

        <Footer />
      </div>
    </AuthProvider>
  );
}