// TODO: AI refactoring routes
// POST /api/refactor/analyze - Analyze code with AI
// POST /api/refactor/process - Refactor code and save

import express from 'express'
import { analyzeCode, refactorCode } from '../../lib/ai-refactor.js'
import { getDatabase } from '../../lib/db.js'
import { createDiffModel } from '../../lib/models.js'
import { verifyToken, extractTokenFromHeader } from '../../lib/auth.js'
import { ObjectId } from 'mongodb'

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

// POST /api/refactor/:projectId/refactor - Refactor entire project
router.post('/:projectId/refactor', async (req, res) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization)
    const decoded = verifyToken(token)
    if (!decoded) return res.status(401).json({ error: 'Unauthorized' })

    const { projectId } = req.params
    const { files } = req.body

    if (!files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ error: 'No files provided' })
    }

    console.log(`Starting AI refactoring for project ${projectId} with ${files.length} files`)

    const db = await getDatabase()
    const refactoredFiles = []

    // Refactor each file
    for (const file of files) {
      try {
        console.log(`Refactoring ${file.filename}...`)
        const result = await refactorCode(file.content, file.language || 'javascript', 'general')
        
        refactoredFiles.push({
          filename: file.filename,
          originalCode: file.content,
          refactoredCode: result.refactoredCode,
          summary: result.summary,
          explanation: result.explanation,
          language: file.language || 'javascript'
        })
      } catch (error) {
        console.error(`Failed to refactor ${file.filename}:`, error.message)
        refactoredFiles.push({
          filename: file.filename,
          error: error.message
        })
      }
    }

    // Create a version/diff record
    const diffs = await createDiffModel(db)
    const versionResult = await diffs.insertOne({
      projectId,
      userId: decoded.userId,
      files: refactoredFiles,
      versionNumber: 1,
      status: 'completed',
      createdAt: new Date()
    })

    // Update project status
    await db.collection('projects').updateOne(
      { _id: new ObjectId(projectId) },
      { 
        $set: { 
          status: 'refactored',
          lastRefactoredAt: new Date()
        },
        $inc: { versionCount: 1 }
      }
    )

    res.status(200).json({
      success: true,
      version: {
        _id: versionResult.insertedId.toString(),
        versionNumber: 1,
        filesRefactored: refactoredFiles.length
      },
      files: refactoredFiles
    })

  } catch (error) {
    console.error('Project refactoring error:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router