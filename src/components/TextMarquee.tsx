"use client"
import { useRef, useEffect, forwardRef } from "react"
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

const TextMarquee = forwardRef<HTMLDivElement, TextMarqueeProps>(
  ({ children, baseVelocity = -5, className, scrollDependent = false, delay = 0 }, ref) => {
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

    const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`)

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
      <div ref={ref} style={{ overflow: "hidden", whiteSpace: "nowrap", display: "flex", flexWrap: "nowrap" }}>
        <motion.div
          style={{ display: "flex", whiteSpace: "nowrap", gap: "0.5em", flexWrap: "nowrap", x }}
        >
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={className} style={{ display: "block" }}>
              {children}
            </span>
          ))}
        </motion.div>
      </div>
    )
  }
)

TextMarquee.displayName = "TextMarquee"

export { TextMarquee }
