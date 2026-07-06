'use client'

import { Plus, Search } from 'lucide-react'
import Link from 'next/link'
import type { ChangeEvent, ReactElement } from 'react'
import { useMemo, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { ProductCard } from './partial/ProductCard/ProductCard'
import type {
  DeleteProductAction,
  ProductOverviewItem,
  ProductsOverviewLabels
} from './products-overview.types'

type ProductsOverviewProps = {
  readonly deleteAction: DeleteProductAction
  readonly labels: ProductsOverviewLabels
  readonly loadError?: boolean
  readonly locale: string
  readonly products: readonly ProductOverviewItem[]
}

function matchesSearch(product: ProductOverviewItem, query: string): boolean {
  const normalizedQuery = query.trim().toLowerCase()

  if (!normalizedQuery) {
    return true
  }

  return [
    product.name,
    product.description ?? ''
  ].some(value => value.toLowerCase().includes(normalizedQuery))
}

/**
 * Renders the responsive products home overview.
 *
 * @param props - Products overview props.
 * @returns Products overview element.
 */
export function ProductsOverview(props: ProductsOverviewProps): ReactElement {
  const { deleteAction, labels, loadError = false, locale, products } = props
  const [query, setQuery] = useState('')
  const visibleProducts = useMemo(
    () => products.filter(product => matchesSearch(product, query)),
    [products, query]
  )
  const updateQuery = (event: ChangeEvent<HTMLInputElement>): void => {
    setQuery(event.target.value)
  }

  return (
    <main className="mx-auto grid w-full max-w-[1500px] gap-10 px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid gap-6 border-b pb-8 pt-4">
        <div className="grid gap-3">
          <Badge className="w-fit" variant="secondary">Bomify</Badge>
          <h1 className="text-4xl font-semibold uppercase tracking-widest text-foreground sm:text-5xl">
            {labels.title}
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            {labels.subtitle}
          </p>
        </div>

        <div className="relative w-full max-w-3xl">
          <Search
            aria-hidden="true"
            className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            aria-label={labels.searchPlaceholder}
            className="h-12 pl-12 text-base"
            onChange={updateQuery}
            placeholder={labels.searchPlaceholder}
            value={query}
          />
        </div>
      </section>

      <section className="grid gap-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="grid gap-1">
            <h2 className="text-2xl font-semibold uppercase tracking-widest">{labels.recent}</h2>
            <p className="text-sm text-muted-foreground">
              {visibleProducts.length} {labels.productsCount}
            </p>
          </div>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/products/new">
              <Plus aria-hidden="true" data-icon="inline-start" />
              {labels.newProduct}
            </Link>
          </Button>
        </div>

        {visibleProducts.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {visibleProducts.map(product => (
              <ProductCard
                deleteAction={deleteAction}
                key={product.id}
                labels={labels}
                locale={locale}
                product={product}
              />
            ))}
          </div>
        ) : loadError ? (
          <div className="rounded-lg border border-dashed bg-card/80 p-10 text-center">
            <h3 className="text-lg font-semibold">{labels.loadErrorTitle}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{labels.loadErrorDescription}</p>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed bg-card/80 p-10 text-center">
            <h3 className="text-lg font-semibold">{labels.emptyTitle}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{labels.emptyDescription}</p>
          </div>
        )}
      </section>
    </main>
  )
}
