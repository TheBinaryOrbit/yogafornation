"use client"

import { useState, useEffect } from "react"
import { Plus, Edit2, Trash2, Save, X, HelpCircle, AlertCircle } from "lucide-react"
import axios from 'axios'

export default function AddFAQs() {
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingFaq, setEditingFaq] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [newFaq, setNewFaq] = useState({
    question: "",
    answer: "",
    category: "Getting Started",
    isActive: true,
  })

  const categories = ["Getting Started", "Practice", "Membership", "Classes", "Technical", "Other"]

  // Fetch FAQs from API
  const fetchFaqs = async () => {
    try {
      setLoading(true)
      const response = await axios.get('http://localhost/yogabackend/api/faqs')
      
      if (response.data.success && response.data.faqs) {
        // Map API response to component format
        const mappedFaqs = response.data.faqs.map(faq => ({
          id: faq.id,
          question: faq.question,
          answer: faq.answer,
          category: faq.category || "Other",
          isActive: faq.is_active !== undefined ? faq.is_active : true,
          createdAt: faq.created_at,
          updatedAt: faq.updated_at
        }))
        
        setFaqs(mappedFaqs)
        setError(null)
      } else {
        throw new Error('Invalid response format')
      }
    } catch (err) {
      console.error('Error fetching FAQs:', err)
      setError(err.response?.data?.message || 'Failed to load FAQs. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Load FAQs on component mount
  useEffect(() => {
    fetchFaqs()
  }, [])

  // Get admin token from localStorage
  const getAdminToken = () => {
    return localStorage.getItem('adminToken')
  }

  // Add FAQ via API
  const handleAddFaq = async () => {
    if (!newFaq.question.trim() || !newFaq.answer.trim()) {
      alert('Please fill in both question and answer fields.')
      return
    }

    const adminToken = getAdminToken()
    if (!adminToken) {
      alert('Admin authentication required. Please log in.')
      return
    }

    try {
      setSubmitting(true)
      
      const response = await axios.post('http://localhost/yogabackend/api/admin/faqs', {
        question: newFaq.question.trim(),
        answer: newFaq.answer.trim(),
        category: newFaq.category,
        is_active: newFaq.isActive
      }, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.data.success) {
        // Refresh the FAQ list to get the latest data
        await fetchFaqs()
        
        setNewFaq({ question: "", answer: "", category: "Getting Started", isActive: true })
        setShowAddForm(false)
        setError(null)
      } else {
        throw new Error(response.data.message || 'Failed to add FAQ')
      }
      
    } catch (err) {
      console.error('Error adding FAQ:', err)
      if (err.response?.status === 401) {
        setError('Unauthorized. Please check your admin token.')
      } else {
        setError(err.response?.data?.message || `Failed to add FAQ: ${err.message}`)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditFaq = (faq) => {
    setEditingFaq({ ...faq })
  }

  const handleUpdateFaq = () => {
    setFaqs(faqs.map((faq) => (faq.id === editingFaq.id ? editingFaq : faq)))
    setEditingFaq(null)
  }

  const handleDeleteFaq = async (id) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) {
      return
    }

    const adminToken = getAdminToken()
    if (!adminToken) {
      alert('Admin authentication required. Please log in.')
      return
    }

    try {
      const response = await axios.delete(`http://localhost/yogabackend/api/admin/faqs?id=${id}`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      })

      if (response.data.success) {
        // Remove the FAQ from the local state
        setFaqs(faqs.filter((faq) => faq.id !== id))
        setError(null)
      } else {
        throw new Error(response.data.message || 'Failed to delete FAQ')
      }
    } catch (err) {
      console.error('Error deleting FAQ:', err)
      if (err.response?.status === 401) {
        setError('Unauthorized. Please check your admin token.')
      } else if (err.response?.status === 404) {
        setError('FAQ not found. It may have already been deleted.')
        // Refresh the list to get current state
        fetchFaqs()
      } else {
        setError(err.response?.data?.message || `Failed to delete FAQ: ${err.message}`)
      }
    }
  }

  const toggleFaqStatus = (id) => {
    setFaqs(faqs.map((faq) => (faq.id === id ? { ...faq, isActive: !faq.isActive } : faq)))
  }

  const handleRetry = () => {
    fetchFaqs()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading FAQs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Manage FAQs</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add New FAQ
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

      {/* Add FAQ Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Add New FAQ</h2>
            <button onClick={() => setShowAddForm(false)} className="text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={newFaq.category}
                onChange={(e) => setNewFaq({ ...newFaq, category: e.target.value })}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Question *</label>
              <input
                type="text"
                value={newFaq.question}
                onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter the FAQ question..."
                disabled={submitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Answer *</label>
              <textarea
                value={newFaq.answer}
                onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter the FAQ answer..."
                disabled={submitting}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="newFaqActive"
                checked={newFaq.isActive}
                onChange={(e) => setNewFaq({ ...newFaq, isActive: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={submitting}
              />
              <label htmlFor="newFaqActive" className="ml-2 text-sm text-gray-700">
                Active (visible on website)
              </label>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddFaq}
                disabled={submitting}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4" />
                {submitting ? 'Adding...' : 'Add FAQ'}
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

      {/* FAQs List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Current FAQs ({faqs.length})</h2>
            <button
              onClick={fetchFaqs}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Refresh
            </button>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.id} className="border border-gray-200 rounded-lg p-4">
                {editingFaq && editingFaq.id === faq.id ? (
                  // Edit Form
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        value={editingFaq.category}
                        onChange={(e) => setEditingFaq({ ...editingFaq, category: e.target.value })}
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                      <input
                        type="text"
                        value={editingFaq.question}
                        onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
                      <textarea
                        value={editingFaq.answer}
                        onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                        rows={3}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`editFaqActive-${faq.id}`}
                        checked={editingFaq.isActive}
                        onChange={(e) => setEditingFaq({ ...editingFaq, isActive: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`editFaqActive-${faq.id}`} className="ml-2 text-sm text-gray-700">
                        Active (visible on website)
                      </label>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handleUpdateFaq}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                      >
                        <Save className="h-4 w-4" />
                        Save Changes
                      </button>
                      <button
                        onClick={() => setEditingFaq(null)}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // Display Mode
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {faq.category}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            faq.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {faq.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        
                        <button onClick={() => handleDeleteFaq(faq.id)} className="text-red-600 hover:text-red-800">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <h3 className="font-medium text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-gray-600 text-sm">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}

            {faqs.length === 0 && !loading && (
              <div className="text-center py-8 text-gray-500">
                <HelpCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No FAQs found. Click "Add New FAQ" to get started.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}