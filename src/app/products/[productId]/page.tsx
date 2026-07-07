import type { Metadata } from 'next'
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
  deleteProductMaterialAction
} from '@/app/product-materials.actions'
import {
  createPieceAction,
  deletePieceAction,
  updatePieceAction
} from '@/app/product-pieces.actions'
import { listMaterials } from '@/core/services/material/material.service'
import { listPieces } from '@/core/services/piece/piece.service'
import { listProductCombinations } from '@/core/services/product-combination/product-combination.service'
import { getProductById } from '@/core/services/product/product.service'
import { listProductMaterials } from '@/core/services/product-material/product-material.service'
import { ProductWorkspace } from '@/views/ProductWorkspace'
import { getWorkspaceLabels } from '@/views/ProductWorkspace/product-workspace.labels'
import { toProductWorkspaceData } from '@/views/ProductWorkspace/product-workspace.mappers'

type ProductWorkspacePageProps = {
  readonly params: Promise<{
    readonly productId: string
  }>
}

export const dynamic = 'force-dynamic'

/**
 * Builds dynamic metadata for a product workspace.
 *
 * @param props - Workspace route props.
 * @returns Product workspace metadata.
 */
export async function generateMetadata(
  props: ProductWorkspacePageProps
): Promise<Metadata> {
  const { productId } = await props.params
  const product = await getProductById(productId)

  return {
    title: product ? `Bomify - ${product.name}` : 'Bomify'
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
  const [t, product, combinations, catalogMaterials, productMaterials, pieces] = await Promise.all([
    getTranslations('productWorkspace'),
    getProductById(productId),
    listProductCombinations({ productId }),
    listMaterials(),
    listProductMaterials(productId),
    listPieces({ productId })
  ])

  if (!product) {
    notFound()
  }

  const workspaceData = toProductWorkspaceData({
    catalogMaterials,
    combinations,
    pieces,
    product,
    productMaterials
  })

  return (
    <ProductWorkspace
      {...workspaceData}
      combinationActions={{
        create: createProductCombinationAction,
        delete: deleteProductCombinationAction,
        update: updateProductCombinationAction
      }}
      labels={getWorkspaceLabels(t)}
      materialActions={{
        add: addProductMaterialAction,
        delete: deleteProductMaterialAction
      }}
      pieceActions={{
        create: createPieceAction,
        delete: deletePieceAction,
        update: updatePieceAction
      }}
    />
  )
}
