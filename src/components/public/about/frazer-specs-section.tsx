export function FrazerSpecsSection() {
  return (
    <section className="mt-2 space-y-4 rounded-2xl border border-border/60 bg-background/70 p-5 sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">1948 Frazer</p>
          <p className="mt-2 text-sm font-medium text-foreground">Key specifications</p>
        </div>
        <p className="text-xs text-muted-foreground sm:text-[0.7rem]">
          Approximate factory-era figures. This car is being kept close to stock in character.
        </p>
      </div>
      <dl className="grid gap-4 text-xs sm:grid-cols-2 md:grid-cols-3 sm:text-sm">
        <div>
          <dt className="text-[0.7rem] font-semibold uppercase tracking-wide text-muted-foreground">Engine</dt>
          <dd className="mt-1 text-foreground">Continental 226.2 cu in L-head inline-six</dd>
        </div>
        <div>
          <dt className="text-[0.7rem] font-semibold uppercase tracking-wide text-muted-foreground">Power</dt>
          <dd className="mt-1 text-foreground">Around 100 hp (slightly higher in later years)</dd>
        </div>
        <div>
          <dt className="text-[0.7rem] font-semibold uppercase tracking-wide text-muted-foreground">Transmission</dt>
          <dd className="mt-1 text-foreground">Borg-Warner 3-speed manual with overdrive</dd>
        </div>
        <div>
          <dt className="text-[0.7rem] font-semibold uppercase tracking-wide text-muted-foreground">Suspension</dt>
          <dd className="mt-1 text-foreground">Independent coils front, leaf springs rear</dd>
        </div>
        <div>
          <dt className="text-[0.7rem] font-semibold uppercase tracking-wide text-muted-foreground">Brakes</dt>
          <dd className="mt-1 text-foreground">Hydraulic drum brakes on all four wheels</dd>
        </div>
        <div>
          <dt className="text-[0.7rem] font-semibold uppercase tracking-wide text-muted-foreground">
            Dimensions &amp; weight
          </dt>
          <dd className="mt-1 text-foreground">
            ~115&quot; wheelbase, ~193&quot; overall length, approx. 3,386 lb curb weight
          </dd>
        </div>
      </dl>
    </section>
  )
}
