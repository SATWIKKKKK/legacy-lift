"use client"

import { useState } from "react"
import { useGitHub } from "@/hooks/use-github"
import { useAuth } from "@/hooks/use-auth"

export default function GitHubIntegration({ diff, onPrCreated }) {
  const { token } = useAuth()
  const { connectGitHub, getRepositories, createPullRequest, creatingPr } = useGitHub()
  const [githubToken, setGithubToken] = useState("")
  const [showTokenInput, setShowTokenInput] = useState(false)
  const [repos, setRepos] = useState([])
  const [selectedRepo, setSelectedRepo] = useState("")
  const [baseBranch, setBaseBranch] = useState("main")
  const [prTitle, setPrTitle] = useState("AI Code Refactoring")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleConnectGitHub = async () => {
    try {
      setLoading(true)
      setError("")

      await connectGitHub(githubToken, token)
      const repositories = await getRepositories(token)
      setRepos(repositories)
      setShowTokenInput(false)
      setGithubToken("")
    } catch (err) {
      setError(err.message || "Failed to connect GitHub")
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePr = async () => {
    if (!selectedRepo) {
      setError("Please select a repository")
      return
    }

    try {
      setLoading(true)
      setError("")

      const [owner, repoName] = selectedRepo.split("/")
      const result = await createPullRequest(diff.id, owner, repoName, baseBranch, prTitle, "", token)

      onPrCreated(result.pr)
    } catch (err) {
      setError(err.message || "Failed to create pull request")
    } finally {
      setLoading(false)
    }
  }

  if (repos.length === 0 && !showTokenInput) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Create GitHub Pull Request</h3>
        <p className="text-sm text-muted-foreground">
          Connect your GitHub account to create a pull request with the refactored code.
        </p>
        <button
          onClick={() => setShowTokenInput(true)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity"
        >
          Connect GitHub
        </button>
      </div>
    )
  }

  if (showTokenInput) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Connect GitHub</h3>
        <p className="text-sm text-muted-foreground">
          Create a personal access token at{" "}
          <a
            href="https://github.com/settings/tokens"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            github.com/settings/tokens
          </a>
        </p>

        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive rounded text-destructive text-sm">
            {error}
          </div>
        )}

        <input
          type="password"
          value={githubToken}
          onChange={(e) => setGithubToken(e.target.value)}
          placeholder="Paste your GitHub token here"
          className="w-full px-4 py-2 bg-background border border-border rounded text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <div className="flex gap-2">
          <button
            onClick={handleConnectGitHub}
            disabled={loading || !githubToken}
            className="flex-1 bg-primary text-primary-foreground py-2 rounded font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {loading ? "Connecting..." : "Connect"}
          </button>
          <button
            onClick={() => {
              setShowTokenInput(false)
              setGithubToken("")
            }}
            className="flex-1 bg-card border border-border text-foreground py-2 rounded font-medium hover:bg-muted transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Create GitHub Pull Request</h3>

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive rounded text-destructive text-sm">{error}</div>
      )}

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Repository</label>
        <select
          value={selectedRepo}
          onChange={(e) => setSelectedRepo(e.target.value)}
          className="w-full px-4 py-2 bg-background border border-border rounded text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Select a repository...</option>
          {repos.map((repo) => (
            <option key={repo.id} value={`${repo.owner.login}/${repo.name}`}>
              {repo.owner.login}/{repo.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Base Branch</label>
        <input
          type="text"
          value={baseBranch}
          onChange={(e) => setBaseBranch(e.target.value)}
          className="w-full px-4 py-2 bg-background border border-border rounded text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="main"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">PR Title</label>
        <input
          type="text"
          value={prTitle}
          onChange={(e) => setPrTitle(e.target.value)}
          className="w-full px-4 py-2 bg-background border border-border rounded text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="AI Code Refactoring"
        />
      </div>

      <button
        onClick={handleCreatePr}
        disabled={creatingPr || !selectedRepo}
        className="w-full bg-primary text-primary-foreground py-2 rounded font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
      >
        {creatingPr ? "Creating PR..." : "Create Pull Request"}
      </button>

      <button
        onClick={() => setRepos([])}
        className="w-full bg-card border border-border text-foreground py-2 rounded font-medium hover:bg-muted transition-colors"
      >
        Disconnect GitHub
      </button>
    </div>
  )
}
