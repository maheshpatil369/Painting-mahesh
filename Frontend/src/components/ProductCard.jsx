import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { API_URL as BACKEND_URL } from '../config.js';

const ProductCard = ({ product, onAddToCart }) => {

  // Helper to build full image URL
  const formatImageUrl = (img) => {
    if (!img) return "https://placehold.co/600x400?text=No+Image";
    if (img.startsWith('http') || img.startsWith('blob')) return img;

    const normalizedPath = img.replace(/\\/g, '/');
    const cleanImg = normalizedPath.startsWith('/') ? normalizedPath.slice(1) : normalizedPath;
    const baseUrl = BACKEND_URL.replace('/api', '');

    return `${baseUrl}/${cleanImg}`;
  };

  const discountedPrice = Math.round(product.price * 1.15);

  return (
    <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.05)] group hover:shadow-[0_30px_60px_rgba(0,0,0,0.1)] transition-all duration-700 border border-gray-50 flex flex-col h-full">

      {/* Image Section */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#F8F8F8]">

        {/* Click Image → Open Product Detail */}
        <Link to={`/product/${product._id}`}>
          <img
            src={formatImageUrl(product.images?.[0])}
            alt={product.name}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
            loading="lazy"
            onError={(e) => {
              e.target.src = "https://placehold.co/600x800?text=Image+Unavailable";
            }}
          />
        </Link>

        {/* Tag Badge */}
        <div className="absolute top-6 left-6 flex flex-col gap-2">
          {product.tag && (
            <span className="bg-black text-white text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full shadow-2xl backdrop-blur-md">
              {product.tag}
            </span>
          )}
        </div>

        {/* Quick Add Button */}
        <div className="absolute bottom-6 right-6 translate-y-20 group-hover:translate-y-0 transition-all duration-500 opacity-0 group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.preventDefault();
              onAddToCart(product);
            }}
            className="bg-white text-black p-5 rounded-full shadow-2xl hover:bg-black hover:text-white transition-all transform active:scale-90"
          >
            <ShoppingCart size={22} />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-8 flex flex-col flex-grow">
        <div className="mb-6">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 mb-2">
            {product.category}
          </p>

          {/* Click Name → Open Product Detail */}
          <Link to={`/product/${product._id}`} className="block">
            <h3 className="text-2xl font-black text-black leading-none tracking-tighter group-hover:opacity-60 transition-opacity uppercase italic">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="mt-auto flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-300 line-through tracking-tighter mb-1">
              ₹{discountedPrice.toLocaleString()}
            </span>
            <span className="text-3xl font-black text-black leading-none">
              ₹{product.price.toLocaleString()}
            </span>
          </div>

          <div
            className={`text-[10px] font-black uppercase tracking-widest ${
              product.stock > 0 ? 'text-gray-400' : 'text-red-500'
            }`}
          >
            {product.stock > 0
              ? `${product.stock} IN STOCK`
              : 'SOLD OUT'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;