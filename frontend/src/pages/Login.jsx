import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Mail, Lock, User, ArrowRight, Sparkles, Code2, Zap } from "lucide-react"
import apiClient from '../api/client'

export default function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const navigate = useNavigate()

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {            
      navigate('/')
    }
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const endpoint = isSignUp ? "/auth/register" : "/auth/login"
      const payload = isSignUp 
        ? { email, password, name: name || email.split('@')[0] } 
        : { email, password }
      
      const response = await apiClient.post(endpoint, payload)

      // Backend returns: { user: { id, email, name }, token }
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))
      
      setSuccess(isSignUp ? "Account created successfully!" : "Login successful!")
      setIsAuthenticated(true)
      
      setTimeout(() => {
        navigate("/")
      }, 1000)
    } catch (err) {
      setError(err.response?.data?.error || "Authentication failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-6xl flex gap-8 items-center relative z-10">
        {/* Left side - Branding */}
        <div className="hidden lg:flex flex-1 flex-col space-y-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-red-500 via-yellow-500 to-cyan-500 rounded-xl">
              <Code2 className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 to-cyan-500 bg-clip-text text-transparent">
              LegacyLift
            </h1>
          </div>
          
          <h2 className="text-5xl font-bold leading-tight">
            Transform Your Legacy Code with{" "}
            <span className="bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-cyan-500 to-blue-500 bg-clip-text text-transparent">
              AI Power
            </span>
          </h2>
          
          <p className="text-xl text-gray-300">
            Automatically refactor, analyze, and modernize your codebase with cutting-edge AI technology.
          </p>

          <div className="space-y-4 pt-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-cyan-500/20 rounded-lg mt-1">>
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">AI-Powered Refactoring</h3>
                <p className="text-gray-400">Intelligent code improvements using Groq AI</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg mt-1">
                <Code2 className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">GitHub Integration</h3>
                <p className="text-gray-400">Create PRs directly from refactored code</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-2 bg-cyan-500/20 rounded-lg mt-1">
                <Zap className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Instant Results</h3>
                <p className="text-gray-400">Get code analysis and improvements in seconds</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Auth Form */}
        <div className="flex-1 max-w-md w-full">
          <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-800 shadow-2xl p-8">
            {/* Mobile branding */}
            <div className="lg:hidden flex items-center justify-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-red-500 via-yellow-500 to-cyan-500 rounded-lg">
                <Code2 className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 to-cyan-500 bg-clip-text text-transparent">
                LegacyLift
              </h1>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">
                {isSignUp ? "Create Account" : "Welcome Back"}
              </h2>
              <p className="text-gray-400">
                {isSignUp 
                  ? "Start transforming your code with AI" 
                  : "Continue your refactoring journey"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
                {isSignUp && (
                  <p className="text-xs text-gray-500 mt-1">
                    Must be at least 6 characters
                  </p>
                )}
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 flex items-start space-x-2">
                  <span className="text-red-400 text-sm">{error}</span>
                </div>
              )}

              {success && (
                <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-3 flex items-start space-x-2">
                  <span className="text-green-400 text-sm">{success}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 to-cyan-500 hover:from-red-600 hover:via-yellow-600 hover:via-green-600 hover:to-cyan-600 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 group"
              >
                <span>{loading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}</span>
                {!loading && (
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button 
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setError("")
                  setSuccess("")
                }} 
                className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition"
              >
                {isSignUp 
                  ? "Already have an account? Sign in" 
                  : "Don't have an account? Create one"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
