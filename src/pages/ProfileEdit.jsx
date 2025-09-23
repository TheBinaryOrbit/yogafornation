"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Save, User, Mail, MapPin, Calendar, Target } from "lucide-react"
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
        phonenumber : ""
    });

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

            const response = await axios.get(`https://api.yogafornation.com/api/user?user_id=${storedUser.id}`, {
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
                    birtyear: userData.birtyear || "",
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

            const response = await axios.put("https://api.yogafornation.com/api/profile", formData, {
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
                    birtyear: response.data.user.birtyear || "",
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

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

    return (
        <div className="min-h-screen bg-gray-50 max-w-md mx-auto">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
                <div className="flex items-center justify-between p-4">
                    <button 
                        onClick={() => {
                           window.history.back();
                        }}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 cursor-pointer"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back</span>
                    </button>
                    <h1 className="text-lg font-semibold text-gray-800">Edit Profile</h1>
                    <div className="w-16"></div> {/* Spacer for centering */}
                </div>
            </header>

            {/* Form Content */}
            <main className="p-4 pb-20">
                {fetchingProfile ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading profile...</p>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                        <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                            <User className="w-4 h-4" />
                            User Id
                        </label>
                        <input
                            type="text"
                            name="user_id"
                            value={formData.user_id}
                            onChange={handleInputChange}
                            placeholder="Enter your user ID"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                            readOnly
                        />
                    </div>
                    {/* Name */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                        <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                            <User className="w-4 h-4" />
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter your full name"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow-sm">
                        <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                            <User className="w-4 h-4" />
                            Phone Number
                        </label>
                        <input
                            type="text"
                            name="phonenumber"
                            value={formData.phonenumber}
                            onChange={handleInputChange}
                            placeholder="Enter your phone number"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                        <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                            <Mail className="w-4 h-4" />
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email address"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Gender */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                        <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                            <User className="w-4 h-4" />
                            Gender
                        </label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {/* City */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                        <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                            <MapPin className="w-4 h-4" />
                            City
                        </label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="Enter your city"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Birth Year */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                        <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                            <Calendar className="w-4 h-4" />
                            Birth Year
                        </label>
                        <select
                            name="birtyear"
                            value={formData.birtyear}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Select Birth Year</option>
                            {years.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>

                    {/* Primary Goal */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                        <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                            <Target className="w-4 h-4" />
                            Primary Goal
                        </label>
                        <select
                            name="primarygoal"
                            value={formData.primarygoal}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Select Your Primary Goal</option>
                            {goals.map(goal => (
                                <option key={goal} value={goal}>{goal}</option>
                            ))}
                        </select>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Updating Profile...
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-2">
                                <Save className="w-4 h-4" />
                                Save Profile
                            </div>
                        )}
                    </button>
                </form>
                )}
            </main>

            <ToastContainer />
        </div>
    );
};

export default ProfileEdit;