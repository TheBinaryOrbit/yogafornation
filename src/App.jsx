import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import NotFound from './pages/NotFound'
import Dashboard from './pages/Dashboard'
import Resources from './pages/Resources'
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

function App() {
  return (
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
      <Route path="/resources" element={<Resources />} />
      <Route path="/admin/login" element={<AdminLogin />} />


      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="resources" element={<ResourceManagement />} />
        <Route path="batches" element={<BatchTimings />} />
        <Route path='financials' element={<FinancialsPage />} />
        <Route path='classes' element={<LiveClassesPage />} />
        <Route path='faqs' element={<AddFAQs />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App