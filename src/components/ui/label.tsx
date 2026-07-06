import type { ComponentProps, ReactElement } from 'react'

import { cn } from '@/core/utils/class-name/class-name.utils'

/**
 * Props for the shared shadcn label component.
 */
export type LabelProps = ComponentProps<'label'>

/**
 * Renders a shadcn-style label.
 *
 * @param props - Label properties.
 * @returns Label element.
 */
export function Label(props: LabelProps): ReactElement {
  const { className, ...labelProps } = props

  return (
    <label
      className={cn('text-xs font-semibold uppercase tracking-widest text-foreground', className)}
      data-slot="label"
      {...labelProps}
    />
  )
}
