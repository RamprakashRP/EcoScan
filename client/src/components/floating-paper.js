"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Smartphone, Trash2 } from "lucide-react"

export function FloatingPaper() {
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 })

  // Decide how many icons to show based on screen size
  // (You can detect this in many ways; here's a quick window.matchMedia example.)
  const [iconCount, setIconCount] = useState(6)

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
      // If screen width < 768px, show fewer icons
      setIconCount(window.innerWidth < 768 ? 2 : 6)
    }

    updateDimensions() // run on mount
    window.addEventListener("resize", updateDimensions)

    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  return (
    <div className="relative w-full h-full">
      {Array.from({ length: iconCount }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{
            x: Math.random() * dimensions.width,
            y: Math.random() * dimensions.height,
          }}
          animate={{
            x: [Math.random() * dimensions.width, Math.random() * dimensions.width],
            y: [Math.random() * dimensions.height, Math.random() * dimensions.height],
            rotate: [0, 360],
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          <div className="relative w-16 h-20 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 flex items-center justify-center transform hover:scale-110 transition-transform">
            <Trash2 className="w-8 h-8 text-green-400/50" />
          </div>
        </motion.div>
      ))}
    </div>
  )
}
