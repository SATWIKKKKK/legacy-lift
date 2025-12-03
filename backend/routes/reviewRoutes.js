import express from 'express'
import { createGitHubClient } from '../../lib/github.js'
import { analyzeCode, reviewPullRequest } from '../../lib/ai-refactor.js'
import { verifyToken, extractTokenFromHeader } from '../../lib/auth.js'

const router = express.Router()

// POST /api/review/pr - Add AI review comments to PR
router.post('/pr-review', async (req, res) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization)
    const decoded = verifyToken(token)
    if (!decoded) return res.status(401).json({ error: 'Unauthorized' })

    const {
      owner,
      repo,
      prNumber,
      files, 
      githubToken
    } = req.body

    if (!owner || !repo || !prNumber || !files || !githubToken) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const reviews = []

    // Analyze each file
    for (const file of files) {
      const analysis = await analyzeCode(file.content, file.language)
      
      // Post review comment
      const comment = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/comments`,
        {
          method: 'POST',
          headers: {
            'Authorization': `token ${githubToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            body: `## 🤖 AI Code Review\n\n${analysis}`,
            path: file.path,
            position: 1
          })
        }
      )

      reviews.push({
        file: file.path,
        reviewPosted: comment.ok
      })
    }

    res.json({
      success: true,
      reviews
    })

  } catch (error) {
    console.error('PR review error:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/review/bot - AI bot reviews entire PR
router.post('/bot', async (req, res) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization)
    const decoded = verifyToken(token)
    if (!decoded) return res.status(401).json({ error: 'Unauthorized' })

    const {
      owner,
      repo,
      prNumber,
      githubToken,
      language = 'javascript'
    } = req.body

    if (!owner || !repo || !prNumber || !githubToken) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Get PR diff from GitHub
    const diffResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`,
      {
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3.diff'
        }
      }
    )

    const prDiff = await diffResponse.text()

    // AI review
    const review = await reviewPullRequest(prDiff, language)

    // Post review as comment
    await fetch(
      `https://api.github.com/repos/${owner}/${repo}/issues/${prNumber}/comments`,
      {
        method: 'POST',
        headers: {
          'Authorization': `token ${githubToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          body: `## 🤖 AI Code Review Bot\n\n${review}`
        })
      }
    )

    res.json({
      success: true,
      review
    })

  } catch (error) {
    console.error('Bot review error:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/review/suggest - Create suggested changes on PR
router.post('/suggest', async (req, res) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization)
    const decoded = verifyToken(token)
    if (!decoded) return res.status(401).json({ error: 'Unauthorized' })

    const {
      owner,
      repo,
      prNumber,
      file,
      line,
      suggestion,
      githubToken
    } = req.body

    if (!owner || !repo || !prNumber || !file || !line || !suggestion || !githubToken) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Create suggestion comment
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/comments`,
      {
        method: 'POST',
        headers: {
          'Authorization': `token ${githubToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          body: `\`\`\`suggestion\n${suggestion}\n\`\`\``,
          path: file,
          line: line,
          side: 'RIGHT'
        })
      }
    )

    const result = await response.json()

    res.json({
      success: response.ok,
      message: response.ok ? 'Suggestion posted' : result.message
    })

  } catch (error) {
    console.error('Suggestion error:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router
