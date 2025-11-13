import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../services/api'
import ImageUploader from '../../components/ImageUploader'
import { ArrowLeft, Save } from 'lucide-react'

export default function DonateForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    quantity: '',
    food_type: 'vegetarian',
    expiry_time: '',
    location: '',
    image_url: ''
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleImageUpload = (imageUrl) => {
    setFormData(prev => ({
      ...prev,
      image_url: imageUrl
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.post('/donations', {
        ...formData,
        expiry_time: new Date(formData.expiry_time).toISOString()
      })
      navigate('/my-donations')
    } catch (error) {
      console.error('Error creating donation:', error)
      alert('Failed to create donation. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Post Food Donation</h1>
        <p className="text-gray-600 mt-2">Share your surplus food with NGOs in need</p>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Food Item Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., Fresh Sandwiches, Vegetable Curry"
              />
            </div>

            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                Quantity *
              </label>
              <input
                type="text"
                id="quantity"
                name="quantity"
                required
                value={formData.quantity}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., 50 plates, 10 kg"
              />
            </div>

            <div>
              <label htmlFor="food_type" className="block text-sm font-medium text-gray-700">
                Food Type
              </label>
              <select
                id="food_type"
                name="food_type"
                value={formData.food_type}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="vegetarian">Vegetarian</option>
                <option value="non-vegetarian">Non-Vegetarian</option>
                <option value="vegan">Vegan</option>
              </select>
            </div>

            <div>
              <label htmlFor="expiry_time" className="block text-sm font-medium text-gray-700">
                Best Before *
              </label>
              <input
                type="datetime-local"
                id="expiry_time"
                name="expiry_time"
                required
                value={formData.expiry_time}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Pickup Location *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              required
              value={formData.location}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Full address for pickup"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Describe the food items, packaging, and any special instructions..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Food Image
            </label>
            <ImageUploader onImageUpload={handleImageUpload} />
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Posting...' : 'Post Donation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}