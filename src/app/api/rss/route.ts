import { escapeXml, formatRssDate } from '@/lib/utils/rss'
import { api } from '@convex/_generated/api'
import { fetchQuery } from 'convex/nextjs'
import { connection, NextResponse } from 'next/server'

export async function GET(request: Request) {
  await connection()

  const updates = await fetchQuery(api.updates.listPublicForRss, {})

  const baseUrl = new URL(request.url).origin
  const updatesUrl = `${baseUrl}/updates`

  // Limit to 50 most recent items for RSS feed
  const recentUpdates = updates.slice(0, 50)

  const rssItems = recentUpdates
    .map(update => {
      const updateUrl = `${baseUrl}/updates/${update.slug}`
      const pubDate = formatRssDate(update.publishedAt)
      // Use HTML content if available, otherwise escape plain text for CDATA
      const content = update.contentHtml || escapeXml(update.content)
      const description = escapeXml(update.content.slice(0, 200)) + (update.content.length > 200 ? '...' : '')

      return `    <item>
      <title>${escapeXml(update.title)}</title>
      <link>${updateUrl}</link>
      <guid isPermaLink="true">${updateUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <author>${escapeXml(update.authorName)}</author>
      <description>${description}</description>
      <content:encoded><![CDATA[${content}]]></content:encoded>
    </item>`
    })
    .join('\n')

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Frazer Raiser - Updates</title>
    <link>${updatesUrl}</link>
    <description>Progress notes, parts arrivals, small wins, and occasional setbacks as the Frazer slowly comes back to life.</description>
    <language>en-US</language>
    <lastBuildDate>${formatRssDate(Date.now())}</lastBuildDate>
    <ttl>60</ttl>
    <generator>Frazer Raiser</generator>
${rssItems}
  </channel>
</rss>`

  return new NextResponse(rssXml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
