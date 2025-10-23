import { analyzeCode } from "@/lib/ai-refactor"
import { verifyToken, extractTokenFromHeader } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = extractTokenFromHeader(authHeader)
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { code, language } = await request.json()

    if (!code || !language) {
      return NextResponse.json({ error: "Missing code or language" }, { status: 400 })
    }

    const analysis = await analyzeCode(code, language)

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 })
  }
}
