import type { Metadata } from 'next'
import type { ReactElement } from 'react'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import {
  createProductAdditionAction,
  deleteProductAdditionAction,
  updateProductAdditionAction
} from '@/app/product-additions.actions'
import {
  createProductCombinationAction,
  deleteProductCombinationAction,
  updateProductCombinationAction
} from '@/app/product-combinations.actions'
import {
  addProductMaterialAction,
  deleteProductMaterialAction,
  updateMaterialAction
} from '@/app/product-materials.actions'
import {
  createPieceAction,
  deletePieceAction,
  updatePieceAction
} from '@/app/product-pieces.actions'
import { listMaterials } from '@/core/services/material/material.service'
import { listPieces } from '@/core/services/piece/piece.service'
import { listProductAdditions } from '@/core/services/product-addition/product-addition.service'
import { listProductCombinations } from '@/core/services/product-combination/product-combination.service'
import { getProductById } from '@/core/services/product/product.service'
import { listProductMaterials } from '@/core/services/product-material/product-material.service'
import { ProductWorkspace } from '@/views/ProductWorkspace'
import { getWorkspaceLabels } from '@/views/ProductWorkspace/labels/product-workspace.labels'
import { toProductWorkspaceData } from '@/views/ProductWorkspace/mappers/product-workspace.mappers'

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
  const [t, product, combinations, catalogMaterials, productMaterials, pieces, additions] = await Promise.all([
    getTranslations('productWorkspace'),
    getProductById(productId),
    listProductCombinations({ productId }),
    listMaterials(),
    listProductMaterials(productId),
    listPieces({ productId }),
    listProductAdditions({ productId })
  ])

  if (!product) {
    notFound()
  }

  const workspaceData = toProductWorkspaceData({
    additions,
    catalogMaterials,
    combinations,
    pieces,
    product,
    productMaterials
  })

  return (
    <ProductWorkspace
      {...workspaceData}
      additionActions={{
        create: createProductAdditionAction,
        delete: deleteProductAdditionAction,
        update: updateProductAdditionAction
      }}
      combinationActions={{
        create: createProductCombinationAction,
        delete: deleteProductCombinationAction,
        update: updateProductCombinationAction
      }}
      labels={getWorkspaceLabels(t)}
      materialActions={{
        add: addProductMaterialAction,
        delete: deleteProductMaterialAction,
        edit: updateMaterialAction
      }}
      pieceActions={{
        create: createPieceAction,
        delete: deletePieceAction,
        update: updatePieceAction
      }}
    />
  )
}
