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
      className={`fixed top-0 left-0 right-0 z-50 w-full flex items-center ${
        isHome ? "justify-between px-6" : "justify-center"
      } py-4 backdrop-blur-sm border-b border-white/10`}
    >
      {/* Logo - always rendered */}
      <Link href="/" className="flex items-center space-x-2">
        <Leaf className="w-8 h-8 text-green-500" />
        <span className="text-white font-medium text-xl">EcoScan</span>
      </Link>

      {/* Navlinks and buttons only on Home */}
      {isHome && (
        <>
          <div className="hidden md:flex items-center space-x-8">
            <NavLink href="/features">Features</NavLink>
            <NavLink href="/how-it-works">How it Works</NavLink>
            <NavLink href="/examples">Examples</NavLink>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Button className="bg-green-600 hover:bg-green-700 text-white cursor-pointer">
              Get Started
            </Button>
          </div>
          <Button variant="ghost" size="icon" className="md:hidden text-white">
            <Menu className="w-6 h-6" />
          </Button>
        </>
      )}
    </motion.nav>
  )
}

function NavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="text-gray-300 hover:text-white transition-colors relative group"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-500 transition-all group-hover:w-full" />
    </Link>
  )
}
