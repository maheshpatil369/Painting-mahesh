// File: Frontend/src/components/Footer.jsx
import React from 'react';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    // Changed footer to a premium black theme
    <footer className="bg-black text-gray-300 pt-16 pb-8 border-t border-sky-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="text-2xl font-black italic text-white mb-6 block">
              XTREME <span className="text-sky-500">KOLORZ</span>
            </Link>
            <p className="text-sm mb-6 text-gray-400">
              Showcasing the finest automotive grade pearls. Non-toxic, inert, and rust-free mica-based pigments for the ultimate finish.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-sky-500 cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-sky-500 cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-sky-500 cursor-pointer transition-colors" />
            </div>
          </div>

          <div>
            <h3 className="text-white font-black uppercase tracking-wider mb-4 text-sm">Shop</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/shop" className="hover:text-sky-500 transition-colors">Solid Pearls</Link></li>
              <li><Link to="/shop" className="hover:text-sky-500 transition-colors">Interference Pearls</Link></li>
              <li><Link to="/shop" className="hover:text-sky-500 transition-colors">Carbon Pearls</Link></li>
              <li><Link to="/shop" className="hover:text-sky-500 transition-colors">Chroma Pearls</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-black uppercase tracking-wider mb-4 text-sm">Support</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-sky-500 transition-colors">Mixing Guide</a></li>
              <li><a href="#" className="hover:text-sky-500 transition-colors">Wholesale</a></li>
              <li><a href="#" className="hover:text-sky-500 transition-colors">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-sky-500 transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-black uppercase tracking-wider mb-4 text-sm">Contact</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-sky-500 flex-shrink-0" />
                <span>Pune, Maharashtra, India<br />411048</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-sky-500" />
                <span>+91 777 50 777 52</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-sky-500" />
                <span>info@kustomkoats.in</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-zinc-800 mt-16 pt-8 text-center text-xs text-gray-600">
          <p>&copy; 2025 Xtreme Kolorz. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;