"use client"

import { useState, useEffect } from "react"
import { Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useAdminAuth } from "../contexts/AdminAuthContext"

export default function AdminLogin() {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAdminAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/admin/dashboard")
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      console.log("🔐 Attempting admin login:", { username: formData.username })

      const response = await axios.post(
        "https://api.yogafornation.com/api/admin/login",
        {
          username: formData.username,
          password: formData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      )

      console.log("✅ Admin login response:", response.data)

      if (response.data.success) {
        const { admin, token } = response.data
        
        // Create admin object with available data and default permissions
        const adminData = {
          id: admin.id,
          name: admin.username, // Use username as name since that's what we have
          username: admin.username,
          email: admin.email || '', // Default empty if not provided
          is_admin: 1
        }
        
        // Default admin permissions since backend doesn't provide them
        const defaultPermissions = [
          "view_all_donations",
          "approve_donations", 
          "reject_donations",
          "view_analytics",
          "download_screenshots",
          "manage_users",
          "manage_classes",
          "manage_resources"
        ]

        // Use context login method
        login(adminData, token, defaultPermissions)

        // Show success message
        toast.success(`Welcome back, ${adminData.name}!`)
        
        console.log("🎉 Admin login successful, redirecting to dashboard...")
        
        // Redirect to admin dashboard
        setTimeout(() => {
          navigate("/admin/dashboard")
        }, 1000)

      } else {
        setError(response.data.message || "Login failed")
        toast.error(response.data.message || "Login failed")
      }

    } catch (error) {
      console.error("❌ Admin login error:", error)
      
      if (error.response) {
        // Server responded with error
        const errorMessage = error.response.data?.message || "Invalid credentials"
        setError(errorMessage)
        toast.error(errorMessage)
      } else if (error.request) {
        // Network error
        setError("Unable to connect to server. Please try again.")
        toast.error("Unable to connect to server. Please try again.")
      } else {
        // Other error
        setError("An unexpected error occurred. Please try again.")
        toast.error("An unexpected error occurred. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    // Clear error when user starts typing
    if (error) setError("")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/png-logo-j9moV4DkAQHKCtbAK5mKGOyrYzxFGO.png"
            alt="Yoga For Nation Logo"
            className="h-16 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Portal</h1>
          <p className="text-gray-600">Sign in to manage your yoga platform</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* username Field */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="username"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="admin"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="Enter your password"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
              loading 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            } text-white`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Signing In...
              </div>
            ) : (
              "Sign In to Admin Panel"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">Secure admin access for Yoga For Nation</p>
          <div className="mt-4 text-xs text-gray-400">
            <p>Demo credentials:</p>
            <p>Username: admin</p>
            <p>Password: admin123</p>
          </div>
        </div>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </div>
  )
}
