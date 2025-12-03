import express from 'express'
import axios from 'axios'
import { generateToken } from '../../lib/auth.js'
import { getDatabase } from '../../lib/db.js'

const router = express.Router()

// GET /api/oauth/github - Redirect to GitHub OAuth
router.get('/github', (req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID
  const redirectUri = `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/oauth/github/callback`
  
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user,repo`
  
  res.redirect(githubAuthUrl)
})

// GET /api/oauth/github/callback - Handle OAuth callback
router.get('/github/callback', async (req, res) => {
  try {
    const { code } = req.query

    if (!code) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=no_code`)
    }

    // Exchange code for access token
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code
      },
      {
        headers: { Accept: 'application/json' }
      }
    )

    const githubToken = tokenResponse.data.access_token

    if (!githubToken) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=no_token`)
    }

    // Get GitHub user info
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `token ${githubToken}` }
    })

    const githubUser = userResponse.data

    // Save/update user in DB
    const db = await getDatabase()
    const users = db.collection('users')

    let user = await users.findOne({ githubId: githubUser.id })

    if (!user) {
      const result = await users.insertOne({
        githubId: githubUser.id,
        email: githubUser.email,
        name: githubUser.name || githubUser.login,
        avatar: githubUser.avatar_url,
        githubToken,
        createdAt: new Date(),
        lastLogin: new Date()
      })
      user = { _id: result.insertedId, githubId: githubUser.id }
    } else {
      await users.updateOne(
        { githubId: githubUser.id },
        { $set: { githubToken, lastLogin: new Date() } }
      )
    }

    // Generate JWT
    const jwtToken = generateToken(user._id.toString())

    // Redirect to frontend with tokens
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/callback?token=${jwtToken}&github_token=${githubToken}`)

  } catch (error) {
    console.error('OAuth error:', error)
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=oauth_failed`)
  }
})

export default router
