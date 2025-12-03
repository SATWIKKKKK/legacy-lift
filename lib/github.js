export async function createGitHubClient(token) {
  // GitHub API client using fetch
  return {
    async createBranch(owner, repo, baseBranch, newBranch) {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs`, {
        method: "POST",
        headers: {
          Authorization: `token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ref: `refs/heads/${newBranch}`,
          sha: await this.getRefSha(owner, repo, baseBranch),
        }),
      })
      return response.json()
    },

    async getRefSha(owner, repo, ref) {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${ref}`, {
        headers: {
          Authorization: `token ${token}`,
        },
      })
      const data = await response.json()
      return data.object.sha
    },

    async createCommit(owner, repo, branch, message, files) {
      const tree = await this.createTree(owner, repo, files)
      const parentSha = await this.getRefSha(owner, repo, branch)

      const commitResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/commits`, {
        method: "POST",
        headers: {
          Authorization: `token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          tree: tree.sha,
          parents: [parentSha],
        }),
      })

      const commit = await commitResponse.json()

      await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branch}`, {
        method: "PATCH",
        headers: {
          Authorization: `token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sha: commit.sha,
        }),
      })

      return commit
    },

    async createTree(owner, repo, files) {
      const tree = files.map((file) => ({
        path: file.path,
        mode: "100644",
        type: "blob",
        content: file.content,
      }))

      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees`, {
        method: "POST",
        headers: {
          Authorization: `token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tree }),
      })

      return response.json()
    },

    async createPullRequest(owner, repo, title, body, head, base) {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
        method: "POST",
        headers: {
          Authorization: `token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          body,
          head,
          base,
        }),
      })

      return response.json()
    },

    async getUser() {
      const response = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `token ${token}`,
        },
      })
      return response.json()
    },

    async getRepositories() {
      const response = await fetch("https://api.github.com/user/repos?per_page=100", {
        headers: {
          Authorization: `token ${token}`,
        },
      })
      return response.json()
    },
  }
}


