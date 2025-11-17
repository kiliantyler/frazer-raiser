import Image from 'next/image'

type UpdateHeroImageProps = {
  imageUrl: string
  alt: string
}

export function UpdateHeroImage({ imageUrl, alt }: UpdateHeroImageProps) {
  return (
    <div className="relative mb-8 aspect-video overflow-hidden rounded-lg">
      <Image
        src={imageUrl}
        alt={alt}
        fill
        className="h-full w-full object-cover"
        sizes="(max-width: 768px) 100vw, 800px"
        priority
      />
    </div>
  )
}
