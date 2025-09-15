"use client"

import { Edit, Phone, Trash2 } from "lucide-react"

export default function UserManagement() {
  // Sample user data
  const users = [
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@example.com",
      membership: "Premium",
      status: "Active",
    },
    {
      id: 2,
      name: "Bob Williams",
      email: "bob@example.com",
      membership: "Basic",
      status: "Active",
    },
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie@example.com",
      membership: "None",
      status: "Blocked",
    },
  ]

  const handleEdit = (userId) => {
    console.log("Edit user:", userId)
  }

  const handleCall = (userId) => {
    console.log("Call user:", userId)
  }

  const handleDelete = (userId) => {
    console.log("Delete user:", userId)
  }

  const getStatusColor = (status) => {
    return status === "Active" ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"
  }

  return (
    
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 bg-slate-900">
          <h1 className="text-2xl font-semibold text-white">User Management</h1>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Membership
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.membership}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(user.id)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit User"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleCall(user.id)}
                        className="text-green-600 hover:text-green-900"
                        title="Call User"
                      >
                        <Phone className="h-4 w-4" />
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
      </div>
    
  )
}
