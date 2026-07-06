import type { ReactElement } from 'react'

import { LoadingBar } from '@/components/ui/loading-bar'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Renders the app-level loading skeleton.
 *
 * @returns Loading page element.
 */
export default function Loading(): ReactElement {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <LoadingBar />
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10">
        <div className="grid gap-4">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-14 w-72" />
          <Skeleton className="h-12 w-full max-w-2xl" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map(item => (
            <Skeleton className="aspect-[4/3]" key={item} />
          ))}
        </div>
      </div>
    </main>
  )
}
