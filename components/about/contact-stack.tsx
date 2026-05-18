// components/about/contact-stack.tsx
// Three vertically stacked contact links for /about > how to reach me.
// RSC; no icons; mono labels. Email subject is the locked Phase 5 string
// (Pitfall 5: %20 not +, per RFC 6068). GitHub handle canonicalized to
// `ophelia-xo` in Plan 07-03 (Phase 5 mis-canonicalized from `ophelia-x`
// → `olivelliott`; the real handle differs from the email local-part).
// LinkedIn handle confirmed `olivelliott` in Plan 07-03 (matches email).
// See UI-SPEC § Component Inventory § 4; satisfies CTC-02 + CTC-03 (second
// surface — the footer is the first).
const GITHUB_URL = 'https://github.com/ophelia-xo'
const EMAIL_URL = 'mailto:olivelliott48@gmail.com?subject=hi%20from%20olivelliott.dev'
const LINKEDIN_URL = 'https://www.linkedin.com/in/olivelliott'

const LINK_CLASS =
  'font-mono text-[var(--text-label)] font-medium tracking-[0.02em] lowercase ' +
  'text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)] ' +
  'focus-visible:text-[color:var(--color-text-primary)] py-3 inline-block'

export function ContactStack() {
  return (
    <ul role="list" className="flex flex-col gap-4">
      <li>
        <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
          github.com/ophelia-xo
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
