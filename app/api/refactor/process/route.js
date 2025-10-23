import { getDatabase } from "@/lib/db"
import { createDiffModel } from "@/lib/models"
import { verifyToken, extractTokenFromHeader } from "@/lib/auth"
import { refactorCode } from "@/lib/ai-refactor"
import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = extractTokenFromHeader(authHeader)
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { code, language, projectId, focusArea } = await request.json()

    if (!code || !language || !projectId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const refactored = await refactorCode(code, language, focusArea)

    const db = await getDatabase()
    const diffsCollection = await createDiffModel(db)

    const result = await diffsCollection.insertOne({
      projectId,
      userId: decoded.userId,
      originalCode: code,
      refactoredCode: refactored.refactoredCode,
      language,
      summary: refactored.summary,
      explanation: refactored.explanation,
      status: "pending",
      createdAt: new Date(),
    })

    return NextResponse.json({
      diff: {
        id: result.insertedId.toString(),
        ...refactored,
      },
    })
  } catch (error) {
    console.error("Refactor error:", error)
    return NextResponse.json({ error: "Refactoring failed" }, { status: 500 })
  }
}
