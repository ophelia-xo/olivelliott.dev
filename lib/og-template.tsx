// lib/og-template.tsx
// Shared OG composition (1200×630) for the 5 OG image routes in Phase 6.
// Single source of truth for canvas geometry, palette, typography, fonts.
//
// UI-SPEC § The Two Visual Artifacts → 1. Dynamic OG image (LOCKED).
// RESEARCH § Pattern 1 (Node.js runtime; readFile from node_modules/geist/dist/fonts/).
//
// ALL JSX uses display: 'flex' (Pitfall 1 — Satori forbids display: 'grid').
// NO accent color (accent #fbbf24 is reserved for interactive site surfaces).
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'

export const OG_SIZE = { width: 1200, height: 630 } as const
export const OG_CONTENT_TYPE = 'image/png' as const

interface OgVariant {
  /** Display title — UI-SPEC § Copywriting Contract per-route LOCKED string. */
  title: string
  /** Meta row — interpunct-separated; UI-SPEC § Copywriting Contract LOCKED. */
  meta: string
}

async function loadFonts() {
  // Node.js runtime — readFile via process.cwd() (RESEARCH § Pattern 1).
  // Geist package ships .ttf files at the verified disk paths below.
  const [sansMedium, monoMedium] = await Promise.all([
    readFile(join(process.cwd(), 'node_modules/geist/dist/fonts/geist-sans/Geist-Medium.ttf')),
    readFile(join(process.cwd(), 'node_modules/geist/dist/fonts/geist-mono/GeistMono-Medium.ttf')),
  ])
  return { sansMedium, monoMedium }
}

/**
 * Render an OG image with the locked editorial composition:
 *   wordmark (32px mono, top-left, #737373)
 *   → title (80/64px sans, center-left, #f5f5f5, max 2 lines)
 *   → meta (20px mono, bottom-left, #737373)
 * 64px padding all sides; canvas #0a0a0a; display: flex column space-between.
 */
export async function renderOg({ title, meta }: OgVariant) {
  const { sansMedium, monoMedium } = await loadFonts()
  // UI-SPEC § Typography: 80px for short titles (≤24 chars); 64px for longer/wraps.
  const titleSize = title.length <= 24 ? 80 : 64

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#0a0a0a',
          padding: 64,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          fontFamily: 'GeistSans',
        }}
      >
        {/* Wordmark — Geist Mono 500 32px #737373 +0.02em */}
        <div
          style={{
            display: 'flex',
            fontFamily: 'GeistMono',
            fontSize: 32,
            fontWeight: 500,
            letterSpacing: '0.02em',
            color: '#737373',
          }}
        >
          olivelliott.dev
        </div>
        {/* Title — Geist Sans 500 80/64px #f5f5f5 -0.02em lineHeight 1.15 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'GeistSans',
            fontSize: titleSize,
            fontWeight: 500,
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            color: '#f5f5f5',
            // Two-line clamp (UI-SPEC § Typography rule 2)
            maxWidth: 1072,
          }}
        >
          {title}
        </div>
        {/* Meta — Geist Mono 500 20px #737373 +0.02em */}
        <div
          style={{
            display: 'flex',
            fontFamily: 'GeistMono',
            fontSize: 20,
            fontWeight: 500,
            letterSpacing: '0.02em',
            color: '#737373',
          }}
        >
          {meta}
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: 'GeistSans', data: sansMedium, weight: 500, style: 'normal' },
        { name: 'GeistMono', data: monoMedium, weight: 500, style: 'normal' },
      ],
    },
  )
}
