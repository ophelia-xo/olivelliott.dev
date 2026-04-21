// mdx-components.tsx — REQUIRED by @next/mdx for App Router.
// Source: https://nextjs.org/docs/app/guides/mdx
// Phase 2: minimum viable stub. Phase 3 extends this with Callout, Figure, Gallery, and heading overrides.
import type { MDXComponents } from 'mdx/types'

const components: MDXComponents = {}

export function useMDXComponents(): MDXComponents {
  return components
}
