import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Plus, Package, Users, BarChart3 } from 'lucide-react'

export default function Home() {
  const { user } = useAuth()

  const donorStats = [
    { label: 'Total Donations', value: '12', color: 'bg-blue-500' },
    { label: 'Active Donations', value: '3', color: 'bg-green-500' },
    { label: 'People Fed', value: '450+', color: 'bg-purple-500' }
  ]

  const ngoStats = [
    { label: 'Requests Made', value: '8', color: 'bg-blue-500' },
    { label: 'Active Requests', value: '2', color: 'bg-green-500' },
    { label: 'People Served', value: '300+', color: 'bg-purple-500' }
  ]

  const stats = user?.role === 'donor' ? donorStats : ngoStats

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Welcome Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome back, {user?.organization_name || user?.username}!
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {user?.role === 'donor' 
            ? 'Make a difference by sharing your surplus food with those in need.'
            : 'Find available food donations to support your community.'
          }
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
            <div className="text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {user?.role === 'donor' ? (
          <>
            <Link to="/donate" className="group">
              <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border-2 border-transparent hover:border-primary-500">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-200 transition-colors">
                  <Plus className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Post Donation</h3>
                <p className="text-gray-600">Share your surplus food with NGOs in your area</p>
              </div>
            </Link>

            <Link to="/my-donations" className="group">
              <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border-2 border-transparent hover:border-primary-500">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                  <Package className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">My Donations</h3>
                <p className="text-gray-600">View and manage your food donation posts</p>
              </div>
            </Link>

            <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Impact</h3>
              <p className="text-gray-600">Track how your donations are helping the community</p>
            </div>
          </>
        ) : (
          <>
            <Link to="/available-donations" className="group">
              <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border-2 border-transparent hover:border-primary-500">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-200 transition-colors">
                  <Package className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Available Donations</h3>
                <p className="text-gray-600">Browse food donations from local businesses</p>
              </div>
            </Link>

            <Link to="/ngo-dashboard" className="group">
              <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border-2 border-transparent hover:border-primary-500">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Dashboard</h3>
                <p className="text-gray-600">Manage your food requests and collections</p>
              </div>
            </Link>

            <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community</h3>
              <p className="text-gray-600">Connect with donors and coordinate collections</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}