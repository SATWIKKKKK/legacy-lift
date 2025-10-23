

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import ProjectDetail from "./pages/ProjectDetail"
import Upload from "./pages/Upload"
import DiffViewer from "./pages/DiffViewer"
import Login from "./pages/Login"
import Navigation from "./components/Navigation"
import "./App.css"

function App() {
  // Auth disabled for now - direct access to all pages
  const isAuthenticated = true

  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        <Navigation />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/project/:projectId" element={<ProjectDetail />} />
          <Route path="/project/:projectId/version/:versionId" element={<DiffViewer />} />
          <Route path="/login" element={<Login setIsAuthenticated={() => {}} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
