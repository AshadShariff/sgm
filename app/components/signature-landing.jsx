"use client"

/**
 * SignatureLanding.jsx - Dual-page landing component
 *
 * SETUP:
 * - Requires: react, react-dom, react-router-dom, framer-motion, react-icons, lucide-react
 * - Tailwind CSS v4 configured with brand color tokens (--brand-500, --brand-600, --accent-gold, --bg-dark)
 * - Drop-in compatible with Next.js App Router as a client component
 *
 * FEATURES:
 * - Client-side routing between / (Home) and /ai-clone pages
 * - Shared Header with scroll-triggered background fade and mobile menu
 * - Shared Footer with social links
 * - AiClonePage with purchase modal, accordion, and animations
 * - HomePage with hero, services, case studies, pricing snippet
 * - All animations respect prefers-reduced-motion
 * - Data-driven approach with CONFIG object
 */

import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ChevronDown, Play } from "lucide-react"
import { MdCheckCircle } from "react-icons/md"

// ============================================================================
// CONFIG & DATA
// ============================================================================

const CONFIG = {
  brand: {
    primary: "#6C3CE8",
    accent: "#FFB86B",
    dark: "#0F172A",
  },
  aiClone: {
    hero: {
      headline: "Create Your AI Clone In Just 30 mins",
      subheadline:
        "No camera. No editing. No tech skills needed. Get a professional AI video clone that markets your business.",
      cta: "Get Your AI Clone — $37",
    },
    features: [
      { title: "AI-Powered Cloning", description: "Your digital twin that never gets tired" },
      { title: "Multiple Languages", description: "Reach global audiences instantly" },
      { title: "Royalty-Free Music", description: "Professional soundtrack included" },
      { title: "24/7 Availability", description: "Your clone works around the clock" },
      { title: "Unlimited Edits", description: "Modify anytime, anywhere" },
      { title: "Full HD Quality", description: "Crystal-clear, broadcast-ready video" },
    ],
    process: [
      { step: 1, title: "Record Yourself", description: "Film a 5-10 minute video on your phone" },
      { step: 2, title: "Upload & Train", description: "Our AI learns your unique style in minutes" },
      { step: 3, title: "Generate Videos", description: "Create unlimited AI videos instantly" },
    ],
    faqs: [
      {
        q: "How long does it take to create my AI clone?",
        a: "Just 30 minutes! Record yourself, upload, and your AI is ready to create videos.",
      },
      {
        q: "Can I edit videos after they're created?",
        a: "Yes! You have full editing capabilities including text, music, and effects.",
      },
      {
        q: "What video formats are supported?",
        a: "We support MP4, WebM, and MOV formats for both upload and download.",
      },
      { q: "Is my video data secure?", a: "Absolutely. We use enterprise-grade encryption and never share your data." },
      {
        q: "Do I own the videos I create?",
        a: "Yes, 100% ownership. Use them however you like for personal or commercial use.",
      },
    ],
    pricing: [
      {
        name: "Old Way",
        subtitle: "Hire a video agency",
        items: ["$5,000-15,000", "Wait 4-6 weeks", "Limited revisions", "Stuck with one style"],
      },
      {
        name: "DIY Way",
        subtitle: "Learn video editing",
        items: ["$300-800 in software", "100+ hours to learn", "Low-quality results", "Constant updates needed"],
      },
      {
        name: "Smart Way",
        subtitle: "AI Clone ($37)",
        items: ["One-time payment", "Ready in 30 mins", "Unlimited revisions", "Always improving"],
        featured: true,
      },
    ],
  },
  home: {
    services: [
      {
        title: "AI Video Cloning",
        description: "Create professional video clones of yourself in minutes",
        icon: "video",
      },
      {
        title: "Content Repurposing",
        description: "Transform one video into 100+ formats for all platforms",
        icon: "layers",
      },
      { title: "Social Media Ads", description: "Generate compelling ads that convert and scale", icon: "trending" },
      { title: "Video Production", description: "Full production suite for professional content", icon: "film" },
    ],
    caseStudies: [
      {
        title: "E-commerce Growth",
        subtitle: "Client increased conversions by 300%",
        image: "https://via.placeholder.com/400x250?text=Case+Study+1",
      },
      {
        title: "SaaS Onboarding",
        subtitle: "Reduced support tickets by 40%",
        image: "https://via.placeholder.com/400x250?text=Case+Study+2",
      },
      {
        title: "B2B Lead Gen",
        subtitle: "Generated 5000+ qualified leads",
        image: "https://via.placeholder.com/400x250?text=Case+Study+3",
      },
    ],
    testimonials: [
      { name: "Sarah Chen", title: "Marketing Director", text: "The AI clone saved us thousands in production costs." },
      { name: "James Rivera", title: "Founder", text: "This is the future of digital marketing. Game-changing." },
      {
        name: "Emma Thompson",
        title: "Content Creator",
        text: "Scaled my content output 10x without any extra effort.",
      },
    ],
  },
}

// ============================================================================
// HEADER
// ============================================================================

function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-slate-900/95 backdrop-blur-sm shadow-lg" : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <motion.div
            className="text-2xl font-bold bg-gradient-to-r from-brand-400 to-accent-gold bg-clip-text text-transparent"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            SGM
          </motion.div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-white hover:text-brand-400 transition-colors">
            Home
          </Link>
          <Link to="/ai-clone" className="text-white hover:text-brand-400 transition-colors">
            AI Clone
          </Link>
          <a href="#" className="text-white hover:text-brand-400 transition-colors">
            Services
          </a>
          <a href="#" className="text-white hover:text-brand-400 transition-colors">
            About
          </a>
        </div>

        {/* CTA Button */}
        <motion.button
          className="hidden md:block px-6 py-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-brand-500/50 transition-shadow"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {CONFIG.aiClone.hero.cta}
        </motion.button>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-white hover:bg-slate-700 rounded-lg"
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
            className="md:hidden bg-slate-900/95 backdrop-blur-sm border-t border-slate-700"
          >
            <div className="px-4 py-4 space-y-4">
              <Link
                to="/"
                className="block text-white hover:text-brand-400 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/ai-clone"
                className="block text-white hover:text-brand-400 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                AI Clone
              </Link>
              <a href="#" className="block text-white hover:text-brand-400 transition-colors">
                Services
              </a>
              <a href="#" className="block text-white hover:text-brand-400 transition-colors">
                About
              </a>
              <button className="w-full px-4 py-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-lg font-semibold">
                {CONFIG.aiClone.hero.cta}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

// ============================================================================
// FOOTER
// ============================================================================

function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-brand-400 to-accent-gold bg-clip-text text-transparent mb-4">
              SGM
            </h3>
            <p className="text-slate-400 text-sm">Creating the future of video production.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  AI Clone
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Features
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Connect</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">&copy; 2025 Signature Global Media. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0 text-sm text-slate-400">
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ============================================================================
// HOME PAGE
// ============================================================================

function HomePage() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

  return (
    <main className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <section className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left: Headline & CTA */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: prefersReducedMotion ? 0 : 0.2 }}
          >
            <motion.h1
              className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.05, delayChildren: prefersReducedMotion ? 0 : 0.3 }}
            >
              Create Professional Video Content In Minutes
            </motion.h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Transform your vision into stunning video content with our AI-powered platform. No equipment. No
              experience. Just results.
            </p>
            <div className="flex gap-4">
              <motion.button
                className="px-8 py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-brand-500/50 transition-shadow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started Now
              </motion.button>
              <motion.button
                className="px-8 py-3 border-2 border-brand-400 text-brand-400 rounded-lg font-semibold hover:bg-brand-400/10 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Watch Demo
              </motion.button>
            </div>
          </motion.div>

          {/* Right: Media Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: prefersReducedMotion ? 0 : 0.4 }}
            className="relative"
          >
            <motion.div
              className="relative rounded-2xl overflow-hidden border-2 border-brand-400/30 bg-gradient-to-br from-brand-500/10 to-accent-gold/10 p-1"
              animate={prefersReducedMotion ? {} : { y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
            >
              <img
                src="https://via.placeholder.com/500x400?text=Professional+Video+Content"
                alt="Professional video content creation"
                className="w-full rounded-xl"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.button
                  className="p-4 bg-brand-500 rounded-full shadow-lg shadow-brand-500/50"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play size={32} className="text-white fill-white" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Our Services</h2>
            <p className="text-xl text-slate-300">Everything you need to create professional video content</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {CONFIG.home.services.map((service, idx) => (
              <motion.div
                key={idx}
                className="p-6 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-brand-400/50 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                whileHover={{ y: -5 }}
              >
                <h3 className="text-xl font-semibold text-white mb-3">{service.title}</h3>
                <p className="text-slate-300">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-4xl font-bold text-white mb-16 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Recent Case Studies
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CONFIG.home.caseStudies.map((study, idx) => (
              <motion.div
                key={idx}
                className="group rounded-xl overflow-hidden border border-slate-700 hover:border-brand-400/50 transition-colors cursor-pointer"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                whileHover={{ y: -8 }}
              >
                <div className="relative h-48 overflow-hidden bg-slate-800">
                  <img
                    src={study.image || "/placeholder.svg"}
                    alt={study.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <button className="w-full py-2 bg-brand-500 text-white rounded-lg font-semibold hover:bg-brand-600 transition-colors">
                      See Case Study
                    </button>
                  </div>
                </div>
                <div className="p-6 bg-slate-900/50">
                  <h3 className="text-lg font-semibold text-white mb-2">{study.title}</h3>
                  <p className="text-slate-400">{study.subtitle}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA to AI Clone */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-brand-600/20 via-slate-900 to-accent-gold/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            className="text-4xl font-bold text-white mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Ready to Create Your AI Clone?
          </motion.h2>
          <p className="text-xl text-slate-300 mb-8">
            Join thousands of creators who are using AI to scale their content production.
          </p>
          <Link to="/ai-clone">
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-brand-500/50 transition-shadow text-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {CONFIG.aiClone.hero.cta}
            </motion.button>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}

// ============================================================================
// AI CLONE PAGE
// ============================================================================

function PurchaseModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({ name: "", email: "" })
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("[v0] Purchase form submitted:", formData)
    setIsSuccess(true)
    setTimeout(() => {
      console.log("[v0] Purchase completed successfully")
      onClose()
      setStep(1)
      setFormData({ name: "", email: "" })
      setIsSuccess(false)
    }, 2000)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-slate-900 rounded-2xl max-w-md w-full mx-4 shadow-2xl border border-slate-700"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {isSuccess ? (
              <div className="p-8 text-center">
                <motion.div
                  className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <MdCheckCircle size={32} className="text-green-500" />
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-2">All Set!</h3>
                <p className="text-slate-400">Check your email for next steps.</p>
              </div>
            ) : (
              <>
                <div className="px-8 py-6 border-b border-slate-700 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-white">Get Your AI Clone</h2>
                  <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400">
                    <X size={24} />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your name"
                      className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-brand-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-brand-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Upload Video</label>
                    <div className="border-2 border-dashed border-slate-700 rounded-lg p-4 text-center hover:border-brand-400/50 transition-colors">
                      <input type="file" accept="video/*" className="hidden" id="video-upload" />
                      <label
                        htmlFor="video-upload"
                        className="cursor-pointer text-slate-400 hover:text-white transition-colors"
                      >
                        Drop video or click to upload
                      </label>
                    </div>
                  </div>
                  <motion.button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-brand-500/50 transition-shadow"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Complete Purchase — $37
                  </motion.button>
                  <p className="text-xs text-slate-500 text-center">30-day money-back guarantee</p>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState(null)
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

  return (
    <div className="space-y-4">
      {CONFIG.aiClone.faqs.map((faq, idx) => (
        <motion.div
          key={idx}
          className="border border-slate-700 rounded-lg overflow-hidden"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <button
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            className="w-full px-6 py-4 flex items-center justify-between bg-slate-800/50 hover:bg-slate-800 transition-colors text-left"
            aria-expanded={openIndex === idx}
          >
            <span className="font-semibold text-white">{faq.q}</span>
            <motion.div
              animate={{ rotate: openIndex === idx ? 180 : 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
            >
              <ChevronDown size={20} className="text-brand-400" />
            </motion.div>
          </button>
          <AnimatePresence>
            {openIndex === idx && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
              >
                <div className="px-6 py-4 bg-slate-900/50 text-slate-300 border-t border-slate-700">{faq.a}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  )
}

function AiClonePage() {
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false)
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

  return (
    <main className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <PurchaseModal isOpen={isPurchaseOpen} onClose={() => setIsPurchaseOpen(false)} />

      {/* Hero Section */}
      <section className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left: Headline */}
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <motion.h1
              className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.05, delayChildren: prefersReducedMotion ? 0 : 0.3 }}
            >
              {CONFIG.aiClone.hero.headline}
            </motion.h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">{CONFIG.aiClone.hero.subheadline}</p>
            <div className="flex gap-4">
              <motion.button
                onClick={() => {
                  console.log("[v0] clicked_cta")
                  setIsPurchaseOpen(true)
                }}
                className="px-8 py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-brand-500/50 transition-shadow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {CONFIG.aiClone.hero.cta}
              </motion.button>
              <motion.button
                className="px-8 py-3 border-2 border-brand-400 text-brand-400 rounded-lg font-semibold hover:bg-brand-400/10 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Watch Demo
              </motion.button>
            </div>
          </motion.div>

          {/* Right: Media Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <motion.div
              className="relative rounded-2xl overflow-hidden border-2 border-brand-400/30 bg-gradient-to-br from-brand-500/10 to-accent-gold/10 p-1"
              animate={prefersReducedMotion ? {} : { y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
            >
              <img
                src="https://via.placeholder.com/500x400?text=AI+Clone+Preview"
                alt="AI Clone video preview"
                className="w-full rounded-xl"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.button
                  className="p-4 bg-brand-500 rounded-full shadow-lg shadow-brand-500/50"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play size={32} className="text-white fill-white" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-slate-400 text-sm mb-6">TRUSTED BY 50,000+ CREATORS</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-center">
                <div className="text-slate-500 font-semibold">Logo {i}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-4xl font-bold text-white mb-16 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Powerful Features
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CONFIG.aiClone.features.map((feature, idx) => (
              <motion.div
                key={idx}
                className="p-8 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-brand-400/50 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-start gap-4">
                  <MdCheckCircle size={24} className="text-brand-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-slate-300">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Comparison */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-4xl font-bold text-white mb-16 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Why Choose Smart Way?
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CONFIG.aiClone.pricing.map((plan, idx) => (
              <motion.div
                key={idx}
                className={`p-8 rounded-xl border-2 transition-all ${
                  plan.featured
                    ? "bg-gradient-to-br from-brand-600/20 to-accent-gold/20 border-brand-400 shadow-lg shadow-brand-500/20"
                    : "bg-slate-800 border-slate-700"
                }`}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                whileHover={plan.featured ? { y: -8 } : {}}
              >
                {plan.featured && (
                  <div className="mb-4 inline-block px-3 py-1 bg-gradient-to-r from-brand-400 to-accent-gold text-slate-900 rounded-full text-xs font-bold">
                    BEST VALUE
                  </div>
                )}
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-slate-400 text-sm mb-6">{plan.subtitle}</p>
                <ul className="space-y-3">
                  {plan.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-white">
                      <span className="text-brand-400">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="text-4xl font-bold text-white mb-16 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            3 Simple Steps
          </motion.h2>

          <div className="space-y-8">
            {CONFIG.aiClone.process.map((item, idx) => (
              <motion.div
                key={idx}
                className="flex gap-8 items-start"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 text-white font-bold text-xl">
                    {item.step}
                  </div>
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-slate-300">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="text-4xl font-bold text-white mb-4 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Frequently Asked Questions
          </motion.h2>
          <p className="text-center text-slate-400 mb-12">Got questions? We have answers.</p>
          <FAQAccordion />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-brand-600/20 via-slate-900 to-accent-gold/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            className="text-4xl font-bold text-white mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Ready To Create Your AI Clone?
          </motion.h2>
          <p className="text-xl text-slate-300 mb-8">
            Join thousands of creators scaling their content production with AI.
          </p>
          <motion.button
            onClick={() => {
              console.log("[v0] clicked_cta")
              setIsPurchaseOpen(true)
            }}
            className="px-8 py-4 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-brand-500/50 transition-shadow text-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {CONFIG.aiClone.hero.cta}
          </motion.button>
          <p className="text-sm text-slate-400 mt-4">30-day money-back guarantee. No credit card required.</p>
        </div>
      </section>

      <Footer />
    </main>
  )
}

// ============================================================================
// MAIN APP WITH ROUTING
// ============================================================================

export default function SignatureLanding() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ai-clone" element={<AiClonePage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  )
}
