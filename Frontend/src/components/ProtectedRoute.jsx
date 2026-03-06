// File: Frontend/src/components/ProtectedRoute.jsx (UPDATE)

import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
// 🔑 Import AuthContext to update user state if 'me' endpoint returns it
import { useAuth } from '../Context/AuthContext'; 
import { API_URL as BACKEND_URL } from '../config';

// 🔑 Accept 'requiredRole' as a prop
export default function ProtectedRoute({ children, requiredRole = 'CUSTOMER' }) { 
  const { setAuthData, clearAuthData } = useAuth(); // Use functions from context
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken");
      
      if (!token) {
        setIsAuthenticated(false);
        clearAuthData(); // Ensure context is cleared
        return;
      }

	try {
	const res = await fetch(`${BACKEND_URL}/auth/me`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (res.ok) {
          const { user } = await res.json();
          
          // 1. Set Auth Context State
          setAuthData(token, user); 
          
          // 2. Check Role Authorization
          if (requiredRole && user.role !== requiredRole) {
            setIsAuthenticated(true); // User is logged in
            setUserRole(user.role); // Role check will fail outside of useEffect
          } else {
            setIsAuthenticated(true);
            setUserRole(user.role);
          }

        } else {
          clearAuthData();
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        clearAuthData();
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [requiredRole]); // Depend on requiredRole

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Checking authentication...</div>
      </div>
    );
  }

  // 1. Not Authenticated -> Login Page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // 2. Authenticated but Wrong Role -> Redirect to User Dashboard or Home
  if (requiredRole === 'ADMIN' && userRole !== 'ADMIN') {
    return <Navigate to="/user" replace />; // Redirect non-admins to their user dashboard
  }

  // 3. Authenticated and Correct Role -> Access Granted
  return children;
}