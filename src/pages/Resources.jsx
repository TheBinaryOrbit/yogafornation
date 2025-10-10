"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, Download, Users, Play, Lock, X } from "lucide-react"
import axios from "axios"
import { toast } from "react-toastify"

export default function Resources() {
  const [activeResourceTab, setActiveResourceTab] = useState("pdfs")
  const [expandedFaq, setExpandedFaq] = useState(0)
  const [faqs, setFaqs] = useState([])
  const [videos, setVideos] = useState([])
  const [dietPlans, setDietPlans] = useState([])
  const [loadingFaqs, setLoadingFaqs] = useState(false)
  const [loadingVideos, setLoadingVideos] = useState(false)
  const [loadingDietPlans, setLoadingDietPlans] = useState(false)
  const [errorFaqs, setErrorFaqs] = useState(false)
  const [errorVideos, setErrorVideos] = useState(false)
  const [errorDietPlans, setErrorDietPlans] = useState(false)

  const faqData = [
    {
      question: "How can I join the sessions?",
      answer: "The joining link for all the sessions will be the same: https://habit.yoga/live",
    },
    { question: "How to access dashboard?", answer: "You can access your dashboard through the main menu." },
    {
      question: "What language will be used in the sessions?",
      answer: "Sessions will be conducted in Hindi and English.",
    },
    { question: "What are the batch timings?", answer: "Morning batch: 6:00 AM, Evening batch: 7:00 PM" },
    {
      question: "Can I attend any session? Can I attend multiple sessions?",
      answer: "Yes, you can attend any session that fits your schedule.",
    },
    {
      question: "What if I miss a session? Will I get the recordings of the sessions?",
      answer: "Yes, all session recordings will be available in your dashboard.",
    },
    {
      question: "What should we wear to the sessions?",
      answer: "Wear comfortable clothing that allows free movement.",
    },
    { question: "What application will I need?", answer: "You can join through any web browser or our mobile app." },
    {
      question: "What is the age group for the challenge? I am 16 years old, can I join the Yoga Challenge?",
      answer: "The challenge is suitable for ages 12 and above.",
    },
    {
      question: "How long before the session can we join?",
      answer: "You can join 10 minutes before the scheduled time.",
    },
    {
      question: "How will I know if I am doing the asanas correctly?",
      answer: "Our instructors will provide guidance and corrections during live sessions.",
    },
    {
      question: "How is our Yoga different from regular yoga?",
      answer: "Our approach combines traditional yoga with modern wellness techniques.",
    },
    {
      question: "I will be doing it with my family, do we all need to register separately?",
      answer: "Each participant should register individually for proper tracking.",
    },
    {
      question: "What is the structure for 5 Days?",
      answer: "Each day focuses on different aspects: flexibility, strength, breathing, meditation, and integration.",
    },
    {
      question: "How do we measure progress throughout the Yoga Challenge?",
      answer: "Progress is tracked through daily check-ins and milestone assessments.",
    },
    {
      question: "I am a beginner, can I join the challenge?",
      answer: "The challenge is designed for all levels including beginners.",
    },
    {
      question: "Can I practice Yoga during periods?",
      answer: "Yes, with modifications. We'll provide alternative poses during sessions.",
    },
    {
      question: "Can I practice Yoga during pregnancy?",
      answer: "Please consult your doctor first. We offer prenatal yoga modifications.",
    },
    {
      question: "Can I practice Yoga with back pain/ knee pain/ shoulder pain etc?",
      answer: "Yes, with proper modifications. Inform your instructor about any pain or injuries.",
    },
    {
      question: "If I had surgery in the last few months, can I join the challenge?",
      answer: "Please get medical clearance from your doctor before joining.",
    },
    {
      question: "I want to gain weight. Can I still join the challenge?",
      answer: "Yes! Yoga helps with overall health and can support healthy weight gain.",
    },
    {
      question: "How helpful is Yoga in managing anxiety/ stress?",
      answer: "Yoga is highly effective for stress management through breathing and mindfulness techniques.",
    },
    {
      question: "How helpful is Yoga in managing PCOD/PCOS?",
      answer: "Yoga can help manage PCOD/PCOS symptoms through specific poses and stress reduction.",
    },
    {
      question: "What other things do I need to take care of in addition to the Yoga Challenge?",
      answer: "Maintain a balanced diet, stay hydrated, and get adequate sleep.",
    },
    {
      question: "Can I view the classes on a bigger screen?",
      answer: "Yes, you can join from any device including laptops and smart TVs.",
    },
    {
      question:
        "I want to understand referrals, karma points, leaderboard, resources and rewards, is there a video I can watch?",
      answer: "Yes, check the tutorial video in your dashboard resources section.",
    },
  ]

  // API fetch functions
  const fetchFAQs = async () => {
    try {
      setLoadingFaqs(true);
      setErrorFaqs(false);
      const response = await axios.get("https://lightsteelblue-woodcock-286554.hostingersite.com/api/faqs");
      
      if (response.data.success) {
        setFaqs(response.data.faqs || []);
      } else {
        console.warn("FAQs API returned success: false");
        setFaqs([]);
        setErrorFaqs(true);
      }
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      setFaqs([]);
      setErrorFaqs(true);
      if (error.response?.status === 404) {
        console.warn("FAQs endpoint not found");
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error("Failed to load FAQs. Please try again later.");
      }
    } finally {
      setLoadingFaqs(false);
    }
  }

  const fetchVideos = async () => {
    try {
      setLoadingVideos(true);
      setErrorVideos(false);
      const response = await axios.get("https://lightsteelblue-woodcock-286554.hostingersite.com/api/video-resources");
      
      if (response.data.success) {
        setVideos(response.data.video_resources || []);
      } else {
        console.warn("Videos API returned success: false");
        setVideos([]);
        setErrorVideos(true);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
      setVideos([]);
      setErrorVideos(true);
      if (error.response?.status === 404) {
        console.warn("Video resources endpoint not found");
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error("Failed to load videos. Please try again later.");
      }
    } finally {
      setLoadingVideos(false);
    }
  }

  const fetchDietPlans = async () => {
    try {
      setLoadingDietPlans(true);
      setErrorDietPlans(false);
      
      // Get user ID from localStorage
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = storedUser.id;
      
      if (!userId) {
        console.warn("No user ID found in localStorage");
        setDietPlans([]);
        return;
      }

      const response = await axios.get(`https://lightsteelblue-woodcock-286554.hostingersite.com/api/diet-plans/user?user_id=${userId}`);
      
      if (response.data.success) {
        setDietPlans(response.data.diet_plans || []);
      } else {
        console.warn("Diet plans API returned success: false");
        setDietPlans([]);
        setErrorDietPlans(true);
      }
    } catch (error) {
      console.error("Error fetching diet plans:", error);
      setDietPlans([]);
      setErrorDietPlans(true);
      if (error.response?.status === 404) {
        console.warn("Diet plans endpoint not found");
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error("Failed to load diet plans. Please try again later.");
      }
    } finally {
      setLoadingDietPlans(false);
    }
  }

  // Fetch data on component mount
  useEffect(() => {
    fetchFAQs();
    fetchVideos();
    fetchDietPlans();
  }, []);



  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto">
      {/* Resource Tabs */}
      <div className="bg-white p-4">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveResourceTab("pdfs")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeResourceTab === "pdfs" ? "bg-blue-600 text-white" : "text-gray-600"
            }`}
          >
            PDFs
          </button>
          <button
            onClick={() => setActiveResourceTab("videos")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeResourceTab === "videos" ? "bg-blue-600 text-white" : "text-gray-600"
            }`}
          >
            VIDEOS
          </button>
          <button
            onClick={() => setActiveResourceTab("faqs")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeResourceTab === "faqs" ? "bg-blue-600 text-white" : "text-gray-600"
            }`}
          >
            FAQs
          </button>
        </div>
      </div>

      {/* Content based on active tab */}
      <div className="pb-20">
        {activeResourceTab === "faqs" && (
          <div className="px-4 space-y-2">
            {loadingFaqs ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading FAQs...</p>
                </div>
              </div>
            ) : errorFaqs ? (
              <div className="text-center py-12 px-4">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <X className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Failed to Load FAQs</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    We couldn't load the FAQs. Please check your internet connection and try again.
                  </p>
                  <button
                    onClick={fetchFAQs}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : faqs.length > 0 ? (
              faqs.map((faq, index) => (
                <div key={faq.id} className="bg-white rounded-lg shadow-sm">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? -1 : index)}
                    className="w-full p-4 text-left flex items-center justify-between"
                  >
                    <span className="font-medium text-gray-800 text-sm">{faq.question}</span>
                    {expandedFaq === index ? (
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <div className="px-4 pb-4">
                      <p className="text-sm text-gray-600">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12 px-4">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ChevronDown className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No FAQs Available</h3>
                  <p className="text-gray-600 text-sm">
                    Frequently asked questions will appear here once they are added by our team.
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg mt-6">
                  <p className="text-blue-700 text-sm">
                    <strong>Have a question?</strong> Contact our support team and we'll help you out!
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeResourceTab === "pdfs" && (
          <div className="px-4 space-y-4">
            {loadingDietPlans ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading diet plans...</p>
                </div>
              </div>
            ) : errorDietPlans ? (
              <div className="text-center py-12 px-4">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <X className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Failed to Load Diet Plans</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    We couldn't load your diet plans. Please check your internet connection and try again.
                  </p>
                  <button
                    onClick={fetchDietPlans}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : dietPlans.length > 0 ? (
              dietPlans.filter((plan) => plan.isPrivate === false).map((plan) => (
                <div key={plan.id} className="bg-white rounded-lg p-4 shadow-sm flex gap-4">
                  <div className="relative">
                    <img
                      src={plan.thumbnail_url || "/placeholder.svg"}
                      alt={plan.title}
                      className="w-20 h-20 rounded-lg object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg";
                      }}
                    />
                    {plan.access_status === "locked" && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                        <Lock className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{plan.title.replace(/"/g, '')}</h3>
                    <p className="text-sm text-gray-600 mb-3">{plan.description.replace(/"/g, '')}</p>
                    
                    {/* Access Status Badge */}
                    <div className="flex items-center gap-2 mb-3">
                      {plan.type === "free" && (
                        <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Free Access
                        </span>
                      )}
                      {plan.type === "karma" && (
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {plan.karma_points_required} Karma Points
                        </span>
                      )}
                      {plan.type === "personalized" && (
                        <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                          Personalized Plan
                        </span>
                      )}
                    </div>
                    
                    <p className="text-xs text-gray-500 mb-3">
                      {plan.access_message}
                    </p>

                    {plan.access_status === "unlocked" ? (
                      <a 
                        href={plan.media_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 w-fit hover:bg-blue-700 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download PDF
                      </a>
                    ) : (
                      <button 
                        className="bg-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 cursor-not-allowed"
                        disabled
                      >
                        <Lock className="w-4 h-4" />
                        {plan.type === "karma" 
                          ? `Requires ${plan.karma_points_required} Karma Points`
                          : "Locked"
                        }
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 px-4">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Download className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No Diet Plans Available</h3>
                  <p className="text-gray-600 text-sm">
                    Diet plans and resources will appear here once they are assigned to your account.
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg mt-6">
                  <p className="text-orange-700 text-sm">
                    <strong>Need a personalized diet plan?</strong> Contact our nutrition team to get started!
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeResourceTab === "videos" && (
          <div className="px-4 space-y-3">
            {loadingVideos ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading videos...</p>
                </div>
              </div>
            ) : errorVideos ? (
              <div className="text-center py-12 px-4">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <X className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Failed to Load Videos</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    We couldn't load the video resources. Please check your internet connection and try again.
                  </p>
                  <button
                    onClick={fetchVideos}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : videos.length > 0 ? (
              videos.map((video) => (
                <div key={video.id} className="bg-white rounded-lg p-3 shadow-sm flex gap-3">
                  <div className="relative">
                    <div className="w-32 h-24 bg-gray-200 rounded flex items-center justify-center">
                      <Play className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-30 rounded flex items-center justify-center">
                      <button
                        onClick={() => window.open(video.youtube_link, '_blank')}
                        className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                      >
                        <Play className="w-4 h-4 ml-0.5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 text-sm mb-1">{video.title}</h4>
                    <p className="text-xs text-gray-600 mb-2">{video.description}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(video.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 px-4">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No Videos Available</h3>
                  <p className="text-gray-600 text-sm">
                    Yoga video resources will be displayed here once they are uploaded by our instructors.
                  </p>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg mt-6">
                  <p className="text-purple-700 text-sm">
                    <strong>Coming Soon!</strong> We're working on adding amazing yoga videos for your practice.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
