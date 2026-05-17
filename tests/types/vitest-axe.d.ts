// tests/types/vitest-axe.d.ts
// Module augmentation so vitest-axe matchers (toHaveNoViolations) typecheck.
// See https://github.com/chaance/vitest-axe README § TypeScript.
import 'vitest'
import type { AxeMatchers } from 'vitest-axe/matchers'

declare module 'vitest' {
  interface Assertion extends AxeMatchers {}
  interface AsymmetricMatchersContaining extends AxeMatchers {}
}
