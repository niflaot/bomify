import type { ComponentProps, ReactElement } from 'react'

import { cn } from '@/core/utils/class-name.utils'

/**
 * Renders the shadcn card root.
 *
 * @param props - Card root properties.
 * @returns Card root element.
 */
export function Card(props: ComponentProps<'div'>): ReactElement {
  const { className, ...cardProps } = props

  return (
    <div
      className={cn('border border-border bg-card text-card-foreground shadow-sm', className)}
      data-slot="card"
      {...cardProps}
    />
  )
}

/**
 * Renders the shadcn card header.
 *
 * @param props - Card header properties.
 * @returns Card header element.
 */
export function CardHeader(props: ComponentProps<'div'>): ReactElement {
  const { className, ...headerProps } = props

  return (
    <div className={cn('grid gap-1.5 p-5', className)} data-slot="card-header" {...headerProps} />
  )
}

/**
 * Renders the shadcn card title.
 *
 * @param props - Card title properties.
 * @returns Card title element.
 */
export function CardTitle(props: ComponentProps<'h3'>): ReactElement {
  const { className, ...titleProps } = props

  return (
    <h3
      className={cn('text-lg font-semibold uppercase leading-none tracking-widest', className)}
      data-slot="card-title"
      {...titleProps}
    />
  )
}

/**
 * Renders the shadcn card description.
 *
 * @param props - Card description properties.
 * @returns Card description element.
 */
export function CardDescription(props: ComponentProps<'p'>): ReactElement {
  const { className, ...descriptionProps } = props

  return (
    <p
      className={cn('text-sm leading-6 text-muted-foreground', className)}
      data-slot="card-description"
      {...descriptionProps}
    />
  )
}

/**
 * Renders the shadcn card content area.
 *
 * @param props - Card content properties.
 * @returns Card content element.
 */
export function CardContent(props: ComponentProps<'div'>): ReactElement {
  const { className, ...contentProps } = props

  return <div className={cn('p-5 pt-0', className)} data-slot="card-content" {...contentProps} />
}
