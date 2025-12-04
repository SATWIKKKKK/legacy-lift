import { getDatabase } from './lib/db.js'

console.log('Testing MongoDB connection...')

try {
  const db = await getDatabase()
  console.log('✅ MongoDB connected successfully!')
  console.log('Database name:', db.databaseName)
  
  // Test creating a user
  const users = db.collection('users')
  const testUser = {
    email: 'test@example.com',
    password: 'hashedpassword',
    name: 'Test User',
    createdAt: new Date()
  }
  
  const result = await users.insertOne(testUser)
  console.log('✅ Test user created with ID:', result.insertedId)
  
  // Clean up
  await users.deleteOne({ _id: result.insertedId })
  console.log('✅ Test user deleted')
  
  console.log('\n🎉 All tests passed! Backend is ready.')
  process.exit(0)
} catch (error) {
  console.error('❌ Error:', error.message)
  console.error('Stack:', error.stack)
  process.exit(1)
}
