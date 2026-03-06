// File: Frontend/src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext.jsx';
import { API_URL as BACKEND_URL } from '../config';
import { ShoppingCart, DollarSign, Users, TrendingUp, TrendingDown, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

// --- Backend URL Configuration ---
const API_DASHBOARD_ENDPOINT = `${BACKEND_URL}/dashboard/kpis`;
const API_HISTORY_ENDPOINT = `${BACKEND_URL}/dashboard/history`;

// --- Mock Data Structure for API Response ---
const defaultKpis = [
    { icon: DollarSign, title: "Total Revenue (YTD)", value: "Loading...", trend: 0, color: "text-gray-500" },
    { icon: ShoppingCart, title: "Orders Processed", value: "Loading...", trend: 0, color: "text-gray-500" },
    { icon: Users, title: "New Customers", value: "Loading...", trend: 0, color: "text-gray-500" },
    { icon: Package, title: "Inventory Value", value: "Loading...", trend: 0, color: "text-gray-500" },
];
const defaultHistory = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];


const SalesChart = ({ data }) => {
    const maxVal = Math.max(...data);
    
    return (
        <div className="p-4">
            <h3 className="text-lg font-black mb-4">Monthly Sales Progress (Lakh ₹)</h3>
            <div className="flex items-end h-40 space-x-2 border-l border-b border-gray-400 pb-2">
                {data.map((value, index) => (
                    <div 
                        key={index} 
                        style={{ height: `${(value / maxVal) * 100}%` }} 
                        className="w-4 bg-sky-500 hover:bg-sky-600 transition-colors rounded-t-sm relative group"
                    >
                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 text-xs text-black opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                            {value}L
                        </span>
                    </div>
                ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
                {["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"].map((month, i) => (
                    <span key={i}>{month}</span>
                ))}
            </div>
        </div>
    );
};


const AdminDashboard = () => {
    const { isAdmin, accessToken } = useAuth();
    const [kpis, setKpis] = useState(defaultKpis);
    const [salesHistory, setSalesHistory] = useState(defaultHistory);
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const headers = {};
            if (accessToken) {
                headers['Authorization'] = `Bearer ${accessToken}`;
            }
            
            // 1. Fetch KPIs
            const kpiResponse = await fetch(API_DASHBOARD_ENDPOINT, { headers });
            const kpiData = await kpiResponse.json();

            // 2. Fetch Sales History (for Chart)
            const historyResponse = await fetch(API_HISTORY_ENDPOINT, { headers });
            const historyData = await historyResponse.json();

            // --- SIMULATION LOGIC ---
            if (!kpiResponse.ok || !historyResponse.ok) {
                 console.warn("Backend API not reachable. Using mock default data.");
                 // Fallback Mock Data if API fails
                 setKpis([
                    { icon: DollarSign, title: "Total Revenue (YTD)", value: "₹1.2 Cr", trend: 15, color: "text-emerald-500" },
                    { icon: ShoppingCart, title: "Orders Processed", value: "850", trend: 8, color: "text-sky-500" },
                    { icon: Users, title: "New Customers", value: "120", trend: -5, color: "text-red-500" },
                    { icon: Package, title: "Inventory Value", value: "₹45 Lakh", trend: 0, color: "text-black" },
                 ]);
                 setSalesHistory([20, 35, 45, 60, 50, 75, 80, 95, 110, 100, 120, 140]);
                 return;
            }
            // --- END SIMULATION LOGIC ---

            // Use real fetched data (Assuming the backend returns data in the expected structure)
            setKpis(kpiData.kpis.map(kpi => ({ 
                ...kpi, 
                icon: kpis[kpi.id]?.icon || DollarSign, // Preserve Lucide icons
                color: kpis[kpi.id]?.color || 'text-black' 
            })));
            setSalesHistory(historyData.history);

        } catch (error) {
            console.error("Critical error during dashboard data fetch:", error);
            // Default to mock data on error
            setKpis(defaultKpis); 
            setSalesHistory(defaultHistory);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAdmin) {
            fetchDashboardData();
        } else if (!isAdmin) {
            setLoading(false);
        }
    }, [isAdmin]);


    if (!isAdmin) return <div className="text-center py-20 text-red-500 font-bold">Access Denied: Admin required.</div>;
    if (loading) return <div className="text-center py-20 text-black">Loading Dashboard Data...</div>;


    return (
        <div className="bg-gray-100 min-h-[calc(100vh-80px)] py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-black text-black italic uppercase mb-10">Admin Dashboard</h1>
                
                 <p className="text-sm text-gray-600 mb-6 flex items-center">
                    Data Fetched From: <code className="bg-gray-200 p-1 rounded text-xs ml-2">{BACKEND_URL}</code>
                </p>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {kpis.map((kpi, index) => (
                        <div key={kpi.title || index} className="bg-white p-6 rounded-lg shadow-xl border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <kpi.icon className={`h-8 w-8 ${kpi.color}`} />
                                <span className={`text-sm font-bold flex items-center ${kpi.trend > 0 ? 'text-emerald-500' : kpi.trend < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                                    {kpi.trend !== 0 && (kpi.trend > 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />)}
                                    {Math.abs(kpi.trend)}%
                                </span>
                            </div>
                            <p className="text-3xl font-black italic text-black mb-1">{kpi.value}</p>
                            <h3 className="text-sm font-bold uppercase text-gray-500">{kpi.title}</h3>
                        </div>
                    ))}
                </div>
                
                {/* Sales Charts and History */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Sales Progress Chart */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-xl border border-gray-200">
                        <SalesChart data={salesHistory} />
                    </div>
                    
                    {/* Recent Orders/Activity */}
                    <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-xl border border-gray-200">
                        <h3 className="text-xl font-black italic mb-4 border-b pb-3 text-black">Recent Activity</h3>
                        <ul className="space-y-4 text-sm">
                            <li className="flex justify-between items-center text-gray-700"><span>Order #890 placed</span><span className="text-xs text-gray-500">2 min ago</span></li>
                            <li className="flex justify-between items-center text-gray-700"><span>New Product: XTA Chroma added</span><span className="text-xs text-gray-500">1 hour ago</span></li>
                            <li className="flex justify-between items-center text-gray-700"><span>Order #889 shipped</span><span className="text-xs text-gray-500">4 hours ago</span></li>
                            <li className="flex justify-between items-center text-gray-700"><span>Customer inquiry received</span><span className="text-xs text-gray-500">1 day ago</span></li>
                        </ul>
                        <Link to="/admin/products" className="block mt-6 text-sky-500 font-bold hover:text-black transition-colors">Manage Products & Inventory &rarr;</Link>
                    </div>
                </div>

                {/* Quick Navigation Panel */}
                <div className="mt-12">
                    <h3 className="text-2xl font-black italic mb-6">Quick Navigation</h3>
                    <div className="flex flex-wrap gap-4">
                        <Link to="/admin/products" className="bg-black text-white py-3 px-6 rounded-lg font-bold uppercase tracking-widest hover:bg-sky-600 transition-colors shadow-lg">
                            Product Management
                        </Link>
                        <Link to="/admin/orders" className="bg-sky-500 text-white py-3 px-6 rounded-lg font-bold uppercase tracking-widest hover:bg-sky-600 transition-colors shadow-lg">
                            Order Management
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;