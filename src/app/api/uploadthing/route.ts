import { createRouteHandler } from 'uploadthing/next'
import { frazerFileRouter } from './core'

export const { GET, POST } = createRouteHandler({
  router: frazerFileRouter,
})
