// File: Frontend/src/pages/AdminLogin.jsx (MAJOR UPDATE: Now a Redirect)

import React, { useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext.jsx'; 
import { Lock } from 'lucide-react';

const AdminLogin = () => {
    const { isAdmin, user } = useAuth();
    
    // If the user is logged in, redirect them immediately.
    if (isAdmin) {
        return <Navigate to="/admin/dashboard" replace />;
    }
    if (user) {
        return <Navigate to="/user" replace />;
    }
    
    // Since /login handles all authentication, this page now just redirects there.
    // NOTE: This assumes you added AdminLogin to your Routes in App.jsx.
    
    return (
        <div className="bg-gray-100 min-h-[calc(100vh-80px)] flex items-center justify-center py-12">
            <div className="text-center">
                <Lock className="h-10 w-10 text-black mx-auto mb-3" />
                <h1 className="text-2xl font-black text-black italic uppercase mb-4">Redirecting to Unified Login...</h1>
                {/* Use the Navigate component for the redirection */}
                <Navigate to="/login" replace={true} />
            </div>
        </div>
    );
};

export default AdminLogin;