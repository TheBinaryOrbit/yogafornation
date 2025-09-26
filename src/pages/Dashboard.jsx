"use client"

import { useEffect, useState } from "react"
import { Menu, Play, Clock, CheckCircle, Copy, Share, Home, BookOpen, Users, ChevronRight, Gift, User, X, LogOut, Edit3, Heart, AlignEndHorizontal, Star, HomeIcon } from "lucide-react"

import Resources from "./Resources"
import useGetuser from "../hooks/user"
import { useNavigate, useSearchParams, useLocation } from "react-router-dom"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useDashboard } from '../contexts/DashboardContext'

export default function Dashboard() {
  // Rating modal state
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingClassId, setRatingClassId] = useState(null);
  const user = useGetuser();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { activeTab, setActiveTab, resetToHome } = useDashboard();
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [referralData, setReferralData] = useState(null)
  const [referralLoading, setReferralLoading] = useState(false)
  const [instructions, setInstructions] = useState([])
  const [todayInstruction, setTodayInstruction] = useState(null)
  const [instructionsLoading, setInstructionsLoading] = useState(false)
  const [weeklyAttendance, setWeeklyAttendance] = useState(null)
  const [attendanceLoading, setAttendanceLoading] = useState(false)
  const [attendanceError, setAttendanceError] = useState(false)
  const [todaysClasses, setTodaysClasses] = useState(null)
  const [classesLoading, setClassesLoading] = useState(false)
  const [classesError, setClassesError] = useState(false)
  const [joiningClass, setJoiningClass] = useState(null)
  const [leaderboard, setLeaderboard] = useState(null)
  const [leaderboardLoading, setLeaderboardLoading] = useState(false)
  const [leaderboardError, setLeaderboardError] = useState(false)


  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      fetchUserProfile();
      fetchInstructions();
      fetchWeeklyAttendance();
      fetchTodaysClasses();
      fetchLeaderboard();
    }

    // Check if navigation came from profile edit with resetToHome state
    if (location.state?.resetToHome) {
      resetToHome();
      setShowRewards(false);
      // Clear the state to prevent future resets
      navigate("/dashboard", { replace: true, state: {} });
    }
  }, [location.state, resetToHome])

  // Fetch referral data when switching to referral tab
  useEffect(() => {
    if (activeTab === "referral" && user) {
      fetchReferralData();
    }
  }, [activeTab])

  // Check for completed classes when today's classes data updates
  useEffect(() => {
    if (todaysClasses?.classes && userProfile) {
      checkForCompletedClasses();
    }
  }, [todaysClasses, userProfile])

  // Check for any classes that have ended and user attended
  const checkForCompletedClasses = () => {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM format

    todaysClasses.classes.forEach(cls => {
      // Check if class has ended and user might have attended
      if (currentTime >= cls.end_time && cls.attendance_count > 0) {
        // You could add additional logic here to check if user specifically attended this class
        // For now, we'll assume if attendance is marked and class ended, show rating option

        // Check if rating modal hasn't been shown for this class yet
        const hasRatedToday = localStorage.getItem(`rated_${cls.id}_${new Date().toISOString().split('T')[0]}`);

        if (!hasRatedToday && !showRatingModal) {
          setRatingClassId(cls.id);
          setShowRatingModal(true);
        }
      }
    });
  }

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

      if (!token || !storedUser.id) {
        navigate("/login");
        return;
      }

      const response = await axios.get(`https://lightsteelblue-woodcock-286554.hostingersite.com/api/user?user_id=${storedUser.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setUserProfile(response.data.user);
        // Update localStorage with fresh user data
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast.error("Failed to load user profile");
    } finally {
      setLoading(false);
    }
  }

  const fetchReferralData = async () => {
    try {
      setReferralLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get("https://lightsteelblue-woodcock-286554.hostingersite.com/api/user/referrals", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.data.success) {
        setReferralData(response.data.referral_data);
      } else {
        toast.error("Failed to load referral data");
      }
    } catch (error) {
      console.error("Error fetching referral data:", error);
      toast.error("Failed to load referral data");
    } finally {
      setReferralLoading(false);
    }
  }

  const fetchInstructions = async () => {
    try {
      setInstructionsLoading(true);
      const response = await axios.get("https://lightsteelblue-woodcock-286554.hostingersite.com/api/instructions");

      if (response.data.success) {
        setInstructions(response.data.instructions);

        // Get today's day name
        const today = new Date();
        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const currentDayName = dayNames[today.getDay()];

        // Find today's instruction
        const todayInstr = response.data.instructions.find(
          instruction => instruction.day_name === currentDayName
        );

        setTodayInstruction(todayInstr);
      } else {
        toast.error("Failed to load daily instructions");
      }
    } catch (error) {
      console.error("Error fetching instructions:", error);
      toast.error("Failed to load daily instructions");
    } finally {
      setInstructionsLoading(false);
    }
  }

  const fetchWeeklyAttendance = async () => {
    try {
      setAttendanceLoading(true);
      setAttendanceError(false);
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get("https://lightsteelblue-woodcock-286554.hostingersite.com/api/user/attendance/weekly", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.data.success) {
        setWeeklyAttendance(response.data);
      } else {
        setAttendanceError(true);
        toast.error("Failed to load weekly attendance");
      }
    } catch (error) {
      console.error("Error fetching weekly attendance:", error);
      setAttendanceError(true);
      if (error.response?.status === 404) {
        console.warn("Weekly attendance endpoint not found");
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error("Failed to load weekly attendance. Please try again later.");
      }
    } finally {
      setAttendanceLoading(false);
    }
  }

  const fetchTodaysClasses = async () => {
    try {
      setClassesLoading(true);
      setClassesError(false);

      const response = await axios.get("https://lightsteelblue-woodcock-286554.hostingersite.com/api/classes/today");

      if (response.data.success) {
        setTodaysClasses(response.data);
      } else {
        setClassesError(true);
        toast.error("Failed to load today's classes");
      }
    } catch (error) {
      console.error("Error fetching today's classes:", error);
      setClassesError(true);
      if (error.response?.status === 404) {
        console.warn("Today's classes endpoint not found");
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error("Failed to load today's classes. Please try again later.");
      }
    } finally {
      setClassesLoading(false);
    }
  }

  const markAttendance = async (classId, classLink) => {
    try {
      setJoiningClass(classId);
      const token = localStorage.getItem("token");
      setTimeout(() => {
        window.open(classLink, '_blank');
      }, 3000);

      if (!token) {
        navigate("/login");
        return;
      }

      const attendanceData = {
        class_id: classId,
        attendance_date: new Date().toISOString().split('T')[0]
      };

      const response = await axios.post(
        "https://lightsteelblue-woodcock-286554.hostingersite.com/api/user/attendance/mark",
        attendanceData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);

        // Update user profile if streak or title changed
        if (response.data.streak_updated || response.data.new_title) {
          await fetchUserProfile();
          await fetchWeeklyAttendance(); // Refresh attendance data
        }

        // Show achievement messages
        if (response.data.new_streak) {
          toast.success(`🔥 New streak: ${response.data.new_streak} days!`, { autoClose: 3000 });
        }
        if (response.data.new_title) {
          toast.success(`🎉 Title upgraded to: ${response.data.new_title}!`, { autoClose: 5000 });
        }

        // Check if class is completed to show rating modal
        checkAndShowRatingModal(classId);

      } else {
        toast.error("Failed to mark attendance");
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      if (error.response?.status === 400) {
        toast.error(error.response.data.message || "Invalid attendance request");
      } else if (error.response?.status === 409) {
        toast.warning("Attendance already marked for this class");
        setTimeout(() => {
          window.open(classLink, '_blank');
        }, 3000);
      } else {
        toast.error("Failed to mark attendance. Please try again.");
      }
    } finally {
      setJoiningClass(null);
    }
  }

  // Check if class is completed and show rating modal
  const checkAndShowRatingModal = async (classId) => {
    try {
      // Find the class details from today's classes
      const classDetails = todaysClasses?.classes?.find(cls => cls.id === classId);

      if (classDetails) {
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        const currentTime = now.toTimeString().slice(0, 5); // HH:MM format

        // Check if the class has ended (current time is past end time)
        if (currentTime >= classDetails.end_time) {
          // Class is completed, show rating modal
          setRatingClassId(classId);
          setShowRatingModal(true);
        } else {
          // Set a timeout to show rating modal when class ends
          const endTime = new Date(`${today}T${classDetails.end_time}:00`);
          const timeUntilEnd = endTime.getTime() - now.getTime();

          if (timeUntilEnd > 0) {
            setTimeout(() => {
              setRatingClassId(classId);
              setShowRatingModal(true);
            }, timeUntilEnd);
          }
        }
      }
    } catch (error) {
      console.error("Error checking class completion:", error);
    }
  }

  // Submit rating handler
  const handleSubmitRating = async ({ class_id, rating, review }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to rate.");
        return;
      }
      const response = await axios.post(
        "https://lightsteelblue-woodcock-286554.hostingersite.com/api/user/ratings",
        { class_id, rating, review },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      if (response.data.success) {
        toast.success("Thank you for your feedback!");
        setShowRatingModal(false);
        setRatingClassId(null);

        // Mark that user has rated this class today
        localStorage.setItem(`rated_${class_id}_${new Date().toISOString().split('T')[0]}`, 'true');

        // Refresh today's classes to update ratings
        fetchTodaysClasses();
      } else {
        toast.error(response.data.message || "Failed to submit rating");
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error("Failed to submit rating. Please try again.");
    }
  }

  const fetchLeaderboard = async () => {
    try {
      setLeaderboardLoading(true);
      setLeaderboardError(false);

      const response = await axios.get("https://lightsteelblue-woodcock-286554.hostingersite.com/api/attendance/leaderboard/streak", {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        setLeaderboard(response.data.leaderboard);
      } else {
        setLeaderboardError(true);
        toast.error("Failed to load leaderboard");
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      setLeaderboardError(true);
      if (error.response?.status === 404) {
        console.warn("Leaderboard endpoint not found");
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error("Failed to load leaderboard. Please try again later.");
      }
    } finally {
      setLeaderboardLoading(false);
    }
  }

  // Yoga progression levels based on classes attended
  const getYogaLevel = (classesAttended) => {
    if (classesAttended >= 500) return { title: "Mahayogi (महायोगी)", sanskrit: "महायोगी", classes: "500+ classes", color: "bg-gradient-to-r from-purple-600 to-pink-600" };
    if (classesAttended >= 365) return { title: "Yogi (योगी)", sanskrit: "योगी", classes: "365 classes", color: "bg-gradient-to-r from-indigo-600 to-purple-600" };
    if (classesAttended >= 250) return { title: "Yogacharya (योगाचार्य)", sanskrit: "योगाचार्य", classes: "250 classes", color: "bg-gradient-to-r from-blue-600 to-indigo-600" };
    if (classesAttended >= 180) return { title: "Yogaratna (योगरत्न)", sanskrit: "योगरत्न", classes: "180 days consistent", color: "bg-gradient-to-r from-cyan-600 to-blue-600" };
    if (classesAttended >= 100) return { title: "Yogapravar (योगप्रवर)", sanskrit: "योगप्रवर", classes: "100 classes", color: "bg-gradient-to-r from-teal-600 to-cyan-600" };
    if (classesAttended >= 75) return { title: "Dhyanvi (ध्यानवी)", sanskrit: "ध्यानवी", classes: "75 classes", color: "bg-gradient-to-r from-green-600 to-teal-600" };
    if (classesAttended >= 50) return { title: "Pranamitra (प्राणमित्र)", sanskrit: "प्राणमित्र", classes: "50 classes", color: "bg-gradient-to-r from-lime-600 to-green-600" };
    if (classesAttended >= 30) return { title: "Yogasarthi (योगार्थी)", sanskrit: "योगार्थी", classes: "30-40 classes", color: "bg-gradient-to-r from-yellow-600 to-lime-600" };
    if (classesAttended >= 10) return { title: "Abhyasi (अभ्यासी)", sanskrit: "अभ्यासी", classes: "10-25 classes", color: "bg-gradient-to-r from-orange-600 to-yellow-600" };
    if (classesAttended >= 5) return { title: "Sadhak (साधक)", sanskrit: "साधक", classes: "5-10 classes", color: "bg-gradient-to-r from-red-600 to-orange-600" };
    return { title: "Beginner", sanskrit: "नवागत", classes: "0-4 classes", color: "bg-gradient-to-r from-gray-600 to-red-600" };
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully!");
    navigate("/login");
  }

  const copyToClipboard = async (text, message = "Copied to clipboard!") => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(message, {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        toast.success(message, {
          position: "top-right",
          autoClose: 2000,
        });
      } catch (fallbackErr) {
        toast.error("Failed to copy to clipboard");
      }
      document.body.removeChild(textArea);
    }
  }

  const shareOnWhatsApp = () => {
    const referralLink = `https://yogafornation.com/register?refcode=${referralData?.my_referral_code || user?.uni_referral_code}`;
    const message = `🧘‍♀️ Join me on Yoga For Nation! 🧘‍♂️\n\nTransform your life with daily yoga practice and earn karma points along the way!\n\n✨ Benefits:\n• Daily guided yoga sessions\n• Track your progress\n• Build healthy habits\n• Join a community of wellness enthusiasts\n\n🎁 Use my referral link to get started:\n${referralLink}\n\n#YogaForNation #Wellness #Mindfulness #Yoga`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }

  const shareAsWhatsAppStatus = () => {
    const message = `🧘‍♀️ Day ${userProfile?.current_streak || 0} of my yoga journey! 🧘‍♂️\n\n💫 Current Stats:\n• Karma Points: ${userProfile?.karma_points || 0}\n• Longest Streak: ${userProfile?.longest_streak || 0} days\n• Total Classes: ${userProfile?.total_classes_attended || 0}\n\n🌟 Join me on Yoga For Nation and start your wellness journey!\n\nUse my code: ${referralData?.my_referral_code || user?.uni_referral_code}\n\n#YogaForNation #Wellness #YogaJourney #Mindfulness`;

    // Copy to clipboard for status sharing
    copyToClipboard(message, "Status message copied! Now paste it as your WhatsApp status.");
  }


  const getTime = (end_time) => {
    const now = new Date();
    const timeNow = now.toTimeString().slice(0, 8);

    const end = end_time.slice(0, 5);
    const current = timeNow.slice(0, 5);

    return current <= end;

  }

  const renderContent = () => {
    if (activeTab === "resources") {
      return <Resources />
    }

    if (activeTab === "leaderboard") {
      return (
        <div className="mx-4 mb-6 bg-white rounded-lg p-4 shadow-sm">
          {/* Current User Level Display */}
          {userProfile && (
            <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-gray-800 mb-2">Your Yoga Journey</h4>
              {(() => {
                const userLevel = getYogaLevel(parseInt(userProfile.total_classes_attended || 0));
                const nextLevelThresholds = [5, 10, 30, 50, 75, 100, 180, 250, 365, 500];
                const currentClasses = parseInt(userProfile.total_classes_attended || 0);
                const nextThreshold = nextLevelThresholds.find(threshold => threshold > currentClasses);
                const classesNeeded = nextThreshold ? nextThreshold - currentClasses : 0;

                return (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-3 py-1 rounded-full text-white text-sm ${userLevel.color}`}>
                        {userLevel.title}
                      </span>
                      <span className="text-sm text-gray-600">
                        {currentClasses} classes completed
                      </span>
                    </div>

                    {nextThreshold && (
                      <div>
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Progress to next level</span>
                          <span>{classesNeeded} classes to go</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min((currentClasses / nextThreshold) * 100, 100)}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
          <h3 className="font-semibold text-gray-800 mb-4 text-xl my-10 text-center">🏆 Yoga Leaderboard</h3>
          {leaderboardLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          ) : leaderboardError ? (
            <div className="text-center py-6">
              <p className="text-gray-500">Unable to load leaderboard</p>
              <button
                onClick={fetchLeaderboard}
                className="mt-2 text-blue-600 text-sm hover:text-blue-700"
              >
                Try Again
              </button>
            </div>
          ) : leaderboard && leaderboard.length > 0 ? (
            <div className="space-y-3">
              {leaderboard.slice(0, 20).map((user, index) => {
                const level = getYogaLevel(parseInt(user.total_classes_attended));
                const isCurrentUser = user.id === userProfile?.id;

                return (
                  <div
                    key={user.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${isCurrentUser ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                      }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${index === 0 ? 'bg-yellow-500' :
                        index === 1 ? 'bg-gray-400' :
                          index === 2 ? 'bg-orange-500' :
                            'bg-blue-500'
                        }`}>
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                      </div>

                      <div>
                        <p className={`font-medium ${isCurrentUser ? 'text-blue-800' : 'text-gray-800'}`}>
                          {user.name} {isCurrentUser ? '(You)' : ''}
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs px-2 py-1 rounded-full text-white ${level.color}`}>
                            {level.sanskrit}
                          </span>
                          <span className="text-xs text-gray-500">
                            {level.classes}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-800">
                        {user.total_classes_attended}
                      </p>
                      <p className="text-xs text-gray-500">classes</p>

                    </div>
                  </div>
                );
              })}


            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500">No leaderboard data available</p>
            </div>
          )}
        </div>
      )
    }

    if (activeTab === "referral") {
      return (
        <div className="px-4 py-6">
          {/* Referral Rewards Header */}
          <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Referral Rewards</h2>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-700 mb-2">
                Invite <span className="font-semibold text-blue-600">1 friend</span> to win{" "}
                <span className="font-semibold text-blue-600">100 Karam Points</span>
              </p>
            </div>

            {/* Referral Link */}
            <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-lg border">
              <input
                type="text"
                value={`https://yogafornation.com/register?refcode=${referralData?.my_referral_code || user?.uni_referral_code}`}
                readOnly
                className="flex-1 bg-transparent text-sm text-gray-600"
              />
              <button
                onClick={() => copyToClipboard(
                  `https://yogafornation.com/register?refcode=${referralData?.my_referral_code || user?.uni_referral_code}`,
                  "Referral link copied to clipboard!"
                )}
                className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:text-blue-700 transition-colors"
              >
                <Copy className="w-4 h-4" />
                Copy
              </button>
            </div>

            {/* Share Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={shareAsWhatsAppStatus}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition-colors"
              >
                <span>⭐</span>
                WA Status
              </button>
              <button
                onClick={shareOnWhatsApp}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition-colors"
              >
                <Share className="w-4 h-4" />
                Share On WhatsApp
              </button>
            </div>
          </div>

          {/* Referral Statistics */}
          {referralData && (
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{referralData.total_referrals}</div>
                  <div className="text-sm text-gray-600">Total Referrals</div>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{referralData.karma_from_referrals}</div>
                  <div className="text-sm text-gray-600">Karma Earned</div>
                </div>
              </div>
            </div>
          )}

          {/* Referral List */}
          {referralLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading referrals...</p>
              </div>
            </div>
          ) : referralData && referralData.referrals && referralData.referrals.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Referrals ({referralData.total_referrals})</h3>
              {referralData.referrals.map((referral) => (
                <div key={referral.id} className="bg-white p-4 rounded-lg border shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{referral.name}</h4>
                        <p className="text-sm text-gray-600">{referral.phone}</p>
                        <p className="text-xs text-gray-500">{referral.joined_date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-800">{referral.title}</div>
                      <div className="text-xs text-gray-600">Streak: {referral.current_streak} days</div>
                      <div className="text-xs text-blue-600">{referral.karma_points} karma</div>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${referral.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                        }`}>
                        {referral.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Your list of referrals will appear here.</h3>
              <p className="text-sm text-gray-600 mb-8">You Earn 100 Karma Point for every referral joining.</p>

              {/* Yoga Illustration */}
              {/* <div className="flex justify-center">
                <img
                  src="/group-of-people-doing-yoga-poses-illustration-colo.jpg"
                  alt="People doing yoga poses"
                  className="w-72 h-48 object-contain"
                />
              </div> */}
            </div>
          )}
        </div>
      )
    }

    // Home content
    return (
      <>
        {/* User Stats Card - Modern & Simple */}



        {/* Weekly Attendance Tracking */}
        <div className="mx-4 mb-6 bg-white rounded-lg p-4 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4">Attendance</h3>

          {attendanceLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          ) : attendanceError ? (
            <div className="text-center py-6">
              <p className="text-red-600 mb-3">Failed to load attendance data</p>
              <button
                onClick={fetchWeeklyAttendance}
                className="text-blue-600 text-sm font-medium hover:text-blue-700"
              >
                Retry
              </button>
            </div>
          ) : weeklyAttendance ? (
            <>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Total Classes:</p>
                  <p className="font-semibold text-gray-800">{userProfile?.total_classes_attended}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current Streak:</p>
                  <p className="font-semibold text-gray-800">{userProfile?.current_streak}</p>
                </div>
              </div>
              {/* Stats Overview */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Days Attended:</p>
                  <p className="font-semibold text-gray-800">{weeklyAttendance.stats.days_attended}/{weeklyAttendance.stats.total_days}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Attendance Rate:</p>
                  <p className="font-semibold text-gray-800">{weeklyAttendance.stats.weekly_attendance_rate.toFixed(1)}%</p>
                </div>
              </div>

              {/* Week Period */}
              <div className="bg-blue-50 p-3 rounded-lg mb-4">
                <p className="text-sm text-blue-800 font-medium">
                  Week: {new Date(weeklyAttendance.period.start_date).toLocaleDateString()} - {new Date(weeklyAttendance.period.end_date).toLocaleDateString()}
                </p>
                {weeklyAttendance.period.is_current_week && (
                  <p className="text-xs text-blue-700">Current Week</p>
                )}
              </div>

              {/* Weekly Calendar */}
              <div className="mb-4">
                <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
                  {
                    weeklyAttendance.weekly_calendar.map((d) => (
                      <div className="font-medium text-gray-600 p-2">{d.day_name.slice(0, 3)}</div>
                    ))
                  }
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                  {weeklyAttendance.weekly_calendar.map((day) => {
                    const dayNum = new Date(day.date).getDate();
                    const isToday = day.date === new Date().toISOString().split('T')[0];

                    return (
                      <div
                        key={day.date}
                        className={`p-2 rounded relative ${day.status === "attended"
                          ? "bg-green-500 text-white"
                          : day.status === "not_attended"
                            ? "bg-gray-100 text-gray-600"
                            : "bg-gray-100 text-gray-600"
                          } ${isToday ? "ring-2 ring-blue-400" : ""}`}
                        title={`${day.day_name} - ${day.status === "attended" ? `${day.attendance_count} class(es)` : "No classes"}`}
                      >
                        <div className="font-medium">{dayNum}</div>
                        {day.attendance_count > 0 && (
                          <div className="text-xs">{day.attendance_count}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Legend */}
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-gray-600">ATTENDED</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-300 rounded"></div>
                  <span className="text-gray-600">NOT ATTENDED</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-400 rounded ring-2 ring-blue-400"></div>
                  <span className="text-gray-600">TODAY</span>
                </div>
              </div>

              {/* Classes Detail (if any attended day is selected) */}
              {weeklyAttendance.weekly_calendar.some(day => day.attendance_count > 0) && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-medium text-gray-700 mb-2">Recent Classes:</p>
                  {weeklyAttendance.weekly_calendar
                    .filter(day => day.attendance_count > 0)
                    .slice(0, 3)
                    .map(day => (
                      <div key={day.date} className="mb-2 last:mb-0">
                        <p className="text-xs text-gray-600">{day.day_name}, {new Date(day.date).toLocaleDateString()}</p>
                        {day.classes.slice(0, 2).map(cls => (
                          <div key={cls.id} className="text-xs text-gray-500 ml-2">
                            • {cls.class_name} ({cls.start_time.slice(0, 5)}) - {cls.status_display}
                          </div>
                        ))}
                      </div>
                    ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500">No attendance data available</p>
            </div>
          )}
        </div>


        <div className="mx-4 mb-6 rounded-2xl bg-yellow-50 p-[1px] shadow-lg">

          {/* Today's Instruction */}
          <div className="rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <p className="text-xs font-medium text-gray-600">
                Today's Focus - {todayInstruction?.day_name || new Date().toLocaleDateString('en-US', { weekday: 'long' })}
              </p>
            </div>

            {instructionsLoading ? (
              <div className="flex items-center justify-center py-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
              </div>
            ) : todayInstruction ? (
              <p className="text-sm text-gray-700 leading-relaxed">
                {todayInstruction.instruction}
              </p>
            ) : (
              <p className="text-sm text-gray-400 italic">
                No instruction available for today
              </p>
            )}
          </div>

        </div>


        {/* Today's Classes */}
        <div className="mx-4 mb-6 bg-white rounded-lg p-4 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4">Today's Classes</h3>

          {classesLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          ) : classesError ? (
            <div className="text-center py-6">
              <p className="text-red-600 mb-3">Failed to load today's classes</p>
              <button
                onClick={fetchTodaysClasses}
                className="text-blue-600 text-sm font-medium hover:text-blue-700"
              >
                Retry
              </button>
            </div>
          ) : todaysClasses && todaysClasses.classes.length > 0 ? (
            <>
              {/* Classes Summary */}
              <div className="bg-blue-50 p-3 rounded-lg mb-4">
                <p className="text-sm text-blue-800 font-medium">
                  {todaysClasses.day_name}, {new Date(todaysClasses.date).toLocaleDateString()}
                </p>
                <p className="text-xs text-blue-700">
                  {todaysClasses.total_classes} class{todaysClasses.total_classes !== 1 ? 'es' : ''} scheduled
                </p>
              </div>

              {/* Classes List */}
              <div className="space-y-3">
                {todaysClasses.classes.filter(cls => {
                  const now = new Date();
                  const timeNow = now.toTimeString().slice(0, 5); // "HH:MM"

                  // Convert start and end to Date objects for easier math
                  const [startH, startM] = cls.start_time.split(":").map(Number);
                  const [endH, endM] = cls.end_time.split(":").map(Number);

                  const startDate = new Date(now);
                  startDate.setHours(startH, startM, 0, 0);

                  const endDate = new Date(now);
                  endDate.setHours(endH + 1, endM, 0, 0); // ✅ extend end_time by +1 hr

                  const currentDate = new Date(now);
                  const [curH, curM] = timeNow.split(":").map(Number);
                  currentDate.setHours(curH, curM, 0, 0);

                  console.log("Class:", cls.title,
                    "Start:", startDate.toTimeString().slice(0, 5),
                    "End+1hr:", endDate.toTimeString().slice(0, 5),
                    "Now:", currentDate.toTimeString().slice(0, 5));

                  return currentDate >= startDate && currentDate <= endDate;
                }).map((cls) => (
                  <div key={cls.id} className="border rounded-lg p-3 bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{cls.title}</h4>
                        <p className="text-sm text-gray-600">{cls.description}</p>
                      </div>
                      {/* <span className={`px-2 py-1 rounded-full text-xs font-medium ${cls.is_ongoing
                      ? 'bg-green-100 text-green-800'
                      : cls.is_upcoming_today
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                      }`}>
                      {cls.time_status}
                    </span> */}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{cls.start_time.slice(0, 5)} - {cls.end_time.slice(0, 5)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{cls.attendance_count}/{cls.max_participants}</span>
                        </div>
                      </div>
                      {/* {cls.average_rating && (
                      <div className="flex items-center gap-1">
                        <span>⭐ {cls.average_rating.toFixed(1)}</span>
                        <span className="text-xs">({cls.total_ratings})</span>
                      </div>
                    )} */}
                    </div>

                    {/* Join Button and Rate Button */}
                    <div className="space-y-2">
                      {(getTime(cls.end_time)) && cls.live_link && (
                        <button
                          onClick={() => markAttendance(cls.id, cls.live_link)}
                          disabled={joiningClass === cls.id}
                          className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${joiningClass === cls.id
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : cls.is_ongoing
                              ? 'bg-green-600 text-white hover:bg-green-700'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                        >
                          {joiningClass === cls.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                              Joining...
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4" />
                              {cls.is_ongoing ? 'Join Now' : 'Join Class'}
                            </>
                          )}
                        </button>
                      )}

                      {/* Rate Class Button */}
                      <button
                        onClick={() => {
                          setRatingClassId(cls.id);
                          setShowRatingModal(true);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium text-sm transition-colors bg-yellow-500 text-white hover:bg-yellow-600"
                      >
                        <Star className="w-4 h-4" />
                        Rate This Class
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500 mb-2">No classes scheduled for today</p>
              <p className="text-xs text-gray-400">Check back tomorrow for new classes!</p>
            </div>
          )}
        </div>

        {/* Join Telegram Community Card */}
        <div className="mx-5 mb-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">Join Our Communities</h3>
              {/* <p className="text-blue-100 text-sm mb-4">
                Connect with fellow yogis, get daily tips, and stay updated with the latest yoga practices in our Telegram community.
              </p> */}
              <div className="flex items-center gap-2 text-blue-100 text-xs mb-4">
                <Users className="w-4 h-4" />
                <span>1000+ Active Members</span>
              </div>
            </div>

          </div>
          <button
            onClick={() => window.open('https://t.me/yogafornation', '_blank')}
            className="w-full bg-white text-blue-600 py-3 px-4 rounded-lg font-medium text-sm hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
            Join Telegram Community
          </button>
          <button
            onClick={() => window.open('https://t.me/yogafornation', '_blank')}
            className="w-full bg-white text-blue-600 mt-4 py-3 px-4 rounded-lg font-medium text-sm hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-whatsapp" viewBox="0 0 16 16">
                <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
            </svg>
            Join Whatsapp Community
          </button>
        </div>



      </>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto relative overflow-hidden">
      {/* Rating Modal */}
      <RatingModal
        open={showRatingModal}
        onClose={() => {
          setShowRatingModal(false);
          setRatingClassId(null);
        }}
        onSubmit={handleSubmitRating}
        classId={ratingClassId}
      />
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="absolute inset-0 bg-black/15 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`absolute top-0 left-0 h-full w-full sm:w-80 max-w-sm bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">{userProfile?.name || "Loading..."}</p>
              <p className="text-sm text-gray-500">{userProfile?.email || "No email"}</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="flex flex-col h-full">
          <div className="flex-1 p-4">
            <nav className="space-y-2">
              <button
                onClick={() => {
                  navigate("/");
                  setSidebarOpen(false);
                }}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-100 rounded-lg transition-colors"
              >
                <HomeIcon className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">Home</span>
              </button>
              <button
                onClick={() => {
                  navigate("/profile-edit");
                  setSidebarOpen(false);
                }}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Edit3 className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">Edit Profile</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("home");
                  setSidebarOpen(false);
                }}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Home className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">Dashboard</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("resources");
                  setSidebarOpen(false);
                }}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-100 rounded-lg transition-colors"
              >
                <BookOpen className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">Resources</span>
              </button>

              <button
                onClick={() => {
                  navigate("/donations");
                  setSidebarOpen(false);
                }}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Heart className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">Donations</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("referral");
                  setSidebarOpen(false);
                }}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Users className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">My Referral</span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-red-50 rounded-lg transition-colors text-red-600"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </nav>
          </div>


        </div>
      </div>

      {/* Sticky Header */}
      <header className="sticky top-0 z-30 bg-white shadow-sm border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <p className="text-xs text-gray-500">Namaste</p>
              <p className="font-semibold text-gray-800">{userProfile?.name || "Loading..."}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">{userProfile?.karma_points || 0}</span>
            <span className="text-sm text-gray-600">Karma Points</span>
          </div>
        </div>
      </header>

      {/* Scrollable Content */}
      <main className="pb-20 pt-4">{renderContent()}</main>

      {/* Sticky Footer Navigation */}
      <footer className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t shadow-lg">
        <div className="grid grid-cols-4">
          <button
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center py-3 px-2 ${activeTab === "home" ? "text-blue-600" : "text-gray-500"
              }`}
          >
            <Home className="w-5 h-5 mb-1" />
            <span className="text-xs">Home</span>
          </button>

          <button
            onClick={() => setActiveTab("resources")}
            className={`flex flex-col items-center py-3 px-2 ${activeTab === "resources" ? "text-blue-600" : "text-gray-500"
              }`}
          >
            <BookOpen className="w-5 h-5 mb-1" />
            <span className="text-xs">Resources</span>
          </button>

          <button
            onClick={() => setActiveTab("referral")}
            className={`flex flex-col items-center py-3 px-2 ${activeTab === "referral" ? "text-blue-600" : "text-gray-500"
              }`}
          >
            <Users className="w-5 h-5 mb-1" />
            <span className="text-xs">My Referral</span>
          </button>


          <button
            onClick={() => setActiveTab("leaderboard")}
            className={`flex flex-col items-center py-3 px-2 ${activeTab === "referral" ? "text-blue-600" : "text-gray-500"
              }`}
          >
            <AlignEndHorizontal className="w-5 h-5 mb-1" />
            <span className="text-xs">LeaderBoard</span>
          </button>


        </div>
      </footer>
      <ToastContainer />
    </div>
  )
}


// Rating Modal Component
function RatingModal({ open, onClose, onSubmit, classId }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleStarClick = (star) => {
    setRating(star);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) return;
    setSubmitting(true);
    await onSubmit({ class_id: classId, rating, review });
    setSubmitting(false);
    setRating(0);
    setReview("");
    onClose();
  };

  const handleClose = () => {
    setRating(0);
    setReview("");
    onClose();
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm mx-6 relative">
        <button className="absolute top-2 right-2 p-1" onClick={handleClose}>
          <X className="w-5 h-5 text-gray-500" />
        </button>
        <h3 className="text-lg font-semibold mb-2 text-gray-800">Rate This Class</h3>
        <form onSubmit={handleSubmit}>
          <div className="flex items-center mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => handleStarClick(star)}
                className="focus:outline-none"
              >
                <Star className={`w-7 h-7 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} fill={star <= rating ? '#facc15' : 'none'} />
              </button>
            ))}
          </div>
          <textarea
            className="w-full border rounded-lg p-2 mb-3 text-sm"
            rows={3}
            placeholder="Write a review (optional)"
            value={review}
            onChange={e => setReview(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium disabled:opacity-60"
            disabled={submitting || !rating}
          >
            {submitting ? 'Submitting...' : 'Submit Rating'}
          </button>
        </form>
      </div>
    </div>
  );
}