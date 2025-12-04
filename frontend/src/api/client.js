import axios from 'axios'

const apiClient = axios.create({
  baseURL: '/api', // Use Vite proxy instead of direct backend URL
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach JWT token to all requests
apiClient.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
  } catch (e) {
    console.error('Error attaching token:', e)
  }
  return config
})

// Handle response errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default apiClient
