"use client"

import { useState } from "react"
import { Plus, Edit2, Trash2, Save, X, HelpCircle } from "lucide-react"

export default function AddFAQs() {
  const [faqs, setFaqs] = useState([
    {
      id: 1,
      question: "What should I bring to my first yoga class?",
      answer:
        "Bring a yoga mat, water bottle, and wear comfortable clothing that allows for movement. We provide props like blocks and straps.",
      category: "Getting Started",
      isActive: true,
    },
    {
      id: 2,
      question: "How often should I practice yoga?",
      answer:
        "For beginners, 2-3 times per week is ideal. As you progress, you can increase to daily practice if desired.",
      category: "Practice",
      isActive: true,
    },
    {
      id: 3,
      question: "Can I join if I'm a complete beginner?",
      answer: "We welcome practitioners of all levels. Our instructors provide modifications for every pose.",
      category: "Getting Started",
      isActive: true,
    },
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [editingFaq, setEditingFaq] = useState(null)
  const [newFaq, setNewFaq] = useState({
    question: "",
    answer: "",
    category: "Getting Started",
    isActive: true,
  })

  const categories = ["Getting Started", "Practice", "Membership", "Classes", "Technical", "Other"]

  const handleAddFaq = () => {
    if (newFaq.question.trim() && newFaq.answer.trim()) {
      const faq = {
        id: Date.now(),
        ...newFaq,
      }
      setFaqs([...faqs, faq])
      setNewFaq({ question: "", answer: "", category: "Getting Started", isActive: true })
      setShowAddForm(false)
    }
  }

  const handleEditFaq = (faq) => {
    setEditingFaq({ ...faq })
  }

  const handleUpdateFaq = () => {
    setFaqs(faqs.map((faq) => (faq.id === editingFaq.id ? editingFaq : faq)))
    setEditingFaq(null)
  }

  const handleDeleteFaq = (id) => {
    if (confirm("Are you sure you want to delete this FAQ?")) {
      setFaqs(faqs.filter((faq) => faq.id !== id))
    }
  }

  const toggleFaqStatus = (id) => {
    setFaqs(faqs.map((faq) => (faq.id === id ? { ...faq, isActive: !faq.isActive } : faq)))
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
                  value={newFaq.question}
                  onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter the FAQ question..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
                <textarea
                  value={newFaq.answer}
                  onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter the FAQ answer..."
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="newFaqActive"
                  checked={newFaq.isActive}
                  onChange={(e) => setNewFaq({ ...newFaq, isActive: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="newFaqActive" className="ml-2 text-sm text-gray-700">
                  Active (visible on website)
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddFaq}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Add FAQ
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
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
            <h2 className="text-lg font-semibold mb-4">Current FAQs ({faqs.length})</h2>

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
                          <button
                            onClick={() => toggleFaqStatus(faq.id)}
                            className={`text-xs px-3 py-1 rounded ${
                              faq.isActive
                                ? "bg-red-100 text-red-700 hover:bg-red-200"
                                : "bg-green-100 text-green-700 hover:bg-green-200"
                            }`}
                          >
                            {faq.isActive ? "Deactivate" : "Activate"}
                          </button>
                          <button onClick={() => handleEditFaq(faq)} className="text-blue-600 hover:text-blue-800">
                            <Edit2 className="h-4 w-4" />
                          </button>
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

              {faqs.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <HelpCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No FAQs added yet. Click "Add New FAQ" to get started.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    
  )
}
