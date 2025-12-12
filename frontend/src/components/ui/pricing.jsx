import { buttonVariants } from "./button"
import { Label } from "./label"
import { Switch } from "./switch"
import { useMediaQuery } from "../../hooks/use-media-query"
import { cn } from "../../lib/utils"
import { motion } from "framer-motion"
import { Check, Star } from "lucide-react"
import { useState, useRef } from "react"
import confetti from "canvas-confetti"
import NumberFlow from "@number-flow/react"
import { WebGLShaderSection } from "./web-gl-shader-section"

export  function Pricing({
  plans,
  title = "Simple, Transparent Pricing",
  description = "Choose the plan that works for you.All plans include access to our platform, lead generation tools, and dedicated support.",
}) {
  const [isMonthly, setIsMonthly] = useState(true)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const switchRef = useRef(null)

  const handleToggle = (checked) => {
    setIsMonthly(!checked)
    if (checked && switchRef.current) {
      const rect = switchRef.current.getBoundingClientRect()
      const x = rect.left + rect.width / 2
      const y = rect.top + rect.height / 2

      confetti({
        particleCount: 50,
        spread: 60,
        origin: {
          x: x / window.innerWidth,
          y: y / window.innerHeight,
        },
        colors: ["#ffffff", "#4ade80", "#60a5fa", "#a3a3a3"],
        ticks: 200,
        gravity: 1.2,
        decay: 0.94,
        startVelocity: 30,
        shapes: ["circle"],
      })
    }
  }

  return (
    <div className="container py-20 bg-black text-white relative">
      <WebGLShaderSection />
      <div className="relative z-10">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl text-white">
          {title}
        </h2>
        <p className="text-gray-400 text-lg whitespace-pre-line">
          {description}
        </p>
      </div>

      <div className="flex justify-center items-center mb-10 gap-3">
        <span className="font-semibold text-white">Monthly</span>
        <Label>
          <Switch
            ref={switchRef}
            checked={!isMonthly}
            onCheckedChange={handleToggle}
            className="relative"
          />
        </Label>
        <span className="font-semibold text-white">
          Annual <span className="text-green-400">(Save 20%)</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            initial={{ y: 50, opacity: 1 }}
            whileInView={
              isDesktop
                ? {
                    y: plan.isPopular ? -20 : 0,
                    opacity: 1,
                    x: index === 2 ? -30 : index === 0 ? 30 : 0,
                    scale: index === 0 || index === 2 ? 0.94 : 1.0,
                  }
                : {}
            }
            viewport={{ once: true }}
            transition={{
              duration: 1.6,
              type: "spring",
              stiffness: 100,
              damping: 30,
              delay: 0.4,
              opacity: { duration: 0.5 },
            }}
            className={cn(
              "rounded-2xl border p-6 bg-gray-900 text-center flex flex-col justify-between relative",
              plan.isPopular ? "border-white border-2" : "border-gray-700",
              !plan.isPopular && "mt-5",
              index === 0 || index === 2 ? "z-0" : "z-10"
            )}
          >
            {plan.isPopular && (
              <div className="absolute top-0 right-0 bg-white py-0.5 px-2 rounded-bl-xl rounded-tr-xl flex items-center">
                <Star className="text-black h-4 w-4 fill-current" />
                <span className="text-black ml-1 font-sans font-semibold">
                  Popular
                </span>
              </div>
            )}
            <div className="flex-1 flex flex-col">
              <p className="text-base font-semibold text-gray-400">
                {plan.name}
              </p>
              <div className="mt-6 flex items-center justify-center gap-x-2">
                <span className="text-5xl font-bold tracking-tight text-white">
                  <NumberFlow
                    value={
                      isMonthly ? Number(plan.price) : Number(plan.yearlyPrice)
                    }
                    format={{
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }}
                    transformTiming={{
                      duration: 500,
                      easing: "ease-out",
                    }}
                    willChange
                  />
                </span>
                {plan.period !== "Next 3 months" && (
                  <span className="text-sm font-semibold leading-6 tracking-wide text-gray-400">
                    / {plan.period}
                  </span>
                )}
              </div>

              <p className="text-xs leading-5 text-gray-400 mt-2">
                {isMonthly ? "billed monthly" : "billed annually"}
              </p>

              <ul className="mt-5 gap-2 flex flex-col">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-400 mt-1 flex-shrink-0" />
                    <span className="text-left text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <hr className="w-full my-4 border-gray-700" />

              <a
                href={plan.href}
                className={cn(
                  buttonVariants({
                    variant: plan.isPopular ? "default" : "outline",
                  }),
                  "group relative w-full gap-2 overflow-hidden text-lg font-semibold tracking-tighter",
                  "transform-gpu ring-offset-current transition-all duration-300 ease-out hover:ring-2 hover:ring-white hover:ring-offset-1",
                  plan.isPopular
                    ? "bg-white text-black hover:bg-gray-200"
                    : "bg-transparent text-white border-white/30 hover:bg-white/10"
                )}
              >
                {plan.buttonText}
              </a>
              <p className="mt-6 text-xs leading-5 text-gray-400">
                {plan.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
      </div>
    </div>
  )
}
