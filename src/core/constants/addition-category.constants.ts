import { Hammer, Package, Wrench } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import type { ProductAdditionCategory } from '@/core/types/product-addition.types'

/**
 * Canonical order used to group additions by category everywhere
 * (the Adiciones panel and the materials-list/tech-sheet PDFs).
 */
export const ADDITION_CATEGORIES: readonly ProductAdditionCategory[] = [
  'herrajes',
  'mano_obra',
  'varios'
]

/**
 * Icon shown for each addition category.
 */
export const ADDITION_CATEGORY_ICONS: Record<ProductAdditionCategory, LucideIcon> = {
  herrajes: Wrench,
  mano_obra: Hammer,
  varios: Package
}
