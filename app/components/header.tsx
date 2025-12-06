"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"

const CONFIG = {
  aiClone: {
    hero: {
      cta: "Get Your AI Clone — $37",
    },
  },
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.header
      // use hero caramel as header bg; slightly translucent on scroll for depth
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#C89356]/95 backdrop-blur-sm shadow-[0_8px_30px_rgba(0,0,0,0.25)]"
          : "bg-[#C89356]"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <motion.div
            className="flex items-center gap-2 text-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-2xl">✱</span>
            <span className="text-xl font-bold">Signature Global Media</span>
          </motion.div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            href="/"
            className={`transition-colors ${pathname === "/" ? "text-[#FCD34D]" : "text-white hover:text-[#FCD34D]"}`}
          >
            Home
          </Link>
          <Link
            href="/ai-clone"
            className={`transition-colors ${
              pathname === "/ai-clone" ? "text-[#FCD34D]" : "text-white hover:text-[#FCD34D]"
            }`}
          >
            AI Clone
          </Link>
          <a href="#" className="text-white hover:text-[#FCD34D] transition-colors">
            Services
          </a>
          <a href="#" className="text-white hover:text-[#FCD34D] transition-colors">
            About
          </a>
        </div>

        {/* CTA Button - white pill matching hero appearance */}
        <Link href="/ai-clone#process-flow">
          <motion.button
            className="hidden md:inline-flex items-center justify-center px-6 py-3 bg-white text-[#111] rounded-full font-semibold shadow-[0_18px_60px_rgba(0,0,0,0.35)]"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            style={{
              // subtle outer glow similar to hero CTA
              boxShadow:
                "0 18px 60px rgba(0,0,0,0.35), 0 0 36px rgba(255,255,255,0.08), 0 8px 30px rgba(180,83,9,0.08)",
            }}
          >
            Get Your AI Clone
          </motion.button>
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-white hover:bg-[#92400E] rounded-lg"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#C89356]/95 backdrop-blur-sm border-t border-[#92400E]"
          >
            <div className="px-4 py-4 space-y-4">
              <Link
                href="/"
                className={`block transition-colors ${pathname === "/" ? "text-[#FCD34D]" : "text-white hover:text-[#FCD34D]"}`}
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/ai-clone"
                className={`block transition-colors ${
                  pathname === "/ai-clone" ? "text-[#FCD34D]" : "text-white hover:text-[#FCD34D]"
                }`}
                onClick={() => setIsOpen(false)}
              >
                AI Clone
              </Link>
              <a href="#" className="block text-white hover:text-[#FCD34D] transition-colors">
                Services
              </a>
              <a href="#" className="block text-white hover:text-[#FCD34D] transition-colors">
                About
              </a>

              {/* Mobile CTA button (matching pill style but full width) */}
              <Link
                href="/ai-clone#process-flow"
                onClick={() => setIsOpen(false)}
                className="w-full px-4 py-3 bg-white text-[#111] rounded-full font-semibold shadow-[0_18px_60px_rgba(0,0,0,0.35)] text-center block"
                style={{
                  boxShadow:
                    "0 18px 60px rgba(0,0,0,0.35), 0 0 28px rgba(255,255,255,0.06), 0 8px 24px rgba(180,83,9,0.06)",
                }}
              >
                Get Your AI Clone
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
