// tests/home/thesis-paragraph.test.tsx
// HOM-05: <ThesisParagraph> — the one earned motion moment of v1.
//
// This spec locks the three behavioral branches Phase 4 RESEARCH flagged as
// load-bearing (Pitfalls 4 + 5 + 8):
//   1. SSR / pre-hydration  → plain <p> at full opacity, no <span> segments.
//   2. Reduced-motion ON    → stays plain <p> after hydration; zero <span>s.
//   3. Motion permitted     → post-hydration <p> contains per-word <m.span>s.
//   4. className passthrough across BOTH branches (SSR shell + segmented form).
//   5. Source-level banned-words guard on the component file itself.
//
// Mock pattern (Pitfall 8): `vi.mock('motion/react', ...)` replaces the entire
// module — including `useReducedMotion`. A partial mock that omits the hook
// throws "useReducedMotion is not a function" at component load. The mock here
// always exposes BOTH `m` (a Proxy that strips motion-only props) AND
// `useReducedMotion` (per-test return value). `vi.doMock` + `vi.resetModules`
// + a fresh dynamic `await import(...)` per test swaps the hook return.
import { act, render } from '@testing-library/react'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

/**
 * Install a fresh `motion/react` mock for the next dynamic import of the
 * component under test. MUST be called BEFORE `await import('@/components/home/thesis-paragraph')`.
 *
 * @param useReducedMotionReturn - what useReducedMotion() returns this test.
 *   `null`     → pre-hydration / no matchMedia (SSR shape)
 *   `false`    → motion permitted (segmented render after mount)
 *   `true`     → reduced-motion ON (plain <p> after mount)
 */
function mockMotion(useReducedMotionReturn: boolean | null) {
  vi.doMock('motion/react', () => {
    const proxy = new Proxy(
      {},
      {
        get: (_target, tag: string) => {
          const Comp = ({
            children,
            // strip motion-only props before forwarding to the host element
            whileHover: _wh,
            whileFocus: _wf,
            whileTap: _wt,
            whileInView: _wv,
            initial: _i,
            animate: _a,
            exit: _e,
            transition: _tt,
            variants: _v,
            ...rest
          }: Record<string, unknown> & { children?: React.ReactNode }) =>
            React.createElement(tag, rest, children)
          Comp.displayName = `m.${tag}`
          return Comp
        },
      },
    )
    return {
      m: proxy,
      useReducedMotion: () => useReducedMotionReturn,
    }
  })
}

beforeEach(() => {
  vi.resetModules()
})

describe('<ThesisParagraph>', () => {
  it('SSR fallback / pre-hydration: server-rendered HTML is a single <p> with no segmented spans', async () => {
    // Default: useReducedMotion returns null (no matchMedia available — SSR shape).
    // The two-stage mounted gate (Pitfall 5) means the very first render — the
    // one the server produces and the client hydrates against — MUST be the
    // plain shell. Use renderToString to assert the actual server-output HTML;
    // @testing-library/react's render() flushes the mount effect synchronously
    // under React 19, so it cannot capture the pre-hydration shape.
    mockMotion(null)
    const { ThesisParagraph } = await import('@/components/home/thesis-paragraph')
    const html = renderToString(
      <ThesisParagraph text="I work on Myco." className="x" />,
    )
    // Plain <p class="x">I work on Myco.</p> — no spans, full text visible.
    expect(html).toContain('<p class="x"')
    expect(html).toContain('I work on Myco.')
    expect(html).not.toContain('<span')
  })

  it('reduced-motion: stays as plain <p> after hydration (no segmented spans EVER mount)', async () => {
    mockMotion(true)
    const { ThesisParagraph } = await import('@/components/home/thesis-paragraph')
    const { container } = render(
      <ThesisParagraph text="I work on Myco." className="x" />,
    )
    // Flush the mount effect so mounted=true takes effect. The component MUST
    // still return the plain shell because prefersReduced=true short-circuits
    // the segmented branch (Pitfall 4: opacity persists otherwise).
    await act(async () => {})
    const p = container.querySelector('p.x')
    expect(p).not.toBeNull()
    expect(p?.textContent).toBe('I work on Myco.')
    expect(p?.querySelectorAll('span').length).toBe(0)
  })

  it('motion permitted: post-hydration splits into per-word <m.span> segments', async () => {
    mockMotion(false)
    const { ThesisParagraph } = await import('@/components/home/thesis-paragraph')
    const { container } = render(
      <ThesisParagraph text="I work on Myco." className="x" />,
    )
    // Flush the mount effect so mounted=true and the segmented branch renders.
    await act(async () => {})
    const p = container.querySelector('p.x')
    expect(p).not.toBeNull()
    // "I work on Myco." → 4 words + 3 whitespace separators = 7 segments → 7 spans.
    // Lock with >= 4 to allow trivial regex/iteration variations while still
    // catching "no segments produced" regressions.
    const spans = p?.querySelectorAll('span') ?? []
    expect(spans.length).toBeGreaterThanOrEqual(4)
    expect(p?.textContent).toBe('I work on Myco.')
  })

  it('className passthrough: applies the supplied className to the <p> in both branches', async () => {
    // Branch 1 — SSR shell (mounted=false, default useReducedMotion=null)
    mockMotion(null)
    const mod1 = await import('@/components/home/thesis-paragraph')
    const { container: shellContainer } = render(
      <mod1.ThesisParagraph text="Short." className="custom-shell" />,
    )
    expect(shellContainer.querySelector('p.custom-shell')).not.toBeNull()

    // Branch 2 — motion-permitted segmented form
    vi.resetModules()
    mockMotion(false)
    const mod2 = await import('@/components/home/thesis-paragraph')
    const { container: segContainer } = render(
      <mod2.ThesisParagraph text="Short." className="custom-seg" />,
    )
    await act(async () => {})
    expect(segContainer.querySelector('p.custom-seg')).not.toBeNull()
  })

  it('source guard: components/home/thesis-paragraph.tsx contains none of the banned words', () => {
    // Locks the COMPONENT FILE's own comments/identifiers — the thesis copy
    // itself lives in app/(site)/page.tsx (Plan 02). Prevents AI-template
    // language from drifting into the file via future doc edits.
    const sourcePath = path.resolve(
      process.cwd(),
      'components/home/thesis-paragraph.tsx',
    )
    const source = readFileSync(sourcePath, 'utf8').toLowerCase()
    const banned = [
      'passionate',
      'scalable solutions',
      'cutting-edge',
      '10x',
      'crafted',
      'seamless',
      'leveraging',
      'synergy',
      'rockstar',
      'ninja',
      'innovative',
      'transformative',
      'ecosystem',
      'paradigm',
      'next-generation',
    ]
    for (const term of banned) {
      expect(source.includes(term)).toBe(false)
    }
  })
})
