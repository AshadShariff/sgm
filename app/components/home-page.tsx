"use client"

import { useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Play } from "lucide-react"
import Footer from "./footer"

const CONFIG = {
  aiClone: {
    hero: {
      cta: "Get Your AI Clone — $37",
    },
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

export default function HomePage() {
  const prefersReducedMotion =
    typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false

  return (
    <main className="bg-[#F5E6D3]">
      {/* Hero Section */}
      <section className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-[#F5E6D3]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left: Headline & CTA */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: prefersReducedMotion ? 0 : 0.2 }}
          >
            <motion.h1
              className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.05, delayChildren: prefersReducedMotion ? 0 : 0.3 }}
            >
              Create Professional Video Content In Minutes
            </motion.h1>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Transform your vision into stunning video content with our AI-powered platform. No equipment. No
              experience. Just results.
            </p>
            <div className="flex gap-4">
              <Link href="/ai-clone">
                <motion.button
                  className="px-8 py-3 bg-[#B45309] text-white rounded-lg font-semibold hover:bg-[#92400E] transition-colors shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started Now
                </motion.button>
              </Link>
              <motion.button
                className="px-8 py-3 border-2 border-[#B45309] text-[#B45309] rounded-lg font-semibold hover:bg-[#B45309]/10 transition-colors"
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
              className="relative rounded-2xl overflow-hidden border-2 border-[#B45309]/30 bg-white p-1 shadow-2xl"
              animate={prefersReducedMotion ? {} : { y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
            >
              <img
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop"
                alt="Professional video content creation"
                className="w-full rounded-xl"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.button
                  className="p-4 bg-[#EA580C] rounded-full shadow-lg hover:bg-[#D97706] transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play size={32} className="text-white fill-white ml-1" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-xl text-gray-700">Everything you need to create professional video content</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {CONFIG.home.services.map((service, idx) => (
              <motion.div
                key={idx}
                className="p-6 rounded-xl bg-[#F5E6D3] border-2 border-[#B45309]/30 hover:border-[#B45309] transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                whileHover={{ y: -5 }}
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-700">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F5E6D3]">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-4xl font-bold text-gray-900 mb-16 text-center"
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
                className="group rounded-xl overflow-hidden border-2 border-[#B45309]/30 hover:border-[#B45309] transition-colors cursor-pointer bg-white"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                whileHover={{ y: -8 }}
              >
                <div className="relative h-48 overflow-hidden bg-gray-200">
                  <img
                    src={study.image || "/placeholder.svg"}
                    alt={study.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <button className="w-full py-2 bg-[#B45309] text-white rounded-lg font-semibold hover:bg-[#92400E] transition-colors">
                      See Case Study
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{study.title}</h3>
                  <p className="text-gray-700">{study.subtitle}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA to AI Clone */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#B45309]">
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
          <p className="text-xl text-white/90 mb-8">
            Join thousands of creators who are using AI to scale their content production.
          </p>
          <Link href="/ai-clone#process-flow">
            <motion.button
              className="px-8 py-4 bg-white text-[#B45309] rounded-lg font-semibold hover:bg-gray-100 transition-colors text-lg shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Your AI Clone At $37
            </motion.button>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}

