// tests/a11y/resume.test.tsx
// QAL-02 — /resume route a11y. Replaces Wave 0 placeholder.
//
// /resume lives OUTSIDE the (site)/ group. app/resume/layout.tsx is a
// fragment passthrough (`<>{children}</>`), so the page's own
// <main id="resume-main"> + inline skip-link is the entire interactive surface.
//
// No motion mock needed — /resume ships zero motion islands (Phase 5
// PHASE_SOURCES Test 9 invariant). ResumeLayout doesn't wrap MotionProvider.
//
// Render the page directly (no SiteLayout wrapping — that would inject the
// (site) chrome which the chromeless route deliberately excludes).
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { axe } from 'vitest-axe'

import ResumePage from '@/app/resume/page'

describe('/resume a11y (QAL-02)', () => {
  it('has zero axe violations', async () => {
    const { container } = render(<ResumePage />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
