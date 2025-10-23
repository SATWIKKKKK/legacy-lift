import express from "express"
import multer from "multer"
import Project from "../models/Project.js"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = express.Router()
const upload = multer({ dest: "uploads/" })

// Create project
router.post("/", async (req, res) => {
  try {
    const { userId, name, description, githubUrl } = req.body

    const project = new Project({
      userId,
      name,
      description,
      githubUrl,
    })

    await project.save()
    res.json(project)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get user projects
router.get("/user/:userId", async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.params.userId }).populate("versions").sort({ createdAt: -1 })
    res.json(projects)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get single project
router.get("/:projectId", async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId).populate("versions")
    if (!project) return res.status(404).json({ error: "Project not found" })
    res.json(project)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Upload files
router.post("/:projectId/upload", upload.single("file"), async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId)
    if (!project) return res.status(404).json({ error: "Project not found" })

    project.uploadedFiles.push({
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      uploadedAt: new Date(),
    })

    await project.save()
    res.json(project)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
