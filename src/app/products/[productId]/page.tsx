import type { ReactElement } from 'react'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import {
  createProductCombinationAction,
  deleteProductCombinationAction,
  updateProductCombinationAction
} from '@/app/product-combinations.actions'
import {
  addProductMaterialAction,
  deleteProductMaterialAction,
  updateProductMaterialAction
} from '@/app/product-materials.actions'
import { listProductCombinations } from '@/core/services/product-combination.service'
import { listMaterials } from '@/core/services/material.service'
import { listProductMaterials } from '@/core/services/product-material.service'
import type { MaterialRecord, ProductMaterialRecord } from '@/core/types/material.types'
import { getProductById } from '@/core/services/product.service'
import type { ProductCombinationRecord } from '@/core/types/product-combination.types'
import type { ProductRecord } from '@/core/types/product.types'
import { ProductWorkspace } from '@/views/ProductWorkspace'
import type {
  ProductWorkspaceCombination,
  ProductWorkspaceItem,
  ProductWorkspaceLabels,
  ProductWorkspaceMaterial,
  ProductWorkspaceProductMaterial
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

function toWorkspaceMaterial(material: MaterialRecord): ProductWorkspaceMaterial {
  return {
    hexColor: material.hexColor,
    iconKey: material.iconKey,
    id: material.id,
    name: material.name,
    updatedAt: material.updatedAt.toISOString(),
    widthCm: material.widthCm
  }
}

function toWorkspaceProductMaterial(
  productMaterial: ProductMaterialRecord
): ProductWorkspaceProductMaterial {
  return {
    combinationId: productMaterial.combinationId,
    id: productMaterial.id,
    material: toWorkspaceMaterial(productMaterial.material),
    updatedAt: productMaterial.updatedAt.toISOString()
  }
}

function getWorkspaceLabels(t: Awaited<ReturnType<typeof getTranslations>>): ProductWorkspaceLabels {
  return {
    addCombination: t('addCombination'),
    addMaterial: t('addMaterial'),
    allCombinations: t('allCombinations'),
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
    deleteMaterial: t('deleteMaterial'),
    deleting: t('deleting'),
    editCombination: t('editCombination'),
    editMaterial: t('editMaterial'),
    export: t('export'),
    home: t('home'),
    createCatalogMaterial: t('createCatalogMaterial'),
    materials: t('materials'),
    materialCatalogEmptyDescription: t('materialCatalogEmptyDescription'),
    materialCatalogSearchLabel: t('materialCatalogSearchLabel'),
    materialCatalogSearchPlaceholder: t('materialCatalogSearchPlaceholder'),
    materialColorLabel: t('materialColorLabel'),
    materialDeleteDescription: t('materialDeleteDescription'),
    materialDeleteTitle: t('materialDeleteTitle'),
    materialEmptyDescription: t('materialEmptyDescription'),
    materialEmptyTitle: t('materialEmptyTitle'),
    materialIconLabel: t('materialIconLabel'),
    materialIconSearchLabel: t('materialIconSearchLabel'),
    materialIconSearchPlaceholder: t('materialIconSearchPlaceholder'),
    materialNameLabel: t('materialNameLabel'),
    materialNamePlaceholder: t('materialNamePlaceholder'),
    materialsPanelDescription: t('materialsPanelDescription'),
    materialScopeLabel: t('materialScopeLabel'),
    materialSelectLabel: t('materialSelectLabel'),
    materialWidthLabel: t('materialWidthLabel'),
    materialWidthPlaceholder: t('materialWidthPlaceholder'),
    newCatalogMaterial: t('newCatalogMaterial'),
    pieces: t('pieces'),
    piecesPanelDescription: t('piecesPanelDescription'),
    product: t('product'),
    productPanelDescription: t('productPanelDescription'),
    save: t('save'),
    saveCombination: t('saveCombination'),
    saveMaterial: t('saveMaterial'),
    saving: t('saving'),
    selectExistingMaterial: t('selectExistingMaterial'),
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
  const [t, product, combinations, catalogMaterials, productMaterials] = await Promise.all([
    getTranslations('productWorkspace'),
    getProductById(productId),
    listProductCombinations({ productId }),
    listMaterials(),
    listProductMaterials(productId)
  ])

  if (!product) {
    notFound()
  }

  return (
    <ProductWorkspace
      catalogMaterials={catalogMaterials.map(toWorkspaceMaterial)}
      combinationActions={{
        create: createProductCombinationAction,
        delete: deleteProductCombinationAction,
        update: updateProductCombinationAction
      }}
      combinations={combinations.map(toWorkspaceCombination)}
      labels={getWorkspaceLabels(t)}
      materialActions={{
        add: addProductMaterialAction,
        delete: deleteProductMaterialAction,
        update: updateProductMaterialAction
      }}
      product={toWorkspaceItem(product)}
      productMaterials={productMaterials.map(toWorkspaceProductMaterial)}
    />
  )
}
