// File: Frontend/src/components/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

const ProductCard = ({ product, onAddToCart }) => {
  // Normalize product ID (handle both MongoDB _id and regular id)
  const productId = product._id || product.id;
  
  return (
    <div className="group bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-sky-500 shadow-md hover:shadow-xl transition-all duration-300">
      <Link to={`/product/${productId}`} className="block relative overflow-hidden">
        {product.tag && (
          <span className="absolute top-2 left-2 bg-black text-sky-500 text-[10px] font-black px-2 py-1 uppercase tracking-wider z-10 rounded-full">
            {product.tag}
          </span>
        )}
        <div className="aspect-w-16 aspect-h-9 bg-gray-100">
          <img 
            src={product.image} 
            alt={product.name} 
            // Better aspect ratio for paint (closer to square/vertical focus)
            className="w-full h-64 object-cover object-center group-hover:scale-110 transition-transform duration-700 mix-blend-multiply"
            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x600/e5e7eb/4b5563?text=Xtreme+Kolorz"; }}
          />
        </div>
        {/* Quick add overlay - Changed action to go to details */}
        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="bg-sky-500 text-white font-bold py-2 px-6 uppercase text-sm tracking-widest hover:bg-sky-400 transition-colors rounded-full shadow-lg">
            View Details
          </span>
        </div>
      </Link>
      
      <div className="p-4">
        <p className="text-xs text-sky-500 font-bold uppercase tracking-wider mb-1">{product.category}</p>
        <h3 className="text-black text-lg font-black mb-1 truncate group-hover:text-sky-600 transition-colors italic">{product.name}</h3>
        <p className="text-gray-500 text-xs mb-4 line-clamp-1">{product.description}</p>
        
        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <span className="text-black font-black font-mono text-xl">₹{product.price}</span>
          {/* Default quantity of 1 when using quick-add from card */}
          <button 
            onClick={() => onAddToCart(product, 1)}
            className="text-gray-400 hover:text-sky-500 transition-colors p-2 hover:bg-sky-50 rounded-full"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;