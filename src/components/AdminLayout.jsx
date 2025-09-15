"use client"

import { useState } from "react"
import { Outlet, NavLink } from 'react-router-dom'
import { BarChart3, Users, DollarSign, Video, Clock, FileText, HelpCircle, Menu, X } from "lucide-react"

export default function AdminLayout() {
//    const [activeSection, setActiveSection] = useState("analytics")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const menuItems = [
    { id: "analytics", label: "Analytics", icon: BarChart3, href: "/admin/dashboard" },
    { id: "users", label: "User Management", icon: Users, href: "/admin/users" },
    { id: "financials", label: "Financials", icon: DollarSign, href: "/admin/financials" },
    { id: "classes", label: "Live Classes", icon: Video, href: "/admin/classes" },
    { id: "batches", label: "Batch Timings", icon: Clock, href: "/admin/batches" },
    { id: "resources", label: "Resources", icon: FileText, href: "/admin/resources" },
    { id: "faqs", label: "FAQs", icon: HelpCircle, href: "/admin/faqs" },
  ]

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
          {menuItems.map((item) => {
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
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-600 hover:text-gray-900">
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, Admin</span>
            <button className="text-sm text-blue-600 hover:text-blue-800">Logout</button>
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
