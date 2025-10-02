"use client"

import { useEffect, useState } from "react"
import { Users, EyeOff, Eye, IndianRupee, Lock, Smartphone } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import useGetuser from "../hooks/user"
import loginImage from "../assets/login.png"

const Login = () => {
    const user = useGetuser();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        phonenumber: "",
        password: "",
    })
    const [selectedCountry, setSelectedCountry] = useState({
        code: "IN",
        dialCode: "+91"
    })
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // Country codes data
    const countryCodes = [
        { code: "IN", dialCode: "+91", name: "India" },
        { code: "US", dialCode: "+1", name: "United States" },
        { code: "GB", dialCode: "+44", name: "United Kingdom" },
        { code: "CA", dialCode: "+1", name: "Canada" },
        { code: "AU", dialCode: "+61", name: "Australia" },
        { code: "DE", dialCode: "+49", name: "Germany" },
        { code: "FR", dialCode: "+33", name: "France" },
        { code: "JP", dialCode: "+81", name: "Japan" },
        { code: "SG", dialCode: "+65", name: "Singapore" },
        { code: "AE", dialCode: "+971", name: "UAE" },
        { code: "SA", dialCode: "+966", name: "Saudi Arabia" },
        { code: "MY", dialCode: "+60", name: "Malaysia" },
        { code: "TH", dialCode: "+66", name: "Thailand" },
        { code: "ID", dialCode: "+62", name: "Indonesia" },
        { code: "PH", dialCode: "+63", name: "Philippines" }
    ]

    useEffect(() => {
        if (user) {
            navigate("/dashboard");
        }
    }, [user, navigate])

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleCountryChange = (e) => {
        const selected = countryCodes.find(country => country.code === e.target.value)
        setSelectedCountry(selected)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post("https://lightsteelblue-woodcock-286554.hostingersite.com/api/login", {
                phonenumber: formData.phonenumber,
                password: formData.password
            });

            if (response.status === 200 && response.data.success) {
                // Store token and user info as needed
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.user));
                toast.success("Login successful!", {
                    position: "top-right",
                    autoClose: 2000,
                });
                setTimeout(() => {
                    navigate("/dashboard");
                }, 1000);
            } else {
                toast.error("Login failed. Please check your credentials.", {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error("Error during login. Please try again later.", {
                position: "top-right",
                autoClose: 3000,
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen">
            <div className="min-h-screen  max-w-md mx-auto bg-gradient-to-br from-green-100 via-white to-blue-50">
                {/* Logo */}
                <div className="text-center">
                    <img
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/png-logo-j9moV4DkAQHKCtbAK5mKGOyrYzxFGO.png"
                        alt="Yoga For Nation Logo"
                        className="h-40 mx-auto drop-shadow-md"
                    />
                </div>

                {/* Main Heading */}
                <div className="text-center">

                    <h1 className="text-3xl font-bold text-green-700 mb-2">FREE ONLINE YOGA</h1>
                    <div className="flex items-center justify-center">
                        <div className="w-6 h-0.5 bg-green-500 mr-2"></div>
                        <p className="text-lg text-blue-600 font-medium">A Movement for a Healthier Nation</p>
                        <div className="w-6 h-0.5 bg-green-500 ml-2"></div>
                    </div>
                </div>

                {/* Instructor Section */}
                <div className="mb-10 text-center relative bg-white
                 [mask-image:radial-gradient(circle,rgba(255,255,255,1)_70%,rgba(255,255,255,0)_100%)]
                 [-webkit-mask-image:radial-gradient(circle,rgba(255,255,255,1)_70%,rgba(255,255,255,0)_100%)]
                 [mask-repeat:no-repeat] [mask-position:center] [mask-size:cover]">
                    <div className="relative inline-block">
                        <img
                            src={loginImage}
                            alt="Lovnish Gupta"
                            className="object-cover"
                        />
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-full px-4  bg-white
                 [mask-image:radial-gradient(circle,rgba(255,255,255,1)_70%,rgba(255,255,255,0)_100%)]
                 [-webkit-mask-image:radial-gradient(circle,rgba(255,255,255,1)_70%,rgba(255,255,255,0)_100%)]
                 [mask-repeat:no-repeat] [mask-position:center] [mask-size:cover] pb-4">
                            <div className="text-center leading-none">
                                <h2 className="text-green-700 font-bold uppercase tracking-wide text-2xl">
                                    Lovnish Gupta
                                </h2>
                                <p className="mt-1 text-slate-900 font-extrabold">
                                    Govt Certified Yoga Teacher
                                </p>
                                <p className="text-slate-600 text-sm">
                                    IIT Graduate | 12+ Years Exp.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>



                {/* Registration Form */}
                <div className="rounded-2xl px-6">
                    {/* <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Welcome Back</h3> */}
                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Phone Input */}
                        <div className="relative">
                            <div className="flex mt-10">
                                <select
                                    value={selectedCountry.code}
                                    onChange={handleCountryChange}
                                    className="px-3 py-3 border border-gray-300 rounded-l-lg bg-gray-100 text-sm font-medium focus:ring-2 focus:ring-green-500 focus:border-green-500 min-w-[80px]"
                                >
                                    {countryCodes.map((country) => (
                                        <option key={country.code} value={country.code}>
                                            {country.code} {country.dialCode}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="tel"
                                    name="phonenumber"
                                    placeholder="Enter Phone Number"
                                    value={formData.phonenumber}
                                    onChange={handleInputChange}
                                    className="flex-1 block w-full pl-3 pr-3 py-3 rounded-r-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    required
                                />
                            </div>
                            <div className="text-xs text-gray-500 mt-1 ml-1">
                                Selected: {selectedCountry.name} ({selectedCountry.dialCode})
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Enter Your Password"
                                value={formData.password}
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

                        {/* Forgot Password Link */}
                        <div className="text-right">
                            <Link to="/forgot-password" className="text-sm text-green-600 hover:text-green-700">
                                Forgot Password?
                            </Link>
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
                                    Joining...
                                </div>
                            ) : (
                                "Click to join for free"
                            )}
                        </button>
                        <p className="text-center text-green-500 font-semibold">Join the Thousands who have already started their journey with us.</p>

                    </form>

                    {/* Sign Up Link */}
                    <div className="mt-2 text-center text-gray-600 border-t border-gray-100 pt-2">
                        <p>Don't have an account? <Link to="/register" className="text-green-500 font-semibold hover:text-green-600">Sign up</Link></p>
                    </div>
                </div>

                {/* Footer Note */}
                {/* <p className="text-xs text-gray-500 mt-6 text-center">
                    By continuing, you agree to our Terms of Service and Privacy Policy
                </p> */}
            </div>
            <ToastContainer />
        </div>
    )
}

export default Login