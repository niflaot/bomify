import type { ComponentProps, ReactElement } from 'react'

import { cn } from '@/core/utils/class-name.utils'

/**
 * Renders a shadcn-style skeleton placeholder.
 *
 * @param props - Skeleton properties.
 * @returns Skeleton element.
 */
export function Skeleton(props: ComponentProps<'div'>): ReactElement {
  const { className, ...skeletonProps } = props

  return (
    <div
      className={cn('animate-pulse bg-muted', className)}
      data-slot="skeleton"
      {...skeletonProps}
    />
  )
}
