"use client"

import { useState, useCallback } from "react"

export function useFileUpload() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)

  const upload = useCallback(async (file, projectId, token) => {
    try {
      setUploading(true)
      setError(null)
      setProgress(0)

      const formData = new FormData()
      formData.append("file", file)
      formData.append("projectId", projectId)

      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) throw new Error("Upload failed")

      const data = await response.json()
      setProgress(100)

      return data.upload
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setUploading(false)
    }
  }, [])

  return { upload, uploading, progress, error }
}
