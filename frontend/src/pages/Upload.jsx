"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import apiClient from "../api/client"

export default function Upload() {
  const navigate = useNavigate()
  const [projectName, setProjectName] = useState("")
  const [description, setDescription] = useState("")
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const projectRes = await apiClient.post("/projects", {
        name: projectName,
        description,
      })

      const projectId = projectRes.data._id

      // Upload files
      for (const file of files) {
        const formData = new FormData()
        formData.append("file", file)

        await apiClient.post(`/projects/${projectId}/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
      }

      navigate(`/project/${projectId}`)
    } catch (err) {
      setError(err.response?.data?.error || "Upload failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create New Project</h1>
          <p className="text-gray-400 mb-8">Upload your codebase for AI-powered refactoring</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white font-semibold mb-2">Project Name</label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                required
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-600"
                placeholder="My Legacy Project"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-600 h-24"
                placeholder="Describe your project..."
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Upload Files</label>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-purple-600 transition cursor-pointer">
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-input"
                  accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.go,.rb,.php"
                />
                <label htmlFor="file-input" className="cursor-pointer">
                  <p className="text-gray-400 mb-2">Drag and drop files or click to select</p>
                  <p className="text-sm text-gray-500">Supported: JS, TS, Python, Java, C++, Go, Ruby, PHP</p>
                </label>
              </div>
              {files.length > 0 && (
                <div className="mt-4">
                  <p className="text-white font-semibold mb-2">Selected Files ({files.length}):</p>
                  <ul className="space-y-1">
                    {files.map((file, idx) => (
                      <li key={idx} className="text-gray-400 text-sm">
                        {file.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {error && <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg">{error}</div>}

            <button
              type="submit"
              disabled={loading || !projectName || files.length === 0}
              className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-lg font-semibold transition"
            >
              {loading ? "Creating Project..." : "Create Project"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
