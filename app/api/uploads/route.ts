import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    const uploads = await db
      .collection("uploads")
      .find({ userId: new ObjectId(userId) })
      .sort({ uploadedAt: -1 })
      .toArray()

    return NextResponse.json(uploads)
  } catch (error) {
    console.error("Error fetching uploads:", error)
    return NextResponse.json({ error: "Failed to fetch uploads" }, { status: 500 })
  }
}
