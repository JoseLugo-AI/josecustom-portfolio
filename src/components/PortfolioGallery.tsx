"use client"

import React, { useState, useEffect } from "react"
import { RadialScrollGallery } from "./RadialScrollGallery"

interface SiteCard {
  name: string
  slug: string
  neighborhood: string
  tagline: string
  screenshot: string
  done: boolean
  externalUrl?: string
}

const BASE = ""

const sites: SiteCard[] = [
  // Wheel order: index 10=1st(center), 9=2nd, 8=3rd, 7=4th, 6=5th, 5=6th, 4=7th, then 3,2,1,0,12,11
  /* 0  */ { name: "Still Water Tattoo", slug: "still-water", neighborhood: "Ivanhoe Village", tagline: "Permanent art. Personal story.", screenshot: `${BASE}/screenshots/still-water.jpg`, done: true },
  /* 1  */ { name: "Southpaw Combat", slug: "southpaw-combat", neighborhood: "College Park", tagline: "Show up. Get better.", screenshot: `${BASE}/screenshots/southpaw-combat.jpg`, done: true },
  /* 2  */ { name: "Stem & Table", slug: "stem-table", neighborhood: "Winter Park", tagline: "Flowers. Events. Wonder.", screenshot: `${BASE}/screenshots/stem-table.jpg`, done: true },
  /* 3  */ { name: "Puente Learning", slug: "puente-learning", neighborhood: "Conway", tagline: "Two languages. One future.", screenshot: `${BASE}/screenshots/puente-learning.jpg`, done: true },
  /* 4  = 7th spot */ { name: "Masa Madre", slug: "masa-madre", neighborhood: "Curry Ford", tagline: "Scratch-made daily.", screenshot: `${BASE}/screenshots/masa-madre.jpg`, done: true },
  /* 5  = 6th spot */ { name: "Basecamp IT", slug: "basecamp-it", neighborhood: "Downtown", tagline: "IT that just works.", screenshot: `${BASE}/screenshots/basecamp-it.jpg`, done: true },
  /* 6  = 5th spot */ { name: "The Eola Parlor", slug: "eola-parlor", neighborhood: "Thornton Park", tagline: "Your night. Our room.", screenshot: `${BASE}/screenshots/eola-parlor.jpg`, done: true },
  /* 7  = 4th spot */ { name: "Calor Supply", slug: "calor-supply", neighborhood: "Audubon Park", tagline: "Heat for every athlete.", screenshot: `${BASE}/screenshots/calor-supply.jpg`, done: true },
  /* 8  = 3rd spot */ { name: "Foreign Exchange", slug: "foreign-exchange", neighborhood: "Mills 50", tagline: "Curated. Not mass-produced.", screenshot: `${BASE}/screenshots/foreign-exchange.jpg`, done: true },
  /* 9  = 2nd spot */ { name: "Aldea Partners", slug: "aldea-partners", neighborhood: "Lake Nona", tagline: "Strategy meets execution.", screenshot: `${BASE}/screenshots/aldea-partners.jpg`, done: true },
  /* 10 = CENTER  */ { name: "Johnny's Diner", slug: "", neighborhood: "Curry Ford", tagline: "Breakfast, lunch & dinner.", screenshot: `${BASE}/screenshots/johnnys-diner.jpg`, done: true, externalUrl: "https://johnnysdinercurryford.com/" },
  /* 11 */ { name: "Iron & Asphalt", slug: "iron-asphalt", neighborhood: "SoDo", tagline: "Built. Not bought.", screenshot: `${BASE}/screenshots/iron-asphalt.jpg`, done: true },
  /* 12 */ { name: "Vero Aesthetics", slug: "vero-aesthetics", neighborhood: "Winter Park", tagline: "Beauty. Elevated.", screenshot: `${BASE}/screenshots/vero-aesthetics.jpg`, done: true },
]

export function PortfolioGallery() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  const handleSelect = (index: number) => {
    const site = sites[index]
    if (site) {
      if (site.externalUrl) {
        window.open(site.externalUrl, "_blank")
      } else {
        window.location.href = `${BASE}/sites/${site.slug}/`
      }
    }
  }

  const cardW = isMobile ? 160 : 200
  const cardH = isMobile ? 220 : 280

  const renderCard = (site: SiteCard, index: number, isActive = false) => (
    <div
      key={site.slug || site.name}
      onClick={() => handleSelect(index)}
      style={{
        width: cardW,
        minWidth: cardW,
        height: cardH,
        borderRadius: isMobile ? 10 : 12,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.08)",
        background: "#111",
        display: "flex",
        flexDirection: "column" as const,
        transition: "all 400ms ease",
        cursor: "pointer",
        boxShadow: isActive
          ? "0 12px 40px rgba(0,0,0,0.5)"
          : "0 2px 8px rgba(0,0,0,0.3)",
      }}
    >
      <div
        style={{
          flex: 1,
          overflow: "hidden",
          position: "relative" as const,
        }}
      >
        <img
          src={site.screenshot}
          alt={site.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover" as const,
            transition: "transform 500ms ease",
            transform: isActive ? "scale(1.05)" : "scale(1)",
          }}
          loading="lazy"
        />
      </div>
      <div style={{ padding: isMobile ? "10px 12px" : "12px 14px" }}>
        <div
          style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: isMobile ? "0.6rem" : "0.7rem",
            fontWeight: 700,
            color: "#fff",
            marginBottom: 2,
            textTransform: "uppercase" as const,
            letterSpacing: "0.02em",
          }}
        >
          {site.name}
        </div>
        <div
          style={{
            fontSize: isMobile ? "0.5rem" : "0.55rem",
            color: "rgba(255,255,255,0.4)",
          }}
        >
          {site.neighborhood} &middot; Orlando
        </div>
      </div>
    </div>
  )

  const centerOverlay = (
    <div style={{ textAlign: "center", pointerEvents: "auto" }}>
      <h1
        style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: "clamp(2.5rem, 6vw, 4rem)",
          fontWeight: 800,
          letterSpacing: "-0.02em",
          marginBottom: "1rem",
          background: "linear-gradient(135deg, #fff 0%, #1E90FF 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        Portfolio
      </h1>
      <p
        style={{
          color: "rgba(255,255,255,0.3)",
          fontSize: "0.7rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase" as const,
          marginBottom: "0.5rem",
        }}
      >
        Scroll to explore &middot; Click to view
      </p>
      <div
        style={{
          marginTop: "0.75rem",
          fontSize: "1.2rem",
          color: "rgba(255,255,255,0.2)",
          animation: "bounce-down 1.5s ease-in-out infinite",
        }}
      >
        &#8595;
      </div>
    </div>
  )

  // Mobile: horizontal scroll strip
  if (isMobile) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "2rem 0 3rem" }}>
        <div style={{ textAlign: "center", padding: "0 1.5rem 2rem" }}>
          <a href="https://josecustom.ai" style={{ color: "#1E90FF", fontSize: "0.75rem", fontWeight: 500, display: "inline-block", marginBottom: "1rem" }}>&larr; josecustom.ai</a>
          <h1
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "2rem",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              background: "linear-gradient(135deg, #fff 0%, #1E90FF 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: "0.5rem",
            }}
          >
            Portfolio
          </h1>
        </div>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            overflowX: "auto",
            padding: "0 1.5rem 1rem",
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          {sites.map((site, index) => (
            <div key={site.slug || site.name} style={{ scrollSnapAlign: "center", flexShrink: 0 }}>
              {renderCard(site, index)}
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "0.75rem", fontSize: "0.6rem", color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em", textTransform: "uppercase" as const }}>
          Swipe to browse &rarr;
        </div>
      </div>
    )
  }

  // Desktop: radial scroll wheel as full-viewport hero
  return (
    <RadialScrollGallery
      baseRadius={420}
      mobileRadius={200}
      visiblePercentage={42}
      onItemSelect={handleSelect}
      centerContent={centerOverlay}
      style={{ height: "100vh" } as React.CSSProperties}
    >
      {(hoveredIndex) =>
        sites.map((site, index) => renderCard(site, index, hoveredIndex === index))
      }
    </RadialScrollGallery>
  )
}
