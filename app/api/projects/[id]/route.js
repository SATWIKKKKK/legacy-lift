import { getDatabase } from "@/lib/db"
import { createProjectModel, createDiffModel } from "@/lib/models"
import { verifyToken, extractTokenFromHeader } from "@/lib/auth"
import { ObjectId } from "mongodb"
import { NextResponse } from "next/server"

export async function GET(request, { params }) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = extractTokenFromHeader(authHeader)
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()
    const projectsCollection = await createProjectModel(db)
    const diffsCollection = await createDiffModel(db)

    const project = await projectsCollection.findOne({
      _id: new ObjectId(params.id),
      userId: decoded.userId,
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const diffs = await diffsCollection.find({ projectId: params.id }).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({
      project: {
        ...project,
        id: project._id.toString(),
      },
      diffs: diffs.map((d) => ({
        ...d,
        id: d._id.toString(),
      })),
    })
  } catch (error) {
    console.error("Get project error:", error)
    return NextResponse.json({ error: "Failed to get project" }, { status: 500 })
  }
}
