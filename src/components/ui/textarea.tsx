import type { ComponentProps, ReactElement } from 'react'

import { cn } from '@/core/utils/class-name.utils'

/**
 * Props for the shared shadcn textarea component.
 */
export type TextareaProps = ComponentProps<'textarea'>

/**
 * Renders a shadcn-style textarea.
 *
 * @param props - Textarea properties.
 * @returns Textarea element.
 */
export function Textarea(props: TextareaProps): ReactElement {
  const { className, ...textareaProps } = props

  return (
    <textarea
      className={cn(
        'flex min-h-28 w-full rounded-none border border-input bg-transparent px-3 py-2 text-sm transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      data-slot="textarea"
      {...textareaProps}
    />
  )
}
