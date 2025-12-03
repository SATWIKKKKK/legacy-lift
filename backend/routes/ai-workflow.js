import express from 'express'
import { refactorCode } from '../../lib/ai-refactor.js'
import { createGitHubClient } from '../../lib/github.js'
import { getDatabase } from '../../lib/db.js'
import { verifyToken, extractTokenFromHeader } from '../../lib/auth.js'

const router = express.Router()

// POST /api/workflow/refactor-to-pr - Complete workflow: AI refactor → GitHub PR
router.post('/refactor-to-pr', async (req, res) => {
    try {
        const token = extractTokenFromHeader(req.headers.authorization)
        const decoded = verifyToken(token)
        if (!decoded) return res.status(401).json({ error: 'Unauthorized' })

        const {
            code,
            language,
            projectId,
            focusArea = 'general',
            // GitHub info
            owner,
            repo,
            filename,
            githubToken
        } = req.body

        // Validation
        if (!code || !language || !projectId) {
            return res.status(400).json({ 
                error: 'Missing required fields: code, language, projectId' 
            })
        }

        if (!owner || !repo || !filename || !githubToken) {
            return res.status(400).json({ 
                error: 'Missing GitHub fields: owner, repo, filename, githubToken' 
            })
        }

        console.log(' Step 1: AI Refactoring...')
        const refactored = await refactorCode(code, language, focusArea)

        console.log(' Step 2: Saving to database...')
        const db = await getDatabase()
        
        const diffResult = await db.collection('diffs').insertOne({
            projectId,
            userId: decoded.userId,
            originalCode: code,
            refactoredCode: refactored.refactoredCode,
            language,
            summary: refactored.summary,
            explanation: refactored.explanation,
            status: 'completed',
            createdAt: new Date()
        })

        console.log(' Step 3: Creating GitHub branch...')
        const github = await createGitHubClient(githubToken)
        const newBranch = `refactor-${Date.now()}`
        
        await github.createBranch(owner, repo, 'main', newBranch)

        console.log(' Step 4: Committing refactored code...')
        await github.createCommit(
            owner, 
            repo, 
            newBranch,
            `🤖 AI refactored ${filename}`,
            [{ 
                path: filename, 
                content: refactored.refactoredCode 
            }]
        )

        console.log('Step 5: Creating pull request...')
        const pr = await github.createPullRequest(
            owner,
            repo,
            `🤖 AI Refactoring: ${filename}`,
            `## 📊 Summary\n${refactored.summary}\n\n## 💡 Improvements\n${refactored.explanation}\n\n---\n✨ Powered by LegacyLift AI`,
            newBranch,
            'main'
        )

        console.log(' Workflow complete!')

        res.status(201).json({
            success: true,
            message: 'Code refactored and PR created successfully!',
            diff: {
                id: diffResult.insertedId.toString(),
                summary: refactored.summary,
                explanation: refactored.explanation
            },
            github: {
                branch: newBranch,
                pullRequest: {
                    number: pr.number,
                    url: pr.html_url,
                    title: pr.title
                }
            }
        })

    } catch (error) {
        console.error(' Workflow error:', error)
        res.status(500).json({ 
            error: error.message || 'Workflow failed',
            details: error.stack
        })
    }
})

// POST /api/workflow/refactor-multiple - Refactor multiple files at once
router.post('/refactor-multiple', async (req, res) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization)
    const decoded = verifyToken(token)
    if (!decoded) return res.status(401).json({ error: 'Unauthorized' })

    const {
      files, // [{ path: 'src/app.js', content: 'code...' }]
      language,
      projectId,
      focusArea = 'general',
      owner,
      repo,
      githubToken
    } = req.body

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files provided' })
    }

    if (!owner || !repo || !githubToken) {
      return res.status(400).json({ error: 'Missing GitHub fields' })
    }

    console.log(`🤖 Refactoring ${files.length} files...`)

    const refactoredFiles = []
    const db = await getDatabase()

    // Refactor each file
    for (const file of files) {
      console.log(`  Processing ${file.path}...`)
      const refactored = await refactorCode(file.content, language, focusArea)
      
      // Save to DB
      await db.collection('diffs').insertOne({
        projectId,
        userId: decoded.userId,
        originalCode: file.content,
        refactoredCode: refactored.refactoredCode,
        language,
        fileName: file.path,
        summary: refactored.summary,
        explanation: refactored.explanation,
        status: 'completed',
        createdAt: new Date()
      })

      refactoredFiles.push({
        path: file.path,
        content: refactored.refactoredCode,
        summary: refactored.summary
      })
    }

    // Create GitHub PR with all files
    console.log(' Creating GitHub branch...')
    const github = await createGitHubClient(githubToken)
    const newBranch = `refactor-batch-${Date.now()}`
    
    await github.createBranch(owner, repo, 'main', newBranch)
    
    console.log(' Committing all files...')
    await github.createCommit(
      owner, 
      repo, 
      newBranch,
      ` AI refactored ${files.length} files`,
      refactoredFiles
    )

    const prBody = refactoredFiles.map(f => 
      `### 📄 ${f.path}\n${f.summary}\n`
    ).join('\n')

    console.log('🔀 Creating pull request...')
    const pr = await github.createPullRequest(
      owner, repo,
      ` Batch Refactoring: ${files.length} files`,
      `## 📊 Files Refactored\n\n${prBody}\n\n---\n Powered by LegacyLift AI`,
      newBranch,
      'main'
    )

    res.status(201).json({
      success: true,
      filesRefactored: files.length,
      github: {
        branch: newBranch,
        pullRequest: {
          number: pr.number,
          url: pr.html_url
        }
      }
    })

  } catch (error) {
    console.error('Batch refactor error:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/workflow/auto-merge - Auto-merge PR after checks pass
router.post('/auto-merge', async (req, res) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization)
    const decoded = verifyToken(token)
    if (!decoded) return res.status(401).json({ error: 'Unauthorized' })

    const {
      owner,
      repo,
      prNumber,
      githubToken,
      mergeMethod = 'squash' // 'merge', 'squash', 'rebase'
    } = req.body

    if (!owner || !repo || !prNumber || !githubToken) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Merge the PR
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/merge`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `token ${githubToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          merge_method: mergeMethod,
          commit_title: ' Auto-merged by LegacyLift',
          commit_message: 'AI-approved changes merged automatically'
        })
      }
    )

    const result = await response.json()

    res.json({
      success: response.ok,
      merged: result.merged,
      message: result.message,
      sha: result.sha
    })

  } catch (error) {
    console.error('Auto-merge error:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router