import path from 'node:path'
import { defineConfig } from 'vitest/config'

/**
 * Vitest-only shim for `.mdx` imports. The Phase 3 page route uses
 * `await import(\`@/content/projects/${slug}.mdx\`)` (Pitfall 11 + 12).
 * Vite cannot process `.mdx` files in the Vitest environment (no MDX
 * loader plugin), so any module that imports `.mdx` fails to load. This
 * plugin intercepts every `.mdx` resolve and serves a no-op default
 * component. Per-test `vi.doMock('@/content/projects/myco.mdx', ...)`
 * still overrides this default for targeted assertions.
 */
const mdxShimPlugin = () => ({
  name: 'vitest-mdx-shim',
  enforce: 'pre' as const,
  // Intercept .mdx files at the transform step so they bypass any
  // (missing) MDX loader plugin in the Vitest environment. Returning
  // a stub source here means Vite never tries to read or compile the
  // actual .mdx body.
  transform(_code: string, id: string) {
    if (id.endsWith('.mdx')) {
      return {
        code: 'export default function MDXShim() { return null; }',
        map: null,
      }
    }
    return null
  },
})

export default defineConfig({
  plugins: [mdxShimPlugin()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
      // Stub Next.js's `server-only` in the Vitest environment. The real
      // package throws at require-time (that is its entire API surface) so
      // any test importing a server-only module would fail to load. Next's
      // bundler plugins replace this in production builds; Vitest has no
      // such plugin, so we alias it to an empty local module here.
      'server-only': path.resolve(__dirname, 'tests/stubs/server-only.ts'),
    },
  },
})
