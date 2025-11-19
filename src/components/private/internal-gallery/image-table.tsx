'use client'

import Image from 'next/image'
import { EmptyState } from '../empty-state'
import { DeleteImageDialog } from './delete-image-dialog'

export function ImageTable({
  images,
  emptyMessage = 'No images uploaded yet',
}: {
  images: Array<{ _id: string; url: string }>
  emptyMessage?: string
}) {
  if (images.length === 0) {
    return <EmptyState message={emptyMessage} />
  }

  return (
    <div className="rounded-md border">
      <table className="w-full">
        <thead className="border-b bg-muted/50">
          <tr>
            <th className="p-3 text-left text-sm font-medium">Preview</th>
            <th className="p-3 text-left text-sm font-medium">Image ID</th>
            <th className="p-3 text-right text-sm font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {images.map((image, index) => (
            <tr key={image._id} className={index === images.length - 1 ? '' : 'border-b'}>
              <td className="p-3">
                <div className="relative h-16 w-16 overflow-hidden rounded-md bg-muted">
                  <Image src={image.url} alt="Project photo" fill className="object-cover" sizes="64px" />
                </div>
              </td>
              <td className="p-3">
                <span className="font-mono text-sm text-muted-foreground">{image._id}</span>
              </td>
              <td className="p-3 text-right">
                <DeleteImageDialog imageId={image._id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
