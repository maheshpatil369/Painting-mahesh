// File: Frontend/src/pages/Signup.jsx (UPDATE)

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { API_URL as BACKEND_URL } from '../config';
const API_SIGNUP_ENDPOINT = `${BACKEND_URL}/signup`;

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    // 🔑 NEW: Add phone field for backend compatibility
    phone: "", 
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    // ... (submission logic remains the same)
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(API_SIGNUP_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Signup failed");
      }

      setMessage("Signup successful! Redirecting to login...");
      
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create an Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            value={formData.name}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {/* Email Input */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            value={formData.email}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {/* 🔑 NEW: Phone Input for backend compatibility */}
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number (Optional)"
            onChange={handleChange}
            value={formData.phone}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {/* Password Input */}
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
            {loading ? "Signing up..." : "Signup"}
          </button>
        </form>
        {message && (
          <p className={`mt-4 text-center ${message.includes('success') ? 'text-green-500' : 'text-red-500'}`}>
            {message}
          </p>
        )}
        
        <div className="mt-4 text-center text-sm">
            Already have an account? <a href="/login" className="text-indigo-600 font-semibold hover:text-indigo-800">Login here</a>
        </div>

      </div>
    </div>
  );
}