"use client"

import { useState, useEffect } from "react"
import { DollarSign, Download, Check, X, Eye, ChevronLeft, ChevronRight, TrendingUp, Clock } from "lucide-react"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useAdminAuth } from "../contexts/AdminAuthContext"

export default function FinancialsPage() {
  const { getToken } = useAdminAuth()
  const [loading, setLoading] = useState(false)
  const [totalDonation, setTotalDonation] = useState(0);
  const [totalApproved, setTotalApproved] = useState(0);

  // Core state
  const [donations, setDonations] = useState([])
  const [donationStats, setDonationStats] = useState({})
  const [pagination, setPagination] = useState({})

  // Modal states
  const [selectedDonation, setSelectedDonation] = useState(null)
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [showRejectionModal, setShowRejectionModal] = useState(false)
  const [showScreenshotModal, setShowScreenshotModal] = useState(false)


  useEffect(() => {
    let total = 0;
    let approved = 0;
    donations.map((donation) => {
      if (donation.status === "approved") {
        approved++;
        total = total + parseInt(donation.amount);
      }
    })
    setTotalDonation(total);
    setTotalApproved(approved);
  }, [donations])

  // Form states
  const [rejectionReason, setRejectionReason] = useState("")

  // Simplified filters
  const [filters, setFilters] = useState({
    status: "",
    page: 1,
    limit: 20
  })

  // Fetch donations
  const fetchDonations = async () => {
    try {
      setLoading(true)
      const token = getToken()

      if (!token) {
        toast.error("Authentication required")
        return
      }

      const params = new URLSearchParams()
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key])
        }
      })

      const response = await axios.get(
        `http://localhost/yogabackend/api/admin/donations?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      )

      if (response.data.success) {
        setDonations(response.data.donations || [])
        setPagination(response.data.pagination || {})
        setDonationStats(response.data.stats || {})
      } else {
        toast.error(response.data.message || "Failed to fetch donations")
      }

    } catch (error) {
      console.error("Error fetching donations:", error)
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.")
      } else {
        toast.error("Failed to fetch donations. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  // Approve donation
  const handleApproveDonation = async (donationId) => {
    try {
      const token = getToken()

      if (!token) {
        toast.error("Authentication required")
        return
      }

      console.log("✅ Approving donation:", donationId)

      const response = await axios.put(
        `http://localhost/yogabackend/api/admin/donations/${donationId}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      )

      console.log("✅ Approval response:", response.data)

      if (response.data.success) {
        toast.success(response.data.message || "Donation approved successfully")
        
        // Show karma points awarded info
        if (response.data.donation_details) {
          const details = response.data.donation_details
          toast.info(
            `₹${details.amount} approved. ${details.karma_points_awarded} karma points awarded to ${details.user_name}. New total: ${details.new_karma_total}`,
            { autoClose: 5000 }
          )
        }

        // Refresh all data
        await fetchDonations()
        
      } else {
        toast.error(response.data.message || "Failed to approve donation")
      }

    } catch (error) {
      console.error("❌ Error approving donation:", error)
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.")
      } else if (error.response?.status === 404) {
        toast.error("Donation not found.")
      } else {
        toast.error("Failed to approve donation. Please try again.")
      }
    }
  }

  // Reject donation
  const handleRejectDonation = async (donationId, reason) => {
    try {
      const token = getToken()

      if (!token) {
        toast.error("Authentication required")
        return
      }

      console.log("🚫 Rejecting donation:", donationId, "Reason:", reason)

      const response = await axios.put(
        `http://localhost/yogabackend/api/admin/donations/${donationId}/reject`,
        {
          rejection_reason: reason
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      )

      console.log("✅ Rejection response:", response.data)

      if (response.data.success) {
        toast.success(response.data.message || "Donation rejected successfully")
        
        // Show rejection details if available
        if (response.data.donation_details) {
          const details = response.data.donation_details
          toast.info(
            `₹${details.amount} from ${details.user_name} rejected. User has been notified.`,
            { autoClose: 5000 }
          )
        }

        // Refresh all data
        await fetchDonations()
        
      } else {
        toast.error(response.data.message || "Failed to reject donation")
      }

    } catch (error) {
      console.error("❌ Error rejecting donation:", error)
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.")
      } else if (error.response?.status === 404) {
        toast.error("Donation not found.")
      } else {
        toast.error("Failed to reject donation. Please try again.")
      }
    }
  }

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value
    }))
  }

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.total_pages) {
      handleFilterChange('page', newPage)
    }
  }

  // Modal handlers
  const openApprovalModal = (donation) => {
    setSelectedDonation(donation)
    setShowApprovalModal(true)
  }

  const openRejectionModal = (donation) => {
    setSelectedDonation(donation)
    setRejectionReason("")
    setShowRejectionModal(true)
  }

  const openScreenshotModal = (donation) => {
    setSelectedDonation(donation)
    setShowScreenshotModal(true)
  }

  const closeModals = () => {
    setSelectedDonation(null)
    setShowApprovalModal(false)
    setShowRejectionModal(false)
    setShowScreenshotModal(false)
    setRejectionReason("")
  }

  // Status color helper
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'text-green-800 bg-green-100'
      case 'rejected':
        return 'text-red-800 bg-red-100'
      case 'pending':
        return 'text-yellow-800 bg-yellow-100'
      default:
        return 'text-gray-800 bg-gray-100'
    }
  }




  // Generate simple report
  const generateReport = () => {
    const reportData = {
      generated_at: new Date().toISOString(),
      total_donations: pagination.total_donations || 0,
      donations: donations
    }

    const dataStr = JSON.stringify(reportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `donations-report-${new Date().toISOString().split("T")[0]}.json`
    link.click()
    URL.revokeObjectURL(url)

    toast.success("Report downloaded successfully")
  }

  // Fetch data on component mount and filter changes
  useEffect(() => {
    fetchDonations()
  }, [filters])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Donations</h1>
        <div className="flex items-center gap-4">
          {/* Status Filter */}
          {/* <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select> */}

          <button
            onClick={generateReport}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {/* Total Amount Card */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹ {totalDonation}
              </p>
            </div>
          </div>
        </div>

        {/* Total Donations Card */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Approved</p>
              <p className="text-2xl font-bold text-gray-900">{totalApproved}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Statistics Row */}
      {donationStats.total_donations > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Success Rate */}
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {donationStats.total_donations > 0
                  ? `${((donationStats.approved_count / donationStats.total_donations) * 100).toFixed(1)}%`
                  : '0%'
                }
              </div>
              <p className="text-sm text-gray-600">Approval Rate</p>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-center">
              <div className="flex justify-center space-x-4 mb-2">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{donationStats.razorpay_count || 0}</div>
                  <div className="text-xs text-gray-500">Razorpay</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600">{donationStats.qr_count || 0}</div>
                  <div className="text-xs text-gray-500">QR Code</div>
                </div>
              </div>
              <p className="text-sm text-gray-600">Payment Split</p>
            </div>
          </div>

          {/* Processing Status */}
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {donationStats.total_donations > 0
                  ? `${(((donationStats.approved_count + donationStats.rejected_count) / donationStats.total_donations) * 100).toFixed(1)}%`
                  : '0%'
                }
              </div>
              <p className="text-sm text-gray-600">Processed</p>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Analytics */}
      {donationStats.total_donations > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Categories */}
          {donationStats.top_categories && Object.keys(donationStats.top_categories).length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow border">
              <h3 className="text-lg font-semibold mb-4">Top Donation Categories</h3>
              <div className="space-y-3">
                {Object.entries(donationStats.top_categories)
                  .sort(([, a], [, b]) => b - a)
                  .map(([category, count], index) => {
                    const percentage = donationStats.total_donations > 0
                      ? ((count / donationStats.total_donations) * 100).toFixed(1)
                      : 0
                    return (
                      <div key={category} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-3 ${index === 0 ? 'bg-blue-500' :
                            index === 1 ? 'bg-green-500' :
                              index === 2 ? 'bg-yellow-500' : 'bg-gray-400'
                            }`}></div>
                          <span className="text-sm font-medium text-gray-700">{category}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-gray-900">{count} donations</div>
                          <div className="text-xs text-gray-500">{percentage}%</div>
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          )}

          {/* Monthly Trend */}
          {donationStats.monthly_trend && Object.keys(donationStats.monthly_trend).length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow border">
              <h3 className="text-lg font-semibold mb-4">Monthly Revenue Trend</h3>
              <div className="space-y-4">
                {Object.entries(donationStats.monthly_trend)
                  .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
                  .slice(0, 6)
                  .map(([month, amount]) => {
                    const formattedAmount = parseFloat(amount).toLocaleString('en-IN')
                    const maxAmount = Math.max(...Object.values(donationStats.monthly_trend).map(val => parseFloat(val)))
                    const percentage = maxAmount > 0 ? (parseFloat(amount) / maxAmount) * 100 : 0

                    return (
                      <div key={month} className="flex items-center justify-between">
                        <div className="flex items-center gap-4 w-20">
                          <span className="text-sm font-medium text-gray-700">
                            {new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
                          </span>
                        </div>
                        <div className="flex-1 mx-4">
                          <div className="w-full bg-gray-200 rounded-full h-4">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-green-500 h-4 rounded-full flex items-center justify-center"
                              style={{ width: `${Math.max(percentage, 5)}%` }}
                            >
                              {percentage > 20 && (
                                <span className="text-xs text-white font-medium">₹{formattedAmount}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="w-24 text-right">
                          <span className="text-sm font-semibold text-gray-900">₹{formattedAmount}</span>
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick Summary Stats */}
      {donationStats.total_donations > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Quick Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                ₹{donationStats.average_donation ? parseFloat(donationStats.average_donation).toLocaleString('en-IN') : '0'}
              </div>
              <div className="text-sm text-gray-600">Avg Donation</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {donationStats.total_donations && donationStats.approved_count
                  ? Math.round(donationStats.approved_count / donationStats.total_donations * 100)
                  : 0
                }%
              </div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {donationStats.razorpay_count && donationStats.total_donations
                  ? Math.round(donationStats.razorpay_count / donationStats.total_donations * 100)
                  : 0
                }%
              </div>
              <div className="text-sm text-gray-600">Razorpay</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {donationStats.pending_count || 0}
              </div>
              <div className="text-sm text-gray-600">Need Review</div>
            </div>
          </div>
        </div>
      )}

      {/* Donations Table */}
      <div className="bg-white rounded-lg shadow-md border overflow-hidden">
        {loading ? (
          <div className="px-6 py-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading donations...</p>
          </div>
        ) : donations.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No donations found</p>
          </div>
        ) : <>
          <div className="overflow-x-auto border rounded-lg shadow-sm">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="bg-gray-100 text-xs font-semibold text-gray-600 uppercase sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {donations.map((donation) => (
                  <tr key={donation.id} className="hover:bg-gray-50 transition">
                    {/* User */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{donation.user_name}</div>
                      <div className="text-gray-500 text-xs">{donation.user?.email}</div>
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-green-600 font-semibold text-base">
                        ₹{donation.amount}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          donation.status
                        )}`}
                      >
                        {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {new Date(donation.created_at).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex justify-center gap-2">
                        {donation.status === "pending" && (
                          <>
                            <button
                              onClick={() => openApprovalModal(donation)}
                              className="flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium 
                                 bg-green-100 text-green-700 hover:bg-green-200 transition"
                            >
                              <Check className="h-4 w-4" />
                              Approve
                            </button>
                            <button
                              onClick={() => openRejectionModal(donation)}
                              className="flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium 
                                 bg-red-100 text-red-700 hover:bg-red-200 transition"
                            >
                              <X className="h-4 w-4" />
                              Reject
                            </button>
                          </>
                        )}

                        {donation.payment_method === "qr" && donation.screenshot_path && (
                          <button
                            onClick={() => openScreenshotModal(donation)}
                            className="flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium 
                               bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.total_pages > 1 && (
            <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between text-sm">
              <div className="text-gray-600">
                Page <span className="font-semibold">{pagination.current_page}</span> of{" "}
                <span className="font-semibold">{pagination.total_pages}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.current_page - 1)}
                  disabled={pagination.current_page <= 1}
                  className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 
                     hover:bg-gray-100 disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <span className="px-3 py-1 rounded-md bg-gray-200 font-medium">
                  {pagination.current_page}
                </span>

                <button
                  onClick={() => handlePageChange(pagination.current_page + 1)}
                  disabled={pagination.current_page >= pagination.total_pages}
                  className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 
                     hover:bg-gray-100 disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
        }
      </div>

      {/* Approval Modal */}
      {showApprovalModal && selectedDonation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Approve Donation</h3>
              <button onClick={closeModals} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Approve donation of <span className="font-medium text-green-600">₹{selectedDonation.amount}</span> from <span className="font-medium">{selectedDonation.user_name}</span>?
                </p>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    handleApproveDonation(selectedDonation.id)
                    closeModals()
                  }}
                  className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  Approve
                </button>
                <button
                  onClick={closeModals}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectionModal && selectedDonation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Reject Donation</h3>
              <button onClick={closeModals} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Reject donation of <span className="font-medium text-green-600">₹{selectedDonation.amount}</span> from <span className="font-medium">{selectedDonation.user_name}</span>?
                </p>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reason for rejection</label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Please provide a reason for rejection..."
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    console.log("🔴 Reject button clicked")
                    console.log("Rejection reason:", rejectionReason)
                    console.log("Selected donation:", selectedDonation)
                    
                    if (rejectionReason.trim()) {
                      handleRejectDonation(selectedDonation.id, rejectionReason)
                      closeModals()
                    } else {
                      toast.error("Please provide a rejection reason")
                    }
                  }}
                  className="flex-1 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!rejectionReason.trim()}
                >
                  <X className="h-4 w-4" />
                  Reject
                </button>
                <button
                  onClick={closeModals}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Screenshot Modal */}
      {showScreenshotModal && selectedDonation && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full h-1/2 overflow-y-auto my-10">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Payment Screenshot</h3>
              <button onClick={closeModals} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <span className="font-medium text-gray-600">User:</span>
                    <p className="text-gray-900">{selectedDonation.user_name}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Amount:</span>
                    <p className="text-green-600 font-medium">₹{selectedDonation.amount}</p>
                  </div>
                </div>

                <div className="text-center">
                  {selectedDonation.screenshot_path ? (
                    <img
                      src={`http://localhost/yogabackend/${selectedDonation.screenshot_path}`}
                      alt="Payment Screenshot"
                      className="max-w-full max-h-48 object-contain rounded-lg border shadow-sm"
                    />
                  ) : (
                    <div className="text-gray-500 py-8">
                      <p>No screenshot available</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    openApprovalModal(selectedDonation)
                    setShowScreenshotModal(false)
                  }}
                  className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  Approve
                </button>
                <button
                  onClick={() => {
                    openRejectionModal(selectedDonation)
                    setShowScreenshotModal(false)
                  }}
                  className="flex-1 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 flex items-center justify-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Reject
                </button>
              </div>
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
  )
}