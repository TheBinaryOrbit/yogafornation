"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, Eye, EyeOff, Video, Users, Calendar } from "lucide-react"

export default function LiveClassesPage() {
  const [classes, setClasses] = useState([
    {
      id: 1,
      title: "Morning Vinyasa Flow",
      type: "Live",
      category: "Vinyasa",
      instructor: "Sarah Johnson",
      schedule: "Mon, Wed, Fri - 7:00 AM",
      visibility: "Premium",
      participants: 45,
      status: "Active",
    },
    {
      id: 2,
      title: "Evening Restorative Yoga",
      type: "Recorded",
      category: "Restorative",
      instructor: "Mike Chen",
      schedule: "Available 24/7",
      visibility: "Free",
      participants: 128,
      status: "Active",
    },
    {
      id: 3,
      title: "Advanced Power Yoga",
      type: "Live",
      category: "Power",
      instructor: "Lisa Rodriguez",
      schedule: "Tue, Thu - 6:00 PM",
      visibility: "Referral",
      participants: 23,
      status: "Active",
    },
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [newClass, setNewClass] = useState({
    title: "",
    type: "Live",
    category: "",
    instructor: "",
    schedule: "",
    visibility: "Free",
    videoUrl: "",
  })

  const handleAddClass = (e) => {
    e.preventDefault()
    const classData = {
      id: classes.length + 1,
      ...newClass,
      participants: 0,
      status: "Active",
    }
    setClasses([...classes, classData])
    setNewClass({
      title: "",
      type: "Live",
      category: "",
      instructor: "",
      schedule: "",
      visibility: "Free",
      videoUrl: "",
    })
    setShowAddForm(false)
  }

  const toggleVisibility = (id) => {
    setClasses(
      classes.map((cls) => (cls.id === id ? { ...cls, status: cls.status === "Active" ? "Hidden" : "Active" } : cls)),
    )
  }

  const deleteClass = (id) => {
    setClasses(classes.filter((cls) => cls.id !== id))
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

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Live Classes Management</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Class
          </button>
        </div>

        {/* Add Class Form */}
        {showAddForm && (
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <h2 className="text-lg font-semibold mb-4">Add New Class</h2>
            <form onSubmit={handleAddClass} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class Title</label>
                <input
                  type="text"
                  value={newClass.title}
                  onChange={(e) => setNewClass({ ...newClass, title: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class Type</label>
                <select
                  value={newClass.type}
                  onChange={(e) => setNewClass({ ...newClass, type: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Live">Live</option>
                  <option value="Recorded">Recorded</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  value={newClass.category}
                  onChange={(e) => setNewClass({ ...newClass, category: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Vinyasa, Hatha, Power"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instructor</label>
                <input
                  type="text"
                  value={newClass.instructor}
                  onChange={(e) => setNewClass({ ...newClass, instructor: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Schedule</label>
                <input
                  type="text"
                  value={newClass.schedule}
                  onChange={(e) => setNewClass({ ...newClass, schedule: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Mon, Wed, Fri - 7:00 AM"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
                <select
                  value={newClass.visibility}
                  onChange={(e) => setNewClass({ ...newClass, visibility: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Free">Free</option>
                  <option value="Premium">Premium</option>
                  <option value="Referral">Referral-based</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
                <input
                  type="url"
                  value={newClass.videoUrl}
                  onChange={(e) => setNewClass({ ...newClass, videoUrl: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>

              <div className="md:col-span-2 flex gap-2">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  Add Class
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

        {/* Classes List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Class Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type & Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Schedule
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Visibility
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Participants
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {classes.map((cls) => (
                  <tr key={cls.id} className={cls.status === "Hidden" ? "opacity-50" : ""}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{cls.title}</div>
                        <div className="text-sm text-gray-500">by {cls.instructor}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-900">{cls.type}</div>
                          <div className="text-sm text-gray-500">{cls.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{cls.schedule}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getVisibilityColor(cls.visibility)}`}
                      >
                        {cls.visibility}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{cls.participants}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleVisibility(cls.id)}
                          className="text-blue-600 hover:text-blue-900"
                          title={cls.status === "Active" ? "Hide Class" : "Show Class"}
                        >
                          {cls.status === "Active" ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                        <button className="text-green-600 hover:text-green-900" title="Edit Class">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteClass(cls.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Class"
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
