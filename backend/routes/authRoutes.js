// TODO: Authentication routes
// POST /api/auth/register - Create new user
// POST /api/auth/login - Login user  
// GET /api/auth/me - Get current user

import express from 'express'
import { getDatabase } from '../../lib/db.js'
import { createUserModel} from '../../lib/models.js'
import { hashPassword, verifyPassword, generateToken, verifyToken, extractTokenFromHeader } from '../../lib/auth.js'
import { ObjectId} from 'mongodb'

const router = express.Router()

// POST [/api/auth/register]
router.post('/register', async(req,res,next)=>{
    try{
        const{email, password, name } = req.body
        if(!email || !password || !name){
            return res.status(400).json({ error :'Email and Password are required'})
}
        const db = await getDatabase()
        const users = await createUserModel(db)

        //check even if it exists or not
        const existing = await users.findOne({email})
        if(existing){
            return res.status(409).json({ error :'Email already registered. Please Login.'})
        }

        //creating an user
        const result = await users.insertOne({
            email,
            password : hashPassword(password),
            name: name || email.split('@')[0],
            createdAt : new Date()
        })

        const token = generateToken(result.insertedId.toString())
        res.status(201).json({
            user : {
                id: result.insertedId,
                email,
                name : name || email.split('@')[0]
            },
            token 
         })
    }
    catch(err){
        res.status(500).json({error: 'Registration failed!!'})
    }
})



// POST [/api/auth/login]

router.post('/login', async(req,res,next)=>{
    try{
        const {email, password} = req.body
        if(!email || !password){
            return res.status(400).json({ error: 'Email and Password are required' })
        }

           const db = await getDatabase()
           const users = await createUserModel(db)


           const user = await users.findOne({ email })
    if (!user || !verifyPassword(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

        const token = generateToken(user._id.toString())

        res.json({
            user: {
             id: user._id.toString(),
             email: user.email,
             name: user.name
            },
            token
        })
    }
    catch(err){
        res.status(500).json({error: ' Oops! Login failed!!'})
    }
    })


    //GET [/api/auth/me]
 router.get('/me', async(req,res,next)=>{
    try{
        const token = extractTokenFromHeader(req.headers.authorization)
        const decoded = verifyToken(token)

        if(!decoded){
            return res.status(401).json({ error: 'Unauthorized' })
        }

        const db = await getDatabase()
        const users = await createUserModel(db)

        const user = await users.findOne({ _id: new ObjectId(decoded.userId) })

        if (!user) {
        return res.status(404).json({ error: 'User not found' })
    }

    res.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name
      }
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user' })
  }
})

export default router
