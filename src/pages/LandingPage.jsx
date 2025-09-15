"use client"

import { useState } from "react"
import { Users, Clock, Award, Heart, Zap, Shield, Star, CheckCircle } from "lucide-react"

const LandingPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    whatsapp: "",
  })

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
  }

  return (
    <div className="min-h-screen bg-white max-w-md mx-auto">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 py-8 px-4">
        {/* Logo */}
        <div className="mb-6 text-center">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/png-logo-j9moV4DkAQHKCtbAK5mKGOyrYzxFGO.png"
            alt="Yoga For Nation Logo"
            className="h-16 mx-auto"
          />
        </div>

        {/* Main Heading */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-green-600 mb-1">14-DAY ONLINE</h1>
          <h2 className="text-3xl font-bold text-red-500 mb-2">FREE YOGA</h2>
          <p className="text-lg text-blue-600 font-semibold">🏆 Daily Morning</p>
        </div>

        {/* Trainer Image */}
        <div className="mb-6 text-center">
          <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
            <Users className="w-12 h-12 text-gray-400" />
          </div>
          <p className="mt-3 text-base font-semibold text-gray-700">RAJENDRA BOTHRA</p>
          <p className="text-sm text-gray-600">Gold Certified Yoga Instructor</p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Enter Your Details</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Enter Your Name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <div className="flex">
              <select className="px-3 py-3 border border-gray-300 rounded-l-lg bg-gray-50">
                <option>🇮🇳 +91</option>
              </select>
              <input
                type="tel"
                name="phone"
                placeholder="WhatsApp Number"
                value={formData.phone}
                onChange={handleInputChange}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
            >
              Click to Join Yoga Challenge →
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-4 text-center">By submitting, you agree to our terms and conditions</p>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-8 bg-gray-50 px-4">
        <div className="space-y-6 text-center">
          <div className="flex flex-col items-center">
            <Clock className="w-12 h-12 text-green-500 mb-3" />
            <h3 className="font-bold text-gray-800 text-base">Flexible Timing</h3>
            <p className="text-gray-600 text-sm">Practice at your convenience</p>
          </div>
          <div className="flex flex-col items-center">
            <Users className="w-12 h-12 text-blue-500 mb-3" />
            <h3 className="font-bold text-gray-800 text-base">Expert Guidance</h3>
            <p className="text-gray-600 text-sm">Learn from certified instructors</p>
          </div>
          <div className="flex flex-col items-center">
            <Award className="w-12 h-12 text-red-500 mb-3" />
            <h3 className="font-bold text-gray-800 text-base">Proven Results</h3>
            <p className="text-gray-600 text-sm">Transform your health</p>
          </div>
        </div>
      </div>

      {/* Join Any Batch Section */}
      <div className="py-12 bg-white px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">Join Any Batch</h2>
          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-blue-500 mr-2" />
                <h3 className="text-lg font-bold text-blue-600">Morning Slot</h3>
              </div>
              <div className="space-y-2 text-gray-700">
                <p>6:00 AM</p>
                <p>7:00 AM</p>
                <p>8:00 AM</p>
              </div>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <div className="flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-green-500 mr-2" />
                <h3 className="text-lg font-bold text-green-600">Evening Slot</h3>
              </div>
              <div className="space-y-2 text-gray-700">
                <p>6:00 PM</p>
                <p>7:00 PM</p>
                <p>8:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Section */}
      <div className="py-12 bg-gray-50 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Trusted by Members</h2>
          <h3 className="text-xl font-bold text-blue-600 mb-8">Country-wide</h3>

          {/* Stats */}
          <div className="space-y-4 mb-8">
            <div className="bg-red-100 p-6 rounded-lg">
              <h3 className="text-3xl font-bold text-red-600 mb-1">125 Crore +</h3>
              <p className="text-gray-700">Happy Students</p>
            </div>
            <div className="bg-green-100 p-6 rounded-lg">
              <h3 className="text-3xl font-bold text-green-600 mb-1">12 +</h3>
              <p className="text-gray-700">Years Experience</p>
            </div>
            <div className="bg-blue-100 p-6 rounded-lg">
              <h3 className="text-3xl font-bold text-blue-600 mb-1">4.9/5</h3>
              <p className="text-gray-700">Google Rating</p>
            </div>
          </div>

          {/* Group Image Placeholder */}
          <div className="bg-gradient-to-r from-red-200 to-orange-200 h-48 rounded-lg flex items-center justify-center">
            <Users className="w-20 h-20 text-red-500" />
          </div>
        </div>
      </div>

      {/* Reasons to Join Section */}
      <div className="py-12 bg-white px-4">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Reasons to Join Us</h2>
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <Heart className="w-6 h-6 text-red-500 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">Reduce Stress</h3>
              <p className="text-gray-600 text-sm">
                Practice daily Asanas & Pranayama to reduce stress and anxiety naturally.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <Zap className="w-6 h-6 text-green-500 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">Increase Energy</h3>
              <p className="text-gray-600 text-sm">
                Increase the flexibility of muscles and improve your flexibility in the body.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <Shield className="w-6 h-6 text-blue-500 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">Build Immunity</h3>
              <p className="text-gray-600 text-sm">
                Boost your immunity and strengthen your body's natural defense system.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Meet Your Trainer Section */}
      <div className="py-12 bg-gray-50 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Meet Your Trainer</h2>
          <h3 className="text-lg text-blue-600 mb-6">
            Forget Everything with
            <br />
            Rajendra Bothra
          </h3>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <Users className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              15 years of yoga coaching in the wellness journey. Expertise in Hatha Yoga, Ashtanga and various forms of
              Pranayama for a healthy body and mind.
            </p>
          </div>
        </div>
      </div>

      {/* User Stories Section */}
      <div className="py-12 bg-white px-4">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Our User Stories</h2>
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
            <div>
              <div className="flex items-center mb-2">
                <h4 className="font-bold text-gray-800 mr-2 text-sm">Priyanka Joshi</h4>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                "I've been doing yoga with this program for 3 months now and I feel like a new person. My flexibility
                has improved dramatically and I sleep much better at night. The instructor is amazing and very
                supportive throughout the journey, which makes difficult asanas easier."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="py-12 bg-gradient-to-r from-blue-600 to-green-600 px-4">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">
            One Step Closer to a<br />
            Healthier You
          </h2>
          <button className="bg-white text-blue-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition duration-300 mb-6">
            ENROLL NOW →
          </button>
          <p className="text-sm opacity-90">Limited time offer - Join now!</p>
        </div>
      </div>

      {/* Media Coverage */}
      <div className="py-8 bg-white px-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Media Coverage in 50+
            <br />
            Newspaper
          </h2>
          <div className="space-y-2 opacity-60">
            <div className="text-red-600 font-bold">Hindustan</div>
            <div className="text-red-600 font-bold">TOI</div>
            <div className="text-blue-600 font-bold">The Indian EXPRESS</div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-12 bg-gray-50 px-4">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Unlock Your Exclusive
          <br />
          Benefits
        </h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <div>
              <h3 className="font-bold text-gray-800 text-sm">Accessibility Support</h3>
              <p className="text-gray-600 text-xs">Easy to follow instructions for all fitness levels</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <div>
              <h3 className="font-bold text-gray-800 text-sm">Flexible Timings</h3>
              <p className="text-gray-600 text-xs">Choose from multiple time slots that fit your schedule</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <div>
              <h3 className="font-bold text-gray-800 text-sm">Live Accessibility</h3>
              <p className="text-gray-600 text-xs">Interactive live sessions with real-time guidance</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <div>
              <h3 className="font-bold text-gray-800 text-sm">24/7 Learning Resources</h3>
              <p className="text-gray-600 text-xs">Access to recorded sessions and learning materials anytime</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
