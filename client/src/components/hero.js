"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Camera, Recycle } from "lucide-react"
import { FloatingPaper } from "@/components/floating-paper"
import { RoboAnimation } from "@/components/robo-animation"
import Link from "next/link"

export default function Hero() {
  return (
    <div className="relative min-h-[calc(100vh-76px)] flex items-center">
      {/* Floating eco icons background */}
      <div className="absolute inset-0 overflow-hidden">
        <FloatingPaper count={6} />
      </div>

      <div className="container mx-auto px-6 relative z-10 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              EcoScan: Empowering Sustainable 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-600">
                {" "}E-Waste Solutions
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-400 text-xl mb-8 max-w-2xl mx-auto"
          >
            Upload a photo of your electronic device to get AI-driven recommendations for repair, reuse, or recycling.
            Join us in reducing tech waste and building a greener future.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/scan-image">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 cursor-pointer">
                <Camera className="mr-2 h-5 w-5" />
                Try Now
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-white bg-black border-green-500 hover:bg-green-500/20 cursor-pointer">
              <Recycle className="mr-2 h-5 w-5" />
              View Examples
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Eco-themed animated icon */}
      <div className="hidden md:block absolute bottom-0 right-0 w-96 h-96">
        <RoboAnimation />
      </div>
    </div>
  )
}
