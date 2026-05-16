// mdx-components.tsx — REQUIRED by @next/mdx for App Router.
// Source: https://nextjs.org/docs/app/guides/mdx
// Phase 3: registers Figure / Gallery / Callout. Headings, paragraphs, code blocks,
// and inline code are styled via Tailwind in app/globals.css (.prose class) — no JSX
// overrides needed because rehype plugins handle slug/anchor/syntax tokenization at build time.
import type { MDXComponents } from 'mdx/types'
import { Callout } from '@/components/mdx/callout'
import { Figure } from '@/components/mdx/figure'
import { Gallery } from '@/components/mdx/gallery'

const components: MDXComponents = {
  Figure,
  Gallery,
  Callout,
}

export function useMDXComponents(): MDXComponents {
  return components
}
