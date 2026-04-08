"use client"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

const words = ["POINT.", "PURPOSE.", "PUNCH.", "PASSION.", "KICK."]

export default function CalorRotatingWord() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <span
      style={{
        position: "relative",
        display: "inline-flex",
        overflow: "hidden",
        verticalAlign: "bottom",
      }}
    >
      {/* Invisible spacer to maintain width */}
      <span style={{ visibility: "hidden" }}>PURPOSE.</span>
      {words.map((word, i) => (
        <motion.span
          key={i}
          style={{
            position: "absolute",
            left: 0,
            color: "#C2410C",
            fontStyle: "italic",
            fontWeight: 800,
          }}
          initial={{ opacity: 0, y: 60 }}
          animate={
            index === i
              ? { y: 0, opacity: 1 }
              : { y: index > i ? -60 : 60, opacity: 0 }
          }
          transition={{ type: "spring", stiffness: 80, damping: 14 }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  )
}
