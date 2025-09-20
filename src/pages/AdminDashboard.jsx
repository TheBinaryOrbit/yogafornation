import { useState, useEffect } from "react";
import { BarChart3, Users, DollarSign, Video, Clock, FileText, HelpCircle, Calendar, Filter, Eye, ChevronRight, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAdminAuth } from "../contexts/AdminAuthContext";
import FavoriteClassesChart from "../components/Charts/FavoriteClassesChart";
import ActiveUsersChart from "../components/Charts/ActiveUsersChart";
import PlatformStatsCards from "../components/Charts/PlatformStatsCards";
import UserStreakChart from "../components/Charts/UserStreakChart";

export default function AdminDashboard() {
  const { getToken } = useAdminAuth();
  const [classes, setClasses] = useState([]);
  const [publicStats, setPublicStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  // Quick links for admin navigation
  const quickLinks = [
    { 
      title: "User Management", 
      description: "Manage user accounts and permissions", 
      icon: Users, 
      href: "/admin/users",
      color: "bg-blue-500"
    },
    { 
      title: "Live Classes", 
      description: "Schedule and manage yoga classes", 
      icon: Video, 
      href: "/admin/classes",
      color: "bg-green-500"
    },
    { 
      title: "Financials", 
      description: "View financial reports and analytics", 
      icon: DollarSign, 
      href: "/admin/financials",
      color: "bg-yellow-500"
    },
    { 
      title: "Resources", 
      description: "Manage diet plans and resources", 
      icon: FileText, 
      href: "/admin/resources",
      color: "bg-purple-500"
    },
    { 
      title: "Instructions", 
      description: "Manage batch timings and instructions", 
      icon: Clock, 
      href: "/admin/batches",
      color: "bg-indigo-500"
    },
    { 
      title: "FAQs", 
      description: "Manage frequently asked questions", 
      icon: HelpCircle, 
      href: "/admin/faqs",
      color: "bg-pink-500"
    }
  ];

  // Fetch all classes
  const fetchClasses = async () => {
    try {
      setLoading(true);
      const token = getToken();
      
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      console.log("🔍 Fetching classes for dashboard...");

      const response = await axios.get(
        "http://localhost/yogabackend/api/classes",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      console.log("✅ Classes response:", response.data);

      if (response.data.success) {
        setClasses(response.data.classes || []);
      } else {
        toast.error(response.data.message || "Failed to fetch classes");
      }

    } catch (error) {
      console.error("❌ Error fetching classes:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
      } else {
        toast.error("Failed to fetch classes. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch public stats
  const fetchPublicStats = async () => {
    try {
      setStatsLoading(true);
      const token = getToken();
      
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      console.log("🔍 Fetching public stats...");

      const response = await axios.get(
        "http://localhost/yogabackend/api/admin/public-stats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      console.log("✅ Public stats response:", response.data);

      if (response.data.success) {
        setPublicStats(response.data.data);
      } else {
        toast.error(response.data.message || "Failed to fetch public stats");
      }

    } catch (error) {
      console.error("❌ Error fetching public stats:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
      } else {
        toast.error("Failed to fetch public stats. Please try again.");
      }
    } finally {
      setStatsLoading(false);
    }
  };

  // Filter classes by date only
  const filteredClasses = classes.filter(classItem => {
    const dateMatch = !selectedDate || classItem.class_date === selectedDate;
    return dateMatch;
  });

  // Format time display
  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Format date display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Get today's date for default filter
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  useEffect(() => {
    fetchClasses();
    fetchPublicStats();
    // Set today's date as default
    setSelectedDate(getTodayDate());
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage classes, view attendance, and access admin tools</p>
        </div>

        {/* Quick Links */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickLinks.map((link, index) => (
              <Link
                key={index}
                to={link.href}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div className={`${link.color} p-3 rounded-lg text-white mr-4`}>
                      <link.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                        {link.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{link.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Charts and Analytics Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Analytics Dashboard</h2>
              <p className="text-gray-600 mt-1">Platform statistics and performance metrics</p>
            </div>
            <button
              onClick={fetchPublicStats}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Refresh Stats
            </button>
          </div>

          {statsLoading ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading analytics...</p>
            </div>
          ) : publicStats ? (
            <div className="space-y-8">
              {/* Platform Stats Cards */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Platform Overview</h3>
                <PlatformStatsCards platformStats={publicStats.platform_stats} />
              </div>

              {/* Charts Grid */}
              <div className="">
                {/* Favorite Classes Chart */}
                {publicStats.favorite_classes && publicStats.favorite_classes.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Top Rated Classes</h3>
                    <FavoriteClassesChart favoriteClasses={publicStats.favorite_classes} />
                  </div>
                )}

                {/* Active Users Chart */}
                {/* {publicStats.active_users && publicStats.active_users.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Active Users Distribution</h3>
                    <ActiveUsersChart activeUsers={publicStats.active_users} />
                  </div>
                )} */}
              </div>

              {/* User Streak Chart - Full Width */}
              {/* {publicStats.active_users && publicStats.active_users.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">User Activity Streaks</h3>
                  <UserStreakChart activeUsers={publicStats.active_users} />
                </div>
              )} */}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No analytics data available</p>
              <p className="text-sm text-gray-500 mt-1">Click "Refresh Stats" to load data</p>
            </div>
          )}
        </div>

        {/* Class Attendance Section */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Class Attendance Overview</h2>
            <p className="text-gray-600 mt-1">Filter and view attendance for scheduled classes</p>
          </div>

          {/* Filters */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex gap-4 items-center flex-wrap">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <label htmlFor="dateFilter" className="text-sm font-medium text-gray-700">Date:</label>
                <input
                  type="date"
                  id="dateFilter"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <button
                onClick={fetchClasses}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                Refresh Data
              </button>
            </div>
          </div>

          {/* Classes List */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading classes...</p>
              </div>
            ) : filteredClasses.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No classes found for the selected filters</p>
                <p className="text-sm text-gray-500 mt-1">Try adjusting your date or class type filter</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredClasses.map((classItem) => (
                  <div key={classItem.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{classItem.title}</h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {classItem.day_of_week}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{classItem.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Date:</span>
                            <p className="font-medium">{formatDate(classItem.class_date)}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Time:</span>
                            <p className="font-medium">
                              {formatTime(classItem.start_time)} - {formatTime(classItem.end_time)}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Rating:</span>
                            <p className="font-medium flex items-center gap-1">
                              ⭐ {classItem.average_rating || 0} ({classItem.total_ratings || 0} reviews)
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Live Link:</span>
                            <a 
                              href={classItem.live_link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="font-medium text-blue-600 hover:text-blue-800 truncate block"
                            >
                              Join Class
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="text-right ml-6">
                        <div className="text-lg font-bold text-gray-900">
                          {classItem.attendance_count || 0} / {classItem.max_participants}
                        </div>
                        <div className="text-sm text-gray-500 mb-2">Attendees</div>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{
                              width: `${Math.min(((classItem.attendance_count || 0) / classItem.max_participants) * 100, 100)}%`
                            }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {Math.round(((classItem.attendance_count || 0) / classItem.max_participants) * 100)}% filled
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Summary Stats */}
          {filteredClasses.length > 0 && (
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{filteredClasses.length}</div>
                  <div className="text-sm text-gray-600">Total Classes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {filteredClasses.reduce((sum, cls) => sum + (cls.attendance_count || 0), 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Attendees</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {filteredClasses.reduce((sum, cls) => sum + cls.max_participants, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Capacity</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round((filteredClasses.reduce((sum, cls) => sum + (cls.attendance_count || 0), 0) / 
                                filteredClasses.reduce((sum, cls) => sum + cls.max_participants, 0)) * 100) || 0}%
                  </div>
                  <div className="text-sm text-gray-600">Avg. Occupancy</div>
                </div>
              </div>
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
    </div>
  );
}
