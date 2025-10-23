import { getDatabase } from "@/lib/db"
import { createProjectModel } from "@/lib/models"
import { verifyToken, extractTokenFromHeader } from "@/lib/auth"
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
    const projectsCollection = await createProjectModel(db)

    const projects = await projectsCollection.find({ userId: decoded.userId }).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({ projects })
  } catch (error) {
    console.error("Get projects error:", error)
    return NextResponse.json({ error: "Failed to get projects" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = extractTokenFromHeader(authHeader)
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, description } = await request.json()

    const db = await getDatabase()
    const projectsCollection = await createProjectModel(db)

    const result = await projectsCollection.insertOne({
      userId: decoded.userId,
      name,
      description,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json({
      project: {
        id: result.insertedId.toString(),
        name,
        description,
        status: "active",
      },
    })
  } catch (error) {
    console.error("Create project error:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}
