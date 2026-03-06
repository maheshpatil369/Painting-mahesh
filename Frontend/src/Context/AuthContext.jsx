// File: Frontend/src/context/AuthContext.jsx (UPDATE)

import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL as BACKEND_URL } from '../config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// --- Auth Provider Component ---

export const AuthProvider = ({ children }) => {
  // User state derived from local storage/token if available
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || null);
  const [loading, setLoading] = useState(true);

  // Function to parse and set user data from the "me" endpoint
  const setAuthData = (token, userData) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setAccessToken(token);
    setUser(userData);
  };

  // Function to clear all auth data
  const clearAuthData = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setAccessToken(null);
    setUser(null);
  };

  // Check initial auth status (runs once on load)
  useEffect(() => {
    const checkInitialAuth = async () => {
      const storedToken = localStorage.getItem('accessToken');
      const storedUser = JSON.parse(localStorage.getItem('user'));

      if (storedToken && storedUser) {
        // We rely on the ProtectedRoute to validate the token on page load,
        // but we initialize the context state for immediate access.
        setAccessToken(storedToken);
        setUser(storedUser);
      }
      setLoading(false);
    };

    checkInitialAuth();
  }, []);

  // Since the login is handled on the /login page, we only need a logout function
  // and context variables to track status.

  const adminLogout = async () => { // Renamed from your mock function
		try {
			// We assume your /api/auth/logout handles cookie clearance
			await fetch(`${BACKEND_URL}/auth/logout`, { method: "POST", credentials: "include" });
		} catch (error) {
      console.warn("Logout request failed (network error or server down), proceeding with client-side clear.", error);
    }
    clearAuthData();
  };
  
  // 🔑 THE CRITICAL CHANGE: Derive isAdmin from the user object role
  const isAdmin = user?.role === 'ADMIN';

  const value = {
    user,
    accessToken,
    isAdmin,
    loading,
    adminLogout,
    setAuthData, // Utility function to be used by the Login page upon success
    clearAuthData,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;