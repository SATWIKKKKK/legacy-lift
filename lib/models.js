export const Collections = {
  USERS: "users",
  PROJECTS: "projects",
  DIFFS: "diffs",
  UPLOADS: "uploads",
}

export async function createUserModel(db) {
  const collection = db.collection(Collections.USERS)
  await collection.createIndex({ email: 1 }, { unique: true })
  return collection
  
}

export async function createProjectModel(db) {
  const collection = db.collection(Collections.PROJECTS)
  await collection.createIndex({ userId: 1 })
  await collection.createIndex({ createdAt: -1 })
  return collection
}

export async function createDiffModel(db) {
  const collection = db.collection(Collections.DIFFS)
  await collection.createIndex({ projectId: 1 })
  await collection.createIndex({ createdAt: -1 })
  return collection
}

export async function createUploadModel(db) {
  const collection = db.collection(Collections.UPLOADS)
  await collection.createIndex({ userId: 1 })
  await collection.createIndex({ createdAt: -1 })
  return collection
}
