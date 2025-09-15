"use client"


import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"


export default function AdminDashboard() {
  // Sample data for charts
  const attendanceData = [
    { day: "Mon", attendance: 30 },
    { day: "Tue", attendance: 45 },
    { day: "Wed", attendance: 60 },
    { day: "Thu", attendance: 50 },
    { day: "Fri", attendance: 70 },
    { day: "Sat", attendance: 85 },
    { day: "Sun", attendance: 75 },
  ]

  const userStatusData = [
    { name: "Active", value: 400, color: "#6366f1" },
    { name: "Inactive", value: 100, color: "#e5e7eb" },
  ]

  const topClasses = ["Morning Vinyasa Flow", "Advanced Power Yoga", "Evening Restorative Yoga"]

  const topDietPlans = ["7-Day Detox Plan", "High-Protein Yogi Diet"]

  return (
    
      <div className="space-y-6">
        {/* Daily Attendance Trends */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Daily Attendance Trends</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Bar dataKey="attendance" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active vs Inactive Users */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Active vs. Inactive Users</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={userStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value">
                    {userStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center text-2xl font-bold text-gray-800">400</div>
          </div>

          {/* Most Popular */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Most Popular</h2>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Top Classes</h3>
              <ul className="space-y-2">
                {topClasses.map((className, index) => (
                  <li key={index} className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                    {className}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Top Diet Plans</h3>
              <ul className="space-y-2">
                {topDietPlans.map((plan, index) => (
                  <li key={index} className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                    {plan}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    
  )
}
