import type { NextConfig } from 'next'
import createMDX from '@next/mdx'

/** rehype-pretty-code options. Must be JSON-serializable for Turbopack.
 *  - theme: 'vesper' is bundled in shikijs/textmate-grammars-themes; string name is sufficient (no JSON import needed).
 *  - keepBackground: false — we paint --color-surface-2 ourselves via the .prose pre rule (Pitfall 3).
 *  - defaultLang: 'plaintext' — un-tagged code blocks still get tokenized for visual consistency.
 */
const rehypePrettyCodeOptions = {
  theme: 'vesper',
  keepBackground: false,
  defaultLang: 'plaintext',
}

/** rehype-autolink-headings options.
 *  - behavior: 'append' — anchor sits AFTER heading text (UI-SPEC Heading anchor; Pitfall 7 forbids 'wrap').
 *  - properties.className: ['anchor'] — styled in app/globals.css .prose .anchor.
 *  - content: <span aria-hidden="true">#</span> — decorative glyph; the wrapping <a> carries aria-label.
 */
const rehypeAutolinkHeadingsOptions = {
  behavior: 'append',
  properties: {
    className: ['anchor'],
    ariaLabel: 'Link to section',
  },
  content: {
    type: 'element',
    tagName: 'span',
    properties: { ariaHidden: 'true' },
    children: [{ type: 'text', value: '#' }],
  },
}

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {
    // Strings (not function refs) are required for Turbopack compatibility in Next 16.
    // Source: https://nextjs.org/docs/app/guides/mdx#using-plugins-with-turbopack
    // remark-frontmatter strips YAML `---` blocks from the MDX AST so they don't render as body text.
    // gray-matter (in lib/content.ts) handles frontmatter parsing out-of-band via fs.
    remarkPlugins: ['remark-frontmatter'],
    // Order MUST be slug → autolink → pretty-code (Pattern 4).
    rehypePlugins: [
      'rehype-slug',
      ['rehype-autolink-headings', rehypeAutolinkHeadingsOptions],
      ['rehype-pretty-code', rehypePrettyCodeOptions],
    ],
  },
})

const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  poweredByHeader: false,
  reactStrictMode: true,
}

export default withMDX(nextConfig)
