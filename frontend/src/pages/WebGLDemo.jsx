import { WebGLShader } from "../components/ui/web-gl-shader"
import { LiquidButton } from "../components/ui/liquid-glass-button"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

export default function WebGLDemo() {
  const navigate = useNavigate()

  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden min-h-screen">
      <WebGLShader /> 
      
      {/* Back button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 z-20 flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        Back Home
      </button>
      
      <div className="relative border border-[#27272a] p-2 w-full mx-auto max-w-3xl z-10">
        <main className="relative border border-[#27272a] py-10 overflow-hidden bg-black/30 backdrop-blur-sm">
          <h1 className="mb-3 text-white text-center text-7xl font-extrabold tracking-tighter md:text-[clamp(2rem,8vw,7rem)]">
            Design is Everything
          </h1>
          
          <p className="text-white/60 px-6 text-center text-xs md:text-sm lg:text-lg">
            Unleashing creativity through bold visuals, seamless interfaces, and limitless possibilities.
          </p>
          
          <div className="my-8 flex items-center justify-center gap-1">
            <span className="relative flex h-3 w-3 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
            </span>
            <p className="text-xs text-green-500">Available for New Projects</p>
          </div>
          
          <div className="flex justify-center gap-4 flex-wrap px-4"> 
            <LiquidButton 
              className="text-white border rounded-full" 
              size="xl"
              onClick={() => navigate("/upload")}
            >
              Let's Go
            </LiquidButton>
            
            <LiquidButton 
              className="text-white border rounded-full" 
              size="xl"
              variant="outline"
              onClick={() => navigate("/")}
            >
              Go Home
            </LiquidButton>
          </div> 
        </main>
      </div>
    </div>
  )
}
