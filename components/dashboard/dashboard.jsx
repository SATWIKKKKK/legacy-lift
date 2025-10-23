"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import ProjectList from "./project-list"
import UploadSection from "./upload-section"

export default function Dashboard() {
  const { user, token, logout } = useAuth()
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [view, setView] = useState("projects")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      fetchProjects()
    }
  }, [token])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/projects", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setProjects(data.projects)
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProject = async (name, description) => {
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description }),
      })
      if (response.ok) {
        const data = await response.json()
        setProjects([data.project, ...projects])
        setView("projects")
      }
    } catch (error) {
      console.error("Failed to create project:", error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">AI Legacy Refactor Assistant</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.name}</span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-destructive text-destructive-foreground rounded hover:opacity-90 transition-opacity"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setView("projects")}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              view === "projects"
                ? "bg-primary text-primary-foreground"
                : "bg-card text-foreground border border-border hover:bg-muted"
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => setView("upload")}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              view === "upload"
                ? "bg-primary text-primary-foreground"
                : "bg-card text-foreground border border-border hover:bg-muted"
            }`}
          >
            Upload & Refactor
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : view === "projects" ? (
          <ProjectList projects={projects} onSelectProject={setSelectedProject} onCreateProject={handleCreateProject} />
        ) : (
          <UploadSection projects={projects} onProjectCreated={handleCreateProject} />
        )}
      </div>
    </div>
  )
}
