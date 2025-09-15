"use client"

import { useState } from "react"

export default function BatchTimings() {
  const [formData, setFormData] = useState({
    batchName: "",
    time: "",
    days: "",
  })

  // Sample existing batches
  const [batches, setBatches] = useState([
    {
      id: 1,
      name: "Morning Energizer",
      time: "6:00 AM - 7:00 AM",
      days: "Mon, Wed, Fri",
    },
    {
      id: 2,
      name: "Mid-day Core",
      time: "12:00 PM - 1:00 PM",
      days: "Tue, Thu",
    },
  ])

  const handleSubmit = (e) => {
    e.preventDefault()
    const newBatch = {
      id: batches.length + 1,
      name: formData.batchName,
      time: formData.time,
      days: formData.days,
    }
    setBatches([...batches, newBatch])

    // Reset form
    setFormData({
      batchName: "",
      time: "",
      days: "",
    })
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleEdit = (batchId) => {
    console.log("Edit batch:", batchId)
  }

  const handleDelete = (batchId) => {
    setBatches(batches.filter((batch) => batch.id !== batchId))
  }

  return (
    
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">Manage Batch Timings</h1>

          <div className="max-w-2xl">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Add New Batch</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Batch Name */}
              <div>
                <label htmlFor="batchName" className="block text-sm font-medium text-gray-700 mb-2">
                  Batch Name
                </label>
                <input
                  type="text"
                  id="batchName"
                  name="batchName"
                  value={formData.batchName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Enter batch name"
                  required
                />
              </div>

              {/* Time */}
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                  Time (e.g., 7:00 AM - 8:00 AM)
                </label>
                <input
                  type="text"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="7:00 AM - 8:00 AM"
                  required
                />
              </div>

              {/* Days */}
              <div>
                <label htmlFor="days" className="block text-sm font-medium text-gray-700 mb-2">
                  Days (e.g., Mon, Wed, Fri)
                </label>
                <input
                  type="text"
                  id="days"
                  name="days"
                  value={formData.days}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Mon, Wed, Fri"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Add Batch
              </button>
            </form>
          </div>
        </div>

        {/* Current Batches */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Current Batches</h2>

          <div className="space-y-4">
            {batches.map((batch) => (
              <div key={batch.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-800">{batch.name}</h3>
                  <p className="text-sm text-gray-600">
                    {batch.days} at {batch.time}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(batch.id)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(batch.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    
  )
}
