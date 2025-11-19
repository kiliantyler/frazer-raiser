import { ArrowRight, Cog, Image as ImageIcon, Newspaper } from 'lucide-react'

import Link from 'next/link'

export function HomeFeatures() {
  return (
    <div className="w-full">
      <div className="mb-8 max-w-2xl">
        <p className="text-pretty text-muted-foreground">
          I&apos;m documenting every step. See the wins, the mistakes, and everything in between.
        </p>
      </div>
      <div className="space-y-2">
        <Link
          href="/updates"
          className="group flex items-center justify-between rounded-lg border border-border/40 bg-card/30 px-4 py-3 transition-colors hover:bg-primary/5 hover:border-primary/20">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded bg-primary/10 text-primary">
              <Newspaper className="size-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">Latest updates</div>
              <div className="text-xs text-muted-foreground">
                Progress notes, parts that showed up, and what&apos;s next.
              </div>
            </div>
          </div>
          <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
        </Link>
        <Link
          href="/gallery"
          className="group flex items-center justify-between rounded-lg border border-border/40 bg-card/30 px-4 py-3 transition-colors hover:bg-primary/5 hover:border-primary/20">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded bg-primary/10 text-primary">
              <ImageIcon className="size-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">Photo gallery</div>
              <div className="text-xs text-muted-foreground">Photos from the shop - before, during, and after.</div>
            </div>
          </div>
          <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
        </Link>
        <Link
          href="/about"
          className="group flex items-center justify-between rounded-lg border border-border/40 bg-card/30 px-4 py-3 transition-colors hover:bg-primary/5 hover:border-primary/20">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded bg-primary/10 text-primary">
              <Cog className="size-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">About the project</div>
              <div className="text-xs text-muted-foreground">
                Why this car, a bit of history, and how I&apos;m approaching the build.
              </div>
            </div>
          </div>
          <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
        </Link>
      </div>
    </div>
  )
}
