// TODO: Create Express server DONE
// 1. Import express, cors, dotenv DONE
// 2. Initialize app with middleware DONE
// 3. Import and use routes DONE
// 4. Add error handling DONE
// 5. Start server on PORT 5000 DONE


import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

//CORS TO CONNECT FRONTEND AND BACKEND
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}))
app.use(express.json({limit: '100mb'}))

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


//backend checking
app.get('/api/check', (req,res)=>{
    res.json({ status: 'ok', message: 'Backend Running'})
})

//ROUTES
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

//ERROR HANDLING MIDDLEWARE (must be LAST)
app.use((err, req,res,next)=>{
    console.error(err)
    res.status(500).json({error: 'Internal Server Error'})
})


app.listen(PORT, ()=>{
    console.log( `Backend: http://localhost:${PORT}`)
})