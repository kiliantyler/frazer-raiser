export function TimelineDateMarker({ dateStr }: { dateStr: string }) {
  const [month, day, year] = dateStr.split(' ')

  return (
    <div className="pointer-events-none absolute left-1/2 top-0 hidden -translate-x-1/2 flex-col items-center md:flex">
      <div className="rounded-lg border border-border/50 bg-background/95 px-3 py-1.5 shadow-sm backdrop-blur-sm">
        <span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground">
          {month} {day}
        </span>
        <span className="block text-center text-[10px] text-muted-foreground">{year}</span>
      </div>
      <div className="relative mt-2">
        <div className="absolute inset-0 h-4 w-4 rounded-full bg-primary/20 blur-sm" />
        <div className="relative h-3 w-3 rounded-full bg-primary ring-4 ring-background shadow-sm" />
      </div>
    </div>
  )
}
