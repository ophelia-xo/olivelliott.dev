import type { NextConfig } from 'next'
import createMDX from '@next/mdx'

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {
    // Strings (not function refs) are required for Turbopack compatibility in Next 16.
    // Source: https://nextjs.org/docs/app/guides/mdx#using-plugins-with-turbopack
    // remark-frontmatter strips YAML `---` blocks from the MDX AST so they don't render as body text.
    // gray-matter (in lib/content.ts) handles frontmatter parsing out-of-band via fs.
    remarkPlugins: ['remark-frontmatter'],
    rehypePlugins: [],
  },
})

const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  poweredByHeader: false,
  reactStrictMode: true,
}

export default withMDX(nextConfig)
