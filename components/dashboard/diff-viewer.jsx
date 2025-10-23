"use client"

import { useState } from "react"
import GitHubIntegration from "./github-integration"

export default function DiffViewer({ diff, onBack }) {
  const [prCreated, setPrCreated] = useState(null)

  if (prCreated) {
    return (
      <div className="space-y-6">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-card border border-border rounded text-foreground hover:bg-muted transition-colors"
        >
          ← Back
        </button>

        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-2xl">✓</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Pull Request Created!</h2>
              <p className="text-sm text-muted-foreground">Your refactored code has been pushed to GitHub</p>
            </div>
          </div>

          <a
            href={prCreated.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity"
          >
            View Pull Request #{prCreated.number}
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="px-4 py-2 bg-card border border-border rounded text-foreground hover:bg-muted transition-colors"
      >
        ← Back
      </button>

      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-bold text-foreground">Refactoring Results</h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Summary</h3>
            <p className="text-sm text-muted-foreground bg-background p-3 rounded">{diff.summary}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Explanation</h3>
            <p className="text-sm text-muted-foreground bg-background p-3 rounded">{diff.explanation}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6 space-y-2">
          <h3 className="text-sm font-semibold text-foreground">Original Code</h3>
          <pre className="bg-background p-4 rounded text-xs text-muted-foreground overflow-auto max-h-96">
            {diff.originalCode}
          </pre>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 space-y-2">
          <h3 className="text-sm font-semibold text-foreground">Refactored Code</h3>
          <pre className="bg-background p-4 rounded text-xs text-accent overflow-auto max-h-96">
            {diff.refactoredCode}
          </pre>
        </div>
      </div>

      <div className="flex gap-4">
        <button className="flex-1 bg-primary text-primary-foreground py-2 rounded font-medium hover:opacity-90 transition-opacity">
          Accept Changes
        </button>
        <button className="flex-1 bg-destructive text-destructive-foreground py-2 rounded font-medium hover:opacity-90 transition-opacity">
          Reject Changes
        </button>
      </div>

      <GitHubIntegration diff={diff} onPrCreated={setPrCreated} />
    </div>
  )
}
