//SAVES COMMIT HISTORY

import express from 'express'
import { getDatabase } from '../../lib/db.js'
import { verifyToken, extractTokenFromHeader } from '../../lib/auth.js'
import { ObjectId } from 'mongodb'

const router = express.Router()

// POST /api/history/save - Save commit history
router.post('/save', async (req, res) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization)
    const decoded = verifyToken(token)
    if (!decoded) return res.status(401).json({ error: 'Unauthorized' })

    const {
      projectId,
      commitSha,
      message,
      branch,
      files,
      prNumber,
      prUrl
    } = req.body

    if (!projectId || !commitSha || !message) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const db = await getDatabase()

    const result = await db.collection('commit_history').insertOne({
      projectId,
      userId: decoded.userId,
      commitSha,
      message,
      branch: branch || 'main',
      files: files || [],
      prNumber,
      prUrl,
      createdAt: new Date()
    })

    res.status(201).json({
      success: true,
      historyId: result.insertedId.toString()
    })

  } catch (error) {
    console.error('Save history error:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET /api/history/:projectId - Get commit history for project
router.get('/:projectId', async (req, res) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization)
    const decoded = verifyToken(token)
    if (!decoded) return res.status(401).json({ error: 'Unauthorized' })

    const db = await getDatabase()

    const history = await db.collection('commit_history')
      .find({ 
        projectId: req.params.projectId,
        userId: decoded.userId 
      })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray()

    res.json({ 
      history,
      count: history.length
    })

  } catch (error) {
    console.error('Get history error:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET /api/history - Get all commit history for user
router.get('/', async (req, res) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization)
    const decoded = verifyToken(token)
    if (!decoded) return res.status(401).json({ error: 'Unauthorized' })

    const db = await getDatabase()

    const history = await db.collection('commit_history')
      .find({ userId: decoded.userId })
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray()

    res.json({ 
      history,
      count: history.length
    })

  } catch (error) {
    console.error('Get all history error:', error)
    res.status(500).json({ error: error.message })
  }
})

// DELETE /api/history/:id - Delete commit history entry
router.delete('/:id', async (req, res) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization)
    const decoded = verifyToken(token)
    if (!decoded) return res.status(401).json({ error: 'Unauthorized' })

    const db = await getDatabase()

    const result = await db.collection('commit_history').deleteOne({
      _id: new ObjectId(req.params.id),
      userId: decoded.userId
    })

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'History entry not found' })
    }

    res.json({ message: 'History entry deleted' })

  } catch (error) {
    console.error('Delete history error:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router
