import React from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const Contact = () => {
  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black text-black italic uppercase mb-4">Contact Us</h1>
          <p className="text-gray-500">Get in touch for wholesale inquiries or technical support.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Info Card */}
          <div className="bg-gray-50 p-8 border border-gray-200 rounded-sm shadow-sm">
            <h2 className="text-2xl font-bold text-black mb-8">Headquarters</h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <MapPin className="h-6 w-6 text-sky-500 mt-1 mr-4" />
                <div>
                  <h3 className="text-black font-bold uppercase text-sm">Address</h3>
                  <p className="text-gray-600 mt-1">
                    Kustom Koats<br/>
                    Near Trinity College, Yevlewadi - Kondhwa<br/>
                    Pune, Maharashtra 411048, India
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="h-6 w-6 text-sky-500 mt-1 mr-4" />
                <div>
                  <h3 className="text-black font-bold uppercase text-sm">Phone</h3>
                  <p className="text-gray-600 mt-1">+91 777 50 777 52</p>
                </div>
              </div>

              <div className="flex items-start">
                <Mail className="h-6 w-6 text-sky-500 mt-1 mr-4" />
                <div>
                  <h3 className="text-black font-bold uppercase text-sm">Email</h3>
                  <p className="text-gray-600 mt-1">info@kustomkoats.in</p>
                  <p className="text-gray-600">sales@kustomkoats.in</p>
                </div>
              </div>

              <div className="flex items-start">
                <Clock className="h-6 w-6 text-sky-500 mt-1 mr-4" />
                <div>
                  <h3 className="text-black font-bold uppercase text-sm">Business Hours</h3>
                  <p className="text-gray-600 mt-1">Mon - Sat: 10:00 AM - 7:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white p-8 border border-gray-200 rounded-sm shadow-md">
            <h2 className="text-2xl font-bold text-black mb-8">Send a Message</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2 uppercase">Name</label>
                <input type="text" className="w-full bg-white border border-gray-300 rounded-sm py-3 px-4 text-black focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500" />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2 uppercase">Email</label>
                <input type="email" className="w-full bg-white border border-gray-300 rounded-sm py-3 px-4 text-black focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500" />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2 uppercase">Message</label>
                <textarea rows="4" className="w-full bg-white border border-gray-300 rounded-sm py-3 px-4 text-black focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"></textarea>
              </div>
              <button type="button" className="w-full bg-black text-white font-bold py-4 uppercase tracking-widest hover:bg-sky-500 transition-colors shadow-lg">
                Send Message
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;