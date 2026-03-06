// Centralized backend URL configuration
export const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'https://demo-shop-ni7w.onrender.com';
export const API_URL = `${BASE_URL}/api`;

export default API_URL;
