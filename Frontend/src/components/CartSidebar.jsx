// File: Frontend/src/components/CartSidebar.jsx
import React from 'react';
import { X, Trash2, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';

// Added onUpdateQuantity prop
const CartSidebar = ({ isOpen, onClose, cartItems, onRemoveItem, onUpdateQuantity }) => {
  // Calculate total based on price * quantity
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300" onClick={onClose}></div>
      
      <div className="absolute inset-y-0 right-0 max-w-md w-full flex">
        <div className="h-full w-full bg-white shadow-2xl flex flex-col transform transition-transform duration-300 translate-x-0">
          
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
            <h2 className="text-lg font-black text-black uppercase tracking-wider">Your Cart</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors p-1">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <p className="mb-4">Your cart is empty. Time to get some color!</p>
                <button onClick={onClose} className="mt-4 bg-sky-500 text-white font-bold py-2 px-6 uppercase text-sm rounded-sm hover:bg-sky-600 transition-colors">
                  Start Shopping
                </button>
              </div>
            ) : (
              <ul className="space-y-6">
                {cartItems.map((item, index) => (
                  <li key={`${item.id}-${index}`} className="flex py-2 border-b border-gray-100 pb-4 last:border-0">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover object-center mix-blend-multiply"
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/80x80/e5e7eb/4b5563?text=Xtreme"; }}
                      />
                    </div>
                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-bold text-black">
                          <h3 className="truncate max-w-[70%]">{item.name}</h3>
                          <p className="ml-4 font-mono font-black text-sky-500">₹{item.price * item.quantity}</p>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">{item.category}</p>
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm mt-2">
                        {/* Quantity Controls in Sidebar */}
                        <div className="flex items-center border border-gray-300 rounded-sm">
                          <button 
                            onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                            className="p-1 text-black hover:bg-gray-100 transition-colors disabled:opacity-50"
                            disabled={item.quantity === 1}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-2 text-sm font-medium">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                            className="p-1 text-black hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={() => onRemoveItem(index)}
                          className="font-medium text-red-500 hover:text-red-600 flex items-center transition-colors"
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="border-t border-gray-100 px-6 py-6 bg-gray-50">
              <div className="flex justify-between text-xl font-black text-black mb-4">
                <p>Subtotal</p>
                <p className="font-mono text-sky-500">₹{total}</p>
              </div>
              <p className="mt-0.5 text-sm text-gray-500 mb-6">
                Shipping and taxes calculated at checkout.
              </p>
              <Link
                to="/checkout" // Link directly to the new Checkout page
                onClick={onClose}
                className="flex items-center justify-center rounded-sm border border-transparent bg-black px-6 py-3 text-base font-black text-white shadow-lg hover:bg-sky-500 uppercase tracking-widest w-full transition-colors"
              >
                Proceed to Checkout
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;