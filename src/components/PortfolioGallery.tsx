"use client"

import React from "react"
import { RadialScrollGallery } from "./RadialScrollGallery"

interface SiteCard {
  name: string
  slug: string
  neighborhood: string
  tagline: string
  screenshot: string
  done: boolean
}

const BASE = "/josecustom-portfolio"

const sites: SiteCard[] = [
  // Finished sites first
  { name: "Foreign Exchange", slug: "foreign-exchange", neighborhood: "Mills 50", tagline: "Curated. Not mass-produced.", screenshot: `${BASE}/screenshots/foreign-exchange.jpg`, done: true },
  { name: "Masa Madre", slug: "masa-madre", neighborhood: "Curry Ford", tagline: "Scratch-made daily.", screenshot: `${BASE}/screenshots/masa-madre.jpg`, done: true },
  { name: "Iron & Asphalt", slug: "iron-asphalt", neighborhood: "SoDo", tagline: "Built. Not bought.", screenshot: `${BASE}/screenshots/iron-asphalt.jpg`, done: true },
  { name: "The Eola Parlor", slug: "eola-parlor", neighborhood: "Thornton Park", tagline: "Your night. Our room.", screenshot: `${BASE}/screenshots/eola-parlor.jpg`, done: true },
  { name: "Calor Supply", slug: "calor-supply", neighborhood: "Audubon Park", tagline: "Heat for every athlete.", screenshot: `${BASE}/screenshots/calor-supply.jpg`, done: true },
  { name: "Basecamp IT", slug: "basecamp-it", neighborhood: "Downtown", tagline: "IT that just works.", screenshot: `${BASE}/screenshots/basecamp-it.jpg`, done: true },
  { name: "Aldea Partners", slug: "aldea-partners", neighborhood: "Lake Nona", tagline: "Strategy meets execution.", screenshot: `${BASE}/screenshots/aldea-partners.jpg`, done: true },
  // Remaining sites
  { name: "Puente Learning", slug: "puente-learning", neighborhood: "Conway", tagline: "Two languages. One future.", screenshot: `${BASE}/screenshots/puente-learning.jpg`, done: false },
  { name: "Southpaw Combat", slug: "southpaw-combat", neighborhood: "College Park", tagline: "Show up. Get better.", screenshot: `${BASE}/screenshots/southpaw-combat.jpg`, done: false },
  { name: "Stem & Table", slug: "stem-table", neighborhood: "Winter Park", tagline: "Flowers. Events. Wonder.", screenshot: `${BASE}/screenshots/stem-table.jpg`, done: false },
  { name: "Still Water Tattoo", slug: "still-water", neighborhood: "Ivanhoe Village", tagline: "Permanent art. Personal story.", screenshot: `${BASE}/screenshots/still-water.jpg`, done: false },
  { name: "Vero Aesthetics", slug: "vero-aesthetics", neighborhood: "Winter Park", tagline: "Beauty. Elevated.", screenshot: `${BASE}/screenshots/vero-aesthetics.jpg`, done: false },
]

export function PortfolioGallery() {
  const handleSelect = (index: number) => {
    const site = sites[index]
    if (site) {
      window.location.href = `${BASE}/sites/${site.slug}/`
    }
  }

  return (
    <RadialScrollGallery
      baseRadius={420}
      mobileRadius={200}
      scrollDuration={2000}
      visiblePercentage={42}
      onItemSelect={handleSelect}
      style={{ minHeight: "700px" } as React.CSSProperties}
    >
      {(hoveredIndex) =>
        sites.map((site, index) => {
          const isActive = hoveredIndex === index
          return (
            <div
              key={site.slug}
              style={{
                width: 200,
                height: 280,
                borderRadius: 12,
                overflow: "hidden",
                border: isActive
                  ? "2px solid #1E90FF"
                  : "1px solid rgba(255,255,255,0.08)",
                background: "#111",
                display: "flex",
                flexDirection: "column" as const,
                transition: "all 400ms ease",
                boxShadow: isActive
                  ? "0 8px 32px rgba(30,144,255,0.25)"
                  : "0 2px 8px rgba(0,0,0,0.3)",
                opacity: site.done ? 1 : 0.6,
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
                {!site.done && (
                  <div
                    style={{
                      position: "absolute" as const,
                      top: 8,
                      right: 8,
                      background: "rgba(0,0,0,0.7)",
                      color: "#888",
                      fontSize: "0.5rem",
                      fontWeight: 700,
                      textTransform: "uppercase" as const,
                      letterSpacing: "0.1em",
                      padding: "3px 8px",
                      borderRadius: 4,
                    }}
                  >
                    Coming Soon
                  </div>
                )}
              </div>
              <div style={{ padding: "12px 14px" }}>
                <div
                  style={{
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: isActive ? "#1E90FF" : "#fff",
                    marginBottom: 2,
                    textTransform: "uppercase" as const,
                    letterSpacing: "0.02em",
                  }}
                >
                  {site.name}
                </div>
                <div
                  style={{
                    fontSize: "0.55rem",
                    color: "rgba(255,255,255,0.4)",
                  }}
                >
                  {site.neighborhood} &middot; Orlando
                </div>
              </div>
            </div>
          )
        })
      }
    </RadialScrollGallery>
  )
}
