import axios from 'axios';

// Centralized backend URL configuration
export const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'https://demo-shop-ni7w.onrender.com';
export const API_URL = `${BASE_URL}/api`;

const getHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    headers: {
      'Authorization': `Bearer ${token}`
      // Note: Multer handles 'multipart/form-data' automatically when using FormData objects
    }
  };
};

export const productService = {
  getAll: async () => {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  },

  getById: async (id) => {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data;
  },

  create: async (formData) => {
    // formData must be an instance of FormData() for S3 image uploads
    const response = await axios.post(`${API_URL}/products`, formData, getHeaders());
    return response.data;
  },

  update: async (id, formData) => {
    // formData must be an instance of FormData() for S3 image uploads
    const response = await axios.put(`${API_URL}/products/${id}`, formData, getHeaders());
    return response.data;
  },

  delete: async (id) => {
    const response = await axios.delete(`${API_URL}/products/${id}`, getHeaders());
    return response.data;
  }
};

// --- Named Exports for Backward Compatibility ---
export const fetchAllProducts = productService.getAll;
export const fetchProductById = productService.getById;
export const createProduct = productService.create;
export const updateProduct = productService.update;
export const deleteProduct = productService.delete;

/**
 * Satisfies the requirement for Featured Products in Home.jsx.
 */
export const fetchFeaturedProducts = async () => {
    const products = await productService.getAll();
    // Logic: Featured usually means products with a specific tag or just the newest ones
    return products.slice(0, 8); 
};