// File: Frontend/src/pages/ProductPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Truck, ShieldCheck, Droplets, Plus, Minus, Microscope, Palette, ChevronRight, ArrowRight, Loader2 } from 'lucide-react'; 
import ProductCard from '../components/ProductCard';
import { fetchProductById, fetchAllProducts } from '../services/productService';

const ProductPage = ({ onAddToCart }) => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Fetch product and related products
  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError('');
      try {
        // Fetch the current product
        const productData = await fetchProductById(id);
        setProduct(productData);
        
        // Fetch all products to get related ones
        const allProducts = await fetchAllProducts();
        const related = allProducts
          .filter(p => p.category === productData.category && (p._id !== productData._id && p.id !== productData.id))
          .slice(0, 4);
        setRecommendedProducts(related);
      } catch (err) {
        console.error('Error loading product:', err);
        setError(err.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-sky-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Product not found'}</p>
          <Link to="/shop" className="text-sky-500 hover:text-sky-600 font-bold">
            ← Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setQuantity(1); 
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  const unitPrice = product.price; 
  const currentTotalPrice = unitPrice * quantity;

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
         <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-6 flex items-center space-x-1">
           <Link to="/" className="hover:text-black">Home</Link>
           <ChevronRight size={12} />
           <Link to="/shop" className="hover:text-black">Shop</Link>
           <ChevronRight size={12} />
           <span className="text-black">{product.name}</span>
         </div>
         
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="bg-gray-100 border border-gray-200 rounded-lg overflow-hidden p-8 flex items-center justify-center shadow-lg">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-auto object-cover mix-blend-multiply rounded-lg"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x600/e5e7eb/4b5563?text=Xtreme+Kolorz"; }}
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-gray-100 aspect-square border border-gray-200 hover:border-sky-500 cursor-pointer p-2 rounded-lg transition-colors">
                  {/* Using placeholder images for thumbnails */}
                  <img 
                    src={`https://placehold.co/100x100/e5e7eb/4b5563?text=Sample+${i}`} 
                    alt="Thumbnail" 
                    className="w-full h-full object-cover" 
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x100/e5e7eb/4b5563?text=Error"; }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info & Purchase Controls */}
          <div className="text-black">
            <p className="text-sky-500 font-bold uppercase tracking-wider text-sm mb-2">{product.category}</p>
            <h1 className="text-4xl font-black italic mb-2">{product.name}</h1>
            
            {/* Price section */}
            <p className="text-xl font-mono mb-6 font-bold">
              Unit Price: ₹{unitPrice} / 100ml 
            </p>
            
            <p className="text-gray-600 mb-8 leading-relaxed">
              {product.description} Ideal for automotive customization. Can be used for special effect finishes over a base coat.
            </p>

            {/* Quantity Selector and Total Price */}
            <div className="flex items-center space-x-6 mb-8">
              <div className="flex items-center border border-gray-300 rounded-sm">
                <button 
                  onClick={decrementQuantity} 
                  className="p-3 text-black hover:bg-gray-100 transition-colors disabled:opacity-50"
                  disabled={quantity === 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <input 
                  type="number" 
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 text-center text-black font-bold focus:outline-none bg-white"
                  min="1"
                />
                <button 
                  onClick={incrementQuantity} 
                  className="p-3 text-black hover:bg-gray-100 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <p className="text-2xl font-black italic">
                Total: <span className="text-sky-500 font-mono">₹{currentTotalPrice}</span>
              </p>
            </div>

            <button 
              onClick={handleAddToCart}
              className="w-full bg-black text-white font-bold py-4 uppercase tracking-widest hover:bg-sky-500 transition-colors flex items-center justify-center mb-8 shadow-lg rounded-sm"
            >
              <ShoppingCart className="mr-2 h-5 w-5" /> Add {quantity} x 100ml to Cart
            </button>
            
            {/* Technical Specifications / Shade Details */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-inner">
                <div className="flex items-center mb-3">
                    <Microscope className="h-6 w-6 text-red-600 mr-3" />
                    <h4 className="font-black text-black uppercase text-sm">Pigment Technology (Shade Details)</h4>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                    This **{product.category}** pigment is a very fine inorganic, mica-based tinter coated with metal oxides. It is semi-transparent, allowing you to use different colored base coats for unique, customized shade results. 
                </p>
                <ul className="mt-4 space-y-1 text-sm text-gray-600">
                    <li className='flex items-center'><Palette className='h-4 w-4 mr-2 text-sky-500'/> **Color Depth:** Enhanced layering for intense, non-flat color.</li>
                    <li className='flex items-center'><Droplets className='h-4 w-4 mr-2 text-sky-500'/> **Base Coat Compatibility:** Works best over medium-to-dark base coats (varies by pearl type).</li>
                </ul>
            </div>


            {/* Shipping & Mixing Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-gray-200 pt-8 mt-8">
              <div className="flex flex-col items-center text-center">
                <Droplets className="h-8 w-8 text-sky-500 mb-3" />
                <h4 className="font-bold text-sm uppercase">Mixing</h4>
                <p className="text-xs text-gray-500 mt-1">Mix with clear coat. 100ml treats approx 2-3 liters.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <ShieldCheck className="h-8 w-8 text-sky-500 mb-3" />
                <h4 className="font-bold text-sm uppercase">Durability</h4>
                <p className="text-xs text-gray-500 mt-1">UV Resistant, Non-toxic, Rust-free Mica.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Truck className="h-8 w-8 text-sky-500 mb-3" />
                <h4 className="font-bold text-sm uppercase">Shipping</h4>
                <p className="text-xs text-gray-500 mt-1">Ships within 7 business days from Pune.</p>
              </div>
            </div>
          </div>

        </div>

        {/* --- Recommended Products Section (New) --- */}
        {recommendedProducts.length > 0 && (
          <div className="mt-20 border-t border-gray-200 pt-16">
            <h2 className="text-3xl font-black text-black italic uppercase mb-10 text-center">
              More {product.category} Pigments
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedProducts.map(recProduct => (
                <ProductCard key={recProduct.id || recProduct._id} product={recProduct} onAddToCart={onAddToCart} />
              ))}
            </div>
            
            <div className="text-center mt-12">
               <Link 
                to="/shop" 
                state={{ category: product.category }}
                className="inline-flex items-center text-black font-black hover:text-sky-500 uppercase tracking-wider text-base transition-colors border-b-2 border-black hover:border-sky-500"
              >
                View All {product.category} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductPage;