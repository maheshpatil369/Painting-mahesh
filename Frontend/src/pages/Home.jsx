// File: Frontend/src/pages/Home.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Droplets, Car, Zap, PaintBucket, Loader2 } from 'lucide-react';
import ProductCard from '../components/ProductCard.jsx';
import { fetchFeaturedProducts, fetchAllProducts } from '../services/productService';

const Home = ({ onAddToCart }) => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const featured = await fetchFeaturedProducts();
        setFeaturedProducts(featured);
        
        const allProducts = await fetchAllProducts();
        setTotalProducts(allProducts.length);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const allCategories = [
    { name: 'Solid Pearls', image: 'https://images.unsplash.com/photo-1503376763036-066120622c74?auto=format&fit=crop&q=80&w=600', desc: 'Single & Metallic Tones' },
    { name: 'Interference Pearls', image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=600', desc: 'Iridescent Ghost Effects' },
    { name: 'Carbon Pearls', image: 'https://images.unsplash.com/photo-1562911791-c7a97b729ec5?auto=format&fit=crop&q=80&w=600', desc: 'Highly Concentrated Metallics' },
    { name: 'OEM+ Pearls', image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=600', desc: 'Subtle Holographic Factory Looks' },
    { name: 'Special Effect Pearls', image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=600', desc: 'Optically Variable Color Shift' },
    { name: 'Chroma Pearls', image: 'https://images.unsplash.com/photo-1566008885218-90abf9200ddb?auto=format&fit=crop&q=80&w=600', desc: 'Vivid 5-6 Color Flips' },
  ];

  const features = [
    { icon: Droplets, title: 'Micro-Fine Pigments', desc: 'Superior dispersion for flawless flow and application.', color: 'text-sky-500' },
    { icon: Car, title: 'Automotive Grade', desc: 'Tested and proven for long-lasting, deep color on vehicles.', color: 'text-black' },
    { icon: Zap, title: 'Vivid Color Shift', desc: 'Chroma pearls offer extreme, multi-dimensional optical variability.', color: 'text-red-500' },
    { icon: PaintBucket, title: 'Mix Ratio Ready', desc: 'Optimized for mixing with all major clear coat systems.', color: 'text-emerald-500' },
  ];

  const galleryImages = [
    'https://images.unsplash.com/photo-1596700812970-205167664f3d?auto=format&fit=crop&q=80&w=400&h=300',
    'https://images.unsplash.com/photo-1596700812970-205167664f3d?auto=format&fit=crop&q=80&w=400&h=600',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=400&h=300',
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=400&h=600',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=400&h=300',
    'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=400&h=600',
    'https://images.unsplash.com/photo-1503376763036-066120622c74?auto=format&fit=crop&q=80&w=400&h=300',
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=400&h=600',
  ].slice(0, 8);

  return (
    <div className="bg-white">

      {/* HERO SECTION */}
      <div className="relative h-[75vh] sm:h-[90vh] min-h-[550px] w-full overflow-hidden">

        <img
          src="https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=1920"
          alt="Custom painted car finish"
          className="w-full h-full object-cover object-center scale-105 transition-transform duration-[5000ms] hover:scale-110"
        />

        <div className="absolute inset-0 bg-black/60"></div>

        <div className="absolute inset-0 flex items-center z-20">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="max-w-2xl animate-fade-in">

              <span className="text-white font-semibold tracking-[0.2em] uppercase mb-3 block text-sm sm:text-base">
                Unlock the Ultimate Finish
              </span>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white mb-4 leading-tight italic drop-shadow-2xl">
                XTREME <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-white">
                  PEARL PIGMENTS
                </span>
              </h1>

              <p className="text-gray-200 text-base sm:text-lg mb-8 max-w-lg">
                Engineered for maximum depth, durability, and mesmerizing color shift effects.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/shop"
                  className="bg-sky-500 text-white font-bold py-3 px-8 rounded-sm hover:bg-sky-600 hover:shadow-lg transition-all tracking-wider uppercase text-sm sm:text-base"
                >
                  Shop All Colors
                </Link>

                <Link
                  to="/contact"
                  className="bg-transparent border border-white text-white hover:bg-white hover:text-black transition-all py-3 px-8 font-semibold rounded-sm tracking-wider uppercase text-sm sm:text-base"
                >
                  Get Technical Advice
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">

          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-start p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <div className="p-3 rounded-full bg-gray-100 mr-4">
                <feature.icon className={`h-7 w-7 ${feature.color}`} />
              </div>

              <div>
                <h3 className="text-lg font-black">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.desc}</p>
              </div>
            </div>
          ))}

        </div>
      </div>

      {/* GALLERY */}
      <section className="bg-gray-100 py-16 border-t border-gray-300">
        <div className="max-w-7xl mx-auto px-5 text-center">

          <p className="text-red-600 font-bold uppercase tracking-widest text-xs sm:text-sm mb-2">
            Projects
          </p>

          <h2 className="text-3xl sm:text-4xl font-black italic uppercase mb-10">
            Work We've Done
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5">

            {galleryImages.map((src, idx) => (
              <div
                key={idx}
                className={`relative overflow-hidden rounded-xl group shadow-md hover:shadow-xl transition-all ${
                  idx % 4 === 0 ? "row-span-2" : ""
                }`}
              >
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-all"></div>
              </div>
            ))}

          </div>

          <Link
            to="/services"
            className="inline-flex items-center text-sky-500 font-black hover:text-black uppercase tracking-wider text-sm mt-8"
          >
            See More Projects <ArrowRight className="ml-2 h-4 w-4" />
          </Link>

        </div>
      </section>

      {/* CATEGORIES */}
      <div className="max-w-7xl mx-auto px-5 py-16">
        <h2 className="text-center text-3xl sm:text-4xl font-black italic uppercase mb-3">
          Explore Our <span className="text-sky-500">6 Pearl Series</span>
        </h2>

        <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto text-sm sm:text-lg">
          From solid metallics to extreme color-shifting chromas.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">

          {allCategories.map((cat, idx) => (
            <Link
              to="/shop"
              key={idx}
              state={{ category: cat.name }}
              className="relative h-56 sm:h-64 group overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all"
            >
              <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

              <div className="absolute bottom-5 left-5">
                <h3 className="text-xl sm:text-2xl text-white font-black italic">{cat.name}</h3>
                <p className="text-xs sm:text-sm text-sky-400 font-semibold">{cat.desc}</p>
              </div>
            </Link>
          ))}

        </div>
      </div>

      {/* TRENDING PRODUCTS */}
      <div className="bg-gray-100 py-16 border-y border-gray-300">
        <div className="max-w-7xl mx-auto px-5">

          <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black italic uppercase">
                Trending Pigments
              </h2>
              <p className="text-gray-600 mt-2 text-sm sm:text-lg">
                Best-selling solid and chroma color shift pigments.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              <div className="col-span-full flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
              </div>
            ) : (
              <>
                {featuredProducts.map(prod => (
                  <ProductCard key={prod.id || prod._id} product={prod} onAddToCart={onAddToCart} />
                ))}

                <Link
                  to="/shop"
                  className="group flex flex-col items-center justify-center bg-black rounded-xl p-6 text-center hover:border-sky-500 border-2 border-transparent transition-all"
                >
                  <h3 className="text-white text-xl sm:text-2xl font-black italic mb-2 group-hover:text-sky-500">
                    View All {totalProducts}+ Colors
                  </h3>

                  <ArrowRight className="mt-3 h-8 w-8 text-sky-500 group-hover:text-white group-hover:bg-sky-500 p-1 rounded-full transition-all" />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* CHROMA CTA */}
      <div className="max-w-7xl mx-auto px-5 py-20">
        <div className="bg-black text-white p-8 sm:p-14 rounded-xl shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

          <div>
            <span className="text-red-500 uppercase tracking-widest text-xs sm:text-sm font-bold mb-3 block">
              The Exotic Finish
            </span>

            <h2 className="text-3xl sm:text-5xl font-black italic leading-tight mb-5">
              Unleash the <span className="text-sky-500">Chroma Flip</span>
            </h2>

            <p className="text-gray-300 text-sm sm:text-lg mb-6">
              Chroma Pearls exhibit 5–6 dramatic color transitions depending on angle & light.
            </p>

            <Link
              to="/shop"
              className="bg-sky-500 px-6 py-3 rounded-sm shadow-lg hover:bg-sky-600 transition-all uppercase font-black tracking-wide text-sm"
            >
              Explore Chroma Series
            </Link>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-indigo-700 via-purple-700 to-red-500 h-56 flex justify-center items-center shadow-inner">
            <p className="text-white/70 text-lg sm:text-2xl font-black italic">CHROMA PREVIEW</p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Home;
