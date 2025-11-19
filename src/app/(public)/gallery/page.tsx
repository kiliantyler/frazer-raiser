import { PublicGallery } from '@/components/public/gallery/public-gallery'

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

        <PublicGallery />
      </section>
    </main>
  )
}
