"use client"

/// <reference path="../types/razorpay.d.ts" />

import { useState, useEffect } from "react"
import { ArrowLeft, Heart, QrCode, CreditCard, Upload, CheckCircle, Clock, X, Gift, Users, Target } from "lucide-react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import donationQR from "../assets/qrcode.png"

export default function Donations() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState("donate")
    const [paymentMethod, setPaymentMethod] = useState("razorpay")
    const [amount, setAmount] = useState("")
    const [customAmount, setCustomAmount] = useState("")
    const [processing, setProcessing] = useState(false)
    const [uploadedFile, setUploadedFile] = useState(null)
    const [donationStats, setDonationStats] = useState(null)
    const [donationHistory, setDonationHistory] = useState([])
    const [loading, setLoading] = useState(false)
    const [statsError, setStatsError] = useState(false)
    const [historyError, setHistoryError] = useState(false)
    const [razorpayLoaded, setRazorpayLoaded] = useState(false)

    // Predefined donation amounts
    const predefinedAmounts = [
        { amount: 100, type: "Sewa", description: "Support daily operations" },
        { amount: 501, type: "Sahayog", description: "Help community programs" },
        { amount: 1100, type: "Samarpan", description: "Full dedication support" },
        { amount: 2100, type: "Seva Plus", description: "Extended community support" },
    ]

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || "{}")
        if (!user.id) {
            navigate("/login")
            return
        }

        if (activeTab === "history") {
            fetchDonationHistory()
        }

        // Check if Razorpay is loaded
        const checkRazorpay = () => {
            if (typeof window !== 'undefined' && window.Razorpay) {
                console.log("✅ Razorpay is available")
                setRazorpayLoaded(true)
            } else {
                console.warn("❌ Razorpay script not loaded yet")
                setRazorpayLoaded(false)
            }
        }

        // Check immediately and then after a delay
        checkRazorpay()
        setTimeout(checkRazorpay, 1000)
    }, [activeTab])

    // Fetch user donation history and stats
    const fetchDonationHistory = async () => {
        try {
            setLoading(true)
            setStatsError(false)
            setHistoryError(false)
            const token = localStorage.getItem("token")

            if (!token) {
                navigate("/login")
                return
            }

            // Fetch donation statistics
            try {
                const statsResponse = await axios.get("https://lightsteelblue-woodcock-286554.hostingersite.com/api/user/donations/stats", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                })

                if (statsResponse.data.success) {
                    setDonationStats(statsResponse.data.stats)
                } else {
                    setStatsError(true)
                    console.error("Failed to fetch stats:", statsResponse.data.message)
                }
            } catch (statsErr) {
                console.error("Error fetching donation stats:", statsErr)
                setStatsError(true)
            }

            // Fetch donation history
            try {
                const historyResponse = await axios.get("https://lightsteelblue-woodcock-286554.hostingersite.com/api/user/donations", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                })

                if (historyResponse.data.success) {
                    setDonationHistory(historyResponse.data.donations || [])
                } else {
                    setHistoryError(true)
                    console.error("Failed to fetch history:", historyResponse.data.message)
                }
            } catch (historyErr) {
                console.error("Error fetching donation history:", historyErr)
                setHistoryError(true)
            }

        } catch (error) {
            console.error("Error fetching donation data:", error)
            toast.error("Failed to load donation data")
            setStatsError(true)
            setHistoryError(true)
        } finally {
            setLoading(false)
        }
    }

    // Create Razorpay donation
    const createRazorpayDonation = async (donationAmount) => {
        try {
            const token = localStorage.getItem("token")

            if (!token) {
                navigate("/login")
                return null
            }

            console.log("Creating donation order for amount:", donationAmount)

            const response = await axios.post(
                "https://lightsteelblue-woodcock-286554.hostingersite.com/api/user/donations/razorpay",
                { amount: parseInt(donationAmount) },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            )

            console.log("Backend response:", response.data)

            if (response.data.success) {
                const order = response.data.order
                console.log("Order details:", order)

                // Validate order structure
                if (!order || !order.id || !order.amount) {
                    console.error("Invalid order structure:", order)
                    toast.error("Invalid payment order received from server")
                    return null
                }

                return {
                    order: response.data.order,
                    donationInfo: response.data.donation_info
                }
            } else {
                toast.error(response.data.message || "Failed to create payment order")
                return null
            }
        } catch (error) {
            console.error("Error creating Razorpay donation:", error)
            toast.error("Failed to create payment order")
            return null
        }
    }


    const verifyRazorpayPayment = async (paymentData , amount , user_id) => {
        try {
            const token = localStorage.getItem("token")

            if (!token) {
                navigate("/login")
                return false
            }

            console.log("🔍 Verifying payment:", paymentData)

            const response = await axios.post(
                "https://lightsteelblue-woodcock-286554.hostingersite.com/api/user/donations/razorpay/verify",
                { ...paymentData , amount , user_id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            )

            console.log("Verification response:", response.data)

            if (response.data.success) {
                console.log("✅ Payment verified successfully")
                return response.data
            } else {
                console.error("❌ Payment verification failed:", response.data.message)
                return false
            }
        } catch (error) {
            console.error("❌ Error verifying payment:", error)
            return false
        }
    }

    // Handle Razorpay payment
    const handleRazorpayPayment = async () => {
        const donationAmount = amount || customAmount

        // Validate amount
        if (!donationAmount || donationAmount < 1) {
            toast.error("Please enter a valid donation amount")
            return
        }

        // Ensure Razorpay SDK is loaded
        if (!window.Razorpay) {
            toast.error("Razorpay not loaded. Please refresh and try again.")
            return
        }

        setProcessing(true)

        try {
            // Create order on backend first
            console.log("🔄 Creating order for amount:", donationAmount)
            const orderData = await createRazorpayDonation(donationAmount)
            
            // Use the same key consistently
            const razorpayKey = "rzp_live_RKdc5GX0jimeNZ"
            
            let options
            
            if (orderData && orderData.order && orderData.order.id) {
                // Backend order creation successful
                console.log("✅ Using backend order:", orderData.order.id)
                options = {
                    key: razorpayKey,
                    order_id: orderData.order.id,
                    amount: orderData.order.amount, // Use amount from backend order (already in paise)
                    currency: orderData.order.currency || "INR",
                    name: "Yoga For Nation",
                    description: `Donation of ₹${donationAmount}`,
                    image: "/vite.svg",
                }
            } else {
                // Fallback: Direct payment without order_id (for testing)
                console.log("⚠️ Backend order failed, using direct payment")
                toast.warning("Using simplified payment mode")
                options = {
                    key: razorpayKey,
                    amount: parseInt(donationAmount) * 100, // Convert to paise
                    currency: "INR",
                    name: "Yoga For Nation",
                    description: `Donation of ₹${donationAmount}`,
                    image: "/vite.svg",
                }
            }

            // Add common options
            options = {
                ...options,
                prefill: {
                    name: JSON.parse(localStorage.getItem("user") || "{}").name || "",
                    email: JSON.parse(localStorage.getItem("user") || "{}").email || "",
                    contact: JSON.parse(localStorage.getItem("user") || "{}").phonenumber || ""
                },
                theme: { color: "#059669" },
                handler: async (response) => {
                    console.log("💳 Payment response:", response)
                    try {
                        // Only verify if we have order_id
                        if (options.order_id) {
                            const result = await verifyRazorpayPayment(response, donationAmount, JSON.parse(localStorage.getItem("user") || "{}").id)
                            if (result?.success) {
                                toast.success(`🎉 Donation of ₹${donationAmount} successful!`)
                            } else {
                                toast.error("❌ Payment verification failed. Please try again.")
                            }
                        } else {
                            // Direct payment success
                            toast.success(`🎉 Donation of ₹${donationAmount} successful!`)
                        }
                        
                        setAmount("")
                        setCustomAmount("")
                        if (activeTab === "history") fetchDonationHistory()
                    } catch (verifyError) {
                        console.error("Verification error:", verifyError)
                        toast.error("❌ Payment verification failed. Please contact support.")
                    }
                    setProcessing(false)
                },
                modal: {
                    ondismiss: () => {
                        console.log("💸 Payment modal dismissed")
                        toast.info("Payment cancelled")
                        setProcessing(false)
                    }
                }
            }

            console.log("🚀 Razorpay options:", {
                ...options,
                key: options.key.substring(0, 8) + "...",
                handler: "function",
                prefill: options.prefill
            })

            const rzp = new window.Razorpay(options)
            
            // Add error handler for payment failures
            rzp.on('payment.failed', function (response) {
                console.error("💥 Payment failed:", response.error)
                toast.error(`Payment failed: ${response.error.description || "Unknown error"}`)
                setProcessing(false)
            })

            console.log("🔓 Opening Razorpay checkout...")
            rzp.open()

        } catch (error) {
            console.error("💥 Payment error:", error)
            toast.error("Failed to start payment. Please try again.")
            setProcessing(false)
        }
    }


    // Handle QR donation submission
    const handleQRDonation = async () => {
        const donationAmount = amount || customAmount

        if (!donationAmount || donationAmount < 1) {
            toast.error("Please enter a valid donation amount")
            return
        }

        if (!uploadedFile) {
            toast.error("Please upload payment screenshot")
            return
        }

        setProcessing(true)

        try {
            const token = localStorage.getItem("token")

            if (!token) {
                navigate("/login")
                return
            }

            const formData = new FormData()
            formData.append('amount', donationAmount)
            formData.append('screenshot', uploadedFile)

            const response = await axios.post(
                "https://lightsteelblue-woodcock-286554.hostingersite.com/api/user/donations/qr",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                }
            )

            if (response.data.success) {
                toast.success(response.data.message)
                toast.info(`Expected ${response.data.donation_info.expected_karma_points} Karma Points on approval`, {
                    autoClose: 5000
                })

                // Reset form
                setAmount("")
                setCustomAmount("")
                setUploadedFile(null)

                // Refresh history if on history tab
                if (activeTab === "history") {
                    fetchDonationHistory()
                }
            } else {
                toast.error(response.data.message || "Failed to submit donation")
            }
        } catch (error) {
            console.error("Error submitting QR donation:", error)
            toast.error("Failed to submit donation")
        } finally {
            setProcessing(false)
        }
    }

    // Handle file upload
    const handleFileUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast.error("File size should be less than 5MB")
                return
            }

            if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
                toast.error("Please upload only JPG, JPEG, or PNG files")
                return
            }

            setUploadedFile(file)
        }
    }

    const getDonationTypeFromAmount = (amt) => {
        const selected = predefinedAmounts.find(item => item.amount === parseInt(amt))
        return selected ? selected.type : "Custom"
    }

    return (
        <div className="min-h-screen bg-gray-50 max-w-md mx-auto">
            {/* Header */}
            <div className="bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <h1 className="text-lg font-semibold text-gray-800">Donations</h1>
                </div>

                {/* Tabs */}
                <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => setActiveTab("donate")}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === "donate"
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        <Heart className="w-4 h-4 inline mr-2" />
                        Donate
                    </button>
                    <button
                        onClick={() => setActiveTab("history")}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === "history"
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        <Clock className="w-4 h-4 inline mr-2" />
                        History
                    </button>
                </div>
            </div>


            {/* Content */}
            <div className="p-4">
                {activeTab === "donate" ? (
                    <>
                        {/* Donation Impact Message */}
                        <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg p-4 text-white mb-6">
                            <h2 className="font-semibold mb-2">Support Our Mission</h2>
                            <p className="text-sm text-white/90">
                                Your donations help us provide free yoga classes and build a stronger community.
                                Every contribution earns you Karma Points!
                            </p>
                        </div>

                        {/* Predefined Amounts */}
                        <div className="mb-6">
                            <h3 className="font-semibold text-gray-800 mb-3">Choose Amount</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {predefinedAmounts.map((item) => (
                                    <button
                                        key={item.amount}
                                        onClick={() => {
                                            setAmount(item.amount.toString())
                                            setCustomAmount("")
                                        }}
                                        className={`p-3 rounded-lg border-2 text-left transition-colors ${amount === item.amount.toString()
                                            ? "border-green-500 bg-green-50"
                                            : "border-gray-200 hover:border-gray-300"
                                            }`}
                                    >
                                        <div className="font-semibold text-gray-800">₹{item.amount}</div>
                                        <div className="text-xs text-green-600 font-medium">{item.type}</div>
                                        <div className="text-xs text-gray-600">{item.description}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Custom Amount */}
                        <div className="mb-6">
                            <h3 className="font-semibold text-gray-800 mb-3">Or Enter Custom Amount</h3>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                                <input
                                    type="number"
                                    value={customAmount}
                                    onChange={(e) => {
                                        setCustomAmount(e.target.value)
                                        setAmount("")
                                    }}
                                    placeholder="Enter amount"
                                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Payment Method Selection */}
                        <div className="mb-6">
                            <h3 className="font-semibold text-gray-800 mb-3">Payment Method</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={() => setPaymentMethod("razorpay")}
                                    className={`w-full p-3 rounded-lg border-2 flex items-center gap-3 transition-colors ${paymentMethod === "razorpay"
                                        ? "border-green-500 bg-green-50"
                                        : "border-gray-200 hover:border-gray-300"
                                        }`}
                                >
                                    <CreditCard className="w-5 h-5 text-green-600" />
                                    <div className="text-left">
                                        <div className="font-medium text-gray-800">Online Payment</div>
                                        <div className="text-xs text-gray-600">UPI, Cards, Net Banking</div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => setPaymentMethod("qr")}
                                    className={`w-full p-3 rounded-lg border-2 flex items-center gap-3 transition-colors ${paymentMethod === "qr"
                                        ? "border-green-500 bg-green-50"
                                        : "border-gray-200 hover:border-gray-300"
                                        }`}
                                >
                                    <QrCode className="w-5 h-5 text-green-600" />
                                    <div className="text-left">
                                        <div className="font-medium text-gray-800">QR Code Payment</div>
                                        <div className="text-xs text-gray-600">Upload payment screenshot</div>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* QR Upload Section */}
                        {paymentMethod === "qr" && (
                            <div className="mb-6">
                                <img src={donationQR} alt="" className="mx-auto mb-10" />
                                <h3 className="font-semibold text-gray-800 mb-3">Upload Payment Screenshot</h3>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                    {uploadedFile ? (
                                        <div className="space-y-3">
                                            <CheckCircle className="w-8 h-8 text-green-600 mx-auto" />
                                            <div>
                                                <p className="font-medium text-gray-800">{uploadedFile.name}</p>
                                                <p className="text-sm text-gray-600">File uploaded successfully</p>
                                            </div>
                                            <button
                                                onClick={() => setUploadedFile(null)}
                                                className="text-red-600 text-sm hover:text-red-700"
                                            >
                                                Remove file
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                                            <div>
                                                <p className="font-medium text-gray-800">Upload Screenshot</p>
                                                <p className="text-sm text-gray-600">JPG, PNG files up to 5MB</p>
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/jpg,image/png"
                                                onChange={handleFileUpload}
                                                className="hidden"
                                                id="file-upload"
                                            />
                                            <label
                                                htmlFor="file-upload"
                                                className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg cursor-pointer hover:bg-green-700 transition-colors"
                                            >
                                                Choose File
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Donation Summary */}
                        {(amount || customAmount) && (
                            <div className="bg-blue-50 rounded-lg p-4 mb-6">
                                <h3 className="font-semibold text-gray-800 mb-2">Donation Summary</h3>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Amount:</span>
                                        <span className="font-medium">₹{amount || customAmount}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Type:</span>
                                        <span className="font-medium">{getDonationTypeFromAmount(amount || customAmount)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Karma Points:</span>
                                        <span className="font-medium text-green-600">~{amount || customAmount}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Test Razorpay Button - Remove in production */}
                        {/* {process.env.NODE_ENV === 'development' && (
                            <div className="space-y-2 mb-4">
                                <button
                                    onClick={() => {
                                        console.log("🧪 Testing Razorpay directly...")
                                        if (!window.Razorpay) {
                                            alert("❌ Razorpay not loaded!")
                                            return
                                        }
                                        
                                        const testOptions = {
                                            key: "rzp_test_RI2c2etBjV7jhf", // Use same key as main payment
                                            amount: 100, // ₹1 in paise
                                            currency: "INR",
                                            name: "🧪 Test Payment",
                                            description: "Test payment - This is just a test",
                                            handler: function (response) {
                                                alert("✅ Test payment successful!")
                                                console.log("Test payment response:", response)
                                            },
                                            modal: {
                                                ondismiss: function() {
                                                    console.log("Test payment modal closed")
                                                    alert("Test payment cancelled")
                                                }
                                            },
                                            theme: {
                                                color: "#059669"
                                            }
                                        }
                                        
                                        console.log("🔧 Test options:", testOptions)
                                        
                                        try {
                                            const rzp = new window.Razorpay(testOptions)
                                            console.log("🚀 Opening test Razorpay...")
                                            rzp.open()
                                        } catch (e) {
                                            alert("❌ Error: " + e.message)
                                            console.error("Test payment error:", e)
                                        }
                                    }}
                                    className="w-full py-2 px-4 rounded-lg bg-blue-500 text-white text-sm hover:bg-blue-600"
                                >
                                    🧪 Test Razorpay (₹1 - Should Open)
                                </button>
                            </div>
                        )} */}

                        {/* Donate Button */}
                        <button
                            onClick={paymentMethod === "razorpay" ? handleRazorpayPayment : handleQRDonation}
                            disabled={processing || (!amount && !customAmount) || (paymentMethod === "qr" && !uploadedFile)}
                            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${processing || (!amount && !customAmount) || (paymentMethod === "qr" && !uploadedFile)
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-green-600 text-white hover:bg-green-700"
                                }`}
                        >
                            {processing ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Processing...
                                </div>
                            ) : (
                                `Donate ₹${amount || customAmount || 0}`
                            )}
                        </button>
                    </>
                ) : (
                    /* Donation History */
                    <div>
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                            </div>
                        ) : donationStats ? (
                            <>
                                {/* Stats Overview */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-white rounded-lg p-4 shadow-sm">
                                        <div className="text-2xl font-bold text-green-600">₹{donationStats.total_amount}</div>
                                        <div className="text-sm text-gray-600">Total Donated</div>
                                    </div>
                                    <div className="bg-white rounded-lg p-4 shadow-sm">
                                        <div className="text-2xl font-bold text-blue-600">{donationStats.total_karma_points}</div>
                                        <div className="text-sm text-gray-600">Karma Points</div>
                                    </div>
                                    <div className="bg-white rounded-lg p-4 shadow-sm">
                                        <div className="text-2xl font-bold text-purple-600">{donationStats.total_donations}</div>
                                        <div className="text-sm text-gray-600">Total Donations</div>
                                    </div>
                                    <div className="bg-white rounded-lg p-4 shadow-sm">
                                        <div className="text-2xl font-bold text-orange-600">{donationStats.pending_donations}</div>
                                        <div className="text-sm text-gray-600">Pending</div>
                                    </div>
                                </div>

                                {/* Donation Breakdown */}
                                {donationStats.donation_breakdown && (
                                    <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
                                        <h3 className="font-semibold text-gray-800 mb-3">Donation Types</h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Sewa:</span>
                                                <span className="font-medium">{donationStats.donation_breakdown.sewa_count}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Sahayog:</span>
                                                <span className="font-medium">{donationStats.donation_breakdown.sahayog_count}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Samarpan:</span>
                                                <span className="font-medium">{donationStats.donation_breakdown.samarpan_count}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Recent Donations */}
                                {donationHistory.length > 0 ? (
                                    <div className="space-y-3">
                                        <h3 className="font-semibold text-gray-800">Recent Donations</h3>
                                        {donationHistory.map((donation, index) => (
                                            <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <div className="font-medium text-gray-800">₹{donation.amount}</div>
                                                        <div className="text-sm text-gray-600">{donation.donation_type}</div>
                                                    </div>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${donation.status === 'approved'
                                                        ? 'bg-green-100 text-green-800'
                                                        : donation.status === 'pending'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {donation.status}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-sm text-gray-600">
                                                    <span>{donation.payment_method}</span>
                                                    <span>{new Date(donation.created_at).toLocaleDateString()}</span>
                                                </div>
                                                {donation.karma_points_awarded && (
                                                    <div className="text-xs text-green-600 mt-1">
                                                        +{donation.karma_points_awarded} Karma Points
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Gift className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                        <p className="text-gray-500">No donations yet</p>
                                        <p className="text-sm text-gray-400">Start donating to support our mission!</p>
                                    </div>
                                )}
                            </>
                        ) : (statsError && historyError) ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500">Failed to load donation data</p>
                                <button
                                    onClick={fetchDonationHistory}
                                    className="text-green-600 text-sm font-medium hover:text-green-700 mt-2"
                                >
                                    Retry
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Show stats even if history failed */}
                                {donationStats && !statsError && (
                                    <>
                                        {/* Stats Overview */}
                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="bg-white rounded-lg p-4 shadow-sm">
                                                <div className="text-2xl font-bold text-green-600">₹{donationStats.total_amount}</div>
                                                <div className="text-sm text-gray-600">Total Donated</div>
                                            </div>
                                            <div className="bg-white rounded-lg p-4 shadow-sm">
                                                <div className="text-2xl font-bold text-blue-600">{donationStats.total_karma_points}</div>
                                                <div className="text-sm text-gray-600">Karma Points</div>
                                            </div>
                                            <div className="bg-white rounded-lg p-4 shadow-sm">
                                                <div className="text-2xl font-bold text-purple-600">{donationStats.total_donations}</div>
                                                <div className="text-sm text-gray-600">Total Donations</div>
                                            </div>
                                            <div className="bg-white rounded-lg p-4 shadow-sm">
                                                <div className="text-2xl font-bold text-orange-600">{donationStats.pending_donations}</div>
                                                <div className="text-sm text-gray-600">Pending</div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Show history error if failed */}
                                {historyError ? (
                                    <div className="text-center py-6">
                                        <p className="text-gray-500">Failed to load donation history</p>
                                        <button
                                            onClick={fetchDonationHistory}
                                            className="text-green-600 text-sm font-medium hover:text-green-700 mt-2"
                                        >
                                            Retry
                                        </button>
                                    </div>
                                ) : donationHistory.length > 0 ? (
                                    <div className="space-y-3">
                                        <h3 className="font-semibold text-gray-800">Recent Donations</h3>
                                        {donationHistory.map((donation, index) => (
                                            <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <div className="font-medium text-gray-800">₹{donation.amount}</div>
                                                        <div className="text-sm text-gray-600">{donation.category || donation.donation_type}</div>
                                                    </div>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${donation.status === 'approved'
                                                        ? 'bg-green-100 text-green-800'
                                                        : donation.status === 'pending'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {donation.status}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-sm text-gray-600">
                                                    <span>{donation.payment_method || donation.type}</span>
                                                    <span>{new Date(donation.created_at).toLocaleDateString()}</span>
                                                </div>
                                                {donation.karma_points_awarded && (
                                                    <div className="text-xs text-green-600 mt-1">
                                                        +{donation.karma_points_awarded} Karma Points
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Gift className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                        <p className="text-gray-500">No donations yet</p>
                                        <p className="text-sm text-gray-400">Start donating to support our mission!</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
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
    )
}