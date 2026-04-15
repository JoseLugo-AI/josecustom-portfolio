"use client"
import { useEffect, useRef } from "react"
import { MeshGradient } from "@paper-design/shaders-react"
import { motion } from "framer-motion"

export default function AldeaHero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const hero = heroRef.current
    const bg = bgRef.current
    const content = contentRef.current
    if (!hero || !bg || !content) return

    const handleScroll = () => {
      const y = window.scrollY
      const heroHeight = hero.offsetHeight
      if (y < heroHeight) {
        const progress = y / heroHeight
        bg.style.transform = `scale(${1 + progress * 0.15}) translateY(${y * 0.3}px)`
        content.style.transform = `translateY(${y * 0.4}px)`
        content.style.opacity = String(1 - progress * 1.2)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="aldea-hero" ref={heroRef}>
      <div className="aldea-hero-bg" ref={bgRef}>
        <MeshGradient
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
          colors={["#1a1a1a", "#FA9819", "#D45A00", "#B6C9CF", "#f5deb3"]}
          speed={0.25}
          backgroundColor="#1a1a1a"
        />
        <MeshGradient
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            opacity: 0.4,
          }}
          colors={["#000000", "#ffffff", "#FA9819", "#C6EBF7"]}
          speed={0.15}
          wireframe="true"
          backgroundColor="transparent"
        />
      </div>

      <motion.div
        ref={contentRef}
        style={{
          position: "relative",
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          color: "#fff",
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <svg viewBox="0 0 64 64" fill="none" width="52" height="52">
          <rect x="4" y="4" width="56" height="56" rx="12" stroke="#fff" strokeWidth="3" />
          <path d="M22 44V20l10 12 10-12v24" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span
          style={{
            fontSize: "clamp(3rem, 5vw, 4.5rem)",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            fontFamily: "'Rethink Sans', sans-serif",
          }}
        >
          Aldea
        </span>
      </motion.div>

      <style>{`
        .aldea-hero {
          position: relative;
          width: 100%;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .aldea-hero-bg {
          position: absolute;
          inset: 0;
          will-change: transform;
        }
      `}</style>
    </div>
  )
}
