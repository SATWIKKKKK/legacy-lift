import express from 'express'
import { getDatabase } from '../../lib/db.js'
import { ObjectId } from 'mongodb'
import { verifyToken, extractTokenFromHeader } from '../../lib/auth.js'
import { diffLines } from 'diff'

const router = express.Router()

// Middleware to verify JWT token
const authenticate = async (req, res, next) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization)
    const decoded = verifyToken(token)
    
    if (!decoded) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    
    req.userId = decoded.userId
    next()
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
  }
}

// GET /api/diffs - Get all diffs for the logged-in user
router.get('/', authenticate, async (req, res) => {
  try {
    const db = await getDatabase()
    const diffs = db.collection('diffs')
    
    const userDiffs = await diffs
      .find({ userId: new ObjectId(req.userId) })
      .sort({ createdAt: -1 })
      .toArray()
    
    res.json(userDiffs)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch diffs' })
  }
})

// POST /api/diffs - Create new diff
router.post('/', authenticate, async (req, res) => {
  try {
    const { originalCode, refactoredCode, summary, language, uploadId, projectId } = req.body
    
    if (!originalCode || !refactoredCode) {
      return res.status(400).json({ error: 'Original and refactored code are required' })
    }
    
    // Generate diff patch using diff library
    const diffPatch = diffLines(originalCode, refactoredCode)
      .map(part => {
        const prefix = part.added ? '+' : part.removed ? '-' : ' '
        return part.value.split('\n').map(line => prefix + line).join('\n')
      })
      .join('\n')
    
    const db = await getDatabase()
    const diffs = db.collection('diffs')
    
    const newDiff = {
      userId: new ObjectId(req.userId),
      uploadId: uploadId ? new ObjectId(uploadId) : null,
      projectId: projectId ? new ObjectId(projectId) : null,
      originalCode,
      refactoredCode,
      diffPatch,
      summary: summary || 'Code refactored',
      language: language || 'javascript',
      createdAt: new Date()
    }
    
    const result = await diffs.insertOne(newDiff)
    
    res.status(201).json({
      _id: result.insertedId,
      ...newDiff
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to create diff' })
  }
})

// GET /api/diffs/:id - Get single diff by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid diff ID' })
    }
    
    const db = await getDatabase()
    const diffs = db.collection('diffs')
    
    const diff = await diffs.findOne({ 
      _id: new ObjectId(id),
      userId: new ObjectId(req.userId)
    })
    
    if (!diff) {
      return res.status(404).json({ error: 'Diff not found' })
    }
    
    res.json(diff)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch diff' })
  }
})

// DELETE /api/diffs/:id - Delete diff
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid diff ID' })
    }
    
    const db = await getDatabase()
    const diffs = db.collection('diffs')
    
    const result = await diffs.deleteOne({ 
      _id: new ObjectId(id),
      userId: new ObjectId(req.userId)
    })
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Diff not found' })
    }
    
    res.json({ message: 'Diff deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete diff' })
  }
})

export default router