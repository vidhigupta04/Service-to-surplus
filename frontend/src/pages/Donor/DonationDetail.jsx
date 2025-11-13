import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../../services/api'
import QRDisplay from '../../components/QRDisplay'
import { ArrowLeft, Package, Clock, MapPin, Users, Download } from 'lucide-react'

export default function DonationDetail() {
  const { id } = useParams()
  const [donation, setDonation] = useState(null)
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDonationDetails()
  }, [id])

  const fetchDonationDetails = async () => {
    try {
      // In a real app, you'd have an endpoint for single donation with requests
      const donationsResponse = await api.get('/donations')
      const requestsResponse = await api.get('/donations/requests')
      
      const foundDonation = donationsResponse.data.find(d => d.id === parseInt(id))
      setDonation(foundDonation)
      setRequests(requestsResponse.data.filter(r => r.donation_id === parseInt(id)))
    } catch (error) {
      console.error('Error fetching donation details:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (!donation) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold text-gray-900">Donation not found</h2>
        <Link to="/my-donations" className="text-primary-600 hover:text-primary-500">
          Back to My Donations
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link
          to="/my-donations"
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to My Donations
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">{donation.title}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Donation Details */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Donation Details</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <Package className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Quantity</p>
                  <p className="font-medium">{donation.quantity}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Best Before</p>
                  <p className="font-medium">{new Date(donation.expiry_time).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Pickup Location</p>
                  <p className="font-medium">{donation.location}</p>
                </div>
              </div>
            </div>

            {donation.description && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Description</h3>
                <p className="text-gray-600">{donation.description}</p>
              </div>
            )}
          </div>

          {/* NGO Requests */}
          {requests.length > 0 && (
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">NGO Requests</h2>
              <div className="space-y-4">
                {requests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{request.ngo_name}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        request.status === 'approved' ? 'bg-green-100 text-green-800' :
                        request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {request.status}
                      </span>
                    </div>
                    {request.message && (
                      <p className="text-gray-600 text-sm mb-2">{request.message}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      Requested on {new Date(request.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* QR Code */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Collection QR Code</h3>
            <QRDisplay 
              data={`donation:${donation.id}`}
              title={donation.title}
            />
            <button className="w-full mt-4 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              <Download className="h-4 w-4 mr-2" />
              Download QR
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                Mark as Collected
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                Update Details
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded">
                Cancel Donation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}