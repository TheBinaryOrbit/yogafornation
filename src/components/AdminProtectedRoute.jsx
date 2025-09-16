import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../contexts/AdminAuthContext'

export default function AdminProtectedRoute({ children, requiredPermission = null }) {
  const { isAuthenticated, hasPermission, loading } = useAdminAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated()) {
        console.log('Admin not authenticated, redirecting to admin login')
        navigate('/admin/login')
        return
      }

      if (requiredPermission && !hasPermission(requiredPermission)) {
        console.log(`Admin lacks required permission: ${requiredPermission}`)
        navigate('/admin/dashboard') // Redirect to dashboard if lacking permission
        return
      }
    }
  }, [isAuthenticated, hasPermission, loading, navigate, requiredPermission])

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  // Show nothing while redirecting
  if (!isAuthenticated() || (requiredPermission && !hasPermission(requiredPermission))) {
    return null
  }

  return children
}