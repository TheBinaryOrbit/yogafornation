"use client"

import { useState } from "react"
import { ArrowLeft, Smartphone, Send } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import loginImage from "../assets/login.png"

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        phonenumber: "",
    })
    const [isLoading, setIsLoading] = useState(false)

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post("https://lightsteelblue-woodcock-286554.hostingersite.com/api/forgot-password", {
                phonenumber: formData.phonenumber
            });
            
            if (response.status === 200 && response.data.success) {
                toast.success("OTP sent successfully to your phone number!", {
                    position: "top-right",
                    autoClose: 3000,
                });
                setTimeout(() => {
                    navigate("/reset-password", { 
                        state: { phonenumber: formData.phonenumber } 
                    });
                }, 2000);
            } else {
                toast.error("Failed to send OTP. Please check your phone number.", {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
        } catch (error) {
            console.error("Forgot password error:", error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message, {
                    position: "top-right",
                    autoClose: 3000,
                });
            } else {
                toast.error("Error sending OTP. Please try again later.", {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
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
                        to="/login" 
                        className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
                    >
                        <ArrowLeft className="w-5 h-5 mr-1" />
                        Back to Login
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
                    <h1 className="text-3xl font-bold text-green-700 mb-2">FORGOT PASSWORD</h1>
                    <div className="flex items-center justify-center">
                        <div className="w-6 h-0.5 bg-green-500 mr-2"></div>
                        <p className="text-lg text-blue-600 font-medium">Reset Your Password</p>
                        <div className="w-6 h-0.5 bg-green-500 ml-2"></div>
                    </div>
                </div>

                {/* Instructor Section */}
                {/* <div className="mb-8 text-center relative">
                    <div className="relative inline-block"> */}
                        {/* <img
                            src={loginImage}
                            alt="Lovnish Gupta"
                            className="w-48 h-48 rounded-full mx-auto object-cover border-4 border-white shadow-lg"
                        /> */}
                        {/* Instructor Details Overlay */}
                        {/* <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg border border-gray-200">
                            <h2 className="text-sm font-bold text-gray-800 mb-1">Lovnish Gupta</h2>
                            <p className="text-xs text-gray-600 mb-1">CEO & Founder, Yoga for Nation</p>
                            <p className="text-xs text-gray-600">Yoga Alliance Certified | 18+ Years Exp.</p>
                        </div> */}
                    {/* </div>
                </div> */}

                {/* Forgot Password Form */}
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-green-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">Reset Password</h3>
                    <p className="text-sm text-gray-600 mb-6 text-center">
                        Enter your phone number to receive an OTP for password reset
                    </p>
                    
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Phone Input */}
                        <div className="relative">
                            <div className="flex">
                                <span className="px-3 py-3 border border-gray-300 rounded-l-lg bg-gray-100">
                                    <span>
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Flag_of_India.svg" alt="" className="inline-block h-4 mr-1 -translate-y-0.5 rounded-sm" />
                                        +91
                                    </span>
                                </span>
                                <input
                                    type="tel"
                                    name="phonenumber"
                                    placeholder="Enter your WhatsApp Number"
                                    value={formData.phonenumber}
                                    onChange={handleInputChange}
                                    className="flex-1 block w-full pl-2 pr-3 py-3 rounded-r-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Sending OTP...
                                </div>
                            ) : (
                                <>
                                    <Send className="w-5 h-5 mr-2" />
                                    Send OTP
                                </>
                            )}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-6 text-center text-gray-600 border-t border-gray-100 pt-4">
                        <p>Remember your password? <Link to="/login" className="text-green-500 font-semibold hover:text-green-600">Login</Link></p>
                    </div>
                </div>

                {/* Footer Note */}
                <p className="text-xs text-gray-500 mt-6 text-center">
                    You will receive an OTP on your registered WhatsApp number
                </p>
            </div>
            <ToastContainer />
        </div>
    )
}

export default ForgotPassword