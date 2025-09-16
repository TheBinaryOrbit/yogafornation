import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import NotFound from './pages/NotFound'
import Dashboard from './pages/Dashboard'
import Resources from './pages/Resources'
import Donations from './pages/Donations'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminLayout from './components/AdminLayout'
import UserManagement from './pages/UserManagement'
import ResourceManagement from './pages/ResourceManagement'
import BatchTimings from './pages/BatchTimings'
import FinancialsPage from './pages/FinancialsPage'
import LiveClassesPage from './pages/LiveClassesPage'
import AddFAQs from './pages/AddFaqs'
import Login from './pages/Login'
import Register from './pages/Register'
import ProfileEdit from './pages/ProfileEdit'
import { DashboardProvider } from './contexts/DashboardContext'
import { AdminAuthProvider } from './contexts/AdminAuthContext'
import AdminProtectedRoute from './components/AdminProtectedRoute'
import AddVideoResources from './pages/VideoResources'
function App() {
  return (
    <AdminAuthProvider>
      <Routes>
        
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path='/dashboard' element={
          <DashboardProvider>
            <Dashboard />
          </DashboardProvider>
        } />
        <Route path='/profile-edit' element={
          <DashboardProvider>
            <ProfileEdit />
          </DashboardProvider>
        } />
        <Route path='/donations' element={<Donations />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/admin/login" element={<AdminLogin />} />


        <Route path="/admin" element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={
            <AdminProtectedRoute requiredPermission="manage_users">
              <UserManagement />
            </AdminProtectedRoute>
          } />
          <Route path="resources" element={
            <AdminProtectedRoute requiredPermission="manage_resources">
              <ResourceManagement />
            </AdminProtectedRoute>
          } />
          <Route path="batches" element={
            <AdminProtectedRoute requiredPermission="manage_classes">
              <BatchTimings />
            </AdminProtectedRoute>
          } />
          <Route path='financials' element={
            <AdminProtectedRoute requiredPermission="view_analytics">
              <FinancialsPage />
            </AdminProtectedRoute>
          } />
          <Route path='classes' element={
            <AdminProtectedRoute requiredPermission="manage_classes">
              <LiveClassesPage />
            </AdminProtectedRoute>
          } />
          <Route path='faqs' element={
            <AdminProtectedRoute requiredPermission="manage_resources">
              <AddFAQs />
            </AdminProtectedRoute>
          } />

          <Route path='video' element={
            <AdminProtectedRoute requiredPermission="manage_resources">
            <AddVideoResources />
            </AdminProtectedRoute>
          } />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AdminAuthProvider>
  )
}

export default App