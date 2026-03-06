// File: Frontend/src/Context/AdminOrders.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { API_URL as BACKEND_URL } from '../config';
import { Package, Loader2, AlertCircle, Eye, CheckCircle, XCircle, Truck, Clock, ArrowRight, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_ORDERS_ENDPOINT = `${BACKEND_URL}/admin/orders`;

// Status badge component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    PAID: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
    SHIPPED: { color: 'bg-purple-100 text-purple-800', icon: Truck },
    COMPLETED: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
    CANCELLED: { color: 'bg-red-100 text-red-800', icon: XCircle }
  };

  const config = statusConfig[status] || statusConfig.PENDING;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${config.color}`}>
      <Icon className="h-3 w-3 mr-1" />
      {status}
    </span>
  );
};

// Order details modal
const OrderDetailsModal = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-black italic uppercase">Order Details</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Order Info */}
              <div>
                <h4 className="font-black text-sm uppercase mb-2 text-gray-700">Order Information</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-bold">Order ID:</span> {order._id || order.id}</p>
                  <p><span className="font-bold">Status:</span> <StatusBadge status={order.status} /></p>
                  <p><span className="font-bold">Date:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
                  <p><span className="font-bold">Payment:</span> {order.paymentMethod}</p>
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h4 className="font-black text-sm uppercase mb-2 text-gray-700">Customer Information</h4>
                <div className="space-y-2 text-sm">
                  {order.user ? (
                    <>
                      <p><span className="font-bold">Name:</span> {order.user.name || 'N/A'}</p>
                      <p><span className="font-bold">Email:</span> {order.user.email || 'N/A'}</p>
                    </>
                  ) : (
                    <p className="text-gray-500 italic">Guest Order</p>
                  )}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="md:col-span-2">
                <h4 className="font-black text-sm uppercase mb-2 text-gray-700">Shipping Address</h4>
                <div className="bg-gray-50 p-4 rounded text-sm">
                  <p className="font-bold">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.addressLine1}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                  <p>{order.shippingAddress.country}</p>
                  <p className="mt-2"><span className="font-bold">Phone:</span> {order.shippingAddress.phone}</p>
                  <p><span className="font-bold">Email:</span> {order.shippingAddress.email}</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="md:col-span-2">
                <h4 className="font-black text-sm uppercase mb-2 text-gray-700">Order Items</h4>
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase">Product</th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase">Category</th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase">Quantity</th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase">Price</th>
                        <th className="px-4 py-2 text-right text-xs font-bold text-gray-700 uppercase">Total</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {order.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 text-sm font-medium">{item.name}</td>
                          <td className="px-4 py-2 text-sm text-gray-500">{item.category}</td>
                          <td className="px-4 py-2 text-sm">{item.quantity}</td>
                          <td className="px-4 py-2 text-sm">₹{item.price}</td>
                          <td className="px-4 py-2 text-sm font-bold text-right">₹{item.price * item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan="4" className="px-4 py-2 text-sm font-bold text-right">Subtotal:</td>
                        <td className="px-4 py-2 text-sm font-bold text-right">₹{order.subtotal}</td>
                      </tr>
                      <tr>
                        <td colSpan="4" className="px-4 py-2 text-sm font-bold text-right">Shipping:</td>
                        <td className="px-4 py-2 text-sm font-bold text-right">₹{order.shipping}</td>
                      </tr>
                      <tr>
                        <td colSpan="4" className="px-4 py-2 text-lg font-black text-right">Total:</td>
                        <td className="px-4 py-2 text-lg font-black text-right text-sky-500">₹{order.total}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminOrders = () => {
  const { isAdmin, accessToken } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const loadOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const headers = {
        'Content-Type': 'application/json'
      };
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      const response = await fetch(API_ORDERS_ENDPOINT, { headers });

      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.status}`);
      }

      const data = await response.json();
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }
    loadOrders();
  }, [isAdmin, accessToken]);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const filteredOrders = statusFilter === 'ALL' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  if (!isAdmin) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-red-500 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">Admin privileges required.</p>
          <Link to="/login" className="text-sky-500 hover:text-sky-600 font-bold">
            Go to Login →
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-sky-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading Orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-black text-black italic uppercase mb-2">Order Management</h1>
            <p className="text-sm text-gray-600 flex items-center">
              <ArrowRight className="h-4 w-4 mr-2" />
              Total Orders: <span className="font-bold ml-2">{orders.length}</span>
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              to="/admin/dashboard"
              className="bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/admin/products"
              className="bg-sky-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-600 transition-colors"
            >
              Products
            </Link>
            <button
              onClick={loadOrders}
              disabled={loading}
              className="bg-emerald-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 flex items-center"
              title="Refresh Orders"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        {/* Status Filter */}
        <div className="mb-6 flex gap-2 flex-wrap">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-4 py-2 rounded-lg font-bold transition-colors ${
              statusFilter === 'ALL'
                ? 'bg-black text-white'
                : 'bg-white text-black hover:bg-gray-100'
            }`}
          >
            All ({orders.length})
          </button>
          {['PENDING', 'PAID', 'SHIPPED', 'COMPLETED', 'CANCELLED'].map(status => {
            const count = orders.filter(o => o.status === status).length;
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                  statusFilter === status
                    ? 'bg-black text-white'
                    : 'bg-white text-black hover:bg-gray-100'
                }`}
              >
                {status} ({count})
              </button>
            );
          })}
        </div>

        {/* Orders Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-black text-gray-700 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-black text-gray-700 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-black text-gray-700 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-black text-gray-700 uppercase tracking-wider">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-black text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-black text-gray-700 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-black text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-10 text-gray-500">
                      {statusFilter === 'ALL' 
                        ? 'No orders found.' 
                        : `No orders with status "${statusFilter}".`}
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map(order => (
                    <tr key={order._id || order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                        #{String(order._id || order.id).slice(-8).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          {order.user ? (
                            <>
                              <div className="font-medium text-gray-900">{order.user.name || 'N/A'}</div>
                              <div className="text-gray-500">{order.user.email || 'N/A'}</div>
                            </>
                          ) : (
                            <div className="text-gray-500 italic">Guest Order</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                        <br />
                        <span className="text-xs">{new Date(order.createdAt).toLocaleTimeString()}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-bold text-gray-900">
                        ₹{order.total}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="text-sky-600 hover:text-sky-800 transition-colors p-2 hover:bg-sky-50 rounded"
                          title="View Details"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Details Modal */}
        <OrderDetailsModal
          order={selectedOrder}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedOrder(null);
          }}
        />
      </div>
    </div>
  );
};

export default AdminOrders;

