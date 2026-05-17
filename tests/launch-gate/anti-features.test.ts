// tests/launch-gate/anti-features.test.ts
// QAL-05 — codified 19-item launch gate from research/FEATURES.md § Anti-Features.
// Replaces the Wave 0 placeholder (Plan 06-00). Each it() = one anti-feature
// in the source-of-truth list. Grep mappings are verbatim from
// .planning/phases/06-seo,-og,-a11y-&-performance-audit/06-RESEARCH.md § Pattern 11.
//
// Pattern: walk app/ + components/ recursively → strip /* block */ and //
// line comments → apply per-item regex OR fs.existsSync check. ~50 files,
// <50ms total runtime — fast enough to leave in the default pnpm vitest run
// per CONTEXT.md "include in regular run".
//
// Comment-strip rationale: source files document anti-patterns in JSDoc
// ('NO whileInView', 'no coming soon') as RSC contracts; a naive grep
// would false-positive on the docstrings. Pattern established in
// tests/home/anti-patterns.test.ts (Phase 4) and reused here.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const ROOT = path.resolve(__dirname, '..', '..')

function walk(dir: string, exts = ['.ts', '.tsx', '.css']): string[] {
  const out: string[] = []
  if (!existsSync(dir)) return out
  for (const entry of readdirSync(dir)) {
    const abs = path.join(dir, entry)
    if (statSync(abs).isDirectory()) out.push(...walk(abs, exts))
    else if (exts.some((e) => abs.endsWith(e))) out.push(abs)
  }
  return out
}

function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split('\n')
    .map((l) => l.replace(/\/\/.*$/, ''))
    .join('\n')
}

const APP_SOURCES = walk(path.join(ROOT, 'app'))
const COMPONENT_SOURCES = walk(path.join(ROOT, 'components'))
const ALL = [...APP_SOURCES, ...COMPONENT_SOURCES]

function eachFile(predicate: (rel: string, code: string) => void) {
  for (const abs of ALL) {
    const rel = path.relative(ROOT, abs)
    const code = stripComments(readFileSync(abs, 'utf8'))
    predicate(rel, code)
  }
}

describe('launch gate — 19 anti-features (QAL-05)', () => {
  it('#1 — no skill bars with percentages (<progress>, aria-valuenow, skill-bar identifiers)', () => {
    eachFile((rel, code) => {
      expect(/<progress\b/.test(code), `${rel} uses <progress> (skill bar tell)`).toBe(false)
      expect(/\baria-valuenow\b/.test(code), `${rel} uses aria-valuenow (skill bar tell)`).toBe(false)
      expect(/skill[-_]?bar/i.test(code), `${rel} matches skill-bar identifier`).toBe(false)
    })
  })

  it('#2 — no years-of-experience counters ("5+ years", "30+ projects", etc.)', () => {
    eachFile((rel, code) => {
      const m = code.match(/\d+\+\s*(years?|projects?|coffees?|repos?|stars?)\b/i)
      expect(m, `${rel} contains years-of-experience counter: ${m?.[0] ?? ''}`).toBeNull()
    })
  })

  it('#3 — no testimonial carousels (swiper, embla-carousel, keen-slider, slick, "testimonial")', () => {
    eachFile((rel, code) => {
      expect(
        /from\s+['"](swiper|embla-carousel|keen-slider|react-slick)['"]/.test(code),
        `${rel} imports a carousel library`,
      ).toBe(false)
      expect(/testimonial/i.test(code), `${rel} mentions "testimonial"`).toBe(false)
    })
  })

  it('#4 — no 3D / WebGL / R3F (@react-three/*, three, <Canvas>, WebGL)', () => {
    eachFile((rel, code) => {
      expect(/from\s+['"]@react-three\//.test(code), `${rel} imports @react-three/*`).toBe(false)
      expect(/from\s+['"]three['"]/.test(code), `${rel} imports three`).toBe(false)
      expect(/\bWebGL/i.test(code), `${rel} references WebGL`).toBe(false)
    })
  })

  it('#5 — no scroll-triggered fade + stagger (whileInView, IntersectionObserver, onScroll, viewport={)', () => {
    eachFile((rel, code) => {
      expect(/whileInView\b/.test(code), `${rel} uses whileInView (scroll-triggered)`).toBe(false)
      expect(
        /\bIntersectionObserver\b/.test(code),
        `${rel} uses IntersectionObserver`,
      ).toBe(false)
      expect(/\bonScroll\b/i.test(code), `${rel} uses onScroll`).toBe(false)
      expect(/viewport=\{/.test(code), `${rel} passes viewport={} to motion`).toBe(false)
    })
  })

  it('#6 — no gradient text on gradient bg (Tailwind gradient utilities, bg-clip-text)', () => {
    eachFile((rel, code) => {
      expect(
        /\bbg-gradient-(to-|from-|via-|conic-|radial-)/.test(code),
        `${rel} uses Tailwind gradient utility`,
      ).toBe(false)
      expect(/\bbg-clip-text\b/.test(code), `${rel} uses bg-clip-text (gradient text tell)`).toBe(false)
      expect(/\bfrom-\[/.test(code), `${rel} uses arbitrary-value gradient`).toBe(false)
      expect(/\bto-\[/.test(code), `${rel} uses arbitrary-value gradient end`).toBe(false)
    })
  })

  it('#7 — no particle cursors / confetti / scroll-indicator arrows', () => {
    eachFile((rel, code) => {
      expect(
        /from\s+['"](react-confetti|tsparticles|react-tsparticles|tsparticles-engine|cursor-effects)['"]/.test(
          code,
        ),
        `${rel} imports a particle/confetti/cursor library`,
      ).toBe(false)
      expect(/scroll-indicator/i.test(code), `${rel} contains scroll-indicator identifier`).toBe(
        false,
      )
    })
  })

  it('#8 — no AI-template hero copy (extended banned-words including OG-card additions)', () => {
    const banned =
      /\b(passionate|scalable solutions|cutting-edge|10x|crafted|seamless|leveraging|synergy|rockstar|ninja|innovative|transformative|ecosystem|paradigm|next-generation|results-driven|self-starter|team player|go-getter|thought leader|dynamic|introducing|the all-new|transform your|supercharge|AI-powered|built with love)\b/i
    eachFile((rel, code) => {
      const m = code.match(banned)
      expect(m, `${rel} contains banned word: ${m?.[0] ?? ''}`).toBeNull()
    })
  })

  it('#9 — no tag-cloud / wordcloud libraries', () => {
    eachFile((rel, code) => {
      expect(
        /from\s+['"](react-tagcloud|react-wordcloud|tag-cloud)['"]/.test(code),
        `${rel} imports a tag-cloud library`,
      ).toBe(false)
    })
  })

  it('#10 — no /services route', () => {
    expect(existsSync(path.join(ROOT, 'app/services')), 'app/services/ exists — FEATURES.md #10').toBe(
      false,
    )
  })

  it('#11 — no /writing route + no "coming soon" copy', () => {
    expect(
      existsSync(path.join(ROOT, 'app/writing')),
      'app/writing/ exists — PROJECT.md defers /writing to v2',
    ).toBe(false)
    eachFile((rel, code) => {
      expect(/coming\s+soon/i.test(code), `${rel} contains "coming soon"`).toBe(false)
    })
  })

  it('#12 — no cookie banner / GDPR overlay', () => {
    eachFile((rel, code) => {
      expect(
        /from\s+['"](react-cookie-consent|cookieconsent|@osano\/cookieconsent|vanilla-cookieconsent)['"]/.test(
          code,
        ),
        `${rel} imports a cookie-consent library`,
      ).toBe(false)
      expect(
        /cookie[-_]?consent|gdpr[-_]?banner/i.test(code),
        `${rel} contains cookie-consent or gdpr-banner identifier`,
      ).toBe(false)
    })
  })

  it('#13 — no light/dark mode toggle in v1 (next-themes defaultTheme="dark", enableSystem !== true)', () => {
    const providers = readFileSync(path.join(ROOT, 'app/providers.tsx'), 'utf8')
    // defaultTheme MUST be 'dark' (string literal in JSX attribute)
    expect(
      /defaultTheme=["']dark["']/.test(providers),
      'app/providers.tsx must declare defaultTheme="dark" (FEATURES.md #13 — dark only in v1)',
    ).toBe(true)
    // enableSystem MUST NOT be true; either omitted, set to {false}, or absent
    expect(
      /enableSystem(?:=\{true\}|=["']true["'])/.test(providers),
      'app/providers.tsx must NOT enable system theme (FEATURES.md #13)',
    ).toBe(false)
  })

  it('#14 — no contact form backend (no <form> in about/ + no form libraries)', () => {
    // Forms allowed nowhere on this site in v1 (CONTEXT.md: mailto: works universally)
    eachFile((rel, code) => {
      if (!/^(app\/\(site\)\/about|components\/about)\//.test(rel)) return
      expect(/<form\b/i.test(code), `${rel} contains a <form> element — v1 uses mailto: only`).toBe(
        false,
      )
    })
    eachFile((rel, code) => {
      expect(
        /from\s+['"](@?formik|react-hook-form|@conform)/.test(code),
        `${rel} imports a form library`,
      ).toBe(false)
    })
  })

  it('#15 — no bento grid on home composer (grid-cols-12, col-span-N>1, grid-rows- on home surfaces)', () => {
    // Mirrors Phase 4 Test 2 on tests/home/anti-patterns.test.ts but explicit
    // for the launch-gate audit trail.
    const HOME_SURFACES = [
      'app/(site)/page.tsx',
      'components/home/home-project-grid.tsx',
      'components/home/home-hero.tsx',
    ]
    for (const rel of HOME_SURFACES) {
      const abs = path.join(ROOT, rel)
      if (!existsSync(abs)) continue
      const code = stripComments(readFileSync(abs, 'utf8'))
      expect(/grid-cols-12/.test(code), `${rel} uses grid-cols-12 (bento tell)`).toBe(false)
      expect(
        /\bcol-span-[2-9]\b|\bcol-span-1[0-9]\b/.test(code),
        `${rel} uses col-span > 1 (bento tell)`,
      ).toBe(false)
      expect(/\bgrid-rows-/.test(code), `${rel} uses grid-rows- (bento tell)`).toBe(false)
    }
  })

  it('#16 — no hover-scale on project cards (hover:scale- forbidden in components/projects/project-card-*.tsx)', () => {
    const cardSurfaces = [
      'components/projects/project-card-hero.tsx',
      'components/projects/project-card-secondary.tsx',
    ]
    for (const rel of cardSurfaces) {
      const abs = path.join(ROOT, rel)
      if (!existsSync(abs)) continue
      const code = stripComments(readFileSync(abs, 'utf8'))
      expect(
        /\bhover:scale-/.test(code),
        `${rel} uses hover:scale- (card-level bounce forbidden — FEATURES.md #16)`,
      ).toBe(false)
    }
  })

  it('#17 — no auto-opening chatbot widget (intercom, crisp, chatbot-kit, chat-widget)', () => {
    eachFile((rel, code) => {
      expect(
        /from\s+['"](@intercom\/messenger-js-sdk|crisp-sdk-web|react-chatbot-kit|react-chat-widget)['"]/.test(
          code,
        ),
        `${rel} imports a chatbot widget`,
      ).toBe(false)
    })
  })

  it('#18 — no /press or /brand-kit routes', () => {
    expect(
      existsSync(path.join(ROOT, 'app/press')),
      'app/press/ exists — FEATURES.md #18 (no press kit in v1)',
    ).toBe(false)
    expect(
      existsSync(path.join(ROOT, 'app/brand-kit')),
      'app/brand-kit/ exists — FEATURES.md #18 (no brand kit in v1)',
    ).toBe(false)
  })

  it('#19 — no decorative scrolling marquee (marquee libs, deprecated <marquee>)', () => {
    eachFile((rel, code) => {
      expect(
        /from\s+['"](react-fast-marquee|react-marquee-line|@devnomic\/marquee)['"]/.test(code),
        `${rel} imports a marquee library`,
      ).toBe(false)
      expect(/<marquee\b/i.test(code), `${rel} uses <marquee> (deprecated HTML)`).toBe(false)
    })
  })
})
