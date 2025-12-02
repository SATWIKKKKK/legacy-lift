import { MongoClient } from "mongodb"

const client = new MongoClient(process.env.MONGODB_URI)
let db = null

export async function getDatabase() {
  if (!db) {
    await client.connect()
    db = client.db(process.env.MONGODB_DB )
    console.log(" MongoDB connected")
  }
  return db
}
