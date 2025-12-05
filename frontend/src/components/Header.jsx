import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Menu, X, Plus, User, LogIn, LogOut } from "lucide-react"

export default function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
    
    // Listen for storage changes (e.g., logout in another tab)
    const handleStorageChange = () => {
      const userData = localStorage.getItem('user')
      if (userData) {
        setUser(JSON.parse(userData))
      } else {
        setUser(null)
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setSidebarOpen(false)
    navigate('/login')
  }

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
              {user && (
                <>
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
                </>
              )}
            </nav>

            {/* Right: Add Project + User/Login */}
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <button
                    onClick={() => navigate("/upload")}
                    className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-200 rounded-lg transition-colors text-black font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Add Project</span>
                  </button>
                  <div className="relative group">
                    <button className="p-2 rounded-full bg-white hover:bg-gray-200 transition-colors">
                      <User className="w-5 h-5 text-black" />
                    </button>
                    {/* Dropdown */}
                    <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                      <div className="p-3 border-b border-gray-800">
                        <p className="text-sm font-medium text-white">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 to-cyan-500 hover:from-red-600 hover:via-yellow-600 hover:via-green-600 hover:to-cyan-600 rounded-lg transition-all text-white font-medium"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
              )}
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
          {user ? (
            <>
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
                <button 
                  onClick={handleLogout}
                  className="w-full px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors text-left flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setSidebarOpen(false)}
              className="block px-4 py-3 rounded-lg bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 to-cyan-500 hover:from-red-600 hover:via-yellow-600 hover:via-green-600 hover:to-cyan-600 text-white transition-all text-center font-medium"
            >
              Sign In
            </Link>
          )}
        </nav>
      </aside>
    </>
  )
}
