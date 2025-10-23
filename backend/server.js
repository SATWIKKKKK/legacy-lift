import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"
import { WebSocketServer } from "ws"
import http from "http"
import multer from "multer"
import path from "path"
import { fileURLToPath } from "url"

// Load environment variables
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const server = http.createServer(app)
const wss = new WebSocketServer({ server })

// Middleware
app.use(cors())
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ limit: "50mb" }))

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/code-refactor", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

// Multer setup for file uploads
const upload = multer({ dest: "uploads/" })

// Import routes
import userRoutes from "./routes/users.js"
import projectRoutes from "./routes/projects.js"
import refactorRoutes from "./routes/refactor.js"
import githubRoutes from "./routes/github.js"

// Use routes
app.use("/api/users", userRoutes)
app.use("/api/projects", projectRoutes)
app.use("/api/refactor", refactorRoutes)
app.use("/api/github", githubRoutes)

// WebSocket connection handling
wss.on("connection", (ws) => {
  console.log("Client connected")

  ws.on("message", (message) => {
    const data = JSON.parse(message)
    console.log("Received:", data)

    // Broadcast to all clients
    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify(data))
      }
    })
  })

  ws.on("close", () => {
    console.log("Client disconnected")
  })
})

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" })
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
