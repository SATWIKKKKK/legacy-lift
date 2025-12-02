// TODO: GitHub integration routes
// GET /api/github/repos - Get user repositories
// POST /api/github/create-pr - Create pull request
// GET /api/github/auth - OAuth authentication


import express from 'express'
import axios from 'axios'

const router = express.Router()


const githubAPI = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, 
    Accept: 'application/vnd.github+json'
  }
})

router.get('/repos', async(req,res)=>{
try{
const username = req.query.user
if(!username){
    return res.status(400).json({ error :'GitHub username is required'})
}
const response = await githubAPI.get(`/users/${username}/repos`)
    res.json({
      count: response.data.length,
      repos: response.data
    })
}
catch (error) {
    console.error(error.response?.data)

    if (error.response?.status === 404) {
      return res.status(404).json({ error: "User not found" })
    }

    res.status(500).json({ error: 'Failed to fetch repositories' })
  }
})

router.get('/repo', async (req, res) => {
  try {
    const { user, repo } = req.query
    
    if (!user || !repo) {
      return res.status(400).json({ error: "Missing 'user' or 'repo' parameter" })
    }

    const response = await githubAPI.get(`/repos/${user}/${repo}`)

    res.json(response.data)

  } catch (error) {
    console.error(error.response?.data)

    if (error.response?.status === 404) {
      return res.status(404).json({ error: "Repository not found" })
    }

    res.status(500).json({ error: 'Failed to fetch repository' })
  }
})


router.get('/repo', async (req, res) => {
  try {
    const { user, repo } = req.query
    
    if (!user || !repo) {
      return res.status(400).json({ error: "Missing 'user' or 'repo' parameter" })
    }

    const response = await githubAPI.get(`/repos/${user}/${repo}`)

    res.json(response.data)

  } catch (error) {
    console.error(error.response?.data)

    if (error.response?.status === 404) {
      return res.status(404).json({ error: "Repository not found" })
    }

    res.status(500).json({ error: 'Failed to fetch repository' })
  }
})

router.get('/repo', async (req, res) => {
  try {
    const { user, repo } = req.query
    
    if (!user || !repo) {
      return res.status(400).json({ error: "Missing 'user' or 'repo' parameter" })
    }

    const response = await githubAPI.get(`/repos/${user}/${repo}`)

    res.json(response.data)

  } catch (error) {
    console.error(error.response?.data)

    if (error.response?.status === 404) {
      return res.status(404).json({ error: "Repository not found" })
    }

    res.status(500).json({ error: 'Failed to fetch repository' })
  }
})


router.get('/repo', async (req, res) => {
  try {
    const { user, repo } = req.query
    
    if (!user || !repo) {
      return res.status(400).json({ error: "Missing 'user' or 'repo' parameter" })
    }

    const response = await githubAPI.get(`/repos/${user}/${repo}`)

    res.json(response.data)

  } catch (error) {
    console.error(error.response?.data)

    if (error.response?.status === 404) {
      return res.status(404).json({ error: "Repository not found" })
    }

    res.status(500).json({ error: 'Failed to fetch repository' })
  }
})

router.get('/repo', async (req, res) => {
  try {
    const { user, repo } = req.query
    
    if (!user || !repo) {
      return res.status(400).json({ error: "Missing 'user' or 'repo' parameter" })
    }

    const response = await githubAPI.get(`/repos/${user}/${repo}`)

    res.json(response.data)

  } catch (error) {
    console.error(error.response?.data)

    if (error.response?.status === 404) {
      return res.status(404).json({ error: "Repository not found" })
    }

    res.status(500).json({ error: 'Failed to fetch repository' })
  }
})


router.get('/repo', async (req, res) => {
  try {
    const { user, repo } = req.query
    
    if (!user || !repo) {
      return res.status(400).json({ error: "Missing 'user' or 'repo' parameter" })
    }

    const response = await githubAPI.get(`/repos/${user}/${repo}`)

    res.json(response.data)

    } catch (error) {
    console.error(error.response?.data)

    if (error.response?.status === 404) {
      return res.status(404).json({ error: "Repository not found" })
    }

    res.status(500).json({ error: 'Failed to fetch repository' })
  }
})


export default router



