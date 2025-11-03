

import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom"
import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import ProjectDetail from "./pages/ProjectDetail"
import Upload from "./pages/Upload"
import DiffViewer from "./pages/DiffViewer"
import Login from "./pages/Login"
import GlowingDemo from "./pages/GlowingDemo"
import WebGLDemo from "./pages/WebGLDemo"
import WebGLTest from "./pages/WebGLTest"
import Header from "./components/Header"
import Footer from "./components/Footer"
import "./App.css"

function AppContent() {
  const location = useLocation()
  const isWebGLPage = location.pathname === "/webgl" || location.pathname === "/webgl-test"

  return (
    <div className="min-h-screen bg-black text-white">
      {!isWebGLPage && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<Dashboard />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/demo" element={<GlowingDemo />} />
        <Route path="/webgl" element={<WebGLDemo />} />
        <Route path="/webgl-test" element={<WebGLTest />} />
        <Route path="/project/:projectId" element={<ProjectDetail />} />
        <Route path="/project/:projectId/version/:versionId" element={<DiffViewer />} />
        <Route path="/login" element={<Login setIsAuthenticated={() => {}} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      {!isWebGLPage && <Footer />}
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
