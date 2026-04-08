"use client"
import type { ReactNode, CSSProperties } from "react"

interface Props {
  children: ReactNode
}

export default function EolaGlassCard({ children }: Props) {
  const style: CSSProperties = {
    border: "1px solid transparent",
    borderRadius: "12px",
    backgroundImage: `
      linear-gradient(rgba(44, 40, 37, 0.55), rgba(44, 40, 37, 0.55)),
      conic-gradient(
        from var(--gradient-angle, 0deg),
        rgba(201, 169, 110, 0.15) 0%,
        rgba(201, 169, 110, 0.4) 25%,
        rgba(245, 240, 235, 0.3) 30%,
        rgba(201, 169, 110, 0.4) 35%,
        rgba(201, 169, 110, 0.15) 50%,
        rgba(201, 169, 110, 0.4) 75%,
        rgba(245, 240, 235, 0.3) 80%,
        rgba(201, 169, 110, 0.4) 85%,
        rgba(201, 169, 110, 0.15) 100%
      )
    `,
    backgroundClip: "padding-box, border-box",
    backgroundOrigin: "padding-box, border-box",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    padding: "2.5rem 3rem",
    maxWidth: "460px",
    textAlign: "center" as const,
    color: "#fff",
  }

  return (
    <>
      <style>{`
        @property --gradient-angle {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }
        .eola-glass-card {
          animation: eola-rotate 8s linear infinite;
        }
        @keyframes eola-rotate {
          to { --gradient-angle: 360deg; }
        }
      `}</style>
      <div className="eola-glass-card" style={style}>
        {children}
      </div>
    </>
  )
}
