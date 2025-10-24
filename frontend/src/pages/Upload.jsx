import { useState } from "react"
import { Upload as UploadIcon, File, CheckCircle, AlertCircle, Sparkles } from "lucide-react"

export default function Upload() {
  const [file, setFile] = useState(null)
  const [projectName, setProjectName] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()

    if (!file || !projectName) {
      setMessage("error:Please provide a project name and select a file")
      return
    }

    setLoading(true)
    setMessage("")

    // Simulate upload
    setTimeout(() => {
      setLoading(false)
      setMessage("success:Project uploaded successfully! AI analysis in progress...")
      setTimeout(() => {
        setMessage("")
        setFile(null)
        setProjectName("")
        setDescription("")
      }, 3000)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/50 bg-white/10 mb-6 animate-glow">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">AI-Powered Analysis</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Upload Your Legacy Project
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Let our AI analyze and modernize your codebase. Upload your files and watch the magic happen.
          </p>
        </div>

        {/* Upload Form */}
        <form onSubmit={handleUpload} className="space-y-6">
          {/* Project Info */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <h2 className="text-xl font-semibold mb-6 text-white">Project Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="e.g., My Legacy App"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  placeholder="Brief description of your project..."
                  rows="3"
                />
              </div>
            </div>
          </div>

          {/* File Upload */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <h2 className="text-xl font-semibold mb-6 text-white">Upload Files</h2>

            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                dragActive
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-gray-700 hover:border-gray-600"
              }`}
            >
              {file ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                    <File className="w-8 h-8 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{file.name}</p>
                    <p className="text-gray-400 text-sm">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="text-sm text-red-400 hover:text-red-300 transition-colors"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
                    <UploadIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-white font-medium mb-2">
                    Drop your files here, or{" "}
                    <label className="text-white underline hover:text-gray-300 cursor-pointer transition-colors">
                      browse
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".js,.jsx,.ts,.tsx,.py,.java,.zip,.tar,.gz"
                      />
                    </label>
                  </p>
                  <p className="text-gray-400 text-sm">
                    Supports: .js, .jsx, .py, .java, .zip, and more
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !file || !projectName}
            className="w-full py-4 bg-white hover:bg-gray-200 text-black rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Start AI Analysis
              </>
            )}
          </button>

          {/* Message */}
          {message && (
            <div
              className={`p-4 rounded-lg flex items-center gap-3 ${
                message.startsWith("success:")
                  ? "bg-green-900/30 border border-green-700/50 text-green-200"
                  : "bg-red-900/30 border border-red-700/50 text-red-200"
              }`}
            >
              {message.startsWith("success:") ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <p>{message.split(":")[1]}</p>
            </div>
          )}
        </form>

        {/* Info Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="font-semibold mb-2 text-white">Fast Processing</h3>
            <p className="text-gray-400 text-sm">
              AI analysis completes in seconds
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="font-semibold mb-2 text-white">Secure Upload</h3>
            <p className="text-gray-400 text-sm">
              Your code is encrypted and private
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="font-semibold mb-2 text-white">Version Control</h3>
            <p className="text-gray-400 text-sm">
              Track all changes and iterations
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
