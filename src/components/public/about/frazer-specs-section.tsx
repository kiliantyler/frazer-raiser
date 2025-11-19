export function FrazerSpecsSection() {
  const specs = [
    {
      label: 'Engine',
      value: 'Continental 226.2 in³ flat-six',
    },
    {
      label: 'Power',
      value: 'Around 100 hp',
    },
    {
      label: 'Transmission',
      value: '3-speed manual with overdrive',
    },
    {
      label: 'Brakes',
      value: 'Hydraulic drum brakes',
    },
    {
      label: 'Dimensions',
      value: '~115" wheelbase, ~193" length',
    },
    {
      label: 'Weight',
      value: 'approx. 3,300 lb curb weight',
    },
  ]

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">1948 Frazer</p>
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
          Key specifications
        </p>
      </div>
      <dl className="grid gap-4 text-xs sm:grid-cols-2 md:grid-cols-3 sm:text-sm">
        {specs.map(spec => (
          <div key={spec.label}>
            <dt className="text-[0.7rem] font-semibold uppercase tracking-wide text-muted-foreground">{spec.label}</dt>
            <dd className="mt-1 text-foreground">{spec.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
