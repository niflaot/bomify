'use client'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import type { ComponentProps, ReactElement } from 'react'

import { cn } from '@/core/utils/class-name/class-name.utils'

/**
 * Props for the shared shadcn dialog content component.
 */
export type DialogContentProps = ComponentProps<typeof DialogPrimitive.Content> & {
  readonly closeLabel?: string
  readonly showCloseButton?: boolean
}

/**
 * Renders the dialog root.
 *
 * @param props - Dialog root properties.
 * @returns Dialog root element.
 */
export function Dialog(props: ComponentProps<typeof DialogPrimitive.Root>): ReactElement {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

/**
 * Renders the dialog trigger.
 *
 * @param props - Dialog trigger properties.
 * @returns Dialog trigger element.
 */
export function DialogTrigger(
  props: ComponentProps<typeof DialogPrimitive.Trigger>
): ReactElement {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

/**
 * Renders the dialog close control.
 *
 * @param props - Dialog close properties.
 * @returns Dialog close element.
 */
export function DialogClose(
  props: ComponentProps<typeof DialogPrimitive.Close>
): ReactElement {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

/**
 * Renders the dialog portal.
 *
 * @param props - Dialog portal properties.
 * @returns Dialog portal element.
 */
export function DialogPortal(
  props: ComponentProps<typeof DialogPrimitive.Portal>
): ReactElement {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

/**
 * Renders the modal backdrop.
 *
 * @param props - Dialog overlay properties.
 * @returns Dialog overlay element.
 */
export function DialogOverlay(
  props: ComponentProps<typeof DialogPrimitive.Overlay>
): ReactElement {
  const { className, ...overlayProps } = props

  return (
    <DialogPrimitive.Overlay
      className={cn(
        'fixed inset-0 z-50 bg-background/80 backdrop-blur-sm',
        'data-[state=closed]:animate-out data-[state=open]:animate-in',
        className
      )}
      data-slot="dialog-overlay"
      {...overlayProps}
    />
  )
}

/**
 * Renders the dialog content panel.
 *
 * @param props - Dialog content properties.
 * @returns Dialog content element.
 */
export function DialogContent(props: DialogContentProps): ReactElement {
  const {
    children,
    className,
    closeLabel,
    showCloseButton = Boolean(closeLabel),
    ...contentProps
  } = props

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        className={cn(
          'fixed left-1/2 top-1/2 z-50 grid w-[calc(100%-2rem)] max-w-lg',
          '-translate-x-1/2 -translate-y-1/2 gap-5 border bg-background p-6 shadow-lg',
          'data-[state=closed]:animate-out data-[state=open]:animate-in',
          className
        )}
        data-slot="dialog-content"
        {...contentProps}
      >
        {children}
        {showCloseButton ? (
          <DialogPrimitive.Close
            className="absolute right-4 top-4 text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/30"
            data-slot="dialog-close"
          >
            <X aria-hidden="true" className="size-4" />
            {closeLabel ? <span className="sr-only">{closeLabel}</span> : null}
          </DialogPrimitive.Close>
        ) : null}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

/**
 * Renders the dialog header.
 *
 * @param props - Dialog header properties.
 * @returns Dialog header element.
 */
export function DialogHeader(props: ComponentProps<'div'>): ReactElement {
  const { className, ...headerProps } = props

  return (
    <div
      className={cn('grid gap-2 pr-6 text-left', className)}
      data-slot="dialog-header"
      {...headerProps}
    />
  )
}

/**
 * Renders the dialog title.
 *
 * @param props - Dialog title properties.
 * @returns Dialog title element.
 */
export function DialogTitle(
  props: ComponentProps<typeof DialogPrimitive.Title>
): ReactElement {
  const { className, ...titleProps } = props

  return (
    <DialogPrimitive.Title
      className={cn('text-lg font-semibold uppercase tracking-widest', className)}
      data-slot="dialog-title"
      {...titleProps}
    />
  )
}

/**
 * Renders the dialog description.
 *
 * @param props - Dialog description properties.
 * @returns Dialog description element.
 */
export function DialogDescription(
  props: ComponentProps<typeof DialogPrimitive.Description>
): ReactElement {
  const { className, ...descriptionProps } = props

  return (
    <DialogPrimitive.Description
      className={cn('text-sm leading-6 text-muted-foreground', className)}
      data-slot="dialog-description"
      {...descriptionProps}
    />
  )
}
