// tests/resume/content.test.ts
// Plan 05-01 (RES-01, RES-06) — RESUME source-of-truth load, schema parity,
// PROJECT.md project enumeration, and banned-words regression lock.
import { describe, expect, it } from 'vitest'
import { ResumeSchema } from '@/lib/schemas'
import { RESUME } from '@/content/resume'

// Banned-words list — Phase 4 carry-forward + Phase 5 additions from
// UI-SPEC § Banned-words list. Whole-word match, case-insensitive.
// Multi-word phrases like "scalable solutions" are literal substrings.
const BANNED_WORD_REGEX =
  /\b(passionate|scalable solutions|cutting-edge|10x|crafted|seamless|leveraging|synergy|rockstar|ninja|innovative|transformative|ecosystem|paradigm|next-generation|award-winning|results-driven|self-starter|team player|go-getter|thought leader|dynamic)\b/i

// Flatten every user-facing string in RESUME into a single corpus.
// PLACEHOLDER comments live in the source file and never reach the data
// object, so they aren't reachable from this corpus (which is the point of
// test 9 — the comments stay in the source, not in the rendered output).
function corpus(): string {
  const parts: string[] = []
  parts.push(RESUME.header.name)
  parts.push(RESUME.header.role)
  parts.push(RESUME.header.location)
  parts.push(RESUME.summary)
  for (const e of RESUME.experience) {
    parts.push(e.role, e.company, e.period)
    if (e.location) parts.push(e.location)
    parts.push(...e.bullets)
  }
  for (const p of RESUME.projects) {
    parts.push(p.name, p.period)
    if (p.tagline) parts.push(p.tagline)
    parts.push(...p.bullets)
  }
  for (const s of RESUME.skills) {
    parts.push(s.category, ...s.items)
  }
  for (const ed of RESUME.education) {
    parts.push(ed.degree, ed.institution, ed.year)
    if (ed.location) parts.push(ed.location)
    parts.push(...ed.bullets)
  }
  return parts.join('\n')
}

describe('Phase 5: RESUME contains required entries, no banned words (RES-01, RES-06)', () => {
  it('module loads — Pitfall 12 dual-gate held (satisfies + parse)', () => {
    // If `ResumeSchema.parse(data)` had thrown at module init the import at
    // the top of this file would have errored out before tests ran. Reaching
    // this assertion means the gate held.
    expect(RESUME).toBeDefined()
    expect(typeof RESUME).toBe('object')
  })

  it('RESUME round-trips through ResumeSchema.parse() (static + runtime agree)', () => {
    const reparsed = ResumeSchema.parse(RESUME)
    expect(reparsed).toEqual(RESUME)
  })

  it("RESUME.header.name === 'Olive Elliott'", () => {
    expect(RESUME.header.name).toBe('Olive Elliott')
  })

  it('header email is canonical olivelliott48@gmail.com', () => {
    expect(RESUME.header.links.email).toBe('olivelliott48@gmail.com')
    expect(RESUME.header.links.email.endsWith('@gmail.com')).toBe(true)
  })

  it('header github is canonical https://github.com/olivelliott (not Phase-1 ophelia-x placeholder)', () => {
    expect(RESUME.header.links.github).toBe('https://github.com/olivelliott')
    expect(RESUME.header.links.github).not.toMatch(/ophelia-x/)
  })

  it("first experience entry is at Aktiga (current role)", () => {
    expect(RESUME.experience[0]?.company).toBe('Aktiga')
  })

  it.each(['Myco', 'Fathom', 'Agenda Keeper', 'Trade Bot', 'Stemz'])(
    'projects[] includes %s (PROJECT.md required project)',
    (name) => {
      expect(RESUME.projects.some((p) => p.name === name)).toBe(true)
    },
  )

  it('Myco link is the canonical repo URL', () => {
    const myco = RESUME.projects.find((p) => p.name === 'Myco')
    expect(myco?.link).toBe('https://github.com/olivelliott/myco')
  })

  it('contains no banned words across summary, bullets, skills, education', () => {
    const text = corpus()
    const match = text.match(BANNED_WORD_REGEX)
    expect(
      match,
      `banned word found in RESUME corpus: "${match?.[0] ?? ''}"`,
    ).toBeNull()
    // Belt-and-braces: explicit assertion that "Passionate" (the docx
    // PROFILE word) was rewritten to "Active in" in the summary copy.
    expect(RESUME.summary.toLowerCase()).not.toContain('passionate')
    expect(RESUME.summary).toContain('Active in')
  })

  it('skills categories include the five required labels with non-empty items', () => {
    const required = [
      'Languages',
      'Frameworks & Libraries',
      'AI & Autonomous Systems',
      'Data & Infrastructure',
      'Focus Areas',
    ]
    for (const category of required) {
      const entry = RESUME.skills.find((s) => s.category === category)
      expect(entry, `missing skills category: ${category}`).toBeDefined()
      expect(entry?.items.length).toBeGreaterThanOrEqual(1)
    }
  })

  it('education contains both UNC Chapel Hill and Appalachian State entries', () => {
    expect(
      RESUME.education.some((e) => e.institution.includes('UNC Chapel Hill')),
    ).toBe(true)
    expect(
      RESUME.education.some((e) =>
        e.institution.includes('Appalachian State'),
      ),
    ).toBe(true)
  })
})
