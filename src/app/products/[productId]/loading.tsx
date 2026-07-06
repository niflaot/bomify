import type { ReactElement } from 'react'

import { LoadingBar } from '@/components/ui/loading-bar'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Renders the product workspace loading skeleton.
 *
 * @returns Workspace loading element.
 */
export default function ProductWorkspaceLoading(): ReactElement {
  return (
    <main className="grid h-dvh grid-rows-[auto_auto_1fr] overflow-hidden bg-background text-foreground">
      <LoadingBar />
      <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-5">
        <div className="flex items-center gap-3">
          <Skeleton className="size-9" />
          <div className="grid gap-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-5 w-36" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-20" />
        </div>
      </header>
      <div className="grid min-h-0 grid-cols-[auto_1fr]">
        <aside className="flex min-h-0 bg-background">
          <div className="grid w-20 content-start border-r">
            {[0, 1, 2, 3, 4, 5].map(item => (
              <Skeleton className="h-[4.5rem] w-full border-b" key={item} />
            ))}
          </div>
          <div className="w-80 border-r">
            <div className="border-b p-4">
              <Skeleton className="h-3 w-36" />
            </div>
            <div className="grid gap-4 p-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </aside>
        <section className="min-h-0 overflow-auto bg-muted/60 p-6">
          <div className="grid min-h-full place-items-center">
            <Skeleton className="h-[min(72vh,760px)] w-[min(100%,1040px)]" />
          </div>
        </section>
      </div>
    </main>
  )
}
