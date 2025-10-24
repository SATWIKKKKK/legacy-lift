

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import ProjectDetail from "./pages/ProjectDetail"
import Upload from "./pages/Upload"
import DiffViewer from "./pages/DiffViewer"
import Login from "./pages/Login"
import Header from "./components/Header"
import Footer from "./components/Footer"
import "./App.css"

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Dashboard />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/project/:projectId" element={<ProjectDetail />} />
          <Route path="/project/:projectId/version/:versionId" element={<DiffViewer />} />
          <Route path="/login" element={<Login setIsAuthenticated={() => {}} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App
