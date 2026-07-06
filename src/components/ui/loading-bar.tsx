'use client'

import type { ReactElement } from 'react'
import { useFormStatus } from 'react-dom'

import { cn } from '@/core/utils/class-name/class-name.utils'

type LoadingBarProps = {
  readonly active?: boolean
  readonly className?: string
}

/**
 * Renders a compact indeterminate loading bar.
 *
 * @param props - Loading bar props.
 * @returns Loading bar element.
 */
export function LoadingBar(props: LoadingBarProps): ReactElement {
  const { active = true, className } = props

  return (
    <div
      aria-hidden={!active}
      className={cn(
        'h-1 overflow-hidden bg-muted transition-opacity',
        active ? 'opacity-100' : 'opacity-0',
        className
      )}
      data-testid="loading-bar"
    >
      <div className="h-full w-1/3 animate-pulse bg-primary" />
    </div>
  )
}

/**
 * Renders a loading bar tied to the nearest form submission state.
 *
 * @returns Pending form loading bar.
 */
export function FormLoadingBar(): ReactElement {
  const { pending } = useFormStatus()

  return <LoadingBar active={pending} />
}
