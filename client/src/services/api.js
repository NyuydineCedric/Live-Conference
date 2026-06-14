// services/api.js
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: API_URL,
  timeout: 20000, // critical for Render cold starts
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config

    // Retry once on network failures (no response = Render cold start / CORS)
    if (!error.response && !config._retried) {
      config._retried = true
      await new Promise((res) => setTimeout(res, 4000))
      return api(config)
    }

    // ✅ Never auto-redirect here — let AuthContext handle 401 logic.
    // A blanket redirect here causes a hard reload which restarts the loop.

    return Promise.reject(error)
  }
)

export default api