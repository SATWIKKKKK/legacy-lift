import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const userId = request.headers.get("x-user-id")
    const projectId = request.nextUrl.searchParams.get("projectId")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const query: any = { userId: new ObjectId(userId) }
    if (projectId) {
      query.projectId = new ObjectId(projectId)
    }

    const diffs = await db.collection("diffs").find(query).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(diffs)
  } catch (error) {
    console.error("Error fetching diffs:", error)
    return NextResponse.json({ error: "Failed to fetch diffs" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { projectId, originalCode, refactoredCode, diffSummary } = body

    if (!projectId || !originalCode || !refactoredCode) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const diff = {
      projectId: new ObjectId(projectId),
      userId: new ObjectId(userId),
      originalCode,
      refactoredCode,
      diffSummary: diffSummary || "Code refactoring changes",
      createdAt: new Date(),
    }

    const result = await db.collection("diffs").insertOne(diff)

    return NextResponse.json({ ...diff, _id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Error creating diff:", error)
    return NextResponse.json({ error: "Failed to create diff" }, { status: 500 })
  }
}
