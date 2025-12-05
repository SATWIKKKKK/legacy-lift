"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { FileCode2, Sparkles, TrendingUp, Zap, Clock, FolderOpen, Code2 } from "lucide-react"
import apiClient from '../api/client'
import ProjectCard from "../components/ProjectCard"

export default function Dashboard() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalFiles: 0,
    refactoredProjects: 0,
    activeProjects: 0
  })

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await apiClient.get("/projects")
        const projectData = response.data.projects || []
        setProjects(projectData)
        
        // Calculate stats
        const totalFiles = projectData.reduce((sum, p) => sum + (p.uploadedFiles?.length || 0), 0)
        const refactored = projectData.filter(p => p.status === 'refactored' || p.status === 'completed').length
        const active = projectData.filter(p => p.status === 'uploaded' || p.status === 'processing').length
        
        setStats({
          totalProjects: projectData.length,
          totalFiles,
          refactoredProjects: refactored,
          activeProjects: active
        })
      } catch (error) {
        console.error("Error fetching projects:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const StatCard = ({ icon: Icon, label, value, color, delay }) => (
    <div 
      className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6 hover:border-cyan-400 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-1">{label}</p>
          <h3 className="text-3xl font-bold text-white">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg bg-gradient-to-br ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto mt-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-red-500 via-yellow-500 via-green-500 via-cyan-500 to-blue-500 rounded-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                AI Refactor Dashboard
              </h1>
            </div>
            <p className="text-gray-400 text-sm md:text-base">Transform legacy code into modern, optimized solutions</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={() => navigate("/ai-chat")}
              className="flex-1 md:flex-none px-6 py-3 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-cyan-500 to-blue-500 hover:from-red-600 hover:via-yellow-600 hover:via-green-600 hover:via-cyan-600 hover:to-blue-600 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/50 flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5" />
              Get Started
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        {!loading && projects.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fadeIn">
            <StatCard 
              icon={FolderOpen} 
              label="Total Projects" 
              value={stats.totalProjects} 
              color="from-red-500 to-orange-500"
              delay={0}
            />
            <StatCard 
              icon={FileCode2} 
              label="Total Files" 
              value={stats.totalFiles} 
              color="from-yellow-500 to-green-500"
              delay={100}
            />
            <StatCard 
              icon={Sparkles} 
              label="Refactored" 
              value={stats.refactoredProjects} 
              color="from-cyan-500 to-blue-500"
              delay={200}
            />
            <StatCard 
              icon={TrendingUp} 
              label="Active" 
              value={stats.activeProjects} 
              color="from-purple-500 via-purple-400 to-pink-500"
              delay={300}
            />
          </div>
        )}

        {/* Projects Section */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-600"></div>
              <div className="absolute top-0 left-0 animate-ping rounded-full h-16 w-16 border-b-4 border-cyan-400 opacity-20"></div>
            </div>
            <p className="text-gray-400 mt-4 animate-pulse">Loading your projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 animate-fadeIn">
            <div className="mb-6">
              <div className="inline-flex p-6 bg-gradient-to-br from-red-500/20 via-yellow-500/20 via-green-500/20 via-cyan-500/20 to-blue-500/20 rounded-full border border-cyan-500/30">
                <Code2 className="w-12 h-12 text-cyan-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No Projects Yet</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Start your journey to cleaner code. Upload your first project and let AI work its magic!
            </p>
            <button
              onClick={() => navigate("/ai-chat")}
              className="px-8 py-3 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-cyan-500 to-blue-500 hover:from-red-600 hover:via-yellow-600 hover:via-green-600 hover:via-cyan-600 hover:to-blue-600 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/50 inline-flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Get Started
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl font-semibold text-white">Recent Projects</h2>
              <span className="text-sm text-gray-500">({projects.length})</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
              {projects.map((project, index) => (
                <div
                  key={project._id}
                  style={{ animationDelay: `${index * 100}ms` }}
                  className="animate-slideUp"
                >
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
