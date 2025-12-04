// TODO: File upload routes
// POST /api/upload - Upload and parse file
// Uses multer for file handling

import express from 'express'
import multer from 'multer'
import { getDatabase } from '../../lib/db.js'
import { createUploadModel, createProjectModel } from '../../lib/models.js'
import { verifyToken, extractTokenFromHeader } from '../../lib/auth.js'
import { validateFile, parseFileContent } from '../../lib/file-processor.js'

const router = express.Router()
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
})

//POST [/api/upload] - Upload multiple files and create project
router.post('/', upload.array('files', 50), async(req, res) => {
  try {
    // Check authentication
    const token = extractTokenFromHeader(req.headers.authorization)
    const decoded = verifyToken(token)
    if(!decoded) return res.status(401).json({ error: 'Unauthorized' })

    // Check if files exist
    if(!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files provided' })
    }
    
    const { projectName, description } = req.body
    if(!projectName) {
      return res.status(400).json({ error: 'Project name required' })
    }

    const db = await getDatabase()
    
    // Create project first
    const projects = await createProjectModel(db)
    const projectResult = await projects.insertOne({
      userId: decoded.userId,
      name: projectName,
      description: description || '',
      status: 'pending',
      uploadedFiles: [],
      createdAt: new Date()
    })
    
    const projectId = projectResult.insertedId.toString()
    
    // Process and save each file
    const uploads = await createUploadModel(db)
    const uploadedFiles = []
    
    for (const file of req.files) {
      try {
        // Validate file
        const validation = validateFile(file)
        if(!validation.valid) {
          console.warn(`Skipping invalid file ${file.originalname}:`, validation.error)
          continue
        }
        
        // Parse file content
        const fileData = await parseFileContent(file)
        
        // Save to uploads collection
        const uploadResult = await uploads.insertOne({
          userId: decoded.userId,
          projectId: projectId,
          ...fileData,
          createdAt: new Date()
        })
        
        uploadedFiles.push({
          id: uploadResult.insertedId.toString(),
          filename: file.originalname,
          ...fileData
        })
      } catch (fileError) {
        console.error(`Error processing file ${file.originalname}:`, fileError)
      }
    }
    
    // Update project with uploaded files
    await projects.updateOne(
      { _id: projectResult.insertedId },
      { 
        $set: { 
          uploadedFiles: uploadedFiles.map(f => f.id),
          status: 'uploaded'
        } 
      }
    )

    // Send response
    res.status(201).json({
      project: {
        id: projectId,
        name: projectName,
        description,
        filesUploaded: uploadedFiles.length,
        files: uploadedFiles
      }
    })

  } catch(error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: 'Upload failed: ' + error.message })
  }
})

export default router