"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { motion } from "framer-motion"

interface ScrollExpandMediaProps {
  mediaType?: "video" | "image"
  mediaSrc: string
  posterSrc?: string
  bgImageSrc: string
  title?: string
  scrollToExpand?: string
  textBlend?: boolean
  children?: ReactNode
}

export function ScrollExpandMedia({
  mediaType = "video",
  mediaSrc,
  posterSrc,
  bgImageSrc,
  title,
  scrollToExpand,
  textBlend,
  children,
}: ScrollExpandMediaProps) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showContent, setShowContent] = useState(false)
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState(false)
  const [touchStartY, setTouchStartY] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setScrollProgress(0)
    setShowContent(false)
    setMediaFullyExpanded(false)
  }, [mediaType])

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (mediaFullyExpanded && e.deltaY < 0 && window.scrollY <= 5) {
        setMediaFullyExpanded(false)
        e.preventDefault()
      } else if (!mediaFullyExpanded) {
        e.preventDefault()
        const scrollDelta = e.deltaY * 0.0009
        const newProgress = Math.min(Math.max(scrollProgress + scrollDelta, 0), 1)
        setScrollProgress(newProgress)
        if (newProgress >= 1) {
          setMediaFullyExpanded(true)
          setShowContent(true)
        } else if (newProgress < 0.75) {
          setShowContent(false)
        }
      }
    }

    const handleTouchStart = (e: TouchEvent) => {
      setTouchStartY(e.touches[0].clientY)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartY) return
      const touchY = e.touches[0].clientY
      const deltaY = touchStartY - touchY

      if (mediaFullyExpanded && deltaY < -20 && window.scrollY <= 5) {
        setMediaFullyExpanded(false)
        e.preventDefault()
      } else if (!mediaFullyExpanded) {
        e.preventDefault()
        const scrollFactor = deltaY < 0 ? 0.008 : 0.005
        const scrollDelta = deltaY * scrollFactor
        const newProgress = Math.min(Math.max(scrollProgress + scrollDelta, 0), 1)
        setScrollProgress(newProgress)
        if (newProgress >= 1) {
          setMediaFullyExpanded(true)
          setShowContent(true)
        } else if (newProgress < 0.75) {
          setShowContent(false)
        }
        setTouchStartY(touchY)
      }
    }

    const handleScroll = () => {
      if (!mediaFullyExpanded) {
        window.scrollTo(0, 0)
      }
    }

    window.addEventListener("wheel", handleWheel, { passive: false })
    window.addEventListener("scroll", handleScroll)
    window.addEventListener("touchstart", handleTouchStart as any, { passive: false })
    window.addEventListener("touchmove", handleTouchMove as any, { passive: false })
    window.addEventListener("touchend", () => setTouchStartY(0))

    return () => {
      window.removeEventListener("wheel", handleWheel)
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("touchstart", handleTouchStart as any)
      window.removeEventListener("touchmove", handleTouchMove as any)
      window.removeEventListener("touchend", () => setTouchStartY(0))
    }
  }, [scrollProgress, mediaFullyExpanded, touchStartY])

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  const mediaWidth = 300 + scrollProgress * (isMobile ? 650 : 1250)
  const mediaHeight = 400 + scrollProgress * (isMobile ? 200 : 400)
  const textTranslateX = scrollProgress * (isMobile ? 180 : 150)

  const firstWord = title ? title.split(" ")[0] : ""
  const restOfTitle = title ? title.split(" ").slice(1).join(" ") : ""

  return (
    <div style={{ overflowX: "hidden", transition: "background-color 700ms ease-in-out" }}>
      <section style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", minHeight: "100dvh" }}>
        <div style={{ position: "relative", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", minHeight: "100dvh" }}>
          {/* Background image */}
          <motion.div
            style={{ position: "absolute", inset: 0, zIndex: 0, height: "100%" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 - scrollProgress }}
            transition={{ duration: 0.1 }}
          >
            <img
              src={bgImageSrc}
              alt="Background"
              style={{ width: "100vw", height: "100vh", objectFit: "cover", objectPosition: "center" }}
            />
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.1)" }} />
          </motion.div>

          <div style={{ margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", position: "relative", zIndex: 10, width: "100%" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", height: "100dvh", position: "relative" }}>
              {/* Expanding media frame */}
              <div
                style={{
                  position: "absolute",
                  zIndex: 0,
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: `${mediaWidth}px`,
                  height: `${mediaHeight}px`,
                  maxWidth: "95vw",
                  maxHeight: "85vh",
                  boxShadow: "0px 0px 50px rgba(0, 0, 0, 0.3)",
                  borderRadius: "16px",
                  overflow: "hidden",
                }}
              >
                {mediaType === "video" && mediaSrc.includes("youtube.com") ? (
                  <div style={{ position: "relative", width: "100%", height: "100%", pointerEvents: "none" }}>
                    <iframe
                      width="100%"
                      height="100%"
                      src={
                        mediaSrc.includes("embed")
                          ? mediaSrc + (mediaSrc.includes("?") ? "&" : "?") + "autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1"
                          : mediaSrc.replace("watch?v=", "embed/") + "?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1&playlist=" + mediaSrc.split("v=")[1]
                      }
                      style={{ width: "100%", height: "100%", borderRadius: "12px", border: "none" }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                    <div style={{ position: "absolute", inset: 0, zIndex: 10, pointerEvents: "none" }} />
                    <motion.div
                      style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", borderRadius: "12px" }}
                      initial={{ opacity: 0.7 }}
                      animate={{ opacity: 0.5 - scrollProgress * 0.3 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                ) : mediaType === "video" ? (
                  <div style={{ position: "relative", width: "100%", height: "100%", pointerEvents: "none" }}>
                    <video
                      src={mediaSrc}
                      poster={posterSrc}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="auto"
                      style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "12px" }}
                    />
                    <motion.div
                      style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", borderRadius: "12px" }}
                      initial={{ opacity: 0.7 }}
                      animate={{ opacity: 0.5 - scrollProgress * 0.3 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                ) : (
                  <div style={{ position: "relative", width: "100%", height: "100%" }}>
                    <img
                      src={mediaSrc}
                      alt={title || "Media"}
                      style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "12px" }}
                    />
                    <motion.div
                      style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", borderRadius: "12px" }}
                      initial={{ opacity: 0.7 }}
                      animate={{ opacity: 0.7 - scrollProgress * 0.3 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                )}

                {/* Below-media text */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", position: "relative", zIndex: 10, marginTop: "1rem" }}>
                  {scrollToExpand && (
                    <p style={{ color: "rgba(255,255,255,0.6)", fontWeight: 500, fontSize: "0.8rem", transform: `translateX(${textTranslateX}vw)` }}>
                      {scrollToExpand}
                    </p>
                  )}
                </div>
              </div>

              {/* Split title text */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                gap: "1rem",
                width: "100%",
                position: "relative",
                zIndex: 10,
                flexDirection: "column",
                ...(textBlend ? { mixBlendMode: "difference" } : {}),
              }}>
                <motion.h2
                  style={{
                    fontSize: "clamp(2.5rem, 6vw, 4rem)",
                    fontWeight: 700,
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: "italic",
                    color: "rgba(255,255,255,0.9)",
                    transform: `translateX(-${textTranslateX}vw)`,
                  }}
                >
                  {firstWord}
                </motion.h2>
                <motion.h2
                  style={{
                    fontSize: "clamp(2.5rem, 6vw, 4rem)",
                    fontWeight: 700,
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: "italic",
                    color: "rgba(255,255,255,0.9)",
                    transform: `translateX(${textTranslateX}vw)`,
                  }}
                >
                  {restOfTitle}
                </motion.h2>
              </div>
            </div>

            {/* Content revealed after expansion */}
            <motion.section
              style={{ display: "flex", flexDirection: "column", width: "100%", padding: "2.5rem 2rem 5rem" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: showContent ? 1 : 0 }}
              transition={{ duration: 0.7 }}
            >
              {children}
            </motion.section>
          </div>
        </div>
      </section>
    </div>
  )
}
