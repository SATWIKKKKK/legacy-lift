import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { getDatabase } from './lib/db.js'
import { createUserModel } from './lib/models.js'
import { hashPassword, generateToken } from './lib/auth.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// Test route
app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('📝 Registration request:', req.body)
    
    const { email, password, name } = req.body
    
    if (!email || !password || !name) {
      console.log('❌ Missing fields')
      return res.status(400).json({ error: 'Email, password and name are required' })
    }
    
    console.log('🔌 Connecting to MongoDB...')
    const db = await getDatabase()
    console.log('✅ Connected to MongoDB')
    
    console.log('📚 Getting users collection...')
    const users = await createUserModel(db)
    console.log('✅ Users collection ready')
    
    console.log('🔍 Checking if user exists...')
    const existing = await users.findOne({ email })
    
    if (existing) {
      console.log('⚠️  User already exists')
      return res.status(409).json({ error: 'Email already registered' })
    }
    
    console.log('🔐 Creating user...')
    const result = await users.insertOne({
      email,
      password: hashPassword(password),
      name,
      createdAt: new Date()
    })
    
    console.log('✅ User created:', result.insertedId)
    
    const token = generateToken(result.insertedId.toString())
    
    res.status(201).json({
      user: {
        id: result.insertedId,
        email,
        name
      },
      token
    })
    
  } catch (error) {
    console.error('❌ Registration error:', error)
    res.status(500).json({ 
      error: 'Registration failed',
      message: error.message 
    })
  }
})

app.get('/api/check', (req, res) => {
  res.json({ status: 'ok', message: 'Backend Running' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Backend: http://localhost:${PORT}`)
  console.log('📊 Test it with: POST http://localhost:5000/api/auth/register')
})
