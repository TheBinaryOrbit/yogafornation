import { useState, useEffect } from "react"
import { Plus, Edit2, Trash2, Save, X, Play, AlertCircle, ExternalLink } from "lucide-react"

function AddVideoResources() {
  const [videoResources, setVideoResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingVideo, setEditingVideo] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [newVideo, setNewVideo] = useState({
    title: "",
    description: "",
    youtube_link: "",
    category: "Beginner",
    isActive: true,
  })

  const categories = ["Beginner", "Intermediate", "Advanced", "Meditation", "Breathing", "Other"]

  // Extract YouTube video ID for thumbnail
  const getYouTubeVideoId = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    const match = url.match(regex)
    return match ? match[1] : null
  }

  // Get YouTube thumbnail URL
  const getYouTubeThumbnail = (url) => {
    const videoId = getYouTubeVideoId(url)
    return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null
  }

  // Fetch Video Resources from API
  const fetchVideoResources = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost/yogabackend/api/video-resources')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success && data.video_resources) {
        // Map API response to component format
        const mappedVideos = data.video_resources.map(video => ({
          id: video.id,
          title: video.title,
          description: video.description,
          youtube_link: video.youtube_link,
          category: video.category || "Other",
          isActive: video.is_active !== undefined ? video.is_active : true,
          createdAt: video.created_at,
          updatedAt: video.updated_at
        }))
        
        setVideoResources(mappedVideos)
        setError(null)
      } else {
        throw new Error('Invalid response format')
      }
    } catch (err) {
      console.error('Error fetching video resources:', err)
      setError(err.message || 'Failed to load video resources. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Load Video Resources on component mount
  useEffect(() => {
    fetchVideoResources()
  }, [])

  // Get admin token from localStorage
  const getAdminToken = () => {
    return localStorage.getItem('adminToken')
  }

  // Add Video Resource via API
  const handleAddVideo = async () => {
    if (!newVideo.title.trim() || !newVideo.description.trim() || !newVideo.youtube_link.trim()) {
      alert('Please fill in all required fields (title, description, and YouTube link).')
      return
    }

    // Basic YouTube URL validation
    if (!newVideo.youtube_link.includes('youtube.com') && !newVideo.youtube_link.includes('youtu.be')) {
      alert('Please enter a valid YouTube URL.')
      return
    }

    const adminToken = getAdminToken()
    if (!adminToken) {
      alert('Admin authentication required. Please log in.')
      return
    }

    try {
      setSubmitting(true)
      
      const response = await fetch('http://localhost/yogabackend/api/admin/video-resources', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: newVideo.title.trim(),
          description: newVideo.description.trim(),
          youtube_link: newVideo.youtube_link.trim(),
          category: newVideo.category,
          is_active: newVideo.isActive
        })
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized. Please check your admin token.')
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        // Refresh the video resources list to get the latest data
        await fetchVideoResources()
        
        setNewVideo({ title: "", description: "", youtube_link: "", category: "Beginner", isActive: true })
        setShowAddForm(false)
        setError(null)
      } else {
        throw new Error(data.message || 'Failed to add video resource')
      }
      
    } catch (err) {
      console.error('Error adding video resource:', err)
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditVideo = (video) => {
    setEditingVideo({ ...video })
  }

  const handleUpdateVideo = () => {
    setVideoResources(videoResources.map((video) => (video.id === editingVideo.id ? editingVideo : video)))
    setEditingVideo(null)
  }

  const handleDeleteVideo = async (id) => {
    if (!confirm("Are you sure you want to delete this video resource?")) {
      return
    }

    const adminToken = getAdminToken()
    if (!adminToken) {
      alert('Admin authentication required. Please log in.')
      return
    }

    try {
      const response = await fetch(`http://localhost/yogabackend/api/admin/video-resources?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized. Please check your admin token.')
        }
        if (response.status === 404) {
          throw new Error('Video resource not found. It may have already been deleted.')
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        // Remove the video resource from the local state
        setVideoResources(videoResources.filter((video) => video.id !== id))
        setError(null)
      } else {
        throw new Error(data.message || 'Failed to delete video resource')
      }
    } catch (err) {
      console.error('Error deleting video resource:', err)
      if (err.message.includes('not found')) {
        // Refresh the list to get current state
        fetchVideoResources()
      }
      setError(err.message)
    }
  }

  const toggleVideoStatus = (id) => {
    setVideoResources(videoResources.map((video) => (video.id === id ? { ...video, isActive: !video.isActive } : video)))
  }

  const handleRetry = () => {
    fetchVideoResources()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading video resources...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Manage Video Resources</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add New Video
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <div className="flex-1">
              <p className="text-red-800">{error}</p>
            </div>
            <button
              onClick={handleRetry}
              className="bg-red-100 text-red-800 px-3 py-1 rounded text-sm hover:bg-red-200"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Add Video Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Add New Video Resource</h2>
            <button onClick={() => setShowAddForm(false)} className="text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={newVideo.category}
                onChange={(e) => setNewVideo({ ...newVideo, category: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={submitting}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                value={newVideo.title}
                onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter the video title..."
                disabled={submitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea
                value={newVideo.description}
                onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter the video description..."
                disabled={submitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">YouTube Link *</label>
              <input
                type="url"
                value={newVideo.youtube_link}
                onChange={(e) => setNewVideo({ ...newVideo, youtube_link: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://www.youtube.com/watch?v=..."
                disabled={submitting}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="newVideoActive"
                checked={newVideo.isActive}
                onChange={(e) => setNewVideo({ ...newVideo, isActive: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={submitting}
              />
              <label htmlFor="newVideoActive" className="ml-2 text-sm text-gray-700">
                Active (visible on website)
              </label>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddVideo}
                disabled={submitting}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4" />
                {submitting ? 'Adding...' : 'Add Video'}
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                disabled={submitting}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Resources List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Current Video Resources ({videoResources.length})</h2>
            <button
              onClick={fetchVideoResources}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Refresh
            </button>
          </div>

          <div className="space-y-4">
            {videoResources.map((video) => (
              <div key={video.id} className="border border-gray-200 rounded-lg p-4">
                {editingVideo && editingVideo.id === video.id ? (
                  // Edit Form
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        value={editingVideo.category}
                        onChange={(e) => setEditingVideo({ ...editingVideo, category: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={editingVideo.title}
                        onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={editingVideo.description}
                        onChange={(e) => setEditingVideo({ ...editingVideo, description: e.target.value })}
                        rows={3}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">YouTube Link</label>
                      <input
                        type="url"
                        value={editingVideo.youtube_link}
                        onChange={(e) => setEditingVideo({ ...editingVideo, youtube_link: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`editVideoActive-${video.id}`}
                        checked={editingVideo.isActive}
                        onChange={(e) => setEditingVideo({ ...editingVideo, isActive: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`editVideoActive-${video.id}`} className="ml-2 text-sm text-gray-700">
                        Active (visible on website)
                      </label>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handleUpdateVideo}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                      >
                        <Save className="h-4 w-4" />
                        Save Changes
                      </button>
                      <button
                        onClick={() => setEditingVideo(null)}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // Display Mode
                  <div className="flex gap-4">
                    {/* Video Thumbnail */}
                    <div className="flex-shrink-0 w-48">
                      {getYouTubeThumbnail(video.youtube_link) ? (
                        <div className="relative">
                          <img
                            src={getYouTubeThumbnail(video.youtube_link)}
                            alt={video.title}
                            className="w-full h-28 object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Play className="h-8 w-8 text-white bg-red-600 rounded-full p-1" />
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-28 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Play className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Video Content */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                          <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                            {video.category}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              video.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            {video.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <a
                            href={video.youtube_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-red-600 hover:text-red-800"
                            title="Watch on YouTube"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                          
                          
                          <button onClick={() => handleDeleteVideo(video.id)} className="text-red-600 hover:text-red-800">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <h3 className="font-medium text-gray-900 mb-2">{video.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">{video.description}</p>
                      <p className="text-xs text-gray-400 truncate">{video.youtube_link}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {videoResources.length === 0 && !loading && (
              <div className="text-center py-8 text-gray-500">
                <Play className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No video resources found. Click "Add New Video" to get started.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddVideoResources