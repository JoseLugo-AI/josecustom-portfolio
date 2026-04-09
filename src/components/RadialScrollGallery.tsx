"use client"

import { gsap } from "gsap"
import React, {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

function useMergeRefs<T>(...refs: (Ref<T> | undefined)[]) {
  return useMemo(() => {
    if (refs.every((ref) => ref == null)) return null
    return (node: T) => {
      refs.forEach((ref) => {
        if (typeof ref === "function") {
          ref(node)
        } else if (ref != null) {
          ;(ref as React.MutableRefObject<T | null>).current = node
        }
      })
    }
  }, [refs])
}

function useResponsiveValue(baseValue: number, mobileValue: number) {
  const [value, setValue] = useState(baseValue)

  useEffect(() => {
    if (typeof window === "undefined") return

    const handleResize = () => {
      setValue(window.innerWidth < 768 ? mobileValue : baseValue)
    }

    handleResize()

    let timeoutId: NodeJS.Timeout
    const debouncedResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(handleResize, 100)
    }

    window.addEventListener("resize", debouncedResize)
    return () => {
      window.removeEventListener("resize", debouncedResize)
      clearTimeout(timeoutId)
    }
  }, [baseValue, mobileValue])

  return value
}

export interface RadialScrollGalleryProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  children: (hoveredIndex: number | null) => ReactNode[]
  scrollDuration?: number
  visiblePercentage?: number
  baseRadius?: number
  mobileRadius?: number
  startTrigger?: string
  onItemSelect?: (index: number) => void
  direction?: "ltr" | "rtl"
  disabled?: boolean
}

export const RadialScrollGallery = forwardRef<
  HTMLDivElement,
  RadialScrollGalleryProps
>(
  (
    {
      children,
      visiblePercentage = 45,
      baseRadius = 550,
      mobileRadius = 220,
      className = "",
      onItemSelect,
      direction = "ltr",
      disabled = false,
      ...rest
    },
    ref
  ) => {
    const pinRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLUListElement>(null)
    const childRef = useRef<HTMLLIElement>(null)

    const mergedRef = useMergeRefs(ref, pinRef)

    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
    const [childSize, setChildSize] = useState<{ w: number; h: number } | null>(
      null
    )
    const [isMounted, setIsMounted] = useState(false)

    const rotationRef = useRef(0)
    const isOverGallery = useRef(false)

    const currentRadius = useResponsiveValue(baseRadius, mobileRadius)
    const circleDiameter = currentRadius * 2

    const { visibleDecimal, hiddenDecimal } = useMemo(() => {
      const clamped = Math.max(10, Math.min(100, visiblePercentage))
      const v = clamped / 100
      return { visibleDecimal: v, hiddenDecimal: 1 - v }
    }, [visiblePercentage])

    const childrenNodes = useMemo(
      () => React.Children.toArray(children(hoveredIndex)),
      [children, hoveredIndex]
    )
    const childrenCount = childrenNodes.length

    useEffect(() => {
      setIsMounted(true)

      if (!childRef.current) return

      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setChildSize({
            w: entry.contentRect.width,
            h: entry.contentRect.height,
          })
        }
      })

      observer.observe(childRef.current)
      return () => observer.disconnect()
    }, [childrenCount])

    // Entry animation
    useEffect(() => {
      if (!containerRef.current || childrenCount === 0 || !isMounted) return

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches

      if (prefersReducedMotion) {
        gsap.set(containerRef.current.children, { scale: 1, autoAlpha: 1 })
        return
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              gsap.fromTo(
                containerRef.current!.children,
                { scale: 0, autoAlpha: 0 },
                {
                  scale: 1,
                  autoAlpha: 1,
                  duration: 1.2,
                  ease: "back.out(1.2)",
                  stagger: 0.05,
                  force3D: true,
                }
              )
              observer.disconnect()
            }
          })
        },
        { threshold: 0.2 }
      )

      observer.observe(containerRef.current)
      return () => observer.disconnect()
    }, [childrenCount, isMounted])

    // Wheel-driven rotation
    const handleWheel = useCallback(
      (e: WheelEvent) => {
        if (disabled) return

        e.preventDefault()

        const sensitivity = 0.15
        const delta = e.deltaY * sensitivity
        rotationRef.current += delta

        if (containerRef.current) {
          gsap.to(containerRef.current, {
            rotation: rotationRef.current,
            duration: 0.6,
            ease: "power2.out",
            force3D: true,
            overwrite: true,
          })
        }
      },
      [disabled]
    )

    useEffect(() => {
      const el = pinRef.current
      if (!el) return

      const onEnter = () => { isOverGallery.current = true }
      const onLeave = () => { isOverGallery.current = false }

      el.addEventListener("mouseenter", onEnter)
      el.addEventListener("mouseleave", onLeave)
      el.addEventListener("wheel", handleWheel, { passive: false })

      return () => {
        el.removeEventListener("mouseenter", onEnter)
        el.removeEventListener("mouseleave", onLeave)
        el.removeEventListener("wheel", handleWheel)
      }
    }, [handleWheel])

    // Touch-driven rotation
    const touchStartY = useRef(0)

    useEffect(() => {
      const el = pinRef.current
      if (!el || disabled) return

      const onTouchStart = (e: TouchEvent) => {
        touchStartY.current = e.touches[0].clientY
      }

      const onTouchMove = (e: TouchEvent) => {
        e.preventDefault()
        const deltaY = touchStartY.current - e.touches[0].clientY
        touchStartY.current = e.touches[0].clientY

        const sensitivity = 0.3
        rotationRef.current += deltaY * sensitivity

        if (containerRef.current) {
          gsap.to(containerRef.current, {
            rotation: rotationRef.current,
            duration: 0.4,
            ease: "power2.out",
            force3D: true,
            overwrite: true,
          })
        }
      }

      el.addEventListener("touchstart", onTouchStart, { passive: true })
      el.addEventListener("touchmove", onTouchMove, { passive: false })

      return () => {
        el.removeEventListener("touchstart", onTouchStart)
        el.removeEventListener("touchmove", onTouchMove)
      }
    }, [disabled])

    if (childrenCount === 0) return null

    const scaleFactor = 1.25
    const calculatedBuffer = childSize
      ? childSize.h * scaleFactor - childSize.h + 60
      : 150

    const visibleAreaHeight = childSize
      ? circleDiameter * visibleDecimal + childSize.h / 2 + calculatedBuffer
      : circleDiameter * visibleDecimal + 200

    return (
      <div
        ref={mergedRef}
        className={className}
        style={{
          width: "100%",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          cursor: "ns-resize",
        }}
        {...rest}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            overflow: "hidden",
            height: `${visibleAreaHeight}px`,
            maskImage:
              "linear-gradient(to top, transparent 0%, black 40%, black 100%)",
            WebkitMaskImage:
              "linear-gradient(to top, transparent 0%, black 40%, black 100%)",
          }}
        >
          <ul
            ref={containerRef}
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              willChange: "transform",
              margin: 0,
              padding: 0,
              listStyle: "none",
              width: circleDiameter,
              height: circleDiameter,
              bottom: -(circleDiameter * hiddenDecimal),
              transition: "opacity 500ms ease-out",
              opacity: isMounted ? 1 : 0,
              ...(disabled
                ? { opacity: 0.5, pointerEvents: "none" as const, filter: "grayscale(1)" }
                : {}),
            }}
            dir={direction}
          >
            {childrenNodes.map((child, index) => {
              const angle = (index / childrenCount) * 2 * Math.PI
              let x = currentRadius * Math.cos(angle)
              const y = currentRadius * Math.sin(angle)

              if (direction === "rtl") {
                x = -x
              }

              const rotationAngle = (angle * 180) / Math.PI
              const isHovered = hoveredIndex === index
              const isAnyHovered = hoveredIndex !== null

              return (
                <li
                  key={index}
                  ref={index === 0 ? childRef : null}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    zIndex: isHovered ? 100 : 10,
                    transform: `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0) rotate(${
                      rotationAngle + 90
                    }deg)`,
                  }}
                >
                  <div
                    role="button"
                    tabIndex={disabled ? -1 : 0}
                    onClick={() => !disabled && onItemSelect?.(index)}
                    onKeyDown={(e) => {
                      if (disabled) return
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        onItemSelect?.(index)
                      }
                    }}
                    onMouseEnter={() => !disabled && setHoveredIndex(index)}
                    onMouseLeave={() => !disabled && setHoveredIndex(null)}
                    onFocus={() => !disabled && setHoveredIndex(index)}
                    onBlur={() => !disabled && setHoveredIndex(null)}
                    style={{
                      display: "block",
                      cursor: "pointer",
                      outline: "none",
                      textAlign: "left" as const,
                      borderRadius: "12px",
                      transition: "all 500ms ease-out",
                      willChange: "transform",
                      transform: isHovered
                        ? "scale(1.25) translateY(-8px)"
                        : "scale(1)",
                      filter:
                        isAnyHovered && !isHovered
                          ? "blur(2px) grayscale(1)"
                          : "blur(0) grayscale(0)",
                      opacity: isAnyHovered && !isHovered ? 0.4 : 1,
                    }}
                  >
                    {child}
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    )
  }
)

RadialScrollGallery.displayName = "RadialScrollGallery"
