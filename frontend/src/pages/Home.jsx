import { useNavigate } from "react-router-dom"
import { ArrowRight, Github, GitCompare, History, Sparkles, Shield, Zap, Plus } from "lucide-react"
import { GlowingEffect } from "../components/ui/glowing-effect"
import { TestimonialsSection } from "../components/ui/testimonials-with-marquee"
import { Pricing } from "../components/ui/pricing"
import { WebGLShader } from "../components/ui/web-gl-shader"

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* WebGL Shader Background */}
      <WebGLShader />
      
      {/* Content Overlay */}
      <div className="relative z-10">
      {/* Hero Section */}
      <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          {/* AI Badge */}
          <div className="relative inline-block rounded-full mb-8">
            <GlowingEffect
              spread={80}
              glow={true}
              disabled={false}
              proximity={84}
              inactiveZone={0.01}
              borderWidth={2}
            />
            <div className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/50 bg-white/10">
              <div className="relative">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-ping absolute"></div>
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              </div>
              <span className="text-sm font-medium text-white">
                AI-POWERED MODERNIZATION 
              </span>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-sans font-bold mb-6  text-white tracking-normal text-center
           max-w-full  ">
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
            
            <div className="relative rounded-2xl">
              <GlowingEffect
                spread={80}
                glow={true}
                disabled={false}
                proximity={84}
                inactiveZone={0.01}
                borderWidth={3}
              />
              <div className="relative text-center p-8 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700">
                <div className="text-5xl font-bold text-white mb-2">
                  300+
                </div>
                <div className="text-gray-400 font-medium">Projects Modernized</div>
              </div>
            </div>

            <div className="relative rounded-2xl">
              <GlowingEffect
                spread={80}
                glow={true}
                disabled={false}
                proximity={84}
                inactiveZone={0.01}
                borderWidth={3}
              />
              <div className="relative text-center p-8 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700">
                <div className="text-5xl font-bold text-white mb-2">
                  98%
                </div>
                <div className="text-gray-400 font-medium">Accuracy Rate</div>
              </div>
            </div>

            <div className="relative rounded-2xl">
              <GlowingEffect
                spread={80}
                glow={true}
                disabled={false}
                proximity={84}
                inactiveZone={0.01}
                borderWidth={3}
              />
              <div className="relative text-center p-8 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700">
                <div className="text-5xl font-bold text-white mb-2">
                  50K+
                </div>
                <div className="text-gray-400 font-medium">Lines Refactored</div>
              </div>
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
            <div className="relative rounded-2xl">
              <GlowingEffect
                spread={120}
                glow={true}
                disabled={false}
                proximity={100}
                inactiveZone={0.01}
                borderWidth={3}
              />
              <div className="relative p-6 rounded-2xl bg-gray-900 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors">
                  <Github className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">GitHub Integration</h3>
                <p className="text-gray-400">
                  Seamlessly connect with your repositories and create pull requests directly from the platform.
                </p>
              </div>
            </div>

            {/* Feature 2: Side-by-Side Diff Viewer */}
            <div className="relative rounded-2xl">
              <GlowingEffect
                spread={80}
                glow={true}
                disabled={false}
                proximity={84}
                inactiveZone={0.01}
                borderWidth={3}
              />
              <div className="relative p-6 rounded-2xl bg-gray-900 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors">
                  <GitCompare className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Side-by-Side Diff Viewer</h3>
                <p className="text-gray-400">
                  Compare original and refactored code with an intuitive split-screen interface.
                </p>
              </div>
            </div>

            {/* Feature 3: Version History Tracking */}
            <div className="relative rounded-2xl">
              <GlowingEffect
                spread={80}
                glow={true}
                disabled={false}
                proximity={84}
                inactiveZone={0.01}
                borderWidth={3}
              />
              <div className="relative p-6 rounded-2xl bg-gray-900 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors">
                  <History className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Version History Tracking</h3>
                <p className="text-gray-400">
                  Keep track of all refactoring versions and easily roll back when needed.
                </p>
              </div>
            </div>

            {/* Feature 4: AI-Powered Analysis */}
            <div className="relative rounded-2xl">
              <GlowingEffect
                spread={80}
                glow={true}
                disabled={false}
                proximity={84}
                inactiveZone={0.01}
                borderWidth={3}
              />
              <div className="relative p-6 rounded-2xl bg-gray-900 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">AI-Powered Analysis</h3>
                <p className="text-gray-400">
                  Advanced machine learning models analyze and suggest optimal refactoring strategies.
                </p>
              </div>
            </div>

            {/* Feature 5: Secure & Private */}
            <div className="relative rounded-2xl">
              <GlowingEffect
                spread={80}
                glow={true}
                disabled={false}
                proximity={84}
                inactiveZone={0.01}
                borderWidth={3}
              />
              <div className="relative p-6 rounded-2xl bg-gray-900 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Secure & Private</h3>
                <p className="text-gray-400">
                  Your code is encrypted and never stored permanently. Full data privacy guaranteed.
                </p>
              </div>
            </div>

            {/* Feature 6: Lightning Fast */}
            <div className="relative rounded-2xl">
              <GlowingEffect
                spread={80}
                glow={true}
                disabled={false}
                proximity={84}
                inactiveZone={0.01}
                borderWidth={3}
              />
              <div className="relative p-6 rounded-2xl bg-gray-900 transition-all group">
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
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection
        title="Trusted by developers worldwide"
        description="Join thousands of developers who are already building the future with our AI platform"
        testimonials={[
          {
            author: {
              name: "Emma Thompson",
              handle: "@emmadev",
              avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
            },
            text: "LegacyLift transformed our 10-year-old codebase into modern, maintainable code. The AI-powered refactoring saved us months of work.",
            href: "https://twitter.com/emmadev"
          },
          {
            author: {
              name: "David Park",
              handle: "@davidtech",
              avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
            },
            text: "The GitHub integration is seamless. We've reduced our technical debt by 60% since implementing LegacyLift in our workflow.",
            href: "https://twitter.com/davidtech"
          },
          {
            author: {
              name: "Sofia Rodriguez",
              handle: "@sofiaml",
              avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
            },
            text: "Finally, a tool that understands code context! The accuracy in refactoring suggestions is impressive and saves hours of manual review."
          },
          {
            author: {
              name: "Michael Chen",
              handle: "@mchen",
              avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face"
            },
            text: "Best decision for our team. The diff viewer makes code review so much easier, and the AI suggestions are spot-on every time."
          },
          {
            author: {
              name: "Sarah Williams",
              handle: "@sarahwill",
              avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
            },
            text: "We migrated our entire React codebase with LegacyLift. The automated refactoring maintained all functionality while improving code quality."
          },
          {
            author: {
              name: "James Anderson",
              handle: "@jamesand",
              avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
            },
            text: "Security-focused refactoring is a game-changer. LegacyLift identified and fixed vulnerabilities we didn't even know existed."
          }
        ]}
      />

      {/* Pricing Section */}
      <Pricing
        title="Simple, Transparent Pricing"
        description="Choose the plan that works for you. All plans include access to our platform, AI-powered refactoring, and dedicated support."
        plans={[
          {
            name: "STARTER",
            price: "49",
            yearlyPrice: "39",
            period: "per month",
            features: [
              "Up to 10 projects",
              "Basic AI refactoring",
              "GitHub integration",
              "Side-by-side diff viewer",
              "48-hour support response",
              "Community support",
            ],
            description: "Perfect for individual developers and small projects",
            buttonText: "Start Free Trial",
            href: "/upload",
            isPopular: false,
          },
          {
            name: "PROFESSIONAL",
            price: "99",
            yearlyPrice: "79",
            period: "per month",
            features: [
              "Unlimited projects",
              "Advanced AI refactoring",
              "Priority GitHub integration",
              "Version history tracking",
              "24-hour support response",
              "Team collaboration (up to 5)",
              "Custom refactoring rules",
              "Security vulnerability detection",
            ],
            description: "Ideal for growing teams and professional developers",
            buttonText: "Get Started",
            href: "/upload",
            isPopular: true,
          },
          {
            name: "ENTERPRISE",
            price: "299",
            yearlyPrice: "239",
            period: "per month",
            features: [
              "Everything in Professional",
              "Unlimited team members",
              "Custom AI model training",
              "Dedicated account manager",
              "1-hour support response time",
              "SSO Authentication",
              "Advanced security & compliance",
              "Custom SLA agreements",
              "On-premise deployment option",
            ],
            description: "For large organizations with specific requirements",
            buttonText: "Contact Sales",
            href: "/contact",
            isPopular: false,
          },
        ]}
      />

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative rounded-3xl">
            <GlowingEffect
              spread={50}
              glow={true}
              disabled={false}
              proximity={80}
              inactiveZone={0.01}
              borderWidth={3}
            />
            <div className="relative p-12 rounded-3xl bg-gray-900 border border-white/30">
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
        </div>
      </section>
      </div>
    </div>
  )
}
