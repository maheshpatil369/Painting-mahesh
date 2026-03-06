// File: Frontend/src/pages/Services.jsx
import React from 'react';
import { Mail, Phone, TrendingUp, Shield, Star, Award, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const Services = () => {

    const serviceOptions = [
        { 
            icon: TrendingUp, 
            title: "Partner Program", 
            description: "For professional painting businesses, we offer a partner program with special conditions, volume discounts, and priority technical support.", 
            contact: "partner@kustomkoats.in" 
        },
        { 
            icon: Settings,
            title: "Distribution Trade", 
            description: "Wholesalers and specialized dealers can include Xtreme Kolorz pigments in their trade program. We can easily produce 500 liters per week.", 
            contact: "partner@kustomkoats.in" 
        },
        { 
            icon: Shield, 
            title: "Technical Support", 
            description: "Our technical team provides one-on-one support and advice on mixing ratios and application techniques. Your project success is our priority.", 
            contact: "info@kustomkoats.in" 
        },
    ];

    const testimonials = [
        { quote: "They have done work on a few of my cars now and the partnership throughout the build keeps me coming back. Looking forward to more work in the future.", name: "Doug D", title: "Customer", rating: 5 },
        { quote: "Couldn't be happier with my supercharged Vette, this thing is a ripper now! The paint quality is insane.", name: "David M", title: "Customer", rating: 5 },
        { quote: "The depth and finish of the Carbon Red is unmatched. Our clients demand the best, and Xtreme Kolorz delivers.", name: "Priya S.", title: "Master Painter, Pune", rating: 5 },
    ];

    const StarRating = ({ count }) => (
        <div className="flex text-yellow-400 mt-2">
            {[...Array(5)].map((_, i) => (
                <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < count ? 'fill-yellow-400' : 'fill-transparent'}`} 
                />
            ))}
        </div>
    );

    return (
        <div className="bg-gray-50 min-h-screen py-16">
            <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-3xl sm:text-5xl font-black text-black italic uppercase mb-4 leading-tight">
                        Professional Services & Support
                    </h1>
                    <p className="text-gray-600 text-base sm:text-xl max-w-3xl mx-auto leading-relaxed">
                        Dedicated programs for professional painters, resellers, and technical experts.
                    </p>
                </div>

                {/* Business Solutions */}
                <h2 className="text-2xl sm:text-4xl font-black italic text-black uppercase mb-10 border-b pb-4 border-gray-300">
                    Business Solutions
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-20">

                    {serviceOptions.map((service, index) => (
                        <div 
                            key={index} 
                            className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all"
                        >
                            <service.icon className="h-10 w-10 text-sky-500 mb-4" />

                            <h3 className="text-xl sm:text-2xl font-black mb-3">{service.title}</h3>

                            <p className="text-gray-600 text-sm sm:text-base mb-6 leading-relaxed">
                                {service.description}
                            </p>

                            <div className="pt-4 border-t border-gray-200">
                                <p className="text-gray-500 text-xs sm:text-sm font-semibold mb-1">Contact for Details:</p>

                                <div className="flex items-center text-black text-sm">
                                    <Phone className="h-4 w-4 mr-2 text-sky-500" />
                                    +91 777 50 777 52
                                </div>

                                <div className="flex items-center text-sky-500 text-sm mt-1">
                                    <Mail className="h-4 w-4 mr-2" /> 
                                    {service.contact}
                                </div>
                            </div>
                        </div>
                    ))}

                </div>

                {/* Testimonials */}
                <div className="text-center mb-10">
                    <Award className="h-8 w-8 text-red-500 mx-auto mb-3" />
                    <h2 className="text-3xl sm:text-4xl font-black italic uppercase">
                        What People Say About Us
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">

                    {testimonials.map((review, index) => (
                        <div 
                            key={index} 
                            className="bg-black text-white p-6 sm:p-8 rounded-xl shadow-xl border border-red-500/40 relative overflow-hidden"
                        >
                            <span className="absolute top-2 left-2 text-[80px] sm:text-[100px] font-serif font-black text-red-600 opacity-20 leading-none select-none">
                                "
                            </span>

                            <blockquote className="text-sm sm:text-lg italic text-gray-300 mb-6 relative z-10 leading-relaxed">
                                "{review.quote}"
                            </blockquote>

                            <div className="font-black text-lg sm:text-xl relative z-20">
                                {review.name}
                                <p className="text-xs sm:text-sm text-red-400 font-normal">{review.title}</p>
                                <StarRating count={review.rating} />
                            </div>
                        </div>
                    ))}

                </div>

            </div>
        </div>
    );
};

export default Services;
