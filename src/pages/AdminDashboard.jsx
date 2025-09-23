import { useState, useEffect } from "react";
import { BarChart3, Users, DollarSign, Video, Clock, FileText, HelpCircle, Calendar, Filter, Eye, ChevronRight, TrendingUp, Layout, Save, Upload } from "lucide-react";
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
  
  // Hero section state
  const [heroData, setHeroData] = useState({
    id: null,
    title: "",
    subtitle: "",
    button_text: "",
    member_count: "",
    is_active: true,
    hero_image_url: ""
  });
  const [heroLoading, setHeroLoading] = useState(false);
  const [heroSaving, setHeroSaving] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);

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
    },
    { 
      title: "Hero Section", 
      description: "Edit homepage hero section content", 
      icon: Layout, 
      href: "#hero-section",
      color: "bg-cyan-500"
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
        "https://api.yogafornation.com/api/classes",
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
        "https://api.yogafornation.com/api/admin/public-stats",
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

  // Fetch hero section data
  const fetchHeroSection = async () => {
    try {
      setHeroLoading(true);
      const response = await axios.get('https://api.yogafornation.com/api/hero-section');
      
      if (response.data.success && response.data.hero_section) {
        setHeroData(response.data.hero_section);
      }
    } catch (error) {
      console.error('Error fetching hero section:', error);
      toast.error('Failed to fetch hero section data');
    } finally {
      setHeroLoading(false);
    }
  };

  // Update hero section
  const updateHeroSection = async () => {
    try {
      setHeroSaving(true);
      const token = getToken();
      
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const updateData = {
        title: heroData.title,
        subtitle: heroData.subtitle,
        button_text: heroData.button_text,
        member_count: heroData.member_count,
        is_active: heroData.is_active ? 1 : 0
      };

      const response = await axios.put(
        `https://api.yogafornation.com/api/admin/hero-sections/${heroData.id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.data.success) {
        toast.success('Hero section updated successfully!');
        // Refresh the data
        fetchHeroSection();
      } else {
        toast.error(response.data.message || 'Failed to update hero section');
      }
    } catch (error) {
      console.error('Error updating hero section:', error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
      } else {
        toast.error('Failed to update hero section. Please try again.');
      }
    } finally {
      setHeroSaving(false);
    }
  };

  // Upload hero section image
  const uploadHeroImage = async () => {
    if (!selectedImage) {
      toast.error('Please select an image first');
      return;
    }

    try {
      setImageUploading(true);
      const token = getToken();
      
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const formData = new FormData();
      formData.append('hero_image', selectedImage);
      formData.append('title', heroData.title);
      formData.append('member_count', heroData.member_count);

      const response = await axios.post(
        `https://api.yogafornation.com/api/admin/hero-sections/${heroData.id}/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        toast.success('Hero image uploaded successfully!');
        // Refresh the data
        fetchHeroSection();
        setSelectedImage(null);
        // Clear the file input
        const fileInput = document.getElementById('hero-image-input');
        if (fileInput) fileInput.value = '';
      } else {
        toast.error(response.data.message || 'Failed to upload hero image');
      }
    } catch (error) {
      console.error('Error uploading hero image:', error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
      } else {
        toast.error('Failed to upload hero image. Please try again.');
      }
    } finally {
      setImageUploading(false);
    }
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please select a valid image file (JPG, PNG, WEBP)');
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      setSelectedImage(file);
    }
  };

  // Handle hero form input changes
  const handleHeroInputChange = (field, value) => {
    setHeroData(prev => ({
      ...prev,
      [field]: value
    }));
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
    fetchHeroSection();
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
            {quickLinks.map((link, index) => {
              if (link.href === "#hero-section") {
                return (
                  <a
                    key={index}
                    href={link.href}
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
                  </a>
                );
              }
              
              return (
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
              );
            })}
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

        {/* Hero Section Management */}
        <div id="hero-section" className="mb-8 mt-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Hero Section Management</h2>
                <p className="text-gray-600 mt-1">Edit the main hero section content on your homepage</p>
              </div>
              <button
                onClick={updateHeroSection}
                disabled={heroSaving}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                {heroSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>

            {heroLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Main Title
                    </label>
                    <input
                      type="text"
                      value={heroData.title || ''}
                      onChange={(e) => handleHeroInputChange('title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter hero section title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      value={heroData.subtitle || ''}
                      onChange={(e) => handleHeroInputChange('subtitle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter hero section subtitle"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={heroData.button_text || ''}
                      onChange={(e) => handleHeroInputChange('button_text', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter button text"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Member Count
                    </label>
                    <input
                      type="text"
                      value={heroData.member_count || ''}
                      onChange={(e) => handleHeroInputChange('member_count', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 1.24 Crore +"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="hero-active"
                      checked={heroData.is_active}
                      onChange={(e) => handleHeroInputChange('is_active', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="hero-active" className="ml-2 block text-sm text-gray-900">
                      Hero section is active
                    </label>
                  </div>

                  {/* Image Upload Section */}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Hero Image</h3>
                      {heroData.hero_image_url && (
                        <div className="text-sm text-gray-600">
                          Current image: {heroData.hero_image_url.split('/').pop()}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <input
                          type="file"
                          id="hero-image-input"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Supported: JPG, PNG, WEBP. Max size: 5MB
                        </p>
                      </div>
                      
                      <button
                        onClick={uploadHeroImage}
                        disabled={!selectedImage || imageUploading}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {imageUploading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4" />
                            Upload Image
                          </>
                        )}
                      </button>
                    </div>

                    {selectedImage && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                          Selected: {selectedImage.name} ({(selectedImage.size / 1024 / 1024).toFixed(2)} MB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
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
