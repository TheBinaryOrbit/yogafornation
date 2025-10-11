"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Save, User, Mail, MapPin, Calendar, Target, Phone, Camera, Shield } from "lucide-react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import useGetuser from "../hooks/user"
import { useDashboard } from '../contexts/DashboardContext'

const ProfileEdit = () => {
    const user = useGetuser();
    const navigate = useNavigate();
    const { resetToHome } = useDashboard();
    const [loading, setLoading] = useState(false);
    const [fetchingProfile, setFetchingProfile] = useState(true);
    const [formData, setFormData] = useState({
        user_id: "",
        name: "",
        gender: "",
        city: "",
        birtyear: "",
        email: "",
        primarygoal: "",
        phonenumber: ""
    });

    // Helper function to convert yyyymmdd to yyyy-mm-dd for date input
    const formatDateForInput = (yyyymmdd) => {
        if (!yyyymmdd || yyyymmdd.toString().length !== 8) return "";
        const str = yyyymmdd.toString();
        return `${str.substring(0, 4)}-${str.substring(4, 6)}-${str.substring(6, 8)}`;
    };

    // Helper function to convert yyyy-mm-dd to yyyymmdd integer
    const formatDateForSubmission = (dateStr) => {
        if (!dateStr) return "";
        return parseInt(dateStr.replace(/-/g, ''));
    };

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            setFetchingProfile(true);
            const token = localStorage.getItem("token");
            const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

            if (!token || !storedUser.id) {
                navigate("/login");
                return;
            }

            const response = await axios.get(`https://lightsteelblue-woodcock-286554.hostingersite.com/api/user?user_id=${storedUser.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.data.success) {
                const userData = response.data.user;
                setFormData({
                    user_id: userData.id,
                    name: userData.name || "",
                    gender: userData.gender || "",
                    city: userData.city || "",
                    birtyear: formatDateForInput(userData.birtyear) || "",
                    email: userData.email || "",
                    primarygoal: userData.primarygoal || "",
                    phonenumber: userData.phonenumber || ""
                });

                // Update localStorage with fresh user data
                localStorage.setItem("user", JSON.stringify(userData));
            } else {
                toast.error("Failed to fetch user profile");
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
            toast.error("Error loading profile. Please try again.");
        } finally {
            setFetchingProfile(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }

            // Convert date to yyyymmdd format for submission
            const submissionData = {
                ...formData,
                birtyear: formatDateForSubmission(formData.birtyear)
            };

            const response = await axios.put("https://lightsteelblue-woodcock-286554.hostingersite.com/api/profile", submissionData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.data.success) {
                // Update localStorage with new user data
                const updatedUser = { ...JSON.parse(localStorage.getItem("user") || "{}"), ...response.data.user };
                localStorage.setItem("user", JSON.stringify(updatedUser));

                // Update form data with the response data
                setFormData({
                    user_id: response.data.user.id,
                    name: response.data.user.name || "",
                    gender: response.data.user.gender || "",
                    city: response.data.user.city || "",
                    birtyear: formatDateForInput(response.data.user.birtyear) || "",
                    email: response.data.user.email || "",
                    primarygoal: response.data.user.primarygoal || ""
                });

                toast.success("Profile updated successfully!", {
                    position: "top-right",
                    autoClose: 2000,
                });

                setTimeout(() => {
                    resetToHome();
                    navigate("/dashboard");
                }, 1000);
            } else {
                toast.error("Failed to update profile. Please try again.");
            }
        } catch (error) {
            console.error("Profile update error:", error);
            toast.error("Error updating profile. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const goals = [
        "Weight loss",
        "Flexibility",
        "Stress relief",
        "Strength building",
        "Better sleep",
        "Mindfulness",
        "Overall health"
    ];

    return (
        <div className="min-h-screen max-w-md mx-auto">
            {/* Enhanced Header */}
            <header className="sticky top-0 z-50 bg-white backdrop-blur-lg shadow-sm border-b border-gray-200">
                <div className="flex items-center justify-between p-4">
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 cursor-pointer transition-colors duration-200 p-2 rounded-lg hover:bg-gray-100"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Back</span>
                    </button>
                    <div className="text-center">
                        <h1 className="text-xl font-bold text-gray-800">
                            Edit Profile
                        </h1>
                        <p className="text-xs text-gray-500 mt-1">Update your personal information</p>
                    </div>
                    <div className="w-16"></div>
                </div>
            </header>



            {/* Enhanced Form Content */}
            <main className="p-6 pb-24">
                {fetchingProfile ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                            <p className="text-gray-600 font-medium">Loading your profile...</p>
                            <p className="text-sm text-gray-500 mt-2">Please wait a moment</p>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Personal Information Section */}
                        <div className="bg-white rounded-2xl shadow-lg p-1">
                            <div className="p-4 border-b border-gray-100">
                                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                    <User className="w-4 h-4 text-blue-500" />
                                    Personal Information
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">Basic details about yourself</p>
                            </div>

                            <div className="space-y-4 p-4">


                                {/* Name */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-gray-700 font-medium text-sm">
                                        <User className="w-4 h-4 text-gray-400" />
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter your full name"
                                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                                        required
                                    />
                                </div>

                                {/* Phone Number */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-gray-700 font-medium text-sm">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        Phone Number<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        name="phonenumber"
                                        value={formData.phonenumber}
                                        onChange={handleInputChange}
                                        placeholder="Enter your phone number"
                                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                                        required
                                    />
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-gray-700 font-medium text-sm">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        Email Address<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Enter your email address"
                                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Additional Details Section */}
                        <div className="bg-white rounded-2xl shadow-lg p-1">
                            <div className="p-4 border-b border-gray-100">
                                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                    <Target className="w-4 h-4 text-green-500" />
                                    Additional Details
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">Help us personalize your experience</p>
                            </div>

                            <div className="space-y-4 p-4">
                                {/* Gender */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-gray-700 font-medium text-sm">
                                        <User className="w-4 h-4 text-gray-400" />
                                        Gender<span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleInputChange}
                                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white appearance-none"
                                        required
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                {/* City */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-gray-700 font-medium text-sm">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        City<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        placeholder="Enter your city"
                                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                                        required
                                    />
                                </div>

                                {/* Date of Birth */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-gray-700 font-medium text-sm">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        Date of Birth<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        name="birtyear"
                                        value={formData.birtyear}
                                        onChange={handleInputChange}
                                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                                        max={new Date().toISOString().split('T')[0]}
                                        required
                                    />
                                </div>

                                {/* Primary Goal */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-gray-700 font-medium text-sm">
                                        <Target className="w-4 h-4 text-gray-400" />
                                        Primary Goal<span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="primarygoal"
                                        value={formData.primarygoal}
                                        onChange={handleInputChange}
                                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white appearance-none"
                                        required
                                    >
                                        <option value="">Select Your Primary Goal</option>
                                        {goals.map(goal => (
                                            <option key={goal} value={goal}>{goal}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg group"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                                    Updating Profile...
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-3">
                                    <Save className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                                    <span className="text-lg">Save Changes</span>
                                </div>
                            )}
                        </button>
                    </form>
                )}
            </main>

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    );
};

export default ProfileEdit;