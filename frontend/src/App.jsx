

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
import ProtectedRoute from "./components/ProtectedRoute"
import "./App.css"

function AppContent() {
  const location = useLocation()
  const isWebGLPage = location.pathname === "/webgl" || location.pathname === "/webgl-test"
  const isLoginPage = location.pathname === "/login"

  return (
    <div className="min-h-screen bg-black text-white">
      {!isWebGLPage && !isLoginPage && <Header />}
      <Routes>
        <Route path="/login" element={<Login setIsAuthenticated={() => {}} />} />
        
        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/projects" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
        <Route path="/demo" element={<ProtectedRoute><GlowingDemo /></ProtectedRoute>} />
        <Route path="/webgl" element={<ProtectedRoute><WebGLDemo /></ProtectedRoute>} />
        <Route path="/webgl-test" element={<ProtectedRoute><WebGLTest /></ProtectedRoute>} />
        <Route path="/project/:projectId" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
        <Route path="/project/:projectId/version/:versionId" element={<ProtectedRoute><DiffViewer /></ProtectedRoute>} />
        
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
      {!isWebGLPage && !isLoginPage && <Footer />}
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
