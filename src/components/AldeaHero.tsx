"use client"
import { useEffect, useRef, useState } from "react"
import { MeshGradient } from "@paper-design/shaders-react"
import { motion } from "framer-motion"

export default function AldeaHero() {
  return (
    <div className="aldea-hero">
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

      <motion.div
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
          width: 100%;
          min-height: 55vh;
          margin-top: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}
