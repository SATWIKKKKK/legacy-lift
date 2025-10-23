import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { projectId, originalCode } = body

    if (!projectId || !originalCode) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Update project status to processing
    await db.collection("projects").updateOne(
      {
        _id: new ObjectId(projectId),
        userId: new ObjectId(userId),
      },
      { $set: { status: "processing", updatedAt: new Date() } },
    )

    // TODO: Call AI refactoring engine here
    // For now, return a placeholder response
    const refactoredCode = `// Refactored code will be generated here\n${originalCode}`

    // Update project with refactored code
    const result = await db.collection("projects").findOneAndUpdate(
      {
        _id: new ObjectId(projectId),
        userId: new ObjectId(userId),
      },
      {
        $set: {
          refactoredCode,
          status: "completed",
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    )

    return NextResponse.json(result.value)
  } catch (error) {
    console.error("Error refactoring code:", error)
    return NextResponse.json({ error: "Failed to refactor code" }, { status: 500 })
  }
}
