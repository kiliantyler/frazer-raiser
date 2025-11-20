import Image from 'next/image'
import { EmptyState } from './empty-state'

export function ImageGrid({
  images,
  emptyMessage = 'No photos yet',
}: {
  images: Array<{ _id: string; url: string }>
  emptyMessage?: string
}) {
  if (images.length === 0) {
    return <EmptyState message={emptyMessage} />
  }

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {images.map(image => (
        <div key={image._id} className="relative aspect-square overflow-hidden rounded-md bg-muted">
          <Image
            src={image.url}
            alt="Project photo"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </div>
      ))}
    </div>
  )
}
