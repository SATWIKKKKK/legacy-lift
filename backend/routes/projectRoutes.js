// TODO: Project management routes
// GET /api/projects - Get all projects
// POST /api/projects - Create project
// GET /api/projects/:id - Get single project
// PUT /api/projects/:id - Update project
// DELETE /api/projects/:id - Delete project


import express from 'express'
import { getDatabase } from '../../lib/db.js'
import { verifyToken, extractTokenFromHeader } from '../../lib/auth.js'
import { ObjectId } from 'mongodb'

const router = express.Router()

// GET /api/projects - Get all projects
router.get('/', async (req, res) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization)
    const decoded = verifyToken(token)
    if (!decoded) return res.status(401).json({ error: 'Unauthorized' })

    const db = await getDatabase()

    const projects = await db.collection('projects')
      .find({ userId: decoded.userId })
      .sort({ createdAt: -1 })
      .toArray()

    res.json({ projects })
  } catch (error) {
    console.error('Get projects error:', error)
    res.status(500).json({ error: 'Failed to get projects' })
  }
})

// POST /api/projects - Create project
router.post('/', async (req, res) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization)
    const decoded = verifyToken(token)
    if (!decoded) return res.status(401).json({ error: 'Unauthorized' })

    const { name, description } = req.body

    if (!name) {
      return res.status(400).json({ error: 'Project name required' })
    }

    const db = await getDatabase()

    const result = await db.collection('projects').insertOne({
      userId: decoded.userId,
      name,
      description: description || '',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    res.status(201).json({
      project: {
        id: result.insertedId.toString(),
        name,
        description,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
  } catch (error) {
    console.error('Create project error:', error)
    res.status(500).json({ error: 'Failed to create project' })
  }
})

// GET /api/projects/:id - Get single project
router.get('/:id', async (req, res) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization)
    const decoded = verifyToken(token)
    if (!decoded) return res.status(401).json({ error: 'Unauthorized' })

    const db = await getDatabase()

    const project = await db.collection('projects').findOne({
      _id: new ObjectId(req.params.id),
      userId: decoded.userId
    })

    if (!project) {
      return res.status(404).json({ error: 'Project not found' })
    }

    res.json({ project })
  } catch (error) {
    console.error('Get project error:', error)
    res.status(500).json({ error: 'Failed to get project' })
  }
})

// PUT /api/projects/:id - Update project
router.put('/:id', async (req, res) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization)
    const decoded = verifyToken(token)
    if (!decoded) return res.status(401).json({ error: 'Unauthorized' })

    const { name, description, status } = req.body
    
    const updateData = { updatedAt: new Date() }
    if (name) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (status) updateData.status = status

    const db = await getDatabase()

    const result = await db.collection('projects').findOneAndUpdate(
      { _id: new ObjectId(req.params.id), userId: decoded.userId },
      { $set: updateData },
      { returnDocument: 'after' }
    )

    if (!result) {
      return res.status(404).json({ error: 'Project not found' })
    }

    res.json({ project: result })
  } catch (error) {
    console.error('Update project error:', error)
    res.status(500).json({ error: 'Failed to update project' })
  }
})

// DELETE /api/projects/:id - Delete project
router.delete('/:id', async (req, res) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization)
    const decoded = verifyToken(token)
    if (!decoded) return res.status(401).json({ error: 'Unauthorized' })

    const db = await getDatabase()

    const result = await db.collection('projects').deleteOne({
      _id: new ObjectId(req.params.id),
      userId: decoded.userId
    })

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Project not found' })
    }

    res.json({ message: 'Project deleted successfully' })
  } catch (error) {
    console.error('Delete project error:', error)
    res.status(500).json({ error: 'Failed to delete project' })
  }
})

export default router