# AI-Powered Legacy Code Refactor Assistant - Setup Guide

## Project Structure

\`\`\`
├── frontend/                 # Vite + React frontend
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js    # Axios client for backend API
│   │   ├── pages/           # React pages
│   │   ├── components/      # React components
│   │   └── main.jsx
│   ├── vite.config.js
│   └── package.json
│
├── backend/                  # Express.js backend
│   ├── routes/              # API routes
│   ├── models/              # MongoDB models
│   ├── server.js
│   └── package.json
│
└── README.md
\`\`\`

## Prerequisites

- Node.js 18+ and npm
- MongoDB (local or cloud)
- OpenAI API key (for AI refactoring)
- GitHub token (optional, for GitHub integration)

## Installation

### 1. Backend Setup

\`\`\`bash
cd backend
npm install
\`\`\`

Create `.env` file in backend directory:
\`\`\`
MONGODB_URI=mongodb://localhost:27017/code-refactor
MONGODB_DB=code-refactor
JWT_SECRET=your_jwt_secret_key_here
OPENAI_API_KEY=your_openai_api_key
GITHUB_TOKEN=your_github_token_optional
PORT=5000
\`\`\`

Start the backend:
\`\`\`bash
npm run dev
\`\`\`

The backend will run on `http://localhost:5000`

### 2. Frontend Setup

\`\`\`bash
cd frontend
npm install
\`\`\`

Create `.env.local` file in frontend directory:
\`\`\`
VITE_API_URL=http://localhost:5000
\`\`\`

Start the frontend:
\`\`\`bash
npm run dev
\`\`\`

The frontend will run on `http://localhost:5173`

## Features

- **User Authentication**: Register and login with JWT tokens
- **Project Management**: Create and manage refactoring projects
- **File Upload**: Upload code files for analysis
- **AI Refactoring**: Use OpenAI to refactor code with intelligent suggestions
- **Diff Viewer**: Side-by-side comparison of original and refactored code
- **GitHub Integration**: Create pull requests with refactored code
- **Version History**: Track all refactoring versions

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `POST /api/projects/:id/upload` - Upload files

### Refactoring
- `POST /api/refactor/:projectId/refactor` - Start refactoring
- `POST /api/refactor/:projectId/version/:versionId/file/:fileIndex/accept` - Accept changes
- `POST /api/refactor/:projectId/version/:versionId/file/:fileIndex/reject` - Reject changes

### GitHub
- `POST /api/github/auth` - Store GitHub token
- `GET /api/github/repos` - List GitHub repositories
- `POST /api/github/create-pr` - Create pull request

## Environment Variables

### Backend (.env)
- `MONGODB_URI` - MongoDB connection string
- `MONGODB_DB` - Database name
- `JWT_SECRET` - Secret key for JWT tokens
- `OPENAI_API_KEY` - OpenAI API key for AI refactoring
- `GITHUB_TOKEN` - GitHub personal access token (optional)
- `PORT` - Server port (default: 5000)

### Frontend (.env.local)
- `VITE_API_URL` - Backend API URL (default: http://localhost:5000)

## Deployment

### Deploy Backend to Vercel
\`\`\`bash
cd backend
vercel deploy
\`\`\`

### Deploy Frontend to Vercel
\`\`\`bash
cd frontend
vercel deploy
\`\`\`

Update `VITE_API_URL` in frontend environment variables to point to deployed backend.

## Troubleshooting

**Backend won't start:**
- Check MongoDB connection string
- Ensure port 5000 is available
- Check all environment variables are set

**Frontend can't connect to backend:**
- Verify backend is running on port 5000
- Check `VITE_API_URL` in frontend .env.local
- Check browser console for CORS errors

**AI refactoring not working:**
- Verify OpenAI API key is valid
- Check API key has sufficient credits
- Review backend logs for errors

## License

MIT
