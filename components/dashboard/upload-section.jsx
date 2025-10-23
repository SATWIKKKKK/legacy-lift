"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useFileUpload } from "@/hooks/use-file-upload"
import { useRefactor } from "@/hooks/use-refactor"
import DiffViewer from "./diff-viewer"

export default function UploadSection({ projects, onProjectCreated }) {
  const { token } = useAuth()
  const { upload } = useFileUpload()
  const { refactor, refactoring } = useRefactor()
  const [selectedProject, setSelectedProject] = useState("")
  const [file, setFile] = useState(null)
  const [focusArea, setFocusArea] = useState("general")
  const [diff, setDiff] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleFileChange = (e) => {
    setFile(e.target.files?.[0] || null)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setFile(e.dataTransfer.files?.[0] || null)
  }

  const handleRefactor = async (e) => {
    e.preventDefault()
    if (!file || !selectedProject) {
      setError("Please select a file and project")
      return
    }

    try {
      setLoading(true)
      setError("")

      const fileContent = await file.text()
      const language = file.name.split(".").pop()

      const result = await refactor(fileContent, language, selectedProject, focusArea, token)

      setDiff(result)
      setFile(null)
    } catch (err) {
      setError(err.message || "Refactoring failed")
    } finally {
      setLoading(false)
    }
  }

  if (diff) {
    return <DiffViewer diff={diff} onBack={() => setDiff(null)} />
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-bold text-foreground">Upload & Refactor Code</h2>

        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive rounded text-destructive text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleRefactor} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Select Project</label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full px-4 py-2 bg-background border border-border rounded text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">Choose a project...</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Focus Area</label>
            <select
              value={focusArea}
              onChange={(e) => setFocusArea(e.target.value)}
              className="w-full px-4 py-2 bg-background border border-border rounded text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="general">General Improvements</option>
              <option value="performance">Performance</option>
              <option value="readability">Readability</option>
              <option value="security">Security</option>
              <option value="modernization">Modernization</option>
            </select>
          </div>

          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
          >
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id="file-input"
              accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.cs,.php,.rb,.go,.rs,.kt,.swift,.m,.scala,.sh,.sql,.html,.css,.json,.xml,.yaml"
            />
            <label htmlFor="file-input" className="cursor-pointer">
              <p className="text-foreground font-medium">{file ? file.name : "Drag and drop your code file here"}</p>
              <p className="text-sm text-muted-foreground mt-2">or click to select a file</p>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !file || !selectedProject}
            className="w-full bg-primary text-primary-foreground py-2 rounded font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {loading ? "Refactoring..." : "Refactor Code"}
          </button>
        </form>
      </div>
    </div>
  )
}
