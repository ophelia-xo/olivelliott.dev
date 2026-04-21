import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
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
