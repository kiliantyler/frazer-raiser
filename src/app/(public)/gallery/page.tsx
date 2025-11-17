export default function PublicGalleryPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 pt-20 pb-12 sm:pt-24">
      <section aria-label="Photo gallery from the Frazer restoration">
        <div className="mb-10 text-center sm:mb-12">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground sm:text-xs">
            Photo gallery
          </p>
          <h1 className="mt-3 font-display text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Moments from the shop
          </h1>
          <p className="mt-3 mx-auto max-w-2xl text-sm text-pretty text-muted-foreground sm:text-base">
            A growing collection of in-progress photos, details, and before/after shots as the Frazer comes back to
            life.
          </p>
        </div>

        {/* Gallery grid will be wired up later; for now keep layout consistent with other public pages */}
        <div className="rounded-2xl border border-dashed border-border/60 bg-muted/10 px-6 py-10 text-center sm:px-10">
          <p className="text-sm text-muted-foreground sm:text-base">
            The gallery is still warming up. Once there are photos to share, they&apos;ll land here.
          </p>
        </div>
      </section>
    </main>
  )
}
