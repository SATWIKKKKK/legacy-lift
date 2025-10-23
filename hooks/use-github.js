"use client"

import { useState, useCallback } from "react"

export function useGitHub() {
  const [connecting, setConnecting] = useState(false)
  const [creatingPr, setCreatingPr] = useState(false)
  const [error, setError] = useState(null)

  const connectGitHub = useCallback(async (githubToken, token) => {
    try {
      setConnecting(true)
      setError(null)

      const response = await fetch("/api/github/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ githubToken }),
      })

      if (!response.ok) throw new Error("Failed to connect GitHub")

      return await response.json()
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setConnecting(false)
    }
  }, [])

  const getRepositories = useCallback(async (token) => {
    try {
      setError(null)

      const response = await fetch("/api/github/repos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error("Failed to get repositories")

      const data = await response.json()
      return data.repos
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [])

  const createPullRequest = useCallback(async (diffId, owner, repo, baseBranch, title, description, token) => {
    try {
      setCreatingPr(true)
      setError(null)

      const response = await fetch("/api/github/create-pr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          diffId,
          owner,
          repo,
          baseBranch,
          title,
          description,
        }),
      })

      if (!response.ok) throw new Error("Failed to create pull request")

      return await response.json()
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setCreatingPr(false)
    }
  }, [])

  return {
    connectGitHub,
    getRepositories,
    createPullRequest,
    connecting,
    creatingPr,
    error,
  }
}
