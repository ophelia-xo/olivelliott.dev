// tests/resume/schema.test.ts
// Plan 05-01 (RES-01) — runtime contract for ResumeSchema.
// 1 happy path + 8 negative cases. Each negative test asserts on the issue
// path so a future regression that loosens validation is caught.
import { describe, expect, it } from 'vitest'
import { ResumeSchema, type Resume } from '@/lib/schemas'

// Minimal valid fixture — mirrors the shape from RESEARCH § Resume Data
// — Pre-Extracted but trimmed to a single entry per array. Every negative
// test below derives from this via shallow spread so the rejection path is
// the only thing under test.
const validFixture = {
  header: {
    name: 'Olive Elliott',
    role: 'Software Engineer',
    location: 'Asheville, NC',
    links: {
      github: 'https://github.com/ophelia-xo',
      email: 'olivelliott48@gmail.com',
      linkedin: 'https://www.linkedin.com/in/olivelliott',
    },
  },
  summary: 'Single-paragraph summary.',
  experience: [
    {
      role: 'Software Engineer',
      company: 'Aktiga',
      period: '2023 – Present',
      bullets: ['Bullet one'],
    },
  ],
  projects: [
    {
      name: 'Myco',
      period: '2024 – Present',
      bullets: ['Bullet one'],
    },
  ],
  skills: [
    {
      category: 'Languages',
      items: ['TypeScript'],
    },
  ],
  education: [
    {
      degree: 'BS',
      institution: 'Appalachian State University',
      year: 'June 2019',
    },
  ],
}

describe('Phase 5: ResumeSchema validates known-good and rejects malformed (RES-01)', () => {
  it('parses a known-good fixture into a typed Resume (round-trip)', () => {
    const parsed = ResumeSchema.parse(validFixture)
    expect(parsed.header.name).toBe('Olive Elliott')
    expect(parsed.header.links.email).toBe('olivelliott48@gmail.com')
    expect(parsed.experience).toHaveLength(1)
    expect(parsed.projects).toHaveLength(1)
    expect(parsed.skills[0]?.items[0]).toBe('TypeScript')
    // Education entry omits `bullets`; schema applies its `.default([])`.
    expect(parsed.education[0]?.bullets).toEqual([])
    // Type-level assertion — if `Resume` ever drifts from `z.infer<typeof ResumeSchema>`
    // this assignment would fail typecheck.
    const r: Resume = parsed
    expect(r).toBe(parsed)
  })

  it('rejects an empty object (all required top-level keys missing)', () => {
    const result = ResumeSchema.safeParse({})
    expect(result.success).toBe(false)
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path[0])
      // Every top-level required key should be reported.
      for (const key of [
        'header',
        'summary',
        'experience',
        'projects',
        'skills',
        'education',
      ]) {
        expect(paths).toContain(key)
      }
    }
  })

  it('rejects a malformed email in header.links.email', () => {
    const result = ResumeSchema.safeParse({
      ...validFixture,
      header: {
        ...validFixture.header,
        links: { ...validFixture.header.links, email: 'not-an-email' },
      },
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      const emailIssue = result.error.issues.find((i) =>
        i.path.join('.').endsWith('links.email'),
      )
      expect(emailIssue, 'expected an issue on header.links.email').toBeDefined()
    }
  })

  it('rejects a malformed URL in header.links.github', () => {
    const result = ResumeSchema.safeParse({
      ...validFixture,
      header: {
        ...validFixture.header,
        links: { ...validFixture.header.links, github: 'not-a-url' },
      },
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      const githubIssue = result.error.issues.find((i) =>
        i.path.join('.').endsWith('links.github'),
      )
      expect(
        githubIssue,
        'expected an issue on header.links.github',
      ).toBeDefined()
    }
  })

  it('rejects an experience entry with empty bullets (.min(1))', () => {
    const result = ResumeSchema.safeParse({
      ...validFixture,
      experience: [{ ...validFixture.experience[0], bullets: [] }],
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      const bulletsIssue = result.error.issues.find((i) =>
        i.path.join('.').endsWith('bullets'),
      )
      expect(
        bulletsIssue,
        'expected an issue on experience[0].bullets',
      ).toBeDefined()
      expect(bulletsIssue?.path).toEqual(['experience', 0, 'bullets'])
    }
  })

  it('rejects an experience entry with >6 bullets (.max(6))', () => {
    const result = ResumeSchema.safeParse({
      ...validFixture,
      experience: [
        { ...validFixture.experience[0], bullets: new Array(7).fill('x') },
      ],
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      const bulletsIssue = result.error.issues.find((i) =>
        i.path.join('.').endsWith('bullets'),
      )
      expect(
        bulletsIssue,
        'expected an issue on experience[0].bullets',
      ).toBeDefined()
      expect(bulletsIssue?.path).toEqual(['experience', 0, 'bullets'])
    }
  })

  it('rejects an empty projects array (.min(1))', () => {
    const result = ResumeSchema.safeParse({ ...validFixture, projects: [] })
    expect(result.success).toBe(false)
    if (!result.success) {
      const projectsIssue = result.error.issues.find(
        (i) => i.path[0] === 'projects',
      )
      expect(projectsIssue, 'expected an issue on projects').toBeDefined()
      expect(projectsIssue?.path).toEqual(['projects'])
    }
  })

  it('rejects a skills category with empty items (.min(1))', () => {
    const result = ResumeSchema.safeParse({
      ...validFixture,
      skills: [{ category: 'Test', items: [] }],
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      const itemsIssue = result.error.issues.find((i) =>
        i.path.join('.').endsWith('items'),
      )
      expect(itemsIssue, 'expected an issue on skills[0].items').toBeDefined()
      expect(itemsIssue?.path).toEqual(['skills', 0, 'items'])
    }
  })

  it('rejects an empty education array (.min(1))', () => {
    const result = ResumeSchema.safeParse({ ...validFixture, education: [] })
    expect(result.success).toBe(false)
    if (!result.success) {
      const educationIssue = result.error.issues.find(
        (i) => i.path[0] === 'education',
      )
      expect(educationIssue, 'expected an issue on education').toBeDefined()
      expect(educationIssue?.path).toEqual(['education'])
    }
  })
})
