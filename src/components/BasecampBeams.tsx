"use client"
import { useEffect, useRef } from "react"

interface Beam {
  x: number
  y: number
  width: number
  length: number
  angle: number
  speed: number
  opacity: number
  pulse: number
  pulseSpeed: number
  layer: number
}

const LAYERS = 3
const BEAMS_PER_LAYER = 8

function createBeam(width: number, height: number, layer: number): Beam {
  const angle = -35 + Math.random() * 10
  const baseSpeed = 0.2 + layer * 0.2
  const baseOpacity = 0.08 + layer * 0.05
  const baseWidth = 10 + layer * 5
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    width: baseWidth,
    length: height * 2.5,
    angle,
    speed: baseSpeed + Math.random() * 0.2,
    opacity: baseOpacity + Math.random() * 0.1,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.01 + Math.random() * 0.015,
    layer,
  }
}

export default function BasecampBeams() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const noiseRef = useRef<HTMLCanvasElement>(null)
  const beamsRef = useRef<Beam[]>([])
  const animationFrameRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const noiseCanvas = noiseRef.current
    if (!canvas || !noiseCanvas) return
    const ctx = canvas.getContext("2d")
    const nCtx = noiseCanvas.getContext("2d")
    if (!ctx || !nCtx) return

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1
      const w = window.innerWidth
      const h = window.innerHeight

      if (w === 0 || h === 0) return

      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)

      noiseCanvas.width = w * dpr
      noiseCanvas.height = h * dpr
      noiseCanvas.style.width = `${w}px`
      noiseCanvas.style.height = `${h}px`
      nCtx.setTransform(1, 0, 0, 1, 0, 0)
      nCtx.scale(dpr, dpr)

      beamsRef.current = []
      for (let layer = 1; layer <= LAYERS; layer++) {
        for (let i = 0; i < BEAMS_PER_LAYER; i++) {
          beamsRef.current.push(createBeam(w, h, layer))
        }
      }
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const generateNoise = () => {
      if (noiseCanvas.width === 0 || noiseCanvas.height === 0) return
      const imgData = nCtx.createImageData(noiseCanvas.width, noiseCanvas.height)
      for (let i = 0; i < imgData.data.length; i += 4) {
        const v = Math.random() * 255
        imgData.data[i] = v
        imgData.data[i + 1] = v
        imgData.data[i + 2] = v
        imgData.data[i + 3] = 12
      }
      nCtx.putImageData(imgData, 0, 0)
    }

    const drawBeam = (beam: Beam) => {
      ctx.save()
      ctx.translate(beam.x, beam.y)
      ctx.rotate((beam.angle * Math.PI) / 180)

      const pulsingOpacity = Math.min(1, beam.opacity * (0.8 + Math.sin(beam.pulse) * 0.4))
      const gradient = ctx.createLinearGradient(0, 0, 0, beam.length)
      // Teal beams to match Basecamp palette
      gradient.addColorStop(0, `rgba(94,234,212,0)`)
      gradient.addColorStop(0.2, `rgba(94,234,212,${pulsingOpacity * 0.5})`)
      gradient.addColorStop(0.5, `rgba(94,234,212,${pulsingOpacity})`)
      gradient.addColorStop(0.8, `rgba(94,234,212,${pulsingOpacity * 0.5})`)
      gradient.addColorStop(1, `rgba(94,234,212,0)`)

      ctx.fillStyle = gradient
      ctx.filter = `blur(${2 + beam.layer * 2}px)`
      ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length)
      ctx.restore()
    }

    const animate = () => {
      if (!canvas || !ctx) return
      const w = canvas.style.width ? parseInt(canvas.style.width) : window.innerWidth
      const h = canvas.style.height ? parseInt(canvas.style.height) : window.innerHeight

      // Dark slate gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, h)
      gradient.addColorStop(0, "#0F172A")
      gradient.addColorStop(1, "#1E293B")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, w, h)

      beamsRef.current.forEach((beam) => {
        beam.y -= beam.speed * (beam.layer / LAYERS + 0.5)
        beam.pulse += beam.pulseSpeed
        if (beam.y + beam.length < -50) {
          beam.y = h + 50
          beam.x = Math.random() * w
        }
        drawBeam(beam)
      })

      generateNoise()
      animationFrameRef.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [])

  return (
    <>
      <canvas
        ref={noiseRef}
        style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}
      />
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, zIndex: 1 }}
      />
    </>
  )
}
