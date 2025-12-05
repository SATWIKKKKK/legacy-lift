"use client"

import { useNavigate } from "react-router-dom"

export default function Navigation() {
  const navigate = useNavigate()

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-white font-bold text-xl hover:text-cyan-400 transition"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-red-500 via-yellow-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">AI</span>
          </div>
          Code Refactor
        </button>

        <div className="flex items-center gap-6">
          <button onClick={() => navigate("/")} className="text-gray-400 hover:text-white transition">
            Dashboard
          </button>
          <button onClick={() => navigate("/upload")} className="text-gray-400 hover:text-white transition">
            New Project
          </button>
        </div>
      </div>
    </nav>
  )
}
