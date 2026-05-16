// lib/hero-fallback.ts
// RSC-safe placeholder-hero detection by suffix pattern.
// Source: .planning/phases/03-project-detail-template/03-UI-SPEC.md § Hero Variants → Detection rule (locked).
// Used by <ProjectHero> (Wave 2) to choose Variant A (image-present) vs Variant B (text-only).
// No fs probe, no fetch — regex against project.hero.src is the entire detection.
export const isPlaceholderHero = (src: string): boolean =>
  /\/images\/projects\/[^/]+\/hero-placeholder\.(png|jpe?g|webp)$/i.test(src)
