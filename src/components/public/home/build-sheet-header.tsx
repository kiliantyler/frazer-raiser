export function BuildSheetHeader() {
  return (
    <header className="flex items-center justify-between px-6 pb-4 pt-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground sm:text-xs">
      <span>Frazer build sheet</span>
      <span className="hidden items-center gap-2 sm:inline-flex">
        <span className="inline-flex size-1.5 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.35)]" />
        Live project
      </span>
    </header>
  )
}
