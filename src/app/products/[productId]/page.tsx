import type { ReactElement } from 'react'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import {
  createProductCombinationAction,
  deleteProductCombinationAction,
  updateProductCombinationAction
} from '@/app/product-combinations.actions'
import { listProductCombinations } from '@/core/services/product-combination.service'
import { getProductById } from '@/core/services/product.service'
import type { ProductCombinationRecord } from '@/core/types/product-combination.types'
import type { ProductRecord } from '@/core/types/product.types'
import { ProductWorkspace } from '@/views/ProductWorkspace'
import type {
  ProductWorkspaceCombination,
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

function toWorkspaceCombination(
  combination: ProductCombinationRecord
): ProductWorkspaceCombination {
  return {
    hexColor: combination.hexColor,
    id: combination.id,
    name: combination.name,
    updatedAt: combination.updatedAt.toISOString()
  }
}

function getWorkspaceLabels(t: Awaited<ReturnType<typeof getTranslations>>): ProductWorkspaceLabels {
  return {
    addCombination: t('addCombination'),
    calculate: t('calculate'),
    cancel: t('cancel'),
    canvasEmptyDescription: t('canvasEmptyDescription'),
    canvasEmptyTitle: t('canvasEmptyTitle'),
    canvasLabel: t('canvasLabel'),
    closeDialog: t('closeDialog'),
    combinationColorLabel: t('combinationColorLabel'),
    combinations: t('combinations'),
    combinationCreateTitle: t('combinationCreateTitle'),
    combinationDeleteDescription: t('combinationDeleteDescription'),
    combinationDeleteTitle: t('combinationDeleteTitle'),
    combinationEmptyDescription: t('combinationEmptyDescription'),
    combinationEmptyTitle: t('combinationEmptyTitle'),
    combinationNameLabel: t('combinationNameLabel'),
    combinationNamePlaceholder: t('combinationNamePlaceholder'),
    combinationsPanelDescription: t('combinationsPanelDescription'),
    createCombination: t('createCombination'),
    deleteCombination: t('deleteCombination'),
    deleting: t('deleting'),
    editCombination: t('editCombination'),
    export: t('export'),
    home: t('home'),
    materials: t('materials'),
    materialsPanelDescription: t('materialsPanelDescription'),
    pieces: t('pieces'),
    piecesPanelDescription: t('piecesPanelDescription'),
    product: t('product'),
    productPanelDescription: t('productPanelDescription'),
    save: t('save'),
    saveCombination: t('saveCombination'),
    saving: t('saving'),
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
  const [t, product, combinations] = await Promise.all([
    getTranslations('productWorkspace'),
    getProductById(productId),
    listProductCombinations({ productId })
  ])

  if (!product) {
    notFound()
  }

  return (
    <ProductWorkspace
      combinationActions={{
        create: createProductCombinationAction,
        delete: deleteProductCombinationAction,
        update: updateProductCombinationAction
      }}
      combinations={combinations.map(toWorkspaceCombination)}
      labels={getWorkspaceLabels(t)}
      product={toWorkspaceItem(product)}
    />
  )
}
