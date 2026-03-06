// File: Frontend/src/pages/Shop.jsx
import React, { useState, useEffect } from 'react';
import { Filter, ChevronDown, Loader2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { fetchAllProducts } from '../services/productService';

const Shop = ({ onAddToCart }) => {
  const location = useLocation();
  const initialCategory = location.state?.category || 'All';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [sortMethod, setSortMethod] = useState('Featured');

  // Fetch products from API
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchAllProducts();
        setProducts(data);
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    if (location.state?.category) {
      setActiveCategory(location.state.category);
    }
  }, [location.state]);

  const categories = [
    'All',
    'Solid Pearls',
    'Interference Pearls',
    'Carbon Pearls',
    'OEM+ Pearls',
    'Special Effect Pearls',
    'Chroma Pearls'
  ];

  let filteredProducts =
    activeCategory === 'All'
      ? [...products]
      : products.filter(p => p.category === activeCategory);

  if (sortMethod === 'PriceLow') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortMethod === 'PriceHigh') {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-sky-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-sky-500 text-white px-6 py-2 rounded-lg hover:bg-sky-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-black italic uppercase mb-3">
            Shop All Colors
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
            Browse our complete collection of automotive-grade pearl pigments.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* LEFT SIDEBAR (UNCHANGED POSITION, ONLY UI IMPROVED) */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-md sticky top-24">

              <div className="flex items-center mb-4">
                <Filter className="h-4 w-4 text-black mr-2" />
                <h3 className="text-black font-black uppercase tracking-wider text-sm">
                  Categories
                </h3>
              </div>

              <div className="space-y-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`block w-full text-left px-4 py-2 text-sm rounded-md transition-all ${
                      activeCategory === cat
                        ? 'bg-black text-white font-black shadow-md'
                        : 'text-gray-700 hover:bg-gray-200 hover:text-black'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

            </div>
          </div>

          {/* PRODUCT LIST */}
          <div className="flex-1">

            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-500 text-sm">
                Showing {filteredProducts.length} results
              </p>

              <div className="relative">
                <select
                  value={sortMethod}
                  onChange={(e) => setSortMethod(e.target.value)}
                  className="bg-white border border-gray-300 py-2 pl-3 pr-8 rounded-md text-black text-sm font-bold cursor-pointer focus:ring-1 focus:ring-sky-500"
                >
                  <option value="Featured">Featured</option>
                  <option value="PriceLow">Price: Low to High</option>
                  <option value="PriceHigh">Price: High to Low</option>
                </select>

                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
              ))}

              {filteredProducts.length === 0 && (
                <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl text-gray-500">
                  No products found in this category.
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Shop;
