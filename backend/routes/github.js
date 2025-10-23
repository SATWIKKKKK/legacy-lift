import express from "express"
import { Octokit } from "@octokit/rest"
import Version from "../models/Version.js"

const router = express.Router()

// Create GitHub PR
router.post("/:projectId/create-pr", async (req, res) => {
  try {
    const { projectId, versionId, githubToken, owner, repo, branch } = req.body

    const octokit = new Octokit({ auth: githubToken })

    const version = await Version.findById(versionId)
    if (!version) return res.status(404).json({ error: "Version not found" })

    // Create a new branch
    const baseBranch = await octokit.repos.getBranch({
      owner,
      repo,
      branch: "main",
    })

    const newBranchName = `refactor/ai-${Date.now()}`

    await octokit.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${newBranchName}`,
      sha: baseBranch.data.commit.sha,
    })

    // Create commits for each file
    for (const file of version.files) {
      if (file.status === "accepted") {
        const fileContent = Buffer.from(file.refactoredCode).toString("base64")

        await octokit.repos.createOrUpdateFileContents({
          owner,
          repo,
          path: file.filename,
          message: `Refactor: ${file.filename}`,
          content: fileContent,
          branch: newBranchName,
        })
      }
    }

    // Create PR
    const pr = await octokit.pulls.create({
      owner,
      repo,
      title: `AI Code Refactoring - Version ${version.versionNumber}`,
      body: `Automated code refactoring by AI Assistant\n\n${version.summary}`,
      head: newBranchName,
      base: "main",
    })

    res.json({ pr: pr.data })
  } catch (error) {
    console.error("GitHub PR error:", error)
    res.status(500).json({ error: error.message })
  }
})

export default router
