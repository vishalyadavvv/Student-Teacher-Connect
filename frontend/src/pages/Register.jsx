import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { URL } from "../constant/api";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    terms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (!form.terms) {
      setError("You must accept the terms and conditions!");
      return;
    }

    setIsLoading(true);
    try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // include cookies if backend sets them
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      }),
    });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      console.log("Registration successful:", data);
      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-green-600 rounded-lg flex items-center justify-center">
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">Join us and start learning</p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Confirm your password"
                value={form.confirmPassword}
                onChange={handleChange}
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={form.role}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>

            {/* Terms */}
            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={form.terms}
                onChange={handleChange}
                className="h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
                I agree to the Terms and Conditions
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading ? "Creating account..." : "Create account"}
          </button>

          <p className="text-center text-sm text-gray-600 mt-2">
            Already have an account?{" "}
            <button type="button" className="text-green-600" onClick={() => navigate("/login")}>
              Sign in
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
