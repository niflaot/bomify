import type { ReactElement } from 'react'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { getProductById } from '@/core/services/product.service'
import type { ProductRecord } from '@/core/types/product.types'
import { ProductWorkspace } from '@/views/ProductWorkspace'
import type {
  ProductWorkspaceItem,
  ProductWorkspaceLabels
} from '@/views/ProductWorkspace'

type ProductWorkspacePageProps = {
  readonly params: Promise<{
    readonly productId: string
  }>
}

export const dynamic = 'force-dynamic'

function toWorkspaceItem(product: ProductRecord): ProductWorkspaceItem {
  return {
    description: product.description,
    id: product.id,
    name: product.name,
    photoUrl: product.photoUrl,
    updatedAt: product.updatedAt.toISOString()
  }
}

function getWorkspaceLabels(t: Awaited<ReturnType<typeof getTranslations>>): ProductWorkspaceLabels {
  return {
    calculate: t('calculate'),
    canvasEmptyDescription: t('canvasEmptyDescription'),
    canvasEmptyTitle: t('canvasEmptyTitle'),
    canvasLabel: t('canvasLabel'),
    combinations: t('combinations'),
    combinationsPanelDescription: t('combinationsPanelDescription'),
    export: t('export'),
    home: t('home'),
    materials: t('materials'),
    materialsPanelDescription: t('materialsPanelDescription'),
    pieces: t('pieces'),
    piecesPanelDescription: t('piecesPanelDescription'),
    product: t('product'),
    productPanelDescription: t('productPanelDescription'),
    save: t('save'),
    sidebarTitle: t('sidebarTitle'),
    stickers: t('stickers'),
    stickersPanelDescription: t('stickersPanelDescription'),
    updated: t('updated'),
    uploads: t('uploads'),
    uploadsPanelDescription: t('uploadsPanelDescription'),
    workspace: t('workspace')
  }
}

/**
 * Renders the product workspace route.
 *
 * @param props - Workspace route props.
 * @returns Product workspace page.
 */
export default async function ProductWorkspacePage(
  props: ProductWorkspacePageProps
): Promise<ReactElement> {
  const { productId } = await props.params
  const [t, product] = await Promise.all([
    getTranslations('productWorkspace'),
    getProductById(productId)
  ])

  if (!product) {
    notFound()
  }

  return <ProductWorkspace labels={getWorkspaceLabels(t)} product={toWorkspaceItem(product)} />
}
