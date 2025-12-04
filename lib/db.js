import { MongoClient } from "mongodb"

let client = null
let db = null

export async function getDatabase() {
  if (!db) {
    // Create client on first call (after env vars are loaded)
    if (!client) {
      const uri = process.env.MONGODB_URI
      
      if (!uri) {
        throw new Error("MONGODB_URI environment variable is not set")
      }
      
      client = new MongoClient(uri)
    }
    
    await client.connect()
    db = client.db(process.env.MONGODB_DB )
    console.log(" MongoDB connected successfully")
  }
  return db
}
