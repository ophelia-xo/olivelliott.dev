// tests/stubs/server-only.ts
// Vitest alias target for Next.js's `server-only` package. The real package's
// index.js throws unconditionally at require-time — that IS the package. In a
// Next.js build the RSC plugin replaces it with a no-op; Vitest has no such
// plugin, so we alias the import here to this empty module.
export {}
