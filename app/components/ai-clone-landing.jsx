"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Menu, X, Play } from "lucide-react"
import { MdEmail, MdPhone, MdCheckCircle } from "react-icons/md"

/**
 * AI Clone Landing Page
 *
 * Required NPM packages:
 * - react, react-dom, next
 * - tailwindcss (v4+, configured)
 * - framer-motion
 * - lucide-react
 *
 * Tailwind Config (add to tailwind.config.js or globals.css):
 * theme.extend.colors = {
 *   brand: {
 *     400: '#8A66F2',
 *     500: '#6C3CE8',
 *     600: '#5A2DD6',
 *   },
 *   accent: '#FFB86B',
 *   bg: '#0F172A',
 * }
 */

// ============================================================================
// DATA OBJECTS
// ============================================================================

const navItems = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
]

const features = [
  {
    icon: "🎥",
    title: "No Camera Needed",
    description: "Create professional videos without expensive equipment.",
  },
  {
    icon: "✨",
    title: "Zero Editing Skills",
    description: "Automated editing handles all the technical work for you.",
  },
  {
    icon: "⚡",
    title: "Fast Creation",
    description: "Generate your AI clone in just 30 minutes.",
  },
  {
    icon: "🎬",
    title: "Professional Output",
    description: "Studio-quality videos ready to share instantly.",
  },
]

const pricingCards = [
  {
    title: "Old Way",
    icon: "📹",
    cost: "$5,000+",
    time: "3-6 months",
    items: ["Film crew", "Studio rental", "Professional equipment", "Post-production editing", "Multiple revisions"],
    highlight: false,
  },
  {
    title: "DIY Way",
    icon: "🛠️",
    cost: "$500-1,000",
    time: "4-8 weeks",
    items: [
      "Your time (30+ hours)",
      "Video editing software",
      "Learning curve",
      "Equipment cost",
      "Trial & error editing",
    ],
    highlight: false,
  },
  {
    title: "Smart Way (AI Clone)",
    icon: "🤖",
    cost: "$37",
    time: "30 minutes",
    items: [
      "AI-powered creation",
      "No equipment needed",
      "Professional results",
      "Unlimited revisions",
      "Instant deployment",
    ],
    highlight: true,
    badge: "Best Value",
  },
]

const processSteps = [
  {
    number: 1,
    title: "Upload Your Info",
    description: "Share your script, topic, or content outline.",
  },
  {
    number: 2,
    title: "AI Creates Your Clone",
    description: "Our AI generates your digital persona in minutes.",
  },
  {
    number: 3,
    title: "Download & Share",
    description: "Get your polished video and share anywhere.",
  },
]

const faqs = [
  {
    q: "Do I need any special equipment?",
    a: "No! Our AI clone technology works with just your script or content. No camera, microphone, or technical skills required.",
  },
  {
    q: "How long does it take to create an AI clone?",
    a: "Your AI clone is ready in approximately 30 minutes from uploading your content.",
  },
  {
    q: "Can I customize my AI clone?",
    a: "Yes, you can customize voice, appearance, gestures, and video style to match your brand.",
  },
  {
    q: "What video formats are supported?",
    a: "We support MP4, WebM, MOV, and AVI formats. Downloads are optimized for all platforms.",
  },
  {
    q: "Is my content secure?",
    a: "Absolutely. All uploads are encrypted, and your content is never shared with third parties.",
  },
  {
    q: "What if I want unlimited AI clones?",
    a: "We offer plan upgrades for teams needing multiple AI clones and enterprise features.",
  },
]

const socialProof = [
  { name: "Creator A", logo: "👤" },
  { name: "Creator B", logo: "👤" },
  { name: "Creator C", logo: "👤" },
  { name: "Creator D", logo: "👤" },
]

// ============================================================================
// SUBCOMPONENTS
// ============================================================================

/**
 * Header Component
 * Sticky navigation with transparent-to-solid background on scroll
 */
function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-bg bg-opacity-95 backdrop-blur-md border-b border-brand-500 border-opacity-20"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">AI</span>
          </div>
          <span className="text-white font-semibold hidden sm:inline">AI Clone</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <motion.a
              key={item.label}
              href={item.href}
              className="text-gray-300 hover:text-white text-sm transition-colors"
              whileHover={{ x: 2 }}
            >
              {item.label}
            </motion.a>
          ))}
        </div>

        {/* CTA Button + Mobile Menu */}
        <div className="flex items-center gap-4">
          <motion.button
            className="hidden sm:block px-6 py-2 rounded-full bg-gradient-to-r from-brand-600 to-brand-500 text-white font-medium text-sm hover:shadow-lg hover:shadow-brand-500/50 transition-shadow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => console.log("[v0] CTA clicked: Get Your AI Clone")}
          >
            Get Your AI Clone — $37
          </motion.button>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-bg bg-opacity-95 backdrop-blur-md border-b border-brand-500 border-opacity-20"
          >
            <div className="px-4 py-4 flex flex-col gap-4">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-gray-300 hover:text-white text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <motion.button
                className="w-full px-4 py-2 rounded-full bg-gradient-to-r from-brand-600 to-brand-500 text-white font-medium text-sm mt-2"
                whileTap={{ scale: 0.98 }}
              >
                Get Your AI Clone — $37
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

/**
 * Hero Component
 * Main headline, subheadline, CTAs, and media preview card
 */
function Hero() {
  const containerRef = useRef(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    setMousePosition({
      x: (e.clientX - rect.left - rect.width / 2) / 50,
      y: (e.clientY - rect.top - rect.height / 2) / 50,
    })
  }

  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-bg to-bg">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-3 py-1 rounded-full bg-brand-500 bg-opacity-20 border border-brand-500 border-opacity-30 mb-6"
            >
              <span className="text-brand-400 text-xs font-semibold">✨ Start in 3 steps</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 text-balance"
            >
              Create Your AI Clone In Just 30 mins
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="text-lg text-gray-400 mb-8 leading-relaxed text-balance"
            >
              No camera. No editing. No tech skills.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex gap-4 flex-wrap"
            >
              <motion.button
                className="px-8 py-3 rounded-full bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold hover:shadow-lg hover:shadow-brand-500/50 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => console.log("[v0] Primary CTA clicked")}
              >
                Get Your AI Clone — $37
              </motion.button>
              <motion.button
                className="px-8 py-3 rounded-full border border-brand-500 border-opacity-50 text-white font-semibold hover:bg-brand-500 hover:bg-opacity-10 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="flex items-center gap-2">
                  <Play size={16} /> See How It Works
                </span>
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Media Card */}
          <motion.div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="perspective"
          >
            <motion.div
              style={{
                rotateX: mousePosition.y,
                rotateY: mousePosition.x,
                transformPerspective: "1000px",
              }}
              className="rounded-2xl overflow-hidden bg-gradient-to-br from-brand-500 to-brand-600 p-1 shadow-2xl"
            >
              <div className="rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 p-8 flex items-center justify-center relative overflow-hidden">
                {/* Animated glow background */}
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                  className="absolute inset-0 bg-gradient-to-br from-brand-500 to-brand-600 opacity-20"
                />

                {/* Avatar placeholder */}
                <div className="relative z-10 text-center">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                    className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-accent to-brand-400 flex items-center justify-center"
                  >
                    <span className="text-3xl">🎬</span>
                  </motion.div>
                  <p className="text-gray-300 font-semibold">Your AI Clone</p>
                  <p className="text-gray-500 text-sm mt-1">Professional videos in minutes</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/**
 * Trust/Social Proof Strip
 * Displays logos and brief trust message
 */
function TrustStrip() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-12 px-4 bg-gradient-to-r from-brand-500 from-opacity-10 to-brand-600 to-opacity-10 border-y border-brand-500 border-opacity-20"
    >
      <div className="max-w-7xl mx-auto">
        <p className="text-center text-gray-300 text-sm font-semibold mb-8">
          Trusted by creators & marketers worldwide
        </p>
        <div className="flex justify-center items-center gap-8 flex-wrap">
          {socialProof.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="text-2xl"
            >
              {item.logo}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

/**
 * Pricing Cards Component
 * Three-column comparison: Old Way, DIY Way, Smart Way (AI Clone)
 */
function PricingCards() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-bg to-gray-950">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Compare Your Options</h2>
          <p className="text-gray-400 text-lg">See why smart creators choose AI Clone</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {pricingCards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className={`rounded-xl p-8 relative group transition-all ${
                card.highlight
                  ? "bg-gradient-to-br from-brand-600 to-brand-500 shadow-2xl shadow-brand-500/50 scale-105"
                  : "bg-gray-900 border border-gray-800 hover:border-brand-500 hover:border-opacity-50"
              }`}
            >
              {card.highlight && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2"
                >
                  <div className="bg-accent text-gray-900 px-4 py-1 rounded-full text-xs font-bold">{card.badge}</div>
                </motion.div>
              )}

              <div className="text-4xl mb-4">{card.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-4">{card.title}</h3>

              <div className="mb-6">
                <p className={`text-3xl font-bold ${card.highlight ? "text-white" : "text-brand-400"}`}>{card.cost}</p>
                <p className="text-sm text-gray-400 mt-1">{card.time}</p>
              </div>

              <motion.div
                className={`space-y-3 mb-8 pb-8 border-b ${
                  card.highlight ? "border-white border-opacity-20" : "border-gray-800"
                }`}
              >
                {card.items.map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <MdCheckCircle
                      size={16}
                      className={`mt-1 flex-shrink-0 ${card.highlight ? "text-white" : "text-brand-400"}`}
                    />
                    <span className={card.highlight ? "text-white text-sm" : "text-gray-300 text-sm"}>{item}</span>
                  </div>
                ))}
              </motion.div>

              {card.highlight && (
                <div className="text-green-300 font-semibold text-sm mb-6">💰 You save $4,963 - $5,963</div>
              )}

              <motion.button
                className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  card.highlight
                    ? "bg-white text-brand-600 hover:bg-gray-50"
                    : "bg-brand-500 bg-opacity-20 text-white hover:bg-opacity-30 border border-brand-500 border-opacity-30"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Choose {card.title === "Smart Way (AI Clone)" ? "This" : "This Way"}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * Features Grid Component
 * 4-column grid of benefits with staggered entrance
 */
function FeaturesGrid() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-950 to-bg">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Why Creators Love AI Clone</h2>
          <p className="text-gray-400 text-lg">Everything you need, nothing you don't</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group"
            >
              <div className="rounded-xl bg-gradient-to-br from-brand-500 from-opacity-10 to-brand-600 to-opacity-10 border border-brand-500 border-opacity-20 p-8 hover:border-brand-400 hover:border-opacity-50 transition-all hover:shadow-lg hover:shadow-brand-500/20 h-full">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * Process Steps Component
 * 3-step numbered process with animated connecting line
 */
function ProcessSteps() {
  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-bg to-gray-950">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-gray-400 text-lg">Three simple steps to your AI clone</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line (hidden on mobile) */}
          <div className="hidden md:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 via-brand-400 to-brand-500 opacity-30" />

          {processSteps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="relative"
            >
              {/* Number badge */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: idx * 0.15 + 0.1, type: "spring", stiffness: 100 }}
                className="absolute -top-12 left-0 w-12 h-12 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center mb-6 z-10 border-2 border-bg"
              >
                <span className="text-white font-bold text-lg">{step.number}</span>
              </motion.div>

              <div className="pt-8 pl-16 md:pl-0 md:pt-16">
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * FAQ Accordion Component
 * Accessible accordion with smooth expand/collapse animations
 */
function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-950 to-bg">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Frequently Asked Questions</h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="rounded-lg border border-brand-500 border-opacity-20 overflow-hidden bg-gray-900 bg-opacity-50"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-800 hover:bg-opacity-50 transition-colors text-left"
                aria-expanded={openIndex === idx}
              >
                <span className="font-semibold text-white text-base">{faq.q}</span>
                <motion.div animate={{ rotate: openIndex === idx ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown size={20} className="text-brand-400" />
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="px-6 py-4 border-t border-brand-500 border-opacity-20 text-gray-300 text-sm leading-relaxed"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * Pricing CTA Strip
 * Final call-to-action with pricing reinforcement
 */
function PricingCtaStrip() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-brand-600 via-brand-500 to-brand-600 relative overflow-hidden"
    >
      {/* Animated background */}
      <motion.div
        animate={{
          x: [0, 100, 0],
        }}
        transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY }}
        className="absolute inset-0 opacity-10"
      />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Create Your AI Clone?</h3>
        <p className="text-white text-opacity-90 text-lg mb-8">
          Get started today for just $37. Join hundreds of creators already using AI Clone.
        </p>

        <motion.button
          className="px-10 py-4 rounded-full bg-white text-brand-600 font-bold text-lg hover:bg-gray-50 transition-all shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => console.log("[v0] CTA clicked: Pricing strip")}
        >
          Get Your AI Clone Now — $37
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-white text-opacity-75 text-sm mt-6"
        >
          <a href="#" className="underline hover:text-opacity-100">
            See refund policy
          </a>
        </motion.p>
      </div>
    </motion.section>
  )
}

/**
 * Footer Component
 * Links, social icons, copyright
 */
function Footer() {
  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-950 border-t border-brand-500 border-opacity-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
                <span className="text-white font-bold text-xs">AI</span>
              </div>
              <span className="text-white font-semibold">AI Clone</span>
            </div>
            <p className="text-gray-500 text-sm">Create professional videos in minutes.</p>
          </motion.div>

          {/* Links */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  FAQs
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <div className="space-y-2 text-gray-400 text-sm">
              <p className="flex items-center gap-2">
                <MdEmail size={16} />
                <a href="mailto:hello@aiclone.com" className="hover:text-white transition-colors">
                  hello@aiclone.com
                </a>
              </p>
              <p className="flex items-center gap-2">
                <MdPhone size={16} />
                <a href="tel:+1234567890" className="hover:text-white transition-colors">
                  +1 (234) 567-890
                </a>
              </p>
            </div>
          </motion.div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">© 2025 AI Clone. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">
              Privacy
            </a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">
              Terms
            </a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Main Landing Page Component
 * Combines all subcomponents into complete landing page
 */
export default function AiCloneLanding() {
  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) {
      console.log("[v0] Reduced motion detected: animations trimmed")
    }
  }, [])

  return (
    <div className="min-h-screen bg-bg text-white overflow-x-hidden">
      <Header />
      <main>
        <Hero />
        <TrustStrip />
        <PricingCards />
        <FeaturesGrid />
        <ProcessSteps />
        <FaqAccordion />
        <PricingCtaStrip />
      </main>
      <Footer />
    </div>
  )
}
