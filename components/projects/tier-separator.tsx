// components/projects/tier-separator.tsx
// RSC. Hairline divider + mono lowercase label, marking a tier transition on
// /projects. The page composer passes both `label` ('hero' | 'secondary') and
// `id` (string used by the parent <section>'s aria-labelledby) — Pitfall 6
// lock: omitting `id` breaks the aria linkage, so the prop exists.
//
// The home page does NOT use this component (it uses two distinct section
// eyebrows: `selected work` + `more work` rendered inline by HomeProjectGrid).
// This is /projects-only.
//
// Pitfall 11 note: the chip labels in <TagFilterRow> come from TAG_LABELS[tag]
// and never include 'hero' or 'secondary' — those words are positional eyebrows
// only, never filterable tags. The two label systems are disjoint by design.
//
// Phase 6 Plan 06-03 (QAL-02): the label is rendered as <h2> (was <p>) so the
// heading order on /projects is h1 → h2 (tier) → h3 (card title). Previously
// the tier eyebrow was a <p>, which made the route jump h1 → h3 and tripped
// axe's `heading-order` rule. Visual styling is unchanged (mono + lowercase
// + tertiary color); only the element name changed.
interface TierSeparatorProps {
  label: 'hero' | 'secondary'
  id?: string
}

export function TierSeparator({ label, id }: TierSeparatorProps) {
  return (
    <div className="mt-12 md:mt-16 pt-6 md:pt-8 border-t border-[color:var(--color-hairline)]">
      <h2
        id={id}
        className="font-mono text-[var(--text-label)] font-medium tracking-[0.02em] lowercase text-[color:var(--color-text-tertiary)]"
      >
        {label}
      </h2>
    </div>
  )
}
