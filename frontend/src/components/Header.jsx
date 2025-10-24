import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Menu, X, Plus, User } from "lucide-react"

export default function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Sidebar Toggle + Logo */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Menu className="w-6 h-6 text-gray-300" />
              </button>
              <Link to="/" className="flex items-center">
                <span className="text-2xl font-bold text-white">
                  LegacyLift
                </span>
              </Link>
            </div>

            {/* Center: Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link
                to="/"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Home
              </Link>
              <Link
                to="/dashboard"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/projects"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Projects
              </Link>
            </nav>

            {/* Right: Add Project + User */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/upload")}
                className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-200 rounded-lg transition-colors text-black font-medium"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Project</span>
              </button>
              <button className="p-2 rounded-full bg-white hover:bg-gray-200 transition-colors">
                <User className="w-5 h-5 text-black" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-gray-900 border-r border-gray-800 z-50 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <span className="text-xl font-bold text-white">
            LegacyLift
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          <Link
            to="/"
            onClick={() => setSidebarOpen(false)}
            className="block px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            Home
          </Link>
          <Link
            to="/dashboard"
            onClick={() => setSidebarOpen(false)}
            className="block px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            Dashboard
          </Link>
          <Link
            to="/projects"
            onClick={() => setSidebarOpen(false)}
            className="block px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            Projects
          </Link>
          <Link
            to="/upload"
            onClick={() => setSidebarOpen(false)}
            className="block px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            Upload Project
          </Link>
          <div className="pt-4 mt-4 border-t border-gray-800">
            <button className="w-full px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors text-left">
              Sign Out
            </button>
          </div>
        </nav>
      </aside>
    </>
  )
}
