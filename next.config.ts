import type { NextConfig } from 'next'
import createMDX from '@next/mdx'

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: { remarkPlugins: [], rehypePlugins: [] },
})

const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  poweredByHeader: false,
  reactStrictMode: true,
}

export default withMDX(nextConfig)
