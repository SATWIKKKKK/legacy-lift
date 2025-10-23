"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"


export default function DiffViewer() {
  const { projectId, versionId } = useParams()
  const navigate = useNavigate()
  const [version, setVersion] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentFileIndex, setCurrentFileIndex] = useState(0)

  useEffect(() => {
    const fetchVersion = async () => {
      try {
        const response = await apiClient.get(`/projects/${projectId}`)
        const foundVersion = response.data.versions.find((v) => v._id === versionId)
        setVersion(foundVersion)
      } catch (error) {
        console.error("Error fetching version:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchVersion()
  }, [projectId, versionId])

  const handleAccept = async () => {
    try {
      await apiClient.post(`/refactor/${projectId}/version/${versionId}/file/${currentFileIndex}/accept`)
      alert("Changes accepted!")
    } catch (error) {
      console.error("Error accepting changes:", error)
    }
  }

  const handleReject = async () => {
    try {
      await apiClient.post(`/refactor/${projectId}/version/${versionId}/file/${currentFileIndex}/reject`)
      alert("Changes rejected!")
    } catch (error) {
      console.error("Error rejecting changes:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!version) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-8">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Version not found</p>
          <button
            onClick={() => navigate(`/project/${projectId}`)}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
          >
            Back to Project
          </button>
        </div>
      </div>
    )
  }

  const currentFile = version.files[currentFileIndex]

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(`/project/${projectId}`)}
          className="mb-6 text-gray-400 hover:text-white transition"
        >
          ← Back to Project
        </button>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">Version {version.versionNumber} - Diff Viewer</h1>
          <p className="text-gray-400">{version.summary}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <h2 className="text-white font-semibold mb-4">Files</h2>
              <div className="space-y-2">
                {version.files.map((file, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentFileIndex(idx)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition ${
                      idx === currentFileIndex
                        ? "bg-purple-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    <p className="text-sm font-mono truncate">{file.filename}</p>
                    <p className="text-xs mt-1">
                      {file.status === "accepted" && <span className="text-green-400">✓ Accepted</span>}
                      {file.status === "rejected" && <span className="text-red-400">✗ Rejected</span>}
                      {file.status === "pending" && <span className="text-yellow-400">⊙ Pending</span>}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            {currentFile && (
              <div className="space-y-6">
                <DiffViewerComponent
                  oldCode={currentFile.originalCode}
                  newCode={currentFile.refactoredCode}
                  filename={currentFile.filename}
                />

                <div className="flex gap-4">
                  <button
                    onClick={handleAccept}
                    className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
                  >
                    Accept Changes
                  </button>
                  <button
                    onClick={handleReject}
                    className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
                  >
                    Reject Changes
                  </button>
                </div>

                {currentFile.changes && currentFile.changes.length > 0 && (
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-3">AI Suggestions</h3>
                    <div className="bg-gray-700 rounded p-3 text-gray-300 text-sm max-h-48 overflow-y-auto">
                      {currentFile.changes[0]}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
