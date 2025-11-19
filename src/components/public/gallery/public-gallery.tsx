'use client'

import { api } from '@convex/_generated/api'
import { useQuery } from 'convex/react'
import { ImageIcon, Maximize2 } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

export function PublicGallery() {
  const images = useQuery(api.images.listPublic)
  const [index, setIndex] = useState(-1)

  if (images === undefined) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-4/3 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    )
  }

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/10 px-6 py-16 text-center sm:px-10">
        <div className="mb-4 rounded-full bg-muted p-3">
          <ImageIcon className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mb-1 text-lg font-semibold">No photos yet</h3>
        <p className="text-sm text-muted-foreground sm:text-base">
          The gallery is still warming up. Once there are photos to share, they&apos;ll land here.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {images.map((image, i) => (
          <button
            key={image._id}
            type="button"
            className="group relative w-full cursor-pointer overflow-hidden rounded-xl bg-muted border-0 p-0 aspect-4/3"
            onClick={() => setIndex(i)}>
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="rounded-full bg-background/90 p-2 text-foreground shadow-sm backdrop-blur-sm">
                <Maximize2 className="h-5 w-5" />
              </div>
            </div>
            <Image
              src={image.url}
              alt="Restoration photo"
              width={image.width}
              height={image.height}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </button>
        ))}
      </div>

      <Lightbox
        index={index}
        slides={images.map(image => ({ src: image.url, width: image.width, height: image.height }))}
        open={index >= 0}
        close={() => setIndex(-1)}
      />
    </>
  )
}
