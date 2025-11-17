import Image from 'next/image'

type TimelineHeroImageProps = {
  image: { url: string } | null
  alt: string
}

export function TimelineHeroImage({ image, alt }: TimelineHeroImageProps) {
  if (!image) return null

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/50 bg-muted/30 shadow-sm transition-all duration-500 group-hover:border-primary/30 group-hover:shadow-lg">
      <Image
        src={image.url}
        alt={alt}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 480px"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent" />
    </div>
  )
}
