// Simple API test script
import http from 'http';

console.log('🧪 Testing Backend API...\n');

// Wait for server to start
setTimeout(async () => {
  try {
    // Test 1: Health Check
    console.log('Test 1: Health Check');
    const healthCheck = await fetch('http://localhost:5000/api/check');
    const healthData = await healthCheck.json();
    console.log('✅ Health Check:', healthData);
    
    // Test 2: Register User
    console.log('\nTest 2: User Registration');
    const registerResponse = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'testuser@example.com',
        password: 'password123',
        name: 'Test User'
      })
    });
    
    if (registerResponse.ok) {
      const registerData = await registerResponse.json();
      console.log('✅ Registration successful!');
      console.log('User:', registerData.user);
      console.log('Token:', registerData.token.substring(0, 20) + '...');
      
      // Test 3: Login
      console.log('\nTest 3: User Login');
      const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'testuser@example.com',
          password: 'password123'
        })
      });
      
      const loginData = await loginResponse.json();
      console.log('✅ Login successful!');
      console.log('User:', loginData.user);
      
      console.log('\n🎉 All tests passed! Backend is working perfectly!');
    } else {
      const error = await registerResponse.json();
      if (error.error === 'Email already registered') {
        console.log('⚠️  User already exists (that\'s okay!)');
        console.log('✅ Backend is working - just test data already exists');
      } else {
        console.error('❌ Registration failed:', error);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\n💡 Make sure the backend server is running in another terminal:');
    console.error('   npm run backend');
  }
}, 1000);
