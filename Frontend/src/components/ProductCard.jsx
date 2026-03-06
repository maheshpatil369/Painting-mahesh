import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star } from 'lucide-react';

const ProductCard = ({ product }) => {
  // Defensive logic to find the best image URL from the new S3 structure
  const imageUrl = product.image || (product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/300?text=Painting+Shop');

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 flex flex-col h-full relative">
      {/* Product Image Section */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Link to={`/product/${product._id}`}>
          <img 
            src={imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            loading="lazy"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/300?text=No+Image+Available'; }}
          />
        </Link>
        
        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.tag && (
            <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-lg shadow-indigo-200 uppercase tracking-wider">
              {product.tag}
            </span>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-lg shadow-amber-200 uppercase tracking-wider">
              Low Stock
            </span>
          )}
        </div>

        {/* Quick Action Overlay */}
        <div className="absolute bottom-4 left-0 right-0 px-4 translate-y-12 group-hover:translate-y-0 transition-transform duration-300">
           <Link 
            to={`/product/${product._id}`}
            className="w-full py-3 bg-white/95 backdrop-blur-md text-gray-900 rounded-xl text-sm font-bold shadow-xl flex items-center justify-center gap-2 hover:bg-indigo-600 hover:text-white transition-all active:scale-95"
           >
             View Details
           </Link>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-full">
            {product.category}
          </span>
          <div className="flex items-center text-amber-400 gap-0.5">
            <Star size={12} fill="currentColor" />
            <span className="text-xs font-bold text-gray-400">4.8</span>
          </div>
        </div>

        <Link to={`/product/${product._id}`}>
          <h3 className="text-gray-900 font-bold text-base line-clamp-1 group-hover:text-indigo-600 transition-colors mb-1">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-gray-400 text-xs line-clamp-2 mb-4 leading-relaxed flex-grow">
          {product.description || 'Professional grade finish for ultimate results.'}
        </p>

        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 block mb-0.5">Starting at</span>
            <span className="text-xl font-black text-gray-900">₹{product.price.toLocaleString()}</span>
          </div>
          
          <button 
            className="w-10 h-10 bg-gray-50 text-gray-900 rounded-xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all active:scale-90 shadow-sm"
            title="Add to wishlist"
          >
            <Heart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;