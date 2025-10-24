import { useNavigate } from "react-router-dom"
import { ArrowRight, Github, GitCompare, History, Sparkles, Shield, Zap, Plus } from "lucide-react"

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="pt-36 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          {/* AI Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/50 bg-white/10 mb-8 animate-glow">
            <div className="relative">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-ping absolute"></div>
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            </div>
            <span className="text-sm font-medium text-white">
              AI-POWERED MODERNIZATION
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-semibold mb-6  text-white tracking-tight text-center
          uppercase max-w-full  ">
            One Stop Solution For
            <br />
            Legacy Code Refactor
          </h1>

          {/* Description */}
          <p className="text-xl sm:text-2xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            Modernize your legacy codebase with AI-powered refactoring. Automated code transformation, intelligent suggestions, and seamless GitHub integration.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/upload")}
              className="group px-8 py-4 bg-white hover:bg-gray-200 text-black rounded-lg font-semibold transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-8 py-4 bg-white hover:bg-gray-200 text-black rounded-lg font-semibold transition-colors w-full sm:w-auto"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-y border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700">
              <div className="text-5xl font-bold text-white mb-2">
                300+
              </div>
              <div className="text-gray-400 font-medium">Projects Modernized</div>
            </div>
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700">
              <div className="text-5xl font-bold text-white mb-2">
                98%
              </div>
              <div className="text-gray-400 font-medium">Accuracy Rate</div>
            </div>
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700">
              <div className="text-5xl font-bold text-white mb-2">
                50K+
              </div>
              <div className="text-gray-400 font-medium">Lines Refactored</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-white">
            Why Choose LegacyLift?
          </h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
            Powerful features designed to make code modernization effortless
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1: GitHub Integration */}
            <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800 hover:border-white/50 transition-all group animate-glow">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors">
                <Github className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">GitHub Integration</h3>
              <p className="text-gray-400">
                Seamlessly connect with your repositories and create pull requests directly from the platform.
              </p>
            </div>

            {/* Feature 2: Side-by-Side Diff Viewer */}
            <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800 hover:border-white/50 transition-all group animate-glow">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors">
                <GitCompare className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Side-by-Side Diff Viewer</h3>
              <p className="text-gray-400">
                Compare original and refactored code with an intuitive split-screen interface.
              </p>
            </div>

            {/* Feature 3: Version History Tracking */}
            <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800 hover:border-white/50 transition-all group animate-glow">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors">
                <History className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Version History Tracking</h3>
              <p className="text-gray-400">
                Keep track of all refactoring versions and easily roll back when needed.
              </p>
            </div>

            {/* Feature 4: AI-Powered Analysis */}
            <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800 hover:border-white/50 transition-all group animate-glow">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">AI-Powered Analysis</h3>
              <p className="text-gray-400">
                Advanced machine learning models analyze and suggest optimal refactoring strategies.
              </p>
            </div>

            {/* Feature 5: Secure & Private */}
            <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800 hover:border-white/50 transition-all group animate-glow">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Secure & Private</h3>
              <p className="text-gray-400">
                Your code is encrypted and never stored permanently. Full data privacy guaranteed.
              </p>
            </div>

            {/* Feature 6: Lightning Fast */}
            <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800 hover:border-white/50 transition-all group animate-glow">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Lightning Fast</h3>
              <p className="text-gray-400">
                Optimized processing pipeline delivers refactored code in seconds, not hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-3xl bg-gray-900 border border-white/30 animate-glow">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Ready to Modernize Your Project?
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Upload your legacy code and let our AI transform it into clean, modern, maintainable code.
            </p>
            <button
              onClick={() => navigate("/upload")}
              className="group px-8 py-4 bg-white hover:bg-gray-200 text-black rounded-lg font-semibold transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add New Project
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
