import express from "express"
import User from "../models/User.js"

const router = express.Router()

// Create or update user
router.post("/sync", async (req, res) => {
  try {
    const { clerkId, email, name, avatar } = req.body

    let user = await User.findOne({ clerkId })

    if (!user) {
      user = new User({ clerkId, email, name, avatar })
    } else {
      user.email = email
      user.name = name
      user.avatar = avatar
      user.updatedAt = new Date()
    }

    await user.save()
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get user profile
router.get("/:clerkId", async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.params.clerkId })
    if (!user) return res.status(404).json({ error: "User not found" })
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
