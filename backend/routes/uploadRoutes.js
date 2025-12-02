// TODO: File upload routes
// POST /api/upload - Upload and parse file
// Uses multer for file handling

import express from 'express'
import multer from 'multer'
import { getDatabase } from '../../lib/db.js'
import { createUploadModel } from '../../lib/models.js'
import { verifyToken, extractTokenFromHeader } from '../../lib/auth.js'
import {validateFile, parseFileContent} from '../../lib/file-processor.js'

const router = express.Router()
const upload = multer({ storage : multer.memoryStorage() })

//POST [/api/upload]
router.post('/', upload.single('file'), async(req,res)=>{
    try{

        //first checking if the user is authenticated or not
        const token = extractTokenFromHeader(req.headers.authorization)
        const decoded = verifyToken(token)
        if(!decoded) return res.status(401).json({ error : 'Unauthorized'})

        //now if he is authenticated, then check if file exists or not
        if(!req.file){
            return res.status(400).json({ error: 'No File Provided.'})
  }    
    //now if file exists, validate it
    const validation =  validateFile(req.file)
    if(!validation.valid){
        return res.status(400).json({ error : validation.error})
    }
    
    //after validation, parse the file contents
    const fileData = await parseFileContent(req.file)

    //now that the file is parsed, save it to mongoDB
    const db = await getDatabase()
    const uploads = await createUploadModel(db)

    //saving info to mongoDB
    const response = await uploads.insertOne({
    userId:  decoded.userId,
    projectId: req.body.projectId,
    ...fileData,
    createdAt: new Date()
})

//sending response back to frontend
res.status(201).json({
    upload:{
        id: response.insertedId.toString(),
        ...fileData
    }
})

    }
    catch(error){
        res.status(500).json({ error: 'Upload failed' })
    }
})

export default router