import express from 'express'
import { createGitHubClient } from '../../lib/github.js'
import { verifyToken, extractTokenFromHeader } from '../../lib/auth.js'

const router = express.Router()

// GET /api/github/user - Get authenticated GitHub user
router.get('/user', async (req, res) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization)
    const decoded = verifyToken(token)
    if (!decoded) return res.status(401).json({ error: 'Unauthorized' })

    const githubToken = req.headers['x-github-token'] || process.env.GITHUB_TOKEN
    if (!githubToken) {
      return res.status(400).json({ error: 'GitHub token required' })
    }

    const github = await createGitHubClient(githubToken)
    const user = await github.getUser()

    res.json({ user })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch GitHub user' })
  }
})

// GET /api/github/repos - Get user's repositories
router.get('/repos', async (req, res) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization)
    const decoded = verifyToken(token)
    if (!decoded) return res.status(401).json({ error: 'Unauthorized' })

    const githubToken = req.headers['x-github-token'] || process.env.GITHUB_TOKEN
    if (!githubToken) {
      return res.status(400).json({ error: 'GitHub token required' })
    }

    const github = await createGitHubClient(githubToken)
    const repos = await github.getRepositories()

    res.json({ 
      count: repos.length,
      repos 
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch repositories' })
  }
})

// POST /api/github/create-branch - Create new branch
router.post('/create-branch', async (req, res) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization)
    const decoded = verifyToken(token)
    if (!decoded) return res.status(401).json({ error: 'Unauthorized' })

    const { owner, repo, baseBranch, newBranch } = req.body

    if (!owner || !repo || !baseBranch || !newBranch) {
      return res.status(400).json({ 
        error: 'Missing required fields: owner, repo, baseBranch, newBranch' 
      })
    }

    const githubToken = req.headers['x-github-token'] || process.env.GITHUB_TOKEN
    if (!githubToken) {
      return res.status(400).json({ error: 'GitHub token required' })
    }

    const github = await createGitHubClient(githubToken)
    const branch = await github.createBranch(owner, repo, baseBranch, newBranch)

    res.status(201).json({ branch })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to create branch' })
  }
})

// POST /api/github/commit - Create commit with files
router.post('/commit', async (req, res) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization)
    const decoded = verifyToken(token)
    if (!decoded) return res.status(401).json({ error: 'Unauthorized' })

    const { owner, repo, branch, message, files } = req.body

    if (!owner || !repo || !branch || !message || !files) {
      return res.status(400).json({ 
        error: 'Missing required fields: owner, repo, branch, message, files' 
      })
    }

    const githubToken = req.headers['x-github-token'] 
    if (!githubToken) {
      return res.status(400).json({ error: 'GitHub token required' })
    }

    const github = await createGitHubClient(githubToken)
    const commit = await github.createCommit(owner, repo, branch, message, files)

    res.status(201).json({ commit })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to create commit' })
  }
})

// POST /api/github/create-pr - Create pull request
router.post('/create-pr', async (req, res) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization)
    const decoded = verifyToken(token)
    if (!decoded) return res.status(401).json({ error: 'Unauthorized' })

    const { owner, repo, title, body, head, base } = req.body

    if (!owner || !repo || !title || !head || !base) {
      return res.status(400).json({ 
        error: 'Missing required fields: owner, repo, title, head, base' 
      })
    }

    const githubToken = req.headers['x-github-token'] 
    if (!githubToken) {
      return res.status(400).json({ error: 'GitHub token required' })
    }

    const github = await createGitHubClient(githubToken)
    const pr = await github.createPullRequest(owner, repo, title, body || '', head, base)

    res.status(201).json({
      pullRequest: {
        number: pr.number,
        url: pr.html_url,
        title: pr.title,
        state: pr.state
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to create pull request' })
  }
})

// POST /api/github/refactor-and-pr - branch + commit + PR
router.post('/refactor-and-pr', async (req, res) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization)
    const decoded = verifyToken(token)
    if (!decoded) return res.status(401).json({ error: 'Unauthorized' })

    const { 
      owner, 
      repo, 
      baseBranch = 'main',
      refactoredFiles, // [{ path: 'src/app.js', content: 'refactored code' }]
      commitMessage = 'AI-powered code refactoring',
      prTitle = 'Refactored legacy code',
      prBody = 'Automated refactoring using LegacyLift AI'
    } = req.body

     if (!owner || !repo || !refactoredFiles || refactoredFiles.length === 0) {
      return res.status(400).json({ 
        error: 'Missing required fields: owner, repo, refactoredFiles' 
      })
    }

    const githubToken = req.headers['x-github-token'] || process.env.GITHUB_TOKEN
    if (!githubToken) {
      return res.status(400).json({ error: 'GitHub token required' })
    }

    const github = await createGitHubClient(githubToken)
    const newBranch = `refactor-${Date.now()}`

    // Step 1: Create new branch
    await github.createBranch(owner, repo, baseBranch, newBranch)

    // Step 2: Commit refactored files
    await github.createCommit(owner, repo, newBranch, commitMessage, refactoredFiles)

    // Step 3: Create pull request
    const pr = await github.createPullRequest(
      owner, 
      repo, 
      prTitle, 
      prBody, 
      newBranch, 
      baseBranch
    )

    res.status(201).json({
      success: true,
      branch: newBranch,
      pullRequest: {
        number: pr.number,
        url: pr.html_url,
        title: pr.title
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message || 'Workflow failed' })
  }
})
export default router