import { getDatabase } from "@/lib/db"
import { createUserModel } from "@/lib/models"
import { hashPassword, generateToken } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = await getDatabase()
    const usersCollection = await createUserModel(db)

    const existingUser = await usersCollection.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    const hashedPassword = hashPassword(password)
    const result = await usersCollection.insertOne({
      email,
      password: hashedPassword,
      name,
      createdAt: new Date(),
    })

    const token = generateToken(result.insertedId.toString())

    return NextResponse.json({
      user: {
        id: result.insertedId.toString(),
        email,
        name,
      },
      token,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
