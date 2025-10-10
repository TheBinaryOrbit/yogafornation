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
        dialCode: "+91",
        name: "India",
        flag: "https://flagcdn.com/w320/in.png"
    })
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // Country codes data with flag URLs
    const countryCodes = [
        { code: "IN", dialCode: "+91", name: "India", flag: "https://flagcdn.com/w320/in.png" },
        { code: "US", dialCode: "+1", name: "United States", flag: "https://flagcdn.com/w320/us.png" },
        { code: "GB", dialCode: "+44", name: "United Kingdom", flag: "https://flagcdn.com/w320/gb.png" },
        { code: "CA", dialCode: "+1", name: "Canada", flag: "https://flagcdn.com/w320/ca.png" },
        { code: "AU", dialCode: "+61", name: "Australia", flag: "https://flagcdn.com/w320/au.png" },
        { code: "DE", dialCode: "+49", name: "Germany", flag: "https://flagcdn.com/w320/de.png" },
        { code: "FR", dialCode: "+33", name: "France", flag: "https://flagcdn.com/w320/fr.png" },
        { code: "JP", dialCode: "+81", name: "Japan", flag: "https://flagcdn.com/w320/jp.png" },
        { code: "SG", dialCode: "+65", name: "Singapore", flag: "https://flagcdn.com/w320/sg.png" },
        { code: "AE", dialCode: "+971", name: "UAE", flag: "https://flagcdn.com/w320/ae.png" },
        { code: "SA", dialCode: "+966", name: "Saudi Arabia", flag: "https://flagcdn.com/w320/sa.png" },
        { code: "MY", dialCode: "+60", name: "Malaysia", flag: "https://flagcdn.com/w320/my.png" },
        { code: "TH", dialCode: "+66", name: "Thailand", flag: "https://flagcdn.com/w320/th.png" },
        { code: "ID", dialCode: "+62", name: "Indonesia", flag: "https://flagcdn.com/w320/id.png" },
        { code: "PH", dialCode: "+63", name: "Philippines", flag: "https://flagcdn.com/w320/ph.png" },
        { code: "CN", dialCode: "+86", name: "China", flag: "https://flagcdn.com/w320/cn.png" },
        { code: "BR", dialCode: "+55", name: "Brazil", flag: "https://flagcdn.com/w320/br.png" },
        { code: "MX", dialCode: "+52", name: "Mexico", flag: "https://flagcdn.com/w320/mx.png" },
        { code: "RU", dialCode: "+7", name: "Russia", flag: "https://flagcdn.com/w320/ru.png" },
        { code: "IT", dialCode: "+39", name: "Italy", flag: "https://flagcdn.com/w320/it.png" },
        { code: "ES", dialCode: "+34", name: "Spain", flag: "https://flagcdn.com/w320/es.png" },
        { code: "KR", dialCode: "+82", name: "South Korea", flag: "https://flagcdn.com/w320/kr.png" },
        { code: "TR", dialCode: "+90", name: "Turkey", flag: "https://flagcdn.com/w320/tr.png" },
        { code: "AR", dialCode: "+54", name: "Argentina", flag: "https://flagcdn.com/w320/ar.png" },
        { code: "ZA", dialCode: "+27", name: "South Africa", flag: "https://flagcdn.com/w320/za.png" },
        { code: "EG", dialCode: "+20", name: "Egypt", flag: "https://flagcdn.com/w320/eg.png" },
        { code: "NG", dialCode: "+234", name: "Nigeria", flag: "https://flagcdn.com/w320/ng.png" },
        { code: "KE", dialCode: "+254", name: "Kenya", flag: "https://flagcdn.com/w320/ke.png" },
        { code: "BD", dialCode: "+880", name: "Bangladesh", flag: "https://flagcdn.com/w320/bd.png" },
        { code: "PK", dialCode: "+92", name: "Pakistan", flag: "https://flagcdn.com/w320/pk.png" },
        { code: "LK", dialCode: "+94", name: "Sri Lanka", flag: "https://flagcdn.com/w320/lk.png" },
        { code: "NP", dialCode: "+977", name: "Nepal", flag: "https://flagcdn.com/w320/np.png" },
        { code: "MM", dialCode: "+95", name: "Myanmar", flag: "https://flagcdn.com/w320/mm.png" },
        { code: "VN", dialCode: "+84", name: "Vietnam", flag: "https://flagcdn.com/w320/vn.png" },
        { code: "NL", dialCode: "+31", name: "Netherlands", flag: "https://flagcdn.com/w320/nl.png" },
        { code: "BE", dialCode: "+32", name: "Belgium", flag: "https://flagcdn.com/w320/be.png" },
        { code: "CH", dialCode: "+41", name: "Switzerland", flag: "https://flagcdn.com/w320/ch.png" },
        { code: "AT", dialCode: "+43", name: "Austria", flag: "https://flagcdn.com/w320/at.png" },
        { code: "SE", dialCode: "+46", name: "Sweden", flag: "https://flagcdn.com/w320/se.png" },
        { code: "NO", dialCode: "+47", name: "Norway", flag: "https://flagcdn.com/w320/no.png" },
        { code: "DK", dialCode: "+45", name: "Denmark", flag: "https://flagcdn.com/w320/dk.png" },
        { code: "FI", dialCode: "+358", name: "Finland", flag: "https://flagcdn.com/w320/fi.png" },
        { code: "PL", dialCode: "+48", name: "Poland", flag: "https://flagcdn.com/w320/pl.png" },
        { code: "CZ", dialCode: "+420", name: "Czech Republic", flag: "https://flagcdn.com/w320/cz.png" },
        { code: "HU", dialCode: "+36", name: "Hungary", flag: "https://flagcdn.com/w320/hu.png" },
        { code: "GR", dialCode: "+30", name: "Greece", flag: "https://flagcdn.com/w320/gr.png" },
        { code: "PT", dialCode: "+351", name: "Portugal", flag: "https://flagcdn.com/w320/pt.png" },
        { code: "IE", dialCode: "+353", name: "Ireland", flag: "https://flagcdn.com/w320/ie.png" },
        { code: "IL", dialCode: "+972", name: "Israel", flag: "https://flagcdn.com/w320/il.png" },
        { code: "NZ", dialCode: "+64", name: "New Zealand", flag: "https://flagcdn.com/w320/nz.png" }
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
                                <div className="relative">
                                    <select
                                        value={selectedCountry.code}
                                        onChange={handleCountryChange}
                                        className="p-3 pl-12 pr-0 border border-gray-300 rounded-l-lg bg-gray-100 text-sm font-medium focus:ring-2 focus:ring-green-500 focus:border-green-500 min-w-[90px] appearance-none"
                                    >
                                        {countryCodes.map((country) => (
                                            <>
                                            <img
                                            src={selectedCountry.flag}
                                            alt={selectedCountry.name}
                                            className="h-6 w-8 object-cover rounded-sm border border-gray-200"
                                        />
                                            <option key={country.code} value={country.code}>
                                                {country.dialCode}
                                            </option>
                                        </>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <img
                                            src={selectedCountry.flag}
                                            alt={selectedCountry.name}
                                            className="h-6 w-8 object-cover rounded-sm border border-gray-200"
                                        />
                                    </div>
                                </div>
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