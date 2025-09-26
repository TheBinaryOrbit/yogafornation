import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Video, Users, Calendar, Clock, Star, X, ExternalLink } from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAdminAuth } from "../contexts/AdminAuthContext";

export default function LiveClassesPage() {
  const { getToken } = useAdminAuth();
  const [classes, setClasses] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    day: "Monday",
    class_date: "",
    start_time: "",
    end_time: "",
    max_participants: 50,
    live_link: "",
    instructor: "",
    class_type: "Beginner",
    location: "Online"
  });

  // Filter states
  const [filterDay, setFilterDay] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const classTypes = ["Beginner", "Intermediate", "Advanced", "All Levels"];

  // Helper function to convert HH:MM to HH:MM:SS format
  const formatTimeForAPI = (time) => {
    if (!time) return "";
    return time.includes(':') && time.split(':').length === 2 ? `${time}:00` : time;
  };

  // Helper function to convert HH:MM:SS to HH:MM format for form display
  const formatTimeForDisplay = (time) => {
    if (!time) return "";
    return time.includes(':') && time.split(':').length === 3 ? time.substring(0, 5) : time;
  };

  // Fetch all classes
  const fetchClasses = async () => {
    try {
      setLoading(true);
      const token = getToken();
      
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      console.log("🔍 Fetching classes...");

      const response = await axios.get(
        "https://lightsteelblue-woodcock-286554.hostingersite.com/api/classes",
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
        setStatistics(response.data.statistics || {});
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

  // Create new class
  const createClass = async () => {
    try {
      const token = getToken();
      
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      // Validate form
      if (!formData.title.trim() || !formData.description.trim() || !formData.class_date || !formData.start_time || !formData.end_time) {
        toast.error("Please fill in all required fields");
        return;
      }

      if (!formData.instructor.trim()) {
        toast.error("Please specify an instructor");
        return;
      }

      console.log("➕ Creating class:", formData);

      const response = await axios.post(
        "https://lightsteelblue-woodcock-286554.hostingersite.com/api/admin/classes",
        {
          title: formData.title,
          description: formData.description,
          day_of_week: formData.day,
          class_date: formData.class_date,
          start_time: formatTimeForAPI(formData.start_time),
          end_time: formatTimeForAPI(formData.end_time),
          max_participants: parseInt(formData.max_participants),
          live_link: formData.live_link,
          instructor: formData.instructor,
          class_type: formData.class_type,
          location: formData.location
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      console.log("✅ Create response:", response.data);

      if (response.data.success) {
        toast.success("Class created successfully");
        await fetchClasses();
        closeModals();
      } else {
        toast.error(response.data.message || "Failed to create class");
      }

    } catch (error) {
      console.error("❌ Error creating class:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
      } else {
        toast.error("Failed to create class. Please try again.");
      }
    }
  };

  // Update existing class
  const updateClass = async () => {
    try {
      const token = getToken();
      
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      // Validate form
      if (!formData.title.trim() || !formData.description.trim() || !formData.class_date || !formData.start_time || !formData.end_time) {
        toast.error("Please fill in all required fields");
        return;
      }

      console.log("✏️ Updating class:", selectedClass.id, formData);

      const response = await axios.put(
        `https://lightsteelblue-woodcock-286554.hostingersite.com/api/admin/classes/${selectedClass.id}`,
        {
          title: formData.title,
          description: formData.description,
          day_of_week: formData.day,
          class_date: formData.class_date,
          start_time: formatTimeForAPI(formData.start_time),
          end_time: formatTimeForAPI(formData.end_time),
          max_participants: parseInt(formData.max_participants),
          live_link: formData.live_link,
          instructor: formData.instructor,
          class_type: formData.class_type,
          location: formData.location
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      console.log("✅ Update response:", response.data);

      if (response.data.success) {
        toast.success("Class updated successfully");
        await fetchClasses();
        closeModals();
      } else {
        toast.error(response.data.message || "Failed to update class");
      }

    } catch (error) {
      console.error("❌ Error updating class:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
      } else {
        toast.error("Failed to update class. Please try again.");
      }
    }
  };

  // Delete class
  const deleteClass = async (classId) => {
    if (!window.confirm("Are you sure you want to delete this class? This action cannot be undone.")) {
      return;
    }

    try {
      const token = getToken();
      
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      console.log("🗑️ Deleting class:", classId);

      const response = await axios.delete(
        `https://lightsteelblue-woodcock-286554.hostingersite.com/api/admin/classes/${classId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      console.log("✅ Delete response:", response.data);

      if (response.data.success) {
        toast.success("Class deleted successfully");
        await fetchClasses();
      } else {
        toast.error(response.data.message || "Failed to delete class");
      }

    } catch (error) {
      console.error("❌ Error deleting class:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
      } else {
        toast.error("Failed to delete class. Please try again.");
      }
    }
  };

  // Modal handlers
  const openAddModal = () => {
    setFormData({
      title: "",
      description: "",
      day: "Monday",
      class_date: "",
      start_time: "",
      end_time: "",
      max_participants: 50,
      live_link: "",
      instructor: "",
      class_type: "Beginner",
      location: "Online"
    });
    setShowAddModal(true);
  };

  const openEditModal = (classItem) => {
    setSelectedClass(classItem);
    setFormData({
      title: classItem.title,
      description: classItem.description,
      day: classItem.day,
      class_date: classItem.class_date || "",
      start_time: formatTimeForDisplay(classItem.start_time),
      end_time: formatTimeForDisplay(classItem.end_time),
      max_participants: classItem.max_participants,
      live_link: classItem.live_link || "",
      instructor: classItem.instructor,
      class_type: classItem.class_type,
      location: classItem.location
    });
    setShowEditModal(true);
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedClass(null);
    setFormData({
      title: "",
      description: "",
      day: "Monday",
      class_date: "",
      start_time: "",
      end_time: "",
      max_participants: 50,
      live_link: "",
      instructor: "",
      class_type: "Beginner",
      location: "Online"
    });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Get class type color
  const getTypeColor = (type) => {
    switch (type) {
      case 'Beginner':
        return 'text-green-800 bg-green-100';
      case 'Intermediate':
        return 'text-yellow-800 bg-yellow-100';
      case 'Advanced':
        return 'text-red-800 bg-red-100';
      case 'All Levels':
        return 'text-blue-800 bg-blue-100';
      default:
        return 'text-gray-800 bg-gray-100';
    }
  };

  // Filter classes
  const filteredClasses = classes.filter(classItem => {
    const dayMatch = filterDay === "all" || classItem.day === filterDay;
    const typeMatch = filterType === "all" || classItem.class_type === filterType;
    return dayMatch && typeMatch;
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

  // Fetch data on component mount
  useEffect(() => {
    fetchClasses();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Live Classes Management</h1>
              <p className="text-gray-600 mt-1">Create and manage yoga classes for your community</p>
            </div>
            <button
              onClick={openAddModal}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add New Class
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        {Object.keys(statistics).length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Video className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Classes</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.total_classes || 0}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Calendar className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Active Classes</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.active_classes || 0}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Weekly Attendees</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.total_attendees_this_week || 0}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Star className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Avg. Rating</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.average_class_rating || '0.0'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        {/* <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex gap-4 items-center flex-wrap">
            <span className="text-sm font-medium text-gray-700">Filters:</span>
            
            <div className="flex items-center gap-2">
              <label htmlFor="dayFilter" className="text-sm text-gray-600">Day:</label>
              <select
                id="dayFilter"
                value={filterDay}
                onChange={(e) => setFilterDay(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Days</option>
                {days.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="typeFilter" className="text-sm text-gray-600">Type:</label>
              <select
                id="typeFilter"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                {classTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div> */}

        {/* Classes Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Yoga Classes</h2>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading classes...</p>
            </div>
          ) : filteredClasses.length === 0 ? (
            <div className="p-12 text-center">
              <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No classes found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Class Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Schedule
                    </th>
                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Instructor
                    </th> */}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Participants
                    </th>
                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th> */}
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredClasses.map((classItem) => (
                    <tr key={classItem.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{classItem.title}</div>
                          <div className="text-sm text-gray-500 max-w-xs truncate">{classItem.description}</div>
                          <div className="mt-1">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(classItem.class_type)}`}>
                              {classItem.class_type}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            {classItem.class_date}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Clock className="h-4 w-4 text-gray-400" />
                            {formatTime(classItem.start_time)} - {formatTime(classItem.end_time)}
                          </div>
                        </div>
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap"> */}
                        {/* <div className="text-sm text-gray-900">{classItem.instructor}</div> */}
                        {/* <div className="text-sm text-gray-500">{classItem.location}</div> */}
                      {/* </td> */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {classItem.attendance_count} / {classItem.max_participants}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{
                              width: `${Math.min(((classItem.attendance_count) / classItem.max_participants) * 100, 100)}%`
                            }}
                          ></div>
                        </div>
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className="text-sm text-gray-900">
                            {classItem.average_rating ? classItem.average_rating.toFixed(1) : 'N/A'}
                          </span>
                        </div>
                      </td> */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditModal(classItem)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteClass(classItem.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          {classItem.live_link && (
                            <a
                              href={classItem.live_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-900"
                              title="Join Live Class"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add Class Modal */}
        {showAddModal && (
          <ClassModal
            isOpen={showAddModal}
            onClose={closeModals}
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={createClass}
            title="Add New Class"
            submitText="Create Class"
            days={days}
            classTypes={classTypes}
          />
        )}

        {/* Edit Class Modal */}
        {showEditModal && (
          <ClassModal
            isOpen={showEditModal}
            onClose={closeModals}
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={updateClass}
            title="Edit Class"
            submitText="Update Class"
            days={days}
            classTypes={classTypes}
          />
        )}

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

// Reusable Class Modal Component
function ClassModal({ 
  isOpen, 
  onClose, 
  formData, 
  onInputChange, 
  onSubmit, 
  title, 
  submitText,
  days,
  classTypes 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Class Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={onInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter class title"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={onInputChange}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter class description"
            />
          </div>

          {/* Class Date */}
          <div>
            <label htmlFor="class_date" className="block text-sm font-medium text-gray-700 mb-2">
              Class Date *
            </label>
            <input
              type="date"
              id="class_date"
              name="class_date"
              value={formData.class_date}
              onChange={onInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Day and Times Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="day" className="block text-sm font-medium text-gray-700 mb-2">
                Day *
              </label>
              <select
                id="day"
                name="day"
                value={formData.day}
                onChange={onInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {days.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="start_time" className="block text-sm font-medium text-gray-700 mb-2">
                Start Time *
              </label>
              <input
                type="time"
                id="start_time"
                name="start_time"
                value={formData.start_time}
                onChange={onInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="end_time" className="block text-sm font-medium text-gray-700 mb-2">
                End Time *
              </label>
              <input
                type="time"
                id="end_time"
                name="end_time"
                value={formData.end_time}
                onChange={onInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Instructor and Location Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="instructor" className="block text-sm font-medium text-gray-700 mb-2">
                Instructor *
              </label>
              <input
                type="text"
                id="instructor"
                name="instructor"
                value={formData.instructor}
                onChange={onInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter instructor name"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={onInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter location (e.g., Online, Studio A)"
              />
            </div>
          </div>

          {/* Class Type and Max Participants Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="class_type" className="block text-sm font-medium text-gray-700 mb-2">
                Class Type *
              </label>
              <select
                id="class_type"
                name="class_type"
                value={formData.class_type}
                onChange={onInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {classTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="max_participants" className="block text-sm font-medium text-gray-700 mb-2">
                Max Participants
              </label>
              <input
                type="number"
                id="max_participants"
                name="max_participants"
                value={formData.max_participants}
                onChange={onInputChange}
                min="1"
                max="1000"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="50"
              />
            </div>
          </div>

          {/* Live Link */}
          <div>
            <label htmlFor="live_link" className="block text-sm font-medium text-gray-700 mb-2">
              Live Class Link
            </label>
            <input
              type="url"
              id="live_link"
              name="live_link"
              value={formData.live_link}
              onChange={onInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://meet.google.com/..."
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {submitText}
          </button>
        </div>
      </div>
    </div>
  );
}