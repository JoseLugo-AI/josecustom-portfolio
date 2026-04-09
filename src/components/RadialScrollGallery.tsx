"use client"

import { gsap } from "gsap"
import React, {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
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

    const progressRef = useRef(0) // 0 to 1, where 1 = full 360°
    const isPinned = useRef(false)
    const pinOffset = useRef(0) // scroll position where pin started
    const placeholderRef = useRef<HTMLDivElement>(null)

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

    // Scroll-pinned rotation: pin the gallery, spin 360°, then release
    const SCROLL_DISTANCE = 1200 // px of scroll consumed by the 360° spin

    useEffect(() => {
      const el = pinRef.current
      const placeholder = placeholderRef.current
      if (!el || !placeholder || disabled) return

      const pin = () => {
        if (isPinned.current) return
        isPinned.current = true
        pinOffset.current = window.scrollY

        const rect = el.getBoundingClientRect()
        placeholder.style.height = `${rect.height}px`
        placeholder.style.display = "block"

        el.style.position = "fixed"
        el.style.top = `${rect.top}px`
        el.style.left = "0"
        el.style.width = "100%"
        el.style.zIndex = "50"
      }

      const unpin = (scrollTo: number) => {
        if (!isPinned.current) return
        isPinned.current = false

        el.style.position = ""
        el.style.top = ""
        el.style.left = ""
        el.style.width = ""
        el.style.zIndex = ""
        placeholder.style.display = "none"

        window.scrollTo(0, scrollTo)
      }

      const handleWheel = (e: WheelEvent) => {
        const elRect = el.getBoundingClientRect()
        const inView =
          elRect.top < window.innerHeight * 0.6 && elRect.bottom > window.innerHeight * 0.4

        // Not pinned yet — check if we should pin
        if (!isPinned.current) {
          if (inView && e.deltaY > 0 && progressRef.current < 1) {
            pin()
            e.preventDefault()
            return
          }
          if (inView && e.deltaY < 0 && progressRef.current > 0) {
            pin()
            e.preventDefault()
            return
          }
          return // let page scroll normally
        }

        // We are pinned — consume scroll to rotate
        e.preventDefault()

        const delta = e.deltaY / SCROLL_DISTANCE
        progressRef.current = Math.max(0, Math.min(1, progressRef.current + delta))

        if (containerRef.current) {
          gsap.to(containerRef.current, {
            rotation: progressRef.current * 360,
            duration: 0.5,
            ease: "power2.out",
            force3D: true,
            overwrite: true,
          })
        }

        // Release pin when progress hits bounds
        if (progressRef.current >= 1 && e.deltaY > 0) {
          progressRef.current = 1
          unpin(pinOffset.current + SCROLL_DISTANCE)
        } else if (progressRef.current <= 0 && e.deltaY < 0) {
          progressRef.current = 0
          unpin(pinOffset.current)
        }
      }

      window.addEventListener("wheel", handleWheel, { passive: false })
      return () => window.removeEventListener("wheel", handleWheel)
    }, [disabled, SCROLL_DISTANCE])

    // Touch-pinned rotation
    const touchStartY = useRef(0)

    useEffect(() => {
      const el = pinRef.current
      const placeholder = placeholderRef.current
      if (!el || !placeholder || disabled) return

      const pin = () => {
        if (isPinned.current) return
        isPinned.current = true
        pinOffset.current = window.scrollY

        const rect = el.getBoundingClientRect()
        placeholder.style.height = `${rect.height}px`
        placeholder.style.display = "block"

        el.style.position = "fixed"
        el.style.top = `${rect.top}px`
        el.style.left = "0"
        el.style.width = "100%"
        el.style.zIndex = "50"
      }

      const unpin = (scrollTo: number) => {
        if (!isPinned.current) return
        isPinned.current = false

        el.style.position = ""
        el.style.top = ""
        el.style.left = ""
        el.style.width = ""
        el.style.zIndex = ""
        placeholder.style.display = "none"

        window.scrollTo(0, scrollTo)
      }

      const onTouchStart = (e: TouchEvent) => {
        touchStartY.current = e.touches[0].clientY
      }

      const onTouchMove = (e: TouchEvent) => {
        const deltaY = touchStartY.current - e.touches[0].clientY
        touchStartY.current = e.touches[0].clientY

        const elRect = el.getBoundingClientRect()
        const inView =
          elRect.top < window.innerHeight * 0.6 && elRect.bottom > window.innerHeight * 0.4

        if (!isPinned.current) {
          if (inView && deltaY > 0 && progressRef.current < 1) {
            pin()
            e.preventDefault()
            return
          }
          if (inView && deltaY < 0 && progressRef.current > 0) {
            pin()
            e.preventDefault()
            return
          }
          return
        }

        e.preventDefault()

        const delta = deltaY / SCROLL_DISTANCE
        progressRef.current = Math.max(0, Math.min(1, progressRef.current + delta))

        if (containerRef.current) {
          gsap.to(containerRef.current, {
            rotation: progressRef.current * 360,
            duration: 0.4,
            ease: "power2.out",
            force3D: true,
            overwrite: true,
          })
        }

        if (progressRef.current >= 1 && deltaY > 0) {
          progressRef.current = 1
          unpin(pinOffset.current + SCROLL_DISTANCE)
        } else if (progressRef.current <= 0 && deltaY < 0) {
          progressRef.current = 0
          unpin(pinOffset.current)
        }
      }

      window.addEventListener("touchstart", onTouchStart, { passive: true })
      window.addEventListener("touchmove", onTouchMove, { passive: false })

      return () => {
        window.removeEventListener("touchstart", onTouchStart)
        window.removeEventListener("touchmove", onTouchMove)
      }
    }, [disabled, SCROLL_DISTANCE])

    if (childrenCount === 0) return null

    const scaleFactor = 1.25
    const calculatedBuffer = childSize
      ? childSize.h * scaleFactor - childSize.h + 60
      : 150

    const visibleAreaHeight = childSize
      ? circleDiameter * visibleDecimal + childSize.h / 2 + calculatedBuffer
      : circleDiameter * visibleDecimal + 200

    return (
      <>
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
      <div ref={placeholderRef} style={{ display: "none" }} />
      </>
    )
  }
)

RadialScrollGallery.displayName = "RadialScrollGallery"
