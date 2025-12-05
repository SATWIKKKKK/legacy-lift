import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env from root directory
dotenv.config({ path: path.join(__dirname, '..', '.env') })

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3002',
    credentials: true
}))
app.use(express.json({ limit: '100mb' }))

// Health check
app.get('/api/check', (req, res) => {
    res.json({ status: 'ok', message: 'Backend Running' })
})

// Import routes
import authRoutes from './routes/authRoutes.js'
import projectRoutes from './routes/projectRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import refactorRoutes from './routes/refactorRoutes.js'
import diffRoutes from './routes/diffRoutes.js'
import githubRoutes from './routes/githubRoutes.js'
import workflowRoutes from './routes/ai-workflow.js'
import reviewRoutes from './routes/reviewRoutes.js'
import oauthRoutes from './routes/oauthRoutes.js'
import historyRoutes from './routes/historyRoutes.js'

// Use routes
app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/refactor', refactorRoutes)
app.use('/api/diffs', diffRoutes)
app.use('/api/github', githubRoutes)
app.use('/api/workflow', workflowRoutes)
app.use('/api/review', reviewRoutes)
app.use('/api/oauth', oauthRoutes)
app.use('/api/history', historyRoutes)

// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err)
    res.status(500).json({ error: 'Internal Server Error' })
})

// Start server
app.listen(PORT, () => {
    console.log(`✅ Backend running: http://localhost:${PORT}`)
    console.log(`✅ Frontend: http://localhost:3002`)
    console.log(`✅ MongoDB: ${process.env.MONGODB_URI ? 'Connected' : 'NOT CONFIGURED'}`)
}).on('error', (err) => {
    console.error('❌ Server failed to start:', err.message)
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use.`)
    }
})
