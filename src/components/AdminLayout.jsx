"use client"

import { useState } from "react"
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { BarChart3, Users, DollarSign, Video, Clock, FileText, HelpCircle, Menu, X, LogOut } from "lucide-react"
import { useAdminAuth } from '../contexts/AdminAuthContext'
import { toast } from "react-toastify"

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { admin, logout, hasPermission } = useAdminAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success("Logged out successfully")
    navigate("/admin/login")
  }

  const menuItems = [
    { id: "analytics", label: "Analytics", icon: BarChart3, href: "/admin/dashboard", permission: null },
    { id: "users", label: "User Management", icon: Users, href: "/admin/users", permission: "manage_users" },
    { id: "financials", label: "Financials", icon: DollarSign, href: "/admin/financials", permission: "view_analytics" },
    { id: "classes", label: "Live Classes", icon: Video, href: "/admin/classes", permission: "manage_classes" },
    { id: "batches", label: "Instructions", icon: Clock, href: "/admin/batches", permission: "manage_classes" },
    { id: "resources", label: "Resources", icon: FileText, href: "/admin/resources", permission: "manage_resources" },
    { id: "faqs", label: "FAQs", icon: HelpCircle, href: "/admin/faqs", permission: "manage_resources" },
    { id: "video", label: "Video Resources", icon: HelpCircle, href: "/admin/video", permission: "manage_resources" },
  ]

  // Filter menu items based on permissions
  const filteredMenuItems = menuItems.filter(item => 
    !item.permission || hasPermission(item.permission)
  )

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-800 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 bg-slate-900">
          <h1 className="text-white text-xl font-bold">Yoga Admin</h1>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white hover:text-gray-300">
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-8">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.id}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center px-6 py-3 text-gray-300 hover:bg-slate-700 hover:text-white transition-colors ${
                    isActive ? "bg-slate-700 text-white border-r-2 border-blue-500" : ""
                  }`
                }
                onClick={() => setSidebarOpen(false)} // close on mobile
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </NavLink>
            )
          })}
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-6 py-3 text-gray-300 hover:bg-red-600 hover:text-white transition-colors mt-8"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-600 hover:text-gray-900">
            <Menu className="h-6 w-6" />
          </button>

          <div className="w-full flex items-center justify-between space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-700">Welcome back,</p>
              <p className="font-semibold text-gray-900">{admin?.name || 'Admin'}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center cursor-pointer gap-2 text-sm text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>

  {/* Page Content */}
  <div className="p-6"><Outlet /></div>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
