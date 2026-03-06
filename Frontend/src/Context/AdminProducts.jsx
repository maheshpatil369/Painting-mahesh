import React, { useState, useEffect } from "react";
// Corrected imports: Removing extensions can often help with build tool resolution
import { useAuth } from "../Context/AuthContext";
import { API_URL as BACKEND_URL } from "../config";
import {
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Upload,
  ImageIcon,
} from "lucide-react";

// The base API URL for products
const API_PRODUCTS_ENDPOINT = `${BACKEND_URL}/products`;

/**
 * Helper to get the base URL for serving static files from the backend
 */
const getBaseBackendUrl = () => {
  return BACKEND_URL.replace("/api", "");
};

/**
 * API Helper to convert product object to FormData
 * This handles the "Unexpected field" error by ensuring ONLY the
 * 'image' field is sent as a file part, and all other metadata as text parts.
 */
const prepareFormData = (product, imageFiles) => {
  const formData = new FormData();

  formData.append("name", product.name || "");
  formData.append("category", product.category || "");
  formData.append("price", product.price || 0);
  formData.append("description", product.description || "");
  formData.append("tag", product.tag || "");
  formData.append("stock", product.stock || 0);

  if (imageFiles?.length) {
    imageFiles.forEach((file) => {
      formData.append("images", file);
    });
  }

  return formData;
};

// --- API Implementation ---

const fetchProducts = async (token) => {
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(API_PRODUCTS_ENDPOINT, { headers });
  if (!response.ok)
    throw new Error(`Failed to fetch products: ${response.status}`);
  return response.json();
};

const createProduct = async (formData, token) => {
  const response = await fetch(API_PRODUCTS_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      // Do NOT set Content-Type; the browser handles the boundary for multipart/form-data
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create product");
  }
  return response.json();
};

const updateProduct = async (productId, formData, token) => {
  const response = await fetch(`${API_PRODUCTS_ENDPOINT}/${productId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update product");
  }
  return response.json();
};

const deleteProduct = async (productId, token) => {
  const response = await fetch(`${API_PRODUCTS_ENDPOINT}/${productId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error("Failed to delete product");
  return response.json();
};

const AdminProducts = () => {
  const { isAdmin, accessToken } = useAuth();
  const [productsData, setProductsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "Solid Pearls",
    price: 0,
    description: "",
    tag: "",
    stock: 0,
  });

  const categories = [
    "Solid Pearls",
    "Interference Pearls",
    "Carbon Pearls",
    "OEM+ Pearls",
    "Special Effect Pearls",
    "Chroma Pearls",
  ];

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchProducts(accessToken);
      setProductsData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) loadProducts();
  }, [isAdmin, accessToken]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    setSelectedFiles(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(previews);
  };

  const handleSave = async (productToSave) => {
    setError("");
    setSuccess("");
    try {
      const formData = prepareFormData(productToSave, selectedFiles);
      const productId = productToSave._id || productToSave.id;

      if (productId) {
        await updateProduct(productId, formData, accessToken);
        setSuccess("Product successfully updated!");
      } else {
        await createProduct(formData, accessToken);
        setSuccess("Product published successfully!");
      }

      closeForm();
      await loadProducts();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Save error details:", err);
      setError(err.message || "An error occurred during save.");
    }
  };

  const closeForm = () => {
    setEditingProduct(null);
    setIsAdding(false);
    setSelectedFiles([]);
    setPreviewUrls([]);
    setNewProduct({
      name: "",
      category: "Solid Pearls",
      price: 0,
      description: "",
      tag: "",
      stock: 0,
    });
  };

  const formatImageUrl = (img) => {
    if (!img) return "https://placehold.co/100?text=No+Image";
    if (img.startsWith("http") || img.startsWith("blob")) return img;
    const cleanImg = img.startsWith("/") ? img.slice(1) : img;
    return `${getBaseBackendUrl()}/${cleanImg}`;
  };

  if (!isAdmin)
    return (
      <div className="p-20 text-center font-bold text-red-500 uppercase italic">
        Admin Access Only
      </div>
    );

  return (
    <div className="bg-white min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-black leading-none">
              Catalog Hub
            </h1>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2">
              Inventory Management
            </p>
          </div>
          <button
            onClick={() => {
              closeForm();
              setIsAdding(true);
            }}
            className="bg-black text-white px-10 py-4 rounded-3xl font-black uppercase text-xs tracking-widest flex items-center shadow-2xl hover:bg-gray-800 transition-all active:scale-95"
          >
            <Plus className="mr-2 h-4 w-4" /> New Entry
          </button>
        </div>

        {success && (
          <div className="mb-6 p-5 bg-black text-white rounded-3xl flex items-center animate-bounce">
            <CheckCircle className="mr-3 h-5 w-5 text-green-400" />
            <span className="font-bold text-sm tracking-tight">{success}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-5 bg-red-50 text-red-600 border border-red-100 rounded-3xl flex items-center">
            <AlertCircle className="mr-3 h-5 w-5" />
            <span className="font-bold text-sm tracking-tight">{error}</span>
          </div>
        )}

        {isAdding && (
          <div className="mb-12">
            <ProductForm
              product={newProduct}
              categories={categories}
              previewUrls={previewUrls}
              onFileChange={handleFileChange}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  [e.target.name]: e.target.value,
                })
              }
              onSave={handleSave}
              onCancel={closeForm}
            />
          </div>
        )}

        <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-400 text-[9px] uppercase font-black tracking-[0.2em]">
                <tr>
                  <th className="p-8">Visual / Designation</th>
                  <th className="p-8">Class</th>
                  <th className="p-8">Valuation</th>
                  <th className="p-8">Stock Status</th>
                  <th className="p-8 text-right">Utility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="p-20 text-center text-gray-200 font-black italic animate-pulse tracking-widest uppercase text-xs"
                    >
                      Syncing Core...
                    </td>
                  </tr>
                ) : productsData.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="p-20 text-center text-gray-400 font-bold"
                    >
                      No items found in the database.
                    </td>
                  </tr>
                ) : (
                  productsData.map((product) => (
                    <tr
                      key={product._id}
                      className="hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="p-8 flex items-center">
                        <div className="relative w-16 h-16 rounded-[1.25rem] overflow-hidden bg-gray-100 mr-6 border border-gray-50 shadow-sm flex-shrink-0">
                          <div className="flex gap-2">
                            {product.images?.length ? (
                              product.images
                                .slice(0, 3)
                                .map((img, index) => (
                                  <img
                                    key={index}
                                    src={img}
                                    className="w-12 h-12 rounded-lg object-cover border"
                                  />
                                ))
                            ) : (
                              <img
                                src="https://placehold.co/100?text=No+Image"
                                className="w-12 h-12 rounded-lg"
                              />
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="font-black text-black text-xl tracking-tighter leading-none mb-1">
                            {product.name}
                          </div>
                          <span className="text-[9px] font-black uppercase bg-gray-100 px-2 py-0.5 rounded text-gray-400 tracking-widest">
                            {product.tag || "Standard"}
                          </span>
                        </div>
                      </td>
                      <td className="p-8">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          {product.category}
                        </span>
                      </td>
                      <td className="p-8">
                        <div className="font-mono font-black text-black text-lg">
                          ₹{Number(product.price).toLocaleString()}
                        </div>
                      </td>
                      <td className="p-8">
                        <div
                          className={`inline-flex items-center px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${product.stock > 10 ? "bg-green-100 text-green-700" : "bg-red-50 text-red-600"}`}
                        >
                          {product.stock} Units
                        </div>
                      </td>
                      <td className="p-8 text-right">
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => {
                              setEditingProduct(product);
                              setPreviewUrls(product.images || []);
                            }}
                            className="p-3.5 hover:bg-black hover:text-white text-black bg-gray-100 rounded-2xl transition-all"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={async () => {
                              if (
                                window.confirm(
                                  `Permanently remove ${product.name}?`,
                                )
                              ) {
                                await deleteProduct(product._id, accessToken);
                                loadProducts();
                              }
                            }}
                            className="p-3.5 hover:bg-red-600 hover:text-white text-red-600 bg-red-50 rounded-2xl transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {editingProduct && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-[3rem] w-full max-w-5xl overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.4)]">
            <ProductForm
              product={editingProduct}
              categories={categories}
              previewUrls={previewUrls}
              isEditing={true}
              onFileChange={handleFileChange}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  [e.target.name]: e.target.value,
                })
              }
              onSave={handleSave}
              onCancel={closeForm}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const ProductForm = ({
  product,
  categories,
  onChange,
  onSave,
  onCancel,
  onFileChange,
  previewUrls,
  isEditing,
}) => (
  <div
    className={`bg-white p-10 md:p-14 ${!isEditing ? "rounded-[3rem] border border-gray-100 shadow-2xl" : ""}`}
  >
    <div className="flex justify-between items-center mb-12">
      <h2 className="text-4xl font-black italic uppercase tracking-tighter">
        {isEditing ? "Edit Definition" : "Draft New Entry"}
      </h2>
      {isEditing && (
        <button
          onClick={onCancel}
          className="p-3 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={28} />
        </button>
      )}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      <div className="lg:col-span-7 space-y-8">
        <div>
          <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-300 mb-3 block ml-1">
            Designation
          </label>
          <input
            name="name"
            value={product.name}
            onChange={onChange}
            className="w-full p-5 bg-gray-50 border-none rounded-[1.5rem] outline-none font-bold text-lg focus:ring-2 ring-black transition-all"
          />
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-300 mb-3 block ml-1">
              Valuation (₹)
            </label>
            <input
              name="price"
              type="number"
              value={product.price}
              onChange={onChange}
              className="w-full p-5 bg-gray-50 border-none rounded-[1.5rem] outline-none font-black text-lg focus:ring-2 ring-black transition-all"
            />
          </div>
          <div>
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-300 mb-3 block ml-1">
              Volume / Units
            </label>
            <input
              name="stock"
              type="number"
              value={product.stock}
              onChange={onChange}
              className="w-full p-5 bg-gray-50 border-none rounded-[1.5rem] outline-none font-black text-lg focus:ring-2 ring-black transition-all"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-300 mb-3 block ml-1">
              Classification
            </label>
            <select
              name="category"
              value={product.category}
              onChange={onChange}
              className="w-full p-5 bg-gray-50 border-none rounded-[1.5rem] outline-none font-bold focus:ring-2 ring-black transition-all appearance-none"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-300 mb-3 block ml-1">
              Identifier / Tag
            </label>
            <input
              name="tag"
              value={product.tag || ""}
              onChange={onChange}
              placeholder="e.g. PREMIUM"
              className="w-full p-5 bg-gray-50 border-none rounded-[1.5rem] outline-none font-bold focus:ring-2 ring-black transition-all"
            />
          </div>
        </div>
        <div>
          <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-300 mb-3 block ml-1">
            Item Synopsis
          </label>
          <textarea
            name="description"
            value={product.description || ""}
            onChange={onChange}
            rows="4"
            className="w-full p-5 bg-gray-50 border-none rounded-[1.5rem] outline-none font-medium resize-none focus:ring-2 ring-black transition-all"
          />
        </div>
      </div>

      <div className="lg:col-span-5 flex flex-col">
        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-300 mb-3 block ml-1">
          Visual Asset
        </label>
        <div className="flex-grow flex flex-col items-center justify-center border-4 border-dashed border-gray-100 rounded-[3rem] p-10 bg-gray-50 min-h-[300px] relative group hover:border-gray-200 transition-all">
          {previewUrls && previewUrls.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
              {previewUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt="preview"
                  className="rounded-xl h-24 w-full object-cover"
                />
              ))}

              <label className="cursor-pointer bg-black text-white px-6 py-2 rounded-full text-xs font-bold uppercase mt-4 block text-center">
                Add More
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={onFileChange}
                />
              </label>
            </div>
          ) : (
            <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer py-10">
              <ImageIcon size={48} className="text-gray-200 mb-4" />

              <p className="text-black font-black uppercase text-xs tracking-widest">
                Attach Images
              </p>

              <p className="text-gray-400 text-[10px] font-bold mt-2 uppercase">
                PNG / JPG up to 5MB
              </p>

              <input
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={onFileChange}
              />
            </label>
          )}
        </div>
      </div>
    </div>

    <div className="mt-16 flex justify-end items-center space-x-6">
      {!isEditing && (
        <button
          onClick={onCancel}
          className="font-black uppercase text-xs tracking-[0.2em] text-gray-300 hover:text-black transition-colors"
        >
          Discard Draft
        </button>
      )}
      <button
        onClick={() => onSave(product)}
        className="px-16 py-5 rounded-[1.5rem] font-black uppercase text-xs tracking-[0.2em] bg-black text-white shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-y-1 transition-all"
      >
        {isEditing ? "Commit Changes" : "Publish Entry"}
      </button>
    </div>
  </div>
);

export default AdminProducts;
