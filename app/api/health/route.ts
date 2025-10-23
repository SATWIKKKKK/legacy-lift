import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    await db.admin().ping()
    return NextResponse.json({ status: "ok", message: "Database connected" })
  } catch (error) {
    console.error("Health check failed:", error)
    return NextResponse.json({ status: "error", message: "Database connection failed" }, { status: 500 })
  }
}
