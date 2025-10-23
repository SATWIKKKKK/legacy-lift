import { getDatabase } from "@/lib/db"
import { createUserModel } from "@/lib/models"
import { verifyToken, extractTokenFromHeader } from "@/lib/auth"
import { createGitHubClient } from "@/lib/github"
import { ObjectId } from "mongodb"
import { NextResponse } from "next/server"

export async function GET(request) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = extractTokenFromHeader(authHeader)
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()
    const usersCollection = await createUserModel(db)

    const user = await usersCollection.findOne({
      _id: new ObjectId(decoded.userId),
    })

    if (!user || !user.githubToken) {
      return NextResponse.json({ error: "GitHub not connected" }, { status: 400 })
    }

    const github = await createGitHubClient(user.githubToken)
    const repos = await github.getRepositories()

    return NextResponse.json({ repos })
  } catch (error) {
    console.error("Get repos error:", error)
    return NextResponse.json({ error: "Failed to get repositories" }, { status: 500 })
  }
}
