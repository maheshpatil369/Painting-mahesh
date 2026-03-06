// File: Frontend/src/Context/AdminProducts.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { API_URL as BACKEND_URL } from '../config';
import { Plus, Trash2, Edit, Save, X, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_PRODUCTS_ENDPOINT = `${BACKEND_URL}/products`;

// API Functions
const fetchProducts = async (token) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(API_PRODUCTS_ENDPOINT, { headers });
    
    if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
    }
    
    return response.json();
};

const createProduct = async (product, token) => {
    if (!token) {
        throw new Error('Authentication required');
    }
    
    const response = await fetch(API_PRODUCTS_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(product)
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Failed to create product: ${response.status}`);
    }
    
    return response.json();
};

const updateProduct = async (productId, product, token) => {
    if (!token) {
        throw new Error('Authentication required');
    }
    
    const response = await fetch(`${API_PRODUCTS_ENDPOINT}/${productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(product)
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Failed to update product: ${response.status}`);
    }
    
    return response.json();
};

const deleteProduct = async (productId, token) => {
    if (!token) {
        throw new Error('Authentication required');
    }
    
    const response = await fetch(`${API_PRODUCTS_ENDPOINT}/${productId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Failed to delete product: ${response.status}`);
    }
    
    return response.json();
};

const AdminProducts = () => {
    const { isAdmin, accessToken } = useAuth();
    const [productsData, setProductsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [newProduct, setNewProduct] = useState({ 
        name: '', 
        category: 'Solid Pearls', 
        price: 0, 
        image: '', 
        description: '',
        tag: '',
        stock: 0
    });
    
    const categories = [
        'Solid Pearls',
        'Interference Pearls',
        'Carbon Pearls',
        'OEM+ Pearls',
        'Special Effect Pearls',
        'Chroma Pearls'
    ];
    
    const loadProducts = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await fetchProducts(accessToken);
            setProductsData(data);
        } catch (err) {
            console.error("Error fetching products:", err);
            setError(err.message || 'Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isAdmin) {
            setLoading(false);
            return;
        }
        loadProducts();
    }, [isAdmin, accessToken]);

    const handleProductChange = (e) => {
        const { name, value } = e.target;
        setNewProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditingProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (productToSave) => {
        setError('');
        setSuccess('');
        
        try {
            // Validate required fields
            if (!productToSave.name || !productToSave.category || !productToSave.price) {
                throw new Error('Name, category, and price are required');
            }
            
            if (productToSave._id || productToSave.id) {
                // Update existing product
                const productId = productToSave._id || productToSave.id;
                await updateProduct(productId, productToSave, accessToken);
                setSuccess('Product updated successfully!');
            } else {
                // Create new product
                await createProduct(productToSave, accessToken);
                setSuccess('Product created successfully!');
            }
            
            setEditingProduct(null);
            setIsAdding(false);
            setNewProduct({ 
                name: '', 
                category: 'Solid Pearls', 
                price: 0, 
                image: '', 
                description: '',
                tag: '',
                stock: 0
            });
            
            // Reload products
            await loadProducts();
            
            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error("Error saving product:", err);
            setError(err.message || 'Failed to save product');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(`Are you sure you want to delete this product?`)) return;
        
        setError('');
        setSuccess('');
        
        try {
            await deleteProduct(id, accessToken);
            setSuccess('Product deleted successfully!');
            await loadProducts();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error("Error deleting product:", err);
            setError(err.message || 'Failed to delete product');
        }
    };
    
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
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading Products...</p>
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
                        <h1 className="text-4xl font-black text-black italic uppercase mb-2">Product Management</h1>
                        <p className="text-sm text-gray-600 flex items-center">
                            <ArrowRight className="h-4 w-4 mr-2" /> 
                            API Endpoint: <code className="bg-gray-200 px-2 py-1 rounded text-xs ml-2">{API_PRODUCTS_ENDPOINT}</code>
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
                            to="/admin/orders"
                            className="bg-sky-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-600 transition-colors"
                        >
                            Orders
                        </Link>
                        <button 
                            onClick={() => { 
                                setIsAdding(true); 
                                setEditingProduct(null); 
                                setNewProduct({ 
                                    name: '', 
                                    category: 'Solid Pearls', 
                                    price: 0, 
                                    image: '', 
                                    description: '',
                                    tag: '',
                                    stock: 0
                                }); 
                            }}
                            className="bg-sky-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-600 transition-colors flex items-center shadow-md"
                        >
                            <Plus className="h-5 w-5 mr-2" /> Add New Product
                        </button>
                    </div>
                </div>

                {/* Success/Error Messages */}
                {success && (
                    <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        {success}
                    </div>
                )}
                {error && (
                    <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
                        <AlertCircle className="h-5 w-5 mr-2" />
                        {error}
                    </div>
                )}

                {/* Add New Product Form */}
                {isAdding && (
                    <ProductForm 
                        product={newProduct} 
                        categories={categories}
                        onChange={handleProductChange}
                        onSave={handleSave}
                        onCancel={() => {
                            setIsAdding(false);
                            setError('');
                            setSuccess('');
                        }}
                        isEditing={false}
                    />
                )}
                
                {/* Products Table */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-black text-gray-700 uppercase tracking-wider">Image</th>
                                    <th className="px-6 py-3 text-left text-xs font-black text-gray-700 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-black text-gray-700 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-black text-gray-700 uppercase tracking-wider">Price (₹)</th>
                                    <th className="px-6 py-3 text-left text-xs font-black text-gray-700 uppercase tracking-wider">Stock</th>
                                    <th className="px-6 py-3 text-left text-xs font-black text-gray-700 uppercase tracking-wider">Tag</th>
                                    <th className="px-6 py-3 text-left text-xs font-black text-gray-700 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {productsData.map(product => {
                                    const productId = product._id || product.id;
                                    const isEditing = editingProduct && (editingProduct._id === productId || editingProduct.id === productId);
                                    
                                    return (
                                        <tr key={productId} className="hover:bg-gray-50">
                                            {isEditing ? (
                                                <ProductEditRow 
                                                    product={editingProduct} 
                                                    categories={categories}
                                                    onSave={handleSave}
                                                    onCancel={() => {
                                                        setEditingProduct(null);
                                                        setError('');
                                                    }}
                                                    onEditChange={handleEditChange}
                                                />
                                            ) : (
                                                <>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {product.image ? (
                                                            <img 
                                                                src={product.image} 
                                                                alt={product.name}
                                                                className="h-16 w-16 object-cover rounded"
                                                                onError={(e) => {
                                                                    e.target.src = 'https://placehold.co/64x64/e5e7eb/4b5563?text=No+Image';
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="h-16 w-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">
                                                                No Image
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-black">{product.name}</div>
                                                        {product.description && (
                                                            <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">
                                                                {product.description}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-bold text-black">₹{product.price}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock || 0}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {product.tag && (
                                                            <span className="px-2 py-1 text-xs font-bold bg-sky-100 text-sky-800 rounded">
                                                                {product.tag}
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex space-x-2">
                                                            <button 
                                                                onClick={() => setEditingProduct({ ...product, id: productId })}
                                                                className="text-sky-600 hover:text-sky-800 transition-colors p-2 hover:bg-sky-50 rounded"
                                                                title="Edit"
                                                            >
                                                                <Edit className="h-5 w-5" />
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDelete(productId)}
                                                                className="text-red-600 hover:text-red-800 transition-colors p-2 hover:bg-red-50 rounded"
                                                                title="Delete"
                                                            >
                                                                <Trash2 className="h-5 w-5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    );
                                })}
                                {productsData.length === 0 && !loading && (
                                    <tr>
                                        <td colSpan="7" className="text-center py-10 text-gray-500">
                                            No products found. Click "Add New Product" to get started!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Product Form Component
const ProductForm = ({ product, categories, onChange, onSave, onCancel, isEditing }) => (
    <div className="bg-white p-6 mb-8 border-2 border-sky-500 shadow-xl rounded-lg">
        <h2 className="text-2xl font-black italic mb-6 border-b pb-3">
            {isEditing ? 'Edit Product' : 'Add New Product'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Product Name *</label>
                <input 
                    name="name" 
                    value={product.name} 
                    onChange={onChange} 
                    placeholder="e.g., 24 Karat Gold" 
                    required 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
            </div>
            
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Category *</label>
                <select 
                    name="category" 
                    value={product.category} 
                    onChange={onChange} 
                    required 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                >
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>
            
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Price (₹) *</label>
                <input 
                    name="price" 
                    type="number" 
                    value={product.price} 
                    onChange={onChange} 
                    placeholder="1499" 
                    required 
                    min="0" 
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
            </div>
            
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Stock Quantity</label>
                <input 
                    name="stock" 
                    type="number" 
                    value={product.stock || 0} 
                    onChange={onChange} 
                    placeholder="0" 
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
            </div>
            
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Tag (Optional)</label>
                <input 
                    name="tag" 
                    value={product.tag || ''} 
                    onChange={onChange} 
                    placeholder="e.g., Best Seller, New, Popular" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
            </div>
            
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Image URL</label>
                <input 
                    name="image" 
                    value={product.image || ''} 
                    onChange={onChange} 
                    placeholder="https://example.com/image.jpg" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
            </div>
            
            <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                <textarea 
                    name="description" 
                    value={product.description || ''} 
                    onChange={onChange} 
                    placeholder="Product description..." 
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
            </div>
        </div>
        
        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
            <button 
                type="button" 
                onClick={onCancel} 
                className="bg-gray-300 text-black font-bold py-2 px-6 rounded-lg hover:bg-gray-400 transition-colors flex items-center"
            >
                <X className="h-5 w-5 mr-2" /> Cancel
            </button>
            <button 
                type="button" 
                onClick={() => onSave(product)} 
                className="bg-sky-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-sky-600 transition-colors flex items-center"
            >
                <Save className="h-5 w-5 mr-2" /> {isEditing ? 'Update Product' : 'Save Product'}
            </button>
        </div>
    </div>
);

// Inline Edit Row Component
const ProductEditRow = ({ product, categories, onSave, onCancel, onEditChange }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        onEditChange(prev => ({ ...prev, [name]: value }));
    };
    
    return (
        <td colSpan="7" className="p-4 bg-sky-50">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-center">
                <input 
                    name="name" 
                    value={product.name} 
                    onChange={handleChange} 
                    placeholder="Name"
                    className="px-3 py-2 border rounded text-black text-sm"
                />
                <select 
                    name="category" 
                    value={product.category} 
                    onChange={handleChange} 
                    className="px-3 py-2 border rounded text-black text-sm"
                >
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
                <input 
                    name="price" 
                    type="number" 
                    value={product.price} 
                    onChange={handleChange} 
                    placeholder="Price"
                    className="px-3 py-2 border rounded text-black text-sm"
                />
                <input 
                    name="stock" 
                    type="number" 
                    value={product.stock || 0} 
                    onChange={handleChange} 
                    placeholder="Stock"
                    className="px-3 py-2 border rounded text-black text-sm"
                />
                <input 
                    name="image" 
                    value={product.image || ''} 
                    onChange={handleChange} 
                    placeholder="Image URL"
                    className="px-3 py-2 border rounded text-black text-sm"
                />
                <div className="flex space-x-2">
                    <button 
                        onClick={() => onSave({ ...product, _id: product._id || product.id })} 
                        className="bg-emerald-500 text-white p-2 rounded hover:bg-emerald-600 transition-colors"
                        title="Save"
                    >
                        <Save className="h-5 w-5" />
                    </button>
                    <button 
                        onClick={onCancel} 
                        className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors"
                        title="Cancel"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </td>
    );
};

export default AdminProducts;
