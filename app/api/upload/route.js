import { getDatabase } from "@/lib/db"
import { createUploadModel } from "@/lib/models"
import { verifyToken, extractTokenFromHeader } from "@/lib/auth"
import { parseFileContent, validateFile } from "@/lib/file-processor"
import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = extractTokenFromHeader(authHeader)
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file")
    const projectId = formData.get("projectId")

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const validation = validateFile(file)
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const fileData = await parseFileContent(file)

    const db = await getDatabase()
    const uploadsCollection = await createUploadModel(db)

    const result = await uploadsCollection.insertOne({
      userId: decoded.userId,
      projectId,
      ...fileData,
      createdAt: new Date(),
    })

    return NextResponse.json({
      upload: {
        id: result.insertedId.toString(),
        ...fileData,
      },
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
