import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Home from './pages/Home'
import DonateForm from './pages/Donor/DonateForm'
import MyDonations from './pages/Donor/MyDonation'
import DonationDetail from './pages/Donor/DonationDetail'
import Dashboard from './pages/NGO/Dashboard'
import DonationsList from './pages/NGO/DonationsList'
import Chat from './pages/Chat'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" />
}

function RoleRoute({ role, children }) {
  const { user } = useAuth()
  return user && user.role === role ? children : <Navigate to="/" />
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              <Route path="/chat" element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              } />
              
              {/* Donor Routes */}
              <Route path="/donate" element={
                <ProtectedRoute>
                  <RoleRoute role="donor">
                    <DonateForm />
                  </RoleRoute>
                </ProtectedRoute>
              } />
              <Route path="/my-donations" element={
                <ProtectedRoute>
                  <RoleRoute role="donor">
                    <MyDonations />
                  </RoleRoute>
                </ProtectedRoute>
              } />
              <Route path="/donation/:id" element={
                <ProtectedRoute>
                  <RoleRoute role="donor">
                    <DonationDetail />
                  </RoleRoute>
                </ProtectedRoute>
              } />
              
              {/* NGO Routes */}
              <Route path="/ngo-dashboard" element={
                <ProtectedRoute>
                  <RoleRoute role="ngo">
                    <Dashboard />
                  </RoleRoute>
                </ProtectedRoute>
              } />
              <Route path="/available-donations" element={
                <ProtectedRoute>
                  <RoleRoute role="ngo">
                    <DonationsList />
                  </RoleRoute>
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App