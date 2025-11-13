import React, { useState, useEffect } from 'react'
import { api } from '../../services/api'
import { Package, Clock, MapPin, Users, Heart } from 'lucide-react'

export default function DonationsList() {
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [requesting, setRequesting] = useState(null)

  useEffect(() => {
    fetchDonations()
  }, [])

  const fetchDonations = async () => {
    try {
      const response = await api.get('/donations')
      setDonations(response.data)
    } catch (error) {
      console.error('Error fetching donations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRequest = async (donationId) => {
    setRequesting(donationId)
    try {
      await api.post(`/donations/${donationId}/request`, {
        message: 'We would like to collect this donation for our community kitchen.'
      })
      alert('Request submitted successfully!')
      fetchDonations() // Refresh the list
    } catch (error) {
      alert('Failed to submit request. Please try again.')
    } finally {
      setRequesting(null)
    }
  }

  const getTimeRemaining = (expiryTime) => {
    const now = new Date()
    const expiry = new Date(expiryTime)
    const diff = expiry - now
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (hours < 0) return 'Expired'
    if (hours < 1) return 'Less than 1 hour'
    if (hours < 24) return `${hours} hours`
    return `${Math.floor(hours / 24)} days`
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Available Donations</h1>
        <p className="text-gray-600 mt-2">Browse and request food donations from local businesses</p>
      </div>

      {donations.length === 0 ? (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No donations available</h3>
          <p className="mt-2 text-gray-500">Check back later for new food donations.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {donations.map((donation) => (
            <div key={donation.id} className="bg-white shadow-lg rounded-lg p-6 border">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">{donation.title}</h3>
                  <p className="text-gray-600 mt-1">{donation.description}</p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {donation.food_type}
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    getTimeRemaining(donation.expiry_time) === 'Expired' 
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {getTimeRemaining(donation.expiry_time)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center text-gray-600">
                  <Package className="h-5 w-5 mr-2" />
                  <span className="font-medium">{donation.quantity}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>Expires: {new Date(donation.expiry_time).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span className="truncate">{donation.location}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="h-4 w-4 mr-1" />
                  Donated by {donation.donor_name}
                </div>
                <button
                  onClick={() => handleRequest(donation.id)}
                  disabled={requesting === donation.id || getTimeRemaining(donation.expiry_time) === 'Expired'}
                  className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  {requesting === donation.id ? 'Requesting...' : 'Request Donation'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}