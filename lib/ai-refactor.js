import * as Diff from 'diff'

// OpenRouter Configuration
const OPENROUTER_CONFIG = {
  apiKey: process.env.OPENROUTER_API_KEY,
  baseUrl: 'https://openrouter.ai/api/v1',
  model: process.env.AI_MODEL || 'anthropic/claude-3-haiku', // Best value model
  maxTokens: 4096,
  temperature: 0.3,
}

// Check API key exists
if (!process.env.OPENROUTER_API_KEY) {
  console.warn("OPENROUTER_API_KEY not found. AI features will not work.")
}

// Helper function to call OpenRouter API
async function callOpenRouter(messages, maxTokens = OPENROUTER_CONFIG.maxTokens) {
  const response = await fetch(`${OPENROUTER_CONFIG.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_CONFIG.apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost:3002',
      'X-Title': 'LegacyLift Code Refactoring'
    },
    body: JSON.stringify({
      model: OPENROUTER_CONFIG.model,
      messages: messages,
      max_tokens: maxTokens,
      temperature: OPENROUTER_CONFIG.temperature,
    })
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error?.message || `OpenRouter API error: ${response.status}`)
  }

  const data = await response.json()
  return data.choices[0]?.message?.content || ''
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
    const text = await callOpenRouter([
      {
        role: 'system',
        content: 'You are an expert code analyst. Provide detailed, helpful analysis of code quality, performance, security, and best practices.'
      },
      {
        role: 'user',
        content: `Analyze this ${language} code and identify areas for improvement:

\`\`\`${language.toLowerCase()}
${code}
\`\`\`

Provide a detailed analysis of:
1. **Code Quality Issues** - Any bugs, errors, or problematic patterns
2. **Performance Improvements** - Ways to optimize speed and efficiency
3. **Best Practices Violations** - Deviations from standard conventions
4. **Security Concerns** - Potential vulnerabilities
5. **Readability Improvements** - How to make the code cleaner

Be specific and provide examples where possible.`
      }
    ])

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
    const text = await callOpenRouter([
      {
        role: 'system',
        content: `You are an expert software engineer specializing in code refactoring and modernization. You write clean, efficient, well-documented code following industry best practices.`
      },
      {
        role: 'user',
        content: `Refactor this ${language} code focusing on ${focusArea}:

\`\`\`${language.toLowerCase()}
${code}
\`\`\`

Please provide:
1. The complete refactored code
2. A summary of all changes made
3. Detailed explanation of each improvement

Format your response EXACTLY as:

REFACTORED_CODE:
\`\`\`${language.toLowerCase()}
[your refactored code here]
\`\`\`

SUMMARY:
[bullet points of changes]

EXPLANATION:
[detailed explanation of improvements, why they matter, and any potential bugs fixed]`
      }
    ])

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