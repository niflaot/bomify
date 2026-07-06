import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps, ReactElement } from 'react'

import { cn } from '@/core/utils/class-name.utils'

/**
 * Badge visual variants.
 */
export const badgeVariants = cva(
  'inline-flex items-center border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-widest transition-colors',
  {
    defaultVariants: {
      variant: 'default'
    },
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        outline: 'text-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground'
      }
    }
  }
)

/**
 * Props for the shared shadcn badge component.
 */
export type BadgeProps = ComponentProps<'span'> & VariantProps<typeof badgeVariants>

/**
 * Renders a shadcn-style badge.
 *
 * @param props - Badge properties.
 * @returns Badge element.
 */
export function Badge(props: BadgeProps): ReactElement {
  const { className, variant, ...badgeProps } = props

  return (
    <span className={cn(badgeVariants({ className, variant }))} data-slot="badge" {...badgeProps} />
  )
}
