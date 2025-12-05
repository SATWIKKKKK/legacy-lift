import { useState } from "react"
import { MessageSquare, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"

export default function FloatingAIButton() {
  const [isHovered, setIsHovered] = useState(false)
  const navigate = useNavigate()

  return (
    <motion.button
      onClick={() => navigate("/ai-chat")}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-cyan-500 to-blue-500 rounded-full shadow-lg hover:shadow-xl hover:shadow-cyan-500/50 transition-all duration-300"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <MessageSquare className="w-6 h-6 text-white" />
      
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 border border-cyan-500/30 px-3 py-2 rounded-lg whitespace-nowrap"
          >
            <span className="text-sm text-white font-medium">Ask LegacyLift AI</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-cyan-500 to-blue-500 rounded-full opacity-0"
        animate={{
          opacity: [0, 0.5, 0],
          scale: [1, 1.5, 1.8],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeOut",
        }}
      />
    </motion.button>
  )
}
