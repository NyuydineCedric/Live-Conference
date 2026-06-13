import express from 'express'
import {
  register,
  login,
  getProfile,
  logout,
} from '../controllers/auth.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/me', authenticateToken, getProfile)
router.post('/logout', authenticateToken, logout)

export default router
