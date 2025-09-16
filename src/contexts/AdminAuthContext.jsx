import { createContext, useContext, useState, useEffect } from 'react'

const AdminAuthContext = createContext({})

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)
  const [permissions, setPermissions] = useState([])

  useEffect(() => {
    // Check if admin is logged in on component mount
    const adminToken = localStorage.getItem('adminToken')
    const adminUser = localStorage.getItem('adminUser')
    const adminPermissions = localStorage.getItem('adminPermissions')

    if (adminToken && adminUser) {
      try {
        setAdmin(JSON.parse(adminUser))
        setPermissions(JSON.parse(adminPermissions || '[]'))
      } catch (error) {
        console.error('Error parsing admin data:', error)
        logout()
      }
    }
    setLoading(false)
  }, [])

  const login = (adminData, token, userPermissions) => {
    localStorage.setItem('adminToken', token)
    localStorage.setItem('adminUser', JSON.stringify(adminData))
    localStorage.setItem('adminPermissions', JSON.stringify(userPermissions))
    setAdmin(adminData)
    setPermissions(userPermissions)
  }

  const logout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    localStorage.removeItem('adminPermissions')
    setAdmin(null)
    setPermissions([])
  }

  const hasPermission = (permission) => {
    return permissions.includes(permission)
  }

  const isAuthenticated = () => {
    return !!admin && !!localStorage.getItem('adminToken')
  }

  const getToken = () => {
    return localStorage.getItem('adminToken')
  }

  const value = {
    admin,
    permissions,
    loading,
    login,
    logout,
    hasPermission,
    isAuthenticated,
    getToken
  }

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  )
}