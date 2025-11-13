import { getCurrentUserOrNull } from '@/lib/auth'
import { api } from '@convex/_generated/api'
import { fetchMutation } from 'convex/nextjs'
import { createUploadthing, type FileRouter } from 'uploadthing/next'

const f = createUploadthing()

export const frazerFileRouter = {
  imageUploader: f({ image: { maxFileSize: '16MB', maxFileCount: 10 } })
    .middleware(async () => {
      const user = await getCurrentUserOrNull()
      if (!user) {
        throw new Error('Unauthorized')
      }
      return { workosUserId: user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await fetchMutation(api.images.createOnUpload, {
        utKey: file.key,
        url: file.url,
        width: 0,
        height: 0,
        size: 0,
        mime: 'image/jpeg',
        uploaderWorkosUserId: metadata.workosUserId,
        visibility: 'private',
      })
    }),
} satisfies FileRouter

export type FrazerFileRouter = typeof frazerFileRouter
