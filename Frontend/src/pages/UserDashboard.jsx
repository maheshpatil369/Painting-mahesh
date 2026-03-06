import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// 🔑 IMPORT: Include useAuth and axios for API calls
import { useAuth } from '../Context/AuthContext.jsx'; 
import axios from 'axios'; 
import { User, Package, ShoppingCart, Calendar, Mail, LogOut, Bell, TrendingUp, MapPin, Heart, Clock, CheckCircle, Truck, XCircle, ChevronRight, Search } from "lucide-react";

// --- API Endpoint Configuration ---
import { API_URL as BACKEND_URL } from '../config';
const API_USER_ORDERS = `${BACKEND_URL}/user/orders`; 


export default function UserDashboard() {
  const navigate = useNavigate();
  // 🔑 CONTEXT: Get user data, token, and the real logout function
  const { user, accessToken, adminLogout: handleLogout } = useAuth(); 
  
  const [currentUser, setCurrentUser] = useState(null); // Use this to store fetched user details
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [orders, setOrders] = useState([]);

  // 🔑 NEW FUNCTION: Fetch real orders from the backend
  const fetchOrders = async () => {
    if (!accessToken) return;

    const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    };

    try {
        // Fetch orders associated with the logged-in user
        const response = await axios.get(API_USER_ORDERS, config);
        setOrders(response.data);
    } catch (error) {
        console.error("Failed to fetch user orders:", error);
        // Handle token expiry/401 here if necessary (e.g., redirect to login)
    }
 };

  useEffect(() => {
    // 🔑 STEP 1: If user context data is available, set it and fetch orders
    if (user && accessToken) {
        setCurrentUser(user);
        fetchOrders();
        setLoading(false); // Done loading initial user state
    } else if (!accessToken) {
        // If no token, redirect to login via navigate, although ProtectedRoute should handle this
        navigate('/login', { replace: true });
    }
  }, [user, accessToken]); // Depend on user and token

  // 🔑 UPDATED: Use context logout, then redirect
  const handleUserLogout = async () => {
    await handleLogout(); // This calls the context's logout function which clears token/cookie
    navigate('/login');
  };

  const navigateToShop = () => {
    navigate('/shop');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "delivered": return "text-green-600 bg-green-50 border-green-200";
      case "shipped": return "text-blue-600 bg-blue-50 border-blue-200";
      case "processing": return "text-amber-600 bg-amber-50 border-amber-200";
      case "cancelled": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "delivered": return <CheckCircle size={16} />;
      case "shipped": return <Truck size={16} />;
      case "processing": return <Clock size={16} />;
      case "cancelled": return <XCircle size={16} />;
      default: return <Package size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) return <Navigate to="/login" replace />; // Fallback redirect

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header: Kept for internal dashboard navigation/branding */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="text-white" size={20} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">My Account</h1>
                  {/* 🔑 USE REAL NAME */}
                  <p className="text-sm text-gray-500">Welcome, {currentUser.name || currentUser.email.split('@')[0]}!</p> 
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="hidden md:flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition">
                <Search size={18} />
              </button>
              <button className="relative p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button 
                onClick={navigateToShop}
                className="hidden md:flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition font-medium"
              >
                <ShoppingCart size={18} />
                <span>Shop</span>
              </button>
              <button 
                onClick={handleUserLogout} // 🔑 USE REAL LOGOUT FUNCTION
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition font-medium"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <nav className="p-2">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition ${
                    activeTab === "overview"
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <TrendingUp size={20} />
                  <span>Overview</span>
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition ${
                    activeTab === "orders"
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Package size={20} />
                  <span>Orders</span>
                  {orders.length > 0 && (
                    <span className="ml-auto bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full">
                      {orders.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition ${
                    activeTab === "profile"
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <User size={20} />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => setActiveTab("addresses")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition ${
                    activeTab === "addresses"
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <MapPin size={20} />
                  <span>Addresses</span>
                </button>
                <button
                  onClick={() => setActiveTab("wishlist")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition ${
                    activeTab === "wishlist"
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Heart size={20} />
                  <span>Wishlist</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Package className="text-blue-600" size={24} />
                      </div>
                      <span className="text-2xl font-bold text-gray-900">{orders.length}</span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-600 mb-1">Total Orders</h3>
                    <p className="text-xs text-gray-500">All time purchases</p>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <ShoppingCart className="text-green-600" size={24} />
                      </div>
                      <span className="text-2xl font-bold text-gray-900">
                        ₹{orders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}
                      </span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-600 mb-1">Total Spent</h3>
                    <p className="text-xs text-gray-500">Lifetime value</p>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Calendar className="text-purple-600" size={24} />
                      </div>
                      <span className="text-2xl font-bold text-gray-900">
                        {user.createdAt ? Math.floor((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)) : 0}
                      </span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-600 mb-1">Days Active</h3>
                    <p className="text-xs text-gray-500">
                      Since {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recently'}
                    </p>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                    {orders.length > 0 && (
                      <button 
                        onClick={() => setActiveTab("orders")}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center space-x-1"
                      >
                        <span>View All</span>
                        <ChevronRight size={16} />
                      </button>
                    )}
                  </div>
                  
                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="text-gray-400" size={32} />
                    </div>
                    <p className="text-gray-600 font-medium mb-2">No orders yet</p>
                    <p className="text-gray-500 text-sm mb-6">Start shopping to see your orders here</p>
                    <button
                        onClick={navigateToShop}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition inline-flex items-center space-x-2"
                      >
                        <ShoppingCart size={18} />
                        <span>Browse Products</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.slice(0, 3).map((order) => (
                        <div key={order._id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="font-semibold text-gray-900">Order #{order.orderNumber}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </p>
                            </div>
                            <span className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full font-medium text-xs border ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              <span className="capitalize">{order.status}</span>
                            </span>
                          </div>
                          <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                            <span className="text-sm text-gray-600">
                              {order.items.length} item{order.items.length > 1 ? 's' : ''}
                            </span>
                            <span className="font-bold text-gray-900">₹{order.total.toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button 
                    onClick={() => setActiveTab("profile")}
                    className="bg-white border-2 border-gray-200 hover:border-blue-300 rounded-xl p-6 text-left transition group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600">Edit Profile</h3>
                        <p className="text-sm text-gray-500">Update your personal information</p>
                      </div>
                      <ChevronRight className="text-gray-400 group-hover:text-blue-600" size={20} />
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab("addresses")}
                    className="bg-white border-2 border-gray-200 hover:border-blue-300 rounded-xl p-6 text-left transition group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600">Manage Addresses</h3>
                        <p className="text-sm text-gray-500">Add or edit delivery addresses</p>
                      </div>
                      <ChevronRight className="text-gray-400 group-hover:text-blue-600" size={20} />
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === "addresses" && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Saved Addresses</h2>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition text-sm flex items-center space-x-2">
                    <span>+ Add Address</span>
                  </button>
                </div>
                
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="text-gray-400" size={32} />
                  </div>
                  <p className="text-gray-600 font-medium mb-2">No saved addresses</p>
                  <p className="text-gray-500 text-sm">Add your delivery address for faster checkout</p>
                </div>
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === "wishlist" && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">My Wishlist</h2>
                
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="text-gray-400" size={32} />
                  </div>
                  <p className="text-gray-600 font-medium mb-2">Your wishlist is empty</p>
                  <p className="text-gray-500 text-sm mb-6">Save your favorite items here</p>
                  <button
                    onClick={navigateToShop}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
                  >
                    Browse Products
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
        {/* 🔑 NEW: Orders Table in the main Orders Tab */}
        {activeTab === "orders" && (
            <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:hidden">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order History</h2>
                {/* Re-using the same order display logic for the full tab view */}
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 pb-4 border-b border-gray-100">
                                {/* ... Order details ... */}
                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 pb-4 border-b border-gray-100">
                                    <div>
                                        <p className="font-bold text-gray-900 text-lg mb-1">Order #{order.orderNumber}</p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(order.date).toLocaleDateString('en-US', { 
                                                month: 'long', 
                                                day: 'numeric', 
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                    <span className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium text-sm border ${getStatusColor(order.status)} mt-3 md:mt-0`}>
                                        {getStatusIcon(order.status)}
                                        <span className="capitalize">{order.status}</span>
                                    </span>
                                </div>
                                
                                <div className="space-y-2 mb-4">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center text-gray-700">
                                            <span className="text-sm">{item.name} × {item.quantity}</span>
                                            <span className="font-semibold">₹{(item.price * item.quantity).toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                    <button className="text-blue-600 hover:text-blue-700 transition font-medium text-sm flex items-center space-x-1">
                                        <span>View Details</span>
                                        <ChevronRight size={16} />
                                    </button>
                                    <div className="text-gray-900 font-bold text-xl">₹{order.total.toLocaleString()}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
}