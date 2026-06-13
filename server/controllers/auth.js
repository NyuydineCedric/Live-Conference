import {
  readDatabase,
  writeDatabase,
  generateToken,
  generateId,
  hashPassword,
  comparePassword,
} from '../utils/database.js'

export async function register(req, res) {
  try {
    const { fullName, email, password } = req.body

    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: 'Full name, email, and password are required',
      })
    }

    const db = await readDatabase()

    // Check if user already exists
    if (db.users.some((u) => u.email === email)) {
      return res.status(409).json({
        message: 'Email already registered',
      })
    }

    // Create new user
    const hashedPassword = await hashPassword(password)
    const newUser = {
      id: generateId(),
      fullName,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    }

    db.users.push(newUser)
    await writeDatabase(db)

    const token = generateToken(newUser)

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
      },
      token,
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({
      message: 'Registration failed',
    })
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
      })
    }

    const db = await readDatabase()
    const user = db.users.find((u) => u.email === email)

    if (!user) {
      return res.status(401).json({
        message: 'Invalid credentials',
      })
    }

    const isPasswordValid = await comparePassword(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid credentials',
      })
    }

    const token = generateToken(user)

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
      },
      token,
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      message: 'Login failed',
    })
  }
}

export async function getProfile(req, res) {
  try {
    const db = await readDatabase()
    const user = db.users.find((u) => u.id === req.user.id)

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    res.json({
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        createdAt: user.createdAt,
      },
    })
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({
      message: 'Failed to get profile',
    })
  }
}

export async function logout(req, res) {
  // Token is invalidated on client side
  res.json({
    message: 'Logout successful',
  })
}
