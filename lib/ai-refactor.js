import { generateText } from "ai"
import { createGroq } from "@ai-sdk/groq"
import * as Diff from 'diff'

// Initialize Groq
const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY
})

// Configuration
const AI_CONFIG = {
  model: process.env.AI_MODEL || 'llama-3.3-70b-versatile',
  tokens: 8000,
  temperature: 0.3,
}

// Check API key exists
if (!process.env.GROQ_API_KEY) {
  console.warn("GROQ_API_KEY not found. AI features will not work.")
}

// Supported languages
const SUPPORTED_LANGUAGES = [
  'javascript',
  'typescript',
  'python',
  'java',
  'jsx',
  'tsx',
  'c',
  'cpp',
  'csharp',
  'go',
  'rust',
  'php',
  'ruby',
  'css',
  'scss',
  'html',
  'json'
]

function validateLanguage(language) {
  const normalized = language.toLowerCase()
  if (!SUPPORTED_LANGUAGES.includes(normalized)) {
    throw new Error(
      `Language "${language}" not supported. Supported: ${SUPPORTED_LANGUAGES.join(', ')}`
    )
  }
  return normalized
}

//CODE ANALYSIS
export async function analyzeCode(code, language) {
  if (!code || code.trim().length === 0) {
    throw new Error("Code cannot be empty")
  }
  
  // Validate language
  language = validateLanguage(language)
  
  try {
    const { text } = await generateText({
      model: groq(AI_CONFIG.model),
      temperature: AI_CONFIG.temperature,
      maxTokens: AI_CONFIG.tokens,
      prompt: `Analyze this ${language} code and identify areas for improvement:

\`\`\`${language.toLowerCase()}
${code}
\`\`\`

Provide a brief analysis of:
1. Code quality issues
2. Performance improvements
3. Best practices violations
4. Security concerns
5. Readability improvements`,
  })

  return text
} 
catch (error) {
  console.error(" AI Analysis Error:", error.message)
  throw new Error(`Failed to analyze code: ${error.message}`)
}
}

export async function refactorCode(code, language, focusArea = "general") {
  // Validate input
  if (!code || code.trim().length === 0) {
    throw new Error("Code cannot be empty")
  }
  
  if (!language) {
    throw new Error("Language must be specified")
  }
  
  // Validate language
  language = validateLanguage(language)
  
  try {
    const { text } = await generateText({
      model: groq(AI_CONFIG.model),
      temperature: AI_CONFIG.temperature,
      maxTokens: AI_CONFIG.tokens,
      prompt: `Refactor this ${language} code focusing on ${focusArea}:

\`\`\`${language.toLowerCase()}
${code}
\`\`\`

Provide:
1. The refactored code
2. A summary of changes made
3. Explanation of improvements and bugs

Format your response as:
REFACTORED_CODE:
\`\`\`${language.toLowerCase()}
[refactored code here]
\`\`\`

SUMMARY:
[summary of changes]

EXPLANATION:
[detailed explanation]`,
    })

    return parseRefactoringResponse(text)
  } catch (error) {
    console.error(" AI Refactoring Error:", error.message)
    throw new Error(`Failed to refactor code: ${error.message}`)
  }
}


function parseRefactoringResponse(response) {
  const codeMatch = response.match(/REFACTORED_CODE:\s*```[\w]*\n([\s\S]*?)```/)
  const summaryMatch = response.match(/SUMMARY:\n([\s\S]*?)(?=EXPLANATION:|$)/)
  const explanationMatch = response.match(/EXPLANATION:\n([\s\S]*)/)

  return {
    refactoredCode: codeMatch ? codeMatch[1].trim() : "",
    summary: summaryMatch ? summaryMatch[1].trim() : "",
    explanation: explanationMatch ? explanationMatch[1].trim() : "",
  }
}





export async function generateDiff(originalCode, refactoredCode) {
  try {
    // Create unified diff
    const diffPatch = Diff.createTwoFilesPatch(
      'original',
      'refactored',
      originalCode,
      refactoredCode,
      'Original Code',
      'Refactored Code'
    )
    
    // Parse into structured format
    const changes = Diff.parsePatch(diffPatch)[0]
    
    // Extract additions and deletions
    const additions = []
    const deletions = []
    const modifications = []
    
    if (changes && changes.hunks) {
      changes.hunks.forEach(hunk => {
        hunk.lines.forEach((line, index) => {
          if (line.startsWith('+') && !line.startsWith('+++')) {
            additions.push({
              content: line.substring(1),
              lineNumber: hunk.newStart + index
            })
          } else if (line.startsWith('-') && !line.startsWith('---')) {
      deletions.push({
        content: line.substring(1),
        lineNumber: hunk.oldStart + index
      })
    }
    })
    })
  }

   return {
      diffPatch,
      additions,
      deletions,
      totalChanges: additions.length + deletions.length,
      stats: {
        addedLines: additions.length,
        deletedLines: deletions.length,
        modifiedLines: modifications.length
      }
    }
  } 
  catch (error) {
    console.error("Diff Generation Error:", error.message)
    return {
      diffPatch: '',
      additions: [],
      deletions: [],
      totalChanges: 0,
      stats: { addedLines: 0, deletedLines: 0, modifiedLines: 0 }
    }
  }
}

// PULL REQUEST REVIEW
export async function reviewPullRequest(prDiff, language) {
  try {
    const { text } = await generateText({
      model: groq(AI_CONFIG.model),
      temperature: 0.3,
      maxTokens: 4000,
      prompt: `You are an expert code reviewer. Review this ${language} pull request diff:

\`\`\`diff
${prDiff}
\`\`\`

Provide a comprehensive code review with:

##  Overall Quality Score
Rate the code quality from 1-10 and explain why.

##  What's Good
List the positive aspects of this code.

##  Potential Issues
Identify any bugs, code smells, or anti-patterns.

## Suggestions for Improvement
Provide specific, actionable recommendations.

##  Security Concerns
Highlight any security vulnerabilities or risks.

##  Performance Considerations
Discuss performance implications and optimizations.

##  Final Recommendation
Should this PR be approved, approved with changes, or rejected?

Format your response in clear markdown.`
    })

    return text
  } catch (error) {
    console.error("PR Review Error:", error.message)
    throw new Error(`Failed to review PR: ${error.message}`)
  }
}