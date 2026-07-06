import type { ComponentProps, ReactElement } from 'react'

import { cn } from '@/core/utils/class-name.utils'

/**
 * Props for the shared shadcn input component.
 */
export type InputProps = ComponentProps<'input'>

/**
 * Renders a shadcn-style input.
 *
 * @param props - Input properties.
 * @returns Input element.
 */
export function Input(props: InputProps): ReactElement {
  const { className, type = 'text', ...inputProps } = props

  return (
    <input
      className={cn(
        'flex h-10 w-full rounded-none border border-input bg-transparent px-3 py-2 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      data-slot="input"
      type={type}
      {...inputProps}
    />
  )
}
