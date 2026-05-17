// components/about/about-bio.tsx
// 3-paragraph bio block for /about. RSC; hardcoded copy verbatim from
// UI-SPEC § Copywriting Contract (Phase 5). Names Aktiga (ABT-02) and anchors
// the autonomous-workflows / local-first / polymath thesis (ABT-01). If
// Phase 7 wants to source from content/about.ts, it's an additive refactor
// with no UI change.
export function AboutBio() {
  return (
    <div className="prose max-w-prose">
      <p className="text-[var(--text-body)] text-[color:var(--color-text-primary)] leading-[1.6]">
        I'm an engineer building tools that let people spend attention on the work that's actually theirs.
        My focus is on autonomous workflows, local-first systems, and the small details of tooling that
        compound into hours saved.
      </p>
      <p className="text-[var(--text-body)] text-[color:var(--color-text-primary)] leading-[1.6] mt-4">
        I'm currently at Aktiga, leading system architecture and AI-workflow design for internal tooling
        and developer platforms. I author and maintain the developer documentation (Starlight on Astro)
        and coordinate engineering priorities across the team.
      </p>
      <p className="text-[var(--text-body)] text-[color:var(--color-text-primary)] leading-[1.6] mt-4">
        Before software, I studied cultural anthropology and sustainable development at Appalachian State.
        That perspective shows up in how I think about the systems I build — who they're for, what they
        pull people toward, and whether they're something we want to live with at scale.
      </p>
    </div>
  )
}
