import { ImageTable } from '@/components/private/internal-gallery/image-table'
import { ImageUpload } from '@/components/private/internal-gallery/image-upload'
import { PageHeader } from '@/components/private/page-header'
import { getLatestImages } from '@/lib/data/dashboard'

export default async function InternalGalleryPage() {
  const images = await getLatestImages(100, 'private')

  return (
    <section className="space-y-6">
      <PageHeader title="Internal Gallery" />
      <ImageUpload />
      <div>
        <h2 className="mb-4 text-lg font-semibold">Uploaded Images</h2>
        <ImageTable images={images} emptyMessage="No images uploaded yet" />
      </div>
    </section>
  )
}
