const SUPPORTED_LANGUAGES = {
  js: "JavaScript",
  jsx: "JSX",
  ts: "TypeScript",
  tsx: "TSX",
  py: "Python",
  java: "Java",
  cpp: "C++",
  c: "C",
  cs: "C#",
  php: "PHP",
  rb: "Ruby",
  go: "Go",
  rs: "Rust",
  kt: "Kotlin",
  swift: "Swift",
  m: "Objective-C",
  scala: "Scala",
  sh: "Shell",
  sql: "SQL",
  html: "HTML",
  css: "CSS",
  json: "JSON",
  xml: "XML",
  yaml: "YAML",
}

export function detectLanguage(filename) {
  const ext = filename.split(".").pop().toLowerCase()
  return SUPPORTED_LANGUAGES[ext] || "Unknown"
}

export function validateFile(file) {
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    return { valid: false, error: "File size exceeds 10MB limit" }
  }

  const language = detectLanguage(file.originalname || file.name)
  if (language === "Unknown") {
    return { valid: false, error: "Unsupported file type" }
  }

  return { valid: true, language }
}

export async function parseFileContent(file) {
  // Handle both browser File objects and multer files
  let content;
  if (file.buffer) {
    // Multer file (server-side)
    content = file.buffer.toString('utf-8')
  } else if (file.text) {
    // Browser File object (client-side)
    content = await file.text()
  } else {
    throw new Error('Invalid file format')
  }
  
  const lines = content.split("\n").length
  const language = detectLanguage(file.originalname || file.name)

  return {
    filename: file.originalname || file.name,
    content,
    language,
    lines,
    size: file.size,
  }
}
