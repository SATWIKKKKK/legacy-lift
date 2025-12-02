import 'dotenv/config'
import { analyzeCode, refactorCode, generateDiff } from './lib/ai-refactor.js'

const testCode = `
function calculateSum(numbers) {
  var total = 0;
  for (var i = 0; i < numbers.length; i++) {
    total = total + numbers[i];
  }
  return total;
}

const result = calculateSum([1, 2, 3, 4, 5]);
console.log(result);
`

async function runTests() {
  console.log("🧪 Testing AI Refactoring System...\n")
  console.log("=" .repeat(60))
  
  try {
    // Test 1: Code Analysis
    console.log("\n📊 TEST 1: Analyzing JavaScript Code...")
    console.log("-".repeat(60))
    
    const analysis = await analyzeCode(testCode, 'javascript')
    
    console.log("✅ Analysis Complete!\n")
    console.log("📋 Analysis Result:")
    console.log(analysis)
    console.log("\n" + "=".repeat(60))
    
    // Test 2: Code Refactoring
    console.log("\n🔄 TEST 2: Refactoring Code (Focus: Modern ES6+)...")
    console.log("-".repeat(60))
    
    const refactorResult = await refactorCode(testCode, 'javascript', 'modern')
    
    console.log("✅ Refactoring Complete!\n")
    console.log("📝 REFACTORED CODE:")
    console.log("-".repeat(60))
    console.log(refactorResult.refactoredCode)
    console.log("-".repeat(60))
    
    console.log("\n📌 SUMMARY:")
    console.log(refactorResult.summary)
    
    console.log("\n💡 EXPLANATION:")
    console.log(refactorResult.explanation)
    console.log("\n" + "=".repeat(60))
    
    // Test 3: Generate Diff
    console.log("\n📊 TEST 3: Generating Diff Comparison...")
    console.log("-".repeat(60))
    
    const diff = await generateDiff(testCode, refactorResult.refactoredCode)
    
    console.log("✅ Diff Generated!\n")
    console.log("📈 STATISTICS:")
    console.log(`  ➕ Added Lines: ${diff.stats.addedLines}`)
    console.log(`  ➖ Deleted Lines: ${diff.stats.deletedLines}`)
    console.log(`  📊 Total Changes: ${diff.totalChanges}`)
    
    console.log("\n🔴 DELETIONS (Red Lines):")
    diff.deletions.forEach((del, i) => {
      console.log(`  Line ${del.lineNumber}: ${del.content}`)
    })
    
    console.log("\n🟢 ADDITIONS (Green Lines):")
    diff.additions.forEach((add, i) => {
      console.log(`  Line ${add.lineNumber}: ${add.content}`)
    })
    
    console.log("\n" + "=".repeat(60))
    console.log("\n✅ ALL TESTS PASSED! 🎉")
    console.log("\n🎯 Your AI refactoring system is working perfectly!")
    console.log("=" .repeat(60))
    
  } catch (error) {
    console.error("\n❌ TEST FAILED!")
    console.error("=" .repeat(60))
    console.error("Error:", error.message)
    console.error("\n📋 Troubleshooting:")
    console.error("  1. Check if GROQ_API_KEY is set in .env file")
    console.error("  2. Verify you ran: npm install groq-sdk diff")
    console.error("  3. Make sure you're connected to the internet")
    console.error("=" .repeat(60))
  }
}

// Run the tests
runTests()
