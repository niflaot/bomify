'use client'

import * as SwitchPrimitive from '@radix-ui/react-switch'
import type { ComponentProps, ReactElement } from 'react'

import { cn } from '@/core/utils/class-name/class-name.utils'

/**
 * Renders a shadcn-style switch toggle.
 *
 * @param props - Switch properties.
 * @returns Switch element.
 */
export function Switch(props: ComponentProps<typeof SwitchPrimitive.Root>): ReactElement {
  const { className, ...switchProps } = props

  return (
    <SwitchPrimitive.Root
      className={cn(
        'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border',
        'border-input bg-input transition-colors outline-none',
        'focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'data-[state=checked]:bg-foreground data-[state=unchecked]:bg-input',
        className
      )}
      data-slot="switch"
      {...switchProps}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          'pointer-events-none block size-4 rounded-full bg-background shadow-sm',
          'transition-transform data-[state=checked]:translate-x-4',
          'data-[state=unchecked]:translate-x-0.5'
        )}
        data-slot="switch-thumb"
      />
    </SwitchPrimitive.Root>
  )
}
