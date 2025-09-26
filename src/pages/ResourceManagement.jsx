import { useState, useEffect } from "react"
import { Plus, Trash2, FileText, Users, Crown, Gift, X, Download, Eye } from "lucide-react"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useAdminAuth } from "../contexts/AdminAuthContext"

export default function ResourceManagement() {
  const { getToken } = useAdminAuth()
  const [dietPlans, setDietPlans] = useState([])
  const [loading, setLoading] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [selectedThumbnail, setSelectedThumbnail] = useState(null)
  const [filterType, setFilterType] = useState("all")

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "free",
    karma_points_required: 0,
    user_id: null
  })

  const fetchDietPlans = async () => {
    try {
      setLoading(true)
      const token = getToken()

      if (!token) {
        toast.error("Authentication required")
        return
      }

      console.log("🔍 Fetching diet plans...")

      const response = await axios.get(
        "https://lightsteelblue-woodcock-286554.hostingersite.com/api/admin/diet-plans",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      )

      console.log("✅ Diet plans response:", response.data)

      if (response.data.success) {
        setDietPlans(response.data.diet_plans || [])
      } else {
        toast.error(response.data.message || "Failed to fetch diet plans")
      }

    } catch (error) {
      console.error("❌ Error fetching diet plans:", error)
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.")
      } else {
        toast.error("Failed to fetch diet plans. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const createDietPlan = async () => {
    try {
      const token = getToken()

      if (!token) {
        toast.error("Authentication required")
        return
      }



      if (!formData.title.trim() || !formData.description.trim()) {
        toast.error("Please fill in all required fields")
        return
      }

      if (formData.type === "karma" && (!formData.karma_points_required || formData.karma_points_required <= 0)) {
        toast.error("Please specify karma points required for karma type")
        return
      }

      if (formData.type === "personalized" && !formData.user_id) {
        toast.error("Please specify user ID for personalized plan")
        return
      }


      const formDataUpload = new FormData()
      formDataUpload.append('title', formData.title)
      formDataUpload.append('description', formData.description)
      formDataUpload.append('type', formData.type)
      formDataUpload.append('karma_points', formData.type === 'karma' ? formData.karma_points_required : 0)
      formDataUpload.append('user_id', formData.type === 'personalized' ? formData.user_id : '')
      if (selectedFile) {
        formDataUpload.append('media_url', selectedFile)
      }
      if (selectedThumbnail) {
        formDataUpload.append('thumbnail_url', selectedThumbnail)
      }


      console.log("➕ Creating diet plan:", formData)

      const response = await axios.post(
        "https://lightsteelblue-woodcock-286554.hostingersite.com/api/admin/diet-plans/upload",
        formDataUpload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      )

      console.log("✅ Create response:", response.data)

      if (response.data.success) {
        toast.success("Diet plan created successfully");

        await fetchDietPlans();
        closeModal();
      } else {
        toast.error("Error creating diet plan. Please try again.")
      }

    } catch (error) {
      toast.error("Error creating diet plan. Please try again.")
    }
  }

  const uploadFiles = async (planId) => {
    try {
      const token = getToken()

      if (!token) return

      const formDataUpload = new FormData()
      formDataUpload.append('diet_plan_id', planId)
      if (selectedFile) {
        formDataUpload.append('pdf_file', selectedFile)
      }
      if (selectedThumbnail) {
        formDataUpload.append('thumbnail', selectedThumbnail)
      }

      console.log("📤 Uploading files for plan:", planId)

      const response = await axios.post(
        "https://lightsteelblue-woodcock-286554.hostingersite.com/api/admin/diet-plans/upload",
        formDataUpload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      )

      console.log("✅ Upload response:", response.data)

      if (response.data.success) {
        toast.success("Files uploaded successfully")
      } else {
        toast.warning("Diet plan created but file upload failed")
      }

    } catch (error) {
      console.error("❌ Error uploading files:", error)
      toast.warning("Diet plan created but file upload failed")
    }
  }

  const deleteDietPlan = async (planId) => {
    if (!window.confirm("Are you sure you want to delete this diet plan?")) {
      return
    }

    try {
      const token = getToken()

      if (!token) {
        toast.error("Authentication required")
        return
      }

      console.log("🗑️ Deleting diet plan:", planId)

      const response = await axios.delete(
        `https://lightsteelblue-woodcock-286554.hostingersite.com/api/admin/diet-plans?id=${planId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      )

      console.log("✅ Delete response:", response.data)

      if (response.data.success) {
        toast.success("Diet plan deleted successfully")
        await fetchDietPlans()
      } else {
        toast.error(response.data.message || "Failed to delete diet plan")
      }

    } catch (error) {
      console.error("❌ Error deleting diet plan:", error)
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.")
      } else {
        toast.error("Failed to delete diet plan. Please try again.")
      }
    }
  }

  const openAddModal = () => {
    setFormData({
      title: "",
      description: "",
      type: "free",
      karma_points_required: 0,
      user_id: null
    })
    setSelectedFile(null)
    setSelectedThumbnail(null)
    setShowAddModal(true)
  }

  const closeModal = () => {
    setShowAddModal(false)
    setFormData({
      title: "",
      description: "",
      type: "free",
      karma_points_required: 0,
      user_id: null
    })
    setSelectedFile(null)
    setSelectedThumbnail(null)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'free':
        return 'text-green-800 bg-green-100'
      case 'karma':
        return 'text-blue-800 bg-blue-100'
      case 'personalized':
        return 'text-purple-800 bg-purple-100'
      default:
        return 'text-gray-800 bg-gray-100'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'free':
        return <Gift className="h-4 w-4" />
      case 'karma':
        return <Crown className="h-4 w-4" />
      case 'personalized':
        return <Users className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const filteredPlans = dietPlans.filter(plan => {
    if (filterType === "all") return true
    return plan.type === filterType
  })

  useEffect(() => {
    fetchDietPlans()
  }, [])

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Diet Plan Management</h1>
              <p className="text-gray-600 mt-1">Create and manage diet plans for users</p>
            </div>
            <button
              onClick={openAddModal}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Diet Plan
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex gap-4 items-center">
            <span className="text-sm font-medium text-gray-700">Filter by type:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              <option value="free">Free</option>
              <option value="karma">Karma</option>
              <option value="personalized">Personalized</option>
            </select>
          </div>
        </div>

        {/* Diet Plans Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Diet Plans</h2>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading diet plans...</p>
            </div>
          ) : filteredPlans.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No diet plans found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Karma Points
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPlans.map((plan) => (
                    <tr key={plan.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{plan.title}</div>
                          <div className="text-sm text-gray-500 max-w-xs truncate">{plan.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(plan.type)}`}>
                          {getTypeIcon(plan.type)}
                          {plan.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {plan.karma_points_required || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {plan.user_id || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {plan.created_at ? new Date(plan.created_at).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => deleteDietPlan(plan.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          {plan.media_url && (
                            <a
                              href={plan.media_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-900"
                              title="Download Media File"
                            >
                              <Download className="h-4 w-4" />
                            </a>
                          )}
                          {plan.media_url && (
                            <button
                              onClick={() => window.open(plan.media_url, '_blank')}
                              className="text-blue-600 hover:text-blue-900"
                              title="View Media File"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          )}
                          {plan.thumbnail_url && (
                            <button
                              onClick={() => window.open(plan.thumbnail_url, '_blank')}
                              className="text-purple-600 hover:text-purple-900"
                              title="View Thumbnail"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
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

        {/* Add Diet Plan Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Add New Diet Plan</h3>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter diet plan title"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter diet plan description"
                  />
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                    Plan Type *
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="free">Free</option>
                    <option value="karma">Karma</option>
                    <option value="personalized">Personalized</option>
                  </select>
                </div>

                {formData.type === 'karma' && (
                  <div>
                    <label htmlFor="karma_points_required" className="block text-sm font-medium text-gray-700 mb-2">
                      Karma Points Required *
                    </label>
                    <input
                      type="number"
                      id="karma_points_required"
                      name="karma_points_required"
                      value={formData.karma_points_required}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter karma points required"
                    />
                  </div>
                )}

                {formData.type === 'personalized' && (
                  <div>
                    <label htmlFor="user_id" className="block text-sm font-medium text-gray-700 mb-2">
                      User ID *
                    </label>
                    <input
                      type="number"
                      id="user_id"
                      name="user_id"
                      value={formData.user_id || ''}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter user ID"
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="pdf_file" className="block text-sm font-medium text-gray-700 mb-2">
                    PDF File (Optional)
                  </label>
                  <input
                    type="file"
                    id="pdf_file"
                    accept=".pdf"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {selectedFile && (
                    <p className="text-sm text-gray-600 mt-1">Selected: {selectedFile.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-2">
                    Thumbnail Image (Optional)
                  </label>
                  <input
                    type="file"
                    id="thumbnail"
                    accept="image/*"
                    onChange={(e) => setSelectedThumbnail(e.target.files[0])}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {selectedThumbnail && (
                    <p className="text-sm text-gray-600 mt-1">Selected: {selectedThumbnail.name}</p>
                  )}
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={createDietPlan}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Diet Plan
                </button>
              </div>
            </div>
          </div>
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
  )
}