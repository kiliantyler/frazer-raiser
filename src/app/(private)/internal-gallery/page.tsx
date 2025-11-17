import { ImageUpload } from '@/components/private/internal-gallery/image-upload'
import { PageHeader } from '@/components/private/page-header'

export default function InternalGalleryPage() {
  return (
    <section className="space-y-6">
      <PageHeader title="Internal Gallery" />
      <ImageUpload />
    </section>
  )
}
