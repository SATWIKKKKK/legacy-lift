import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env from root directory
dotenv.config({ path: path.join(__dirname, '..', '.env') })

console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'SET' : 'NOT SET')
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET')

const app = express()
const PORT = 5000

app.use(cors({ origin: 'http://localhost:3002', credentials: true }))
app.use(express.json())

app.get('/api/check', (req, res) => {
  res.json({ status: 'ok', message: 'Test server running' })
})

// Don't import authRoutes yet - test basic server first

app.listen(PORT, () => {
  console.log(`✅ Test server running on http://localhost:${PORT}`)
}).on('error', (err) => {
  console.error('❌ Server error:', err.message)
})
