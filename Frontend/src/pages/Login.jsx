// File: Frontend/src/pages/Login.jsx (UPDATE: Role-Based Redirect)

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext"; // 🔑 Import useAuth

import { API_URL as BACKEND_URL } from '../config';
const API_LOGIN_ENDPOINT = `${BACKEND_URL}/auth/login`;

export default function Login() {
  const navigate = useNavigate();
  const { setAuthData } = useAuth(); // 🔑 Get setAuthData from context
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      console.log("🚀 Attempting login...");
      
      const res = await fetch(API_LOGIN_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log("📦 Login response:", data);
      
      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Check if accessToken and user object exists
      if (!data.accessToken || !data.user) {
        console.error("❌ Invalid response structure: missing token or user data!");
        throw new Error("Authentication error: Missing user data");
      }

      // 🔑 New: Store auth data in localStorage AND the AuthContext state
      setAuthData(data.accessToken, data.user); 
      
      setMessage("Login successful! Redirecting...");
      
      // 🔑 New: Role-based Redirect Logic
      const redirectTo = data.user.role === 'ADMIN' ? '/admin/dashboard' : '/user';

      setTimeout(() => {
        console.log(`🔄 Redirecting to ${redirectTo}...`);
        navigate(redirectTo);
      }, 500);

    } catch (err) {
      console.error("❌ Login error:", err);
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            value={formData.email}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            value={formData.password}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white p-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-indigo-400"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        {message && (
          <p className={`mt-4 text-center ${message.includes('success') ? 'text-green-500' : 'text-red-500'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}