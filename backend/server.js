// TODO: Create Express server DONE
// 1. Import express, cors, dotenv DONE
// 2. Initialize app with middleware DONE
// 3. Import and use routes DONE
// 4. Add error handling DONE
// 5. Start server on PORT 5000 DONE

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
const PORT = process.env.PORT || 5004;


//CORS TO CONNECT FRONTEND AND BACKEND
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3002',
    credentials: true
}))
app.use(express.json({limit: '100mb'}))
// ROUTE IMPORT DEBUGGING

console.log("Loading authRoutes.js...");
import authRoutes from './routes/authRoutes.js';
console.log("Loaded authRoutes.js");

console.log("Loading projectRoutes.js...");
import projectRoutes from './routes/projectRoutes.js';
console.log("Loaded projectRoutes.js");

console.log("Loading uploadRoutes.js...");
import uploadRoutes from './routes/uploadRoutes.js';
console.log("Loaded uploadRoutes.js");

console.log("Loading refactorRoutes.js...");
import refactorRoutes from './routes/refactorRoutes.js';
console.log("Loaded refactorRoutes.js");

console.log("Loading diffRoutes.js...");
import diffRoutes from './routes/diffRoutes.js';
console.log("Loaded diffRoutes.js");

console.log("Loading githubRoutes.js...");
import githubRoutes from './routes/githubRoutes.js';
console.log("Loaded githubRoutes.js");

console.log("Loading workflowRoutes.js...");
import workflowRoutes from './routes/ai-workflow.js';
console.log("Loaded workflowRoutes.js");

console.log("Loading reviewRoutes.js...");
import reviewRoutes from './routes/reviewRoutes.js';
console.log("Loaded reviewRoutes.js");

console.log("Loading oauthRoutes.js...");
import oauthRoutes from './routes/oauthRoutes.js';
console.log("Loaded oauthRoutes.js");

console.log("Loading historyRoutes.js...");
import historyRoutes from './routes/historyRoutes.js';
console.log("Loaded historyRoutes.js");


// Global error handlers
process.on('uncaughtException', (err) => {
    console.error(' Uncaught Exception:', err.message)
    console.error(err.stack)
    // Don't exit immediately to see the error
})

process.on('unhandledRejection', (reason, promise) => {
    console.error(' Unhandled Rejection at:', promise, 'reason:', reason)
    // Don't exit immediately to see the error
})


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

console.log("DEBUG PORT VALUE:", process.env.PORT);
console.log("TYPE OF PORT:", typeof PORT);
console.log("PORT NUMBER USED:", PORT);



app.listen(PORT, () => {
    console.log(` Backend running: http://localhost:${PORT}`);
    console.log(` Frontend should be on: http://localhost:3002`);
    console.log(` MongoDB: ${process.env.MONGODB_URI ? 'Connected' : 'NOT CONFIGURED'}`);
}).on('error', (err) => {
    console.error(' Server failed to start:', err.message)
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Kill the process or use a different port.`);
        console.error(`Run: Get-NetTCPConnection -LocalPort ${PORT} | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }`);
    }
});
