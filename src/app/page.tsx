import type { ReactElement } from 'react'
import { getLocale, getTranslations } from 'next-intl/server'

import { listProducts } from '@/core/services/product/product.service'
import type { ProductRecord } from '@/core/types/product.types'
import { ProductsOverview } from '@/views/ProductsOverview'
import type { ProductOverviewItem, ProductsOverviewLabels } from '@/views/ProductsOverview'

import { deleteProductAction } from './products.actions'

export const dynamic = 'force-dynamic'

type ProductsResult = {
  readonly loadError: boolean
  readonly products: readonly ProductRecord[]
}

function toProductOverviewItem(product: ProductRecord): ProductOverviewItem {
  return {
    description: product.description,
    id: product.id,
    name: product.name,
    photoUrl: product.photoUrl,
    updatedAt: product.updatedAt.toISOString()
  }
}

function getProductsOverviewLabels(t: Awaited<ReturnType<typeof getTranslations>>): ProductsOverviewLabels {
  return {
    deleteProduct: t.raw('deleteProduct') as string,
    deleteProductConfirmation: t.raw('deleteProductConfirmation') as string,
    edited: t('edited'),
    editProduct: t.raw('editProduct') as string,
    emptyDescription: t('emptyDescription'),
    emptyTitle: t('emptyTitle'),
    loadErrorDescription: t('loadErrorDescription'),
    loadErrorTitle: t('loadErrorTitle'),
    newProduct: t('newProduct'),
    noDescription: t('noDescription'),
    productsCount: t('productsCount'),
    recent: t('recent'),
    searchPlaceholder: t('searchPlaceholder'),
    subtitle: t('subtitle'),
    title: t('title')
  }
}

async function getProductsResult(): Promise<ProductsResult> {
  try {
    return {
      loadError: false,
      products: await listProducts()
    }
  } catch {
    return {
      loadError: true,
      products: []
    }
  }
}

/**
 * Renders the products overview home page.
 *
 * @returns The product grid page.
 */
export default async function Page(): Promise<ReactElement> {
  const [locale, t, result] = await Promise.all([
    getLocale(),
    getTranslations('home'),
    getProductsResult()
  ])

  return (
    <ProductsOverview
      deleteAction={deleteProductAction}
      labels={getProductsOverviewLabels(t)}
      loadError={result.loadError}
      locale={locale}
      products={result.products.map(toProductOverviewItem)}
    />
  )
}
