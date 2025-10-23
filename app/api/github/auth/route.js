import { getDatabase } from "@/lib/db"
import { createUserModel } from "@/lib/models"
import { verifyToken, extractTokenFromHeader } from "@/lib/auth"
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

    const { githubToken } = await request.json()

    if (!githubToken) {
      return NextResponse.json({ error: "GitHub token required" }, { status: 400 })
    }

    const db = await getDatabase()
    const usersCollection = await createUserModel(db)

    await usersCollection.updateOne(
      { _id: new ObjectId(decoded.userId) },
      {
        $set: {
          githubToken,
          githubConnectedAt: new Date(),
        },
      },
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("GitHub auth error:", error)
    return NextResponse.json({ error: "Failed to connect GitHub" }, { status: 500 })
  }
}
