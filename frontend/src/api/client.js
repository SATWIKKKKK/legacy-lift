import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Auth disabled for now - no token attached
// apiClient.interceptors.request.use((config) => {
//   try {
//     const token = localStorage.getItem('token')
//     if (token) {
//       config.headers = config.headers || {}
//       config.headers.Authorization = `Bearer ${token}`
//     }
//   } catch (e) {
//     // ignore in non-browser environments
//   }
//   return config
// })

export default apiClient
