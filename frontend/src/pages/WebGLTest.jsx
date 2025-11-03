import { WebGLShader } from "../components/ui/web-gl-shader"
import { LiquidButton } from "../components/ui/liquid-glass-button"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

export default function WebGLTest() {
  const navigate = useNavigate()

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* WebGL Background */}
      <WebGLShader />
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center p-8">
          <h1 className="text-6xl font-bold mb-4 text-white">WebGL Shader Test</h1>
          <p className="text-xl mb-8 text-white/80">Animated RGB Wave Background</p>
          
          <div className="flex gap-4 justify-center">
            <LiquidButton 
              size="xl"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="w-4 h-4" />
              Back Home
            </LiquidButton>
            
            <LiquidButton 
              size="xl"
              variant="outline"
              onClick={() => navigate("/webgl")}
            >
              Full Demo
            </LiquidButton>
          </div>
        </div>
      </div>
    </div>
  )
}
