"use client"

import { useState, useEffect } from "react"
import { Edit, Phone, Trash2, Eye, Search, Filter, ChevronLeft, ChevronRight, Users, Crown, Award, Calendar, X } from "lucide-react"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useAdminAuth } from "../contexts/AdminAuthContext"

export default function UserManagement() {
  const { getToken } = useAdminAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [statistics, setStatistics] = useState({})
  const [pagination, setPagination] = useState({})
  const [selectedUser, setSelectedUser] = useState(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  
  // Filter states
  const [filters, setFilters] = useState({
    search: "",
    gender: "",
    page: 1,
    limit: 20,
    order_by: "karma_points",
    order_dir: "DESC"
  })

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true)
      const token = getToken()
      
      if (!token) {
        toast.error("Authentication required")
        return
      }

      // Build query parameters
      const params = new URLSearchParams()
      if (filters.search) params.append('search', filters.search)
      if (filters.gender) params.append('gender', filters.gender)
      params.append('page', filters.page.toString())
      params.append('limit', filters.limit.toString())
      params.append('order_by', filters.order_by)
      params.append('order_dir', filters.order_dir)

      console.log("🔍 Fetching users with filters:", filters)

      const response = await axios.get(
        `https://api.yogafornation.com/api/admin/users?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      )

      console.log("✅ Users response:", response.data)

      if (response.data.success) {
        setUsers(response.data.users || [])
        setStatistics(response.data.statistics || {})
        setPagination(response.data.pagination || {})
      } else {
        toast.error(response.data.message || "Failed to fetch users")
      }

    } catch (error) {
      console.error("❌ Error fetching users:", error)
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.")
      } else {
        toast.error("Failed to fetch users. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  // Fetch users on component mount and when filters change
  useEffect(() => {
    fetchUsers()
  }, [filters.page, filters.limit, filters.order_by, filters.order_dir])

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (filters.page !== 1) {
        setFilters(prev => ({ ...prev, page: 1 }))
      } else {
        fetchUsers()
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [filters.search, filters.gender])

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value // Reset to page 1 when changing filters
    }))
  }

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.total_pages) {
      handleFilterChange('page', newPage)
    }
  }

  // Handle sorting
  const handleSort = (column) => {
    const newDir = filters.order_by === column && filters.order_dir === 'ASC' ? 'DESC' : 'ASC'
    setFilters(prev => ({
      ...prev,
      order_by: column,
      order_dir: newDir,
      page: 1
    }))
  }

  // View user details
  const handleViewUser = (user) => {
    setSelectedUser(user)
    setShowUserModal(true)
  }

  // Close modal
  const closeModal = () => {
    setShowUserModal(false)
    setSelectedUser(null)
  }

  

  const handleCall = (userId) => {
    console.log("Call user:", userId)
    toast.info(`Call functionality for user ${userId} coming soon!`)
  }

  const handleDelete = async (userId) => {
    // Show confirmation dialog
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this user? This action cannot be undone and will remove all associated data including donations, attendances, and ratings."
    )
    
    if (!isConfirmed) {
      return
    }

    try {
      const token = getToken()
      
      if (!token) {
        toast.error("Authentication required")
        return
      }

      console.log("🗑️ Deleting user:", userId)

      const response = await axios.delete(
        `https://api.yogafornation.com/api/admin/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      )

      console.log("✅ Delete response:", response.data)

      if (response.data.success) {
        toast.success(response.data.message || "User deleted successfully")
        
        // Show cleanup summary if available
        if (response.data.cleanup_summary) {
          const summary = response.data.cleanup_summary
          let summaryMessage = "Cleanup completed:"
          if (summary.donations_deleted) summaryMessage += ` ${summary.donations_deleted} donations,`
          if (summary.attendances_deleted) summaryMessage += ` ${summary.attendances_deleted} attendances,`
          if (summary.ratings_deleted) summaryMessage += ` ${summary.ratings_deleted} ratings,`
          if (summary.referrals_updated) summaryMessage += ` ${summary.referrals_updated} referrals updated`
          
          // Remove trailing comma and show summary
          summaryMessage = summaryMessage.replace(/,$/, '')
          toast.info(summaryMessage, { autoClose: 5000 })
        }

        // Close modal if the deleted user was being viewed
        if (selectedUser && selectedUser.id === userId) {
          closeModal()
        }

        // Refresh the users list
        await fetchUsers()
        
      } else {
        toast.error(response.data.message || "Failed to delete user")
      }

    } catch (error) {
      console.error("❌ Error deleting user:", error)
      
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.")
      } else if (error.response?.status === 403) {
        toast.error("You don't have permission to delete users.")
      } else if (error.response?.status === 404) {
        toast.error("User not found.")
      } else {
        toast.error("Failed to delete user. Please try again.")
      }
    }
  }

  const getStatusColor = (isAdmin) => {
    return isAdmin ? "text-purple-600 bg-purple-100" : "text-green-600 bg-green-100"
  }

  const getTitleColor = (title) => {
    const colors = {
      'Sadhak': 'text-blue-600 bg-blue-100',
      'Yogi': 'text-green-600 bg-green-100',
      'Guru': 'text-purple-600 bg-purple-100',
      'Master': 'text-orange-600 bg-orange-100'
    }
    return colors[title] || 'text-gray-600 bg-gray-100'
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900">{statistics.total_users || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Crown className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Admin Users</p>
              <p className="text-2xl font-semibold text-gray-900">{statistics.admin_users || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Award className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Karma</p>
              <p className="text-2xl font-semibold text-gray-900">{Math.round(statistics.avg_karma_points) || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Male / Female</p>
              <p className="text-2xl font-semibold text-gray-900">{statistics.male_users || 0} / {statistics.female_users || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-slate-900">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-semibold text-white">User Management</h1>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              {/* <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </button> */}
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    placeholder="Name, email, phone..."
                    className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                  value={filters.gender}
                  onChange={(e) => handleFilterChange('gender', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Genders</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  value={filters.order_by}
                  onChange={(e) => handleFilterChange('order_by', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="karma_points">Karma Points</option>
                  <option value="name">Name</option>
                  <option value="created_at">Join Date</option>
                  <option value="current_streak">Streak</option>
                </select>
              </div>

              {/* Sort Direction */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                <select
                  value={filters.order_dir}
                  onChange={(e) => handleFilterChange('order_dir', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="DESC">Descending</option>
                  <option value="ASC">Ascending</option>
                </select>
              </div>

              {/* Per Page */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Per Page</label>
                <select
                  value={filters.limit}
                  onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="px-6 py-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No users found</p>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('name')}
                    >
                      Name {filters.order_by === 'name' && (filters.order_dir === 'ASC' ? '↑' : '↓')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Profile
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('karma_points')}
                    >
                      Karma {filters.order_by === 'karma_points' && (filters.order_dir === 'ASC' ? '↑' : '↓')}
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('current_streak')}
                    >
                      Streak {filters.order_by === 'current_streak' && (filters.order_dir === 'ASC' ? '↑' : '↓')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-600 font-medium text-sm">
                                {user.name?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>{user.phonenumber}</div>
                        <div className="text-xs text-gray-400">{user.city}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex flex-col">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTitleColor(user.title)} mb-1`}>
                            {user.title}
                          </span>
                          <span className="text-xs text-gray-400">{user.gender}, {new Date().getFullYear() - user.birtyear}y</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {user.karma_points}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.current_streak} days
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.is_admin)}`}>
                          {user.is_admin ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewUser(user)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete User"
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

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to{' '}
                  {Math.min(pagination.current_page * pagination.per_page, pagination.total_users)} of{' '}
                  {pagination.total_users} users
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.current_page - 1)}
                    disabled={pagination.current_page <= 1}
                    className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  
                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(pagination.total_pages, 5) }, (_, i) => {
                      const page = i + 1
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 rounded-md text-sm font-medium ${
                            pagination.current_page === page
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(pagination.current_page + 1)}
                    disabled={pagination.current_page >= pagination.total_pages}
                    className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">User Details</h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-900 border-b pb-2">Basic Information</h4>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 h-16 w-16">
                      <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-xl">
                          {selectedUser.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h5 className="text-lg font-medium text-gray-900">{selectedUser.name}</h5>
                      <p className="text-sm text-gray-500">{selectedUser.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Phone:</span>
                      <p className="text-gray-900">{selectedUser.phonenumber}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Gender:</span>
                      <p className="text-gray-900">{selectedUser.gender}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">City:</span>
                      <p className="text-gray-900">{selectedUser.city}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Age:</span>
                      <p className="text-gray-900">{new Date().getFullYear() - selectedUser.birtyear} years</p>
                    </div>
                  </div>
                </div>

                {/* Goals & Progress */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-900 border-b pb-2">Goals & Progress</h4>
                  
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Primary Goal:</span>
                      <p className="text-gray-900">{selectedUser.primarygoal}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Current Title:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTitleColor(selectedUser.title)}`}>
                        {selectedUser.title}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Karma Points:</span>
                      <p className="text-gray-900 font-bold text-lg">{selectedUser.karma_points}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Current Streak:</span>
                      <p className="text-gray-900">{selectedUser.current_streak} days</p>
                    </div>
                  </div>
                </div>

                {/* Account Info */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-900 border-b pb-2">Account Information</h4>
                  
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">User ID:</span>
                      <p className="text-gray-900">#{selectedUser.id}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Referral Code:</span>
                      <p className="text-gray-900 font-mono">{selectedUser.uni_referral_code}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Referred By:</span>
                      <p className="text-gray-900">{selectedUser.referred_by_id ? `User #${selectedUser.referred_by_id}` : 'Direct signup'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Account Type:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedUser.is_admin)}`}>
                        {selectedUser.is_admin ? 'Admin' : 'User'}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Joined:</span>
                      <p className="text-gray-900">{new Date(selectedUser.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-900 border-b pb-2">Quick Actions</h4>
                  
                  <div className="flex flex-wrap gap-2">
                    
                    <button
                      onClick={() => handleCall(selectedUser.phonenumber)}
                      className="inline-flex items-center px-3 py-2 border border-green-300 shadow-sm text-sm leading-4 font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      {selectedUser.phonenumber}
                    </button>
                    <button
                      onClick={() => handleDelete(selectedUser.id)}
                      className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete User
                    </button>
                  </div>
                </div>
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
