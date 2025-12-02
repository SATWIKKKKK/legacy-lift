// TODO: AI refactoring routes
// POST /api/refactor/analyze - Analyze code with AI
// POST /api/refactor/process - Refactor code and save

import express from 'express'
import { analyzeCode, refactorCode } from '../../lib/ai-refactor.js'
import { getDatabase } from '../../lib/db.js'
import { createDiffModel } from '../../lib/models.js'
import { verifyToken, extractTokenFromHeader } from '../../lib/auth.js'

const router = express.Router()


//to check the errors(not saved in DB)
router.post('/analyze', async(req,res)=>{
    try{
        //first check if the user is logged in or not
        const token = extractTokenFromHeader(req.headers.authorization)
        const decoded = verifyToken(token)
        if(!decoded) return res.status(401).json({error: 'Unauthorized'})

        const { code, language} = req.body
         if (!code || !language) {
      return res.status(400).json({ error: 'Missing code or language' })
    }

    const analysis = await analyzeCode(code, language)
    res.json({ analysis })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})


//for refactoring the code and improvements

router.post('/refactor', async(req,res)=>{
    try{
     const token = extractTokenFromHeader(req.headers.authorization)
    const decoded = verifyToken(token)
    if (!decoded) return res.status(401).json({ error: 'Unauthorized' })

    const { code, language, projectId, focusArea } = req.body
    if (!code || !language || !projectId) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const refactored = await refactorCode(code,language,projectId,focusArea)

    const db = await getDatabase()
    const diffs = await createDiffModel(db)
    
    //stored in DB
    const result = await diffs.insertOne({
    projectId,
    userId: decoded.userId,
    originalCode: code,
    refactoredCode: refactored.refactoredCode,
    language,
    summary: refactored.summary,
    explanation: refactored.explanation,
    status: 'pending',
    createdAt: new Date()
    })

    //response back to frontend
    res.status(201).json({
        diff: {
            id: result.insertedId.toString(),
            ...refactored
        }
    })
    } catch(error){
    res.status(500).json({error : error.message})
    }
})

export default router