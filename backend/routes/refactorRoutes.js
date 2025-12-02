// TODO: AI refactoring routes
// POST /api/refactor/analyze - Analyze code with AI
// POST /api/refactor/process - Refactor code and save

import express from 'express'
import { analyzeCode, refactorCode } from '../../lib/ai-refactor.js'
import { getDatabase } from '../../lib/db.js'
import { createDiffModel } from '../../lib/models.js'
import { verifyToken, extractTokenFromHeader } from '../../lib/auth.js'

const router = express.Router()

router.post('/analyze', async(req,res)=>{
    try{
        //first check if the user is logged in or not
        const token = extractTokenFromHeader(req.headers.authorization)
        const decoded = verifyToken(token)
        if(!decoded) return res.status(401).json({error: 'Unauthorized'})

        
    }
})