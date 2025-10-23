import { getDatabase } from "@/lib/db"
import { createUserModel, createDiffModel } from "@/lib/models"
import { verifyToken, extractTokenFromHeader } from "@/lib/auth"
import { createGitHubClient } from "@/lib/github"
import { ObjectId } from "mongodb"
import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = extractTokenFromHeader(authHeader)
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { diffId, owner, repo, baseBranch, title, description } = await request.json()

    if (!diffId || !owner || !repo || !baseBranch) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = await getDatabase()
    const usersCollection = await createUserModel(db)
    const diffsCollection = await createDiffModel(db)

    const user = await usersCollection.findOne({
      _id: new ObjectId(decoded.userId),
    })

    if (!user || !user.githubToken) {
      return NextResponse.json({ error: "GitHub not connected" }, { status: 400 })
    }

    const diff = await diffsCollection.findOne({
      _id: new ObjectId(diffId),
    })

    if (!diff) {
      return NextResponse.json({ error: "Diff not found" }, { status: 404 })
    }

    const github = await createGitHubClient(user.githubToken)

    const branchName = `refactor/${Date.now()}`
    await github.createBranch(owner, repo, baseBranch, branchName)

    const fileName = `refactored-${Date.now()}.${diff.language.toLowerCase()}`
    await github.createCommit(owner, repo, branchName, "AI-powered code refactoring", [
      {
        path: fileName,
        content: diff.refactoredCode,
      },
    ])

    const prBody = `## AI-Powered Code Refactoring

**Summary:** ${diff.summary}

**Explanation:** ${diff.explanation}

**Original Code:**
\`\`\`${diff.language.toLowerCase()}
${diff.originalCode}
\`\`\`

**Refactored Code:**
\`\`\`${diff.language.toLowerCase()}
${diff.refactoredCode}
\`\`\``

    const pr = await github.createPullRequest(
      owner,
      repo,
      title || "AI Code Refactoring",
      prBody,
      branchName,
      baseBranch,
    )

    await diffsCollection.updateOne(
      { _id: new ObjectId(diffId) },
      {
        $set: {
          githubPrUrl: pr.html_url,
          githubPrNumber: pr.number,
          status: "pr-created",
          updatedAt: new Date(),
        },
      },
    )

    return NextResponse.json({
      pr: {
        url: pr.html_url,
        number: pr.number,
      },
    })
  } catch (error) {
    console.error("Create PR error:", error)
    return NextResponse.json({ error: "Failed to create pull request" }, { status: 500 })
  }
}
