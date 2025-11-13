import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../services/api'
import { Package, Users, BarChart3, Clock, MapPin } from 'lucide-react'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalRequests: 0,
    activeRequests: 0,
    collectedDonations: 0,
    pendingApprovals: 0
  })
  const [recentRequests, setRecentRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const requestsResponse = await api.get('/donations/requests')
      const requests = requestsResponse.data
      
      setStats({
        totalRequests: requests.length,
        activeRequests: requests.filter(r => r.status === 'pending' || r.status === 'approved').length,
        collectedDonations: requests.filter(r => r.status === 'collected').length,
        pendingApprovals: requests.filter(r => r.status === 'pending').length
      })
      
      setRecentRequests(requests.slice(0, 5))
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Requests',
      value: stats.totalRequests,
      icon: Package,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Requests',
      value: stats.activeRequests,
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: 'Collected',
      value: stats.collectedDonations,
      icon: BarChart3,
      color: 'bg-purple-500'
    },
    {
      title: 'Pending Approval',
      value: stats.pendingApprovals,
      icon: Clock,
      color: 'bg-yellow-500'
    }
  ]

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">NGO Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your food donation requests and collections</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color} mr-4`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Requests */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Recent Requests</h2>
            <Link 
              to="/available-donations"
              className="text-primary-600 hover:text-primary-500 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          
          {recentRequests.length === 0 ? (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 text-gray-500">No requests yet</p>
              <Link
                to="/available-donations"
                className="mt-2 inline-block text-primary-600 hover:text-primary-500"
              >
                Browse available donations
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentRequests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{request.donation_title}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      request.status === 'approved' ? 'bg-green-100 text-green-800' :
                      request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <Package className="h-4 w-4 mr-2" />
                    {request.donation_quantity}
                  </div>
                  <div className="text-xs text-gray-500">
                    Requested on {new Date(request.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to="/available-donations"
                className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Package className="h-5 w-5 text-primary-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Browse Donations</p>
                  <p className="text-sm text-gray-600">Find available food donations</p>
                </div>
              </Link>
              
              <button className="w-full flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Users className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">My Collections</p>
                  <p className="text-sm text-gray-600">View collection history</p>
                </div>
              </button>
              
              <button className="w-full flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <BarChart3 className="h-5 w-5 text-purple-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Reports</p>
                  <p className="text-sm text-gray-600">Generate impact reports</p>
                </div>
              </button>
            </div>
          </div>

          {/* Upcoming Collections */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Upcoming Collections</h2>
            <div className="text-center py-4">
              <Clock className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-2 text-gray-500">No upcoming collections</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}