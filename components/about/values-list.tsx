// components/about/values-list.tsx
// 3-value definition list. RSC; locked copy from UI-SPEC § Copywriting
// Contract (Phase 5). Each <dt>/<dd> pair is wrapped in a <div className="contents">
// so the flex layout flattens the pair into the dl's flow — same pattern as
// Phase 3's resume-skills dl.
export function ValuesList() {
  return (
    <dl className="flex flex-col gap-4">
      <div className="contents">
        <dt className="text-[var(--text-body)] font-medium text-[color:var(--color-text-primary)]">polymath</dt>
        <dd className="text-[var(--text-body)] text-[color:var(--color-text-secondary)] mt-1">
          work moves across engineering, anthropology, and creative practice — no one of them is the whole picture.
        </dd>
      </div>
      <div className="contents">
        <dt className="text-[var(--text-body)] font-medium text-[color:var(--color-text-primary)]">autonomous workflows</dt>
        <dd className="text-[var(--text-body)] text-[color:var(--color-text-secondary)] mt-1">
          tools should do the obvious work so we can spend attention on the work that's actually ours.
        </dd>
      </div>
      <div className="contents">
        <dt className="text-[var(--text-body)] font-medium text-[color:var(--color-text-primary)]">open-source communities</dt>
        <dd className="text-[var(--text-body)] text-[color:var(--color-text-secondary)] mt-1">
          what gets built in the open belongs to everyone who builds on it.
        </dd>
      </div>
    </dl>
  )
}
