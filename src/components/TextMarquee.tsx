"use client"
import { useRef, useEffect } from "react"
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useAnimationFrame,
  useMotionValue,
} from "framer-motion"

function wrap(min: number, max: number, v: number): number {
  const range = max - min
  return ((((v - min) % range) + range) % range) + min
}

interface TextMarqueeProps {
  children: string
  baseVelocity?: number
  className?: string
  scrollDependent?: boolean
  delay?: number
}

function TextMarquee({
  children,
  baseVelocity = -5,
  className,
  scrollDependent = true,
  delay = 0,
}: TextMarqueeProps) {
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  })
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 2], {
    clamp: false,
  })

  const x = useTransform(baseX, (v) => `${wrap(0, -25, v)}%`)

  const directionFactor = useRef<number>(1)
  const hasStarted = useRef(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      hasStarted.current = true
    }, delay)
    return () => clearTimeout(timer)
  }, [delay])

  useAnimationFrame((t, delta) => {
    if (!hasStarted.current) return

    let moveBy = directionFactor.current * baseVelocity * (delta / 1000)

    if (scrollDependent) {
      if (velocityFactor.get() < 0) {
        directionFactor.current = -1
      } else if (velocityFactor.get() > 0) {
        directionFactor.current = 1
      }
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get()
    baseX.set(baseX.get() + moveBy)
  })

  return (
    <div style={{
      overflow: "hidden",
      whiteSpace: "nowrap",
      width: "100%",
    }}>
      <motion.div
        style={{
          display: "inline-flex",
          whiteSpace: "nowrap",
          x,
        }}
      >
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={className}
            style={{
              display: "inline-block",
              paddingRight: "0.3em",
            }}
          >
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

export { TextMarquee }
