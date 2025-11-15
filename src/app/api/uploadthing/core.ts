import { getCurrentUserOrNull } from '@/lib/auth'
import { api } from '@convex/_generated/api'
import { fetchMutation } from 'convex/nextjs'
import { createUploadthing, type FileRouter } from 'uploadthing/next'

// Ensure Convex URL is available for server-side calls
if (typeof process !== 'undefined' && !process.env.NEXT_PUBLIC_CONVEX_URL && !process.env.CONVEX_DEPLOYMENT) {
  console.warn('[UploadThing] Warning: Convex URL not configured. Image records may not be created.')
}

const f = createUploadthing()

export const frazerFileRouter = {
  imageUploader: f({ image: { maxFileSize: '16MB', maxFileCount: 10 } })
    .middleware(async () => {
      try {
        const user = await getCurrentUserOrNull()
        if (!user) {
          // This route is only used from authenticated areas of the app.
          // If, for some reason, we don't have a user here, allow the upload
          // to succeed but skip linking the image to a user.
          return { workosUserId: 'anonymous' }
        }
        return { workosUserId: user.id }
      } catch (error) {
        // If auth lookup fails for any reason, do not break UploadThing middleware.
        console.error('[UploadThing] middleware error resolving user:', error)
        return { workosUserId: 'anonymous' }
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Create image record in Convex (non-blocking - don't fail upload if this fails)
      let imageId: string | undefined
      // Handle both ufsUrl and url properties from uploadthing file object
      const fileWithUrl = file as { ufsUrl?: string; url?: string; key: string; size: number; type?: string | null }
      const fileUrl = fileWithUrl.ufsUrl ?? fileWithUrl.url ?? ''
      try {
        imageId = await fetchMutation(api.images.createOnUpload, {
          utKey: fileWithUrl.key,
          url: fileUrl,
          width: 0,
          height: 0,
          size: fileWithUrl.size,
          mime: fileWithUrl.type ?? 'image/jpeg',
          uploaderWorkosUserId: metadata.workosUserId,
          visibility: 'private',
        })
        console.log('[UploadThing] Created image record with imageId:', imageId)
      } catch (error) {
        // Log error but don't fail the upload
        console.error('[UploadThing] Failed to create image record in Convex:', error)
        if (error instanceof Error) {
          console.error('[UploadThing] Error details:', {
            message: error.message,
            stack: error.stack,
          })
        }
      }
      // Always return success with the file URL
      // imageId will be included if Convex call succeeded
      const result: { url: string; imageId?: string } = { url: fileUrl }
      if (imageId) {
        result.imageId = imageId
        console.log('[UploadThing] Returning result with imageId:', imageId)
      } else {
        console.warn('[UploadThing] No imageId to return - Convex mutation may have failed')
      }
      return result
    }),
  // Simpler avatar uploader: no Convex or auth dependency, just return the file URL
  avatarUploader: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } }).onUploadComplete(async ({ file }) => {
    // UploadThing already validated the file and stored it; just return the URL
    return { avatarUrl: file.url }
  }),
} satisfies FileRouter

export type FrazerFileRouter = typeof frazerFileRouter
