// File: Frontend/src/pages/About.jsx
import React from 'react';
import { Car, Factory, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
    const infoBlocks = [
        { icon: Car, title: "Automotive Origin", description: "Kustom Koats was born to offer premium-quality finishes for the customization industry.", color: "text-sky-500" },
        { icon: Zap, title: "No Rust, No Tarnish", description: "Our pigments are mica/silica-based, non-metallic and fully corrosion resistant.", color: "text-red-500" },
        { icon: Factory, title: "Made in India", description: "Manufactured in Pune, supplying professional painters and automotive builders across India.", color: "text-emerald-500" },
        { icon: ShieldCheck, title: "Technical Expertise", description: "Expert guidance on mixing ratios, application techniques and custom project support.", color: "text-black" },
    ];

    return (
        <div className="bg-white min-h-screen py-16">
            <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

                {/* HERO BLOCK - SMALLER IMAGE + COMPACT LAYOUT */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-emerald-50/70 border border-emerald-200 rounded-2xl shadow-xl overflow-hidden mb-16">

                    <div className="relative h-44 sm:h-56 md:h-full min-h-[220px]">
                        <img
                            src="https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80"
                            alt="Custom painting"
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = "https://placehold.co/600x400"; }}
                        />

                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <div className="group w-12 h-12 bg-red-600 rounded-full flex items-center justify-center cursor-pointer transition-all hover:bg-red-700 hover:scale-110 shadow-lg">
                                <ArrowRight className="w-6 h-6 text-white ml-1 group-hover:translate-x-1 transition-all" />
                            </div>
                        </div>
                    </div>

                    <div className="p-6 sm:p-10 flex flex-col justify-center space-y-4">
                        <span className="text-black font-black uppercase tracking-widest text-sm">
                            About Us
                        </span>

                        <h1 className="text-3xl sm:text-4xl font-black text-red-600 italic leading-tight">
                            Striving For Excellence <br /> Is Our Mission
                        </h1>

                        <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                            At Xtreme Kolorz, we deliver professional-grade automotive pearls with unmatched technical guidance.
                        </p>

                        <p className="text-gray-600 text-sm leading-relaxed">
                            Our team invests continuously in better machinery, tools and R&D to produce world-class finishes.
                        </p>

                        <Link
                            to="/services"
                            className="bg-red-600 text-white font-black py-2.5 px-6 rounded-sm hover:bg-red-700 transition-all uppercase tracking-widest shadow-lg w-fit"
                        >
                            Learn More
                        </Link>
                    </div>
                </div>

                {/* IMPROVED – BIGGER CORE PRINCIPLE CARDS */}
                <h2 className="text-center text-3xl sm:text-4xl font-black italic uppercase mb-10">
                    Our Core Principles
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

                    {infoBlocks.map((block, i) => (
                        <div
                            key={i}
                            className="group relative p-8 bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 min-h-[220px]"
                        >
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-sky-100 via-white to-sky-50"></div>

                            <div className="relative flex flex-col items-center text-center space-y-4">

                                <div className="p-4 rounded-full bg-gray-100 group-hover:bg-sky-100 transition-colors shadow">
                                    <block.icon className={`h-9 w-9 ${block.color}`} />
                                </div>

                                <h3 className="text-lg sm:text-xl font-black">{block.title}</h3>

                                <p className="text-sm text-gray-600 leading-relaxed px-2">
                                    {block.description}
                                </p>

                            </div>
                        </div>
                    ))}

                </div>

            </div>
        </div>
    );
};

export default About;