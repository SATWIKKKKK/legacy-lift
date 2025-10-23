# AI-Powered Legacy Code Refactor Assistant - Setup Guide

## Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Clerk account (for authentication)
- Anthropic API key (for Claude)
- GitHub token (for PR generation)

## Backend Setup

1. **Install dependencies:**
   \`\`\`bash
   cd backend
   npm install express cors dotenv mongoose multer @anthropic-ai/sdk @octokit/rest ws
   \`\`\`

2. **Create `.env` file:**
   \`\`\`
   MONGODB_URI=mongodb://localhost:27017/code-refactor
   ANTHROPIC_API_KEY=your_anthropic_key
   GITHUB_TOKEN=your_github_token
   PORT=5000
   \`\`\`

3. **Start MongoDB:**
   \`\`\`bash
   mongod
   \`\`\`

4. **Run backend:**
   \`\`\`bash
   node server.js
   \`\`\`

## Frontend Setup

1. **Install dependencies:**
   \`\`\`bash
   cd frontend
   npm install
   \`\`\`

2. **Create `.env` file:**
   \`\`\`
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
   VITE_API_URL=http://localhost:5000
   \`\`\`

3. **Run frontend:**
   \`\`\`bash
   npm run dev
   \`\`\`

## Features

- **Authentication**: Clerk-based user authentication
- **File Upload**: Upload multiple code files for refactoring
- **AI Refactoring**: Claude AI analyzes and refactors code
- **Diff Viewer**: Side-by-side comparison of original vs refactored code
- **Accept/Reject**: Line-by-line or file-by-file change approval
- **GitHub Integration**: Create pull requests with refactored code
- **Dashboard**: Track refactoring history and versions
- **Real-time Updates**: WebSocket support for live updates

## API Endpoints

### Users
- `POST /api/users/sync` - Sync user with Clerk
- `GET /api/users/:clerkId` - Get user profile

### Projects
- `POST /api/projects` - Create project
- `GET /api/projects/user/:userId` - Get user projects
- `GET /api/projects/:projectId` - Get project details
- `POST /api/projects/:projectId/upload` - Upload files

### Refactoring
- `POST /api/refactor/:projectId/refactor` - Start refactoring
- `POST /api/refactor/:projectId/version/:versionId/file/:fileIndex/accept` - Accept changes
- `POST /api/refactor/:projectId/version/:versionId/file/:fileIndex/reject` - Reject changes

### GitHub
- `POST /api/github/:projectId/create-pr` - Create GitHub PR

## Deployment

### Backend (Vercel)
\`\`\`bash
vercel deploy
\`\`\`

### Frontend (Vercel)
\`\`\`bash
cd frontend
vercel deploy
\`\`\`

## Troubleshooting

- **MongoDB Connection Error**: Ensure MongoDB is running
- **Clerk Auth Error**: Verify VITE_CLERK_PUBLISHABLE_KEY is correct
- **API Connection Error**: Check CORS settings and API URL
- **AI Refactoring Timeout**: Increase timeout in axios config

## Next Steps

1. Add more AI models (GPT-4, Gemini)
2. Implement batch refactoring
3. Add code quality metrics
4. Create team collaboration features
5. Add custom refactoring rules
