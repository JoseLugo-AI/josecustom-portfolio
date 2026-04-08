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
  externalUrl?: string
}

const BASE = "/josecustom-portfolio"

const sites: SiteCard[] = [
  // Wheel order: index 10=1st(center), 9=2nd, 8=3rd, 7=4th, 6=5th, 5=6th, 4=7th, then 3,2,1,0,12,11
  /* 0  */ { name: "Still Water Tattoo", slug: "still-water", neighborhood: "Ivanhoe Village", tagline: "Permanent art. Personal story.", screenshot: `${BASE}/screenshots/still-water.jpg`, done: false },
  /* 1  */ { name: "Stem & Table", slug: "stem-table", neighborhood: "Winter Park", tagline: "Flowers. Events. Wonder.", screenshot: `${BASE}/screenshots/stem-table.jpg`, done: false },
  /* 2  */ { name: "Southpaw Combat", slug: "southpaw-combat", neighborhood: "College Park", tagline: "Show up. Get better.", screenshot: `${BASE}/screenshots/southpaw-combat.jpg`, done: false },
  /* 3  */ { name: "Puente Learning", slug: "puente-learning", neighborhood: "Conway", tagline: "Two languages. One future.", screenshot: `${BASE}/screenshots/puente-learning.jpg`, done: false },
  /* 4  = 7th spot */ { name: "Masa Madre", slug: "masa-madre", neighborhood: "Curry Ford", tagline: "Scratch-made daily.", screenshot: `${BASE}/screenshots/masa-madre.jpg`, done: true },
  /* 5  = 6th spot */ { name: "Basecamp IT", slug: "basecamp-it", neighborhood: "Downtown", tagline: "IT that just works.", screenshot: `${BASE}/screenshots/basecamp-it.jpg`, done: true },
  /* 6  = 5th spot */ { name: "The Eola Parlor", slug: "eola-parlor", neighborhood: "Thornton Park", tagline: "Your night. Our room.", screenshot: `${BASE}/screenshots/eola-parlor.jpg`, done: true },
  /* 7  = 4th spot */ { name: "Calor Supply", slug: "calor-supply", neighborhood: "Audubon Park", tagline: "Heat for every athlete.", screenshot: `${BASE}/screenshots/calor-supply.jpg`, done: true },
  /* 8  = 3rd spot */ { name: "Foreign Exchange", slug: "foreign-exchange", neighborhood: "Mills 50", tagline: "Curated. Not mass-produced.", screenshot: `${BASE}/screenshots/foreign-exchange.jpg`, done: true },
  /* 9  = 2nd spot */ { name: "Aldea Partners", slug: "aldea-partners", neighborhood: "Lake Nona", tagline: "Strategy meets execution.", screenshot: `${BASE}/screenshots/aldea-partners.jpg`, done: true },
  /* 10 = CENTER  */ { name: "Johnny's Diner", slug: "", neighborhood: "Curry Ford", tagline: "Breakfast, lunch & dinner.", screenshot: `${BASE}/screenshots/johnnys-diner.jpg`, done: true, externalUrl: "https://johnnysdinercurryford.com/" },
  /* 11 */ { name: "Iron & Asphalt", slug: "iron-asphalt", neighborhood: "SoDo", tagline: "Built. Not bought.", screenshot: `${BASE}/screenshots/iron-asphalt.jpg`, done: false },
  /* 12 */ { name: "Vero Aesthetics", slug: "vero-aesthetics", neighborhood: "Winter Park", tagline: "Beauty. Elevated.", screenshot: `${BASE}/screenshots/vero-aesthetics.jpg`, done: false },
]

export function PortfolioGallery() {
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
              key={site.slug || site.name}
              style={{
                width: 200,
                height: 280,
                borderRadius: 12,
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.08)",
                background: "#111",
                display: "flex",
                flexDirection: "column" as const,
                transition: "all 400ms ease",
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
