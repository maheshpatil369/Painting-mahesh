// File: Frontend/src/pages/AdminProducts.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext'; // FIX: Removed .jsx extension
import { API_URL as BACKEND_URL } from '../config';
import { Plus, Trash2, Edit, Save, X, ArrowRight } from 'lucide-react';

const API_PRODUCTS_ENDPOINT = `${BACKEND_URL}/products`;

// --- Mock Product API Calls (Updated to use fetch and external URL) ---
// ... (rest of mock API functions remain the same)

const mockFetchProducts = async (token) => {
    try {
        // Simulates GET /api/products
        const headers = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        const response = await fetch(API_PRODUCTS_ENDPOINT, { headers });
        
        // --- SIMULATION ONLY ---
        // In a live environment, if fetch fails, this mock data ensures the UI works
        if (!response.ok) {
            console.warn(`[API WARNING] GET ${API_PRODUCTS_ENDPOINT} failed. Using mock local data.`);
            await new Promise(resolve => setTimeout(resolve, 500)); 
            return [
                { id: 'mock-1', name: 'Adamantium', category: 'Solid Pearls', price: 1499, image: 'https://placehold.co/100/e5e7eb/4b5563?text=Mock+Data', description: 'Mock: Please run Node.js Backend' },
                { id: 'mock-2', name: 'XTA Chroma', category: 'Chroma Pearls', price: 2999, image: 'https://placehold.co/100/e5e7eb/4b5563?text=Mock+Data', description: 'Mock: Please run Node.js Backend' },
            ];
        }
        // --- END SIMULATION ---

        const data = await response.json();
        return data; // Actual data from backend
    } catch (error) {
        console.error("Error connecting to backend API:", error);
        // Fallback to local mock data if the network request fails completely
        return [
            { id: 'fail-1', name: 'Network Error', category: 'Error', price: 0, image: 'https://placehold.co/100/ff0000/ffffff?text=ERROR', description: 'Cannot connect to backend. Check URL/Server.' },
        ];
    }
};

const mockSaveProduct = async (product, token) => {
    const method = product._id ? 'PUT' : 'POST';
    const url = method === 'PUT' ? `${API_PRODUCTS_ENDPOINT}/${product._id}` : API_PRODUCTS_ENDPOINT;

    // Simulates POST /api/products (Create) or PUT /api/products/:id (Update)
    const headers = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(url, {
        method: method,
        headers,
        body: JSON.stringify(product)
    });

    if (!response.ok) {
        throw new Error(`Failed to ${method === 'POST' ? 'create' : 'update'} product. Status: ${response.status}`);
    }
    return response.json();
};

const mockDeleteProduct = async (id, token) => {
    // Simulates DELETE /api/products/:id
    const headers = {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_PRODUCTS_ENDPOINT}/${id}`, {
        method: 'DELETE',
        headers,
    });

    if (!response.ok) {
        throw new Error(`Failed to delete product. Status: ${response.status}`);
    }
};


const AdminProducts = () => {
    const { isAdmin } = useAuth();  
    const [productsData, setProductsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [newProduct, setNewProduct] = useState({ name: '', category: 'Solid Pearls', price: 0, image: '', description: '' });
    
    // Function to reload data (now uses mockFetchProducts which hits the backend URL)
    const loadProducts = async () => {
        setLoading(true);
        try {
            const data = await mockFetchProducts(accessToken);
            setProductsData(data);
        } catch (error) {
            console.error("Error fetching products:", error);
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

        // The automatic 5-second polling interval (setInterval) was intentionally removed in the previous step.

    }, [isAdmin]);

    // Handlers for Add/Edit Form
    const handleProductChange = (e) => {
        const { name, value } = e.target;
        setNewProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (productToSave) => {
        try {
            await mockSaveProduct(productToSave, accessToken);
            setEditingProduct(null);
            setIsAdding(false);
            setNewProduct({ name: '', category: 'Solid Pearls', price: 0, image: '', description: '' });
            loadProducts(); // Reload data after save
        } catch (error) {
            console.error("Error saving product:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(`Are you sure you want to delete product ID: ${id}?`)) return;
        try {
            await mockDeleteProduct(id, accessToken);
            loadProducts(); // Reload data after delete
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };
    
    if (!isAdmin) return <div className="text-center py-20 text-red-500 font-bold">Access Denied: Admin required.</div>;
    if (loading) return <div className="text-center py-20 text-black">Loading Products...</div>;

    const categories = ['Solid Pearls', 'Interference Pearls', 'Carbon Pearls', 'OEM+ Pearls', 'Special Effect Pearls', 'Chroma Pearls'];

    return (
        <div className="bg-white min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-black text-black italic uppercase">Product Management</h1>
                    <button 
                        onClick={() => { setIsAdding(true); setEditingProduct(null); setNewProduct({ name: '', category: categories[0], price: 0, image: '', description: '' }); }}
                        className="bg-sky-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-600 transition-colors flex items-center shadow-md"
                    >
                        <Plus className="h-5 w-5 mr-2" /> Add New Product
                    </button>
                </div>
                <p className="text-sm text-gray-600 mb-6 flex items-center">
                    <ArrowRight className="h-4 w-4 mr-2" /> API Endpoint: <code className="bg-gray-200 p-1 rounded text-xs">{API_PRODUCTS_ENDPOINT}</code>
                </p>

                {/* Add New Product Form */}
                {isAdding && (
                    <ProductForm 
                        product={newProduct} 
                        categories={categories}
                        onChange={handleProductChange}
                        onSave={handleSave}
                        onCancel={() => setIsAdding(false)}
                        isEditing={false}
                    />
                )}
                
                {/* Product Table */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden shadow-lg mt-8">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-black text-gray-700 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-black text-gray-700 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-black text-gray-700 uppercase tracking-wider">Price (₹)</th>
                                <th className="px-6 py-3 text-left text-xs font-black text-gray-700 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {productsData.map(product => (
                                <tr key={product._id || product.id}>
                                    {editingProduct && (editingProduct._id === (product._id || product.id) || editingProduct.id === (product._id || product.id)) ? (
                                        <ProductEditRow 
                                            product={editingProduct} 
                                            categories={categories}
                                            onSave={handleSave}
                                            onCancel={() => setEditingProduct(null)}
                                            onEditChange={setEditingProduct}
                                        />
                                    ) : (
                                        <>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">{product.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-bold text-black">₹{product.price}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-3">
                                                <button 
                                                    onClick={() => setEditingProduct({ ...product, id: product._id || product.id })}
                                                    className="text-sky-600 hover:text-sky-800 transition-colors p-1"
                                                >
                                                    <Edit className="h-5 w-5" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(product._id || product.id)}
                                                    className="text-red-600 hover:text-red-800 transition-colors p-1"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                            {productsData.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="4" className="text-center py-10 text-gray-500">No products found. Please ensure your backend server is running at {BACKEND_URL}.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// Reusable form component for Adding/Editing
const ProductForm = ({ product, categories, onChange, onSave, onCancel, isEditing }) => (
    <div className="bg-white p-6 mb-8 border border-sky-500 shadow-xl rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
        <h2 className="md:col-span-2 text-2xl font-black italic mb-4 border-b pb-2">{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
        
        <input name="name" value={product.name} onChange={onChange} placeholder="Product Name" required className="px-4 py-2 border rounded-md text-black" />
        
        <select name="category" value={product.category} onChange={onChange} required className="px-4 py-2 border rounded-md text-black">
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        
        <input name="price" type="number" value={product.price} onChange={onChange} placeholder="Price (₹)" required min="0" className="px-4 py-2 border rounded-md text-black" />
        
        <input name="image" value={product.image} onChange={onChange} placeholder="Image URL" className="px-4 py-2 border rounded-md text-black" />
        
        <textarea name="description" value={product.description} onChange={onChange} placeholder="Description" rows="2" className="md:col-span-2 px-4 py-2 border rounded-md text-black" />
        
        <div className="md:col-span-2 flex justify-end space-x-3 mt-4">
            <button 
                type="button" 
                onClick={onCancel} 
                className="bg-gray-300 text-black font-bold py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors flex items-center"
            >
                <X className="h-5 w-5 mr-2" /> Cancel
            </button>
            <button 
                type="button" 
                onClick={() => onSave(product)} 
                className="bg-sky-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-600 transition-colors flex items-center"
            >
                <Save className="h-5 w-5 mr-2" /> {isEditing ? 'Update Product' : 'Save Product'}
            </button>
        </div>
    </div>
);

// Row component for editing inline
const ProductEditRow = ({ product, categories, onSave, onCancel, onEditChange }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        onEditChange(prev => ({ ...prev, [name]: value }));
    };
    
    return (
        <td colSpan="4" className="p-4 bg-sky-50">
            <div className="grid grid-cols-5 gap-3 items-center">
                <input name="name" value={product.name} onChange={handleChange} className="col-span-1 px-2 py-1 border rounded text-black" />
                <select name="category" value={product.category} onChange={handleChange} className="col-span-1 px-2 py-1 border rounded text-black">
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <input name="price" type="number" value={product.price} onChange={handleChange} className="col-span-1 px-2 py-1 border rounded text-black" />
                <input name="image" value={product.image || ''} onChange={handleChange} placeholder="Image URL" className="col-span-1 px-2 py-1 border rounded text-black" />
                <div className="col-span-1 flex space-x-2">
                    <button 
                        onClick={() => onSave({ ...product, _id: product._id || product.id })} 
                        className="bg-emerald-500 text-white p-1 rounded hover:bg-emerald-600"
                    >
                        <Save className="h-5 w-5" />
                    </button>
                    <button 
                        onClick={onCancel} 
                        className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </td>
    );
};

export default AdminProducts;