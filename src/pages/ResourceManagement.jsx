"use client"


import { useState } from "react"
import { Plus, Edit, Trash2, Eye, EyeOff, Tag, FileText, Video, Music, Download } from "lucide-react"

export default function ResourceManagement() {
  const [resources, setResources] = useState([
    {
      id: 1,
      title: "Yoga Handbook - 55+ Asanas",
      type: "PDF",
      category: "Handbook",
      visibility: "Free",
      tags: ["beginner", "asanas", "guide"],
      downloads: 1247,
      uploadDate: "2024-01-10",
      status: "Active",
    },
    {
      id: 2,
      title: "Pranayama Breathing Techniques",
      type: "Video Link",
      category: "Tutorial",
      visibility: "Premium",
      tags: ["breathing", "pranayama", "advanced"],
      downloads: 856,
      uploadDate: "2024-01-08",
      status: "Active",
    },
    {
      id: 3,
      title: "Meditation Music Collection",
      type: "Audio",
      category: "Music",
      visibility: "Referral",
      tags: ["meditation", "relaxation", "music"],
      downloads: 432,
      uploadDate: "2024-01-05",
      status: "Hidden",
    },
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    type: "PDF",
    category: "",
    visibility: "Free",
    tags: "",
    url: "",
    description: "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const newResource = {
      id: resources.length + 1,
      ...formData,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      downloads: 0,
      uploadDate: new Date().toISOString().split("T")[0],
      status: "Active",
    }
    setResources([...resources, newResource])

    // Reset form
    setFormData({
      title: "",
      type: "PDF",
      category: "",
      visibility: "Free",
      tags: "",
      url: "",
      description: "",
    })
    setShowAddForm(false)
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const toggleVisibility = (id) => {
    setResources(
      resources.map((resource) =>
        resource.id === id ? { ...resource, status: resource.status === "Active" ? "Hidden" : "Active" } : resource,
      ),
    )
  }

  const deleteResource = (id) => {
    setResources(resources.filter((resource) => resource.id !== id))
  }

  const getVisibilityColor = (visibility) => {
    switch (visibility) {
      case "Free":
        return "bg-green-100 text-green-800"
      case "Premium":
        return "bg-blue-100 text-blue-800"
      case "Referral":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case "PDF":
        return <FileText className="h-4 w-4" />
      case "Video Link":
        return <Video className="h-4 w-4" />
      case "Audio":
        return <Music className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Resource Management</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Resource
          </button>
        </div>

        {/* Add Resource Form */}
        {showAddForm && (
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <h2 className="text-lg font-semibold mb-4">Upload New Resource</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resource Type *</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="PDF">PDF</option>
                  <option value="Video Link">Video Link</option>
                  <option value="Audio">Audio</option>
                  <option value="Document">Document</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Handbook, Tutorial, Music"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Visibility *</label>
                <select
                  name="visibility"
                  value={formData.visibility}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Free">Free</option>
                  <option value="Premium">Premium</option>
                  <option value="Referral">Referral-based</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="beginner, asanas, guide (comma separated)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL/File Link</label>
                <input
                  type="url"
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/resource"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Brief description of the resource..."
                />
              </div>

              <div className="md:col-span-2 flex gap-2">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  Upload Resource
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Resources List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resource Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type & Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Visibility
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tags
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Downloads
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {resources.map((resource) => (
                  <tr key={resource.id} className={resource.status === "Hidden" ? "opacity-50" : ""}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{resource.title}</div>
                        <div className="text-sm text-gray-500">Uploaded: {resource.uploadDate}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(resource.type)}
                        <div>
                          <div className="text-sm text-gray-900">{resource.type}</div>
                          <div className="text-sm text-gray-500">{resource.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getVisibilityColor(resource.visibility)}`}
                      >
                        {resource.visibility}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {resource.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                          >
                            <Tag className="h-3 w-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Download className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{resource.downloads}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleVisibility(resource.id)}
                          className="text-blue-600 hover:text-blue-900"
                          title={resource.status === "Active" ? "Hide Resource" : "Show Resource"}
                        >
                          {resource.status === "Active" ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                        <button className="text-green-600 hover:text-green-900" title="Edit Resource">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteResource(resource.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Resource"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    
  )
}
