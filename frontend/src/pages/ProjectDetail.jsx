"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import apiClient from "../api/client"

export default function ProjectDetail() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refactoring, setRefactoring] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await apiClient.get(`/projects/${projectId}`)
        setProject(response.data)
      } catch (err) {
        setError("Failed to load project")
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [projectId])

  const handleRefactor = async () => {
    setRefactoring(true)
    setError("")

    try {
      const files = project.uploadedFiles.map((file) => ({
        filename: file.originalName,
        content: `// Sample code from ${file.originalName}`,
      }))

      const response = await apiClient.post(`/refactor/${projectId}/refactor`, { files })

      setProject(response.data.project)
      navigate(`/project/${projectId}/version/${response.data.version._id}`)
    } catch (err) {
      setError(err.response?.data?.error || "Refactoring failed")
    } finally {
      setRefactoring(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-8">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate("/")} className="mb-6 text-gray-400 hover:text-white transition">
          ← Back to Dashboard
        </button>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-2">{project?.name}</h1>
          <p className="text-gray-400 mb-6">{project?.description}</p>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Uploaded Files</h2>
            <div className="space-y-2">
              {project?.uploadedFiles.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
                  <span className="text-gray-300">{file.originalName}</span>
                  <span className="text-gray-500 text-sm">{(file.size / 1024).toFixed(2)} KB</span>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6">{error}</div>
          )}

          <button
            onClick={handleRefactor}
            disabled={refactoring}
            className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-lg font-semibold transition"
          >
            {refactoring ? "Refactoring with AI..." : "Start AI Refactoring"}
          </button>

          {project?.versions && project.versions.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-white mb-4">Previous Versions</h2>
              <div className="space-y-2">
                {project.versions.map((version, idx) => (
                  <button
                    key={idx}
                    onClick={() => navigate(`/project/${projectId}/version/${version._id}`)}
                    className="w-full text-left bg-gray-700 hover:bg-gray-600 p-3 rounded-lg transition"
                  >
                    <p className="text-white font-semibold">Version {version.versionNumber}</p>
                    <p className="text-gray-400 text-sm">{new Date(version.createdAt).toLocaleDateString()}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
