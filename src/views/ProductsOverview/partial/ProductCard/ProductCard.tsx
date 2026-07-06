'use client'

import { ImageIcon, Pencil, Trash2 } from 'lucide-react'
import type { FormEvent, ReactElement } from 'react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

import type {
  DeleteProductAction,
  ProductOverviewItem,
  ProductsOverviewLabels
} from '../../products-overview.types'

type ProductCardProps = {
  readonly deleteAction: DeleteProductAction
  readonly labels: ProductsOverviewLabels
  readonly locale: string
  readonly product: ProductOverviewItem
}

function formatLabel(template: string, productName: string): string {
  return template.replace('{name}', productName)
}

function formatUpdatedAt(value: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value))
}

function confirmDelete(event: FormEvent<HTMLFormElement>, message: string): void {
  if (!window.confirm(message)) {
    event.preventDefault()
  }
}

/**
 * Renders one product overview card.
 *
 * @param props - Product card props.
 * @returns Product card element.
 */
export function ProductCard(props: ProductCardProps): ReactElement {
  const { deleteAction, labels, locale, product } = props
  const editLabel = formatLabel(labels.editProduct, product.name)
  const deleteLabel = formatLabel(labels.deleteProduct, product.name)
  const deleteConfirmation = formatLabel(labels.deleteProductConfirmation, product.name)

  return (
    <Card className="group overflow-hidden border-border/80 bg-card/95 transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/3] bg-muted">
        {product.photoUrl ? (
          // MinIO public hosts vary by environment, so this avoids a brittle next/image remote allowlist.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt={product.name}
            className="h-full w-full object-cover"
            loading="lazy"
            src={product.photoUrl}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <ImageIcon aria-hidden="true" className="size-10" />
          </div>
        )}

        <div className="absolute right-3 top-3 flex gap-2 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
          <Button aria-label={editLabel} size="icon" type="button" variant="outline">
            <Pencil aria-hidden="true" />
          </Button>
          <form
            action={deleteAction}
            onSubmit={event => {
              confirmDelete(event, deleteConfirmation)
            }}
          >
            <input name="productId" type="hidden" value={product.id} />
            <Button aria-label={deleteLabel} size="icon" type="submit" variant="destructive">
              <Trash2 aria-hidden="true" />
            </Button>
          </form>
        </div>
      </div>

      <CardHeader className="p-4 pb-2">
        <CardTitle className="truncate">{product.name}</CardTitle>
        <CardDescription className="line-clamp-2 min-h-10">
          {product.description || labels.noDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 text-sm text-muted-foreground">
        {labels.edited} {formatUpdatedAt(product.updatedAt, locale)}
      </CardContent>
    </Card>
  )
}
