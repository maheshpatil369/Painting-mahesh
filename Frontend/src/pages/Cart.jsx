// File: Frontend/src/pages/Cart.jsx
import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';

// Added onUpdateQuantity prop
const Cart = ({ cartItems, onRemoveItem, onUpdateQuantity }) => {
  // Calculate total based on price * quantity
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = cartItems.length > 0 ? 250 : 0; // Flat rate for simulation
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center py-20 text-black">
        <h2 className="text-4xl font-black italic mb-6 uppercase text-gray-400">YOUR CART IS EMPTY</h2>
        <Link to="/shop" className="bg-sky-500 text-white font-bold py-3 px-8 uppercase tracking-widest hover:bg-sky-600 transition-colors rounded-sm shadow-lg">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black text-black italic uppercase mb-10">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <div key={`${item.id}-${index}`} className="bg-gray-50 p-6 flex items-center border border-gray-200 rounded-lg shadow-sm">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-24 h-24 object-cover mr-6 rounded-lg mix-blend-multiply flex-shrink-0" 
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/96x96/e5e7eb/4b5563?text=Xtreme"; }}
                />
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-black font-black text-xl mb-1 truncate">{item.name}</h3>
                  <p className="text-sky-500 text-sm font-bold uppercase mb-3">{item.category}</p>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border border-gray-300 rounded-sm">
                        <button 
                          onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                          className="p-2 text-black hover:bg-white transition-colors disabled:opacity-50"
                          disabled={item.quantity === 1}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-4 text-black font-bold">{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                          className="p-2 text-black hover:bg-white transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                    </div>
                    <button 
                      onClick={() => onRemoveItem(index)}
                      className="text-red-500 hover:text-red-700 text-sm flex items-center font-medium transition-colors"
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Remove
                    </button>
                  </div>
                </div>

                <div className="text-right ml-6">
                  <p className="text-black font-mono text-xl font-black">₹{item.price * item.quantity}</p>
                  <p className="text-gray-500 text-xs mt-1">₹{item.price} per 100ml</p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-black text-white p-6 border border-gray-800 sticky top-24 rounded-lg shadow-xl">
              <h2 className="text-xl font-black uppercase mb-6 border-b pb-4 border-zinc-700">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-zinc-300">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>Shipping (Flat Rate)</span>
                  <span>₹{shipping}</span>
                </div>
              </div>
              
              <div className="border-t border-zinc-700 pt-4 flex justify-between text-white font-black text-2xl mt-6 mb-8">
                <span>Total</span>
                <span className="text-sky-500 font-mono">₹{total}</span>
              </div>
              
              <Link 
                to="/checkout"
                className="w-full bg-sky-500 text-white font-black py-4 uppercase tracking-widest hover:bg-sky-600 transition-colors shadow-lg shadow-sky-500/30 flex justify-center rounded-sm"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;