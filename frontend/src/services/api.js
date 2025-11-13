import axios from 'axios'

// ✅ FIX: Configure axios with correct base URL and CORS settings
export const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: false // Important for CORS
})

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`🔄 Making ${config.method?.toUpperCase()} request to: ${config.url}`)
    return config
  },
  (error) => {
    console.error('❌ Request error:', error)
    return Promise.reject(error)
  }
)

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Response received:`, response.status)
    return response
  },
  (error) => {
    console.error('❌ Response error:', error)
    return Promise.reject(error)
  }
)