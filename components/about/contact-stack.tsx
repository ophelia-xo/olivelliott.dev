// components/about/contact-stack.tsx
// Three vertically stacked contact links for /about > how to reach me.
// RSC; no icons; mono labels. Email subject is the locked Phase 5 string
// (Pitfall 5: %20 not +, per RFC 6068). LinkedIn handle is a PLACEHOLDER
// (RESEARCH § Open Q 2) — confirm with Olive before Phase 7.
// See UI-SPEC § Component Inventory § 4; satisfies CTC-02 + CTC-03 (second
// surface — the footer is the first).
const GITHUB_URL = 'https://github.com/olivelliott'
const EMAIL_URL = 'mailto:olivelliott48@gmail.com?subject=hi%20from%20olivelliott.dev'
// PLACEHOLDER: confirm LinkedIn handle with Olive — currently the Phase 1
// placeholder slug. Plan 05-05 / Phase 7 should resolve.
const LINKEDIN_URL = 'https://linkedin.com/in/olive-elliott'

const LINK_CLASS =
  'font-mono text-[var(--text-label)] font-medium tracking-[0.02em] lowercase ' +
  'text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)] ' +
  'focus-visible:text-[color:var(--color-text-primary)] py-3 inline-block'

export function ContactStack() {
  return (
    <ul role="list" className="flex flex-col gap-4">
      <li>
        <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
          github.com/olivelliott
        </a>
      </li>
      <li>
        <a href={EMAIL_URL} className={LINK_CLASS}>
          olivelliott48@gmail.com
        </a>
      </li>
      <li>
        <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
          {LINKEDIN_URL.replace(/^https?:\/\//, '')}
        </a>
      </li>
    </ul>
  )
}
