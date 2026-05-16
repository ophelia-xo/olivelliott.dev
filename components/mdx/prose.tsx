// components/mdx/prose.tsx
// RSC wrapper that opens the .prose typographic scope and applies the
// measure (~65ch). Used by app/(site)/projects/[slug]/page.tsx (Wave 2)
// around the dynamically-imported MDX body.
// Source: .planning/phases/03-project-detail-template/03-UI-SPEC.md § Component Inventory #4.

interface MDXProseProps {
  children: React.ReactNode
}

export function MDXProse({ children }: MDXProseProps) {
  return (
    <div className="prose mx-auto max-w-[65ch] mt-12 md:mt-16">
      {children}
    </div>
  )
}
