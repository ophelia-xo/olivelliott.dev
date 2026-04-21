import { Mail } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from './brand-icons'

// TODO: mobile nav menu in Phase 4

/**
 * Footer — Phase 1 minimal scaffold (UI-SPEC Component #7).
 *
 * Three slots: copyright / icons (GitHub, Email, LinkedIn) / view-source.
 * Icons never use accent color (UI-SPEC accent reserved-for list).
 * Each icon link has a 44x44 hit box via p-3 padding around a 20px glyph.
 * Mobile (< 640px) stacks to two rows.
 *
 * Placeholder handles: GitHub/LinkedIn URLs and view-source repo use the
 * ophelia-x GitHub username per UI-SPEC acknowledged placeholders; confirm
 * actual handles before Phase 7 launch.
 */
const GITHUB_URL = 'https://github.com/ophelia-x'
const EMAIL_URL = 'mailto:olivelliott48@gmail.com?subject=olivelliott.dev'
const LINKEDIN_URL = 'https://linkedin.com/in/olive-elliott'
const VIEW_SOURCE_URL = 'https://github.com/ophelia-x/portfolio'

export function Footer() {
  return (
    <footer className="border-t border-[color:var(--color-hairline)] mt-auto">
      <div className="mx-auto max-w-6xl px-6 md:px-8 lg:px-12 py-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[0.875rem] text-[color:var(--color-text-secondary)]">
          © 2026 Olive Elliott
        </p>
        <div className="flex items-center gap-4 sm:gap-6">
          <ul className="flex items-center gap-2">
            <li>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="inline-flex items-center justify-center p-3 text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)] focus-visible:text-[color:var(--color-text-primary)]"
              >
                <GithubIcon size={20} />
              </a>
            </li>
            <li>
              <a
                href={EMAIL_URL}
                aria-label="Email Olive"
                className="inline-flex items-center justify-center p-3 text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)] focus-visible:text-[color:var(--color-text-primary)]"
              >
                <Mail size={20} aria-hidden="true" />
              </a>
            </li>
            <li>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="inline-flex items-center justify-center p-3 text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)] focus-visible:text-[color:var(--color-text-primary)]"
              >
                <LinkedinIcon size={20} />
              </a>
            </li>
          </ul>
          <a
            href={VIEW_SOURCE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[0.875rem] tracking-[0.02em] lowercase text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-accent)] focus-visible:text-[color:var(--color-accent)]"
          >
            view source
          </a>
        </div>
      </div>
    </footer>
  )
}
