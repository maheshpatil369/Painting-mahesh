// File: Frontend/src/pages/Checkout.jsx
import React, { useState, useEffect } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { API_URL as BACKEND_URL } from '../config';
const API_ORDER_ENDPOINT = `${BACKEND_URL}/orders`;

const Checkout = ({ cartItems, clearCart }) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState('');
  
  // Form state for shipping address
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phone: '',
    email: '',
    addressLine1: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  });

  // Simulated fixed shipping rate
  const shipping = cartItems.length > 0 ? 250 : 0; 
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal + shipping;
  
  // Redirect if cart is empty before completion
  useEffect(() => {
    if (cartItems.length === 0 && !isComplete) {
      navigate('/cart');
    }
  }, [cartItems, navigate, isComplete]);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;
    
    // Validate shipping address
    if (!shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.email || 
        !shippingAddress.addressLine1 || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode) {
      setError('Please fill in all shipping address fields');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const orderData = {
        items: cartItems.map(item => ({
          id: item.id,
          productId: item.id, // Will be handled by backend
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress,
        paymentMethod: 'COD'
      };

      const response = await fetch(API_ORDER_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to place order');
      }

      setIsProcessing(false);
      setIsComplete(true);
      clearCart(); // Clear the cart after successful order
    } catch (err) {
      console.error('Error placing order:', err);
      setError(err.message || 'Failed to place order. Please try again.');
      setIsProcessing(false);
    }
  };

  if (isComplete) {
    return (
      <div className="bg-white min-h-screen flex flex-col items-center justify-center py-20 text-black text-center">
        <CheckCircle className="h-20 w-20 text-emerald-500 mb-6" />
        <h1 className="text-4xl font-black italic uppercase mb-4 text-emerald-600">Order Placed Successfully!</h1>
        <p className="text-gray-600 max-w-lg mb-8">
          Your Xtreme Kolorz order has been confirmed! Your total of **₹{total}** will be collected via COD. You will receive a tracking ID shortly.
        </p>
        <button 
          onClick={() => navigate('/shop')}
          className="bg-black text-white font-bold py-3 px-8 uppercase tracking-widest hover:bg-sky-500 transition-colors rounded-sm shadow-lg"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  // --- Main Checkout Form/Summary ---
  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black text-black italic uppercase mb-10">Secure Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Shipping & Payment Form (Left/Main Column) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Shipping Address */}
            <div className="bg-gray-50 p-6 border border-gray-200 rounded-lg shadow-lg">
              <h2 className="text-xl font-black text-black uppercase mb-6 border-b pb-4 border-gray-200">1. Shipping Information</h2>
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input 
                  type="text" 
                  name="fullName"
                  placeholder="Full Name" 
                  required 
                  value={shippingAddress.fullName}
                  onChange={handleAddressChange}
                  className="w-full bg-white border border-gray-300 rounded-sm py-3 px-4 text-black focus:ring-sky-500 focus:border-sky-500" 
                />
                <input 
                  type="text" 
                  name="phone"
                  placeholder="Phone Number" 
                  required 
                  value={shippingAddress.phone}
                  onChange={handleAddressChange}
                  className="w-full bg-white border border-gray-300 rounded-sm py-3 px-4 text-black focus:ring-sky-500 focus:border-sky-500" 
                />
                <input 
                  type="email" 
                  name="email"
                  placeholder="Email Address" 
                  required 
                  value={shippingAddress.email}
                  onChange={handleAddressChange}
                  className="w-full bg-white border border-gray-300 rounded-sm py-3 px-4 text-black focus:ring-sky-500 focus:border-sky-500" 
                />
                <input 
                  type="text" 
                  name="addressLine1"
                  placeholder="Address Line 1" 
                  required 
                  value={shippingAddress.addressLine1}
                  onChange={handleAddressChange}
                  className="w-full bg-white border border-gray-300 rounded-sm py-3 px-4 text-black focus:ring-sky-500 focus:border-sky-500 md:col-span-2" 
                />
                <input 
                  type="text" 
                  name="city"
                  placeholder="City" 
                  required 
                  value={shippingAddress.city}
                  onChange={handleAddressChange}
                  className="w-full bg-white border border-gray-300 rounded-sm py-3 px-4 text-black focus:ring-sky-500 focus:border-sky-500" 
                />
                <input 
                  type="text" 
                  name="state"
                  placeholder="State / Province" 
                  required 
                  value={shippingAddress.state}
                  onChange={handleAddressChange}
                  className="w-full bg-white border border-gray-300 rounded-sm py-3 px-4 text-black focus:ring-sky-500 focus:border-sky-500" 
                />
                <input 
                  type="text" 
                  name="zipCode"
                  placeholder="ZIP / Postal Code" 
                  required 
                  value={shippingAddress.zipCode}
                  onChange={handleAddressChange}
                  className="w-full bg-white border border-gray-300 rounded-sm py-3 px-4 text-black focus:ring-sky-500 focus:border-sky-500" 
                />
                <select 
                  name="country"
                  value={shippingAddress.country}
                  onChange={handleAddressChange}
                  className="w-full bg-white border border-gray-300 rounded-sm py-3 px-4 text-black focus:ring-sky-500 focus:border-sky-500"
                >
                  <option>India</option>
                  <option>Other Country</option>
                </select>
              </form>
            </div>

            {/* Payment Method */}
            <div className="bg-gray-50 p-6 border border-gray-200 rounded-lg shadow-lg">
              <h2 className="text-xl font-black text-black uppercase mb-6 border-b pb-4 border-gray-200">2. Payment Method (Simulated)</h2>
              <div className="space-y-4">
                <label className="flex items-center space-x-3 bg-white p-4 rounded-sm border-2 border-sky-500 shadow-sm cursor-pointer">
                  <input type="radio" name="payment" defaultChecked className="text-sky-500" />
                  <span className="font-bold text-black">Cash on Delivery (COD)</span>
                </label>
                <label className="flex items-center space-x-3 bg-white p-4 rounded-sm border border-gray-300 cursor-not-allowed opacity-50">
                  <input type="radio" name="payment" disabled className="text-sky-500" />
                  <span className="text-gray-500 font-bold">Credit/Debit Card (Disabled for Demo)</span>
                </label>
              </div>
            </div>
          </div>
          
          {/* Order Summary (Right Column) */}
          <div className="lg:col-span-1">
            <div className="bg-black text-white p-6 border border-sky-500 sticky top-24 rounded-lg shadow-xl shadow-sky-500/20">
              <h2 className="text-xl font-black uppercase mb-6 border-b pb-4 border-zinc-700">Order Summary</h2>
              
              <div className="space-y-4 text-sm mb-6 max-h-48 overflow-y-auto pr-2">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-start">
                    <p className="text-zinc-300">{item.name} x {item.quantity}</p>
                    <p className="font-mono font-black text-white">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-4 border-t border-zinc-700">
                <div className="flex justify-between text-zinc-300">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>Shipping (Flat Rate)</span>
                  <span>₹{shipping}</span>
                </div>
                <div className="flex justify-between text-white font-black text-2xl pt-4 border-t border-zinc-700">
                  <span>Total Due</span>
                  <span className="text-sky-500 font-mono">₹{total}</span>
                </div>
              </div>
              
              <button 
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="mt-8 w-full bg-sky-500 text-white font-black py-4 uppercase tracking-widest hover:bg-sky-600 transition-colors shadow-xl shadow-sky-500/30 rounded-sm flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-3 animate-spin" /> Processing...
                  </>
                ) : (
                  'Place Order & Pay (COD)'
                )}
              </button>
              
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center">By placing your order, you agree to our Terms and Conditions.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;