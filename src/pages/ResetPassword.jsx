"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Lock, Key, Eye, EyeOff } from "lucide-react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import loginImage from "../assets/login.png"

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const phonenumber = location.state?.phonenumber || "";

    const [formData, setFormData] = useState({
        phonenumber: phonenumber,
        otp: "",
        newPassword: "",
        confirmPassword: ""
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (!phonenumber) {
            toast.error("Please go through forgot password process first.", {
                position: "top-right",
                autoClose: 3000,
            });
            navigate("/forgot-password");
        }
    }, [phonenumber, navigate]);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate passwords match
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("Passwords do not match!", {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        // Validate password length
        if (formData.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters long!", {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post("https://lightsteelblue-woodcock-286554.hostingersite.com/api/reset-password", {
                phonenumber: formData.phonenumber,
                otp: formData.otp,
                newPassword: formData.newPassword
            });
            
            if (response.status === 200 && response.data.success) {
                toast.success("Password reset successfully! You can now login with your new password.", {
                    position: "top-right",
                    autoClose: 4000,
                });
                setTimeout(() => {
                    navigate("/login");
                }, 3000);
            } else {
                toast.error("Failed to reset password. Please check your OTP and try again.", {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
        } catch (error) {
            console.error("Reset password error:", error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message, {
                    position: "top-right",
                    autoClose: 3000,
                });
            } else {
                toast.error("Error resetting password. Please try again later.", {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
        } finally {
            setIsLoading(false);
        }
    }

    const resendOTP = async () => {
        try {
            setIsLoading(true);
            const response = await axios.post("https://lightsteelblue-woodcock-286554.hostingersite.com/api/forgot-password", {
                phonenumber: formData.phonenumber
            });
            
            if (response.status === 200 && response.data.success) {
                toast.success("OTP resent successfully!", {
                    position: "top-right",
                    autoClose: 3000,
                });
            } else {
                toast.error("Failed to resend OTP.", {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
        } catch (error) {
            console.error("Resend OTP error:", error);
            toast.error("Error resending OTP. Please try again.", {
                position: "top-right",
                autoClose: 3000,
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen">
            <div className="min-h-screen max-w-md mx-auto px-4 py-8 bg-gradient-to-br from-green-100 via-white to-blue-50">
                {/* Back Button */}
                <div className="mb-4">
                    <Link 
                        to="/forgot-password" 
                        className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
                    >
                        <ArrowLeft className="w-5 h-5 mr-1" />
                        Back
                    </Link>
                </div>

                {/* Logo */}
                <div className="mb-8 text-center">
                    <img
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/png-logo-j9moV4DkAQHKCtbAK5mKGOyrYzxFGO.png"
                        alt="Yoga For Nation Logo"
                        className="h-40 mx-auto drop-shadow-md"
                    />
                </div>

                {/* Main Heading */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-green-700 mb-2">RESET PASSWORD</h1>
                    <div className="flex items-center justify-center">
                        <div className="w-6 h-0.5 bg-green-500 mr-2"></div>
                        <p className="text-lg text-blue-600 font-medium">Set New Password</p>
                        <div className="w-6 h-0.5 bg-green-500 ml-2"></div>
                    </div>
                </div>

                {/* Instructor Section */}
                {/* <div className="mb-8 text-center relative">
                    <div className="relative inline-block">
                        <img
                            src={loginImage}
                            alt="Lovnish Gupta"
                            className="w-48 h-48 rounded-full mx-auto object-cover border-4 border-white shadow-lg"
                        />
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg border border-gray-200">
                            <h2 className="text-sm font-bold text-gray-800 mb-1">Lovnish Gupta</h2>
                            <p className="text-xs text-gray-600 mb-1">CEO & Founder, Yoga for Nation</p>
                            <p className="text-xs text-gray-600">Yoga Alliance Certified | 18+ Years Exp.</p>
                        </div>
                    </div>
                </div> */}

                {/* Reset Password Form */}
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-green-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">Enter OTP & New Password</h3>
                    <p className="text-sm text-gray-600 mb-6 text-center">
                        OTP sent to: <span className="font-semibold text-green-600">+91 {phonenumber}</span>
                    </p>
                    
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* OTP Input */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Key className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                name="otp"
                                placeholder="Enter 6-digit OTP"
                                value={formData.otp}
                                onChange={handleInputChange}
                                className="block w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                maxLength="6"
                                required
                            />
                        </div>

                        {/* New Password Input */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="newPassword"
                                placeholder="Enter New Password"
                                value={formData.newPassword}
                                onChange={handleInputChange}
                                className="block w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                required
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                {showPassword ?
                                    <Eye
                                        className="h-5 w-5 text-gray-400 cursor-pointer hover:text-green-500"
                                        onClick={() => setShowPassword(false)}
                                    /> :
                                    <EyeOff
                                        className="h-5 w-5 text-gray-400 cursor-pointer hover:text-green-500"
                                        onClick={() => setShowPassword(true)}
                                    />
                                }
                            </div>
                        </div>

                        {/* Confirm Password Input */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Confirm New Password"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className="block w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                required
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                {showConfirmPassword ?
                                    <Eye
                                        className="h-5 w-5 text-gray-400 cursor-pointer hover:text-green-500"
                                        onClick={() => setShowConfirmPassword(false)}
                                    /> :
                                    <EyeOff
                                        className="h-5 w-5 text-gray-400 cursor-pointer hover:text-green-500"
                                        onClick={() => setShowConfirmPassword(true)}
                                    />
                                }
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Resetting Password...
                                </div>
                            ) : (
                                "Reset Password"
                            )}
                        </button>

                        {/* Resend OTP */}
                        <div className="text-center">
                            <button
                                type="button"
                                onClick={resendOTP}
                                disabled={isLoading}
                                className="text-green-600 hover:text-green-700 font-medium text-sm disabled:opacity-50"
                            >
                                Didn't receive OTP? Resend
                            </button>
                        </div>
                    </form>

                    {/* Login Link */}
                    <div className="mt-6 text-center text-gray-600 border-t border-gray-100 pt-4">
                        <p>Remember your password? <Link to="/login" className="text-green-500 font-semibold hover:text-green-600">Login</Link></p>
                    </div>
                </div>

                {/* Footer Note */}
                <p className="text-xs text-gray-500 mt-6 text-center">
                    Password must be at least 6 characters long
                </p>
            </div>
            <ToastContainer />
        </div>
    )
}

export default ResetPassword