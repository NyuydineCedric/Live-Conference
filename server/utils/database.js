import jwt from 'jsonwebtoken'
import fs from 'fs/promises'

export async function readDatabase() {
  try {
    const data = await fs.readFile('./data/data.json', 'utf8')
    return JSON.parse(data)
  } catch (error) {
    return {
      users: [],
      meetings: [],
      participants: [],
      comments: [],
    }
  }
}

export async function writeDatabase(data) {
  try {
    await fs.mkdir('./data', { recursive: true })
    await fs.writeFile('./data/data.json', JSON.stringify(data, null, 2))
  } catch (error) {
    console.error('Error writing database:', error)
  }
}

export function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    }
  )
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch (error) {
    return null
  }
}

export function generateId() {
  return Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
}

export async function hashPassword(password) {
  // In production, use bcryptjs
  // For demo, we'll use a simple hash
  return Buffer.from(password).toString('base64')
}

export async function comparePassword(password, hash) {
  return Buffer.from(password).toString('base64') === hash
}
