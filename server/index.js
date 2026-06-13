import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'
import * as dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import meetingsRoutes from './routes/meetings.js'
import { authenticateToken } from './middleware/auth.js'
import { setupSocketHandlers } from './socket/handlers.js'

dotenv.config()

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/meetings', authenticateToken, meetingsRoutes)

// Socket.IO
app.set('io', io)
io.use((socket, next) => {
  const token = socket.handshake.auth.token
  if (!token) return next(new Error('Authentication error'))
  // Verify token here if needed
  next()
})

io.on('connection', (socket) => {
  console.log('User connected:', socket.id)
  setupSocketHandlers(socket, io)
})

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  })
})

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app
