"use client"

import { Button } from "@/components/ui/button"
import { Recycle, Menu, Leaf } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const pathname = usePathname()
  const isHome = pathname === "/"

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 w-full flex items-center justify-between px-6 py-4 backdrop-blur-sm border-b border-white/10"
    >
      {/* Logo */}
      <Link href="/" className="flex items-center space-x-2">
        <Leaf className="w-8 h-8 text-green-500" />
        <span className="text-white font-medium text-xl">EcoScan</span>
      </Link>

      {/* Navlinks */}
      {isHome ? (
        <div className="hidden md:flex items-center space-x-8">
          <NavLink href="/features">Features</NavLink>
          <NavLink href="/how-it-works">How it Works</NavLink>
          <NavLink href="/examples">Examples</NavLink>
        </div>
      ) : (
        // When not home, center the navlinks using absolute positioning
        <div className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
          <NavLink href="/scan-image">Scan</NavLink>
          <NavLink href="/nearby">Find Recyclers</NavLink>
        </div>
      )}

      {/* "Get Started" button only on Home */}
      {isHome && (
        <div className="hidden md:flex items-center space-x-4">
          <Button className="bg-green-600 hover:bg-green-700 text-white cursor-pointer">
            Get Started
          </Button>
        </div>
      )}

      {/* Mobile menu button */}
      <Button variant="ghost" size="icon" className="md:hidden text-white">
        <Menu className="w-6 h-6" />
      </Button>
    </motion.nav>
  )
}

function NavLink({ href, children }) {
  return (
    <Link href={href} className="text-gray-300 hover:text-white transition-colors relative group">
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-500 transition-all group-hover:w-full" />
    </Link>
  )
}
