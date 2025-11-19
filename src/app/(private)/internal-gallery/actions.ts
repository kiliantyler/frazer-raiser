'use server'

import { api } from '@convex/_generated/api'
import type { Id } from '@convex/_generated/dataModel'
import { fetchMutation, fetchQuery } from 'convex/nextjs'
import { revalidatePath } from 'next/cache'
import { UTApi } from 'uploadthing/server'

const utapi = new UTApi()

export async function deleteImage(imageId: Id<'images'>) {
  try {
    // Get the image record to obtain the utKey
    const image = await fetchQuery(api.images.getById, { imageId })

    if (!image) {
      return { success: false, error: 'Image not found' }
    }

    // Delete from UploadThing using the utKey
    try {
      await utapi.deleteFiles([image.utKey])
    } catch (utError) {
      console.error('Failed to delete from UploadThing:', utError)
      // Continue with database deletion even if UploadThing deletion fails
    }

    // Delete from Convex database
    await fetchMutation(api.images.deleteById, { imageId })

    // Revalidate the page to show updated list
    revalidatePath('/internal-gallery')

    return { success: true }
  } catch (error) {
    console.error('Error deleting image:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
