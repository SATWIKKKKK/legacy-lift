import express from "express"
import Project from "../models/Project.js"
import Version from "../models/Version.js"
import { Anthropic } from "@anthropic-ai/sdk"

const router = express.Router()
const client = new Anthropic()

// Refactor code
router.post("/:projectId/refactor", async (req, res) => {
  try {
    const { projectId } = req.params
    const { files } = req.body

    const project = await Project.findById(projectId)
    if (!project) return res.status(404).json({ error: "Project not found" })

    project.status = "processing"
    await project.save()

    // Get latest version number
    const latestVersion = await Version.findOne({ projectId }).sort({ versionNumber: -1 })
    const versionNumber = (latestVersion?.versionNumber || 0) + 1

    const refactoredFiles = []
    const suggestions = []

    for (const file of files) {
      const prompt = `You are an expert code refactoring assistant. Analyze the following code and provide:
1. A refactored version that improves maintainability, modularity, and follows modern best practices
2. Key improvements made
3. Suggestions for further optimization

Original Code:
\`\`\`
${file.content}
\`\`\`

Provide the refactored code in a code block and list the improvements.`

      const message = await client.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 4096,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      })

      const responseText = message.content[0].text
      const codeMatch = responseText.match(/```(?:js|javascript)?\n([\s\S]*?)\n```/)
      const refactoredCode = codeMatch ? codeMatch[1] : responseText

      refactoredFiles.push({
        filename: file.filename,
        originalCode: file.content,
        refactoredCode,
        changes: [responseText],
        status: "pending",
      })

      suggestions.push(`${file.filename}: ${responseText.substring(0, 200)}...`)
    }

    const version = new Version({
      projectId,
      versionNumber,
      files: refactoredFiles,
      summary: `Refactored ${files.length} files with AI suggestions`,
      aiSuggestions: suggestions,
    })

    await version.save()

    project.versions.push(version._id)
    project.status = "completed"
    await project.save()

    res.json({ version, project })
  } catch (error) {
    console.error("Refactor error:", error)
    res.status(500).json({ error: error.message })
  }
})

// Accept/Reject changes
router.post("/:projectId/version/:versionId/file/:fileIndex/accept", async (req, res) => {
  try {
    const { projectId, versionId, fileIndex } = req.params

    const version = await Version.findById(versionId)
    if (!version) return res.status(404).json({ error: "Version not found" })

    version.files[fileIndex].status = "accepted"
    await version.save()

    res.json(version)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post("/:projectId/version/:versionId/file/:fileIndex/reject", async (req, res) => {
  try {
    const { projectId, versionId, fileIndex } = req.params

    const version = await Version.findById(versionId)
    if (!version) return res.status(404).json({ error: "Version not found" })

    version.files[fileIndex].status = "rejected"
    await version.save()

    res.json(version)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
