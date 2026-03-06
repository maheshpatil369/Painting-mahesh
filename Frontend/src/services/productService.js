// Product API Service
import { API_URL as BACKEND_URL } from '../config';
const API_PRODUCTS_ENDPOINT = `${BACKEND_URL}/products`;

/**
 * Fetch all products from the backend
 * @returns {Promise<Array>} Array of products
 */
export const fetchAllProducts = async () => {
  try {
    const response = await fetch(API_PRODUCTS_ENDPOINT);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }
    
    const products = await response.json();
    
    // Normalize product IDs - convert _id to id for frontend compatibility
    return products.map(product => ({
      ...product,
      id: product._id || product.id
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

/**
 * Fetch a single product by ID
 * @param {string} productId - Product ID (_id or id)
 * @returns {Promise<Object>} Product object
 */
export const fetchProductById = async (productId) => {
  try {
    const response = await fetch(`${API_PRODUCTS_ENDPOINT}/${productId}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Product not found');
      }
      throw new Error(`Failed to fetch product: ${response.status}`);
    }
    
    const product = await response.json();
    
    // Normalize product ID
    return {
      ...product,
      id: product._id || product.id
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

/**
 * Fetch featured products (products with tags like 'Best Seller', 'New', etc.)
 * @returns {Promise<Array>} Array of featured products
 */
export const fetchFeaturedProducts = async () => {
  try {
    const allProducts = await fetchAllProducts();
    
    // Filter products with tags
    const featured = allProducts.filter(
      p => p.tag && (p.tag === 'Best Seller' || p.tag === 'New' || p.tag === 'Popular' || p.tag === 'Hot')
    );
    
    return featured.slice(0, 3);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
};

