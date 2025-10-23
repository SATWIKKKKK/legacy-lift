"use client"

import { useState, useCallback } from "react"

export function useRefactor() {
  const [analyzing, setAnalyzing] = useState(false)
  const [refactoring, setRefactoring] = useState(false)
  const [error, setError] = useState(null)

  const analyze = useCallback(async (code, language, token) => {
    try {
      setAnalyzing(true)
      setError(null)

      const response = await fetch("/api/refactor/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code, language }),
      })

      if (!response.ok) throw new Error("Analysis failed")

      const data = await response.json()
      return data.analysis
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setAnalyzing(false)
    }
  }, [])

  const refactor = useCallback(async (code, language, projectId, focusArea, token) => {
    try {
      setRefactoring(true)
      setError(null)

      const response = await fetch("/api/refactor/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code, language, projectId, focusArea }),
      })

      if (!response.ok) throw new Error("Refactoring failed")

      const data = await response.json()
      return data.diff
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setRefactoring(false)
    }
  }, [])

  return { analyze, refactor, analyzing, refactoring, error }
}
