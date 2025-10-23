import { generateText } from "ai"

export async function analyzeCode(code, language) {
  const { text } = await generateText({
    model: "openai/gpt-4o-mini",
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

export async function refactorCode(code, language, focusArea = "general") {
  const { text } = await generateText({
    model: "openai/gpt-4o-mini",
    prompt: `Refactor this ${language} code focusing on ${focusArea}:

\`\`\`${language.toLowerCase()}
${code}
\`\`\`

Provide:
1. The refactored code
2. A summary of changes made
3. Explanation of improvements

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
