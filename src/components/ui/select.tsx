'use client'

import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown } from 'lucide-react'
import type { ComponentProps, ReactElement } from 'react'

import { cn } from '@/core/utils/class-name/class-name.utils'

/**
 * Shared shadcn-style select root.
 */
export const Select = SelectPrimitive.Root

/**
 * Shared shadcn-style select group.
 */
export const SelectGroup = SelectPrimitive.Group

/**
 * Shared shadcn-style select value.
 */
export const SelectValue = SelectPrimitive.Value

/**
 * Renders a shadcn-style select trigger.
 *
 * @param props - Select trigger props.
 * @returns Select trigger element.
 */
export function SelectTrigger(
  props: ComponentProps<typeof SelectPrimitive.Trigger>
): ReactElement {
  const { children, className, ...triggerProps } = props

  return (
    <SelectPrimitive.Trigger
      className={cn(
        'flex h-10 w-full items-center justify-between gap-2 rounded-none border',
        'border-input bg-background px-3 py-2 text-sm transition-colors',
        'focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2',
        'focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50',
        'aria-invalid:border-destructive aria-invalid:ring-2',
        'aria-invalid:ring-destructive/20 [&>span]:truncate',
        className
      )}
      data-slot="select-trigger"
      {...triggerProps}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown aria-hidden="true" className="size-4 shrink-0 opacity-60" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

/**
 * Renders shadcn-style select content.
 *
 * @param props - Select content props.
 * @returns Select content element.
 */
export function SelectContent(
  props: ComponentProps<typeof SelectPrimitive.Content>
): ReactElement {
  const { children, className, position = 'popper', ...contentProps } = props

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        className={cn(
          'relative z-50 max-h-72 min-w-[8rem] overflow-hidden rounded-none',
          'border bg-popover text-popover-foreground shadow-md',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          position === 'popper' && 'data-[side=bottom]:translate-y-1',
          className
        )}
        data-slot="select-content"
        position={position}
        {...contentProps}
      >
        <SelectPrimitive.Viewport
          className={cn(
            'p-1',
            position === 'popper'
              && 'h-[var(--radix-select-trigger-height)] min-w-[var(--radix-select-trigger-width)]'
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

/**
 * Renders one shadcn-style select item.
 *
 * @param props - Select item props.
 * @returns Select item element.
 */
export function SelectItem(
  props: ComponentProps<typeof SelectPrimitive.Item>
): ReactElement {
  const { children, className, ...itemProps } = props

  return (
    <SelectPrimitive.Item
      className={cn(
        'relative flex w-full cursor-default select-none items-center rounded-none',
        'py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-muted',
        'focus:text-foreground data-[disabled]:pointer-events-none',
        'data-[disabled]:opacity-50',
        className
      )}
      data-slot="select-item"
      {...itemProps}
    >
      <span className="absolute left-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check aria-hidden="true" className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}
